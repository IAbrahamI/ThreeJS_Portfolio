import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { ProjectHologram } from './ProjectHologram';
import { eastHotspots, type RoomId } from '../rooms';

/**
 * Loads and mounts a single room GLB. Only one Room is mounted at a time (see
 * Rooms.tsx), so its trimesh collider is the only physics geometry live and its
 * meshes are the only things drawn — that's the render/physics win of the split.
 */
export function Room({ id, url }: { id: RoomId; url: string }) {
  const { scene } = useGLTF(url);
  const gl = useThree((s) => s.gl);

  const prepared = useMemo(() => {
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
        for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap'] as const) {
          const tex = mat[key] as THREE.Texture | null;
          if (tex) {
            tex.anisotropy = maxAnisotropy;
            tex.needsUpdate = true;
          }
        }
        if ('envMapIntensity' in mat) mat.envMapIntensity = 1.0;
      }
    });
    return scene;
  }, [scene, gl]);

  return (
    <>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={prepared} />
      </RigidBody>

      {/* Interactive project holograms live only in the projects (east) room. */}
      {id === 'east' &&
        eastHotspots.map((p, i) => <ProjectHologram key={i} {...p} />)}
    </>
  );
}
