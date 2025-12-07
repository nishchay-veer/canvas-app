import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

//state management for connected users
interface User {
  ws: WebSocket;
  room_ids: number[];
  user_id: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      console.log("Token verification failed: decoded is a string");
      return null;
    }

    if (!decoded || !decoded.id) {
      console.log("Token verification failed: no id in decoded token");
      return null;
    }

    return decoded.id;
  } catch (e) {
    console.log("Token verification error:", e);
    return null;
  }
}

// Broadcast to all users in a room except sender
function broadcastToRoom(
  room_id: number,
  message: object,
  excludeWs?: WebSocket
) {
  users.forEach((user) => {
    if (user.room_ids.includes(room_id) && user.ws !== excludeWs) {
      user.ws.send(JSON.stringify(message));
    }
  });
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    console.log("Connection rejected: No URL provided");
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const user_id = checkUser(token);

  if (user_id == null) {
    console.log("Connection rejected: Invalid token");
    ws.close();
    return null;
  }

  console.log(`User ${user_id} connected. Total users: ${users.length + 1}`);

  users.push({
    user_id,
    room_ids: [],
    ws,
  });

  ws.on("message", async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
    }

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      if (user) {
        user.room_ids.push(parsedData.room_id);
        console.log(
          `User ${user.user_id} joined room ${parsedData.room_id}. Users in room: ${users.filter((u) => u.room_ids.includes(parsedData.room_id)).length}`
        );
      }

      // Notify others that a user joined
      broadcastToRoom(
        parsedData.room_id,
        {
          type: "user_joined",
          user_id,
          room_id: parsedData.room_id,
        },
        ws
      );
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }
      user.room_ids = user.room_ids.filter((r) => r !== parsedData.room_id);

      // Notify others that a user left
      broadcastToRoom(parsedData.room_id, {
        type: "user_left",
        user_id,
        room_id: parsedData.room_id,
      });
    }

    console.log("message received");
    console.log(parsedData);

    // Handle new shape creation
    if (parsedData.type === "shape") {
      const room_id = parsedData.room_id;
      const shapeData = parsedData.shape;

      console.log("Creating shape:", { room_id, shapeData });

      try {
        // Store shape in database
        const shape = await prismaClient.shape.create({
          data: {
            id: shapeData.id,
            type: shapeData.type,
            x: shapeData.x,
            y: shapeData.y,
            width: shapeData.width,
            height: shapeData.height,
            points: shapeData.points || null,
            text: shapeData.text || null,
            strokeColor: shapeData.strokeColor,
            fillColor: shapeData.fillColor,
            strokeWidth: shapeData.strokeWidth,
            room_id,
            user_id,
          },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        });

        console.log("Shape created successfully:", shape.id);

        // Broadcast to all users in the room (including sender for confirmation)
        users.forEach((user) => {
          if (user.room_ids.includes(room_id)) {
            user.ws.send(
              JSON.stringify({
                type: "shape",
                shape: {
                  ...shape,
                  points: shape.points,
                },
                room_id,
              })
            );
          }
        });
      } catch (error) {
        console.error("Error saving shape:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: `Failed to save shape: ${error instanceof Error ? error.message : "Unknown error"}`,
          })
        );
      }
    }

    // Handle shape deletion
    if (parsedData.type === "delete_shape") {
      const room_id = parsedData.room_id;
      const shape_id = parsedData.shape_id;

      try {
        await prismaClient.shape.delete({
          where: { id: shape_id },
        });

        // Broadcast deletion to all users in the room
        users.forEach((user) => {
          if (user.room_ids.includes(room_id)) {
            user.ws.send(
              JSON.stringify({
                type: "delete_shape",
                shape_id,
                room_id,
              })
            );
          }
        });
      } catch (error) {
        console.error("Error deleting shape:", error);
      }
    }

    // Handle clear canvas
    if (parsedData.type === "clear_canvas") {
      const room_id = parsedData.room_id;

      try {
        await prismaClient.shape.deleteMany({
          where: { room_id },
        });

        // Broadcast clear to all users in the room
        users.forEach((user) => {
          if (user.room_ids.includes(room_id)) {
            user.ws.send(
              JSON.stringify({
                type: "clear_canvas",
                room_id,
              })
            );
          }
        });
      } catch (error) {
        console.error("Error clearing canvas:", error);
      }
    }

    // Handle chat messages
    if (parsedData.type === "chat") {
      const room_id = parsedData.room_id;
      const message = parsedData.message;
      const current_time = new Date();

      const chat = await prismaClient.chat.create({
        data: {
          message,
          room_id,
          user_id,
          created_at: current_time,
        },
        include: {
          user: {
            select: { name: true },
          },
        },
      });

      users.forEach((user) => {
        if (user.room_ids.includes(room_id)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              room_id,
              user: chat.user,
            })
          );
        }
      });
    }
  });

  // Handle disconnect
  ws.on("close", () => {
    const userIndex = users.findIndex((u) => u.ws === ws);
    if (userIndex !== -1) {
      const user = users[userIndex];
      if (user) {
        // Notify all rooms that user left
        user.room_ids.forEach((room_id) => {
          broadcastToRoom(room_id, {
            type: "user_left",
            user_id: user.user_id,
            room_id,
          });
        });
      }
      users.splice(userIndex, 1);
    }
  });
});
