import { useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Text, RoundedBox, useCursor, Float } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

const projects = [
  {
    name: 'Awesome Web App',
    description: '# Awesome Web App\n\nThis is a super cool web app built with React, Three.js, and Rapier physics. It features a fully interactive 3D world!',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [25, 2.5, -8.5] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number]
  },
  {
    name: 'Python Data Scraper',
    description: '# Data Scraper\n\nA blazing fast python script that scrapes thousands of pages and stores the data in a local database for analysis.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [35, 2.5, -8.5] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number]
  },
  {
    name: '3D Portfolio',
    description: '# 3D Portfolio\n\nYou are looking at it! A fully 3D interactive portfolio where recruiters can literally walk through my achievements.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [45, 2.5, -8.5] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number]
  },
  {
    name: 'Dockerized Microservices',
    description: '# Microservices\n\nA robust backend architecture using Docker and Kubernetes to orchestrate multiple Node.js and Java microservices.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [25, 2.5, 8.5] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number]
  },
  {
    name: 'Machine Learning Bot',
    description: '# ML Bot\n\nA Discord bot powered by a custom trained neural network that answers questions and plays games.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [35, 2.5, 8.5] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number]
  },
  {
    name: 'Open Source CLI Tool',
    description: '# CLI Tool\n\nA handy command line interface utility written in Go for managing cloud infrastructure deployments.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [45, 2.5, 8.5] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number]
  },
];

function ProjectDisplay({ position, rotation, name, description, githubUrl }: any) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, 'pointer', 'auto');

  const { scale, opacity, beamOpacity } = useSpring({
    scale: hovered ? 1.05 : 1,
    opacity: hovered ? 0.9 : 0.6,
    beamOpacity: hovered ? 0.6 : 0.25,
    config: { mass: 1, tension: 280, friction: 20 }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Floor Projector Base */}
      <RoundedBox args={[6.2, 0.2, 0.5]} radius={0.05} smoothness={4} position={[0, -2.4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[6.0, 0.1, 0.3]} radius={0.02} smoothness={4} position={[0, -2.25, 0]}>
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={hovered ? 2 : 0.5} />
      </RoundedBox>

      {/* Hologram Light Beam */}
      <RoundedBox args={[6.0, 4.3, 0.15]} radius={0.05} smoothness={4} position={[0, -0.15, 0]}>
        <animated.meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={beamOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </RoundedBox>

      {/* Hologram Content */}
      <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2} floatingRange={[0, 0.2]}>
        <animated.group
          scale={scale}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
          onClick={() => window.open(githubUrl, '_blank')}
        >
          {/* Hologram Screen */}
          <RoundedBox args={[6, 4, 0.15]} radius={0.1} smoothness={4} position={[0, 0, 0]}>
            <animated.meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.2}
              transparent
              opacity={opacity}
              depthWrite={false}
            />
          </RoundedBox>

          {/* Grid lines or scan lines for hologram effect */}
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[5.8, 3.8, 30, 20]} />
            <animated.meshBasicMaterial
              color="#00f0ff"
              wireframe
              transparent
              opacity={hovered ? 0.4 : 0.1}
              depthWrite={false}
            />
          </mesh>

          {/* Github Logo / Repo Title */}
          <Text
            position={[-2.6, 1.5, 0.09]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="left"
            anchorY="top"
            fontWeight="bold"
            fillOpacity={0.9}
          >
            {name}
          </Text>

          {/* README Snippet */}
          <Text
            position={[-2.6, 1.0, 0.09]}
            fontSize={0.15}
            color="#e0e0e0"
            anchorX="left"
            anchorY="top"
            maxWidth={5.2}
            lineHeight={1.5}
            fillOpacity={0.8}
          >
            {description}
          </Text>

          {/* Click to open text */}
          <Text
            position={[0, -1.5, 0.09]}
            fontSize={0.15}
            color={hovered ? "#ffffff" : "#00f0ff"}
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.9}
          >
            Click to open in GitHub →
          </Text>
        </animated.group>
      </Float>
    </group>
  );
}

export function ProjectsRoom() {
  return (
    <group>
      {/* Sign above entrance, visible from main room */}
      <group position={[14.48, 6, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Neon purple border */}
        <RoundedBox args={[4.2, 1.0, 0.2]} radius={0.1} smoothness={4} position={[0, 0, -0.05]}>
          <meshStandardMaterial color="#7209b7" emissive="#7209b7" emissiveIntensity={2} />
        </RoundedBox>
        {/* Dark background */}
        <RoundedBox args={[4, 0.8, 0.2]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#1a1a2e" />
        </RoundedBox>
        {/* Text */}
        <Text
          position={[0, 0, 0.11]}
          fontSize={0.6}
          color="#b829ea"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          PROJECTS
        </Text>
      </group>

      {/* Room Structure */}
      <RigidBody type="fixed" colliders="trimesh">
        {/* Floor */}
        <mesh receiveShadow position={[35, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[40, 20]} />
          <meshStandardMaterial color="#0b090a" roughness={0.1} metalness={0.8} /> {/* Dark reflective floor */}
        </mesh>

        {/* Walls */}
        <mesh receiveShadow position={[35, 4, -10]}>
          <boxGeometry args={[40, 8, 1]} />
          <meshStandardMaterial color="#161a1d" /> {/* Dark charcoal walls */}
        </mesh>
        <mesh receiveShadow position={[35, 4, 10]}>
          <boxGeometry args={[40, 8, 1]} />
          <meshStandardMaterial color="#161a1d" />
        </mesh>
        <mesh receiveShadow position={[55, 4, 0]}>
          <boxGeometry args={[1, 8, 20]} />
          <meshStandardMaterial color="#161a1d" />
        </mesh>

        {/* Neon Purple Trims (Top) */}
        <mesh position={[35, 7.9, -9.4]}>
          <boxGeometry args={[40, 0.2, 0.2]} />
          <meshStandardMaterial color="#7209b7" emissive="#7209b7" emissiveIntensity={1} />
        </mesh>
        <mesh position={[35, 7.9, 9.4]}>
          <boxGeometry args={[40, 0.2, 0.2]} />
          <meshStandardMaterial color="#7209b7" emissive="#7209b7" emissiveIntensity={1} />
        </mesh>
        <mesh position={[54.4, 7.9, 0]}>
          <boxGeometry args={[0.2, 0.2, 20]} />
          <meshStandardMaterial color="#7209b7" emissive="#7209b7" emissiveIntensity={1} />
        </mesh>

        {/* Neon Purple Trims (Bottom baseboards) */}
        <mesh position={[35, 0.1, -9.4]}>
          <boxGeometry args={[40, 0.2, 0.2]} />
          <meshStandardMaterial color="#7209b7" emissive="#7209b7" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[35, 0.1, 9.4]}>
          <boxGeometry args={[40, 0.2, 0.2]} />
          <meshStandardMaterial color="#7209b7" emissive="#7209b7" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[54.4, 0.1, 0]}>
          <boxGeometry args={[0.2, 0.2, 20]} />
          <meshStandardMaterial color="#7209b7" emissive="#7209b7" emissiveIntensity={0.5} />
        </mesh>
      </RigidBody>

      {/* Cyberpunk Lighting */}
      <pointLight position={[35, 4, 0]} intensity={1.5} color="#b829ea" distance={50} decay={2} castShadow />
      <ambientLight intensity={0.2} color="#4361ee" />

      {/* Project Displays */}
      {projects.map((project, i) => (
        <ProjectDisplay key={i} {...project} />
      ))}
    </group>
  );
}
