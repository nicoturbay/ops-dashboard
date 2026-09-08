'use client';

export default function CentralHQ() {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    }}>
      {/* Glow ring behind the HQ */}
      <div style={{
        position: 'absolute',
        width: '110%',
        height: '110%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.18) 0%, transparent 70%)',
        animation: 'hq-pulse 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <style>{`
        @keyframes hq-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes hq-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
      <img
        src="/clawckie-hq.png"
        alt="Clawckie HQ"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          imageRendering: 'pixelated',
          filter: 'drop-shadow(0 0 24px rgba(255,107,0,0.5)) drop-shadow(0 0 8px rgba(255,107,0,0.8))',
          animation: 'hq-float 4s ease-in-out infinite',
        }}
      />
    </div>
  );
}
