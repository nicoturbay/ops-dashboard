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
          }}
        />
      )}
    </div>
  );
}
