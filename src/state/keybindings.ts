/** Rebindable movement actions. Arrow keys stay wired as fixed secondaries. */
export type MoveAction = 'forward' | 'backward' | 'left' | 'right' | 'jump';

export type Bindings = Record<MoveAction, string>;

export const defaultBindings: Bindings = {
  forward: 'KeyW',
  backward: 'KeyS',
  left: 'KeyA',
  right: 'KeyD',
  jump: 'Space',
};

export const actionLabels: Record<MoveAction, string> = {
  forward: 'Move forward',
  backward: 'Move backward',
  left: 'Strafe left',
  right: 'Strafe right',
  jump: 'Jump',
};

/** Arrow keys kept as always-on secondary bindings alongside the custom key. */
const fixedSecondary: Partial<Record<MoveAction, string>> = {
  forward: 'ArrowUp',
  backward: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
};

/** Build the KeyboardControls map from the current bindings. */
export function toKeyboardMap(bindings: Bindings) {
  return (Object.keys(bindings) as MoveAction[]).map((name) => {
    const keys = [bindings[name]];
    const secondary = fixedSecondary[name];
    if (secondary) keys.push(secondary);
    return { name, keys };
  });
}

/** Human-readable label for a KeyboardEvent.code (e.g. "KeyW" -> "W"). */
export function prettyKey(code: string): string {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Arrow')) return { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' }[code] ?? code;
  return { Space: 'Space', ShiftLeft: 'Shift', ControlLeft: 'Ctrl', AltLeft: 'Alt' }[code] ?? code;
}
