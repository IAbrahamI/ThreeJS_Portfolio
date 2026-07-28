# Abraham Neidhardt — Portfolio 2026

A portfolio in two worlds. A fast, responsive **2D landing page** that anyone can open on any device, and a walkable **3D portfolio** — a little world you explore with the projects, skills, work history and contact info scattered through it.

> _Software engineer studying cybersecurity. Building systems in the morning, and learning how to break them in the afternoon._

<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-0b0c10?labelColor=0b0c10&color=3DE0D0">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-0b0c10?labelColor=0b0c10&color=3DE0D0">
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-r185-0b0c10?labelColor=0b0c10&color=3DE0D0">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-0b0c10?labelColor=0b0c10&color=3DE0D0">
</p>

---

## ✦ Two experiences

### The 2D landing (everyone)
A single-page, Y2K-techwear / cyberpunk styled site — the front door.

- **Dark & light themes** (turquoise accent), remembered between visits.
- **About, Projects, Experience, Skills, Contact** — all real content, with project screenshots and GitHub links.
- **Scroll-reveal animations** in both directions, a live scroll HUD, an infinite marquee and subtle HUD side ornaments.
- **Fully responsive** — PC, laptop, tablet, phone, with a collapsible mobile menu.
- Respects `prefers-reduced-motion`.

### The 3D portfolio (PC & laptop)
An interactive first-person world, entered from the landing page. Because it needs a mouse + keyboard, it's offered **only on pointer-and-keyboard devices**.

- A central **hub** with teleport pads to three rooms, plus a contact board and a "Get in Touch" reception desk.
- **Projects room** — six holographic project screens you can click to open on GitHub.
- **Skills room** — skill icons hovering over marble altars with floating name plates.
- **Observatory** — a star-filled space room where your career is a **clickable constellation** (each star opens a milestone), the central star opens an "About Me" panel, and company logos appear in the pop-ups.
- Per-room lighting/mood, bloom for the neon and stars, and a title screen with live loading.

---

## ✦ Tech stack

| Area | Tools |
|------|-------|
| Framework | React 19 + TypeScript + Vite |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| Physics | @react-three/rapier |
| Post-processing | @react-three/postprocessing (bloom) |
| Styling | Plain CSS + CSS variables (no UI framework) |
| Lint | Oxlint |

---

## ✦ Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

---

## ✦ Controls (3D world)

| Action | Key |
|--------|-----|
| Move | `W` `A` `S` `D` (or arrows) |
| Jump | `Space` |
| Look | Mouse |
| Pause / menu | `Esc` |
| Interact | Left click (holograms, stars, contact links) |

The pause menu has mouse-sensitivity, rebindable keys, an **Unstuck** reset, and a **Back to 2D Portfolio** button.

---

## ✦ Project structure

```
public/
  models/        per-room GLBs (hub, east, west, north) + skill_icons.glb
  assets/        logos + project screenshots
src/
  App.tsx        gates 2D landing → 3D experience
  rooms.ts       room registry, teleport pads, hotspots, skill/altar map
  components/
    LandingPage.tsx    the 2D one-page site (self-contained)
    Scene / Room / Player / RoomEnv    the 3D world
    Rooms · TitleScreen · PauseMenu · FocusPanel · StarHotspot
    ProjectHologram · SkillIcons · ContactBoard
  state/
    gameStore.ts       tiny external store (phase, room, focus, …)
    keybindings.ts
```

### How the 3D rooms work
Each room is its own GLB and **only the current room is mounted** — its meshes and its trimesh collider are the only things live, which keeps the scene light. Teleport pads read their real positions from the loaded geometry, physics is briefly paused during a room swap (so Rapier never steps against a collider being torn down), and the player is repositioned and re-oriented on arrival.

---

## ✦ Content

Everything is data-driven and lives in `src/rooms.ts` (3D) and `src/components/LandingPage.tsx` (2D): the six projects, the work-experience timeline, the skills, and the contact links. Update those and both worlds follow.

---

<sub>Built and designed by hand · Abraham Neidhardt · 2026</sub>
