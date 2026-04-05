"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Greška pri prijavi."); return; }
      router.push("/admin/dashboard");
    } catch {
      setError("Greška pri prijavi. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F5F2ED", fontFamily:"Inter,sans-serif" }}>
      <div style={{ background:"#fff", border:"1.5px solid #E4E0D9", borderRadius:20, padding:"2.5rem 2rem", width:"100%", maxWidth:380, boxShadow:"0 4px 24px rgba(0,0,0,.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"2rem" }}>
          <span style={{ width:40,height:40,borderRadius:10,background:"#E8602C",color:"#fff",fontWeight:900,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center" }}>JM</span>
          <div>
            <div style={{ fontWeight:800, fontSize:15, color:"#18181B" }}>Južni Merak</div>
            <div style={{ fontSize:11, color:"#A1A1AA" }}>Admin Panel</div>
          </div>
        </div>

        <h1 style={{ fontSize:22, fontWeight:900, letterSpacing:-1, color:"#18181B", marginBottom:".35rem" }}>Prijavite se</h1>
        <p style={{ fontSize:13, color:"#A1A1AA", marginBottom:"1.75rem" }}>Unesite vaše admin pristupne podatke.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:"1rem" }}>
            <label style={labelStyle}>Korisničko ime</label>
            <input style={inputStyle} type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" autoFocus />
          </div>
          <div style={{ marginBottom:"1.5rem" }}>
            <label style={labelStyle}>Lozinka</label>
            <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p style={{ fontSize:13, color:"#E8602C", marginBottom:"1rem", background:"#FFF0EA", padding:".6rem .9rem", borderRadius:8 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width:"100%", padding:".85rem", background:"#E8602C", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:14, cursor:"pointer", opacity: loading ? .7 : 1 }}>
            {loading ? "Prijava..." : "Prijavi se"}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display:"block", fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#A1A1AA", marginBottom:6 };
const inputStyle: React.CSSProperties = { width:"100%", padding:".75rem .9rem", border:"1.5px solid #E4E0D9", borderRadius:8, fontSize:14, color:"#18181B", fontFamily:"Inter,sans-serif", outline:"none", boxSizing:"border-box" };
