"use client";

import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NAV = ["Početna", "O nama", "Jelovnik", "Galerija", "Kontakt"];

const SPECIALTIES = [
  { emoji: "🥩", name: "Ćevapi", desc: "Domaći ćevapi od svežeg mesa, serviran sa somun hlebom, lukom i kajmakom – pravi balkanski klasik.", price: "od 8,90 €", tag: "Najpopularnije" },
  { emoji: "🍖", name: "Karađorđeva Šnicla", desc: "Sočna svinjska šnicla punjena kajmakom, pohana i zlatno-pečena. Servirana sa pomfritom i friškim salatom.", price: "13,90 €", tag: "" },
  { emoji: "🥓", name: "Pljeskavica", desc: "Velika domaća pljeskavica sa somun hlebom, ajvarom i lukom – ponos roštiljske kuhinje.", price: "od 6,90 €", tag: "Domaći recept" },
  { emoji: "🍲", name: "Ispod Sača", desc: "Teletina ili jagnjetina dinstana ispod sača po starom receptu – nežno meso koje se topi u ustima.", price: "od 16,90 €", tag: "Specijalitet kuće" },
  { emoji: "🌶️", name: "Mešano Meso", desc: "Kombinovani roštiljski tanjir za prave mesojede – ćevapi, pljeskavica, kobasica i šnicla na jednom tanjiru.", price: "18,90 €", tag: "" },
  { emoji: "🥗", name: "Šopska Salata", desc: "Klasična balkanska salata sa paradajzom, krastavcem, paprikom i svežim sirom – savršen pratilac uz roštilj.", price: "4,50 €", tag: "" },
];

const BUFFET = {
  "Čorbe": ["Pileća čorba", "Pasulj sa rebarcima"],
  "Salate": ["Kupus salata", "Kiseli kupus", "Paradajz salata", "Šopska salata"],
  "Glavna jela": ["Punjene paprike", "Sarma", "Pečene kobasice", "Prženi krompir"],
  "Jelo dana": ["Menja se svaki dan: musaka, gulaš, rizoto, ćufte, špageti…"],
};

const TESTIMONIALS = [
  { name: "Dragan M.", text: "Ćevapi kao kod moje bake u Nišu. Ovde se oseća prava balkanska duša, i hrana i usluga su savršeni.", stars: 5 },
  { name: "Ana P.", text: "Karađorđeva šnicla je bila fenomenalna! Brzo, ukusno i po fer cenama. Svakako se vraćam.", stars: 5 },
  { name: "Marko S.", text: "Buffet je neverovatna vrednost za novac. Porcije ogromne, hrana domaća. Preporuka za sve u Beču!", stars: 5 },
];

