/* Pneumatik Tycoon — boot, intro, peta level, panduan guru */
(function(){
'use strict';
const {el,btn,row,modal,closeModal,toast}=G;const $=G.$;
const JEN=[{t:'Jenjang 1 · Helper Udara',s:'Kelas XI Semester 1 · F.4.1'},{t:'Jenjang 2 · Teknisi Rangkaian',s:'Kelas XI Semester 2 · F.4.2'},{t:'Jenjang 3 · Instalatur Lini',s:'Kelas XII Semester 1 · F.4.3'},{t:'Jenjang 4 · Kontraktor Otomasi',s:'Kelas XII Semester 2 · F.4.4'}];
const LV=[{id:'l1',no:1,j:0,k:'F.4.1.1',ic:'🦺',t:'Hari Pertama di Ruang Kompresor',s:'APD, lima titik bahaya, jalur udara, tekanan kerja 5 bar, uji mesin press.',ready:true},
 {id:'l2',no:2,j:0,k:'F.4.1.2',ic:'🃏',t:'Pojok Komponen: Bentuk dan Simbol',s:'12 kartu komponen penyedia udara, simbol ISO 1219, gambar rangkaian, order pertama.',ready:true},
 {id:'l3',no:3,j:0,k:'F.4.1.3',ic:'🧭',t:'Jalur Udara',s:'Pipa, selang, sambungan; drop tekanan; uji air sabun; merancang ring main.',ready:true},
 {id:'l4',no:4,j:0,k:'F.4.1.4',ic:'📐',t:'Membaca Gambar',s:'Telusur aliran, koreksi gambar pelanggan, diagnosis dua manometer. Lisensi 1.',ready:true},
 {id:'l5',no:5,j:1,k:'F.4.2.1',ic:'🔩',t:'Silinder Pertama',s:'Silinder kerja tunggal dan ganda; gaya maju-mundur MA25×100.'},
 {id:'l6',no:6,j:1,k:'F.4.2.2',ic:'🔀',t:'Katup dan Kecepatan',s:'Katup 3/2, 5/2, 5/3; meter-in dan meter-out.'},
 {id:'l7',no:7,j:1,k:'F.4.2.3',ic:'♻️',t:'Dua Silinder',s:'Diagram langkah A+ B+ A− B− dan sinyal overlap.'},
 {id:'l8',no:8,j:1,k:'F.4.2.4',ic:'⚡',t:'Listrik Masuk',s:'Relai K1, solenoid Y1/Y2, limit switch a0/a1.'},
 {id:'l9',no:9,j:2,k:'F.4.3.1',ic:'📋',t:'Terima Order',s:'Gambar kerja, daftar komponen, jadwal, analisis keselamatan.'},
 {id:'l10',no:10,j:2,k:'F.4.3.2',ic:'🧰',t:'Pasang Lini',s:'Memotong dan memasang selang, menata jalur, uji fungsi.'},
 {id:'l11',no:11,j:2,k:'F.4.3.3',ic:'🗄️',t:'Pasang Panel',s:'Pra-praktik JS-SKEH-XII-01: pengawatan 3 tahap, uji ohmmeter, uji fungsi manual dan otomatis.',ready:true},
 {id:'l12',no:12,j:2,k:'F.4.3.4',ic:'🔍',t:'Commissioning',s:'Urutan pengujian, 3 gangguan acak dengan biaya waktu henti, laporan perbaikan.',ready:true},
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
  const bs=[btn('🛒 Toko Bengkel','g',G.openShop),btn('📓 Catatan Buku','gr',catatan),btn('📘 Panduan Guru','gr',guru),btn('✏️ Ganti nama','gr',()=>askName(true)),btn('↺ Reset progres','gr',()=>{modal(c=>{c.appendChild(el('h2','','Reset semua progres?'));c.appendChild(el('p','','Koin dan bintang di perangkat ini akan dihapus.'));c.appendChild(row(btn('Batal','gr',G.openMenu),btn('Reset','r',()=>{try{localStorage.removeItem(KEY);}catch(e){}location.reload();})));});})];
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
  ases:'pilihan APD, 5 tindakan bahaya, urutan jalur udara, setelan regulator, jenis kompresor, hitungan gaya, dan 3 soal analisis'},
 l2:{tp:'F.4.1.2 — murid mampu menyebutkan komponen-komponen utama sistem penyedia udara bertekanan (kompresor, tangki udara/receiver, dan unit pengkondisian udara/FRL) beserta fungsinya secara tepat (10 JP, pertemuan 6–10). Simbol ISO 1219 diperkenalkan di sini sebagai bekal Unit 4 (F.4.1.4).',
  rows:[['12 meja peraga + kartu','Bentuk fisik, fungsi, dan simbol: motor, kompresor, katup satu arah, tangki, katup pengaman, pressure switch, manometer, keran, filter, regulator, lubricator, unit F.R.L','Memahami (LKM Kegiatan 1: tabel nama – simbol – fungsi)'],
   ['Papan rangkaian','Menyusun 8 simbol tanpa nama menjadi jalur penyedia udara; membaca gambar rangkaian lengkap dan jenis garis','Mengaplikasi'],
   ['Tanda simbol di instalasi','Mencocokkan benda nyata (tangki, pompa kompresor, pressure switch, keran, unit F.R.L) dengan simbolnya','Mengaplikasi (LKM Kegiatan 2: pengamatan langsung)'],
   ['Order pertama','8 bar → psi dan kPa; memilih kapasitas kompresor untuk kebutuhan 120 liter/menit; membaca istilah Inggris pada datasheet F.R.L','Menganalisis (pertanyaan lintas disiplin 1–3)'],
   ['Kuis + Catatan Buku Tulis','Akibat tanpa F.R.L, fungsi dua manometer, segitiga kosong vs terisi; tabel 6 simbol dan gambar jalur','Merefleksi']],
  alur:'• Pertemuan 6 — Awal: tunjukkan satu komponen asli, “ini apa dan untuk apa?” · Inti: murid berpasangan mengumpulkan 12 kartu · Penutup: murid mengisi tabel nama – simbol – fungsi pada LKM.<br>• Pertemuan 7 — Inti: papan rangkaian, tanda simbol, order pertama, kuis · Penutup: Catatan Buku Tulis dan paraf.<br>• Pertemuan 8–10 — pengamatan langsung kompresor dan unit F.R.L bengkel, laporan kelompok, dan presentasi (LKM Kegiatan 2–3).',
  ases:'12 soal kartu, urutan 8 simbol, 5 tanda simbol, 3 keputusan order, dan 3 soal analisis'},
 l3:{tp:'F.4.1.3 — murid mampu menganalisis jenis pipa, selang, dan sambungan pada jaringan distribusi udara bertekanan, mengidentifikasi jalur distribusi udara di bengkel, serta menghitung dan mengevaluasi penyebab drop tekanan dan kebocoran sesuai prosedur kerja industri (10 JP, pertemuan 11–15).',
  rows:[['Rak pipa, selang & sambungan','Pipa aluminium/galvanis untuk jalur utama, selang PU untuk cabang, push-in fitting, elbow – T – reducer – union','Memahami (LKM Kegiatan 1)'],
   ['Manometer di 3 titik','Mengukur tekanan pangkal–tengah–ujung, menghitung drop, membandingkan dengan batas 0,1 bar per 50 m','Mengaplikasi · Menganalisis (LKM Kegiatan 2)'],
   ['Uji air sabun di 6 sambungan','Menemukan 3 bocor (letaknya acak), memilih perbaikan: push-in, ulir + seal tape, O-ring kopling; meteran udara terbuang berjalan','Mengaplikasi (LKM Kegiatan 3)'],
   ['Hitung kerugian','3 lubang × 0,3 kW × 2.400 jam × Rp1.500','Menganalisis'],
   ['Meja denah','Ring main vs jaringan buntu, kemiringan 1–2 % ke drain, cabang leher angsa, hitungan drop (kuadrat debit × panjang)','Menganalisis (pertanyaan lintas disiplin 1–2)'],
   ['Kuis + Catatan Buku Tulis','Uji penurunan tekanan, diameter pipa, panjang ekivalen; sketsa denah jalur bengkel sekolah','Merefleksi']],
  alur:'• Pertemuan 11 — Awal: semprot air sabun pada satu sambungan asli · Inti: rak material dan tiga manometer · Penutup: murid menghitung drop pada LKM.<br>• Pertemuan 12 — Inti: uji air sabun, hitung kerugian, meja denah, kuis · Penutup: Catatan Buku Tulis.<br>• Pertemuan 13–15 — penelusuran jalur bengkel, sketsa denah, pengukuran dua titik, uji kebocoran nyata, dan laporan (LKM Kegiatan 1–3).',
  ases:'4 pilihan material, analisis drop, 3 perbaikan bocor, hitungan kerugian, 4 keputusan rancangan, dan 3 soal analisis. Bonus koin berkurang selama bocor belum ditambal, tetapi tidak memengaruhi bintang'},
 l4:{tp:'F.4.1.4 — murid mampu menganalisis gambar rangkaian sistem penyedia udara bertekanan (kompresor, tangki udara, unit pengolah udara/FRL, dan jaringan distribusi) berdasarkan simbol standar ISO 1219 melalui proyek kelompok secara tepat (6 JP, pertemuan 16–18).',
  rows:[['Meja gambar · telusur aliran','Mengetuk 8 komponen pada gambar tanpa nama sesuai jalannya udara','Mengaplikasi (LKM Kegiatan 2: menelusuri alur)'],
   ['Tiga gambar pelanggan','Mencari kesalahan: urutan F.R.L terbalik, katup satu arah terbalik, F.R.L sebelum tangki','Menganalisis'],
   ['Lengkapi gambar','Memilih simbol untuk 4 kotak kosong: katup satu arah, katup pengaman, pressure switch, regulator','Mengaplikasi (LKM Kegiatan 1)'],
   ['Dua manometer di instalasi','P1 = 8 bar, P2 = 3 bar → gangguan di filter/regulator; perbaikan','Menganalisis (soal esai 2)'],
   ['Proyek pelanggan','Waktu isi tangki t = (V × P) ÷ Q; dua kompresor paralel; letak air dryer','Menganalisis (pertanyaan lintas disiplin 1, esai 4–5)'],
   ['Kuis + Catatan + Lisensi 1','Jenis garis, alasan letak F.R.L, larangan keran sebelum katup pengaman; menyalin gambar lengkap dan legenda','Merefleksi']],
  alur:'• Pertemuan 16 — Awal: tempel gambar rangkaian bengkel, “udara lewat mana dulu?” · Inti: telusur aliran, tiga gambar pelanggan, lengkapi gambar · Penutup: murid menggambar ulang minimal 6 simbol pada LKM.<br>• Pertemuan 17 — Inti: dua manometer, proyek pelanggan, kuis, Catatan Buku Tulis · Penutup: Lisensi 1.<br>• Pertemuan 18 — proyek kelompok: analisis gambar instalasi yang berbeda tiap kelompok, presentasi (LKM Kegiatan 2).',
  ases:'telusur aliran, 3 koreksi gambar, 4 simbol, diagnosis, 3 keputusan proyek, dan 3 soal analisis'},
 l11:{tp:'F.4.3.3 — murid mampu melakukan instalasi kelistrikan kontrol (solenoid valve, relay/kontaktor, dan sensor/limit switch) pada sistem elektro-pneumatik serta menguji fungsi otomatisnya sesuai skema rangkaian dan prosedur keselamatan kerja (10 JP, pertemuan 11–15). Level ini sekaligus pra-praktik Jobsheet JS-SKEH-XII-01.',
  rows:[['Siapkan ujung kabel','Potong – kupas – tube marking – skun Y – kencangkan','Memahami'],
   ['Pengawatan tahap 1–2','Jalur daya X1 → Q1 → G1 (kuning); S1 → Y1 dan S2 → Y2 pada 24 VDC (biru); nomor kabel = nomor pada gambar; maksimal 2 skun per terminal','Mengaplikasi (LKM Kegiatan 1)'],
   ['Uji tanpa tegangan','Ohmmeter antara rel + dan −: OL, lalu ± 192 Ω saat S1 ditekan; urutan menghidupkan udara lalu listrik','Mengaplikasi (soal PG 7)'],
   ['Uji fungsi manual','Tiga prediksi lalu amati: denyut S1, 24 V dimatikan, S1 + S2 bersamaan (Tabel 1 jobsheet)','Menganalisis (LKM Kegiatan 2)'],
   ['Pengawatan tahap 3','Reed switch a1 seri koil relay K1; kontak K1 paralel S2; alasan memakai relay','Mengaplikasi · Menganalisis'],
   ['Uji fungsi otomatis','Satu tekan satu siklus; S1 ditahan → dua koil saling melawan (bahan pengayaan interlock)','Menganalisis'],
   ['Kuis + Catatan Buku Tulis','Sensor PNP tiga kabel, syarat urutan dua silinder, single vs double solenoid; gambar rangkaian dan tabel daftar marking','Merefleksi']],
  alur:'• Pertemuan 11 — Awal: tunjukkan katup 4V120-06 dan konektor DIN asli · Inti: siapkan kabel, pengawatan tahap 1–2, uji ohmmeter · Penutup: murid menyalin tabel daftar marking.<br>• Pertemuan 12 — Inti: uji fungsi manual, tahap 3, uji otomatis, kuis · Penutup: Catatan Buku Tulis.<br>• Pertemuan 13–15 — praktik Jobsheet JS-SKEH-XII-01 di lab dengan tabel marking dari catatan; pengayaan: reed switch dan interlock.',
  ases:'urutan menyiapkan kabel, 3 tahap pengawatan (lolos pada pemeriksaan pertama), 3 soal sebelum diberi tegangan, 5 prediksi uji fungsi, alasan relay, dan 3 soal analisis'},
 l12:{tp:'F.4.3.4 — murid mampu melakukan pengujian fungsi (commissioning) dan troubleshooting instalasi pneumatik serta menyusun laporan hasil perbaikan secara tepat (6 JP, pertemuan 16–18).',
  rows:[['Urutan commissioning','Visual → udara bertahap 5 bar → uji bocor → override manual → listrik → siklus otomatis','Memahami (LKM Kegiatan 1)'],
   ['Tiga gangguan acak','Satu kelistrikan (kabel putus, koil putus, atau reed bergeser), satu arah/aliran (selang tertukar atau flow control tertutup), satu tekanan (bocor atau regulator rendah)','Menganalisis (LKM Kegiatan 2)'],
   ['Sembilan pemeriksaan','LED konektor, tegangan, tahanan koil, override, manometer, air sabun, LED reed, flow control, telusur selang; tiap pemeriksaan dan salah tebak menambah biaya waktu henti','Mengaplikasi'],
   ['Metode dan analisis','Isolasi bertahap; silinder lambat pada 5 bar (pertanyaan lintas disiplin 1)','Menganalisis'],
   ['Laporan + kuis + Catatan','Gejala awal, dugaan penyebab, pengujian, tindakan, uji ulang; meter-out, uji ulang, silinder kerja tunggal','Merefleksi']],
  alur:'• Pertemuan 16 — Awal: “mesin baru dirakit, boleh langsung dijalankan?” · Inti: urutan commissioning dan gangguan pertama · Penutup: diskusi mengapa menebak mahal.<br>• Pertemuan 17 — Inti: dua gangguan berikutnya, laporan, kuis · Penutup: murid menyalin laporannya ke buku.<br>• Pertemuan 18 — praktik: guru memasang satu gangguan pada trainer tiap kelompok; murid melacak dan menulis laporan dengan format yang sama.',
  ases:'urutan commissioning, 3 penetapan penyebab (benar pada pilihan pertama), 2 soal metode, dan 3 soal analisis. Biaya waktu henti hanya memengaruhi bonus koin, bukan bintang'}};
function catatan(){modal(b=>{b.appendChild(el('div','kick','📓 Catatan Buku Tulis'));b.appendChild(el('h2','','Pilih catatan yang ingin dibuka'));b.appendChild(el('p','','Setiap level ditutup dengan catatan yang <b>ditulis tangan di buku</b>: bacaan untuk diringkas, gambar atau tabel simbol, istilah, dan dua pertanyaan untuk dijawab dengan kalimat sendiri.'));
  const g=el('div','tpgrid');LV.filter(t=>t.ready).forEach(t=>{const c=el('button','tpc',`<span class="no">LEVEL ${t.no}</span><span>${G.NOTES[t.id].j}</span><span class="s">${G.save.tp[t.id]?'✓ level selesai':'belum selesai'}</span>`);c.style.minHeight='84px';c.onclick=()=>G.notebook(t.id);g.appendChild(c);});b.appendChild(g);b.appendChild(row(btn('Kembali','y',G.openMenu)));});}
let gcur=null;
function guru(){gcur=gcur||(G.mode&&GURU[G.mode]?G.mode:'l1');modal(b=>{const D=GURU[gcur];b.appendChild(el('div','kick','Untuk guru'));b.appendChild(el('h2','','Panduan Penggunaan · Level '+gcur.slice(1)));
  b.appendChild(row(...Object.keys(GURU).map(k=>btn('Level '+k.slice(1),gcur===k?'y':'gr',()=>{gcur=k;guru();}))));
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
  if(!LV.some(t=>t.ready&&t.id===go))go=null;
  if(go&&G.save.name){G.makePlayer();startLV(go);}else askName(false,go);}
const fr=(document.fonts&&document.fonts.ready)?Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1800))]):Promise.resolve();
fr.then(boot);
window.__g=G;
})();
