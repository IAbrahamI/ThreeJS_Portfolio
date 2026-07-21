import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Sky } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Scene } from './components/Scene';

export default function App() {
  return (
    <>
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
          { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
          { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'right', keys: ['ArrowRight', 'KeyD'] },
          { name: 'jump', keys: ['Space'] },
        ]}
      >
        <div className="canvas-container">
          <Canvas shadows camera={{ fov: 45 }}>
            <color attach="background" args={['#87CEEB']} />
            <Sky distance={450000} sunPosition={[1, 1, 0]} inclination={0} azimuth={0.25} />
            <ambientLight intensity={0.6} color="#fdfbd3" />
            <directionalLight 
              castShadow 
              position={[10, 20, 5]} 
              intensity={1.5} 
              shadow-mapSize={[1024, 1024]} 
              color="#fffff0"
            />
            
            <Physics gravity={[0, -20, 0]}>
              <Scene />
            </Physics>
          </Canvas>
        </div>
        
        <div className="ui-layer">
          <div className="crosshair"></div>
          <div className="instructions">
            <span>Move: <span className="key">W</span><span className="key">A</span><span className="key">S</span><span className="key">D</span></span>
            <span>Jump: <span className="key">Space</span></span>
            <span>Look: Mouse</span>
            <span>Click to start</span>
          </div>
        </div>
      </KeyboardControls>
    </>
  );
}
