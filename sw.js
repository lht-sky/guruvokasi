/* Service worker Guru Vokasi
   - Halaman & file situs: ambil dari internet dulu (selalu versi terbaru),
     kalau offline pakai salinan tersimpan.
   - Library dari CDN (Three.js, font): simpan sekali, pakai terus.
   Saat menambah simulasi baru: tambahkan foldernya ke PRECACHE dan naikkan VERSI. */
const VERSI = 'guruvokasi-v1';
const CDN_CACHE = 'guruvokasi-cdn-v1';

const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./favicon-48.png",
  "./Simulasi_3D_Panel_DOL/",
  "./Simulasi_3D_Panel_DOL/orbit-controls.js",
  "./Simulasi_3D_Panel_Forward-Reverse/",
  "./Simulasi_3D_Panel_Forward-Reverse/orbit-controls.js",
  "./Simulasi_3D_Panel_Star-Delta/",
  "./Simulasi_3D_Panel_Star-Delta/orbit-controls.js",
  "./bengkel-aman-toi/",
  "./buku-saku-toi/",
  "./pabrik-tycoon/common.js",
  "./pabrik-tycoon/engine.js",
  "./pabrik-tycoon/",
  "./pabrik-tycoon/k3.js",
  "./pabrik-tycoon/main.js",
  "./pabrik-tycoon/shop.js",
  "./pabrik-tycoon/tp1.js",
  "./pabrik-tycoon/tp10.js",
  "./pabrik-tycoon/tp11.js",
  "./pabrik-tycoon/tp2.js",
  "./pabrik-tycoon/tp3.js",
  "./pabrik-tycoon/tp4.js",
  "./pabrik-tycoon/tp5.js",
  "./pabrik-tycoon/tp6.js",
  "./pabrik-tycoon/tp7.js",
  "./pabrik-tycoon/tp8.js",
  "./pabrik-tycoon/tp9.js",
  "./pabrik-tycoon/world.js",
  "./pkl-bengkel-maju-jaya/engine.js",
  "./pkl-bengkel-maju-jaya/game.js",
  "./pkl-bengkel-maju-jaya/",
  "./pkl-bengkel-maju-jaya/world.js",
  "./pneumatik-tycoon/apd.js",
  "./pneumatik-tycoon/common.js",
  "./pneumatik-tycoon/engine.js",
  "./pneumatik-tycoon/",
  "./pneumatik-tycoon/l1.js",
  "./pneumatik-tycoon/main.js",
  "./pneumatik-tycoon/shop.js",
  "./pneumatik-tycoon/world.js",
  "./simulasi-3D-kode-warna-resistor/",
  "./simulasi-3D-multimeter-digital/",
  "./simulasi-3d-hukum-ohm/",
  "./studio-gamtek-tm/",
];
const PRECACHE_CDN = [
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSI);
    await Promise.all(PRECACHE.map(u => fetch(u, {cache: 'reload'})
      .then(r => r.ok && c.put(u, r)).catch(() => {})));
    const cdn = await caches.open(CDN_CACHE);
    await Promise.all(PRECACHE_CDN.map(u => fetch(u, {mode: 'cors'})
      .then(r => r.ok && cdn.put(u, r)).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSI && k !== CDN_CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const CDN_HOSTS = ['cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

function timeout(ms) { return new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)); }

async function networkFirst(req) {
  const c = await caches.open(VERSI);
  try {
    const res = await Promise.race([fetch(req), timeout(6000)]);
    if (res && res.ok) c.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await c.match(req, {ignoreSearch: true});
    if (hit) return hit;
    if (req.mode === 'navigate') {
      const home = await c.match('./');
      if (home) return home;
    }
    return new Response('Offline: halaman ini belum pernah dibuka saat online.', {
      status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}
    });
  }
}

async function cacheFirst(req) {
  const c = await caches.open(CDN_CACHE);
  const hit = await c.match(req, {ignoreVary: true});
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    e.respondWith(networkFirst(req));
  } else if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith(cacheFirst(req));
  }
  // lainnya (mis. Clarity) dibiarkan lewat internet seperti biasa
});
