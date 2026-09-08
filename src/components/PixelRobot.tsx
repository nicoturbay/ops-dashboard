'use client';
import { Project } from '@/types/activity';

// ── Lab Robot (Clawckie) — scientist with lab coat and glowing visor ──────
function LabRobot() {
  return (
    <div style={{ position:'absolute', bottom:'18%', left:'38%', zIndex:20 }}>
      <style>{`
        @keyframes lab-robot-move {
          0%,100%{left:38%} 40%{left:52%} 70%{left:34%}
        }
        @keyframes lab-arm {
          0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-25deg)}
        }
        @keyframes visor-glow {
          0%,100%{box-shadow:0 0 4px #4488ff,0 0 8px #4488ff} 50%{box-shadow:0 0 8px #66aaff,0 0 16px #4488ff}
        }
        @keyframes robot-bob {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)}
        }
      `}</style>
      <div style={{ animation:'robot-bob 1s ease-in-out infinite', imageRendering:'pixelated' }}>
        {/* Antenna */}
        <div style={{ width:2,height:6,background:'#ff6600',margin:'0 auto',boxShadow:'0 0 4px #ff6600' }}>
          <div style={{ width:6,height:6,background:'#ff4400',borderRadius:'50%',marginLeft:-2,marginTop:-3,boxShadow:'0 0 6px #ff6600' }} />
        </div>
        {/* Head */}
        <div style={{ width:22,height:18,background:'#cc2200',border:'2px solid #ff4400',margin:'0 auto',position:'relative',borderRadius:2 }}>
          {/* Visor */}
          <div style={{ position:'absolute',top:3,left:2,right:2,height:8,background:'#001a33',border:'1px solid #4488ff',borderRadius:1,animation:'visor-glow 2s ease-in-out infinite' }}>
            <div style={{ display:'flex',gap:2,padding:'2px 3px' }}>
              <div style={{ width:5,height:5,background:'#4488ff',borderRadius:'50%',boxShadow:'0 0 4px #4488ff' }} />
              <div style={{ flex:1,height:5,background:'linear-gradient(90deg,#003366,#0066cc)',display:'flex',alignItems:'center',padding:'0 2px' }}>
                <div style={{ height:1,background:'#4488ff',width:'100%',opacity:0.7 }} />
              </div>
              <div style={{ width:5,height:5,background:'#4488ff',borderRadius:'50%',boxShadow:'0 0 4px #4488ff' }} />
            </div>
          </div>
          {/* Speaker grille */}
          <div style={{ position:'absolute',bottom:2,left:3,right:3,height:3,display:'flex',gap:1 }}>
            {[0,1,2,3,4].map(i=><div key={i} style={{ flex:1,height:'100%',background:'#ff4400',opacity:0.6 }} />)}
          </div>
        </div>
        {/* Neck */}
        <div style={{ width:8,height:4,background:'#aa1a00',margin:'0 auto',border:'1px solid #cc2200' }} />
        {/* Torso — lab coat */}
        <div style={{ width:26,height:20,background:'#eef',border:'2px solid #ccd',margin:'0 auto',position:'relative',borderRadius:2 }}>
          {/* Lab coat lapels */}
          <div style={{ position:'absolute',top:0,left:4,width:4,height:12,background:'#ff2200',borderRadius:'0 0 2px 2px' }} />
          <div style={{ position:'absolute',top:0,right:4,width:4,height:12,background:'#ff2200',borderRadius:'0 0 2px 2px' }} />
          {/* Chest panel */}
          <div style={{ position:'absolute',top:4,left:'50%',transform:'translateX(-50%)',width:8,height:8,background:'#1a1a2e',border:'1px solid #4488ff',display:'flex',flexDirection:'column',gap:1,padding:1 }}>
            <div style={{ height:1,background:'#ff6600' }} />
            <div style={{ height:1,background:'#00ff88' }} />
            <div style={{ height:1,background:'#4488ff' }} />
          </div>
          {/* Left arm — holding flask */}
          <div style={{ position:'absolute',top:2,left:-10,animation:'lab-arm 1.5s ease-in-out infinite',transformOrigin:'top right' }}>
            <div style={{ width:8,height:14,background:'#cc2200',border:'1px solid #ff4400',borderRadius:2 }}>
              {/* Flask */}
              <div style={{ position:'absolute',bottom:-8,left:0,width:8,height:10,background:'#44ff8855',border:'1px solid #44ff88',borderRadius:'0 0 4px 4px',boxShadow:'0 0 6px #44ff88' }} />
            </div>
          </div>
          {/* Right arm */}
          <div style={{ position:'absolute',top:2,right:-8,width:8,height:14,background:'#cc2200',border:'1px solid #ff4400',borderRadius:2 }} />
          {/* Pocket */}
          <div style={{ position:'absolute',top:6,right:3,width:4,height:6,border:'1px solid #aab' }}>
            <div style={{ width:1,height:3,background:'#ff6600',margin:'1px auto' }} />
          </div>
        </div>
        {/* Hips */}
        <div style={{ width:20,height:5,background:'#aa1a00',margin:'0 auto',border:'1px solid #cc2200',borderRadius:'0 0 2px 2px' }} />
        {/* Legs */}
        <div style={{ display:'flex',justifyContent:'center',gap:3 }}>
          <div style={{ width:8,height:12,background:'#cc2200',border:'1px solid #ff4400',borderRadius:'0 0 2px 2px' }}>
            <div style={{ width:'100%',height:3,background:'#ff4400',borderBottom:'1px solid #ff6600' }} />
          </div>
          <div style={{ width:8,height:12,background:'#cc2200',border:'1px solid #ff4400',borderRadius:'0 0 2px 2px' }}>
            <div style={{ width:'100%',height:3,background:'#ff4400',borderBottom:'1px solid #ff6600' }} />
          </div>
        </div>
        {/* Feet */}
        <div style={{ display:'flex',justifyContent:'center',gap:1 }}>
          <div style={{ width:10,height:5,background:'#881100',border:'1px solid #aa2200',borderRadius:'0 0 3px 3px' }} />
          <div style={{ width:10,height:5,background:'#881100',border:'1px solid #aa2200',borderRadius:'0 0 3px 3px' }} />
        </div>
      </div>
    </div>
  );
}

