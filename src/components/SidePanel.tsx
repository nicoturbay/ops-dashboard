'use client';
import { useState } from 'react';
import { AgentActivity, Project, PROJECT_CONFIG } from '@/types/activity';

type FilterProject = Project | 'all';

interface SidePanelProps {
  activities: AgentActivity[];
}

const PROJECT_KEYS = Object.keys(PROJECT_CONFIG) as Project[];

export default function SidePanel({ activities }: SidePanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState<FilterProject>('all');

  const filtered = filter === 'all' ? activities : activities.filter(a => a.project === filter);
  const active = filtered.filter(a => a.status === 'running');
  const completed = filtered.filter(a => a.status === 'completed' || a.status === 'failed');

  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  function formatElapsed(iso: string) {
    const ms = Date.now() - new Date(iso).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 1) return '<1m';
    if (m < 60) return `${m}m`;
    return `${Math.floor(m / 60)}h ${m % 60}m`;
  }

  if (collapsed) {
    return (
      <div style={{
        width: 36,
        flexShrink: 0,
        background: '#050508',
        borderRight: '1px solid #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 16,
        gap: 12,
        transition: 'width 0.3s ease',
      }}>
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#444',
            cursor: 'pointer',
            fontSize: 10,
            fontFamily: '"Press Start 2P", cursive',
            padding: '4px',
            marginBottom: 8,
          }}
          title="Expand panel"
        >
          ▶
        </button>
        {PROJECT_KEYS.map(p => {
          const cfg = PROJECT_CONFIG[p];
          const hasActive = activities.some(a => a.project === p && a.status === 'running');
          return (
            <div key={p} style={{
              width: 8, height: 8,
              background: hasActive ? cfg.color : '#222',
              boxShadow: hasActive ? `0 0 6px ${cfg.color}` : 'none',
            }} />
          );
        })}
      </div>
    );
  }

  return (
    <div style={{
      width: 340,
      flexShrink: 0,
      background: 'transparent',
      borderRight: '1px solid #2a2a2a',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Press Start 2P", cursive',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
    }}>
      {/* Panel header */}
      <div style={{
        padding: '16px 14px 12px',
        borderBottom: '1px solid #111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: '#aaa', fontSize: 9, letterSpacing: '2px' }}>TASK FEED</span>
        <button
          onClick={() => setCollapsed(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#333',
            cursor: 'pointer',
            fontSize: 8,
            fontFamily: '"Press Start 2P", cursive',
          }}
          title="Collapse"
        >
          ◀
        </button>
      </div>

      {/* Project filter tabs */}
      <div style={{
        padding: '10px 10px 10px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        borderBottom: '1px solid #111',
      }}>
        {(['all', ...PROJECT_KEYS] as FilterProject[]).map(p => {
          const isAll = p === 'all';
          const cfg = isAll ? null : PROJECT_CONFIG[p as Project];
          const isActive = filter === p;
          return (
            <button
              key={p}
              onClick={() => setFilter(p)}
              style={{
                background: isActive ? (cfg?.color ?? '#333') : 'transparent',
                border: `1px solid ${isActive ? (cfg?.color ?? '#555') : '#222'}`,
                color: isActive ? '#000' : (cfg?.color ?? '#444'),
                fontSize: 5,
                fontFamily: '"Press Start 2P", cursive',
                padding: '4px 6px',
                cursor: 'pointer',
                letterSpacing: '0.5px',
                boxShadow: isActive && cfg ? `0 0 6px ${cfg.color}` : 'none',
              }}
            >
              {isAll ? 'ALL' : (cfg!.label.substring(0, 4))}
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>

        {/* ACTIVE section */}
        {active.length > 0 && (
          <div>
            <div style={{ padding: '4px 14px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, background: '#00ff88', boxShadow: '0 0 4px #00ff88' }} />
              <span style={{ color: '#00ff88', fontSize: 7, letterSpacing: '1px' }}>ACTIVE</span>
            </div>
            {active.map(task => {
              const cfg = PROJECT_CONFIG[task.project];
              return (
                <div key={task.id} style={{
                  padding: '8px 14px',
                  borderLeft: `3px solid ${cfg.color}`,
                  marginLeft: 10,
                  marginBottom: 4,
                  background: 'transparent',
                }}>
                  <div style={{ color: cfg.color, fontSize: 7, letterSpacing: '0.5px', marginBottom: 5, textShadow: `0 0 8px ${cfg.color}` }}>
                    {cfg.label}
                  </div>
                  <div style={{ color: '#bbb', fontSize: 6, lineHeight: 1.8, wordBreak: 'break-word' }}>
                    {task.task_name.substring(0, 38)}{task.task_name.length > 38 ? '...' : ''}
                  </div>
                  <div style={{ color: '#666', fontSize: 6, marginTop: 5, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{task.subagent_count > 0 ? `${task.subagent_count} agents` : '1 agent'}</span>
                    <span>{formatElapsed(task.started_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* COMPLETED section */}
        {completed.length > 0 && (
          <div style={{ marginTop: active.length > 0 ? 16 : 0 }}>
            <div style={{ padding: '4px 14px 8px' }}>
              <span style={{ color: '#555', fontSize: 7, letterSpacing: '1px' }}>COMPLETED</span>
            </div>
            {completed.map((task, i) => {
              const cfg = PROJECT_CONFIG[task.project];
              const failed = task.status === 'failed';
              return (
                <div key={task.id} style={{
                  padding: '8px 14px',
                  borderLeft: `2px solid ${failed ? '#ff444433' : '#1a1a1a'}`,
                  marginLeft: 10,
                  marginBottom: 3,
                  opacity: Math.max(0.3, 1 - i * 0.06),
                }}>
                  <div style={{ color: '#777', fontSize: 6, marginBottom: 3 }}>
                    <span style={{ color: cfg.color + '99' }}>{cfg.label.substring(0, 4)}</span>
                    {' '}{task.task_name.substring(0, 30)}{task.task_name.length > 30 ? '...' : ''}
                  </div>
                  <div style={{ color: failed ? '#ff4444aa' : '#444', fontSize: 6, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{failed ? 'FAILED' : 'DONE'}</span>
                    <span>{task.completed_at ? formatTime(task.completed_at) : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ color: '#555', fontSize: 6, padding: '20px 14px', lineHeight: 2 }}>
            NO TASKS YET.<br />STANDING BY.
          </div>
        )}
      </div>
    </div>
  );
}
