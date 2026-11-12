/* =========================================================
   Service worker aplikasi Guru Vokasi
   ---------------------------------------------------------
   Semuanya otomatis — TIDAK perlu mengubah file ini saat
   menambah simulasi. Cukup tambah baris di daftar SIMULASI
   pada index.html.

   Cara kerja:
   1. Halaman & file situs diambil dari internet dulu (selalu
      versi terbaru). Kalau offline, dipakai salinan tersimpan.
   2. Setiap kali menu dibuka saat online, aplikasi membaca
      daftar SIMULASI di menu, lalu mengunduh di latar belakang
      setiap simulasi (beserta file .js, gambar, dan library 3D-nya)
      yang belum tersimpan.
   3. Maksimal tiap 6 jam, salinan tersimpan dicek ke GitHub.
      File yang berubah diperbarui; yang tidak berubah tidak
      diunduh ulang (hemat kuota murid).
   ========================================================= */
const VERSI = 'guruvokasi-v2';
const CACHE = 'guruvokasi-isi';
const CDN_CACHE = 'guruvokasi-cdn-v1';
const CACHE_LAMA = ['guruvokasi-v1'];          // dipindahkan ke CACHE, lalu dihapus
const JEDA_CEK = 6 * 60 * 60 * 1000;            // jeda pengecekan pembaruan: 6 jam
const KUNCI_WAKTU = '__sinkron-terakhir';

const INTI = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png',
              'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon-48.png'];
const TAMBAHAN = [];   // opsional: halaman di luar menu yang ingin ikut tersimpan, mis. 'folder-lain/'
const CDN_HOSTS = ['cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'unpkg.com',
                   'fonts.googleapis.com', 'fonts.gstatic.com'];
const CDN_UTAMA = ['cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com']; // cadangan jsdelivr/unpkg tidak diunduh di muka

const SCOPE = self.registration.scope;
const url = (u, base = SCOPE) => new URL(u, base).href;
const tanpaQuery = (u) => { const x = new URL(u); x.search = ''; x.hash = ''; return x.href; };
const lokal = (u) => u.startsWith(SCOPE);
const cdn = (u) => { try { return CDN_HOSTS.includes(new URL(u).hostname); } catch { return false; } };

function denganBatas(p, ms) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

/* ---------------- install & activate ---------------- */
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(INTI.map(u => fetch(url(u), {cache: 'no-cache'})
      .then(r => r.ok && c.put(url(u), r)).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    for (const nama of CACHE_LAMA) {                 // pindahkan isi cache versi lama
      if (!(await caches.has(nama))) continue;
      const lama = await caches.open(nama);
      for (const req of await lama.keys()) {
        if (!(await c.match(req))) { const r = await lama.match(req); if (r) await c.put(req, r); }
      }
    }
    const simpan = [CACHE, CDN_CACHE];
    await Promise.all((await caches.keys()).filter(k => !simpan.includes(k)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
  sinkron();   // mulai mengunduh simulasi di latar belakang
});

/* ---------------- permintaan halaman ---------------- */
async function internetDulu(req) {
  const c = await caches.open(CACHE);
  const kunci = tanpaQuery(req.url);
  try {
    const res = await denganBatas(fetch(req), 6000);
    if (res && res.ok) await c.put(kunci, res.clone());
    return res;
  } catch (err) {
    const hit = await c.match(kunci);
    if (hit) return hit;
    if (req.mode === 'navigate') {
      const menu = await c.match(SCOPE);
      if (menu) return menu;
    }
    return new Response('Offline: halaman ini belum tersimpan. Buka aplikasi sekali saat online.', {
      status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}
    });
  }
}

async function tersimpanDulu(req) {
  const c = await caches.open(CDN_CACHE);
  const hit = await c.match(req.url, {ignoreVary: true});
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) await c.put(req.url, res.clone());
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (lokal(req.url)) {
    const p = internetDulu(req);
    e.respondWith(p);
    const path = new URL(req.url).pathname;
    const bukaMenu = req.mode === 'navigate' && (tanpaQuery(req.url) === SCOPE || path.endsWith('/index.html') && url('index.html') === tanpaQuery(req.url));
    if (bukaMenu) e.waitUntil(p.then(() => sinkron()).catch(() => {}));
  } else if (cdn(req.url)) {
    e.respondWith(tersimpanDulu(req));
  }
  // lainnya (mis. Clarity) dibiarkan lewat internet seperti biasa
});

/* ---------------- sinkronisasi otomatis ---------------- */
let berjalan = null;
function sinkron() {
  if (!berjalan) berjalan = _sinkron().catch(() => {}).finally(() => { berjalan = null; });
  return berjalan;
}

