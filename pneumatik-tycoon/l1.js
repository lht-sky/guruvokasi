/* Level 1 · F.4.1.1 — Hari Pertama di Ruang Kompresor: pengenalan sistem pneumatik dan K3 udara bertekanan */
(function(){
'use strict';
const {scene,el,btn,row,say,modal,closeModal,toast,W,V}=G;
const R={step:-1,ok:0,total:0,found:0};G.L1=R;const sc=ok=>{R.total++;if(ok)R.ok++;};let setStep;const JK=G.JAKA;
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const cine=async(pos,look,dur,fn)=>{G.P.frozen=true;G.cinema={pos:V3(...pos),look:V3(...look)};if(fn)await fn();await G.wait(dur);G.cinema=null;G.P.frozen=false;};

/* ---------- alat bantu: kartu dikelompokkan ---------- */
function sortGame(o){let first=true;const pick={};modal(b=>{b.appendChild(el('div','kick',o.kick));b.appendChild(el('h2','',o.title));if(o.intro)b.appendChild(el('p','',o.intro));
  const list=el('div');list.style.cssText='display:grid;gap:6px;margin-top:8px';
  const rows=G.shuffle(o.items.map((x,i)=>i)).map(i=>{const it=o.items[i];const r=el('div');r.style.cssText='background:#232d38;border:2px solid #34414e;border-radius:12px;padding:8px 10px';
    r.appendChild(el('div','',`<b style="font:600 14px/1.35 var(--game)">${it[0]}</b>`));const ch=el('div');ch.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin-top:6px';const wy=el('div');
    const bs=o.cats.map(c=>{const x=btn(c[1],'gr',()=>{pick[i]=c[0];bs.forEach(z=>z.className='gbtn gr');x.className='gbtn y';r.style.borderColor='#4b5a69';wy.innerHTML='';});x.style.cssText='padding:5px 11px;font-size:13px;min-height:0';ch.appendChild(x);return x;});
    r.appendChild(ch);r.appendChild(wy);list.appendChild(r);return {i,r,wy};});
  b.appendChild(list);const fb=el('div');b.appendChild(fb);
  const rr=row(btn('Periksa ✓','y',()=>{if(Object.keys(pick).length<o.items.length){toast('Pilih kelompok untuk semua kartu dulu');return;}let wrong=0;
    rows.forEach(q=>{const it=o.items[q.i],ok=pick[q.i]===it[1];q.r.style.borderColor=ok?'#22b866':'#e04848';q.wy.innerHTML=ok?'':`<div style="font:500 12.5px/1.4 var(--game);color:#ffc2c2;margin-top:5px">💡 ${it[2]||'Belum tepat.'}</div>`;if(!ok)wrong++;});
    if(!wrong){sc(first);G.sfx('ok');fb.innerHTML='';rr.remove();o.done(b);setTimeout(()=>{const m=G.$('#mbox');m.scrollTo({top:m.scrollHeight,behavior:'smooth'});},60);}else{first=false;G.sfx('bad');fb.innerHTML=`<div class="fb bad">❌ ${wrong} kartu belum tepat (bingkai merah). Baca petunjuknya, ganti pilihannya, lalu periksa lagi.</div>`;}}));b.appendChild(rr);});}
const loop=(cv,fn)=>{let last=performance.now();const f=t=>{if(!cv.isConnected)return;const dt=Math.min(.05,(t-last)/1000);last=t;fn(dt);requestAnimationFrame(f);};requestAnimationFrame(f);};
const nf=(v,d)=>v.toFixed(d===undefined?1:d).replace('.',',');

/* ---------- 0. papan udara bertekanan: sifat udara, hukum Boyle, aplikasi ---------- */
function syringe(x,w,h,V,pts){x.fillStyle='#fdfdfb';x.fillRect(0,0,w,h);const L=80,S=4.4,px=L+S*V,T=96,B=176;
  // skala mL
  x.strokeStyle='#111';x.fillStyle='#111';x.font='600 13px Arial';x.textAlign='center';for(let m=0;m<=100;m+=10){const xx=L+S*m;x.lineWidth=m%50?1:2;x.beginPath();x.moveTo(xx,T-2);x.lineTo(xx,T-(m%50?9:15));x.stroke();if(m%20===0)x.fillText(String(m),xx,T-19);}
  x.fillText('mL',L+S*100+26,T-19);
  // udara
  const pr=100/V;x.fillStyle=`rgba(31,139,255,${Math.min(.55,.08+pr*.09)})`;x.fillRect(L,T+3,px-L,B-T-6);
  x.fillStyle='#1f6fd0';pts.forEach(p=>{x.beginPath();x.arc(L+4+p[0]*(px-L-10),T+8+p[1]*(B-T-16),3.2,0,7);x.fill();});
  // tabung
  x.strokeStyle='#111';x.lineWidth=3;x.strokeRect(L,T,S*100+14,B-T);x.beginPath();x.moveTo(L+S*100+14,T-14);x.lineTo(L+S*100+14,B+14);x.stroke();
  // ujung tertutup + selang manometer
  x.fillStyle='#fdfdfb';x.fillRect(L-34,T+30,34,B-T-60);x.strokeRect(L-34,T+30,34,B-T-60);x.fillStyle='#d62828';x.fillRect(L-46,T+26,12,B-T-52);
  x.strokeStyle='#111';x.lineWidth=2.5;x.beginPath();x.moveTo(L-18,T+30);x.lineTo(L-18,62);x.stroke();
  const gc=[L-18,40];x.fillStyle='#fdfdfb';x.beginPath();x.arc(gc[0],gc[1],24,0,7);x.fill();x.stroke();const ga=a=>(135+270*a)*Math.PI/180,u=Math.min(1,(pr-1)/5);
  x.lineWidth=1.5;for(let i=0;i<=5;i++){const a=ga(i/5);x.beginPath();x.moveTo(gc[0]+Math.cos(a)*17,gc[1]+Math.sin(a)*17);x.lineTo(gc[0]+Math.cos(a)*22,gc[1]+Math.sin(a)*22);x.stroke();}
  x.strokeStyle='#c1121f';x.lineWidth=2.5;x.beginPath();x.moveTo(gc[0],gc[1]);x.lineTo(gc[0]+Math.cos(ga(u))*18,gc[1]+Math.sin(ga(u))*18);x.stroke();
  // piston karet + batang + pegangan
  x.fillStyle='#22272c';x.fillRect(px,T+3,12,B-T-6);x.fillStyle='#c9d1d8';x.fillRect(px+12,(T+B)/2-7,560-px+40,14);x.strokeStyle='#111';x.lineWidth=2;x.strokeRect(px+12,(T+B)/2-7,560-px+40,14);
  x.fillStyle='#c9d1d8';x.fillRect(px+52+560-px,T-10,14,B-T+20);x.strokeRect(px+52+560-px,T-10,14,B-T+20);
  x.textAlign='left';x.fillStyle='#d62828';x.font='700 14px Arial';x.fillText('ujung ditutup',L-46,B+36);x.fillStyle='#1f6fd0';x.fillText('udara terkurung',L+70,B+36);}
function papanUdara(){const pts=Array.from({length:60},()=>[Math.random(),Math.random()]);let V=100,seen=new Set([100]),shown=false;
  modal(b=>{b.appendChild(el('div','kick','Papan belajar · udara bertekanan'));b.appendChild(el('h2','','Coba sendiri: tabung suntik tertutup'));
    b.appendChild(el('p','','Di dalam tabung ada <b>100 mL udara</b> bertekanan <b>1 bar absolut</b> (tekanan udara luar). Ujungnya ditutup, jadi udara tidak bisa keluar. <b>Tekan</b> pistonnya sampai <b>25 mL</b> dan amati manometer serta butir udaranya.'));
    const cv=document.createElement('canvas');cv.width=660;cv.height=230;cv.style.cssText='width:100%;border-radius:12px;background:#fdfdfb;border:2px solid #34414e';b.appendChild(cv);
    const rd=el('div');b.appendChild(rd);const nx=el('div');b.appendChild(nx);
    const upd=()=>{const P=100/V;rd.innerHTML=`<table class="tbl"><tr><th>Volume V</th><th>Tekanan P (absolut)</th><th>P × V</th></tr><tr><td><b>${V} mL</b></td><td><b>${nf(P,2)} bar</b></td><td>${nf(P*V,0)} bar·mL</td></tr></table>`;
      if(V<=25&&!shown){shown=true;G.sfx('ok');nx.appendChild(el('div','fb ok',`✅ Volume tinggal <b>¼</b>, tekanan naik <b>4 kali</b>. Hasil <b>P × V selalu tetap</b> — inilah <b>hukum Boyle</b>: <b>P₁·V₁ = P₂·V₂</b> (suhu tetap).`));
        nx.appendChild(el('div','know','<b>Tiga sifat udara bertekanan</b><br>🗜️ <b>Dapat dimampatkan</b> (compressible): volumenya bisa diperkecil, tekanannya naik — seperti yang baru kamu lakukan.<br>🛢️ <b>Dapat disimpan</b>: udara mampat disimpan di <b>tangki</b> dan dipakai saat perlu.<br>〰️ <b>Mudah disalurkan</b>: lewat pipa dan selang ke mesin yang jauh dari kompresor.'));
        nx.appendChild(row(btn('Hitung isi tangki ▸','y',boyleTangki)));}};
    b.appendChild(row(btn('◀ Tekan (−5 mL)','y',()=>{if(V>20){V-=5;seen.add(V);upd();}}),btn('Tarik (+5 mL) ▶','gr',()=>{if(V<100){V+=5;upd();}})));upd();
    loop(cv,dt=>{const k=Math.min(1,dt*6);pts.forEach(p=>{p[0]=G.clamp(p[0]+(Math.random()-.5)*.06*k*3,0,1);p[1]=G.clamp(p[1]+(Math.random()-.5)*.06*k*3,0,1);});syringe(cv.getContext('2d'),cv.width,cv.height,V,pts);});});}
function boyleTangki(){G.ask('Hukum Boyle · tangki kompresor','Berapa udara bebas yang tersimpan di tangki?',`<p>Tangki kompresor bengkel bervolume <b>200 L</b>. Manometernya menunjuk <b>8 bar</b>. Manometer mengukur tekanan <b>di atas</b> udara luar (tekanan <i>gauge</i>), jadi tekanan absolutnya <b>8 + 1 = 9 bar</b>.</p>
  <p>Jika seluruh udara di dalam tangki dilepas ke udara luar (<b>1 bar absolut</b>), berapa volumenya?</p><div class="spec">P₁·V₁ = P₂·V₂ → V₁ = P₂·V₂ / P₁ &nbsp;·&nbsp; P₁ = 1 bar (udara luar), P₂ = 9 bar (di tangki), V₂ = 200 L</div>`,
  [['V₁ = 9 × 200 / 1 = 1.800 L',1],['V₁ = 8 × 200 / 1 = 1.600 L',0,'Pakai tekanan <b>absolut</b>: angka manometer ditambah 1 bar udara luar.'],['V₁ = 200 / 9 ≈ 22 L',0,'Udara yang dilepas <b>mengembang</b>, jadi volumenya harus lebih besar dari 200 L.'],['V₁ = 200 + 9 = 209 L',0,'Hukum Boyle memakai <b>perkalian</b> P × V, bukan penjumlahan.']],
  b=>{b.appendChild(el('div','fb ok','✅ Tangki <b>200 L</b> berisi udara setara <b>1.800 L</b> udara bebas — sembilan kali volumenya. Itulah mengapa udara bertekanan <b>dapat disimpan</b>, dan mengapa tangki yang penuh menyimpan <b>energi besar</b>: kebocoran atau tangki berkarat bisa berbahaya.'));
    b.appendChild(row(btn('Lanjut: pneumatik di industri ▸','y',aplikasi)));},sc);}
function aplikasi(){sortGame({kick:'Papan belajar · aplikasi pneumatik',title:'Di mana udara bertekanan bekerja?',intro:'Kelompokkan setiap contoh ke <b>sektor industrinya</b>. Bandingkan dengan pengalamanmu: pernah melihat yang mana?',
  cats:[['oto','🚗 Otomotif'],['mkn','🥤 Makanan & minuman'],['mfg','🏭 Manufaktur'],['ktr','🏢 Perkantoran & layanan']],
  items:[['Kunci roda pneumatik (impact wrench) untuk melepas baut roda di bengkel mobil','oto','Alat ini sering terdengar “trrrt” di bengkel ban dan servis kendaraan.'],['Penyemprot cat (spray gun) untuk mengecat bodi mobil','oto','Pengecatan bodi kendaraan.'],
   ['Pengisi dan penutup botol pada lini produksi minuman','mkn','Lini botol minuman.'],['Pendorong kemasan mi instan yang beratnya kurang ke jalur buang','mkn','Lini pengemasan makanan.'],
   ['Penjepit benda kerja pada mesin bor','mfg','Pembuatan komponen di pabrik.'],['Mesin press untuk mencetak komponen logam','mfg','Pembuatan komponen di pabrik.'],
   ['Pintu otomatis bus dan kereta','ktr','Layanan transportasi umum.'],['Pengirim dokumen lewat pipa (pneumatic tube) di rumah sakit dan bank','ktr','Layanan di gedung perkantoran.']],
  done:b=>{b.appendChild(el('div','fb ok','✅ Pneumatik ada di mana-mana: dari bengkel mobil, pabrik makanan, mesin pabrik, sampai pintu bus. Tulis contoh-contoh ini sebagai <b>mind map</b> di Catatan Buku Tulis.'));
    b.appendChild(row(btn('Ambil APD ▸','y',()=>{closeModal();G.addCoins(40,'Paham udara bertekanan');setStep(2);toast('Sekarang ambil APD di lemari biru samping pintu ruang kompresor','ok');})));}});}

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
function startHunt(){setStep(3);HZ.forEach(h=>{h.ring=G.ring(h.p[0],h.p[1]);});}
function radar(){const p=G.P.pos;let best=1e9;HZ.forEach(h=>{if(!h.done)best=Math.min(best,Math.hypot(h.p[0]-p.x,h.p[1]-p.z));});
  G.radar=R.step===3&&best<1e8?`📡 Radar bahaya: ${best<2.2?'🔥 sangat dekat!':'±'+Math.round(best)+' m'} · ${R.found}/5 ditemukan`:'';}
function inspect(h){G.ask(`Titik bahaya ${R.found+1} dari 5`,h.t,`<p>${h.top}</p><p><b>Tindakan mana yang benar?</b></p>`,h.o,(b)=>{b.appendChild(el('div','fb ok','✅ '+h.ok));
  b.appendChild(row(btn('Kerjakan ▸','y',async()=>{closeModal();h.done=true;h.ring.userData.kill();await cine(h.cam[0],h.cam[1],.9,h.fix);R.found++;G.addCoins(30,'Bahaya dikendalikan');R.refresh();
    if(R.found>=HZ.length){G.radar='';toast('Lima titik bahaya sudah aman ✓ — sekarang lihat bagian dalam kompresor','ok');setStep(4);}else toast(`Aman! ${5-R.found} titik bahaya lagi — ikuti radar 📡`,'ok');})));},sc);}

/* ---------- 2b. bagian dalam kompresor piston (gambar potongan, konvensi ISO 128) ---------- */
const CR=40,CL=120,CY=350,CRN=66,HF=120,BDC=CY-(CL-CR)-CRN,TDC=CY-(CL+CR)-CRN,PT=9;   // PT: tekanan tangki 8 bar manometer = 9 bar absolut; katup buang membuka bila tekanan silinder melampauinya
function crownY(th){return CY-(CR*Math.cos(th)+Math.sqrt(CL*CL-CR*CR*Math.sin(th)**2))-CRN;}
function compState(th){const vf=(crownY(th)-HF)/(BDC-HF);if(th<Math.PI)return {ph:0,P:1,vi:true,vo:false};const P=1/vf;return P>=PT?{ph:2,P:PT,vi:false,vo:true}:{ph:1,P,vi:false,vo:false};}
function hatch(x,path,sp){x.save();path();x.fillStyle='#e9ecef';x.fill('evenodd');x.clip('evenodd');x.strokeStyle='#2b2f33';x.lineWidth=1.1;for(let i=-700;i<700;i+=sp||9){x.beginPath();x.moveTo(i,0);x.lineTo(i+500,500);x.stroke();}x.restore();x.save();path();x.strokeStyle='#111';x.lineWidth=2.2;x.stroke();x.restore();}
function compDraw(x,w,h,th,t){x.fillStyle='#fdfdfb';x.fillRect(0,0,w,h);const S=compState(th),cy=crownY(th),pin=cy+CRN;
  // udara di silinder: makin pekat makin tinggi tekanannya
  x.fillStyle=`rgba(31,139,255,${.1+S.P*.07})`;x.fillRect(250,HF,140,cy-HF);
  // kepala silinder (dipotong) dengan saluran isap dan buang
  hatch(x,()=>{x.beginPath();x.rect(170,50,300,70);x.moveTo(170,70);x.lineTo(300,70);x.lineTo(300,120);x.lineTo(262,120);x.lineTo(262,95);x.lineTo(170,95);x.closePath();x.moveTo(340,70);x.lineTo(470,70);x.lineTo(470,95);x.lineTo(378,95);x.lineTo(378,120);x.lineTo(340,120);x.closePath();});
  x.fillStyle='#fdfdfb';x.fillRect(167,71.5,6,22);x.fillRect(467,71.5,6,22);x.fillRect(263.5,117,35,3.5);x.fillRect(341.5,117,35,3.5);
  // dinding silinder dan bak engkol (dipotong)
  hatch(x,()=>{x.beginPath();x.rect(226,HF,24,180);x.rect(390,HF,24,180);x.moveTo(196,300);x.lineTo(250,300);x.lineTo(250,314);x.lineTo(210,314);x.lineTo(210,412);x.lineTo(430,412);x.lineTo(430,314);x.lineTo(390,314);x.lineTo(390,300);x.lineTo(444,300);x.lineTo(444,426);x.lineTo(196,426);x.closePath();});
  // katup pelat (reed): isap melentur ke bawah ke dalam silinder, buang melentur ke atas ke saluran buang
  x.fillStyle='#111';x.save();x.translate(258,HF);x.rotate(S.vi?Math.min(.32,(cy-HF-3)/48):0);x.fillRect(0,0,48,4);x.restore();x.save();x.translate(382,95);x.rotate(S.vo?.32:0);x.fillRect(-48,-4,48,4);x.restore();
  // aliran udara
  x.fillStyle='#1f6fd0';const fl=(pts,on)=>{if(!on)return;for(let k=0;k<6;k++){const u=((t*.9+k/6)%1);let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}let s=u*L,i=0;while(i<seg.length-1&&s>seg[i]){s-=seg[i];i++;}const a=pts[i],b2=pts[i+1],f=Math.min(1,s/seg[i]);x.beginPath();x.arc(a[0]+(b2[0]-a[0])*f,a[1]+(b2[1]-a[1])*f,4,0,7);x.fill();}};
  fl([[150,82],[281,82],[281,140]],S.vi);fl([[359,140],[359,82],[490,82]],S.vo);
  // piston (dipotong) + ring piston (penampang tipis, dihitamkan)
  hatch(x,()=>{x.beginPath();x.rect(252,cy,136,84);x.moveTo(320+16,pin);x.arc(320,pin,16,0,Math.PI*2,true);},8);
  x.fillStyle='#111';[10,22].forEach(d=>{x.fillRect(250,cy+d,6,5);x.fillRect(384,cy+d,6,5);});
  // batang penghubung dan poros engkol (tidak diarsir, digambar tampak)
  const cxk=320+CR*Math.sin(th),cyk=CY-CR*Math.cos(th);x.fillStyle='#d9dee3';x.strokeStyle='#111';x.lineWidth=2;
  x.beginPath();x.arc(320,CY,54,0,7);x.fill();x.stroke();x.beginPath();x.arc(320,CY,10,0,7);x.stroke();
  const ang=Math.atan2(cyk-pin,cxk-320);x.save();x.translate(320,pin);x.rotate(ang);const len=Math.hypot(cxk-320,cyk-pin);x.beginPath();x.rect(-4,-9,len+8,18);x.fill();x.stroke();x.restore();
  [[320,pin,11],[cxk,cyk,13]].forEach(q=>{x.beginPath();x.arc(q[0],q[1],q[2],0,7);x.fillStyle='#fdfdfb';x.fill();x.stroke();});
  // keterangan
  x.font='700 16px Arial';x.fillStyle='#111';x.strokeStyle='#111';x.lineWidth=1.2;const lab=(tx,ty,px,py,s,al)=>{x.textAlign=al;x.fillText(s,tx,ty);x.beginPath();x.moveTo(tx+(al==='left'?-4:4),ty-5);x.lineTo(px,py);x.stroke();x.beginPath();x.arc(px,py,2.5,0,7);x.fill();};
  lab(160,30,270,122,'Katup isap','right');lab(480,30,372,96,'Katup buang','left');lab(160,180,238,180,'Silinder','right');lab(480,cy+20,388,cy+12,'Ring piston','left');lab(480,cy+58,370,cy+45,'Piston (torak)','left');
  lab(160,268,(320+cxk)/2,(pin+cyk)/2,'Batang penghubung','right');lab(160,395,320,CY,'Poros engkol','right');
  x.textAlign='left';x.fillStyle='#1f6fd0';x.fillText('◀ udara luar masuk',10,74);x.textAlign='right';x.fillText('ke tangki ▶',w-10,74);
  return S;}
const PH=[['Langkah isap','Piston bergerak <b>turun</b>. Ruang di atas piston membesar, tekanannya sedikit di bawah udara luar, sehingga <b>katup isap terbuka</b> dan udara luar masuk. Katup buang tertutup.'],
  ['Langkah kompresi','Piston bergerak <b>naik</b>. <b>Kedua katup tertutup</b>, volume udara mengecil, tekanannya naik (hukum Boyle).'],
  ['Langkah buang','Tekanan di silinder sudah <b>melebihi tekanan tangki</b>, sehingga <b>katup buang terbuka</b> dan udara mampat terdorong ke tangki.']];
function bongkar(){let th=.15,play=true,seen=new Set();modal(b=>{b.appendChild(el('div','kick','Kompresor piston · gambar potongan'));b.appendChild(el('h2','','Apa yang terjadi di dalam kompresor?'));
    b.appendChild(el('p','','Pak Jaka membuka sampul kompresor. Gambar di bawah adalah <b>gambar potongan</b>: bagian logam yang terpotong <b>diarsir miring 45°</b>, ring piston yang tipis <b>dihitamkan</b>, sedangkan poros dan batang penghubung digambar utuh. Amati <b>ketiga langkah</b> kerjanya.'));
    const cv=document.createElement('canvas');cv.width=640;cv.height=440;cv.style.cssText='width:100%;max-width:470px;display:block;margin:0 auto;border-radius:12px;background:#fdfdfb;border:2px solid #34414e';b.appendChild(cv);
    const ph=el('div','fb info');b.appendChild(ph);const nx=el('div');
    const pb=btn('⏸ Jeda','gr',()=>{play=!play;pb.textContent=play?'⏸ Jeda':'▶ Jalan';});
    b.appendChild(row(pb,btn('⏭ Langkah berikutnya','gr',()=>{play=false;pb.textContent='▶ Jalan';const s=compState(th).ph;th=s===0?Math.PI+.01:s===1?(()=>{let a=Math.PI;while(compState(a).ph!==2&&a<2*Math.PI)a+=.01;return a+.02;})():.02;})));b.appendChild(nx);
    let last=-1,t=0;loop(cv,dt=>{t+=dt;if(play)th=(th+dt*(compState(th).ph===2?.3:1.2))%(2*Math.PI);const S=compDraw(cv.getContext('2d'),cv.width,cv.height,th,t);
      if(S.ph!==last){last=S.ph;seen.add(S.ph);ph.innerHTML=`<b>${S.ph+1}. ${PH[S.ph][0]}</b> — ${PH[S.ph][1]}<br><small>Tekanan di silinder ≈ ${nf(S.P-1)} bar (manometer)</small>`;
        if(seen.size===3&&!nx.childNodes.length){nx.appendChild(row(btn('Sudah paham ketiga langkah ▸','y',kompQ)));}}
      else ph.querySelector('small').textContent=`Tekanan di silinder ≈ ${nf(Math.max(0,S.P-1))} bar (manometer)`;});});}
function kompQ(){G.ask('Kompresor piston · cek pemahaman','Saat piston bergerak TURUN…',`<p>Pilih keadaan katup yang benar.</p>`,
  [['Katup isap terbuka, katup buang tertutup — udara luar masuk ke silinder',1],['Katup isap dan katup buang sama-sama terbuka',0,'Bila keduanya terbuka, udara dari tangki akan mengalir balik ke luar.'],['Katup buang terbuka — udara terdorong ke tangki',0,'Udara terdorong ke tangki saat piston bergerak <b>naik</b>.'],['Kedua katup tertutup — udara dimampatkan',0,'Pemampatan terjadi saat piston <b>naik</b>.']],
  b=>{b.appendChild(row(btn('Soal berikutnya ▸','y',()=>G.ask('Kompresor piston · cek pemahaman','Mengapa kompresor piston selalu dipasang dengan tangki?','<p>Ingat: udara hanya terdorong keluar pada <b>langkah buang</b>, sebagian kecil dari satu putaran.</p>',
    [['Alirannya berdenyut; tangki menyimpan udara dan meratakan tekanan',1],['Supaya kompresor terlihat lebih besar',0,'Tangki punya fungsi teknis.'],['Tangki mendinginkan motor listrik',0,'Tangki menyimpan udara, bukan mendinginkan motor.'],['Supaya kondensat tidak terbentuk',0,'Justru kondensat mengendap di tangki dan harus dibuang.']],
    c=>{c.appendChild(el('div','fb ok','✅ Bagian utama kompresor piston: <b>piston</b>, <b>silinder</b>, <b>katup isap–buang</b>, dan <b>tangki</b>. Bila <b>ring piston aus</b> atau katupnya bocor, udara lolos dan tangki lama penuh walau motor berputar normal.'));
      c.appendChild(row(btn('Lanjut ▸','y',()=>{closeModal();G.addCoins(40,'Paham kompresor piston');setStep(5);toast('Baca papan JENIS KOMPRESOR di dinding belakang','ok');})));},sc))));},sc);}

/* ---------- 2c. checklist K3 kompresor ---------- */
function checklist(next){sortGame({kick:'Lapor ke Pak Jaka · checklist K3',title:'Susun checklist K3 kompresor',intro:'Pak Jaka minta kamu membuat checklist untuk ditempel di pintu ruang kompresor. Kelompokkan setiap butir: dikerjakan <b>sebelum</b>, <b>selama</b>, atau <b>sesudah</b> kompresor dioperasikan.',
  cats:[['pre','① Sebelum'],['run','② Selama'],['post','③ Sesudah']],
  items:[['Buang kondensat lewat keran drain di dasar tangki','pre','Kebiasaan pertama setiap pagi, sebelum tangki diisi.'],['Periksa pelindung sabuk terpasang dan selang tidak retak','pre','Kondisi alat diperiksa sebelum alat dinyalakan.'],['Pakai kacamata pengaman dan pelindung telinga','pre','APD dipakai sebelum masuk area kerja.'],
   ['Pantau manometer agar tidak melewati batas tekanan tangki','run','Manometer dibaca ketika kompresor sedang bekerja.'],['Jangan mengarahkan semburan udara ke badan atau teman','run','Aturan ini berlaku saat udara bertekanan sedang dipakai.'],['Jauhkan tangan, rambut, dan pakaian dari sabuk dan puli','run','Bahaya ini ada ketika mesin berputar.'],
   ['Matikan kompresor dari panel listrik','post','Sumber dimatikan setelah pekerjaan selesai.'],['Tutup keran dan buang sisa tekanan di selang','post','Sisa tekanan dibuang agar alat aman disimpan.'],['Gulung selang dan rapikan tempat kerja','post','Merapikan dilakukan di akhir pekerjaan.']],
  done:b=>{b.appendChild(el('div','fb ok','✅ Checklist siap ditempel. Potensi bahaya sistem bertekanan yang dikendalikan: <b>kebocoran</b>, <b>ledakan</b> tangki (karat karena kondensat, tekanan berlebih), dan <b>semburan</b> udara atau selang yang lepas.'));
    b.appendChild(row(btn('Lanjut ▸','y',()=>{closeModal();G.addCoins(40,'Checklist K3');next();})));}});}

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
      b.appendChild(row(btn('Lanjut ▸','y',()=>{closeModal();G.addCoins(30,'Tekanan kerja tepat');setStep(8);})));}
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
  b=>{b.appendChild(el('div','fb ok','✅ Kompresor dipilih dari <b>kebutuhan udara dan pola pemakaian</b>, bukan dari yang paling canggih. Kompresor di ruang ini berjenis <b>piston berpenggerak sabuk</b>.'));b.appendChild(row(btn('Satu kasus lagi ▸','y',papan2)));},sc,true);}
