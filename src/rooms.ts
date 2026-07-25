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
    name: 'Awesome Web App',
    description: 'Interactive 3D world built with React, Three.js and Rapier physics.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [-3.5, 2.13, -4],
    rotation: [0, 0, 0],
  },
  {
    name: 'Python Data Scraper',
    description: 'Fast Python scraper that harvests thousands of pages into a local DB.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [0, 2.13, -4],
    rotation: [0, 0, 0],
  },
  {
    name: '3D Portfolio',
    description: 'You are walking through it — a fully interactive 3D portfolio.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [3.5, 2.13, -4],
    rotation: [0, 0, 0],
  },
  {
    name: 'Dockerized Microservices',
    description: 'Docker + Kubernetes orchestrating Node.js and Java microservices.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [-3.5, 2.13, 4],
    rotation: [0, Math.PI, 0],
  },
  {
    name: 'Machine Learning Bot',
    description: 'Discord bot powered by a custom-trained neural network.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [0, 2.13, 4],
    rotation: [0, Math.PI, 0],
  },
  {
    name: 'Open Source CLI Tool',
    description: 'Go command-line utility for managing cloud infrastructure deploys.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [3.5, 2.13, 4],
    rotation: [0, Math.PI, 0],
  },
];

// Prefetch every room so teleports never wait on a download.
Object.values(ROOM_URL).forEach((url) => useGLTF.preload(url));
