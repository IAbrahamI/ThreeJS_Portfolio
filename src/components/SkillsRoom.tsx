import { RigidBody } from '@react-three/rapier';
import { Text, Float, Billboard, RoundedBox } from '@react-three/drei';

const skills = [
  { name: 'Python', color: '#306998', position: [-25, 0, -6], geometry: <torusKnotGeometry args={[0.4, 0.15, 64, 8]} /> },
  { name: 'JavaScript', color: '#F7DF1E', position: [-35, 0, -6], geometry: <boxGeometry args={[0.8, 0.8, 0.8]} /> },
  { name: 'Blender', color: '#ea7600', position: [-45, 0, -6], geometry: <coneGeometry args={[0.6, 1.2, 32]} /> },
  { name: 'Java', color: '#f89820', position: [-25, 0, 6], geometry: <octahedronGeometry args={[0.6]} /> },
  { name: 'Docker', color: '#0db7ed', position: [-35, 0, 6], geometry: <cylinderGeometry args={[0.6, 0.6, 0.8, 32]} /> },
  { name: 'Kubernetes', color: '#326ce5', position: [-45, 0, 6], geometry: <dodecahedronGeometry args={[0.6]} /> },
];

function GreekColumn({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.5, 0.4, 1.5]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        <mesh position={[0, 3.8, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.5, 0.5, 6.8, 16]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        <mesh position={[0, 7.4, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.5, 0.4, 1.5]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </RigidBody>
    </group>
  );
}

function SkillAltar({ position, name, color, geometry }: any) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        {/* Base steps */}
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[2.5, 0.4, 2.5]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        <mesh position={[0, 0.6, 0]} receiveShadow castShadow>
          <boxGeometry args={[2, 0.4, 2]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
        {/* Pillar */}
        <mesh position={[0, 1.5, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.8, 0.8, 1.4, 16]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        {/* Top */}
        <mesh position={[0, 2.3, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.8, 0.2, 1.8]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
      </RigidBody>

      {/* Floating Logo */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1} floatingRange={[0, 0.5]}>
        <group position={[0, 3.5, 0]}>
          <mesh castShadow>
            {geometry}
            <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
          </mesh>
          <Billboard position={[0, -0.7, 0]}>
            <Text
              fontSize={0.4}
              color={color}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#ffffff"
              fontWeight="bold"
            >
              {name}
            </Text>
          </Billboard>
        </group>
      </Float>
    </group>
  );
}

export function SkillsRoom() {
  return (
    <group>
      {/* Sign above entrance, visible from main room */}
      <group position={[-14.48, 6, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Light blue border */}
        <RoundedBox args={[4.1, 0.9, 0.2]} radius={0.1} smoothness={4} position={[0, 0, -0.05]}>
          <meshStandardMaterial color="#add8e6" />
        </RoundedBox>
        {/* White background */}
        <RoundedBox args={[4, 0.8, 0.2]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#ffffff" />
        </RoundedBox>
        {/* Text */}
        <Text
          position={[0, 0, 0.11]}
          fontSize={0.6}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          SKILLS
        </Text>
      </group>

      {/* Room Structure */}
      <RigidBody type="fixed" colliders="trimesh">
        {/* Floor */}
        <mesh receiveShadow position={[-35, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[40, 20]} />
          <meshStandardMaterial color="#fafad2" /> {/* Light Goldenrod Yellow for Glory */}
        </mesh>

        {/* Walls */}
        <mesh receiveShadow position={[-35, 4, -10]}>
          <boxGeometry args={[40, 8, 1]} />
          <meshStandardMaterial color="#fdfdfd" /> {/* Bright White */}
        </mesh>
        <mesh receiveShadow position={[-35, 4, 10]}>
          <boxGeometry args={[40, 8, 1]} />
          <meshStandardMaterial color="#fdfdfd" />
        </mesh>
        <mesh receiveShadow position={[-55, 4, 0]}>
          <boxGeometry args={[1, 8, 20]} />
          <meshStandardMaterial color="#fdfdfd" />
        </mesh>

        {/* Gold Trims */}
        <mesh receiveShadow position={[-35, 7.9, -9.4]}>
          <boxGeometry args={[40, 0.2, 0.2]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
        <mesh receiveShadow position={[-35, 7.9, 9.4]}>
          <boxGeometry args={[40, 0.2, 0.2]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
        <mesh receiveShadow position={[-54.4, 7.9, 0]}>
          <boxGeometry args={[0.2, 0.2, 20]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
      </RigidBody>

      {/* Glory Lighting */}
      <pointLight position={[-35, 4, 0]} intensity={2.0} color="#ffd700" distance={50} decay={2} castShadow />

      {/* Decorative Columns */}
      <GreekColumn position={[-17, 0, -8]} />
      <GreekColumn position={[-53, 0, -8]} />
      <GreekColumn position={[-17, 0, 8]} />
      <GreekColumn position={[-53, 0, 8]} />

      {/* Altars */}
      {skills.map((skill, i) => (
        <SkillAltar key={i} {...skill} />
      ))}
    </group>
  );
}
