'use client';
import { useState } from 'react';

export default function CentralHQ() {
  const [err, setErr] = useState(false);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <style>{`
        @keyframes hq-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes hq-glow  { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>

      {/* Glow behind */}
      <div style={{
        position: 'absolute',
        inset: '-15%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.25) 0%, transparent 65%)',
        animation: 'hq-glow 3.5s ease-in-out infinite',
        pointerEvents: 'none',
        borderRadius: '50%',
      }} />

      {err ? (
        <div style={{
          width: '85%', height: '85%',
          background: '#0a0814',
          border: '2px solid #FF6B00',
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: '0 0 30px rgba(255,107,0,0.4)',
        }}>
          <div style={{ fontSize: 28 }}>🦀</div>
          <div style={{ color: '#FF6B00', fontSize: 7, fontFamily: '"Press Start 2P", cursive', textAlign: 'center', lineHeight: 2, textShadow: '0 0 8px #FF6B00' }}>
            CLAWCKIE<br/>HQ
          </div>
        </div>
      ) : (
        <img
          src="/clawckie-hq-small.png"
          alt="Clawckie HQ"
          onError={() => setErr(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 0 16px rgba(255,107,0,0.7)) drop-shadow(0 0 4px rgba(255,107,0,1))',
            animation: 'hq-float 4s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
}
