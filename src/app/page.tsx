'use client';
import { useState, useEffect } from 'react';
import { useAgentActivity } from '@/hooks/useAgentActivity';
import ProjectRoom from '@/components/ProjectRoom';
import SidePanel from '@/components/SidePanel';
import CRTOverlay from '@/components/CRTOverlay';
import CentralHQ from '@/components/CentralHQ';
import CableGrid from '@/components/CableGrid';
import { Project, PROJECT_CONFIG } from '@/types/activity';

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

const ROOM_ORDER: Project[] = ['clawckie', 'coach_clawckie', 'kince', 'tremendous'];

export default function Home() {
  const { projectActivity, recentFeed, isLoading, isConnected, isOffline } = useAgentActivity();

  const activeProjects = ROOM_ORDER.filter(p => projectActivity[p]?.status === 'running');

  // Suppress unused variable warning — PROJECT_CONFIG imported for type safety
  void PROJECT_CONFIG;

  return (
    <div style={{
      height: '100vh',
      background: '#050508',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Press Start 2P", cursive',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <CRTOverlay />

      {/* Header */}
      <header style={{
        padding: '12px 24px 10px',
        borderBottom: '1px solid #111',
        textAlign: 'center',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #08080e, #050508)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: '5%', right: '5%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, #ffffff22, transparent)',
        }} />
        <h1 style={{ fontSize: 'clamp(12px, 2vw, 24px)', color: '#fff', letterSpacing: '5px', marginBottom: 4, textShadow: '0 0 20px #ffffff44' }}>
          MISSION CONTROL
        </h1>
        <p style={{ color: '#00CC44', fontSize: 6, letterSpacing: '2px', textShadow: '0 0 8px #00CC44' }}>
          [ REAL-TIME AGENT MONITORING ]
        </p>
      </header>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <SidePanel activities={recentFeed} />

        {/* Center stage — radial dungeon layout */}
        <div style={{
          flex: 1,
          position: 'relative',
          display: 'grid',
          gridTemplateAreas: `
            "tl . tr"
            ". hq ."
            "bl . br"
          `,
          gridTemplateColumns: '1fr auto 1fr',
          gridTemplateRows: '1fr auto 1fr',
          gap: 0,
          padding: '16px',
          minHeight: 0,
          overflow: 'hidden',
        }}>
          {/* SVG cables overlay */}
          <CableGrid activeProjects={activeProjects} />

          {/* Central HQ */}
          <div style={{
            gridArea: 'hq',
            width: 'clamp(140px, 16vw, 240px)',
            height: 'clamp(140px, 16vw, 240px)',
            alignSelf: 'center',
            justifySelf: 'center',
            zIndex: 10,
          }}>
            <CentralHQ />
          </div>

          {/* 4 Dungeon rooms */}
          {[
            { area: 'tl', project: 'clawckie' as Project },
            { area: 'tr', project: 'coach_clawckie' as Project },
            { area: 'bl', project: 'kince' as Project },
            { area: 'br', project: 'tremendous' as Project },
          ].map(({ area, project }) => (
            <div key={project} style={{
              gridArea: area,
              padding: '8px',
              display: 'flex',
              alignItems: area.startsWith('t') ? 'flex-end' : 'flex-start',
              justifyContent: area.endsWith('l') ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                width: 'clamp(180px, 22vw, 340px)',
                height: 'clamp(140px, 17vw, 270px)',
              }}>
                <ProjectRoom
                  project={project}
                  activity={projectActivity[project]}
                  recentHistory={recentFeed}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        padding: '6px 16px',
        background: '#030306',
        borderTop: '1px solid #0d0d0d',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{
          width: 6, height: 6,
          background: isOffline ? '#ff8800' : isConnected ? '#00ff88' : '#ff4444',
          boxShadow: isConnected ? '0 0 6px #00ff88' : 'none',
        }} />
        <span style={{ color: isOffline ? '#ff8800' : isConnected ? '#00ff88' : '#ff4444', fontSize: 5, letterSpacing: '0.5px' }}>
          {isOffline ? 'DEMO MODE' : isConnected ? 'LIVE' : 'RECONNECTING'}
        </span>
        <div style={{ flex: 1 }} />
        <Clock />
      </div>
    </div>
  );
}
