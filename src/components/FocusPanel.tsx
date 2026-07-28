import { useEffect } from 'react';
import { gameStore, useGameState, closeFocus } from '../state/gameStore';
import './FocusPanel.css';

/**
 * Full-screen popup shown when the player clicks a star (CV or a constellation
 * milestone). Pointer-lock is released while it's open; closing re-locks.
 */
export function FocusPanel() {
  const focus = useGameState((s) => s.focus);

  // Esc closes to the click-to-resume prompt (can't re-lock straight from Esc).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') gameStore.set({ focus: null, phase: 'resume' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!focus) return null;

  return (
    <div className="focus-screen">
      <div className="focus-card">
        <button className="focus-close" onClick={closeFocus} aria-label="Close">×</button>

        <div className="focus-header">
          {focus.image && <img className="focus-logo" src={focus.image} alt="" />}
          <div className="focus-heading">
            <h2 className="focus-title">{focus.title}</h2>
            {focus.subtitle && <p className="focus-subtitle">{focus.subtitle}</p>}
          </div>
        </div>

        <div className="focus-body">
          {focus.body.split('\n').map((line, i) => {
            const t = line.trim();
            if (t === '') return <div key={i} className="focus-gap" />;
            if (t.startsWith('"') && t.endsWith('"')) {
              return <blockquote key={i} className="focus-quote">{t}</blockquote>;
            }
            return <p key={i}>{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
