# Lighthouse for changed Next.js routes

A GitHub Actions workflow that runs [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) only on the App Router routes a change affects, so you don't audit every page on every push.

- Workflow: [`.github/workflows/lighthouse-changed-routes.yml`](.github/workflows/lighthouse-changed-routes.yml)
- Route detection: [`scripts/changed-app-routes.mjs`](scripts/changed-app-routes.mjs)

## When it runs

- Pull requests targeting `main`
- Pushes to `main`
- Manually (`workflow_dispatch`): compares `HEAD` with the merge base of the default branch

A new run on the same PR or branch cancels the one already in progress.

## What it does

1. Diffs the base and head commits to get the changed files.
2. Maps those files to routes (see below).
3. If no routes are affected, it stops there.
4. Otherwise it runs `npm run build`, starts `npm run start` on `localhost:3000`, and runs `lhci autorun` against each affected route (1 run per URL).
5. Uploads the HTML/JSON reports as the `lighthouse-changed-routes` artifact, even when assertions fail.

## How files map to routes

The script looks in `app/`, or `src/app/` if there is no `app/`.

| Changed file | Routes audited |
| --- | --- |
| `page.(tsx\|ts\|jsx\|js\|mdx\|md)` | That page's route |
| `layout`, `template`, `loading`, `error`, `global-error`, `not-found`, `default` | Every page in that folder and below |
| Any other file in the app folder (components, CSS, utils) | Every page |
| Files outside the app folder | None |

Route groups `(group)`, parallel slots `@slot` and interception prefixes `(.)`, `(..)`, `(...)` are stripped from the URL. Pages in private folders (`_folder`) and dynamic routes (`[id]`, `[...slug]`) are skipped, since there's no URL to visit without real params. Deleted pages are skipped too.

## Thresholds

| Category | Min score | On failure |
| --- | --- | --- |
| Accessibility | 0.9 | **Fails the job** |
| Performance | 0.8 | Warning |
| Best practices | 0.9 | Warning |
| SEO | 0.9 | Warning |

To change them, edit the `assertions` block in the "Configure Lighthouse CI" step.

## Use it in another project

Copy both files into your Next.js App Router project:

```
.github/workflows/lighthouse-changed-routes.yml
scripts/changed-app-routes.mjs
```

The project needs `build` and `start` scripts in `package.json` and a `package-lock.json` (the workflow uses `npm ci`). Change the `branches` filters if your default branch isn't `main`.

## Test route detection locally

```bash
git diff --name-only main > changed-files.txt
node scripts/changed-app-routes.mjs changed-files.txt routes.json
cat routes.json
```

## Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
