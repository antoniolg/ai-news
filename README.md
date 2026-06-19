# AI News Timeline

A minimal web app for developers who want to stay up to date with the most relevant news about AI-assisted software development.

The product is intentionally simple: a timeline of important updates for each day. Each item links directly to the original source so readers can quickly scan what happened and jump into the full context.

## Product Idea

The first version will focus on news discovered from X. A manual heartbeat will later update a repository file with the most relevant items, and the website will render that file as a chronological timeline.

Future versions may add more sources, such as company engineering blogs, AI product changelogs, RSS feeds, or scraped pages from reliable sources.

## Initial Scope

- Show a minimal timeline of relevant AI development news.
- Read the timeline data from a local JSON file committed to the repository.
- Link each timeline item to its original source.
- Start with X as the first source.
- Keep the app static and easy to deploy.

## Future Scope

- Add source metadata beyond X.
- Support RSS-based ingestion.
- Support lightweight scraping for sources without RSS.
- Add a heartbeat workflow that collects and curates daily news.
- Group items by day.
- Add search or filtering only if the timeline grows enough to need it.

## Data Model Draft

The first data file can be a simple JSON document:

```json
[
  {
    "id": "2026-04-30-example",
    "title": "Example AI development update",
    "url": "https://example.com/original-source",
    "source": "x",
    "publishedAt": "2026-04-30T09:00:00Z",
    "summary": "Short context about why this update matters."
  }
]
```

This structure is intentionally small. It can evolve once the first version of the interface and the heartbeat workflow are in place.

## Tech Stack

- Astro
- TypeScript
- Tailwind CSS
- Zod
- Vitest
- Playwright
- pnpm

## Development

Install dependencies:

```bash
pnpm install
```

Run the local dev server:

```bash
pnpm dev
```

Run the verification gate:

```bash
pnpm lint
pnpm check
pnpm test
pnpm test:e2e
pnpm build
```

## Analytics

Umami is loaded only when `PUBLIC_UMAMI_WEBSITE_ID` is set.

Create a local `.env` from `.env.example` and set the website ID:

```bash
PUBLIC_UMAMI_WEBSITE_ID=your-umami-website-id
PUBLIC_UMAMI_SCRIPT_URL=https://umami.antonioleiva.com/script.js
```

In Umami, open the website settings and copy the ID from the tracking code snippet:

```html
<script defer src="https://umami.antonioleiva.com/script.js" data-website-id="..."></script>
```

The same gate runs in GitHub Actions on pushes to `main` and on pull requests.

## Project Structure

- `src/content/news.json`: manually curated news used by the static app.
- `src/domain/news`: news types and Zod validation schemas.
- `src/application/news`: pure timeline logic such as sorting, grouping, labeling, and filtering.
- `src/infrastructure/news`: JSON loading and validation boundary.
- `src/pages/index.astro`: Spanish UI for the timeline experience.

## Adding News

Add new items to `src/content/news.json` using this shape:

```json
{
  "id": "2026-04-30-example",
  "title": "Example update",
  "summary": "Short context about why this update matters.",
  "url": "https://example.com/original-source",
  "source": "X",
  "publishedAt": "2026-04-30T09:00:00Z"
}
```

The build validates every item with Zod. Invalid URLs, missing fields, unsupported sources, or invalid ISO dates fail before deployment.

## Repository Status

This repository currently contains the first static implementation of the Cambio de Estado timeline. The product reads from a local JSON file and does not include heartbeat, RSS, scraping, or backend ingestion yet.

When implementation starts, the project should stay aligned with these principles:

- Minimal interface.
- Timeline-first experience.
- Manual curation before automation.
- Original-source links over rewritten summaries.
- Simple static deployment unless the product needs a backend later.