function papan2(){G.ask('Papan info · jenis kompresor','Kasus pabrik minuman',`<p>Pabrik minuman kemasan menjalankan <b>40 silinder dan peniup botol</b> tanpa henti, <b>3 shift, 24 jam</b> setiap hari. Udaranya harus bersih dan alirannya stabil.</p><p><b>Kompresor mana yang paling tepat?</b></p>`,
  [['Kompresor screw — alirannya rata dan dirancang bekerja terus-menerus',1],['Kompresor piston — karena harganya paling murah',0,'Kompresor piston dirancang bekerja <b>sebentar-sebentar</b>. Dipaksa 24 jam, ia cepat panas dan aus.'],['Kompresor piston kecil tanpa tangki',0,'Aliran piston berdenyut; tanpa tangki tekanan tidak stabil, apalagi untuk 40 silinder.'],['Jenis apa saja, asalkan tekanannya 8 bar',0,'Pemilihan kompresor juga melihat <b>pola pemakaian</b> dan <b>debit udara</b>, bukan hanya tekanan.']],
  b=>{b.appendChild(el('div','fb ok','✅ <b>Pemakaian sebentar-sebentar → piston</b> (murah, sederhana, perlu tangki). <b>Pemakaian terus-menerus dan debit besar → screw</b> (aliran rata, lebih senyap, efisien untuk kerja 24 jam).'));
    b.appendChild(row(btn('Lapor ke Pak Jaka ▸','y',()=>{closeModal();G.addCoins(20,'Paham jenis kompresor');setStep(6);})));},sc);}

