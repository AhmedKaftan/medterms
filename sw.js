/* Medical Terminology â€“ offline support.
   core: the app itself (refreshed when a new version is published)
   media: slides, thumbnails and audio (kept across versions) */
const VER = "v1218-voices-ready";
const CORE = "mt-core-" + VER, MEDIA = "mt-media-v1218-voices-ready";
const CORE_FILES = ["./", "index.html", "data.js", "lecq.js", "facts.js", "narr.js", "narr_ar.js", "modules.js", 
  "app_logo.svg", "manifest.webmanifest", "files.json", "icons/icon-192.png", "icons/icon-512.png",
  "icons/apple-touch-icon.png", "icons/icon-maskable-512.png", "fonts/atkinson-hyperlegible-latin-400-italic.woff2", "fonts/atkinson-hyperlegible-latin-400-normal.woff2", "fonts/atkinson-hyperlegible-latin-700-normal.woff2", "fonts/bricolage-grotesque-latin-400-normal.woff2", "fonts/bricolage-grotesque-latin-700-normal.woff2", "fonts/bricolage-grotesque-latin-800-normal.woff2", "fonts/cairo-arabic-400-normal.woff2", "fonts/cairo-arabic-600-normal.woff2", "fonts/cairo-arabic-700-normal.woff2", "fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2", "fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2", "fonts/ibm-plex-sans-latin-400-normal.woff2", "fonts/ibm-plex-sans-latin-500-normal.woff2", "fonts/ibm-plex-sans-latin-600-normal.woff2", "fonts/ibm-plex-sans-latin-700-normal.woff2", "fonts/montserrat-latin-400-normal.woff2", "fonts/montserrat-latin-600-normal.woff2", "fonts/montserrat-latin-800-normal.woff2"];
const isMedia = p => /^(slides|thumbs|audio|narr|narr_f)\//.test(p);

/* v1.2.9: a redirected response (e.g. /index.html -> /) cannot answer a page navigation (ERR_FAILED), so rebuild it as a plain response. */
async function clean(res){
  if(!res || !res.redirected) return res;
  return new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: res.headers });
}
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CORE).then(async c => {
    for(const f of CORE_FILES){
      const r = await fetch(new Request(f, { cache: "reload" }));
      if(!r.ok) throw new Error("fetch failed " + f);
      await c.put(new Request(f), await clean(r));
    }
  }).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => (k.startsWith("mt-core-") && k !== CORE) || (k.startsWith("mt-media-") && k !== MEDIA)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function fromCacheOrNet(req, path){
  const media = isMedia(path);
  const key = new Request(new URL(path, self.registration.scope).href);
  const hit = await caches.match(key, { ignoreSearch: true });
  if(hit) return clean(hit);
  const res = await clean(await fetch(key));  // full file, never a range
  if(res.ok && res.status === 200){
    const c = await caches.open(media ? MEDIA : CORE);
    await c.put(key, res.clone());
  }
  return res;
}

// Safari asks for audio in byte ranges; answer them from the cached full file.
async function ranged(res, range){
  const buf = await res.arrayBuffer(), size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(range || "");
  let a = m && m[1] ? +m[1] : 0, b = m && m[2] ? +m[2] : size - 1;
  if(m && !m[1] && m[2]){ a = Math.max(0, size - +m[2]); b = size - 1; }
  b = Math.min(b, size - 1);
  if(!m || a >= size || b < a || a < 0) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  return new Response(buf.slice(a, b + 1), { status: 206, statusText: "Partial Content", headers: {
    "Content-Type": res.headers.get("Content-Type") || "audio/mpeg",
    "Content-Range": `bytes ${a}-${b}/${size}`, "Content-Length": String(b - a + 1), "Accept-Ranges": "bytes" } });
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url), scope = new URL(self.registration.scope);
  if(url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  let path = decodeURIComponent(url.pathname.slice(scope.pathname.length)) || "index.html";
  if(req.mode === "navigate") path = "index.html";
  e.respondWith((async () => {
    try{
      const res = await fromCacheOrNet(req, path);
      const range = req.headers.get("range");
      if(range && res.status === 200) return ranged(res, range);
      return res;
    }catch(err){
      const fall = await caches.match(new URL("index.html", self.registration.scope).href);
      if(req.mode === "navigate" && fall) return fall;
      return new Response("Offline and not saved yet", { status: 503 });
    }
  })());
});
