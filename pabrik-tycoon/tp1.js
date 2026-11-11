/* TP 1 — Menganalisis alur proses produksi: perancangan → supply chain → produksi → QC → pengemasan */
(function(){
'use strict';
const {scene,box,cyl,at,grp,el,btn,row,say,modal,closeModal,toast,W}=G;
const T={step:-1,ok:0,total:0,sup:{},bad:{},fin:{bahan:0,ganti:0,scrap:0,rework:0,late:0,klaim:0,pendapatan:0},built:0,passed:0,packed:0,rejected:0,aoi:0,falsePass:0,falseRej:0,waited:false,combo:0,units:[],running:false};
G.TP1=T;
const ORDER_QTY=12,PRICE=120,DUE=7;
const STEPS=()=>['Temui Bu Sari di Ruang R&D','Pesan bahan baku ke Pak Dedi (Purchasing)','Terima kiriman & lakukan IQC di meja gudang',`Bangun jalur produksi (${T.built}/8 stasiun)`,'Nyalakan jalur di panel kontrol',`Uji fungsi di stasiun QC (${T.passed}/${ORDER_QTY} lolos)`,'Muat & kirim pesanan di dock pengiriman'];
function refresh(){G.setQuest('TP 1 · PROSES PRODUKSI',STEPS(),T.step);}
function setStep(n){T.step=n;refresh();G.marker.set(TARGET[n]||null);}
const V=(x,z)=>new THREE.Vector3(x,0,z);
const TARGET={0:V(-14.2,-8.3),1:V(-6.8,-10.9),2:W.iqcPos,3:null,4:V(-9.6,3.7),5:V(9.8,3.4),6:V(15.7,5)};
function score(ok){T.total++;if(ok)T.ok++;}

/* ---------- NPCs ---------- */
const U=G.UNIFORM;
const sari=G.npc({name:'Bu Sari · Engineer R&D',skin:'#c68642',hijab:'#2a9d8f',face:'glasses'},-14.2,-8.3,0);
const dedi=G.npc({name:'Pak Dedi · Purchasing',skin:'#d29a62',hair:'#1b1b1b',face:'glasses'},-6.8,-10.9,0);
const wawan=G.npc({name:'Pak Wawan · Kepala Gudang',skin:'#b97a4b',hair:'#222',cap:'#2f7a4d'},-14.6,4.6,Math.PI/2);
const rina=G.npc({name:'Teh Rina · Operator',skin:'#e0ac69',hijab:'#e76f51'},7,.35,0);rina.root.visible=false;
const asep=G.npc({name:'Kang Asep · Packing',skin:'#c68642',hair:'#2b1d14'},12.6,.35,0);asep.root.visible=false;
const harun=G.npc({name:'Pak Harun · Kepala Pabrik',skin:'#d9a066',hair:'#d8d8d8',face:'glasses',cap:'#1d3557'},2.2,9.2,-2.4);
const ujang=G.npc({name:'Mang Ujang · Sopir',skin:'#a86b3c',hair:'#222',uniform:false,shirt:'#2a9d8f',cap:'#e04848'},-16.6,8.7,Math.PI/2);ujang.root.visible=false;
G.NPC={sari,dedi,wawan,rina,asep,harun,ujang};
G.addInter({pos:harun.root.position,obj:'Pak Harun · Kepala Pabrik',label:'Bicara',fn:async()=>{const tips=['Ikuti tanda ◆ kuning di lantai — itu tujuan misimu berikutnya.','Pabrik yang baik itu seperti orkestra: rancangan, bahan, mesin, dan manusia harus selaras.','Pelanggan tidak melihat mesin kita — mereka hanya melihat mutu produknya.','Tahan Shift untuk berlari!'];await say('Pak Harun · Kepala Pabrik',G.pick(tips));}});

/* ---------- STEP 0: R&D ---------- */
const DESIGN=[['💡','Ide & spesifikasi produk','Kebutuhan pasar: terang, tahan ±3 jam, bisa diisi ulang'],['✏️','Skema rangkaian','Menggambar rangkaian LED, IC pengisi, dan baterai'],['🟩','Layout PCB','Menata jalur tembaga & posisi komponen di papan'],['🛠️','Membuat prototipe','Contoh pertama: PCB uji + casing cetak 3D'],['🔬','Uji & revisi prototipe','Menguji terang, suhu, lama nyala; desain diperbaiki'],['📋','BOM final & instruksi kerja','Daftar bahan final dan SOP dirilis ke produksi massal']];
function orderGame(title,intro,items,onDone){let seq=[],first=true;const sh=G.shuffle(items.map((x,i)=>i));
  modal(b=>{b.appendChild(el('div','kick','Susun urutan'));b.appendChild(el('h2','',title));b.appendChild(el('p','',intro));
    const slots=el('div','slots');items.forEach((x,i)=>{const s=el('div','slot',`<span class="n">${i+1}</span><span class="v" style="color:#6b7884">— ketuk kartu di bawah —</span>`);slots.appendChild(s);});b.appendChild(slots);
    const cards=el('div','cards');const cEls=sh.map(i=>{const it=items[i];const c=el('button','ocard',`<span class="ic">${it[0]}</span><span>${it[1]}<small>${it[2]}</small></span>`);
      c.onclick=()=>{if(seq.length>=items.length)return;G.sfx('tap');seq.push(i);c.classList.add('used');const s=slots.children[seq.length-1];s.classList.add('fill');s.querySelector('.v').innerHTML=`${it[0]} ${it[1]}`;s.querySelector('.v').style.color='';};cards.appendChild(c);return c;});
    b.appendChild(cards);const fb=el('div');b.appendChild(fb);
    const reset=()=>{seq=[];cEls.forEach(c=>c.classList.remove('used'));[...slots.children].forEach((s,i)=>{s.className='slot';s.querySelector('.v').innerHTML='— ketuk kartu di bawah —';s.querySelector('.v').style.color='#6b7884';});};
    const r=row(btn('↺ Ulang','gr',()=>{reset();fb.innerHTML='';}),btn('Periksa ✓','y',()=>{if(seq.length<items.length){toast('Isi semua urutan dulu');return;}
      let wrong=0;seq.forEach((v,i)=>{const s=slots.children[i];s.classList.add(v===i?'ok':'bad');if(v!==i)wrong++;});
      if(!wrong){G.sfx('ok');score(first);fb.innerHTML='';r.remove();onDone(b);}
      else{G.sfx('bad');first=false;fb.innerHTML=`<div class="fb bad">❌ ${wrong} posisi belum tepat (ditandai merah). Pikirkan: apa yang <b>harus sudah ada</b> sebelum tahap itu bisa dikerjakan?</div>`;setTimeout(()=>{reset();},1600);}}));b.appendChild(r);});}
const BOM=[['PCB FR-4 1 lapis (80×50 mm)','1'],['LED SMD 2835 putih','12'],['IC pengisi TP4056, transistor, resistor & kapasitor SMD (rangkaian pengisi + otomatis nyala saat padam)','1 set'],['Baterai Li-ion 18650 3,7 V 2000 mAh','1'],['Sakelar geser + konektor micro-USB','1'],['Casing ABS (atas + bawah) + 4 sekrup','1'],['Kardus, label, dan buku manual','1']];
G.addInter({pos:sari.root.position,obj:'Bu Sari · Engineer R&D',label:'Bicara',r:2.6,on:()=>true,fn:async()=>{
  if(T.step!==0){await say('Bu Sari · Engineer R&D',T.step<3?'BOM sudah dikirim ke Purchasing. Ayo temui Pak Dedi!':'Desain kita sedang diproduksi. Senang melihat ide menjadi barang nyata!');return;}
  await say('Bu Sari · Engineer R&D',`Halo, <b>${G.esc(G.save.name)}</b>! Aku Sari dari R&D. Produk kita: <b>Lampu Emergency LED "TerangTOI"</b> — menyala otomatis saat listrik PLN padam.`);
  await say('Bu Sari · Engineer R&D','Sebelum pabrik bisa memproduksi, produk harus <b>dirancang</b> dulu. Coba susun tahapan perancangan produk yang benar!');
  orderGame('Tahapan perancangan produk','Ketuk kartu sesuai urutan dari tahap pertama sampai terakhir.',DESIGN,b=>{
    b.appendChild(el('div','fb ok','<b>✅ Tepat!</b> Rancangan selesai dan menghasilkan <b>BOM (Bill of Materials)</b> — daftar semua bahan untuk satu unit produk:'));
    b.appendChild(el('div','',`<table class="tbl"><tr><th>Bahan</th><th>Jumlah/unit</th></tr>${BOM.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table>`));
    b.appendChild(el('div','know','<b>Tahukah kamu?</b> Prototipe casing biasanya dicetak dengan <b>3D printer</b> lebih dulu. Cetakan injeksi plastik (mold) harganya bisa puluhan juta rupiah, jadi desain harus benar sebelum mold dibuat. Lihat printer 3D yang sedang bekerja di meja R&D!'));
    b.appendChild(row(btn('Lanjut ▸','y',async()=>{closeModal();G.addCoins(30,'Desain produk');await say('Bu Sari · Engineer R&D','BOM ini sudah kukirim ke <b>Pak Dedi di Purchasing</b>. Temui dia untuk memesan bahan. Ingat, tenggat pesanan <b>7 hari</b>!');setStep(1);})));});}});

/* ---------- STEP 1: Purchasing ---------- */
const MATS=[{id:'pcb',n:'PCB',ic:'🟩'},{id:'komp',n:'Komponen SMD & LED',ic:'🔩'},{id:'bat',n:'Baterai 18650',ic:'🔋'},{id:'case',n:'Casing ABS',ic:'📦'}];
const SUP={pcb:[{n:'CV Sirkuit Bekasi',t:'lokal',p:120,q:4,d:2,note:'Lokal, bersertifikat'},{n:'Pabrik PCB Shenzhen',t:'impor',p:70,q:4,d:10,note:'Impor, murah tapi lama'},{n:'Toko online "PCB Kilat"',t:'murah',p:45,q:2,d:1,note:'Tanpa sertifikat mutu'}],
 komp:[{n:'Distributor resmi Jakarta',t:'lokal',p:150,q:5,d:2,note:'Komponen asli + datasheet'},{n:'Grosir impor Hong Kong',t:'impor',p:90,q:4,d:11,note:'Impor, harga grosir'},{n:'Lapak komponen murah',t:'murah',p:55,q:2,d:1,note:'Rawan komponen KW/palsu'}],
 bat:[{n:'Distributor baterai resmi',t:'lokal',p:180,q:5,d:2,note:'Bersertifikat, ada uji keamanan'},{n:'Pabrik baterai impor',t:'impor',p:110,q:4,d:12,note:'Impor, butuh izin kirim baterai'},{n:'Baterai bekas rekondisi',t:'murah',p:50,q:1,d:1,note:'Bekas laptop, kapasitas tidak pasti'}],
 case:[{n:'Injeksi plastik Cikarang',t:'lokal',p:100,q:4,d:3,note:'Lokal, sesuai gambar CAD'},{n:'Pabrik cetak impor',t:'impor',p:60,q:4,d:12,note:'Impor, minimal pesanan besar'},{n:'Toko online casing universal',t:'murah',p:35,q:2,d:1,note:'Ukuran tidak persis'}]};
function supplierModal(){const sel={};const rerender=()=>{modal(b=>{b.appendChild(el('div','kick','Purchase Order · Supply Chain'));b.appendChild(el('h2','','Pilih pemasok bahan baku'));
  b.appendChild(el('p','',`Pesanan: <b>${ORDER_QTY} unit</b> · Tenggat kirim: <b>${DUE} hari</b> · Saldo: <b>${G.fmt(G.save.coins)} ¢</b>. Harga untuk satu batch (${ORDER_QTY} unit).`));
  MATS.forEach(m=>{b.appendChild(el('div','mat',`<span>${m.ic} ${m.n}</span><span style="color:#9fb0bf;font-weight:500">${sel[m.id]!==undefined?'✓ dipilih':''}</span>`));const g3=el('div','grid3');
    SUP[m.id].forEach((s,i)=>{const c=el('button','supc'+(sel[m.id]===i?' sel':''),`<b>${s.n}</b><span class="pr">${s.p} ¢</span><small>Mutu <span class="st">${'★'.repeat(s.q)}${'☆'.repeat(5-s.q)}</span></small><small style="text-align:right">⏱ ${s.d} hari</small><small style="grid-column:1/3">${s.note}</small>`);
      c.onclick=()=>{G.sfx('tap');sel[m.id]=i;rerender();};g3.appendChild(c);});b.appendChild(g3);});
  const tot=MATS.reduce((a,m)=>a+(sel[m.id]!==undefined?SUP[m.id][sel[m.id]].p:0),0);const done=MATS.every(m=>sel[m.id]!==undefined);
  const late=MATS.filter(m=>sel[m.id]!==undefined&&SUP[m.id][sel[m.id]].d>DUE);
  b.appendChild(el('div','fb info',`Total PO: <b>${tot} ¢</b>${late.length?` · <span style="color:#ffb36b">⚠ ${late.length} pemasok butuh waktu kirim lebih dari ${DUE} hari</span>`:''}`));
  const go=btn('📨 Kirim Purchase Order','y',()=>{closeModal();placePO(sel,tot);});go.disabled=!done;b.appendChild(row(go));});};rerender();}
G.addInter({pos:dedi.root.position,obj:'Pak Dedi · Purchasing',label:'Bicara',r:2.4,fn:async()=>{
  if(T.step<1){await say('Pak Dedi · Purchasing','Saya menunggu BOM dari R&D dulu. Temui Bu Sari, ya!');return;}
  if(T.step>1){await say('Pak Dedi · Purchasing','PO sudah terkirim. Ingat: purchasing yang baik menimbang <b>harga, mutu, dan waktu kirim</b> sekaligus.');return;}
  await say('Pak Dedi · Purchasing','BOM dari Bu Sari sudah saya terima. Sekarang kita pesan bahan ke <b>pemasok</b>. Ini bagian dari <b>supply chain</b> — rantai pasok.');
  await say('Pak Dedi · Purchasing',`Tiap bahan punya 3 pilihan pemasok. Bandingkan <b>harga</b>, <b>mutu (★)</b>, dan <b>waktu kirim</b>. Pesanan harus sampai ke pelanggan dalam <b>${DUE} hari</b>!`);
  supplierModal();}});
async function placePO(sel,tot){MATS.forEach(m=>{T.sup[m.id]=SUP[m.id][sel[m.id]];});T.fin.bahan=tot;G.addCoins(-tot,'Purchase Order bahan baku');
  const murah=MATS.filter(m=>T.sup[m.id].t==='murah'),impor=MATS.filter(m=>T.sup[m.id].t==='impor');
  let c='PO sudah dikirim ke pemasok. ';if(murah.length)c+=`Hmm, ${murah.map(m=>m.n).join(', ')} dari pemasok murah tanpa jaminan mutu… semoga lolos IQC. `;
  if(impor.length)c+=`Lalu ${impor.map(m=>m.n).join(', ')} impor butuh lebih dari ${DUE} hari — padahal tenggat kita ${DUE} hari! `;
  if(!murah.length&&!impor.length)c+='Pilihan pemasok yang aman: mutu terjamin dan tepat waktu. ';
  await say('Pak Dedi · Purchasing',c+'Kiriman pertama akan datang ke <b>dock penerimaan</b>. Temui Pak Wawan di meja IQC.');
  setStep(2);G.marker.set(null);receiveTruck();}
/* ---------- STEP 2: truck + IQC ---------- */
let rTruck=null;const crates=[];T.crates=crates;
async function receiveTruck(){rTruck=G.truck('#2f7a4d','EKSPEDISI PASUNDAN');G.cinema={pos:new THREE.Vector3(-33,7,17),look:new THREE.Vector3(-21,1,5)};G.sfx('truck');
  await G.drive(rTruck,[[-70,18],[-25,18],[-25,9],[-21.4,5,true]],9);
  ujang.root.visible=true;G.bubble(ujang,'Kiriman dataaang! 📦',3);
  MATS.forEach((m,i)=>{const cr=grp(at(box(.8,.6,.8,i%2?'#c49562':'#b98b55'),0,.3,0),G.labelPlane(m.n.toUpperCase(),.7,.2,{bg:'#fff',fs:60}).translateY(.35).translateZ(.405));scene.add(cr);crates.push(cr);
    const to=new THREE.Vector3(-16.6+(i%2)*1.1,0,3.6+Math.floor(i/2)*1.2);const fr=new THREE.Vector3(-19.5,1.2,5);G.anim(.8,k=>{cr.position.lerpVectors(fr,to,k);cr.position.y=Math.sin(k*Math.PI)*.8+(1-k)*1.2;},null);});
  await G.wait(1.4);G.cinema=null;G.marker.set(TARGET[2]);}
const ISSUE={pcb:'3 dari 12 PCB melengkung (warping), tidak ada sertifikat uji.',komp:'LED yang datang berwarna <b>kuning hangat</b>, padahal BOM meminta <b>putih</b>. Tidak ada datasheet.',bat:'4 dari 12 baterai <b>penyok</b>, tegangan terukur 1,9 V (rusak).',case:'Ukuran casing tidak sesuai gambar CAD, 2 unit retak.'};
const OKMSG={pcb:'Jumlah 12/12 ✓ · ukuran 80×50 mm ✓ · tidak melengkung ✓',komp:'Kode komponen sesuai BOM ✓ · datasheet lengkap ✓',bat:'Tegangan 3,6–3,7 V ✓ · fisik mulus ✓ · ada sertifikat ✓',case:'Ukuran sesuai CAD ✓ · warna sesuai ✓ · tidak retak ✓'};
G.addInter({pos:W.iqcPos,obj:'Meja IQC · Pak Wawan',label:'Periksa kiriman (IQC)',r:2.4,on:()=>T.step===2&&crates.length===4,fn:startIQC});
async function startIQC(){
  const impor=MATS.filter(m=>T.sup[m.id].t==='impor');
  await say('Pak Wawan · Kepala Gudang','Selamat datang di gudang! Setiap barang yang masuk wajib diperiksa dulu: <b>IQC — Incoming Quality Control</b>. Barang cacat yang lolos di sini akan menjadi produk cacat di jalur.');
  if(impor.length){const k=await say('Pak Wawan · Kepala Gudang',`Masalah! Kiriman impor <b>${impor.map(m=>m.n).join(', ')}</b> masih tertahan di pelabuhan — perkiraan tiba <b>5 hari lagi</b>, melewati tenggat. Apa keputusanmu?`,[{t:'🚚 Beli darurat dari pemasok lokal'},{t:'⏳ Tunggu kiriman impor',cls:'gr'}]);
    if(k===0){let c=0;impor.forEach(m=>{const l=SUP[m.id][0];c+=l.p+30;T.sup[m.id]=l;});T.fin.ganti+=c;G.addCoins(-c,'Pembelian darurat + ongkos kilat');await say('Pak Wawan · Kepala Gudang','Keputusan cepat! Biaya naik, tapi pesanan tetap tepat waktu. Barang lokal sudah datang.');}
    else{T.waited=true;await say('Pak Wawan · Kepala Gudang','Baik, kita tunggu. Ingat, pengiriman ke pelanggan akan <b>terlambat</b> dan bisa kena potongan harga.');}}
  const goods=MATS.filter(m=>T.sup[m.id].q>=4);const issueAlso=goods.length?G.pick(goods).id:null;let i=0;
  const next=()=>{if(i>=MATS.length){finishIQC();return;}const m=MATS[i],s=T.sup[m.id];const bad=s.q<=2;const short=!bad&&m.id===issueAlso;
    modal(b=>{b.appendChild(el('div','kick',`IQC · Peti ${i+1} dari 4`));b.appendChild(el('h2','',`${m.ic} ${m.n}`));b.appendChild(el('p','',`Pemasok: <b>${s.n}</b>`));
      const res=bad?ISSUE[m.id]:short?'Jumlah datang <b>10</b>, sedangkan Purchase Order <b>12</b>. Kualitas fisik baik.':OKMSG[m.id];
      b.appendChild(el('div','fb info','<b>Hasil pemeriksaan:</b><br>'+res));
      const decide=ch=>{const want=bad?'tolak':short?'sebagian':'terima';const correct=ch===want;score(correct);G.sfx(correct?'ok':'bad');let fb='';
        if(correct&&ch==='terima')fb='✅ Benar — barang sesuai spesifikasi, diterima masuk gudang bahan baku (sistem FIFO: yang masuk dulu, dipakai dulu).';
        else if(correct&&ch==='sebagian')fb='✅ Benar — 10 unit yang sesuai diterima, lalu dibuat <b>klaim kekurangan 2 unit</b> ke pemasok. Pemasok mengirim sisanya besok tanpa biaya.';
        else if(correct&&ch==='tolak'){const l=SUP[m.id][0];T.fin.ganti+=l.p;T.sup[m.id]=l;G.addCoins(-l.p,'Ganti bahan ke pemasok resmi');fb=`✅ Benar — barang ditolak dan diretur. Pemasok murah tidak sanggup mengganti sesuai standar, jadi Pak Dedi membeli pengganti dari <b>${l.n}</b> (${l.p} ¢). Murah di awal, mahal di akhir!`;}
        else if(bad){T.bad[m.id]=true;fb='❌ Barang tidak sesuai spesifikasi ikut diterima! Bahan ini akan menaikkan jumlah produk cacat di jalur produksi. Seharusnya: <b>tolak & retur</b>.';}
        else if(short&&ch==='terima'){T.fin.ganti+=20;G.addCoins(-20,'Kekurangan barang tidak diklaim');fb='❌ Kekurangan 2 unit tidak dicatat — pabrik membayar 12 unit tetapi hanya menerima 10, lalu harus membeli kekurangannya sendiri. Seharusnya: <b>terima sebagian + klaim kekurangan</b>.';}
        else if(short&&ch==='tolak')fb='❌ 10 unit yang datang sebenarnya baik. Menolak seluruh kiriman membuat produksi tertunda. Seharusnya: <b>terima sebagian + klaim kekurangan</b>.';
        else fb='❌ Barang ini sudah sesuai spesifikasi dan jumlahnya lengkap. Seharusnya: <b>terima</b>.';
        b.querySelector('.row').remove();b.appendChild(el('div','fb '+(correct?'ok':'bad'),fb));b.appendChild(row(btn('Lanjut ▸','y',()=>{i++;next();})));};
      b.appendChild(el('p','','<small style="color:#9fb0bf">Bandingkan hasil pemeriksaan dengan Purchase Order & spesifikasi BOM.</small>'));
      b.appendChild(row(btn('✓ Terima','g',()=>decide('terima')),btn('📝 Terima sebagian + klaim kekurangan','',()=>decide('sebagian')),btn('✗ Tolak & retur','r',()=>decide('tolak'))));});};next();}
async function finishIQC(){modal(b=>{b.appendChild(el('div','kick','Rantai pasok (supply chain)'));b.appendChild(el('h2','','Bahan siap diproduksi!'));
  b.appendChild(el('div','',`<div class="fb info" style="text-align:center;font-size:14px;line-height:2">🏭 Pemasok → 🚚 Ekspedisi → 📥 IQC → 🗄️ Gudang bahan → ⚙️ <b>Produksi</b> → ✅ QC → 📦 Gudang barang jadi → 🚚 Distributor → 🏪 Toko → 🙂 Konsumen</div>`));
  b.appendChild(el('div','know','<b>Tahukah kamu?</b> Rantai pasok sebuah HP bisa melibatkan ratusan pemasok dari belasan negara. Satu bahan terlambat saja bisa menghentikan seluruh pabrik — karena itu purchasing selalu menimbang <b>harga, mutu, dan waktu kirim</b>.'));
  b.appendChild(row(btn('Bangun jalur produksi ▸','y',async()=>{closeModal();G.addCoins(30,'IQC selesai');
    crates.forEach((c,i)=>G.anim(.7,k=>{c.position.x=G.lerp(-16.6+(i%2)*1.1,-15.2,k);c.position.z=G.lerp(3.6+Math.floor(i/2)*1.2,-1+i*.6,k);c.position.y=Math.sin(k*Math.PI)*.6;}));
    ujang.root.visible=false;G.drive(rTruck,[[-21.4,5],[-25,9],[-25,18],[-80,18]],9).then(()=>{scene.remove(rTruck);});
    await say('Pak Harun · Kepala Pabrik','Bahan sudah siap. Sekarang bangun <b>jalur produksi</b> di zona produksi: bagian <b>SMT</b> (Surface Mount Technology) untuk menyolder komponen, lalu perakitan, uji, dan pengemasan. Ada <b>8 petak stasiun</b> — pasang mesinnya berurutan dari petak #1 (kiri) sampai #8 (kanan)!');
    setStep(3);showSlots();})));});}

/* ---------- STEP 3: build line ---------- */
const ST=[{id:'loader',n:'PCB Loader',ic:'📥',d:'Memasukkan PCB kosong dari magazine ke konveyor.'},
 {id:'printer',n:'Solder Paste Printer',ic:'🖨️',d:'Mencetak pasta solder pada pad PCB lewat stensil.'},
 {id:'pnp',n:'Mesin Pick & Place',ic:'🤖',d:'Robot menempatkan LED, IC, dan resistor SMD.'},
 {id:'reflow',n:'Reflow Oven',ic:'🔥',d:'Memanaskan bertahap sampai pasta solder meleleh.'},
 {id:'aoi',n:'AOI (Inspeksi Optik Otomatis)',ic:'📷',d:'Kamera memeriksa sambungan solder & posisi komponen.'},
 {id:'assy',n:'Perakitan Akhir',ic:'🔧',d:'Operator memasang PCB, baterai, sakelar ke casing.'},
 {id:'fqc',n:'Uji Fungsi (Final QC)',ic:'✅',d:'Setiap produk jadi diuji sesuai spesifikasi.'},
 {id:'pack',n:'Pengemasan',ic:'📦',d:'Produk + manual + label dimasukkan ke kardus.'}];
const PRE={printer:'Pasta solder dicetak di atas PCB — PCB harus <b>dimasukkan ke jalur</b> dulu.',pnp:'Komponen SMD hanya bisa menempel bila pad sudah diberi <b>pasta solder</b>.',reflow:'Oven reflow menyolder komponen — komponen harus sudah <b>ditempatkan</b> di atas pasta.',
 aoi:'AOI memeriksa sambungan solder — solder harus sudah <b>dilelehkan di oven</b>.',assy:'Hasil solder harus <b>lolos inspeksi</b> dulu. Membongkar casing untuk memperbaiki solder jauh lebih mahal.',fqc:'Uji fungsi dilakukan pada produk yang <b>sudah utuh</b> (sudah dirakit).',pack:'Produk yang <b>belum diuji</b> tidak boleh dikemas!',loader:''};
const pads=[],machines=[];
function padTex(n){const c=G.cnv(256,256),x=c.getContext('2d');x.strokeStyle='#ffd23f';x.lineWidth=10;x.setLineDash([24,14]);x.strokeRect(10,10,236,236);x.setLineDash([]);x.fillStyle='rgba(255,210,63,.18)';x.fillRect(10,10,236,236);
  x.fillStyle='#ffd23f';x.font='800 130px Fredoka';x.textAlign='center';x.textBaseline='middle';x.fillText(n,128,136);return G.tex(c);}
function showSlots(){W.LINE.stations.forEach((sx,i)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(2.3,2.3),new THREE.MeshBasicMaterial({map:padTex(i+1),transparent:true,depthWrite:false}));p.rotation.x=-Math.PI/2;p.position.set(sx,.015,W.LINE.z+1.9);scene.add(p);pads.push(p);
  G.addInter({pos:V(sx,W.LINE.z+1.9),obj:`Petak stasiun #${i+1}`,label:'Pasang stasiun',r:1.7,on:()=>T.step===3&&T.built===i,fn:()=>catalog(i)});});
  G.marker.set(V(W.LINE.stations[0],W.LINE.z+1.9));}
