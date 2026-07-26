import { useGLTF } from '@react-three/drei';
import type { ProjectHotspot } from './components/ProjectHologram';

export type RoomId = 'hub' | 'east' | 'west' | 'north';

export const ROOM_URL: Record<RoomId, string> = {
  hub: '/models/hub.glb',
  east: '/models/east.glb', // projects
  west: '/models/west.glb', // skills
  north: '/models/north.glb', // observatory
};

/**
 * Maps a teleport pad's GLB node base-name (parts are named `<base>_0..N`) to
 * the room it sends the player to. Pad *positions* are read at runtime from the
 * actual mesh bounding boxes (see Room.tsx), so they always match the geometry.
 *
 * Hub layout (player faces north/−z): left(West)→skills, right(East)→projects,
 * forward(North)→observatory. `HubTP_South` is intentionally absent — no room yet.
 */
export const PAD_DEST: Record<string, RoomId> = {
  HubTP_West: 'west',
  HubTP_East: 'east',
  HubTP_North: 'north',
  EastTeleport: 'hub',
  WestTeleport: 'hub',
  ObsTeleport: 'hub',
};

/** Extra margin (metres) added around a pad's footprint radius for triggering. */
export const PAD_MARGIN = 0.4;

/**
 * Where the player lands when entering each room — placed on the FAR side from
 * the return pad, so they walk through the room to leave (and never spawn on the
 * pad). Returning to the hub always drops the player at the starting position.
 */
export const ROOM_ARRIVAL: Record<RoomId, [number, number, number]> = {
  hub: [0, 1.3, 0],
  east: [4, 1.3, 0], // floor x[−7,7], pad at −4.4 → spawn at +x end, walk −x
  west: [-6, 1.3, 0], // floor x[−8,9], pad at +6.5 → spawn at −x end, walk +x
  north: [0, 1.3, 5], // floor z[3.7,17.7], pad at +15.7 → spawn at −z end, walk +z
};

/**
 * Camera yaw (radians about Y) applied on arrival so the player faces into the
 * room, not a wall. forward = (−sin θ, 0, −cos θ): 0=−z, π/2=−x, −π/2=+x, π=+z.
 */
export const ROOM_FACING: Record<RoomId, number> = {
  hub: 0, // face north (−z), toward the north pad
  east: Math.PI / 2, // face −x, into the projects room
  west: -Math.PI / 2, // face +x, into the skills room
  north: Math.PI, // face +z, into the observatory
};

/** Project holograms on the east room's Holo_Screen objects (east.glb local space). */
export const eastHotspots: ProjectHotspot[] = [
  {
    name: 'Selfhosted Server',
    description: 'Infrastructure-as-code — every config and script I use to set up and run my server.',
    githubUrl: 'https://github.com/IAbrahamI/selfhostedServer',
    position: [-3.5, 2.13, -4],
    rotation: [0, 0, 0],
  },
  {
    name: 'Kuroro',
    description: 'Mobile app that reads manga from my personal API — my library, on the go.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [0, 2.13, -4],
    rotation: [0, 0, 0],
  },
  {
    name: 'Pentest Assistant',
    description: 'Tooling that streamlines security assessments and penetration-testing tasks.',
    githubUrl: 'https://github.com/IAbrahamI/Pentest_Assistant',
    position: [3.5, 2.13, -4],
    rotation: [0, 0, 0],
  },
  {
    name: 'Portfolio 2026',
    description: 'This world — an interactive 3D portfolio built with React, Three.js and Rapier.',
    githubUrl: 'https://github.com/IAbrahamI/ThreeJS_Portfolio',
    position: [-3.5, 2.13, 4],
    rotation: [0, Math.PI, 0],
  },
  {
    name: 'Password Manager',
    description: 'A secure password manager, designed and built entirely from scratch.',
    githubUrl: 'https://github.com/IAbrahamI/Password_Manager',
    position: [0, 2.13, 4],
    rotation: [0, Math.PI, 0],
  },
  {
    name: 'Manga API Server',
    description: 'Self-hosted API that serves manga data, running on my own server.',
    githubUrl: 'https://github.com/IAbrahamI/MangaAPIServer',
    position: [3.5, 2.13, 4],
    rotation: [0, Math.PI, 0],
  },
];

/**
 * Objects (by node-name regex) that should render but NOT generate colliders —
 * floating particles, the animated core, and mid-air constellation pieces — so
 * the player phases through them. null = everything in the room is solid.
 */
export const NON_COLLIDER: Record<RoomId, RegExp | null> = {
  hub: null,
  east: null,
  west: null,
  north: /Obs_Mote|Obs_Core|ConstStar|ConstGlow|ConstLine|CV_Finial/,
};

/** Clickable star/panel in a room that opens a focus popup. */
export interface Hotspot {
  position: [number, number, number];
  radius: number;
  title: string;
  body: string;
}

/** North observatory: central star → CV, constellation stars → milestones. */
export const northHotspots: Hotspot[] = [
  {
    position: [0, 2.5, 10.7], // Obs_Core (the floating central star)
    radius: 0.7,
    title: 'Abraham Neidhardt — CV',
    // TODO: replace with your real CV content.
    body: `Full-Stack Developer\n\nAbout\nShort intro about you goes here.\n\nExperience\n• Role — Company (year–year)\n• Role — Company (year–year)\n\nSkills\nReact · TypeScript · Three.js · Node · Python\n\nContact\nabraham.neidhardt@outlook.com`,
  },
  { position: [5.14, 2.9, 7.77], radius: 0.5, title: 'The Beginning', body: 'Earliest milestone — edit me.' },
  { position: [5.54, 3.6, 8.87], radius: 0.5, title: 'First Steps', body: 'Milestone two — edit me.' },
  { position: [5.64, 4.2, 10.07], radius: 0.5, title: 'Growth', body: 'Milestone three — edit me.' },
  { position: [5.44, 4.8, 11.27], radius: 0.5, title: 'Now', body: 'Milestone four — edit me.' },
  { position: [4.94, 5.3, 12.47], radius: 0.5, title: 'What’s Next', body: 'Future / goals — edit me.' },
];

/** Skill icons that hover over the west room's altars. */
export const SKILL_ICONS_URL = '/models/skill_icons.glb';

/** Maps each icon (by node name) to the xz center of the altar it hovers over. */
export const ICON_ALTAR: Record<string, [number, number]> = {
  Icon_Java: [6.03, -3.2],
  Icon_JavaScript: [3.03, -3.2],
  Icon_Python: [0.03, -3.2],
  Icon_Kubernetes: [-2.97, -3.2],
  Icon_Docker: [-5.97, -3.2],
  Icon_Trino: [3.03, 3.2],
  Icon_SQL: [0.03, 3.2],
  Icon_Git: [-2.97, 3.2],
  Icon_Shell: [-5.97, 3.2],
  Icon_Blender: [6.03, 3.2],
};

// Prefetch every room + the skill icons so nothing waits on a download.
Object.values(ROOM_URL).forEach((url) => useGLTF.preload(url));
useGLTF.preload(SKILL_ICONS_URL);
