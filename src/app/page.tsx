'use client';
import { useState, useEffect } from 'react';
import { useAgentActivity } from '@/hooks/useAgentActivity';
import DungeonMap from '@/components/DungeonMap';
import ActivityFeed from '@/components/ActivityFeed';
import CRTOverlay from '@/components/CRTOverlay';

function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-US', {
        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
      }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <span style={{ color: '#333', fontSize: '6px', fontVariantNumeric: 'tabular-nums', letterSpacing: '1px' }}>{time}</span>;
}

export default function Home() {
  const { projectActivity, recentFeed, isLoading, isConnected, isOffline } = useAgentActivity();
  const activeCount = Object.values(projectActivity).filter(a => a?.status === 'running').length;

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
        padding: '20px 40px 16px',
        borderBottom: '1px solid #111',
        textAlign: 'center',
        flexShrink: 0,
        position: 'relative',
        background: 'linear-gradient(180deg, #08080e, #050508)',
      }}>
        {/* Glowing header line */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: '10%', right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #ffffff22, #ffffff44, #ffffff22, transparent)',
          boxShadow: '0 0 8px rgba(255,255,255,0.15)',
        }} />

        <h1 className="text-glow-white" style={{
          fontSize: 'clamp(18px, 3.5vw, 36px)',
          color: '#ffffff',
          letterSpacing: '6px',
          marginBottom: '10px',
          lineHeight: '1.3',
        }}>
          MISSION CONTROL
        </h1>
        <p style={{ color: '#00CC44', fontSize: '8px', letterSpacing: '3px', textShadow: '0 0 8px #00CC44' }}>
          [ REAL-TIME AGENT MONITORING SYSTEM ]
        </p>
        {activeCount > 0 && (
          <p style={{ color: '#555', fontSize: '6px', marginTop: '8px', letterSpacing: '1px' }}>
            {activeCount} AGENT{activeCount > 1 ? 'S' : ''} CURRENTLY ACTIVE
          </p>
        )}
      </header>

      {/* Main content — fills remaining space */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {isLoading ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <div style={{ color: '#333', fontSize: '10px', letterSpacing: '3px' }}>INITIALIZING SYSTEMS</div>
            <div className="cursor-blink" style={{ width: 10, height: 20, background: '#444' }} />
          </div>
        ) : (
          <DungeonMap projectActivity={projectActivity} recentFeed={recentFeed} />
        )}
      </main>

      {/* Activity Feed */}
      <ActivityFeed activities={recentFeed} />

      {/* Status bar */}
      <div style={{
        padding: '8px 20px',
        background: '#030306',
        borderTop: '1px solid #111',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0,
      }}>
        <div className={isConnected ? 'status-pulse' : ''} style={{
          width: 8, height: 8,
          background: isOffline ? '#ff8800' : isConnected ? '#00ff88' : '#ff4444',
          boxShadow: isConnected ? '0 0 8px #00ff88' : 'none',
          '--pulse-shadow': '0 0 8px #00ff88',
          '--pulse-shadow-large': '0 0 20px #00ff88',
          flexShrink: 0,
        } as React.CSSProperties} />
        <span style={{
          color: isOffline ? '#ff8800' : isConnected ? '#00ff88' : '#ff4444',
          fontSize: '6px', letterSpacing: '1px',
          textShadow: isConnected ? '0 0 6px #00ff88' : 'none',
        }}>
          {isOffline ? 'OFFLINE — DEMO MODE' : isConnected ? 'SUPABASE REALTIME CONNECTED' : 'RECONNECTING...'}
        </span>
        {isConnected && <span className="cursor-blink" style={{ display: 'inline-block', width: 6, height: 10, background: '#00ff88' }} />}
        <div style={{ flex: 1 }} />
        <span style={{ color: '#1a1a1a', fontSize: '6px' }}>ops.nicoturbay.com</span>
        <span style={{ color: '#111', fontSize: '6px' }}>|</span>
        <Clock />
      </div>
    </div>
  );
}
