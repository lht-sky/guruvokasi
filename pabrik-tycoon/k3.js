/* Pabrik Elektronik Tycoon — modul K3: rambu, api, APD pada avatar, membawa barang, Pos K3, lisensi */
(function(){
'use strict';
const {scene,box,cyl,sph,at,grp,mat,mesh,cnv,rr,tex,el,W}=G;const rand=G.rand;
function picto(x,k,cx,cy,s,col){x.save();x.translate(cx,cy);x.scale(s,s);x.fillStyle=col;x.strokeStyle=col;x.lineCap='round';x.lineJoin='round';
  if(k==='bolt'){x.beginPath();x.moveTo(8,-46);x.lineTo(-20,6);x.lineTo(2,6);x.lineTo(-10,46);x.lineTo(22,-8);x.lineTo(0,-8);x.closePath();x.fill();}
  else if(k==='goggles'){x.lineWidth=7;rr(x,-40,-16,36,30,10);x.fill();rr(x,4,-16,36,30,10);x.fill();x.fillRect(-6,-6,12,8);x.beginPath();x.moveTo(-40,-2);x.lineTo(-50,-8);x.moveTo(40,-2);x.lineTo(50,-8);x.stroke();
    x.beginPath();x.arc(0,-34,14,0,7);x.fill();x.fillRect(-26,30,52,24);}
  else if(k==='flame'){x.beginPath();x.moveTo(0,-46);x.bezierCurveTo(30,-14,30,10,24,26);x.bezierCurveTo(18,44,-18,44,-24,26);x.bezierCurveTo(-30,8,-16,-6,-10,-20);x.bezierCurveTo(-6,-6,4,-4,6,-12);x.bezierCurveTo(10,-22,6,-34,0,-46);x.fill();}
  else if(k==='exit'){x.lineWidth=9;x.strokeRect(14,-44,32,88);x.beginPath();x.arc(-14,-34,8,0,7);x.fill();x.beginPath();x.moveTo(-16,-22);x.lineTo(-22,6);x.lineTo(-8,22);x.lineTo(-4,42);x.moveTo(-22,6);x.lineTo(-38,24);x.lineTo(-44,40);x.moveTo(-18,-16);x.lineTo(-2,-6);x.moveTo(-18,-16);x.lineTo(-34,-4);x.stroke();
    x.lineWidth=6;x.beginPath();x.moveTo(-48,-44);x.lineTo(-22,-44);x.moveTo(-30,-52);x.lineTo(-22,-44);x.lineTo(-30,-36);x.stroke();}
  else if(k==='cross'){x.fillRect(-12,-40,24,80);x.fillRect(-40,-12,80,24);}
  else if(k==='ext'){rr(x,-14,-24,28,66,10);x.fill();x.fillRect(-6,-36,12,14);x.lineWidth=6;x.beginPath();x.moveTo(-4,-38);x.lineTo(-24,-44);x.moveTo(6,-30);x.quadraticCurveTo(30,-30,26,6);x.stroke();
    x.beginPath();x.moveTo(30,-40);x.lineTo(42,-52);x.lineTo(40,-36);x.lineTo(50,-44);x.lineTo(44,-26);x.closePath();x.fill();}
  else if(k==='ear'){x.lineWidth=9;x.beginPath();x.arc(0,4,32,Math.PI*1.05,Math.PI*1.95);x.stroke();rr(x,-44,0,20,34,8);x.fill();rr(x,24,0,20,34,8);x.fill();x.beginPath();x.arc(0,-6,16,0,7);x.fill();}
  else if(k==='hand'){rr(x,-22,-6,44,46,12);x.fill();[-17,-6,5,16].forEach((fx,i)=>{rr(x,fx-5,-42+(i===0||i===3?8:0),10,44,5);x.fill();});x.save();x.rotate(-.7);rr(x,-34,4,10,28,5);x.fill();x.restore();}
  else if(k==='hot'){x.lineWidth=7;for(let i=-1;i<=1;i++){x.beginPath();x.moveTo(i*16,10);x.bezierCurveTo(i*16-10,-2,i*16+10,-14,i*16,-34);x.stroke();}x.fillRect(-36,22,72,12);}
  x.restore();}
function drawSign(type,p){const c=cnv(256,256),x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,256,256);
  if(type==='warn'){x.beginPath();x.moveTo(128,20);x.lineTo(240,222);x.lineTo(16,222);x.closePath();x.fillStyle='#111';x.fill();x.beginPath();x.moveTo(128,46);x.lineTo(216,206);x.lineTo(40,206);x.closePath();x.fillStyle='#ffd000';x.fill();picto(x,p,128,150,1,'#111');}
  else if(type==='must'){x.beginPath();x.arc(128,128,112,0,7);x.fillStyle='#1660b8';x.fill();picto(x,p,128,128,1.25,'#fff');}
  else if(type==='ban'){picto(x,p,128,128,1.15,'#111');x.lineWidth=22;x.strokeStyle='#d61f1f';x.beginPath();x.arc(128,128,100,0,7);x.stroke();x.beginPath();x.moveTo(57,57);x.lineTo(199,199);x.stroke();}
  else if(type==='safe'){rr(x,10,10,236,236,18);x.fillStyle='#14904a';x.fill();picto(x,p,128,128,1.4,'#fff');}
  else if(type==='fire'){rr(x,10,10,236,236,18);x.fillStyle='#d61f1f';x.fill();picto(x,p,128,128,1.5,'#fff');}
  return c;}
const SIGNS={
  tegangan:{t:'warn',p:'bolt',name:'Awas Tegangan Listrik Berbahaya',cat:'warn'},
  kacamata:{t:'must',p:'goggles',name:'Wajib Memakai Kacamata Pengaman',cat:'must'},
  api:{t:'ban',p:'flame',name:'Dilarang Ada Api Terbuka / Merokok',cat:'ban'},
  evakuasi:{t:'safe',p:'exit',name:'Pintu / Jalur Evakuasi Darurat',cat:'safe'},
  p3k:{t:'safe',p:'cross',name:'Kotak P3K',cat:'safe'},
  apar:{t:'fire',p:'ext',name:'Alat Pemadam Api Ringan (APAR)',cat:'fire'},
  earmuff:{t:'must',p:'ear',name:'Wajib Memakai Pelindung Telinga',cat:'must'},
  panas:{t:'warn',p:'hot',name:'Awas Permukaan Panas',cat:'warn'},
  sentuh:{t:'ban',p:'hand',name:'Dilarang Menyentuh',cat:'ban'}};
const SIGN_CAT={ban:{n:'LARANGAN',d:'Lingkaran bertepi merah dengan garis diagonal = sesuatu yang <b>tidak boleh</b> dilakukan.'},
  must:{n:'KEWAJIBAN',d:'Lingkaran biru dengan simbol putih = sesuatu yang <b>wajib</b> dilakukan/dipakai.'},
  warn:{n:'PERINGATAN',d:'Segitiga kuning bertepi hitam = <b>waspada</b>, ada sumber bahaya di dekatnya.'},
  safe:{n:'KONDISI AMAN',d:'Persegi hijau = <b>informasi keselamatan</b>: jalur evakuasi, P3K, titik kumpul.'},
  fire:{n:'PERALATAN KEBAKARAN',d:'Persegi merah = lokasi <b>alat pemadam</b> atau alarm kebakaran.'}};
const signCache={};function signCanvas(id){if(!signCache[id])signCache[id]=drawSign(SIGNS[id].t,SIGNS[id].p);return signCache[id];}
function makeFire(){const g=new THREE.Group();const fl=[];const cols=[0xff3d00,0xff7a00,0xffb300,0xffe066];
  for(let i=0;i<16;i++){const h=rand(.25,.7);const m=new THREE.Mesh(new THREE.ConeGeometry(rand(.09,.2),h*1.2,10),new THREE.MeshBasicMaterial({color:new THREE.Color(cols[i%4]).convertSRGBToLinear(),transparent:true,opacity:.92,depthWrite:false}));
    m.position.set(rand(-.3,.3),h/2,rand(-.08,.12));m.userData={h,ph:rand(0,6),x:m.position.x};g.add(m);fl.push(m);}
  const L=new THREE.PointLight(0xff7a1a,2.5,7);L.position.set(0,.5,.4);g.add(L);
  const sm=[];for(let i=0;i<12;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),new THREE.MeshStandardMaterial({color:0x111111,transparent:true,opacity:.5,depthWrite:false}));g.add(s);sm.push({s,ph:i/12});}
  g.userData.level=.35;
  g.userData.upd=(dt,t)=>{const lv=g.userData.level;fl.forEach(m=>{const k=lv*(.75+.3*Math.sin(t*11+m.userData.ph));m.scale.set(lv*.9+.1,Math.max(k,.001),lv*.9+.1);m.position.y=m.userData.h*k/2;m.visible=lv>.03;});
    L.intensity=lv*3*(.8+.25*Math.sin(t*23));sm.forEach(o=>{const k=(t*.35+o.ph)%1;o.s.position.set(Math.sin(k*7+o.ph*9)*.25,.4+k*2.4*Math.max(lv,.3),.1);o.s.scale.setScalar(.6+k*2.2);o.s.material.opacity=.45*(1-k)*Math.min(1,lv*1.6+.15);});};
  return g;}
