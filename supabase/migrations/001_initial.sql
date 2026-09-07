-- agent_activity table
CREATE TABLE agent_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project TEXT NOT NULL CHECK (project IN ('clawckie', 'coach_clawckie', 'kince', 'tremendous')),
  task_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'idle')),
  subagent_count INTEGER DEFAULT 0,
  detail TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (public read for now)
ALTER TABLE agent_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON agent_activity FOR SELECT USING (true);
CREATE POLICY "Service insert" ON agent_activity FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update" ON agent_activity FOR UPDATE USING (true);

-- Index for realtime queries
CREATE INDEX idx_agent_activity_project_status ON agent_activity(project, status);
CREATE INDEX idx_agent_activity_created_at ON agent_activity(created_at DESC);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE agent_activity;
