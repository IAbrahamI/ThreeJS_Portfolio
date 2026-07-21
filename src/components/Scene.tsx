import { Player } from './Player';
import { Room } from './Room';
import { SkillsRoom } from './SkillsRoom';
import { ProjectsRoom } from './ProjectsRoom';

export function Scene() {
  return (
    <>
      <Room />
      <SkillsRoom />
      <ProjectsRoom />
      <Player />
    </>
  );
}
