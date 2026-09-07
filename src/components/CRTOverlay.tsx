'use client';

export default function CRTOverlay() {
  return (
    <>
      {/* Vignette effect */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
          zIndex: 49,
        }}
      />
      {/* Additional scanline shimmer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />
    </>
  );
}
