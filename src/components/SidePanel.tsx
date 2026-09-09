'use client';
import { useState } from 'react';
import { AgentActivity, Project, PROJECT_CONFIG, STATUS_LABEL, STATUS_COLOR } from '@/types/activity';

type FilterProject = Project | 'all';

interface SidePanelProps {
  activities: AgentActivity[];
}

const PROJECT_KEYS = Object.keys(PROJECT_CONFIG) as Project[];

export default function SidePanel({ activities }: SidePanelProps) {
  const [filter, setFilter] = useState<FilterProject>('all');

  const filtered  = filter === 'all' ? activities : activities.filter(a => a.project === filter);

  // Active = in_progress OR in_queue
  const active    = filtered.filter(a => a.status === 'in_progress' || a.status === 'in_queue');
  const completed = filtered.filter(a => a.status === 'completed' || a.status === 'could_not_complete');

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  function formatElapsed(iso: string) {
    const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (m < 1) return '<1m';
    if (m < 60) return `${m}m`;
    return `${Math.floor(m / 60)}h ${m % 60}m`;
  }

  return (
    <div className="side-panel" style={{
      background: '#000',
      borderRight: '2px solid #2c2c38',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Press Start 2P", cursive',
      overflow: 'hidden',
      minHeight: 0,
      zIndex: 2,
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 16px 14px',
        borderBottom: '1px solid #3a3a48',
        flexShrink: 0,
      }}>
        <span style={{ color: '#ffffff', fontSize: 'var(--fs-xl)', letterSpacing: '2px' }}>TASK FEED</span>
      </div>

      {/* Filter tabs */}
      <div style={{
        padding: '12px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        borderBottom: '1px solid #3a3a48',
        flexShrink: 0,
      }}>
        {(['all', ...PROJECT_KEYS] as FilterProject[]).map(p => {
          const isAll = p === 'all';
          const cfg   = isAll ? null : PROJECT_CONFIG[p as Project];
          const isSel = filter === p;
          return (
            <button key={p} onClick={() => setFilter(p)} style={{
              background: isSel ? (cfg?.textColor ?? '#fff') : '#17171f',
              border: `1px solid ${isSel ? (cfg?.textColor ?? '#fff') : '#6a6a7a'}`,
              color: isSel ? '#000' : (cfg?.textColor ?? '#fff'),
              fontSize: 'var(--fs-sm)',
              fontFamily: '"Press Start 2P", cursive',
              padding: '5px 8px',
              cursor: 'pointer',
              letterSpacing: '0.5px',
              boxShadow: isSel && cfg ? `0 0 8px ${cfg.color}` : 'none',
            }}>
              {isAll ? 'ALL' : cfg!.label.substring(0, 5)}
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <div className="task-list" style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>

        {/* ACTIVE (in_progress + in_queue) */}
        {active.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ padding: '4px 16px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
              <span style={{ color: '#00ff88', fontSize: 'var(--fs-md)', letterSpacing: '1px' }}>ACTIVE</span>
            </div>
            {active.map(task => {
              const cfg = PROJECT_CONFIG[task.project];
              const statusColor = STATUS_COLOR[task.status];
              const statusLabel = STATUS_LABEL[task.status];
              return (
                <div key={task.id} style={{
                  padding: '10px 16px',
                  marginLeft: 12,
                  marginBottom: 6,
                  borderLeft: `3px solid ${cfg.color}`,
                  background: '#15151d',
                }}>
                  <div style={{ color: cfg.textColor, fontSize: 'var(--fs-md)', marginBottom: 6, textShadow: `0 0 8px ${cfg.color}`, letterSpacing: '0.5px' }}>
                    {cfg.label}
                  </div>
                  <div style={{ color: '#ffffff', fontSize: 'var(--fs-sm)', lineHeight: 1.9, wordBreak: 'break-word' }}>
                    {task.task_name.substring(0, 38)}{task.task_name.length > 38 ? '…' : ''}
                  </div>
                  {/* Status badge */}
                  <div style={{
                    display: 'inline-block',
                    marginTop: 5,
                    padding: '2px 5px',
                    background: `${statusColor}22`,
                    border: `1px solid ${statusColor}`,
                    color: statusColor,
                    fontSize: 'var(--fs-2xs)',
                    letterSpacing: '0.5px',
                  }}>
                    {statusLabel}
                  </div>
                  {/* Channel name */}
                  {task.discord_channel_name && (
                    <div style={{ color: '#8a8a98', fontSize: 'var(--fs-2xs)', marginTop: 4, letterSpacing: '0.3px' }}>
                      {task.discord_channel_name}
                    </div>
                  )}
                  <div style={{ color: '#c6c6d2', fontSize: 'var(--fs-xs)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{task.subagent_count > 0 ? `${task.subagent_count} agents` : '1 agent'}</span>
                    <span>{formatElapsed(task.started_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* COMPLETED */}
        {completed.length > 0 && (
          <div>
            <div style={{ padding: '4px 16px 10px' }}>
              <span style={{ color: '#c6c6d2', fontSize: 'var(--fs-md)', letterSpacing: '1px' }}>COMPLETED</span>
            </div>
            {completed.map((task, i) => {
              const cfg      = PROJECT_CONFIG[task.project];
              const failed   = task.status === 'could_not_complete';
              const sColor   = STATUS_COLOR[task.status];
              const sLabel   = STATUS_LABEL[task.status];
              return (
                <div key={task.id} style={{
                  padding: '8px 16px',
                  marginLeft: 12,
                  marginBottom: 5,
                  borderLeft: `2px solid ${failed ? '#ff4444' : '#5a5a68'}`,
                  opacity: Math.max(0.85, 1 - i * 0.03),
                }}>
                  <div style={{ color: '#e6e6ee', fontSize: 'var(--fs-sm)', marginBottom: 4 }}>
                    <span style={{ color: cfg.textColor }}>{cfg.label.substring(0, 5)}</span>
                    {'  '}{task.task_name.substring(0, 28)}{task.task_name.length > 28 ? '…' : ''}
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 4,
                  }}>
                    {/* Color-coded status badge */}
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 5px',
                      background: `${sColor}22`,
                      border: `1px solid ${sColor}`,
                      color: sColor,
                      fontSize: 'var(--fs-2xs)',
                      letterSpacing: '0.3px',
                    }}>
                      {sLabel}
                    </span>
                    <span style={{ color: '#b4b4c2', fontSize: 'var(--fs-xs)' }}>
                      {task.completed_at ? formatTime(task.completed_at) : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ color: '#b4b4c2', fontSize: 'var(--fs-sm)', padding: '24px 16px', lineHeight: 2.2 }}>
            NO TASKS YET.<br />STANDING BY.
          </div>
        )}
      </div>
    </div>
  );
}