G.SIGNS=SIGNS;G.SIGN_CAT=SIGN_CAT;G.signCanvas=signCanvas;G.makeFire=makeFire;
/* papan rambu berdiri */
G.signPost=(x,z,yaw,id)=>{const g=new THREE.Group();g.add(at(cyl(.035,.035,2.1,'#8f9aa4',{metalness:.6}),0,1.05,0));g.add(at(cyl(.22,.26,.06,'#3a4652'),0,.03,0));
  const qc=cnv(256,256),q=qc.getContext('2d');q.fillStyle='#e9eef2';q.fillRect(0,0,256,256);q.strokeStyle='#97a6b3';q.setLineDash([18,12]);q.lineWidth=10;q.strokeRect(14,14,228,228);q.fillStyle='#97a6b3';q.font='900 150px sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText('?',128,140);
  const m=new THREE.MeshBasicMaterial({map:tex(id?signCanvas(id):qc)});const p1=new THREE.Mesh(new THREE.PlaneGeometry(.72,.72),m);p1.position.set(0,2.2,.022);const p2=new THREE.Mesh(new THREE.PlaneGeometry(.72,.72),m);p2.rotation.y=Math.PI;p2.position.set(0,2.2,-.022);
  g.add(at(box(.76,.76,.04,'#ffffff'),0,2.2,0),p1,p2);g.position.set(x,0,z);g.rotation.y=yaw||0;scene.add(g);g.userData.set=k=>{m.map=tex(signCanvas(k));m.needsUpdate=true;g.scale.setScalar(.3);G.anim(.4,t=>g.scale.setScalar(.3+.7*t+Math.sin(t*Math.PI)*.15));};return g;};
