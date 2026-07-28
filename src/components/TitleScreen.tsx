import { useProgress } from '@react-three/drei';
import './TitleScreen.css';
import { controlsRef } from '../state/gameStore';

/**
 * Full-screen menu shown on top of the (already-rendering) Canvas. The map
 * streams in behind it via useGLTF.preload + <Preload all />, so by the time
 * the player clicks "Enter" the world is usually fully loaded. The button
 * stays disabled — showing live progress — until loading finishes; clicking it
 * requests pointer-lock, which flips the game into the 'playing' phase.
 */
export function TitleScreen() {
  const { progress, active } = useProgress();
  const ready = progress >= 100 && !active;

  return (
    <div className="title-screen">
      <div className="title-card">
        <p className="title-eyebrow">Interactive 3D Portfolio</p>
        {/* TODO: change to your name / branding */}
        <h1 className="title-name">Abraham Neidhardt</h1>
        <p className="title-role">Full-Stack Developer</p>

        <p className="title-blurb">
          Step inside a playable portfolio. Walk through themed rooms to explore
          my projects, skills, and background — then click any project hologram
          to open it on GitHub.
        </p>

        <button className="title-start" onClick={() => controlsRef.current?.lock()} disabled={!ready}>
          {ready ? 'Enter Portfolio' : `Loading… ${Math.floor(progress)}%`}
        </button>

        {!ready && (
          <div className="title-progress">
            <div className="title-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}
