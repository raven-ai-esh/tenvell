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
Files are readable by Caddy/root, rotated at 5 MiB, with up to 31 backups and
744-hour age retention. Logs and reports must never be served from the public
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
- `registry_item_requests`: successful item JSON requests. Real Node/shadcn,
  curl and other CLI downloads are included; these are not completed installs.
- Known crawler UAs and explicitly marked acceptance traffic are separate.
  Unknown bots and owner browser visits may remain in unclassified requests.
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
