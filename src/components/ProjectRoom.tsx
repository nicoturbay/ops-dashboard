'use client';

import { useState } from 'react';
import { AgentActivity, Project, PROJECT_CONFIG } from '@/types/activity';
import TerminalPopover from './TerminalPopover';

interface ProjectRoomProps {
  project: Project;
  activity: AgentActivity | null;
  recentHistory: AgentActivity[];
}

export default function ProjectRoom({ project, activity, recentHistory }: ProjectRoomProps) {
  const [showTerminal, setShowTerminal] = useState(false);
  const config = PROJECT_CONFIG[project];
  const isActive = activity?.status === 'running';
  const hasFailed = activity?.status === 'failed';

  const glowStyle = isActive
    ? {
        boxShadow: `0 0 15px ${config.glowColor}, 0 0 30px ${config.glowColor}, 0 0 60px ${config.glowColor}`,
        '--room-glow': config.glowColor,
      }
    : hasFailed
    ? { boxShadow: '0 0 15px rgba(255,68,68,0.4), 0 0 30px rgba(255,68,68,0.2)' }
    : { boxShadow: 'none' };

  return (
    <>
      <div
        onClick={() => setShowTerminal(true)}
        className={isActive ? 'room-active-glow' : ''}
        style={{
          position: 'relative',
          width: '200px',
          height: '160px',
          background: isActive ? '#0d0d0d' : '#080808',
          border: `3px solid ${config.color}`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          opacity: isActive ? 1 : 0.6,
          transform: isActive ? 'scale(1.02)' : 'scale(1)',
          userSelect: 'none',
          ...(glowStyle as React.CSSProperties),
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.opacity = '1';
          if (!isActive) {
            (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.01)';
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.opacity = isActive ? '1' : '0.6';
          if (!isActive) {
            (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
          }
        }}
      >
        {/* Corner decorations - pixel art style */}
        {/* Top-left corner */}
        <div
          style={{
            position: 'absolute',
            top: -3,
            left: -3,
            width: 12,
            height: 12,
            borderTop: `4px solid ${config.color}`,
            borderLeft: `4px solid ${config.color}`,
            filter: `drop-shadow(0 0 3px ${config.color})`,
          }}
        />
        {/* Top-right corner */}
        <div
          style={{
            position: 'absolute',
            top: -3,
            right: -3,
            width: 12,
            height: 12,
            borderTop: `4px solid ${config.color}`,
            borderRight: `4px solid ${config.color}`,
            filter: `drop-shadow(0 0 3px ${config.color})`,
          }}
        />
        {/* Bottom-left corner */}
        <div
          style={{
            position: 'absolute',
            bottom: -3,
            left: -3,
            width: 12,
            height: 12,
            borderBottom: `4px solid ${config.color}`,
            borderLeft: `4px solid ${config.color}`,
            filter: `drop-shadow(0 0 3px ${config.color})`,
          }}
        />
        {/* Bottom-right corner */}
        <div
          style={{
            position: 'absolute',
            bottom: -3,
            right: -3,
            width: 12,
            height: 12,
            borderBottom: `4px solid ${config.color}`,
            borderRight: `4px solid ${config.color}`,
            filter: `drop-shadow(0 0 3px ${config.color})`,
          }}
        />

        {/* Room content */}
        <div
          style={{
            padding: '16px 14px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Header */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  color: config.color,
                  fontSize: '9px',
                  textShadow: isActive ? `0 0 8px ${config.color}` : 'none',
                  letterSpacing: '0.5px',
                }}
              >
                {config.label}
              </span>

              {/* Status dot */}
              <div
                className={isActive ? 'status-pulse' : ''}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: isActive
                    ? config.color
                    : hasFailed
                    ? '#ff4444'
                    : '#333',
                  boxShadow: isActive ? `0 0 6px ${config.color}` : 'none',
                }}
              />
            </div>

            <div
              style={{
                color: '#555',
                fontSize: '6px',
                marginBottom: '12px',
                letterSpacing: '0.3px',
              }}
            >
              {config.description.toUpperCase()}
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: `linear-gradient(90deg, ${config.color}33, transparent)`,
                marginBottom: '10px',
              }}
            />

            {/* Task name */}
            {activity && (
              <div
                style={{
                  color: isActive ? '#ccc' : '#444',
                  fontSize: '6px',
                  lineHeight: '1.8',
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                  maxHeight: '36px',
                }}
              >
                {activity.task_name.length > 28
                  ? activity.task_name.substring(0, 25) + '...'
                  : activity.task_name}
              </div>
            )}

            {!activity && (
              <div style={{ color: '#333', fontSize: '6px' }}>
                IDLE
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Subagent count badge */}
            {activity && activity.subagent_count > 0 && (
              <div
                style={{
                  background: '#111',
                  border: `1px solid ${config.color}`,
                  color: config.color,
                  fontSize: '6px',
                  padding: '2px 6px',
                  boxShadow: `0 0 4px ${config.glowColor}`,
                }}
              >
                {activity.subagent_count} SUB
              </div>
            )}

            {activity && activity.subagent_count === 0 && <div />}
            {!activity && <div />}

            {/* Click hint */}
            <div style={{ color: '#333', fontSize: '5px' }}>
              [CLICK]
            </div>
          </div>
        </div>

        {/* Active overlay shimmer */}
        {isActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${config.glowColor}05, transparent, ${config.glowColor}05)`,
              pointerEvents: 'none',
            }}
          />
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
