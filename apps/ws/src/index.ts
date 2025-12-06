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
      return null;
    }

    if (!decoded || !decoded.id) {
      return null;
    }

    return decoded.id;
  } catch (e) {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const user_id = checkUser(token);

  if (user_id == null) {
    ws.close();
    return null;
  }

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
      parsedData = JSON.parse(data); // {type: "join-room", room_id: 1}
    }

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.room_ids.push(parsedData.room_id);
    }

    // {type: "leave_room", room_id: 1}
    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }
      user.room_ids = user.room_ids.filter((r) => r !== parsedData.room_id);
    }

    console.log("message received");
    console.log(parsedData);

    if (parsedData.type === "chat") {
      const room_id = parsedData.room_id;
      const message = parsedData.message;
      const current_time = new Date();

      //store chat in db
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
});