/* ---------- 6. uji mesin press ---------- */
async function press(){G.P.frozen=true;G.cinema={pos:V3(4.3,2.3,-.6),look:V3(6.2,1.5,-3.2)};toast('Dua tombol hijau ditekan bersamaan… ⬇️','ok');await G.wait(.9);
  for(let i=0;i<3;i++){W.newPiece();await G.wait(.25);await W.pressCycle();G.addCoins(15,'Benda kerja '+(i+1));await G.wait(.25);}
  G.cinema=null;G.P.frozen=false;
  await say('Mbak Rina · Operator','Mesin press ini memakai <b>silinder pneumatik</b>. Di lini pengepakan sebelah, Bu Laras sedang menimbang: lebih baik pakai <b>pneumatik</b> atau <b>motor listrik</b>? Bantu dia ya.');motorVs();}
function motorVs(){modal(b=>{b.appendChild(el('div','kick','Lini pengepakan · memilih penggerak'));b.appendChild(el('h2','','Pneumatik atau motor listrik?'));
  b.appendChild(el('div','',`<table class="tbl"><tr><th>Aspek</th><th>Penggerak pneumatik</th><th>Motor listrik</th></tr>
   <tr><td><b>Gerak lurus cepat</b></td><td>Langsung dari silinder, cepat dan sederhana</td><td>Perlu mekanisme pengubah (ulir, engkol, sabuk)</td></tr>
   <tr><td><b>Mengatur kecepatan</b></td><td>Mudah: cukup memutar katup cekik</td><td>Perlu inverter atau driver</td></tr>
   <tr><td><b>Kebersihan</b></td><td>Bersih: bila bocor, yang keluar hanya udara</td><td>Bersih, tetapi pelumas roda giginya harus tertutup</td></tr>
   <tr><td><b>Area lembap</b></td><td>Aman: tidak ada listrik di aktuatornya</td><td>Perlu motor khusus tahan air</td></tr>
   <tr><td><b>Berhenti di banyak posisi</b></td><td>Sulit, karena udara dapat dimampatkan</td><td>Mudah dan presisi (motor servo)</td></tr>
   <tr><td><b>Biaya energi</b></td><td>Lebih mahal: listrik kompresor terbuang lewat panas dan kebocoran</td><td>Lebih hemat</td></tr></table>`));
  b.appendChild(row(btn('Pilih penggerak ▸','y',motorSort)));});}
