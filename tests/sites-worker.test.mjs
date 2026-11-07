import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

test("legacy page links move to tenvell.space with their path and query", async () => {
  for (const pathname of ["/", "/install", "/sample", "/examples/messenger", "/examples/tasks", "/examples/dashboard", "/typeface.html", "/typeface"]) {
    for (const method of ["GET", "HEAD"]) {
      let assetCalls = 0;
      const response = await worker.fetch(new Request("https://tenvell.esher1.chatgpt.site" + pathname + "?lang=ru&source=share", {method}), {
        ASSETS: {fetch: async () => {assetCalls++; return new Response("old page");}},
      });
      assert.equal(response.status, 308, pathname + " must redirect");
      assert.equal(response.headers.get("location"), "https://tenvell.space" + pathname + "?lang=ru&source=share");
      assert.equal(assetCalls, 0);
    }
  }
});

test("legacy registry, agent docs and versioned downloads remain direct and missing assets stay 404", async () => {
  for (const pathname of ["/r/registry.json", "/r/button.json", "/releases/0.2.0/tenvell-0.2.0.tgz", "/assets/app.js", "/fonts/lamina-ui-regular.woff2", "/api/missing", "/llms.txt", "/llms-full.txt", "/AGENTS.md", "/docs/missing.md", "/skills/missing/SKILL.md", "/robots.txt", "/sitemap.xml"]) {
    for (const status of [200, 404]) {
      const response = await worker.fetch(new Request("https://tenvell.esher1.chatgpt.site" + pathname, {headers: {accept: "text/html"}}), {
        ASSETS: {fetch: async (request) => new Response("asset response", {status: new URL(request.url).pathname === "/" ? 200 : status})},
      });
      assert.equal(response.status, status, pathname);
      assert.equal(response.headers.get("location"), null);
    }
  }
});

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("falls back to the root document for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/" ? "app" : "missing", {
            status: url.pathname === "/" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/"]);
});

test("preserves deep links when the asset service canonicalizes index.html", async () => {
  for (const method of ["GET", "HEAD"]) {
    const response = await worker.fetch(
      new Request("https://example.test/install?source=share", {
        method,
        headers: { accept: "text/html,application/xhtml+xml" },
      }),
      { ASSETS: { fetch: async (request) => {
        const pathname = new URL(request.url).pathname;
        if (pathname === "/index.html") return new Response(null, { status: 307, headers: { location: "/" } });
        if (pathname === "/") return new Response(method === "HEAD" ? null : "app", { headers: { "content-type": "text/html" } });
        return new Response(null, { status: 404 });
      } } },
    );
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("location"), null);
    assert.equal(await response.text(), method === "HEAD" ? "" : "app");
  }
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
});
