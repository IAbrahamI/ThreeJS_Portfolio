import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Loader, AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Scene } from './components/Scene';
import { RoomEnv } from './components/RoomEnv';
import { TitleScreen } from './components/TitleScreen';
import { PauseMenu } from './components/PauseMenu';
import { ResumePrompt } from './components/ResumePrompt';
import { FocusPanel } from './components/FocusPanel';
import { LandingPage } from './components/LandingPage';
import { gameStore, useGameState } from './state/gameStore';
import { defaultBindings, toKeyboardMap, type MoveAction } from './state/keybindings';

export default function App() {
  const phase = useGameState((s) => s.phase);
  const room = useGameState((s) => s.room);
  const transitioning = useGameState((s) => s.transitioning);
  const [entered3D, setEntered3D] = useState(false);
  const [bindings, setBindings] = useState(defaultBindings);
  const keyboardMap = useMemo(() => toKeyboardMap(bindings), [bindings]);

  const rebind = (action: MoveAction, code: string) =>
    setBindings((prev) => ({ ...prev, [action]: code }));

  // Keep physics paused briefly after the new room mounts, then resume — long
  // enough for the old colliders to be gone and the player repositioned, so
  // Rapier never steps against torn-down geometry.
  useEffect(() => {
    if (!transitioning) return;
    const id = setTimeout(() => gameStore.set({ transitioning: false }), 200);
    return () => clearTimeout(id);
  }, [transitioning, room]);

  // Show the one-page landing first; entering hands off to the 3D title screen.
  if (!entered3D) return <LandingPage onEnter={() => setEntered3D(true)} />;

  return (
    <>
      <KeyboardControls map={keyboardMap}>
        <div className="canvas-container">
          <Canvas
            shadows="percentage"
            camera={{ fov: 45, near: 0.1, far: 300, position: [0, 2, 6] }}
            dpr={[1, 1.75]}
            gl={{ powerPreference: 'high-performance', antialias: true }}
          >
            {/* Per-room background + lighting (marble/garden vs neon vs space). */}
            <RoomEnv room={room} />

            <Suspense fallback={null}>
              {/* Freeze the simulation behind the title screen, and during room
                  swaps (see `transitioning`) so Rapier never steps against a
                  collider that's being torn down. */}
              <Physics gravity={[0, -20, 0]} paused={phase !== 'playing' || transitioning}>
                <Scene />
              </Physics>
              <Preload all />
            </Suspense>

            {/* Bloom so emissive neon strips, holograms and stars actually glow.
                High threshold = only very bright emissive blooms, not lit walls. */}
            <EffectComposer>
              <Bloom mipmapBlur luminanceThreshold={0.9} intensity={0.55} radius={0.5} />
            </EffectComposer>

            {/* Perf helpers: drop resolution / throttle events under load. */}
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
          </Canvas>
        </div>

        {phase === 'playing' && (
          <div className="ui-layer">
            <div className="crosshair"></div>
            <div className="instructions">
              <span>Move: <span className="key">W</span><span className="key">A</span><span className="key">S</span><span className="key">D</span></span>
              <span>Jump: <span className="key">Space</span></span>
              <span>Look: Mouse</span>
              <span>Pause: <span className="key">Esc</span></span>
            </div>
          </div>
        )}

        {phase === 'title' && <TitleScreen />}
        {phase === 'paused' && <PauseMenu bindings={bindings} onRebind={rebind} />}
        {phase === 'resume' && <ResumePrompt />}
        {phase === 'focus' && <FocusPanel />}
      </KeyboardControls>

      {/* Loader kept only as a fallback; the title screen shows load progress. */}
      {phase !== 'title' && <Loader />}
    </>
  );
}
