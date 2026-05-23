# CLAUDE.md — my-first-web

Refer to [AGENTS.md](file:///c:/my-first-web/AGENTS.md) and [.github/copilot-instructions.md](file:///c:/my-first-web/.github/copilot-instructions.md) for project rules.

## Build Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Project Focus
- Current: Ch11 Row Level Security (RLS) & Security Hardening
- Architecture: Next.js App Router (next/navigation only)
- Database: profiles, posts tables (Follow Ch8 schema strictly, use `lib/supabase/client.ts`)
- Auth State: `useAuth` / `AuthProvider` (Ch9)
- Note: Enforce real backend security using Supabase RLS policies (via CLI migrations). Never use service_role in client-side code.
- UI: Tailwind CSS 4, shadcn/ui
