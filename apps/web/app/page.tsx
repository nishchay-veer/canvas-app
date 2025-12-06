"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomSlug, setRoomSlug] = useState("");
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold underline">Enter Room Slug</h1>
      <input
        type="text"
        value={roomSlug}
        onChange={(e) => setRoomSlug(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 mt-4"
        placeholder="Room Slug"
      />
      <button
        onClick={() => {
          if (roomSlug.trim()) {
            router.push(`/rooms/${roomSlug.trim()}`);
          }
        }}
        className="bg-blue-500 text-white rounded px-4 py-2 ml-2 mt-4"
      >
        Join Room
      </button>
    </div>
  );
}
