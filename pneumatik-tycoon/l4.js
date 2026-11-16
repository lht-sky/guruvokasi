/* Level 4 · F.4.1.4 — Membaca Gambar: menganalisis gambar rangkaian penyedia udara (ISO 1219), mencari kesalahan, melengkapi, dan mendiagnosis */
(function(){
'use strict';
const {scene,box,cyl,at,el,btn,row,say,modal,closeModal,toast,W,V}=G;
const R={step:-1,ok:0,total:0,chk:0,fill:0,read:0};G.L4=R;const sc=ok=>{R.total++;if(ok)R.ok++;};let setStep;const BY='Mas Bayu · Juru Gambar',N=G.SYMN;
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const shot=async(cam,t,dur)=>{G.P.frozen=true;const k=G.camera.aspect<1?1.8:1,c=cam.map((v,i)=>t[i]+(v-t[i])*k);G.cinema={pos:V3(...c),look:V3(...t)};await G.wait(dur);G.cinema=null;G.P.frozen=false;};
const OK=[{id:'check'},{id:'tangki'},{id:'shutoff'},{id:'filter'},{id:'regulator'},{id:'lubricator'}];
const dg=(seq,o)=>`<div class="dgw">${G.diag(seq,o)}</div>`;

/* ---------- Kantor Gambar ---------- */
let mon;
function build(){const mt=new THREE.Mesh(new THREE.PlaneGeometry(3.4,3),new THREE.MeshStandardMaterial({color:G.col('#3a2f5f'),transparent:true,opacity:.5,roughness:.9}));mt.rotation.x=-Math.PI/2;mt.position.set(-11.3,.012,6.3);scene.add(mt);
  scene.add(at(box(.06,1.16,2.9,'#15181d'),-12.96,2.05,6.2));mon=G.canvasPlane(2.8,1.06,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#1d3557';x.font=`700 ${h*.12}px sans-serif`;x.textAlign='center';x.fillText('GAMBAR RANGKAIAN',w/2,h*.45);x.fillStyle='#9fb0bf';x.font=`600 ${h*.08}px sans-serif`;x.fillText('menunggu juru gambar…',w/2,h*.62);},260);
  mon.rotation.y=Math.PI/2;mon.position.set(-12.92,2.05,6.2);scene.add(mon);
  const sg=G.labelPlane('KANTOR GAMBAR · BACA SEBELUM BEKERJA',2.9,.26,{bg:'#3a2f5f',fg:'#f3b52f',fs:84});sg.rotation.y=Math.PI/2;sg.position.set(-12.96,2.84,6.2);scene.add(sg);
  const D=new THREE.Group();D.position.set(-12.35,0,6.2);scene.add(D);D.add(at(box(.9,.06,2.3,'#e9edf0',{roughness:.6}),0,.86,0));[[-.4,-1.1],[.4,-1.1],[-.4,1.1],[.4,1.1]].forEach(q=>D.add(at(box(.06,.84,.06,'#2b3036'),q[0],.42,q[1])));
  const bd=box(.62,.02,.86,'#ffffff');bd.rotation.z=-.35;bd.position.set(-.05,1.02,-.5);D.add(bd,at(box(.5,.02,.22,'#22272c'),.1,.9,.45));[.75,.9,1.02].forEach((z,i)=>D.add(at(cyl(.03,.03,.5,'#fff',{roughness:.6},12).rotateZ(Math.PI/2),0,.92,z-.02*i)));
  D.add(at(box(.34,.012,.04,'#f3b52f'),-.05,1.045,-.5));G.addColBox(-12.35,6.2,.95,2.35);
  G.NPC.bayu=G.npc({name:'Mas Bayu',skin:'#c68642',cap:'#3a2f5f'},-11.2,7.2,Math.PI/2);}
function showMon(svg,vw){G.svgImg(svg,vw*2,464,im=>{if(!im)return;mon.userData.redraw((x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);const s=Math.min(w/(vw*2),h/464)*.96,dw=vw*2*s,dh=464*s;x.drawImage(im,(w-dw)/2,(h-dh)/2,dw,dh);});});}

/* ---------- 1. telusur aliran ---------- */
function trace(){const ord=['motor','kompresor',0,1,2,3,4,5],nmOf=k=>typeof k==='number'?N[OK[k].id]:N[k];let i=0,first=true;
  G.tapDiag('Baca gambar · telusur aliran','Ketuk komponen sesuai jalannya udara','<p>Gambar ini <b>tanpa nama</b>. Mulai dari <b>sumber tenaga</b>, lalu ikuti saluran udara sampai ke mesin. Ketuk satu per satu secara berurutan.</p>',G.diag(OK,{click:true,names:false,frame:[3,5]}),(k,api)=>{
    if(k===ord[i]){api.mark(k,true,String(i+1));G.sfx('tap');i++;api.say(i<8?`<div class="fb info">${i}. <b>${nmOf(k)}</b> ✓ — berikutnya?</div>`:'');
      if(i>=8){sc(first);G.sfx('ok');api.done('<div class="fb ok">✅ Motor → kompresor → katup satu arah → tangki → keran → filter → regulator → lubricator → mesin. Kamu baru saja <b>membaca gambar rangkaian</b> tanpa bantuan nama.</div>','Lanjut ▸',()=>{closeModal();G.addCoins(40,'Telusur aliran');showMon(G.diag(OK,{frame:[3,5]}),905);setStep(2);});}}
    else{first=false;G.sfx('bad');api.flash(k);api.say(`<div class="fb bad">❌ ${['safety','gauge','pswitch'].includes(k)?'Itu alat yang <b>menempel pada tangki</b>, bukan bagian dari jalur utama.':i===0?'Mulailah dari <b>sumber tenaga</b>: mesin yang memutar kompresor.':`Belum sampai ke sana. Cari komponen yang tersambung langsung setelah <b>${nmOf(ord[i-1])}</b>.`}</div>`);}});}

/* ---------- 2. tiga gambar pelanggan ---------- */
const BAD=[{seq:[{id:'check'},{id:'tangki'},{id:'shutoff'},{id:'lubricator'},{id:'regulator'},{id:'filter'}],fr:[3,5],hit:[3,4,5],who:'CV Maju Jaya',kel:'“Silinder kami cepat macet, dan filternya selalu berminyak.”',
   ok:'Urutan unit digambar <b>L → R → F</b>. Seharusnya <b>Filter → Regulator → Lubricator</b>: udara disaring dulu, baru diatur, lalu diberi oli. Bila terbalik, kabut oli justru tersaring habis.'},
 {seq:[{id:'check',flip:1},{id:'tangki'},{id:'shutoff'},{id:'filter'},{id:'regulator'},{id:'lubricator'}],fr:[3,5],hit:[0],who:'Bengkel Sinar Abadi',kel:'“Kompresor hidup terus, tetapi tangki tidak pernah terisi.”',
   ok:'<b>Katup satu arah digambar terbalik</b>: bolanya menutup terhadap aliran dari kompresor. Dudukan V harus berada di sisi kompresor supaya udara bisa mendorong bola dan masuk ke tangki.'},
 {seq:[{id:'check'},{id:'filter'},{id:'regulator'},{id:'lubricator'},{id:'tangki'},{id:'shutoff'}],fr:[1,3],hit:[1,2,3,4],who:'PT Cipta Karya',kel:'“Mangkuk filter cepat sekali penuh air, dan tekanan di mesin naik-turun mengikuti hidup-matinya kompresor.”',
   ok:'<b>Unit F.R.L digambar sebelum tangki</b>. Seharusnya sesudah tangki dan dekat pemakaian: di tangki udara mendingin dan airnya mengendap dulu, dan tekanan sudah stabil saat sampai di regulator.'}];
function check(){const B=BAD[R.chk];let first=true;G.tapDiag(`Gambar pelanggan ${R.chk+1} dari 3 · ${B.who}`,'Ketuk bagian gambar yang salah',`<p>Keluhan pelanggan: <i>${B.kel}</i></p><p>Bandingkan dengan gambar yang benar di <b>monitor</b>, lalu ketuk komponen yang salah gambar.</p>`,G.diag(B.seq,{click:true,frame:B.fr}),(k,api)=>{
    if(B.hit.includes(k)){B.hit.forEach(h=>api.mark(h,true));sc(first);G.sfx('ok');api.done(`<div class="fb ok">✅ ${B.ok}</div>`,'Kirim koreksi ▸',()=>{closeModal();G.addCoins(30,'Koreksi gambar '+B.who);R.chk++;R.refresh();if(R.chk<3)check();else{toast('Tiga gambar terkoreksi ✓','ok');setStep(3);}});}
    else{first=false;G.sfx('bad');api.flash(k);api.say('<div class="fb bad">❌ Bagian itu sudah benar. Hubungkan <b>keluhan</b> pelanggan dengan tugas tiap komponen.</div>');}});}

/* ---------- 3. melengkapi gambar ---------- */
const FILL=[{ok:'check',ids:['check','shutoff','safety','filter'],h:'Di kotak <b>1</b>, udara hanya boleh lewat <b>ke arah tangki</b> dan tidak boleh kembali ke kompresor.'},
 {ok:'safety',ids:['safety','regulator','gauge','pswitch'],h:'Kotak <b>2</b> menempel di atas tangki: alat yang <b>membuang udara</b> bila tekanan melewati batas aman.'},
 {ok:'pswitch',ids:['pswitch','safety','gauge','check'],h:'Kotak <b>3</b> menerima <b>sinyal tekanan</b> tangki (garis putus-putus) dan memutus listrik motor.'},
 {ok:'regulator',ids:['regulator','safety','lubricator','filter'],h:'Kotak <b>4</b> berada di antara filter dan lubricator: alat yang menjaga tekanan kerja <b>5 bar</b>.'}];
const fseq=()=>{const f=R.fill,b=(i,n)=>f>i?null:{blank:1,n:String(n),hot:f===i};return [f>0?{id:'check'}:{id:'blank',n:'1',hot:f===0},{id:'tangki',att:[f>1?'safety':b(1,2),'gauge',f>2?'pswitch':b(2,3)]},{id:'shutoff'},{id:'filter'},f>3?{id:'regulator'}:{id:'blank',n:'4',hot:f===3},{id:'lubricator'}];};
function fill(){const F=FILL[R.fill];G.askSym(`Lengkapi gambar · kotak ${R.fill+1} dari 4`,'Simbol mana yang harus digambar di kotak jingga?',dg(fseq(),{frame:[3,5]})+`<p>${F.h}</p>`,F.ids,F.ok,b=>{b.appendChild(el('div','fb ok',`✅ <b>${N[F.ok]}</b>.`));
  b.appendChild(row(btn(R.fill<3?'Kotak berikutnya ▸':'Selesai ▸','y',async()=>{closeModal();G.addCoins(20,'Simbol '+N[F.ok]);R.fill++;R.refresh();if(R.fill<4){fill();return;}
    showMon(G.symDiagram(),915);await say(BY,'Gambarnya lengkap dan sudah tampil di monitor. Nah — telepon dari Mbak Rina: <b>mesin press lemah lagi</b>. Jangan menebak. Gambar kita punya <b>dua manometer</b>: di tangki dan sesudah regulator.');
    await say(BY,'Baca keduanya di instalasi, mulai dari <b>manometer tangki</b>. APD jangan lupa.');W.regGauge.userData.set(3);W.frlWater.scale.y=2.4;W.frlWater.position.y=-.25;W.doorCol.on=false;G.player.wear('kacamata',true);G.player.wear('earmuff',true);setStep(4);})));},sc);G.$('#mbox .symopts').style.gridTemplateColumns='repeat(4,1fr)';}

/* ---------- 4. diagnosis dengan dua manometer ---------- */
const RD=[{p:[-8.5,-4.3],cam:[-8.55,1.25,-3.9],t:[-9.08,.88,-4.84]},{p:[0,-6.8],cam:[0,1.5,-6.3],t:[0,1.42,-7.78]}];
async function read(){const r=RD[R.read];await shot(r.cam,r.t,2);if(R.read===0){toast('Manometer tangki: 8 bar — pasokan udara cukup','gold');R.read=1;R.refresh();setStep(4);return;}
  toast('Manometer regulator: 3 bar · mangkuk filter penuh air','gold');R.read=2;R.refresh();
  G.ask('Diagnosis dari gambar','Di bagian mana gangguannya?',dg(OK,{frame:[3,5],p1:[1,'P1 = 8 bar'],p2:'P2 = 3 bar'})+'<p>Tekanan di tangki normal, tetapi sesudah regulator hanya 3 bar. Mangkuk filter terlihat penuh air.</p>',
   [['Di antara dua manometer: buang air dan bersihkan filter, lalu setel regulator kembali ke 5 bar',1],['Di kompresor: ganti kompresor dengan yang lebih besar',0,'P1 = 8 bar membuktikan kompresor dan tangki bekerja normal.'],['Di tangki: tangki bocor dan harus dilas',0,'Bila tangki bocor, P1 tidak akan bertahan di 8 bar.'],['Di pressure switch: naikkan batas mati menjadi 10 bar',0,'Berbahaya dan tidak menyelesaikan masalah; batas kompresor ini 8 bar.']],
   b=>{b.appendChild(el('div','fb ok','✅ Dua manometer <b>mengurung</b> letak gangguan. Yang ada di antara P1 dan P2 hanyalah keran, filter, dan regulator — tidak perlu membongkar kompresor.'));
     b.appendChild(row(btn('Perbaiki ▸','y',async()=>{closeModal();G.P.frozen=true;G.cinema={pos:V3(0,1.5,-6.2),look:V3(0,1.35,-7.78)};G.sfx('truck');await new Promise(r=>G.anim(1.4,k=>{W.frlWater.scale.y=2.4-1.4*k;W.frlWater.position.y=-.25-.045*k;},r));
       await new Promise(r=>G.anim(1.4,k=>{W.regGauge.userData.set(3+2*k);W.regKnob.rotation.y=k*4;},r));G.sfx('ok');await G.wait(.6);G.cinema=null;G.P.frozen=false;G.player.strip();G.addCoins(40,'Gangguan ditemukan tanpa menebak');toast('Tekanan kerja kembali 5 bar ✓ Kembali ke Mas Bayu','ok');setStep(5);})));},sc,true);}

/* ---------- 5. hitung dan rancang ---------- */
function rancang(i){const K=`Proyek pelanggan · ${i+1} dari 3`,nx=(c,w)=>b=>{b.appendChild(row(btn('Lanjut ▸','y',async()=>{closeModal();G.addCoins(c,w);if(i<2)rancang(i+1);else{await say(BY,'Rancanganmu masuk akal dan aman. Tiga soal terakhir — kalau lulus, <b>Kartu Izin Kerja Udara Bertekanan</b> terbit atas namamu.');setStep(6);G.quiz(QUIZ,sc,finish);}})));};
  if(i===0)G.ask(K,'Berapa lama tangki terisi?',`<p>Kompresor pelanggan menghasilkan <b>0,5 m³/menit</b>. Tangkinya <b>100 liter</b>, diisi dari kosong sampai <b>8 bar</b>.</p><div class="spec">Pendekatan: t = (V tangki × P target) ÷ Q kompresor &nbsp;·&nbsp; 1 m³ = 1.000 liter</div>`,
   [['(100 × 8) ÷ 500 = 1,6 menit',1],['(100 × 8) ÷ 0,5 = 1.600 menit',0,'Satuan belum disamakan: 0,5 m³ = 500 liter.'],['500 ÷ (100 × 8) = 0,6 menit',0,'Rumusnya terbalik: isi yang dibutuhkan dibagi kapasitas kompresor.'],['100 ÷ 500 = 0,2 menit',0,'Tekanan target belum dihitung: 8 bar berarti udara delapan kali isi tangki.']],
   b=>{b.appendChild(el('div','fb ok','✅ 800 liter udara bebas ÷ 500 liter/menit = <b>1,6 menit</b>. Dalam praktik sedikit lebih lama, karena udara memanas saat dimampatkan dan ada rugi-rugi di kompresor.'));nx(20,'Waktu isi tangki')(b);},sc,true);
  if(i===1)G.ask(K,'Pabrik tidak boleh berhenti','<p>Pelanggan meminta: <b>udara harus tetap ada</b> walau satu kompresor sedang dirawat atau rusak.</p>',
   [['Dua kompresor dipasang paralel ke satu tangki, masing-masing dengan katup satu arah dan keran',1],['Satu kompresor yang dua kali lebih besar',0,'Bila yang satu itu dirawat, seluruh pabrik tetap berhenti.'],['Dua tangki dipasang berurutan',0,'Cadangan tangki hanya cukup beberapa menit.'],['Menaikkan batas mati pressure switch',0,'Tidak menambah keandalan dan dapat melampaui batas aman.']],
   b=>{b.appendChild(el('div','fb ok','✅ Dengan susunan <b>paralel</b>, satu kompresor dapat ditutup kerannya dan dirawat sementara yang lain tetap memasok. Katup satu arah mencegah udara masuk ke kompresor yang mati.'));nx(20,'Rancangan paralel')(b);},sc);
  if(i===2)G.ask(K,'Produk tidak boleh kena air','<p>Pelanggan mengecat produknya dengan udara bertekanan; setitik air merusak hasil. Di mana <b>pengering udara (air dryer)</b> dipasang?</p>',
   [['Sesudah tangki, sebelum jaringan pipa dan unit F.R.L',1],['Sebelum kompresor',0,'Udara luar belum dimampatkan; airnya baru mengembun setelah dimampatkan dan mendingin.'],['Sesudah lubricator',0,'Pipa dan unit F.R.L sudah terlanjur basah, dan oli dari lubricator mengotori pengering.'],['Tidak perlu; filter F.R.L sudah menghilangkan semua air',0,'Filter hanya menangkap air yang sudah berbentuk <b>cair</b>, bukan uap air.']],
   b=>{b.appendChild(el('div','fb ok','✅ Pengering dipasang <b>sesudah tangki</b>: sebagian besar air sudah mengendap di tangki, dan seluruh jaringan pipa sesudahnya ikut kering.'));nx(20,'Letak pengering')(b);},sc);}
const QUIZ=[{q:'Pada gambar rangkaian pneumatik, garis putus-putus pendek yang menuju sebuah katup menunjukkan…',o:['saluran sinyal (pilot/kontrol)','saluran udara utama','kabel listrik','batas satu unit rakitan'],w:'Garis <b>tebal</b> = saluran kerja, <b>putus-putus</b> = saluran sinyal, <b>garis-titik</b> = batas satu unit.'},
 {q:'Mengapa unit F.R.L digambar sesudah tangki, dekat dengan mesin pemakai?',o:['Di tangki udara mendingin dan airnya mengendap dulu, dan tekanan sudah stabil saat sampai di regulator','Agar kompresor lebih ringan saat mulai berputar','Agar tangki tidak perlu keran drain','Agar jumlah pipa lebih sedikit'],w:'Udara yang baru keluar dari kompresor panas, basah, dan berdenyut; tangki menenangkannya lebih dulu.'},
 {q:'Sebuah gambar menempatkan keran di antara tangki dan katup pengaman. Mengapa itu salah?',o:['Bila keran tertutup, tangki kehilangan pelindung terhadap tekanan berlebih','Keran membuat katup pengaman cepat aus','Katup pengaman jadi tidak bisa diuji','Gambar jadi terlalu panjang'],w:'Di antara tangki dan katup pengaman <b>tidak boleh ada</b> katup penutup apa pun.'}];
const license=()=>{const ids=['l1','l2','l3','l4'],tp=G.save.tp,full=ids.every(k=>tp[k]),tot=ids.reduce((a,k)=>a+(tp[k]?tp[k].stars:0),0);
  return `<div class="lic"><div class="jh">BENGKEL PNEUMATIK PT TOI · SMKS 2 TRIPLE J</div><h3>${full?'🪪 LISENSI 1 · KARTU IZIN KERJA UDARA BERTEKANAN':'🔰 KARTU IZIN SEMENTARA'}</h3><div style="font:700 20px var(--game)">${G.esc(G.save.name)}</div><div style="font:600 14px/1.7 var(--game);margin:4px 0">${ids.map((k,i)=>`L${i+1} ${tp[k]?'⭐'.repeat(tp[k].stars):'—'}`).join(' · ')}</div><div style="font:700 17px var(--game)">Total ${tot}/12 ⭐ · Jenjang 1 Helper Udara ${full?'tuntas':'belum tuntas'}</div>${full?'<small>Jenjang 2 · Teknisi Rangkaian terbuka saat levelnya tersedia.</small>':'<small>Selesaikan Level 1–4 untuk memperoleh lisensi penuh.</small>'}</div>`;};
function finish(qok){G.finish({id:'l4',no:4,kode:'F.4.1.4',name:'Membaca Gambar',badge:'Pembaca Gambar Rangkaian 📐',R,val:R.ok,metric:'3 gambar pelanggan dikoreksi · gangguan ditemukan lewat dua manometer',extra:license,
  lines:['Telusur aliran: 8 komponen','Koreksi gambar pelanggan: 3/3','Melengkapi gambar: 4 simbol','Diagnosis: P1 8 bar, P2 3 bar → filter dan regulator',`Kuis analisis: ${qok}/3`],
  points:['Membaca gambar = <b>mengikuti saluran</b> dari sumber tenaga sampai pemakai.','Urutan wajib: <b>kompresor → katup satu arah → tangki → keran → F → R → L</b>; unit F.R.L selalu <b>sesudah</b> tangki.','Di antara tangki dan katup pengaman <b>tidak boleh ada keran</b>.','Dua manometer (sebelum dan sesudah regulator) <b>mengurung letak gangguan</b>.','Waktu isi tangki: <b>t = (V × P) ÷ Q</b>, dengan satuan yang sama.'],
  reflect:'Cobalah menggambar rangkaian penyedia udara bengkel sekolahmu dari ingatan, lalu bandingkan dengan instalasi aslinya. Komponen mana yang terlewat?'});}

/* ---------- catatan buku tulis ---------- */
G.NOTES.l4={j:'Membaca dan Menganalisis Gambar Rangkaian Penyedia Udara',gt:'Gambar — rangkaian sistem penyedia udara lengkap',
 baca:'Gambar rangkaian adalah peta sebuah sistem pneumatik. Setiap komponen digambar dengan simbol ISO 1219 dan dihubungkan dengan garis: garis tebal untuk saluran udara, garis putus-putus untuk saluran sinyal, dan bingkai garis-titik untuk beberapa komponen yang dirakit menjadi satu unit. Gambar dibaca dengan mengikuti saluran dari sumber tenaga sampai ke pemakai: motor, kompresor, katup satu arah, tangki, keran, lalu unit F.R.L. Dengan gambar, teknisi dapat memeriksa apakah urutan pemasangan sudah benar, menghitung kebutuhan seperti waktu pengisian tangki, dan menemukan letak gangguan tanpa membongkar semuanya. Dua manometer, sebelum dan sesudah regulator, menunjukkan di bagian mana tekanan hilang.',
 gambar:[`<div class="dgw" style="border:1.5px solid #8fa3b5;line-height:1.2">${G.symDiagram()}</div>`,'Salin gambar di atas dengan <b>penggaris</b>. Tulis nama setiap komponen, gambar saluran sinyal dengan <b>garis putus-putus</b>, dan beri bingkai <b>garis-titik</b> pada unit F.R.L. Di bawahnya buat <b>legenda</b>: enam simbol pilihanmu beserta namanya.'],
 ist:[['Saluran kerja','saluran udara utama; digambar dengan garis tebal'],['Saluran sinyal (pilot)','saluran kecil pembawa tekanan untuk menggerakkan katup; digambar putus-putus'],['Free air delivery (FAD)','banyaknya udara bebas yang dihasilkan kompresor tiap menit'],['Cut-in / cut-out','tekanan saat pressure switch menghidupkan / mematikan kompresor'],['Legenda','daftar simbol dan artinya pada sebuah gambar']],
 tulis:['Hitung waktu pengisian tangki <b>150 liter</b> sampai <b>6 bar</b> dengan kompresor <b>0,6 m³/menit</b>, lalu jelaskan mengapa waktu sebenarnya biasanya lebih lama.','Usulkan <b>satu perubahan</b> pada rangkaian penyedia udara bengkel sekolahmu agar lebih aman atau lebih hemat. Sebutkan komponennya dan alasanmu.']};

/* ---------- mulai ---------- */
G.startL4=async()=>{G.safeWorld();build();G.apd(G.player);
  setStep=G.quest(R,'LEVEL 4 · MEMBACA GAMBAR',()=>['Temui Mas Bayu di Kantor Gambar','Telusuri aliran udara pada gambar',`Koreksi gambar pelanggan (${R.chk}/3)`,`Lengkapi gambar: simbol yang kosong (${R.fill}/4)`,`Baca dua manometer di instalasi (${Math.min(R.read,2)}/2)`,'Hitung dan rancang bersama Mas Bayu','Jawab soal analisis'],
    n=>n===0||n===5?V(-11.2,7.2):n>=1&&n<=3?V(-11.5,5.6):n===4?V(RD[Math.min(R.read,1)].p[0],RD[Math.min(R.read,1)].p[1]):null);
  G.addInter({pos:V(-11.2,7.2),obj:BY,label:'Bicara',r:1.7,fn:async()=>{
    if(R.step===0){await say(BY,`Halo ${G.esc(G.save.name)}! Di kantor ini semua pekerjaan dimulai dari <b>gambar rangkaian</b>. Teknisi yang bisa membaca gambar tidak perlu menebak-nebak.`);
      await say(BY,'Kamu sudah kenal simbolnya. Sekarang <b>membacanya</b>: ikuti jalannya udara di gambar pada meja saya. Gambar ini sengaja saya buat tanpa nama.');setStep(1);}
    else if(R.step===5){await say(BY,'Bagus, diagnosismu tepat karena kamu membaca gambar dulu. Sekarang tiga permintaan pelanggan yang harus dihitung dan dirancang.');rancang(0);}
    else await say(BY,G.pick(['Garis tebal itu jalan udara. Garis putus-putus hanya membawa sinyal.','Kalau bingung, kembali ke pertanyaan: udara datang dari mana dan pergi ke mana?','Gambar yang benar di monitor boleh kamu lihat kapan saja.']));}});
  G.addInter({pos:V(-11.5,5.6),obj:'Meja gambar',label:()=>R.step===1?'Telusuri aliran':R.step===2?'Periksa gambar pelanggan':'Lengkapi gambar',r:1.6,on:()=>R.step>=1&&R.step<=3,fn:()=>R.step===1?trace():R.step===2?check():fill()});
  G.addInter({pos:()=>V(RD[Math.min(R.read,1)].p[0],RD[Math.min(R.read,1)].p[1]),obj:'Instalasi',label:'Baca manometer',r:1.7,on:()=>R.step===4&&R.read<2,fn:read});
  G.addInter({pos:V(-7.1,.7),obj:G.JAKA,label:'Bicara',r:2,fn:()=>say(G.JAKA,G.pick(['Dulu saya membongkar kompresor seharian, padahal yang rusak cuma filter. Sejak itu saya selalu membuka gambar dulu.','Dua manometer itu seperti dua saksi: yang satu sebelum, yang satu sesudah.']))});
  R.step=-1;R.refresh();
  await say('Bu Laras · Kepala Bengkel',`Jalur udara kita sudah rapi, ${G.esc(G.save.name)}. Tinggal satu syarat untuk <b>Kartu Izin Kerja Udara Bertekanan</b>: kamu harus bisa <b>membaca gambar rangkaian</b>.`);
  await say('Bu Laras · Kepala Bengkel','Temui <b>Mas Bayu</b> di <b>Kantor Gambar</b> — pojok kiri depan bengkel.');setStep(0);};
})();
