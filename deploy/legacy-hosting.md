# Former hosted origin

The primary site uses the static Caddy profile in `tenvell.caddy`. Normal builds
and forks do not emit redirect metadata.

The original hosted Site additionally runs
`node scripts/prepare-legacy-redirects.mjs` after its ordinary build and before
packaging. Only in that deployment's build output, it removes the root and
typeface HTML documents from the static asset bucket. Their requests then reach
the redirect Worker instead of being served before it. App deep links are also
handled by the Worker; registry items and versioned archives remain direct assets.

Use this explicit profile only when retiring a former origin in favor of the
canonical HTTPS origin declared in `release/project.json`. Do not run it as part
of normal self-hosting or new Site creation. The source HTML documents, the VPS's
normal build and previously published release archives are not changed. Rebuild
normally after the legacy archive has been saved to restore normal build output.

The native upload path does not apply Cloudflare `_redirects` metadata. This
profile uses the existing Worker entrypoint and actual static/Worker routing;
it does not depend on unsupported provider settings or client-side redirects.