function motorSort(){sortGame({kick:'Lini pengepakan · memilih penggerak',title:'Penggerak mana yang lebih sesuai?',intro:'Gunakan tabel tadi. Untuk setiap tugas, pilih penggerak yang <b>lebih sesuai</b>.',
  cats:[['pn','💨 Pneumatik'],['mt','⚡ Motor listrik']],
  items:[['Mendorong karton ke jalur samping: gerak lurus pendek, cepat, berulang, beban ringan','pn','Gerak lurus cepat adalah keunggulan silinder.'],['Mencekam tutup botol sebentar saat dikencangkan','pn','Pencekam sederhana cukup dengan silinder kecil.'],['Membuka tutup corong di ruang pencucian yang selalu basah','pn','Lihat baris <b>area lembap</b>.'],
   ['Menjalankan conveyor tanpa henti sepanjang shift','mt','Gerak putar terus-menerus lebih hemat dengan motor.'],['Memutar kipas pengering kemasan','mt','Gerak putar terus-menerus.'],['Memindahkan kamera inspeksi ke 10 posisi berbeda dengan tepat','mt','Lihat baris <b>berhenti di banyak posisi</b>.']],
  done:b=>{b.appendChild(el('div','fb ok','✅ Pneumatik unggul untuk <b>gerak lurus cepat yang sederhana</b>, area <b>lembap</b>, dan lini yang harus <b>bersih</b>. Motor listrik unggul untuk <b>putaran terus-menerus</b> dan <b>posisi presisi</b>. Teknisi otomasi sering memakai <b>keduanya</b> dalam satu mesin.'));
    b.appendChild(row(btn('Lanjut ke soal analisis ▸','y',()=>{closeModal();G.addCoins(40,'Memilih penggerak');setStep(9);G.quiz(QUIZ,sc,finish);})));}});}
