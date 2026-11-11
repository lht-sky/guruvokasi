/* Pneumatik Tycoon — Toko Bengkel: kosmetik avatar, perluasan bengkel (menambah pendapatan), kode simpan */
(function(){
'use strict';
const {scene,box,cyl,sph,at,grp,el,btn,row,modal,closeModal,toast}=G;
const S=G.save;S.own=S.own||{};S.eq=S.eq||{};S.built=S.built||{};
const COS={suit:{t:'👕 Wearpack',L:[{id:'s0',n:'Wearpack TOI navy',p:0,body:'#1f3a68',stripe:'#ffd23f'},{id:'s1',n:'Abu-abu baja',p:150,body:'#5b6670',stripe:'#ff8a1f'},{id:'s2',n:'Merah marun',p:200,body:'#7a1f2b',stripe:'#ffd23f'},{id:'s3',n:'Hijau teknisi',p:200,body:'#1f6b45',stripe:'#e8eef2'},{id:'s4',n:'Edisi Kontraktor hitam-emas',p:600,body:'#15181d',stripe:'#f3b52f'}]},
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
/* ---------- perluasan bengkel ---------- */
const W=G.W,lp=(t,w,h,bg,fg,fs)=>G.labelPlane(t,w,h,{bg:bg||'#1d3557',fg:fg||'#fff',fs:fs||60});
const BLD=[{id:'b1',ic:'🧵',n:'Hose reel dinding',p:300,inc:20,d:'Selang tergulung rapi di dinding: tidak ada lagi selang melintang di lantai, pekerjaan lebih cepat.',cam:[8.4,2.3,-3.6,9.2,1.5,-7.8],mk:()=>{const g=new THREE.Group();g.position.set(9.2,1.75,-7.72);
    g.add(at(box(.34,.5,.08,'#2b3036'),0,0,-.2),at(box(.08,.08,.3,'#2b3036'),0,0,-.08));[-.07,.07].forEach(z=>g.add(at(W.cz(.3,.02,'#f3b52f',{metalness:.3},28),0,0,z+.08)));g.add(at(W.cz(.21,.12,'#1f8bff',{roughness:.5},24),0,0,.08),at(W.cz(.05,.2,'#2b3036',null,12),0,0,.08));
    g.add(W.tube([[.2,-.1,.08],[.3,-.5,.1],[.32,-1,.12],[.3,-1.25,.14]],.016,'#1f8bff',{roughness:.5},30),at(cyl(.022,.03,.12,'#c9d1d8',{metalness:.8},10),.3,-1.3,.14));
    g.add(at(lp('HOSE REEL',.5,.12,'#f3b52f','#1a1300'),0,.42,-.15));return g;}},
 {id:'b2',ic:'❄️',n:'Air dryer (pengering udara)',p:600,inc:50,d:'Mendinginkan udara supaya uap air mengembun dan terbuang sebelum masuk pipa: alat pneumatik lebih awet.',cam:[-9.4,2.3,-2.4,-6.7,.7,-3],mk:()=>{const g=new THREE.Group();g.position.set(-6.72,0,-3);
    g.add(at(box(.6,1,.55,'#e9edf0',{roughness:.5,metalness:.2}),0,.56,0),at(box(.62,.12,.57,'#1f8bff'),0,.98,0));[-.2,.2].forEach(x=>[-.2,.2].forEach(z=>g.add(at(cyl(.035,.035,.06,'#111'),x,.03,z))));
    for(let i=0;i<7;i++)g.add(at(box(.012,.3,.4,'#2b3036'),-.305,.32+0*i,-.18+i*.06));const ga=W.gauge(.13,8,10);ga.rotation.y=-Math.PI/2;ga.position.set(-.31,.78,.12);g.add(ga);
    const l=lp(['AIR DRYER','titik embun 3 °C'],.36,.13,'#1d3557','#fff',40);l.rotation.y=-Math.PI/2;l.position.set(-.305,.78,-.1);g.add(l);
    g.add(at(cyl(.02,.02,.2,'#2f6fb5',{metalness:.5},10),-.15,1.14,0),at(cyl(.02,.02,.2,'#2f6fb5',{metalness:.5},10),.15,1.14,0));G.addColBox(-6.72,-3,.7,.65);return g;}},
 {id:'b3',ic:'🛢️',n:'Tangki receiver tambahan 300 L',p:900,inc:80,d:'Cadangan udara lebih besar: tekanan lebih stabil dan kompresor lebih jarang hidup-mati.',cam:[-9.6,2.4,-3.2,-6.8,.9,-5.7],mk:()=>{const g=new THREE.Group();g.position.set(-6.75,0,-5.7);const m={roughness:.32,metalness:.25};
    g.add(at(cyl(.32,.32,1.25,'#2f6fb5',m,28),0,.95,0));[[1.575,1],[.325,-1]].forEach(q=>{const e=at(G.mesh(new THREE.SphereGeometry(.32,24,12,0,Math.PI*2,0,Math.PI/2),G.mat('#2f6fb5',m)),0,q[0],0);e.scale.y=.5*q[1];g.add(e);});
    for(let i=0;i<3;i++)g.add(at(box(.06,.3,.06,'#2b3036'),Math.cos(i*2.09)*.26,.15,Math.sin(i*2.09)*.26));
    const ga=W.gauge(.14,8,10);ga.rotation.y=-Math.PI/2;ga.position.set(-.34,1.25,0);g.add(ga);g.add(at(cyl(.014,.014,.1,'#b89458',{metalness:.8},8),0,.12,0),at(box(.012,.012,.08,'#d62828'),0,.07,.03));
    const l=lp(['TANGKI UDARA','300 L · maks. 10 bar'],.4,.14,'#f2efe6','#111',40);l.rotation.y=-Math.PI/2;l.position.set(-.325,.85,0);g.add(l);G.addColBox(-6.75,-5.7,.7,.7);return g;}},
 {id:'b4',ic:'🏗️',n:'Mesin press kedua',p:1200,inc:120,d:'Dua mesin berarti dua kali produksi — asalkan pasokan udara dan tekanannya cukup.',cam:[9.6,2.6,1.4,9.6,1.4,-3.2],mk:()=>{const g=W.press.clone(true);g.position.set(9.6,0,-3.2);G.addColBox(9.6,-3.2,1.5,1);return g;}},
 {id:'b5',ic:'🌀',n:'Kompresor screw 10 HP',p:2000,inc:200,d:'Tahan bekerja terus-menerus, lebih senyap, aliran udara stabil: bengkel siap menerima order besar.',cam:[-9.4,2.5,-1.9,-12.1,.9,-3.4],mk:()=>{const g=new THREE.Group();g.position.set(-12.15,0,-3.45);
    g.add(at(box(1.2,1.5,.9,'#e9edf0',{roughness:.5,metalness:.2}),0,.78,0),at(box(1.22,.16,.92,'#1f8bff'),0,1.42,0),at(box(1.22,.06,.92,'#2b3036'),0,.03,0));
    for(let i=0;i<8;i++)g.add(at(box(.5,.02,.012,'#2b3036'),-.25,.4+i*.045,.456));g.add(at(box(.34,.24,.02,'#10161c'),.3,1.05,.455),at(G.sph(.025,'#22b866',{emissive:'#22b866',emissiveIntensity:1.2}),.2,.86,.46),at(cyl(.04,.04,.03,'#d62828').rotateX(Math.PI/2),.4,.86,.46));
    g.add(at(lp(['KOMPRESOR SCREW','10 HP · 8 bar'],.5,.16,'#1d3557','#fff',44),-.25,1.05,.456),at(lp('8.0 bar',.26,.09,'#10161c','#7ee2a5',50),.3,1.08,.467));
    g.add(at(cyl(.03,.03,.5,'#2f6fb5',{metalness:.5},12),.4,1.75,-.2));G.addColBox(-12.15,-3.45,1.3,1);return g;}}];
const place=(B,anim)=>{const g=B.mk();scene.add(g);if(anim)G.drop(g,9);return g;};
BLD.forEach(B=>{if(S.built[B.id])place(B,false);});
G.income=()=>BLD.reduce((a,B)=>a+(S.built[B.id]?B.inc:0),0);
G.payIncome=()=>{const v=G.income();if(v>0)G.addCoins(v,'Pendapatan fasilitas bengkel');};
/* ---------- kode simpan ---------- */
const enc=()=>'PNT1.'+btoa(unescape(encodeURIComponent(JSON.stringify(G.save))));
const dec=c=>{const o=JSON.parse(decodeURIComponent(escape(atob(String(c).trim().replace(/^PNT1\./,'')))));if(!o||typeof o.coins!=='number'||typeof o.tp!=='object')throw 0;return o;};
/* ---------- UI ---------- */
let tab='avatar';
G.openShop=()=>{modal(b=>{b.appendChild(el('div','kick','Toko Bengkel'));b.appendChild(el('h2','',`Saldo: ${G.fmt(S.coins)} ¢`));
  b.appendChild(row(btn('🧑‍🏭 Avatar',tab==='avatar'?'y':'gr',()=>{tab='avatar';G.openShop();}),btn('🏗️ Perluasan bengkel',tab==='pabrik'?'y':'gr',()=>{tab='pabrik';G.openShop();}),btn('💾 Kode simpan',tab==='simpan'?'y':'gr',()=>{tab='simpan';G.openShop();})));
  if(tab==='avatar'){b.appendChild(el('p','','Hiasan avatar hanya untuk gaya — tidak memengaruhi bintang.'));Object.keys(COS).forEach(k=>{b.appendChild(el('div','mat',`<span>${COS[k].t}</span>`));const g=el('div','cards');COS[k].L.forEach(it=>{const own=S.own[it.id],on=S.eq[k]===it.id;
      const c=el('button','ocard'+(on?' ok':''),`<span>${it.n}<small>${on?'✓ Dipakai':own?'Milikmu — ketuk untuk memakai':'🪙 '+it.p+' ¢'}</small></span>`);c.onclick=()=>{if(!own){if(S.coins<it.p){G.sfx('bad');toast(`Koin belum cukup (kurang ${G.fmt(it.p-S.coins)} ¢)`,'bad');return;}G.addCoins(-it.p,it.n);S.own[it.id]=true;}S.eq[k]=it.id;G.persist();G.sfx('ok');if(G.player)G.makePlayer();G.openShop();};g.appendChild(c);});b.appendChild(g);});}
  if(tab==='pabrik'){b.appendChild(el('div','fb info',`Setiap fasilitas menambah <b>pendapatan</b> yang dibayarkan <b>setiap kali kamu menyelesaikan satu level</b>. Pendapatan fasilitasmu sekarang: <b>+${G.income()} ¢ per level</b>.`));const g=el('div','cards');g.style.gridTemplateColumns='repeat(auto-fill,minmax(210px,1fr))';
    BLD.forEach(B=>{const own=S.built[B.id];const c=el('button','ocard'+(own?' ok':''),`<span class="ic">${B.ic}</span><span>${B.n}<small>${B.d}</small><small style="color:#ffe08a;font-weight:700">${own?'✓ Sudah dibangun':'🪙 '+G.fmt(B.p)+' ¢'} · +${B.inc} ¢ per level</small></span>`);
      c.onclick=async()=>{if(own){toast('Fasilitas ini sudah dibangun');return;}if(S.coins<B.p){G.sfx('bad');toast(`Koin belum cukup (kurang ${G.fmt(B.p-S.coins)} ¢)`,'bad');return;}G.addCoins(-B.p,B.n);S.built[B.id]=true;G.persist();closeModal();place(B,true);
        G.cinema={pos:new THREE.Vector3(B.cam[0],B.cam[1],B.cam[2]),look:new THREE.Vector3(B.cam[3],B.cam[4],B.cam[5])};G.confetti();await G.wait(3.6);G.cinema=null;toast(`${B.n} terpasang · +${B.inc} ¢ per level`,'gold');};g.appendChild(c);});b.appendChild(g);
    b.appendChild(el('p','','<small style="color:#9fb0bf">Fasilitas dipasang di dalam bengkel: ruang kompresor dan area mesin press.</small>'));}
  if(tab==='simpan'){b.appendChild(el('p','','Koin, bintang, dan barangmu tersimpan otomatis di <b>perangkat dan browser ini</b>. Jika berganti HP atau browser, gunakan <b>kode simpan</b>: salin di perangkat lama, lalu tempel di perangkat baru.'));
    b.appendChild(row(btn('📋 Salin kode simpan','y',()=>{const c=enc();const ok=()=>toast('Kode simpan tersalin ✓ Simpan di catatan HP-mu','ok');const fb=()=>{inp.value=c;inp.select();try{document.execCommand('copy');ok();}catch(e){toast('Salin manual dari kotak di bawah');}};try{navigator.clipboard.writeText(c).then(ok,fb);}catch(e){fb();}})));
    const inp=el('input','nm');inp.placeholder='Tempel kode simpan di sini (PNT1.…)';b.appendChild(inp);
    b.appendChild(row(btn('⬇️ Muat kode','gr',()=>{try{const o=dec(inp.value);Object.keys(G.save).forEach(k=>delete G.save[k]);Object.assign(G.save,o);G.persist();toast('Data dimuat ✓','ok');setTimeout(()=>location.reload(),700);}catch(e){G.sfx('bad');toast('Kode tidak valid — periksa lagi','bad');}})));}
  b.appendChild(row(btn('Tutup','gr',closeModal)));});};
})();