function useInView(ref, threshold = 0.1) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function Reveal({ children, delay = 0, from = "bottom", style = {} }) {
  const ref = useRef();
  const v = useInView(ref);
  const t = { bottom: "translateY(35px)", left: "translateX(-30px)", right: "translateX(30px)", none: "none" };
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : t[from], transition: `opacity .75s ease ${delay}ms, transform .75s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

export default function JuzniMerak() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("Čorbe");

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const goto = (id) => {
    const map = { "Početna": "home", "O nama": "o-nama", "Jelovnik": "jelovnik", "Galerija": "galerija", "Kontakt": "kontakt" };
    document.getElementById(map[id] || id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
        <div className="nav__logo" onClick={() => goto("Početna")}>
          <span className="nav__flame">♨</span>
          <div>
            <div className="nav__name">Južni Merak</div>
            <div className="nav__sub">Balkanski Roštilj · Beč</div>
          </div>
        </div>
        <nav className={`nav__links ${menuOpen ? "open" : ""}`}>
          {NAV.map(n => <a key={n} className="nav__link" onClick={() => goto(n)}>{n}</a>)}
          <button className="btn btn--gold mob-reserve" onClick={() => goto("Kontakt")}>Rezervacija</button>
        </nav>
        <div className="nav__right">
          <button className="btn btn--gold desk-reserve" onClick={() => goto("Kontakt")}>Rezervacija stola</button>
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero__bg">
          <div className="hero__glow" />
          <div className="hero__grid" />
        </div>
        <div className="hero__body">
          <div className="hero__badge">🔥 Autentična balkanska kuhinja · Beč</div>
          <h1 className="hero__h1">Južni<em>Merak</em></h1>
          <div className="hero__rule"><span /><span className="hero__diamond">✦</span><span /></div>
          <p className="hero__tagline">Gde balkanski ukus postaje umetnost</p>
          <div className="hero__btns">
            <button className="btn btn--gold btn--lg" onClick={() => goto("Jelovnik")}>Pogledaj jelovnik</button>
            <button className="btn btn--outline btn--lg" onClick={() => goto("Kontakt")}>Rezerviši sto</button>
          </div>
        </div>
        <div className="hero__scroll" onClick={() => goto("O nama")}>
          <span>Skroluj</span><div className="hero__line" />
        </div>
        <div className="hero__band">
          {[["18+", "Godina tradicije"], ["50+", "Jela na meniju"], ["4.7★", "Ocena gostiju"]].map(([n, l]) => (
            <div key={l} className="hero__stat"><strong>{n}</strong><span>{l}</span></div>
          ))}
        </div>
      </section>

      {/* O NAMA */}
      <section id="o-nama" className="sec sec--light">
        <div className="wrap">
          <div className="about">
            <Reveal from="left">
              <div className="about__vis">
                <div className="about__main">
                  <span>🍖</span>
                  <div className="about__main-label">Roštilj &amp; Tradicija</div>
                </div>
                <div className="about__accent"><span>🌶️</span><div>Domaći recepti</div></div>
                <div className="about__frame" />
              </div>
            </Reveal>
            <Reveal from="right" delay={100}>
              <div className="about__txt">
                <p className="lbl">O nama</p>
                <h2 className="sh">Balkanski duh<br /><em>u srcu Beča</em></h2>
                <p className="ap">Dobrodošli u <strong>Južni Merak</strong> – restoran gde se oseća prava balkanska gostoprimljivost. Naša kuhinja donosi autentične ukuse Balkana sa svežim namirnicama, originalnim receptima i atmosferom koja podseća na dom.</p>
                <p className="ap">Svako jelo pripremamo sa ljubavlju i pažnjom, baš kao što su to radile naše bake. Meso začinjeno po originalnim receptima, svakodnevno sveže – to je naš zavet gostima.</p>
                <div className="pillars">
                  {[["🥩", "Svežina", "Samo najsvežiji sastojci, svaki dan"], ["🔥", "Tradicija", "Originalni balkanski recepti"], ["❤️", "Gostoprimljivost", "Svaki gost je naša porodica"]].map(([ic, t, d]) => (
                    <div key={t} className="pillar">
                      <div className="pillar__ic">{ic}</div>
                      <div><div className="pillar__t">{t}</div><div className="pillar__d">{d}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* JELOVNIK */}
      <section id="jelovnik" className="sec sec--dark">
        <div className="wrap">
          <Reveal style={{ textAlign: "center" }}>
            <p className="lbl lbl--gold">Naš jelovnik</p>
            <h2 className="sh sh--light">Specijaliteti <em>kuće</em></h2>
            <p className="sub">Svako jelo radi se svaki dan sveže, po starim receptima Balkana.</p>
          </Reveal>
          <div className="mgrid">
            {SPECIALTIES.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <div className="mcard">
                  {s.tag && <div className="mcard__tag">{s.tag}</div>}
                  <div className="mcard__emo">{s.emoji}</div>
                  <div className="mcard__name">{s.name}</div>
                  <div className="mcard__desc">{s.desc}</div>
                  <div className="mcard__foot"><span className="mcard__price">{s.price}</span></div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200} style={{ textAlign: "center", marginTop: "3rem" }}>
            <p className="menu-note">Kompletan jelovnik dolazi uskoro · Menjakarta će biti dodata</p>
            <button className="btn btn--gold btn--lg" onClick={() => goto("Kontakt")}>Rezerviši sto →</button>
          </Reveal>
        </div>
      </section>

      {/* BUFFET */}
      <section className="sec sec--fire">
        <div className="wrap">
          <div className="buff">
            <Reveal from="left">
              <div className="buff__info">
                <p className="lbl lbl--gold">Svaki dan</p>
                <h2 className="sh sh--light">Dnevni <em>Bife</em></h2>
                <p className="buff__intro">Uživajte u našem dnevnom bifeju od <strong>11:00 do 18:00</strong> sa raznovrsnim jelima balkanske kuhinje, sve za jednu cenu.</p>
                <div className="buff__prices">
                  <div className="bpcard">
                    <div className="bpcard__day">Pon – Pet</div>
                    <div className="bpcard__amt">12,90 €</div>
                    <div className="bpcard__note">po osobi</div>
                  </div>
                  <div className="bpcard bpcard--hi">
                    <div className="bpcard__day">Sub, Ned &amp; Praznici</div>
                    <div className="bpcard__amt">19,90 €</div>
                    <div className="bpcard__note">po osobi</div>
                  </div>
                </div>
                <button className="btn btn--gold" style={{ marginTop: "2rem" }} onClick={() => goto("Kontakt")}>Saznaj više →</button>
              </div>
            </Reveal>
            <Reveal from="right" delay={100}>
              <div className="btabs">
                <div className="btabs__btns">
                  {Object.keys(BUFFET).map(k => (
                    <button key={k} className={`btab ${activeTab === k ? "btab--on" : ""}`} onClick={() => setActiveTab(k)}>{k}</button>
                  ))}
                </div>
                <div className="btabs__body">
                  {BUFFET[activeTab].map(item => (
                    <div key={item} className="bitem"><span>◆</span>{item}</div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* GALERIJA */}
      <section id="galerija" className="sec sec--light">
        <div className="wrap">
          <Reveal style={{ textAlign: "center" }}>
            <p className="lbl">Galerija</p>
            <h2 className="sh">Atmosfera &amp; <em>Ukusi</em></h2>
          </Reveal>
          <div className="gallery">
            {[
              { e: "🥩", l: "Svež roštilj", c: "gtall" },
              { e: "🍽️", l: "Serviranje", c: "" },
              { e: "🏠", l: "Naš enterijer", c: "" },
              { e: "🌶️", l: "Domaći kajmak", c: "gwide" },
              { e: "🍷", l: "Balkanska vina", c: "" },
              { e: "🥗", l: "Šopska salata", c: "" },
            ].map((g, i) => (
              <Reveal key={g.l} delay={i * 60} style={{ display: "contents" }}>
                <div className={`gitem ${g.c}`}>
                  <span className="gitem__e">{g.e}</span>
                  <div className="gitem__ov"><span>{g.l}</span></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* UTISCI */}
      <section className="sec sec--burg">
        <div className="wrap">
          <Reveal style={{ textAlign: "center" }}>
            <p className="lbl lbl--gold">Reči naših gostiju</p>
            <h2 className="sh sh--light">Šta kažu <em>gosti</em></h2>
          </Reveal>
          <div className="revs">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <div className="rcard">
                  <div className="rcard__q">"</div>
                  <p className="rcard__txt">{t.text}</p>
                  <div className="rcard__stars">{"★".repeat(t.stars)}</div>
                  <div className="rcard__name">— {t.name}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAKT */}
      <section id="kontakt" className="sec sec--light">
        <div className="wrap">
          <Reveal style={{ textAlign: "center" }}>
            <p className="lbl">Posetite nas</p>
            <h2 className="sh">Rezervacija &amp; <em>Kontakt</em></h2>
          </Reveal>
          <div className="cgrid">
            <Reveal from="left" delay={100}>
              <div className="cinfo">
                {[["📍", "Adresa", "Musterstraße 12\n1010 Wien, Austrija"], ["📞", "Telefon", "+43 1 234 56 78"], ["✉️", "Email", "info@juzni-merak.at"]].map(([ic, l, v]) => (
                  <div key={l} className="cblock">
                    <div className="cicon">{ic}</div>
                    <div><div className="clbl">{l}</div><div className="cval">{v}</div></div>
                  </div>
                ))}
                <div className="clbl" style={{ marginBottom: ".7rem" }}>Radno vreme</div>
                <table className="htable">
                  <tbody>
                    {[["Pon – Čet", "11:00 – 22:00"], ["Pet – Sub", "11:00 – 23:00"], ["Nedela", "12:00 – 21:00"]].map(([d, t]) => (
                      <tr key={d}><td>{d}</td><td>{t}</td></tr>
                    ))}
                  </tbody>
                </table>
                <div className="delivery">
                  <span>🛵</span>
                  <div><strong>Dostava u celom Beču</strong><div>Svakog dana od 11:00 – 19:00</div></div>
                </div>
              </div>
            </Reveal>
            <Reveal from="right" delay={150}>
              <div className="rform">
                <h3 className="rform__title">Rezervišite Vaš sto</h3>
                <div className="fr2">
                  <div className="fg"><label>Ime</label><input type="text" placeholder="Vaše ime" /></div>
                  <div className="fg"><label>Prezime</label><input type="text" placeholder="Vaše prezime" /></div>
                </div>
                <div className="fr2">
                  <div className="fg"><label>Email</label><input type="email" placeholder="vasa@email.at" /></div>
                  <div className="fg"><label>Telefon</label><input type="tel" placeholder="+43 …" /></div>
                </div>
                <div className="fr2">
                  <div className="fg"><label>Datum</label><input type="date" /></div>
                  <div className="fg"><label>Vreme</label><input type="time" defaultValue="19:00" /></div>
                </div>
                <div className="fr2">
                  <div className="fg">
                    <label>Broj gostiju</label>
                    <select>{[1,2,3,4,5,6,7,"8+"].map(n => <option key={n}>{n} {n===1?"gost":"gosta"}</option>)}</select>
                  </div>
                  <div className="fg">
                    <label>Povod</label>
                    <select>{["Obična večera","Rođendan","Godišnjica","Poslovni ručak","Grupni događaj"].map(o => <option key={o}>{o}</option>)}</select>
                  </div>
                </div>
                <div className="fg"><label>Posebne napomene</label><textarea placeholder="Alergije, posebne želje, slavlje…" rows={3} /></div>
                <button className="btn btn--gold btn--lg" style={{ width: "100%", marginTop: ".5rem" }}>✓ Potvrdi rezervaciju</button>
                <p className="fnote">Ili nas pozovite: <strong>+43 1 234 56 78</strong> · Prihvatamo od 3+ osoba</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="wrap">
          <div className="fgrid">
            <div>
              <div className="flogo"><span>♨</span> Južni Merak</div>
              <div className="ftagline">Gde balkanski ukus postaje umetnost</div>
              <hr className="fdiv" />
              <p className="fdesc">Autentična balkanska kuhinja sa srcem – više od 18 godina u Beču.</p>
              <div className="fsocial">
                {["📘","📸","🐦"].map(ic => <a key={ic} href="#" className="fsoc">{ic}</a>)}
              </div>
            </div>
            <div>
              <div className="fh">Navigacija</div>
              <ul className="fnav">{NAV.map(n => <li key={n} onClick={() => goto(n)}>{n}</li>)}</ul>
            </div>
            <div>
              <div className="fh">Kontakt</div>
              <ul className="fnav">
                <li>📍 Musterstraße 12, Wien</li>
                <li>📞 +43 1 234 56 78</li>
                <li>✉️ info@juzni-merak.at</li>
              </ul>
              <div className="fh" style={{ marginTop: "1.5rem" }}>Radno vreme</div>
              <ul className="fnav">
                <li>Pon–Čet: 11–22h</li><li>Pet–Sub: 11–23h</li><li>Ned: 12–21h</li>
              </ul>
            </div>
          </div>
          <div className="fbot">
            <span>© {new Date().getFullYear()} Južni Merak · Sva prava zadržana</span>
            <span>Privatnost · Impressum</span>
          </div>
        </div>
      </footer>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Raleway:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --dk:#130B05; --dk2:#1E1008; --burg:#5C1520; --terra:#B8572A;
  --gold:#C9973A; --goldl:#E0B860; --cr:#F5ECD7; --cr2:#EDD9B0;
  --tx:#3A2010; --txs:#7A5C3A;
}
html{scroll-behavior:smooth;}
body{font-family:'Raleway',sans-serif;background:var(--cr);color:var(--tx);overflow-x:hidden;}
body::after{content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E");opacity:.5;mix-blend-mode:overlay;}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:0 3rem;height:80px;transition:background .4s,box-shadow .4s;}
.nav--solid{background:rgba(19,11,5,.97);backdrop-filter:blur(16px);box-shadow:0 2px 40px rgba(0,0,0,.4);}
.nav__logo{display:flex;align-items:center;gap:.9rem;cursor:pointer;}
.nav__flame{font-size:1.8rem;color:var(--gold);}
.nav__name{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:var(--gold);line-height:1;}
.nav__sub{font-size:.6rem;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:rgba(245,236,215,.4);}
.nav__links{display:flex;align-items:center;gap:2.5rem;}
.nav__link{font-size:.72rem;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:rgba(245,236,215,.75);text-decoration:none;cursor:pointer;position:relative;padding-bottom:3px;transition:color .3s;}
.nav__link::after{content:'';position:absolute;bottom:0;left:0;height:1px;width:0;background:var(--gold);transition:width .3s;}
.nav__link:hover{color:var(--gold);}.nav__link:hover::after{width:100%;}
.nav__right{display:flex;align-items:center;gap:1rem;}
.mob-reserve{display:none;}.burger{display:none;flex-direction:column;gap:5px;cursor:pointer;background:none;border:none;padding:4px;}
.burger span{display:block;width:24px;height:2px;background:var(--cr);transition:.3s;transform-origin:center;}

/* BUTTONS */
.btn{padding:.8rem 2rem;font-family:'Raleway',sans-serif;font-size:.72rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;border:none;cursor:pointer;transition:all .25s;}
.btn--gold{background:var(--gold);color:var(--dk);}
.btn--gold:hover{background:var(--goldl);transform:translateY(-2px);box-shadow:0 10px 30px rgba(201,151,58,.35);}
.btn--outline{background:transparent;color:var(--cr);border:1px solid rgba(245,236,215,.35);}
.btn--outline:hover{border-color:var(--gold);color:var(--gold);transform:translateY(-2px);}
.btn--lg{padding:1rem 2.8rem;font-size:.8rem;}

/* HERO */
.hero{position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;background:linear-gradient(160deg,#0D0600 0%,#1E0A05 40%,#3D0E14 80%,#1A0508 100%);}
.hero__bg{position:absolute;inset:0;}
.hero__glow{position:absolute;bottom:-20%;left:50%;transform:translateX(-50%);width:120vw;height:80vh;border-radius:50%;background:radial-gradient(ellipse at 50% 100%,rgba(180,70,20,.35) 0%,rgba(100,20,10,.2) 40%,transparent 70%);animation:gp 4s ease-in-out infinite;}
@keyframes gp{0%,100%{opacity:.7;transform:translateX(-50%) scale(1);}50%{opacity:1;transform:translateX(-50%) scale(1.05);}}
.hero__grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,151,58,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,151,58,.03) 1px,transparent 1px);background-size:60px 60px;}
.hero__body{position:relative;z-index:2;text-align:center;padding:0 2rem;padding-bottom:100px;}
.hero__badge{display:inline-block;padding:.5rem 1.5rem;border:1px solid rgba(201,151,58,.3);background:rgba(201,151,58,.08);font-size:.68rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--gold);border-radius:99px;margin-bottom:2rem;animation:fu 1s ease .2s both;}
.hero__h1{font-family:'Playfair Display',serif;font-size:clamp(4rem,12vw,9rem);font-weight:900;line-height:.9;color:var(--cr);animation:fu 1s ease .4s both;}
.hero__h1 em{font-style:italic;color:var(--gold);display:block;}
.hero__rule{display:flex;align-items:center;justify-content:center;gap:1.5rem;margin:1.5rem 0;animation:fu 1s ease .55s both;}
.hero__rule span{height:1px;width:100px;background:linear-gradient(to right,transparent,rgba(201,151,58,.5));}
.hero__rule span:last-child{background:linear-gradient(to left,transparent,rgba(201,151,58,.5));}
.hero__diamond{color:var(--gold);font-size:.8rem;}
.hero__tagline{font-family:'Cormorant Garamond',serif;font-size:clamp(1.1rem,2.5vw,1.6rem);font-style:italic;color:rgba(245,236,215,.6);animation:fu 1s ease .65s both;}
.hero__btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:2.5rem;animation:fu 1s ease .8s both;}
.hero__scroll{position:absolute;bottom:90px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:.5rem;color:rgba(245,236,215,.35);font-size:.6rem;letter-spacing:3px;text-transform:uppercase;cursor:pointer;animation:fu 1s ease 1.1s both;}
.hero__line{width:1px;height:50px;background:linear-gradient(to bottom,transparent,rgba(201,151,58,.5));animation:sa 2s ease-in-out infinite;}
@keyframes sa{0%,100%{opacity:.3;transform:scaleY(.6);}50%{opacity:1;transform:scaleY(1);}}
.hero__band{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:center;background:rgba(0,0,0,.4);backdrop-filter:blur(10px);border-top:1px solid rgba(201,151,58,.15);animation:fu 1s ease 1s both;}
.hero__stat{flex:1;max-width:200px;padding:1.5rem 2rem;text-align:center;border-right:1px solid rgba(201,151,58,.12);}
.hero__stat:last-child{border-right:none;}
.hero__stat strong{display:block;font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:var(--gold);}
.hero__stat span{font-size:.65rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(245,236,215,.4);margin-top:.2rem;display:block;}
@keyframes fu{from{opacity:0;transform:translateY(25px);}to{opacity:1;transform:none;}}

/* SHARED */
.sec{padding:7rem 2rem;}
.sec--light{background:var(--cr);}
.sec--dark{background:var(--dk2);}
.sec--burg{background:var(--burg);}
.sec--fire{background:linear-gradient(135deg,#1A0B05,#350D0D);}
.wrap{max-width:1200px;margin:0 auto;}
.lbl{font-size:.68rem;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--terra);margin-bottom:.8rem;}
.lbl--gold{color:var(--gold);}
.sh{font-family:'Playfair Display',serif;font-size:clamp(2.2rem,5vw,3.8rem);font-weight:900;line-height:1.1;color:var(--dk);}
.sh em{font-style:italic;color:var(--burg);}
.sh--light{color:var(--cr);}
.sh--light em{color:var(--gold);}
.sub{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-style:italic;color:rgba(245,236,215,.6);margin-top:.8rem;}

/* ABOUT */
.about{display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:center;margin-top:4rem;}
.about__vis{position:relative;height:480px;}
.about__main{position:absolute;inset:0 60px 60px 0;background:linear-gradient(135deg,var(--burg),var(--dk));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.8rem;}
.about__main span{font-size:4rem;}
.about__main-label{font-size:.68rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);padding:.4rem 1.2rem;border:1px solid rgba(201,151,58,.3);background:rgba(201,151,58,.08);border-radius:99px;}
.about__accent{position:absolute;width:155px;height:155px;bottom:-25px;right:0;background:var(--gold);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4rem;font-size:.68rem;font-weight:700;color:var(--dk);text-transform:uppercase;letter-spacing:1px;}
.about__accent span{font-size:2.4rem;}
.about__frame{position:absolute;top:20px;left:20px;right:80px;bottom:80px;border:1px solid rgba(201,151,58,.2);pointer-events:none;}
.about__txt{padding-left:1rem;}
.ap{font-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.9;color:var(--txs);margin-top:1.2rem;}
.pillars{margin-top:2.5rem;display:flex;flex-direction:column;gap:1.2rem;}
.pillar{display:flex;gap:1rem;align-items:flex-start;padding:1rem;background:rgba(93,21,32,.04);border-left:2px solid var(--gold);}
.pillar__ic{font-size:1.4rem;flex-shrink:0;}
.pillar__t{font-weight:700;font-size:.85rem;letter-spacing:.5px;color:var(--dk);margin-bottom:.2rem;}
.pillar__d{font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--txs);}

/* MENU */
.mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1px;margin-top:4rem;background:rgba(201,151,58,.1);border:1px solid rgba(201,151,58,.1);}
.mcard{background:var(--dk2);padding:2.2rem;display:flex;flex-direction:column;gap:.8rem;position:relative;transition:background .35s;}
.mcard:hover{background:#281208;}
.mcard__tag{position:absolute;top:1rem;right:1rem;padding:.3rem .9rem;background:var(--gold);color:var(--dk);font-size:.6rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;border-radius:99px;}
.mcard__emo{font-size:2.5rem;}
.mcard__name{font-family:'Playfair Display',serif;font-size:1.35rem;color:var(--cr);}
.mcard__desc{font-family:'Cormorant Garamond',serif;font-size:1rem;line-height:1.7;color:rgba(245,236,215,.5);flex:1;}
.mcard__foot{border-top:1px solid rgba(201,151,58,.12);padding-top:.8rem;margin-top:.5rem;}
.mcard__price{font-family:'Playfair Display',serif;font-size:1.25rem;color:var(--gold);}
.menu-note{font-family:'Cormorant Garamond',serif;font-style:italic;color:rgba(245,236,215,.35);font-size:1rem;margin-bottom:1.5rem;}

/* BUFFET */
.buff{display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:start;}
.buff__intro{font-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.8;color:rgba(245,236,215,.65);margin-top:1rem;}
.buff__intro strong{color:var(--gold);}
.buff__prices{display:flex;gap:1rem;margin-top:2rem;flex-wrap:wrap;}
.bpcard{flex:1;min-width:140px;padding:1.5rem;border:1px solid rgba(201,151,58,.2);text-align:center;}
.bpcard--hi{border-color:var(--gold);background:rgba(201,151,58,.05);}
.bpcard__day{font-size:.65rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(245,236,215,.5);margin-bottom:.5rem;}
.bpcard__amt{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;color:var(--gold);}
.bpcard__note{font-size:.7rem;color:rgba(245,236,215,.35);margin-top:.2rem;}
.btabs{background:rgba(0,0,0,.3);border:1px solid rgba(201,151,58,.15);}
.btabs__btns{display:flex;flex-wrap:wrap;border-bottom:1px solid rgba(201,151,58,.15);}
.btab{flex:1;min-width:80px;padding:.9rem .4rem;background:none;border:none;border-right:1px solid rgba(201,151,58,.1);font-family:'Raleway',sans-serif;font-size:.63rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(245,236,215,.4);cursor:pointer;transition:all .2s;}
.btab:last-child{border-right:none;}
.btab--on{color:var(--gold);background:rgba(201,151,58,.08);}
.btabs__body{padding:2rem;}
.bitem{display:flex;gap:.8rem;align-items:center;font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:rgba(245,236,215,.75);padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.04);}
.bitem span{color:var(--gold);font-size:.6rem;}

/* GALLERY */
.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:4rem;}
.gitem{background:linear-gradient(135deg,var(--burg),var(--dk));display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;cursor:pointer;transition:transform .35s;aspect-ratio:4/3;}
.gitem:hover{transform:scale(1.03);z-index:2;}
.gitem:hover .gitem__ov{opacity:1;}
.gtall{grid-row:span 2;aspect-ratio:auto;}
.gwide{grid-column:span 2;}
.gitem__e{font-size:3.5rem;position:relative;z-index:1;}
.gitem__ov{position:absolute;inset:0;background:rgba(92,21,32,.8);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;font-family:'Playfair Display',serif;font-style:italic;color:var(--cr);font-size:1.1rem;}

/* REVIEWS */
.revs{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-top:4rem;}
.rcard{padding:2.5rem;border:1px solid rgba(201,151,58,.2);position:relative;background:rgba(0,0,0,.15);}
.rcard__q{position:absolute;top:-5px;left:1.5rem;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(201,151,58,.1);line-height:1;}
.rcard__txt{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-style:italic;line-height:1.8;color:rgba(245,236,215,.8);margin-bottom:1.2rem;}
.rcard__stars{color:var(--gold);letter-spacing:3px;font-size:.9rem;}
.rcard__name{font-family:'Raleway',sans-serif;font-size:.72rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-top:.7rem;}

/* CONTACT */
.cgrid{display:grid;grid-template-columns:1fr 1.3fr;gap:5rem;margin-top:4rem;align-items:start;}
.cinfo{}
.cblock{display:flex;gap:1.2rem;align-items:flex-start;margin-bottom:2rem;}
.cicon{width:48px;height:48px;flex-shrink:0;background:var(--burg);display:flex;align-items:center;justify-content:center;font-size:1.2rem;}
.clbl{font-size:.62rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--terra);margin-bottom:.3rem;}
.cval{font-family:'Cormorant Garamond',serif;font-size:1.15rem;color:var(--tx);line-height:1.6;white-space:pre-line;}
.htable{width:100%;border-collapse:collapse;margin-bottom:1.5rem;}
.htable tr{border-bottom:1px solid rgba(196,98,45,.1);}
.htable td{padding:.5rem 0;font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:var(--tx);}
.htable td:last-child{text-align:right;color:var(--txs);}
.delivery{display:flex;gap:1rem;align-items:center;padding:1.2rem;background:rgba(93,21,32,.06);border-left:3px solid var(--gold);}
.delivery span{font-size:1.5rem;}
.delivery strong{font-size:.85rem;color:var(--dk);display:block;}
.delivery div > div{font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--txs);}
.rform{background:white;padding:2.5rem;box-shadow:0 20px 60px rgba(0,0,0,.08);}
.rform__title{font-family:'Playfair Display',serif;font-size:1.7rem;color:var(--dk);margin-bottom:1.5rem;}
.fr2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
.fg{display:flex;flex-direction:column;gap:.35rem;margin-bottom:1rem;}
.fg label{font-size:.62rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--txs);}
.fg input,.fg textarea,.fg select{padding:.8rem 1rem;border:1px solid rgba(196,98,45,.2);background:#fafaf8;font-family:'Cormorant Garamond',serif;font-size:1.05rem;color:var(--tx);outline:none;transition:border-color .2s;width:100%;}
.fg input:focus,.fg textarea:focus,.fg select:focus{border-color:var(--burg);}
.fg textarea{resize:vertical;}
.fnote{font-family:'Cormorant Garamond',serif;font-size:.95rem;color:var(--txs);text-align:center;margin-top:1rem;font-style:italic;}

/* FOOTER */
.foot{background:var(--dk);padding:5rem 2rem 2rem;border-top:1px solid rgba(201,151,58,.1);}
.fgrid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:4rem;}
.flogo{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:var(--gold);display:flex;align-items:center;gap:.5rem;}
.ftagline{font-family:'Cormorant Garamond',serif;font-style:italic;color:rgba(245,236,215,.35);margin-top:.5rem;}
.fdiv{border:none;border-top:1px solid rgba(201,151,58,.15);margin:1.2rem 0;}
.fdesc{font-family:'Cormorant Garamond',serif;color:rgba(245,236,215,.35);font-size:.95rem;line-height:1.7;}
.fsocial{display:flex;gap:.8rem;margin-top:1.5rem;}
.fsoc{width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(201,151,58,.25);font-size:1rem;text-decoration:none;transition:all .2s;color:rgba(245,236,215,.5);}
.fsoc:hover{border-color:var(--gold);color:var(--gold);}
.fh{font-size:.65rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:1.2rem;}
.fnav{list-style:none;display:flex;flex-direction:column;gap:.8rem;}
.fnav li{font-family:'Cormorant Garamond',serif;font-size:1.05rem;color:rgba(245,236,215,.45);cursor:pointer;transition:color .2s;}
.fnav li:hover{color:var(--gold);}
.fbot{margin-top:3rem;padding-top:1.5rem;border-top:1px solid rgba(201,151,58,.08);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
.fbot span{font-size:.65rem;color:rgba(245,236,215,.2);letter-spacing:1px;}

/* MOBILE */
@media(max-width:900px){
  .nav{padding:0 1.5rem;}
  .nav__links{display:none;}
  .nav__links.open{display:flex;flex-direction:column;align-items:center;justify-content:center;position:fixed;inset:0;top:80px;background:rgba(13,6,0,.98);gap:2.5rem;z-index:999;}
  .nav__link{font-size:1.1rem;}
  .mob-reserve{display:block;}
  .burger{display:flex;}
  .desk-reserve{display:none;}
  .about,.buff,.cgrid{grid-template-columns:1fr;gap:3rem;}
  .about__vis{height:280px;}
  .about__accent{width:120px;height:120px;}
  .mgrid{grid-template-columns:1fr;}
  .gallery{grid-template-columns:1fr 1fr;}
  .gtall,.gwide{grid-column:span 1;grid-row:span 1;aspect-ratio:4/3;}
  .fgrid{grid-template-columns:1fr;gap:2.5rem;}
  .hero__band{display:none;}
  .fr2{grid-template-columns:1fr;}
  .fbot{flex-direction:column;text-align:center;}
  .hero__body{padding-bottom:2rem;}
  .hero__scroll{bottom:2rem;}
}
@media(max-width:480px){
  .hero__h1{font-size:3.5rem;}
  .hero__btns{flex-direction:column;align-items:center;}
  .buff__prices{flex-direction:column;}
}
`;