const QUIZ=[{q:'Sebelum melepas selang dari fitting, langkah yang benar adalah…',o:['menutup keran dan membuang sisa tekanan di dalam selang','menarik selang sekuat tenaga selagi bertekanan','menaikkan tekanan supaya selang mudah lepas','membengkokkan selang supaya udaranya berhenti'],w:'Selang bertekanan yang terlepas dapat mencambuk. Tekanan harus <b>nol</b> dulu.'},
 {q:'Urutan unit F.R.L dari sisi MASUK ke sisi KELUAR adalah…',o:['Filter → Regulator → Lubricator','Regulator → Filter → Lubricator','Lubricator → Regulator → Filter','Filter → Lubricator → Regulator'],w:'Udara harus <b>bersih dulu</b>, baru diatur tekanannya, lalu diberi kabut oli. Bila terbalik, oli tersaring habis dan regulator kemasukan kotoran.'},
 {q:'Dari kelima tindakan tadi, mana yang paling tinggi tingkatannya dalam hierarki pengendalian bahaya?',o:['Memasang kembali pelindung sabuk (rekayasa teknik)','Memakai kacamata dan pelindung telinga (APD)','Memasang rambu peringatan (administratif)','Mengingatkan teman agar berhati-hati'],w:'APD adalah <b>lapis terakhir</b>. Pelindung mesin mengendalikan bahaya langsung di sumbernya.'},
 {q:'Kompresor piston berputar normal tanpa bunyi aneh, tetapi tekanan di tangki lama sekali naik. Penyebab yang paling mungkin adalah…',o:['ring piston aus atau ada kebocoran sehingga udara lolos','warna cat tangki mulai pudar','motor listrik berputar terlalu cepat','tangki terlalu bersih dari kondensat'],w:'Udara yang <b>lolos</b> lewat ring piston yang aus, katup yang bocor, atau sambungan pipa membuat pemampatan tidak sempurna.'},
 {q:'Manometer tangki menunjuk 8 bar. Dalam satuan kPa, tekanan itu adalah…',o:['800 kPa','80 kPa','8.000 kPa','0,8 kPa'],w:'1 bar = 100 kPa, jadi 8 bar = <b>800 kPa</b>.'}];

