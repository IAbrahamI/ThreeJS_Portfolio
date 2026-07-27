import { useEffect, useMemo, useRef } from 'react';
import { useGLTF, Text, Billboard } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { ProjectHologram } from './ProjectHologram';
import { StarHotspot } from './StarHotspot';
import { SkillIcons } from './SkillIcons';
import { eastHotspots, northHotspots, NON_COLLIDER, NORTH_HIDE, PAD_DEST, PAD_MARGIN, type RoomId } from '../rooms';
import { activePads } from '../state/gameStore';

// Emissive strength: neon strips/stars vs teleport pads & pedestals. Tunable.
const NEON_EMISSIVE = 1.7;
const PLATFORM_EMISSIVE = 1.9;
const PLATFORM = /HoloPed|HoloCtr|Teleport|Plinth|Pad/;

/**
 * Loads and mounts a single room GLB. Only one Room is mounted at a time (see
 * Rooms.tsx), so its trimesh collider is the only physics geometry live and its
 * meshes are the only things drawn — that's the render/physics win of the split.
 *
 * The GLB scene is cloned per mount so we never mutate the useGLTF cache (which
 * would make detached decorations vanish on the second visit). Decorative
 * floating objects are detached into a non-colliding group so the player phases
 * through them.
 */
export function Room({ id, url }: { id: RoomId; url: string }) {
  const { scene } = useGLTF(url);
  const gl = useThree((s) => s.gl);
  const coreRef = useRef<THREE.Object3D | null>(null);
  const coreBase = useRef(new THREE.Vector3());

  const { solid, decorations } = useMemo(() => {
    // Fresh copy every mount — never touch the shared cached scene.
    const root = scene.clone(true);
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      // Hide the unused constellation star (and its glow).
      if (id === 'north' && NORTH_HIDE.test(mesh.name)) mesh.visible = false;

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = true;

      const isPlatform = PLATFORM.test(mesh.name);
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const out = mats.map((m) => {
        // Clone platform materials so dimming them doesn't touch other meshes.
        let mat = m as THREE.MeshStandardMaterial;
        if (isPlatform) mat = mat.clone();

        for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap'] as const) {
          const tex = mat[key] as THREE.Texture | null;
          if (tex) { tex.anisotropy = maxAnisotropy; tex.needsUpdate = true; }
        }
        if ('envMapIntensity' in mat) mat.envMapIntensity = 1.0;

        if (mat.emissive && (mat.emissive.r + mat.emissive.g + mat.emissive.b) > 0) {
          mat.emissiveIntensity = isPlatform
            ? PLATFORM_EMISSIVE
            : Math.max(mat.emissiveIntensity ?? 1, NEON_EMISSIVE);
        }
        return mat;
      });
      mesh.material = Array.isArray(mesh.material) ? out : out[0];
    });

    // Detach non-colliding decorations (particles, core, constellation) so the
    // player passes through them. attach() keeps their world transform.
    const decorations = new THREE.Group();
    const pattern = NON_COLLIDER[id];
    if (pattern) {
      const toMove: THREE.Object3D[] = [];
      root.traverse((o) => { if (o.name && pattern.test(o.name)) toMove.push(o); });
      for (const o of toMove) decorations.attach(o);
    }

    return { solid: root, decorations };
  }, [scene, gl, id]);

  // Read teleport pad positions straight from the mounted geometry so triggers
  // always line up with what the player sees and stands on. Also locate the
  // animated core here (post-commit) so the ref points at the on-screen clone.
  useEffect(() => {
    solid.updateWorldMatrix(true, true);

    let core: THREE.Object3D | null = null;
    decorations.traverse((o) => { if (o.name === 'Obs_Core') core = o; });
    coreRef.current = core;
    if (core) coreBase.current.copy((core as THREE.Object3D).position);

    const boxes: Record<string, THREE.Box3> = {};
    solid.traverse((obj) => {
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

    return () => { activePads.current = []; coreRef.current = null; };
  }, [solid, decorations]);

  // Observatory core: spins on its own axis (same xz) with a clear vertical float.
  useFrame((state) => {
    const core = coreRef.current;
    if (!core) return;
    const t = state.clock.elapsedTime;
    core.rotation.y = t * 0.8;
    core.position.y = coreBase.current.y + Math.sin(t * 1.4) * 0.25;
  });

  return (
    <>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={solid} />
      </RigidBody>

      {/* Non-colliding decorations (particles, core, constellation). */}
      <primitive object={decorations} />

      {/* Interactive project holograms live only in the projects (east) room. */}
      {id === 'east' &&
        eastHotspots.map((p, i) => <ProjectHologram key={i} {...p} />)}

      {/* Clickable stars, company logos, and the billboarded title. */}
      {id === 'north' && (
        <>
          {northHotspots.map((h, i) => <StarHotspot key={i} {...h} />)}
          <Billboard position={[5.4, 6.1, 9.5]}>
            <Text
              fontSize={0.5}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
              color="#dfe9ff"
              outlineWidth={0.02}
              outlineColor="#0a1430"
            >
              Work Experience
            </Text>
          </Billboard>
          <Billboard position={[0, 3.95, 10.7]}>
            <Text
              fontSize={0.42}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
              color="#dfe9ff"
              outlineWidth={0.018}
              outlineColor="#0a1430"
            >
              About Me
            </Text>
          </Billboard>
        </>
      )}

      {/* Skill icons hovering over the altars in the skills room. */}
      {id === 'west' && <SkillIcons />}
    </>
  );
}
