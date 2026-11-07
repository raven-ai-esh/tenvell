export function canonicalIndexNowUrls(site, urls) {
  const origin = new URL(site);
  if (origin.protocol !== 'https:' || !Array.isArray(urls)) throw new Error('IndexNow requires an HTTPS origin and a URL list');
  const values = [...new Set(urls.map(value => {
    const url = new URL(value);
    if (url.origin !== origin.origin || url.search || url.hash || url.username || url.password) throw new Error('IndexNow URLs must be canonical URLs on the website origin');
    return url.href;
  }))];
  if (!values.length || values.length > 10000) throw new Error('IndexNow requires between 1 and 10000 URLs');
  return values;
}

export function indexNowPayload(site, key, urls) {
  if (!/^[a-f0-9]{32}$/.test(key)) throw new Error('The private IndexNow key must contain 32 lowercase hexadecimal characters');
  const origin = new URL(site).origin;
  return { host: new URL(origin).host, key, keyLocation: origin + '/' + key + '.txt', urlList: canonicalIndexNowUrls(origin, urls) };
}

export async function submitIndexNow(payload, fetcher = fetch) {
  const proof = await fetcher(payload.keyLocation, { redirect: 'error', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'tenvell-acceptance/indexnow-verification' } });
  if (!proof.ok || (await proof.text()).trim() !== payload.key) throw new Error('The live ownership proof does not match the private IndexNow key');
  const response = await fetcher('https://api.indexnow.org/IndexNow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000), redirect: 'error' });
  if (![200, 202].includes(response.status)) throw new Error('IndexNow submission returned HTTP ' + response.status);
  return { httpStatus: response.status, submissionStatus: response.status === 200 ? 'received' : 'received_validation_pending', indexingStatus: 'UNVERIFIED', urlCount: payload.urlList.length, urls: payload.urlList, submittedAtUtc: new Date().toISOString() };
}
