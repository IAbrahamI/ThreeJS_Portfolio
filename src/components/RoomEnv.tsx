import { Sky, Stars, Environment, Lightformer } from '@react-three/drei';
import type { RoomId } from '../rooms';

/**
 * Per-room background + lighting. Only one room is mounted at a time, so each
 * gets its own mood: bright marble/garden with sun + shadows, dark cyber room
 * lit by neon, and a dark star-filled observatory.
 */
export function RoomEnv({ room }: { room: RoomId }) {
  if (room === 'east') return <CyberEnv />;
  if (room === 'north') return <SpaceEnv />;
  return <DaylightEnv bright={room === 'hub'} />;
}

/** Marble (west) + garden hub: sky, sun, shadows, subtle IBL for the gold. */
function DaylightEnv({ bright }: { bright: boolean }) {
  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      <Sky distance={450000} sunPosition={[30, 40, 20]} inclination={0} azimuth={0.25} />

      <Environment resolution={256} environmentIntensity={0.35}>
        <Lightformer form="rect" intensity={2} color="#fff4e0" position={[0, 8, 6]} scale={[16, 8, 1]} rotation={[-Math.PI / 3, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#ffd9a0" position={[10, 5, -4]} scale={[10, 10, 1]} rotation={[0, -Math.PI / 2, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#cfe8ff" position={[-10, 5, -4]} scale={[10, 10, 1]} rotation={[0, Math.PI / 2, 0]} />
      </Environment>

      {/* Lower ambient + a strong sun so shadows read dramatically. */}
      <ambientLight intensity={bright ? 0.5 : 0.35} color="#fdfbd3" />
      <hemisphereLight args={['#cfe8ff', '#6b5b3e', bright ? 0.4 : 0.25]} />
      <directionalLight
        castShadow
        position={[24, 34, 16]}
        intensity={bright ? 2.2 : 2.6}
        color="#fffdf5"
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-near={0.5}
        shadow-camera-far={140}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={32}
        shadow-camera-bottom={-32}
      />
    </>
  );
}

/** Projects room: dark, lit by magenta/cyan neon so the light "comes from" the strips. */
function CyberEnv() {
  return (
    <>
      <color attach="background" args={['#08080f']} />
      <ambientLight intensity={0.18} color="#5566aa" />
      {/* Ceiling magenta strips (E_RoofNeon at 0,3.8,±3). */}
      <pointLight position={[0, 3.5, 3]} intensity={7} distance={14} decay={2} color="#ff2d95" />
      <pointLight position={[0, 3.5, -3]} intensity={7} distance={14} decay={2} color="#ff2d95" />
      {/* Cyan wall accents (low lines / hologram glow). */}
      <pointLight position={[0, 1.3, 5]} intensity={5} distance={12} decay={2} color="#00e5ff" />
      <pointLight position={[0, 1.3, -5]} intensity={5} distance={12} decay={2} color="#00e5ff" />
      {/* Far-wall magenta wash. */}
      <pointLight position={[6, 2.6, 0]} intensity={4.5} distance={12} decay={2} color="#ff56c1" />
    </>
  );
}

/** Observatory: near-black space with a star-filled sky. */
function SpaceEnv() {
  return (
    <>
      <color attach="background" args={['#01010a']} />
      <Stars radius={120} depth={60} count={6000} factor={4} saturation={0} fade speed={0.6} />
      <ambientLight intensity={0.2} color="#4455aa" />
      {/* Soft cool fill over the observation deck so the brass/glass reads. */}
      <pointLight position={[0, 5, 10.7]} intensity={9} distance={26} decay={2} color="#9fc4ff" />
      <hemisphereLight args={['#20305a', '#05060f', 0.3]} />
    </>
  );
}