function asetDariHtml(html, base) {
  const hasil = new Set();
  const tambah = (u) => {
    if (!u || /^(data:|blob:|#|mailto:|javascript:|tel:)/i.test(u)) return;
    const abs = url(u, base);
    if (lokal(abs)) hasil.add(tanpaQuery(abs));
    else if (cdn(abs) && CDN_UTAMA.includes(new URL(abs).hostname)) hasil.add(abs);
  };
  for (const m of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) tambah(m[1]);
  for (const m of html.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) tambah(m[1]);
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    const rel = (tag.match(/\brel\s*=\s*["']([^"']+)["']/i) || [])[1] || '';
    if (/preconnect|dns-prefetch|canonical|alternate/i.test(rel)) continue;
    const href = (tag.match(/\bhref\s*=\s*["']([^"']+)["']/i) || [])[1];
    tambah(href);
  }
  for (const m of html.matchAll(/\bload\(\s*["']([^"']+\.(?:js|css))["']\s*\)/g)) tambah(m[1]);
  return hasil;
}

async function ambilSimpan(u) {
  const tujuan = lokal(u) ? CACHE : CDN_CACHE;
  const c = await caches.open(tujuan);
  try {
    const res = await denganBatas(fetch(u, lokal(u) ? {cache: 'no-cache'} : {mode: 'cors'}), 20000);
    if (!res.ok) return null;
    await c.put(u, res.clone());
    // font Google: simpan juga file font yang dirujuk CSS-nya
    if (new URL(u).hostname === 'fonts.googleapis.com') {
      const css = await res.clone().text();
      const fonts = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)].map(m => m[1]);
      await kerjakan(fonts, async (f) => { if (!(await c.match(f))) await ambilSimpan(f); }, 3);
    }
    return res;
  } catch { return null; }
}

async function tersimpan(u) {
  const c = await caches.open(lokal(u) ? CACHE : CDN_CACHE);
  return c.match(u, {ignoreVary: true});
}

async function kerjakan(daftar, fn, paralel = 3) {
  const antre = [...daftar];
  await Promise.all(Array.from({length: paralel}, async () => {
    while (antre.length) { const x = antre.shift(); try { await fn(x); } catch {} }
  }));
}

async function cekPembaruan(c) {
  const terakhir = await c.match(KUNCI_WAKTU);
  const waktu = terakhir ? Number(await terakhir.text()) : 0;
  if (Date.now() - waktu < JEDA_CEK) return;
  const daftar = (await c.keys()).map(r => r.url).filter(u => lokal(u) && !u.endsWith(KUNCI_WAKTU));
  await kerjakan(daftar, async (u) => {
    const lama = await c.match(u);
    const h = {};
    const etag = lama && lama.headers.get('ETag');
    const lm = lama && lama.headers.get('Last-Modified');
    if (etag) h['If-None-Match'] = etag; else if (lm) h['If-Modified-Since'] = lm;
    const res = await denganBatas(fetch(u, {headers: h, cache: 'no-store'}), 20000);
    if (res.status === 200) await c.put(u, res);           // berubah → simpan versi baru
    else if (res.status === 404) await c.delete(u);        // sudah dihapus dari situs
  }, 3);
  await c.put(KUNCI_WAKTU, new Response(String(Date.now())));
}

async function _sinkron() {
  if (self.navigator && self.navigator.onLine === false) return;
  const c = await caches.open(CACHE);

  await cekPembaruan(c);

  // daftar halaman = inti + semua folder di daftar SIMULASI pada menu + tambahan
  let menu = await c.match(SCOPE);
  if (!menu) menu = await ambilSimpan(SCOPE);
  if (!menu) return;
  const teksMenu = await menu.clone().text();
  const folder = [...teksMenu.matchAll(/\bfolder\s*:\s*["']([^"']+)["']/g)].map(m => m[1].replace(/\/+$/, ''));
  const halaman = [...new Set([
    ...INTI.map(u => url(u)),
    ...folder.map(f => url(encodeURI(f) + '/')),
    ...TAMBAHAN.map(u => url(u)),
  ])];

  // pastikan setiap halaman tersimpan, lalu kumpulkan file pendukungnya
  const aset = new Set();
  await kerjakan(halaman, async (h) => {
    let res = await tersimpan(h);
    if (!res) res = await ambilSimpan(h);
    if (!res) return;
    const tipe = res.headers.get('Content-Type') || '';
    if (tipe.includes('text/html')) {
      for (const a of asetDariHtml(await res.clone().text(), h)) aset.add(a);
    }
  }, 3);

  // unduh file pendukung yang belum tersimpan
  await kerjakan([...aset], async (a) => { if (!(await tersimpan(a))) await ambilSimpan(a); }, 3);
}
