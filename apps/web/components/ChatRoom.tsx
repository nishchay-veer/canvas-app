import axios from "axios";
import { API_BASE_URL } from "../app/config";
import ChatRoomClient from "./ChatRoomClient";

async function getRoomId(slug: string) {
  const response = await axios.get(`${API_BASE_URL}/rooms/${slug}`);
  return response.data.room.id;
}

async function getChats({ roomSlug }: { roomSlug: string }) {
  const response = await axios.get(`${API_BASE_URL}/rooms/${roomSlug}/chats`);
  const data = await response.data;
  return data.chats;
}
export default async function ChatRoom({ slug }: { slug: string }) {
  const messages = await getChats({ roomSlug: slug });
  const id = await getRoomId(slug);
  return <ChatRoomClient id={id} messages={messages} />;
}
