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
  return <span style={{ color: '#333', fontSize: 6, fontVariantNumeric: 'tabular-nums', letterSpacing: '1px', fontFamily: '"Press Start 2P", cursive' }}>{time}</span>;
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
    .filter(r => projectActivity[r.project]?.status === 'running')
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
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 4fr', overflow: 'hidden', minHeight: 0 }}>
        <SidePanel activities={recentFeed} />

        {/* Right column: header + stage + status */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

          {/* Header — centered within the 4/6 column */}
          <header style={{
            padding: '12px 24px 10px',
            borderBottom: '1px solid #111',
            textAlign: 'center',
            flexShrink: 0,
            background: '#000',
            zIndex: 1,
          }}>
            <h1 style={{ fontSize: 'clamp(11px, 1.8vw, 22px)', color: '#fff', letterSpacing: '6px', marginBottom: 4, textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
              MISSION CONTROL
            </h1>
            <p style={{ color: '#00CC44', fontSize: 6, letterSpacing: '2px', textShadow: '0 0 8px #00CC44' }}>
              [ REAL-TIME AGENT MONITORING ]
            </p>
          </header>

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
            style={{
              gridArea: 'hq',
              width: 'clamp(280px, 32vw, 460px)',
              height: 'clamp(280px, 32vw, 460px)',
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
                  style={{
                    width: 'clamp(200px, 26vw, 400px)',
                    height: 'clamp(160px, 20vw, 310px)',
                  }}
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
            <span style={{ color: isOffline ? '#ff8800' : isConnected ? '#00ff88' : '#ff4444', fontSize: 5, letterSpacing: '1px' }}>
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
