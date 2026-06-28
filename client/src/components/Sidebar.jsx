import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Shared.css";
import { FaPeopleArrows } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
const avatarColors = { default: "white" };



export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const links = [
    { id: "home",label: "Home" },
    { id: "chat", label: "Messages" },
    { id: "profile", label: "My Profile" },
  ];

  return (
    <div style={{ width: 220, background: "black", borderRight: "1px solid #1E293B", display: "flex", flexDirection: "column", padding: "20px 12px", flexShrink: 0, height: "100vh", position: "sticky", top: 0 }}>

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 6px", marginBottom: 32 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}><FaPeopleArrows /></div>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#F1F5F9" }}>Campus-Connect</span>
      </div>

    
      <nav style={{ flex: 1 }}>
        {links.map(link => (
          <button key={link.id}
            className={`sidebar-link ${activeTab === link.id ? "active" : ""}`}
            onClick={() => {
  setActiveTab(link.id);
  if (link.id === "home") navigate("/");
  if (link.id === "chat") navigate("/chat");
  if (link.id === "profile") navigate("/profile");
}}>
            <span style={{ fontSize: 18 }}>{link.icon}</span>
            <span>{link.label}</span>
          </button>
        ))}
      </nav>

      
      <div style={{ borderTop: "1px solid #1E293B", paddingTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "white", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ color: "#64748B", fontSize: 11 }}>Student</div>
          </div>
        </div>
        <button className="sidebar-link" onClick={handleLogout} style={{ color: "#EF4444" } }>
          <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><FaSignOutAlt size="1.2em" />  Sign Out</span>
        </button>
      </div>
    </div>
  );
}