import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/Shared.css";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      await login(email, password);
      navigate("/"); 
    } catch {
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "black", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.5s ease" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}><FaPeopleArrows />

</div>
            <span style={{ fontSize: 26, fontWeight: 800, color: "white" }}>Campus-Connect</span>
          </div>
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 8 }}>Find someone nearby to bring what you need !</p>
        </div>

        <div style={{ background: "light blue", borderRadius: 20, padding: 32, border: "1px solid #334155" }}>
          <h2 style={{ color: "white", fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Welcome back !</h2>

          {error && (
            <div style={{ background: "#3F0F0F", border: "1px solid #EF4444", color: "#EF4444", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: "#94A3B8", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>College Email</label>
            <input className="inp" type="email" placeholder="you@college.edu"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", color: "#94A3B8", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
            <input className="inp" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>

          <button className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading
              ? <span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid #0F172A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              : "Sign In"}
          </button>

          <p style={{ textAlign: "center", color: "#64748B", fontSize: 14, marginTop: 20 }}>
            New here?{" "}
            <Link to="/register" style={{ color: "white", fontWeight: 600 }}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}