'use client';
export default function CRTOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div className="crt-scanlines" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
      {/* Sweep line */}
      <div className="scan-sweep" />
      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998,
        background: 'radial-gradient(ellipse at center, transparent 72%, rgba(0,0,0,0.35) 100%)'
      }} />
    </>
  );
}
