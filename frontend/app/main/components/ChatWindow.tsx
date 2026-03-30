"use client";

import { useState, useRef, useEffect } from "react";

type ChatWindowProps = {
  mode: "match" | "duel";
  onBack: () => void;
};

const MOCK_MESSAGES_MATCH = [
  { id: 1, from: "them" as const, text: "\u00a1Hola! \u00bfC\u00f3mo est\u00e1s hoy?", time: "09:01" },
  { id: 2, from: "me" as const, text: "\u00a1Muy bien, gracias! Estoy practicando mi espa\u00f1ol.", time: "09:02" },
  { id: 3, from: "them" as const, text: "\u00a1Qu\u00e9 bueno! Tu espa\u00f1ol es muy bueno para ser principiante.", time: "09:02" },
  { id: 4, from: "me" as const, text: "Gracias, eso es un cumplido muy amable.", time: "09:03" },
];

const MOCK_MESSAGES_DUEL = [
  { id: 1, from: "system" as const, text: "Duel Started! Topic: \"Describe your ideal vacation in Spanish. You have 5 minutes.\"", time: "09:00" },
  { id: 2, from: "them" as const, text: "Me gustar\u00eda ir a una playa tranquila donde pueda leer libros y nadar.", time: "09:01" },
  { id: 3, from: "me" as const, text: "Yo prefiero las monta\u00f1as. El aire fresco y los paisajes son incre\u00edbles.", time: "09:02" },
];

const formatTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

export default function ChatWindow({ mode, onBack }: ChatWindowProps) {
  const isDuel = mode === "duel";
  const initialMessages = isDuel ? MOCK_MESSAGES_DUEL : MOCK_MESSAGES_MATCH;

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const partnerName = isDuel ? "Rival_42" : "Local Speaker";
  const partnerInitial = isDuel ? "R" : "L";
  const partnerLang = isDuel ? "Spanish Learner" : "Native: Spanish";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const msg = { id: Date.now(), from: "me" as const, text, time: formatTime() };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    inputRef.current?.focus();

    setIsTyping(true);
    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      setIsTyping(false);
      const replies = isDuel
        ? [
            "Eso es muy interesante. Bien dicho!",
            "Estoy de acuerdo contigo. Las monta\u00f1as son hermosas.",
            "Yo tambi\u00e9n amo la naturaleza. Cu\u00e1l es tu lugar favorito?",
          ]
        : [
            "Qu\u00e9 interesante! Desde cu\u00e1ndo aprendes espa\u00f1ol?",
            "Tu pronunciaci\u00f3n debe ser muy buena.",
            "Tienes alguna pregunta sobre gram\u00e1tica?",
          ];
      const reply = {
        id: Date.now() + 1,
        from: "them" as const,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: formatTime(),
      };
      setMessages((prev) => [...prev, reply]);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <button onClick={onBack} className="chat-back-btn" type="button">
          &larr;
        </button>
        <div className="chat-partner-avatar">{partnerInitial}</div>
        <div className="chat-partner-info">
          <div className="chat-partner-name">{partnerName}</div>
          <div className="chat-partner-lang">{partnerLang}</div>
        </div>
        <span
          className={`chat-mode-badge ${isDuel ? "chat-mode-badge--duel" : "chat-mode-badge--match"}`}
        >
          {isDuel ? "Duel" : "Match"}
        </span>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => {
          if (msg.from === "system") {
            return (
              <div key={msg.id} className="chat-msg">
                <div className="chat-bubble chat-bubble--system">{msg.text}</div>
              </div>
            );
          }

          const isMe = msg.from === "me";
          return (
            <div key={msg.id}>
              <div className={`chat-msg ${isMe ? "chat-msg--me" : ""}`}>
                {!isMe && <div className="chat-msg-avatar">{partnerInitial}</div>}
                <div className={`chat-bubble ${isMe ? "chat-bubble--me" : "chat-bubble--them"}`}>
                  {msg.text}
                </div>
              </div>
              <div
                className="chat-msg-time"
                style={{ textAlign: isMe ? "right" : "left" }}
              >
                {msg.time}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-msg">
            <div className="chat-msg-avatar">{partnerInitial}</div>
            <div className="chat-typing-dots">
              <div className="chat-typing-dot" />
              <div className="chat-typing-dot" />
              <div className="chat-typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Grading notice */}
      <div className="chat-grading-notice">
        This conversation is being graded. Points awarded after the session ends.
      </div>

      {/* Input */}
      <div className="chat-input-bar">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          onKeyDown={handleKey}
          placeholder={isDuel ? "Write your response in Spanish..." : "Type a message in Spanish..."}
          className="chat-input"
          rows={1}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="chat-send-btn"
          type="button"
        >
          &uarr;
        </button>
      </div>
    </div>
  );
}
