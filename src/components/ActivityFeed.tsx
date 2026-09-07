'use client';

import { useEffect, useRef } from 'react';
import { AgentActivity, PROJECT_CONFIG } from '@/types/activity';

interface ActivityFeedProps {
  activities: AgentActivity[];
}

function formatTimestamp(isoString: string): string {
  const d = new Date(isoString);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function statusColor(status: string): string {
  switch (status) {
    case 'running':
      return '#00ff88';
    case 'completed':
      return '#00CC44';
    case 'failed':
      return '#ff4444';
    case 'idle':
      return '#555';
    default:
      return '#888';
  }
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(activities.length);

  useEffect(() => {
    if (activities.length !== prevLengthRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    prevLengthRef.current = activities.length;
  }, [activities]);

  const hasRunning = activities.some(a => a.status === 'running');

  return (
    <div
      style={{
        background: '#060606',
        border: '2px solid #222',
        borderTop: '2px solid #333',
        fontFamily: '"Press Start 2P", cursive',
        flexShrink: 0,
      }}
    >
      {/* Feed header */}
      <div
        style={{
          padding: '8px 16px',
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#0a0a0a',
        }}
      >
        <div
          className="status-pulse"
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#00ff88',
            boxShadow: '0 0 4px #00ff88',
            '--pulse-shadow': '0 0 4px #00ff88',
            '--pulse-shadow-large': '0 0 12px #00ff88',
          } as React.CSSProperties}
        />
        <span style={{ color: '#555', fontSize: '7px', letterSpacing: '1px' }}>
          ACTIVITY LOG — LAST {activities.length} EVENTS
        </span>
        {hasRunning && (
          <span
            className="cursor-blink"
            style={{
              marginLeft: '8px',
              color: '#00ff88',
              fontSize: '6px',
              letterSpacing: '2px',
              textShadow: '0 0 6px #00ff88',
            }}
          >
            ● LIVE
          </span>
        )}
      </div>

      {/* Feed entries */}
      <div
        ref={scrollRef}
        className="feed-scroll"
        style={{
          height: '140px',
          overflowY: 'auto',
          padding: '8px 0',
        }}
      >
        {activities.length === 0 ? (
          <div style={{ color: '#333', fontSize: '7px', padding: '16px 20px' }}>
            &gt; NO ACTIVITY RECORDED YET...
          </div>
        ) : (
          activities.map((activity, index) => {
            const config = PROJECT_CONFIG[activity.project];
            return (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '4px',
                  opacity: Math.max(0.3, 1 - index * 0.04),
                  fontSize: '7px',
                  lineHeight: '1.6',
                  paddingLeft: '0',
                  borderLeft: `2px solid ${config.color}`,
                  paddingRight: '16px',
                }}
              >
                {/* Left color bar spacing */}
                <div style={{ width: '14px', flexShrink: 0 }} />
                <span style={{ color: '#333', flexShrink: 0 }}>&gt;</span>
                <span
                  style={{
                    color: config.color,
                    flexShrink: 0,
                    textShadow: `0 0 4px ${config.glowColor}`,
                  }}
                >
                  [{config.label}]
                </span>
                <span
                  style={{
                    color: '#888',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {activity.task_name}
                </span>
                <span
                  style={{
                    color: statusColor(activity.status),
                    flexShrink: 0,
                  }}
                >
                  {activity.status.toUpperCase()}
                </span>
                <span style={{ color: '#333', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {formatTimestamp(activity.created_at)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
