/* Pabrik Elektronik Tycoon — boot, intro, menu TP, panduan guru */
(function(){
'use strict';
const {el,btn,row,modal,closeModal,toast}=G;const $=G.$;
const TPS=[{id:'tp1',no:1,ic:'🏭',t:'Bangun Jalur Produksi',s:'Rancang produk, pilih pemasok, IQC, bangun jalur produksi, uji mutu, kirim pesanan.'},
 {id:'tp2',no:2,ic:'🛠️',t:'Mesin Sakit',s:'Jenis perawatan, inspeksi harian, diagnosis, SOP perbaikan dengan LOTO, jadwal preventif.'},
 {id:'tp3',no:3,ic:'👷',t:'Manajer Shift',s:'Rekrut dan tempatkan pekerja, tangani kejadian shift dengan kearifan lokal.'},
 {id:'tp4',no:4,ic:'🤖',t:'Upgrade Smart Factory',s:'Revolusi industri 1.0–4.0; pasang IoT, AGV, cobot; bandingkan data.'},
 {id:'tp5',no:5,ic:'🌏',t:'Perjalanan Sebuah Lampu',s:'Siklus hidup produk, audit hijau berburu pemborosan, panel surya, daur ulang.'},
 {id:'tp6',no:6,ic:'🎓',t:'Sehari Jadi…',s:'Kumpulkan 6 kartu profesi, pilih jenjang karier, buka usaha technopreneur.'},
 {id:'tp7',no:7,ic:'🦺',t:'Petugas K3 Baru',s:'Hierarki pengendalian risiko; pilih APD yang tepat dan pakai di avatarmu.'},
 {id:'tp8',no:8,ic:'🚸',t:'Inspeksi Keselamatan',s:'Berburu 6 bahaya dengan radar, lalu pasang 6 rambu K3.'},
 {id:'tp9',no:9,ic:'♻️',t:'Bank Limbah',s:'Angkut limbah pabrik ke tong yang tepat; prosedur limbah B3.'},
 {id:'tp10',no:10,ic:'🧯',t:'Api di Panel!',s:'Alarm, putus listrik, APAR yang tepat, P.A.S.S., evakuasi, P3K.'},
 {id:'tp11',no:11,ic:'🧹',t:'Makeover 5R',s:'Red tag, shadow board, mengepel, standar visual, audit 5R.'}];
G.mode=null;
function startTP(id){G.mode=id;G['startTP'+id.slice(2)]();}
G.go=id=>{try{sessionStorage.setItem('pabrikGo',id);}catch(e){}try{window.name='pabrikGo:'+id;}catch(e){}location.reload();};
G.openMenu=()=>{modal(b=>{b.appendChild(el('div','kick','Peta misi · DK1 Fase E · TP 1–11'));b.appendChild(el('h2','',`Halo, ${G.esc(G.save.name||'Manajer')} 👋`));
  b.appendChild(el('p','',`Saldo: <b>${G.fmt(G.save.coins)} ¢</b> · pendapatan fasilitas <b>+${G.income()} ¢ per TP</b>. Belanjakan koinmu di 🛒 Koperasi.`));
  let g;TPS.forEach(t=>{if(t.no===1||t.no===7){b.appendChild(el('div','mat',`<span>${t.no===1?'Elemen 1 · Wawasan Dunia Kerja (Semester 1)':'Elemen 2 · K3LH & Budaya Kerja (Semester 2)'}</span>`));g=el('div','tpgrid');b.appendChild(g);}const r=G.save.tp[t.id];const stars=r?'⭐'.repeat(r.stars)+'<span style="opacity:.25">'+'⭐'.repeat(3-r.stars)+'</span> ':'';
    const c=el('button','tpc',`<span class="no">TP ${t.no}</span><span style="font-size:24px">${t.ic}</span><span>${t.t}</span><small>${t.s}</small><span class="s">${stars+(t.id===G.mode?'· sedang dimainkan':'▶ Mainkan')}</span>`);
    c.onclick=()=>{if(!G.mode){closeModal();startTP(t.id);}else if(t.id===G.mode)closeModal();else G.go(t.id);};g.appendChild(c);});
  b.appendChild(el('div','keys','<span><kbd>W A S D</kbd> jalan</span><span><kbd>Shift</kbd> lari</span><span><kbd>Spasi</kbd> lompat</span><span><kbd>E</kbd> interaksi</span><span>Geser layar = putar kamera</span><span>Scroll/cubit = zoom</span>'));
  const bs=[btn('🛒 Koperasi','g',G.openShop),btn('📓 Catatan Buku','gr',catatan),btn('📘 Panduan Guru','gr',guru),btn('✏️ Ganti nama','gr',()=>askName(true)),btn('↺ Reset progres','gr',()=>{modal(c=>{c.appendChild(el('h2','','Reset semua progres?'));c.appendChild(el('p','','Koin dan bintang di perangkat ini akan dihapus.'));c.appendChild(row(btn('Batal','gr',G.openMenu),btn('Reset','r',()=>{try{localStorage.removeItem('pabrikTOI_v1');}catch(e){}location.reload();})));});})];
  if(G.mode)bs.unshift(btn('Kembali main','y',closeModal));b.appendChild(row(...bs));});};
const GURU={tp1:{tp:'Murid mampu menganalisis alur proses produksi mulai dari perancangan produk, supply chain, proses produksi, quality control, hingga pengemasan pada industri manufaktur dan rekayasa elektronika secara sistematis.',
  rows:[['Ruang R&D (Bu Sari)','Tahapan perancangan, BOM','Memahami'],['Purchasing (Pak Dedi)','Supply chain: harga–mutu–waktu kirim','Memahami · Menganalisis'],['Meja IQC (Pak Wawan)','Incoming Quality Control: terima, terima sebagian + klaim, tolak & retur','Mengaplikasi'],
   ['8 petak stasiun','Jalur produksi: loader → printer → pick & place → reflow → AOI → perakitan → uji fungsi → kemas','Mengaplikasi'],['Stasiun Uji Fungsi','Membandingkan hasil ukur dengan spesifikasi','Mengaplikasi · Menganalisis'],['Laporan laba-rugi + kuis + refleksi','Dampak keputusan pada biaya & mutu','Merefleksi']],
  alur:'• Pertemuan 1 — Awal: tanya “bagaimana lampu emergency dibuat?” · Inti: murid bermain berpasangan sampai jalur terbangun · Penutup: diskusi tahap SMT.<br>• Pertemuan 2 — Inti: produksi, QC, dan pengiriman · Penutup: bandingkan laba antarkelompok; gunakan pertanyaan refleksi sebagai bahan LKM.',
  ases:'urutan desain, IQC, 8 stasiun, keputusan QC, dan 3 soal analisis'},
 tp2:{tp:'Murid mampu menerapkan prosedur perawatan peralatan produksi sesuai standar kerja industri manufaktur dan rekayasa elektronika.',
  rows:[['Pojok Maintenance (Pak Jaka)','Perawatan preventif, korektif, prediktif','Memahami'],['Kompresor (Ruang Utilitas)','Inspeksi harian: baca manometer vs standar, drain kondensat','Mengaplikasi'],['3 mesin bermasalah','Diagnosis dari gejala & data; SOP perbaikan: STOP/OFF → LOTO → energi nol → perbaiki → lepas LOTO → uji jalan & catat','Mengaplikasi'],
   ['Kartu riwayat mesin','Pencatatan gejala, penyebab, tindakan, suku cadang, downtime','Mengaplikasi'],['Papan jadwal','Menyusun jadwal preventif dari interval buku manual (KKTP: sangat berkembang)','Menganalisis'],['Minggu produksi + laporan + kuis','Perawatan terjadwal vs kerusakan mendadak; refleksi','Merefleksi']],
  alur:'• Pertemuan 1 — Awal: “apa yang terjadi kalau motor tidak pernah diservis?” · Inti: jenis perawatan, inspeksi kompresor, perbaikan mesin pertama · Penutup: murid menuliskan urutan SOP di LKM.<br>• Pertemuan 2 — Inti: dua mesin berikutnya, jadwal preventif, minggu produksi · Penutup: bandingkan hasil murid yang menunda vs menjalankan perawatan; lanjutkan dengan praktik perawatan alat di bengkel.',
  ases:'6 soal jenis perawatan, inspeksi kompresor, diagnosis, setiap langkah SOP, pilihan tindakan, 6 butir jadwal, keputusan perawatan, dan 3 soal analisis'},
 tp3:{tp:'Murid mampu menerapkan prinsip pengelolaan sumber daya manusia di lingkungan kerja dengan memperhatikan potensi dan kearifan lokal setempat.',
  rows:[['Ruang HRD (Bu Ratna)','Rekrutmen berdasarkan kompetensi & integritas; menolak nepotisme','Memahami · Mengaplikasi'],['Penempatan 5 pekerja','Orang yang tepat di pos yang tepat','Mengaplikasi'],['5 kejadian shift','Musyawarah, pelatihan (silih asah–asih–asuh), gotong royong, aturan lembur, kemitraan UMKM lokal','Mengaplikasi'],['Rekap shift + kuis','Hubungan semangat kerja dengan hasil produksi','Menganalisis · Merefleksi']],
  alur:'• Pertemuan 1 — Awal: “apa yang membuat sebuah tim kompak?” · Inti: rekrutmen dan penempatan · Penutup: diskusi nepotisme vs kompetensi.<br>• Pertemuan 2 — Inti: lima kejadian shift dan rekap · Penutup: murid menggali kearifan lokal daerahnya (bahan catatan buku bagian D).',
  ases:'2 keputusan rekrutmen, 4 penempatan, 5 kejadian, dan 3 soal analisis'},
 tp4:{tp:'Murid mampu menganalisis perkembangan revolusi industri 4.0 dan penerapan teknologi digital dalam dunia industri bidang elektronika.',
  rows:[['Kang Dimas','Urutan revolusi industri 1.0–4.0','Memahami'],['5 pad UPGRADE','Mencocokkan masalah nyata dengan teknologi: IoT, perawatan prediktif, AGV, cobot, cloud','Menganalisis'],['Dua keputusan','Keamanan siber; peningkatan keahlian pekerja (upskilling)','Menganalisis'],['Dashboard','Membaca data sebelum–sesudah; digital twin','Menganalisis · Merefleksi']],
  alur:'• Pertemuan 1 — Awal: tunjukkan foto pabrik lama dan pabrik modern · Inti: lini masa dan tiga upgrade pertama · Penutup: murid menyebut teknologi 4.0 di sekitarnya.<br>• Pertemuan 2 — Inti: sisa upgrade, dua keputusan, perbandingan data · Penutup: debat singkat “robot mengambil atau mengubah pekerjaan?”',
  ases:'urutan revolusi industri, 5 pilihan teknologi, 2 keputusan, dan 3 soal analisis'},
 tp5:{tp:'Murid mampu menganalisis product life cycle serta isu pemanasan global, waste control, dan perubahan iklim dalam konteks industri manufaktur dan rekayasa elektronika.',
  rows:[['Bu Maya','Empat fase siklus hidup produk dan strategi inovasi','Memahami · Menganalisis'],['Audit hijau (tanpa penanda)','Menemukan 5 pemborosan energi dan limbah; memilih perbaikan','Mengaplikasi · Menganalisis'],['Panel surya','Menghitung lama balik modal','Menganalisis'],['Pilah lampu bekas','Limbah B3, e-waste, plastik, kertas','Mengaplikasi'],['Laporan lingkungan','Hubungan listrik – CO₂ – pemanasan global – perubahan iklim','Merefleksi']],
  alur:'• Pertemuan 1 — Awal: “ke mana HP lamamu pergi?” · Inti: fase siklus hidup dan audit hijau · Penutup: murid mencatat pemborosan serupa di sekolah.<br>• Pertemuan 2 — Inti: panel surya, pilah lampu bekas, laporan · Penutup: rencana aksi hemat energi di bengkel.',
  ases:'4 fase, strategi, 5 perbaikan audit, hitungan balik modal, 4 pemilahan, dan 3 soal analisis'},
 tp6:{tp:'Murid mampu menganalisis profil profesi (job profile) dan peluang kewirausahaan (technopreneurship) dalam bidang manufaktur dan rekayasa elektronika.',
  rows:[['6 Kartu Profesi','Operator, teknisi, QC, engineer/drafter, purchasing & PPIC, pemrogram PLC: tugas, kompetensi, syarat, jenjang','Memahami · Mengaplikasi'],['Minat & jenjang karier','Pilihan pribadi; jenjang karier dan KKNI','Merefleksi'],['Usaha technopreneur','Membaca peluang dari data survei; HPP dan harga jual; BEP','Menganalisis'],['Lisensi akhir','Rekap bintang TP 1–6; rencana pengembangan diri (catatan buku bagian D)','Merefleksi']],
  alur:'• Pertemuan 1 — Awal: “pekerjaan apa saja yang ada di pabrik?” · Inti: enam kartu profesi · Penutup: murid memilih minat dan alasannya.<br>• Pertemuan 2 — Inti: usaha technopreneur dan lisensi · Penutup: murid menulis rencana pengembangan diri (KKTP: sangat berkembang).',
  ases:'6 tugas profesi, 3 hitungan usaha, dan 3 soal analisis'},
 tp7:{tp:'Murid mampu menerapkan prinsip dasar, peraturan, dan prosedur Keselamatan dan Kesehatan Kerja serta Lingkungan Hidup (K3LH) di lingkungan kerja elektronika.',
  rows:[['Pos K3 (Bu Tini)','Hierarki pengendalian risiko; UU No. 1 Tahun 1970','Memahami'],['Lemari APD','Memilih APD sesuai bahaya; APD terlihat dipakai avatar','Mengaplikasi'],['4 lokasi kerja','Menyolder, gudang, panel MDP, mesin bor (tanpa sarung tangan)','Mengaplikasi'],['Kuis + catatan','Mengendalikan bahaya dari sumbernya','Merefleksi']],
  alur:'• Pertemuan 1 — Awal: tunjukkan APD asli · Inti: hierarki dan dua tugas pertama · Penutup: mengapa sarung tangan bisa berbahaya?<br>• Pertemuan 2 — Inti: dua tugas terakhir, kuis, catatan buku · lanjut praktik memakai APD di bengkel (jobsheet).',ases:'urutan hierarki, 4 pilihan APD, dan 3 soal analisis'},
 tp8:{tp:'Murid mampu menerapkan makna rambu-rambu K3LH dan tindakan pencegahan terhadap jenis-jenis bahaya kerja di bengkel/industri elektronika.',
  rows:[['Inspeksi dengan radar','Menemukan 6 bahaya; jenis bahaya listrik, kebakaran, mekanik, kimia; risiko dan pencegahan','Mengaplikasi · Menganalisis'],['6 tiang rambu','Memilih rambu dari bentuk dan warna; lima kategori rambu','Mengaplikasi'],['Kuis + catatan','Menggambar rambu di buku','Merefleksi']],
  alur:'• Pertemuan 1 — Inti: berburu enam bahaya · Penutup: bahaya serupa di bengkel sekolah.<br>• Pertemuan 2 — Inti: memasang rambu, kuis, catatan · lanjut inspeksi bengkel nyata dan proyek membuat rambu.',ases:'6 jenis bahaya, 6 rambu, dan 3 soal analisis'},
 tp9:{tp:'Murid mampu menerapkan prosedur penanganan limbah Bahan Berbahaya dan Beracun (B3) sesuai standar kerja industri.',
  rows:[['Angkut & pilah','Membawa 9 limbah ke tong organik, anorganik, atau B3','Mengaplikasi'],['Prosedur B3','Pilah → kemas → simbol & label → TPS B3 → pengelola berizin; PP 22/2021','Memahami · Mengaplikasi'],['Kuis + catatan','Limbah B3 di rumah','Merefleksi']],
  alur:'• Pertemuan 1 — Awal: bawa baterai bekas ke kelas · Inti: angkut dan pilah · Penutup: benda yang mengejutkan.<br>• Pertemuan 2 — Inti: prosedur, kuis, catatan · lanjut praktik memilah limbah bengkel (jobsheet).',ases:'9 pemilahan, urutan prosedur, dan 3 soal analisis'},
 tp10:{tp:'Murid mampu menerapkan prosedur dan tindakan keselamatan dan kesehatan kerja dalam kondisi berbahaya/darurat.',
  rows:[['Api di panel','Urutan: alarm → putus listrik → APAR yang tepat → P.A.S.S.; api membesar selama murid bergerak','Mengaplikasi'],['Evakuasi','Jalur evakuasi, titik kumpul, pelaporan','Mengaplikasi'],['P3K','Luka bakar ringan dan sengatan listrik','Mengaplikasi'],['Kuis + catatan','Denah evakuasi bengkel sekolah','Merefleksi']],
  alur:'• Pertemuan 1 — Inti: simulasi sampai api padam atau evakuasi · Penutup: bandingkan murid yang berhasil dan yang kehabisan waktu.<br>• Pertemuan 2 — Inti: P3K, kuis, catatan · lanjut gladi evakuasi dan demonstrasi APAR nyata (jobsheet).',ases:'3 keputusan darurat, pilihan APAR, urutan P.A.S.S., 3 soal titik kumpul/P3K, dan 3 soal analisis'},
 tp11:{tp:'Murid mampu menerapkan budaya kerja 5R (Ringkas, Rapi, Resik, Rawat, Rajin) secara konsisten di lingkungan kerja/bengkel.',
  rows:[['Pak Jaka','Urutan dan arti 5R (5S)','Memahami'],['Ringkas','Memutuskan 8 barang: diperlukan atau red tag','Mengaplikasi'],['Rapi & Resik','Menggantung alat di shadow board; mengepel noda','Mengaplikasi'],['Rawat & Rajin','Standar visual dan kebiasaan','Menganalisis'],['Lisensi akhir','Rekap bintang TP 1–11; checklist 5R di buku','Merefleksi']],
  alur:'• Pertemuan 1 — Inti: Ringkas dan Rapi · Penutup: foto “sebelum” area bengkel sekolah.<br>• Pertemuan 2 — Inti: Resik, Rawat, Rajin, kuis, catatan · lanjut proyek penataan bengkel 5R (jobsheet).',ases:'urutan 5R, 8 keputusan Ringkas, 2 keputusan Rawat/Rajin, dan 3 soal analisis'}};
function catatan(){modal(b=>{b.appendChild(el('div','kick','📓 Catatan Buku Tulis'));b.appendChild(el('h2','','Pilih catatan yang ingin dibuka'));b.appendChild(el('p','','Setiap TP ditutup dengan catatan yang <b>ditulis tangan di buku</b>: bacaan untuk diringkas, bagan dan istilah untuk disalin, serta pertanyaan untuk dijawab dengan kalimat sendiri.'));
  const g=el('div','tpgrid');TPS.forEach(t=>{const c=el('button','tpc',`<span class="no">TP ${t.no}</span><span>${G.NOTES[t.id].j}</span><span class="s">${G.save.tp[t.id]?'✓ TP selesai':'belum selesai'}</span>`);c.style.minHeight='84px';c.onclick=()=>G.notebook(t.id);g.appendChild(c);});b.appendChild(g);b.appendChild(row(btn('Kembali','y',G.openMenu)));});}
function guru(){const k=G.mode||'tp1';let cur=k;const draw=()=>modal(b=>{const D=GURU[cur];b.appendChild(el('div','kick','Untuk guru'));b.appendChild(el('h2','',`Panduan Penggunaan · ${cur.toUpperCase().replace('TP','TP ')}`));
  b.appendChild(row(...TPS.map(t=>btn('TP '+t.no,cur===t.id?'y':'gr',()=>{cur=t.id;draw();}))));
  b.appendChild(el('p','',`<b>Tujuan Pembelajaran:</b> ${D.tp}`));
  b.appendChild(el('div','',`<table class="tbl"><tr><th>Bagian game</th><th>Materi</th><th>Pembelajaran Mendalam</th></tr>${D.rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>`));
  b.appendChild(el('div','fb info','<b>Saran alur 2 × 3 JP:</b><br>'+D.alur));
  b.appendChild(el('div','fb ok','<b>Literasi:</b> setiap TP ditutup dengan <b>Catatan Buku Tulis</b> (ringkasan bacaan, bagan, istilah, dan dua pertanyaan esai pendek). Murid baru bisa melihat hasil akhir setelah mencentang bahwa catatannya sudah ditulis; guru memberi paraf di buku.'));
  b.appendChild(el('div','know',`<b>Asesmen formatif:</b> bintang dihitung dari keputusan yang benar pada percobaan pertama (${D.ases}). Murid menekan <b>Salin hasil</b> lalu menempelkannya di Google Classroom.`));
  b.appendChild(row(btn('Kembali','y',G.openMenu)));});draw();}
function askName(again,go){modal(b=>{b.appendChild(el('div','kick','PT TOI Elektronika · Citeureup'));b.appendChild(el('h2','','Pabrik Elektronik Tycoon 🏭'));
  b.appendChild(el('p','','Kamu baru saja diangkat menjadi <b>Manajer Produksi</b> di sebuah pabrik elektronik. Setiap keputusanmu — memilih pemasok, merawat mesin, memimpin tim, sampai menjaga lingkungan — akan terlihat di <b>laba pabrik</b>. Siap?'));
  const inp=el('input','nm');inp.placeholder='Tulis namamu (mis. Budi X TOI 1)';inp.maxLength=28;inp.value=G.save.name||'';b.appendChild(inp);
  b.appendChild(el('div','keys','<span><kbd>W A S D</kbd>/joystick jalan</span><span><kbd>Shift</kbd> lari</span><span><kbd>Spasi</kbd> lompat</span><span><kbd>E</kbd>/ketuk tombol untuk interaksi</span><span>Geser layar = putar kamera</span>'));
  const ok=btn('Masuk pabrik ▸','y',()=>{const n=inp.value.trim();if(!n){inp.focus();toast('Isi namamu dulu ✍️');return;}G.save.name=n;G.persist();closeModal();
    makePlayer();if(again)return;
    if(go)startTP(go);else if(G.save.tp.tp1)G.openMenu();else startTP('tp1');});
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')ok.click();});b.appendChild(row(ok));setTimeout(()=>inp.focus(),50);});}
function makePlayer(){G.makePlayer();}
$('#menuBtn').onclick=()=>{G.initAudio();G.openMenu();};
$('#shopBtn').onclick=()=>{G.initAudio();if(!G.ui.busy())G.openShop();};
function boot(){G.teleport(0,10.5,Math.PI);G.cam.yaw=0;G.start();setTimeout(()=>$('#loading').classList.add('hide'),400);
  let go=null;try{go=sessionStorage.getItem('pabrikGo');sessionStorage.removeItem('pabrikGo');}catch(e){}
  try{if(!go&&/^pabrikGo:/.test(window.name))go=window.name.slice(9);if(/^pabrikGo:/.test(window.name))window.name='';}catch(e){}
  if(!/^tp([1-9]|1[01])$/.test(go||''))go=null;
  if(go&&G.save.name){makePlayer();startTP(go);}else askName(false,go);}
const fr=(document.fonts&&document.fonts.ready)?Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1800))]):Promise.resolve();
fr.then(boot);
window.__g=G;
})();
