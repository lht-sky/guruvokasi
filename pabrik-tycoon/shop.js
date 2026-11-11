/* Pabrik Elektronik Tycoon — Koperasi Pabrik: kosmetik avatar, perluasan pabrik (menambah pendapatan), kode simpan */
(function(){
'use strict';
const {scene,box,cyl,sph,at,grp,el,btn,row,modal,closeModal,toast}=G;
const S=G.save;S.own=S.own||{};S.eq=S.eq||{};S.built=S.built||{};
const COS={suit:{t:'👕 Wearpack',L:[{id:'s0',n:'Wearpack TOI navy',p:0,body:'#1f3a68',stripe:'#ffd23f'},{id:'s1',n:'Abu-abu baja',p:150,body:'#5b6670',stripe:'#ff8a1f'},{id:'s2',n:'Merah marun',p:200,body:'#7a1f2b',stripe:'#ffd23f'},{id:'s3',n:'Hijau teknisi',p:200,body:'#1f6b45',stripe:'#e8eef2'},{id:'s4',n:'Edisi Manajer hitam-emas',p:600,body:'#15181d',stripe:'#f3b52f'}]},
 hat:{t:'🧢 Topi & helm',L:[{id:'h0',n:'Tanpa topi',p:0},{id:'h1',n:'Topi TOI navy',p:100,cap:'#1d3557'},{id:'h2',n:'Topi merah',p:100,cap:'#c62828'},{id:'h3',n:'Helm putih supervisor',p:250,helm:'#f5f5f5'},{id:'h4',n:'Helm emas',p:500,helm:'#f3b52f'}]},
 acc:{t:'🎒 Aksesori',L:[{id:'a0',n:'Tanpa aksesori',p:0},{id:'a1',n:'Ransel teknisi',p:200},{id:'a2',n:'Sabuk perkakas',p:250},{id:'a3',n:'Jetpack mainan',p:700}]},
 trail:{t:'✨ Jejak langkah',L:[{id:'t0',n:'Tanpa jejak',p:0},{id:'t1',n:'Jejak bintang',p:300,c:['#ffd23f','#fff3b0']},{id:'t2',n:'Jejak api',p:400,c:['#ff3d00','#ffb300']},{id:'t3',n:'Jejak pelangi',p:600,c:['#e04848','#f3b52f','#22b866','#1f8bff','#8e44ad']}]}};
Object.keys(COS).forEach(k=>{const d=COS[k].L[0].id;S.own[d]=true;if(!S.eq[k]||!S.own[S.eq[k]])S.eq[k]=d;});
const pick=k=>COS[k].L.find(x=>x.id===S.eq[k])||COS[k].L[0];
/* ---------- avatar ---------- */
G.makePlayer=()=>{const old=G.player,had=old&&old.wear;if(old)scene.remove(old.root);const su=pick('suit'),ha=pick('hat'),ac=pick('acc');
  const A=G.avatar({name:S.name,skin:'#d9a066',hair:'#1b1b1b',tagColor:'#ffe08a',body:su.body,stripe:su.stripe,cap:ha.cap||null});
  if(ha.helm){A.head.add(at(G.mesh(new THREE.SphereGeometry(.215,20,12,0,Math.PI*2,0,Math.PI/2),G.mat(ha.helm,{roughness:.35,metalness:ha.id==='h4'?.6:.05})),0,.12,0));A.head.add(at(cyl(.27,.27,.02,ha.helm),0,.13,.04));}
  if(ac.id==='a1')A.torso.add(at(box(.4,.46,.16,'#e67e22'),0,.02,-.22),at(box(.3,.14,.05,'#b85f12'),0,-.08,-.31));
  if(ac.id==='a2'){A.torso.add(at(box(.56,.09,.31,'#5a3d1a'),0,-.27,0));[-.2,.22].forEach((x,i)=>A.torso.add(at(box(.1,.16,.06,i?'#c8cdd2':'#d62828',{metalness:i?.8:0}),x,-.33,.17)));}
  if(ac.id==='a3'){[-.12,.12].forEach(x=>{A.torso.add(at(cyl(.08,.08,.44,'#c9d1d8',{metalness:.7}),x,.02,-.22));const f=at(G.mesh(new THREE.ConeGeometry(.07,.22,10),G.mat('#ff7a00',{emissive:'#ff5a00',emissiveIntensity:2})),x,-.32,-.22);f.rotation.x=Math.PI;A.torso.add(f);});}
  scene.add(A.root);G.player=A;if(had&&G.apd)G.apd(A);return A;};
const tr=[];let trT=0,trI=0,lastP=null;
G.updaters.add(dt=>{const A=G.player;if(!A)return;const t=pick('trail');for(const m of tr){if(m.userData.l>0){m.userData.l-=dt*1.7;m.material.opacity=Math.max(0,m.userData.l);m.position.y+=dt*.5;m.rotation.y+=dt*4;if(m.userData.l<=0)m.visible=false;}}
  if(!t.c){lastP=null;return;}const p=G.P.pos;if(!lastP)lastP=p.clone();trT-=dt;const moved=Math.hypot(p.x-lastP.x,p.z-lastP.z);
  if(trT<=0&&moved>.12){trT=.07;lastP.copy(p);let m=tr.find(x=>x.userData.l<=0);if(!m){if(tr.length>=28)return;m=new THREE.Mesh(new THREE.OctahedronGeometry(.1),new THREE.MeshBasicMaterial({transparent:true,depthWrite:false}));m.userData.l=0;scene.add(m);tr.push(m);}
    m.material.color.copy(G.col(t.c[trI++%t.c.length]));m.position.set(p.x+G.rand(-.2,.2),p.y+.12,p.z+G.rand(-.2,.2));m.userData.l=1;m.visible=true;}});
/* ---------- perluasan pabrik ---------- */
const lbl=(t,w,h,bg,fg)=>G.labelPlane(t,w,h,{bg:bg||'#1d3557',fg:fg||'#fff',fs:90});
const BLD=[{id:'b1',ic:'🏷️',n:'Gerbang & papan nama pabrik',p:400,inc:30,d:'Namamu terpampang di gerbang depan. Pabrik yang mudah dikenali lebih dipercaya pelanggan.',cam:[0,5,24,0,3,14],mk:()=>{const g=new THREE.Group();[-6.5,6.5].forEach(x=>{g.add(at(box(.7,4.4,.7,'#3d6fa8'),x,2.2,14.4));G.addColBox(x,14.4,.7,.7);});g.add(at(box(13.7,1.1,.5,'#1d3557'),0,4.6,14.4));
    [1,-1].forEach(s=>{const l=G.labelPlane(['PT TOI ELEKTRONIKA','Manajer: '+(S.name||'-')],9,.95,{bg:'#1d3557',fg:'#f3b52f',fs:110});l.position.set(0,4.6,14.4+s*.26);if(s<0)l.rotation.y=Math.PI;g.add(l);});return g;}},
 {id:'b2',ic:'🌳',n:'Taman pabrik',p:500,inc:40,d:'Ruang hijau untuk beristirahat. Pekerja yang segar bekerja lebih teliti.',cam:[4,7,16.5,4,1,26],mk:()=>{const g=new THREE.Group();const b=new THREE.Mesh(new THREE.PlaneGeometry(8,5.5),new THREE.MeshStandardMaterial({color:G.col('#3f9a3f'),roughness:1}));b.rotation.x=-Math.PI/2;b.position.set(4,.02,26);g.add(b);
    const w=new THREE.Mesh(new THREE.CircleGeometry(1.1,24),new THREE.MeshStandardMaterial({color:G.col('#5fb4ff'),roughness:.1}));w.rotation.x=-Math.PI/2;w.position.set(5.5,.04,26.5);g.add(w);
    [[1.2,24.6],[1.5,27.6],[7.2,24.6]].forEach(([x,z])=>{g.add(at(box(.3,1.4,.3,'#7a5230'),x,.7,z),at(box(1.5,1.2,1.5,'#3f8f3a'),x,1.9,z),at(box(1,.8,1,'#4caa45'),x,2.8,z));});
    g.add(at(box(1.6,.1,.5,'#8a6d4a'),3.4,.5,24.4),at(box(1.6,.5,.08,'#8a6d4a'),3.4,.8,24.2),at(box(.1,.5,.4,'#555'),2.7,.25,24.4),at(box(.1,.5,.4,'#555'),4.1,.25,24.4));
    ['#e04848','#f3b52f','#ff8ad1','#ffffff','#e04848','#f3b52f'].forEach((c,i)=>g.add(at(sph(.14,c),2.2+i*.5,.18,28.3)));return g;}},
 {id:'b3',ic:'🍜',n:'Kantin pekerja',p:800,inc:70,d:'Dikelola UMKM warga sekitar. Pekerja makan bergizi tanpa keluar pabrik.',cam:[-11,5,15.5,-11,1.5,26],mk:()=>{const g=new THREE.Group();g.add(at(box(7,3,4,'#f3e6c8'),-11,1.5,27),at(box(7.6,.3,4.8,'#c62828'),-11,3.15,27),at(box(7,.12,1.6,'#e67e22'),-11,2.5,24.3),at(box(2.4,1.6,.06,'#9fd4ff',{transparent:true,opacity:.6}),-12.5,1.5,24.97),at(box(1.1,2.1,.06,'#7a5230'),-9.2,1.05,24.97));
    const l=lbl('KANTIN PEKERJA',4,.6,'#c62828');l.rotation.y=Math.PI;l.position.set(-11,2.85,24.96);g.add(l);[-12.6,-10.6].forEach(x=>g.add(at(cyl(.5,.5,.06,'#ffffff'),x,.75,23.6),at(cyl(.05,.05,.75,'#777'),x,.38,23.6)));G.addColBox(-11,27,7,4);return g;}},
 {id:'b4',ic:'🕌',n:'Mushola',p:800,inc:60,d:'Tempat ibadah yang layak. Pekerja merasa dihargai dan betah bekerja.',cam:[-27,5,15,-27,2,26],mk:()=>{const g=new THREE.Group();g.add(at(box(5,3,5,'#ffffff'),-27,1.5,26.5),at(box(5.4,.25,5.4,'#14904a'),-27,3.1,26.5));const d=G.mesh(new THREE.SphereGeometry(1.3,20,12,0,Math.PI*2,0,Math.PI/2),G.mat('#14904a',{metalness:.3,roughness:.4}));d.position.set(-27,3.2,26.5);g.add(d);g.add(at(cyl(.04,.04,.7,'#f3b52f',{metalness:.8}),-27,4.8,26.5),at(box(1.2,2.2,.06,'#14904a'),-27,1.1,23.97));
    const l=lbl('MUSHOLA',2.4,.5,'#14904a');l.rotation.y=Math.PI;l.position.set(-27,2.7,23.96);g.add(l);G.addColBox(-27,26.5,5,5);return g;}},
 {id:'b5',ic:'⚽',n:'Lapangan futsal',p:1200,inc:100,d:'Olahraga bersama membuat tim sehat dan kompak; absen sakit berkurang.',cam:[15,8,16.5,15,0,26.5],mk:()=>{const g=new THREE.Group();const c=G.cnv(512,300),x=c.getContext('2d');x.fillStyle='#2f9e5b';x.fillRect(0,0,512,300);x.strokeStyle='#fff';x.lineWidth=6;x.strokeRect(10,10,492,280);x.beginPath();x.moveTo(256,10);x.lineTo(256,290);x.stroke();x.beginPath();x.arc(256,150,46,0,7);x.stroke();x.strokeRect(10,95,60,110);x.strokeRect(442,95,60,110);
    const f=new THREE.Mesh(new THREE.PlaneGeometry(9.5,5.5),new THREE.MeshStandardMaterial({map:G.tex(c),roughness:.9}));f.rotation.x=-Math.PI/2;f.position.set(15,.03,26.5);g.add(f);[10.4,19.6].forEach(px=>{g.add(at(box(.08,1.2,.08,'#fff'),px,.6,25.5),at(box(.08,1.2,.08,'#fff'),px,.6,27.5),at(box(.08,.08,2.08,'#fff'),px,1.2,26.5));});
    const b=at(sph(.18,'#ffffff'),15,.2,26.5);g.add(b);G.updaters.add((dt,t)=>{b.position.x=15+Math.sin(t*.8)*3;b.position.z=26.5+Math.cos(t*1.3)*1.5;b.position.y=.2+Math.abs(Math.sin(t*3))*.3;});return g;}},
 {id:'b6',ic:'🏪',n:'Toko pabrik (factory outlet)',p:1500,inc:140,d:'Menjual lampu TerangTOI langsung ke warga: pemasukan tambahan setiap hari.',cam:[28,5,15.5,28,1.5,26],mk:()=>{const g=new THREE.Group();g.add(at(box(6,3.2,4,'#e9eef2'),28,1.6,27),at(box(6.4,.3,4.4,'#1f8bff'),28,3.35,27),at(box(4.2,2,.06,'#9fd4ff',{transparent:true,opacity:.55}),27.4,1.4,24.97),at(box(1,2.1,.06,'#1d3557'),30.3,1.05,24.97));
    const l=G.labelPlane(['TOKO PABRIK','TerangTOI'],4.4,.9,{bg:'#1f8bff',fg:'#fff',fs:100});l.rotation.y=Math.PI;l.position.set(28,3,24.96);g.add(l);for(let i=0;i<4;i++)g.add(at(box(.5,.18,.3,'#fffbe0',{emissive:'#fffbe0',emissiveIntensity:.8}),26+i*.9,1,25.3));G.addColBox(28,27,6,4);return g;}}];
const place=(B,anim)=>{const g=B.mk();scene.add(g);if(anim)G.drop(g,9);return g;};
BLD.forEach(B=>{if(S.built[B.id])place(B,false);});
G.income=()=>BLD.reduce((a,B)=>a+(S.built[B.id]?B.inc:0),0);
G.payIncome=()=>{const v=G.income();if(v>0)G.addCoins(v,'Pendapatan fasilitas pabrik');};
/* ---------- kode simpan ---------- */
const enc=()=>'TOI1.'+btoa(unescape(encodeURIComponent(JSON.stringify(G.save))));
const dec=c=>{const o=JSON.parse(decodeURIComponent(escape(atob(String(c).trim().replace(/^TOI1\./,'')))));if(!o||typeof o.coins!=='number'||typeof o.tp!=='object')throw 0;return o;};
/* ---------- UI ---------- */
let tab='avatar';
G.openShop=()=>{if(G.held){toast('Letakkan dulu barang yang kamu bawa');return;}modal(b=>{b.appendChild(el('div','kick','Koperasi Pabrik'));b.appendChild(el('h2','',`Saldo: ${G.fmt(S.coins)} ¢`));
  b.appendChild(row(btn('🧑‍🏭 Avatar',tab==='avatar'?'y':'gr',()=>{tab='avatar';G.openShop();}),btn('🏗️ Perluasan pabrik',tab==='pabrik'?'y':'gr',()=>{tab='pabrik';G.openShop();}),btn('💾 Kode simpan',tab==='simpan'?'y':'gr',()=>{tab='simpan';G.openShop();})));
  if(tab==='avatar'){b.appendChild(el('p','','Hiasan avatar hanya untuk gaya — tidak memengaruhi bintang.'));Object.keys(COS).forEach(k=>{b.appendChild(el('div','mat',`<span>${COS[k].t}</span>`));const g=el('div','cards');COS[k].L.forEach(it=>{const own=S.own[it.id],on=S.eq[k]===it.id;
      const c=el('button','ocard'+(on?' ok':''),`<span>${it.n}<small>${on?'✓ Dipakai':own?'Milikmu — ketuk untuk memakai':'🪙 '+it.p+' ¢'}</small></span>`);c.onclick=()=>{if(!own){if(S.coins<it.p){G.sfx('bad');toast(`Koin belum cukup (kurang ${G.fmt(it.p-S.coins)} ¢)`,'bad');return;}G.addCoins(-it.p,it.n);S.own[it.id]=true;}S.eq[k]=it.id;G.persist();G.sfx('ok');if(G.player)G.makePlayer();G.openShop();};g.appendChild(c);});b.appendChild(g);});}
  if(tab==='pabrik'){b.appendChild(el('div','fb info',`Setiap fasilitas menambah <b>pendapatan</b> yang dibayarkan <b>setiap kali kamu menyelesaikan satu TP</b>. Pendapatan fasilitasmu sekarang: <b>+${G.income()} ¢ per TP</b>.`));const g=el('div','cards');g.style.gridTemplateColumns='repeat(auto-fill,minmax(210px,1fr))';
    BLD.forEach(B=>{const own=S.built[B.id];const c=el('button','ocard'+(own?' ok':''),`<span class="ic">${B.ic}</span><span>${B.n}<small>${B.d}</small><small style="color:#ffe08a;font-weight:700">${own?'✓ Sudah dibangun':'🪙 '+G.fmt(B.p)+' ¢'} · +${B.inc} ¢ per TP</small></span>`);
      c.onclick=async()=>{if(own){toast('Fasilitas ini sudah dibangun');return;}if(S.coins<B.p){G.sfx('bad');toast(`Koin belum cukup (kurang ${G.fmt(B.p-S.coins)} ¢)`,'bad');return;}G.addCoins(-B.p,B.n);S.built[B.id]=true;G.persist();closeModal();place(B,true);
        G.cinema={pos:new THREE.Vector3(B.cam[0],B.cam[1],B.cam[2]),look:new THREE.Vector3(B.cam[3],B.cam[4],B.cam[5])};G.confetti();await G.wait(3.6);G.cinema=null;toast(`${B.n} selesai dibangun · +${B.inc} ¢ per TP`,'gold');};g.appendChild(c);});b.appendChild(g);
    b.appendChild(el('p','','<small style="color:#9fb0bf">Fasilitas dibangun di halaman depan pabrik, di seberang jalan. Keluar lewat pintu depan untuk melihatnya.</small>'));}
  if(tab==='simpan'){b.appendChild(el('p','','Koin, bintang, dan barangmu tersimpan otomatis di <b>perangkat dan browser ini</b>. Jika berganti HP atau browser, gunakan <b>kode simpan</b>: salin di perangkat lama, lalu tempel di perangkat baru.'));
    b.appendChild(row(btn('📋 Salin kode simpan','y',()=>{const c=enc();const ok=()=>toast('Kode simpan tersalin ✓ Simpan di catatan HP-mu','ok');const fb=()=>{inp.value=c;inp.select();try{document.execCommand('copy');ok();}catch(e){toast('Salin manual dari kotak di bawah');}};try{navigator.clipboard.writeText(c).then(ok,fb);}catch(e){fb();}})));
    const inp=el('input','nm');inp.placeholder='Tempel kode simpan di sini (TOI1.…)';b.appendChild(inp);
    b.appendChild(row(btn('⬇️ Muat kode','gr',()=>{try{const o=dec(inp.value);Object.keys(G.save).forEach(k=>delete G.save[k]);Object.assign(G.save,o);G.persist();toast('Data dimuat ✓','ok');setTimeout(()=>location.reload(),700);}catch(e){G.sfx('bad');toast('Kode tidak valid — periksa lagi','bad');}})));}
  b.appendChild(row(btn('Tutup','gr',closeModal)));});};
})();
