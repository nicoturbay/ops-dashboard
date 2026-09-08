'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const PROJECT_COLORS: Record<string, string> = {
  clawckie:       '#FF6B00',
  coach_clawckie: '#00CC44',
  kince:          '#B388FF',
  tremendous:     '#FF1493',
};

// Which corner of the room connects to which corner of the HQ
// innerCorner: 'br' | 'bl' | 'tr' | 'tl' (of the room)
// hqCorner: 'tl' | 'tr' | 'bl' | 'br' (of the HQ)
// horizontalFirst: true = go H then V; false = go V then H
const CABLE_CONFIG = [
  { roomId: 'room-clawckie',   project: 'clawckie',       roomCorner: 'br', hqCorner: 'tl', delay: 0    },
  { roomId: 'room-coach',      project: 'coach_clawckie', roomCorner: 'bl', hqCorner: 'tr', delay: 0.6  },
  { roomId: 'room-kince',      project: 'kince',           roomCorner: 'tr', hqCorner: 'bl', delay: 1.2  },
  { roomId: 'room-tremendous', project: 'tremendous',      roomCorner: 'tl', hqCorner: 'br', delay: 1.8  },
];

interface CablePoint { x: number; y: number }
interface CableData {
  project: string;
  color: string;
  start: CablePoint;
  bend: CablePoint;
  end: CablePoint;
  delay: number;
  pathD: string;
}

function getCornerPoint(rect: DOMRect, corner: string, containerRect: DOMRect): CablePoint {
  const x = corner.endsWith('l') ? rect.left - containerRect.left : rect.right - containerRect.left;
  const y = corner.startsWith('t') ? rect.top - containerRect.top : rect.bottom - containerRect.top;
  return { x, y };
}

function buildLPath(start: CablePoint, end: CablePoint): { bend: CablePoint; pathD: string } {
  // Go horizontal first (same Y as start), then vertical to end
  // This matches the circuit-trace look: H then V
  const bend: CablePoint = { x: end.x, y: start.y };
  const pathD = `M ${start.x} ${start.y} H ${end.x} V ${end.y}`;
  return { bend, pathD };
}

export default function CableGrid({ activeProjects }: { activeProjects: string[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cables, setCables] = useState<CableData[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const stage = document.getElementById('dungeon-stage');
    const hqEl = document.getElementById('central-hq');
    if (!stage || !hqEl) return;

    const stageRect = stage.getBoundingClientRect();
    const hqRect = hqEl.getBoundingClientRect();
    setSvgSize({ w: stageRect.width, h: stageRect.height });

    const computed: CableData[] = [];
    for (const cfg of CABLE_CONFIG) {
      const roomEl = document.getElementById(cfg.roomId);
      if (!roomEl) continue;
      const roomRect = roomEl.getBoundingClientRect();

      const start = getCornerPoint(roomRect, cfg.roomCorner, stageRect);
      const end   = getCornerPoint(hqRect,   cfg.hqCorner,   stageRect);
      const { bend, pathD } = buildLPath(start, end);

      computed.push({
        project: cfg.project,
        color: PROJECT_COLORS[cfg.project],
        start, bend, end,
        delay: cfg.delay,
        pathD,
      });
    }
    setCables(computed);
  }, []);

  useEffect(() => {
    // Measure after first paint and on resize
    const timer = setTimeout(measure, 100);
    const ro = new ResizeObserver(measure);
    const stage = document.getElementById('dungeon-stage');
    if (stage) ro.observe(stage);
    return () => { clearTimeout(timer); ro.disconnect(); };
  }, [measure]);

  if (!svgSize.w || !svgSize.h) return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} />
  );

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      <svg
        ref={svgRef}
        width={svgSize.w}
        height={svgSize.h}
        style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
      >
        <defs>
          {cables.map(c => (
            <filter key={`gf-${c.project}`} id={`gf-${c.project}`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {cables.map(c => {
          const isActive = activeProjects.includes(c.project);
          return (
            <g key={c.project}>
              {/* Shadow gutter */}
              <path d={c.pathD} stroke="#000" strokeWidth="7" fill="none" strokeLinecap="square" opacity="0.8" />

              {/* Main glowing cable */}
              <path
                d={c.pathD}
                stroke={c.color}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="square"
                opacity={isActive ? 1 : 0.18}
                filter={isActive ? `url(#gf-${c.project})` : undefined}
                style={{ transition: 'opacity 0.8s ease' }}
              />

              {/* Bright inner core */}
              <path
                d={c.pathD}
                stroke="#ffffff"
                strokeWidth="0.6"
                fill="none"
                strokeLinecap="square"
                opacity={isActive ? 0.5 : 0.05}
                style={{ transition: 'opacity 0.8s ease' }}
              />

              {/* Segment marks — circuit board style */}
              <path
                d={c.pathD}
                stroke={c.color}
                strokeWidth="2.5"
                strokeDasharray="4 12"
                fill="none"
                strokeLinecap="square"
                opacity={isActive ? 0.2 : 0.04}
                style={{ transition: 'opacity 0.8s ease' }}
              />

              {/* Corner dot — where the bend is */}
              <circle
                cx={c.bend.x}
                cy={c.bend.y}
                r="4"
                fill={c.color}
                opacity={isActive ? 0.9 : 0.15}
                filter={isActive ? `url(#gf-${c.project})` : undefined}
                style={{ transition: 'opacity 0.8s ease' }}
              />
              <circle
                cx={c.bend.x}
                cy={c.bend.y}
                r="2"
                fill="#fff"
                opacity={isActive ? 0.6 : 0.05}
                style={{ transition: 'opacity 0.8s ease' }}
              />

              {/* Endpoint dots */}
              <circle cx={c.start.x} cy={c.start.y} r="3.5" fill={c.color} opacity={isActive ? 0.7 : 0.1} style={{ transition: 'opacity 0.8s ease' }} />
              <circle cx={c.end.x}   cy={c.end.y}   r="3.5" fill={c.color} opacity={isActive ? 0.7 : 0.1} style={{ transition: 'opacity 0.8s ease' }} />

              {/* Animated pulse dots — 2 per cable, slow and clean */}
              {isActive && [0, 1].map(i => (
                <g key={i}>
                  <circle r="5" fill={c.color} opacity="0.0">
                    <animateMotion
                      dur="3.5s"
                      begin={`${c.delay + i * 1.75}s`}
                      repeatCount="indefinite"
                      path={c.pathD}
                      calcMode="linear"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.9;0.9;0"
                      keyTimes="0;0.08;0.88;1"
                      dur="3.5s"
                      begin={`${c.delay + i * 1.75}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="r"
                      values="3;5;3"
                      dur="3.5s"
                      begin={`${c.delay + i * 1.75}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Inner white core of pulse */}
                  <circle r="2" fill="#fff" opacity="0.0">
                    <animateMotion
                      dur="3.5s"
                      begin={`${c.delay + i * 1.75}s`}
                      repeatCount="indefinite"
                      path={c.pathD}
                      calcMode="linear"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.8;0.8;0"
                      keyTimes="0;0.08;0.88;1"
                      dur="3.5s"
                      begin={`${c.delay + i * 1.75}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
