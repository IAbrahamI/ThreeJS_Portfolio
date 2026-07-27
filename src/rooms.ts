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
  /** Optional logo shown in the popup's corner. */
  image?: string;
  /** Optional role/subtitle shown under the title. */
  subtitle?: string;
}

/**
 * North observatory: central star → CV, constellation stars → the timeline
 * (earliest at ConstStar_0 / z 7.77, latest at ConstStar_4 / z 12.47).
 */
export const northHotspots: Hotspot[] = [
  {
    position: [0, 2.5, 10.7], // Obs_Core (the floating central star)
    radius: 0.7,
    title: 'Abraham Neidhardt',
    subtitle: 'Software Engineer, Cybersecurity Student',
    body: `"Software engineer studying cybersecurity. Building systems in the morning, and learning how to break them in the afternoon."\n\nI am a software engineer passionate about modern architecture, agile environments, and modern security practices. Currently balancing a 60% engineering role while pursuing a degree in Cybersecurity, I bridge the gap between building scalable software and protecting it.\n\nI thrive in fast-paced, agile workflows where quick adaptation and cross-functional collaboration are key. As a native Spanish speaker fluent in English and German, with a working knowledge of French, I bring a global perspective to international teams and client-facing environments.\n\nOutside of my core work and studies, I focus on staying balanced. Whether that's keeping active through fitness, unwinding with music and gaming, or tinkering with my own personal coding projects.`,
  },
  {
    position: [5.14, 2.9, 7.77], // ConstStar_0, earliest
    radius: 0.5,
    image: '/assets/KBW.png',
    title: 'IMS (Informatikmittelschule), KBW',
    body: `Aug 2018 - July 2021.\n\n• Learned the basics of programming with Java and JavaScript.\n• Studied the basics of other subjects such as Law, Science, Maths and Languages.\n• Created projects in teams using a Scrum and agile approach.`,
  },
  {
    position: [5.54, 3.6, 8.87], // ConstStar_1
    radius: 0.5,
    image: '/assets/JuliusBaer.jpg',
    title: 'Internship, Julius Baer',
    body: `Aug 2021 to July 2022.\n\n• This internship was needed for my final degree as Software Engineer.\n• Implemented automations with Python scripts, which run weekly.\n• First approach with big data clusters and analysis.\n• Worked with an agile approach.`,
  },
  {
    position: [5.64, 4.2, 10.07], // ConstStar_2
    radius: 0.5,
    image: '/assets/JuliusBaer.jpg',
    title: 'Software Engineer, Julius Baer',
    body: `Aug 2022 to 2024.\n\n• Developed and monitored new automated Python scripts in Kibana.\n• Managed access rights for all end-users and applications.\n• Implemented a new approach to simplify the onboarding of end-users.`,
  },
  {
    position: [5.44, 4.8, 11.27], // ConstStar_3, latest shown
    radius: 0.5,
    image: '/assets/HSLU.png',
    title: 'Bachelor of Information and Cybersecurity, Hochschule Luzern',
    body: `2025 to present.\n\nGoal to improve and major into cybersecurity related topics such as pentesting, secure architecture, cloud security and mobile security.\n• Parallel to my studies, I am also continuously working on Julius Baer working 60% of my time as a Secure Architect and Software Engineer.\n• I am also working on my own projects to improve my skills and knowledge in the field of cybersecurity.`,
  },
];

/** Only 4 stars are used (0..3); hide the last star, its glow, and its line. */
export const NORTH_HIDE = /ConstStar_4|ConstGlow_4|ConstLine_3/;

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
