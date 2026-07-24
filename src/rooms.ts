import { useGLTF } from '@react-three/drei';
import type { ProjectHotspot } from './components/ProjectHologram';

export type RoomId = 'hub' | 'east' | 'west' | 'north';

export const ROOM_URL: Record<RoomId, string> = {
  hub: '/models/hub.glb',
  east: '/models/east.glb', // projects
  west: '/models/west.glb', // skills
  north: '/models/north.glb', // observatory
};

export interface Pad {
  /** Room-local xz center of the teleport pad (from the GLB geometry). */
  center: [number, number];
  /** Room the pad sends the player to. */
  to: RoomId;
}

/** How close (xz) the player must be to a pad's center to trigger it. */
export const TELEPORT_RADIUS = 1.4;

/**
 * Teleport pads per room. Hub layout (player faces north/−z): left→skills,
 * right→projects, forward→observatory. Every other room has a single pad back
 * to the hub. HubTP_South (0, 3.8) is intentionally unwired — no room yet.
 */
export const ROOM_PADS: Record<RoomId, Pad[]> = {
  hub: [
    { center: [-3.77, 0], to: 'west' },
    { center: [3.87, 0], to: 'east' },
    { center: [0.02, -3.85], to: 'north' },
  ],
  east: [{ center: [-8.85, 0.02], to: 'hub' }],
  west: [{ center: [10.37, -0.03], to: 'hub' }],
  north: [{ center: [0, 2.91], to: 'hub' }],
};

/**
 * Where the player lands when entering each room. Offset off the return pad
 * (and toward the room interior) so they don't immediately re-trigger it.
 * Returning to the hub always drops the player at the starting position.
 */
export const ROOM_ARRIVAL: Record<RoomId, [number, number, number]> = {
  hub: [0, 1.3, 0],
  east: [-6.2, 1.3, 0],
  west: [7.9, 1.3, 0],
  north: [0, 1.3, 0.3],
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
