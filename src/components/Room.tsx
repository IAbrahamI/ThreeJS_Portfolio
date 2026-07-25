import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { ProjectHologram } from './ProjectHologram';
import { eastHotspots, PAD_DEST, PAD_MARGIN, type RoomId } from '../rooms';
import { activePads } from '../state/gameStore';

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

        // Push emissive (neon strips, holograms, stars) above the bloom
        // threshold so they glow instead of just looking flat-bright.
        if (mat.emissive && (mat.emissive.r + mat.emissive.g + mat.emissive.b) > 0) {
          mat.emissiveIntensity = Math.max(mat.emissiveIntensity ?? 1, 2.2);
        }
      }
    });
    return scene;
  }, [scene, gl]);

  // Read teleport pad positions straight from the mounted geometry so triggers
  // always line up with what the player sees and stands on.
  useEffect(() => {
    prepared.updateWorldMatrix(true, true);

    const boxes: Record<string, THREE.Box3> = {};
    prepared.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh || !mesh.name) return;
      const base = mesh.name.replace(/_\d+$/, '');
      if (!(base in PAD_DEST)) return;
      (boxes[base] ??= new THREE.Box3()).expandByObject(mesh);
    });

    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    activePads.current = Object.entries(boxes).map(([base, box]) => {
      box.getCenter(center);
      box.getSize(size);
      return {
        x: center.x,
        z: center.z,
        r: Math.max(size.x, size.z) / 2 + PAD_MARGIN,
        to: PAD_DEST[base],
      };
    });

    return () => { activePads.current = []; };
  }, [prepared]);

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