let slotFirst=true;
function catalog(i){const remain=G.shuffle(ST.slice(i));
  modal(b=>{b.appendChild(el('div','kick',`Petak #${i+1} dari 8`));b.appendChild(el('h2','','Pilih mesin untuk petak ini'));b.appendChild(el('p','',`Stasiun terpasang: ${T.built?ST.slice(0,i).map(s=>s.ic+' '+s.n).join(' → '):'belum ada'}`));
    const cards=el('div','cards');const fb=el('div');
    remain.forEach(s=>{const c=el('button','ocard',`<span class="ic">${s.ic}</span><span>${s.n}<small>${s.d}</small></span>`);c.onclick=()=>{
      if(s.id===ST[i].id){score(slotFirst);slotFirst=true;G.sfx('ok');closeModal();buildMachine(i);}
      else{slotFirst=false;G.sfx('bad');c.classList.add('bad');c.disabled=true;fb.innerHTML=`<div class="fb bad">❌ <b>${s.n}</b> belum bisa dipasang di sini. ${PRE[s.id]}</div>`;}};cards.appendChild(c);});
    b.appendChild(cards);b.appendChild(fb);b.appendChild(row(btn('Tutup','gr',closeModal)));});}
function buildMachine(i){const s=ST[i],sx=W.LINE.stations[i];const g=G.MACHINE[s.id]();g.position.set(sx,9,W.LINE.z);scene.add(g);machines[i]=g;
  const lab=G.textSprite(`${i+1}. ${s.n}`,{h:.28,bg:'rgba(29,53,87,.9)'});lab.position.set(0,2.45,0);g.add(lab);
  G.anim(.7,k=>{const e=k<.8?(k/.8)**2:1;g.position.y=9*(1-e);if(k>.8)g.position.y=Math.sin((k-.8)/.2*Math.PI)*.25;},()=>{g.position.y=0;G.sfx('build');dust(sx,W.LINE.z);});
  scene.remove(pads[i]);T.built++;refresh();G.addCoins(15,`${s.n} terpasang`);
  G.updaters.add((dt,t)=>g.userData.upd&&g.userData.upd(dt,t,T.running));
  if(T.built<8)G.marker.set(V(W.LINE.stations[T.built],W.LINE.z+1.9));
  else setTimeout(async()=>{rina.root.visible=true;asep.root.visible=true;G.bubble(rina,'Siap merakit! 🔧');G.bubble(asep,'Siap mengemas! 📦');
    rework=grp(at(box(.7,.45,.5,'#e67e22'),0,.22,0),G.labelPlane('REWORK',.6,.14,{bg:'#fff',fg:'#e67e22',fs:70}).translateY(.3).translateZ(.255));rework.position.set(5.4,0,3.25);scene.add(rework);
    modal(b=>{b.appendChild(el('div','kick','Jalur produksi lengkap'));b.appendChild(el('h2','','8 stasiun terpasang! 🎉'));
      b.appendChild(el('div','fb ok',ST.map((s,k)=>`${k+1}. ${s.ic} ${s.n}`).join('<br>')));
      b.appendChild(el('div','know','<b>Tahukah kamu?</b> Pada reflow oven, PCB dipanaskan bertahap: <b>preheat → soak → reflow (puncak sekitar 235–250 °C untuk solder bebas timbal) → pendinginan</b>. Kalau terlalu cepat panas, komponen bisa retak!'));
      b.appendChild(row(btn('Siap produksi ▸','y',()=>{closeModal();setStep(4);})));});},1000);}
