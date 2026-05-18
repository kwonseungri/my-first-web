<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

- **Next.js Version**: 16.2.6 (교재 기준 16.2.1)
- **Rules**:
  - `params` and `searchParams` are **Promises**. Always `await` them.
  - No `next/router`. Use `next/navigation` only. App Router is mandatory.
  - Follow Ch7-Ch8 textbook package standards.
  - Use `lib/supabase/client.ts` for Supabase browser clients (Ch8).
  - Use `@supabase/ssr` for authentication and follow `useAuth` / `AuthProvider` global state (Ch9).
  - Use `middleware.ts` for route protection.
  - `posts` column names MUST match Ch8 schema exactly.
  - Edit/Delete UI for posts is for UX only. Actual security will be handled via RLS in Ch11.
  - Follow the Version Policy in `.github/copilot-instructions.md`.
<!-- END:nextjs-agent-rules -->
