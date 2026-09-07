'use client';

import { useAgentActivity } from '@/hooks/useAgentActivity';
import DungeonMap from '@/components/DungeonMap';
import ActivityFeed from '@/components/ActivityFeed';
import CRTOverlay from '@/components/CRTOverlay';

export default function Home() {
  const { projectActivity, recentFeed, isLoading, isConnected, isOffline } = useAgentActivity();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Press Start 2P", cursive',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CRTOverlay />

      {/* Header */}
      <header
        style={{
          padding: '24px 32px 16px',
          borderBottom: '2px solid #1a1a1a',
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        <h1
          className="text-glow-white"
          style={{
            fontSize: 'clamp(14px, 3vw, 28px)',
            color: '#ffffff',
            letterSpacing: '4px',
            marginBottom: '10px',
            lineHeight: '1.4',
          }}
        >
          MISSION CONTROL
        </h1>
        <p
          style={{
            color: '#444',
            fontSize: 'clamp(5px, 1vw, 8px)',
            letterSpacing: '2px',
          }}
        >
          CLAWCKIE OPERATIONS CENTER v1.0
        </p>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {isLoading ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                color: '#444',
                fontSize: '8px',
                letterSpacing: '2px',
              }}
            >
              INITIALIZING SYSTEMS...
            </div>
            <div
              className="cursor-blink"
              style={{
                width: 8,
                height: 16,
                background: '#555',
              }}
            />
          </div>
        ) : (
          <DungeonMap projectActivity={projectActivity} recentFeed={recentFeed} />
        )}
      </main>

      {/* Activity Feed */}
      <ActivityFeed activities={recentFeed} />

      {/* Status bar */}
      <div
        style={{
          padding: '8px 16px',
          background: '#060606',
          borderTop: '1px solid #1a1a1a',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        {/* Connection indicator */}
        <div
          className={isConnected ? 'status-pulse' : ''}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: isOffline
              ? '#ff8800'
              : isConnected
              ? '#00ff88'
              : '#ff4444',
            boxShadow: isConnected
              ? '0 0 4px #00ff88'
              : isOffline
              ? '0 0 4px #ff8800'
              : 'none',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            color: isOffline
              ? '#ff8800'
              : isConnected
              ? '#00ff88'
              : '#ff4444',
            fontSize: '6px',
            letterSpacing: '1px',
          }}
        >
          {isOffline
            ? 'OFFLINE MODE — CONFIGURE SUPABASE TO ENABLE REALTIME'
            : isConnected
            ? 'CONNECTED TO SUPABASE REALTIME'
            : 'RECONNECTING...'}
        </span>

        {/* Blinking cursor when connected */}
        {isConnected && (
          <span
            className="cursor-blink"
            style={{
              display: 'inline-block',
              width: 6,
              height: 10,
              background: '#00ff88',
            }}
          />
        )}

        <div style={{ flex: 1 }} />

        {/* Right side: uptime clock */}
        <span style={{ color: '#333', fontSize: '5px', letterSpacing: '0.5px' }}>
          ops.nicoturbay.com
        </span>
      </div>
    </div>
  );
}
