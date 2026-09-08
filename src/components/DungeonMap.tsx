'use client';
import { AgentActivity, Project } from '@/types/activity';
import ProjectRoom from './ProjectRoom';

interface DungeonMapProps {
  projectActivity: Record<Project, AgentActivity | null>;
  recentFeed: AgentActivity[];
}

const PROJECTS: Project[] = ['clawckie', 'coach_clawckie', 'kince', 'tremendous'];

export default function DungeonMap({ projectActivity, recentFeed }: DungeonMapProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      minHeight: 0,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 280px)',
        gridTemplateRows: 'repeat(2, 220px)',
        gap: 12,
      }}>
        {PROJECTS.map(project => (
          <div key={project} style={{ width: 280, height: 220 }}>
            <ProjectRoom
              project={project}
              activity={projectActivity[project]}
              recentHistory={recentFeed}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
