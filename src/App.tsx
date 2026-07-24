import { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Sky, Loader, AdaptiveDpr, AdaptiveEvents, Preload, Environment, Lightformer } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Scene } from './components/Scene';
import { TitleScreen } from './components/TitleScreen';
import { PauseMenu } from './components/PauseMenu';
import { ResumePrompt } from './components/ResumePrompt';
import { useGameState } from './state/gameStore';
import { defaultBindings, toKeyboardMap, type MoveAction } from './state/keybindings';

export default function App() {
  const phase = useGameState((s) => s.phase);
  const [bindings, setBindings] = useState(defaultBindings);
  const keyboardMap = useMemo(() => toKeyboardMap(bindings), [bindings]);

  const rebind = (action: MoveAction, code: string) =>
    setBindings((prev) => ({ ...prev, [action]: code }));

  return (
    <>
      <KeyboardControls map={keyboardMap}>
        <div className="canvas-container">
          <Canvas
            shadows
            camera={{ fov: 45, near: 0.1, far: 300, position: [0, 2, 6] }}
            dpr={[1, 1.75]}
            gl={{ powerPreference: 'high-performance', antialias: true }}
          >
            <color attach="background" args={['#87CEEB']} />
            <Sky distance={450000} sunPosition={[30, 40, 20]} inclination={0} azimuth={0.25} />

            {/* Procedural image-based lighting. Gives metallic materials (the gold
                column caps, monitor trim, etc.) something to reflect so they stop
                rendering black. Built from Lightformers = no external HDRI download. */}
            <Environment resolution={256} environmentIntensity={0.55}>
              <Lightformer form="rect" intensity={2.2} color="#fff4e0" position={[0, 8, 6]} scale={[16, 8, 1]} rotation={[-Math.PI / 3, 0, 0]} />
              <Lightformer form="rect" intensity={1.3} color="#ffd9a0" position={[10, 5, -4]} scale={[10, 10, 1]} rotation={[0, -Math.PI / 2, 0]} />
              <Lightformer form="rect" intensity={1.3} color="#cfe8ff" position={[-10, 5, -4]} scale={[10, 10, 1]} rotation={[0, Math.PI / 2, 0]} />
              <Lightformer form="rect" intensity={0.9} color="#ffffff" position={[0, 6, -10]} scale={[16, 8, 1]} />
            </Environment>

            {/* Global lighting. The map bakes its own neon/emissive accents, so we
                only need soft ambient fill plus one shadow-casting sun. */}
            <ambientLight intensity={0.7} color="#fdfbd3" />
            <hemisphereLight args={['#cfe8ff', '#6b5b3e', 0.4]} />
            <directionalLight
              castShadow
              position={[30, 40, 20]}
              intensity={1.6}
              color="#fffff0"
              shadow-mapSize={[2048, 2048]}
              shadow-bias={-0.0004}
              shadow-camera-near={0.5}
              shadow-camera-far={140}
              shadow-camera-left={-32}
              shadow-camera-right={32}
              shadow-camera-top={32}
              shadow-camera-bottom={-32}
            />

            <Suspense fallback={null}>
              {/* Freeze the whole simulation until the player actually enters,
                  so nothing drifts behind the title screen. */}
              <Physics gravity={[0, -20, 0]} paused={phase !== 'playing'}>
                <Scene />
              </Physics>
              <Preload all />
            </Suspense>

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
      </KeyboardControls>

      {/* Loader kept only as a fallback; the title screen shows load progress. */}
      {phase !== 'title' && <Loader />}
    </>
  );
}