/* APD pada avatar */
G.apd=A=>{const P={};const h=A.head;
  P.helm=grp(at(mesh(new THREE.SphereGeometry(.215,20,12,0,Math.PI*2,0,Math.PI/2),mat('#ffd000',{roughness:.4})),0,.12,0),at(cyl(.27,.27,.02,'#ffd000'),0,.13,.04));h.add(P.helm);
  P.kacamata=grp(at(box(.34,.09,.03,'#1d2a33',{transparent:true,opacity:.8,roughness:.1}),0,.03,.2),at(box(.36,.02,.02,'#111'),0,.08,.2));h.add(P.kacamata);
  P.masker=grp(at(box(.24,.13,.05,'#f5f5f5'),0,-.09,.19));h.add(P.masker);
  P.earmuff=grp(at(cyl(.075,.075,.06,'#d62828').rotateZ(Math.PI/2),-.215,0,0),at(cyl(.075,.075,.06,'#d62828').rotateZ(Math.PI/2),.215,0,0),at(box(.44,.03,.05,'#222'),0,.2,0));h.add(P.earmuff);
  P.sarung=grp();[A.armL,A.armR].forEach(a=>{const g=at(box(.23,.2,.25,'#ff7a00'),0,-.62,0);a.add(g);P.sarung.add(new THREE.Group());(P._g=P._g||[]).push(g);});
  const set=(k,on)=>{if(k==='sarung')P._g.forEach(g=>g.visible=on);else if(P[k])P[k].visible=on;};Object.keys(P).forEach(k=>k[0]!=='_'&&set(k,false));A.wear=set;A.strip=()=>['helm','kacamata','masker','earmuff','sarung'].forEach(k=>set(k,false));return A;};
