/* TP 2 — Menerapkan prosedur perawatan peralatan produksi sesuai standar kerja industri */
(function(){
'use strict';
const {scene,box,cyl,sph,at,grp,el,btn,row,say,modal,closeModal,toast,W}=G;
const R={step:-1,ok:0,total:0,fixed:0,mist:0,down:0,parts:0,running:false,late:false};G.TP2=R;
const V=(x,z)=>new THREE.Vector3(x,0,z);
const score=ok=>{R.total++;if(ok)R.ok++;};
const STEPS=()=>['Temui Pak Jaka di pojok Maintenance','Inspeksi harian kompresor di Ruang Utilitas',`Tangani mesin bermasalah (${R.fixed}/3)`,'Susun jadwal perawatan preventif bersama Pak Jaka','Jalankan pesanan besar di panel kontrol'];
const refresh=()=>G.setQuest('TP 2 · PERAWATAN MESIN',STEPS(),R.step);
let machines=[],jaka=null;
const IDS=['loader','printer','pnp','reflow','aoi','assy','fqc','pack'],NAMES=['PCB Loader','Solder Paste Printer','Mesin Pick & Place','Reflow Oven','AOI','Perakitan Akhir','Uji Fungsi (Final QC)','Pengemasan'];

/* ---------- data ---------- */
const KL=[['Melumasi rantai konveyor sesuai jadwal mingguan',0],['Mengganti motor konveyor yang sudah terbakar',1],['Memantau getaran dan suhu bantalan motor dengan sensor untuk memperkirakan kapan harus diganti',2],
 ['Membersihkan filter udara kompresor setiap hari sesuai checklist',0],['Menyambung sabuk konveyor yang putus di tengah produksi',1],['Menganalisis tren arus motor yang terus naik, lalu menjadwalkan penggantian sebelum motor rusak',2]];
const KLN=['Preventif','Korektif','Prediktif'];
const KLD=['<b>Preventif</b>: dikerjakan <b>terjadwal sebelum</b> mesin rusak.','<b>Korektif</b>: memperbaiki <b>setelah</b> kerusakan terjadi.','<b>Prediktif</b>: berdasarkan <b>pemantauan kondisi/data</b> mesin untuk memperkirakan waktu perbaikan.'];
const CASES=[
 {i:1,n:'Solder Paste Printer',zf:.67,gej:['AOI: reject “jembatan solder” naik dari 2% menjadi 15%','Hasil cetak pasta solder melebar dan tidak rata','Bilah squeegee tampak bergerigi; bagian bawah stensil belepotan pasta'],
  causes:[['Stensil kotor dan bilah squeegee aus',1,''],['Suhu reflow oven terlalu rendah',0,'Masalahnya sudah terlihat pada hasil <b>cetak pasta</b>, sebelum PCB masuk oven.'],['Koordinat program pick & place bergeser',0,'Pick & place menempatkan komponen; gejalanya ada pada <b>pasta</b> yang melebar, bukan posisi komponen.']],
  s3:'Pastikan energi nol: tekan tombol START — mesin tidak boleh menyala',
  fixes:[['Bersihkan stensil dengan lap bebas serat + cairan pembersih (IPA), lalu ganti bilah squeegee',1,''],['Naikkan tekanan squeegee sampai maksimum',0,'Tekanan berlebih justru merusak stensil dan membuat pasta makin melebar.'],['Tiup stensil dengan udara kompresor, lalu lanjut produksi',0,'Pasta solder beterbangan dan mengotori mesin; bilah squeegee yang aus tetap belum diganti.']],
  cause:'Stensil kotor & bilah squeegee aus',act:'Stensil dibersihkan (lap bebas serat + IPA), bilah squeegee diganti',part:'Bilah squeegee, lap bebas serat, IPA',cost:40},
 {i:2,n:'Mesin Pick & Place',zf:.72,gej:['Layar mesin: “Pick-up error” 12% (normal di bawah 1%)','Komponen SMD berjatuhan di dalam mesin','Vakum di nozzle terbaca −35 kPa (normal −70 s.d. −90 kPa)'],
  causes:[['Nozzle tersumbat dan filter vakum kotor',1,''],['Pasta solder kedaluwarsa',0,'Pasta solder memengaruhi hasil solder, bukan kemampuan nozzle <b>mengisap</b> komponen.'],['Konveyor berjalan terlalu cepat',0,'Data menunjukkan <b>vakum lemah</b> (−35 kPa); kecepatan konveyor tidak mengubah tekanan vakum.']],
  s3:'Buang sisa tekanan udara (energi tersimpan), lalu pastikan energi nol: tekan START — tidak menyala',
  fixes:[['Bersihkan nozzle yang tersumbat dan ganti filter vakum',1,''],['Naikkan kecepatan kerja mesin',0,'Kecepatan lebih tinggi dengan vakum lemah membuat makin banyak komponen jatuh.'],['Ganti seluruh head pick & place dengan yang baru',0,'Sangat mahal dan tidak perlu — akar masalahnya hanya nozzle tersumbat dan filter kotor.']],
  cause:'Nozzle tersumbat & filter vakum kotor',act:'Nozzle dibersihkan, filter vakum diganti',part:'Filter vakum, pembersih nozzle',cost:35},
 {i:3,n:'Reflow Oven',zf:.58,gej:['Bunyi berdecit dari dalam oven; konveyor tersendat-sendat','Arus motor konveyor naik dari 1,2 A menjadi 2,1 A','Suhu semua zona pemanas terbaca normal'],
  causes:[['Rantai konveyor kering (kurang pelumas)',1,''],['Elemen pemanas zona 3 putus',0,'Suhu semua zona terbaca <b>normal</b>, jadi pemanas bekerja baik.'],['Lensa kamera AOI kotor',0,'AOI adalah mesin lain; gejalanya ada pada <b>konveyor oven</b> dan arus motornya.']],
  s3:'Tunggu suhu oven turun di bawah 50 °C, lalu pastikan energi nol: tekan START — tidak menyala',
  fixes:[['Lumasi rantai dengan pelumas rantai khusus suhu tinggi',1,''],['Olesi rantai dengan gemuk (grease) serbaguna',0,'Gemuk serbaguna menguap dan berkerak pada suhu oven ±250 °C, lalu mengotori PCB.'],['Siram rantai dengan air supaya cepat dingin dan licin',0,'Air menimbulkan karat dan berbahaya bagi komponen listrik oven.']],
  cause:'Rantai konveyor kering',act:'Rantai dilumasi pelumas khusus suhu tinggi',part:'Pelumas rantai suhu tinggi',cost:15}];
const WR=['','Gembok LOTO dipasang <b>setelah</b> mesin berhenti dan saklar utama OFF.','Verifikasi energi nol dilakukan <b>setelah</b> gembok dan label terpasang — supaya tidak ada orang lain yang menyalakan mesin saat kamu memeriksa.',
 '⚠️ <b>Nyaris celaka!</b> Mesin belum dipastikan aman. Cover tidak boleh dibuka sebelum LOTO terpasang dan energi nol terverifikasi.','Pekerjaan belum selesai — LOTO baru dilepas setelah perbaikan tuntas dan cover terpasang kembali.','Mesin belum boleh dinyalakan: perbaikan belum tuntas atau gembok dan label LOTO masih terpasang.'];
const SCH=[['Membuang air kondensat tangki kompresor','setiap 8 jam operasi',0],['Membersihkan bagian bawah stensil printer','setiap 8 jam operasi',0],['Membersihkan nozzle pick & place','setiap 40 jam operasi',1],
 ['Melumasi rantai konveyor reflow oven','setiap 40 jam operasi',1],['Mengganti filter vakum pick & place','setiap 160 jam operasi',2],['Mengkalibrasi profil suhu reflow oven','setiap 160 jam operasi',2]];
const SCN=['Harian','Mingguan','Bulanan'];
const QUIZ=[{q:'Mengapa gembok LOTO hanya boleh dilepas oleh orang yang memasangnya?',o:['Karena dialah yang tahu pasti pekerjaannya sudah selesai dan dirinya sudah berada di luar area berbahaya','Karena gembok LOTO harganya mahal','Supaya teknisi lain tidak perlu ikut bekerja','Karena kunci cadangannya disimpan kepala pabrik'],a:0},
 {q:'Arus motor konveyor naik perlahan dari 1,2 A menjadi 2,1 A dalam sebulan, padahal beban produksi sama. Analisis yang paling tepat adalah…',o:['Hambatan mekanis bertambah (misalnya rantai kurang pelumas); jadwalkan pemeriksaan sebelum motor rusak','Motor makin bertenaga, jadi tidak perlu tindakan','Tegangan PLN naik, jadi bukan urusan maintenance','Kenaikan arus seperti itu wajar pada semua motor'],a:0},
 {q:'Pabrik A baru memperbaiki mesin setelah rusak. Pabrik B menjalankan jadwal perawatan preventif. Dalam jangka panjang, Pabrik B biasanya…',o:['mengeluarkan biaya perawatan rutin, tetapi kerusakan mendadak lebih jarang dan total kerugiannya lebih kecil','tidak pernah mengalami kerusakan sama sekali','selalu menanggung biaya lebih besar daripada Pabrik A','tidak lagi membutuhkan teknisi maintenance'],a:0}];

/* ---------- line state ---------- */
function setRun(on){R.running=on;W.beltSpeed=on?1.3:0;W.setStack(on?'run':'stop');if(G.NPC)G.NPC.rina.busy=on?1:0;
  W.hmi.userData.redraw((x,w,h)=>{x.fillStyle='#0d2238';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='bold 22px sans-serif';x.fillText('LINE 1',10,28);x.fillStyle=on?'#7ee2a5':'#ff5a5a';x.fillText(on?'RUN ▶':'STOP',10,60);});}
const items=[];let spT=0;
function beltUpd(dt){if(!R.running)return;const L=W.LINE;spT-=dt;if(spT<=0){spT=2.2;const g=grp(at(box(.34,.02,.22,'#1d7a3e'),0,0,0),at(box(.38,.09,.26,'#eceff1'),0,.04,0),at(box(.42,.16,.3,'#c49562'),0,.08,0));g.position.set(L.x0+.2,L.y,L.z);scene.add(g);items.push(g);}
  for(let k=items.length-1;k>=0;k--){const g=items[k];g.position.x+=W.beltSpeed*dt;const x=g.position.x,S=L.stations;g.children[0].visible=x<S[5];g.children[1].visible=x>=S[5]&&x<S[7];g.children[2].visible=x>=S[7];
    if(x>L.x1-.1){scene.remove(g);items.splice(k,1);}}}
function setSick(c,on){const g=machines[c.i];g.userData.sick=on;if(on){const s=G.textSprite('⚠ GANGGUAN',{h:.32,bg:'#e04848',depthTest:false});s.position.set(0,3,0);g.add(s);g.userData.warn=s;}
  else if(g.userData.warn){g.remove(g.userData.warn);g.userData.warn=null;const s=G.textSprite('✓ NORMAL',{h:.3,bg:'#22b866',depthTest:false});s.position.set(0,3,0);g.add(s);setTimeout(()=>g.remove(s),4000);}}
const smoke=[];
function sickUpd(dt,t){CASES.forEach(c=>{const g=machines[c.i];if(!g)return;if(g.userData.warn)g.userData.warn.visible=Math.sin(t*6)>-.3;
  if(c.i===2)g.position.x=W.LINE.stations[2]+(g.userData.sick&&R.running?Math.sin(t*47)*.012:0);});
  const ov=machines[3];smoke.forEach((s,i)=>{const on=ov&&ov.userData.sick&&R.running;s.visible=!!on;if(on){const k=(t*.4+i/5)%1;s.position.set(W.LINE.stations[3]+Math.sin(k*8+i)*.2,1.5+k*1.6,W.LINE.z);s.scale.setScalar(.6+k*1.6);s.material.opacity=.4*(1-k);}});}
function lotoMesh(){const g=grp(at(box(.13,.11,.05,'#d62828'),0,0,0),at(G.mesh(new THREE.TorusGeometry(.04,.012,8,16,Math.PI),G.mat('#c9d1d8',{metalness:.8})),0,.055,0));
  const tag=G.labelPlane(['BAHAYA','JANGAN','DIOPERASIKAN'],.24,.3,{bg:'#fff',fg:'#d62828',fs:60,border:'#d62828'});tag.position.set(.22,-.08,.01);g.add(tag);return g;}

/* ---------- step 0: jenis perawatan ---------- */
function klas(){const it=G.shuffle(KL);let i=0;const next=()=>{
  if(i>=it.length){modal(b=>{b.appendChild(el('div','kick','Tiga jenis perawatan'));b.appendChild(el('h2','','Rangkuman'));b.appendChild(el('div','fb info',KLD.join('<br>')));
    b.appendChild(el('div','know','<b>Tahukah kamu?</b> Banyak pabrik menerapkan <b>autonomous maintenance</b>: operator sendiri yang membersihkan, memeriksa, melumasi, dan mengencangkan mesinnya setiap hari, sementara teknisi menangani pekerjaan yang lebih berat.'));
    b.appendChild(row(btn('Lanjut ▸','y',async()=>{closeModal();G.addCoins(20,'Paham jenis perawatan');await say('Pak Jaka · Teknisi Maintenance','Bagus! Sekarang praktik. Setiap pagi kita mulai dengan <b>inspeksi harian</b>. Tolong periksa <b>kompresor</b> di Ruang Utilitas — udara tekannya dipakai mesin pick & place.');setStep(1);})));});return;}
  const q=it[i];modal(b=>{b.appendChild(el('div','kick',`Jenis perawatan · ${i+1}/${it.length}`));b.appendChild(el('h2','',q[0]));b.appendChild(el('p','','Kegiatan ini termasuk jenis perawatan apa?'));const fb=el('div');
    const bs=KLN.map((n,k)=>{const x=btn(n,'',()=>{bs.forEach(z=>z.disabled=true);const ok=k===q[1];score(ok);x.className='gbtn '+(ok?'g':'r');if(!ok)bs[q[1]].className='gbtn g';G.sfx(ok?'ok':'bad');
      fb.innerHTML=`<div class="fb ${ok?'ok':'bad'}">${ok?'✅':'❌'} ${KLD[q[1]]}</div>`;b.appendChild(row(btn('Lanjut ▸','y',()=>{i++;next();})));});return x;});
    b.appendChild(row(...bs));b.appendChild(fb);});};next();}

/* ---------- step 1: kompresor ---------- */
function ask(kick,title,htmlTop,opts,done){let first=true;modal(b=>{b.appendChild(el('div','kick',kick));b.appendChild(el('h2','',title));if(htmlTop)b.appendChild(el('div','',htmlTop));const fb=el('div');
  const col=el('div');col.style.cssText='display:grid;gap:8px;margin-top:8px';const bs=G.shuffle(opts).map(o=>{const x=btn(o[0],'gr',()=>{if(o[1]){bs.forEach(z=>z.disabled=true);x.className='gbtn g';score(first);G.sfx('ok');fb.innerHTML='';done(b,first);}
      else{first=false;x.className='gbtn r';x.disabled=true;G.sfx('bad');fb.innerHTML=`<div class="fb bad">❌ ${o[2]}</div>`;}});x.style.cssText='text-align:left;width:100%';col.appendChild(x);return x;});
  b.appendChild(col);b.appendChild(fb);});}
function komp(){const obs='<div class="fb info"><b>Hasil pengamatan:</b><br>• Manometer tangki: <b>3,5 bar</b> (tekanan kerja standar 4,5–6 bar)<br>• Indikator filter udara masuk: <b>merah</b> (kotor)<br>• Katup drain tangki: belum dibuka hari ini</div>';
  const q2=()=>ask('Inspeksi harian · Kompresor','Tindakan perawatan harian yang tepat?',obs,[['Buka katup drain untuk membuang air kondensat, lalu bersihkan filter udara masuk',1],['Naikkan setelan pressure switch melebihi batas aman tangki',0,'Melebihi batas tekanan tangki berbahaya (risiko ledakan) dan tidak menyelesaikan filter yang kotor.'],['Biarkan saja sampai kompresor berhenti sendiri',0,'Itu berarti menunggu rusak — tekanan rendah akan mengganggu mesin pick & place.']],b2=>{
    for(let k=0;k<12;k++){const d=sph(.05,'#5fb4ff');d.material.transparent=true;scene.add(d);G.anim(.8+k*.05,t=>{d.position.set(13+Math.sin(k)*.25*t,.35-t*.3,-10.3+Math.cos(k)*.25*t);d.material.opacity=1-t;},()=>scene.remove(d));}
    b2.appendChild(el('div','fb ok','✅ Air kondensat terbuang dan filter bersih. Tekanan kembali ke <b>5,5 bar</b>.'));
    b2.appendChild(el('div','know','<b>Tahukah kamu?</b> Udara yang dimampatkan selalu menghasilkan <b>air kondensat</b>. Jika tidak dibuang, air ikut mengalir ke saluran udara, menimbulkan karat, dan merusak katup serta silinder pneumatik.'));
    b2.appendChild(row(btn('Lanjut ▸','y',()=>{closeModal();G.addCoins(20,'Inspeksi harian selesai');trouble();})));});
  ask('Inspeksi harian · Kompresor','Bagaimana kondisi tekanan udara?',obs,[['Di bawah standar kerja',1],['Normal',0,'Bandingkan: hasil baca 3,5 bar, sedangkan tekanan kerja standar 4,5–6 bar.'],['Di atas standar kerja',0,'3,5 bar lebih kecil daripada batas bawah standar (4,5 bar).']],b=>{b.appendChild(row(btn('Lanjut ▸','y',q2)));});}
async function trouble(){G.marker.set(null);CASES.forEach(c=>setSick(c,true));G.sfx('bad');G.cinema={pos:new THREE.Vector3(-2,4.2,8.5),look:new THREE.Vector3(-1.4,1.2,2)};
  G.bubble(G.NPC.rina,'Pak, mesinnya bermasalah! 😰',4);await G.wait(3.2);G.cinema=null;
  await say('Teh Rina · Operator','Gawat! Tiga mesin menunjukkan <b>gangguan</b>: printer, pick & place, dan reflow oven. Hasil produksi mulai banyak yang cacat!');
  await say('Pak Jaka · Teknisi Maintenance','Tenang. Datangi mesinnya satu per satu: <b>amati gejalanya</b>, tentukan penyebabnya, lalu perbaiki dengan <b>SOP</b>. Ingat — keselamatan dulu: <b>LOTO</b> sebelum membuka cover!');
  setStep(2);}

/* ---------- step 2: diagnosis + SOP ---------- */
function diag(c){ask(`Diagnosis · ${c.n}`,'Apa penyebab yang paling mungkin?','<div class="fb info"><b>Gejala yang teramati:</b><br>'+c.gej.map(g=>'• '+g).join('<br>')+'</div>',c.causes,b=>{c.diag=true;
  b.appendChild(el('div','fb ok',`✅ Penyebab: <b>${c.cause}</b>. Sekarang perbaiki sesuai SOP.`));b.appendChild(row(btn('Jalankan SOP perbaikan ▸','y',()=>sop(c))));});}
function sop(c){const L=['Tekan STOP, lalu putar saklar utama mesin ke OFF','Pasang gembok pribadi dan label “JANGAN DIOPERASIKAN” pada saklar utama (LOTO)',c.s3,'Buka cover dan kerjakan perbaikan','Pasang kembali cover, rapikan alat, lalu lepas gembok dan label LOTO milikmu','Nyalakan mesin, lakukan uji jalan (test run), lalu catat di kartu riwayat mesin'];
  if(c.done===undefined){c.done=0;c.order=G.shuffle([0,1,2,3,4,5]);c.first=true;c.t0=R.down;}
  let fbHtml='';const render=()=>modal(b=>{b.appendChild(el('div','kick',`SOP perbaikan · ${c.n}`));b.appendChild(el('h2','',`Langkah ke-${c.done+1}: pilih yang harus dikerjakan sekarang`));
    const st=el('div','');st.style.cssText='display:flex;gap:5px;margin:6px 0 10px';for(let k=0;k<6;k++){const s=el('span');s.style.cssText=`flex:1;height:7px;border-radius:6px;background:${k<c.done?'#22b866':k===c.done?'#f3b52f':'#2d3946'}`;st.appendChild(s);}b.appendChild(st);
    const col=el('div');col.style.cssText='display:grid;gap:7px';c.order.forEach(idx=>{const done=idx<c.done;const x=btn((done?`✓ ${idx+1}. `:'')+L[idx],done?'g':'gr',()=>pick(idx));x.style.cssText='text-align:left;width:100%';x.disabled=done;col.appendChild(x);});b.appendChild(col);
    b.appendChild(el('div','',fbHtml));b.appendChild(row(btn('Tutup','gr',closeModal)));});
  const pick=idx=>{if(idx!==c.done){c.first=false;R.mist++;R.down+=10;G.sfx('bad');fbHtml=`<div class="fb bad">❌ ${WR[idx]} <b>(+10 menit downtime)</b></div>`;render();return;}
    score(c.first);c.first=true;fbHtml='';G.sfx('ok');
    if(idx===0){setRun(false);toast('Jalur berhenti — downtime mulai dihitung ⏱','bad');}
    if(idx===1){const m=lotoMesh();m.position.set(-.45,.55,c.zf+.03);machines[c.i].add(m);c.loto=m;toast('🔒 LOTO terpasang','ok');}
    if(idx===2)toast('Energi nol terverifikasi ✓','ok');
    if(idx===3){fix(c,render);return;}
    if(idx===4){machines[c.i].remove(c.loto);toast('🔓 LOTO dilepas oleh pemasangnya','ok');}
    if(idx===5){c.done=6;R.down+=20;setRun(true);logbook(c);return;}
    c.done++;render();};
  render();}
function fix(c,back){ask(`Perbaikan · ${c.n}`,'Tindakan perbaikan yang tepat?',`<div class="fb info">Penyebab: <b>${c.cause}</b></div>`,c.fixes,b=>{R.parts+=c.cost;G.addCoins(-c.cost,'Suku cadang & bahan');c.done=4;
  b.appendChild(el('div','fb ok',`✅ ${c.act}.`));b.appendChild(row(btn('Lanjut SOP ▸','y',back)));});}
function logbook(c){const d=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});const dt=R.down-c.t0;
  modal(b=>{b.appendChild(el('div','kick','Kartu riwayat mesin'));b.appendChild(el('h2','',`${c.n} — uji jalan OK ✓`));
    b.appendChild(el('div','',`<table class="tbl"><tr><th>Tanggal</th><td>${d}</td></tr><tr><th>Gejala</th><td>${c.gej[0]}</td></tr><tr><th>Penyebab</th><td>${c.cause}</td></tr><tr><th>Tindakan</th><td>${c.act}</td></tr><tr><th>Suku cadang/bahan</th><td>${c.part} (${c.cost} ¢)</td></tr><tr><th>Downtime</th><td>${dt} menit</td></tr><tr><th>Pelaksana</th><td>${G.esc(G.save.name)}</td></tr></table>`));
    b.appendChild(el('div','know','<b>Mengapa dicatat?</b> Kartu riwayat mesin dipakai untuk melihat <b>pola kerusakan</b> dan menentukan jadwal perawatan berikutnya.'));
    b.appendChild(row(btn('Simpan catatan ▸','y',async()=>{closeModal();setSick(c,false);c.fixed=true;R.fixed++;refresh();G.addCoins(25,`${c.n} normal kembali`);
      const nx=CASES.find(k=>!k.fixed);if(nx){G.marker.set(V(W.LINE.stations[nx.i],W.LINE.z+1.9));}
      else{await say('Pak Jaka · Teknisi Maintenance','Kerja bagus — ketiga mesin normal kembali! Tapi lihat: semua kerusakan tadi sebenarnya <b>bisa dicegah</b>. Temui saya di pojok Maintenance, kita susun <b>jadwal perawatan preventif</b>.');setStep(3);}})));});}

