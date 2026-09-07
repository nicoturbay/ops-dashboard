'use client';

interface PixelCharacterProps {
  color: string;
  direction?: 'horizontal' | 'vertical';
  size?: number;
}

export default function PixelCharacter({
  color,
  direction = 'horizontal',
  size = 16,
}: PixelCharacterProps) {
  return (
    <div
      className="pixel-walk"
      style={{
        width: size,
        height: size,
        position: 'absolute',
        fontSize: size * 0.9,
        lineHeight: 1,
        filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px ${color})`,
        zIndex: 10,
        userSelect: 'none',
        ...(direction === 'horizontal' ? { top: '50%', transform: 'translateY(-50%)' } : { left: '50%', transform: 'translateX(-50%)' }),
      }}
    >
      🤖
    </div>
  );
}
