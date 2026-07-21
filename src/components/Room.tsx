import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useMemo } from 'react';

function ArchedWall({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Draw the wall as a single continuous polygon with the arch cut out from the bottom
    shape.moveTo(-15, 0); // Start bottom left
    shape.lineTo(-2, 0); // Left edge of door
    shape.lineTo(-2, 2.5); // Up left door frame
    // Clockwise arc from left frame to right frame. Center (0, 2.5), radius 2.
    shape.absarc(0, 2.5, 2, Math.PI, 0, true);
    shape.lineTo(2, 0); // Down right door frame
    shape.lineTo(15, 0); // Right edge of wall
    shape.lineTo(15, 8); // Top right
    shape.lineTo(-15, 8); // Top left
    shape.lineTo(-15, 0); // Close shape

    return new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false, curveSegments: 32 });
  }, []);

  return (
    <mesh receiveShadow castShadow position={position} rotation={rotation}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="#d2b48c" />
    </mesh>
  );
}

export function Room() {
  return (
    <>
      {/* Visual Arched Wall (West) */}
      <ArchedWall position={[-14.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      
      {/* Visual Arched Wall (East) */}
      <ArchedWall position={[14.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

      <RigidBody type="fixed" colliders="trimesh">
        {/* Floor */}
      <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#8fbc8f" /> {/* Soft grass green */}
      </mesh>

      {/* Walls (Simple boundaries) */}
      <mesh receiveShadow position={[0, 4, -15]}>
        <boxGeometry args={[30, 8, 1]} />
        <meshStandardMaterial color="#d2b48c" /> {/* Tan / Earthy */}
      </mesh>
      <mesh receiveShadow position={[0, 4, 15]}>
        <boxGeometry args={[30, 8, 1]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>
      {/* Left Wall Physics (West - Skills Room Entrance) */}
      <CuboidCollider position={[-15, 4, -8.5]} args={[0.5, 4, 6.5]} /> {/* Left segment */}
      <CuboidCollider position={[-15, 4, 8.5]} args={[0.5, 4, 6.5]} /> {/* Right segment */}
      <CuboidCollider position={[-15, 6.25, 0]} args={[0.5, 1.75, 2]} /> {/* Lintel above arch */}

      {/* Right Wall Physics (East - Projects Room Entrance) */}
      <CuboidCollider position={[15, 4, -8.5]} args={[0.5, 4, 6.5]} /> {/* Left segment */}
      <CuboidCollider position={[15, 4, 8.5]} args={[0.5, 4, 6.5]} /> {/* Right segment */}
      <CuboidCollider position={[15, 6.25, 0]} args={[0.5, 1.75, 2]} /> {/* Lintel above arch */}
    </RigidBody>
    </>
  );
}