/* ---------- step 3: jadwal preventif ---------- */
function sched(){const sel=SCH.map(()=>-1);let checked=false;const rowsEl=[];
  modal(b=>{b.appendChild(el('div','kick','Jadwal perawatan preventif'));b.appendChild(el('h2','','Tentukan frekuensi tiap pekerjaan'));
    b.appendChild(el('div','fb info','Pabrik beroperasi <b>8 jam/hari</b>, <b>5 hari/minggu</b>. Jadi: 8 jam = 1 hari · 40 jam = 1 minggu · 160 jam = 1 bulan (4 minggu). Gunakan interval dari <b>buku manual mesin</b> di bawah.'));
    SCH.forEach((s,i)=>{const r=el('div','schr',`<div><b>${s[0]}</b><small>Buku manual: ${s[1]}</small></div>`);const seg=el('div','seg');SCN.forEach((n,k)=>{const x=el('button','',n);x.onclick=()=>{G.sfx('tap');sel[i]=k;[...seg.children].forEach((z,j)=>z.className=j===k?'on':'');r.classList.remove('ok','bad');};seg.appendChild(x);});r.appendChild(seg);b.appendChild(r);rowsEl.push(r);});
    const fb=el('div');b.appendChild(fb);
    const rr=row(btn('Periksa ✓','y',()=>{if(sel.includes(-1)){toast('Isi semua pekerjaan dulu');return;}let wrong=0;SCH.forEach((s,i)=>{const ok=sel[i]===s[2];if(!checked)score(ok);rowsEl[i].classList.remove('ok','bad');rowsEl[i].classList.add(ok?'ok':'bad');if(!ok)wrong++;});checked=true;
      if(wrong){G.sfx('bad');fb.innerHTML=`<div class="fb bad">❌ ${wrong} pekerjaan belum tepat (bertanda merah). Hitung: interval jam operasi ÷ 8 jam per hari.</div>`;return;}
      G.sfx('ok');rr.remove();fb.innerHTML='<div class="fb ok">✅ Jadwal tersusun: 2 pekerjaan harian, 2 mingguan, 2 bulanan.</div><div class="know"><b>Tahukah kamu?</b> Jadwal seperti ini biasanya ditempel di mesin sebagai <b>checklist</b> dan ditandatangani operator serta teknisi setiap kali dikerjakan.</div>';
      b.appendChild(row(btn('Pasang jadwal ▸','y',async()=>{closeModal();G.addCoins(30,'Jadwal preventif tersusun');await say('Pak Jaka · Teknisi Maintenance','Jadwal sudah saya tempel di papan. Kebetulan ada <b>pesanan besar 40 unit</b> minggu ini. Jalankan dari <b>panel kontrol</b>, ya!');setStep(4);})));}),btn('Tutup','gr',closeModal));b.appendChild(rr);});}