function dust(x,z){for(let k=0;k<14;k++){const p=G.sph(.12,'#d8d0c0');p.material.transparent=true;scene.add(p);const a=k/14*Math.PI*2;
  G.anim(.6,t=>{p.position.set(x+Math.cos(a)*(.6+t*1.6),.1+t*.4,z+Math.sin(a)*(.5+t*1.2));p.material.opacity=1-t;p.scale.setScalar(1+t);},()=>{scene.remove(p);p.geometry.dispose();});}}
let rework=null;

/* ---------- STEP 4: run line ---------- */
G.addInter({pos:V(-9.6,3.7),obj:'Panel Kontrol Line 1',label:()=>T.running?'Jalur berjalan':'Tekan START',r:2,on:()=>T.step===4,fn:async()=>{
  T.running=true;W.beltSpeed=1.3;W.setStack('run');W.hmi.userData.redraw((x,w,h)=>{x.fillStyle='#0d2238';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='bold 22px sans-serif';x.fillText('LINE 1',10,28);x.fillStyle='#7ee2a5';x.fillText('RUN ▶',10,60);});
  G.sfx('ok');rina.busy=1;setStep(5);toast('Jalur berjalan! Produk pertama menuju stasiun Uji Fungsi — bersiaplah di sana.','ok');
  await G.wait(.6);G.cinema={pos:new THREE.Vector3(-4,3.2,6.5),look:new THREE.Vector3(-1,1,2)};await G.wait(3.2);G.cinema=null;}});

