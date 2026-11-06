import datetime as dt
import gzip
import json
from pathlib import Path
import tempfile
import unittest
from report import aggregate, records

def entry(path='/', *, status=200, method='GET', agent='Mozilla/5.0', host='tenvell.space', timestamp=1793883600, **fields):
    return {'ts':timestamp, 'request':{'host':host, 'method':method, 'uri':path}, 'path':path,
            'status':status, 'size':100, 'user_agent':agent, **fields}

class ReportTests(unittest.TestCase):
    def test_preview_health_sync_and_registry_index_are_not_component_downloads(self):
        r=aggregate([
            entry('/r/button.json',agent='Shadbox (registry preview)'),
            entry('/r/button-demo.json',agent='Shadbox (registry preview)',status=404),
            entry('/r/registry.json',agent='shadcn-registry-health/1.0'),
            entry('/r/button.json',agent='shadcn-marketplace registry sync',status=304),
            entry('/r/registry.json',agent='node'),
            entry('/r/button.json',agent='node'),
        ])
        self.assertEqual(r['counts']['registry_item_requests'],1)
        self.assertEqual(r['counts']['registry_index_requests'],1)
        self.assertEqual(r['counts']['preview_requests'],2)
        self.assertEqual(r['counts']['registry_health_requests'],1)
        self.assertEqual(r['counts']['registry_sync_requests'],1)
        self.assertEqual(r['client_activity']['preview']['failed_gets'],1)
        self.assertEqual(r['registry_items'],{'/r/button.json':1})

    def test_known_scanners_are_separate_without_excluding_real_cli_downloads(self):
        r=aggregate([entry(agent='CoinCreatorScanner/1.0'),entry(agent='Mozilla/5.0 (compatible; RadixAbuseResearch/1.0)'),entry('/r/button.json',agent='undici'),entry('/releases/0.2.1/tenvell-0.2.1.tgz',agent='python-requests/2.0')])
        self.assertEqual(r['counts']['page_requests'],0)
        self.assertEqual(r['counts']['known_bot_requests'],2)
        self.assertEqual(r['counts']['registry_item_requests'],1)
        self.assertEqual(r['counts']['archive_responses_200'],1)

    def test_real_cli_registry_and_archives_are_counted_but_cli_page_hits_are_separate(self):
        r=aggregate([entry('/r/button.json',agent='node'),entry('/releases/0.2.1/tenvell-0.2.1.tgz',agent='curl/8'),entry('/',agent='curl/8')])
        self.assertEqual(r['counts']['registry_item_requests'],1)
        self.assertEqual(r['counts']['archive_responses_200'],1)
        self.assertEqual(r['counts']['page_requests'],0)
        self.assertEqual(r['counts']['cli_page_requests'],1)
        self.assertEqual(r['pages'],{})
        self.assertEqual(r['cli_pages'],{'/':1})

    def test_own_acceptance_bots_and_sibling_host_do_not_inflate_metrics(self):
        r=aggregate([entry(agent='tenvell-acceptance/20261105'),entry(utm_source='codex_verification'),entry(agent='Twitterbot/1.0'),entry(host='shop.example')])
        self.assertEqual(r['counts']['technical_requests'],2)
        self.assertEqual(r['counts']['known_bot_requests'],1)
        self.assertEqual(r['counts']['other_host_requests'],1)
        self.assertEqual(r['counts']['page_requests'],0)

    def test_head_failures_304_metadata_and_ranges_are_not_full_archive_responses(self):
        archive='/releases/0.2.1/tenvell-starter-0.2.1.zip'
        r=aggregate([entry(archive,method='HEAD'),entry(archive,status=404),entry(archive,status=304),entry(archive,status=206),entry('/releases/0.2.1/manifest.json'),entry('/assets/index.js'),entry('/scanner.php'),entry('/',status=304)])
        self.assertEqual(r['counts']['archive_responses_200'],0)
        self.assertEqual(r['counts']['archive_range_responses_206'],1)
        self.assertEqual(r['counts']['page_requests'],1)
        self.assertEqual(r['counts']['failed_get_requests'],1)

    def test_day_window_is_half_open_in_requested_timezone_and_attribution_is_per_request(self):
        start=dt.datetime(2026,11,5,tzinfo=dt.timezone(dt.timedelta(hours=3))).astimezone(dt.timezone.utc)
        end=start+dt.timedelta(days=1)
        r=aggregate([entry(timestamp=start.timestamp()-1),entry(timestamp=start.timestamp(),utm_source='x',utm_content='02_tenvell',referrer_host='t.co'),entry(timestamp=end.timestamp())],start,end)
        self.assertEqual(r['counts']['page_requests'],1)
        self.assertEqual(r['by_day'],{'2026-11-05 page_requests':1})
        self.assertEqual(r['utm_sources'],{'page_requests: x':1})
        self.assertEqual(r['referrer_hosts'],{'page_requests: t.co':1})

    def test_no_records_is_available_but_not_historical_zero_and_rotations_are_read(self):
        self.assertEqual(aggregate([])['available_events_utc'],{'first':None,'last':None})
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'tenvell-access.1.json.gz'
            with gzip.open(path,'wt') as f:f.write(json.dumps(entry())+'\n')
            self.assertEqual(aggregate(records([path]))['counts']['page_requests'],1)

    def test_corrupt_lines_fail_instead_of_silently_underreporting(self):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'tenvell-access.json';path.write_text('{broken}\n')
            with self.assertRaisesRegex(ValueError,'invalid log record'):list(records([path]))

if __name__=='__main__':unittest.main()
