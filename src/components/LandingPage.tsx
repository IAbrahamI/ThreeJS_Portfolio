import { useEffect, useRef, useState } from 'react';

/**
 * One-page portfolio landing shown before the 3D experience. Responsive and
 * theme-aware (dark / light, turquoise accent). "Switch to 3D Portfolio" hands
 * off to the 3D title screen. Image "DROP" slots are intentionally left empty
 * for screenshots to be added later.
 */

const GH = 'https://github.com/IAbrahamI';

const PROJECTS = [
  { id: 'P/01', name: 'Selfhosted Server', cat: 'Infrastructure', kind: 'SELF-HOSTED', url: `${GH}/selfhostedServer`, img: '/assets/selfHosted.png',
    desc: 'Infrastructure as code. Every config and script I use to set up and run my own server, reproducibly.', tech: ['Docker', 'Linux', 'Nginx'] },
  { id: 'P/02', name: 'Kuroro', cat: 'Mobile App', kind: 'MOBILE', url: `${GH}/Kuroro`, img: '/assets/KuroroApp.jpg',
    desc: 'A mobile app that reads manga from my personal API, so my whole library travels with me.', tech: ['Mobile', 'REST API'] },
  { id: 'P/03', name: 'Pentest Assistant', cat: 'Security Tooling', kind: 'SECURITY', url: `${GH}/Pentest_Assistant`, img: '/assets/PentestAssistant.png',
    desc: 'Tooling that streamlines security assessments and penetration testing tasks, from recon to reporting.', tech: ['Python', 'Security'] },
  { id: 'P/04', name: 'Portfolio 2026', cat: 'Interactive 3D', kind: 'WEB', url: `${GH}/ThreeJS_Portfolio`, img: '/assets/3DPortfolio.png',
    desc: 'This world. An interactive 3D portfolio you can walk through, built with React, Three.js and Rapier physics.', tech: ['React', 'Three.js', 'Rapier'] },
  { id: 'P/05', name: 'Password Manager', cat: 'Applied Security', kind: 'SOLO', url: `${GH}/Password_Manager`, img: '/assets/Password_Manager.png',
    desc: 'A secure password manager, designed and built entirely from scratch.', tech: ['Encryption', 'From scratch'] },
  { id: 'P/06', name: 'Manga API Server', cat: 'Backend / API', kind: 'SELF-HOSTED', url: `${GH}/MangaAPIServer`, img: '/assets/mangaAPI.png',
    desc: 'A self-hosted API that serves manga data, running on my own server and powering Kuroro.', tech: ['Node', 'API', 'Self-hosted'] },
];

const EXPERIENCE = [
  { period: '2025 to Present', role: 'BSc Information & Cybersecurity', org: 'Hochschule Luzern',
    bullets: ['Majoring into cybersecurity: pentesting, secure architecture, cloud and mobile security.', 'In parallel, working 60% at Julius Baer as a Secure Architect and Software Engineer.', 'Continuously building personal projects to deepen my security skills.'] },
  { period: '2022 to 2024', role: 'Software Engineer', org: 'Julius Baer',
    bullets: ['Developed and monitored new automated Python scripts in Kibana.', 'Managed access rights for all end users and applications.', 'Implemented a new approach to simplify the onboarding of end users.'] },
  { period: '2021 to 2022', role: 'Internship, Software Engineering', org: 'Julius Baer',
    bullets: ['Implemented automations with Python scripts that run weekly.', 'First hands on approach with big data clusters and analysis.', 'Worked in an agile team. This internship completed my final degree.'] },
  { period: '2018 to 2021', role: 'IMS (Informatikmittelschule)', org: 'KBW',
    bullets: ['Learned the basics of programming with Java and JavaScript.', 'Studied Law, Science, Maths and Languages.', 'Built projects in teams using Scrum and an agile approach.'] },
];

const SKILLS_A = [
  ['S/01', 'Python', 'EXPERT'], ['S/02', 'JavaScript & TypeScript', 'STRONG'], ['S/03', 'Java', 'STRONG'],
  ['S/04', 'Docker & Kubernetes', 'STRONG'], ['S/05', 'SQL & Databases', 'STRONG'], ['S/06', 'Git & Version Control', 'EXPERT'],
];
const SKILLS_B = [
  ['S/07', 'Shell Scripting', 'STRONG'], ['S/08', 'Pentesting & Security Testing', 'WORKING'], ['S/09', 'Secure Architecture & Cloud', 'WORKING'],
  ['S/10', 'Agile & Scrum', 'STRONG'], ['S/11', 'Blender 3D', 'WORKING'], ['S/12', 'AI-assisted Dev (Claude Code)', 'DAILY'],
];

