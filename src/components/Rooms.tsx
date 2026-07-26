import { useGameState } from '../state/gameStore';
import { ROOM_URL } from '../rooms';
import { Room } from './Room';

/**
 * Mounts only the current room. The `key` forces a full unmount/remount on
 * teleport, so the previous room's meshes and collider are torn down and only
 * the active room stays in the scene. All GLBs are prefetched (see rooms.ts),
 * so the swap doesn't wait on a download.
 */
export function Rooms() {
  const room = useGameState((s) => s.room);
  return <Room key={room} id={room} url={ROOM_URL[room]} />;
}
