import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { Euler, Vector3 } from 'three';
import { PointerLockControls } from '@react-three/drei';

const SPEED = 12;
const JUMP_FORCE = 8;
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();
const currentVelocity = new Vector3();
const euler = new Euler(0, 0, 0, 'YXZ');

export function Player() {
  const ref = useRef<RapierRigidBody>(null);
  const contacts = useRef(0);
  const [, get] = useKeyboardControls();

  useFrame((state) => {
    const { forward, backward, left, right, jump } = get();

    const rigidBody = ref.current;
    if (!rigidBody) return;

    const velocity = rigidBody.linvel();

    // Update camera to follow the player body
    const translation = rigidBody.translation();
    state.camera.position.set(translation.x, translation.y + 1.5, translation.z);

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
      <PointerLockControls />
      <RigidBody
        ref={ref}
        colliders={false}
        mass={1}
        type="dynamic"
        position={[0, 2, 0]}
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
