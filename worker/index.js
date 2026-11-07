const legacyHost = "tenvell.esher1.chatgpt.site";
const canonicalOrigin = "https://tenvell.space";
const pagePaths = new Set(["/", "/install", "/agents", "/agents.html", "/sample", "/examples/messenger", "/examples/tasks", "/examples/dashboard", "/typeface.html", "/typeface"]);
for (const slug of ['react-glassmorphism-ui-kit','react-dashboard-ui-kit','shadcn-glass-components','choosing-a-react-ui-kit']) for (const prefix of ['/', '/ru/']) pagePaths.add(prefix + slug);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === legacyHost && pagePaths.has(url.pathname) && ["GET", "HEAD"].includes(request.method)) {
      return Response.redirect(canonicalOrigin + url.pathname + url.search, 308);
    }
    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    const reservedPath = /^\/(?:r|releases|assets|fonts|api|docs|skills|ru)(?:\/|$)/.test(url.pathname)
      || /^\/(?:llms(?:-full)?\.txt|robots\.txt|sitemap\.xml|AGENTS\.md|(?:index|install|agents)\.md)$/.test(url.pathname);

    if (response.status !== 404 || reservedPath || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const indexUrl = new URL(request.url);
    // The asset service redirects /index.html to /; fetch the canonical URL
    // so the response body preserves the visitor's requested app route.
    indexUrl.pathname = "/";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
