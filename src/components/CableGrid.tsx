'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const PROJECT_COLORS: Record<string, string> = {
  clawckie:       '#FF6B00',
  coach_clawckie: '#00CC44',
  kince:          '#4963f5',
  tremendous:     '#FF1493',
};

// Each room connects to the nearest face of the HQ.
// roomFace: which edge of the room the cable exits from ('right'|'left'|'bottom'|'top')
// hqFace:   which edge of HQ the cable enters  ('left'|'right'|'top'|'bottom')
// Route: exit room face → travel to HQ face midpoint, L-shaped (H then V or V then H)
const CABLE_CONFIG = [
  { roomId: 'room-clawckie',   project: 'clawckie',       roomFace: 'right',  hqFace: 'top',    delay: 0   },
  { roomId: 'room-coach',      project: 'coach_clawckie', roomFace: 'left',   hqFace: 'top',    delay: 0.6 },
  { roomId: 'room-kince',      project: 'kince',          roomFace: 'right',  hqFace: 'bottom', delay: 1.2 },
  { roomId: 'room-tremendous', project: 'tremendous',     roomFace: 'left',   hqFace: 'bottom', delay: 1.8 },
];

interface Pt { x: number; y: number }
interface CableData {
  project: string;
  color: string;
  pathD: string;
  bend: Pt;
  start: Pt;
  end: Pt;
  delay: number;
}

function faceMidpoint(rect: DOMRect, face: string, ref: DOMRect): Pt {
  const l = rect.left - ref.left;
  const r = rect.right - ref.left;
  const t = rect.top - ref.top;
  const b = rect.bottom - ref.top;
  const mx = (l + r) / 2;
  const my = (t + b) / 2;
  switch (face) {
    case 'right':  return { x: r,  y: my };
    case 'left':   return { x: l,  y: my };
    case 'top':    return { x: mx, y: t  };
    case 'bottom': return { x: mx, y: b  };
    default:       return { x: mx, y: my };
  }
}

// Build an L-shaped path: horizontal first, then vertical
function lPath(start: Pt, end: Pt): { pathD: string; bend: Pt } {
  const bend: Pt = { x: end.x, y: start.y };
  return { pathD: `M ${start.x} ${start.y} H ${end.x} V ${end.y}`, bend };
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

    const result: CableData[] = [];
    for (const cfg of CABLE_CONFIG) {
      const roomEl = document.getElementById(cfg.roomId);
      if (!roomEl) continue;
      const rr = roomEl.getBoundingClientRect();

      const start = faceMidpoint(rr, cfg.roomFace, sr);
      const end   = faceMidpoint(hr, cfg.hqFace, sr);
      const { pathD, bend } = lPath(start, end);

      result.push({ project: cfg.project, color: PROJECT_COLORS[cfg.project], pathD, bend, start, end, delay: cfg.delay });
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
              <filter key={`gf-${c.project}`} id={`gf-${c.project}`} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
          </defs>

          {cables.map(c => {
            const active = activeProjects.includes(c.project);
            return (
              <g key={c.project}>
                {/* Dark gutter underneath */}
                <path d={c.pathD} stroke="#000" strokeWidth="10" fill="none" strokeLinecap="square" opacity="0.85" />

                {/* Main colored cable */}
                <path
                  d={c.pathD} stroke={c.color} strokeWidth="4" fill="none" strokeLinecap="square"
                  opacity={active ? 1 : 0.7}
                  filter={`url(#gf-${c.project})`}
                  style={{ transition: 'opacity 0.8s ease' }}
                />

                {/* Bright inner highlight */}
                <path
                  d={c.pathD} stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="square"
                  opacity={active ? 0.6 : 0.35}
                  style={{ transition: 'opacity 0.8s ease' }}
                />

                {/* Circuit dash marks */}
                <path
                  d={c.pathD} stroke={c.color} strokeWidth="4" strokeDasharray="5 14" fill="none" strokeLinecap="square"
                  opacity={active ? 0.25 : 0.15}
                  style={{ transition: 'opacity 0.8s ease' }}
                />

                {/* Bend dot */}
                <circle cx={c.bend.x} cy={c.bend.y} r="6" fill={c.color} opacity={active ? 1 : 0.7} filter={`url(#gf-${c.project})`} />
                <circle cx={c.bend.x} cy={c.bend.y} r="3" fill="#fff" opacity={active ? 0.8 : 0.4} />

                {/* End dots */}
                <circle cx={c.start.x} cy={c.start.y} r="4" fill={c.color} opacity={active ? 0.9 : 0.6} />
                <circle cx={c.end.x}   cy={c.end.y}   r="4" fill={c.color} opacity={active ? 0.9 : 0.6} />

                {/* Pulse dots when active */}
                {active && [0, 1].map(i => (
                  <g key={i}>
                    <circle r="5" fill={c.color}>
                      <animateMotion dur="3s" begin={`${c.delay + i * 1.5}s`} repeatCount="indefinite" path={c.pathD} calcMode="linear" />
                      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.88;1" dur="3s" begin={`${c.delay + i * 1.5}s`} repeatCount="indefinite" />
                      <animate attributeName="r" values="3;5;3" dur="3s" begin={`${c.delay + i * 1.5}s`} repeatCount="indefinite" />
                    </circle>
                    <circle r="2" fill="#fff">
                      <animateMotion dur="3s" begin={`${c.delay + i * 1.5}s`} repeatCount="indefinite" path={c.pathD} calcMode="linear" />
                      <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.08;0.88;1" dur="3s" begin={`${c.delay + i * 1.5}s`} repeatCount="indefinite" />
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
