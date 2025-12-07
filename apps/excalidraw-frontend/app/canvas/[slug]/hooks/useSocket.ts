import { useEffect, useRef, useState, useCallback } from "react";
import { Shape } from "../types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 1000;

type SocketMessage =
  | { type: "shape"; shape: Shape; room_id: number }
  | { type: "delete_shape"; shape_id: string; room_id: number }
  | { type: "clear_canvas"; room_id: number }
  | { type: "user_joined"; user_id: string; room_id: number }
  | { type: "user_left"; user_id: string; room_id: number }
  | { type: "error"; message: string };

type UseSocketProps = {
  roomId: number;
  token: string;
  onShapeReceived: (shape: Shape) => void;
  onShapeDeleted: (shapeId: string) => void;
  onCanvasCleared: () => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
};

export const useSocket = ({
  roomId,
  token,
  onShapeReceived,
  onShapeDeleted,
  onCanvasCleared,
  onUserJoined,
  onUserLeft,
}: UseSocketProps) => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(() => Boolean(token && roomId));

  // Use refs for callbacks to prevent reconnection loops
  const callbacksRef = useRef({
    onShapeReceived,
    onShapeDeleted,
    onCanvasCleared,
    onUserJoined,
    onUserLeft,
  });

  // Update refs when callbacks change
  useEffect(() => {
    callbacksRef.current = {
      onShapeReceived,
      onShapeDeleted,
      onCanvasCleared,
      onUserJoined,
      onUserLeft,
    };
  }, [
    onShapeReceived,
    onShapeDeleted,
    onCanvasCleared,
    onUserJoined,
    onUserLeft,
  ]);

  useEffect(() => {
    if (!token || !roomId) return;

    const connect = () => {
      // Prevent multiple connections
      if (
        socketRef.current?.readyState === WebSocket.OPEN ||
        socketRef.current?.readyState === WebSocket.CONNECTING
      ) {
        return;
      }

      setIsLoading(true);
      const ws = new WebSocket(`${WS_URL}?token=${token}`);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setIsLoading(false);
        reconnectAttempts.current = 0;

        ws.send(JSON.stringify({ type: "join_room", room_id: roomId }));
      };

      ws.onmessage = (event) => {
        try {
          const data: SocketMessage = JSON.parse(event.data);
          const callbacks = callbacksRef.current;

          switch (data.type) {
            case "shape":
              if (data.room_id === roomId) {
                callbacks.onShapeReceived(data.shape);
              }
              break;
            case "delete_shape":
              if (data.room_id === roomId) {
                callbacks.onShapeDeleted(data.shape_id);
              }
              break;
            case "clear_canvas":
              if (data.room_id === roomId) {
                callbacks.onCanvasCleared();
              }
              break;
            case "user_joined":
              if (data.room_id === roomId && callbacks.onUserJoined) {
                callbacks.onUserJoined(data.user_id);
              }
              break;
            case "user_left":
              if (data.room_id === roomId && callbacks.onUserLeft) {
                callbacks.onUserLeft(data.user_id);
              }
              break;
            case "error":
              console.error("WebSocket server error:", data.message);
              break;
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket disconnected", event.code, event.reason);
        setIsConnected(false);
        socketRef.current = null;

        // Auto-reconnect with exponential backoff (only for unexpected closes)
        if (
          event.code !== 1000 &&
          reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS
        ) {
          const delay =
            INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current);
          console.log(
            `Reconnecting in ${delay}ms... (attempt ${reconnectAttempts.current + 1})`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        } else {
          setIsLoading(false);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({ type: "leave_room", room_id: roomId })
        );
        socketRef.current.close(1000, "Component unmounting");
      }
      socketRef.current = null;
    };
  }, [roomId, token]);

  const sendShape = useCallback(
    (shape: Shape) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({ type: "shape", room_id: roomId, shape })
        );
      }
    },
    [roomId]
  );

  const deleteShape = useCallback(
    (shapeId: string) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "delete_shape",
            room_id: roomId,
            shape_id: shapeId,
          })
        );
      }
    },
    [roomId]
  );

  const clearCanvas = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type: "clear_canvas", room_id: roomId })
      );
    }
  }, [roomId]);

  return {
    isConnected,
    isLoading,
    sendShape,
    deleteShape,
    clearCanvas,
  };
};
