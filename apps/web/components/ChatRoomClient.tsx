"use client";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import ChatMessage from "./ChatMessage";

interface Chat {
  id: string;
  message: string;
  user_id: string;
  room_id: string;
  created_at: string;
  user?: {
    name?: string;
  };
}

export default function ChatRoomClient({
  messages,
  id,
}: {
  messages: Chat[];
  id: string;
}) {
  const [chats, setChats] = useState<Chat[]>(messages);
  const inputRef = useRef<HTMLInputElement>(null);
  const { socket, loading } = useSocket();

  // Join the room when socket is ready
  useEffect(() => {
    if (loading || !socket) return;

    // Join the room
    socket.send(
      JSON.stringify({
        type: "join_room",
        room_id: id,
      })
    );

    // Leave room on cleanup
    return () => {
      socket.send(
        JSON.stringify({
          type: "leave_room",
          room_id: id,
        })
      );
    };
  }, [loading, socket, id]);

  // Listen for messages
  useEffect(() => {
    if (loading || !socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat" && data.room_id === id) {
        // Create a temporary Chat object from the received data
        const newChat: Chat = {
          id: data.id || Date.now().toString(),
          message: data.message,
          user_id: data.user_id || "",
          room_id: data.room_id,
          created_at: data.created_at || new Date().toISOString(),
          user: data.user,
        };
        setChats((prevChats) => [...prevChats, newChat]);
      }
    };
  }, [loading, socket, id]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chats.map((chat) => (
          <ChatMessage
            key={chat.id}
            message={chat.message}
            timestamp={chat.created_at}
            sender={chat.user?.name}
          />
        ))}
      </div>
      <div className="p-4 border-t">
        <input
          ref={inputRef}
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputRef.current && socket) {
              const message = inputRef.current.value;
              socket.send(
                JSON.stringify({
                  type: "chat",
                  room_id: id,
                  message,
                })
              );
              inputRef.current.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}