/* ---------- product units ---------- */
function pcbTex(){const c=G.cnv(128,84),x=c.getContext('2d');x.fillStyle='#1d7a3e';x.fillRect(0,0,128,84);x.fillStyle='#d9a441';for(let i=0;i<12;i++)x.fillRect(14+(i%4)*28,10+Math.floor(i/4)*22,14,8);x.fillRect(96,62,20,14);x.strokeStyle='#d9a441';x.lineWidth=2;x.beginPath();x.moveTo(10,74);x.lineTo(90,74);x.stroke();return G.tex(c);}
const PCBT=pcbTex();
function makeUnit(){const g=new THREE.Group();
  const pcb=new THREE.Mesh(new THREE.BoxGeometry(.34,.02,.22),[0,1,2,3,4,5].map(i=>i===2?new THREE.MeshStandardMaterial({map:PCBT}):G.mat('#1d7a3e')));pcb.castShadow=true;g.add(pcb);
  const paste=new THREE.Group();for(let i=0;i<12;i++)paste.add(at(box(.05,.006,.03,'#b9bec4',{metalness:.6}),-.12+(i%4)*.075,.013,-.065+Math.floor(i/4)*.055));paste.visible=false;g.add(paste);
  const comps=new THREE.Group();for(let i=0;i<12;i++)comps.add(at(box(.045,.02,.028,'#f6f3e6'),-.12+(i%4)*.075,.022,-.065+Math.floor(i/4)*.055));comps.add(at(box(.05,.015,.04,'#111'),.11,.02,.07));comps.visible=false;g.add(comps);
  const casing=grp(at(box(.38,.09,.26,'#eceff1',{roughness:.4}),0,.045,0),at(box(.3,.005,.17,'#cfe8ff',{transparent:true,opacity:.7}),0,.092,0),at(box(.04,.02,.03,'#e04848'),.15,.095,.1));casing.visible=false;g.add(casing);
  const glowP=at(box(.29,.006,.16,'#fffbe0',{emissive:'#fffbe0',emissiveIntensity:1.4}),0,.096,0);glowP.visible=false;g.add(glowP);
  const carton=grp(at(box(.42,.16,.3,'#c49562'),0,.08,0),at(box(.43,.03,.06,'#d9c7a0'),0,.16,0));carton.visible=false;const lb=G.labelPlane('TerangTOI',.2,.08,{bg:'#fff',fg:'#1d3557',fs:70});lb.position.set(0,.08,.151);carton.add(lb);g.add(carton);
  g.userData={pcb,paste,comps,casing,glowP,carton};return g;}
