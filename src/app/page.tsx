'use client';
import { useState, useEffect } from 'react';
import { useAgentActivity } from '@/hooks/useAgentActivity';
import DungeonMap from '@/components/DungeonMap';
import SidePanel from '@/components/SidePanel';
import CRTOverlay from '@/components/CRTOverlay';

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

export default function Home() {
  const { projectActivity, recentFeed, isLoading, isConnected, isOffline } = useAgentActivity();

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

      {/* Top bar */}
      <header style={{
        padding: '14px 24px 12px',
        borderBottom: '1px solid #111',
        textAlign: 'center',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #08080e, #050508)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: '5%', right: '5%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, #ffffff33, transparent)',
        }} />
        <h1 className="text-glow-white" style={{ fontSize: 'clamp(14px, 2.5vw, 28px)', color: '#fff', letterSpacing: '5px', marginBottom: 6 }}>
          MISSION CONTROL
        </h1>
        <p style={{ color: '#00CC44', fontSize: 7, letterSpacing: '2px', textShadow: '0 0 8px #00CC44' }}>
          [ REAL-TIME AGENT MONITORING ]
        </p>
      </header>

      {/* Main area: side panel + dungeon */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <SidePanel activities={recentFeed} />

        {/* Dungeon area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
          {isLoading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
              <div style={{ color: '#333', fontSize: 10, letterSpacing: 3 }}>INITIALIZING</div>
              <div className="cursor-blink" style={{ width: 10, height: 20, background: '#333' }} />
            </div>
          ) : (
            <DungeonMap projectActivity={projectActivity} recentFeed={recentFeed} />
          )}
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
        <div className={isConnected ? 'status-pulse' : ''} style={{
          width: 6, height: 6,
          background: isOffline ? '#ff8800' : isConnected ? '#00ff88' : '#ff4444',
          boxShadow: isConnected ? '0 0 6px #00ff88' : 'none',
          '--pulse-shadow': '0 0 6px #00ff88',
          '--pulse-shadow-large': '0 0 16px #00ff88',
        } as React.CSSProperties} />
        <span style={{ color: isOffline ? '#ff8800' : isConnected ? '#00ff88' : '#ff4444', fontSize: 5, letterSpacing: '0.5px' }}>
          {isOffline ? 'DEMO MODE' : isConnected ? 'LIVE' : 'RECONNECTING'}
        </span>
        <div style={{ flex: 1 }} />
        <Clock />
      </div>
    </div>
  );
}
