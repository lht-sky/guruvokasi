/* PKL Bengkel Las Maju Jaya — alur PKL, order, minigame stasiun, penilaian, sertifikat */
(function(){
'use strict';
const {el,btn,row,modal,closeModal,W}=G;const N=G.NPC;
const $id=id=>document.getElementById(id);
const S=G.save;
S.done=S.done||{};S.tries=S.tries||{};S.journal=S.journal||[];S.day=S.day||1;S.next=S.next||0;S.gear=S.gear||{};
S.skills=S.skills||{K1:[],K2:[],K3:[],K4:[],K5:[],K6:[],K7:[]};
G.cur=null;
const UI={mentor:'',hold:null};
let workOpen=false,stepRes=null,goal=null,busy=false;
const save=()=>G.persist();
const toast=(m,k)=>G.toast(m,k);
const esc=G.esc,clamp=G.clamp,pick=G.pick;
const dec=(n,d=2)=>Number(n).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
const dnum=n=>Number(n).toLocaleString('id-ID',{maximumFractionDigits:2});
const rnd=(a,b)=>a+Math.random()*(b-a);
const r05=v=>Math.round(v*20)/20;
const parse=v=>parseFloat(String(v).replace(',','.'));
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const predikat=n=>n>=90?'Sangat baik':n>=80?'Baik':n>=70?'Cukup':'Perlu bimbingan';
const World={ok:false,anim(){G.sfx('tap');},drill(p){W.drillP=p;},bit(){},scribe(){},drilling(on){W.drillOn=on;if(on)G.sfx('beep');},focus(){}};
function say(t){UI.mentor=t;redraw();}
function jot(t){S.journal.unshift({d:S.day,t});S.journal=S.journal.slice(0,80);}
/* ===================== DATA ===================== */
const KEY = 'pklBengkelMajuJaya.v1';
const SKILLS = {
  K1: 'Keselamatan kerja (APD)', K2: 'Membaca gambar kerja', K3: 'Mengukur dengan jangka sorong',
  K4: 'Menandai & memotong', K5: 'Mengikir', K6: 'Mengebor', K7: 'Mengetap'
};
const STN = { kantor: 'Kantor', ukur: 'Meja ukur', meja: 'Meja kerja', potong: 'Area potong', bor: 'Bor duduk' };
const STEP = {
  gambar: { name: 'Baca gambar kerja', st: 'kantor', k: 'K2' },
  tandai: { name: 'Menandai', st: 'ukur', k: 'K4' },
  potong: { name: 'Menggergaji', st: 'potong', k: 'K4', apd: 'potong' },
  kikir:  { name: 'Mengikir', st: 'meja', k: 'K5', apd: 'kikir' },
  bor:    { name: 'Mengebor', st: 'bor', k: 'K6', apd: 'bor' },
  tap:    { name: 'Mengetap', st: 'meja', k: 'K7', apd: 'tap' },
  ukur:   { name: 'Mengukur & memeriksa', st: 'ukur', k: 'K3' },
  ulir:   { name: 'Uji ulir dengan baut', st: 'meja', k: 'K7' }
};
const APDS = { wearpack: 'Wearpack', sepatu: 'Sepatu safety', kacamata: 'Kacamata safety', sarung: 'Sarung tangan kulit' };
const APD_RULE = {
  potong: { req: ['wearpack', 'sepatu', 'kacamata', 'sarung'], forbid: [] },
  kikir:  { req: ['wearpack', 'sepatu', 'kacamata'], forbid: [] },
  bor:    { req: ['wearpack', 'sepatu', 'kacamata'], forbid: ['sarung'] },
  tap:    { req: ['wearpack', 'sepatu'], forbid: [] }
};
const APD_WHY = {
  potong: 'Saat menggergaji, kacamata menahan serpihan dan sarung tangan kulit melindungi tangan dari tepi plat yang tajam.',
  kikir: 'Saat mengikir, kacamata menahan serbuk besi yang beterbangan. Sarung tangan boleh dipakai.',
  bor: 'Saat mengebor, sarung tangan DILARANG karena bisa terlilit mata bor yang berputar. Kacamata wajib.',
  tap: 'Mengetap dengan tangan cukup memakai wearpack dan sepatu safety. Sarung tangan dan kacamata boleh.'
};
const RPM_OPTS = [450, 700, 1000, 1500, 2500];
const VC = 25;
const nRec = d => Math.round(1000 * VC / (Math.PI * d));

const ORDERS = [
  { id: 'pin', title: 'Cek ukuran pin as rem', cust: 'Bengkel Motor Abadi', veh: 'motor', vcol: 0x2F7D4A, guide: 'full', qty: 3, unit: 'pin',
    brief: 'Pelanggan membawa 3 pin as rem bekas. Periksa apakah diameternya masih sesuai gambar.',
    spec: { kind: 'pin', d: 12, tol: 0.1, L: 60 },
    q: [{ l: 'Diameter pin yang diminta (mm)', a: 12, h: 'Lihat angka bertanda Ø pada gambar.' }, { l: 'Toleransi ± (mm)', a: 0.1, h: 'Angka setelah tanda ± adalah toleransinya.' }, { l: 'Batas ukuran terkecil (mm)', a: 11.9, h: 'Ukuran terkecil = diameter dikurangi toleransi.' }],
    steps: [{ t: 'gambar' }, { t: 'ukur', what: ['pin'] }] },
  { id: 'shim', title: 'Plat ganjal dudukan mesin', cust: 'Bengkel Mobil Sinar Jaya', veh: 'pickup', vcol: 0x3B3F44, guide: 'full', qty: 1, unit: 'pcs',
    brief: 'Pelanggan butuh plat ganjal untuk menaikkan dudukan mesin. Tandai, potong, lalu kikir plat sesuai gambar.',
    spec: { kind: 'plate', L: 60, W: 40, T: 5, tol: 0.1, holes: [] },
    q: [{ l: 'Panjang plat (mm)', a: 60, h: 'Angka di garis ukur horizontal paling bawah.' }, { l: 'Lebar plat (mm)', a: 40, h: 'Angka di garis ukur vertikal.' }, { l: 'Toleransi panjang ± (mm)', a: 0.1, h: 'Lihat angka setelah tanda ± pada ukuran panjang.' }],
    steps: [{ t: 'gambar' }, { t: 'tandai', mode: 'garis' }, { t: 'potong' }, { t: 'kikir' }, { t: 'ukur', what: ['panjang'] }] },
  { id: 'sambung', title: 'Plat penyambung rangka', cust: 'CV Karoseri Mitra Abadi', veh: 'pickup', vcol: 0xF2F2EE, guide: 'full', qty: 1, unit: 'pcs',
    brief: 'Plat sudah dipotong oleh Mas Dodi. Tugasmu menandai titik lubang dan mengebor 2 lubang untuk baut M10.',
    spec: { kind: 'plate', L: 120, W: 50, T: 5, tol: 0.2, holes: [25, 95], hole: { type: 'lewat', bolt: 'M10', d: 11, label: '2× lubang lewat M10 (kelas sedang)' } },
    q: [{ l: 'Jarak lubang pertama dari tepi kiri (mm)', a: 25, h: 'Lihat garis ukur di atas plat, dari tepi kiri ke garis sumbu lubang.' }, { l: 'Jarak antar lubang (mm)', a: 70, h: 'Garis ukur di antara dua garis sumbu lubang.' }, { l: 'Diameter lubang lewat sedang untuk M10 (mm)', a: 11, h: 'Buka tab Buku saku, lihat tabel lubang baut baris M10.' }],
    steps: [{ t: 'gambar' }, { t: 'tandai', mode: 'titik' }, { t: 'bor' }, { t: 'ukur', what: ['lubang'] }] },
  { id: 'ulir', title: 'Ulir dudukan knalpot M8', cust: 'Bengkel Knalpot Sumber Rejeki', veh: 'motor', vcol: 0x1D4B70, guide: 'full', qty: 1, unit: 'pcs',
    brief: 'Plat dudukan knalpot perlu satu lubang berulir M8 untuk baut penahan.',
    spec: { kind: 'plate', L: 60, W: 40, T: 5, tol: 0.2, holes: [30], hole: { type: 'tap', bolt: 'M8', d: 6.8, label: 'M8×1,25 tembus' } },
    q: [{ l: 'Ukuran ulir: M…', a: 8, h: 'Lihat tulisan M di dekat lubang.' }, { l: 'Jarak lubang dari tepi kiri (mm)', a: 30, h: 'Garis ukur di atas plat.' }, { l: 'Diameter bor sebelum di-tap M8 (mm)', a: 6.8, h: 'Buka tab Buku saku, kolom "bor sebelum tap".' }],
    steps: [{ t: 'gambar' }, { t: 'tandai', mode: 'titik' }, { t: 'bor' }, { t: 'tap' }, { t: 'ulir' }] },
  { id: 'lampu', title: 'Plat dudukan lampu kabut', cust: 'Toko Variasi Mobil Sinar Abadi', veh: 'pickup', vcol: 0xB23A2E, guide: 'hint', qty: 1, unit: 'pcs',
    brief: 'Order gabungan pertama. Pak Mandor hanya membantu kalau kamu menekan Petunjuk.',
    spec: { kind: 'plate', L: 180, W: 50, T: 5, tol: 0.2, holes: [30, 150], hole: { type: 'lewat', bolt: 'M8', d: 9, label: '2× lubang lewat M8 (kelas sedang)' } },
    q: [{ l: 'Panjang plat (mm)', a: 180, h: 'Garis ukur paling bawah.' }, { l: 'Jarak lubang pertama dari tepi kiri (mm)', a: 30, h: 'Garis ukur di atas plat.' }, { l: 'Jarak antar lubang (mm)', a: 120, h: 'Garis ukur di antara dua sumbu lubang.' }, { l: 'Diameter lubang lewat sedang untuk M8 (mm)', a: 9, h: 'Tabel lubang baut di Buku saku.' }],
    steps: [{ t: 'gambar' }, { t: 'tandai', mode: 'garis' }, { t: 'potong' }, { t: 'kikir' }, { t: 'tandai', mode: 'titik' }, { t: 'bor' }, { t: 'ukur', what: ['panjang', 'lubang'] }] },
  { id: 'uji', title: 'Uji keahlian: plat dudukan sensor', cust: 'PT Prima Komponen Otomotif', veh: 'pickup', vcol: 0xF2F2EE, guide: 'none', exam: true, qty: 1, unit: 'pcs',
    brief: 'Ini uji keahlian tahap 1. Kerjakan sendiri. Petunjuk tetap ada, tetapi setiap petunjuk mengurangi nilai 10. Lulus jika nilai minimal 70.',
    spec: { kind: 'plate', L: 80, W: 40, T: 5, tol: 0.1, holes: [20, 60], hole: { type: 'tap', bolt: 'M8', d: 6.8, label: '2× M8×1,25 tembus' } },
    q: [{ l: 'Panjang plat (mm)', a: 80, h: 'Garis ukur paling bawah.' }, { l: 'Toleransi panjang ± (mm)', a: 0.1, h: 'Angka setelah ±.' }, { l: 'Jarak antar lubang (mm)', a: 40, h: 'Garis ukur di antara sumbu lubang.' }, { l: 'Diameter bor sebelum di-tap M8 (mm)', a: 6.8, h: 'Tabel lubang baut di Buku saku.' }],
    steps: [{ t: 'gambar' }, { t: 'tandai', mode: 'garis' }, { t: 'potong' }, { t: 'kikir' }, { t: 'tandai', mode: 'titik' }, { t: 'bor' }, { t: 'tap' }, { t: 'ukur', what: ['panjang'] }, { t: 'ulir' }] }
];
const LOCKED = [
  { n: 2, title: 'Bubut & milling', desc: 'Membubut poros dan bushing, mengefrais alur dan bidang rata. Order bisa terpisah atau gabungan.' },
  { n: 3, title: 'CNC', desc: 'Membaca program G-code sederhana, setting benda kerja, dan menjalankan mesin CNC.' }
];


/* ===================== DRAWINGS ===================== */
let svgN = 0;
function svgOpen(h) {
  const id = 'ar' + (++svgN);
  return { id, head: `<svg viewBox="0 0 560 ${h}" role="img" aria-label="Gambar kerja"><defs><marker id="${id}" viewBox="0 0 8 6" refX="8" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse"><path class="bp-fill" d="M0,0 L8,3 L0,6 z"/></marker><pattern id="g${id}" width="20" height="20" patternUnits="userSpaceOnUse"><path class="bp-gridl" d="M20 0H0V20"/></pattern></defs><rect width="560" height="${h}" fill="url(#g${id})"/>` };
}
function dimH(m, x1, x2, y, label, yFrom) { const e = y > yFrom ? 4 : -4; return `<line class="bp-thin" x1="${x1}" y1="${yFrom}" x2="${x1}" y2="${y + e}"/><line class="bp-thin" x1="${x2}" y1="${yFrom}" x2="${x2}" y2="${y + e}"/><line class="bp-thin" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" marker-start="url(#${m})" marker-end="url(#${m})"/><text class="bp-txt" x="${(x1 + x2) / 2}" y="${y - 5}" text-anchor="middle">${label}</text>`; }
function dimV(m, y1, y2, x, label, xFrom) { const e = x > xFrom ? 4 : -4, my = (y1 + y2) / 2; return `<line class="bp-thin" x1="${xFrom}" y1="${y1}" x2="${x + e}" y2="${y1}"/><line class="bp-thin" x1="${xFrom}" y1="${y2}" x2="${x + e}" y2="${y2}"/><line class="bp-thin" x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" marker-start="url(#${m})" marker-end="url(#${m})"/><text class="bp-txt" x="${x - 5}" y="${my}" text-anchor="middle" transform="rotate(-90 ${x - 5} ${my})">${label}</text>`; }
function titleBlock(x, y, lines) { let s = `<rect class="bp-thin" x="${x}" y="${y}" width="${548 - x}" height="${lines.length * 17 + 12}"/>`; lines.forEach((l, i) => { s += `<text class="${i === 0 ? 'bp-ttl' : 'bp-txt'}" x="${x + 8}" y="${y + 18 + i * 17}">${esc(l)}</text>`; }); return s; }
function drawing(o) {
  const sp = o.spec;
  if (sp.kind === 'pin') {
    const { id: m, head } = svgOpen(280), s = 4, x = 70, y = 90, w = sp.L * s, h = sp.d * s * 2.2;
    let g = head + `<path class="bp-line" d="M${x + 6},${y} H${x + w - 6} L${x + w},${y + 6} V${y + h - 6} L${x + w - 6},${y + h} H${x + 6} L${x},${y + h - 6} V${y + 6} Z"/><line class="bp-ctr" x1="${x - 14}" y1="${y + h / 2}" x2="${x + w + 14}" y2="${y + h / 2}"/>`;
    g += dimH(m, x, x + w, y + h + 34, sp.L, y + h) + dimV(m, y, y + h, x + w + 34, `Ø${sp.d} ±${dnum(sp.tol)}`, x + w);
    g += titleBlock(376, 200, ['PIN AS REM', 'Baja S45C', `Jumlah: ${o.qty} pin · mm`]);
    return g + '</svg>';
  }
  const L = sp.L, W = sp.W, s = Math.min(288 / L, 2.6), x = 70, y = 70, w = L * s, h = W * s, cy = y + h / 2;
  const { id: m, head } = svgOpen(300);
  let g = head + `<rect class="bp-line" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  const hx = (sp.holes || []).map(v => x + v * s), r = sp.hole ? (sp.hole.type === 'tap' ? 4 : sp.hole.d / 2) * s : 0;
  hx.forEach(cx => { g += `<circle class="bp-line" cx="${cx}" cy="${cy}" r="${r}"/>${sp.hole.type === 'tap' ? `<circle class="bp-thin" cx="${cx}" cy="${cy}" r="${r * 1.25}" stroke-dasharray="30 6"/>` : ''}<line class="bp-ctr" x1="${cx - r - 10}" y1="${cy}" x2="${cx + r + 10}" y2="${cy}"/><line class="bp-ctr" x1="${cx}" y1="${cy - r - 10}" x2="${cx}" y2="${cy + r + 10}"/>`; });
  g += dimH(m, x, x + w, y + h + 34, `${L} ±${dnum(sp.tol)}`, y + h) + dimV(m, y, y + h, x + w + 30, W, x + w);
  if (hx.length) { g += dimH(m, x, hx[0], y - 18, sp.holes[0], y); if (hx[1]) g += dimH(m, hx[0], hx[1], y - 18, sp.holes[1] - sp.holes[0], cy - r - 10); g += `<text class="bp-txt" x="70" y="${y + h + 66}">${esc(sp.hole.label)}</text>`; }
  g += titleBlock(356, 214, [o.title.toUpperCase().slice(0, 24), `Plat strip ${W}×${sp.T} · baja`, `Jumlah: ${o.qty} pcs · mm`]);
  return g + '</svg>';
}
function caliperSVG(R, px, hl) {
  const start = Math.max(0, Math.floor(R) - 4), end = Math.floor(R) + 44, W = (end - start) * px + 40, X = v => 20 + (v - start) * px;
  let g = `<svg width="${W}" height="168" viewBox="0 0 ${W} 168" role="img" aria-label="Skala jangka sorong"><rect class="c-beam" x="0" y="30" width="${W}" height="60"/>`;
  for (let mm = start; mm <= end; mm++) { const x = X(mm), len = mm % 10 === 0 ? 22 : mm % 5 === 0 ? 15 : 9; g += `<line class="c-tick" x1="${x}" y1="90" x2="${x}" y2="${90 - len}"/>`; if (mm % 10 === 0) g += `<text class="c-txt" x="${x}" y="58" text-anchor="middle">${mm / 10}</text>`; }
  g += `<text class="c-txt" x="${W - 14}" y="46" text-anchor="end">cm</text>`;
  const v0 = X(R) - 24, v1 = X(R + 39) + 24;
  g += `<rect class="c-slide" x="${v0}" y="90" width="${v1 - v0}" height="56"/>`;
  for (let i = 0; i <= 20; i++) { const x = X(R + i * 1.95), len = i % 2 === 0 ? 16 : 10; g += `<line class="c-vtick" x1="${x}" y1="90" x2="${x}" y2="${90 + len}"/>`; if (i % 2 === 0) g += `<text class="c-vtxt" x="${x}" y="122" text-anchor="middle">${i / 2}</text>`; }
  g += `<text class="c-vtxt" x="${v0 + 8}" y="140">nonius 0,05 mm</text>`;
  if (hl) {
    const ip = Math.floor(R + 1e-9), i = Math.round((R - ip) / 0.05);
    g += `<rect class="c-hl" x="${X(ip) - 5}" y="62" width="10" height="30"/><text class="c-hlt" x="${X(ip) + 8}" y="24">skala utama ${ip} mm</text>`;
    g += `<rect class="c-hl" x="${X(R + i * 1.95) - 5}" y="88" width="10" height="22"/><text class="c-hlt" x="${X(R + i * 1.95) + 9}" y="162">nonius garis ke-${i} = ${dec(i * 0.05)} mm</text>`;
  }
  return g + '</svg>';
}


function initProd(o) {
  const sp = o.spec, cut = o.steps.some(s => s.t === 'potong');
  if (sp.kind === 'pin') {
    const v = [r05(12 + pick([-0.05, 0, 0.05])), pick([11.8, 11.85, 12.2]), pick([11.9, 12.1])].sort(() => Math.random() - 0.5);
    return { pins: v };
  }
  return { L: cut ? sp.L + 25 : sp.L, stock: cut, cut: !cut, mark: null, points: null, holes: false, holeD: null, bit: null, thread: false, tapCrooked: false, tapRough: false };
}

function firstPhase() {
  const c = G.cur, step = curStep(), o = curOrder(), sp = o.spec, g = guide();
  const t = step.t;
  if (t === 'gambar') { c.ph = 'main'; c.d.ans = {}; c.d.res = {}; say(g === 'none' ? 'Baca gambar dan isi jawabannya.' : 'Baca gambar kerja ini. Angka pada garis ukur menunjukkan ukuran dalam milimeter. Isi jawaban di bawah gambar, lalu tekan Periksa.'); }
  if (t === 'tandai') { c.ph = 'main'; if (step.mode === 'garis') { c.d.mk = sp.L - 10; say(g === 'full' ? `Plat akan digergaji lalu dikikir, jadi beri kelebihan sekitar 1 mm. Geser penggores ke ${sp.L + 1} mm dari ujung plat, lalu tekan Gores.` : `Tandai garis potong untuk panjang ${sp.L} mm.`); } else { c.d.pts = sp.holes.map(() => 0); say(g === 'full' ? `Ukur dari tepi kiri. Pusat lubang ada di ${sp.holes.join(' mm dan ')} mm. Geser penggores ke setiap posisi, lalu tekan Beri titik penitik.` : 'Tandai titik pusat lubang sesuai gambar.'); } }
  if (t === 'potong') { c.ph = 'tpi'; c.d.strokes = 0; c.d.need = 12; say(g === 'full' ? 'Pilih daun gergaji. Untuk plat tebal 4–6 mm pakai 18 atau 24 TPI (gigi per inci). 32 TPI untuk plat tipis di bawah 3 mm.' : 'Pilih daun gergaji yang sesuai tebal plat.'); }
  if (t === 'kikir') { c.ph = 'file'; c.d.meas = null; say(g === 'full' ? `Plat masih lebih panjang dari ${sp.L} mm. Pakai kikir kasar sampai sisa sekitar 0,3 mm, lalu kikir halus. Ukur sesering mungkin. Target ${sp.L} ± ${dnum(sp.tol)} mm.` : `Kikir sampai ${sp.L} ± ${dnum(sp.tol)} mm.`); }
  if (t === 'bor') { c.ph = 'bit'; c.d.pilotNeed = sp.hole.d >= 9; c.d.pass = c.d.pilotNeed ? 'pilot' : 'final'; c.d.prog = 0; say(g === 'full' ? (c.d.pilotNeed ? 'Lubang di atas 8 mm dibor pilot dulu dengan mata bor kecil 5 mm supaya mata bor besar tidak meleset. Pilih mata bor untuk lubang pilot.' : `Pilih mata bor sesuai gambar.`) : 'Pilih mata bor.'); }
  if (t === 'tap') { c.ph = 'set'; c.d.first = null; c.d.oil = false; c.d.fw = 0; c.d.con = 0; say(g === 'full' ? 'Pilih tap yang dipakai pertama. Mulai dari Tap 1 (ujungnya paling tirus) supaya masuk lurus. Beri oli agar ringan.' : 'Siapkan tap dan oli.'); }
  if (t === 'ukur') { c.ph = 'read'; c.d.items = ukurItems(step, o); c.d.idx = 0; c.d.rw = 0; c.d.read = ''; c.d.px = 30; c.d.hl = g === 'full'; say(g === 'full' ? 'Baca angka skala utama tepat di depan garis 0 nonius (kotak kuning atas), lalu cari garis nonius yang segaris dengan garis skala utama (kotak kuning bawah). Setiap garis nonius bernilai 0,05 mm.' : 'Ukur dengan jangka sorong, tulis hasilnya, lalu putuskan.'); }
  if (t === 'ulir') { c.ph = 'main'; say(g === 'full' ? 'Coba pasang baut M8. Ulir yang baik: baut masuk lancar diputar tangan dan kencang saat dikencangkan.' : 'Uji ulir dengan baut.'); }
}

function ukurItems(step, o) {
  const sp = o.spec, p = G.cur.prod, it = [];
  step.what.forEach(w => {
    if (w === 'pin') p.pins.forEach((v, i) => it.push({ label: `Pin ${i + 1}: diameter`, val: v, nom: sp.d, tol: sp.tol }));
    if (w === 'panjang') it.push({ label: 'Panjang plat', val: r05(p.L), nom: sp.L, tol: sp.tol });
    if (w === 'lubang') it.push({ label: 'Diameter lubang', val: r05(p.holeD), nom: sp.hole.d, tol: 0.15 });
  });
  return it;
}

function hint() {
  const c = G.cur, step = curStep(), o = curOrder(), sp = o.spec; if (!c || !step || c.summary) return;
  const t = step.t, ph = c.ph; let h = '';
  if (ph === 'go' || ph === 'walk') h = `Langkah ini dikerjakan di ${STN[stationOf(step)]}. Klik label kuning di bengkel.`;
  else if (ph === 'apd') h = APD_WHY[STEP[t].apd];
  else if (t === 'gambar') { const wrong = o.q.find((q, i) => c.d.res[i] === false) || o.q.find((q, i) => !c.d.res[i]); h = wrong ? wrong.h : 'Periksa lagi semua jawaban.'; }
  else if (t === 'tandai') h = step.mode === 'garis' ? `Beri kelebihan sekitar 1 mm untuk dikikir: tandai di ${sp.L + 1} mm.` : `Pusat lubang di ${sp.holes.join(' mm dan ')} mm dari tepi kiri.`;
  else if (t === 'potong') h = ph === 'tpi' ? 'Tebal plat 5 mm: pakai daun gergaji 18 atau 24 TPI.' : ph === 'jepit' ? 'Garis potong sebaiknya sekitar 10 mm dari rahang ragum agar plat tidak bergetar.' : 'Klik Gergaji berulang sampai plat terpotong.';
  else if (t === 'kikir') h = `Sisa yang harus dikikir: ukur dulu. Pakai kasar sampai sisa ±0,3 mm, lalu halus (0,05 mm per langkah). Target ${sp.L} ± ${dnum(sp.tol)}.`;
  else if (t === 'bor') h = ph === 'bit' ? (c.d.pass === 'pilot' ? 'Untuk lubang pilot pakai mata bor 5 mm.' : `Mata bor akhir: Ø${dnum(sp.hole.d)} mm.`) : ph === 'rpm' ? `n = 1000 × 25 ÷ (3,14 × ${dnum(c.d.bit)}) ≈ ${nRec(c.d.bit)} rpm. Pilih putaran yang paling dekat.` : ph === 'jepit' ? 'Jepit di ragum mesin. Jangan dipegang tangan.' : 'Tekan dan tahan tombol Turunkan tuas sampai tembus.';
  else if (t === 'tap') h = ph === 'set' ? 'Mulai dari Tap 1 dan beri oli.' : 'Pola yang aman: ½ maju, ½ maju, ¼ mundur, lalu ulangi.';
  else if (t === 'ukur') { c.d.hl = true; h = 'Kotak kuning menunjukkan skala utama dan garis nonius yang segaris. Hasil = skala utama + (nomor garis nonius × 0,05).'; }
  else if (t === 'ulir') h = 'Ulir bagus jika baut masuk lancar dan kencang. Jika oblak, dol, atau menyerong, ulir NG.';
  if (o.exam) { c.d.pen += 10; c.hints++; h += ' (Nilai langkah ini −10.)'; }
  say(h); redraw();
}

function workView() {
  const c = G.cur, step = curStep(), o = curOrder(), sp = o.spec, d = c.d, t = step.t;
  const head = `<div class="hd"><h3>Langkah ${c.si + 1}: ${STEP[t].name}</h3><span class="chip k">${SKILLS[STEP[t].k]}</span></div>`;
  if (c.ph === 'go' || c.ph === 'walk') return `<div class="work">${head}<p>Pekerjaan ini dilakukan di <b>${STN[stationOf(step)]}</b>.</p><div class="row"><button class="btn primary" data-act="go" ${c.ph === 'walk' ? 'disabled' : ''}>${c.ph === 'walk' ? 'Berjalan ke ' + STN[stationOf(step)] + '…' : 'Pergi ke ' + STN[stationOf(step)]}</button>${World.ok && !S.lite ? '<span class="small muted">atau klik label kuning di bengkel</span>' : ''}</div></div>`;
  let h = '';
  if (c.ph === 'apd') {
    h = `<p class="label">APD yang dipakai untuk ${STEP[t].name.toLowerCase()}</p><div class="opts">${Object.keys(APDS).map(k => `<button class="tog" data-act="apdt" data-v="${k}" aria-pressed="${!!d.apd[k]}">${APDS[k]}</button>`).join('')}</div><div class="row"><button class="btn primary" data-act="apdgo">Pakai & mulai</button></div>`;
  } else if (t === 'gambar') {
    h = `<div class="bp-wrap">${drawing(o)}</div><div class="qa">${o.q.map((q, i) => `<label for="q${i}">${esc(q.l)}</label><input id="q${i}" inputmode="decimal" data-f="ans" data-i="${i}" value="${esc(d.ans[i] || '')}" class="${d.res[i] === true ? 'right' : d.res[i] === false ? 'wrong' : ''}">`).join('')}</div><div class="row"><button class="btn primary" data-act="gcheck">Periksa</button></div>`;
  } else if (t === 'tandai' && step.mode === 'garis') {
    h = `<p>Posisi penggores diukur dari ujung kiri plat (mistar baja).</p><div class="slider"><input type="range" id="mk" data-f="mk" min="${sp.L - 10}" max="${sp.L + 10}" step="0.5" value="${d.mk}" aria-label="Posisi penggores dalam mm"><span class="num" id="mkv">${dnum(d.mk)} mm</span></div><div class="row"><button class="btn primary" data-act="gores">Gores garis</button></div>`;
  } else if (t === 'tandai') {
    h = sp.holes.map((x, i) => `<p class="label">Titik lubang ${i + 1} dari tepi kiri</p><div class="slider"><input type="range" id="pt${i}" data-f="pt" data-i="${i}" min="0" max="${sp.L}" step="0.5" value="${d.pts[i]}" aria-label="Posisi titik ${i + 1}"><span class="num" id="ptv${i}">${dnum(d.pts[i])} mm</span></div>`).join('') + `<p class="small muted">Sumbu lubang di tengah lebar plat (${sp.W / 2} mm dari tepi).</p><div class="row"><button class="btn primary" data-act="titik">Beri titik penitik</button></div>`;
  } else if (t === 'potong') {
    if (c.ph === 'tpi') h = `<p class="label">Daun gergaji (tebal plat ${sp.T} mm)</p><div class="opts">${[18, 24, 32].map(v => `<button class="tog" data-act="tpi" data-v="${v}">${v} TPI</button>`).join('')}</div>`;
    else if (c.ph === 'jepit') h = `<p class="label">Posisi garis potong dari rahang ragum</p><div class="opts"><button class="tog" data-act="sjepit" data-v="dekat">± 10 mm dari rahang</button><button class="tog" data-act="sjepit" data-v="jauh">± 80 mm dari rahang</button></div>`;
    else h = `<p>Daun ${d.tpi} TPI terpasang, plat terjepit. Tekan saat mendorong, ringankan saat menarik.</p><div class="meter"><i style="width:${d.strokes / d.need * 100}%"></i></div><div class="row"><button class="btn primary big" data-act="saw">Gergaji (1 langkah)</button><span class="small muted num">${d.strokes} / ${d.need}</span></div>`;
  } else if (t === 'kikir') {
    const p = c.prod, ex = o.exam;
    h = `<div class="row"><button class="btn steel" data-act="file" data-v="kasar">Kikir kasar</button><button class="btn steel" data-act="file" data-v="halus">Kikir halus</button><button class="btn" data-act="meas">Ukur</button><button class="btn primary" data-act="filedone">Selesai mengikir</button></div>
    ${d.meas != null ? `<div class="cal-wrap" id="calw">${caliperSVG(d.meas, 30, !ex && guide() === 'full')}</div>${ex ? '<p class="small muted">Baca sendiri hasil ukurnya.</p>' : `<p>Hasil ukur: <b class="num">${dec(d.meas)} mm</b> · target ${sp.L} ± ${dnum(sp.tol)} mm · sisa <b class="num">${dec(Math.max(0, d.meas - sp.L))} mm</b></p>`}` : '<p class="small muted">Tekan Ukur untuk mengecek panjang plat.</p>'}
    <p class="small muted">Kikir kasar membuang ±0,25 mm per langkah, kikir halus ±0,05 mm.</p>`;
  } else if (t === 'bor') {
    const opts = boreOpts(sp.hole.d);
    if (c.ph === 'bit') h = `<p class="label">${d.pass === 'pilot' ? 'Mata bor untuk lubang pilot' : 'Mata bor untuk lubang akhir'}</p><div class="opts">${opts.map(v => `<button class="tog" data-act="bit" data-v="${v}">Ø${dnum(v)} mm</button>`).join('')}</div>`;
    else if (c.ph === 'rpm') h = `<p>Mata bor Ø${dnum(d.bit)} mm terpasang. Atur posisi sabuk (putaran spindel).</p><div class="opts">${RPM_OPTS.map(v => `<button class="tog" data-act="rpm" data-v="${v}">${v} rpm</button>`).join('')}</div>${guide() === 'full' ? `<p class="small muted">n = 1000 × Vc ÷ (π × d), Vc baja ≈ ${VC} m/menit.</p>` : ''}`;
    else if (c.ph === 'jepit') h = `<p class="label">Cara menahan benda kerja</p><div class="opts"><button class="tog" data-act="bjepit" data-v="ragum">Jepit di ragum mesin</button><button class="tog" data-act="bjepit" data-v="tangan">Pegang dengan tangan</button></div>`;
    else h = `<p>${d.pass === 'pilot' ? 'Lubang pilot' : 'Lubang akhir'} · Ø${dnum(d.bit)} mm · ${d.rpm} rpm · ${sp.holes.length} lubang</p><div class="meter"><i id="drillm" style="width:${d.prog * 100}%"></i></div><div class="row"><button class="btn primary big hold" data-hold="drill">Tahan: turunkan tuas</button></div><p class="small muted">Tekan dan tahan tombol. Lepas untuk mengangkat tuas.</p>`;
  } else if (t === 'tap') {
    if (c.ph === 'set') h = `<p class="label">Tap yang dipakai pertama</p><div class="opts">${['1', '2', '3'].map(v => `<button class="tog" data-act="tapf" data-v="${v}" aria-pressed="${d.first === v}">Tap ${v}</button>`).join('')}</div><label class="row small"><input type="checkbox" id="oil" data-f="oil" ${d.oil ? 'checked' : ''}> Beri oli / pelumas potong</label><div class="row"><button class="btn primary" data-act="tapgo">Mulai mengetap</button></div>`;
    else if (c.ph === 'turn') h = `<p>Tap ${d.first} masuk ke lubang. Perlu ±4 putaran (8 × ½ putaran maju) untuk tembus plat 5 mm.</p><div class="meter"><i style="width:${d.fw / 8 * 100}%"></i></div><div class="row"><button class="btn steel big" data-act="turn" data-v="maju">½ putaran maju</button><button class="btn big" data-act="turn" data-v="mundur">¼ putaran mundur</button></div><p class="small ${d.con >= 2 ? '' : 'muted'}" style="${d.con >= 2 ? 'color:var(--warn)' : ''}">Maju berturut-turut: ${d.con}${d.con >= 2 ? ' — terasa makin berat' : ''}</p>`;
    else h = `<p>Tap pertama tembus. Lanjutkan dengan tap berikutnya untuk merapikan ulir.</p><div class="row"><button class="btn primary" data-act="tapfin">Lanjut Tap 2 & Tap 3</button></div>`;
  } else if (t === 'ukur') {
    const it = d.items[d.idx];
    h = `<p class="label">${esc(it.label)} · ${d.idx + 1} dari ${d.items.length}</p><div class="row"><button class="btn sm" data-act="zoom">${d.px > 30 ? 'Perkecil skala' : 'Perbesar skala'}</button></div><div class="cal-wrap" id="calw">${caliperSVG(it.val, d.px, d.hl)}</div>`;
    if (c.ph === 'read') h += `<div class="row"><label for="rd" class="small">Hasil pembacaan (mm)</label><input id="rd" data-f="read" inputmode="decimal" style="width:110px;font-family:var(--f-mono)" value="${esc(d.read)}"><button class="btn steel" data-act="read">Catat</button></div>`;
    else h += `<p>Hasil ukur <b class="num">${dec(it.val)} mm</b>. Spesifikasi <b class="num">${dnum(it.nom)} ± ${dnum(it.tol)} mm</b>.</p><div class="row"><button class="btn primary" data-act="dec" data-v="ok">OK, sesuai</button><button class="btn danger" data-act="dec" data-v="ng">NG, tidak sesuai</button></div>`;
  } else if (t === 'ulir') {
    h = `<p class="msg info">${esc(ulirMsg())}</p><div class="row"><button class="btn primary" data-act="udec" data-v="ok">Ulir OK</button><button class="btn danger" data-act="udec" data-v="ng">Ulir NG</button></div>`;
  }
  return `<div class="work">${head}${h}</div>`;
}

function boreOpts(d) { return d === 11 ? [5, 8.5, 10, 11, 12] : d === 9 ? [5, 6.8, 8, 9, 10] : [5, 6, 6.8, 7.5, 8]; }
function ulirMsg() {
  const p = G.cur.prod, need = curOrder().spec.hole.d;
  if (p.bit != null && p.bit < need) return 'Tap terasa sangat berat. Baut M8 tidak bisa masuk sampai habis.';
  if (p.bit != null && p.bit > need) return 'Ulir dangkal. Baut M8 masuk, tetapi oblak dan dol saat dikencangkan.';
  if (p.tapCrooked) return 'Baut M8 masuk menyerong, tidak tegak lurus terhadap plat.';
  if (p.tapRough) return 'Baut M8 masuk agak seret, lalu kencang saat dikencangkan.';
  return 'Baut M8 masuk lancar diputar tangan dan kencang saat dikencangkan.';
}

function ulirMsg() {
  const p = G.cur.prod, need = curOrder().spec.hole.d;
  if (p.bit != null && p.bit < need) return 'Tap terasa sangat berat. Baut M8 tidak bisa masuk sampai habis.';
  if (p.bit != null && p.bit > need) return 'Ulir dangkal. Baut M8 masuk, tetapi oblak dan dol saat dikencangkan.';
  if (p.tapCrooked) return 'Baut M8 masuk menyerong, tidak tegak lurus terhadap plat.';
  if (p.tapRough) return 'Baut M8 masuk agak seret, lalu kencang saat dikencangkan.';
  return 'Baut M8 masuk lancar diputar tangan dan kencang saat dikencangkan.';
}

function ulirOK() { const p = G.cur.prod, need = curOrder().spec.hole.d; return p.bit === need && !p.tapCrooked; }
function summaryView() {
  const sm = G.cur.summary, o = curOrder();
  return `<div class="panel"><div class="label">${esc(o.cust)}</div><h2 style="margin-top:2px">${esc(o.title)}</h2>
  <div class="row" style="margin-top:12px;align-items:baseline"><span class="num" style="font-size:2.4rem;line-height:1">${sm.nilai}</span><span class="chip">${predikat(sm.nilai)}</span>${sm.pass ? '<span class="chip" style="border-color:var(--good);color:var(--good)">Selesai</span>' : '<span class="chip" style="border-color:var(--bad);color:var(--bad)">Perlu diulang</span>'}</div>
  <div class="skills" style="margin-top:14px">${sm.by.map(([k, a]) => { const v = Math.round(avg(a)); return `<div class="sk"><span>${SKILLS[k]}</span><span class="num">${v}</span><div class="bar"><i style="width:${v}%"></i></div></div>`; }).join('')}</div>
  <p class="small muted" style="margin-top:10px">${o.exam ? 'Batas lulus uji keahlian: 70.' : 'Batas lanjut ke order berikutnya: 60.'}</p>
  <div class="row" style="margin-top:12px"><button class="btn primary" data-act="next">${sm.pass ? (o.exam ? 'Lihat sertifikat' : G.cur.practice ? 'Selesai latihan' : 'Lanjut ke order berikutnya') : 'Ulangi order ini'}</button></div></div>`;
}

function certImage() {
  const W = 1600, H = 1130, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d');
  const D = s => `700 ${s}px "Barlow Condensed","Arial Narrow",sans-serif`, B = (s, w = 400) => `${w} ${s}px "Barlow",system-ui,sans-serif`;
  x.fillStyle = '#FBFAF5'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#1C2420'; x.fillRect(0, 0, W, 26); x.fillRect(0, H - 26, W, 26);
  for (let i = -40; i < W; i += 44) { x.fillStyle = '#E0A100'; x.beginPath(); x.moveTo(i, 26); x.lineTo(i + 22, 26); x.lineTo(i + 44, 0); x.lineTo(i + 22, 0); x.fill(); }
  x.strokeStyle = '#285A7D'; x.lineWidth = 3; x.strokeRect(50, 60, W - 100, H - 110);
  x.textAlign = 'center'; x.fillStyle = '#58625C'; x.font = D(30); x.fillText('SIMULASI PKL · BENGKEL LAS MAJU JAYA', W / 2, 130);
  x.fillStyle = '#1C2420'; x.font = D(92); x.fillText('SERTIFIKAT KEAHLIAN', W / 2, 230);
  x.fillStyle = '#285A7D'; x.font = D(40); x.fillText('Tahap 1 · Fabrikasi Dasar, Pengukuran, Bor & Tap', W / 2, 290);
  x.fillStyle = '#58625C'; x.font = B(28); x.fillText('diberikan kepada', W / 2, 360);
  x.fillStyle = '#1C2420'; x.font = D(76); x.fillText(S.name || 'Nama siswa', W / 2, 445);
  x.fillStyle = '#58625C'; x.font = B(28); x.fillText([S.kelas, S.sekolah].filter(Boolean).join(' · ') || ' ', W / 2, 492);
  const comp = S.cert1.comp, ks = Object.keys(SKILLS), tx = 330, tw = W - 660;
  x.textAlign = 'left'; x.font = D(26); x.fillStyle = '#58625C'; x.fillText('KOMPETENSI', tx, 560); x.textAlign = 'right'; x.fillText('NILAI', tx + tw - 230, 560); x.fillText('PREDIKAT', tx + tw, 560);
  ks.forEach((k, i) => { const y = 600 + i * 40; x.strokeStyle = '#D8DCD4'; x.lineWidth = 1; x.beginPath(); x.moveTo(tx, y + 12); x.lineTo(tx + tw, y + 12); x.stroke(); x.fillStyle = '#1C2420'; x.textAlign = 'left'; x.font = B(26); x.fillText(SKILLS[k], tx, y); x.textAlign = 'right'; x.font = `500 26px "IBM Plex Mono",monospace`; x.fillText(String(comp[k] || '-'), tx + tw - 230, y); x.font = B(26); x.fillText(comp[k] ? predikat(comp[k]) : '-', tx + tw, y); });
  x.textAlign = 'center'; x.fillStyle = '#1C2420'; x.font = B(26, 600); x.fillText(`Nilai uji keahlian: ${S.cert1.nilai} · ${predikat(S.cert1.nilai)}`, W / 2, 890);
  const dt = new Date(S.cert1.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  x.font = B(24); x.fillStyle = '#58625C'; x.fillText(dt, W / 2, 928);
  [[400, 'Pak Mandor', 'Pembimbing industri'], [1200, S.guru || '(nama guru)', 'Guru pembimbing']].forEach(([cx, n, r]) => { x.strokeStyle = '#1C2420'; x.beginPath(); x.moveTo(cx - 170, 985); x.lineTo(cx + 170, 985); x.stroke(); x.fillStyle = '#1C2420'; x.font = B(26, 600); x.fillText(n, cx, 1018); x.fillStyle = '#58625C'; x.font = B(22); x.fillText(r, cx, 1048); });
  return cv.toDataURL('image/png');
}

function sakuView() {
  return `<div class="panel ref"><h2>Tabel lubang baut metrik</h2><div class="tbl" style="margin-top:8px"><table><thead><tr><th>Ulir</th><th>Bor sebelum tap</th><th>Lubang lewat halus</th><th>Lubang lewat sedang</th></tr></thead><tbody><tr><td>M6×1</td><td>5</td><td>6,4</td><td>6,6</td></tr><tr><td>M8×1,25</td><td>6,8</td><td>8,4</td><td>9</td></tr><tr><td>M10×1,5</td><td>8,5</td><td>10,5</td><td>11</td></tr><tr><td>M12×1,75</td><td>10,2</td><td>13</td><td>13,5</td></tr></tbody></table></div><p class="small muted" style="margin-top:6px">Lubang lewat: baut masuk tanpa ulir. Bor sebelum tap: lubang yang akan dibuat ulir.</p></div>
  <div class="panel ref"><h2>Putaran bor</h2><p style="margin-top:6px">n = 1000 × Vc ÷ (π × d). Untuk baja dengan mata bor HSS, Vc ≈ ${VC} m/menit.</p><div class="tbl" style="margin-top:8px"><table><thead><tr><th>Ø bor (mm)</th><th>n hitung (rpm)</th><th>Pilihan sabuk</th></tr></thead><tbody>${[5, 6.8, 9, 11].map(d => `<tr><td>${dnum(d)}</td><td>${nRec(d)}</td><td>${RPM_OPTS.filter(v => v >= nRec(d) * 0.7 && v <= nRec(d) * 1.3).join(' / ')}</td></tr>`).join('')}</tbody></table></div><p class="small muted" style="margin-top:6px">Lubang ≥ 9 mm dibor pilot dulu dengan Ø5 mm.</p></div>
  <div class="panel ref"><h2>Daun gergaji besi</h2><div class="tbl" style="margin-top:8px"><table><thead><tr><th>Tebal bahan</th><th>Daun gergaji</th></tr></thead><tbody><tr><td>di bawah 3 mm (plat tipis, pipa)</td><td>32 TPI</td></tr><tr><td>3–6 mm</td><td>18 atau 24 TPI</td></tr><tr><td>di atas 6 mm</td><td>14 atau 18 TPI</td></tr></tbody></table></div><p class="small muted" style="margin-top:6px">Minimal 3 gigi menyentuh benda kerja. Jepit dengan garis potong dekat rahang ragum.</p></div>
  <div class="panel ref"><h2>Membaca jangka sorong 0,05 mm</h2><ol class="small" style="margin:8px 0 0;padding-left:18px"><li>Baca skala utama (mm) tepat di depan garis 0 nonius.</li><li>Cari garis nonius yang segaris dengan garis skala utama.</li><li>Hasil = skala utama + nomor garis nonius × 0,05 mm.</li></ol><p class="small muted" style="margin-top:6px">Contoh: skala utama 11 mm, garis nonius ke-7 segaris → 11 + 0,35 = 11,35 mm.</p></div>
  <div class="panel ref"><h2>APD per pekerjaan</h2><div class="tbl" style="margin-top:8px"><table><thead><tr><th>Pekerjaan</th><th>Wajib</th><th>Dilarang</th></tr></thead><tbody>${Object.keys(APD_RULE).map(k => `<tr><td>${k === 'potong' ? 'Menggergaji' : k === 'kikir' ? 'Mengikir' : k === 'bor' ? 'Mengebor' : 'Mengetap'}</td><td>${APD_RULE[k].req.map(a => APDS[a]).join(', ')}</td><td>${APD_RULE[k].forbid.map(a => APDS[a]).join(', ') || '–'}</td></tr>`).join('')}</tbody></table></div></div>`;
}

function reportText() {
  const cs = compScores();
  return `LAPORAN PKL SIMULASI · BENGKEL LAS MAJU JAYA
Siswa   : ${S.name || '-'}
Kelas   : ${S.kelas || '-'}
Sekolah : ${S.sekolah || '-'}
Guru    : ${S.guru || '-'}
Hari PKL: ${S.day}
Sertifikat tahap 1: ${S.cert1 ? 'LULUS (nilai uji ' + S.cert1.nilai + ', ' + S.cert1.date + ')' : 'belum'}

CAPAIAN KOMPETENSI
${Object.keys(SKILLS).map(k => `${SKILLS[k].padEnd(32)}: ${S.skills[k].length ? cs[k] + ' (' + predikat(cs[k]) + ', ' + S.skills[k].length + ' penilaian)' : 'belum dinilai'}`).join('\n')}

NILAI ORDER (terbaik · jumlah percobaan)
${ORDERS.map(o => `${o.title.padEnd(36)}: ${S.done[o.id] != null ? S.done[o.id] : '-'} · ${S.tries[o.id] || 0}x`).join('\n')}`;
}

function scrollCal() { const w = $id('calw'); if (!w) return; const svg = w.querySelector('svg'); if (!svg) return; const hl = svg.querySelector('.c-hl'); const slide = svg.querySelector('.c-slide'); const x = parseFloat((hl || slide).getAttribute('x')); w.scrollLeft = Math.max(0, x - 80); }

/* hold-to-drill */
function drillTick() {
  const c = G.cur; if (!c || c.ph !== 'drill') return stopHold();
  c.d.prog = Math.min(1, c.d.prog + 0.025); const m = $id('drillm'); if (m) m.style.width = c.d.prog * 100 + '%'; World.drill(c.d.prog);
  if (c.d.prog >= 1) { stopHold(); drillDone(); }
}

function drillTick() {
  const c = G.cur; if (!c || c.ph !== 'drill') return stopHold();
  c.d.prog = Math.min(1, c.d.prog + 0.025); const m = $id('drillm'); if (m) m.style.width = c.d.prog * 100 + '%'; World.drill(c.d.prog);
  if (c.d.prog >= 1) { stopHold(); drillDone(); }
}

function stopHold() { if (UI.hold) { clearInterval(UI.hold); UI.hold = null; } World.drilling(false); }
function drillDone() {
  const c = G.cur, sp = curOrder().spec, d = c.d;
  if (d.pass === 'pilot') { d.pass = 'final'; d.prog = 0; c.ph = 'bit'; World.drill(0); say(`Lubang pilot selesai. Ganti dengan mata bor Ø${dnum(sp.hole.d)} mm.`); redraw(); return; }
  let D = d.bit === sp.hole.d ? sp.hole.d + pick([0, 0.05, 0.1]) : d.bit + 0.05;
  if (d.noPilot && d.bit === sp.hole.d) D += 0.15; if (d.rpmHigh) D += 0.05;
  c.prod.holeD = Math.round(D * 100) / 100; c.prod.holes = true; c.prod.bit = d.bit; World.drill(0);
  say('Lubang selesai. Bersihkan gram dengan kuas, jangan dengan tangan.'); stepDone();
}

function drillDone() {
  const c = G.cur, sp = curOrder().spec, d = c.d;
  if (d.pass === 'pilot') { d.pass = 'final'; d.prog = 0; c.ph = 'bit'; World.drill(0); say(`Lubang pilot selesai. Ganti dengan mata bor Ø${dnum(sp.hole.d)} mm.`); redraw(); return; }
  let D = d.bit === sp.hole.d ? sp.hole.d + pick([0, 0.05, 0.1]) : d.bit + 0.05;
  if (d.noPilot && d.bit === sp.hole.d) D += 0.15; if (d.rpmHigh) D += 0.05;
  c.prod.holeD = Math.round(D * 100) / 100; c.prod.holes = true; c.prod.bit = d.bit; World.drill(0);
  say('Lubang selesai. Bersihkan gram dengan kuas, jangan dengan tangan.'); stepDone();
}

const ACT = {
  tab(d) { S.tab = d.v; redraw(); },
  start() { startPKL(); },
  accept() { accept(S.pending, false); },
  practice(d) { if (G.cur) return; accept(d.v, true); },
  go() { goStation(stationOf(curStep())); },
  station(d) { goStation(d.v); },
  locked(d) { say(d.v === 'las' ? 'Area las dikerjakan tim las. Keahlian mengelas dipelajari di modul tersendiri.' : d.v === 'apd' ? 'Ini lemari APD. Ambil APD sesuai pekerjaan: wearpack dan sepatu safety selalu, kacamata untuk menggergaji, mengikir, dan mengebor.' : `Ruang ${d.v === 'bubut' ? 'bubut & milling dibuka di tahap 2' : 'CNC dibuka di tahap 3'}. Selesaikan tahap 1 dulu.`); },
  hint() { hint(); },
  next() { afterSummary(); },
  rescue() { if (G.cur) { const o = curOrder(); G.cur = null; if (o) accept(o.id, false); } else redraw(); },
  apdt(d) { const a = G.cur.d.apd; a[d.v] = !a[d.v]; redraw(); },
  apdgo() {
    const c = G.cur, t = curStep().t, r = APD_RULE[STEP[t].apd], a = c.d.apd;
    const miss = r.req.filter(k => !a[k]), forb = r.forbid.filter(k => a[k]);
    if (miss.length || forb.length) {
      c.d.apdPen += 30;
      say(guide() === 'none' ? 'APD belum sesuai prosedur. Periksa lagi.' : `${miss.length ? 'Masih kurang: ' + miss.map(k => APDS[k].toLowerCase()).join(', ') + '. ' : ''}${forb.length ? 'Lepas sarung tangan: saat mengebor sarung tangan bisa terlilit mata bor. ' : ''}${APD_WHY[STEP[t].apd]}`);
      redraw(); return;
    }
    record('K1', 100 - c.d.apdPen); S.gear = Object.assign({}, a);
    firstPhase(); redraw();
  },
  gcheck() {
    const c = G.cur, o = curOrder(); let bad = 0;
    o.q.forEach((q, i) => { const v = parse(c.d.ans[i]); const ok = Math.abs(v - q.a) < 1e-6; c.d.res[i] = ok; if (!ok) bad++; });
    if (bad) { c.d.pen += 20; const w = o.q.find((q, i) => !c.d.res[i]); say(guide() === 'none' ? `Masih ada ${bad} jawaban yang belum tepat.` : `${bad} jawaban belum tepat (kotak merah). Petunjuk: ${w.h}`); redraw(); return; }
    say('Semua benar. Kamu sudah paham gambarnya.'); stepDone();
  },
  gores() {
    const c = G.cur, sp = curOrder().spec, v = c.d.mk;
    if (v < sp.L + 0.5) { c.d.pen += 20; say(v < sp.L ? `Garis di ${dnum(v)} mm membuat plat lebih pendek dari ${sp.L} mm. Ukuran jadi kurang.` : `Terlalu mepet. Bekas gergaji tidak rata, jadi sisakan sekitar 1 mm untuk dikikir: ${sp.L + 1} mm.`); redraw(); return; }
    if (v > sp.L + 1.5) { c.d.pen += 10; say(`Kelebihan ${dnum(v - sp.L)} mm terlalu banyak, mengikirnya akan lama. Cukup sekitar 1 mm.`); redraw(); return; }
    c.prod.mark = v; say('Garis potong sudah digores. Bagus.'); stepDone();
  },
  titik() {
    const c = G.cur, sp = curOrder().spec, bad = sp.holes.filter((x, i) => Math.abs(c.d.pts[i] - x) > 0.5).length;
    if (bad) { c.d.pen += 20; say(guide() === 'none' ? 'Posisi titik belum sesuai gambar.' : `Posisi titik belum tepat. Ukur dari tepi kiri: ${sp.holes.join(' mm dan ')} mm.`); redraw(); return; }
    c.prod.points = sp.holes.slice(); say('Titik penitik sudah dibuat. Titik ini menjadi pemandu ujung mata bor.'); stepDone();
  },
  tpi(d) {
    const c = G.cur, v = Number(d.v); c.d.tpi = v;
    if (v === 32) { c.d.pen += 15; c.d.need = 22; say('32 TPI terlalu halus untuk plat 5 mm. Gigi cepat tersumbat dan memotong jadi lama. Lain kali pakai 18 atau 24 TPI.'); }
    else say(guide() === 'full' ? `${v} TPI pas untuk plat 5 mm. Sekarang jepit plat di ragum.` : 'Daun gergaji terpasang.');
    c.ph = 'jepit'; redraw();
  },
  sjepit(d) {
    const c = G.cur;
    if (d.v === 'jauh') { c.d.pen += 15; say('Garis potong terlalu jauh dari rahang: plat bergetar dan berisik, daun gergaji bisa patah. Jepit dengan garis potong dekat rahang.'); if (guide() === 'full') { redraw(); return; } c.d.need += 6; }
    else say(guide() === 'full' ? 'Tepat. Sekarang gergaji. Tekan saat dorong maju, ringankan saat menarik.' : 'Plat terjepit.');
    c.ph = 'saw'; World.anim('clamp'); redraw();
  },
  saw() {
    const c = G.cur; c.d.strokes++; World.anim('saw');
    if (c.d.strokes >= c.d.need) { c.prod.L = Math.round((c.prod.mark + rnd(0.05, 0.4)) * 100) / 100; c.prod.cut = true; c.prod.stock = false; say('Plat terpotong. Bekas gergaji masih kasar, nanti dirapikan dengan kikir.'); stepDone(); return; }
    redraw();
  },
  file(d) {
    const c = G.cur, sp = curOrder().spec, p = c.prod;
    p.L = Math.round((p.L - (d.v === 'kasar' ? rnd(0.22, 0.3) : rnd(0.04, 0.06))) * 100) / 100; c.d.meas = null; World.anim('file');
    if (r05(p.L) < sp.L - sp.tol - 1e-9) {
      c.d.pen += 35; p.L = Math.round((sp.L + rnd(0.6, 1.0)) * 100) / 100;
      say(`Terlalu banyak dikikir, plat jadi kurang dari ${dnum(sp.L - sp.tol)} mm dan NG. Mas Dodi sudah memotongkan plat pengganti. Kikir lagi dan lebih sering mengukur saat mendekati ukuran.`);
    }
    redraw();
  },
  meas() { const c = G.cur; c.d.meas = r05(c.prod.L); redraw(); scrollCal(); },
  filedone() {
    const c = G.cur, sp = curOrder().spec, m = r05(c.prod.L);
    if (m > sp.L + sp.tol + 1e-9) { c.d.pen += 10; say(guide() === 'none' ? 'Panjang plat belum sesuai.' : `Belum. Plat masih ${dec(m)} mm, lebih ${dec(m - sp.L)} mm dari ukuran.`); redraw(); return; }
    say('Panjang sudah masuk toleransi. Tepi plat sudah rata.'); stepDone();
  },
  bit(d) {
    const c = G.cur, sp = curOrder().spec, v = Number(d.v), full = guide() === 'full';
    if (c.d.pass === 'pilot') {
      if (v === 5) { c.d.bit = 5; c.ph = 'rpm'; say(full ? 'Mata bor pilot Ø5 terpasang. Sekarang atur putaran.' : 'Mata bor terpasang.'); }
      else if (v === sp.hole.d) { c.d.pen += 15; c.d.noPilot = true; c.d.pass = 'final'; c.d.bit = v; c.ph = 'rpm'; say('Langsung memakai mata bor besar tanpa lubang pilot: ujung bor bisa meleset dan lubang membesar. Lain kali bor pilot Ø5 dulu.'); }
      else { c.d.pen += 20; say(full ? 'Untuk lubang pilot pakai mata bor kecil Ø5 mm.' : 'Mata bor itu kurang tepat untuk langkah ini.'); if (!full) { c.d.bit = v; c.d.noPilot = true; c.d.pass = 'final'; c.ph = 'rpm'; } }
    } else {
      if (v === sp.hole.d) { c.d.bit = v; c.ph = 'rpm'; say(full ? `Mata bor Ø${dnum(v)} terpasang. Putarannya harus lebih pelan daripada mata bor pilot.` : 'Mata bor terpasang.'); }
      else { c.d.pen += 20; say(full ? `Belum tepat. Sesuai gambar, lubangnya Ø${dnum(sp.hole.d)} mm. Cek tabel di Buku saku.` : 'Mata bor terpasang.'); if (!full) { c.d.bit = v; c.ph = 'rpm'; } }
    }
    World.bit(c.d.bit); redraw();
  },
  rpm(d) {
    const c = G.cur, v = Number(d.v), n = nRec(c.d.bit), ok = v >= n * 0.7 && v <= n * 1.3, full = guide() === 'full';
    if (!ok) { c.d.pen += 15; say(`${v} rpm ${v > n ? 'terlalu cepat: mata bor panas dan cepat tumpul' : 'terlalu lambat: lama dan hasil kasar'}. Untuk Ø${dnum(c.d.bit)} mm, n ≈ ${n} rpm.`); if (full) { redraw(); return; } c.d.rpmHigh = v > n; }
    else say(full ? `Benar, ${v} rpm cocok untuk Ø${dnum(c.d.bit)} mm.` : 'Putaran diatur.');
    c.d.rpm = v; c.ph = c.d.clamped ? 'drill' : 'jepit'; c.d.prog = 0; redraw();
  },
  bjepit(d) {
    const c = G.cur;
    if (d.v === 'tangan') { c.d.pen += 30; say('Berbahaya! Plat bisa tertarik dan ikut berputar bersama mata bor, tangan bisa luka. Benda kerja selalu dijepit di ragum mesin.'); redraw(); return; }
    c.d.clamped = true; c.ph = 'drill'; say(guide() === 'full' ? 'Plat terjepit di ragum mesin. Tekan dan tahan tombol untuk menurunkan tuas.' : 'Plat terjepit.'); redraw();
  },
  tapf(d) { G.cur.d.first = d.v; redraw(); },
  tapgo() {
    const c = G.cur, full = guide() === 'full';
    if (!c.d.first) return toast('Pilih tap yang dipakai pertama.');
    if (c.d.first !== '1') { c.d.pen += 20; say(`Tap ${c.d.first} ujungnya kurang tirus, sulit masuk lurus dan ulir bisa miring. Mulai dari Tap 1.`); if (full) { redraw(); return; } c.prod.tapCrooked = true; }
    if (!c.d.oil) { c.d.pen += 10; c.prod.tapRough = true; say('Tanpa oli tap terasa berat dan ulir bisa robek. Biasakan memberi pelumas potong.'); }
    else if (c.d.first === '1') say(guide() === 'full' ? 'Bagus. Putar ½ maju, lalu ¼ mundur untuk memutus gram. Jangan maju terus.' : 'Mulai mengetap.');
    c.ph = 'turn'; redraw();
  },
  turn(d) {
    const c = G.cur;
    if (d.v === 'mundur') { c.d.con = 0; World.anim('tap', -1); redraw(); return; }
    c.d.fw++; c.d.con++; World.anim('tap', 1);
    if (c.d.con >= 4) { c.d.pen += 35; c.d.fw = 0; c.d.con = 0; say('Krek! Tap patah karena gram tidak diputus. Untung Mas Dodi bisa mengeluarkannya. Ulangi: setiap 1–2 kali maju, putar ¼ mundur.'); redraw(); return; }
    if (c.d.con === 3) say('Tap terasa berat sekali! Putar ¼ mundur dulu sebelum maju lagi.');
    if (c.d.fw >= 8) { c.ph = 'fin'; say('Tap pertama sudah tembus.'); }
    redraw();
  },
  tapfin() { const c = G.cur; c.prod.thread = true; c.prod.bit = c.prod.bit != null ? c.prod.bit : c.d.bit; World.anim('tap', 4); say('Ulir sudah jadi. Bersihkan gram dan oli.'); stepDone(); },
  zoom() { const d = G.cur.d; d.px = d.px > 30 ? 30 : 48; redraw(); scrollCal(); },
  read() {
    const c = G.cur, d = c.d, it = d.items[d.idx], v = parse(d.read);
    if (isNaN(v)) return toast('Tulis hasil ukur dalam mm, misalnya 11,35.');
    if (Math.abs(v - it.val) < 0.001) { say(guide() === 'none' ? 'Hasil dicatat.' : `Tepat, ${dec(it.val)} mm. Sekarang bandingkan dengan spesifikasi.`); c.ph = 'decide'; redraw(); return; }
    d.pen += 15; d.rw++;
    if (guide() !== 'none' && d.rw >= 2) { say(`Hasil yang benar ${dec(it.val)} mm. Perhatikan kotak kuning: skala utama ${Math.floor(it.val + 1e-9)} mm, ditambah garis nonius ke-${Math.round((it.val - Math.floor(it.val + 1e-9)) / 0.05)} × 0,05.`); d.hl = true; c.ph = 'decide'; }
    else say(guide() === 'none' ? 'Pembacaan belum tepat. Coba lagi.' : 'Belum tepat. Lihat lagi skala utama di depan garis 0 nonius, lalu cari garis nonius yang benar-benar segaris.');
    redraw(); scrollCal();
  },
  dec(d) {
    const c = G.cur, dd = c.d, it = dd.items[dd.idx], ok = Math.abs(it.val - it.nom) <= it.tol + 1e-9, said = d.v === 'ok';
    if (said !== ok) { dd.pen += 25; say(`Kurang tepat. Batasnya ${dec(it.nom - it.tol)} sampai ${dec(it.nom + it.tol)} mm, jadi ${dec(it.val)} mm ${ok ? 'masih OK' : 'NG'}.`); }
    else say(ok ? 'Benar, sesuai spesifikasi.' : `Benar, NG. ${it.label.startsWith('Pin') ? 'Pin ini harus diganti, akan kita laporkan ke pelanggan.' : 'Barang NG tidak boleh dikirim. Tim akan membuat ulang.'}`);
    dd.idx++; dd.read = ''; dd.rw = 0; dd.hl = guide() === 'full';
    if (dd.idx >= dd.items.length) { stepDone(); return; }
    c.ph = 'read'; redraw();
  },
  udec(d) {
    const c = G.cur, ok = ulirOK(), said = d.v === 'ok';
    if (said !== ok) { c.d.pen += 25; say(ok ? 'Ulirnya sebenarnya baik: baut masuk dan kencang.' : 'Ulir ini NG. Baut harus masuk lurus, lancar, dan kencang.'); }
    else say(ok ? 'Benar, ulir OK.' : 'Benar, ulir NG dan harus diperbaiki sebelum dikirim.');
    stepDone();
  },
  cam(d) { World.cam(d.v); },
  lite() { S.lite = !S.lite; if (!S.lite) World.init(); redraw(); },
  copy() { const t = reportText(), ta = $id('rep'); const fb = () => { ta.focus(); ta.select(); toast('Teks dipilih. Tekan Ctrl+C untuk menyalin.'); }; try { navigator.clipboard.writeText(t).then(() => toast('Laporan disalin.'), fb); } catch (e) { fb(); } },
  reset() { UI.confirmReset = true; redraw(); },
  resetNo() { UI.confirmReset = false; redraw(); },
  resetYes() { UI.confirmReset = false; S = newState(); UI.mentor = ''; redraw(); say('Halo. Saya Pak Mandor. Isi identitasmu di tab Tugas, lalu mulai PKL.'); }
};

/* ===================== ALUR ===================== */
const order=id=>ORDERS.find(o=>o.id===id);
const curOrder=()=>G.cur&&order(G.cur.oid);
const curStep=()=>{const c=G.cur,o=curOrder();return c&&o&&o.steps[c.si];};
const guide=()=>curOrder()?curOrder().guide:'full';
const stationOf=step=>step?STEP[step.t].st:null;
const record=(k,score)=>G.cur.scores.push({k,s:clamp(Math.round(score),30,100)});
const compScores=()=>{const r={};Object.keys(SKILLS).forEach(k=>r[k]=Math.round(avg(S.skills[k])));return r;};
const stepName=s=>STEP[s.t].name+(s.t==='tandai'?(s.mode==='garis'?' garis potong':' titik lubang'):'')+' · '+STN[STEP[s.t].st];
const MAN='Pak Mandor · Pembimbing industri';
const CUST={pin:['Pak Yanto','Mas, ini 3 pin as rem dari motor pelanggan saya. Remnya terasa oblak. Tolong dicek, diameternya masih masuk ukuran atau tidak?'],
 shim:['Koh Hendra','Dudukan mesin mobil saya turun. Saya butuh 1 plat ganjal ukuran 60 × 40 mm. Panjangnya harus pas, ya.'],
 sambung:['Bu Sari','Kami sedang merakit rangka karoseri. Butuh plat penyambung dengan 2 lubang untuk baut M10.'],
 ulir:['Bang Ucok','Dudukan knalpot ini perlu satu lubang berulir M8 untuk baut penahan. Bisa dibuatkan?'],
 lampu:['Mas Bayu','Pelanggan saya mau pasang lampu kabut. Butuh plat dudukan 180 mm dengan 2 lubang baut M8.'],
 uji:['Bu Ratna','Kami butuh plat dudukan sensor untuk lini perakitan. Toleransinya ketat dan ada 2 ulir M8. Kata Pak Mandor, kamu sendiri yang mengerjakan.']};
const first=()=>esc((S.name||'kamu').split(' ')[0]);

/* tujuan aktif: tanda ◆ + tombol interaksi */
function setGoal(pos,obj,label,fn){goal={pos,obj,label,fn};const p=typeof pos==='function'?pos():pos;G.marker.set(G.V(p.x,p.z));}
function clearGoal(){goal=null;G.marker.set(null);}
const gi=G.addInter({pos:()=>typeof goal.pos==='function'?goal.pos():goal.pos,on:()=>!!goal,label:()=>goal.label,r:2.5,fn:()=>goal&&goal.fn()});
Object.defineProperty(gi,'obj',{get:()=>goal?goal.obj:''});
G.updaters.add(()=>{if(goal&&typeof goal.pos==='function'){const p=goal.pos();G.marker.g.position.set(p.x,0,p.z);}});
const reach=(pos,obj,label)=>new Promise(r=>setGoal(pos,obj,label,()=>{clearGoal();r();}));
const npos=A=>()=>A.root.position;

/* Pak Mandor berjalan mendampingi */
const HOME=[-1,9.6];
function mandorTo(st){const P=W.ST[st],m=N.mandor.root.position;const pts=[];if(m.z>-1)pts.push([-1,m.z],[-1,-2.5]);else pts.push([m.x,-2.5]);pts.push([P.x+1.4,-2.5],[P.x+1.4,P.z+.3]);return W.go(N.mandor,pts,-Math.PI/2);}
function mandorHome(){const m=N.mandor.root.position;if(Math.hypot(m.x-HOME[0],m.z-HOME[1])<.5)return Promise.resolve();return W.go(N.mandor,[[m.x,-2.5],[-1,-2.5],HOME],0);}

/* pemain */
G.makePlayer=()=>{const old=G.player;if(old)G.scene.remove(old.root);
  const A=G.avatar({name:S.name,back:'PKL',cap:S.helm?'#f7f8f4':null,skin:'#e0ac69',tagColor:'#bfe3ff'});
  A.gog=G.at(G.box(.36,.1,.06,'#6fa8c9',{roughness:.2}),0,.03,.2);A.head.add(A.gog);
  A.glv=[A.armL,A.armR].map(a=>{const g=G.at(G.box(.22,.16,.24,'#8b5a2b'),0,-.63,0);a.add(g);return g;});
  G.scene.add(A.root);G.player=A;syncGear();};
function syncGear(){const A=G.player;if(!A)return;const g=(G.cur&&workOpen&&G.cur.d&&G.cur.d.apd)||S.gear;A.gog.visible=!!g.kacamata;A.glv.forEach(m=>m.visible=!!g.sarung);}

/* ---------- jendela kerja di stasiun ---------- */
function redraw(){if(!workOpen||!G.cur)return;const c=G.cur,o=curOrder();const box=G.$('#mbox'),sc=box.scrollTop;
  modal(b=>{b.appendChild(el('div','kick',`${esc(o.cust)} · ${esc(o.title)}`));
    b.appendChild(el('div','fb info mentor',`<b>Pak Mandor:</b> ${esc(UI.mentor)}<div class="hb"><button class="btn sm" data-act="hint">${o.exam?'💡 Petunjuk (−10)':'💡 Petunjuk'}</button><button class="btn sm" data-act="saku">📒 Buku saku</button></div>`));
    const w=el('div','');w.innerHTML=workView();b.appendChild(w);
    b.appendChild(row(btn('Tutup dulu','gr',()=>{workOpen=false;closeModal();syncGear();})));});
  box.scrollTop=sc;syncGear();if(c.d&&c.d.meas!=null||curStep().t==='ukur')scrollCal();}
function openWork(){const c=G.cur,step=curStep();G.initAudio();
  if(!c.at){c.at=true;c.d={pen:0,apdPen:0};
    if(STEP[step.t].apd){c.ph='apd';c.d.apd=Object.assign({},S.gear);UI.mentor=(guide()==='none'?'Pilih APD untuk pekerjaan ini.':APD_WHY[STEP[step.t].apd]+' Pilih APD yang dipakai, lalu tekan Pakai & mulai.');}
    else firstPhase();}
  workOpen=true;redraw();}
function stepDone(){const c=G.cur,step=curStep();record(STEP[step.t].k,100-c.d.pen);stopHold();workOpen=false;closeModal();syncGear();clearGoal();
  G.sfx('ok');toast('✓ '+STEP[step.t].name+' selesai'+(UI.mentor?' · Pak Mandor: '+esc(UI.mentor):''),'ok');if(guide()!=='none')G.bubble(N.mandor,c.d.pen?'Lain kali lebih teliti, ya.':'Bagus!',3);
  const r=stepRes;stepRes=null;r&&r();}
function doStep(){const c=G.cur,step=curStep(),st=stationOf(step),P=W.ST[st];c.at=false;c.ph='go';
  if(guide()==='none')mandorHome();else mandorTo(st);
  return new Promise(res=>{stepRes=res;setGoal(G.V(P.x,P.z),STN[st],STEP[step.t].name,openWork);});}
function newCur(o,practice){return{oid:o.id,si:0,ph:'go',at:false,d:{},scores:[],hints:0,practice:!!practice,prod:initProd(o)};}

/* ---------- pelanggan ---------- */
async function custArrive(o){const i=ORDERS.indexOf(o)%3,A=N.cust[i],v=W.vehicle(o.veh,o.vcol);
  await v.drive(-62,6,3.6);A.root.position.set(6,0,16.2);A.root.visible=true;toast('🚚 Ada pelanggan datang!','gold');W.go(A,[[2.2,11]],Math.PI);return{A,v};}
async function custLeave(cu){await W.go(cu.A,[[6,16.2]]);cu.A.root.visible=false;await cu.v.drive(6,75,3.4);cu.v.remove();}

/* ---------- satu order ---------- */
async function runOrder(o,practice){busy=true;const c=G.cur=newCur(o,practice);S.tries[o.id]=(S.tries[o.id]||0)+1;
  const [cname,ask]=CUST[o.id],who=`${cname} · ${o.cust}`;
  const items=['Sambut pelanggan di depan bengkel','Lapor ke Pak Mandor',...o.steps.map(stepName),'Serahkan hasil ke pelanggan'];
  const q=i=>G.setQuest((o.exam?'UJI KEAHLIAN · ':practice?'LATIHAN · ':'ORDER · ')+o.title.toUpperCase(),items,i);
  q(0);mandorHome();const cu=await custArrive(o);
  await reach(npos(cu.A),cname,'Sapa pelanggan');await G.say(who,ask);
  q(1);await reach(npos(N.mandor),'Pak Mandor','Lapor order');
  await G.say(MAN,`${o.brief}`);
  await G.say(MAN,o.guide==='full'?'Saya dampingi di setiap stasiun. Ikuti tanda <b>◆ kuning</b>, lalu tekan tombol interaksi di stasiunnya.':o.guide==='hint'?'Kali ini kamu yang memimpin. Kalau ragu, tekan <b>💡 Petunjuk</b>.':'Saya menunggu di depan. Tunjukkan kemampuanmu. <b>Semangat!</b>');
  for(c.si=0;c.si<o.steps.length;c.si++){q(2+c.si);await doStep();}
  q(2+o.steps.length);mandorHome();
  await reach(npos(cu.A),cname,'Serahkan hasil');
  const r=finishOrder();
  await G.say(who,r.pass?(o.id==='pin'?'Oh, jadi ada pin yang sudah aus. Baik, saya ganti yang NG. Terima kasih sudah dicek dengan teliti!':'Wah, rapi dan sesuai ukuran. Terima kasih, ya!'):'Hmm, ini belum sesuai pesanan. Tolong dibuat ulang ya, saya kembali lagi nanti.');
  custLeave(cu);
  await summary(o,r);
  if(o.exam&&r.pass&&r.newCert)await certModal();
  G.cur=null;busy=false;save();return r.pass;}
function finishOrder(){const c=G.cur,o=curOrder(),nilai=Math.round(avg(c.scores.map(x=>x.s))),pass=nilai>=(o.exam?70:60);let newCert=false;
  c.scores.forEach(x=>S.skills[x.k].push(x.s));S.done[o.id]=Math.max(S.done[o.id]||0,nilai);
  jot(`${o.exam?'Uji keahlian':c.practice?'Latihan ulang':'Order'}: ${o.title} untuk ${o.cust}. Nilai ${nilai}${pass?'':' (perlu diulang)'}.`);S.day++;
  if(o.exam&&pass&&!S.cert1){S.cert1={date:new Date().toISOString().slice(0,10),nilai,comp:compScores()};newCert=true;jot('LULUS uji keahlian tahap 1. Menerima sertifikat keahlian Fabrikasi Dasar, Pengukuran, Bor & Tap.');}
  if(pass&&!c.practice)S.next=Math.max(S.next,ORDERS.indexOf(o)+1);
  G.addCoins(pass?nilai:10,pass?'uang saku PKL':'uang makan');save();
  return{nilai,pass,newCert,by:Object.keys(SKILLS).map(k=>[k,c.scores.filter(x=>x.k===k).map(x=>x.s)]).filter(x=>x[1].length)};}
const bars=list=>`<div class="skills">${list.map(([n,v,t])=>`<div class="sk"><span>${n}</span><span class="num">${t||v}</span><div class="bar"><i style="width:${v}%"></i></div></div>`).join('')}</div>`;
function summary(o,r){return new Promise(res=>{G.sfx(r.pass?'win':'bad');if(r.pass)G.confetti();modal(b=>{b.appendChild(el('div','kick',esc(o.cust)));b.appendChild(el('h2','',esc(o.title)));
  b.appendChild(el('div','',`<div class="bignum"><span class="num">${r.nilai}</span><span class="chip">${predikat(r.nilai)}</span><span class="chip ${r.pass?'ok':'bad'}">${r.pass?'Selesai':'Perlu diulang'}</span></div>`));
  b.appendChild(el('div','',bars(r.by.map(([k,a])=>[SKILLS[k],Math.round(avg(a))]))));
  b.appendChild(el('p','',o.exam?'Batas lulus uji keahlian: 70.':'Batas lanjut ke order berikutnya: 60.'));
  b.appendChild(row(btn(r.pass?'Lanjut ▸':'Ulangi order ini ▸','y',()=>{closeModal();res();})));});});}
function certModal(){return new Promise(res=>{G.confetti();G.sfx('win');modal(b=>{b.appendChild(el('div','kick','Selamat! Kamu lulus uji keahlian'));b.appendChild(el('h2','','Sertifikat Keahlian Tahap 1 🎓'));
  b.appendChild(el('div','cert',`<img alt="Sertifikat keahlian tahap 1 atas nama ${esc(S.name)}" src="${certImage()}">`));
  b.appendChild(el('p','','Tekan lama gambar (HP) atau klik kanan lalu Simpan gambar (komputer). Sertifikat juga ada di menu ☰ › Keahlian.'));
  b.appendChild(row(btn('Tutup','y',()=>{closeModal();res();})));});});}

/* ---------- hari pertama ---------- */
async function intro(){const items=['Temui Pak Mandor di depan bengkel','Ambil helm & sepatu safety di lemari APD','Kenalan dengan Bu Rina di kantor'];const q=i=>G.setQuest('HARI PERTAMA PKL',items,i);
  q(0);await reach(npos(N.mandor),'Pak Mandor','Sapa');
  await G.say(MAN,`Selamat datang, <b>${first()}</b>! Saya Pak Mandor, pembimbing PKL kamu di Bengkel Las Maju Jaya. Di sini kamu belajar sambil mengerjakan order pelanggan sungguhan.`);
  await G.say(MAN,'Aturan pertama bengkel: <b>keselamatan dulu</b>. Ambil helm dan sepatu safety di <b>lemari APD</b>, di dinding kiri. Ikuti tanda ◆ kuning.');
  q(1);await reach(G.V(W.ST.apd.x,W.ST.apd.z),'Lemari APD','Ambil APD');S.helm=true;G.makePlayer();G.sfx('ok');
  await G.say('Lemari APD','Kamu sekarang memakai <b>wearpack, helm, dan sepatu safety</b>. Kacamata dan sarung tangan dipakai sesuai pekerjaannya.');
  q(2);await reach(G.V(W.ST.kantor.x,W.ST.kantor.z),'Bu Rina · Admin','Kenalan');
  await G.say('Bu Rina · Admin bengkel',`Halo ${first()}, selamat bergabung. Semua order pelanggan dicatat di <b>papan order</b> ini, lengkap dengan <b>gambar kerja</b>-nya. Kalau ada pelanggan datang, sambut di depan, ya.`);
  S.intro=true;jot('Hari pertama PKL di Bengkel Las Maju Jaya. Berkenalan dengan Pak Mandor dan Bu Rina, mengambil APD dasar.');G.addCoins(20,'hari pertama');save();}
function freeRoam(){clearGoal();G.setQuest('TAHAP 1 SELESAI',['Sertifikat keahlian sudah diterima 🎓','Latihan ulang order lewat menu ☰','Tahap 2 · bubut & milling (segera hadir)'],1);}
async function mainLoop(){if(!S.intro)await intro();while(S.next<ORDERS.length){await G.wait(1.2);await runOrder(ORDERS[S.next],false);}freeRoam();}

/* ---------- ngobrol bebas dengan orang di bengkel ---------- */
const talk=(A,who,lines)=>G.addInter({pos:npos(A),obj:who.split(' · ')[0],label:'Ngobrol',r:2.1,on:()=>A.root.visible,fn:()=>G.say(who,pick(lines))});
talk(N.mandor,MAN,['Ingat: ukur dua kali, potong satu kali.','Kalau ragu, buka <b>📒 Buku saku</b>. Tidak ada yang hafal semua tabel.','Benda kerja selalu dijepit. Jangan pernah dipegang tangan saat dibor.']);
talk(N.rina,'Bu Rina · Admin bengkel',['Pelanggan kita kebanyakan bengkel mobil dan karoseri. Mereka minta barang <b>tepat ukuran</b> dan <b>tepat waktu</b>.','Setiap order selesai, kamu dapat uang saku. Nilainya tergantung ketelitianmu.']);
talk(N.dodi,'Mas Dodi · Helper',['Saya dulu juga PKL di sini. Kuncinya: jangan malu bertanya.','Bekas gergaji selalu kasar. Makanya disisakan 1 mm untuk dikikir.','Gram bor dibersihkan pakai kuas, jangan pakai tangan!']);
G.addInter({pos:G.V(9.1,-4.1),obj:'Tim las',label:'Ngobrol',r:2,fn:()=>G.say('Mas Wawan · Tukang las',pick(['Jangan menatap busur las tanpa kedok, ya. Mata bisa perih semalaman.','Mengelas ada modul sendiri. Kuasai dulu ukur, potong, bor, dan tap.']))});
G.addInter({pos:G.V(11.2,-1.5),obj:'Ruang bubut & milling',label:'Lihat',r:1.9,fn:()=>G.say(MAN,'Ruang <b>bubut & milling</b> dibuka di <b>tahap 2</b>, setelah kamu lulus uji keahlian tahap 1.')});
G.addInter({pos:G.V(9.7,5.2),obj:'Ruang CNC',label:'Lihat',r:1.9,fn:()=>G.say(MAN,'Mesin <b>CNC</b> ada di <b>tahap 3</b>. Operator CNC yang baik harus paham dulu proses manualnya.')});

/* ---------- menu ---------- */
const back=()=>{if(workOpen)redraw();else closeModal();};
function openSaku(){modal(b=>{b.appendChild(el('div','kick','Buku saku'));const w=el('div','');w.innerHTML=sakuView();b.appendChild(w);b.appendChild(row(btn('Kembali','y',back)));});}
function openSkill(){modal(b=>{b.appendChild(el('div','kick','Keahlian'));b.appendChild(el('h2','','Capaian kompetensi'));
  if(S.cert1)b.appendChild(el('div','cert',`<img alt="Sertifikat keahlian tahap 1" src="${certImage()}">`));
  b.appendChild(el('div','',bars(Object.keys(SKILLS).map(k=>{const a=S.skills[k],v=Math.round(avg(a));return[SKILLS[k],v,a.length?v+' · '+predikat(v):'belum'];}))));
  b.appendChild(el('div','mat','<span>Tahapan PKL</span>'));
  b.appendChild(el('div','',`<table class="tbl"><tr><td>1</td><td><b>Fabrikasi dasar, pengukuran, bor & tap</b></td><td>${S.cert1?'✅ Lulus':'▶ Berjalan'}</td></tr>${LOCKED.map(l=>`<tr><td>${l.n}</td><td><b>${l.title}</b><br><span class="muted small">${l.desc}</span></td><td>🔒</td></tr>`).join('')}</table>`));
  b.appendChild(el('div','mat','<span>Order tahap 1</span>'));
  const g=el('div','');ORDERS.forEach((o,i)=>{const v=S.done[o.id];const r=el('div','schr',`<span>${i+1}. ${esc(o.title)}<small>${[...new Set(o.steps.map(s=>STEP[s.t].k))].map(k=>SKILLS[k]).join(' · ')}</small></span>`);
    const right=el('span','');right.style.cssText='display:flex;gap:8px;align-items:center';right.appendChild(el('b','num',v!=null?String(v):'–'));
    if(v!=null&&!busy&&S.next>=ORDERS.length)right.appendChild(btn('Latihan','gr',()=>{closeModal();runOrder(o,true).then(freeRoam);}));r.appendChild(right);g.appendChild(r);});b.appendChild(g);
  b.appendChild(row(btn('Kembali','y',G.openMenu)));});}
function openJurnal(){modal(b=>{b.appendChild(el('div','kick','Jurnal PKL'));b.appendChild(el('h2','','Jurnal harian & laporan guru'));
  b.appendChild(el('div','jr',S.journal.length?S.journal.map(j=>`<div><span class="num muted">Hari ${j.d}</span><span>${esc(j.t)}</span></div>`).join(''):'<p>Belum ada catatan.</p>'));
  const ta=el('textarea','');ta.id='rep';ta.readOnly=true;ta.value=reportText();b.appendChild(ta);
  b.appendChild(row(btn('Salin laporan','g',()=>{const fb=()=>{ta.focus();ta.select();toast('Teks dipilih. Tekan Ctrl+C untuk menyalin.');};try{navigator.clipboard.writeText(ta.value).then(()=>toast('Laporan disalin ✓','ok'),fb);}catch(e){fb();}}),btn('Kembali','y',G.openMenu)));});}
function askName(startAfter){modal(b=>{b.appendChild(el('div','kick','Simulasi PKL · Teknik Mesin'));b.appendChild(el('h2','','PKL di Bengkel Las Maju Jaya 🔧'));
  b.appendChild(el('p','','Kamu diterima sebagai <b>siswa PKL</b> di bengkel fabrikasi yang mengerjakan order komponen otomotif. Sambut pelanggan, lapor ke Pak Mandor, lalu kerjakan order di stasiun kerja. Lulus uji keahlian untuk mendapat <b>sertifikat</b>.'));
  const f={};[['name','Nama lengkap'],['kelas','Kelas (mis. X TM 1)'],['sekolah','Sekolah'],['guru','Guru pembimbing']].forEach(([k,ph])=>{const i=el('input','nm');i.placeholder=ph;i.maxLength=40;i.value=S[k]||'';i.id='f-'+k;i.setAttribute('aria-label',ph);b.appendChild(i);f[k]=i;});
  b.appendChild(el('div','fb info','<b>Cara bergerak:</b><br>• Komputer: <b>W A S D</b> berjalan, <b>Shift</b> lari, <b>seret mouse</b> memutar kamera, <b>scroll</b> zoom, <b>E</b> interaksi.<br>• HP/tablet: <b>joystick kiri</b> berjalan, <b>seret layar</b> memutar kamera, <b>cubit</b> zoom, <b>ketuk tombol</b> yang muncul untuk interaksi.<br>• Ikuti tanda <b>◆ kuning</b> dan jarak di kotak misi.'));
  b.appendChild(row(btn(startAfter?'Masuk bengkel ▸':'Simpan','y',()=>{const n=f.name.value.trim();if(!n){f.name.focus();toast('Isi namamu dulu ✍️');return;}Object.keys(f).forEach(k=>S[k]=f[k].value.trim());save();closeModal();G.makePlayer();if(startAfter)mainLoop();})));setTimeout(()=>f.name.focus(),50);});}
G.openMenu=()=>modal(b=>{const done=ORDERS.filter(o=>!o.exam&&(S.done[o.id]||0)>=60).length;
  b.appendChild(el('div','kick','PKL · Tahap 1 · Fabrikasi dasar, pengukuran, bor & tap'));b.appendChild(el('h2','',`Halo, ${esc(S.name||'siswa PKL')} 👋`));
  b.appendChild(el('p','',`Hari PKL ke-<b>${S.day}</b> · order selesai <b>${done} / ${ORDERS.length-1}</b> · uang saku <b>${G.fmt(S.coins)} ¢</b> · sertifikat tahap 1: <b>${S.cert1?'sudah':'belum'}</b>`));
  b.appendChild(el('div','keys','<span><kbd>W A S D</kbd> / joystick = berjalan</span><span><kbd>Shift</kbd> lari</span><span><kbd>Spasi</kbd> lompat</span><span><kbd>E</kbd> / ketuk tombol = interaksi</span><span>Seret layar = putar kamera</span><span>Scroll / cubit = zoom</span>'));
  b.appendChild(row(btn('Kembali main','y',back),btn('🎓 Keahlian & sertifikat','g',openSkill),btn('📒 Buku saku','gr',openSaku),btn('📝 Jurnal & laporan','gr',openJurnal),btn('✏️ Identitas','gr',()=>askName(false)),
    btn('↺ Reset progres','gr',()=>modal(c=>{c.appendChild(el('h2','','Reset semua progres?'));c.appendChild(el('p','','Nilai, jurnal, dan sertifikat di perangkat ini akan dihapus.'));c.appendChild(row(btn('Batal','gr',G.openMenu),btn('Reset','r',()=>{try{localStorage.removeItem(G.KEY);}catch(e){}location.reload();})));}))));});

/* ---------- event jendela kerja ---------- */
['tab','start','accept','practice','go','station','locked','next','rescue','cam','lite','copy','reset','resetNo','resetYes'].forEach(k=>delete ACT[k]);
ACT.hint=()=>hint();ACT.saku=()=>openSaku();
const mb=G.$('#mbox');
mb.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const f=ACT[b.dataset.act];if(f){G.sfx('tap');f(b.dataset,b);}});
mb.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-hold]');if(!b)return;e.preventDefault();if(UI.hold)return;World.drilling(true);UI.hold=setInterval(drillTick,60);});
['pointerup','pointercancel'].forEach(ev=>document.addEventListener(ev,()=>stopHold(),true));addEventListener('blur',()=>stopHold());
mb.addEventListener('input',e=>{const t=e.target,f=t.dataset.f,c=G.cur;if(!f||!c)return;
  if(f==='ans')c.d.ans[t.dataset.i]=t.value;
  if(f==='mk'){c.d.mk=Number(t.value);$id('mkv').textContent=dnum(c.d.mk)+' mm';}
  if(f==='pt'){c.d.pts[t.dataset.i]=Number(t.value);$id('ptv'+t.dataset.i).textContent=dnum(t.value)+' mm';}
  if(f==='read')c.d.read=t.value;});
mb.addEventListener('change',e=>{if(e.target.dataset.f==='oil'&&G.cur)G.cur.d.oil=e.target.checked;});
mb.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset.f==='read')ACT.read();});

/* ---------- boot ---------- */
G.$('#menuBtn').onclick=()=>{G.initAudio();G.openMenu();};
G.$('#shopBtn').onclick=()=>{G.initAudio();openSaku();};
function boot(){G.teleport(0,13.5,Math.PI);G.cam.yaw=0;G.start();setTimeout(()=>G.$('#loading').classList.add('hide'),400);
  if(S.name){G.makePlayer();mainLoop();}else askName(true);}
const fr=(document.fonts&&document.fonts.ready)?Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1800))]):Promise.resolve();
fr.then(boot);
window.__g=G;window.__t={ACT,drillTick,curStep,curOrder,ORDERS,APD_RULE,STEP,APDS,RPM_OPTS,nRec,r05,ulirOK,stationOf,get goal(){return goal;},get workOpen(){return workOpen;}};
})();
