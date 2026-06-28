import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useSocket } from "../context/SocketContext";
import "../components/Shared.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("available");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { onlineUsers } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const endpoint = filter === "available" ? "/users" : "/users/all";
        const { data } = await api.get(endpoint);
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [filter]);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.location.toLowerCase().includes(search.toLowerCase()) ||
    u.canBring?.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ flex: 1, padding: 32, overflowY: "auto", height: "100vh" , background: "#0c0c0c"}}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Who's out there?</h1>
        <p style={{ color: "#64748B", fontSize: 15 }}>Find someone nearby who can bring what you need.</p>
      </div>

      
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}><FaSearch /></span>
          <input className="inp" style={{ paddingLeft: 40 }} placeholder="Search by name, location or item…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["available", "all"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "10px 18px", borderRadius: 10, border: "1.5px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                background: filter === f ? "white" : "transparent",
                borderColor: filter === f ? "white" : "#334155",
                color: filter === f ? "#0F172A" : "#94A3B8" }}>
              {f === "available" ? "Available" : " All"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Online now", value: onlineUsers.length, color: "white" },
          { label: "Available", value: users.filter(u => u.isAvailable).length, color: "white" },
          { label: "Total students", value: users.length, color: "white" },
        ].map(s => (
          <div key={s.label} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 14, padding: "14px 20px", flex: 1 ,justifyItems:"center"}}>
            <div style={{ color: s.color, fontSize: 28, fontWeight: 800 }}>{s.value}</div>
            <div style={{ color: "#64748B", fontSize: 18, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#64748B", padding: 60 }}>Loading students...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}><FaSearch /></div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No one found</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>Try a different search or filter</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filtered.map(user => {
            const isOnline = onlineUsers.includes(user._id);
            const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div key={user._id} className="user-card">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
                  
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: 700, fontSize: 16 }}>
                      {initials}
                    </div>
                    {user.isAvailable && (
                      <span style={{ position: "absolute", bottom: 1, right: 1, width: 13, height: 13, borderRadius: "50%", background: "green", border: "2px solid #1E293B", animation: "pulse 2s infinite" }} />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 15 }}>{user.name}</span>
                      {isOnline && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "white", display: "inline-block" }} />}
                    </div>
                    <div style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}> {user.email}</div>
                    <div style={{ color: "#8b96a5", fontSize: 12, marginTop: 2 }}><FaLocationDot /> {user.location || "Location not set"}</div>
                  </div>

                  <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 14, fontWeight: 600,
                    color: user.isAvailable ? "green" : "red",}}>
                    {user.isAvailable ? "Available" : "Busy"}
                  </span>
                </div>

                {user.statusMessage && (
                  <p style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.5, marginBottom: 12, fontStyle: "italic" }}>
                    "{user.statusMessage}"
                  </p>
                )}

                {user.canBring?.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ color: "#64748B", fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Can bring</div>
                    {user.canBring.map(item => <span key={item} className="tag">{item}</span>)}
                  </div>
                )}

                <button onClick={() => navigate(`/chat/${user._id}`)}
                  style={{ width: "100%", padding: 10, background: user.isAvailable ? "white" : "transparent",
                    border: "1.5px solid", borderColor: user.isAvailable ? "black" : "#334155",
                    borderRadius: 10, color: user.isAvailable ? "#0F172A" : "#94A3B8",
                    fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Send Message
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}