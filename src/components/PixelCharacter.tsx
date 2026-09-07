'use client';
interface PixelCharacterProps {
  color: string;
  direction: 'horizontal' | 'vertical';
}

export default function PixelCharacter({ color, direction }: PixelCharacterProps) {
  const isH = direction === 'horizontal';
  return (
    <div
      className={`pixel-walk ${isH ? 'traverse-h' : 'traverse-v'}`}
      style={{
        position: 'absolute',
        fontSize: '14px',
        lineHeight: 1,
        filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color})`,
        zIndex: 10,
      }}
    >
      ◆
    </div>
  );
}
