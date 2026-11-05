#!/usr/bin/env python3
"""Aggregate only tenvell's anonymized Caddy log, including rotated .gz files.

These are HTTP requests, not people or installations. No external dependencies.
"""
import argparse
from collections import Counter
import datetime as dt
import gzip
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

PAGES = {'/', '/install', '/sample', '/examples/tasks', '/examples/messenger',
         '/examples/dashboard', '/typeface', '/typeface.html'}
ARCHIVE = re.compile(r'^/releases/[^/]+/[^/]+\.(?:zip|tgz)$')
REGISTRY = re.compile(r'^/r/[^/]+\.json$')
BOT = re.compile(r'bot|crawler|spider|facebookexternalhit|twitterbot|slackbot|discordbot|whatsapp|telegrambot', re.I)
TECHNICAL = re.compile(r'tenvell-acceptance|tenvell-audit|healthcheck|uptime', re.I)
CLI = re.compile(r'curl/|wget/|python|node(?:/|$)|undici', re.I)

def classify(entry):
    request = entry.get('request', {})
    if request.get('host', '').split(':')[0].lower() != 'tenvell.space':
        return 'other_host'
    agent = entry.get('user_agent', '')
    if entry.get('utm_source') == 'codex_verification' or TECHNICAL.search(agent):
        return 'technical'
    if BOT.search(agent):
        return 'known_bot'
    if CLI.search(agent):
        return 'cli'
    return 'unclassified'  # never label this as human

def aggregate(entries, since=None, until=None, timezone='Europe/Moscow'):
    counts = Counter()
    days, pages, cli_pages, downloads, registry, sources, referrers, content = (Counter() for _ in range(8))
    seen_min = seen_max = None
    zone = ZoneInfo(timezone)
    for entry in entries:
        timestamp = dt.datetime.fromtimestamp(entry['ts'], dt.timezone.utc)
        if since and timestamp < since or until and timestamp >= until:
            continue
        population = classify(entry)
        counts[population + '_requests'] += 1
        if population == 'other_host':
            continue
        seen_min = timestamp if seen_min is None else min(seen_min, timestamp)
        seen_max = timestamp if seen_max is None else max(seen_max, timestamp)
        if population not in ('unclassified', 'cli'):
            continue
        req = entry.get('request', {})
        if req.get('method') != 'GET':
            counts['excluded_non_get'] += 1
            continue
        status = entry.get('status')
        path = entry.get('path') or urlsplit(req.get('uri', '')).path
        if status not in (200, 206, 304):
            counts['failed_get_requests'] += 1
            continue
        kind = None
        if path in PAGES and status in (200, 304):
            kind = 'cli_page_requests' if population == 'cli' else 'page_requests'
            (cli_pages if population == 'cli' else pages)[path] += 1
        elif ARCHIVE.fullmatch(path) and status == 200:
            kind = 'archive_responses_200'
            downloads[path] += 1
            counts['archive_bytes_sent'] += entry.get('size', 0)
        elif ARCHIVE.fullmatch(path) and status == 206:
            kind = 'archive_range_responses_206'
        elif REGISTRY.fullmatch(path) and status in (200, 304):
            kind = 'registry_item_requests'
            registry[path] += 1
        if kind:
            counts[kind] += 1
            days[timestamp.astimezone(zone).date().isoformat() + ' ' + kind] += 1
            if entry.get('utm_source'):
                sources[kind + ': ' + entry['utm_source']] += 1
            if entry.get('referrer_host'):
                referrers[kind + ': ' + entry['referrer_host']] += 1
            if entry.get('utm_content'):
                content[kind + ': ' + entry['utm_content']] += 1
    for name in ('page_requests', 'cli_page_requests', 'archive_responses_200', 'archive_range_responses_206', 'registry_item_requests', 'technical_requests', 'known_bot_requests'):
        counts.setdefault(name, 0)
    return {'generated_at':dt.datetime.now(dt.timezone.utc).isoformat(),
            'requested_window_utc':{'since_inclusive':since.isoformat() if since else None, 'until_exclusive':until.isoformat() if until else None},
            'available_events_utc':{'first':seen_min.isoformat() if seen_min else None, 'last':seen_max.isoformat() if seen_max else None},
            'daily_timezone':timezone, 'counts':dict(counts), 'by_day':dict(sorted(days.items())),
            'pages':dict(pages), 'cli_pages':dict(cli_pages), 'archive_responses':dict(downloads), 'registry_items':dict(registry),
            'utm_sources':dict(sources), 'referrer_hosts':dict(referrers), 'utm_content':dict(content),
            'limitations':['HTTP requests are not unique visitors or confirmed installations.',
                'Unclassified requests may still include unidentified automation and our browser checks.',
                'HTTP 200 archive responses do not prove that a client retained or used the file; 206 ranges are separate.',
                'The registry counter measures item requests, not completed shadcn installations.',
                'No IP, cookie or persistent visitor ID is collected; unique people and sessions cannot be reconstructed.',
                'SPA hash changes and fully cached navigations may not produce server requests.',
                'Attribution describes each request; a prior campaign visit is not linked to a later download.',
                'Counts are limited to retained logs; an empty result does not establish zero traffic before logging began.']}

def records(paths):
    for path in paths:
        opener = gzip.open if path.suffix == '.gz' else open
        with opener(path, 'rt') as stream:
            for number, line in enumerate(stream, 1):
                if not line.strip():
                    continue
                try:
                    entry = json.loads(line)
                    if not isinstance(entry.get('ts'), (float, int)):
                        raise ValueError('missing numeric timestamp')
                except (ValueError, AttributeError) as error:
                    raise ValueError(f'{path}:{number}: invalid log record: {error}') from error
                yield entry

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('logs', nargs='+', type=Path)
    parser.add_argument('--since', help='inclusive YYYY-MM-DD in --timezone')
    parser.add_argument('--until', help='exclusive YYYY-MM-DD in --timezone')
    parser.add_argument('--timezone', default='Europe/Moscow')
    args = parser.parse_args()
    zone = ZoneInfo(args.timezone)
    boundary = lambda s:dt.datetime.combine(dt.date.fromisoformat(s), dt.time.min, zone).astimezone(dt.timezone.utc) if s else None
    since, until = boundary(args.since), boundary(args.until)
    if since and until and since >= until:
        parser.error('--until must be later than --since')
    paths = sorted({p.resolve() for p in args.logs})
    if any(not p.is_file() for p in paths):
        parser.error('every log path must exist; no data is not the same as zero traffic')
    report = aggregate(records(paths), since, until, args.timezone)
    report['input_files'] = [p.name for p in paths]
    print(json.dumps(report, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
