'use client';

import { useEffect, useState } from 'react';
import { AgentActivity, Project, PROJECT_CONFIG } from '@/types/activity';

interface TerminalPopoverProps {
  project: Project;
  activity: AgentActivity | null;
  recentHistory: AgentActivity[];
  onClose: () => void;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

interface TerminalLineProps {
  text: string;
  delay: number;
  color?: string;
}

function TerminalLine({ text, delay, color = '#e0e0e0' }: TerminalLineProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!visible) return null;

  return (
    <div
      className="terminal-line"
      style={{
        color,
        marginBottom: '6px',
        fontSize: '8px',
        lineHeight: '1.6',
        wordBreak: 'break-all',
      }}
    >
      {text}
    </div>
  );
}

export default function TerminalPopover({
  project,
  activity,
  recentHistory,
  onClose,
}: TerminalPopoverProps) {
  const config = PROJECT_CONFIG[project];
  const projectHistory = recentHistory
    .filter((a) => a.project === project)
    .slice(0, 5);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0d0d0d',
          border: `2px solid ${config.color}`,
          boxShadow: `0 0 20px ${config.glowColor}, 0 0 40px ${config.glowColor}, inset 0 0 20px rgba(0,0,0,0.5)`,
          width: '100%',
          maxWidth: '600px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '"Press Start 2P", cursive',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div
          style={{
            background: '#111',
            borderBottom: `2px solid ${config.color}`,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: config.color,
              fontSize: '9px',
              textShadow: `0 0 8px ${config.color}`,
            }}
          >
            [ {config.label} TERMINAL ]
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: `1px solid ${config.color}`,
              color: config.color,
              cursor: 'pointer',
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '8px',
              padding: '3px 6px',
              transition: 'all 0.1s',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = config.color;
              (e.target as HTMLButtonElement).style.color = '#000';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = 'none';
              (e.target as HTMLButtonElement).style.color = config.color;
            }}
          >
            [X]
          </button>
        </div>

        {/* Terminal content */}
        <div
          style={{
            padding: '14px',
            overflowY: 'auto',
            flex: 1,
          }}
          className="feed-scroll"
        >
          {/* Boot header */}
          <TerminalLine text={`> CONNECTING TO ${config.label} NODE...`} delay={0} color={config.color} />
          <TerminalLine text={`> ${config.description.toUpperCase()} SUBSYSTEM`} delay={100} color="#666" />
          <TerminalLine text="─────────────────────────────" delay={200} color="#333" />

          {activity ? (
            <>
              <TerminalLine text="> CURRENT STATUS:" delay={300} color="#888" />
              <TerminalLine
                text={`  TASK: ${activity.task_name}`}
                delay={400}
                color={config.color}
              />
              <TerminalLine
                text={`  STATUS: ${activity.status.toUpperCase()}`}
                delay={500}
                color={
                  activity.status === 'running'
                    ? '#00ff00'
                    : activity.status === 'completed'
                    ? '#00CC44'
                    : activity.status === 'failed'
                    ? '#ff4444'
                    : '#888'
                }
              />
              {activity.subagent_count > 0 && (
                <TerminalLine
                  text={`  SUBAGENTS: ${activity.subagent_count} ACTIVE`}
                  delay={600}
                  color="#ffaa00"
                />
              )}
              {activity.detail && (
                <TerminalLine
                  text={`  DETAIL: ${activity.detail}`}
                  delay={700}
                  color="#aaa"
                />
              )}
              <TerminalLine
                text={`  STARTED: ${formatDate(activity.started_at)} ${formatTime(activity.started_at)}`}
                delay={800}
                color="#666"
              />
              {activity.completed_at && (
                <TerminalLine
                  text={`  COMPLETED: ${formatDate(activity.completed_at)} ${formatTime(activity.completed_at)}`}
                  delay={900}
                  color="#666"
                />
              )}
            </>
          ) : (
            <>
              <TerminalLine text="> CURRENT STATUS: IDLE" delay={300} color="#555" />
              <TerminalLine text="  NO ACTIVE TASKS" delay={400} color="#444" />
            </>
          )}

          <TerminalLine text="─────────────────────────────" delay={1000} color="#333" />
          <TerminalLine text="> RECENT HISTORY:" delay={1100} color="#888" />

          {projectHistory.length > 0 ? (
            projectHistory.map((entry, i) => (
              <TerminalLine
                key={entry.id}
                text={`  [${formatTime(entry.created_at)}] ${entry.task_name} — ${entry.status.toUpperCase()}`}
                delay={1200 + i * 100}
                color={i === 0 ? '#999' : '#555'}
              />
            ))
          ) : (
            <TerminalLine text="  NO HISTORY FOUND" delay={1200} color="#444" />
          )}

          <TerminalLine text="─────────────────────────────" delay={1800} color="#333" />

          {/* Blinking prompt */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ color: config.color, fontSize: '8px' }}>
              {config.label.toLowerCase()}@mission-control:~$
            </span>
            <span
              className="cursor-blink"
              style={{
                display: 'inline-block',
                width: '8px',
                height: '14px',
                background: config.color,
                marginLeft: '4px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
