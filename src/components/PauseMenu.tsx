import { useEffect, useState } from 'react';
import { gameStore, useGameState, controlsRef, playerApi } from '../state/gameStore';
import { actionLabels, prettyKey, type Bindings, type MoveAction } from '../state/keybindings';

interface PauseMenuProps {
  bindings: Bindings;
  onRebind: (action: MoveAction, code: string) => void;
}

/**
 * Static (DOM) pause overlay shown when the game is 'paused' — i.e. the player
 * pressed ESC and pointer-lock dropped. Lets them resume, reload the world,
 * rebind movement keys, and tune mouse sensitivity.
 */
export function PauseMenu({ bindings, onRebind }: PauseMenuProps) {
  const sensitivity = useGameState((s) => s.mouseSensitivity);
  const [listening, setListening] = useState<MoveAction | null>(null);

  const resume = () => controlsRef.current?.lock();

  // While rebinding, capture the next key press for the chosen action.
  useEffect(() => {
    if (!listening) return;
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.code !== 'Escape') onRebind(listening, e.code);
      setListening(null);
    };
    window.addEventListener('keydown', onKey, { once: true });
    return () => window.removeEventListener('keydown', onKey);
  }, [listening, onRebind]);

  // Esc closes the menu — unless we're mid-rebind, where Esc just cancels the
  // rebind (handled above). It can't re-lock directly (browsers block pointer-
  // lock from the Esc key), so it drops to the click-to-resume prompt.
  useEffect(() => {
    if (listening) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') gameStore.set({ phase: 'resume' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [listening]);

  const unstuck = () => {
    playerApi.current?.respawn();
    resume();
  };

  return (
    <div className="pause-screen">
      <div className="pause-card">
        <h2 className="pause-title">Paused</h2>

        <button className="pause-primary" onClick={resume}>Resume</button>

        <div className="pause-section">
          <div className="pause-row">
            <label htmlFor="sens">Mouse sensitivity</label>
            <div className="pause-sens">
              <input
                id="sens"
                type="range"
                min={0.2}
                max={2.5}
                step={0.1}
                value={sensitivity}
                onChange={(e) => gameStore.set({ mouseSensitivity: Number(e.target.value) })}
              />
              <span className="pause-sens-value">{sensitivity.toFixed(1)}×</span>
            </div>
          </div>
        </div>

        <div className="pause-section">
          <h3 className="pause-subhead">Key bindings</h3>
          {(Object.keys(actionLabels) as MoveAction[]).map((action) => (
            <div className="pause-row" key={action}>
              <label>{actionLabels[action]}</label>
              <button
                className={`pause-key ${listening === action ? 'listening' : ''}`}
                onClick={() => setListening(action)}
              >
                {listening === action ? 'Press a key…' : prettyKey(bindings[action])}
              </button>
            </div>
          ))}
        </div>

        <button className="pause-secondary" onClick={unstuck}>
          Unstuck — reset to start
        </button>
      </div>
    </div>
  );
}
