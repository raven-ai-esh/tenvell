# Former hosted origin

The primary site uses the static Caddy profile in `tenvell.caddy`. Normal builds
and forks do not emit redirect metadata.

The original hosted Site additionally runs
`node scripts/prepare-legacy-redirects.mjs` after its ordinary build and before
packaging. It emits a deployment-only `dist/client/_redirects` file for the root
and typeface documents. Those existing HTML assets can be served before the
Worker, so the Worker alone cannot redirect them. App deep links are handled by
the Worker; registry items and versioned archives remain direct assets.

Use this explicit profile only when retiring a former origin in favor of the
canonical HTTPS origin declared in `release/project.json`. Do not run it as part
of normal self-hosting or new Site creation. The generated file belongs in that
legacy deployment archive, not in the VPS's static public directory. Previously
published release archives remain immutable historical snapshots.
