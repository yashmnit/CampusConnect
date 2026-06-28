import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/Shared.css";
import { FaPeopleArrows } from "react-icons/fa";
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    try {
      await register(name, email, password);
      navigate("/");
    } catch {
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "black", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.5s ease" }}>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12,  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}><FaPeopleArrows /></div>
            <span style={{ fontSize: 26, fontWeight: 800, color: "#F1F5F9" }}>Campus-Connect</span>
          </div>
        </div>

        <div style={{ background: "black", borderRadius: 20, padding: 32, border: "1px solid #334155" }}>
          <h2 style={{ color: "#F1F5F9", fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Join the Community !</h2>

          {error && (
            <div style={{ background: "#3F0F0F", border: "1px solid #EF4444", color: "#EF4444", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: "#94A3B8", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Full Name</label>
            <input className="inp" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: "#94A3B8", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>College Email</label>
            <input className="inp" type="email" placeholder="you@college.edu" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", color: "#94A3B8", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
            <input className="inp" type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleRegister()} />
          </div>

          <button className="btn-primary" onClick={handleRegister} disabled={loading}>
            {loading
              ? <span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid #0F172A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              : "Create Account"}
          </button>

          <p style={{ textAlign: "center", color: "#64748B", fontSize: 14, marginTop: 20 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "white", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}