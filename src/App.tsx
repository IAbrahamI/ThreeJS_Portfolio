import { lazy, Suspense, useState } from 'react';
import { LandingPage } from './components/LandingPage';

// Heavy three.js / drei / rapier code is split into its own chunk, downloaded
// only when the visitor enters the 3D world.
const Portfolio3D = lazy(() => import('./Portfolio3D'));

export default function App() {
  const [entered3D, setEntered3D] = useState(false);

  // Show the one-page landing first; entering hands off to the 3D title screen.
  if (!entered3D) return <LandingPage onEnter={() => setEntered3D(true)} />;

  return (
    <Suspense fallback={<Loading3D />}>
      <Portfolio3D onExit={() => setEntered3D(false)} />
    </Suspense>
  );
}

/** Shown while the 3D chunk downloads. */
function Loading3D() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #3d92f0 0%, #2f7ae6 50%, #1f5fc8 100%)',
        color: '#eaf6ff',
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 700,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontSize: '0.95rem',
      }}
    >
      Loading 3D Portfolio…
    </div>
  );
}
