"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [menuCount, setMenuCount] = useState(0);

  useEffect(() => {
    fetch("/api/menu").then(r => r.json()).then(d => { if (Array.isArray(d)) setMenuCount(d.length); });
  }, []);

  const stats = [
    { label: "Jela u meniju", value: menuCount, icon: "🍽️", color: "#6366F1" },
  ];

  return (
    <div>
      <h1 style={h1}>Dashboard</h1>
      <p style={{ color:"#A1A1AA", fontSize:14, marginBottom:"2rem" }}>Dobrodošli nazad. Evo pregleda restorana.</p>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1rem", marginBottom:"2.5rem" }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:"#fff", border:"1.5px solid #E4E0D9", borderRadius:16, padding:"1.25rem" }}>
            <div style={{ fontSize:24, marginBottom:".5rem" }}>{s.icon}</div>
            <div style={{ fontSize:28, fontWeight:900, letterSpacing:-1, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:"#A1A1AA", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const h1: React.CSSProperties = { fontSize:24, fontWeight:900, letterSpacing:-1, color:"#18181B", marginBottom:".25rem" };
