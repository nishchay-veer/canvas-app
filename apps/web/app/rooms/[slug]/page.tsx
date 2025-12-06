import ChatRoom from "../../../components/ChatRoom";

export default async function ChatRoomPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  return <ChatRoom slug={slug}></ChatRoom>;
}
