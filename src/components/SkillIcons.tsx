import { useEffect, useMemo, useRef } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SKILL_ICONS_URL, ICON_ALTAR } from '../rooms';

/** Height of the name labels above the floor (just above the altar caps). */
const LABEL_Y = 1.85;

/** Pretty display name from an "Icon_*" node name. */
const label = (name: string) => name.replace(/^Icon_/, '');

/**
 * Skill icons hovering over the west room's altars. The icons live in their own
 * GLB, roughly positioned; here we snap each to its altar's exact center (the
 * export was offset ~0.55 in x), auto-fix the oversized Blender icon, and float
 * them gently up and down. Rendered outside any RigidBody, so they don't collide.
 */
export function SkillIcons() {
  const { scene } = useGLTF(SKILL_ICONS_URL);
  const iconsRef = useRef<{ obj: THREE.Object3D; baseY: number; phase: number }[]>([]);

  // Flatten icons into one group (world space) and place each over its altar.
  const group = useMemo(() => {
    const root = scene.clone(true);
    root.updateWorldMatrix(true, true);

    const flat = new THREE.Group();
    for (const name of Object.keys(ICON_ALTAR)) {
      const obj = root.getObjectByName(name);
      if (obj) flat.attach(obj); // preserves world transform, parent = identity
    }

    const box = new THREE.Box3();
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    for (const [name, [ax, az]] of Object.entries(ICON_ALTAR)) {
      const obj = flat.getObjectByName(name);
      if (!obj) continue;

      // Rescue broken/oversized icons (e.g. the Blender export) to a sane size.
      box.setFromObject(obj);
      box.getSize(size);
      let forcedY: number | null = null;
      if (Math.max(size.x, size.y, size.z) > 3) {
        obj.scale.multiplyScalar(0.9 / Math.max(size.x, size.y, size.z));
        obj.updateMatrixWorld(true);
        forcedY = 2.7; // its baked height is unreliable
      }

      // Center the icon's bounding box over the altar (keep its own hover height
      // unless we had to rescue it). Icons are direct children now, so local ==
      // world space.
      box.setFromObject(obj);
      box.getCenter(center);
      obj.position.x += ax - center.x;
      obj.position.z += az - center.z;
      obj.position.y += (forcedY ?? center.y) - center.y;
    }

    return flat;
  }, [scene]);

  // Collect the icons post-commit so the refs point at the on-screen objects.
  useEffect(() => {
    const list: { obj: THREE.Object3D; baseY: number; phase: number }[] = [];
    let phase = 0;
    for (const child of group.children) {
      list.push({ obj: child, baseY: child.position.y, phase });
      phase += 0.8;
    }
    iconsRef.current = list;
    return () => { iconsRef.current = []; };
  }, [group]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (const it of iconsRef.current) {
      it.obj.position.y = it.baseY + Math.sin(t * 1.2 + it.phase) * 0.13;
    }
  });

  return (
    <>
      <primitive object={group} />

      {/* Name labels on each altar, turned to face the room. */}
      {Object.entries(ICON_ALTAR).map(([name, [ax, az]]) => (
        <Text
          key={name}
          position={[ax, LABEL_Y, az]}
          rotation={[0, az < 0 ? 0 : Math.PI, 0]}
          fontSize={0.18}
          maxWidth={2.4}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          color="#3a2f1a"
          outlineWidth={0.008}
          outlineColor="#f6f1e2"
        >
          {label(name)}
        </Text>
      ))}
    </>
  );
}
