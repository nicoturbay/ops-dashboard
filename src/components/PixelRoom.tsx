'use client';

import { Project } from '@/types/activity';

interface PixelRoomProps {
  project: Project;
  isActive: boolean;
  taskName?: string;
}

// ─── LAB ROOM (Clawckie) ─────────────────────────────────────────────────
function LabRoom({ isActive }: { isActive: boolean }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#c8cfe8', overflow: 'hidden' }}>
      {/* Floor tiles */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(#b8bfdb 1px, transparent 1px), linear-gradient(90deg, #b8bfdb 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.5,
      }} />

      {/* Top wall */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14, background: '#2a2d4a' }} />

      {/* Server rack — top left */}
      <div style={{ position: 'absolute', top: 14, left: 8, width: 28, height: 48, background: '#1a1c2e', border: '2px solid #3a3d5a' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ margin: '4px 3px 0', height: 6, background: '#2a2d4a', borderTop: `2px solid ${i % 2 === 0 ? '#ff6b00' : '#00cc44'}` }} />
        ))}
      </div>

      {/* Monitor bank — top center */}
      <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
        {(['#001a00', '#001a00', '#00001a'] as const).map((bg, i) => (
          <div key={i} style={{ width: 28, height: 22, background: bg, border: '3px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '80%', height: '70%', background: i === 2 ? '#001a40' : '#004400', opacity: 0.9 }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{ height: 2, background: i === 2 ? '#4444ff' : '#00ff44', margin: `${j * 3 + 1}px 2px 0`, width: `${40 + j * 20}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Chemical shelves — top right */}
      <div style={{ position: 'absolute', top: 14, right: 8, width: 40, height: 48, background: '#2a2d3e', border: '2px solid #3a3d5a' }}>
        <div style={{ display: 'flex', gap: 2, padding: '3px 3px 0', flexWrap: 'wrap' }}>
          {['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'].map((c, i) => (
            <div key={i} style={{ width: 6, height: 12, background: c, opacity: 0.85, borderRadius: '0 0 2px 2px', borderTop: '2px solid #ffffff44' }} />
          ))}
        </div>
      </div>

      {/* Lab bench — left */}
      <div style={{ position: 'absolute', top: '35%', left: 8, width: 18, height: 80, background: '#8a9aba', border: '2px solid #6a7a9a' }}>
        <div style={{ margin: '6px auto 0', width: 10, height: 14, background: '#333', borderRadius: '2px 2px 0 0' }} />
        <div style={{ margin: '8px auto 0', width: 8, height: 10, background: '#ff88ff44', border: '1px solid #ff88ff', borderRadius: '0 0 4px 4px' }} />
      </div>

      {/* Center lab bench */}
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: 100, height: 18, background: '#8a9aba', border: '2px solid #6a7a9a' }}>
        <div style={{ display: 'flex', gap: 4, padding: '2px 6px' }}>
          {['#ff4444', '#44ff44', '#4488ff', '#ffdd44'].map((c, i) => (
            <div key={i} style={{ width: 5, height: 12, background: c, opacity: 0.8, borderRadius: '0 0 2px 2px' }} />
          ))}
        </div>
      </div>

      {/* Lab bench — right */}
      <div style={{ position: 'absolute', top: '35%', right: 8, width: 18, height: 80, background: '#8a9aba', border: '2px solid #6a7a9a' }}>
        <div style={{ margin: '4px auto 0', width: 12, height: 12, background: '#224422', border: '2px solid #448844', borderRadius: 2 }} />
        <div style={{ margin: '6px auto 0', width: 10, height: 8, background: '#88aaff44', border: '1px solid #88aaff', borderRadius: '0 0 4px 4px' }} />
      </div>

      {/* Floor stools */}
      <div style={{ position: 'absolute', top: '52%', left: '28%', width: 10, height: 10, background: '#5a4a3a', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '52%', right: '28%', width: 10, height: 10, background: '#5a4a3a', borderRadius: '50%' }} />

      {/* Biohazard — bottom left */}
      <div style={{ position: 'absolute', bottom: 20, left: 8, width: 20, height: 20, background: '#ffdd00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
        ☣
      </div>

      {/* Door */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 30, height: 10, background: '#4a3a2a', border: '2px solid #6a5a4a', borderBottom: 'none' }} />

      {isActive && <LabWorker />}
    </div>
  );
}

function LabWorker() {
  return (
    <>
      <style>{`
        @keyframes lab-worker-move {
          0%, 100% { left: 38%; }
          30% { left: 50%; }
          60% { left: 42%; }
        }
        @keyframes worker-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
      <div style={{
        position: 'absolute',
        bottom: '22%',
        left: '38%',
        animation: 'lab-worker-move 4s ease-in-out infinite',
      }}>
        <div style={{ animation: 'worker-bob 0.5s steps(1) infinite', imageRendering: 'pixelated' }}>
          <div style={{ width: 12, height: 10, background: '#ff9944', border: '2px solid #cc6622', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 2, left: 2, width: 2, height: 2, background: '#000' }} />
            <div style={{ position: 'absolute', top: 2, right: 2, width: 2, height: 2, background: '#000' }} />
            <div style={{ position: 'absolute', top: 1, left: 1, width: 10, height: 4, border: '1px solid #4488ff', borderRadius: 1, background: '#4488ff22' }} />
          </div>
          <div style={{ width: 14, height: 12, background: '#eeeeee', border: '2px solid #cccccc', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 3, right: 2, width: 3, height: 4, border: '1px solid #aaa' }} />
            <div style={{ position: 'absolute', top: 2, left: -4, width: 6, height: 8, background: '#44ff8844', border: '1px solid #44ff88', borderRadius: '0 0 2px 2px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <div style={{ width: 4, height: 6, background: '#334455' }} />
            <div style={{ width: 4, height: 6, background: '#334455' }} />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── GYM ROOM (Coach Clawckie) ───────────────────────────────────────────
function GymRoom({ isActive }: { isActive: boolean }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#c8a87a', overflow: 'hidden' }}>
      {/* Wooden floor */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(90deg, #b89060 0px, #b89060 1px, transparent 1px, transparent 24px)',
        opacity: 0.5,
      }} />

      {/* Top wall */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14, background: '#2a1a0a' }} />

      {/* Motivational poster */}
      <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', width: 44, height: 28, background: '#cc0000', border: '2px solid #ff2222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
        <div style={{ color: '#fff', fontSize: 5, fontFamily: 'monospace', letterSpacing: 0 }}>NO PAIN</div>
        <div style={{ color: '#ffdd00', fontSize: 5, fontFamily: 'monospace' }}>NO GAIN</div>
      </div>

      {/* Weight rack — left */}
      <div style={{ position: 'absolute', top: 16, left: 8, width: 20, height: 50 }}>
        <div style={{ width: '100%', height: '100%', border: '2px solid #555', background: '#333', position: 'relative' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ position: 'absolute', top: 6 + i * 14, left: -4, right: -4, height: 8, background: '#666', border: '2px solid #888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '40%', height: 4, background: '#777', border: '1px solid #999' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Treadmill — right */}
      <div style={{ position: 'absolute', top: 20, right: 8, width: 44, height: 28 }}>
        <div style={{ width: '100%', height: '100%', background: '#222', border: '2px solid #444', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 4, left: 4, right: 4, height: 8, background: '#111', border: '1px solid #333', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              backgroundImage: 'repeating-linear-gradient(90deg, #222 0px, #222 4px, #333 4px, #333 8px)',
              animation: 'belt-move 0.5s linear infinite',
              width: '200%',
            }} />
          </div>
          <div style={{ position: 'absolute', top: 2, left: '50%', transform: 'translateX(-50%)', width: 20, height: 8, background: '#001a00', border: '1px solid #003300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#00ff44', fontSize: 4, fontFamily: 'monospace' }}>6.2</span>
          </div>
          <div style={{ position: 'absolute', top: -6, left: 6, width: 2, height: 8, background: '#555' }} />
          <div style={{ position: 'absolute', top: -6, right: 6, width: 2, height: 8, background: '#555' }} />
        </div>
      </div>

      {/* Exercise mats */}
      <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', width: 80, height: 20, background: '#6644aa', border: '2px solid #8866cc', borderRadius: 2 }}>
        <div style={{ margin: '4px 6px', height: 2, background: '#8866cc44', borderRadius: 1 }} />
      </div>

      {/* Dumbbells on floor */}
      {[
        { l: 20, t: '65%' },
        { l: 60, t: '65%' },
        { l: 120, t: '68%' },
      ].map(({ l, t }, i) => (
        <div key={i} style={{ position: 'absolute', top: t, left: l, display: 'flex', alignItems: 'center', gap: 1 }}>
          <div style={{ width: 4, height: 6, background: '#444', border: '1px solid #666' }} />
          <div style={{ width: 8, height: 3, background: '#555' }} />
          <div style={{ width: 4, height: 6, background: '#444', border: '1px solid #666' }} />
        </div>
      ))}

      {/* Pull-up bar */}
      <div style={{ position: 'absolute', bottom: 30, right: 12, width: 30, height: 4, background: '#333', border: '1px solid #666' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 2, width: 2, height: 10, background: '#444' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 2, width: 2, height: 10, background: '#444' }} />
      </div>

      {/* Door */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 30, height: 10, background: '#3a2a1a', border: '2px solid #5a4a3a', borderBottom: 'none' }} />

      <style>{`
        @keyframes belt-move {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      {isActive && <GymWorker />}
    </div>
  );
}

function GymWorker() {
  return (
    <>
      <style>{`
        @keyframes lift-arms {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-3px); }
          60% { transform: translateY(-3px); }
        }
      `}</style>
      <div style={{
        position: 'absolute',
        bottom: '28%',
        left: '40%',
      }}>
        <div style={{ animation: 'lift-arms 1.2s ease-in-out infinite' }}>
          <div style={{ width: 14, height: 6, background: '#ffcc00', border: '2px solid #dd9900', margin: '0 auto', borderRadius: '4px 4px 0 0' }} />
          <div style={{ width: 12, height: 10, background: '#ffaa66', border: '2px solid #cc7733', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#00cc44' }} />
            <div style={{ position: 'absolute', top: 4, left: 2, width: 2, height: 2, background: '#000' }} />
            <div style={{ position: 'absolute', top: 4, right: 2, width: 2, height: 2, background: '#000' }} />
          </div>
          <div style={{ width: 14, height: 12, background: '#00cc44', border: '2px solid #009933', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -10, left: -6, width: 26, height: 4, background: '#666', border: '1px solid #888' }}>
              <div style={{ position: 'absolute', left: -4, top: -3, width: 4, height: 10, background: '#888', border: '1px solid #aaa', borderRadius: 1 }} />
              <div style={{ position: 'absolute', right: -4, top: -3, width: 4, height: 10, background: '#888', border: '1px solid #aaa', borderRadius: 1 }} />
            </div>
            <div style={{ position: 'absolute', top: -6, left: -4, width: 4, height: 8, background: '#ffaa66', border: '1px solid #cc7733' }} />
            <div style={{ position: 'absolute', top: -6, right: -4, width: 4, height: 8, background: '#ffaa66', border: '1px solid #cc7733' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <div style={{ width: 4, height: 8, background: '#223344' }} />
            <div style={{ width: 4, height: 8, background: '#223344' }} />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── CONSTRUCTION SITE (Kince) ───────────────────────────────────────────
function ConstructionRoom({ isActive }: { isActive: boolean }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#9a8060', overflow: 'hidden' }}>
      {/* Dirt floor */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, #8a7050 1px, transparent 1px)',
        backgroundSize: '12px 12px',
        opacity: 0.6,
      }} />

      {/* Top wall */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14, background: '#1a1208' }} />

      {/* Scaffolding — left */}
      <div style={{ position: 'absolute', top: 14, left: 4, width: 30, height: 70 }}>
        <div style={{ position: 'absolute', top: 0, left: 4, width: 2, height: 70, background: '#ccaa44' }} />
        <div style={{ position: 'absolute', top: 0, left: 22, width: 2, height: 70, background: '#ccaa44' }} />
        {[0, 1, 2].map(i => (
          <div key={i} style={{ position: 'absolute', top: i * 22, left: 4, width: 20, height: 4, background: '#aa8833', border: '1px solid #ccaa44' }} />
        ))}
      </div>

      {/* Blueprint table */}
      <div style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%, -50%)', width: 70, height: 14, background: '#4a3a2a', border: '2px solid #6a5a4a' }}>
        <div style={{ position: 'absolute', top: -8, left: 6, width: 58, height: 20, background: '#1a4488', border: '1px solid #2266cc', transform: 'rotate(-2deg)' }}>
          <div style={{ position: 'absolute', inset: 2, backgroundImage: 'linear-gradient(#3366aa 1px, transparent 1px), linear-gradient(90deg, #3366aa 1px, transparent 1px)', backgroundSize: '6px 6px', opacity: 0.6 }} />
          <div style={{ position: 'absolute', top: 4, left: 8, width: 30, height: 10, border: '1px solid #88aaff', background: 'transparent' }} />
        </div>
      </div>

      {/* Hard hats */}
      {[
        { l: 30, t: '60%' },
        { l: 90, t: '62%' },
      ].map(({ l, t }, i) => (
        <div key={i} style={{ position: 'absolute', top: t, left: l, width: 14, height: 10, background: '#ffcc00', border: '2px solid #dd9900', borderRadius: '8px 8px 0 0' }} />
      ))}

      {/* Bricks stack — right */}
      <div style={{ position: 'absolute', top: 20, right: 8, display: 'grid', gridTemplateColumns: 'repeat(3, 14px)', gap: 1 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ width: 14, height: 7, background: '#cc4422', border: '1px solid #aa3311' }} />
        ))}
      </div>

      {/* Cement mixer */}
      <div style={{ position: 'absolute', bottom: 20, right: 12, width: 22, height: 22, background: '#555', border: '2px solid #777', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 10, height: 10, background: '#888', border: '2px solid #aaa', borderRadius: '50%' }} />
      </div>

      {/* Warning cones */}
      {[
        { l: 10, t: '78%' },
        { l: 40, t: '78%' },
      ].map(({ l, t }, i) => (
        <div key={i} style={{ position: 'absolute', top: t, left: l, width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '12px solid #ff6600' }} />
      ))}

      {/* Door */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 30, height: 10, background: '#2a1a0a', border: '2px solid #4a3a2a', borderBottom: 'none' }} />

      {isActive && <ConstructionWorker />}
    </div>
  );
}

function ConstructionWorker() {
  return (
    <>
      <style>{`
        @keyframes hammer-swing {
          0%, 100% { transform: rotate(0deg); }
          40% { transform: rotate(-40deg); }
          60% { transform: rotate(-40deg); }
        }
      `}</style>
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '42%',
      }}>
        <div>
          <div style={{ width: 14, height: 6, background: '#ffcc00', border: '2px solid #dd9900', margin: '0 auto', borderRadius: '4px 4px 0 0' }} />
          <div style={{ width: 12, height: 10, background: '#cc8844', border: '2px solid #aa6622', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 3, left: 2, width: 2, height: 2, background: '#000' }} />
            <div style={{ position: 'absolute', top: 3, right: 2, width: 2, height: 2, background: '#000' }} />
          </div>
          <div style={{ width: 14, height: 12, background: '#ff6600', border: '2px solid #cc4400', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 4, left: 0, right: 0, height: 2, background: '#ffff0088' }} />
            <div style={{ position: 'absolute', top: 2, right: -6, animation: 'hammer-swing 0.8s ease-in-out infinite' }}>
              <div style={{ width: 4, height: 10, background: '#cc8844', border: '1px solid #aa6622' }} />
              <div style={{ width: 10, height: 6, background: '#444', border: '1px solid #666', marginLeft: -3, marginTop: -2 }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <div style={{ width: 4, height: 8, background: '#334455' }} />
            <div style={{ width: 4, height: 8, background: '#334455' }} />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── OFFICE ROOM (Tremendous) ────────────────────────────────────────────
function OfficeRoom({ isActive }: { isActive: boolean }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#8a9a7a', overflow: 'hidden' }}>
      {/* Carpet texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(45deg, #7a8a6a 0px, #7a8a6a 2px, transparent 2px, transparent 8px)',
        opacity: 0.3,
      }} />

      {/* Top wall */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14, background: '#1a2010' }} />

      {/* Whiteboard */}
      <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 60, height: 28, background: '#f0f0f0', border: '3px solid #8a7a6a' }}>
        <div style={{ position: 'absolute', top: 4, left: 6, width: 30, height: 2, background: '#4488ff', opacity: 0.7 }} />
        <div style={{ position: 'absolute', top: 9, left: 6, width: 20, height: 2, background: '#4488ff', opacity: 0.7 }} />
        <div style={{ position: 'absolute', top: 14, left: 6, width: 35, height: 2, background: '#ff4444', opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: 19, left: 6, width: 25, height: 2, background: '#44aa44', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: -4, left: 4, right: 4, height: 4, background: '#8a7a6a', display: 'flex', gap: 2, padding: '1px 2px' }}>
          {['#ff4444', '#4488ff', '#44aa44', '#444'].map((c, i) => (
            <div key={i} style={{ width: 4, height: 2, background: c, borderRadius: 1 }} />
          ))}
        </div>
      </div>

      {/* Bookshelf — left */}
      <div style={{ position: 'absolute', top: 14, left: 6, width: 18, height: 52, background: '#3a2a1a', border: '2px solid #5a4a3a' }}>
        {['#cc4422', '#2244cc', '#44aa22', '#aaaa22', '#aa2244', '#2288aa'].map((c, i) => (
          <div key={i} style={{ margin: '2px 2px 0', height: 7, background: c, border: '1px solid #333' }} />
        ))}
      </div>

      {/* Desk 1 */}
      <div style={{ position: 'absolute', top: '40%', left: 10, width: 42, height: 12, background: '#5a4a3a', border: '2px solid #7a6a5a' }}>
        <div style={{ position: 'absolute', top: -14, left: 8, width: 20, height: 14, background: '#111', border: '2px solid #333' }}>
          <div style={{ margin: 2, height: '60%', background: '#001a00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '80%', height: '60%', background: '#002200', backgroundImage: 'linear-gradient(#003300 1px, transparent 1px)', backgroundSize: '100% 3px' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', top: -2, left: 6, width: 4, height: 2, background: '#333' }} />
      </div>

      {/* Desk 2 */}
      <div style={{ position: 'absolute', top: '40%', right: 10, width: 42, height: 12, background: '#5a4a3a', border: '2px solid #7a6a5a' }}>
        <div style={{ position: 'absolute', top: -14, left: 10, width: 20, height: 14, background: '#111', border: '2px solid #333' }}>
          <div style={{ margin: 2, height: '60%', background: '#1a0020', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '80%', height: '60%', background: '#200030', backgroundImage: 'linear-gradient(#2a0040 1px, transparent 1px)', backgroundSize: '100% 3px' }} />
          </div>
        </div>
      </div>

      {/* Meeting table */}
      <div style={{ position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)', width: 60, height: 18, background: '#6a5a4a', border: '2px solid #8a7a6a', borderRadius: 2 }}>
        <div style={{ position: 'absolute', top: 3, left: 8, width: 12, height: 10, background: '#fff', transform: 'rotate(-5deg)', opacity: 0.9 }} />
        <div style={{ position: 'absolute', top: 3, right: 8, width: 12, height: 10, background: '#fff', transform: 'rotate(3deg)', opacity: 0.9 }} />
        <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', width: 6, height: 8, background: '#aa3311', border: '1px solid #cc4422', borderRadius: '0 0 2px 2px' }} />
      </div>

      {/* Coffee machine */}
      <div style={{ position: 'absolute', bottom: 20, right: 8, width: 16, height: 22, background: '#222', border: '2px solid #444' }}>
        <div style={{ position: 'absolute', top: 3, left: 3, right: 3, height: 8, background: '#001a00', border: '1px solid #003300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#00ff44', fontSize: 4 }}>ON</span>
        </div>
        <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', width: 6, height: 8, background: '#3a2010', border: '1px solid #5a4030', borderRadius: '0 0 2px 2px' }} />
      </div>

      {/* Door */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 30, height: 10, background: '#2a1a0a', border: '2px solid #4a3a2a', borderBottom: 'none' }} />

      {isActive && <OfficeWorker />}
    </div>
  );
}

function OfficeWorker() {
  return (
    <>
      <style>{`
        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }
      `}</style>
      <div style={{
        position: 'absolute',
        bottom: '32%',
        left: '44%',
      }}>
        <div style={{ animation: 'typing 0.3s steps(1) infinite' }}>
          <div style={{ width: 12, height: 10, background: '#ffbbaa', border: '2px solid #cc8877', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 3, left: 2, width: 2, height: 2, background: '#000' }} />
            <div style={{ position: 'absolute', top: 3, right: 2, width: 2, height: 2, background: '#000' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#4a3020' }} />
          </div>
          <div style={{ width: 14, height: 12, background: '#ffffff', border: '2px solid #dddddd', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 1, left: '50%', transform: 'translateX(-50%)', width: 3, height: 10, background: '#FF1493' }} />
            <div style={{ position: 'absolute', top: 4, left: -5, width: 5, height: 4, background: '#ffbbaa', border: '1px solid #cc8877' }} />
            <div style={{ position: 'absolute', top: 4, right: -5, width: 5, height: 4, background: '#ffbbaa', border: '1px solid #cc8877' }} />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────
export default function PixelRoom({ project, isActive, taskName }: PixelRoomProps) {
  switch (project) {
    case 'clawckie': return <LabRoom isActive={isActive} />;
    case 'coach_clawckie': return <GymRoom isActive={isActive} />;
    case 'kince': return <ConstructionRoom isActive={isActive} />;
    case 'tremendous': return <OfficeRoom isActive={isActive} />;
  }
}
