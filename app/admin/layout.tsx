"use client";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const links = [
  { href: "/admin/dashboard",    label: "Dashboard",    icon: "📊" },
  { href: "/admin/menu",         label: "Speisekarte",  icon: "🍽️" },
  { href: "/admin/reservations", label: "Rezervacije",  icon: "📅" },
  { href: "/admin/daily-menu",   label: "Dnevni Menü",  icon: "☀️" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  // Login page renders without sidebar
  if (path === "/admin") return <>{children}</>;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"Inter,sans-serif", background:"#F5F2ED" }}>
      {/* Sidebar */}
      <aside style={{ width:230, background:"#18181B", display:"flex", flexDirection:"column", padding:"1.5rem 1rem", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"2.5rem", paddingLeft:4 }}>
          <span style={{ width:36,height:36,borderRadius:8,background:"#E8602C",color:"#fff",fontWeight:900,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center" }}>JM</span>
          <div>
            <div style={{ fontWeight:800, fontSize:13, color:"#fff" }}>Južni Merak</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.35)" }}>Admin Panel</div>
          </div>
        </div>

        <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:4 }}>
          {links.map(l => {
            const active = path.startsWith(l.href);
            return (
              <button key={l.href} onClick={() => router.push(l.href)} style={{
                display:"flex", alignItems:"center", gap:10,
                padding:".65rem .9rem", borderRadius:10, border:"none",
                background: active ? "rgba(232,96,44,.15)" : "transparent",
                color: active ? "#E8602C" : "rgba(255,255,255,.55)",
                fontWeight: active ? 700 : 500, fontSize:13,
                cursor:"pointer", textAlign:"left", width:"100%",
                transition:"all .15s",
              }}>
                <span style={{ fontSize:16 }}>{l.icon}</span>
                {l.label}
              </button>
            );
          })}
        </nav>

        <button onClick={() => router.push("/")} style={{ display:"flex",alignItems:"center",gap:8,padding:".6rem .9rem",borderRadius:10,border:"none",background:"transparent",color:"rgba(255,255,255,.35)",fontSize:12,cursor:"pointer",marginBottom:6 }}>
          ← Webseite
        </button>
        <button onClick={logout} style={{ display:"flex",alignItems:"center",gap:8,padding:".6rem .9rem",borderRadius:10,border:"1px solid rgba(255,255,255,.1)",background:"transparent",color:"rgba(255,255,255,.5)",fontSize:12,cursor:"pointer" }}>
          🚪 Odjava
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex:1, overflow:"auto", padding:"2rem" }}>
        {children}
      </main>
    </div>
  );
}
