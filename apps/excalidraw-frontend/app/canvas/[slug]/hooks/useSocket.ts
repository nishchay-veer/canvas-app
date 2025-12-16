import { useEffect, useState, useRef, useCallback } from "react";

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || "ws://localhost:8080";

export function useSocket(roomId: number | null) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const wsUrl = token ? `${WS_BASE_URL}?token=${token}` : WS_BASE_URL;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setSocket(ws);
      socketRef.current = ws;

      // Join the room
      ws.send(
        JSON.stringify({
          type: "join_room",
          room_id: roomId,
        })
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      setSocket(null);
      socketRef.current = null;
    };

    return () => {
      if (socketRef.current) {
        // Leave room before closing
        if (roomId) {
          socketRef.current.send(
            JSON.stringify({
              type: "leave_room",
              room_id: roomId,
            })
          );
        }
        socketRef.current.close();
      }
    };
  }, [roomId]);

  const sendMessage = useCallback(
    (message: object) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(message));
      }
    },
    []
  );

  return { socket, isConnected, sendMessage };
}

