'use client';
import React from 'react';
import { Project } from '@/types/activity';

interface PixelRoomProps {
  project: Project;
  isActive: boolean;
  taskName?: string;
}

const ROOM_IMAGE: Record<Project, string> = {
  clawckie: '/rooms/lab.png',
  coach_clawckie: '/rooms/gym.png',
  kince: '/rooms/construction.png',
  tremendous: '/rooms/office.png',
};

// ── Animated characters (CSS pixel art, layered over the image) ──────────

function LabWorker() {
  return (
    <div style={{ position: 'absolute', bottom: '22%', left: '42%', zIndex: 10 }}>
      <style>{`
        @keyframes lab-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes lab-move { 0%,100%{left:42%} 40%{left:54%} 70%{left:38%} }
      `}</style>
      <div style={{ animation: 'lab-bob 0.5s steps(1) infinite', imageRendering: 'pixelated' }}>
        <div style={{ width:14, height:12, background:'#ff9944', border:'2px solid #cc6622', margin:'0 auto', position:'relative' }}>
          <div style={{ position:'absolute', top:2, left:2, width:3, height:3, background:'#4488ff', boxShadow:'5px 0 0 #4488ff' }} />
          <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'#ffffff88', borderBottom:'1px solid #4488ff' }} />
        </div>
        <div style={{ width:16, height:14, background:'#eef', border:'2px solid #ccd', margin:'0 auto', position:'relative' }}>
          <div style={{ position:'absolute', top:2, right:-6, width:5, height:10, background:'#ff9944', border:'1px solid #cc6622' }}>
            <div style={{ position:'absolute', bottom:0, left:0, width:10, height:6, background:'#44ff8844', border:'1px solid #44ff88', borderRadius:'0 0 3px 3px', marginLeft:-2 }} />
          </div>
          <div style={{ position:'absolute', top:3, left:3, width:4, height:8, background:'#4488ff', border:'1px solid #226acc' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:2 }}>
          <div style={{ width:5, height:7, background:'#334' }} />
          <div style={{ width:5, height:7, background:'#334' }} />
        </div>
      </div>
    </div>
  );
}

function GymWorker() {
  return (
    <div style={{ position:'absolute', bottom:'24%', left:'40%', zIndex:10 }}>
      <style>{`
        @keyframes lift { 0%,100%{transform:translateY(0) scaleY(1)} 40%,60%{transform:translateY(-4px) scaleY(0.95)} }
      `}</style>
      <div style={{ animation:'lift 1s ease-in-out infinite', imageRendering:'pixelated' }}>
        <div style={{ width:14, height:12, background:'#ffaa66', border:'2px solid #cc7733', margin:'0 auto', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'#00cc44', borderBottom:'1px solid #009933' }} />
          <div style={{ position:'absolute', top:5, left:2, width:3, height:3, background:'#222', boxShadow:'5px 0 0 #222' }} />
        </div>
        <div style={{ width:16, height:14, background:'#00cc44', border:'2px solid #009933', margin:'0 auto', position:'relative' }}>
          <div style={{ position:'absolute', top:-10, left:-8, right:-8, height:5, background:'#888', border:'2px solid #aaa' }}>
            <div style={{ position:'absolute', left:-5, top:-4, width:5, height:12, background:'#666', border:'1px solid #999' }} />
            <div style={{ position:'absolute', right:-5, top:-4, width:5, height:12, background:'#666', border:'1px solid #999' }} />
          </div>
          <div style={{ position:'absolute', top:-4, left:-6, width:6, height:8, background:'#ffaa66', border:'1px solid #cc7733' }} />
          <div style={{ position:'absolute', top:-4, right:-6, width:6, height:8, background:'#ffaa66', border:'1px solid #cc7733' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:2 }}>
          <div style={{ width:5, height:8, background:'#223' }} />
          <div style={{ width:5, height:8, background:'#223' }} />
        </div>
      </div>
    </div>
  );
}

