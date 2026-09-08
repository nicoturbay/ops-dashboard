'use client';
import { useState } from 'react';
import { AgentActivity, Project, PROJECT_CONFIG } from '@/types/activity';

type FilterProject = Project | 'all';

interface SidePanelProps {
  activities: AgentActivity[];
}

const PROJECT_KEYS = Object.keys(PROJECT_CONFIG) as Project[];

export default function SidePanel({ activities }: SidePanelProps) {
  const [filter, setFilter] = useState<FilterProject>('all');

  const filtered  = filter === 'all' ? activities : activities.filter(a => a.project === filter);
  const active    = filtered.filter(a => a.status === 'running');
  const completed = filtered.filter(a => a.status === 'completed' || a.status === 'failed');

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
    <div style={{
      background: '#000',
      borderRight: '2px solid #222',
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
        borderBottom: '1px solid #333',
        flexShrink: 0,
      }}>
        <span style={{ color: '#ffffff', fontSize: 11, letterSpacing: '2px' }}>TASK FEED</span>
      </div>

      {/* Filter tabs */}
      <div style={{
        padding: '12px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        borderBottom: '1px solid #333',
        flexShrink: 0,
      }}>
        {(['all', ...PROJECT_KEYS] as FilterProject[]).map(p => {
          const isAll = p === 'all';
          const cfg   = isAll ? null : PROJECT_CONFIG[p as Project];
          const isSel = filter === p;
          return (
            <button key={p} onClick={() => setFilter(p)} style={{
              background: isSel ? (cfg?.color ?? '#fff') : '#111',
              border: `1px solid ${isSel ? (cfg?.color ?? '#fff') : '#555'}`,
              color: isSel ? '#000' : (cfg?.color ?? '#fff'),
              fontSize: 7,
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
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>

        {/* ACTIVE */}
        {active.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ padding: '4px 16px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
              <span style={{ color: '#00ff88', fontSize: 8, letterSpacing: '1px' }}>ACTIVE</span>
            </div>
            {active.map(task => {
              const cfg = PROJECT_CONFIG[task.project];
              return (
                <div key={task.id} style={{
                  padding: '10px 16px',
                  marginLeft: 12,
                  marginBottom: 6,
                  borderLeft: `3px solid ${cfg.color}`,
                  background: '#0d0d0d',
                }}>
                  <div style={{ color: cfg.color, fontSize: 8, marginBottom: 6, textShadow: `0 0 8px ${cfg.color}`, letterSpacing: '0.5px' }}>
                    {cfg.label}
                  </div>
                  <div style={{ color: '#ffffff', fontSize: 7, lineHeight: 1.9, wordBreak: 'break-word' }}>
                    {task.task_name.substring(0, 38)}{task.task_name.length > 38 ? '…' : ''}
                  </div>
                  <div style={{ color: '#aaaaaa', fontSize: 6, marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
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
              <span style={{ color: '#aaaaaa', fontSize: 8, letterSpacing: '1px' }}>COMPLETED</span>
            </div>
            {completed.map((task, i) => {
              const cfg    = PROJECT_CONFIG[task.project];
              const failed = task.status === 'failed';
              return (
                <div key={task.id} style={{
                  padding: '8px 16px',
                  marginLeft: 12,
                  marginBottom: 5,
                  borderLeft: `2px solid ${failed ? '#ff4444' : '#444'}`,
                  opacity: Math.max(0.6, 1 - i * 0.05),
                }}>
                  <div style={{ color: '#dddddd', fontSize: 7, marginBottom: 4 }}>
                    <span style={{ color: cfg.color }}>{cfg.label.substring(0, 5)}</span>
                    {'  '}{task.task_name.substring(0, 28)}{task.task_name.length > 28 ? '…' : ''}
                  </div>
                  <div style={{ color: failed ? '#ff6666' : '#888888', fontSize: 6, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{failed ? 'FAILED' : 'DONE'}</span>
                    <span>{task.completed_at ? formatTime(task.completed_at) : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ color: '#888888', fontSize: 7, padding: '24px 16px', lineHeight: 2.2 }}>
            NO TASKS YET.<br />STANDING BY.
          </div>
        )}
      </div>
    </div>
  );
}
