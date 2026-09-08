'use client';
import { Project } from '@/types/activity';
import PixelRobot from './PixelRobot';

interface PixelRoomProps {
  project: Project;
  isActive: boolean;
  taskName?: string;
}

const ROOM_IMAGE: Record<Project, string> = {
  clawckie: '/rooms/lab.png',
  coach_clawckie: '/rooms/gym.png',
  kince: '/rooms/construction.png',
  tremendous: '/rooms/office.png',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PixelRoom({ project, isActive, taskName: _taskName }: PixelRoomProps) {
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden' }}>
      <img
        src={ROOM_IMAGE[project]}
        alt={project}
        style={{
          position:'absolute', inset:0,
          width:'100%', height:'100%',
          objectFit:'cover',
          objectPosition:'center top',
          imageRendering:'pixelated',
          filter: isActive ? 'brightness(1)' : 'brightness(0.4) saturate(0.3)',
          transition:'filter 0.5s ease',
        }}
      />
      {isActive && <PixelRobot project={project} />}
      {!isActive && (
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
          pointerEvents:'none',
        }} />
      )}
    </div>
  );
}
