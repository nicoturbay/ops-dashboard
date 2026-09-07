'use client';

import { AgentActivity, Project, PROJECT_CONFIG } from '@/types/activity';
import ProjectRoom from './ProjectRoom';
import Corridor from './Corridor';

interface DungeonMapProps {
  projectActivity: Record<Project, AgentActivity | null>;
  recentFeed: AgentActivity[];
}

const PROJECTS_GRID: [Project, Project][] = [
  ['clawckie', 'coach_clawckie'],
  ['kince', 'tremendous'],
];

export default function DungeonMap({ projectActivity, recentFeed }: DungeonMapProps) {
  const isActive = (project: Project) => projectActivity[project]?.status === 'running';

  // Horizontal corridors: top row (clawckie <-> coach_clawckie), bottom row (kince <-> tremendous)
  const topCorridorActive = isActive('clawckie') || isActive('coach_clawckie');
  const bottomCorridorActive = isActive('kince') || isActive('tremendous');
  const leftCorridorActive = isActive('clawckie') || isActive('kince');
  const rightCorridorActive = isActive('coach_clawckie') || isActive('tremendous');

  const topCorridorColor = isActive('clawckie')
    ? PROJECT_CONFIG.clawckie.color
    : PROJECT_CONFIG.coach_clawckie.color;

  const bottomCorridorColor = isActive('kince')
    ? PROJECT_CONFIG.kince.color
    : PROJECT_CONFIG.tremendous.color;

  const leftCorridorColor = isActive('clawckie')
    ? PROJECT_CONFIG.clawckie.color
    : PROJECT_CONFIG.kince.color;

  const rightCorridorColor = isActive('coach_clawckie')
    ? PROJECT_CONFIG.coach_clawckie.color
    : PROJECT_CONFIG.tremendous.color;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        flex: 1,
      }}
    >
      {/* Dungeon floor container */}
      <div
        className="dungeon-floor"
        style={{
          padding: '60px',
          border: '1px solid #1a1a1a',
          background: '#080808',
          position: 'relative',
        }}
      >
        {/* Ambient glow behind map */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: [
            isActive('clawckie') ? `radial-gradient(ellipse at 20% 30%, ${PROJECT_CONFIG.clawckie.glowColor.replace('0.5','0.08').replace('0.6','0.08')} 0%, transparent 50%)` : '',
            isActive('coach_clawckie') ? `radial-gradient(ellipse at 80% 30%, ${PROJECT_CONFIG.coach_clawckie.glowColor.replace('0.5','0.08').replace('0.6','0.08')} 0%, transparent 50%)` : '',
            isActive('kince') ? `radial-gradient(ellipse at 20% 70%, ${PROJECT_CONFIG.kince.glowColor.replace('0.5','0.08').replace('0.6','0.08')} 0%, transparent 50%)` : '',
            isActive('tremendous') ? `radial-gradient(ellipse at 80% 70%, ${PROJECT_CONFIG.tremendous.glowColor.replace('0.5','0.08').replace('0.6','0.08')} 0%, transparent 50%)` : '',
          ].filter(Boolean).join(', ') || 'none',
        }} />
        {/* Map grid: 2x2 rooms with corridors */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 100px 280px',
            gridTemplateRows: '220px 80px 220px',
            gap: 0,
            alignItems: 'center',
            justifyItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Row 1 */}
          {/* Top-left room: clawckie */}
          <div style={{ gridColumn: 1, gridRow: 1 }}>
            <ProjectRoom
              project="clawckie"
              activity={projectActivity.clawckie}
              recentHistory={recentFeed}
            />
          </div>

          {/* Top horizontal corridor */}
          <div style={{ gridColumn: 2, gridRow: 1, width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
            <Corridor
              direction="horizontal"
              hasActiveAgent={topCorridorActive}
              agentColor={topCorridorColor}
              length="100%"
            />
          </div>

          {/* Top-right room: coach_clawckie */}
          <div style={{ gridColumn: 3, gridRow: 1 }}>
            <ProjectRoom
              project="coach_clawckie"
              activity={projectActivity.coach_clawckie}
              recentHistory={recentFeed}
            />
          </div>

          {/* Row 2: vertical corridors */}
          {/* Left vertical corridor */}
          <div style={{ gridColumn: 1, gridRow: 2, width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
            <Corridor
              direction="vertical"
              hasActiveAgent={leftCorridorActive}
              agentColor={leftCorridorColor}
              length="100%"
            />
          </div>

          {/* Center intersection */}
          <div
            style={{
              gridColumn: 2,
              gridRow: 2,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                background: '#0a0a12',
                border: '2px solid #2a2a3a',
                position: 'relative',
                boxShadow: '0 0 10px rgba(255,255,255,0.05), 0 0 30px rgba(255,255,255,0.02)',
              }}
            >
              {/* Intersection node center */}
              <div style={{ position: 'absolute', inset: 4, background: '#1e1e2e' }} />
              {/* Radiating lines */}
              <div style={{ position: 'absolute', top: '50%', left: '-50px', width: '50px', height: '1px', background: 'linear-gradient(90deg, transparent, #2a2a3a)', transform: 'translateY(-50%)' }} />
              <div style={{ position: 'absolute', top: '50%', right: '-50px', width: '50px', height: '1px', background: 'linear-gradient(90deg, #2a2a3a, transparent)', transform: 'translateY(-50%)' }} />
              <div style={{ position: 'absolute', left: '50%', top: '-40px', width: '1px', height: '40px', background: 'linear-gradient(180deg, transparent, #2a2a3a)', transform: 'translateX(-50%)' }} />
              <div style={{ position: 'absolute', left: '50%', bottom: '-40px', width: '1px', height: '40px', background: 'linear-gradient(180deg, #2a2a3a, transparent)', transform: 'translateX(-50%)' }} />
            </div>
          </div>

          {/* Right vertical corridor */}
          <div style={{ gridColumn: 3, gridRow: 2, width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
            <Corridor
              direction="vertical"
              hasActiveAgent={rightCorridorActive}
              agentColor={rightCorridorColor}
              length="100%"
            />
          </div>

          {/* Row 3 */}
          {/* Bottom-left room: kince */}
          <div style={{ gridColumn: 1, gridRow: 3 }}>
            <ProjectRoom
              project="kince"
              activity={projectActivity.kince}
              recentHistory={recentFeed}
            />
          </div>

          {/* Bottom horizontal corridor */}
          <div style={{ gridColumn: 2, gridRow: 3, width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
            <Corridor
              direction="horizontal"
              hasActiveAgent={bottomCorridorActive}
              agentColor={bottomCorridorColor}
              length="100%"
            />
          </div>

          {/* Bottom-right room: tremendous */}
          <div style={{ gridColumn: 3, gridRow: 3 }}>
            <ProjectRoom
              project="tremendous"
              activity={projectActivity.tremendous}
              recentHistory={recentFeed}
            />
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginTop: '24px',
            flexWrap: 'wrap',
          }}
        >
          {(Object.keys(PROJECT_CONFIG) as Project[]).map((project) => {
            const config = PROJECT_CONFIG[project];
            const active = isActive(project);
            return (
              <div
                key={project}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <div
                  className={active ? 'status-pulse' : ''}
                  style={{
                    width: 6,
                    height: 6,
                    background: active ? config.color : '#333',
                    boxShadow: active ? `0 0 4px ${config.color}` : 'none',
                  }}
                />
                <span
                  style={{
                    color: active ? config.color : '#333',
                    fontSize: '5px',
                    letterSpacing: '0.5px',
                  }}
                >
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