function setStage(u,s){const d=u.g.userData;if(s===u.stage)return;u.stage=s;
  d.paste.visible=s>=1&&s<5;d.comps.visible=s>=2&&s<5;if(s>=3)d.comps.children.forEach(c=>{c.material.metalness=.5;});d.pcb.visible=s<5;d.casing.visible=s>=5&&s<7;d.glowP.visible=s===6;d.carton.visible=s>=7;}
function pMat(m){const q=T.sup[m].q;return({5:.02,4:.04,2:.16,1:.28})[q]+(T.bad[m]?.2:0);}
function rollDefect(){if(Math.random()<.09)return{aoi:G.pick(['Jembatan solder (bridging) pada kaki IC pengisi','LED terpasang terbalik (polaritas salah)','Komponen SMD tidak terpasang (missing)','Solder kurang (insufficient) pada pad LED'])};
  const opts=[['bat',['bat']],['komp',['chg','led']],['pcb',['pcb']],['case',['case']]];for(const [m,ds] of opts)if(Math.random()<pMat(m))return{fqc:G.pick(ds),src:m};
  if(Math.random()<.06)return{fqc:'over',src:'komp'};return null;}
function readings(u){const d=u.def&&u.def.fqc;const r={v:G.rand(3.7,4.15),i:G.rand(.88,1.05),led:12,crack:false};
  if(Math.random()<.18){r.v=G.rand(3.6,3.66);}if(Math.random()<.15){r.i=G.rand(.8,.84);}
  if(d==='bat')r.v=G.rand(2.5,3.3);if(d==='chg')r.i=G.rand(.05,.35);if(d==='over')r.i=G.rand(1.18,1.35);if(d==='led')r.led=Math.floor(G.rand(8,12));if(d==='pcb')r.led=G.pick([0,4,8]);if(d==='case')r.crack=true;
  if(d==='bat'&&Math.random()<.5)r.led=12;return r;}
