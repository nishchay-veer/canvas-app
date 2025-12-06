import { useEffect, useState } from "react";
import { WS_BASE_URL } from "../app/config";
export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_BASE_URL);

    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { socket, loading };
}
