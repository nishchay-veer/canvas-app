interface ChatMessageProps {
  message: string;
  isOwn?: boolean;
  timestamp?: string;
  sender?: string;
}

export default function ChatMessage({
  message,
  isOwn = false,
  timestamp,
  sender,
}: ChatMessageProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
          isOwn
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        }`}
      >
        {sender && !isOwn && (
          <p className="text-xs font-medium text-gray-500 mb-1">{sender}</p>
        )}
        <p className="text-sm leading-relaxed wrap-break-words">{message}</p>
        {timestamp && (
          <p
            className={`text-xs mt-1 ${
              isOwn ? "text-blue-100" : "text-gray-400"
            }`}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
