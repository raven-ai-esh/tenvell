# Working on tenvell

This repository contains the React 19 catalog website, a portable UI kit and a static shadcn registry. The canonical public origin and repository are in `release/project.json`.

## Setup and validation

```sh
npm ci
npm run dev -- --port 4187
npm run build
node --test tests/*.test.mjs
```

`npm run agents:build` generates the public Markdown documentation, llms files, component inventory and skill copy. Edit the source templates in `docs/agents/`, the skill in `skills/tenvell-ui/`, or the generator in `scripts/build-agent-docs.mjs`; regenerate before publishing. `npm run build` also renders the main documents to HTML so the important text and links work without JavaScript.

The release tests read the actual published archives; a website update does not require rebuilding a release. The API examples can be checked with `npm run agents:verify`.

## Release and scope

- Published files under `public/releases/<version>/` are immutable. A website/docs update must retain all archive and manifest bytes. Run `release:build` only when intentionally preparing a new version.
- `src/kit/` and its dependency graph define the portable API. Website-only examples, translations and preview controls are outside that API.
- Keep component CSS scoped to tenvell and its portals. Preserve independent provider settings, reduced motion and the originating overlay theme.
- The root package is private. Distribution uses the website tarball or source-first registry; do not assume a bare npm install is the documented package channel.
- Own code uses MIT; original Lamina fonts use SIL OFL 1.1. Keep licence notices in copied distributions.

Deploy only `dist/client/` following `deploy/README.md`. Keep anonymous access logs and operational evidence outside the public directory. Request counts are not unique people, completed installations or proof of marketing impact.

Consumer integration instructions are published at `https://tenvell.space/AGENTS.md`; the portable consumer skill lives in `skills/tenvell-ui/SKILL.md`.
