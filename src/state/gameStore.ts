import { useSyncExternalStore } from 'react';

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
}

let state: GameState = { phase: 'title', mouseSensitivity: 1 };
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

/** Imperative handle to respawn the player at the starting position ("Unstuck"). */
export const playerApi: { current: { respawn: () => void } | null } = {
  current: null,
};
