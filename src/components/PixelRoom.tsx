'use client';
import { Project, PROJECT_CONFIG } from '@/types/activity';

interface PixelRoomProps {
  project: Project;
  isActive: boolean;
  subagentCount: number;
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
// They roam within the center 60% of the room (20%–80% h, 20%–80% w).
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

// Animation durations vary by agent index to desync movement
const AGENT_DURATIONS = [9, 11, 7, 10]; // seconds per agent slot (0–3)
const AGENT_DELAYS    = [0, -3, -5, -7]; // negative delay = start mid-cycle

// Given N agents (1–4), calculate the left offset % for each agent's
// wander zone within the 60% center band (room left 20% → 80%).
function getAgentZones(n: number): Array<{ startPct: number; widthPct: number }> {
  const bandStart = 20;
  const bandWidth = 60;
  const slotWidth = bandWidth / n;
  return Array.from({ length: n }, (_, i) => ({
    startPct: bandStart + i * slotWidth,
    widthPct: slotWidth,
  }));
}

// Build per-agent keyframe name + CSS
function buildAgentKeyframes(project: Project, agentIndex: number, startPct: number, widthPct: number): string {
  const name = `wander-${project}-agent${agentIndex}`;
  const mid = startPct + widthPct * 0.5;
  const lo  = startPct + widthPct * 0.1;
  const hi  = startPct + widthPct * 0.85;
  return `
    @keyframes ${name} {
      0%   { left: ${mid.toFixed(1)}%; margin-top: 0%;   transform: scaleX(1); }
      20%  { left: ${hi.toFixed(1)}%;  margin-top: -7%;  transform: scaleX(1); }
      40%  { left: ${hi.toFixed(1)}%;  margin-top: 5%;   transform: scaleX(-1); }
      60%  { left: ${lo.toFixed(1)}%;  margin-top: 7%;   transform: scaleX(-1); }
      80%  { left: ${lo.toFixed(1)}%;  margin-top: -5%;  transform: scaleX(1); }
      100% { left: ${mid.toFixed(1)}%; margin-top: 0%;   transform: scaleX(1); }
    }
  `;
}

export default function PixelRoom({ project, isActive, subagentCount, taskName }: PixelRoomProps) {
  const config = PROJECT_CONFIG[project];
  const agentCount = isActive ? Math.max(1, Math.min(4, subagentCount || 1)) : 0;
  const zones = getAgentZones(agentCount);

  // Build keyframe CSS for all agents
  const agentKeyframesCss = zones
    .map((z, i) => buildAgentKeyframes(project, i, z.startPct, z.widthPct))
    .join('\n');

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Base project wander keyframes (kept for reference / single-agent fallback) */}
      <style>{WANDER_KEYFRAMES[project]}</style>
      {/* Per-agent keyframes */}
      {agentCount > 0 && <style>{agentKeyframesCss}</style>}

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

      {/* Multi-agent layer — one sprite per agent, each in its own zone */}
      {isActive && zones.map((_, i) => {
        const animName = `wander-${project}-agent${i}`;
        const duration = AGENT_DURATIONS[i] ?? 9;
        const delay    = AGENT_DELAYS[i] ?? 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: '24%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          >
            <img
              src={AGENT_IMAGE[project]}
              alt={`${project} agent ${i + 1}`}
              style={{
                position: 'absolute',
                bottom: 0,
                height: '100%',
                width: 'auto',
                imageRendering: 'pixelated',
                animation: `${animName} ${duration}s ${delay}s ease-in-out infinite`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
