"use client";

import { useState, useEffect, useRef, ReactNode, CSSProperties } from "react";

// ── ICONS ─────────────────────────────────────────────────────────────────────
const P = (p: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    style={{ display:"inline-block", verticalAlign:"middle", flexShrink:0 }} {...p}/>
);
const IcPin    = () => <P><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></P>;
const IcClock  = () => <P><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></P>;
const IcPhone  = () => <P><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18v2.92"/></P>;
const IcFlame  = () => <P><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></P>;
const IcStar   = () => <P><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></P>;
const IcLeaf   = () => <P><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></P>;
const IcBowl   = () => <P><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9z"/><path d="M7 21h10"/><line x1="12" y1="3" x2="12" y2="5"/></P>;
const IcWave   = () => <P><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></P>;
const IcLayers = () => <P><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></P>;
const IcGem    = () => <P><path d="M6 3h12l4 6-10 13L2 9l4-6z"/><path d="M2 9h20"/><path d="m9 3-3 6"/><path d="m15 3 3 6"/></P>;
const IcHeart  = () => <P fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></P>;
const IcCheck  = () => <P><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></P>;
function getCatIcon(key: string): ReactNode {
  const k = key.toLowerCase().replace(/[šś]/g,"s").replace(/[žź]/g,"z").replace(/[čć]/g,"c");
  switch(k) {
    case "rostilj":       return <IcFlame />;
    case "specijaliteti": return <IcStar />;
    case "salate":        return <IcLeaf />;
    case "kuhinja":       return <IcBowl />;
    case "riba":          return <IcWave />;
    case "prilog":        return <IcLayers />;
    case "desert":        return <IcGem />;
    default:              return <IcStar />;
  }
}
// ─────────────────────────────────────────────────────────────────────────────

interface MenuItem  { name: string; subtitle?: string; price: string; allergens?: string; }
interface MenuCat   { key: string; label: string; items: MenuItem[]; }
interface RevealProps { children: ReactNode; delay?: number; style?: CSSProperties; }

const MENU: MenuCat[] = [
  { key: "rostilj", label: "Roštilj", items: [
    { name: "Mešano meso",              subtitle: "Grill Mix für 1 Person",       price: "10,90 €" },
    { name: "Pljeskavica",              subtitle: "Fleischlaibchen",              price: "6,90 €" },
    { name: "Punjena pljeskavica",      subtitle: "Gefüllte Fleischlaibchen",     price: "11,90 €", allergens: "D" },
    { name: "Ćevapi 200 / 400 g",                                                 price: "6,90 / 10,90 €" },
    { name: "Svinjski vrat 200 / 400 g",subtitle: "Schweinssteaks",              price: "6,90 / 10,90 €" },
    { name: "Paštica 200 / 400 g",      subtitle: "Bauchfleisch",                price: "6,90 / 10,90 €" },
    { name: "Batk 200 / 400 g",         subtitle: "Hühnenbein",                  price: "6,90 / 10,90 €" },
    { name: "Kobasice 200 / 400 g",     subtitle: "Grillwürstel",                price: "6,90 / 10,90 €" },
    { name: "Punjena piletina",         subtitle: "Gefüllte Hühnerbrust",        price: "13,00 €" },
    { name: "Punjena vešalica 400 g",   subtitle: "Gefüllte Karre",              price: "13,90 €", allergens: "G" },
    { name: "Bela vešalica 200 / 400 g",subtitle: "Weißes Karee",               price: "6,90 / 10,90 €" },
    { name: "Dinklave vešalica",        subtitle: "Gänsebraten Karree",          price: "11,00 €" },
    { name: "Svinjski kotopić",         subtitle: "Grillgeflügel vom Schwein",   price: "6,90 / 10,90 €" },
  ]},
  { key: "specijaliteti", label: "Specijaliteti", items: [
    { name: "Karađorđeva šnicla",       subtitle: "Karađorđeva Schnitzel",       price: "14,90 €", allergens: "A,C,G" },
    { name: "Bečka šnicla",             subtitle: "Wiener Schnitzel",            price: "12,90 €" },
    { name: "Rostfleisch",                                                         price: "14,90 €" },
    { name: "Pečena piletina",          subtitle: "Hühnerbraten",               price: "15,90 €", allergens: "G" },
    { name: "Meso ispod sača za 2",     subtitle: "Für 2 Personen",             price: "19,90 €" },
    { name: "Punjene paprike sa sirom", subtitle: "Gefüllte Paprika mit Käse", price: "8,90 €", allergens: "A,C,G" },
  ]},
  { key: "salate", label: "Salate", items: [
    { name: "Šmarski mix",              subtitle: "für 4 Personen",              price: "13,90 €", allergens: "G" },
    { name: "Šopska salata",            subtitle: "Šopska-Salat",               price: "4,50 €", allergens: "G" },
    { name: "Dakovska salata",          subtitle: "Dakischer Salat",            price: "4,50 €" },
    { name: "Paradajz salata",          subtitle: "Tomatensalat",               price: "4,50 €" },
    { name: "Krastavac salata",         subtitle: "Gurkensalat",                price: "4,50 €" },
    { name: "Kupus salata",             subtitle: "Krautsalat",                 price: "4,50 €" },
    { name: "Kiseli kupus",             subtitle: "Sauerkraut",                 price: "4,50 €" },
    { name: "Mešana salata",            subtitle: "Gemischter Salat",           price: "4,50 €" },
    { name: "Krompir salata",           subtitle: "Kartoffelsalat",             price: "3,90 €" },
    { name: "Kajmak",                   subtitle: "Käsmus",                     price: "1,90 €", allergens: "G" },
    { name: "Ajvar",                                                              price: "1,90 €" },
    { name: "Džadzike",                                                           price: "1,90 €", allergens: "G" },
  ]},
  { key: "kuhinja", label: "Kuhinja", items: [
    { name: "Pileća ili Rind Čorba",    subtitle: "Hühner- oder Rindssuppe",   price: "4,90 €", allergens: "A" },
    { name: "Pasulj",                   subtitle: "Bohnensuppe",               price: "6,90 €", allergens: "A" },
    { name: "Sarma 1 kom.",             subtitle: "Krautroulade",              price: "2,00 €", allergens: "A" },
    { name: "Rindfleisch",                                                       price: "7,90 €", allergens: "A" },
    { name: "Sarma sa prilogom",        subtitle: "Krautroulade mit Beilage",  price: "6,90 €", allergens: "G" },
  ]},
  { key: "riba", label: "Riba", items: [
    { name: "Pastrmka",                 subtitle: "Forelle",                   price: "13,90 €", allergens: "D" },
    { name: "File Pangasius",           subtitle: "Fischfilet Pangasius",      price: "13,90 €", allergens: "D" },
  ]},
  { key: "prilog", label: "Prilog", items: [
    { name: "Lepinja",                  subtitle: "Fladenbrot",                price: "1,50 €", allergens: "A" },
    { name: "Pomfrit",                  subtitle: "Pommes",                    price: "2,90 €" },
    { name: "Ketchup",                                                           price: "1,00 €", allergens: "M" },
    { name: "Majonez",                  subtitle: "Mayonnaise",                price: "1,00 €", allergens: "C,G,M" },
    { name: "Senf",                                                              price: "1,00 €", allergens: "M" },
  ]},
  { key: "desert", label: "Desert", items: [
    { name: "Palačinke 2 kom.",         subtitle: "Palatschinken",             price: "4,50 €", allergens: "A,C,G" },
    { name: "Baklava 2 kom.",                                                    price: "4,50 €", allergens: "A,H" },
  ]},
];

