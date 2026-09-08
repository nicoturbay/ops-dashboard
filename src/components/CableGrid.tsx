'use client';

interface CableGridProps {
  activeProjects: string[];
}

// Each cable goes from center to one corner
// We use viewBox="0 0 100 100" with percentage-based coordinates
// Rooms are at the 4 corners. HQ is at center.
// Cable routes: use a bezier curve from center (50,50) to each corner room center

const CABLES = [
  {
    id: 'tl',
    // top-left room center ≈ (14, 20) in 100-unit space
    d: 'M 50 50 C 38 45, 26 35, 15 20',
    color: '#FF6B00',
    delay: '0s',
  },
  {
    id: 'tr',
    // top-right room center ≈ (86, 20)
    d: 'M 50 50 C 62 45, 74 35, 85 20',
    color: '#00CC44',
    delay: '0.5s',
  },
  {
    id: 'bl',
    // bottom-left room center ≈ (14, 80)
    d: 'M 50 50 C 38 55, 26 65, 15 80',
    color: '#B388FF',
    delay: '1s',
  },
  {
    id: 'br',
    // bottom-right room center ≈ (86, 80)
    d: 'M 50 50 C 62 55, 74 65, 85 80',
    color: '#FF1493',
    delay: '1.5s',
  },
];

export default function CableGrid({ activeProjects }: CableGridProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        overflow: 'visible',
      }}
    >
      <defs>
        {CABLES.map(cable => (
          <filter key={`glow-${cable.id}`} id={`glow-${cable.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>

      {CABLES.map(cable => {
        const isActive = activeProjects.length > 0;
        return (
          <g key={cable.id}>
            {/* Base cable — dark gutter */}
            <path
              d={cable.d}
              stroke="#111"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Glowing cable */}
            <path
              d={cable.d}
              stroke={cable.color}
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              opacity={isActive ? 0.9 : 0.25}
              filter={`url(#glow-${cable.id})`}
              style={{ transition: 'opacity 0.5s ease' }}
            />
            {/* Tube ridges — dashed overlay for pipe look */}
            <path
              d={cable.d}
              stroke={cable.color}
              strokeWidth="1.0"
              strokeDasharray="1.5 2"
              fill="none"
              opacity={isActive ? 0.3 : 0.08}
              style={{ transition: 'opacity 0.5s ease' }}
            />

            {/* Pulse dots — 3 per cable, staggered */}
            {isActive && [0, 1, 2].map(i => (
              <circle key={i} r="0.9" fill={cable.color} opacity="0.95"
                style={{ filter: `drop-shadow(0 0 1px ${cable.color})` }}
              >
                <animateMotion
                  dur="1.8s"
                  begin={`${parseFloat(cable.delay) + i * 0.6}s`}
                  repeatCount="indefinite"
                  path={cable.d}
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.4 0 0.6 1"
                />
              </circle>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
