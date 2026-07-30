import { useEffect, useRef, useState } from 'react';
import './LandingPage.css';

/**
 * One-page portfolio landing shown before the 3D experience. Responsive and
 * theme-aware (dark / light, turquoise accent). "Switch to 3D Portfolio" hands
 * off to the 3D title screen. Image "DROP" slots are intentionally left empty
 * for screenshots to be added later.
 */

const GH = 'https://github.com/IAbrahamI';
/** Current year, so the availability banner never goes stale. */
const YEAR = new Date().getFullYear();

const PROJECTS = [
  { id: 'P/01', name: 'Selfhosted Server', cat: 'Infrastructure', kind: 'SELF-HOSTED', url: `${GH}/selfhostedServer`, img: '/assets/selfHosted.png',
    desc: 'Infrastructure as code. Every config and script I use to set up and run my own server, reproducibly.', tech: ['Docker', 'Linux', 'Nginx'] },
  { id: 'P/02', name: 'Handheld RF Gadget', cat: 'Embedded / RF', kind: 'HARDWARE', url: `${GH}/Wifi_Scanner`, img: '/assets/Gadged_Menu.jpg',
    desc: 'Multi-boot firmware for a pocket-sized passive RF scanner. A touch launcher boots a Wi-Fi CSI radar, a Wi-Fi and BLE sniffer, or a five-tool RF toolkit, each from its own flash partition.', tech: ['ESP32-S3', 'C++', 'PlatformIO', 'WiFi & BLE'] },
  { id: 'P/03', name: 'Pentest Assistant', cat: 'Security Tooling', kind: 'SECURITY', url: `${GH}/Pentest_Assistant`, img: '/assets/PentestAssistant.png',
    desc: 'Tooling that streamlines security assessments and penetration testing tasks, from recon to reporting.', tech: ['Python', 'Security'] },
  { id: 'P/04', name: 'Portfolio 2026', cat: 'Interactive 3D', kind: 'WEB', url: `${GH}/ThreeJS_Portfolio`, img: '/assets/3DPortfolio.png',
    desc: 'This world. An interactive 3D portfolio you can walk through, built with React, Three.js and Rapier physics.', tech: ['React', 'Three.js', 'Rapier'] },
  { id: 'P/05', name: 'Password Manager', cat: 'Applied Security', kind: 'SOLO', url: `${GH}/Password_Manager`, img: '/assets/Password_Manager.png',
    desc: 'A secure password manager, designed and built entirely from scratch.', tech: ['Encryption', 'From scratch'] },
  { id: 'P/06', name: 'Kuroro', cat: 'Mobile App', kind: 'MOBILE', url: `${GH}/Kuroro`, img: '/assets/KuroroApp.jpg',
    desc: 'A mobile app that reads manga from my personal API, so my whole library travels with me.', tech: ['Mobile', 'REST API'] },
  { id: 'P/07', name: 'Manga API Server', cat: 'Backend / API', kind: 'SELF-HOSTED', url: `${GH}/MangaAPIServer`, img: '/assets/mangaAPI.png',
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
  ['7', 'PROJECTS SHIPPED'], ['12', 'SKILLS IN LOADOUT'], ['4', 'LANGUAGES SPOKEN'], ['60%', 'ENGINEERING ROLE'],
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
            <span><span className="lp-blink" /> SYS.ONLINE // OPEN TO {YEAR} ENGINEERING &amp; SECURITY ROLES</span>
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
            {[0, 1, 2, 3].map((k) => (
              <span key={k} className="lp-mono">
                <span>◆ SOFTWARE ENGINEERING</span><span className="lp-ac">◆ CYBERSECURITY</span><span>◆ PENTESTING</span><span>◆ SECURE ARCHITECTURE</span><span className="lp-ac">◆ CLOUD SECURITY</span><span>◆ MOBILE SECURITY</span><span>◆ SOC</span><span className="lp-ac">◆ DEVOPS & OPS</span><span>◆ CI/CD PIPELINES</span><span className="lp-ac">◆ BSC INFOSEC</span>
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
            <span>ABRAHAM NEIDHARDT · PORTFOLIO {YEAR}</span>
            <span>BUILT AND DESIGNED BY HAND</span>
            {isPC && <button type="button" className="lp-foot-3d" onClick={onEnter}>ENTER 3D PORTFOLIO →</button>}
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
