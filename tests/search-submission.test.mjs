import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalIndexNowUrls, indexNowPayload, submitIndexNow } from '../scripts/lib/indexnow.mjs';

test('search submission accepts only canonical HTTPS URLs on the owned origin and deduplicates them', () => {
  assert.deepEqual(canonicalIndexNowUrls('https://tenvell.space', ['https://tenvell.space/', 'https://tenvell.space/', 'https://tenvell.space/ru/react-dashboard-ui-kit']), ['https://tenvell.space/', 'https://tenvell.space/ru/react-dashboard-ui-kit']);
  for (const value of ['https://other.example/', 'https://tenvell.space/?utm_source=test', 'https://tenvell.space/#cards', 'https://user:password@tenvell.space/']) assert.throws(() => canonicalIndexNowUrls('https://tenvell.space', [value]));
  assert.throws(() => canonicalIndexNowUrls('http://tenvell.space', ['http://tenvell.space/']));
});

test('a live proof is verified before submission and acceptance never claims indexing', async () => {
  const key = 'a'.repeat(32), payload = indexNowPayload('https://tenvell.space', key, ['https://tenvell.space/react-glassmorphism-ui-kit']);
  for (const status of [200, 202]) {
    const calls = [];
    const result = await submitIndexNow(payload, async (url, options) => {
      calls.push({ url, options });
      return calls.length === 1 ? new Response(key + '\n') : new Response(null, { status });
    });
    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, payload.keyLocation);
    assert.equal(calls[1].url, 'https://api.indexnow.org/IndexNow');
    assert.deepEqual(JSON.parse(calls[1].options.body), payload);
    assert.equal(result.indexingStatus, 'UNVERIFIED');
    assert.equal(result.submissionStatus, status === 200 ? 'received' : 'received_validation_pending');
    assert.ok(!JSON.stringify(result).includes(key), 'A public receipt must not expose the ownership key or its URL');
  }
});

test('invalid proof prevents notification, and search-engine errors remain failures', async () => {
  const payload = indexNowPayload('https://tenvell.space', 'b'.repeat(32), ['https://tenvell.space/']);
  let calls = 0;
  await assert.rejects(submitIndexNow(payload, async () => { calls++; return new Response('wrong proof'); }), /ownership proof/);
  assert.equal(calls, 1);
  let verified = false;
  await assert.rejects(submitIndexNow(payload, async () => { if (!verified) { verified = true; return new Response(payload.key); } return new Response(null, { status: 429 }); }), /HTTP 429/);
});
