const legacyHost = "tenvell.esher1.chatgpt.site";
const canonicalOrigin = "https://tenvell.space";
const pagePaths = new Set(["/", "/install", "/sample", "/examples/messenger", "/examples/tasks", "/examples/dashboard", "/typeface.html", "/typeface"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === legacyHost && pagePaths.has(url.pathname) && ["GET", "HEAD"].includes(request.method)) {
      return Response.redirect(canonicalOrigin + url.pathname + url.search, 308);
    }
    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    const reservedPath = /^\/(?:r|releases|assets|fonts|api)(?:\/|$)/.test(url.pathname);

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
