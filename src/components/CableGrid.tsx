'use client';
import { useEffect, useRef, useState } from 'react';

interface CableGridProps {
  activeProjects: string[];
}

const PROJECT_COLORS: Record<string, string> = {
  clawckie: '#FF6B00',
  coach_clawckie: '#00CC44',
  kince: '#B388FF',
  tremendous: '#FF1493',
};

// Corner order matches the grid: tl, tr, bl, br
const CORNERS = [
  { id: 'clawckie',      label: 'tl' },
  { id: 'coach_clawckie', label: 'tr' },
  { id: 'kince',          label: 'bl' },
  { id: 'tremendous',     label: 'br' },
];

interface Dims {
  w: number;
  h: number;
  hqX: number;
  hqY: number;
  roomW: number;
  roomH: number;
  pad: number;
}

function getCableEndpoints(dims: Dims) {
  const { w, h, hqX, hqY, roomW, roomH, pad } = dims;

  // Room centers in the 4 corners
  const tl = { x: pad + roomW / 2, y: pad + roomH / 2 };
  const tr = { x: w - pad - roomW / 2, y: pad + roomH / 2 };
  const bl = { x: pad + roomW / 2, y: h - pad - roomH / 2 };
  const br = { x: w - pad - roomW / 2, y: h - pad - roomH / 2 };

  return [
    { project: 'clawckie',       from: { x: hqX, y: hqY }, to: tl,  color: PROJECT_COLORS['clawckie'],       delay: 0 },
    { project: 'coach_clawckie', from: { x: hqX, y: hqY }, to: tr,  color: PROJECT_COLORS['coach_clawckie'], delay: 0.5 },
    { project: 'kince',          from: { x: hqX, y: hqY }, to: bl,  color: PROJECT_COLORS['kince'],           delay: 1.0 },
    { project: 'tremendous',     from: { x: hqX, y: hqY }, to: br,  color: PROJECT_COLORS['tremendous'],      delay: 1.5 },
  ];
}

function bezierPath(
  from: { x: number; y: number },
  to: { x: number; y: number }
): string {
  // Control points: bend toward the destination with a gentle curve
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  // Offset control points perpendicular-ish to add a subtle arc
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cx1 = from.x + dx * 0.35;
  const cy1 = from.y + dy * 0.15;
  const cx2 = from.x + dx * 0.65;
  const cy2 = from.y + dy * 0.85;
  return `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;
}

export default function CableGrid({ activeProjects }: CableGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<Dims | null>(null);

  useEffect(() => {
    function measure() {
      const el = containerRef.current;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const pad = 16;

      // Room size mirrors DungeonMap clamp logic — approximate for cable endpoints
      const roomW = Math.min(340, Math.max(180, w * 0.22));
      const roomH = Math.min(270, Math.max(140, w * 0.17));

      // HQ center — grid center
      const hqX = w / 2;
      const hqY = h / 2;

      setDims({ w, h, hqX, hqY, roomW, roomH, pad });
    }

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const cables = dims ? getCableEndpoints(dims) : [];

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      {dims && (
        <svg
          width={dims.w}
          height={dims.h}
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        >
          <defs>
            {cables.map(c => (
              <filter key={`gf-${c.project}`} id={`gf-${c.project}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>

          {cables.map(c => {
            const isActive = activeProjects.includes(c.project);
            const d = bezierPath(c.from, c.to);

            return (
              <g key={c.project}>
                {/* Shadow/gutter */}
                <path d={d} stroke="#0a0a0a" strokeWidth="6" fill="none" strokeLinecap="round" />

                {/* Main tube — thick base */}
                <path
                  d={d}
                  stroke={c.color}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  opacity={isActive ? 0.85 : 0.15}
                  filter={isActive ? `url(#gf-${c.project})` : undefined}
                  style={{ transition: 'opacity 0.6s ease' }}
                />

                {/* Inner highlight — thinner, brighter */}
                <path
                  d={d}
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  fill="none"
                  strokeLinecap="round"
                  opacity={isActive ? 0.25 : 0.04}
                  style={{ transition: 'opacity 0.6s ease' }}
                />

                {/* Segment dashes — pipe texture */}
                <path
                  d={d}
                  stroke={c.color}
                  strokeWidth="3"
                  strokeDasharray="6 10"
                  fill="none"
                  strokeLinecap="round"
                  opacity={isActive ? 0.3 : 0.06}
                  style={{ transition: 'opacity 0.6s ease' }}
                />

                {/* Animated pulse dots — 3 per cable */}
                {isActive && [0, 1, 2].map(i => (
                  <circle key={i} r="4" fill={c.color} opacity="1">
                    <filter id={`dot-glow-${c.project}-${i}`}>
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <animateMotion
                      dur="2.2s"
                      begin={`${c.delay + i * 0.73}s`}
                      repeatCount="indefinite"
                      path={d}
                      calcMode="spline"
                      keyTimes="0;1"
                      keySplines="0.25 0.1 0.25 1"
                    />
                    <animate
                      attributeName="r"
                      values="3;5;3"
                      dur="2.2s"
                      begin={`${c.delay + i * 0.73}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.1;0.85;1"
                      dur="2.2s"
                      begin={`${c.delay + i * 0.73}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
