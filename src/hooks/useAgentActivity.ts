'use client';

import { useState, useEffect, useCallback } from 'react';
import { AgentActivity, Project } from '@/types/activity';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

type ProjectActivityMap = Record<Project, AgentActivity | null>;

interface UseAgentActivityResult {
  projectActivity: ProjectActivityMap;
  recentFeed: AgentActivity[];
  isLoading: boolean;
  isConnected: boolean;
  isOffline: boolean;
}

const PROJECTS: Project[] = ['clawckie', 'coach_clawckie', 'kince', 'tremendous'];

const defaultProjectActivity: ProjectActivityMap = {
  clawckie: null,
  coach_clawckie: null,
  kince: null,
  tremendous: null,
};

// Mock data for offline/placeholder mode
const MOCK_ACTIVITY: AgentActivity[] = [
  {
    id: '1',
    project: 'clawckie',
    task_name: 'Daily Briefing',
    description: 'Fetching calendar and Gmail data',
    status: 'in_progress',
    subagent_count: 2,
    detail: 'Fetching calendar and Gmail data',
    discord_server_id: null,
    discord_channel_id: null,
    discord_channel_name: null,
    discord_category_name: null,
    started_at: new Date(Date.now() - 300000).toISOString(),
    completed_at: null,
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: '2',
    project: 'kince',
    task_name: 'Worker Matching',
    description: 'Matched 12 workers to open shifts',
    status: 'completed',
    subagent_count: 0,
    detail: 'Matched 12 workers to open shifts',
    discord_server_id: null,
    discord_channel_id: null,
    discord_channel_name: null,
    discord_category_name: null,
    started_at: new Date(Date.now() - 600000).toISOString(),
    completed_at: new Date(Date.now() - 120000).toISOString(),
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: '3',
    project: 'tremendous',
    task_name: 'Brand Asset Generation',
    description: null,
    status: 'in_queue',
    subagent_count: 0,
    detail: null,
    discord_server_id: null,
    discord_channel_id: null,
    discord_channel_name: null,
    discord_category_name: null,
    started_at: new Date(Date.now() - 900000).toISOString(),
    completed_at: null,
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: '4',
    project: 'coach_clawckie',
    task_name: 'Workout Plan Analysis',
    description: 'Analyzing nutrition and recovery metrics',
    status: 'in_progress',
    subagent_count: 1,
    detail: 'Analyzing nutrition and recovery metrics',
    discord_server_id: null,
    discord_channel_id: null,
    discord_channel_name: null,
    discord_category_name: null,
    started_at: new Date(Date.now() - 120000).toISOString(),
    completed_at: null,
    created_at: new Date(Date.now() - 120000).toISOString(),
  },
];

export function useAgentActivity(): UseAgentActivityResult {
  const [projectActivity, setProjectActivity] = useState<ProjectActivityMap>(defaultProjectActivity);
  const [recentFeed, setRecentFeed] = useState<AgentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const buildProjectMap = useCallback((activities: AgentActivity[]): ProjectActivityMap => {
    const map: ProjectActivityMap = { ...defaultProjectActivity };
    // For each project, prefer in_progress, then in_queue, then most recent
    PROJECTS.forEach((project) => {
      const projectActivities = activities.filter((a) => a.project === project);
      const running =
        projectActivities.find((a) => a.status === 'in_progress') ??
        projectActivities.find((a) => a.status === 'in_queue');
      map[project] = running ?? (projectActivities[0] ?? null);
    });
    return map;
  }, []);

  const loadMockData = useCallback(() => {
    setIsOffline(true);
    setIsConnected(false);
    setProjectActivity(buildProjectMap(MOCK_ACTIVITY));
    setRecentFeed(MOCK_ACTIVITY);
    setIsLoading(false);
  }, [buildProjectMap]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      loadMockData();
      return;
    }

    const supabase = getSupabaseClient();
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        const { data, error } = await supabase
          .from('agent_activity')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (!mounted) return;

        if (error) {
          console.error('Supabase fetch error:', error);
          loadMockData();
          return;
        }

        const activities = (data ?? []) as AgentActivity[];
        setProjectActivity(buildProjectMap(activities));
        setRecentFeed(activities.slice(0, 20));
        setIsLoading(false);
      } catch (err) {
        console.error('Supabase connection error:', err);
        if (mounted) {
          loadMockData();
        }
      }
    };

    fetchInitialData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('agent_activity_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_activity',
        },
        (payload) => {
          if (!mounted) return;

          const newActivity = payload.new as AgentActivity;

          setRecentFeed((prev) => {
            const updated = [newActivity, ...prev.filter((a) => a.id !== newActivity.id)].slice(0, 20);
            return updated;
          });

          setProjectActivity((prev) => {
            const updated = { ...prev };
            const project = newActivity.project;
            const current = prev[project];

            // Update if it's active (in_progress or in_queue) or if no current activity
            if (
              newActivity.status === 'in_progress' ||
              newActivity.status === 'in_queue' ||
              !current
            ) {
              updated[project] = newActivity;
            } else if (current?.id === newActivity.id) {
              updated[project] = newActivity;
            }

            return updated;
          });
        }
      )
      .subscribe((status) => {
        if (!mounted) return;
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setIsOffline(false);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsConnected(false);
        }
      });

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [buildProjectMap, loadMockData]);

  return { projectActivity, recentFeed, isLoading, isConnected, isOffline };
}
