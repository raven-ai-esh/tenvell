import React from 'react';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { LanguageProvider } from '../src/i18n/LanguageProvider.jsx';
import { Catalog } from '../src/catalog/Catalog.jsx';
import { InstallPage } from '../src/release/InstallPage.jsx';
import { AgentPage } from '../src/agents/AgentPage.jsx';

export function renderPage(pathname, manifest) {
  const content = pathname === '/agents' ? <AgentPage /> : pathname === '/install' ? <InstallPage initialManifest={manifest} /> : <Catalog />;
  return new Promise((resolve, reject) => {
    let renderError;
    const output = new PassThrough();
    const chunks = [];
    output.on('data', chunk => chunks.push(chunk));
    output.on('end', () => { clearTimeout(timeout); renderError ? reject(renderError) : resolve(Buffer.concat(chunks).toString('utf8')); });
    output.on('error', error => { clearTimeout(timeout); reject(error); });
    const stream = renderToPipeableStream(<LanguageProvider>{content}</LanguageProvider>, {
      onAllReady() { stream.pipe(output); },
      onShellError(error) { clearTimeout(timeout); reject(error); },
      onError(error) { renderError = error; },
    });
    const timeout = setTimeout(() => { stream.abort(); reject(new Error('Static rendering timed out for ' + pathname)); }, 20000);
  });
}
