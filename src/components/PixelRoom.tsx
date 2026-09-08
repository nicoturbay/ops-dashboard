'use client';
import { Project, PROJECT_CONFIG } from '@/types/activity';

interface PixelRoomProps {
  project: Project;
  isActive: boolean;
  taskName?: string;
}

const ROOM_IMAGE: Record<Project, string> = {
  clawckie:       '/rooms/lab.png',
  coach_clawckie: '/rooms/gym.png',
  kince:          '/rooms/construction.png',
  tremendous:     '/rooms/tremendous.png',
};

const AGENT_IMAGE: Record<Project, string> = {
  clawckie:       '/agent-clawckie.png',
  coach_clawckie: '/agent-coach.png',
  kince:          '/agent-kince.png',
  tremendous:     '/agent-tremendous.png',
};

// Each project gets a unique wander path so agents don't move in sync.
// They roam within the center 50% of the room (25%–75% h, 20%–80% w).
// CSS keyframes: left% moves horizontally, margin-top shifts vertically.
const WANDER_KEYFRAMES: Record<string, string> = {
  clawckie: `
    @keyframes wander-clawckie {
      0%   { left: 20%; margin-top: 0%;   transform: scaleX(1); }
      20%  { left: 65%; margin-top: -8%;  transform: scaleX(1); }
      40%  { left: 70%; margin-top: 6%;   transform: scaleX(-1); }
      60%  { left: 30%; margin-top: 8%;   transform: scaleX(-1); }
      80%  { left: 25%; margin-top: -6%;  transform: scaleX(1); }
      100% { left: 20%; margin-top: 0%;   transform: scaleX(1); }
    }
  `,
  coach_clawckie: `
    @keyframes wander-coach {
      0%   { left: 55%; margin-top: 4%;   transform: scaleX(-1); }
      25%  { left: 25%; margin-top: -6%;  transform: scaleX(-1); }
      50%  { left: 20%; margin-top: 8%;   transform: scaleX(1); }
      75%  { left: 60%; margin-top: -4%;  transform: scaleX(1); }
      100% { left: 55%; margin-top: 4%;   transform: scaleX(-1); }
    }
  `,
  kince: `
    @keyframes wander-kince {
      0%   { left: 40%; margin-top: -8%;  transform: scaleX(1); }
      30%  { left: 65%; margin-top: 6%;   transform: scaleX(1); }
      55%  { left: 55%; margin-top: -4%;  transform: scaleX(-1); }
      80%  { left: 20%; margin-top: 8%;   transform: scaleX(-1); }
      100% { left: 40%; margin-top: -8%;  transform: scaleX(1); }
    }
  `,
  tremendous: `
    @keyframes wander-tremendous {
      0%   { left: 60%; margin-top: 6%;   transform: scaleX(-1); }
      25%  { left: 35%; margin-top: -8%;  transform: scaleX(-1); }
      50%  { left: 25%; margin-top: 4%;   transform: scaleX(1); }
      75%  { left: 55%; margin-top: -6%;  transform: scaleX(1); }
      100% { left: 60%; margin-top: 6%;   transform: scaleX(-1); }
    }
  `,
};

const WANDER_ANIM: Record<string, string> = {
  clawckie:       'wander-clawckie 9s ease-in-out infinite',
  coach_clawckie: 'wander-coach 11s ease-in-out infinite',
  kince:          'wander-kince 10s ease-in-out infinite',
  tremendous:     'wander-tremendous 8s ease-in-out infinite',
};

export default function PixelRoom({ project, isActive }: PixelRoomProps) {
  const config = PROJECT_CONFIG[project];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <style>{WANDER_KEYFRAMES[project]}</style>

      {/* Room background — always full brightness */}
      <img
        src={ROOM_IMAGE[project]}
        alt={project}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          imageRendering: 'pixelated',
          filter: isActive
            ? `brightness(1.05) drop-shadow(0 0 18px ${config.color}88)`
            : 'brightness(0.85)',
          transition: 'filter 0.6s ease',
        }}
      />

      {/* Active glow overlay */}
      {isActive && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at center, ${config.color}18 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 2,
        }} />
      )}

      {/* Agent — wanders in the center zone when active */}
      {isActive && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '24%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          pointerEvents: 'none',
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
              animation: WANDER_ANIM[project],
            }}
          />
        </div>
      )}
    </div>
  );
}