/* membawa barang */
G.carry=obj=>{const A=G.player;if(G.held)return false;G.held=obj;obj.userData.home=obj.parent;A.root.add(obj);obj.position.set(0,1.2,.5);obj.rotation.set(0,0,0);A.busy=1;A.armL.rotation.x=A.armR.rotation.x=-1.25;G.sfx('tap');return true;};
G.uncarry=()=>{const A=G.player,o=G.held;if(!o)return null;A.root.remove(o);G.held=null;A.busy=0;A.armL.rotation.x=A.armR.rotation.x=0;return o;};
G.ring=(x,z,c)=>{const r=new THREE.Mesh(new THREE.RingGeometry(.42,.55,28),new THREE.MeshBasicMaterial({color:c||0xffd24a,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));r.rotation.x=-Math.PI/2;r.position.set(x,.03,z);scene.add(r);G.updaters.add((dt,t)=>r.scale.setScalar(1+Math.sin(t*4+x)*.12));return r;};
/* Pos K3 + Bu Tini */
G.k3Post=()=>{W.desk(11.5,10.9,Math.PI,1.8);G.addColBox(11.5,10.9,1.9,.9);const lk=grp(at(box(1.6,2,.5,'#1660b8',{roughness:.5}),0,1,0),at(box(.02,1.8,.02,'#0d3f7a'),0,1,.26));[-.4,.4].forEach(x=>{lk.add(at(mesh(new THREE.SphereGeometry(.16,14,8,0,Math.PI*2,0,Math.PI/2),mat('#ffd000')),x,2,0));});
  lk.add(G.labelPlane('LEMARI APD',1.2,.22,{bg:'#fff',fg:'#1660b8',fs:70}).translateY(1.6).translateZ(.26));lk.position.set(14.2,0,11.3);lk.rotation.y=Math.PI;scene.add(lk);G.addColBox(14.2,11.3,1.7,.6);
  const s=G.labelPlane('POS K3 · UTAMAKAN KESELAMATAN',3.4,.4,{bg:'#14904a',fg:'#fff',fs:80});s.rotation.y=Math.PI;at(s,12.4,2.7,11.7);scene.add(s);scene.add(at(box(.06,2.7,.06,'#555'),10.7,1.35,11.7));
  return G.npc({name:'Bu Tini · Ahli K3',skin:'#d9a066',hijab:'#14904a',cap:null},11.5,10.1,Math.PI);};
G.TINI='Bu Tini · Ahli K3';
G.license=n=>{const all=[];for(let i=1;i<=n;i++)all.push('tp'+i);const tot=all.reduce((a,k)=>a+(G.save.tp[k]?G.save.tp[k].stars:0),0),full=all.every(k=>G.save.tp[k]);
  return `<div class="jcard" style="text-align:center"><div class="jh">PT TOI ELEKTRONIKA · SMKS 2 TRIPLE J</div><h3>${full?(n>6?'🏅 LISENSI MANAJER PABRIK & K3':'🏅 LISENSI MANAJER PABRIK'):'🔰 LISENSI SEMENTARA'}</h3><div style="font:700 20px var(--game)">${G.esc(G.save.name)}</div><div style="font:600 14px/1.7 var(--game);margin:4px 0">${all.map((k,i)=>`TP${i+1} ${G.save.tp[k]?'⭐'.repeat(G.save.tp[k].stars):'—'}`).join(' · ')}</div><div style="font:700 17px var(--game)">Total ${tot}/${n*3} ⭐</div>${full?'':`<small>Selesaikan semua TP 1–${n} untuk memperoleh lisensi penuh.</small>`}</div>`;};
})();