/* ---------- step 4: minggu produksi ---------- */
async function week(){const k=await say('Pak Harun · Kepala Pabrik','Pesanan <b>40 unit</b> harus selesai hari Jumat. Menurut jadwal, hari Rabu jalur <b>berhenti 2 jam</b> untuk perawatan mingguan. Produksi sedang dikejar target — apa keputusanmu?',[{t:'🛠️ Rawat sesuai jadwal (berhenti 2 jam)'},{t:'⏩ Tunda perawatan, kejar target',cls:'gr'}]);
  const onPlan=k===0;score(onPlan);R.late=!onPlan;R.weekDone=true;G.marker.set(null);
  const plan=onPlan?[[9,'ok','Normal'],[9,'ok','Normal'],[6,'pm','Perawatan 2 jam'],[8,'ok','Normal'],[8,'ok','Normal']]:[[9,'ok','Normal'],[9,'ok','Normal'],[2,'dn','RANTAI OVEN MACET'],[3,'dn','Perbaikan darurat'],[9,'ok','Normal']];
  const days=['Senin','Selasa','Rabu','Kamis','Jumat'];let cells,cnt,stat,foot;
  modal(b=>{b.appendChild(el('div','kick','Minggu produksi · pesanan 40 unit'));b.appendChild(el('h2','',onPlan?'Produksi dengan perawatan terjadwal':'Produksi tanpa berhenti untuk perawatan'));
    const w=el('div','week');cells=days.map(d=>{const c=el('div','',`<b>${d}</b><span>—</span>`);w.appendChild(c);return c;});b.appendChild(w);
    cnt=el('div','');cnt.style.cssText='font:700 30px var(--game);text-align:center;margin:10px 0 2px';cnt.textContent='0 / 40 unit';b.appendChild(cnt);stat=el('div','');b.appendChild(stat);foot=el('div','');b.appendChild(foot);});
  setRun(true);let tot=0;
  for(let d=0;d<5;d++){const p=plan[d];cells[d].className='now';await G.wait(.9);
    if(p[1]==='dn'&&d===2){setRun(false);G.sfx('bad');machines[3].userData.sick=true;stat.innerHTML='<div class="fb bad">💥 <b>Rantai konveyor oven macet</b> karena tidak dilumasi. Jalur berhenti <b>8 jam</b> untuk perbaikan darurat!</div>';await G.wait(1.6);}
    if(p[1]==='pm'){setRun(false);stat.innerHTML='<div class="fb info">🛠️ Jalur berhenti <b>2 jam</b> sesuai jadwal: rantai oven dilumasi, nozzle dibersihkan. Semua mesin sehat.</div>';await G.wait(1.2);setRun(true);}
    if(p[1]==='dn'&&d===3){machines[3].userData.sick=false;setRun(true);}
    tot+=p[0];cnt.textContent=`${tot} / 40 unit`;cells[d].className=p[1];cells[d].lastChild.textContent=`${p[0]} unit · ${p[2]}`;G.sfx('beep');}
  await G.wait(.6);setRun(false);
  stat.innerHTML=onPlan?'<div class="fb ok">✅ <b>40/40 unit selesai hari Jumat.</b> Berhenti 2 jam yang direncanakan menjaga jalur tetap sehat sepanjang minggu.</div>':`<div class="fb bad">❌ Hari Jumat baru <b>${tot}/40 unit</b>. Pabrik harus <b>lembur hari Sabtu</b> dan membayar <b>denda keterlambatan</b>. “Menghemat” 2 jam berubah menjadi kehilangan 8 jam.</div>`;
  foot.appendChild(row(btn('Lihat laporan ▸','y',report)));}

