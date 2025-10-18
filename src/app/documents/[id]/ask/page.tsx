"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation"; 
import { Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function DocumentChat() {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          document_id: id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Something went wrong" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Failed to fetch answer. Try again." },
      ]);
    }

    setLoading(false);
  };

  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-4 mt-12 space-y-4">
        {messages.length === 0 && !loading && (
          <p className="text-gray-400 text-center mt-10">
            Ask me anything about this document 👇
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg bg-gray-700 text-gray-400 flex items-center">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 border-t mb-24 border-gray-700 flex gap-3 bg-black">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your question..."
          className="flex-1 p-3 rounded-md border border-gray-700 bg-black focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-md font-bold flex items-center justify-center ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
