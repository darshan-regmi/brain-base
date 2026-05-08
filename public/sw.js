// Brain Base — minimal service worker for offline shell.
// Strategy:
//   - HTML/document: network-first (so updates land), fall back to cached shell.
//   - Static assets (_next/static, fonts, images): cache-first.
//   - Everything else: network-only.

const VERSION = "v1";
const SHELL_CACHE = `bb-shell-${VERSION}`;
const ASSET_CACHE = `bb-assets-${VERSION}`;
const SHELL_URL = "/dashboard";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.add(SHELL_URL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.endsWith(VERSION))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Skip API routes — always live
  if (url.pathname.startsWith("/api/")) return;

  // HTML: network-first
  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(SHELL_URL, copy));
          return res;
        })
        .catch(() => caches.match(SHELL_URL).then((m) => m || new Response("Offline", { status: 503 }))),
    );
    return;
  }

  // Static assets: cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    /\.(png|jpg|jpeg|svg|gif|webp|woff2?|ttf|otf|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(req).then(
        (m) =>
          m ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(ASSET_CACHE).then((c) => c.put(req, copy));
            return res;
          }),
      ),
    );
  }
});
