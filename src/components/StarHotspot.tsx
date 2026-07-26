import { useState } from 'react';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { gameStore, openFocus } from '../state/gameStore';
import type { Hotspot } from '../rooms';

/**
 * Invisible clickable sphere placed over a star/panel. Clicking it (while
 * playing) opens the focus popup with that hotspot's content.
 */
export function StarHotspot({ position, radius, title, body }: Hotspot) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, 'pointer', 'auto');

  return (
    <mesh
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (gameStore.get().phase !== 'playing') return;
        openFocus({ title, body });
      }}
    >
      <sphereGeometry args={[radius, 16, 16]} />
      {/* Faint glow on hover; invisible otherwise but still raycasts. */}
      <meshBasicMaterial
        color="#bcd4ff"
        transparent
        opacity={hovered ? 0.25 : 0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
