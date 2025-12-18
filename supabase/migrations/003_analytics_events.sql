-- Analytics Events Table for Bed Bug Inspection Pro Mobile App
-- Tracks all app usage events for analytics dashboard

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  device_id TEXT,
  platform TEXT,
  app_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_platform ON analytics_events(platform);
CREATE INDEX IF NOT EXISTS idx_analytics_events_device ON analytics_events(device_id);

-- Composite index for time-based event queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_name_time ON analytics_events(event_name, created_at DESC);

-- GIN index for JSONB properties queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_properties ON analytics_events USING GIN(properties);

-- RLS Policies (admin only)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all analytics"
  ON analytics_events FOR SELECT
  USING (is_admin());

CREATE POLICY "Service role can insert analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

