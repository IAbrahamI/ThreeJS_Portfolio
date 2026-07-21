import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface ExhibitProps {
  position: [number, number, number];
  title: string;
  content: string;
  color?: string;
}

export function Exhibit({ position, title, content, color = "#ffb6c1" }: ExhibitProps) {
  const [showInfo, setShowInfo] = useState(false);
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Simple proximity check
    const distance = state.camera.position.distanceTo(meshRef.current.position);
    if (distance < 5 && !showInfo) {
      setShowInfo(true);
    } else if (distance >= 5 && showInfo) {
      setShowInfo(false);
    }
    
    // Gently float
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
        
        <Html
          position={[0, 1.5, 0]}
          center
          distanceFactor={10}
          style={{
            opacity: showInfo ? 1 : 0,
            transform: `scale(${showInfo ? 1 : 0.8})`,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <div className="exhibit-info">
            <h2 className="exhibit-title">{title}</h2>
            <p className="exhibit-content">{content}</p>
          </div>
        </Html>
      </mesh>
      
      {/* Pedestal */}
      <mesh position={[0, -1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.5, 0.6, 1, 16]} />
        <meshStandardMaterial color="#a0522d" /> {/* Sienna wood color */}
      </mesh>
    </group>
  );
}
