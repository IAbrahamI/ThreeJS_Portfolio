import { useEffect } from 'react';
import { controlsRef, gameStore } from '../state/gameStore';
import './ResumePrompt.css';

/**
 * Lightweight overlay shown after the player presses Esc inside the pause menu.
 * Browsers forbid re-acquiring pointer-lock from the Esc key itself, so we can't
 * lock straight from Esc — a single click here re-locks and resumes play. Esc
 * again reopens the full pause menu.
 */
export function ResumePrompt() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') gameStore.set({ phase: 'paused' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="resume-screen" onClick={() => controlsRef.current?.lock()}>
      <div className="resume-hint">
        <p className="resume-title">Paused</p>
        <p className="resume-sub">
          Click to resume · <span className="key">Esc</span> for menu
        </p>
      </div>
    </div>
  );
}
