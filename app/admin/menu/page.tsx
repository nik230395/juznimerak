"use client";
import { useEffect, useState } from "react";

interface Item { id:number; category:string; name:string; subtitle:string|null; price:string; allergens:string|null; available:boolean; sortOrder:number; }
type Draft = Omit<Item,"id">;
const EMPTY: Draft = { category:"Roštilj", name:"", subtitle:"", price:"", allergens:"", available:true, sortOrder:0 };
const CATS = ["Roštilj","Specijaliteti","Salate","Kuhinja","Riba","Prilog","Desert"];

export default function MenuAdmin() {
  const [items, setItems]       = useState<Item[]>([]);
  const [filter, setFilter]     = useState("Roštilj");
  const [editing, setEditing]   = useState<Item | null>(null);
  const [draft, setDraft]       = useState<Draft>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);

  const load = () => fetch("/api/menu").then(r=>r.json()).then(d => { if(Array.isArray(d)) setItems(d); });
  useEffect(() => { load(); }, []);

  const visible = items.filter(i => i.category === filter);

  function openEdit(item: Item) {
    setEditing(item);
    setDraft({ category:item.category, name:item.name, subtitle:item.subtitle??"", price:item.price, allergens:item.allergens??"", available:item.available, sortOrder:item.sortOrder });
    setShowForm(true);
  }
  function openNew() { setEditing(null); setDraft({ ...EMPTY, category: filter }); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditing(null); }

  async function save() {
    setSaving(true);
    const body = { ...draft, subtitle: draft.subtitle || null, allergens: draft.allergens || null };
    if (editing) {
      await fetch(`/api/menu/${editing.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
    } else {
      await fetch("/api/menu", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
    }
    await load(); setSaving(false); closeForm();
  }

  async function remove(id: number) {
    if (!confirm("Obrisati ovo jelo?")) return;
    await fetch(`/api/menu/${id}`, { method:"DELETE" });
    await load();
  }

  async function toggleAvailable(item: Item) {
    await fetch(`/api/menu/${item.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ ...item, available: !item.available }) });
    await load();
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
        <div><h1 style={h1}>Speisekarte</h1><p style={sub}>Upravljajte jelima i cijenama.</p></div>
        <button onClick={openNew} style={btnPrimary}>+ Novo jelo</button>
      </div>

      {/* Category tabs */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:"1.5rem" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding:".45rem 1rem", borderRadius:8, border:"1.5px solid", borderColor: filter===c ? "#E8602C" : "#E4E0D9", background: filter===c ? "#FFF0EA" : "#fff", color: filter===c ? "#E8602C" : "#52525B", fontWeight: filter===c ? 700 : 500, fontSize:13, cursor:"pointer" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={card}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:"1.5px solid #E4E0D9" }}>
              {["Naziv","Podnaslov","Cijena","Alergeni","Dostupno",""].map(h => <th key={h} style={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {visible.map(item => (
              <tr key={item.id} style={{ borderBottom:"1px solid #F5F2ED", opacity: item.available ? 1 : .45 }}>
                <td style={td}><strong>{item.name}</strong></td>
                <td style={{ ...td, color:"#A1A1AA" }}>{item.subtitle ?? "—"}</td>
                <td style={{ ...td, fontWeight:700, color:"#E8602C" }}>{item.price}</td>
                <td style={td}>{item.allergens ?? "—"}</td>
                <td style={td}>
                  <button onClick={() => toggleAvailable(item)} style={{ padding:".2rem .65rem", borderRadius:999, border:"none", cursor:"pointer", fontSize:11, fontWeight:600, background: item.available ? "#22C55E20" : "#EF444420", color: item.available ? "#22C55E" : "#EF4444" }}>
                    {item.available ? "Dostupno" : "Nedostupno"}
                  </button>
                </td>
                <td style={{ ...td, display:"flex", gap:6, justifyContent:"flex-end" }}>
                  <button onClick={() => openEdit(item)} style={btnSm}>Uredi</button>
                  <button onClick={() => remove(item.id)} style={{ ...btnSm, background:"#FEE2E2", color:"#EF4444" }}>Briši</button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan={6} style={{ padding:"2rem", textAlign:"center", color:"#A1A1AA" }}>Nema jela u ovoj kategoriji.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Drawer / Modal */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", borderRadius:20, padding:"2rem", width:"100%", maxWidth:480, boxShadow:"0 24px 64px rgba(0,0,0,.2)" }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#18181B", marginBottom:"1.5rem" }}>{editing ? "Uredi jelo" : "Novo jelo"}</h2>

            {([["Kategorija","category","select"],["Naziv","name","text"],["Podnaslov","subtitle","text"],["Cijena","price","text"],["Alergeni","allergens","text"],["Redoslijed","sortOrder","number"]] as [string,keyof Draft,string][]).map(([label, key, type]) => (
              <div key={key} style={{ marginBottom:".9rem" }}>
                <label style={labelStyle}>{label}</label>
                {type === "select"
                  ? <select value={draft[key] as string} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} style={inputStyle}>
                      {CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  : <input type={type} value={draft[key] as string} onChange={e => setDraft(d => ({ ...d, [key]: type==="number" ? Number(e.target.value) : e.target.value }))} style={inputStyle} />
                }
              </div>
            ))}

            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.5rem" }}>
              <input type="checkbox" id="avail" checked={draft.available} onChange={e => setDraft(d => ({ ...d, available: e.target.checked }))} />
              <label htmlFor="avail" style={{ fontSize:13, color:"#52525B" }}>Dostupno</label>
            </div>

            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button onClick={closeForm} style={{ padding:".7rem 1.4rem", borderRadius:8, border:"1.5px solid #E4E0D9", background:"#fff", color:"#52525B", fontWeight:600, fontSize:13, cursor:"pointer" }}>Otkaži</button>
              <button onClick={save} disabled={saving} style={{ padding:".7rem 1.4rem", borderRadius:8, border:"none", background:"#E8602C", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", opacity:saving?.7:1 }}>
                {saving ? "Čuvanje..." : "Sačuvaj"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const h1: React.CSSProperties = { fontSize:24, fontWeight:900, letterSpacing:-1, color:"#18181B", marginBottom:".25rem" };
const sub: React.CSSProperties = { fontSize:13, color:"#A1A1AA" };
const card: React.CSSProperties = { background:"#fff", border:"1.5px solid #E4E0D9", borderRadius:16, overflow:"hidden" };
const th: React.CSSProperties = { textAlign:"left", padding:".6rem .75rem", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"#A1A1AA" };
const td: React.CSSProperties = { padding:".65rem .75rem", color:"#18181B" };
const btnPrimary: React.CSSProperties = { padding:".7rem 1.4rem", borderRadius:10, border:"none", background:"#E8602C", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" };
const btnSm: React.CSSProperties = { padding:".25rem .7rem", borderRadius:6, border:"none", background:"#F5F2ED", color:"#52525B", fontWeight:600, fontSize:12, cursor:"pointer" };
const labelStyle: React.CSSProperties = { display:"block", fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#A1A1AA", marginBottom:5 };
const inputStyle: React.CSSProperties = { width:"100%", padding:".7rem .9rem", border:"1.5px solid #E4E0D9", borderRadius:8, fontSize:13, color:"#18181B", fontFamily:"Inter,sans-serif", outline:"none", boxSizing:"border-box" };
