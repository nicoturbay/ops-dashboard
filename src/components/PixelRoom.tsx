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
  tremendous: '/rooms/office.png',
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

      {/* Agent illustration — bottom-center of room */}
      <div style={{
        position: 'absolute',
        bottom: 22,   // above the task bar
        left: '50%',
        transform: 'translateX(-50%)',
        width: '18%',
        zIndex: 3,
        opacity: isActive ? 1 : 0.2,
        transition: 'opacity 0.6s ease',
        animation: isActive ? 'agent-bob 2.5s ease-in-out infinite' : undefined,
        filter: isActive
          ? `drop-shadow(0 0 10px ${config.color}) drop-shadow(0 2px 4px rgba(0,0,0,0.8))`
          : 'none',
      }}>
        <img
          src={AGENT_IMAGE[project]}
          alt={`${project} agent`}
          style={{
            width: '100%',
            height: 'auto',
            imageRendering: 'pixelated',
            display: 'block',
          }}
        />
      </div>

      <style>{`
        @keyframes agent-bob {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50%       { transform: translateX(-50%) translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