function finish(qok){G.player.strip&&G.player.strip();G.finish({id:'l1',no:1,kode:'F.4.1.1',name:'Hari Pertama di Ruang Kompresor',badge:'Helper Udara Siaga 🦺',R,val:R.ok,metric:'5 titik bahaya dikendalikan · tekanan kerja <b>5 bar</b>',
  lines:['Titik bahaya dikendalikan: 5/5','Checklist K3 sebelum–selama–sesudah: tersusun','Tekanan kerja disetel: 5 bar',`Kuis analisis: ${qok}/${QUIZ.length}`],
  points:['Udara bertekanan <b>dapat dimampatkan, disimpan, dan disalurkan</b>. Hukum Boyle: <b>P₁·V₁ = P₂·V₂</b>; tekanan absolut = tekanan manometer + 1 bar.','Kompresor piston: <b>isap</b> (katup isap terbuka) → <b>kompresi</b> (kedua katup tertutup) → <b>buang</b> ke tangki. Pemakaian sebentar-sebentar → <b>piston</b>; terus-menerus 24 jam → <b>screw</b>.','Jalur udara: <b>kompresor → tangki → pipa utama → Filter → Regulator → Lubricator → katup → silinder</b>. Tekanan kerja praktik SKEH: <b>5 bar</b>.','K3: <b>kondensat</b> dibuang setiap hari; sebelum membuka sambungan <b>tutup keran, buang tekanan</b>; di dekat bagian berputar <b>tanpa sarung tangan</b>.','Pneumatik unggul untuk gerak lurus cepat, area lembap, dan lini yang bersih; motor listrik untuk putaran terus-menerus dan posisi presisi.'],
  reflect:'Lihat kompresor dan unit F.R.L di bengkel sekolahmu. Bahaya mana dari lima tadi yang juga kamu temukan di sana, dan butir checklist mana yang paling sering terlupa?'});}

