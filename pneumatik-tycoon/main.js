/* Pneumatik Tycoon — boot, intro, peta level, panduan guru */
(function(){
'use strict';
const {el,btn,row,modal,closeModal,toast}=G;const $=G.$;
const JEN=[{t:'Jenjang 1 · Helper Udara',s:'Kelas XI Semester 1 · F.4.1'},{t:'Jenjang 2 · Teknisi Rangkaian',s:'Kelas XI Semester 2 · F.4.2'},{t:'Jenjang 3 · Instalatur Lini',s:'Kelas XII Semester 1 · F.4.3'},{t:'Jenjang 4 · Kontraktor Otomasi',s:'Kelas XII Semester 2 · F.4.4'}];
const LV=[{id:'l1',no:1,j:0,k:'F.4.1.1',ic:'🦺',t:'Hari Pertama di Ruang Kompresor',s:'APD, lima titik bahaya, jalur udara, tekanan kerja 5 bar, uji mesin press.',ready:true},
 {id:'l2',no:2,j:0,k:'F.4.1.2',ic:'🛒',t:'Belanja Ruang Kompresor',s:'Memilih kompresor dari katalog; memasang tangki dan unit F.R.L.'},
 {id:'l3',no:3,j:0,k:'F.4.1.3',ic:'🧭',t:'Jalur Udara',s:'Merutekan pipa, kemiringan dan drain, mencari kebocoran.'},
 {id:'l4',no:4,j:0,k:'F.4.1.4',ic:'📐',t:'Membaca Gambar',s:'Simbol ISO 1219 dan gambar rangkaian penyedia udara.'},
 {id:'l5',no:5,j:1,k:'F.4.2.1',ic:'🔩',t:'Silinder Pertama',s:'Silinder kerja tunggal dan ganda; gaya maju-mundur MA25×100.'},
 {id:'l6',no:6,j:1,k:'F.4.2.2',ic:'🔀',t:'Katup dan Kecepatan',s:'Katup 3/2, 5/2, 5/3; meter-in dan meter-out.'},
 {id:'l7',no:7,j:1,k:'F.4.2.3',ic:'♻️',t:'Dua Silinder',s:'Diagram langkah A+ B+ A− B− dan sinyal overlap.'},
 {id:'l8',no:8,j:1,k:'F.4.2.4',ic:'⚡',t:'Listrik Masuk',s:'Relai K1, solenoid Y1/Y2, limit switch a0/a1.'},
 {id:'l9',no:9,j:2,k:'F.4.3.1',ic:'📋',t:'Terima Order',s:'Gambar kerja, daftar komponen, jadwal, analisis keselamatan.'},
 {id:'l10',no:10,j:2,k:'F.4.3.2',ic:'🧰',t:'Pasang Lini',s:'Memotong dan memasang selang, menata jalur, uji fungsi.'},
 {id:'l11',no:11,j:2,k:'F.4.3.3',ic:'🗄️',t:'Pasang Panel',s:'Pengawatan panel: kuning daya, biru kontrol, skun Y, marking.'},
 {id:'l12',no:12,j:2,k:'F.4.3.4',ic:'🔍',t:'Commissioning',s:'Menelusuri gangguan secara sistematis.'},
 {id:'l13',no:13,j:3,k:'F.4.4.1',ic:'🏆',t:'Proyek Lini Otomasi',s:'Satu order penuh: rancang, pasang, commissioning, produksi.'}];
const KEY=G.KEY||'pneumatikTOI_v1';
G.mode=null;
function startLV(id){G.mode=id;G['start'+id.toUpperCase()]();}
G.go=id=>{try{sessionStorage.setItem('pneuGo',id);}catch(e){}try{window.name='pneuGo:'+id;}catch(e){}location.reload();};
G.openMenu=()=>{modal(b=>{b.appendChild(el('div','kick','Peta level · SKEH Fase F · 13 level = 13 tujuan pembelajaran'));b.appendChild(el('h2','',`Halo, ${G.esc(G.save.name||'Helper')} 👋`));
  b.appendChild(el('p','',`Saldo: <b>${G.fmt(G.save.coins)} ¢</b> · pendapatan fasilitas <b>+${G.income()} ¢ per level</b>. Belanjakan koinmu di 🛒 Toko Bengkel.`));
  let g,cj=-1;LV.forEach(t=>{if(t.j!==cj){cj=t.j;b.appendChild(el('div','mat',`<span>${JEN[cj].t}</span><span style="color:#9fb0bf;font-weight:500">${JEN[cj].s}</span>`));g=el('div','tpgrid');b.appendChild(g);}
    const r=G.save.tp[t.id];const stars=r?'⭐'.repeat(r.stars)+'<span style="opacity:.25">'+'⭐'.repeat(3-r.stars)+'</span> ':'';
    const c=el('button','tpc'+(t.ready?'':' lock'),`<span class="no">LEVEL ${t.no} · ${t.k}</span><span style="font-size:24px">${t.ic}</span><span>${t.t}</span><small>${t.s}</small><span class="s">${t.ready?stars+(t.id===G.mode?'· sedang dimainkan':'▶ Mainkan'):'🔒 Segera hadir'}</span>`);
    c.onclick=()=>{if(!t.ready){toast('Level ini sedang disiapkan 🔧');return;}if(!G.mode){closeModal();startLV(t.id);}else if(t.id===G.mode)closeModal();else G.go(t.id);};g.appendChild(c);});
  b.appendChild(el('div','keys','<span><kbd>W A S D</kbd> / joystick = berjalan (menggeser pandangan)</span><span><kbd>Shift</kbd> lari</span><span><kbd>Spasi</kbd> lompat</span><span><kbd>E</kbd> / ketuk tombol = interaksi</span><span>Seret layar = putar kamera</span><span>Scroll / cubit = zoom</span>'));
  const bs=[btn('🛒 Toko Bengkel','g',G.openShop),btn('📓 Catatan Buku','gr',()=>G.notebook('l1')),btn('📘 Panduan Guru','gr',guru),btn('✏️ Ganti nama','gr',()=>askName(true)),btn('↺ Reset progres','gr',()=>{modal(c=>{c.appendChild(el('h2','','Reset semua progres?'));c.appendChild(el('p','','Koin dan bintang di perangkat ini akan dihapus.'));c.appendChild(row(btn('Batal','gr',G.openMenu),btn('Reset','r',()=>{try{localStorage.removeItem(KEY);}catch(e){}location.reload();})));});})];
  if(G.mode)bs.unshift(btn('Kembali main','y',closeModal));b.appendChild(row(...bs));});};
const GURU={l1:{tp:'F.4.1.1 — pengenalan sistem pneumatik: prinsip udara bertekanan, komponen penyedia udara, dan K3 bekerja dengan udara bertekanan (10 JP).',
  rows:[['Lemari APD','Memilih APD sesuai bahaya ruang kompresor; larangan sarung tangan di dekat bagian berputar; UU No. 1/1970','Memahami · Mengaplikasi'],
   ['Inspeksi 5 titik bahaya (radar)','Kondensat & drain, pelindung sabuk, kabel terkelupas & LOTO, kebocoran sambungan, penataan selang','Mengaplikasi · Menganalisis'],
   ['Susun jalur udara','Kompresor → tangki → pipa utama → Filter → Regulator → Lubricator → katup 5/2 → silinder','Memahami'],
   ['Setel regulator','Tekanan pipa utama 8 bar, tekanan kerja praktik 5 bar; cara mengunci kenop','Mengaplikasi'],
   ['Papan jenis kompresor','Piston vs screw: memilih dari pola pemakaian','Menganalisis'],
   ['Uji mesin press','Pemanfaatan pneumatik; F = p × A (Ø50, 5 bar ≈ 982 N); tombol dua tangan','Mengaplikasi · Menganalisis'],
   ['Kuis + Catatan Buku Tulis','Sketsa rangkaian jalur pneumatik; akibat kondensat tidak dibuang dan F.R.L terbalik','Merefleksi']],
  alur:'• Pertemuan 1 (2 JP) — Awal: “mengapa pintu bus bisa membuka sendiri?” · Inti: murid bermain berpasangan sampai lima titik bahaya aman · Penutup: bahas bahaya serupa di bengkel sekolah.<br>• Pertemuan 2 (2 JP) — Inti: jalur udara, regulator, jenis kompresor, mesin press, kuis · Penutup: Catatan Buku Tulis dan paraf.<br>• Pertemuan 3–5 — kunjungan ke kompresor dan unit F.R.L bengkel: drain kondensat, membaca manometer, menyetel 5 bar (LKM).',
  ases:'pilihan APD, 5 tindakan bahaya, urutan jalur udara, setelan regulator, jenis kompresor, hitungan gaya, dan 3 soal analisis'}};
function guru(){modal(b=>{const D=GURU.l1;b.appendChild(el('div','kick','Untuk guru'));b.appendChild(el('h2','','Panduan Penggunaan · Level 1'));
  b.appendChild(el('p','',`<b>Tujuan Pembelajaran:</b> ${D.tp}`));
  b.appendChild(el('div','',`<table class="tbl"><tr><th>Bagian game</th><th>Materi</th><th>Pembelajaran Mendalam</th></tr>${D.rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>`));
  b.appendChild(el('div','fb info','<b>Saran alur:</b><br>'+D.alur));
  b.appendChild(el('div','fb ok','<b>Literasi:</b> level ditutup dengan <b>Catatan Buku Tulis</b> (ringkasan bacaan, sketsa rangkaian jalur pneumatik, istilah, dan dua pertanyaan esai pendek). Murid baru bisa melihat hasil akhir setelah mencentang bahwa catatannya sudah ditulis; guru memberi paraf di buku.'));
  b.appendChild(el('div','know',`<b>Asesmen formatif:</b> bintang dihitung dari keputusan yang benar pada percobaan pertama (${D.ases}). Murid menekan <b>Salin hasil</b> lalu menempelkannya di Google Classroom.`));
  b.appendChild(el('div','know','<b>Konvensi SKEH yang dipakai:</b> tekanan kerja praktik 5 bar · solenoid Y1/Y2 · limit switch a0/a1 · silinder lab MA25×100.'));
  b.appendChild(row(btn('Kembali','y',G.openMenu)));});}
function askName(again,go){modal(b=>{b.appendChild(el('div','kick','Bengkel Pneumatik PT TOI · Citeureup'));b.appendChild(el('h2','','Pneumatik Tycoon 🌀'));
  b.appendChild(el('p','','Kamu diterima sebagai <b>Helper Udara</b> di sebuah bengkel pneumatik. Dari ruang kompresor sampai lini otomasi, setiap keputusanmu menentukan <b>keselamatan, biaya udara, dan pendapatan bengkel</b>. Siap?'));
  const inp=el('input','nm');inp.placeholder='Tulis namamu (mis. Budi XI TOI 1)';inp.maxLength=28;inp.value=G.save.name||'';b.appendChild(inp);
  b.appendChild(el('div','fb info','<b>Cara bergerak:</b> kamu <b>berjalan</b> di dalam bengkel — pandangan ikut bergeser mengikuti avatarmu.<br>• Komputer: <b>W A S D</b> berjalan, <b>seret mouse</b> memutar kamera, <b>scroll</b> zoom, <b>E</b> interaksi.<br>• HP/tablet: <b>joystick kiri</b> berjalan, <b>seret layar</b> memutar kamera, <b>cubit</b> zoom, <b>ketuk tombol</b> yang muncul untuk interaksi.<br>• Ikuti tanda <b>◆ kuning</b> dan jarak di kotak misi.'));
  const ok=btn('Masuk bengkel ▸','y',()=>{const n=inp.value.trim();if(!n){inp.focus();toast('Isi namamu dulu ✍️');return;}G.save.name=n;G.persist();closeModal();
    G.makePlayer();if(again)return;
    if(go)startLV(go);else if(G.save.tp.l1)G.openMenu();else startLV('l1');});
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')ok.click();});b.appendChild(row(ok));setTimeout(()=>inp.focus(),50);});}
$('#menuBtn').onclick=()=>{G.initAudio();G.openMenu();};
$('#shopBtn').onclick=()=>{G.initAudio();if(!G.ui.busy())G.openShop();};
function boot(){G.teleport(0,10.5,Math.PI);G.cam.yaw=0;G.start();setTimeout(()=>$('#loading').classList.add('hide'),400);
  let go=null;try{go=sessionStorage.getItem('pneuGo');sessionStorage.removeItem('pneuGo');}catch(e){}
  try{if(!go&&/^pneuGo:/.test(window.name))go=window.name.slice(7);if(/^pneuGo:/.test(window.name))window.name='';}catch(e){}
  if(go!=='l1')go=null;
  if(go&&G.save.name){G.makePlayer();startLV(go);}else askName(false,go);}
const fr=(document.fonts&&document.fonts.ready)?Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1800))]):Promise.resolve();
fr.then(boot);
window.__g=G;
})();
