'use client';
import { useState, useEffect } from 'react';
import { useAgentActivity } from '@/hooks/useAgentActivity';
import ProjectRoom from '@/components/ProjectRoom';
import SidePanel from '@/components/SidePanel';
import CRTOverlay from '@/components/CRTOverlay';
import CentralHQ from '@/components/CentralHQ';
import CableGrid from '@/components/CableGrid';
import { Project } from '@/types/activity';

function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <span style={{ color: '#333', fontSize: 'var(--fs-xs)', fontVariantNumeric: 'tabular-nums', letterSpacing: '1px', fontFamily: '"Press Start 2P", cursive' }}>{time}</span>;
}

// ─── Hamburger Nav ──────────────────────────────────────────────────────────

function HamburgerNav() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          fontSize: 18,
          color: '#00FF66',
          background: 'transparent',
          border: '1px solid #333',
          padding: '4px 10px',
          cursor: 'pointer',
          fontFamily: 'monospace',
          lineHeight: 1,
          letterSpacing: 0,
        }}
        aria-label="Open navigation menu"
      >
        ☰
      </button>
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          />
          <div style={{
            position: 'absolute',
            top: '110%',
            right: 0,
            background: '#0a0a10',
            border: '1px solid #00FF66',
            boxShadow: '0 0 20px #00FF6633',
            zIndex: 100,
            minWidth: 200,
            padding: '8px 0',
          }}>
            <a
              href="/"
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '10px 16px',
                color: '#fff',
                fontSize: 7,
                fontFamily: '"Press Start 2P", cursive',
                letterSpacing: 2,
                textDecoration: 'none',
                borderBottom: '1px solid #111',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.textShadow = '0 0 8px #fff'; (e.target as HTMLElement).style.background = '#111'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.textShadow = 'none'; (e.target as HTMLElement).style.background = 'transparent'; }}
            >
              [ SPEND CONTROL ]
            </a>
            <a
              href="/hq"
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '10px 16px',
                color: '#00FF66',
                fontSize: 7,
                fontFamily: '"Press Start 2P", cursive',
                letterSpacing: 2,
                textDecoration: 'none',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.textShadow = '0 0 8px #00FF66'; (e.target as HTMLElement).style.background = '#111'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.textShadow = 'none'; (e.target as HTMLElement).style.background = 'transparent'; }}
            >
              [ MISSION CONTROL ]
            </a>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Task Feed ───────────────────────────────────────────────────────────────

interface OpsTask {
  id: string;
  title: string;
  status: string;
  channel_name?: string;
  server_name?: string;
  created_at: string;
  updated_at?: string;
}

function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function statusColor(status: string): string {
  switch (status) {
    case 'completed': return '#00CC44';
    case 'in_progress': return '#FF6B00';
    case 'could_not_complete': return '#ff4444';
    default: return '#444';
  }
}