const DEFN={bat:'Tegangan baterai di bawah batas spesifikasi — sel baterai lemah/rusak',chg:'Arus pengisian terlalu kecil — rangkaian pengisi bermasalah',over:'Arus pengisian melebihi batas — berbahaya bagi baterai Li-ion',led:'Sebagian LED mati',pcb:'Satu baris LED mati — jalur PCB putus',case:'Casing retak'};
let spawnT=0;
G.updaters.add((dt,t)=>{if(!T.running)return;const L=W.LINE,S=L.stations;
  spawnT-=dt;const pending=T.units.filter(u=>!u.out&&!(u.def&&u.def.aoi&&u.x<S[4])).length;
  if(spawnT<=0&&T.passed+pending<ORDER_QTY&&T.units.filter(u=>!u.out&&u.x<S[0]+1.2).length===0){spawnT=2.4;const u={g:makeUnit(),x:S[0]-.4,stage:-1,def:rollDefect()};u.read=readings(u);u.g.position.set(u.x,L.y,L.z);scene.add(u.g);setStage(u,0);T.units.push(u);}
  const live=T.units.filter(u=>!u.out).sort((a,b)=>b.x-a.x);
  live.forEach((u,idx)=>{if(u.anim)return;const ahead=live.slice(0,idx).filter(o=>!o.anim)[idx>0?0:0];let lim=1e9;
    for(let j=idx-1;j>=0;j--){if(!live[j].anim){lim=live[j].x-.55;break;}}
    const qcX=S[6];if(!u.qcDone&&u.x<=qcX)lim=Math.min(lim,qcX);
    u.x=Math.min(u.x+W.beltSpeed*dt,lim);u.g.position.x=u.x;
    const st=u.x>S[6]+.2?(u.x>S[7]-.1?7:6):u.x>S[5]?5:u.x>S[4]?4:u.x>S[3]+.9?3:u.x>S[2]?2:u.x>S[1]?1:0;setStage(u,Math.max(u.stage,st));
    if(u.def&&u.def.aoi&&!u.aoiChecked&&u.x>=S[4]){u.aoiChecked=true;u.anim=true;T.aoi++;T.fin.rework+=10;G.addCoins(-10,'Rework');toast(`📷 AOI mendeteksi: ${u.def.aoi} → dipindah ke meja rework (diperbaiki terpisah)`,'bad');
      const a=u.g.position.clone(),b=new THREE.Vector3(5.4,.5,3.25);G.anim(.8,k=>{u.g.position.lerpVectors(a,b,k);u.g.position.y+=Math.sin(k*Math.PI)*.5;},()=>{u.out=true;scene.remove(u.g);});
      const scr=machines[4]&&machines[4].userData.aoiScreen;if(scr){scr.userData.redraw((x,w,h)=>{x.fillStyle='#1a0505';x.fillRect(0,0,w,h);x.fillStyle='#ff5a5a';x.font='bold 22px sans-serif';x.fillText('AOI: NG',20,40);x.font='14px sans-serif';x.fillText('Cacat solder terdeteksi',20,70);});setTimeout(()=>scr.userData.redraw((x,w,h)=>{x.fillStyle='#04140a';x.fillRect(0,0,w,h);x.fillStyle='#7ee2a5';x.font='bold 22px sans-serif';x.fillText('AOI: OK',20,40);}),2200);}}
    if(u.x>=L.x1-.2&&!u.anim){u.anim=true;const n=T.packed;const to=new THREE.Vector3(15.25+(n%4)*.3,.14+Math.floor(n/8)*.17+.0,4.65+Math.floor((n%8)/4)*.34);const a=u.g.position.clone();
      G.anim(.9,k=>{u.g.position.lerpVectors(a,to,k);u.g.position.y+=Math.sin(k*Math.PI)*.9;},()=>{u.out='packed';});T.packed++;if(T.packed>=ORDER_QTY)endProduction();}});
  const head=qcHead();const lamp=machines[6]&&machines[6].userData.testLamp;if(lamp)lamp.material.emissiveIntensity=head?1.2+Math.sin(t*8)*.2:0;});
function qcHead(){const X=W.LINE.stations[6];return T.units.find(u=>!u.out&&!u.anim&&!u.qcDone&&Math.abs(u.x-X)<.02)||null;}

/* ---------- STEP 5: QC game ---------- */
G.addInter({pos:V(9.8,3.4),obj:'Stasiun Uji Fungsi',label:'Lakukan uji fungsi',r:2,on:()=>T.step===5,fn:qcPanel});
function drawProduct(cv,r){const x=cv.getContext('2d'),w=cv.width,h=cv.height;x.fillStyle='#0c1116';x.fillRect(0,0,w,h);
  x.fillStyle='#e9edf0';G.rr(x,22,40,w-44,h-80,22);x.fill();x.strokeStyle='#b8c0c7';x.lineWidth=4;x.stroke();
  x.fillStyle='#d6e9fa';G.rr(x,40,60,w-80,h-150,12);x.fill();
  for(let i=0;i<12;i++){const cx=62+(i%4)*((w-124)/3),cy=78+Math.floor(i/4)*((h-190)/2);const on=r.led===12?true:r.led===0?false:(r.led===4?Math.floor(i/4)===0:r.led===8?Math.floor(i/4)!==1:i<r.led);
    if(on){const gr=x.createRadialGradient(cx,cy,2,cx,cy,22);gr.addColorStop(0,'#fffef0');gr.addColorStop(1,'rgba(255,240,170,0)');x.fillStyle=gr;x.beginPath();x.arc(cx,cy,22,0,7);x.fill();}
    x.fillStyle=on?'#fffbe6':'#4a5058';x.fillRect(cx-9,cy-6,18,12);}
  x.fillStyle='#1d3557';x.font='700 20px Fredoka';x.textAlign='center';x.fillText('TerangTOI',w/2,h-62);x.fillStyle='#e04848';x.fillRect(w-70,h-82,26,14);
  if(r.crack){x.strokeStyle='#1b1b1b';x.lineWidth=3;x.beginPath();x.moveTo(30,h-110);x.lineTo(62,h-96);x.lineTo(54,h-80);x.lineTo(90,h-60);x.lineTo(84,h-46);x.stroke();}
  x.fillStyle='#9fb0bf';x.font='500 13px Fredoka';x.fillText('Tampak depan · uji nyala',w/2,26);}