const CONTACT = [
  { label: 'EMAIL', value: 'abraham.neidhardt@proton.me', url: 'mailto:abraham.neidhardt@proton.me' },
  { label: 'GITHUB', value: 'github.com/IAbrahamI', url: GH },
  { label: 'INSTAGRAM', value: 'instagram.com/ab_neid_', url: 'https://instagram.com/ab_neid_' },
  { label: 'WEBSITE', value: 'abraham-neidhardt.com', url: 'https://abraham-neidhardt.com' },
  { label: 'LOCATED', value: 'Switzerland (CET)', url: null as string | null },
];

const STATS = [
  ['6', 'PROJECTS SHIPPED'], ['12', 'SKILLS IN LOADOUT'], ['4', 'LANGUAGES SPOKEN'], ['60%', 'ENGINEERING ROLE'],
];

const NAV = [['about', 'ABOUT'], ['work', 'PROJECTS'], ['experience', 'EXPERIENCE'], ['skills', 'SKILLS'], ['contact', 'CONTACT']] as const;

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('an-portfolio-theme') !== 'light'; } catch { return true; }
  });
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  // The 3D world needs a mouse + keyboard (pointer-lock, WASD), so only offer it
  // on PCs and laptops — devices that report a fine pointer with hover.
  const [isPC] = useState(() => {
    try { return window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch { return true; }
  });

  useEffect(() => {
    try { localStorage.setItem('an-portfolio-theme', dark ? 'dark' : 'light'); } catch { /* ignore */ }
  }, [dark]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onScroll = () => {
      const max = Math.max(1, root.scrollHeight - root.clientHeight);
      setProgress(Math.min(100, (root.scrollTop / max) * 100));
      let active = 'about';
      for (const [id] of NAV) {
        const el = root.querySelector<HTMLElement>(`#${id}`);
        if (el && el.getBoundingClientRect().top <= 160) active = id;
      }
      setSection(active);
    };
    root.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => root.removeEventListener('scroll', onScroll);
  }, []);

  // Reveal blocks on scroll (both directions), with a light per-sibling stagger.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const sel = '.lp-sechead, .lp-hero-grid > div, .lp-stat, .lp-prow, .lp-pcard, .lp-xp, .lp-skillcol, .lp-contact-grid > div';
    const targets = Array.from(root.querySelectorAll<HTMLElement>(sel));
    targets.forEach((el) => {
      const idx = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
      el.style.transitionDelay = `${Math.min(Math.max(idx, 0), 6) * 55}ms`;
      el.classList.add('lp-reveal');
    });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('lp-in', e.isIntersecting)),
      { root, rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    rootRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lp-root" ref={rootRef} data-theme={dark ? 'dark' : 'light'}>
      <style>{CSS}</style>

      <div aria-hidden className="lp-grid-bg" />
      <Deco />
      <div className="lp-progress"><div className="lp-progress-fill" style={{ width: `${progress}%` }} /></div>

      {/* Top nav */}
      <div className="lp-nav">
        <div className="lp-brand"><span className="lp-brand-dot" />ABRAHAM // NEIDHARDT</div>
        <div className="lp-nav-meta">
          <span className="lp-mt">[SWE_SEC]</span>
          <span>SOFTWARE ENGINEER / SECURITY</span>
          <span className="lp-mt">SWITZERLAND · CET</span>
        </div>
        <button type="button" className="lp-burger" aria-label="Menu" aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}>{menuOpen ? '✕' : '☰'}</button>
        <div className={`lp-nav-actions ${menuOpen ? 'lp-open' : ''}`}>
          <div className="lp-nav-links">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id); }}
                 className={section === id ? 'lp-navlink lp-on' : 'lp-navlink'}>{label}</a>
            ))}
          </div>
          {isPC && <button type="button" className="lp-3dbtn" onClick={onEnter}>◈ 3D PORTFOLIO</button>}
          <button type="button" className="lp-theme" onClick={() => setDark((d) => !d)}>
            <span className="lp-theme-dot" />{dark ? 'LIGHT MODE' : 'DARK MODE'}
          </button>
        </div>
      </div>

      {/* HUD */}
      <div aria-hidden className="lp-hud">
        <span>SCROLL {String(Math.round(progress)).padStart(3, '0')}%</span>
        <span>SEC//{section.toUpperCase()}</span>
        <span className="lp-hud-live"><span className="lp-blink" />LINK SECURE</span>
      </div>

      {/* ABOUT / HERO */}
      <section id="about" className="lp-section">
        <div className="lp-wrap">
          <div className="lp-eyebrow">
            <span><span className="lp-blink" /> SYS.ONLINE // OPEN TO 2026 ENGINEERING & SECURITY ROLES</span>
            <span className="lp-mt">FILE 00 · OPERATOR DOSSIER</span>
          </div>
          <h1 className="lp-hero">ABRAHAM<br /><span className="lp-ac">NEIDHARDT</span></h1>
          <div className="lp-hero-grid">
            <div>
              <p className="lp-lead">Software engineer studying cybersecurity. Building systems in the morning, and learning how to break them in the afternoon.</p>
              <p className="lp-body">I am a software engineer passionate about modern architecture, agile environments and modern security practices. Currently balancing a 60% engineering role while pursuing a degree in Cybersecurity, I bridge the gap between building scalable software and protecting it. As a native Spanish speaker fluent in English and German, with a working knowledge of French, I bring a global perspective to international teams.</p>
              <div className="lp-cta-row">
                <button type="button" className="lp-cta-primary" onClick={isPC ? onEnter : () => go('work')}>
                  {isPC ? 'SWITCH TO 3D PORTFOLIO →' : 'VIEW PROJECTS →'}
                </button>
                <a href="#contact" onClick={(e) => { e.preventDefault(); go('contact'); }} className="lp-cta-ghost">GET IN TOUCH</a>
              </div>
            </div>
            <div className="lp-card">
              {[['ROLE', 'Secure Architect & Software Engineer'], ['STUDYING', 'BSc Information & Cybersecurity'], ['BASED', 'Switzerland'], ['FOCUS', 'Pentesting · Cloud & Mobile Security'], ['LANGUAGES', 'ES · EN · DE · FR']].map(([k, v], i, a) => (
                <div key={k} className="lp-card-row" style={i === a.length - 1 ? { borderBottom: 'none' } : undefined}>
                  <span className="lp-mt lp-mono">{k}</span><span className="lp-card-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lp-stats">
            {STATS.map(([n, l], i) => (
              <div key={l} className="lp-stat">
                <div className="lp-stat-n" style={i === 2 ? { color: 'var(--lp-ac)' } : undefined}>{n}</div>
                <div className="lp-mt lp-mono lp-stat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="lp-marquee">
          <div className="lp-marquee-track">
            {[0, 1].map((k) => (
              <span key={k} className="lp-mono">
                <span>◆ SOFTWARE ENGINEERING</span><span className="lp-ac">◆ CYBERSECURITY</span><span>◆ PENTESTING</span><span>◆ SECURE ARCHITECTURE</span><span>◆ CLOUD SECURITY</span><span>◆ MOBILE SECURITY</span><span className="lp-ac">◆ BSC INFOSEC</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="work" className="lp-section">
        <div className="lp-wrap">
          <SectionHead tag="[01//SELECTED PROJECTS]" title="PROJECTS" note="THE ONES I STILL THINK ABOUT" />
          <div className="lp-plist">
            {PROJECTS.map((p) => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="lp-prow">
                <span className="lp-mt">{p.id}</span>
                <span className="lp-prow-name">{p.name}</span>
                <span className="lp-mt">{p.cat}</span>
                <span className="lp-ac">{p.kind}</span>
                <span className="lp-prow-arrow">→</span>
              </a>
            ))}
          </div>
          <div className="lp-pcards">
            {PROJECTS.map((p) => (
              <div key={p.id} className="lp-pcard">
                <div className="lp-pcard-head lp-mono lp-mt"><span>{p.id} · {p.cat.toUpperCase()}</span><span className="lp-ac">{p.kind}</span></div>
                <h3 className="lp-pcard-title">{p.name}</h3>
                <p className="lp-body lp-pcard-desc">{p.desc}</p>
                <div className="lp-shot"><img src={p.img} alt={p.name} loading="lazy" /></div>
                <div className="lp-tags">{p.tech.map((t) => <span key={t} className="lp-tag lp-mono">{t}</span>)}</div>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="lp-pcard-link lp-mono">OPEN ON GITHUB →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="lp-section">
        <div className="lp-wrap">
          <SectionHead tag="[02//SERVICE RECORD]" title="EXPERIENCE" note="2018 to Present" />
          {EXPERIENCE.slice().reverse().map((e) => (
            <div key={e.role} className="lp-xp">
              <div className="lp-xp-period lp-mono lp-ac">{e.period}</div>
              <div>
                <h3 className="lp-xp-role">{e.role}</h3>
                <div className="lp-mt lp-mono lp-xp-org">{e.org}</div>
              </div>
              <div className="lp-xp-bullets lp-mono">
                {e.bullets.map((b) => <div key={b}><span className="lp-ac">▸ </span>{b}</div>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="lp-section">
        <div className="lp-wrap">
          <SectionHead tag="[03//SPEC SHEET]" title="SKILLS" note="CAPABILITY LOADOUT" />
          <div className="lp-skills">
            {[SKILLS_A, SKILLS_B].map((col, ci) => (
              <div key={ci} className="lp-skillcol">
                {col.map(([id, name, lvl], i) => (
                  <div key={id} className="lp-skill" style={i === col.length - 1 ? { borderBottom: 'none' } : undefined}>
                    <span className="lp-mt lp-mono">{id}</span>
                    <span>{name}</span>
                    <span className={`lp-mono lp-skill-lvl ${lvl === 'EXPERT' || lvl === 'DAILY' ? 'lp-ac' : 'lp-mt'}`}>{lvl}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="lp-section">
        <div className="lp-wrap">
          <SectionHead tag="[04//OPEN CHANNEL]" title="CONTACT" note="REPLY WITHIN TWO DAYS" />
          <div className="lp-contact-grid">
            <div>
              <div className="lp-contact-big">LET'S BUILD IT,<br /><span className="lp-ac">THEN SECURE IT</span></div>
              <p className="lp-lead" style={{ maxWidth: '38ch' }}>Happy to talk about engineering and security roles, a project, or anything worth building.</p>
            </div>
            <div className="lp-contact-list">
              {CONTACT.map((c) => c.url ? (
                <a key={c.label} href={c.url} target="_blank" rel="noopener noreferrer" className="lp-contact-row">
                  <span className="lp-mt lp-mono">{c.label}</span><span className="lp-contact-val">{c.value}</span><span className="lp-contact-arrow">→</span>
                </a>
              ) : (
                <div key={c.label} className="lp-contact-row lp-contact-static">
                  <span className="lp-mt lp-mono">{c.label}</span><span className="lp-contact-val">{c.value}</span><span />
                </div>
              ))}
            </div>
          </div>
          <div className="lp-footer lp-mono lp-mt">
            <span>ABRAHAM NEIDHARDT · PORTFOLIO 2026</span>
            <span>BUILT AND DESIGNED BY HAND</span>
            <button type="button" className="lp-foot-3d" onClick={onEnter}>ENTER 3D PORTFOLIO →</button>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Subtle sci-fi HUD ornaments in the empty side gutters (desktop only). */
function Deco() {
  return (
    <div aria-hidden className="lp-deco">
      <span className="lp-corner lp-corner-tl" />
      <span className="lp-corner lp-corner-tr" />
      <span className="lp-corner lp-corner-bl" />
      <span className="lp-corner lp-corner-br" />

      {/* Left: measurement rail with a small reticle. */}
      <svg className="lp-rail-l" viewBox="0 0 44 300" fill="none">
        <circle cx="15" cy="18" r="9" stroke="currentColor" strokeWidth="1" />
        <circle cx="15" cy="18" r="2.4" fill="currentColor" />
        <line x1="15" y1="34" x2="15" y2="292" stroke="currentColor" strokeWidth="1" />
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={i} x1="15" y1={44 + i * 19} x2={i % 2 ? 23 : 31} y2={44 + i * 19} stroke="currentColor" strokeWidth="1" />
        ))}
      </svg>

      {/* Right: slowly rotating segmented ring. */}
      <svg className="lp-ring" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="1.6" strokeDasharray="70 26 46 26 30 26" />
        <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="3 9" opacity="0.7" />
        <circle cx="60" cy="60" r="6" stroke="currentColor" strokeWidth="1.4" />
        <line x1="60" y1="0" x2="60" y2="15" stroke="currentColor" strokeWidth="1.6" />
      </svg>

      {/* Right: dashed tick column. */}
      <svg className="lp-rail-r" viewBox="0 0 20 224" fill="none">
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={i} x1="10" y1={6 + i * 12} x2="10" y2={12 + i * 12} stroke="currentColor" strokeWidth="2" opacity={i % 3 ? 0.35 : 0.9} />
        ))}
      </svg>
    </div>
  );
}

function SectionHead({ tag, title, note }: { tag: string; title: string; note: string }) {
  return (
    <div className="lp-sechead">
      <span className="lp-mt lp-mono">{tag}</span>
      <h2 className="lp-sectitle">{title}</h2>
      <span className="lp-mt lp-mono lp-sechead-note">{note}</span>
    </div>
  );
}

const CSS = `
.lp-root { position:fixed; inset:0; height:100vh; overflow-y:auto; overflow-x:hidden; scroll-behavior:smooth;
  font-family:'Archivo',Helvetica,sans-serif; background:var(--lp-bg); color:var(--lp-tx); z-index:100; }
.lp-root[data-theme="dark"] { --lp-bg:#0C0D10; --lp-tx:#EAF1F0; --lp-mt:#7C8A89; --lp-dv:#23292C; --lp-ac:#3DE0D0; --lp-hd:rgba(12,13,16,0.9); --lp-drop:rgba(255,255,255,0.05); }
.lp-root[data-theme="light"] { --lp-bg:#F5F7F6; --lp-tx:#132322; --lp-mt:#5C6B69; --lp-dv:#E1E6E4; --lp-ac:#1488C9; --lp-hd:rgba(245,247,246,0.9); --lp-drop:rgba(0,0,0,0.045); }
.lp-root * { box-sizing:border-box; }
.lp-mono { font-family:'JetBrains Mono',monospace; }
.lp-mt { color:var(--lp-mt); }
.lp-ac { color:var(--lp-ac); }
.lp-grid-bg { position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.5;
  background-image:linear-gradient(90deg,var(--lp-dv) 1px,transparent 1px); background-size:88px 100%; }
.lp-progress { position:fixed; top:0; left:0; right:0; height:2px; z-index:160; }
.lp-progress-fill { height:100%; background:var(--lp-ac); transition:width .1s linear; }

.lp-nav { position:fixed; top:2px; left:0; right:0; z-index:150; display:flex; align-items:stretch; min-height:44px; flex-wrap:wrap;
  border-bottom:1px solid var(--lp-dv); background:var(--lp-hd); backdrop-filter:blur(8px);
  font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; }
.lp-brand { display:flex; align-items:center; gap:10px; padding:0 16px; background:var(--lp-ac); color:var(--lp-bg); font-weight:700; }
.lp-brand-dot { width:8px; height:8px; background:var(--lp-bg); }
.lp-nav-meta { display:flex; align-items:center; gap:20px; padding:8px 20px; color:var(--lp-tx); flex:1; min-width:200px; }
.lp-nav-actions { display:flex; align-items:stretch; }
.lp-burger { display:none; border:0; border-left:1px solid var(--lp-dv); background:transparent; color:var(--lp-tx); font-size:18px; line-height:1; padding:0 18px; cursor:pointer; min-height:44px; }
.lp-nav-links { display:flex; align-items:center; gap:18px; padding:8px 20px; border-left:1px solid var(--lp-dv); }
.lp-navlink { color:var(--lp-tx); text-decoration:none; opacity:.7; }
.lp-navlink:hover { color:var(--lp-ac); opacity:1; }
.lp-navlink.lp-on { color:var(--lp-ac); opacity:1; }
.lp-theme, .lp-3dbtn { display:flex; align-items:center; gap:9px; padding:0 16px; border:0; border-left:1px solid var(--lp-dv);
  background:transparent; color:var(--lp-tx); font:inherit; letter-spacing:.14em; text-transform:uppercase; cursor:pointer; min-height:44px; }
.lp-theme:hover, .lp-3dbtn:hover { background:var(--lp-ac); color:var(--lp-bg); }
.lp-3dbtn { font-weight:700; }
.lp-theme-dot { width:8px; height:8px; border:1px solid currentColor; }

.lp-hud { position:fixed; right:18px; bottom:16px; z-index:155; display:grid; gap:4px; justify-items:end;
  font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--lp-ac); pointer-events:none; }
.lp-hud-live { display:flex; align-items:center; gap:6px; }
.lp-blink { width:5px; height:5px; background:var(--lp-ac); display:inline-block; animation:lp-blink 1.6s steps(1) infinite; }

.lp-section { position:relative; z-index:2; padding:72px 40px; border-bottom:1px solid var(--lp-dv); }
#about { padding-top:120px; }
.lp-wrap { max-width:1440px; margin:0 auto; }
.lp-eyebrow { display:flex; justify-content:space-between; flex-wrap:wrap; gap:20px; padding-bottom:18px;
  font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--lp-mt); }
.lp-eyebrow .lp-blink { margin-right:8px; }
.lp-hero { font-family:'Archivo Black',sans-serif; font-size:clamp(52px,12vw,180px); line-height:.84; letter-spacing:-.04em; margin:0; text-transform:uppercase; }
.lp-hero-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:48px; margin-top:40px; align-items:start; }
.lp-lead { font-size:19px; line-height:1.55; margin:0 0 18px; max-width:54ch; }
.lp-body { font-size:15px; line-height:1.7; color:var(--lp-mt); margin:0 0 28px; max-width:60ch; }
.lp-cta-row { display:flex; flex-wrap:wrap; gap:10px; }
.lp-cta-primary { background:var(--lp-ac); color:var(--lp-bg); border:0; padding:14px 26px; font-family:'JetBrains Mono',monospace;
  font-size:11px; letter-spacing:.16em; text-transform:uppercase; font-weight:700; cursor:pointer; }
.lp-cta-primary:hover { filter:brightness(1.12); }
.lp-cta-ghost { border:1px solid var(--lp-dv); color:var(--lp-tx); padding:14px 26px; font-family:'JetBrains Mono',monospace;
  font-size:11px; letter-spacing:.16em; text-transform:uppercase; text-decoration:none; }
.lp-cta-ghost:hover { background:var(--lp-ac); color:var(--lp-bg); border-color:var(--lp-ac); }
.lp-card { border:1px solid var(--lp-dv); }
.lp-card-row { display:flex; justify-content:space-between; gap:16px; padding:13px 18px; border-bottom:1px solid var(--lp-dv); }
.lp-card-row .lp-mono { font-size:10px; letter-spacing:.16em; text-transform:uppercase; }
.lp-card-val { font-size:13px; text-align:right; }
.lp-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:1px; margin-top:56px; background:var(--lp-dv); border:1px solid var(--lp-dv); }
.lp-stat { background:var(--lp-bg); padding:22px 20px; }
.lp-stat-n { font-family:'Archivo Black',sans-serif; font-size:44px; line-height:1; }
.lp-stat-l { font-size:10px; letter-spacing:.16em; text-transform:uppercase; margin-top:8px; }
.lp-marquee { margin:48px -40px -72px; border-top:1px solid var(--lp-dv); overflow:hidden; height:38px; display:flex; align-items:center; }
.lp-marquee-track { display:flex; width:max-content; animation:lp-marquee 34s linear infinite; white-space:nowrap; font-size:10px; letter-spacing:.2em; color:var(--lp-mt); text-transform:uppercase; }
.lp-marquee-track > span { flex:none; display:inline-flex; }
.lp-marquee-track > span > span { padding-right:30px; }

.lp-sechead { display:flex; align-items:baseline; flex-wrap:wrap; gap:18px; margin-bottom:32px; }
.lp-sechead .lp-mono { font-size:11px; letter-spacing:.16em; }
.lp-sectitle { font-family:'Archivo Black',sans-serif; font-size:clamp(28px,3.4vw,46px); text-transform:uppercase; letter-spacing:-.02em; margin:0; }
.lp-sechead-note { margin-left:auto; text-transform:uppercase; }

.lp-plist { border-top:1px solid var(--lp-dv); margin-bottom:44px; }
.lp-prow { display:grid; grid-template-columns:56px 1.6fr 1fr 110px 40px; gap:20px; align-items:center; padding:16px 4px;
  border-bottom:1px solid var(--lp-dv); color:var(--lp-tx); text-decoration:none; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:.06em; text-transform:uppercase; }
.lp-prow:hover { background:var(--lp-ac); color:var(--lp-bg); }
.lp-prow:hover .lp-mt, .lp-prow:hover .lp-ac { color:var(--lp-bg); }
.lp-prow-name { font-family:'Archivo',sans-serif; font-weight:800; font-size:19px; }
.lp-prow-arrow { text-align:right; }
.lp-pcards { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1px; background:var(--lp-dv); border:1px solid var(--lp-dv); }
.lp-pcard { background:var(--lp-bg); padding:28px; display:flex; flex-direction:column; }
.lp-pcard-head { display:flex; justify-content:space-between; gap:16px; font-size:10px; letter-spacing:.16em; text-transform:uppercase; margin-bottom:16px; }
.lp-pcard-title { font-family:'Archivo Black',sans-serif; font-size:clamp(24px,2.6vw,32px); line-height:.95; letter-spacing:-.02em; text-transform:uppercase; margin:0 0 14px; }
.lp-pcard-desc { margin:0 0 18px; }
.lp-drop { aspect-ratio:16/10; background:repeating-linear-gradient(135deg,var(--lp-drop) 0 6px,transparent 6px 12px);
  border:1px solid var(--lp-dv); display:flex; align-items:center; justify-content:center; margin-bottom:18px; }
.lp-drop .lp-mono { font-size:10px; letter-spacing:.16em; text-transform:uppercase; }
.lp-shot { aspect-ratio:16/10; border:1px solid var(--lp-dv); overflow:hidden; margin-bottom:18px; background:var(--lp-drop); }
.lp-shot img { width:100%; height:100%; object-fit:contain; display:block; }
.lp-tags { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px; }
.lp-tag { border:1px solid var(--lp-dv); padding:6px 10px; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--lp-mt); }
.lp-pcard-link { margin-top:auto; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--lp-ac); text-decoration:none; }
.lp-pcard-link:hover { text-decoration:underline; }

.lp-xp { display:grid; grid-template-columns:150px minmax(0,1fr) minmax(0,1.1fr); gap:40px; padding:30px 0; border-top:1px solid var(--lp-dv); }
.lp-xp:last-child { border-bottom:1px solid var(--lp-dv); }
.lp-xp-period { font-size:12px; letter-spacing:.14em; line-height:1.5; }
.lp-xp-role { font-size:22px; font-weight:800; margin:0 0 6px; letter-spacing:-.01em; }
.lp-xp-org { font-size:11px; letter-spacing:.12em; text-transform:uppercase; }
.lp-xp-bullets { font-size:12px; line-height:1.9; color:var(--lp-mt); }

.lp-skills { display:grid; grid-template-columns:repeat(auto-fit,minmax(340px,1fr)); gap:1px; background:var(--lp-dv); border:1px solid var(--lp-dv); }
.lp-skillcol { background:var(--lp-bg); }
.lp-skill { display:grid; grid-template-columns:52px minmax(0,1fr) 96px; align-items:center; gap:14px; padding:15px 20px; border-bottom:1px solid var(--lp-dv); font-size:15px; }
.lp-skill .lp-mono { font-size:11px; letter-spacing:.14em; }
.lp-skill-lvl { font-size:10px; letter-spacing:.1em; text-transform:uppercase; text-align:right; }

.lp-contact-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:56px; align-items:start; }
.lp-contact-big { font-family:'Archivo Black',sans-serif; font-size:clamp(32px,5vw,68px); line-height:.88; letter-spacing:-.03em; text-transform:uppercase; margin-bottom:22px; }
.lp-contact-list { border-top:1px solid var(--lp-dv); }
.lp-contact-row { display:grid; grid-template-columns:120px minmax(0,1fr) 20px; align-items:center; gap:20px; padding:17px 4px;
  border-bottom:1px solid var(--lp-dv); color:var(--lp-tx); text-decoration:none; }
.lp-contact-row:not(.lp-contact-static):hover { background:var(--lp-ac); color:var(--lp-bg); }
.lp-contact-row:not(.lp-contact-static):hover .lp-mt { color:var(--lp-bg); }
.lp-contact-row .lp-mono { font-size:10px; letter-spacing:.16em; text-transform:uppercase; }
.lp-contact-val { font-size:16px; }
.lp-contact-arrow { text-align:right; }
.lp-footer { display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:16px; padding:32px 0 26px; margin-top:44px;
  border-top:1px solid var(--lp-dv); font-size:10px; letter-spacing:.16em; text-transform:uppercase; }
.lp-foot-3d { border:1px solid var(--lp-ac); color:var(--lp-ac); background:transparent; padding:10px 16px; font:inherit; letter-spacing:.16em; text-transform:uppercase; cursor:pointer; }
.lp-foot-3d:hover { background:var(--lp-ac); color:var(--lp-bg); }

/* HUD side decorations */
.lp-deco { position:fixed; inset:0; z-index:1; pointer-events:none; }
.lp-corner { position:fixed; width:20px; height:20px; opacity:.5; color:var(--lp-ac); }
.lp-corner-tl { top:56px; left:12px; border-top:1px solid currentColor; border-left:1px solid currentColor; }
.lp-corner-tr { top:56px; right:12px; border-top:1px solid currentColor; border-right:1px solid currentColor; }
.lp-corner-bl { bottom:12px; left:12px; border-bottom:1px solid currentColor; border-left:1px solid currentColor; }
.lp-corner-br { bottom:12px; right:12px; border-bottom:1px solid currentColor; border-right:1px solid currentColor; }
.lp-rail-l { position:fixed; left:16px; top:50%; transform:translateY(-50%); width:44px; height:300px; color:var(--lp-mt); opacity:.45; }
.lp-ring { position:fixed; right:24px; top:30%; width:108px; height:108px; color:var(--lp-ac); opacity:.3; animation:lp-spin 44s linear infinite; }
.lp-rail-r { position:fixed; right:22px; top:56%; width:20px; height:224px; color:var(--lp-mt); opacity:.45; }

/* Scroll reveal */
.lp-reveal { opacity:0; transform:translateY(26px); transition:opacity .6s cubic-bezier(.2,.7,.2,1), transform .6s cubic-bezier(.2,.7,.2,1); }
.lp-reveal.lp-in { opacity:1; transform:none; }

@keyframes lp-spin { to { transform:rotate(360deg); } }
@keyframes lp-marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
@keyframes lp-blink { 0%,60% { opacity:1; } 61%,100% { opacity:.15; } }
@media (prefers-reduced-motion:reduce) {
  .lp-reveal { opacity:1; transform:none; transition:none; }
  .lp-ring, .lp-marquee-track, .lp-blink { animation:none; }
}

@media (max-width:1280px) { .lp-rail-l, .lp-ring, .lp-rail-r { display:none; } }
@media (max-width:1080px) {
  .lp-pcards { grid-template-columns:repeat(2,minmax(0,1fr)); }
}
@media (max-width:860px) {
  .lp-section { padding:56px 20px; }
  #about { padding-top:112px; }
  .lp-hud { display:none; }
  .lp-corner { display:none; }
  .lp-nav-meta { display:none; }
  .lp-burger { display:flex; align-items:center; margin-left:auto; }
  .lp-nav-actions { display:none; position:absolute; top:100%; left:0; right:0; flex-direction:column; align-items:stretch;
    background:var(--lp-hd); backdrop-filter:blur(8px); border-bottom:1px solid var(--lp-dv); }
  .lp-nav-actions.lp-open { display:flex; }
  .lp-nav-links { flex-direction:column; align-items:stretch; gap:0; padding:0; border-left:0; }
  .lp-navlink { padding:13px 20px; border-bottom:1px solid var(--lp-dv); opacity:1; }
  .lp-3dbtn, .lp-theme { border-left:0; border-top:1px solid var(--lp-dv); justify-content:center; padding:15px; }
  .lp-marquee { margin:40px -20px -56px; }
  .lp-xp { grid-template-columns:1fr; gap:14px; }
  .lp-prow { grid-template-columns:44px 1fr 40px; }
  .lp-prow > span:nth-child(3), .lp-prow > span:nth-child(4) { display:none; }
}
@media (max-width:640px) {
  .lp-pcards { grid-template-columns:1fr; }
  .lp-hero-grid, .lp-contact-grid { gap:28px; }
  .lp-footer { justify-content:flex-start; }
}
`;