/* ---------- papan udara bertekanan di tengah bengkel ---------- */
function buildBoard(){const g=new THREE.Group();g.position.set(-3.4,0,3);scene.add(g);
  const bd=G.canvasPlane(1.9,1.25,(x,W2,H2)=>{x.scale(2,2);const w=W2/2,h=H2/2;x.fillStyle='#fbfbfb';x.fillRect(0,0,w,h);x.fillStyle='#1d3557';x.fillRect(0,0,w,44);x.strokeStyle='#1d3557';x.lineWidth=8;x.strokeRect(0,0,w,h);
    x.fillStyle='#f3b52f';x.font='800 27px sans-serif';x.textAlign='center';x.fillText('UDARA BERTEKANAN',w/2,32);
    const it=[['DAPAT','DIMAMPATKAN'],['DAPAT','DISIMPAN'],['MUDAH','DISALURKAN']];
    it.forEach((t,i)=>{const cx=w*(i*2+1)/6,cy=92;x.strokeStyle='#1f6fd0';x.lineWidth=3;x.fillStyle='#dcecff';
      if(i===0){x.fillRect(cx-36,cy-13,60,26);x.strokeRect(cx-36,cy-13,60,26);x.fillStyle='#22272c';x.fillRect(cx+6,cy-12,6,24);x.fillRect(cx+12,cy-3,30,6);}
      if(i===1){x.beginPath();x.ellipse(cx,cy+4,20,26,0,0,7);x.fill();x.stroke();x.beginPath();x.arc(cx,cy-30,6,0,7);x.stroke();}
      if(i===2){x.beginPath();x.moveTo(cx-42,cy+8);x.lineTo(cx-6,cy+8);x.lineTo(cx-6,cy-14);x.lineTo(cx+40,cy-14);x.stroke();x.fillStyle='#1f6fd0';x.beginPath();x.moveTo(cx+40,cy-21);x.lineTo(cx+50,cy-14);x.lineTo(cx+40,cy-7);x.fill();}
      x.fillStyle='#111';x.font='700 15px sans-serif';x.fillText(t[0],cx,cy+46);x.fillText(t[1],cx,cy+63);});
    x.fillStyle='#d62828';x.font='800 26px serif';x.fillText('P₁·V₁ = P₂·V₂',w/2,h-36);x.fillStyle='#555';x.font='600 12px sans-serif';x.fillText('Ketuk untuk mencoba · pneumatik di industri',w/2,h-14);},400);
  bd.position.set(0,1.55,.03);g.add(bd);g.add(G.at(G.box(2,1.35,.05,'#8f9aa4',{metalness:.4}),0,1.55,0));[-.85,.85].forEach(x=>g.add(G.at(G.box(.06,.95,.06,'#3d6fa8',{metalness:.4}),x,.45,0)));
  g.add(G.at(G.box(2.1,.05,.4,'#3d6fa8',{metalness:.4}),0,.03,0));G.addColBox(-3.4,3,2.1,.4);}

