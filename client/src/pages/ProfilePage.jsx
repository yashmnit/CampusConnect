import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import "../components/Shared.css";
import { RxCross2 } from "react-icons/rx";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    location: user?.location || "",
    statusMessage: user?.statusMessage || "",
    isAvailable: user?.isAvailable || false,
    canBring: user?.canBring || [],
  });
  const [newItem, setNewItem] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.put("/users/profile", form);
      updateUser(data); // update in context + localStorage
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setForm(f => ({ ...f, canBring: [...f.canBring, newItem.trim()] }));
    setNewItem("");
  };

  const removeItem = (item) => {
    setForm(f => ({ ...f, canBring: f.canBring.filter(i => i !== item) }));
  };

  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
   <div style={{ flex: 1, padding: 32, overflowY: "auto", height: "100vh", background: "#0c0c0c" }}>
  <div style={{ maxWidth: 640 }}>
      <h1 style={{ color: "#F1F5F9", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>My Profile</h1>
      <p style={{ color: "#64748B", fontSize: 15, marginBottom: 32 }}>Set your location and what you can bring.</p>

      <div style={{ background: "#121111", borderRadius: 20, padding: 28, border: "1px solid #334155", marginBottom: 20 }}>

        
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: 700, fontSize: 22 }}>
            {initials}
          </div>
          <div>
            <div style={{ color: "#F1F5F9", fontSize: 18, fontWeight: 700 }}>{user?.name}</div>
            <div style={{ color: "#64748B", fontSize: 14 }}>{user?.email}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          <div>
            <label style={{ display: "block", color: "#94A3B8", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Full Name</label>
            <input className="inp" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label style={{ display: "block", color: "#94A3B8", fontSize: 13, fontWeight: 600, marginBottom: 6 }}> Current Location</label>
            <input className="inp" placeholder="e.g. Main Canteen, Library Block B…"
              value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>

          <div>
            <label style={{ display: "block", color: "#94A3B8", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Status Message</label>
            <input className="inp" placeholder="e.g. Heading to canteen in 10 mins!"
              value={form.statusMessage} onChange={e => setForm({ ...form, statusMessage: e.target.value })} />
          </div>

          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1E293B", border: "1.5px solid #334155", borderRadius: 12, padding: "14px 18px" }}>
            <div>
              <div style={{ color: "#F1F5F9", fontSize: 14, fontWeight: 600 }}>Available to Bring Items</div>
              <div style={{ color: "#64748B", fontSize: 12 }}>Turn on to appear in the home feed</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={form.isAvailable}
                onChange={e => setForm({ ...form, isAvailable: e.target.checked })} />
              <span className="slider" />
            </label>
          </div>

          
          <div>
            <label style={{ display: "block", color: "#94A3B8", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>What can you bring?</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              {form.canBring.length === 0 && <span style={{ color: "#475569", fontSize: 13 }}>No items added yet</span>}
              {form.canBring.map(item => (
                <span key={item} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "#1E293b", color: "white", borderRadius: 99, fontSize: 13, fontWeight: 600 }}>
                  {item}
                  <button onClick={() => removeItem(item)}
                    style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: 15, padding: 0, lineHeight: 1 }}><RxCross2 /></button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="inp" style={{ flex: 1 }} placeholder="e.g. Food, Stationery…"
                value={newItem} onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addItem()} />
              <button onClick={addItem}
                style={{ padding: "10px 18px", background: "white", border: "none", borderRadius: 10, color: "#0F172A", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
                + Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={loading}
        style={{ width: "100%", padding: 14, background: saved ? "green" : "white", border: "none", borderRadius: 12, color: "#0F172A", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "background 0.3s" }}>
        {loading ? "Saving..." : saved ? "Saved!" : "Save Profile"}
      </button>
    </div>
    </div>
  );
}