function qcPanel(){let poll=null;const render=()=>{const u=qcHead();
  modal(b=>{b.appendChild(el('div','kick',`Final QC · lolos ${T.passed}/${ORDER_QTY} · ditolak ${T.rejected}`));b.appendChild(el('h2','',u?`Unit #${String(T.passed+T.rejected+1).padStart(3,'0')}`:'Menunggu unit berikutnya…'));
    if(!u){b.appendChild(el('p','','Produk sedang bergerak di konveyor. Panel akan terisi otomatis saat unit tiba di meja uji. 🔄'));b.appendChild(el('div','spec','<b>Spesifikasi lolos:</b> Tegangan baterai 3,60–4,20 V · Arus pengisian 0,80–1,10 A · LED menyala 12/12 · Casing utuh tanpa retak'));
      b.appendChild(row(btn('Tutup','gr',()=>{clearInterval(poll);closeModal();})));clearInterval(poll);poll=setInterval(()=>{if(qcHead()){clearInterval(poll);render();}},300);return;}
    const r=u.read;const w=el('div','qcw');const cv=G.cnv(230,230);drawProduct(cv,r);w.appendChild(cv);
    const right=el('div','',`<table class="read"><tr><td>🔋 Tegangan baterai</td><td>${r.v.toFixed(2).replace('.',',')} V</td></tr><tr><td>⚡ Arus pengisian</td><td>${r.i.toFixed(2).replace('.',',')} A</td></tr><tr><td>💡 LED menyala</td><td>${r.led}/12</td></tr><tr><td>📦 Casing</td><td>lihat gambar</td></tr></table>
      <div class="spec"><b>Spesifikasi lolos:</b><br>Baterai 3,60–4,20 V · Arus isi 0,80–1,10 A<br>LED 12/12 menyala · Casing utuh<br><b>Satu saja di luar batas → REJECT</b></div>`);w.appendChild(right);b.appendChild(w);
    const fb=el('div');b.appendChild(fb);
    const decide=pass=>{const defective=!!(u.def&&u.def.fqc);const correct=pass!==defective;score(correct);u.qcDone=true;
      if(correct){T.combo++;G.sfx('ok');if(T.combo>=3&&T.combo%3===0)G.addCoins(5,`Combo QC x${T.combo}!`);}else{T.combo=0;G.sfx('bad');}
      if(pass){T.passed++;if(defective)T.falsePass++;u.read.passed=true;setStage(u,6);}
      else{T.rejected++;T.fin.scrap+=25;G.addCoins(-25,'Unit reject (scrap)');if(!defective)T.falseRej++;u.anim=true;const a=u.g.position.clone(),bb=G.worldPos(machines[6].userData.rej).add(new THREE.Vector3(0,.55,0));G.anim(.8,k=>{u.g.position.lerpVectors(a,bb,k);u.g.position.y+=Math.sin(k*Math.PI)*.6;},()=>{u.out=true;scene.remove(u.g);});}
      refresh();const msg=defective?`Unit ini <b>cacat</b>: ${DEFN[u.def.fqc]}.`:'Unit ini <b>sesuai spesifikasi</b>.';
      fb.innerHTML=`<div class="fb ${correct?'ok':'bad'}">${correct?'✅':'❌'} ${msg} ${!correct&&pass?'Produk cacat lolos ke pelanggan → akan ada <b>klaim garansi</b>!':''}${!correct&&!pass?'Produk baik terbuang → biaya bahan hilang.':''}</div>`;
      b.querySelector('.row').remove();
      if(T.passed>=ORDER_QTY){b.appendChild(row(btn('Selesai ▸','y',()=>{closeModal();})));}
      else setTimeout(()=>{if($open())render();},1100);};
    b.appendChild(row(btn('✓ LOLOS','g',()=>decide(true)),btn('✗ REJECT','r',()=>decide(false)),btn('Tutup','gr',()=>{closeModal();})));});};
  render();}
const $open=()=>document.querySelector('#modal').classList.contains('show');

/* ---------- end production + STEP 6 ship ---------- */
let sTruck=null;T.truckReady=false;
async function endProduction(){await G.wait(1.2);T.running=false;W.beltSpeed=0;W.setStack('stop');rina.busy=0;
  W.hmi.userData.redraw((x,w,h)=>{x.fillStyle='#0d2238';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='bold 22px sans-serif';x.fillText('LINE 1',10,28);x.fillStyle='#f3b52f';x.fillText('SELESAI',10,60);});
  toast(`🎉 ${ORDER_QTY} unit sudah dikemas di gudang barang jadi!`,'gold');G.addCoins(40,'Target produksi tercapai');setStep(6);G.marker.set(null);
  sTruck=G.truck('#1f8bff','TOI LOGISTIK');G.cinema={pos:new THREE.Vector3(33,7,17),look:new THREE.Vector3(21,1,5)};await G.drive(sTruck,[[80,18],[25,18],[25,9],[21.4,5,true]],9);await G.wait(.6);G.cinema=null;T.truckReady=true;G.marker.set(TARGET[6]);}
G.addInter({pos:V(15.7,5),obj:'Gudang barang jadi',label:'Muat & kirim pesanan',r:2.2,on:()=>T.step===6&&sTruck&&!T.shipped,fn:async()=>{T.shipped=true;G.marker.set(null);
  const boxes=T.units.filter(u=>u.out==='packed');boxes.forEach((u,i)=>setTimeout(()=>{const a=u.g.position.clone(),b=new THREE.Vector3(19.4,1.3,5+G.rand(-.6,.6));G.anim(.6,k=>{u.g.position.lerpVectors(a,b,k);u.g.position.y+=Math.sin(k*Math.PI)*.8;},()=>{scene.remove(u.g);});},i*140));
  await G.wait(boxes.length*.14+1);G.cinema={pos:new THREE.Vector3(14,5,12),look:new THREE.Vector3(30,1,12)};G.drive(sTruck,[[21.4,5],[25,9],[25,18],[90,18]],10);await G.wait(3);G.cinema=null;setStep(7);results();}});

/* ---------- results ---------- */
const QUIZ=[{q:'Mengapa AOI ditempatkan setelah reflow oven dan sebelum perakitan akhir?',o:['Cacat solder ditemukan sedini mungkin, sebelum PCB tertutup casing, sehingga perbaikannya murah','Supaya PCB dingin lebih cepat','Karena mesin AOI paling murah','Agar operator perakitan punya waktu istirahat'],a:0},
 {q:'Purchasing memilih baterai bekas yang sangat murah. Dampak paling mungkin bagi pabrik adalah…',o:['Laba pasti naik karena biaya bahan turun','Banyak produk gagal uji, ada risiko keselamatan, biaya klaim naik, dan reputasi pabrik turun','Tidak ada dampak asal QC teliti','Waktu produksi menjadi lebih cepat'],a:1},
 {q:'Urutan rantai pasok yang benar adalah…',o:['Konsumen → toko → pabrik → pemasok','Pemasok → gudang bahan baku → produksi → gudang barang jadi → distributor → konsumen','Pabrik → pemasok → gudang → konsumen','Gudang barang jadi → produksi → pemasok → konsumen'],a:1}];
