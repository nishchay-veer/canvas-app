import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_draw_app";

const wss = new WebSocketServer({ port: 8080 });

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  username?: string;
}

wss.on("connection", (ws: AuthenticatedWebSocket, req) => {
  try {
    // Extract token from query parameter
    const url = req.url;
    const params = new URLSearchParams(url ? url.split("?")[1] : "");
    const token = params.get("token");

    if (!token) {
      ws.send(JSON.stringify({ error: "No token provided" }));
      ws.close(1008, "No token provided");
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
    };

    // Attach user info to WebSocket
    ws.userId = decoded.id;
    ws.username = decoded.username;

    console.log(`User ${decoded.username} connected`);

    ws.on("message", (message: string) => {
      ws.send("pong");
    });

    ws.on("close", () => {
      console.log(`User ${ws.username} disconnected`);
    });
  } catch (error) {
    ws.send(JSON.stringify({ error: "Invalid or expired token" }));
    ws.close(1008, "Invalid token");
  }
});

console.log("WebSocket server is running on ws://localhost:8080");
