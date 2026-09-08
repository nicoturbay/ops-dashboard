export type Project = 'clawckie' | 'coach_clawckie' | 'kince' | 'tremendous';
export type Status = 'running' | 'completed' | 'failed' | 'idle';

export interface AgentActivity {
  id: string;
  project: Project;
  task_name: string;
  status: Status;
  subagent_count: number;
  detail: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export const PROJECT_CONFIG = {
  clawckie: {
    label: 'CLAWCKIE',
    color: '#FF6B00',
    glowColor: 'rgba(255, 107, 0, 0.6)',
    textColor: '#FF8A3D',
    description: 'Chief of Staff',
  },
  coach_clawckie: {
    label: 'COACH',
    color: '#00CC44',
    glowColor: 'rgba(0, 204, 68, 0.6)',
    textColor: '#33E06E',
    description: 'Fitness Intelligence',
  },
  kince: {
    label: 'KINCE',
    color: '#4963f5',
    glowColor: 'rgba(179, 136, 255, 0.6)',
    textColor: '#8CA4FF',
    description: 'Workforce Platform',
  },
  tremendous: {
    label: 'TREMENDOUS',
    color: '#FF1493',
    glowColor: 'rgba(255, 20, 147, 0.6)',
    textColor: '#FF5FB4',
    description: 'Brand Studio',
  },
} as const;