/* ---------- laporan ---------- */
function report(){const F={rev:4800,mat:2200,parts:R.parts,dt:R.down,plan:R.late?0:40,brk:R.late?320:0,ot:R.late?120:0,fine:R.late?150:0};
  const laba=F.rev-F.mat-F.parts-F.dt-F.plan-F.brk-F.ot-F.fine;R.laba=laba;G.addCoins(F.rev-F.mat-F.dt-F.plan-F.brk-F.ot-F.fine,'Hasil pesanan 40 unit');setStep(5);
  const line=(t,v,pos)=>`<tr><td>${t}</td><td class="${pos?'pos':'neg'}">${pos?'+':'−'}${G.fmt(v)}</td></tr>`;
  modal(b=>{b.appendChild(el('div','kick','Laporan Perawatan & Produksi · TP 2'));b.appendChild(el('h2','','Pesanan 40 unit selesai'));
    b.appendChild(el('div','',`<table class="fin">${line('Pendapatan (40 × 120 ¢)',F.rev,1)}${line('Biaya bahan baku',F.mat)}${line('Suku cadang & bahan perawatan',F.parts)}${line(`Downtime perbaikan (${F.dt} menit × 1 ¢)`,F.dt)}
      ${F.plan?line('Berhenti terjadwal 2 jam (perawatan mingguan)',F.plan):''}${F.brk?line('Downtime mendadak 8 jam (rantai oven macet)',F.brk):''}${F.ot?line('Upah lembur hari Sabtu',F.ot):''}${F.fine?line('Denda keterlambatan',F.fine):''}
      <tr class="tot"><td>LABA</td><td class="${laba>=0?'pos':'neg'}">${laba>=0?'+':'−'}${G.fmt(Math.abs(laba))} ¢</td></tr></table>`));
    b.appendChild(el('div','fb info',`Kesalahan urutan SOP: <b>${R.mist}</b> · Total downtime perbaikan: <b>${R.down} menit</b> · Biaya berhenti: terjadwal 2 jam = 40 ¢, mendadak 8 jam + lembur + denda = 590 ¢.`));
    b.appendChild(el('p','','Jawab 3 pertanyaan analisis untuk menutup laporan.'));b.appendChild(row(btn('Mulai analisis ▸','y',()=>quiz(0,0))));});}
