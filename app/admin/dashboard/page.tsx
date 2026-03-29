"use client";
import { useEffect, useState } from "react";

interface Reservation { id:number; firstName:string; lastName:string; date:string; time:string; guests:number; status:string; createdAt:string; }

export default function Dashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuCount, setMenuCount] = useState(0);

  useEffect(() => {
    fetch("/api/reservations").then(r => r.json()).then(d => { if (Array.isArray(d)) setReservations(d); });
    fetch("/api/menu").then(r => r.json()).then(d => { if (Array.isArray(d)) setMenuCount(d.length); });
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayRes = reservations.filter(r => r.date === today);
  const pending  = reservations.filter(r => r.status === "pending");

  const stats = [
    { label: "Rezervacije danas", value: todayRes.length, icon: "📅", color: "#E8602C" },
    { label: "Na čekanju",        value: pending.length,  icon: "⏳", color: "#F59E0B" },
    { label: "Ukupno rezervacija",value: reservations.length, icon: "📋", color: "#22C55E" },
    { label: "Jela u meniju",     value: menuCount,        icon: "🍽️", color: "#6366F1" },
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

      {/* Today's reservations */}
      <div style={card}>
        <h2 style={h2}>Današnje rezervacije</h2>
        {todayRes.length === 0
          ? <p style={{ color:"#A1A1AA", fontSize:14 }}>Nema rezervacija za danas.</p>
          : <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:"1.5px solid #E4E0D9" }}>
                  {["Gost","Vreme","Gosti","Status"].map(h => <th key={h} style={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {todayRes.map(r => (
                  <tr key={r.id} style={{ borderBottom:"1px solid #F5F2ED" }}>
                    <td style={td}>{r.firstName} {r.lastName}</td>
                    <td style={td}>{r.time}</td>
                    <td style={td}>{r.guests}</td>
                    <td style={td}><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>

      {/* Pending reservations */}
      {pending.length > 0 && (
        <div style={{ ...card, marginTop:"1rem" }}>
          <h2 style={h2}>⏳ Na čekanju ({pending.length})</h2>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1.5px solid #E4E0D9" }}>
                {["Gost","Datum","Vreme","Gosti"].map(h => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {pending.slice(0,5).map(r => (
                <tr key={r.id} style={{ borderBottom:"1px solid #F5F2ED" }}>
                  <td style={td}>{r.firstName} {r.lastName}</td>
                  <td style={td}>{r.date}</td>
                  <td style={td}>{r.time}</td>
                  <td style={td}>{r.guests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string,string]> = {
    pending:   ["#F59E0B","Na čekanju"],
    confirmed: ["#22C55E","Potvrđeno"],
    cancelled: ["#EF4444","Otkazano"],
  };
  const [color, label] = map[status] ?? ["#A1A1AA", status];
  return <span style={{ background:`${color}20`, color, padding:".2rem .6rem", borderRadius:999, fontWeight:600, fontSize:11 }}>{label}</span>;
}

const h1: React.CSSProperties = { fontSize:24, fontWeight:900, letterSpacing:-1, color:"#18181B", marginBottom:".25rem" };
const h2: React.CSSProperties = { fontSize:15, fontWeight:700, color:"#18181B", marginBottom:"1rem" };
const card: React.CSSProperties = { background:"#fff", border:"1.5px solid #E4E0D9", borderRadius:16, padding:"1.5rem" };
const th: React.CSSProperties = { textAlign:"left", padding:".6rem .75rem", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"#A1A1AA" };
const td: React.CSSProperties = { padding:".65rem .75rem", color:"#18181B" };
