// Explicit deployment profile for the former hosted origin only.
// Ordinary builds and self-hosted/forked sites must not call this helper.
import {access, rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await access(path.join(root,'dist/server/index.js'));
await access(path.join(root,'dist/.openai/hosting.json'));
// Existing HTML assets bypass the Worker on the former host. That host is now
// a redirect service, so these page paths must reach the Worker instead.
// Their source files and the primary VPS's normal build remain untouched.
for(const file of ['index.html','typeface.html','_redirects']){
  await rm(path.join(root,'dist/client',file),{force:true});
}
console.log('Prepared legacy Worker redirect profile; registry and download assets retained.');