const NAV  = ["Početna", "Jelovnik", "O nama", "Kontakt"];
const NMAP: Record<string, string> = { "Početna":"home","Jelovnik":"jelovnik","O nama":"o-nama","Kontakt":"kontakt" };

function useInView(ref: React.RefObject<HTMLElement | null>, t = 0.08): boolean {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [ref, t]);
  return v;
}

function Reveal({ children, delay = 0, style = {} }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref);
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(24px)",
      transition: `opacity .6s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .6s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function JuzniMerak() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cat, setCat]           = useState("Roštilj");
  const [dbMenu, setDbMenu]     = useState<MenuCat[]>(MENU);
  const [resForm, setResForm]   = useState({ firstName:"", lastName:"", phone:"", date:"", time:"19:00", guests:"2", occasion:"", note:"" });
  const [resSent, setResSent]   = useState(false);
  const [resSending, setResSending] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    // Fetch live menu from DB
    fetch("/api/menu")
      .then(r => r.json())
      .then((items: {id:number;category:string;name:string;subtitle:string|null;price:string;allergens:string|null;available:boolean}[]) => {
        if (!Array.isArray(items)) return;
        const available = items.filter(i => i.available);
        const catMap: Record<string, MenuCat> = {};
        const CAT_KEYS: Record<string,string> = {
          "Roštilj":"Roštilj", "Specijaliteti":"Specijaliteti",
          "Salate":"Salate", "Kuhinja":"Kuhinja",
          "Riba":"Riba", "Prilog":"Prilog", "Desert":"Desert",
        };
        available.forEach(item => {
          if (!catMap[item.category]) {
            const key = CAT_KEYS[item.category] ?? item.category;
            catMap[item.category] = { key, label: item.category, items: [] };
          }
          catMap[item.category].items.push({ name: item.name, subtitle: item.subtitle ?? undefined, price: item.price, allergens: item.allergens ?? undefined });
        });
        const ordered = ["Roštilj","Specijaliteti","Salate","Kuhinja","Riba","Prilog","Desert"]
          .filter(k => catMap[k])
          .map(k => catMap[k]);
        if (ordered.length > 0) { setDbMenu(ordered); setCat(ordered[0].key); }
      })
      .catch(() => {});
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (label: string) => {
    document.getElementById(NMAP[label] ?? label)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  async function submitReservation(e: React.FormEvent) {
    e.preventDefault();
    setResSending(true);
    await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...resForm, guests: Number(resForm.guests) }),
    });
    setResSending(false);
    setResSent(true);
  }

  const active = dbMenu.find(c => c.key === cat) ?? dbMenu[0];

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <header className={`nav ${scrolled ? "nav--up" : ""}`}>
        <button className="nav__logo" onClick={() => go("Početna")}>
          <span className="logo-sq">JM</span>
          <span className="logo-txt">Južni Merak</span>
        </button>

        <nav className={`nav__links ${open ? "is-open" : ""}`}>
          {NAV.map(n => (
            <button key={n} className="nav__a" onClick={() => go(n)}>{n}</button>
          ))}
          <button className="cta-btn mob-only" onClick={() => go("Kontakt")}>Rezerviši</button>
        </nav>

        <div className="nav__end">
          <button className="cta-btn desk-only" onClick={() => go("Kontakt")}>Rezerviši sto</button>
          <button className="burger" onClick={() => setOpen(!open)} aria-label="menu">
            <span className={open ? "r45"  : ""} />
            <span className={open ? "fade" : ""} />
            <span className={open ? "r-45" : ""} />
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero__inner wrap">
          <div className="hero__left">
            <Reveal>
              <div className="tag-pill">
                <span className="tag-dot" />
                Wien 1100 · Friesenplatz 1-2
              </div>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="hero__h1">
                Balkanski<br />
                ukus<br />
                <span className="acc-txt">u Beču.</span>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="hero__p">
                Svježe, domaće, serviran s ljubavlju.<br />
                Autentična balkanska kuhinja u Beču.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="hero__btns">
                <button className="cta-btn cta-btn--lg" onClick={() => go("Jelovnik")}>Pogledaj jelovnik</button>
                <button className="out-btn out-btn--lg" onClick={() => go("Kontakt")}>Rezerviši sto →</button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={80} style={{ flex: "1" }}>
            <div className="hero__card">
              <div className="hcard__status">
                <span className="hcard__dot" />
                <span>Otvoreno danas</span>
              </div>

              <div className="hcard__rows">
                {([
                  [<IcPin />, "Adresa", "Friesenplatz 1-2\nWien 1100"],
                  [<IcClock />, "Ručak", "Mo – Fr  11:00 – 16:00"],
                  [<IcPhone />, "Telefon", "+43 68 1101 96066"],
                ] as [ReactNode, string, string][]).map(([ic, k, v]) => (
                  <div key={k} className="hcard__row">
                    <span className="hcard__ic">{ic}</span>
                    <div>
                      <div className="hcard__k">{k}</div>
                      <div className="hcard__v">{v}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="cta-btn" style={{ width: "100%", marginTop: "1.5rem" }} onClick={() => go("Kontakt")}>
                Rezerviši sto
              </button>
            </div>
          </Reveal>
        </div>

        {/* Stats strip */}
        <div className="stats-strip">
          <div className="wrap stats-inner">
            {[["50+", "Jela na meniju"], ["4.7★", "Ocena gostiju"], ["Wien", "1100, Friesenplatz"], ["Mo–Fr", "11:00 – 16:00"]].map(([n, l]) => (
              <div key={l} className="stat">
                <span className="stat__n">{n}</span>
                <span className="stat__l">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O NAMA — BENTO */}
      <section id="o-nama" className="sec">
        <div className="wrap">
          <Reveal>
            <div className="sec-eyebrow">O nama</div>
            <h2 className="sec-h2">Balkanski duh<br /><span className="acc-txt">u srcu Beča</span></h2>
          </Reveal>

          <div className="bento">
            <Reveal style={{ gridArea: "a" }}>
              <div className="bc bc--lg bc--off">
                <div className="bc__label">Naša priča</div>
                <p className="bc__body">
                  Dobrodošli u <strong>Južni Merak</strong> — restoran gde se oseća prava balkanska
                  gostoprimljivost. Autentičan ukus Balkana u Beču, sa svežim
                  namirnicama i receptima koji podsećaju na dom.
                </p>
                <div className="bc__icons-row"><IcFlame /><IcStar /><IcLeaf /></div>
              </div>
            </Reveal>

            <Reveal delay={60} style={{ gridArea: "b" }}>
              <div className="bc bc--accent">
                <div className="bc__num">50<sup>+</sup></div>
                <div className="bc__sub">Jela na meniju</div>
              </div>
            </Reveal>

            <Reveal delay={80} style={{ gridArea: "c" }}>
              <div className="bc bc--off">
                <div className="bc__icon"><IcLeaf /></div>
                <div className="bc__title">Svežina</div>
                <div className="bc__desc">Samo najsvežiji sastojci, svaki dan</div>
              </div>
            </Reveal>

            <Reveal delay={100} style={{ gridArea: "d" }}>
              <div className="bc bc--off">
                <div className="bc__num bc__num--sm">50<sup>+</sup></div>
                <div className="bc__sub">Jela na meniju</div>
              </div>
            </Reveal>

            <Reveal delay={110} style={{ gridArea: "e" }}>
              <div className="bc bc--off">
                <div className="bc__icon" style={{ color:"var(--acc)" }}><IcHeart /></div>
                <div className="bc__title">Gostoprimljivost</div>
                <div className="bc__desc">Svaki gost je naša porodica</div>
              </div>
            </Reveal>

            <Reveal delay={120} style={{ gridArea: "f" }}>
              <div className="bc bc--off">
                <div className="bc__label">Ručak</div>
                <div className="bc__time">11:00 – 16:00</div>
                <div className="bc__desc" style={{ marginTop: ".4rem" }}>Pon – Pet</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* JELOVNIK */}
      <section id="jelovnik" className="sec sec--off">
        <div className="wrap">
          <Reveal>
            <div className="sec-eyebrow">Jelovnik</div>
            <h2 className="sec-h2">Naša <span className="acc-txt">jela</span></h2>
            <p className="sec-p">Sva jela se pripremaju svakodnevno sveže, po originalnim receptima.</p>
          </Reveal>

          <div className="tabs-scroll">
            <div className="tabs">
              {dbMenu.map(c => (
                <button key={c.key} className={`tab ${cat === c.key ? "tab--on" : ""}`} onClick={() => setCat(c.key)}>
                  {getCatIcon(c.key)}<span style={{ marginLeft:".35rem" }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Reveal key={cat}>
            <div className="mlist">
              {active.items.map((item, i) => (
                <div key={i} className="mrow">
                  <div className="mrow__l">
                    <div className="mrow__name">{item.name}</div>
                    {item.subtitle  && <div className="mrow__sub">{item.subtitle}</div>}
                    {item.allergens && <div className="mrow__a">({item.allergens})</div>}
                  </div>
                  <div className="mrow__price">{item.price}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <p className="allergy-note" style={{ marginTop: "1rem" }}>
            Alergeni su naznačeni u zagradama.
          </p>
        </div>
      </section>

      {/* LUNCH BAND */}
      <section className="lunch-sec">
        <div className="wrap lunch-inner">
          <Reveal style={{ flex: "1" }}>
            <div className="sec-eyebrow sec-eyebrow--light">Mittagsmenü</div>
            <h2 className="lunch-h">Svaki dan svježe<br />kuhana jela</h2>
            <p className="lunch-p">Ponedeljak – Petak &nbsp;·&nbsp; 11:00 – 16:00</p>
          </Reveal>
          <Reveal delay={80} style={{ flexShrink: 0 }}>
            <a href="tel:+4368110196066" className="cta-btn cta-btn--lg cta-btn--white">
              +43 68 1101 96066
            </a>
          </Reveal>
        </div>
      </section>

      {/* KONTAKT */}
      <section id="kontakt" className="sec">
        <div className="wrap">
          <Reveal>
            <div className="sec-eyebrow">Rezervacija</div>
            <h2 className="sec-h2">Rezervišite <span className="acc-txt">vaš sto</span></h2>
          </Reveal>

          <div className="cgrid">
            <Reveal delay={60}>
              <div className="cinfo">
                {([
                  [<IcPin />, "Adresa",          "Friesenplatz 1-2\nWien 1100, Austrija"],
                  [<IcPhone />, "Telefon",         "+43 68 1101 96066"],
                  [<IcClock />, "Ručak (Mo – Fr)", "11:00 – 16:00"],
                ] as [ReactNode,string,string][]).map(([ic, lbl, val]) => (
                  <div key={lbl} className="ccard">
                    <span className="ccard__ic">{ic}</span>
                    <div>
                      <div className="ccard__lbl">{lbl}</div>
                      <div className="ccard__val">{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100}>
              {resSent ? (
                <div className="rform" style={{ textAlign:"center", padding:"3rem 2rem" }}>
                  <div style={{ fontSize:"3rem", marginBottom:"1rem", color:"var(--acc)" }}><IcCheck /></div>
                  <div style={{ fontSize:"1.2rem", fontWeight:800, color:"var(--ink)", marginBottom:".5rem" }}>Hvala na rezervaciji!</div>
                  <div style={{ color:"var(--ink2)", fontSize:".9rem", marginBottom:"1.5rem" }}>Kontaktiraćemo vas uskoro za potvrdu.</div>
                  <button className="cta-btn" onClick={() => setResSent(false)}>Nova rezervacija</button>
                </div>
              ) : (
                <form className="rform" onSubmit={submitReservation}>
                  <div className="fr2">
                    <div className="fg"><label>Ime</label><input required type="text" placeholder="Vaše ime" value={resForm.firstName} onChange={e => setResForm(f => ({ ...f, firstName: e.target.value }))} /></div>
                    <div className="fg"><label>Prezime</label><input required type="text" placeholder="Vaše prezime" value={resForm.lastName} onChange={e => setResForm(f => ({ ...f, lastName: e.target.value }))} /></div>
                  </div>
                  <div className="fr2">
                    <div className="fg"><label>Telefon</label><input required type="tel" placeholder="+43 …" value={resForm.phone} onChange={e => setResForm(f => ({ ...f, phone: e.target.value }))} /></div>
                    <div className="fg"><label>Datum</label><input required type="date" value={resForm.date} onChange={e => setResForm(f => ({ ...f, date: e.target.value }))} /></div>
                  </div>
                  <div className="fr2">
                    <div className="fg"><label>Vreme</label><input required type="time" value={resForm.time} onChange={e => setResForm(f => ({ ...f, time: e.target.value }))} /></div>
                    <div className="fg">
                      <label>Broj gostiju</label>
                      <select value={resForm.guests} onChange={e => setResForm(f => ({ ...f, guests: e.target.value }))}>
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n===1?"gost":"gosta"}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="fg">
                    <label>Povod (opciono)</label>
                    <input type="text" placeholder="Rođendan, godišnjica…" value={resForm.occasion} onChange={e => setResForm(f => ({ ...f, occasion: e.target.value }))} />
                  </div>
                  <div className="fg">
                    <label>Napomena</label>
                    <textarea placeholder="Alergije, posebne želje…" rows={3} value={resForm.note} onChange={e => setResForm(f => ({ ...f, note: e.target.value }))} />
                  </div>
                  <button type="submit" disabled={resSending} className="cta-btn cta-btn--lg" style={{ width: "100%", marginTop: ".5rem" }}>
                    {resSending ? "Slanje…" : "Potvrdi rezervaciju"}
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* MAPS */}
      <section className="maps-sec">
        <div className="maps-label">
          <IcPin /><span>Friesenplatz 1-2 · Wien 1100</span>
        </div>
        <iframe
          src="https://maps.google.com/maps?q=Friesenplatz+1-2,+1100+Wien,+Austria&output=embed"
          width="100%" height="420"
          style={{ border:0, display:"block" }}
          allowFullScreen loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Južni Merak — Friesenplatz 1-2, Wien 1100"
        />
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="wrap foot__row">
          <div className="foot__brand">
            <span className="logo-sq logo-sq--sm">JM</span>
            <div>
              <div className="foot__name">Južni Merak</div>
              <div className="foot__loc">Friesenplatz 1-2 · Wien 1100</div>
            </div>
          </div>
          <nav className="foot__nav">
            {NAV.map(n => <button key={n} className="foot__a" onClick={() => go(n)}>{n}</button>)}
          </nav>
          <div className="foot__copy">© {new Date().getFullYear()} Južni Merak</div>
        </div>
      </footer>

      {/* MOBILE BAR */}
      <div className="mob-bar">
        <a href="tel:+4368110196066" className="mob-bar__call">
          <span style={{ fontSize:"1.2rem" }}><IcPhone /></span>
          <div>
            <div className="mob-bar__lbl">Pozovite nas</div>
            <div className="mob-bar__num">+43 68 1101 96066</div>
          </div>
        </a>
        <button className="cta-btn" style={{ flexShrink:0, borderRadius:"12px", padding:".85rem 1.3rem", fontSize:".72rem" }} onClick={() => go("Kontakt")}>
          Rezerviši
        </button>
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --white:   #FFFFFF;
  --off:     #F5F2ED;
  --ink:     #18181B;
  --ink2:    #52525B;
  --ink3:    #A1A1AA;
  --acc:     #E8602C;
  --acc-h:   #CF4E1E;
  --acc-soft:#FFF0EA;
  --border:  #E4E0D9;
  --border2: #CCC7BE;
}

html { scroll-behavior: smooth; }
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--white);
  color: var(--ink);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.wrap { max-width: 1120px; margin: 0 auto; padding: 0 2rem; }

.acc-txt { color: var(--acc); }


/* ── BUTTONS ── */
.cta-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: .7rem 1.6rem;
  background: var(--acc); color: #fff;
  border: none; cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: .75rem; font-weight: 700;
  letter-spacing: .3px; border-radius: 10px;
  transition: background .2s, transform .15s, box-shadow .2s;
  text-decoration: none; white-space: nowrap;
}
.cta-btn:hover  { background: var(--acc-h); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,96,44,.2); }
.cta-btn:active { transform: scale(.98); }
.cta-btn--lg    { padding: .9rem 2rem; font-size: .82rem; }
.cta-btn--white { background: var(--acc); color: #fff; }
.cta-btn--white:hover { background: var(--acc-h); box-shadow: 0 6px 20px rgba(232,96,44,.25); }

.out-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: .7rem 1.6rem;
  background: transparent; color: var(--ink2);
  border: 1.5px solid var(--border2); cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: .75rem; font-weight: 600;
  letter-spacing: .3px; border-radius: 10px;
  transition: border-color .2s, color .2s, transform .15s;
}
.out-btn:hover  { border-color: var(--ink2); color: var(--ink); transform: translateY(-1px); }
.out-btn--lg    { padding: .9rem 2rem; font-size: .82rem; }

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 900;
  height: 66px; display: flex; align-items: center;
  justify-content: space-between; padding: 0 2rem;
  transition: background .3s, box-shadow .3s;
}
.nav--up {
  background: rgba(255,255,255,.95);
  backdrop-filter: blur(16px) saturate(200%);
  -webkit-backdrop-filter: blur(16px) saturate(200%);
  box-shadow: 0 1px 0 var(--border);
}
.nav__logo {
  display: flex; align-items: center; gap: .7rem;
  background: none; border: none; cursor: pointer;
}
.logo-sq {
  width: 36px; height: 36px; border-radius: 8px;
  background: var(--acc); color: #fff;
  font-size: .8rem; font-weight: 900;
  display: flex; align-items: center; justify-content: center;
  letter-spacing: .3px; flex-shrink: 0;
}
.logo-sq--sm { width: 30px; height: 30px; font-size: .7rem; border-radius: 6px; }
.logo-txt {
  font-size: .97rem; font-weight: 800;
  color: var(--ink); letter-spacing: -.3px;
}
.nav__links { display: flex; align-items: center; gap: 1.75rem; }
.nav__a {
  background: none; border: none; cursor: pointer;
  font-size: .78rem; font-weight: 500; color: var(--ink2);
  transition: color .2s;
}
.nav__a:hover { color: var(--ink); }
.nav__end { display: flex; align-items: center; gap: 1rem; }
.mob-only { display: none; }
.burger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 5px;
}
.burger span {
  display: block; width: 22px; height: 2px;
  background: var(--ink); border-radius: 2px;
  transition: .25s cubic-bezier(.16,1,.3,1); transform-origin: center;
}
.burger .r45  { transform: rotate(45deg) translate(5px,5px); }
.burger .fade { opacity: 0; }
.burger .r-45 { transform: rotate(-45deg) translate(5px,-5px); }

/* ── HERO ── */
.hero {
  padding-top: 66px;
  background: var(--white);
  min-height: 100svh;
  display: flex; flex-direction: column;
}
.hero__inner {
  flex: 1;
  display: grid; grid-template-columns: 1fr 380px;
  gap: 5rem; align-items: center;
  padding-top: 5rem; padding-bottom: 5rem;
}
.hero__left {}
.tag-pill {
  display: inline-flex; align-items: center; gap: .55rem;
  padding: .4rem .9rem;
  background: var(--acc-soft); border: 1.5px solid rgba(232,96,44,.2);
  border-radius: 999px;
  font-size: .68rem; font-weight: 600; color: var(--acc);
  margin-bottom: 2rem;
}
.tag-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #22C55E;
  box-shadow: 0 0 6px #22C55E;
  flex-shrink: 0;
}
.hero__h1 {
  font-size: clamp(3rem, 6.5vw, 6rem);
  font-weight: 900; letter-spacing: -3px;
  line-height: .96; color: var(--ink);
  margin-bottom: 1.75rem;
}
.hero__p {
  font-size: 1.05rem; font-weight: 400; line-height: 1.7;
  color: var(--ink3); margin-bottom: 2.5rem;
  max-width: 420px;
}
.hero__btns { display: flex; gap: .75rem; flex-wrap: wrap; }

/* Hero info card */
.hero__card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 20px; padding: 1.75rem;
  box-shadow: 0 4px 24px rgba(0,0,0,.06), 0 1px 4px rgba(0,0,0,.04);
}
.hcard__status {
  display: flex; align-items: center; gap: .55rem;
  margin-bottom: 1.25rem;
}
.hcard__dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #22C55E; box-shadow: 0 0 8px #22C55E;
  flex-shrink: 0;
}
.hcard__status span:last-child {
  font-size: .72rem; font-weight: 600; color: var(--ink2);
}
.hcard__rows { border-top: 1px solid var(--border); }
.hcard__row {
  display: flex; align-items: flex-start; gap: .9rem;
  padding: 1rem 0; border-bottom: 1px solid var(--border);
}
.hcard__row:last-of-type { border-bottom: none; }
.hcard__ic { font-size: 1.1rem; display: flex; align-items: center; color: var(--acc); flex-shrink: 0; }
.hcard__k {
  font-size: .6rem; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--ink3); margin-bottom: .2rem;
}
.hcard__v {
  font-size: .88rem; font-weight: 500; color: var(--ink);
  line-height: 1.45; white-space: pre-line;
}

/* Stats strip */
.stats-strip {
  border-top: 1.5px solid var(--border);
  background: var(--white);
}
.stats-inner {
  display: flex; padding: 2rem 0;
  gap: 0;
}
.stat {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: .3rem;
  padding: 0 1rem;
}
.stat + .stat { border-left: 1px solid var(--border); }
.stat__n {
  font-size: 1.6rem; font-weight: 900; letter-spacing: -1px;
  color: var(--acc);
}
.stat__l {
  font-size: .68rem; font-weight: 500; color: var(--ink3);
  letter-spacing: .3px;
}

/* ── SECTIONS ── */
.sec     { padding: 7rem 0; background: var(--white); }
.sec--off { background: var(--off); }

.sec-eyebrow {
  font-size: .68rem; font-weight: 700;
  letter-spacing: 2.5px; text-transform: uppercase;
  color: var(--acc); margin-bottom: .9rem;
  display: block;
}
.sec-eyebrow--light { color: var(--acc); }
.sec-h2 {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 900; letter-spacing: -2px;
  line-height: 1.08; color: var(--ink);
  margin-bottom: 1rem;
}
.sec-p {
  font-size: .97rem; color: var(--ink3); line-height: 1.7;
  max-width: 500px; margin-bottom: 2.5rem;
}

/* ── BENTO ── */
.bento {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  grid-template-areas:
    "a b c"
    "a d e"
    "a f f";
  gap: .85rem;
  margin-top: 3rem;
}
.bc {
  border-radius: 16px; padding: 1.75rem;
  border: 1.5px solid var(--border);
  display: flex; flex-direction: column;
  transition: box-shadow .2s, border-color .2s;
}
.bc:hover { box-shadow: 0 8px 28px rgba(0,0,0,.08); border-color: var(--border2); }
.bc--off  { background: var(--off); }
.bc--accent  { background: var(--acc); border-color: var(--acc); }
.bc--accent:hover { box-shadow: 0 8px 28px rgba(232,96,44,.25); }
.bc--lg   { min-height: 320px; }

.bc__label { font-size: .6rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--ink3); margin-bottom: 1rem; }
.bc--accent .bc__label { color: rgba(255,255,255,.65); }
.bc__body  { font-size: .9rem; font-weight: 400; color: var(--ink2); line-height: 1.75; flex: 1; }
.bc__icons-row { display: flex; gap: .75rem; align-items: center; margin-top: 1.5rem; font-size: 1.4rem; color: var(--acc); }
.bc__num   { font-size: 3.2rem; font-weight: 900; letter-spacing: -2px; color: var(--ink); line-height: 1; }
.bc--accent .bc__num { color: #fff; }
.bc__num sup { font-size: 1.8rem; }
.bc__num--sm { font-size: 2.5rem; }
.bc__sub   { font-size: .78rem; font-weight: 600; color: var(--ink3); margin-top: .4rem; }
.bc--accent .bc__sub { color: rgba(255,255,255,.75); }
.bc__icon  { font-size: 1.7rem; margin-bottom: .75rem; display: flex; align-items: center; }
.bc__title { font-size: .93rem; font-weight: 700; color: var(--ink); margin-bottom: .35rem; }
.bc__desc  { font-size: .8rem; font-weight: 400; color: var(--ink3); line-height: 1.55; }
.bc__time  { font-size: 1.6rem; font-weight: 900; letter-spacing: -1px; color: var(--ink); margin-top: .4rem; }

/* ── MENU ── */
.tabs-scroll {
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  scrollbar-width: none; margin: 2rem -2rem 0; padding: 0 2rem;
}
.tabs-scroll::-webkit-scrollbar { display: none; }
.tabs { display: flex; gap: .5rem; width: max-content; padding-bottom: .5rem; }
.tab {
  padding: .55rem 1.1rem;
  background: var(--white); border: 1.5px solid var(--border);
  color: var(--ink2); border-radius: 8px; cursor: pointer;
  font-family: 'Inter', sans-serif; font-size: .74rem; font-weight: 600;
  transition: all .18s; white-space: nowrap;
}
.tab:hover { border-color: var(--border2); color: var(--ink); }
.tab--on   { background: var(--acc) !important; border-color: var(--acc) !important; color: #fff !important; }

.mlist {
  margin-top: 1.5rem;
  border: 1.5px solid var(--border); border-radius: 16px; overflow: hidden;
  background: var(--white);
}
.mrow {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.5rem; border-bottom: 1px solid var(--border);
  gap: 1rem; transition: background .12s;
}
.mrow:last-child { border-bottom: none; }
.mrow:hover { background: var(--off); }
.mrow__l   { flex: 1; min-width: 0; }
.mrow__name { font-size: .9rem; font-weight: 600; color: var(--ink); }
.mrow__sub  { font-size: .73rem; font-weight: 400; color: var(--ink3); margin-top: .15rem; }
.mrow__a    { font-size: .62rem; font-weight: 500; color: var(--ink3); margin-top: .2rem; }
.mrow__price { font-size: .9rem; font-weight: 700; color: var(--acc); white-space: nowrap; flex-shrink: 0; }

.allergy-note { font-size: .7rem; color: var(--ink3); }

/* ── LUNCH ── */
.lunch-sec {
  background: var(--off); border-top: 1.5px solid var(--border); border-bottom: 1.5px solid var(--border); padding: 5rem 0;
}
.lunch-inner {
  max-width: 1120px; margin: 0 auto; padding: 0 2rem;
  display: flex; align-items: center; justify-content: space-between;
  gap: 3rem; flex-wrap: wrap;
}
.lunch-h {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900; letter-spacing: -1.5px;
  color: var(--ink); line-height: 1.1; margin-bottom: .6rem;
}
.lunch-p {
  font-size: .82rem; font-weight: 500;
  color: var(--ink3); letter-spacing: .5px;
}

/* ── CONTACT ── */
.cgrid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem; align-items: start; margin-top: 3rem; }
.cinfo { display: flex; flex-direction: column; gap: .85rem; }
.ccard {
  display: flex; align-items: flex-start; gap: .9rem;
  background: var(--off); border: 1.5px solid var(--border);
  border-radius: 12px; padding: 1.1rem;
  transition: border-color .2s;
}
.ccard:hover { border-color: var(--border2); }
.ccard__ic  { font-size: 1.3rem; display: flex; align-items: center; color: var(--acc); flex-shrink: 0; }
.ccard__lbl { font-size: .6rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink3); margin-bottom: .25rem; }
.ccard__val { font-size: .88rem; font-weight: 500; color: var(--ink); line-height: 1.5; white-space: pre-line; }

.rform {
  background: var(--off); border: 1.5px solid var(--border);
  border-radius: 16px; padding: 2rem;
}
.fr2 { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-bottom: .75rem; }
.fg  { display: flex; flex-direction: column; gap: .4rem; }
.fg label { font-size: .63rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink3); }
.fg input, .fg select, .fg textarea {
  padding: .75rem .9rem;
  background: var(--white); border: 1.5px solid var(--border);
  border-radius: 8px; color: var(--ink);
  font-family: 'Inter', sans-serif; font-size: .88rem;
  outline: none; transition: border-color .18s, box-shadow .18s; resize: none;
}
.fg input::placeholder, .fg textarea::placeholder { color: var(--ink3); }
.fg input:focus, .fg select:focus, .fg textarea:focus {
  border-color: var(--acc);
  box-shadow: 0 0 0 3px rgba(232,96,44,.1);
}

/* ── MAPS ── */
.maps-sec { position: relative; border-top: 1.5px solid var(--border); }
.maps-label {
  position: absolute; top: 1rem; left: 50%; transform: translateX(-50%);
  z-index: 10; background: var(--white);
  border: 1.5px solid var(--border); border-radius: 999px;
  padding: .45rem 1rem; display: inline-flex; align-items: center; gap: .45rem;
  font-size: .72rem; font-weight: 600; color: var(--ink2);
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  white-space: nowrap;
}
.maps-label svg { color: var(--acc); }

/* ── FOOTER ── */
.foot { background: var(--ink); padding: 2rem 0; }
.foot__row {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 1.25rem;
}
.foot__brand { display: flex; align-items: center; gap: .65rem; }
.foot__name  { font-size: .92rem; font-weight: 800; color: #fff; letter-spacing: -.2px; }
.foot__loc   { font-size: .7rem; color: rgba(255,255,255,.35); margin-top: .1rem; }
.foot__nav   { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.foot__a     { background: none; border: none; cursor: pointer; font-size: .78rem; font-weight: 500; color: rgba(255,255,255,.45); transition: color .2s; }
.foot__a:hover { color: rgba(255,255,255,.8); }
.foot__copy  { font-size: .7rem; color: rgba(255,255,255,.3); }

/* ── MOBILE BAR ── */
.mob-bar { display: none; }

/* ── RESPONSIVE ── */
@media (max-width: 860px) {
  .nav { padding: 0 1.25rem; height: 60px; }
  .desk-only { display: none !important; }
  .mob-only  { display: inline-flex !important; }
  .burger    { display: flex; }
  .nav__links {
    display: none; position: fixed; inset: 60px 0 0 0;
    background: rgba(255,255,255,.97);
    backdrop-filter: blur(20px);
    flex-direction: column; align-items: center; justify-content: center;
    gap: 0; z-index: 890; border-top: 1px solid var(--border);
  }
  .nav__links.is-open { display: flex; }
  .nav__links .nav__a {
    font-size: 1.1rem; font-weight: 700; color: var(--ink2);
    padding: 1.2rem 2rem; width: 100%; text-align: center;
    border-bottom: 1px solid var(--border);
    min-height: 54px; display: flex; align-items: center; justify-content: center;
  }
  .nav__links .mob-only {
    margin-top: 1.75rem; width: calc(100% - 3rem);
    border-radius: 10px; padding: .95rem; font-size: .82rem;
  }

  .hero { padding-top: 60px; min-height: 100svh; }
  .hero__inner {
    grid-template-columns: 1fr; gap: 2.5rem;
    padding-top: 3rem; padding-bottom: 3.5rem;
  }
  .hero__h1 { font-size: clamp(2.5rem, 12vw, 3.8rem); letter-spacing: -2px; }
  .hero__p  { font-size: .95rem; }
  .hero__btns { flex-direction: column; align-items: stretch; }
  .hero__btns .cta-btn, .hero__btns .out-btn { width: 100%; justify-content: center; }

  .stats-inner { gap: 0; flex-wrap: wrap; }
  .stat { min-width: 50%; padding: 1.25rem 0; }
  .stat:nth-child(odd) { border-right: 1px solid var(--border); }
  .stat + .stat { border-left: none; }
  .stat:nth-child(3), .stat:nth-child(4) { border-top: 1px solid var(--border); }

  .sec { padding: 4.5rem 0; }
  .bento {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "a a" "b c" "d e" "f f";
    gap: .65rem;
  }
  .bc--lg { min-height: 0; }

  .cgrid { grid-template-columns: 1fr; gap: 2rem; }
  .rform { padding: 1.5rem 1.25rem; }
  .fr2   { grid-template-columns: 1fr; }

  .lunch-inner { flex-direction: column; align-items: flex-start; gap: 2rem; }

  .foot__row { flex-direction: column; align-items: flex-start; gap: 1rem; }

  .mob-bar {
    display: flex; align-items: center; gap: .7rem;
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000;
    background: rgba(255,255,255,.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1.5px solid var(--border);
    padding: .85rem 1.25rem;
    padding-bottom: calc(.85rem + env(safe-area-inset-bottom));
  }
  .mob-bar__call {
    flex: 1; display: flex; align-items: center; gap: .7rem;
    text-decoration: none;
    background: var(--off); border: 1.5px solid var(--border);
    border-radius: 10px; padding: .7rem .9rem;
  }
  .mob-bar__call > span { font-size: 1.1rem; }
  .mob-bar__lbl { font-size: .55rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink3); line-height: 1; }
  .mob-bar__num { font-size: .76rem; font-weight: 700; color: var(--ink); line-height: 1.4; }

  .foot { padding-bottom: calc(2rem + 68px + env(safe-area-inset-bottom)); }
}

@media (max-width: 420px) {
  .hero__h1 { font-size: 2.3rem; letter-spacing: -1.5px; }
  .bento { grid-template-columns: 1fr; grid-template-areas: "a" "b" "c" "d" "e" "f"; }
}
`;
