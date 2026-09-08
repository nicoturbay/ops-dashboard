'use client';
import { AgentActivity, Project } from '@/types/activity';
import ProjectRoom from './ProjectRoom';

interface DungeonMapProps {
  projectActivity: Record<Project, AgentActivity | null>;
  recentFeed: AgentActivity[];
}

export default function DungeonMap({ projectActivity, recentFeed }: DungeonMapProps) {
  return (
    <div style={{
      flex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: 8,
      padding: 16,
      minHeight: 0,
    }}>
      {(['clawckie', 'coach_clawckie', 'kince', 'tremendous'] as Project[]).map(project => (
        <ProjectRoom
          key={project}
          project={project}
          activity={projectActivity[project]}
          recentHistory={recentFeed}
        />
      ))}
    </div>
  );
}
