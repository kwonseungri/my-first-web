# Project Rules - my-first-web

## General
- Framework: Next.js 16.2.6 (App Router)
- Language: TypeScript
- UI Framework: Tailwind CSS 4 + shadcn/ui

## Supabase Auth (Ch9)
- Use `createBrowserClient` from `@supabase/ssr` in Client Components.
- Use `createServerClient` from `@supabase/ssr` in Server Components/Actions.
- Authentication method: Email and Password only.
- Redirection: Use `middleware.ts` for protecting routes.
- API: Use `auth.signInWithPassword()` for login.

## Versioning
- Material Standard: Next.js 16.2.1, @supabase/ssr 0.5.2
- Project Standard: Follow `package.json` versions.
- If conflict occurs, explain the version difference clearly.

## Components
- Components are located in `@/components`.
- UI components (shadcn) are in `@/components/ui`.
- Default to Server Components.
