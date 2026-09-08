export type Project = 'clawckie' | 'coach_clawckie' | 'kince' | 'tremendous';
export type Status = 'in_queue' | 'in_progress' | 'completed' | 'could_not_complete';

export interface AgentActivity {
  id: string;
  project: Project;
  task_name: string;
  description: string | null;
  status: Status;
  subagent_count: number;
  detail: string | null;
  discord_server_id: string | null;
  discord_channel_id: string | null;
  discord_channel_name: string | null;
  discord_category_name: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export const PROJECT_CONFIG = {
  clawckie: {
    label: 'CLAWCKIE',
    color: '#FF6B00',
    glowColor: 'rgba(255, 107, 0, 0.6)',
    description: 'Chief of Staff',
  },
  coach_clawckie: {
    label: 'COACH',
    color: '#00CC44',
    glowColor: 'rgba(0, 204, 68, 0.6)',
    description: 'Fitness Intelligence',
  },
  kince: {
    label: 'KINCE',
    color: '#4963f5',
    glowColor: 'rgba(73, 99, 245, 0.6)',
    description: 'Workforce Platform',
  },
  tremendous: {
    label: 'TREMENDOUS',
    color: '#FF1493',
    glowColor: 'rgba(255, 20, 147, 0.6)',
    description: 'Brand Studio',
  },
} as const;

export const STATUS_LABEL: Record<Status, string> = {
  in_queue:           'IN QUEUE',
  in_progress:        'IN PROGRESS',
  completed:          'COMPLETED',
  could_not_complete: 'COULD NOT COMPLETE',
};

export const STATUS_COLOR: Record<Status, string> = {
  in_queue:           '#888888',
  in_progress:        '#00ff88',
  completed:          '#4488ff',
  could_not_complete: '#ff4444',
};

// cache-bust
