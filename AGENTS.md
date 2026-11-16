<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Dev environment tips
- Install with `npm ci` (CI uses npm; Linux optional deps for Tailwind oxide / lightningcss are pinned in `package.json`).
- Run the app with `npm run dev`, production build with `npm run build`, serve with `npm run start`.
- Lint with `npm run lint`.
- App Router pages live under `app/`. Changed-route detection for CI is in `scripts/changed-app-routes.mjs`.

## Testing instructions
- CI plan: `.github/workflows/lighthouse-changed-routes.yml`.
- On PRs/pushes to `main`, the workflow audits App Router routes touched by the diff (skips when none changed).
- Local check before merge: `npm run lint` and `npm run build`.
- Lighthouse assertions (accessibility is hard-fail; performance / best-practices / seo warn) are generated in that workflow’s `.lighthouserc.json` step.
- Failed LHCI runs on PRs post a sticky comment; passing runs clear it. Status checks need repo secret `LHCI_GITHUB_APP_TOKEN`.

## PR instructions
- Title: short summary of the change (no monorepo `[project]` prefix).
- Run `npm run lint` and `npm run build` before committing.
- Expect Lighthouse to run only if the PR changes files that map to App Router routes.
