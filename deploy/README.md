# Static hosting

The public site is served at https://tenvell.space. From a checkout containing
the prepared public registry and release files, run `npm ci` and `npm run build`;
the website is in `dist/client/`. When preparing a new release, update its version
and run `npm run release:build` first. Never replace already published archives.
Only that public directory belongs on a web server. No Node process or database
is needed to serve the catalog and local demonstrations.

The build generates `llms.txt`, the Markdown reference, the public integration
`AGENTS.md`, the component inventory and the skill copy. It also renders `/`,
`/install` and `/agents` into HTML with the same React components used by the
interactive website. Keep the route CSS from the Vite manifest so the documents
also work without JavaScript. The root repository `AGENTS.md` is contributor
guidance; it is not copied as the public integration guide.

Serve `.md` files as `text/markdown`, allow cross-origin reads of the public
documentation, and keep real 404s under `/docs` and `/skills` even when a client
asks for HTML. The Caddy profile sets these rules and a `describedby` link to
`llms.txt`. The HTML documents also advertise their own Markdown alternates.

## Discovery pages and search submission

Four guides cover choosing a React UI kit, glassmorphism, dashboards and editable
shadcn components. They have separate `/ru/` versions with reciprocal `hreflang`,
canonical URLs and Markdown alternates. Source copy lives in `src/discovery/`;
the normal build generates their Markdown and renders all eleven entry/guide
documents. The sitemap includes these documents and the typeface page.

After publishing changed documents, an authorized operator can notify IndexNow:

```sh
npm run search:submit -- --dry-run
npm run search:submit -- --key-file /private/path/indexnow-key --receipt /private/path/submission.json
```

Use `--urls-file` with a JSON array of changed canonical URLs when submitting a
smaller update or a deletion. The default list is the rendered entry/guide
documents; it excludes unchanged release archives and the older typeface page.
The script verifies the live ownership file before submitting. HTTP 200 means
receipt of the URLs; 202 means receipt with key validation pending. Neither is
confirmation of crawling, indexing, ranking or recommendation by an agent.

Generate one 32-character lowercase hexadecimal ownership key outside the
repository. Keep its private copy in a file readable only by the operator.
Serve an identical UTF-8 copy as `/srv/tenvell/search-verification/<key>.txt`, with the
directory and file readable by Caddy. This persistent directory is separate
from website releases. The Caddy profile exposes only matching root proof
filenames and skips their access logs. Do not commit the key, expose directory
listings, print its proof URL or put private operational files in `dist/client`.
Proof setup and search submission require no Node process in the live website.

`tenvell.caddy` serves the public directory through `/srv/tenvell/current`, with
the `www` host redirecting to the main domain. Put each verified build in a
separate release directory and switch the symlink atomically. Keep the previous
release available for rollback. Caddy obtains and renews HTTPS certificates.

Import this site block into the server's existing Caddy configuration, validate
the complete configuration, then use a graceful reload. Existing sites and
their application containers do not need to be restarted or rebuilt.

Known app routes serve their document for GET and HEAD regardless of the Accept
header, while preserving the URL and query. Unknown HTML navigation paths may
fall back to the app shell. Registry,
release, font and asset paths return their actual files, including real 404s;
they must not fall back to the app shell. Versioned release archives retain
their published bytes and remain available at their original paths.

The former `tenvell.esher1.chatgpt.site` origin remains a compatibility endpoint:
page requests redirect to the main domain, while registry items and versioned
downloads remain direct. This keeps previously published installation links
usable while directory entries move to the new domain.