function results(){let qi=0,qok=0;const doQ=()=>{const Q=QUIZ[qi];modal(b=>{b.appendChild(el('div','kick',`Analisis · soal ${qi+1}/3`));b.appendChild(el('h2','',Q.q));
  const bs=G.shuffle(Q.o.map((o,i)=>i)).map(i=>{const x=btn(Q.o[i],'gr',()=>{bs.forEach(z=>z.disabled=true);const ok=i===Q.a;score(ok);if(ok)qok++;x.className='gbtn '+(ok?'g':'r');G.sfx(ok?'ok':'bad');
      if(!ok)b.appendChild(el('div','fb bad','Jawaban yang tepat: <b>'+Q.o[Q.a]+'</b>'));b.appendChild(row(btn('Lanjut ▸','y',()=>{qi++;qi<3?doQ():report();})));});x.style.textAlign='left';x.style.width='100%';return x;});
  const col=el('div','',''),cc=el('div');cc.style.display='grid';cc.style.gap='8px';bs.forEach(x=>cc.appendChild(x));b.appendChild(cc);});};
 const F=T.fin;F.pendapatan=ORDER_QTY*PRICE;F.late=T.waited?Math.round(F.pendapatan*.25):0;F.klaim=T.falsePass*150;
 G.addCoins(F.pendapatan-F.late-F.klaim,'Pembayaran pelanggan');
 const biaya=F.bahan+F.ganti+F.scrap+F.rework,laba=F.pendapatan-F.late-F.klaim-biaya;T.laba=laba;
 modal(b=>{b.appendChild(el('div','kick','Laporan Produksi · TP 1'));b.appendChild(el('h2','','Pesanan terkirim! 🚚'));
   b.appendChild(el('div','',`<table class="fin"><tr><td>Pendapatan (${ORDER_QTY} × ${PRICE} ¢)</td><td class="pos">+${G.fmt(F.pendapatan)}</td></tr>
   ${F.late?`<tr><td>Potongan keterlambatan (25%)</td><td class="neg">−${G.fmt(F.late)}</td></tr>`:''}
   ${F.klaim?`<tr><td>Klaim garansi (${T.falsePass} unit cacat lolos)</td><td class="neg">−${G.fmt(F.klaim)}</td></tr>`:''}
   <tr><td>Biaya bahan baku (PO)</td><td class="neg">−${G.fmt(F.bahan)}</td></tr>
   ${F.ganti?`<tr><td>Bahan pengganti / pembelian darurat</td><td class="neg">−${G.fmt(F.ganti)}</td></tr>`:''}
   <tr><td>Scrap (${T.rejected} unit reject)</td><td class="neg">−${G.fmt(F.scrap)}</td></tr><tr><td>Rework (${T.aoi} unit dari AOI)</td><td class="neg">−${G.fmt(F.rework)}</td></tr>
   <tr class="tot"><td>LABA</td><td class="${laba>=0?'pos':'neg'}">${laba>=0?'+':''}${G.fmt(laba)} ¢</td></tr></table>`));
   const fy=Math.round(ORDER_QTY/(ORDER_QTY+T.rejected+T.aoi)*100);
   b.appendChild(el('div','fb info',`Unit dibuat: <b>${ORDER_QTY+T.rejected+T.aoi}</b> · First pass yield (unit lolos tanpa reject/rework): <b>${fy}%</b> · Keputusan QC salah: <b>${T.falsePass+T.falseRej}</b>`));
   b.appendChild(el('p','','Jawab 3 pertanyaan analisis untuk menutup laporan.'));b.appendChild(row(btn('Mulai analisis ▸','y',doQ)));});
 const report=()=>G.notebook('tp1',()=>{const ratio=T.total?T.ok/T.total:0;const stars=ratio>=.85?3:ratio>=.65?2:1;
   const prev=G.save.tp.tp1;if(!prev||stars>prev.stars||(stars===prev.stars&&laba>prev.laba))G.save.tp.tp1={stars,ok:T.ok,total:T.total,laba,date:new Date().toISOString().slice(0,10)};G.persist();G.payIncome();
   G.confetti();G.sfx('win');
   const txt=`PABRIK ELEKTRONIK TYCOON — TP 1 Proses Produksi\nNama: ${G.save.name}\nBintang: ${stars}/3 (benar pertama kali ${T.ok}/${T.total})\nLaba: ${laba} koin\nUnit reject: ${T.rejected}, rework AOI: ${T.aoi}, cacat lolos: ${T.falsePass}\nKuis analisis: ${qok}/3\nCatatan buku tulis: sudah ditulis (paraf guru: ........)`;
   modal(b=>{b.appendChild(el('div','kick','TP 1 selesai'));b.appendChild(el('h2','','Manajer Produksi Pemula 🏅'));
     b.appendChild(el('div','stars',`${'⭐'.repeat(stars)}<span style="opacity:.2">${'⭐'.repeat(3-stars)}</span>`));
     b.appendChild(el('p','',`Benar pada percobaan pertama: <b>${T.ok}/${T.total}</b> · Laba: <b>${G.fmt(laba)} ¢</b>`));
     b.appendChild(el('div','fb info','<b>Yang perlu kamu ingat:</b><br>• Alur produksi: <b>perancangan → pengadaan bahan & IQC → produksi (SMT, reflow, AOI, perakitan) → QC → pengemasan → pengiriman</b>.<br>• Purchasing menimbang <b>harga, mutu, dan waktu kirim</b>; bahan termurah belum tentu paling untung.<br>• Inspeksi di setiap tahap (IQC, AOI, final QC) mencegah cacat sampai ke pelanggan.'));
     b.appendChild(el('div','know','<b>💭 Refleksi:</b> Tahap mana yang paling menentukan laba pabrikmu hari ini? Jika mengulang, keputusan apa yang akan kamu ubah, dan mengapa?'));
     b.appendChild(row(btn('📋 Salin hasil','y',()=>{const ok=()=>toast('Hasil tersalin ✓ Tempel di Google Classroom','ok');try{navigator.clipboard.writeText(txt).then(ok,fb2);}catch(e){fb2();}
       function fb2(){const t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();try{document.execCommand('copy');ok();}catch(e){toast('Gagal menyalin — tangkap layar saja','bad');}t.remove();}}),
       btn('Lanjut TP 2 ▸','g',()=>G.go('tp2')),btn('↺ Main lagi','gr',()=>G.go('tp1')),btn('Peta TP','gr',()=>{closeModal();G.openMenu();})));});});}

/* ---------- start ---------- */
G.startTP1=async()=>{setStep(-1);await say('Pak Harun · Kepala Pabrik',`Selamat datang di <b>PT TOI Elektronika</b>, ${G.esc(G.save.name)}! Saya Harun, kepala pabrik. Kita baru dapat pesanan <b>${ORDER_QTY} unit Lampu Emergency LED</b> dari Toko Cahaya Citeureup.`);
  await say('Pak Harun · Kepala Pabrik',`Sebagai <b>Manajer Produksi</b>, kamu bertanggung jawab dari rancangan sampai pengiriman. Modal awalmu ${G.fmt(G.save.coins)} koin — kelola dengan bijak! Pertama, temui <b>Bu Sari di Ruang R&D</b> (ikuti tanda ◆ kuning).`);
  setStep(0);};
})();