function ConstructionWorker() {
  return (
    <div style={{ position:'absolute', bottom:'22%', left:'44%', zIndex:10 }}>
      <style>{`
        @keyframes hammer { 0%,100%{transform:rotate(0deg) translateX(0)} 35%,65%{transform:rotate(-50deg) translateX(4px)} }
        @keyframes work-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
      `}</style>
      <div style={{ animation:'work-bob 0.6s steps(1) infinite', imageRendering:'pixelated' }}>
        <div style={{ width:14, height:8, background:'#ffcc00', border:'2px solid #dd9900', margin:'0 auto', borderRadius:'4px 4px 0 0' }} />
        <div style={{ width:13, height:11, background:'#cc8844', border:'2px solid #aa6622', margin:'0 auto', position:'relative' }}>
          <div style={{ position:'absolute', top:3, left:2, width:3, height:3, background:'#222', boxShadow:'5px 0 0 #222' }} />
        </div>
        <div style={{ width:16, height:14, background:'#ff6600', border:'2px solid #cc4400', margin:'0 auto', position:'relative' }}>
          <div style={{ position:'absolute', top:4, left:0, right:0, height:3, background:'#ffff0066' }} />
          <div style={{ position:'absolute', top:1, right:-14, transformOrigin:'top left', animation:'hammer 0.7s ease-in-out infinite' }}>
            <div style={{ width:4, height:12, background:'#cc8844', border:'1px solid #aa6622' }} />
            <div style={{ width:12, height:7, background:'#555', border:'2px solid #777', marginLeft:-4 }} />
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:2 }}>
          <div style={{ width:5, height:8, background:'#334' }} />
          <div style={{ width:5, height:8, background:'#334' }} />
        </div>
      </div>
    </div>
  );
}

function OfficeWorker() {
  return (
    <div style={{ position:'absolute', bottom:'26%', left:'43%', zIndex:10 }}>
      <style>{`
        @keyframes type { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-1px)} }
        @keyframes think { 0%,80%,100%{opacity:1} 85%,95%{opacity:0} }
      `}</style>
      <div style={{ animation:'type 0.25s steps(1) infinite', imageRendering:'pixelated' }}>
        <div style={{ width:13, height:11, background:'#ffbbaa', border:'2px solid #cc8877', margin:'0 auto', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'#3a2010' }} />
          <div style={{ position:'absolute', top:4, left:2, width:3, height:3, background:'#222', boxShadow:'5px 0 0 #222' }} />
          <div style={{ position:'absolute', bottom:1, left:3, right:3, height:1, background:'#cc8877', borderRadius:1 }} />
        </div>
        <div style={{ width:16, height:14, background:'#fff', border:'2px solid #ddd', margin:'0 auto', position:'relative' }}>
          <div style={{ position:'absolute', top:2, left:'50%', transform:'translateX(-50%)', width:3, height:11, background:'#FF1493' }} />
          <div style={{ position:'absolute', top:3, left:-6, width:6, height:5, background:'#ffbbaa', border:'1px solid #cc8877' }} />
          <div style={{ position:'absolute', top:3, right:-6, width:6, height:5, background:'#ffbbaa', border:'1px solid #cc8877' }} />
        </div>
      </div>
    </div>
  );
}

const WORKERS: Record<Project, React.FC> = {
  clawckie: LabWorker,
  coach_clawckie: GymWorker,
  kince: ConstructionWorker,
  tremendous: OfficeWorker,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PixelRoom({ project, isActive, taskName: _taskName }: PixelRoomProps) {
  const Worker = WORKERS[project];
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden' }}>
      {/* Room background image */}
      <img
        src={ROOM_IMAGE[project]}
        alt={project}
        style={{
          position:'absolute', inset:0,
          width:'100%', height:'100%',
          objectFit:'cover',
          objectPosition:'center top',
          imageRendering:'pixelated',
          filter: isActive ? 'brightness(1)' : 'brightness(0.45) saturate(0.4)',
          transition:'filter 0.5s ease',
        }}
      />
      {/* Animated worker when active */}
      {isActive && <Worker />}
      {/* Idle overlay scanline */}
      {!isActive && (
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
          pointerEvents:'none',
        }} />
      )}
    </div>
  );
}
