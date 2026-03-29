"use client";
import { useEffect, useState } from "react";

interface Reservation { id:number; firstName:string; lastName:string; phone:string; date:string; time:string; guests:number; occasion:string|null; note:string|null; status:string; createdAt:string; }

const STATUS_OPTIONS = ["pending","confirmed","cancelled"];
const STATUS_LABEL: Record<string,[string,string]> = {
  pending:   ["#F59E0B","Na čekanju"],
  confirmed: ["#22C55E","Potvrđeno"],
  cancelled: ["#EF4444","Otkazano"],
};

export default function ReservationsAdmin() {
  const [res, setRes]         = useState<Reservation[]>([]);
  const [filter, setFilter]   = useState("all");
  const [selected, setSelected] = useState<Reservation|null>(null);

  const load = () => fetch("/api/reservations").then(r=>r.json()).then(d => { if(Array.isArray(d)) setRes(d); });
  useEffect(() => { load(); }, []);

  async function setStatus(id: number, status: string) {
    await fetch(`/api/reservations/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ status }) });
    await load();
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null);
  }

  async function remove(id: number) {
    if (!confirm("Obrisati rezervaciju?")) return;
    await fetch(`/api/reservations/${id}`, { method:"DELETE" });
    await load(); setSelected(null);
  }

  const visible = filter === "all" ? res : res.filter(r => r.status === filter);

  return (
    <div style={{ display:"flex", gap:"1.5rem", height:"calc(100vh - 4rem)" }}>
      {/* List */}
      <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
          <div><h1 style={h1}>Rezervacije</h1><p style={sub}>{res.length} ukupno</p></div>
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:"1rem" }}>
          {[["all","Sve"],["pending","Na čekanju"],["confirmed","Potvrđeno"],["cancelled","Otkazano"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ padding:".4rem .9rem", borderRadius:8, border:"1.5px solid", borderColor: filter===v ? "#E8602C" : "#E4E0D9", background: filter===v ? "#FFF0EA" : "#fff", color: filter===v ? "#E8602C" : "#52525B", fontWeight: filter===v ? 700 : 500, fontSize:12, cursor:"pointer" }}>
              {l} {v!=="all" && `(${res.filter(r=>r.status===v).length})`}
            </button>
          ))}
        </div>

        <div style={{ ...card, flex:1, overflow:"auto" }}>
          {visible.length === 0 && <p style={{ padding:"2rem", color:"#A1A1AA", fontSize:14, textAlign:"center" }}>Nema rezervacija.</p>}
          {visible.map(r => (
            <div key={r.id} onClick={() => setSelected(r)} style={{ padding:"1rem 1.25rem", borderBottom:"1px solid #F5F2ED", cursor:"pointer", background: selected?.id===r.id ? "#FFF8F5" : "#fff", transition:"background .1s" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:"#18181B" }}>{r.firstName} {r.lastName}</div>
                  <div style={{ fontSize:12, color:"#A1A1AA", marginTop:2 }}>{r.date} · {r.time} · {r.guests} gosta</div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ width:320, flexShrink:0 }}>
        {selected ? (
          <div style={{ ...card, padding:"1.5rem" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"1.25rem" }}>
              <div>
                <div style={{ fontWeight:800, fontSize:16, color:"#18181B" }}>{selected.firstName} {selected.lastName}</div>
                <div style={{ fontSize:12, color:"#A1A1AA", marginTop:2 }}>#{selected.id}</div>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            {[["📅","Datum & Vreme",`${selected.date} · ${selected.time}`],["👥","Gosti",String(selected.guests)],["📞","Telefon",selected.phone],["🎉","Povod",selected.occasion||"—"],["📝","Napomena",selected.note||"—"]].map(([ic,l,v]) => (
              <div key={l} style={{ marginBottom:".85rem" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#A1A1AA", marginBottom:3 }}>{ic} {l}</div>
                <div style={{ fontSize:13, color:"#18181B" }}>{v}</div>
              </div>
            ))}

            <hr style={{ border:"none", borderTop:"1px solid #E4E0D9", margin:"1rem 0" }} />

            <div style={{ marginBottom:".75rem" }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#A1A1AA", marginBottom:6 }}>Promjena statusa</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => setStatus(selected.id, s)} style={{ padding:".35rem .8rem", borderRadius:6, border:"none", cursor:"pointer", fontSize:11, fontWeight:600, background: selected.status===s ? `${STATUS_LABEL[s][0]}20` : "#F5F2ED", color: selected.status===s ? STATUS_LABEL[s][0] : "#52525B" }}>
                    {STATUS_LABEL[s][1]}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => remove(selected.id)} style={{ width:"100%", padding:".65rem", borderRadius:8, border:"1.5px solid #FEE2E2", background:"#FEF2F2", color:"#EF4444", fontWeight:600, fontSize:12, cursor:"pointer", marginTop:".5rem" }}>
              Obriši rezervaciju
            </button>
          </div>
        ) : (
          <div style={{ ...card, padding:"2rem", textAlign:"center" }}>
            <div style={{ fontSize:32, marginBottom:".75rem" }}>📋</div>
            <p style={{ color:"#A1A1AA", fontSize:13 }}>Odaberite rezervaciju za detalje.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const [color, label] = STATUS_LABEL[status] ?? ["#A1A1AA", status];
  return <span style={{ background:`${color}20`, color, padding:".2rem .65rem", borderRadius:999, fontWeight:600, fontSize:11, whiteSpace:"nowrap" }}>{label}</span>;
}

const h1: React.CSSProperties = { fontSize:24, fontWeight:900, letterSpacing:-1, color:"#18181B", marginBottom:".25rem" };
const sub: React.CSSProperties = { fontSize:13, color:"#A1A1AA" };
const card: React.CSSProperties = { background:"#fff", border:"1.5px solid #E4E0D9", borderRadius:16 };
