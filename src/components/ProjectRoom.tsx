'use client';
import { useState } from 'react';
import { AgentActivity, Project, PROJECT_CONFIG, STATUS_LABEL, STATUS_COLOR } from '@/types/activity';
import TerminalPopover from './TerminalPopover';
import PixelRoom from './PixelRoom';

interface ProjectRoomProps {
  project: Project;
  activity: AgentActivity | null;
  recentHistory: AgentActivity[];
}

export default function ProjectRoom({ project, activity, recentHistory }: ProjectRoomProps) {
  const [showTerminal, setShowTerminal] = useState(false);
  const [hovered, setHovered] = useState(false);
  const config = PROJECT_CONFIG[project];
  const isActive = activity?.status === 'in_progress';
  const hasFailed = activity?.status === 'could_not_complete';
  const borderColor = hasFailed ? '#ff4444' : config.color;

  const statusLabel = activity ? STATUS_LABEL[activity.status] : null;
  const statusColor = activity ? STATUS_COLOR[activity.status] : '#888888';

  return (
    <>
      <div
        onClick={() => setShowTerminal(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={isActive ? 'room-active-glow' : ''}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          border: `3px solid ${borderColor}`,
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          transform: hovered ? 'scale(1.01)' : 'scale(1)',
          userSelect: 'none',
          overflow: 'hidden',
          '--room-glow': config.glowColor,
          '--room-glow-dim': config.glowColor.replace('0.6', '0.15'),
        } as React.CSSProperties}
      >
        {/* Corner brackets */}
        {[
          { top: -4, left: -4, borderTop: `4px solid ${borderColor}`, borderLeft: `4px solid ${borderColor}` },
          { top: -4, right: -4, borderTop: `4px solid ${borderColor}`, borderRight: `4px solid ${borderColor}` },
          { bottom: -4, left: -4, borderBottom: `4px solid ${borderColor}`, borderLeft: `4px solid ${borderColor}` },
          { bottom: -4, right: -4, borderBottom: `4px solid ${borderColor}`, borderRight: `4px solid ${borderColor}` },
        ].map((style, i) => (
          <div key={i} style={{
            position: 'absolute', zIndex: 10,
            width: 20, height: 20,
            filter: `drop-shadow(0 0 6px ${borderColor})`,
            ...style,
          }} />
        ))}

        {/* Pixel room interior */}
        <PixelRoom
          project={project}
          isActive={!!isActive}
          subagentCount={activity?.subagent_count ?? 0}
          taskName={activity?.task_name}
        />

        {/* Top overlay bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          background: 'rgba(0,0,0,0.75)',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 5,
          backdropFilter: 'blur(2px)',
        }}>
          <span style={{
            color: borderColor,
            fontSize: 'var(--fs-md)',
            letterSpacing: '1px',
            textShadow: isActive ? `0 0 8px ${borderColor}` : 'none',
            fontFamily: '"Press Start 2P", cursive',
          }}>
            {config.label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {activity?.subagent_count ? (
              <span style={{ color: borderColor, fontSize: 'var(--fs-2xs)', fontFamily: '"Press Start 2P", cursive', opacity: 0.8 }}>
                {activity.subagent_count}x
              </span>
            ) : null}
            <div
              className={isActive ? 'status-pulse' : ''}
              style={{
                width: 8, height: 8,
                background: isActive ? borderColor : hasFailed ? '#ff4444' : '#222',
                boxShadow: isActive ? `0 0 8px ${borderColor}` : 'none',
                '--pulse-shadow': `0 0 8px ${borderColor}`,
                '--pulse-shadow-large': `0 0 20px ${borderColor}`,
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Bottom task bar */}
        {activity && (
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            background: 'rgba(0,0,0,0.8)',
            padding: '4px 8px',
            zIndex: 5,
            backdropFilter: 'blur(2px)',
          }}>
            {/* Status + task name */}
            <span style={{
              color: isActive ? '#ccc' : '#444',
              fontSize: 'var(--fs-2xs)',
              fontFamily: '"Press Start 2P", cursive',
              letterSpacing: '0.5px',
            }}>
              &gt;{' '}
              <span style={{ color: statusColor }}>
                [{statusLabel}]
              </span>
              {' '}{activity.task_name.substring(0, 28)}{activity.task_name.length > 28 ? '...' : ''}
            </span>
            {/* Channel name if available */}
            {activity.discord_channel_name && (
              <div style={{
                color: '#8a8a98',
                fontSize: 'var(--fs-2xs)',
                fontFamily: '"Press Start 2P", cursive',
                marginTop: 3,
                letterSpacing: '0.3px',
              }}>
                {activity.discord_channel_name}
              </div>
            )}
          </div>
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
