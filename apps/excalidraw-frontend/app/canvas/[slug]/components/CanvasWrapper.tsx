"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Canvas from "./Canvas";
import { Shape } from "../types";

const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_URL || "http://localhost:3001";

type CanvasWrapperProps = {
  slug: string;
};

type RoomData = {
  id: number;
  slug: string;
};

type DBShape = {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  points: { x: number; y: number }[] | null;
  text: string | null;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
};

export default function CanvasWrapper({ slug }: CanvasWrapperProps) {
  const [roomId, setRoomId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initialShapes, setInitialShapes] = useState<Shape[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Get token from localStorage
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          setError("Please sign in to access the canvas");
          setIsLoading(false);
          return;
        }
        setToken(storedToken);

        // Fetch room data
        const roomResponse = await axios.get<{ room: RoomData }>(
          `${HTTP_URL}/rooms/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!roomResponse.data.room) {
          setError("Room not found");
          setIsLoading(false);
          return;
        }

        setRoomId(roomResponse.data.room.id);

        // Fetch existing shapes
        const shapesResponse = await axios.get<{ shapes: DBShape[] }>(
          `${HTTP_URL}/rooms/${slug}/shapes`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        // Transform DB shapes to Canvas shapes
        const shapes: Shape[] = (shapesResponse.data.shapes || []).map(
          (dbShape) => ({
            id: dbShape.id,
            type: dbShape.type as Shape["type"],
            x: dbShape.x,
            y: dbShape.y,
            width: dbShape.width,
            height: dbShape.height,
            points: dbShape.points || undefined,
            text: dbShape.text || undefined,
            strokeColor: dbShape.strokeColor,
            fillColor: dbShape.fillColor,
            strokeWidth: dbShape.strokeWidth,
          })
        );

        setInitialShapes(shapes);
        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing canvas:", err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError("Please sign in to access the canvas");
          } else if (err.response?.status === 404) {
            setError("Room not found");
          } else {
            setError("Failed to load canvas. Please try again.");
          }
        } else {
          setError("An unexpected error occurred");
        }
        setIsLoading(false);
      }
    };

    init();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#6965DB] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading canvas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Canvas
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href="/signin"
            className="inline-block px-6 py-2 bg-[#6965DB] text-white rounded-lg hover:bg-[#5b57c9] transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (!roomId || !token) {
    return (
      <div className="h-screen w-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-gray-500">Initializing...</div>
      </div>
    );
  }

  return <Canvas roomId={roomId} token={token} initialShapes={initialShapes} />;
}
