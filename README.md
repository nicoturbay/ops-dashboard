# Mission Control — ops.nicoturbay.com

Live agent activity dashboard for Clawckie Operations.

## Setup

1. Create a new Supabase project at supabase.com
2. Run the migration: `supabase/migrations/001_initial.sql`
3. Copy `.env.example` to `.env.local` and fill in your Supabase URL and anon key
4. Install: `pnpm install` (recommended) or `npm install`
5. Dev: `pnpm dev` or `npm run dev`
6. Deploy to Vercel: connect repo, add env vars, set custom domain `ops.nicoturbay.com`

## Writing to agent_activity

From Clawckie scripts, write to Supabase REST API:

```
POST https://YOUR_SUPABASE_URL/rest/v1/agent_activity
```

Headers:
```
apikey: YOUR_ANON_KEY
Authorization: Bearer YOUR_ANON_KEY
Content-Type: application/json
```

Body:
```json
{
  "project": "clawckie",
  "task_name": "Running daily briefing",
  "status": "running",
  "subagent_count": 2,
  "detail": "Fetching calendar and Gmail"
}
```

## Projects

| Project | Color | Description |
|---------|-------|-------------|
| clawckie | #FF6B00 (orange) | Chief of Staff |
| coach_clawckie | #00CC44 (green) | Fitness Intelligence |
| kince | #B388FF (light purple) | Workforce Platform |
| tremendous | #FF1493 (hot pink) | Brand Studio |

## Status Values

- `running` — active task in progress
- `completed` — task finished successfully
- `failed` — task encountered an error
- `idle` — no active task

## Features

- 80s/90s retro dungeon RPG aesthetic
- CRT scanlines + screen flicker effects
- Neon glow on active project rooms
- Pixel character walks corridors when agents are active
- Supabase Realtime for instant live updates (no polling)
- Click any room to open a retro terminal popover
- Activity feed showing last 20 events
- Offline/demo mode with mock data when Supabase is not configured

## Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Supabase JS client + Realtime
- Press Start 2P (Google Fonts)
