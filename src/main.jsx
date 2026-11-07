import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import {LanguageProvider} from './i18n/LanguageProvider.jsx';
import {discoveryRoute} from './discovery/routes.js';

// Keep the rendered document readable while a standalone page's chunk loads.
// Mounting a lazy route immediately would replace useful HTML with a spinner.
async function mount() {
  const pathname = window.location.pathname;
  const Page = discoveryRoute(pathname)
    ? (await import('./discovery/GuidePage.jsx')).GuidePage
    : ["/agents", "/agents.html"].includes(pathname)
    ? (await import('./agents/AgentPage.jsx')).AgentPage
    : ["/install", "/install.html"].includes(pathname)
      ? (await import('./release/InstallPage.jsx')).InstallPage
      : App;
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <LanguageProvider><Page /></LanguageProvider>
    </React.StrictMode>,
  );
}

mount();
