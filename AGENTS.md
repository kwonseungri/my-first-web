<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

- **Next.js Version**: 16.2.6 (교재 기준 16.2.1)
- **Rules**:
  - `params` and `searchParams` are **Promises**. Always `await` them.
  - No `next/router`. Use `next/navigation`.
  - Use `@supabase/ssr` for authentication (App Router pattern).
  - Use `middleware.ts` for route protection.
  - Follow the Version Policy in `.github/copilot-instructions.md`.
<!-- END:nextjs-agent-rules -->
