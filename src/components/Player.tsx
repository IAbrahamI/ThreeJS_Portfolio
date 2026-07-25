import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { Euler, Vector3 } from 'three';
import { PointerLockControls } from '@react-three/drei';
import { gameStore, useGameState, controlsRef, playerApi, pendingSpawn, pendingYaw, activePads, beginTeleport } from '../state/gameStore';
import { ROOM_ARRIVAL, ROOM_FACING } from '../rooms';

const SPEED = 12;
const JUMP_FORCE = 8;
const camEuler = new Euler(0, 0, 0, 'YXZ');
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();
const currentVelocity = new Vector3();
const euler = new Euler(0, 0, 0, 'YXZ');

export function Player() {
  const ref = useRef<RapierRigidBody>(null);
  const pointerLockRef = useRef<any>(null);
  const contacts = useRef(0);
  // Teleport is "armed" only when the player is clear of every pad, so standing
  // on the arrival pad after a jump doesn't bounce them straight back.
  const armed = useRef(true);
  const [, get] = useKeyboardControls();
  const sensitivity = useGameState((s) => s.mouseSensitivity);

  // Expose the pointer-lock instance and a respawn handle to the DOM UI so the
  // title screen and pause menu can lock/unlock and "Unstuck" the player.
  useEffect(() => {
    controlsRef.current = pointerLockRef.current;
    playerApi.current = {
      respawn: () => {
        // Always return to the hub starting position, wherever the player is.
        beginTeleport('hub', ROOM_ARRIVAL.hub, ROOM_FACING.hub);
      },
    };
    (window as any).__go = (room: 'hub' | 'east' | 'west' | 'north') =>
      beginTeleport(room, ROOM_ARRIVAL[room], ROOM_FACING[room]);
    (window as any).__play = () => gameStore.set({ phase: 'playing' });
    return () => {
      controlsRef.current = null;
      playerApi.current = null;
    };
  }, []);

  useFrame((state) => {
    const rigidBody = ref.current;
    if (!rigidBody) return;

    // Consume a pending teleport/respawn before anything else.
    if (pendingSpawn.current) {
      const [x, y, z] = pendingSpawn.current;
      rigidBody.setTranslation({ x, y, z }, true);
      rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
      state.camera.position.set(x, y + 1.5, z);
      // Face into the room so the player never lands looking at a wall.
      if (pendingYaw.current !== null) {
        camEuler.set(0, pendingYaw.current, 0, 'YXZ');
        state.camera.quaternion.setFromEuler(camEuler);
        pendingYaw.current = null;
      }
      contacts.current = 0;
      armed.current = false; // re-arms once clear of the arrival pad
      pendingSpawn.current = null;
      return;
    }

    const velocity = rigidBody.linvel();

    // Update camera to follow the player body
    const translation = rigidBody.translation();
    state.camera.position.set(translation.x, translation.y + 1.5, translation.z);

    // Freeze the player while on the title screen or paused: kill horizontal
    // drift but let gravity keep them grounded.
    if (gameStore.get().phase !== 'playing') {
      rigidBody.setLinvel({ x: 0, y: velocity.y, z: 0 }, true);
      return;
    }

    // Teleport pads: trigger when standing on one (and armed). Positions/radii
    // come from the mounted room's real geometry (see Room.tsx).
    let onPad = false;
    for (const pad of activePads.current) {
      const dx = translation.x - pad.x;
      const dz = translation.z - pad.z;
      if (dx * dx + dz * dz < pad.r * pad.r) {
        onPad = true;
        if (armed.current) {
          armed.current = false;
          beginTeleport(pad.to, ROOM_ARRIVAL[pad.to], ROOM_FACING[pad.to]);
          return;
        }
        break;
      }
    }
    // Only re-arm once the new room's pads have actually loaded — otherwise the
    // empty-pads gap during a room swap would re-arm and instantly re-trigger.
    if (!onPad && activePads.current.length > 0) armed.current = true;

    const { forward, backward, left, right, jump } = get();

    // Movement calculation
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);

    // Only use the Y rotation (yaw) so looking up/down doesn't slow down forward movement
    euler.setFromQuaternion(state.camera.quaternion, 'YXZ');
    euler.x = 0;
    euler.z = 0;
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(euler);

    // Apply smooth interpolation for horizontal movement
    currentVelocity.set(velocity.x, 0, velocity.z);
    direction.y = 0;
    currentVelocity.lerp(direction, 0.15);

    let jumpVelocity = velocity.y;

    // The player is grounded if they are touching something and not moving vertically
    const grounded = contacts.current > 0 && Math.abs(velocity.y) < 0.05;

    if (jump && grounded) {
      jumpVelocity = JUMP_FORCE;
    }

    rigidBody.setLinvel({ x: currentVelocity.x, y: jumpVelocity, z: currentVelocity.z }, true);
  });

  return (
    <>
      <PointerLockControls
        ref={pointerLockRef}
        makeDefault
        /* drei's default auto-lock listens on the whole document, so ANY click
           would enter the game. A selector that matches nothing disables that;
           we lock explicitly from the Start / Resume buttons instead. */
        selector="#__no_autolock__"
        pointerSpeed={sensitivity}
        onLock={() => gameStore.set({ phase: 'playing' })}
        onUnlock={() => {
          // ESC (or losing focus when a project link opens in a new tab) drops
          // pointer-lock. Route that into the pause menu instead of leaving the
          // player stuck clicking to re-lock.
          if (gameStore.get().phase === 'playing') gameStore.set({ phase: 'paused' });
        }}
      />
      <RigidBody
        ref={ref}
        colliders={false}
        mass={1}
        type="dynamic"
        position={ROOM_ARRIVAL.hub}
        enabledRotations={[false, false, false]}
        onCollisionEnter={() => { contacts.current += 1; }}
        onCollisionExit={() => { contacts.current -= 1; }}
      >
        <CapsuleCollider args={[0.5, 0.5]} />
        <mesh castShadow>
          <capsuleGeometry args={[0.5, 1, 4]} />
          <meshStandardMaterial color="hotpink" transparent opacity={0} />
        </mesh>
      </RigidBody>
    </>
  );
}