function quiz(qi,qok){if(qi>=QUIZ.length){final(qok);return;}const Q=QUIZ[qi];modal(b=>{b.appendChild(el('div','kick',`Analisis · soal ${qi+1}/3`));b.appendChild(el('h2','',Q.q));const cc=el('div');cc.style.cssText='display:grid;gap:8px';
  const bs=G.shuffle(Q.o.map((o,i)=>i)).map(i=>{const x=btn(Q.o[i],'gr',()=>{bs.forEach(z=>z.disabled=true);const ok=i===Q.a;score(ok);x.className='gbtn '+(ok?'g':'r');G.sfx(ok?'ok':'bad');
    if(!ok)b.appendChild(el('div','fb bad','Jawaban yang tepat: <b>'+Q.o[Q.a]+'</b>'));b.appendChild(row(btn('Lanjut ▸','y',()=>quiz(qi+1,qok+(ok?1:0)))));});x.style.cssText='text-align:left;width:100%';cc.appendChild(x);return x;});b.appendChild(cc);});}
function final(qok){G.notebook('tp2',()=>final2(qok));}
function final2(qok){const ratio=R.total?R.ok/R.total:0,stars=ratio>=.85?3:ratio>=.65?2:1;const pv=G.save.tp.tp2;
  if(!pv||stars>pv.stars||(stars===pv.stars&&R.laba>pv.laba))G.save.tp.tp2={stars,ok:R.ok,total:R.total,laba:R.laba,date:new Date().toISOString().slice(0,10)};G.persist();G.confetti();G.sfx('win');G.payIncome();
  const txt=`PABRIK ELEKTRONIK TYCOON — TP 2 Perawatan Peralatan Produksi\nNama: ${G.save.name}\nBintang: ${stars}/3 (benar pertama kali ${R.ok}/${R.total})\nLaba: ${R.laba} koin\nKesalahan urutan SOP: ${R.mist}, downtime perbaikan: ${R.down} menit\nKeputusan perawatan mingguan: ${R.late?'ditunda (jalur macet)':'sesuai jadwal'}\nKuis analisis: ${qok}/3\nCatatan buku tulis: sudah ditulis (paraf guru: ........)`;
  modal(b=>{b.appendChild(el('div','kick','TP 2 selesai'));b.appendChild(el('h2','','Teknisi Perawatan Andal 🛠️'));b.appendChild(el('div','stars',`${'⭐'.repeat(stars)}<span style="opacity:.2">${'⭐'.repeat(3-stars)}</span>`));
    b.appendChild(el('p','',`Benar pada percobaan pertama: <b>${R.ok}/${R.total}</b> · Laba: <b>${G.fmt(R.laba)} ¢</b>`));
    b.appendChild(el('div','fb info','<b>Yang perlu kamu ingat:</b><br>• Tiga jenis perawatan: <b>preventif</b> (terjadwal), <b>korektif</b> (setelah rusak), <b>prediktif</b> (berdasarkan data kondisi).<br>• SOP perbaikan: <b>STOP & OFF → LOTO → pastikan energi nol → perbaiki → lepas LOTO → uji jalan & catat</b>.<br>• Jadwal preventif disusun dari <b>interval buku manual</b> dan jam operasi pabrik.<br>• Berhenti sebentar yang direncanakan jauh lebih murah daripada kerusakan mendadak.'));
    b.appendChild(el('div','know','<b>💭 Refleksi:</b> Peralatan apa di bengkel sekolah atau di rumahmu yang selama ini baru diperbaiki setelah rusak? Perawatan rutin apa yang bisa kamu jadwalkan untuknya?'));
    b.appendChild(row(btn('📋 Salin hasil','y',()=>{const ok=()=>toast('Hasil tersalin ✓ Tempel di Google Classroom','ok');const fb2=()=>{const t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();try{document.execCommand('copy');ok();}catch(e){toast('Gagal menyalin — tangkap layar saja','bad');}t.remove();};try{navigator.clipboard.writeText(txt).then(ok,fb2);}catch(e){fb2();}}),
      btn('Lanjut TP 3 ▸','g',()=>G.go('tp3')),btn('↺ Main lagi','gr',()=>G.go('tp2')),btn('Peta TP','gr',()=>{closeModal();G.openMenu();})));});}