/* ---------- mulai ---------- */
G.startL1=async()=>{G.apd(G.player);G.updaters.add(radar);buildBoard();
  setStep=G.quest(R,'LEVEL 1 · RUANG KOMPRESOR',()=>['Temui Pak Jaka di depan ruang kompresor','Pelajari papan UDARA BERTEKANAN','Ambil APD yang tepat di lemari APD',`Inspeksi: temukan 5 titik bahaya (${R.found}/5)`,'Lihat bagian dalam kompresor piston','Baca papan jenis kompresor','Lapor ke Pak Jaka: checklist K3 dan jalur udara','Setel regulator di unit F.R.L','Uji mesin press, lalu pilih penggerak','Jawab soal analisis'],
    n=>n===0||n===6?V(-7.1,.7):n===1?V(-3.4,3.7):n===2?V(-11.4,-.2):n===4?V(-8.3,-3.7):n===5?V(-7.25,-7.1):n===7?V(0,-6.9):n===8?V(6.2,-2.2):null);
  G.addInter({pos:V(-7.1,.7),obj:JK,label:'Bicara',r:2.2,fn:async()=>{
    if(R.step===0){await say(JK,`Selamat datang, ${G.esc(G.save.name)}! Saya Jaka, teknisi utilitas. Di bengkel ini hampir semua alat digerakkan oleh <b>udara bertekanan</b> — itulah <b>pneumatik</b>.`);
      await say(JK,'Udaranya dibuat di <b>ruang kompresor</b> itu, lalu mengalir lewat pipa biru ke unit <b>F.R.L</b>, dan berakhir di <b>mesin press</b> di sebelah kanan.');
      await say(JK,'Sebelum masuk, pahami dulu sifat udaranya. Coba papan <b>UDARA BERTEKANAN</b> di tengah bengkel. Setelah itu ambil <b>APD yang tepat</b> di lemari biru samping pintu — pintunya baru terbuka kalau APD-mu benar.');setStep(1);}
    else if(R.step===6){await say(JK,'Kerja bagus — lima bahaya sudah aman dan kamu sudah melihat isi kompresor. Supaya kejadian tadi tidak terulang, kita buat <b>checklist K3</b>.');
      checklist(async()=>{await say(JK,'Checklist beres. Sekarang buktikan kamu paham <b>jalannya udara</b>, dari kompresor sampai silinder.');
      G.orderGame('Jalur udara bertekanan','Susun dari tempat udara dibuat sampai tempat udara bekerja. Petunjuk: lihat lagi pipa dan selang yang kamu lewati.',JALUR,sc,b=>{b.appendChild(el('div','fb ok','✅ Tepat. Udara <b>dibuat</b> (kompresor), <b>disimpan</b> (tangki), <b>disalurkan</b> (pipa), <b>disiapkan</b> (F.R.L), <b>diatur arahnya</b> (katup), lalu <b>bekerja</b> (silinder).'));
        b.appendChild(row(btn('Lanjut ▸','y',async()=>{closeModal();G.addCoins(40,'Paham jalur udara');await say(JK,'Satu lagi. Manometer regulator menunjuk <b>7 bar</b> — terlalu tinggi. Tolong setel ke <b>tekanan kerja</b> kita di unit <b>F.R.L</b>.');setStep(7);})));});});}
    else await say(JK,G.pick(['Udara bertekanan itu mahal: setiap desis kebocoran adalah listrik yang terbuang.','Kebiasaan pertama teknisi pneumatik setiap pagi: buang kondensat dari tangki.','Selang jangan pernah diarahkan ke badan, apalagi ke teman.','Kalau ragu, tutup keran dan buang tekanan dulu.']));}});
  G.addInter({pos:V(-3.4,3.7),obj:'Papan UDARA BERTEKANAN',label:'Coba',r:1.9,on:()=>R.step===1,fn:papanUdara});
  G.addInter({pos:V(-11.4,-.2),obj:'Lemari APD',label:'Pilih APD',r:1.9,on:()=>R.step===2,fn:locker});
  HZ.forEach(h=>G.addInter({pos:V(h.p[0],h.p[1]),obj:h.obj,label:'Periksa',r:1.7,on:()=>R.step===3&&!h.done,fn:()=>inspect(h)}));
  G.addInter({pos:V(-8.3,-3.7),obj:'Kompresor piston',label:'Lihat bagian dalam',r:1.8,on:()=>R.step===4,fn:async()=>{await cine([-8.1,1.7,-3.1],[-9.6,1,-5],.9);bongkar();}});
  G.addInter({pos:V(0,-6.9),obj:'Unit F.R.L',label:'Setel regulator',r:2,on:()=>R.step===7,fn:regulator});
  G.addInter({pos:V(0,-6.9),obj:'Unit F.R.L',label:'Amati',r:2,on:()=>R.step!==7&&R.step!==3,fn:()=>say('Unit F.R.L','Udara <b>MASUK</b> dari kiri (8 bar) → <b>Filter</b> menyaring air dan kotoran → <b>Regulator</b> mengatur tekanan kerja → <b>Lubricator</b> memberi kabut oli → <b>KELUAR</b> ke mesin di kanan.')});
  G.addInter({pos:V(-7.25,-7.1),obj:'Papan info',label:'Baca',r:1.8,on:()=>R.step===5,fn:papan});
  G.addInter({pos:V(6.2,-2.2),obj:'Mesin press pneumatik',label:'Uji mesin',r:2,on:()=>R.step===8,fn:press});
  G.addInter({pos:V(7.5,-2.2),obj:'Mbak Rina · Operator',label:'Bicara',r:1.8,on:()=>R.step!==8,fn:()=>say('Mbak Rina · Operator',G.pick(['Mesin press ini ditekan dengan dua tombol sekaligus, supaya kedua tangan saya pasti di luar daerah tekan.','Kalau tekanannya turun di bawah 5 bar, hasil press-nya tidak rata.','Silinder di atas itu kerja ganda: udara mendorongnya turun, udara pula yang menariknya naik.']))});
  R.step=-1;R.refresh();
  await say('Bu Laras · Kepala Bengkel',`Selamat bergabung di <b>Bengkel Pneumatik PT TOI</b>, ${G.esc(G.save.name)}. Hari ini kamu mulai sebagai <b>Helper Udara</b>.`);
  await say('Bu Laras · Kepala Bengkel','Tugas pertamamu: kenali <b>ruang kompresor</b> dan pastikan tempat itu aman. Temui <b>Pak Jaka</b> — beliau menunggu di depan ruang kompresor, sebelah kiri.');setStep(0);};
})();
