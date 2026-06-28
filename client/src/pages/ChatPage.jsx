import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import "../components/Shared.css";
import { IoChatbubblesOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";


export default function ChatPage() {
  const { userId } = useParams(); 
  const { user: me } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  
useEffect(() => {
  api.get("/chat/conversations")
    .then(({ data }) => setConversations(data || []))
    .catch((err) => {
      console.error("Failed to load conversations:", err);
      setConversations([]); 
    });
}, []);
  useEffect(() => {
    if (!activeUser) return;
    api.get(`/chat/${activeUser._id}`).then(({ data }) => setMessages(data));
  }, [activeUser]);

  
useEffect(() => {
  if (!userId) return;  
  api.get(`/users/${userId}`)
    .then(({ data }) => setActiveUser(data))
    .catch(err => console.error("Could not load user:", err));
}, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message:receive", (msg) => {
      if (activeUser && (msg.sender._id === activeUser._id || msg.sender === activeUser._id)) {
        setMessages(prev => [...prev, msg]);
      }
    });

    socket.on("message:sent", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("typing:start", ({ senderId }) => {
      if (activeUser?._id === senderId) setIsTyping(true);
    });

    socket.on("typing:stop", ({ senderId }) => {
      if (activeUser?._id === senderId) setIsTyping(false);
    });

    return () => {
      socket.off("message:receive");
      socket.off("message:sent");
      socket.off("typing:start");
      socket.off("typing:stop");
    };
  }, [socket, activeUser]);

  const handleSend = () => {
    if (!input.trim() || !activeUser || !socket) return;

    socket.emit("message:send", {
      senderId: me._id,
      receiverId: activeUser._id,
      content: input,
    });

    socket.emit("typing:stop", { receiverId: activeUser._id });
    setInput("");
    clearTimeout(typingTimer.current);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socket || !activeUser) return;

    socket.emit("typing:start", { receiverId: activeUser._id });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit("typing:stop", { receiverId: activeUser._id });
    }, 1500);
  };

  const formatTime = (iso) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ flex: 1, display: "flex", height: "100vh", overflow: "hidden",background:"black" }}>

      
      <div style={{ width: 280, borderRight: "1px solid #1E293B", display: "flex", flexDirection: "column", background: "#0c0c0c" }}>
        <div style={{ padding: "24px 20px 16px" }}>
          <h2 style={{ color: "#F1F5F9", fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Messages</h2>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
          {conversations.length === 0 ? (
            <div style={{ textAlign: "center", color: "#475569", padding: 32, fontSize: 13 }}>
              No conversations yet.<br />Go to Home and message someone!
            </div>
          ) : (
            conversations.map(({ user: u, lastMessage }) => {
              const initials = u.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
              const isOnline = onlineUsers.includes(u._id);
              return (
                <button key={u._id}
                  onClick={() => { setActiveUser(u); navigate(`/chat/${u._id}`); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 12px", borderRadius: 12, border: "none", cursor: "pointer", textAlign: "left",
                    background: activeUser?._id === u._id ? "#1E293B" : "transparent" }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: 700, fontSize: 14 }}>
                      {initials}
                    </div>
                    {isOnline && <span style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "white", border: "2px solid #0F172A" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#F1F5F9", fontSize: 14, fontWeight: 600 }}>{u.name}</div>
                    <div style={{ color: "#64748B", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {lastMessage?.sender === me._id ? "You: " : ""}{lastMessage?.content}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      
      {activeUser ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Chat header */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: 14, background: "#0c0c0c" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: 700 }}>
              {activeUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div>
              <div style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 700 }}>{activeUser.name}</div>
              <div style={{ color: "#64748B", fontSize: 12 }}>
                {onlineUsers.includes(activeUser._id) ? "Online" : "Offline"} &nbsp; &nbsp;
               <FaLocationDot /> {activeUser.location ? `${ activeUser.location}` : ""}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.length === 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#475569", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}><IoChatbubblesOutline /></div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>No messages yet</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Say hi to {activeUser.name.split(" ")[0]}!</div>
              </div>
            )}

            {messages.map(msg => {
              const isMe = msg.sender === me._id || msg.sender?._id === me._id;
              return (
                <div key={msg._id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "65%", minWidth: 0 }}>
                        <div style={{
                            padding: "10px 14px", fontSize: 14, lineHeight: 1.5,
                            borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                            background: isMe ? "white" : "white",
                            color: isMe ? "#0F172A" : "#0F172A",
                            fontWeight: isMe ? 500 : 500,
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "pre-wrap",
                            }}>
                            {msg.content}
                            </div>
                    <div style={{ color: "#7c8591", fontSize: 10, marginTop: 3, textAlign: isMe ? "right" : "left" }}>
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: "#1E293B", borderRadius: "18px 18px 18px 4px", width: "fit-content" }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#64748B", display: "inline-block", animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "14px 24px", borderTop: "1px solid #1E293B", display: "flex", gap: 10, background: "#0c0c0c" }}>
            <input className="msg-input"
              placeholder={`Message ${activeUser.name.split(" ")[0]}…`}
              value={input}
              onChange={handleInputChange}
              onKeyDown={e => e.key === "Enter" && handleSend()} />
            <button onClick={handleSend}
              style={{ width: 44, height: 44, borderRadius: "50%", background: "white", border: "none", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              g
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#475569" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}><IoChatbubblesOutline /></div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#64748B" }}>Select a conversation</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>Or go to Home to find someone</div>
        </div>
      )}
    </div>
  );
}