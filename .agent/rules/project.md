# Project Rules - my-first-web

## General
- Framework: Next.js 16.2.6 (App Router ONLY. `next/router` is forbidden, use `next/navigation`)
- Language: TypeScript
- UI Framework: Tailwind CSS 4 + shadcn/ui

## Supabase Auth, DB & RLS (Ch11)
- Client Initialization: Use `lib/supabase/client.ts` for browser clients (Ch8).
- Server Initialization: Use `createServerClient` from `@supabase/ssr` in Server Components/Actions.
- Global State: Use `useAuth` / `AuthProvider` for authentication state (Ch9).
- Authentication method: Email and Password only.
- Redirection: Use `middleware.ts` for protecting routes.
- Schema: The `posts` table column names MUST exactly follow the Ch8 schema.
- RLS Enforced: Database RLS (Row Level Security) policies must be fully activated and enforced for profiles and posts tables.
- Migration Workflow: RLS configuration and security policies must be written in Supabase CLI migrations (`supabase migration new`), never directly via SQL Editor.
- Security boundary: UX-level controls (conditional buttons) are for UI experience only; true data access control is handled purely at the DB layer via RLS policies.
- Service Role Ban: Browser clients must never utilize the `service_role` key, ensuring RLS bypass controls are not exposed.

## Versioning
- Material Standard: Next.js 16.2.1, @supabase/ssr 0.5.2 (Ch7/Ch8 standard)
- Project Standard: Follow `package.json` versions (Next.js 16.2.6, Supabase 2.105.4).
- If conflict occurs, log both "교재 기준" and "현재 설치 기준".

## Components
- Components are located in `@/components`.
- UI components (shadcn) are in `@/components/ui`.
- Default to Server Components.
