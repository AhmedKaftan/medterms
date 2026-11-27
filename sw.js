/* Medical Terminology â€“ offline support.
   core: the app itself (refreshed when a new version is published)
   media: slides, thumbnails and audio (kept across versions) */
const VER = "v1224-l5-edits";
const CORE = "mt-core-" + VER, MEDIA = "mt-media-stable";
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
/* v1.2.23: the saved lectures (about 230 MB) are kept across app updates. Only the files that changed are replaced.
   PURGE: [level, [paths]]. A client removes the paths of every level it has not applied yet, then downloads them again when needed. */
const PURGE = [[1, ["narr/L3_25.mp3","narr/L4_08.mp3","narr/L4_20.mp3","narr/L4_21.mp3","narr/L4_21.ogg","narr/L4_22.mp3","narr/L4_22.ogg","narr/L4_23.mp3","narr/L4_23.ogg","narr/L4_24.mp3","narr/L4_24.ogg","narr/L4_25.mp3","narr/L4_25.ogg","narr/L4_26.ogg","narr/L4_27.mp3","narr/L4_27.ogg","narr/L4_28.mp3","narr/L4_28.ogg","narr/L4_29.mp3","narr/L4_29.ogg","narr/L4_30.mp3","narr/L4_30.ogg","narr/L4_31.ogg","narr/L4_32.mp3","narr/L4_32.ogg","narr/L4_33.mp3","narr/L4_33.ogg","narr/L4_34.mp3","narr/L4_34.ogg","narr/L4_35.mp3","narr/L4_35.ogg","narr/L4_36.ogg","narr/L4_37.ogg","narr/L4_38.ogg","narr/L4_39.ogg","narr/L4_40.ogg","narr/L4_41.ogg","narr/L4_42.ogg","narr/L4_43.ogg","narr/L4_44.ogg","narr/L4_45.ogg","narr_f/L3_25.mp3","narr_f/L4_08.mp3","narr_f/L4_20.mp3","narr_f/L4_21.mp3","narr_f/L4_21.ogg","narr_f/L4_22.mp3","narr_f/L4_22.ogg","narr_f/L4_23.mp3","narr_f/L4_23.ogg","narr_f/L4_24.mp3","narr_f/L4_24.ogg","narr_f/L4_25.mp3","narr_f/L4_25.ogg","narr_f/L4_26.ogg","narr_f/L4_27.mp3","narr_f/L4_27.ogg","narr_f/L4_28.mp3","narr_f/L4_28.ogg","narr_f/L4_29.mp3","narr_f/L4_29.ogg","narr_f/L4_30.mp3","narr_f/L4_30.ogg","narr_f/L4_31.ogg","narr_f/L4_32.mp3","narr_f/L4_32.ogg","narr_f/L4_33.mp3","narr_f/L4_33.ogg","narr_f/L4_34.mp3","narr_f/L4_34.ogg","narr_f/L4_35.mp3","narr_f/L4_35.ogg","narr_f/L4_36.ogg","narr_f/L4_37.ogg","narr_f/L4_38.ogg","narr_f/L4_39.ogg","narr_f/L4_40.ogg","narr_f/L4_41.ogg","narr_f/L4_42.ogg","narr_f/L4_43.ogg","narr_f/L4_44.ogg","narr_f/L4_45.ogg","slides/L3_25.webp","slides/L3_39.webp","slides/L3_41.webp","slides/L3_43.webp","slides/L3_44.webp","slides/L3_45.webp","slides/L3_46.webp","slides/L4_06.webp","slides/L4_08.webp","slides/L4_20.webp","slides/L4_21.webp","slides/L4_22.webp","slides/L4_23.webp","slides/L4_24.webp","slides/L4_25.webp","slides/L4_26.webp","slides/L4_27.webp","slides/L4_28.webp","slides/L4_29.webp","slides/L4_30.webp","slides/L4_31.webp","slides/L4_32.webp","slides/L4_33.webp","slides/L4_34.webp","slides/L4_35.webp","slides/L4_36.webp","slides/L4_37.webp","slides/L4_38.webp","slides/L4_39.webp","slides/L4_40.webp","slides/L4_41.webp","slides/L4_42.webp","slides/L4_43.webp","slides/L4_44.webp","slides/L4_45.webp","thumbs/L3_25.webp","thumbs/L3_39.webp","thumbs/L3_41.webp","thumbs/L3_43.webp","thumbs/L3_44.webp","thumbs/L3_45.webp","thumbs/L3_46.webp","thumbs/L4_06.webp","thumbs/L4_08.webp","thumbs/L4_20.webp","thumbs/L4_21.webp","thumbs/L4_22.webp","thumbs/L4_23.webp","thumbs/L4_24.webp","thumbs/L4_25.webp","thumbs/L4_26.webp","thumbs/L4_27.webp","thumbs/L4_28.webp","thumbs/L4_29.webp","thumbs/L4_30.webp","thumbs/L4_31.webp","thumbs/L4_32.webp","thumbs/L4_33.webp","thumbs/L4_34.webp","thumbs/L4_35.webp","thumbs/L4_36.webp","thumbs/L4_37.webp","thumbs/L4_38.webp","thumbs/L4_39.webp","thumbs/L4_40.webp","thumbs/L4_41.webp","thumbs/L4_42.webp","thumbs/L4_43.webp","thumbs/L4_44.webp","thumbs/L4_45.webp"]],[2, ["narr/L5_16.mp3","narr/L5_17.mp3","narr/L5_27.ogg","narr_f/L5_16.mp3","narr_f/L5_17.mp3","narr_f/L5_27.ogg","slides/L5_16.webp","slides/L5_17.webp","slides/L5_27.webp","slides/L5_30.webp","slides/L5_31.webp","slides/L5_35.webp","thumbs/L5_16.webp","thumbs/L5_17.webp","thumbs/L5_27.webp","thumbs/L5_30.webp","thumbs/L5_31.webp","thumbs/L5_35.webp"]]];
async function readLevel(meta){ const r = await meta.match("level"); return r ? (parseInt(await r.text(), 10) || 0) : 0; }
async function mediaUpkeep(){
  const base = new URL(self.registration.scope).pathname;
  const rel = req => decodeURIComponent(new URL(req.url).pathname.slice(base.length));
  const meta = await caches.open("mt-meta");
  const level = await readLevel(meta);
  const ks = await caches.keys();
  const dst = await caches.open(MEDIA);
  const stale = new Set();
  for(const [lv, paths] of PURGE) if(lv > level) paths.forEach(p => stale.add(p));
  // 1) bring over saved media from the per-version caches of v1.2.18 .. v1.2.22 (never the files that changed since)
  for(const k of ks.filter(k => /^mt-media-v12(1[89]|2\d)-/.test(k) && k !== MEDIA)){
    const src = await caches.open(k);
    for(const req of await src.keys()){
      if(stale.has(rel(req))) continue;
      if(await dst.match(req)) continue;
      const res = await src.match(req);
      if(res) await dst.put(req, res);
    }
  }
  // 2) remove the changed files from the stable cache
  for(const req of await dst.keys()) if(stale.has(rel(req))) await dst.delete(req);
  await meta.put("level", new Response(String(Math.max(level, ...PURGE.map(p => p[0])))));
}
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    try{ await mediaUpkeep(); }catch(err){}
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => (k.startsWith("mt-core-") && k !== CORE) || (k.startsWith("mt-media-") && k !== MEDIA)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
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
