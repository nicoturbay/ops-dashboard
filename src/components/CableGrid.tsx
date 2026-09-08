'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const PROJECT_COLORS: Record<string, string> = {
  clawckie:       '#FF6B00',
  coach_clawckie: '#00CC44',
  kince:          '#4963f5',
  tremendous:     '#FF1493',
};

// Irregular bezier cables — each has unique control point offsets so they
// curve differently and feel organic. All converge at HQ center.
// cp1/cp2 are fractions of the (end→start) vector, offset perpendicularly.
const CABLE_CONFIG = [
  { roomId: 'room-clawckie',   project: 'clawckie',       roomCorner: 'br', delay: 0,   cp1: { t: 0.25, n:  0.30 }, cp2: { t: 0.65, n: -0.15 } },
  { roomId: 'room-coach',      project: 'coach_clawckie', roomCorner: 'bl', delay: 0.6, cp1: { t: 0.20, n: -0.25 }, cp2: { t: 0.70, n:  0.20 } },
  { roomId: 'room-kince',      project: 'kince',          roomCorner: 'tr', delay: 1.2, cp1: { t: 0.30, n:  0.20 }, cp2: { t: 0.60, n: -0.30 } },
  { roomId: 'room-tremendous', project: 'tremendous',     roomCorner: 'tl', delay: 1.8, cp1: { t: 0.22, n: -0.18 }, cp2: { t: 0.72, n:  0.28 } },
];

interface Pt { x: number; y: number }
interface CableData {
  project: string;
  color: string;
  pathD: string;
  start: Pt;
  end: Pt;
  delay: number;
}

function cornerPt(rect: DOMRect, corner: string, ref: DOMRect): Pt {
  const l = rect.left - ref.left;
  const r = rect.right - ref.left;
  const t = rect.top - ref.top;
  const b = rect.bottom - ref.top;
  return {
    x: corner.endsWith('l') ? l : r,
    y: corner.startsWith('t') ? t : b,
  };
}

function centerPt(rect: DOMRect, ref: DOMRect): Pt {
  return {
    x: (rect.left + rect.right) / 2 - ref.left,
    y: (rect.top  + rect.bottom) / 2 - ref.top,
  };
}

// Build a cubic bezier path from start → end with control points defined
// as fractions along the path (t) + perpendicular offset (n).
function bezierPath(
  start: Pt, end: Pt,
  cp1: { t: number; n: number },
  cp2: { t: number; n: number }
): string {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  // Perpendicular unit vector
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny =  dx / len;
  const c1: Pt = {
    x: start.x + dx * cp1.t + nx * len * cp1.n,
    y: start.y + dy * cp1.t + ny * len * cp1.n,
  };
  const c2: Pt = {
    x: start.x + dx * cp2.t + nx * len * cp2.n,
    y: start.y + dy * cp2.t + ny * len * cp2.n,
  };
  return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
}

export default function CableGrid({ activeProjects }: { activeProjects: string[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cables, setCables] = useState<CableData[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const stage = document.getElementById('dungeon-stage');
    const hqEl  = document.getElementById('central-hq');
    if (!stage || !hqEl) return;

    const sr = stage.getBoundingClientRect();
    const hr = hqEl.getBoundingClientRect();
    setSvgSize({ w: sr.width, h: sr.height });

    const hqCenter = centerPt(hr, sr);

    const result: CableData[] = [];
    for (const cfg of CABLE_CONFIG) {
      const roomEl = document.getElementById(cfg.roomId);
      if (!roomEl) continue;
      const rr = roomEl.getBoundingClientRect();

      // Cable: room corner → HQ center, with unique bezier curve per cable
      const start = cornerPt(rr, cfg.roomCorner, sr);
      const end   = hqCenter;
      const pathD = bezierPath(start, end, cfg.cp1, cfg.cp2);

      result.push({
        project: cfg.project,
        color: PROJECT_COLORS[cfg.project],
        pathD, start, end,
        delay: cfg.delay,
      });
    }
    setCables(result);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(measure, 150);
    const t2 = setTimeout(measure, 600);
    const t3 = setTimeout(measure, 1500);

    const hqImg = document.querySelector('#central-hq img') as HTMLImageElement | null;
    const onLoad = () => setTimeout(measure, 50);
    if (hqImg && !hqImg.complete) hqImg.addEventListener('load', onLoad);
    window.addEventListener('load', measure);

    const ro = new ResizeObserver(measure);
    const stage = document.getElementById('dungeon-stage');
    if (stage) ro.observe(stage);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      ro.disconnect();
      window.removeEventListener('load', measure);
      if (hqImg) hqImg.removeEventListener('load', onLoad);
    };
  }, [measure]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5, overflow: 'visible' }}>
      {svgSize.w > 0 && (
        <svg
          ref={svgRef}
          width={svgSize.w}
          height={svgSize.h}
          style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        >
          <defs>
            {cables.map(c => (
              <filter key={`gf-${c.project}`} id={`gf-${c.project}`} x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
          </defs>

          {cables.map(c => {
            const active = activeProjects.includes(c.project);
            return (
              <g key={c.project}>
                {/* Dark gutter */}
                <path d={c.pathD} stroke="#000" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.6" />
                {/* Main cable with strong glow */}
                <path d={c.pathD} stroke={c.color} strokeWidth="8" fill="none" strokeLinecap="round"
                  opacity={active ? 1 : 0.75} filter={`url(#gf-${c.project})`}
                  style={{ transition: 'opacity 0.8s ease' }} />
                {/* Bright inner core */}
                <path d={c.pathD} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"
                  opacity={active ? 0.7 : 0.4} style={{ transition: 'opacity 0.8s ease' }} />
                {/* Room endpoint dot */}
                <circle cx={c.start.x} cy={c.start.y} r="10" fill={c.color} opacity={active ? 1 : 0.75} filter={`url(#gf-${c.project})`} />
                <circle cx={c.start.x} cy={c.start.y} r="5"  fill="#fff"    opacity={active ? 0.9 : 0.5} />

                {active && [0, 1].map(i => (
                  <g key={i}>
                    <circle r="10" fill={c.color} filter={`url(#gf-${c.project})`}>
                      <animateMotion dur="3s" begin={`${c.delay + i * 1.5}s`} repeatCount="indefinite" path={c.pathD} calcMode="linear" />
                      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.88;1" dur="3s" begin={`${c.delay + i * 1.5}s`} repeatCount="indefinite" />
                      <animate attributeName="r" values="7;11;7" dur="3s" begin={`${c.delay + i * 1.5}s`} repeatCount="indefinite" />
                    </circle>
                    <circle r="4" fill="#fff">
                      <animateMotion dur="3s" begin={`${c.delay + i * 1.5}s`} repeatCount="indefinite" path={c.pathD} calcMode="linear" />
                      <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.08;0.88;1" dur="3s" begin={`${c.delay + i * 1.5}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
