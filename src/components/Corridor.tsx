'use client';
import PixelCharacter from './PixelCharacter';

interface CorridorProps {
  direction: 'horizontal' | 'vertical';
  hasActiveAgent: boolean;
  agentColor: string;
  length: string;
}

export default function Corridor({ direction, hasActiveAgent, agentColor, length }: CorridorProps) {
  const isH = direction === 'horizontal';

  return (
    <div style={{
      position: 'relative',
      width: isH ? length : '4px',
      height: isH ? '4px' : length,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
    }}>
      {/* Main corridor line */}
      <div style={{
        position: 'absolute',
        width: isH ? '100%' : '4px',
        height: isH ? '4px' : '100%',
        background: hasActiveAgent
          ? `linear-gradient(${isH ? '90deg' : '180deg'}, transparent, ${agentColor}, transparent)`
          : '#1a1a1a',
        boxShadow: hasActiveAgent
          ? `0 0 8px ${agentColor}, 0 0 20px ${agentColor}44`
          : 'none',
        transition: 'all 0.5s ease',
      }} />

      {/* Dashed overlay for texture */}
      <div style={{
        position: 'absolute',
        width: isH ? '100%' : '4px',
        height: isH ? '4px' : '100%',
        backgroundImage: isH
          ? `repeating-linear-gradient(90deg, transparent 0px, transparent 6px, ${hasActiveAgent ? agentColor + '33' : '#111'} 6px, ${hasActiveAgent ? agentColor + '33' : '#111'} 8px)`
          : `repeating-linear-gradient(180deg, transparent 0px, transparent 6px, ${hasActiveAgent ? agentColor + '33' : '#111'} 6px, ${hasActiveAgent ? agentColor + '33' : '#111'} 8px)`,
        mixBlendMode: 'screen',
      }} />

      {/* Walking character */}
      {hasActiveAgent && (
        <div style={{
          position: 'absolute',
          [isH ? 'top' : 'left']: isH ? '50%' : '50%',
          transform: isH ? 'translateY(-50%)' : 'translateX(-50%)',
        }}>
          <PixelCharacter
            color={agentColor}
            direction={direction}
          />
        </div>
      )}
    </div>
  );
}
