'use client';

import { useEffect, useRef } from 'react';
import { AgentActivity, PROJECT_CONFIG } from '@/types/activity';

interface ActivityFeedProps {
  activities: AgentActivity[];
}

function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${diffHr}h ago`;
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
          }}
        />
        <span style={{ color: '#555', fontSize: '7px', letterSpacing: '1px' }}>
          ACTIVITY LOG — LAST {activities.length} EVENTS
        </span>
      </div>

      {/* Feed entries */}
      <div
        ref={scrollRef}
        className="feed-scroll"
        style={{
          height: '120px',
          overflowY: 'auto',
          padding: '8px 16px',
        }}
      >
        {activities.length === 0 ? (
          <div style={{ color: '#333', fontSize: '7px', padding: '16px 0' }}>
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
                  marginBottom: '6px',
                  opacity: Math.max(0.3, 1 - index * 0.04),
                  fontSize: '6px',
                  lineHeight: '1.6',
                }}
              >
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
                <span style={{ color: '#333', flexShrink: 0 }}>
                  {formatRelativeTime(activity.created_at)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
