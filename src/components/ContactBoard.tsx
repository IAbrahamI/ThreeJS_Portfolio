import { useState } from 'react';
import { Text, useCursor } from '@react-three/drei';
import { gameStore } from '../state/gameStore';

/**
 * Contact info shown on the hub's south reception board (the "ContactPanel"
 * mesh at (0, 1.98, 7.72), facing −z toward the room). Each line is clickable
 * and opens the matching link while playing.
 */

const CONTACTS: { label: string; url: string; y: number }[] = [
  { label: 'abraham.neidhardt@outlook.com', url: 'mailto:abraham.neidhardt@outlook.com', y: 0.12 },
  { label: 'github.com/IAbrahamI', url: 'https://github.com/IAbrahamI', y: -0.08 },
  // TODO: replace with your real Instagram handle.
  { label: 'instagram.com/ab_neid_', url: 'https://instagram.com/ab_neid_', y: -0.28 },
];

function ContactLink({ label, url, y }: { label: string; url: string; y: number }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, 'pointer', 'auto');

  return (
    <group position={[0, y, 0]}>
      {/* Invisible, reliably-clickable hit area over the text. */}
      <mesh
        position={[0, 0, 0.002]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          if (gameStore.get().phase !== 'playing') return;
          window.open(url, '_blank', 'noopener');
        }}
      >
        <planeGeometry args={[1.4, 0.16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Text
        fontSize={0.078}
        color={hovered ? '#1155cc' : '#4a3520'}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.4}
        fontWeight="bold"
      >
        {label}
      </Text>
    </group>
  );
}

export function ContactBoard() {
  return (
    <group position={[0, 1.98, 7.69]} rotation={[0, Math.PI, 0]}>
      <Text
        position={[0, 0.36, 0]}
        fontSize={0.14}
        color="#2f2110"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Get in Touch
      </Text>

      {CONTACTS.map((c) => (
        <ContactLink key={c.label} {...c} />
      ))}
    </group>
  );
}
