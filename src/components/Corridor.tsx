'use client';

import PixelCharacter from './PixelCharacter';

interface CorridorProps {
  direction: 'horizontal' | 'vertical';
  hasActiveAgent: boolean;
  agentColor?: string;
  length?: string;
}

export default function Corridor({
  direction,
  hasActiveAgent,
  agentColor = '#e0e0e0',
  length = '100%',
}: CorridorProps) {
  const isHorizontal = direction === 'horizontal';

  return (
    <div
      style={{
        position: 'relative',
        width: isHorizontal ? length : '20px',
        height: isHorizontal ? '20px' : length,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Corridor floor */}
      <div
        style={{
          position: 'absolute',
          width: isHorizontal ? '100%' : '12px',
          height: isHorizontal ? '12px' : '100%',
          background: '#111',
          border: '1px solid #2a2a2a',
          boxShadow: 'inset 0 0 8px rgba(0,0,0,0.8)',
        }}
      />

      {/* Corridor walls - top/bottom or left/right lines */}
      {isHorizontal ? (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: '#333',
              borderBottom: '1px solid #444',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: '#333',
              borderTop: '1px solid #444',
            }}
          />
        </>
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '4px',
              height: '100%',
              background: '#333',
              borderRight: '1px solid #444',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '4px',
              height: '100%',
              background: '#333',
              borderLeft: '1px solid #444',
            }}
          />
        </>
      )}

      {/* Walking pixel character */}
      {hasActiveAgent && (
        <div
          className={isHorizontal ? 'traverse-h' : 'traverse-v'}
          style={{
            position: 'absolute',
            ...(isHorizontal ? { top: '50%', transform: 'translateY(-50%)' } : { left: '50%', transform: 'translateX(-50%)' }),
          }}
        >
          <PixelCharacter color={agentColor} direction={direction} size={14} />
        </div>
      )}
    </div>
  );
}