// ── Gym Robot (Coach) — green athletic robot with barbell ─────────────────
function GymRobot() {
  return (
    <div style={{ position:'absolute', bottom:'20%', left:'36%', zIndex:20 }}>
      <style>{`
        @keyframes gym-lift {
          0%,100%{transform:translateY(0) scaleY(1)} 40%,60%{transform:translateY(-5px) scaleY(0.94)}
        }
        @keyframes eye-pulse {
          0%,100%{box-shadow:0 0 4px #00ff88} 50%{box-shadow:0 0 10px #00ff88,0 0 20px #00cc44}
        }
      `}</style>
      <div style={{ animation:'gym-lift 1.1s ease-in-out infinite', imageRendering:'pixelated' }}>
        {/* Headband */}
        <div style={{ width:24,height:4,background:'#00cc44',margin:'0 auto',border:'2px solid #009933',borderBottom:'none' }} />
        {/* Head */}
        <div style={{ width:22,height:18,background:'#1a2a1a',border:'2px solid #00cc44',margin:'0 auto',position:'relative',borderRadius:2 }}>
          {/* Eyes */}
          <div style={{ position:'absolute',top:4,left:3,width:6,height:6,background:'#00ff88',borderRadius:1,animation:'eye-pulse 1.5s ease-in-out infinite' }} />
          <div style={{ position:'absolute',top:4,right:3,width:6,height:6,background:'#00ff88',borderRadius:1,animation:'eye-pulse 1.5s ease-in-out infinite' }} />
          {/* Nose sensor */}
          <div style={{ position:'absolute',top:8,left:'50%',transform:'translateX(-50%)',width:4,height:3,background:'#333',border:'1px solid #00cc44' }} />
          {/* Mouth grille */}
          <div style={{ position:'absolute',bottom:2,left:3,right:3,height:3,display:'flex',gap:1 }}>
            {[0,1,2,3].map(i=><div key={i} style={{ flex:1,height:'100%',background:'#00cc44',opacity:0.5 }} />)}
          </div>
        </div>
        {/* Neck */}
        <div style={{ width:10,height:4,background:'#0a1a0a',margin:'0 auto',border:'1px solid #00cc44' }} />
        {/* Torso — athletic, wider */}
        <div style={{ width:30,height:22,background:'#00cc44',border:'2px solid #009933',margin:'0 auto',position:'relative',borderRadius:2 }}>
          {/* Chest emblem */}
          <div style={{ position:'absolute',top:3,left:'50%',transform:'translateX(-50%)',width:12,height:12,background:'#1a1a1a',border:'2px solid #00ff88',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={{ color:'#00ff88',fontSize:7,fontFamily:'monospace',fontWeight:'bold' }}>C</span>
          </div>
          {/* Barbell — held overhead, outside the torso */}
          <div style={{ position:'absolute',top:-18,left:'50%',transform:'translateX(-50%)',width:48,height:6,background:'#555',border:'2px solid #888',borderRadius:1 }}>
            {/* Left weight */}
            <div style={{ position:'absolute',left:-8,top:-6,width:8,height:18,background:'#444',border:'2px solid #666',borderRadius:1 }} />
            <div style={{ position:'absolute',left:-13,top:-3,width:5,height:12,background:'#333',border:'1px solid #555',borderRadius:1 }} />
            {/* Right weight */}
            <div style={{ position:'absolute',right:-8,top:-6,width:8,height:18,background:'#444',border:'2px solid #666',borderRadius:1 }} />
            <div style={{ position:'absolute',right:-13,top:-3,width:5,height:12,background:'#333',border:'1px solid #555',borderRadius:1 }} />
          </div>
          {/* Arms up */}
          <div style={{ position:'absolute',top:-8,left:-10,width:10,height:16,background:'#009933',border:'1px solid #00cc44',borderRadius:2 }} />
          <div style={{ position:'absolute',top:-8,right:-10,width:10,height:16,background:'#009933',border:'1px solid #00cc44',borderRadius:2 }} />
        </div>
        {/* Hips */}
        <div style={{ width:22,height:5,background:'#007722',margin:'0 auto',border:'1px solid #009933' }} />
        {/* Legs */}
        <div style={{ display:'flex',justifyContent:'center',gap:3 }}>
          <div style={{ width:9,height:13,background:'#1a2a1a',border:'2px solid #00cc44',borderRadius:'0 0 2px 2px' }} />
          <div style={{ width:9,height:13,background:'#1a2a1a',border:'2px solid #00cc44',borderRadius:'0 0 2px 2px' }} />
        </div>
        {/* Feet */}
        <div style={{ display:'flex',justifyContent:'center',gap:1 }}>
          <div style={{ width:11,height:5,background:'#0a1a0a',border:'1px solid #00cc44',borderRadius:'0 0 3px 3px' }} />
          <div style={{ width:11,height:5,background:'#0a1a0a',border:'1px solid #00cc44',borderRadius:'0 0 3px 3px' }} />
        </div>
      </div>
    </div>
  );
}

// ── Construction Robot (Kince) — heavy-duty yellow/orange builder ──────────
function ConstructionRobot() {
  return (
    <div style={{ position:'absolute', bottom:'16%', left:'40%', zIndex:20 }}>
      <style>{`
        @keyframes hammer-arm {
          0%,100%{transform:rotate(0deg)} 35%,65%{transform:rotate(-55deg) translateY(-4px)}
        }
        @keyframes construct-bob {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)}
        }
        @keyframes hard-hat-light {
          0%,100%{opacity:1} 50%{opacity:0.4}
        }
      `}</style>
      <div style={{ animation:'construct-bob 0.7s steps(1) infinite', imageRendering:'pixelated' }}>
        {/* Hard hat */}
        <div style={{ width:28,height:8,background:'#ffcc00',border:'2px solid #dd9900',margin:'0 auto',borderRadius:'6px 6px 0 0',position:'relative' }}>
          <div style={{ position:'absolute',top:1,left:'50%',transform:'translateX(-50%)',width:6,height:6,background:'#ff4400',borderRadius:'50%',animation:'hard-hat-light 0.8s ease-in-out infinite',boxShadow:'0 0 4px #ff4400' }} />
        </div>
        {/* Head */}
        <div style={{ width:24,height:18,background:'#cc6600',border:'2px solid #ff8800',margin:'0 auto',position:'relative',borderRadius:2 }}>
          {/* Visor slit */}
          <div style={{ position:'absolute',top:3,left:2,right:2,height:6,background:'#1a0a00',border:'1px solid #ff8800',borderRadius:1,display:'flex',alignItems:'center',padding:'0 2px',gap:1 }}>
            <div style={{ width:6,height:3,background:'#ff6600',borderRadius:1,boxShadow:'0 0 4px #ff6600' }} />
            <div style={{ flex:1,height:2,background:'#331100' }} />
            <div style={{ width:6,height:3,background:'#ff6600',borderRadius:1,boxShadow:'0 0 4px #ff6600' }} />
          </div>
          {/* Vents */}
          <div style={{ position:'absolute',bottom:2,left:2,right:2,display:'flex',gap:1 }}>
            {[0,1,2,3,4,5].map(i=><div key={i} style={{ flex:1,height:3,background:'#aa4400',borderRadius:1 }} />)}
          </div>
        </div>
        {/* Neck — thick */}
        <div style={{ width:14,height:5,background:'#aa5500',margin:'0 auto',border:'2px solid #cc6600' }} />
        {/* Torso — heavy armor */}
        <div style={{ width:32,height:24,background:'#ff6600',border:'2px solid #cc4400',margin:'0 auto',position:'relative',borderRadius:2 }}>
          {/* Reflective stripes */}
          <div style={{ position:'absolute',top:5,left:0,right:0,height:3,background:'#ffff0066' }} />
          <div style={{ position:'absolute',top:12,left:0,right:0,height:3,background:'#ffff0066' }} />
          {/* Chest panel */}
          <div style={{ position:'absolute',top:4,left:'50%',transform:'translateX(-50%)',width:10,height:10,background:'#1a0a00',border:'1px solid #ff8800' }}>
            <div style={{ margin:1,height:2,background:'#ff4400' }} />
            <div style={{ margin:'1px 1px',height:2,background:'#ffcc00' }} />
            <div style={{ margin:'1px 1px',height:2,background:'#00ff88' }} />
          </div>
          {/* Left arm — hammer arm */}
          <div style={{ position:'absolute',top:2,left:-12,transformOrigin:'top right',animation:'hammer-arm 0.7s ease-in-out infinite' }}>
            <div style={{ width:11,height:16,background:'#cc4400',border:'2px solid #ff6600',borderRadius:2,position:'relative' }}>
              {/* Hammer head */}
              <div style={{ position:'absolute',bottom:-10,left:-4,width:18,height:10,background:'#555',border:'2px solid #888',borderRadius:1 }} />
            </div>
          </div>
          {/* Right arm */}
          <div style={{ position:'absolute',top:2,right:-10,width:10,height:16,background:'#cc4400',border:'2px solid #ff6600',borderRadius:2 }} />
        </div>
        {/* Hips */}
        <div style={{ width:24,height:6,background:'#aa3300',margin:'0 auto',border:'2px solid #cc4400' }} />
        {/* Legs — sturdy */}
        <div style={{ display:'flex',justifyContent:'center',gap:3 }}>
          <div style={{ width:10,height:14,background:'#331100',border:'2px solid #cc4400',borderRadius:'0 0 2px 2px' }}>
            <div style={{ height:4,background:'#cc4400',borderBottom:'1px solid #ff6600' }} />
          </div>
          <div style={{ width:10,height:14,background:'#331100',border:'2px solid #cc4400',borderRadius:'0 0 2px 2px' }}>
            <div style={{ height:4,background:'#cc4400',borderBottom:'1px solid #ff6600' }} />
          </div>
        </div>
        {/* Feet — big boots */}
        <div style={{ display:'flex',justifyContent:'center',gap:1 }}>
          <div style={{ width:13,height:6,background:'#220a00',border:'1px solid #cc4400',borderRadius:'0 0 3px 3px' }} />
          <div style={{ width:13,height:6,background:'#220a00',border:'1px solid #cc4400',borderRadius:'0 0 3px 3px' }} />
        </div>
      </div>
    </div>
  );
}

// ── Office Robot (Tremendous) — sleek pink executive robot ─────────────────
function OfficeRobot() {
  return (
    <div style={{ position:'absolute', bottom:'22%', left:'40%', zIndex:20 }}>
      <style>{`
        @keyframes office-type { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-1px) rotate(-2deg)} 75%{transform:translateY(1px) rotate(2deg)} }
        @keyframes screen-flicker { 0%,100%{opacity:1} 92%,96%{opacity:0.7} }
        @keyframes tie-sway { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(2deg)} }
        @keyframes hat-light { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <div style={{ animation:'office-type 0.4s steps(1) infinite', imageRendering:'pixelated' }}>
        {/* Antenna — small signal */}
        <div style={{ width:2,height:8,background:'#FF1493',margin:'0 auto',boxShadow:'0 0 4px #FF1493' }}>
          <div style={{ width:5,height:5,background:'#FF1493',borderRadius:'50%',marginLeft:-1.5,marginTop:-2,boxShadow:'0 0 6px #FF1493',animation:'hat-light 1s ease-in-out infinite' }} />
        </div>
        {/* Head — sleek, rounded */}
        <div style={{ width:22,height:20,background:'#1a0a14',border:'2px solid #FF1493',margin:'0 auto',position:'relative',borderRadius:4 }}>
          {/* Screen face */}
          <div style={{ position:'absolute',inset:3,background:'#0a0014',border:'1px solid #FF1493',borderRadius:2,animation:'screen-flicker 4s ease-in-out infinite' }}>
            {/* Eyes as UI elements */}
            <div style={{ display:'flex',gap:3,padding:'2px 3px' }}>
              <div style={{ flex:1,height:5,background:'#FF1493',borderRadius:1,boxShadow:'0 0 4px #FF1493' }} />
              <div style={{ flex:1,height:5,background:'#FF1493',borderRadius:1,boxShadow:'0 0 4px #FF1493' }} />
            </div>
            {/* Status bar */}
            <div style={{ margin:'2px 2px 0',height:2,background:'#FF149344' }} />
            <div style={{ margin:'1px 2px 0',height:2,background:'#FF149322',width:'60%' }} />
          </div>
        </div>
        {/* Neck */}
        <div style={{ width:10,height:4,background:'#0a0614',margin:'0 auto',border:'1px solid #FF1493' }} />
        {/* Torso — executive suit */}
        <div style={{ width:28,height:22,background:'#111',border:'2px solid #FF1493',margin:'0 auto',position:'relative',borderRadius:3 }}>
          {/* Suit lapels */}
          <div style={{ position:'absolute',top:0,left:3,width:5,height:14,background:'#1a0a14',borderRadius:'0 0 4px 0',borderRight:'1px solid #FF1493' }} />
          <div style={{ position:'absolute',top:0,right:3,width:5,height:14,background:'#1a0a14',borderRadius:'0 0 0 4px',borderLeft:'1px solid #FF1493' }} />
          {/* Tie */}
          <div style={{ position:'absolute',top:2,left:'50%',transform:'translateX(-50%)',animation:'tie-sway 2s ease-in-out infinite',transformOrigin:'top center' }}>
            <div style={{ width:4,height:14,background:'#FF1493',clipPath:'polygon(15% 0%, 85% 0%, 100% 70%, 50% 100%, 0% 70%)' }} />
          </div>
          {/* Chest badge */}
          <div style={{ position:'absolute',top:3,right:5,width:6,height:8,background:'#FF149322',border:'1px solid #FF1493',borderRadius:1,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={{ color:'#FF1493',fontSize:5,fontFamily:'monospace' }}>T</span>
          </div>
          {/* Arms typing */}
          <div style={{ position:'absolute',top:6,left:-9,width:9,height:10,background:'#1a0a14',border:'1px solid #FF1493',borderRadius:2 }} />
          <div style={{ position:'absolute',top:6,right:-9,width:9,height:10,background:'#1a0a14',border:'1px solid #FF1493',borderRadius:2 }} />
        </div>
        {/* Hips */}
        <div style={{ width:20,height:5,background:'#0a0614',margin:'0 auto',border:'1px solid #FF1493',borderRadius:'0 0 2px 2px' }} />
        {/* Legs */}
        <div style={{ display:'flex',justifyContent:'center',gap:2 }}>
          <div style={{ width:8,height:12,background:'#111',border:'1px solid #FF1493',borderRadius:'0 0 2px 2px' }} />
          <div style={{ width:8,height:12,background:'#111',border:'1px solid #FF1493',borderRadius:'0 0 2px 2px' }} />
        </div>
        {/* Feet */}
        <div style={{ display:'flex',justifyContent:'center',gap:1 }}>
          <div style={{ width:10,height:5,background:'#0a0614',border:'1px solid #FF1493',borderRadius:'0 0 3px 3px' }} />
          <div style={{ width:10,height:5,background:'#0a0614',border:'1px solid #FF1493',borderRadius:'0 0 3px 3px' }} />
        </div>
      </div>
    </div>
  );
}

const ROBOTS: Record<Project, React.FC> = {
  clawckie: LabRobot,
  coach_clawckie: GymRobot,
  kince: ConstructionRobot,
  tremendous: OfficeRobot,
};

interface PixelRobotProps {
  project: Project;
}

export default function PixelRobot({ project }: PixelRobotProps) {
  const Robot = ROBOTS[project];
  return <Robot />;
}