function TaskFeed() {
  const [tasks, setTasks] = useState<OpsTask[]>([]);
  const [, setTick] = useState(0);

  const fetchTasks = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xclunvqofcsyirlbfych.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!supabaseKey) return;
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/ops_tasks?order=created_at.desc&limit=20`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setTasks(data ?? []);
      }
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchTasks();
    const id = setInterval(() => {
      fetchTasks();
      setTick(t => t + 1);
    }, 30000);
    return () => clearInterval(id);
  }, []);

  // Also tick every 30s to refresh relative times
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{
      background: '#0a0a10',
      borderBottom: '1px solid #1a1a1a',
      padding: '12px 16px',
      flexShrink: 0,
    }}>
      <h2 style={{ color: '#888', fontSize: 7, letterSpacing: 3, marginBottom: 8, fontFamily: '"Press Start 2P", cursive' }}>
        [ TASK FEED ]
      </h2>
      <div style={{
        maxHeight: 220,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        {tasks.length === 0 ? (
          <div style={{ color: '#333', fontSize: 6, letterSpacing: 2, padding: '8px 0', fontFamily: '"Press Start 2P", cursive' }}>
            NO TASKS YET — AGENTS IDLE
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 8px',
              borderBottom: '1px solid #111',
              background: '#080810',
            }}>
              {/* Status dot */}
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: statusColor(task.status),
                boxShadow: task.status === 'in_progress' ? `0 0 6px ${statusColor(task.status)}` : 'none',
                flexShrink: 0,
              }} />
              {/* Title */}
              <div style={{
                color: '#fff',
                fontSize: 6,
                fontFamily: '"Press Start 2P", cursive',
                letterSpacing: 1,
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {task.title}
              </div>
              {/* Channel */}
              {task.channel_name && (
                <div style={{ color: '#444', fontSize: 5, fontFamily: '"Press Start 2P", cursive', letterSpacing: 1, flexShrink: 0 }}>
                  #{task.channel_name}
                </div>
              )}
              {/* Timestamp */}
              <div style={{ color: '#333', fontSize: 5, fontFamily: '"Press Start 2P", cursive', letterSpacing: 1, flexShrink: 0 }}>
                {relativeTime(task.created_at)}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// Room corner order: tl, tr, bl, br
const ROOM_LAYOUT: { id: string; project: Project; area: string }[] = [
  { id: 'room-clawckie',       project: 'clawckie',       area: 'tl' },
  { id: 'room-coach',          project: 'coach_clawckie', area: 'tr' },
  { id: 'room-kince',          project: 'kince',           area: 'bl' },
  { id: 'room-tremendous',     project: 'tremendous',      area: 'br' },
];

export default function Home() {
  const { projectActivity, recentFeed, isLoading, isConnected, isOffline } = useAgentActivity();
  const activeProjects = ROOM_LAYOUT
    .filter(r => projectActivity[r.project]?.status === 'in_progress')
    .map(r => r.project);

  return (
    <div style={{
      height: '100vh',
      background: '#050508',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Press Start 2P", cursive',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <CRTOverlay />

      {/* Main — 2/6 side panel + 4/6 stage, full height */}
      <div className="main-grid" style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 4fr', overflow: 'hidden', minHeight: 0 }}>
        <SidePanel activities={recentFeed} />

        {/* Right column: header + task feed + stage + status */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

          {/* Header — centered title, hamburger right */}
          <header className="mc-header" style={{
            padding: '12px 24px 10px',
            borderBottom: '1px solid #111',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            flexShrink: 0,
            background: '#000',
            zIndex: 1,
          }}>
            {/* Left: empty placeholder for grid alignment */}
            <div />

            {/* Center: title */}
            <div style={{ textAlign: 'center' }}>
              <h1 className="mc-title" style={{ fontSize: 'clamp(11px, 1.8vw, 22px)', color: '#fff', letterSpacing: '6px', marginBottom: 4, textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
                MISSION CONTROL
              </h1>
              <p style={{ color: '#00CC44', fontSize: 'var(--fs-xs)', letterSpacing: '2px', textShadow: '0 0 8px #00CC44' }}>
                [ REAL-TIME AGENT MONITORING ]
              </p>
            </div>

            {/* Right: hamburger */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <HamburgerNav />
            </div>
          </header>

          {/* Task Feed */}
          <TaskFeed />

        {/* Stage — background image lives here only */}
        <div
          id="dungeon-stage"
          style={{
            flex: 1,
            position: 'relative',
            backgroundImage: 'url(/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: 0,
            display: 'flex',
          }}
        >
          <div
            id="stage-grid"
            style={{
              flex: 1,
              position: 'relative',
              display: 'grid',
              gridTemplateAreas: `
                "tl . tr"
                ".  hq ."
                "bl . br"
              `,
              gridTemplateColumns: '1fr auto 1fr',
              gridTemplateRows: '1fr auto 1fr',
              padding: '20px',
              gap: '16px',
              minHeight: 0,
              overflow: 'visible',
            }}
          >
          {/* Cable overlay — covers full stage */}
          <CableGrid activeProjects={activeProjects} />

          {/* Central HQ */}
          <div
            id="central-hq"
            className="hq-slot"
            style={{
              gridArea: 'hq',
              alignSelf: 'center',
              justifySelf: 'center',
              zIndex: 10,
            }}
          >
            <CentralHQ />
          </div>

          {/* Four rooms */}
          {ROOM_LAYOUT.map(({ id, project, area }) => {
            const isLeft = area.endsWith('l');
            const isTop = area.startsWith('t');
            return (
              <div
                key={project}
                className="room-slot-wrapper"
                style={{
                  gridArea: area,
                  display: 'flex',
                  alignItems: isTop ? 'flex-end' : 'flex-start',
                  justifyContent: isLeft ? 'flex-end' : 'flex-start',
                  padding: '0px',
                }}
              >
                <div
                  id={id}
                  className="room-slot"
                >
                  <ProjectRoom
                    project={project}
                    activity={projectActivity[project]}
                    recentHistory={recentFeed}
                  />
                </div>
              </div>
            );
          })}
          </div> {/* end stage-grid */}
        </div> {/* end dungeon-stage */}

          {/* Status bar */}
          <div style={{
            padding: '5px 16px',
            background: '#000',
            borderTop: '1px solid #1a1a1a',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
          }}>
            <div style={{
              width: 6, height: 6,
              borderRadius: '50%',
              background: isOffline ? '#ff8800' : isConnected ? '#00ff88' : '#ff4444',
              boxShadow: isConnected ? '0 0 6px #00ff88' : 'none',
            }} />
            <span style={{ color: isOffline ? '#ff8800' : isConnected ? '#00ff88' : '#ff4444', fontSize: 'var(--fs-2xs)', letterSpacing: '1px' }}>
              {isOffline ? 'DEMO MODE' : isConnected ? 'LIVE' : 'RECONNECTING'}
            </span>
            <div style={{ flex: 1 }} />
            <Clock />
          </div>

        </div> {/* end right column */}
      </div> {/* end main grid */}
    </div>
  );
}
