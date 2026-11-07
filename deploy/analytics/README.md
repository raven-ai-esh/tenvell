# Website and download measurement

The `tenvell.space` Caddy block writes its own rotating JSON access log to
`/var/log/caddy/tenvell-access.json`. No new backend or browser script is needed.
The sibling clothing-store site does not use this logger.

Client IP addresses, ports, TLS details, all request/response headers and arbitrary URL
query parameters are removed before writing. The retained fields include path,
status, sent bytes, user agent, referrer **host only**, and four marketing UTM
labels (`source`, `medium`, `campaign`, `content`). Referrer credentials, ports,
paths and queries are discarded; literal IP and malformed referrers are blank.
No cookies or visitor IDs.
Files are readable by Caddy/root. The active file rolls at 5 MiB; rotated
backups have a limit of 31 files and a 744-hour age retention. The current file
is kept until it rolls. Logs and reports must never be served from the public
website directory or committed to source control.

## Read a report

Install `report.py` at `/srv/tenvell/analytics/report.py`. An authorized operator
can run it as Caddy over the existing SSH connection:

```sh
ssh your-web-host 'sudo -n -u caddy python3 /srv/tenvell/analytics/report.py /var/log/caddy/tenvell-access.json --since 2026-11-05 --until 2026-11-06'
```

Pass rotated log paths as additional arguments, including `.gz` files, to cover
the complete retained interval. Missing files and malformed JSON fail instead
of returning a misleading zero. Dates use `Europe/Moscow` by default, with an
inclusive start and exclusive end; the output includes UTC boundaries and the
first/last available event.

## Interpret the numbers

- `page_requests`: successful GETs of known documents, including revalidation.
  CLI document requests are reported separately.
- `archive_responses_200`: GET responses for a versioned ZIP/TGZ; sent bytes
  are also recorded. This is not proof of a completed client download or use.
- `archive_range_responses_206`: ranges/resumes, never counted as full archives.
- `registry_item_requests`: successful item JSON requests, excluding indexes
  (`registry_index_requests`) and the recognized preview/health/sync clients.
  Real Node/shadcn,
  curl and other CLI downloads are included; these are not completed installs.
- Known crawler UAs and explicitly marked acceptance traffic are separate.
  Unknown bots and owner browser visits may remain in unclassified requests.
- Schema 2 reports self-declared `preview`, `registry_health` and `registry_sync`
  traffic in `client_activity`, including failed GETs and requested paths. A
  preview that tries an optional `*-demo` URL is not a completed installation.
  User-Agent labels are hints, not authenticated identities. Known scanner UAs
  are included with bots. Earlier schema-1 registry counts included index and
  preview traffic; recompute the same retained interval before comparing.
- Schema 3 adds `agent_resource_requests` and
  `agent_resources_by_client_class` for successful GETs (200/304) of the public
  llms files, Markdown, component inventory and `tenvell-ui/SKILL.md`. Existing
  known-bot, CLI, unclassified and registry-client classes stay separate;
  acceptance traffic, failures, HEAD, robots.txt and sitemap.xml are excluded.
  `/agents` is a setup page in the page counter. A documentation request does
  not prove an agent's identity, a skill installation, a completed task or
  causal promotional value. Earlier retained logs can be recomputed, but the
  new files did not exist before publication.
- Discovery guides have separate English and Russian page URLs. Their nested
  Markdown counterparts are included in the same schema-3 resource counters.
  The IndexNow proof matcher skips access logging so its unpredictable filename
  never enters this dataset. A submission receipt means receipt by IndexNow,
  not confirmed indexing or a position in search.
- UTM/referrer attribution is per request. A later download is not linked to
  an earlier visit, and no unique-person or session count is claimed.

Nothing before logging was enabled can be reconstructed. SPA hash changes,
fully cached navigations and actual installations are outside these counters.

```sh
cd deploy/analytics
python3 -m unittest -v
```

The live acceptance record must additionally prove HTTPS requests reach this
log, filters remove sensitive fields, expected HTTP failures/ranges remain
separate, and the sibling site's configuration and service health are intact.
