"use client";
import { useEffect, useState } from "react";

interface DailyMenu { id:number; date:string; items:string; price:string|null; note:string|null; published:boolean; }

function getWeekDates() {
  const today = new Date();
  const mon = new Date(today);
  mon.setDate(today.getDate() - today.getDay() + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

const DAY_NAMES = ["Ponedeljak","Utorak","Sreda","Četvrtak","Petak","Subota","Nedelja"];

export default function DailyMenuAdmin() {
  const [menus, setMenus]     = useState<Record<string, DailyMenu>>({});
  const [week, setWeek]       = useState<string[]>(getWeekDates());
  const [editing, setEditing] = useState<string|null>(null);
  const [form, setForm]       = useState({ items:["","","",""], price:"", note:"", published:false });
  const [saving, setSaving]   = useState(false);

  const load = () => fetch("/api/daily-menu").then(r=>r.json()).then((d: DailyMenu[]) => {
    if (!Array.isArray(d)) return;
    const map: Record<string, DailyMenu> = {};
    d.forEach(m => { map[m.date] = m; });
    setMenus(map);
  });
  useEffect(() => { load(); }, []);

  function openEdit(date: string) {
    const m = menus[date];
    if (m) {
      const parsed = JSON.parse(m.items) as string[];
      const padded = [...parsed, "", "", "", ""].slice(0, 4);
      setForm({ items: padded, price: m.price ?? "", note: m.note ?? "", published: m.published });
    } else {
      setForm({ items: ["", "", "", ""], price: "", note: "", published: false });
    }
    setEditing(date);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const items = form.items.filter(i => i.trim() !== "");
    const m = menus[editing];
    if (m) {
      await fetch(`/api/daily-menu/${m.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ items, price: form.price||null, note: form.note||null, published: form.published }) });
    } else {
      await fetch("/api/daily-menu", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ date: editing, items, price: form.price||null, note: form.note||null, published: form.published }) });
    }
    await load(); setSaving(false); setEditing(null);
  }

  function prevWeek() {
    setWeek(w => w.map(d => { const dt = new Date(d); dt.setDate(dt.getDate()-7); return dt.toISOString().split("T")[0]; }));
  }
  function nextWeek() {
    setWeek(w => w.map(d => { const dt = new Date(d); dt.setDate(dt.getDate()+7); return dt.toISOString().split("T")[0]; }));
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h1 style={h1}>Dnevni Menü</h1>
      <p style={sub}>Kreirajte i upravljajte dnevnim ponudama po danima.</p>

      {/* Week nav */}
      <div style={{ display:"flex", alignItems:"center", gap:12, margin:"1.5rem 0 1rem" }}>
        <button onClick={prevWeek} style={navBtn}>← Prethodna</button>
        <span style={{ fontSize:13, fontWeight:600, color:"#52525B" }}>
          {week[0]} – {week[6]}
        </span>
        <button onClick={nextWeek} style={navBtn}>Sljedeća →</button>
        <button onClick={() => setWeek(getWeekDates())} style={{ ...navBtn, marginLeft:"auto", color:"#E8602C", borderColor:"#E8602C" }}>Ova sedmica</button>
      </div>

      {/* Week grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"0.65rem" }}>
        {week.map((date, i) => {
          const m = menus[date];
          const items = m ? JSON.parse(m.items) as string[] : [];
          const isToday = date === today;
          return (
            <div key={date} style={{ background:"#fff", border:`1.5px solid ${isToday ? "#E8602C" : "#E4E0D9"}`, borderRadius:14, padding:"1rem", minHeight:160, display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color: isToday ? "#E8602C" : "#A1A1AA", textTransform:"uppercase", letterSpacing:1 }}>{DAY_NAMES[i]}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#18181B" }}>{date.slice(5)}</div>
                </div>
                {m?.published && <span style={{ fontSize:10, fontWeight:700, color:"#22C55E", background:"#22C55E20", padding:".15rem .5rem", borderRadius:999 }}>Live</span>}
              </div>

              <div style={{ flex:1 }}>
                {items.length > 0
                  ? items.map((item: string, j: number) => (
                      <div key={j} style={{ fontSize:11, color:"#52525B", padding:".2rem 0", borderBottom:"1px dashed #F5F2ED" }}>{item}</div>
                    ))
                  : <div style={{ fontSize:11, color:"#D4D0C8", fontStyle:"italic" }}>Nije postavljen</div>
                }
              </div>

              {m?.price && <div style={{ fontSize:11, fontWeight:700, color:"#E8602C" }}>{m.price}</div>}

              <button onClick={() => openEdit(date)} style={{ width:"100%", padding:".4rem", borderRadius:7, border:"1.5px solid #E4E0D9", background:"#F5F2ED", color:"#52525B", fontSize:11, fontWeight:600, cursor:"pointer" }}>
                {m ? "Uredi" : "+ Dodaj"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      {editing && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", borderRadius:20, padding:"2rem", width:"100%", maxWidth:440, boxShadow:"0 24px 64px rgba(0,0,0,.2)" }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#18181B", marginBottom:.25 }}>Dnevni menü</h2>
            <p style={{ fontSize:13, color:"#A1A1AA", marginBottom:"1.5rem" }}>{editing} · {DAY_NAMES[week.indexOf(editing)]}</p>

            {form.items.map((item, i) => (
              <div key={i} style={{ marginBottom:".75rem" }}>
                <label style={labelStyle}>Jelo {i+1}</label>
                <input value={item} onChange={e => setForm(f => { const it = [...f.items]; it[i] = e.target.value; return { ...f, items:it }; })} style={inputStyle} placeholder={i===0?"Npr. Pileća čorba":i===1?"Npr. Ćevapi sa prilogom":i===2?"Npr. Gulaš":"Opciono..."} />
              </div>
            ))}

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", marginBottom:".75rem" }}>
              <div>
                <label style={labelStyle}>Cijena (opciono)</label>
                <input value={form.price} onChange={e => setForm(f => ({ ...f, price:e.target.value }))} style={inputStyle} placeholder="npr. 8,90 €" />
              </div>
              <div>
                <label style={labelStyle}>Napomena</label>
                <input value={form.note} onChange={e => setForm(f => ({ ...f, note:e.target.value }))} style={inputStyle} placeholder="opciono..." />
              </div>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.5rem" }}>
              <input type="checkbox" id="pub" checked={form.published} onChange={e => setForm(f => ({ ...f, published:e.target.checked }))} />
              <label htmlFor="pub" style={{ fontSize:13, color:"#52525B" }}>Objavi (prikaži na web stranici)</label>
            </div>

            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button onClick={() => setEditing(null)} style={btnCancel}>Otkaži</button>
              <button onClick={save} disabled={saving} style={btnSave}>{saving?"Čuvanje...":"Sačuvaj"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const h1: React.CSSProperties = { fontSize:24, fontWeight:900, letterSpacing:-1, color:"#18181B", marginBottom:".25rem" };
const sub: React.CSSProperties = { fontSize:13, color:"#A1A1AA" };
const navBtn: React.CSSProperties = { padding:".45rem 1rem", borderRadius:8, border:"1.5px solid #E4E0D9", background:"#fff", color:"#52525B", fontSize:12, fontWeight:600, cursor:"pointer" };
const labelStyle: React.CSSProperties = { display:"block", fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#A1A1AA", marginBottom:5 };
const inputStyle: React.CSSProperties = { width:"100%", padding:".65rem .9rem", border:"1.5px solid #E4E0D9", borderRadius:8, fontSize:13, color:"#18181B", fontFamily:"Inter,sans-serif", outline:"none", boxSizing:"border-box" };
const btnCancel: React.CSSProperties = { padding:".7rem 1.4rem", borderRadius:8, border:"1.5px solid #E4E0D9", background:"#fff", color:"#52525B", fontWeight:600, fontSize:13, cursor:"pointer" };
const btnSave: React.CSSProperties = { padding:".7rem 1.4rem", borderRadius:8, border:"none", background:"#E8602C", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" };
