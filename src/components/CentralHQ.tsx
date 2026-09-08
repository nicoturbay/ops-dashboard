'use client';
import { useState } from 'react';

export default function CentralHQ() {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Outer glow ring */}
      <div style={{
        position: 'absolute',
        inset: '-20%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.22) 0%, rgba(255,107,0,0.08) 45%, transparent 70%)',
        animation: 'hq-pulse 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Secondary ring */}
      <div style={{
        position: 'absolute',
        inset: '5%',
        borderRadius: '50%',
        border: '1px solid rgba(255,107,0,0.25)',
        animation: 'hq-ring 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes hq-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        @keyframes hq-ring {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        @keyframes hq-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {imgError ? (
        /* Fallback if image fails */
        <div style={{
          width: '80%',
          height: '80%',
          background: '#0a0814',
          border: '2px solid #FF6B00',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: '0 0 30px rgba(255,107,0,0.3)',
        }}>
          <div style={{ fontSize: 32 }}>🦀</div>
          <div style={{
            color: '#FF6B00',
            fontSize: 8,
            fontFamily: '"Press Start 2P", cursive',
            letterSpacing: 1,
            textAlign: 'center',
            textShadow: '0 0 8px #FF6B00',
          }}>
            CLAWCKIE<br/>HQ
          </div>
        </div>
      ) : (
        <img
          src="/clawckie-hq-small.png"
          alt="Clawckie HQ"
          onError={() => setImgError(true)}
          style={{
            width: '88%',
            height: '88%',
            objectFit: 'contain',
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 0 20px rgba(255,107,0,0.6)) drop-shadow(0 0 6px rgba(255,107,0,0.9))',
            animation: 'hq-float 4s ease-in-out infinite',
            display: 'block',
          }}
        />
      )}
    </div>
  );
}
