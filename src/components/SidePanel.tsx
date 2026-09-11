'use client';
import { useState } from 'react';
import { AgentActivity, Project, PROJECT_CONFIG, STATUS_LABEL, STATUS_COLOR } from '@/types/activity';

type FilterProject = Project | 'all';
type FilterStatus = 'active' | 'completed';

interface SidePanelProps {
  activities: AgentActivity[];
}

const PROJECT_KEYS = Object.keys(PROJECT_CONFIG) as Project[];

export default function SidePanel({ activities }: SidePanelProps) {
  const [projectFilter, setProjectFilter] = useState<FilterProject>('all');
  const [statusFilter, setStatusFilter]   = useState<FilterStatus>('active');

  const byProject = projectFilter === 'all'
    ? activities
    : activities.filter(a => a.project === projectFilter);

  const active    = byProject.filter(a => a.status === 'in_progress' || a.status === 'in_queue');
  const completed = byProject.filter(a => a.status === 'completed' || a.status === 'could_not_complete');
  const visible   = statusFilter === 'active' ? active : completed;

  function parseDetail(detail: string | null): { model?: string; tokens?: number } {
    try { return detail ? JSON.parse(detail) : {}; } catch { return {}; }
  }

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
        padding: '20px 18px 16px',
        borderBottom: '1px solid #333',
        flexShrink: 0,
      }}>
        <span style={{ color: '#ffffff', fontSize: 15, letterSpacing: '2px' }}>TASK FEED</span>
      </div>

      {/* Status tabs — ACTIVE / COMPLETED */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #333',
        flexShrink: 0,
      }}>
        {(['active', 'completed'] as FilterStatus[]).map(s => {
          const isSel = statusFilter === s;
          const color = s === 'active' ? '#00ff88' : '#aaaaaa';
          const count = s === 'active' ? active.length : completed.length;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              flex: 1,
              background: isSel ? `${color}18` : 'transparent',
              border: 'none',
              borderBottom: isSel ? `2px solid ${color}` : '2px solid transparent',
              color: isSel ? color : '#555',
              fontSize: 9,
              fontFamily: '"Press Start 2P", cursive',
              padding: '14px 8px',
              cursor: 'pointer',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}>
              {s === 'active' && isSel && (
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', flexShrink: 0 }} />
              )}
              {s.toUpperCase()}
              <span style={{
                background: isSel ? `${color}33` : '#1a1a1a',
                border: `1px solid ${isSel ? color : '#444'}`,
                color: isSel ? color : '#555',
                fontSize: 8,
                padding: '1px 6px',
                borderRadius: 2,
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Project filter tabs */}
      <div style={{
        padding: '12px 14px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 7,
        borderBottom: '1px solid #222',
        flexShrink: 0,
      }}>
        {(['all', ...PROJECT_KEYS] as FilterProject[]).map(p => {
          const isAll = p === 'all';
          const cfg   = isAll ? null : PROJECT_CONFIG[p as Project];
          const isSel = projectFilter === p;
          return (
            <button key={p} onClick={() => setProjectFilter(p)} style={{
              background: isSel ? (cfg?.color ?? '#fff') : '#111',
              border: `1px solid ${isSel ? (cfg?.color ?? '#fff') : '#444'}`,
              color: isSel ? '#000' : (cfg?.color ?? '#aaa'),
              fontSize: 8,
              fontFamily: '"Press Start 2P", cursive',
              padding: '6px 10px',
              cursor: 'pointer',
              letterSpacing: '0.5px',
              boxShadow: isSel && cfg ? `0 0 10px ${cfg.color}` : 'none',
            }}>
              {isAll ? 'ALL' : cfg!.label.substring(0, 5)}
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 0' }}>

        {/* ACTIVE tasks */}
        {statusFilter === 'active' && visible.map(task => {
          const cfg         = PROJECT_CONFIG[task.project];
          const statusColor = STATUS_COLOR[task.status];
          const statusLabel = STATUS_LABEL[task.status];
          return (
            <div key={task.id} style={{
              padding: '14px 18px',
              marginLeft: 14,
              marginBottom: 10,
              borderLeft: `4px solid ${cfg.color}`,
              background: '#0d0d0d',
            }}>
              {/* Project label */}
              <div style={{ color: cfg.color, fontSize: 11, marginBottom: 8, textShadow: `0 0 10px ${cfg.color}`, letterSpacing: '0.5px' }}>
                {cfg.label}
              </div>

              {/* Task title */}
              <div style={{ color: '#ffffff', fontSize: 10, lineHeight: 1.9, wordBreak: 'break-word', marginBottom: 6 }}>
                {task.task_name}
              </div>

              {/* Description */}
              {task.description && (
                <div style={{ color: '#bbbbbb', fontSize: 11, lineHeight: 1.9, marginBottom: 8, wordBreak: 'break-word', fontFamily: 'monospace' }}>
                  {task.description.substring(0, 120)}{task.description.length > 120 ? '…' : ''}
                </div>
              )}
              {/* Model */}
              {(() => { const d = parseDetail((task as any).detail); return d.model ? (
                <div style={{ color: '#444', fontSize: 7, marginBottom: 6, letterSpacing: '0.3px' }}>
                  {d.model}{d.tokens ? ` · ${d.tokens.toLocaleString()} tokens` : ''}
                </div>
              ) : null; })()}

              {/* Status badge */}
              <div style={{
                display: 'inline-block',
                marginBottom: 6,
                padding: '3px 7px',
                background: `${statusColor}22`,
                border: `1px solid ${statusColor}`,
                color: statusColor,
                fontSize: 7,
                letterSpacing: '0.5px',
              }}>
                {statusLabel}
              </div>

              {/* Channel + meta row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                {task.discord_channel_name && (
                  <span style={{ color: '#555', fontSize: 7, letterSpacing: '0.3px' }}>
                    {task.discord_channel_name}
                  </span>
                )}
                <span style={{ color: '#aaaaaa', fontSize: 8, marginLeft: 'auto' }}>
                  {formatElapsed(task.started_at)}
                </span>
              </div>
            </div>
          );
        })}

        {/* COMPLETED tasks */}
        {statusFilter === 'completed' && visible.map((task, i) => {
          const cfg    = PROJECT_CONFIG[task.project];
          const failed = task.status === 'could_not_complete';
          const sColor = STATUS_COLOR[task.status];
          const sLabel = STATUS_LABEL[task.status];
          return (
            <div key={task.id} style={{
              padding: '12px 18px',
              marginLeft: 14,
              marginBottom: 8,
              borderLeft: `3px solid ${failed ? '#ff4444' : '#333'}`,
              opacity: Math.max(0.55, 1 - i * 0.04),
            }}>
              {/* Project + title */}
              <div style={{ color: '#dddddd', fontSize: 10, marginBottom: 6, lineHeight: 1.8, wordBreak: 'break-word' }}>
                <span style={{ color: cfg.color }}>{cfg.label.substring(0, 5)}</span>
                {'  '}{task.task_name}
              </div>

              {/* Description */}
              {task.description && (
                <div style={{ color: '#777777', fontSize: 10, lineHeight: 1.9, marginBottom: 8, fontFamily: 'monospace', wordBreak: 'break-word' }}>
                  {task.description.substring(0, 100)}{task.description.length > 100 ? '…' : ''}
                </div>
              )}
              {/* Model */}
              {(() => { const d = parseDetail((task as any).detail); return d.model ? (
                <div style={{ color: '#444', fontSize: 7, marginBottom: 4, letterSpacing: '0.3px' }}>
                  {d.model}{d.tokens ? ` · ${d.tokens.toLocaleString()} tokens` : ''}
                </div>
              ) : null; })()}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 7px',
                  background: `${sColor}22`,
                  border: `1px solid ${sColor}`,
                  color: sColor,
                  fontSize: 7,
                  letterSpacing: '0.3px',
                }}>
                  {sLabel}
                </span>
                <span style={{ color: '#888888', fontSize: 8 }}>
                  {task.completed_at ? formatTime(task.completed_at) : ''}
                </span>
              </div>
            </div>
          );
        })}

        {visible.length === 0 && (
          <div style={{ color: '#555', fontSize: 9, padding: '28px 18px', lineHeight: 2.4 }}>
            {statusFilter === 'active' ? 'NO ACTIVE TASKS.\nSTANDING BY.' : 'NO COMPLETED\nTASKS YET.'}
          </div>
        )}
      </div>
    </div>
  );
}
