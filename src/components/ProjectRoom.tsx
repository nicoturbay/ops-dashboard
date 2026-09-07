'use client';
import { useState } from 'react';
import { AgentActivity, Project, PROJECT_CONFIG } from '@/types/activity';
import TerminalPopover from './TerminalPopover';

const ROOM_ICONS: Record<Project, string> = {
  clawckie: '♟',
  coach_clawckie: '⚡',
  kince: '◈',
  tremendous: '★',
};

interface ProjectRoomProps {
  project: Project;
  activity: AgentActivity | null;
  recentHistory: AgentActivity[];
}

export default function ProjectRoom({ project, activity, recentHistory }: ProjectRoomProps) {
  const [showTerminal, setShowTerminal] = useState(false);
  const [hovered, setHovered] = useState(false);
  const config = PROJECT_CONFIG[project];
  const isActive = activity?.status === 'running';
  const hasFailed = activity?.status === 'failed';

  const borderColor = hasFailed ? '#ff4444' : config.color;
  const glowColor = hasFailed ? 'rgba(255,68,68,0.5)' : config.glowColor;

  // Data bar: max 5 bars for subagent count
  const subCount = activity?.subagent_count ?? 0;
  const maxBars = 5;
  const filledBars = Math.min(subCount, maxBars);
  const dataBar = '█'.repeat(filledBars) + '░'.repeat(maxBars - filledBars);

  const statusLabel = activity
    ? activity.status.toUpperCase()
    : 'IDLE';
  const statusColor = isActive
    ? config.color
    : hasFailed
    ? '#ff4444'
    : activity?.status === 'completed'
    ? '#00CC44'
    : '#2a2a2a';

  return (
    <>
      <div
        onClick={() => setShowTerminal(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={isActive ? 'room-active-glow' : ''}
        style={{
          position: 'relative',
          width: '280px',
          height: '220px',
          background: isActive ? '#0a0a12' : '#06060a',
          border: `3px solid ${borderColor}`,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, opacity 0.2s ease',
          opacity: isActive ? 1 : hovered ? 0.85 : 0.55,
          transform: isActive ? 'scale(1.03)' : hovered ? 'scale(1.01)' : 'scale(1)',
          userSelect: 'none',
          '--room-glow': glowColor,
          '--room-glow-dim': glowColor.replace('0.5', '0.15').replace('0.6', '0.2'),
        } as React.CSSProperties}
      >
        {/* Corner brackets — pixel art style, large */}
        {[
          { top: -4, left: -4, borderTop: `4px solid ${borderColor}`, borderLeft: `4px solid ${borderColor}` },
          { top: -4, right: -4, borderTop: `4px solid ${borderColor}`, borderRight: `4px solid ${borderColor}` },
          { bottom: -4, left: -4, borderBottom: `4px solid ${borderColor}`, borderLeft: `4px solid ${borderColor}` },
          { bottom: -4, right: -4, borderBottom: `4px solid ${borderColor}`, borderRight: `4px solid ${borderColor}` },
        ].map((style, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 18, height: 18,
            filter: `drop-shadow(0 0 4px ${borderColor})`,
            ...style,
          }} />
        ))}

        {/* Inner glow border */}
        {isActive && (
          <div style={{
            position: 'absolute',
            inset: 2,
            border: `1px solid ${glowColor}`,
            pointerEvents: 'none',
          }} />
        )}

        {/* Room content */}
        <div style={{ padding: '18px 16px', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Header row: icon + label + status dot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontSize: '18px',
                filter: isActive ? `drop-shadow(0 0 6px ${borderColor})` : 'none',
                opacity: isActive ? 1 : 0.4,
              }}>
                {ROOM_ICONS[project]}
              </span>
              <span style={{
                color: borderColor,
                fontSize: '10px',
                letterSpacing: '1px',
                textShadow: isActive ? `0 0 10px ${borderColor}, 0 0 20px ${borderColor}` : 'none',
              }}>
                {config.label}
              </span>
            </div>
            {/* Status dot */}
            <div
              className={isActive ? 'status-pulse' : ''}
              style={{
                width: 10, height: 10,
                background: statusColor,
                boxShadow: isActive ? `0 0 8px ${borderColor}, 0 0 16px ${borderColor}` : 'none',
                '--pulse-shadow': `0 0 8px ${borderColor}`,
                '--pulse-shadow-large': `0 0 20px ${borderColor}`,
              } as React.CSSProperties}
            />
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: `linear-gradient(90deg, ${borderColor}, ${borderColor}44, transparent)`,
          }} />

          {/* Description */}
          <div style={{ color: '#444', fontSize: '7px', letterSpacing: '0.5px' }}>
            {config.description.toUpperCase()}
          </div>

          {/* Task name */}
          <div style={{
            color: isActive ? '#cccccc' : '#2a2a2a',
            fontSize: '7px',
            lineHeight: '1.9',
            minHeight: '28px',
            wordBreak: 'break-word',
            overflow: 'hidden',
          }}>
            {activity
              ? `> ${activity.task_name.substring(0, 32)}${activity.task_name.length > 32 ? '...' : ''}`
              : '> STANDBY'}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Data bar row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
              <div style={{ color: '#333', fontSize: '5px', letterSpacing: '0.5px' }}>
                AGENTS [{subCount}/{maxBars}]
              </div>
              <div style={{
                color: isActive ? borderColor : '#1e1e1e',
                fontSize: '9px',
                letterSpacing: '1px',
                textShadow: isActive ? `0 0 6px ${borderColor}` : 'none',
              }}>
                {dataBar}
              </div>
            </div>
            <div style={{
              color: statusColor,
              fontSize: '6px',
              textShadow: isActive ? `0 0 6px ${statusColor}` : 'none',
              textAlign: 'right',
            }}>
              {statusLabel}
            </div>
          </div>

          {/* Bottom: click hint */}
          <div style={{ color: '#1e1e1e', fontSize: '5px', textAlign: 'right' }}>
            [ENTER TO INSPECT]
          </div>
        </div>

        {/* Active shimmer overlay */}
        {isActive && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${glowColor.replace('0.5','0.06').replace('0.6','0.06')}, transparent 60%, ${glowColor.replace('0.5','0.04').replace('0.6','0.04')})`,
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {showTerminal && (
        <TerminalPopover
          project={project}
          activity={activity}
          recentHistory={recentHistory}
          onClose={() => setShowTerminal(false)}
        />
      )}
    </>
  );
}
