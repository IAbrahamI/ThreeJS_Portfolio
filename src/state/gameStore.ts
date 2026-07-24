import { useSyncExternalStore } from 'react';
import type { RoomId } from '../rooms';

/**
 * Tiny dependency-free store shared between the DOM UI (title screen, pause
 * menu) and the in-Canvas game code (Player, holograms). React components
 * subscribe reactively via `useGameState`; the render loop reads imperatively
 * via `gameStore.get()`.
 */
export type GamePhase = 'title' | 'playing' | 'paused' | 'resume';

interface GameState {
  phase: GamePhase;
  /** PointerLockControls pointerSpeed multiplier. */
  mouseSensitivity: number;
  /** Currently mounted room. */
  room: RoomId;
}

let state: GameState = { phase: 'title', mouseSensitivity: 1, room: 'hub' };
const listeners = new Set<() => void>();

export const gameStore = {
  get: () => state,
  set: (patch: Partial<GameState>) => {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function useGameState<T>(selector: (s: GameState) => T): T {
  return useSyncExternalStore(gameStore.subscribe, () => selector(state));
}

/**
 * Imperative handle to the PointerLockControls instance, registered by the
 * Player once mounted so the DOM UI can lock/unlock without crossing the
 * react-three-fiber renderer boundary.
 */
export const controlsRef: { current: { lock: () => void; unlock: () => void } | null } = {
  current: null,
};

/** Imperative handle to respawn the player at the current room's arrival point ("Unstuck"). */
export const playerApi: { current: { respawn: () => void } | null } = {
  current: null,
};

/**
 * When set, the Player consumes it on the next frame: teleports to this position,
 * zeroes velocity, and re-arms teleport detection. Set by the teleport trigger.
 */
export const pendingSpawn: { current: [number, number, number] | null } = {
  current: null,
};
