import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { ProjectHologram, type ProjectHotspot } from './ProjectHologram';

const MAP_URL = '/models/map.glb';

/** Uniform scale for the whole world. Bumps ceiling/doorway clearance so the
 *  player stops clipping the top of room entries. Hotspot positions below are
 *  multiplied by the same factor so the holograms stay aligned. Tweak to taste. */
const MAP_SCALE = 1.12;

/**
 * Projects mapped onto the 6 baked "Holo_Screen" objects in the east cyber room.
 * Screen centres (from the map geometry): x = 11.5 / 15 / 18.5, z = -4 (facing +z)
 * and z = +4 (facing -z), y = 2.13.
 */
const projectHotspots: ProjectHotspot[] = [
  {
    name: 'Awesome Web App',
    description: 'Interactive 3D world built with React, Three.js and Rapier physics.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [11.5, 2.13, -4],
    rotation: [0, 0, 0],
  },
  {
    name: 'Python Data Scraper',
    description: 'Fast Python scraper that harvests thousands of pages into a local DB.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [15, 2.13, -4],
    rotation: [0, 0, 0],
  },
  {
    name: '3D Portfolio',
    description: 'You are walking through it — a fully interactive 3D portfolio.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [18.5, 2.13, -4],
    rotation: [0, 0, 0],
  },
  {
    name: 'Dockerized Microservices',
    description: 'Docker + Kubernetes orchestrating Node.js and Java microservices.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [11.5, 2.13, 4],
    rotation: [0, Math.PI, 0],
  },
  {
    name: 'Machine Learning Bot',
    description: 'Discord bot powered by a custom-trained neural network.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [15, 2.13, 4],
    rotation: [0, Math.PI, 0],
  },
  {
    name: 'Open Source CLI Tool',
    description: 'Go command-line utility for managing cloud infrastructure deploys.',
    githubUrl: 'https://github.com/IAbrahamI/Kuroro',
    position: [18.5, 2.13, 4],
    rotation: [0, Math.PI, 0],
  },
];

export function Map() {
  const { scene } = useGLTF(MAP_URL);
  const gl = useThree((s) => s.gl);

  // Prepare the scene once: shadows, frustum culling, and material fixes.
  const preparedScene = useMemo(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = true;

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        const mat = material as THREE.MeshStandardMaterial;

        // Kill the shimmery cross-hatch / moiré on walls & screens at grazing
        // angles by enabling anisotropic filtering on every texture map.
        for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap'] as const) {
          const tex = mat[key] as THREE.Texture | null;
          if (tex) {
            tex.anisotropy = maxAnisotropy;
            tex.needsUpdate = true;
          }
        }

        // Let metals actually reflect the environment (fixes "gold looks black").
        if ('envMapIntensity' in mat) mat.envMapIntensity = 1.0;
      }
    });
    return scene;
  }, [scene, gl]);

  return (
    <>
      {/* The whole map is one static body. Rapier auto-builds trimesh colliders
          from every child mesh, so the player collides with walls, furniture,
          altars, columns, etc. Scale is baked into the generated colliders. */}
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={preparedScene} scale={MAP_SCALE} />
      </RigidBody>

      {/* Interactive project holograms sitting on the map's Holo_Screen objects.
          Positions are scaled to match the enlarged map. */}
      {projectHotspots.map((p, i) => (
        <ProjectHologram
          key={i}
          {...p}
          position={[p.position[0] * MAP_SCALE, p.position[1] * MAP_SCALE, p.position[2] * MAP_SCALE]}
        />
      ))}
    </>
  );
}

// Warm the cache so the model starts downloading immediately.
useGLTF.preload(MAP_URL);