/* ---------- step control ---------- */
function setStep(n){R.step=n;refresh();const t={0:V(7.2,-9.6),1:V(11.2,-9.3),3:V(7.2,-9.6),4:V(-9.6,3.7)}[n];
  if(n===2){const nx=CASES.find(k=>!k.fixed);G.marker.set(nx?V(W.LINE.stations[nx.i],W.LINE.z+1.9):null);}else G.marker.set(t||null);}

/* ---------- start ---------- */
G.startTP2=async()=>{G.inters.length=0;const N=G.NPC;
  machines=IDS.map((id,i)=>{const g=G.MACHINE[id]();g.position.set(W.LINE.stations[i],0,W.LINE.z);scene.add(g);const lab=G.textSprite(`${i+1}. ${NAMES[i]}`,{h:.28,bg:'rgba(29,53,87,.9)'});lab.position.set(0,2.45,0);g.add(lab);
    G.updaters.add((dt,t)=>g.userData.upd&&g.userData.upd(dt,t,R.running));return g;});
  const rw=grp(at(box(.7,.45,.5,'#e67e22'),0,.22,0),G.labelPlane('REWORK',.6,.14,{bg:'#fff',fg:'#e67e22',fs:70}).translateY(.3).translateZ(.255));rw.position.set(5.4,0,3.25);scene.add(rw);
  N.rina.root.visible=true;N.asep.root.visible=true;
  for(let k=0;k<5;k++){const s=sph(.14,'#555');s.material.transparent=true;s.material.depthWrite=false;s.castShadow=false;s.visible=false;scene.add(s);smoke.push(s);}
  G.updaters.add(beltUpd);G.updaters.add(sickUpd);
  // pojok maintenance
  scene.add(at(G.labelPlane('MAINTENANCE',2.4,.4,{bg:'#e67e22',fg:'#fff',fs:90}),8,3,-11.97));
  const bench=grp(at(box(2,.07,.8,'#8a6d4a'),0,.86,0),at(box(.07,.84,.75,'#3a4652'),-.95,.42,0),at(box(.07,.84,.75,'#3a4652'),.95,.42,0),at(box(.22,.16,.2,'#2f6fd8'),-.6,.98,.1),at(box(.3,.04,.12,'#c9d1d8',{metalness:.8}),.3,.92,.1),at(cyl(.05,.05,.16,'#f3b52f'),.7,.98,-.1));bench.position.set(8,0,-11.35);scene.add(bench);G.addColBox(8,-11.35,2.1,.9);
  const cab=grp(at(box(.8,1.2,.55,'#d62828',{roughness:.4}),0,.6,0));for(let k=0;k<5;k++)cab.add(at(box(.7,.02,.02,'#c9d1d8',{metalness:.7}),0,.2+k*.21,.285));cab.position.set(9.3,0,-11.5);scene.add(cab);G.addColBox(9.3,-11.5,.8,.6);
  const peg=G.canvasPlane(1.8,.9,(x,w,h)=>{x.fillStyle='#e9e2cf';x.fillRect(0,0,w,h);x.fillStyle='#2b2b2b';[[40,40,18,150],[90,40,26,120],[150,40,14,170],[210,50,60,20],[210,90,60,20],[300,40,22,140],[360,40,40,40]].forEach(r=>x.fillRect(r[0],r[1],r[2],r[3]));x.fillStyle='#1d3557';x.font='bold 24px sans-serif';x.fillText('SHADOW BOARD',w-200,h-16);},200);at(peg,8,1.75,-11.96);scene.add(peg);
  jaka=G.npc({name:'Pak Jaka · Teknisi Maintenance',skin:'#b97a4b',hair:'#1b1b1b',cap:'#e67e22'},7.2,-9.6,0);
  G.addInter({pos:jaka.root.position,obj:'Pak Jaka · Teknisi Maintenance',label:'Bicara',r:2.4,fn:async()=>{
    if(R.step===0){await say('Pak Jaka · Teknisi Maintenance',`Halo, ${G.esc(G.save.name)}! Saya Jaka, teknisi maintenance. Mesin itu seperti badan kita: kalau tidak dirawat, suatu saat pasti “sakit”.`);await say('Pak Jaka · Teknisi Maintenance','Sebelum pegang mesin, kenali dulu <b>tiga jenis perawatan</b>. Coba kelompokkan 6 kegiatan berikut!');klas();}
    else if(R.step===3)sched();
    else await say('Pak Jaka · Teknisi Maintenance',G.pick(['Urutan aman: <b>STOP & OFF → LOTO → energi nol → perbaiki → lepas LOTO → uji jalan</b>.','Amati dulu gejalanya, baru tentukan penyebab. Jangan menebak!','Gembok LOTO hanya dilepas oleh orang yang memasangnya.']));}});
  G.addInter({pos:V(11.2,-9.3),obj:'Kompresor udara',label:'Inspeksi harian',r:2.2,on:()=>R.step===1,fn:komp});
  CASES.forEach(c=>G.addInter({pos:V(W.LINE.stations[c.i],W.LINE.z+1.9),obj:c.n,label:()=>c.diag?'Lanjutkan SOP perbaikan':'Periksa gejala',r:1.8,on:()=>R.step===2&&!c.fixed,fn:()=>c.diag?sop(c):diag(c)}));
  G.addInter({pos:V(-9.6,3.7),obj:'Panel Kontrol Line 1',label:'Jalankan pesanan 40 unit',r:2,on:()=>R.step===4&&!R.weekDone,fn:week});
  G.addInter({pos:N.harun.root.position,obj:'Pak Harun · Kepala Pabrik',label:'Bicara',fn:async()=>{await say('Pak Harun · Kepala Pabrik',G.pick(['Ikuti tanda ◆ kuning di lantai — itu tujuan misimu berikutnya.','Mesin yang berhenti mendadak itu mahal: pekerja menunggu, pesanan terlambat.','Perawatan itu investasi, bukan biaya yang terbuang.']));}});
  setRun(true);R.step=-1;refresh();
  await say('Pak Harun · Kepala Pabrik',`Selamat datang kembali, ${G.esc(G.save.name)}! Jalur produksi kita sudah berjalan seminggu penuh tanpa henti.`);
  await say('Pak Harun · Kepala Pabrik','Tapi saya khawatir — mesin belum pernah dirawat sejak dipasang. Temui <b>Pak Jaka</b> di pojok <b>Maintenance</b> (dekat Ruang Utilitas) dan pelajari prosedur perawatan mesin.');
  setStep(0);};
})();
