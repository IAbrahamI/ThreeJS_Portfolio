import { useState } from 'react';
import { Text, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { gameStore } from '../state/gameStore';

export interface ProjectHotspot {
  name: string;
  description: string;
  githubUrl: string;
  /** World-space center of the target Holo_Screen (from the map geometry). */
  position: [number, number, number];
  /** Rotation so the interactive surface faces into the room. */
  rotation: [number, number, number];
}

/**
 * An invisible clickable surface + floating label placed directly on one of the
 * map's baked "Holo_Screen" objects. Keeps the projects room interactive:
 * hovering highlights it, clicking opens the GitHub repo.
 */
export function ProjectHologram({ name, description, githubUrl, position, rotation }: ProjectHotspot) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, 'pointer', 'auto');

  return (
    <group position={position} rotation={rotation}>
      {/* Invisible raycast target sized to the screen. Sits just in front of it. */}
      <mesh
        position={[0, 0, 0.06]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          // Only open while actively playing. After returning from the opened
          // tab the game is 'paused', so a re-lock click won't re-trigger it.
          if (gameStore.get().phase !== 'playing') return;
          window.open(githubUrl, '_blank', 'noopener');
        }}
      >
        <planeGeometry args={[2.6, 1.5]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={hovered ? 0.18 : 0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.5, 0.08]}
        fontSize={0.2}
        color={hovered ? '#ffffff' : '#8ff6ff'}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.4}
        fontWeight="bold"
        outlineWidth={0.006}
        outlineColor="#003844"
      >
        {name}
      </Text>

      {/* Short description */}
      <Text
        position={[0, -0.02, 0.08]}
        fontSize={0.1}
        color="#c9faff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.35}
        lineHeight={1.35}
        fillOpacity={0.85}
      >
        {description}
      </Text>

      {/* Call to action */}
      <Text
        position={[0, -0.58, 0.08]}
        fontSize={0.1}
        color={hovered ? '#ffffff' : '#00f0ff'}
        anchorX="center"
        anchorY="middle"
      >
        Click to open in GitHub →
      </Text>
    </group>
  );
}
