/* Level 1 · F.4.1.1 — Hari Pertama di Ruang Kompresor: pengenalan sistem pneumatik dan K3 udara bertekanan */
(function(){
'use strict';
const {scene,el,btn,row,say,modal,closeModal,toast,W,V}=G;
const R={step:-1,ok:0,total:0,found:0};G.L1=R;const sc=ok=>{R.total++;if(ok)R.ok++;};let setStep;const JK=G.JAKA;
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const cine=async(pos,look,dur,fn)=>{G.P.frozen=true;G.cinema={pos:V3(...pos),look:V3(...look)};if(fn)await fn();await G.wait(dur);G.cinema=null;G.P.frozen=false;};

/* ---------- 1. lemari APD ---------- */
const APD={helm:['⛑️','Helm pengaman'],kacamata:['🥽','Kacamata pengaman'],masker:['😷','Masker'],earmuff:['🎧','Pelindung telinga'],sarung:['🧤','Sarung tangan']};
const NEED=['kacamata','earmuff'],WHY={kacamata:'serpihan dan debu yang tertiup udara bertekanan dapat melukai mata',earmuff:'bising kompresor yang terus-menerus merusak pendengaran'};
const NO={sarung:'<b>DILARANG</b> memakai sarung tangan di dekat sabuk dan puli yang berputar: sarung tangan dapat tergulung dan menarik tangan.'};
function locker(){const sel=new Set();let first=true;const draw=fb=>modal(b=>{b.appendChild(el('div','kick','Lemari APD · ruang kompresor'));b.appendChild(el('h2','','Pilih APD untuk masuk ruang kompresor'));
  b.appendChild(el('p','','Wearpack dan sepatu safety sudah kamu pakai. Di dalam ada <b>kompresor yang bising</b>, <b>udara bertekanan</b>, serta <b>sabuk dan puli yang berputar</b>. Pilih <b>APD tambahan yang wajib</b>. APD disediakan perusahaan, jadi tidak memotong koinmu.'));
  const ch=el('div','');ch.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin:8px 0';Object.keys(APD).forEach(k=>{const x=btn(APD[k][0]+' '+APD[k][1],sel.has(k)?'y':'gr',()=>{sel.has(k)?sel.delete(k):sel.add(k);G.player.wear(k,sel.has(k));draw();});ch.appendChild(x);});b.appendChild(ch);
  if(fb)b.appendChild(el('div','',fb));b.appendChild(row(btn('Periksa ✓','y',()=>{const miss=NEED.filter(k=>!sel.has(k)),bad=[...sel].filter(k=>NO[k]);
    if(!miss.length&&!bad.length){sc(first);G.sfx('ok');W.doorCol.on=false;
      modal(c=>{c.appendChild(el('div','kick','APD tepat'));c.appendChild(el('h2','','Pintu ruang kompresor terbuka 🚪'));c.appendChild(el('div','fb ok','<b>Mengapa APD itu?</b>'+NEED.map(k=>`<br>• ${APD[k][0]} <b>${APD[k][1]}</b>: ${WHY[k]}`).join('')));
        c.appendChild(el('div','know',NO.sarung));c.appendChild(el('div','know','<b>Tahukah kamu?</b> Menurut <b>UU No. 1 Tahun 1970</b> tentang Keselamatan Kerja, pengurus tempat kerja wajib menyediakan APD secara cuma-cuma, dan pekerja wajib memakainya.'));
        c.appendChild(row(btn('Masuk ruang kompresor ▸','y',()=>{closeModal();G.addCoins(20,'APD tepat');startHunt();})));});}
    else{first=false;G.sfx('bad');draw('<div class="fb bad">❌ Belum tepat.'+miss.map(k=>`<br>• Kurang: <b>${APD[k][1]}</b>`).join('')+bad.map(k=>`<br>• ⚠️ ${NO[k]}`).join('')+'</div>');}}),btn('Tutup','gr',closeModal)));});draw();}

/* ---------- 2. inspeksi lima titik bahaya ---------- */
const HZ=[
 {id:'drain',p:[-10.95,-5],obj:'Genangan air di bawah tangki',t:'Air menetes dari bawah tangki kompresor',
  top:'Di bawah tangki ada genangan. Keran drain di dasar tangki tampak <b>sudah lama tidak dibuka</b>, padahal setiap kali udara dimampatkan, uap airnya mengembun menjadi <b>kondensat</b>.',
  o:[['Buka keran drain di dasar tangki sampai airnya habis, lalu jadwalkan drain setiap hari',1],['Biarkan saja; airnya akan menguap sendiri',0,'Air di dalam tangki tertutup tidak menguap. Tangki berkarat dari dalam dan airnya terbawa ke alat pneumatik.'],['Naikkan tekanan kompresor agar airnya terdorong keluar lewat selang',0,'Justru air itu akan ikut masuk ke filter, katup, dan silinder.'],['Lap genangannya; tangki tidak perlu diapa-apakan',0,'Genangan hanya gejala. Sumbernya kondensat di dalam tangki.']],
  ok:'Kondensat dibuang dari <b>titik terendah tangki</b>. Bila dibiarkan, tangki <b>berkarat dari dalam</b>, isi udaranya berkurang, dan air terbawa ke alat.',cam:[[-11.6,.7,-3.9],[-9.75,.3,-5]],
  fix:async()=>{W.drainLever.rotation.y=Math.PI/2;G.sfx('truck');await new Promise(r=>G.anim(1.8,k=>{W.puddle.scale.set(1.2*(1+k*.5),.8*(1+k*.5),1);},r));W.drop.visible=false;W.drainLever.rotation.y=0;await new Promise(r=>G.anim(1,k=>{W.puddle.material.opacity=.5*(1-k);},r));W.puddle.visible=false;}},
 {id:'guard',p:[-9.35,-3.8],obj:'Pelindung sabuk tergeletak',t:'Pelindung sabuk dilepas dan tidak dipasang lagi',
  top:'Sabuk dan puli kompresor <b>berputar terbuka</b>. Pelindung kuningnya tergeletak di lantai.',
  o:[['Matikan kompresor dari panel, tunggu sampai berhenti, lalu pasang kembali pelindung sabuk',1],['Pasang pelindung sekarang juga selagi kompresor berputar supaya cepat',0,'Mendekatkan tangan ke sabuk yang berputar adalah penyebab kecelakaan paling sering. Matikan dulu.'],['Cukup pasang rambu “awas sabuk berputar”',0,'Rambu hanya pengendalian administratif. Pelindung mesin (rekayasa teknik) lebih ampuh dan sudah tersedia.'],['Tidak apa-apa selama semua orang berhati-hati',0,'Baju, rambut, atau jari dapat tertarik dalam sekejap.']],
  ok:'Bagian yang berputar <b>wajib tertutup pelindung</b>. Urutannya: <b>matikan → tunggu berhenti → pasang → hidupkan lagi</b>.',cam:[[-8.2,1.5,-3],[-9.6,.95,-4.8]],
  fix:async()=>{W.kompOn=false;W.lampOn.material.emissiveIntensity=0;W.lampOff.material.emissiveIntensity=1.4;G.sfx('beep');await G.wait(.8);const g=W.guard,a=W.guardOff,b=W.guardOn;await new Promise(r=>G.anim(1.3,k=>{const e=G.ease(k);g.position.set(G.lerp(a[0],b[0],e),G.lerp(a[1],b[1],e)+Math.sin(k*Math.PI)*.35,G.lerp(a[2],b[2],e));g.rotation.set(G.lerp(a[3],b[3],e),0,G.lerp(a[5],b[5],e));},r));G.sfx('build');await G.wait(.5);W.kompOn=true;W.lampOn.material.emissiveIntensity=1.2;W.lampOff.material.emissiveIntensity=0;}},
 {id:'kabel',p:[-10.95,-6.4],obj:'Kabel daya terkelupas',t:'Isolasi kabel motor terkelupas di lantai yang lembap',
  top:'Kabel daya dari <b>panel listrik</b> ke motor kompresor terkelupas. Tembaganya terlihat, memercik, dan lantainya lembap.',
  o:[['Matikan MCB di panel dan pasang tanda “jangan dinyalakan”, laporkan, lalu ganti kabelnya',1],['Lilit bagian yang terkelupas dengan isolasi selagi kompresor hidup',0,'Menyentuh kabel bertegangan 380 V di lantai lembap dapat mematikan. Putuskan listriknya dulu.'],['Geser kabel ke pinggir dengan kaki supaya tidak terinjak',0,'Kabel itu masih bertegangan. Menyentuhnya, walau dengan sepatu, tetap berbahaya.'],['Siram lantainya agar percikan api padam',0,'Air menghantarkan listrik. Bahayanya justru meluas.']],
  ok:'Bahaya listrik ditangani dengan <b>memutus sumbernya dulu</b>, mengunci dan memberi tanda (LOTO), baru diperbaiki oleh orang yang berwenang.',cam:[[-9.6,1.5,-5.9],[-11.2,.5,-7]],
  fix:async()=>{W.kompOn=false;W.sparkOn=false;W.lampOn.material.emissiveIntensity=0;W.lampOff.material.emissiveIntensity=1.4;W.tagLoto.visible=true;G.sfx('beep');await G.wait(1.3);W.bare.visible=false;G.sfx('build');await G.wait(.9);W.tagLoto.visible=false;W.kompOn=true;W.lampOn.material.emissiveIntensity=1.2;W.lampOff.material.emissiveIntensity=0;}},
 {id:'bocor',p:[.5,-6.9],obj:'Desis di sambungan F.R.L',t:'Udara mendesis di sambungan keluar unit F.R.L',
  top:'Di sisi <b>KELUAR</b> unit F.R.L terdengar desis dan terlihat kepulan. Selang biru <b>tidak masuk penuh</b> ke fitting.',
  o:[['Tutup keran, buang sisa tekanan, tekan selang sampai terkunci, lalu uji dengan air sabun',1],['Dorong selangnya lebih dalam selagi masih bertekanan',0,'Selang bertekanan yang terlepas dapat mencambuk ke segala arah. Buang tekanannya dulu.'],['Biarkan; kebocoran kecil tidak berpengaruh',0,'Kebocoran kecil pun membuat kompresor lebih sering hidup dan tagihan listrik naik sepanjang tahun.'],['Tutup lubangnya dengan jari untuk memastikan letak bocor',0,'Udara bertekanan dapat menembus kulit. Gunakan air sabun untuk mencari kebocoran.']],
  ok:'Sebelum melepas atau memasang selang: <b>tutup keran dan buang tekanan</b>. Kebocoran dicari dengan <b>air sabun</b>, bukan dengan tangan.',cam:[[1.9,1.9,-5.6],[.2,1.45,-7.8]],
  fix:async()=>{W.frlValve.userData.lever.rotation.z=Math.PI/2;G.sfx('tap');await G.wait(.8);W.leakOn=false;G.sfx('build');await G.wait(.8);W.frlValve.userData.lever.rotation.z=0;}},
 {id:'selang',p:[3.5,-4.9],obj:'Selang melintang di lantai',t:'Selang biru melintang di jalur orang berjalan',
  top:'Selang dari F.R.L ke mesin press <b>melintang di lantai</b>. Orang bisa tersandung, dan selang bisa terlindas lalu pecah.',
  o:[['Pindahkan jalur selang menyusur dinding dan kunci dengan klem',1],['Biarkan; yang penting udaranya sampai ke mesin',0,'Selang yang terinjak atau terlindas cepat rusak, dan orang dapat tersandung.'],['Tutupi selang dengan kardus supaya tidak terlihat',0,'Bahaya yang tersembunyi malah lebih berbahaya.'],['Potong selangnya supaya lebih pendek',0,'Selang yang terlalu pendek menjadi tegang dan mudah lepas dari fitting.']],
  ok:'Selang dan kabel ditata <b>di luar jalur orang berjalan</b>, mengikuti dinding atau rak, dan dikunci dengan klem.',cam:[[3.4,3.4,-2.6],[3.9,.2,-7]],
  fix:async()=>{await G.wait(.4);W.hoseMessy.visible=false;W.hoseTidy.visible=true;W.clips.forEach(c=>c.visible=true);G.sfx('build');}}];
function startHunt(){setStep(2);HZ.forEach(h=>{h.ring=G.ring(h.p[0],h.p[1]);});}
function radar(){const p=G.P.pos;let best=1e9;HZ.forEach(h=>{if(!h.done)best=Math.min(best,Math.hypot(h.p[0]-p.x,h.p[1]-p.z));});
  G.radar=R.step===2&&best<1e8?`📡 Radar bahaya: ${best<2.2?'🔥 sangat dekat!':'±'+Math.round(best)+' m'} · ${R.found}/5 ditemukan`:'';}
function inspect(h){G.ask(`Titik bahaya ${R.found+1} dari 5`,h.t,`<p>${h.top}</p><p><b>Tindakan mana yang benar?</b></p>`,h.o,(b)=>{b.appendChild(el('div','fb ok','✅ '+h.ok));
  b.appendChild(row(btn('Kerjakan ▸','y',async()=>{closeModal();h.done=true;h.ring.userData.kill();await cine(h.cam[0],h.cam[1],.9,h.fix);R.found++;G.addCoins(30,'Bahaya dikendalikan');R.refresh();
    if(R.found>=HZ.length){G.radar='';toast('Lima titik bahaya sudah aman ✓','ok');setStep(3);}else toast(`Aman! ${5-R.found} titik bahaya lagi — ikuti radar 📡`,'ok');})));},sc);}

/* ---------- 3. jalur udara ---------- */
const JALUR=[['🌀','Kompresor','mengisap dan memampatkan udara'],['🛢️','Tangki udara','menyimpan udara; kondensat dibuang lewat drain'],['🔧','Keran dan pipa utama','menyalurkan udara 8 bar ke titik pakai'],['🧽','Filter','menyaring air dan kotoran'],['🎚️','Regulator','menurunkan ke tekanan kerja 5 bar'],['💧','Lubricator','menambahkan kabut oli'],['🔀','Katup 5/2','mengatur arah udara ke silinder'],['🔩','Silinder mesin press','mengubah tekanan udara menjadi gerak']];

/* ---------- 4. setel regulator ---------- */
function drawGauge(cv,v){const x=cv.getContext('2d'),w=cv.width,c=w/2,max=10,ang=u=>(135+270*u)*Math.PI/180;x.clearRect(0,0,w,w);
  x.fillStyle='#15181d';x.beginPath();x.arc(c,c,c,0,7);x.fill();x.fillStyle='#fdfdfb';x.beginPath();x.arc(c,c,c*.9,0,7);x.fill();
  x.strokeStyle='#2fbf6f';x.lineWidth=c*.11;x.beginPath();x.arc(c,c,c*.76,ang(.45),ang(.55));x.stroke();x.strokeStyle='#d62828';x.beginPath();x.arc(c,c,c*.76,ang(.8),ang(1));x.stroke();
  x.strokeStyle='#111';for(let i=0;i<=20;i++){const a=ang(i/20),mj=i%2===0;x.lineWidth=mj?c*.03:c*.014;x.beginPath();x.moveTo(c+Math.cos(a)*c*(mj?.6:.68),c+Math.sin(a)*c*(mj?.6:.68));x.lineTo(c+Math.cos(a)*c*.82,c+Math.sin(a)*c*.82);x.stroke();}
  x.fillStyle='#111';x.font=`700 ${c*.18}px Arial`;x.textAlign='center';x.textBaseline='middle';for(let k=0;k<=10;k+=1){const a=ang(k/10);x.fillText(String(k),c+Math.cos(a)*c*.46,c+Math.sin(a)*c*.46);}
  x.font=`700 ${c*.15}px Arial`;x.fillText('bar',c,c*1.45);const a=ang(v/max);x.strokeStyle='#c1121f';x.lineWidth=c*.045;x.lineCap='round';x.beginPath();x.moveTo(c-Math.cos(a)*c*.14,c-Math.sin(a)*c*.14);x.lineTo(c+Math.cos(a)*c*.7,c+Math.sin(a)*c*.7);x.stroke();x.fillStyle='#111';x.beginPath();x.arc(c,c,c*.07,0,7);x.fill();}
function regulator(){let v=7,first=true,lock=false;modal(b=>{b.appendChild(el('div','kick','Unit F.R.L · regulator'));b.appendChild(el('h2','','Setel tekanan kerja'));
  b.appendChild(el('p','','Pipa utama bertekanan <b>8 bar</b>. Manometer regulator sekarang menunjuk <b>7 bar</b> — terlalu tinggi untuk alat praktik. Setel ke <b>tekanan kerja praktik SKEH</b>, lalu kunci kenopnya.'));
  const wrap=el('div','qcw');const cv=document.createElement('canvas');cv.width=cv.height=360;wrap.appendChild(cv);const side=el('div');wrap.appendChild(side);b.appendChild(wrap);
  const rd=el('div','',`<table class="read"><tr><td>Tekanan masuk (pipa utama)</td><td>8,0 bar</td></tr><tr><td>Tekanan keluar (manometer)</td><td id="rv">7,0 bar</td></tr><tr><td>Kenop</td><td id="rk">terbuka (ditarik)</td></tr></table>`);side.appendChild(rd);
  side.appendChild(el('div','spec','Cara menyetel regulator: <b>tarik</b> kenop untuk membuka kunci → putar <b>ke kiri (−)</b> untuk menurunkan, <b>ke kanan (+)</b> untuk menaikkan → <b>tekan</b> kenop untuk mengunci.'));
  const fb=el('div');const upd=()=>{drawGauge(cv,v);G.$('#rv').textContent=v.toFixed(1).replace('.',',')+' bar';W.regGauge.userData.set(v);W.regKnob.rotation.y=v;};
  const tw=d=>()=>{if(lock)return;v=G.clamp(Math.round((v+d)*2)/2,0,8);G.sfx('tap');upd();};
  side.appendChild(row(btn('⟲ − 0,5','gr',tw(-.5)),btn('⟳ + 0,5','gr',tw(.5))));
  side.appendChild(row(btn('🔒 Tekan kenop (kunci)','y',()=>{if(lock)return;if(Math.abs(v-5)<.01){lock=true;sc(first);G.sfx('ok');G.$('#rk').textContent='terkunci (ditekan)';fb.innerHTML='<div class="fb ok">✅ <b>5 bar</b> — tekanan kerja praktik di bengkel TOI. Tekanan yang lebih tinggi tidak membuat kerja lebih baik: udara terbuang, komponen cepat aus, dan gerakan silinder jadi kasar.</div>';
      b.appendChild(row(btn('Lanjut ▸','y',()=>{closeModal();G.addCoins(30,'Tekanan kerja tepat');setStep(5);})));}
    else{first=false;G.sfx('bad');fb.innerHTML=`<div class="fb bad">❌ ${v>5?'Masih terlalu tinggi':'Terlalu rendah — gaya silinder tidak cukup'}. Tekanan kerja praktik SKEH di bengkel TOI adalah <b>5 bar</b> (daerah hijau pada manometer).</div>`;}})));
  b.appendChild(fb);upd();});}

/* ---------- 5. papan jenis kompresor ---------- */
function papan(){G.ask('Papan info · jenis kompresor','Piston atau screw?',`<table class="tbl"><tr><th></th><th>Kompresor PISTON (torak)</th><th>Kompresor SCREW (ulir)</th></tr>
  <tr><td><b>Cara kerja</b></td><td>Torak naik-turun di dalam silinder memampatkan udara</td><td>Dua rotor ulir berputar saling mengait dan memampatkan udara</td></tr>
  <tr><td><b>Aliran udara</b></td><td>Berdenyut, perlu tangki</td><td>Rata dan terus-menerus</td></tr>
  <tr><td><b>Pola pakai</b></td><td>Sebentar-sebentar (hidup–mati)</td><td>Terus-menerus sepanjang shift</td></tr>
  <tr><td><b>Suara & harga</b></td><td>Lebih bising; murah; perawatan sederhana</td><td>Lebih senyap; mahal; perawatan khusus</td></tr></table>
  <p><b>Bengkel sekolah memakai udara hanya saat praktik, 2 JP per minggu, dengan beberapa silinder kecil.</b> Jenis kompresor mana yang paling masuk akal?</p>`,
  [['Kompresor piston dengan tangki — cocok untuk pemakaian sebentar-sebentar dan anggaran terbatas',1],['Kompresor screw — karena paling modern',0,'Screw unggul bila dipakai terus-menerus. Untuk 2 JP per minggu, harganya tidak sebanding dengan manfaatnya.'],['Kompresor screw tanpa tangki — supaya hemat tempat',0,'Pemakaian sedikit dan terputus-putus justru membuat screw sering hidup-mati dan boros.'],['Dua kompresor piston tanpa tangki',0,'Aliran kompresor piston berdenyut; tanpa tangki tekanannya tidak stabil.']],
  b=>{b.appendChild(el('div','fb ok','✅ Kompresor dipilih dari <b>kebutuhan udara dan pola pemakaian</b>, bukan dari yang paling canggih. Kompresor di ruang ini berjenis <b>piston berpenggerak sabuk</b>.'));b.appendChild(row(btn('Lanjut ▸','y',()=>{closeModal();G.addCoins(20,'Paham jenis kompresor');setStep(6);})));},sc,true);}

/* ---------- 6. uji mesin press ---------- */
async function press(){G.P.frozen=true;G.cinema={pos:V3(4.3,2.3,-.6),look:V3(6.2,1.5,-3.2)};toast('Dua tombol hijau ditekan bersamaan… ⬇️','ok');await G.wait(.9);
  for(let i=0;i<3;i++){W.newPiece();await G.wait(.25);await W.pressCycle();G.addCoins(15,'Benda kerja '+(i+1));await G.wait(.25);}
  G.cinema=null;G.P.frozen=false;
  G.ask('Mesin press bekerja','Berapa gaya tekan silindernya?',`<p>Udara <b>5 bar</b> dari regulator mendorong piston berdiameter <b>50 mm</b>. Gaya dorong dihitung dengan <b>F = p × A</b>.</p>
   <div class="spec">p = 5 bar = 0,5 N/mm² &nbsp;·&nbsp; A = π/4 × d² = 0,785 × 50² = 1.963 mm²</div>`,
   [['F = 0,5 × 1.963 ≈ 982 N (kira-kira setara menekan dengan beban 100 kg)',1],['F = 5 × 50 = 250 N',0,'Tekanan dikalikan <b>luas</b> piston, bukan diameternya. Ubah juga bar ke N/mm².'],['F = 5 × 1.963 ≈ 9.817 N',0,'Satuan belum diubah: 5 bar = 0,5 N/mm².'],['F = 1.963 ÷ 0,5 ≈ 3.927 N',0,'Gaya = tekanan <b>dikali</b> luas, bukan dibagi.']],
   b=>{b.appendChild(el('div','fb ok','✅ Dengan udara saja, silinder sekecil itu menekan hampir <b>1.000 N</b>. Itulah sebabnya pneumatik dipakai di mesin press, penjepit, dan pemindah barang — dan itu pula sebabnya <b>dua tombol</b> dipasang agar kedua tangan operator berada di luar daerah tekan.'));
     b.appendChild(row(btn('Lanjut ke soal analisis ▸','y',()=>{closeModal();setStep(7);G.quiz(QUIZ,sc,finish);})));},sc,true);}
const QUIZ=[{q:'Sebelum melepas selang dari fitting, langkah yang benar adalah…',o:['menutup keran dan membuang sisa tekanan di dalam selang','menarik selang sekuat tenaga selagi bertekanan','menaikkan tekanan supaya selang mudah lepas','membengkokkan selang supaya udaranya berhenti'],w:'Selang bertekanan yang terlepas dapat mencambuk. Tekanan harus <b>nol</b> dulu.'},
 {q:'Urutan unit F.R.L dari sisi MASUK ke sisi KELUAR adalah…',o:['Filter → Regulator → Lubricator','Regulator → Filter → Lubricator','Lubricator → Regulator → Filter','Filter → Lubricator → Regulator'],w:'Udara harus <b>bersih dulu</b>, baru diatur tekanannya, lalu diberi kabut oli. Bila terbalik, oli tersaring habis dan regulator kemasukan kotoran.'},
 {q:'Dari kelima tindakan tadi, mana yang paling tinggi tingkatannya dalam hierarki pengendalian bahaya?',o:['Memasang kembali pelindung sabuk (rekayasa teknik)','Memakai kacamata dan pelindung telinga (APD)','Memasang rambu peringatan (administratif)','Mengingatkan teman agar berhati-hati'],w:'APD adalah <b>lapis terakhir</b>. Pelindung mesin mengendalikan bahaya langsung di sumbernya.'}];
function finish(qok){G.player.strip&&G.player.strip();G.finish({id:'l1',no:1,kode:'F.4.1.1',name:'Hari Pertama di Ruang Kompresor',badge:'Helper Udara Siaga 🦺',R,val:R.ok,metric:'5 titik bahaya dikendalikan · tekanan kerja <b>5 bar</b>',
  lines:['Titik bahaya dikendalikan: 5/5','Tekanan kerja disetel: 5 bar',`Kuis analisis: ${qok}/3`],
  points:['Jalur udara: <b>kompresor → tangki → pipa utama → Filter → Regulator → Lubricator → katup → silinder</b>.','<b>Kondensat</b> dibuang setiap hari dari titik terendah tangki.','Sebelum membuka sambungan: <b>tutup keran, buang tekanan</b>. Kebocoran dicari dengan <b>air sabun</b>.','Tekanan kerja praktik SKEH: <b>5 bar</b>. Gaya silinder: <b>F = p × A</b>.','Di dekat bagian yang berputar: <b>tanpa sarung tangan</b>; pelindung mesin wajib terpasang.'],
  reflect:'Lihat kompresor dan unit F.R.L di bengkel sekolahmu. Bahaya mana dari lima tadi yang juga kamu temukan di sana, dan apa yang bisa kamu lakukan?'});}

/* ---------- mulai ---------- */
G.startL1=async()=>{G.apd(G.player);G.updaters.add(radar);
  setStep=G.quest(R,'LEVEL 1 · RUANG KOMPRESOR',()=>['Temui Pak Jaka di depan ruang kompresor','Ambil APD yang tepat di lemari APD',`Inspeksi: temukan 5 titik bahaya (${R.found}/5)`,'Lapor ke Pak Jaka: susun jalur udara','Setel regulator di unit F.R.L','Baca papan jenis kompresor','Uji mesin press pneumatik','Jawab soal analisis'],
    n=>n===0||n===3?V(-7.1,.7):n===1?V(-11.4,-.2):n===4?V(0,-6.9):n===5?V(-7.25,-7.1):n===6?V(6.2,-2.2):null);
  G.addInter({pos:V(-7.1,.7),obj:JK,label:'Bicara',r:2.2,fn:async()=>{
    if(R.step===0){await say(JK,`Selamat datang, ${G.esc(G.save.name)}! Saya Jaka, teknisi utilitas. Di bengkel ini hampir semua alat digerakkan oleh <b>udara bertekanan</b> — itulah <b>pneumatik</b>.`);
      await say(JK,'Udaranya dibuat di <b>ruang kompresor</b> itu, lalu mengalir lewat pipa biru ke unit <b>F.R.L</b>, dan berakhir di <b>mesin press</b> di sebelah kanan.');
      await say(JK,'Tapi ingat: udara 8 bar menyimpan energi besar. Sebelum masuk, ambil dulu <b>APD yang tepat</b> di lemari biru di samping pintu. Pintunya baru terbuka kalau APD-mu benar.');setStep(1);}
    else if(R.step===3){await say(JK,'Kerja bagus — lima bahaya sudah aman. Sekarang buktikan kamu paham <b>jalannya udara</b>, dari kompresor sampai silinder.');
      G.orderGame('Jalur udara bertekanan','Susun dari tempat udara dibuat sampai tempat udara bekerja. Petunjuk: lihat lagi pipa dan selang yang kamu lewati.',JALUR,sc,b=>{b.appendChild(el('div','fb ok','✅ Tepat. Udara <b>dibuat</b> (kompresor), <b>disimpan</b> (tangki), <b>disalurkan</b> (pipa), <b>disiapkan</b> (F.R.L), <b>diatur arahnya</b> (katup), lalu <b>bekerja</b> (silinder).'));
        b.appendChild(row(btn('Lanjut ▸','y',async()=>{closeModal();G.addCoins(40,'Paham jalur udara');await say(JK,'Satu lagi. Manometer regulator menunjuk <b>7 bar</b> — terlalu tinggi. Tolong setel ke <b>tekanan kerja</b> kita di unit <b>F.R.L</b>.');setStep(4);})));});}
    else await say(JK,G.pick(['Udara bertekanan itu mahal: setiap desis kebocoran adalah listrik yang terbuang.','Kebiasaan pertama teknisi pneumatik setiap pagi: buang kondensat dari tangki.','Selang jangan pernah diarahkan ke badan, apalagi ke teman.','Kalau ragu, tutup keran dan buang tekanan dulu.']));}});
  G.addInter({pos:V(-11.4,-.2),obj:'Lemari APD',label:'Pilih APD',r:1.9,on:()=>R.step===1,fn:locker});
  HZ.forEach(h=>G.addInter({pos:V(h.p[0],h.p[1]),obj:h.obj,label:'Periksa',r:1.7,on:()=>R.step===2&&!h.done,fn:()=>inspect(h)}));
  G.addInter({pos:V(0,-6.9),obj:'Unit F.R.L',label:'Setel regulator',r:2,on:()=>R.step===4,fn:regulator});
  G.addInter({pos:V(0,-6.9),obj:'Unit F.R.L',label:'Amati',r:2,on:()=>R.step!==4&&R.step!==2,fn:()=>say('Unit F.R.L','Udara <b>MASUK</b> dari kiri (8 bar) → <b>Filter</b> menyaring air dan kotoran → <b>Regulator</b> mengatur tekanan kerja → <b>Lubricator</b> memberi kabut oli → <b>KELUAR</b> ke mesin di kanan.')});
  G.addInter({pos:V(-7.25,-7.1),obj:'Papan info',label:'Baca',r:1.8,on:()=>R.step===5,fn:papan});
  G.addInter({pos:V(6.2,-2.2),obj:'Mesin press pneumatik',label:'Uji mesin',r:2,on:()=>R.step===6,fn:press});
  G.addInter({pos:V(7.5,-2.2),obj:'Mbak Rina · Operator',label:'Bicara',r:1.8,on:()=>R.step!==6,fn:()=>say('Mbak Rina · Operator',G.pick(['Mesin press ini ditekan dengan dua tombol sekaligus, supaya kedua tangan saya pasti di luar daerah tekan.','Kalau tekanannya turun di bawah 5 bar, hasil press-nya tidak rata.','Silinder di atas itu kerja ganda: udara mendorongnya turun, udara pula yang menariknya naik.']))});
  R.step=-1;R.refresh();
  await say('Bu Laras · Kepala Bengkel',`Selamat bergabung di <b>Bengkel Pneumatik PT TOI</b>, ${G.esc(G.save.name)}. Hari ini kamu mulai sebagai <b>Helper Udara</b>.`);
  await say('Bu Laras · Kepala Bengkel','Tugas pertamamu: kenali <b>ruang kompresor</b> dan pastikan tempat itu aman. Temui <b>Pak Jaka</b> — beliau menunggu di depan ruang kompresor, sebelah kiri.');setStep(0);};
})();
