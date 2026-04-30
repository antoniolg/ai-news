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

The same gate runs in GitHub Actions on pushes to `main` and on pull requests.

## Repository Status

This repository currently contains a minimal Astro scaffold that renders a Hello world page. The product timeline has not been implemented yet.

When implementation starts, the project should stay aligned with these principles:

- Minimal interface.
- Timeline-first experience.
- Manual curation before automation.
- Original-source links over rewritten summaries.
- Simple static deployment unless the product needs a backend later.
