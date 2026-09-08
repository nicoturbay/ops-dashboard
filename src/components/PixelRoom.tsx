'use client';
import { Project, PROJECT_CONFIG } from '@/types/activity';

interface PixelRoomProps {
  project: Project;
  isActive: boolean;
  taskName?: string;
}

const ROOM_IMAGE: Record<Project, string> = {
  clawckie: '/rooms/lab.png',
  coach_clawckie: '/rooms/gym.png',
  kince: '/rooms/construction.png',
  tremendous: '/rooms/tremendous.png',
};

const AGENT_IMAGE: Record<Project, string> = {
  clawckie: '/agent-clawckie.png',
  coach_clawckie: '/agent-coach.png',
  kince: '/agent-kince.png',
  tremendous: '/agent-tremendous.png',
};

export default function PixelRoom({ project, isActive }: PixelRoomProps) {
  const config = PROJECT_CONFIG[project];

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden' }}>
      {/* Room background */}
      <img
        src={ROOM_IMAGE[project]}
        alt={project}
        style={{
          position:'absolute', inset:0,
          width:'100%', height:'100%',
          objectFit:'cover',
          objectPosition:'center top',
          imageRendering:'pixelated',
          filter: isActive ? 'brightness(1)' : 'brightness(0.35) saturate(0.2)',
          transition:'filter 0.6s ease',
        }}
      />

      {/* Scanline overlay when idle */}
      {!isActive && (
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
          pointerEvents:'none',
          zIndex: 2,
        }} />
      )}

      {/* Agent — patrols center of room when active */}
      {isActive && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '20%',      /* constrain to middle 60% of room */
          width: '60%',
          height: '22%',
          zIndex: 3,
          pointerEvents: 'none',
          overflow: 'visible',
        }}>
          <img
            src={AGENT_IMAGE[project]}
            alt={`${project} agent`}
            style={{
              position: 'absolute',
              bottom: 0,
              height: '100%',
              width: 'auto',
              imageRendering: 'pixelated',
              animation: 'agent-patrol 7s linear infinite',
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes agent-patrol {
          0%   { left: 0%;   transform: scaleX(1); }
          45%  { left: 80%;  transform: scaleX(1); }
          50%  { left: 80%;  transform: scaleX(-1); }
          95%  { left: 0%;   transform: scaleX(-1); }
          100% { left: 0%;   transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
