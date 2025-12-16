"use client";
import Canvas from "./components/Canvas";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_HTTP_URL || "http://localhost:3001";

export default function CanvasPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [roomId, setRoomId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoomId() {
      if (!slug) return;
      
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No authentication token found. Please sign in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/rooms/${slug}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setRoomId(response.data.room.id);
      } catch (error) {
        console.error("Error fetching room:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.error("Authentication failed. Please sign in again.");
            // Optionally redirect to sign in
            // window.location.href = "/signin";
          } else if (error.response?.status === 404) {
            console.error("Room not found");
          }
        }
        setRoomId(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRoomId();
  }, [slug]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!roomId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-4">
          Please sign in to access the canvas.
        </p>
        <a
          href="/signin"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sign In
        </a>
      </div>
    );
  }

  return <Canvas roomId={roomId} />;
}
