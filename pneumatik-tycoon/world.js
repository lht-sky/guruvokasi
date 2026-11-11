/* Pneumatik Tycoon — dunia: Bengkel Pneumatik PT TOI (ruang kompresor, jalur udara, unit F.R.L, mesin press), NPC */
(function(){
'use strict';
const {scene,mat,mesh,box,cyl,sph,at,grp,cnv,tex}=G;
const W=G.W={};
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const cx=(r,len,c,o,s)=>cyl(r,r,len,c,o,s).rotateZ(Math.PI/2);   // silinder sumbu X
const cz=(r,len,c,o,s)=>cyl(r,r,len,c,o,s).rotateX(Math.PI/2);   // silinder sumbu Z
function tube(pts,r,c,o,seg){const cv=new THREE.CatmullRomCurve3(pts.map(p=>V3(p[0],p[1],p[2])),false,'catmullrom',.35);
  return mesh(new THREE.TubeGeometry(cv,seg||Math.max(24,pts.length*14),r,10,false),mat(c,o));}
W.tube=tube;W.cx=cx;W.cz=cz;

/* ---------- tekstur ---------- */
function studTex(base,dark){const c=cnv(64,64),x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,64,64);
  x.fillStyle=dark;x.beginPath();x.arc(33,34,15,0,7);x.fill();x.fillStyle='rgba(255,255,255,.18)';x.beginPath();x.arc(30,30,13,0,7);x.fill();x.fillStyle=base;x.beginPath();x.arc(32,32,12,0,7);x.fill();
  x.strokeStyle='rgba(0,0,0,.08)';x.strokeRect(0,0,64,64);const t=tex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
const FW=26,FD=16;                                   // lantai bengkel 26 x 16 m
function floorTex(){const S=40,c=cnv(FW*S,FD*S),x=c.getContext('2d');const X=v=>(v+FW/2)*S,Z=v=>(v+FD/2)*S;
  x.fillStyle='#9aa3ab';x.fillRect(0,0,c.width,c.height);
  for(let i=0;i<9000;i++){x.fillStyle=`rgba(${Math.random()<.5?255:0},${Math.random()<.5?255:0},${Math.random()<.5?255:0},.03)`;x.fillRect(Math.random()*c.width,Math.random()*c.height,2,2);}
  x.strokeStyle='rgba(255,255,255,.08)';x.lineWidth=2;for(let i=0;i<=FW;i+=2){x.beginPath();x.moveTo(i*S,0);x.lineTo(i*S,c.height);x.stroke();}for(let j=0;j<=FD;j+=2){x.beginPath();x.moveTo(0,j*S);x.lineTo(c.width,j*S);x.stroke();}
  // ruang kompresor: lantai lebih gelap
  x.fillStyle='rgba(40,52,64,.22)';x.fillRect(X(-13),Z(-8),7*S,6.5*S);
  // jalur pejalan kaki hijau
  x.fillStyle='#3d9f63';x.fillRect(X(-13),Z(3.4),FW*S,1.6*S);x.fillStyle='#ffd23f';x.fillRect(X(-13),Z(3.4)-4,FW*S,6);x.fillRect(X(-13),Z(5)-2,FW*S,6);
  x.fillStyle='rgba(255,255,255,.85)';x.font=`700 ${S*.62}px Fredoka, sans-serif`;x.textAlign='center';x.textBaseline='middle';
  [-7,5].forEach(v=>x.fillText('JALUR PEJALAN KAKI',X(v),Z(4.2)));
  // cabang jalur ke pintu ruang kompresor
  x.fillStyle='#3d9f63';x.fillRect(X(-9.7),Z(-1.3),1.4*S,4.7*S);
  // zona mesin press (garis kuning)
  x.strokeStyle='#ffd23f';x.lineWidth=7;x.strokeRect(X(4.4),Z(-5),3.6*S,4.6*S);
  x.fillStyle='rgba(255,255,255,.9)';x.font=`700 ${S*.42}px Fredoka, sans-serif`;x.fillText('AREA MESIN PRESS',X(6.2),Z(-.75));
  // zona bebas halangan di depan panel listrik (arsir)
  const hatch=(x0,z0,w,h)=>{x.save();x.beginPath();x.rect(X(x0),Z(z0),w*S,h*S);x.clip();x.fillStyle='#ffd23f';x.fillRect(X(x0),Z(z0),w*S,h*S);x.fillStyle='#222';for(let i=-30;i<60;i++){x.beginPath();x.moveTo(X(x0)+i*24,Z(z0));x.lineTo(X(x0)+i*24+12,Z(z0));x.lineTo(X(x0)+i*24+12-h*S,Z(z0)+h*S);x.lineTo(X(x0)+i*24-h*S,Z(z0)+h*S);x.fill();}x.restore();};
  hatch(-12.4,-7.8,1.6,.9);
  // zona unit F.R.L
  x.strokeStyle='#ffffff';x.lineWidth=5;x.setLineDash([16,10]);x.strokeRect(X(-1.4),Z(-7.8),2.8*S,1.5*S);x.setLineDash([]);
  x.fillStyle='rgba(255,255,255,.9)';x.fillText('UNIT F.R.L',X(0),Z(-6));
  return tex(c);}
function asphaltTex(){const c=cnv(256,256),x=c.getContext('2d');x.fillStyle='#3b3f45';x.fillRect(0,0,256,256);for(let i=0;i<3000;i++){x.fillStyle=`rgba(255,255,255,${Math.random()*.06})`;x.fillRect(Math.random()*256,Math.random()*256,2,2);}const t=tex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}

/* ---------- halaman, jalan, pohon ---------- */
const grass=new THREE.Mesh(new THREE.PlaneGeometry(130,110),new THREE.MeshStandardMaterial({map:studTex('#5fae4b','#4f9a3e'),roughness:.95}));
grass.material.map.repeat.set(130/1.2,110/1.2);grass.rotation.x=-Math.PI/2;grass.position.set(0,-.02,5);grass.receiveShadow=true;scene.add(grass);
const asp=asphaltTex();
function road(x0,x1,z0,z1){const w=x1-x0,d=z1-z0;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshStandardMaterial({map:asp.clone(),roughness:.9}));m.material.map.needsUpdate=true;m.material.map.repeat.set(w/6,d/6);m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,-.005,(z0+z1)/2);m.receiveShadow=true;scene.add(m);return m;}
road(-65,65,16,22);road(-4,4,8,16);
for(let x=-60;x<64;x+=6){const l=new THREE.Mesh(new THREE.PlaneGeometry(3,.18),new THREE.MeshBasicMaterial({color:0xf0f0f0}));l.rotation.x=-Math.PI/2;l.position.set(x,0,19);scene.add(l);}
function tree(x,z,s){s=s||1;const g=grp(at(box(.4*s,2*s,.4*s,'#7a5230'),0,1*s,0),at(box(2.2*s,1.6*s,2.2*s,'#3f8f3a'),0,2.6*s,0),at(box(1.5*s,1.1*s,1.5*s,'#4caa45'),0,3.7*s,0));g.position.set(x,0,z);scene.add(g);}
[[-22,-4],[-26,8],[-20,26],[-9,27],[9,27],[22,26],[26,6],[23,-6],[-14,-14],[2,-15],[15,-14],[-32,18],[34,16]].forEach(([x,z],i)=>tree(x,z,.9+(i%3)*.2));

/* ---------- gedung bengkel ---------- */
const floor=new THREE.Mesh(new THREE.PlaneGeometry(FW,FD),new THREE.MeshStandardMaterial({map:floorTex(),roughness:.8}));floor.rotation.x=-Math.PI/2;floor.position.y=.005;floor.receiveShadow=true;scene.add(floor);
scene.add(at(box(FW+.6,.2,FD+.6,'#7d858c'),0,-.1,0));
const wallM=mat('#e4e8ec',{roughness:.9}),wallM2=mat('#5a6b7b',{roughness:.8});
W.walls={back:[],left:[],right:[]};
function wall(w,h,d,x,y,z,list,m){const b=mesh(new THREE.BoxGeometry(w,h,d),(m||wallM).clone());at(b,x,y,z);scene.add(b);list&&list.push(b);return b;}
const WH=5.6,HX=FW/2,HZ=FD/2;
wall(FW+.6,WH,.3,0,WH/2,-HZ-.15,W.walls.back);wall(FW+.6,1.2,.32,0,.6,-HZ-.13,W.walls.back,wallM2);
wall(.3,WH,FD+.3,-HX-.15,WH/2,0,W.walls.left);wall(.32,1.2,FD+.3,-HX-.13,.6,0,W.walls.left,wallM2);
wall(.3,WH,FD+.3,HX+.15,WH/2,0,W.walls.right);wall(.32,1.2,FD+.3,HX+.13,.6,0,W.walls.right,wallM2);
G.addCol(-HX-.3,HX+.3,-HZ-.3,-HZ);G.addCol(-HX-.3,-HX,-HZ-.3,HZ+.2);G.addCol(HX,HX+.3,-HZ-.3,HZ+.2);
[-13,-4.4,4.4,13].forEach(x=>{scene.add(at(box(.4,WH,.4,'#3d6fa8',{metalness:.4}),x,WH/2,HZ));G.addColBox(x,HZ,.4,.4);});
[-5.5,-1.8,1.8,5.5].forEach(z=>{scene.add(at(box(FW+.4,.32,.2,'#3d6fa8',{metalness:.4}),0,WH-.2,z));
  [-8.5,0,8.5].forEach(x=>{const lamp=grp(at(cyl(.02,.02,.9,'#333'),0,-.45,0),at(cyl(.15,.42,.24,'#dfe5ea',{metalness:.3}),0,-1,0),at(sph(.13,'#fffbe0',{emissive:'#fffbe0',emissiveIntensity:1}),0,-1.1,0));lamp.position.set(x,WH-.3,z);scene.add(lamp);});});
G.fadeWalls=p=>{const f=(list,on)=>list.forEach(w=>{const o=on?.18:1;if(w.material.opacity!==o){w.material.transparent=on;w.material.opacity=o;w.material.depthWrite=!on;}});
  f(W.walls.back,p.z<-HZ);f(W.walls.left,p.x<-HX);f(W.walls.right,p.x>HX);};
const sign=G.labelPlane('BENGKEL PNEUMATIK · PT TOI',9.4,1,{bg:'#1d3557',fg:'#f3b52f',fs:110});at(sign,3.2,4.7,-HZ+.02);scene.add(sign);
const logoP=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.1),new THREE.MeshBasicMaterial({transparent:true}));at(logoP,-2.4,4.7,-HZ+.03);scene.add(logoP);
const setLogo=()=>{logoP.material.map=G.logoTex;logoP.material.needsUpdate=true;};if(G.logoTex)setLogo();else G.onLogo.push(setLogo);
[9.6,11.4].forEach(x=>scene.add(at(new THREE.Mesh(new THREE.PlaneGeometry(1.5,1),new THREE.MeshBasicMaterial({color:G.col('#cfe9ff')})),x,4.7,-HZ+.02)));

/* ---------- perabot bantu ---------- */
function glassWall(x0,z0,x1,z1,h){h=h||2.8;const len=Math.hypot(x1-x0,z1-z0),ang=Math.atan2(z1-z0,x1-x0);const g=new THREE.Group();
  const gl=new THREE.Mesh(new THREE.BoxGeometry(len,h-.3,.04),new THREE.MeshStandardMaterial({color:G.col('#a8d4f0'),transparent:true,opacity:.24,roughness:.05,metalness:.1,depthWrite:false}));gl.position.y=.3+(h-.3)/2;g.add(gl);
  g.add(at(box(len,.3,.08,'#c6cdd3'),0,.15,0));g.add(at(box(len,.07,.08,'#8f9aa4',{metalness:.5}),0,h,0));
  const n=Math.max(1,Math.round(len/1.5));for(let i=0;i<=n;i++)g.add(at(box(.06,h,.08,'#8f9aa4',{metalness:.5}),-len/2+i*len/n,h/2,0));
  g.position.set((x0+x1)/2,0,(z0+z1)/2);g.rotation.y=-ang;scene.add(g);G.addCol(Math.min(x0,x1)-.06,Math.max(x0,x1)+.06,Math.min(z0,z1)-.06,Math.max(z0,z1)+.06);return g;}
function zoneSign(text,x,y,z,ry,w,bg){const s=G.labelPlane(text,w||3,.5,{bg:bg||'#1d3557',fg:'#fff',fs:80});at(s,x,y,z);s.rotation.y=ry||0;scene.add(s);
  const back=s.clone();back.rotation.y=(ry||0)+Math.PI;back.position.copy(s.position);scene.add(back);return s;}
function plate(text,w,h,x,y,z,bg,fg,ry){const s=G.labelPlane(text,w,h,{bg:bg||'#1d3557',fg:fg||'#fff',fs:64});at(s,x,y,z);if(ry)s.rotation.y=ry;scene.add(s);return s;}
W.zoneSign=zoneSign;W.plate=plate;

/* manometer: wajah kanvas yang bisa digambar ulang (skala bar) */
function gauge(size,val,max,band){max=max||10;const draw=(v)=>(x,w,h)=>{const c=w/2,ang=u=>(135+270*u)*Math.PI/180;x.clearRect(0,0,w,h);
    x.fillStyle='#15181d';x.beginPath();x.arc(c,c,c,0,7);x.fill();x.fillStyle='#fdfdfb';x.beginPath();x.arc(c,c,c*.9,0,7);x.fill();
    if(band){x.strokeStyle='#2fbf6f';x.lineWidth=c*.11;x.beginPath();x.arc(c,c,c*.76,ang(band[0]/max),ang(band[1]/max));x.stroke();}
    x.strokeStyle='#d62828';x.lineWidth=c*.11;x.beginPath();x.arc(c,c,c*.76,ang(.8),ang(1));x.stroke();
    x.strokeStyle='#111';for(let i=0;i<=max*2;i++){const a=ang(i/(max*2)),mj=i%2===0;x.lineWidth=mj?c*.035:c*.016;x.beginPath();x.moveTo(c+Math.cos(a)*c*(mj?.6:.68),c+Math.sin(a)*c*(mj?.6:.68));x.lineTo(c+Math.cos(a)*c*.82,c+Math.sin(a)*c*.82);x.stroke();}
    x.fillStyle='#111';x.font=`700 ${c*.2}px Arial`;x.textAlign='center';x.textBaseline='middle';for(let k=0;k<=max;k+=2){const a=ang(k/max);x.fillText(String(k),c+Math.cos(a)*c*.44,c+Math.sin(a)*c*.44);}
    x.font=`700 ${c*.17}px Arial`;x.fillText('bar',c,c*1.5);
    const a=ang(G.clamp(v/max,0,1));x.strokeStyle='#c1121f';x.lineWidth=c*.05;x.lineCap='round';x.beginPath();x.moveTo(c-Math.cos(a)*c*.14,c-Math.sin(a)*c*.14);x.lineTo(c+Math.cos(a)*c*.7,c+Math.sin(a)*c*.7);x.stroke();
    x.fillStyle='#111';x.beginPath();x.arc(c,c,c*.07,0,7);x.fill();};
  const g=new THREE.Group();g.add(cz(size/2*1.08,.05,'#22272c',{metalness:.5},28));const p=G.canvasPlane(size,size,draw(val),Math.round(256/size));p.material.transparent=true;p.position.z=.027;g.add(p);
  g.userData.set=v=>p.userData.redraw(draw(v));return g;}
W.gauge=gauge;
/* fitting push-in dengan cincin pelepas biru */
function fit(x,y,z,dir){const g=grp(at(cyl(.022,.022,.03,'#c9d1d8',{metalness:.8},6),0,.015,0),at(cyl(.017,.017,.05,'#c9d1d8',{metalness:.8},14),0,.055,0),at(cyl(.02,.02,.012,'#1f8bff',null,14),0,.085,0));
  g.position.set(x,y,z);if(dir==='x+')g.rotation.z=-Math.PI/2;if(dir==='x-')g.rotation.z=Math.PI/2;if(dir==='z+')g.rotation.x=Math.PI/2;if(dir==='down')g.rotation.z=Math.PI;return g;}
/* keran bola (ball valve) dengan tuas merah */
function ballValve(vertical){const g=grp(at(cyl(.035,.035,.1,'#b89458',{metalness:.8,roughness:.35},16),0,0,0),at(cyl(.042,.042,.03,'#b89458',{metalness:.8,roughness:.35},6),0,.05,0),at(cyl(.042,.042,.03,'#b89458',{metalness:.8,roughness:.35},6),0,-.05,0),at(cyl(.012,.012,.04,'#888',{metalness:.8},8).rotateX(Math.PI/2),0,0,.045));
  const lev=at(box(.03,.14,.014,'#d62828'),0,.04,.07);g.add(lev);g.userData.lever=lev;if(!vertical)g.rotation.z=Math.PI/2;return g;}

/* ====================================================================== */
/* RUANG KOMPRESOR (x -13..-6, z -8..-1,5)                                */
/* ====================================================================== */
glassWall(-13,-1.5,-9.7,-1.5);glassWall(-8.3,-1.5,-6,-1.5);glassWall(-6,-1.5,-6,-8);
zoneSign('RUANG KOMPRESOR',-9,3.15,-1.5,0,3.6,'#c62828');
scene.add(at(box(.08,2.8,.1,'#8f9aa4',{metalness:.5}),-9.7,1.4,-1.5));scene.add(at(box(.08,2.8,.1,'#8f9aa4',{metalness:.5}),-8.3,1.4,-1.5));
plate(['WAJIB DIPAKAI:','KACAMATA + PELINDUNG TELINGA'],1.9,.5,-7.2,1.75,-1.44,'#1660b8','#fff');
plate(['AWAS! MESIN BERPUTAR','DILARANG MEMAKAI SARUNG TANGAN'],1.9,.5,-7.2,1.15,-1.44,'#ffd000','#111');
W.doorCol=G.addCol(-9.7,-8.3,-1.6,-1.4);                                 // terkunci sampai APD lengkap
// APAR di samping pintu
{const a=grp(at(cyl(.09,.09,.42,'#d62828',{roughness:.35},16),0,.33,0),at(sph(.09,'#d62828',{roughness:.35}),0,.54,0),at(cyl(.025,.025,.08,'#222'),0,.64,0),at(box(.1,.02,.03,'#222'),.04,.69,0),at(box(.03,.3,.02,'#222'),.11,.5,0),at(box(.14,.1,.005,'#fff'),0,.36,.092));a.position.set(-7.95,0,-1.25);scene.add(a);plate('APAR',.4,.16,-7.95,1.05,-1.44,'#d62828','#fff');}

/* ---------- kompresor piston berpenggerak sabuk ---------- */
const K=new THREE.Group();K.position.set(-9.6,0,-5);scene.add(K);W.komp=K;
const RED={roughness:.32,metalness:.25},TR=.25,TY=.52;
K.add(at(cx(TR,1.1,'#c62828',RED,32),0,TY,0));
[-.55,.55].forEach(x=>{const e=at(mesh(new THREE.SphereGeometry(TR,24,16),mat('#c62828',RED)),x,TY,0);e.scale.x=.5;K.add(e);});
[-.36,.36].forEach(x=>K.add(at(cx(TR+.004,.022,'#a51d1d',RED,32),x,TY,0)));
// kaki: dua roda belakang + kaki depan berkaret + pegangan
[-.27,.27].forEach(z=>{K.add(at(cz(.1,.05,'#1b1b1b',{roughness:.9},18),-.42,.1,z));K.add(at(cz(.045,.055,'#c9d1d8',{metalness:.7},12),-.42,.1,z));});
K.add(at(cz(.012,.6,'#888',{metalness:.7},8),-.42,.1,0));K.add(at(box(.05,.2,.4,'#2b3036'),-.42,.25,0));
K.add(at(box(.05,.26,.34,'#2b3036'),.44,.15,0));K.add(at(box(.09,.03,.38,'#111',{roughness:.95}),.44,.015,0));
K.add(tube([[.6,TY+.1,-.16],[.82,TY+.2,-.16],[.9,TY+.34,0],[.82,TY+.2,.16],[.6,TY+.1,.16]],.014,'#2b3036',{metalness:.5},40));
// pelat dudukan
K.add(at(box(1,.03,.42,'#2b3036',{metalness:.4}),0,TY+TR+.045,0));[-.3,.3].forEach(x=>K.add(at(box(.06,.05,.36,'#2b3036'),x,TY+TR+.01,0)));
const PY=TY+TR+.06;                                                       // 0,83 = atas pelat
// motor listrik (poros searah Z, puli di sisi depan +z)
{const m=new THREE.Group();m.position.set(-.3,PY+.14,-.03);K.add(m);
  m.add(cz(.13,.3,'#1f4e79',{roughness:.5,metalness:.3},26));for(let i=0;i<9;i++)m.add(at(cz(.137,.01,'#1a4267',{roughness:.6},26),0,0,-.12+i*.03));
  m.add(at(cz(.135,.07,'#15181d',{roughness:.6},26),0,0,-.185));m.add(at(cz(.1,.004,'#2a3038',null,6),0,0,-.222));
  m.add(at(cz(.133,.03,'#173b5c',null,26),0,0,.16));m.add(at(box(.24,.03,.24,'#15181d'),0,-.13,0));
  m.add(at(box(.11,.07,.11,'#2b3036'),0,.15,-.02));W.motorBox=m.children[m.children.length-1];
  m.add(at(G.labelPlane(['MOTOR 3 HP','380 V · 3 fasa'],.17,.07,{bg:'#e8eaec',fg:'#111',fs:40}),.0,.0,.151));
  m.add(at(cz(.018,.12,'#c9d1d8',{metalness:.8},10),0,0,.22));const pu=at(cz(.06,.05,'#8d98a0',{metalness:.7,roughness:.35},20),0,0,.27);m.add(pu);W.puliMotor=pu;}
// pompa (kepala kompresor) bersirip + roda gila
{const p=new THREE.Group();p.position.set(.26,PY,-.03);K.add(p);
  p.add(at(box(.24,.2,.24,'#3b444c',{metalness:.4,roughness:.5}),0,.1,0));p.add(at(cz(.07,.26,'#333b42',{metalness:.4},16),0,.1,0));
  p.add(at(cyl(.085,.085,.24,'#59636c',{metalness:.5},20),0,.32,0));for(let i=0;i<8;i++)p.add(at(box(.23,.012,.23,'#aab3ba',{metalness:.7,roughness:.35}),0,.215+i*.028,0));
  p.add(at(box(.2,.05,.2,'#444d55',{metalness:.5}),0,.465,0));[-.07,.07].forEach(x=>[-.07,.07].forEach(z=>p.add(at(cyl(.012,.012,.02,'#c9d1d8',{metalness:.8},6),x,.5,z))));
  p.add(at(cx(.045,.09,'#15181d',null,16),.15,.44,.02));p.add(at(cx(.05,.012,'#2b3036',null,16),.2,.44,.02));       // saringan udara masuk
  p.add(at(cyl(.014,.014,.05,'#f3b52f',null,8),-.07,.215,.125));                                                       // tutup oli
  p.add(at(cz(.018,.12,'#c9d1d8',{metalness:.8},10),0,.1,.19));
  const fw=new THREE.Group();fw.position.set(0,.1,.27);p.add(fw);fw.add(cz(.2,.045,'#2a2f35',{metalness:.5,roughness:.45},30));fw.add(at(cz(.17,.047,'#3d454d',{metalness:.5},30),0,0,0));
  for(let i=0;i<3;i++){const s=box(.34,.045,.05,'#2a2f35',{metalness:.5});s.rotation.z=i*Math.PI/3;fw.add(s);}fw.add(cz(.045,.06,'#8d98a0',{metalness:.7},16));W.rodaGila=fw;}
// sabuk V (dua sisi lurus)
{const a=[-.3,PY+.14],b=[.26,PY+.1],r1=.06,r2=.2,z=.24;const seg=(y1,y2)=>{const dx=b[0]-a[0],dy=y2-y1,len=Math.hypot(dx,dy);const s=box(len,.012,.03,'#111',{roughness:.95});s.position.set((a[0]+b[0])/2,(y1+y2)/2,z);s.rotation.z=Math.atan2(dy,dx);K.add(s);};
  seg(a[1]+r1,b[1]+r2);seg(a[1]-r1,b[1]-r2);}
// pelindung sabuk (kawat) — awalnya tergeletak di lantai
{const c=cnv(256,160),x=c.getContext('2d');x.clearRect(0,0,256,160);x.strokeStyle='#f3b52f';x.lineWidth=5;for(let i=-160;i<256;i+=18){x.beginPath();x.moveTo(i,0);x.lineTo(i+160,160);x.stroke();x.beginPath();x.moveTo(i+160,0);x.lineTo(i,160);x.stroke();}x.lineWidth=14;x.strokeRect(0,0,256,160);
  const m=new THREE.MeshStandardMaterial({map:tex(c),transparent:true,side:THREE.DoubleSide,roughness:.6,metalness:.3,alphaTest:.3});
  const gd=new THREE.Group();const f=new THREE.Mesh(new THREE.PlaneGeometry(.92,.56),m);f.castShadow=true;gd.add(f);
  [[0,.28,.92,.02],[0,-.28,.92,.02]].forEach(q=>gd.add(at(box(q[2],q[3],.09,'#f3b52f',{metalness:.3}),q[0],q[1],-.045)));[-.46,.46].forEach(x2=>gd.add(at(box(.02,.56,.09,'#f3b52f',{metalness:.3}),x2,0,-.045)));
  K.add(gd);W.guard=gd;W.guardOn=[-.02,PY+.13,.31,0,0,0];W.guardOff=[.25,.05,.95,-Math.PI/2+.12,0,.5];
  gd.position.set(W.guardOff[0],W.guardOff[1],W.guardOff[2]);gd.rotation.set(W.guardOff[3],W.guardOff[4],W.guardOff[5]);}
// pipa tekan tembaga: kepala pompa -> katup searah -> tangki
K.add(tube([[.34,PY+.47,-.09],[.46,PY+.5,-.17],[.5,PY+.3,-.2],[.44,PY+.06,-.17],[.3,TY+TR-.01,-.12]],.012,'#b87333',{metalness:.8,roughness:.3},40));
K.add(at(cyl(.022,.022,.06,'#b89458',{metalness:.8},6),.3,TY+TR+.01,-.12));
// pressure switch, katup pengaman, manometer tangki, keran keluar
K.add(at(cyl(.014,.014,.07,'#b89458',{metalness:.8},8),.52,TY+TR+.02,.08));
K.add(at(box(.1,.11,.09,'#15181d',{roughness:.5}),.52,TY+TR+.11,.08));const knob=at(cyl(.022,.022,.035,'#d62828',null,14),.52,TY+TR+.185,.08);K.add(knob);W.knob=knob;
K.add(at(cyl(.016,.012,.06,'#b89458',{metalness:.8},10),.44,TY+TR+.03,-.02));K.add(at(mesh(new THREE.TorusGeometry(.016,.004,6,14),mat('#c9d1d8',{metalness:.8})),.44,TY+TR+.075,-.02));
const tg=gauge(.13,7.5,10);tg.position.set(.52,TY+TR+.1,.16);K.add(tg);W.tankGauge=tg;
const bv=ballValve(false);bv.position.set(.66,TY+TR+.06,.08);K.add(bv);K.add(fit(.72,TY+TR+.06,.08,'x+'));
// keran drain di titik terendah tangki (ujung kiri bawah)
K.add(at(cyl(.014,.014,.07,'#b89458',{metalness:.8},8),-.14,TY-TR-.03,0));
{const d=grp(at(cx(.02,.07,'#b89458',{metalness:.8,roughness:.35},10),0,0,0));const lv=at(box(.012,.012,.08,'#d62828'),0,.018,.02);d.add(lv);d.position.set(-.14,TY-TR-.075,0);K.add(d);W.drainLever=lv;}
K.add(at(G.labelPlane(['KOMPRESOR PISTON','3 HP · 200 L · maks. 8 bar'],.62,.15,{bg:'#f2efe6',fg:'#111',fs:44}),.02,TY+.02,TR+.003));
G.addColBox(-9.6,-5,1.75,.75);
{const l=G.textSprite('Kompresor + tangki udara',{h:.26,bg:'rgba(29,53,87,.9)'});l.position.set(-9.6,2.05,-5);scene.add(l);}
// genangan kondensat (hilang setelah di-drain) + tetesan
const pud=new THREE.Mesh(new THREE.CircleGeometry(.3,24),new THREE.MeshStandardMaterial({color:G.col('#6fbde9'),transparent:true,opacity:.5,roughness:.05,metalness:.2,depthWrite:false}));
pud.rotation.x=-Math.PI/2;pud.position.set(-9.78,.012,-4.94);pud.scale.set(1.2,.8,1);scene.add(pud);W.puddle=pud;
const drop=at(sph(.012,'#8fd0f5',{transparent:true,opacity:.9}),-9.74,.2,-5);scene.add(drop);W.drop=drop;
// getaran & putaran saat kompresor hidup
W.kompOn=true;
G.updaters.add((dt,t)=>{if(W.kompOn){W.rodaGila.rotation.z-=dt*9;W.puliMotor.rotation.y+=dt*30;K.position.y=Math.sin(t*38)*.0015;}
  if(W.drop.visible){const k=(t*1.3)%1;W.drop.position.y=.21-k*k*.2;W.drop.scale.setScalar(k<.08?k/.08:1);}});

/* ---------- panel listrik + kabel daya ke motor ---------- */
{const P=new THREE.Group();P.position.set(-11.6,1.55,-7.92);scene.add(P);W.panel=P;
  P.add(at(box(.7,.95,.2,'#aab3bb',{metalness:.4,roughness:.5}),0,0,0));P.add(at(box(.64,.89,.02,'#c3cad0',{metalness:.4,roughness:.45}),0,0,.105));
  P.add(at(box(.02,.14,.03,'#2b3036',{metalness:.6}),.27,-.05,.125));
  const win=G.canvasPlane(.3,.14,(x,w,h)=>{x.fillStyle='#10161c';x.fillRect(0,0,w,h);for(let i=0;i<4;i++){x.fillStyle='#e8eaec';x.fillRect(8+i*(w-16)/4,6,(w-16)/4-4,h-12);x.fillStyle=i<3?'#1f8bff':'#555';x.fillRect(14+i*(w-16)/4,h*.36,(w-16)/4-16,h*.3);}},400);win.position.set(-.08,.2,.118);P.add(win);
  const lg=at(sph(.022,'#22b866',{emissive:'#22b866',emissiveIntensity:1.2}),-.2,-.12,.12),lr=at(sph(.022,'#5a1010',{emissive:'#e04848',emissiveIntensity:0}),-.1,-.12,.12);P.add(lg,lr);W.lampOn=lg;W.lampOff=lr;
  P.add(at(G.labelPlane(['PANEL KOMPRESOR','380 V · AWAS LISTRIK'],.5,.13,{bg:'#ffd000',fg:'#111',fs:46}),0,-.32,.118));
  P.add(at(cyl(.03,.03,.07,'#8d98a0',{metalness:.6},10),0,-.5,0));
  const l=G.textSprite('Panel listrik',{h:.24,bg:'rgba(29,53,87,.9)'});l.position.set(0,.75,.2);P.add(l);}
W.cablePts=[[-11.6,1.02,-7.92],[-11.6,.5,-7.9],[-11.58,.06,-7.78],[-11.3,.03,-7.1],[-10.95,.03,-6.4],[-10.6,.03,-5.85],[-10.2,.03,-5.55],[-9.97,.2,-5.42],[-9.92,.75,-5.3],[-9.9,1.04,-5.12],[-9.9,1.12,-5.05]];
scene.add(tube(W.cablePts,.022,'#15181d',{roughness:.9},90));
// isolasi terkelupas + percikan + lantai lembap
const bare=at(cyl(.024,.024,.16,'#c8842c',{metalness:.8,roughness:.3,emissive:'#3a1e00'},10),-10.95,.034,-6.4);bare.rotation.set(Math.PI/2,0,-.5);scene.add(bare);W.bare=bare;
const wet=new THREE.Mesh(new THREE.CircleGeometry(.5,24),new THREE.MeshStandardMaterial({color:G.col('#5d8fb0'),transparent:true,opacity:.35,roughness:.05,depthWrite:false}));wet.rotation.x=-Math.PI/2;wet.position.set(-10.9,.011,-6.35);wet.scale.set(1.3,.8,1);scene.add(wet);
const sparks=[];for(let i=0;i<5;i++){const s=mesh(new THREE.OctahedronGeometry(.02),new THREE.MeshBasicMaterial({color:0xfff2a0,transparent:true}));s.castShadow=false;scene.add(s);sparks.push(s);}W.sparkOn=true;
G.updaters.add((dt,t)=>{sparks.forEach((s,i)=>{const on=W.sparkOn&&Math.sin(t*23+i*7)>.72;s.visible=on;if(on)s.position.set(-10.95+G.rand(-.08,.08),.05+G.rand(0,.1),-6.4+G.rand(-.08,.08));});});
const tagLoto=grp(at(box(.16,.22,.01,'#d62828'),0,0,0),at(G.labelPlane(['JANGAN','DINYALAKAN'],.14,.1,{bg:'#fff',fg:'#d62828',fs:36}),0,0,.007));tagLoto.position.set(-11.33,1.5,-7.79);tagLoto.visible=false;scene.add(tagLoto);W.tagLoto=tagLoto;

/* ---------- papan info jenis kompresor ---------- */
{const b=G.canvasPlane(1.5,1,(x,w,h)=>{x.fillStyle='#fbfbfb';x.fillRect(0,0,w,h);x.strokeStyle='#8a949c';x.lineWidth=12;x.strokeRect(0,0,w,h);x.fillStyle='#1d3557';x.font='700 30px sans-serif';x.fillText('JENIS KOMPRESOR',22,46);
  x.font='600 21px sans-serif';x.fillText('PISTON',22,90);x.fillText('SCREW',w/2+10,90);x.strokeStyle='#1d3557';x.lineWidth=4;x.strokeRect(22,104,w/2-44,78);x.fillStyle='#1f8bff';x.fillRect(60,110,34,66);
  x.strokeRect(w/2+10,104,w/2-44,78);x.lineWidth=3;for(let r=0;r<2;r++){x.beginPath();for(let i=0;i<w/2-60;i+=3){const yy=126+r*34+Math.sin(i*.16)*10;i?x.lineTo(w/2+18+i,yy):x.moveTo(w/2+18+i,yy);}x.stroke();}
  x.fillStyle='#d62828';x.font='600 19px sans-serif';x.fillText('Ketuk untuk membandingkan',22,h-22);},200);
  b.position.set(-7.25,1.75,-7.97);scene.add(b);scene.add(at(box(1.6,1.1,.03,'#8f9aa4'),-7.25,1.75,-7.99));}

/* ====================================================================== */
/* JALUR UDARA: kompresor -> pipa utama -> F.R.L -> selang -> mesin press  */
/* ====================================================================== */
const PIPE={metalness:.55,roughness:.35},MY=3.05,MZ=-7.86;
// selang fleksibel kompresor -> pipa naik di dinding
scene.add(tube([[-8.83,.9,-4.92],[-8.6,.95,-5.2],[-8.5,.8,-6.4],[-8.7,.95,-7.5],[-8.9,1.3,MZ]],.02,'#22272c',{roughness:.7},60));
scene.add(at(cyl(.032,.032,MY-1.3,'#2f6fb5',PIPE,14),-8.9,(MY+1.3)/2,MZ));
scene.add(at(cx(.034,16.3,'#2f6fb5',PIPE,14),-.75,MY,MZ));                         // pipa utama x -8,9 .. 7,4
[-8.9,7.4].forEach(x=>scene.add(at(sph(.04,'#2f6fb5',PIPE),x,MY,MZ)));
for(let x=-8;x<=7;x+=2.5)scene.add(at(box(.05,.12,.16,'#8d98a0',{metalness:.5}),x,MY,MZ-.06));
plate('UDARA BERTEKANAN  ➜  8 bar',1.6,.16,-3.6,MY+.2,-7.97,'#2f6fb5','#fff');
// turunan "leher angsa" dari sisi atas pipa utama ke unit F.R.L (agar air tidak ikut turun)
const FX=0,FY=1.5,FZ=-7.78;
scene.add(tube([[-.62,MY+.03,MZ],[-.62,MY+.2,MZ+.02],[-.62,MY+.22,MZ+.12],[-.62,MY+.06,MZ+.16],[-.62,2.3,MZ+.12],[-.62,1.96,FZ]],.026,'#2f6fb5',PIPE,60));
const fv=ballValve(true);fv.position.set(-.62,1.86,FZ);scene.add(fv);W.frlValve=fv;
scene.add(tube([[-.62,1.8,FZ],[-.62,FY+.06,FZ],[-.6,FY,FZ],[-.5,FY,FZ]],.022,'#2f6fb5',PIPE,30));

/* ---------- unit F.R.L: MASUK kiri -> Filter -> Regulator -> Lubricator -> KELUAR kanan ---------- */
{const F=new THREE.Group();F.position.set(FX,FY,FZ);scene.add(F);W.frl=F;
  scene.add(at(box(2.3,1.55,.05,'#e9edf0',{roughness:.7}),0,1.6,-7.97));scene.add(at(box(2.36,.05,.07,'#3d6fa8'),0,2.39,-7.96));
  const body={metalness:.55,roughness:.38},clear=new THREE.MeshStandardMaterial({color:G.col('#eaf6ff'),transparent:true,opacity:.3,roughness:.05,depthWrite:false});
  F.add(at(box(.74,.05,.04,'#8d98a0',{metalness:.5}),0,.02,-.11));
  const unit=(x)=>{F.add(at(box(.2,.19,.19,'#cdc4a6',body),x,0,0));F.add(at(cx(.035,.03,'#8d98a0',{metalness:.7},12),x+.115,0,0));};
  [-.24,0,.24].forEach(unit);F.add(at(cx(.035,.03,'#8d98a0',{metalness:.7},12),-.355,0,0));
  // filter: mangkuk bening + air + keran buang
  const bowl=x=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(.075,.068,.24,22),clear);b.position.set(x,-.215,0);F.add(b);F.add(at(cyl(.08,.08,.02,'#2b3036',null,22),x,-.1,0));F.add(at(cyl(.055,.03,.03,'#2b3036',null,16),x,-.345,0));};
  bowl(-.24);F.add(at(cyl(.03,.03,.09,'#d9d2b0',{roughness:.6},14),-.24,-.17,0));
  const wtr=new THREE.Mesh(new THREE.CylinderGeometry(.066,.062,.07,20),new THREE.MeshStandardMaterial({color:G.col('#6fbde9'),transparent:true,opacity:.65,roughness:.1}));wtr.position.set(-.24,-.295,0);F.add(wtr);W.frlWater=wtr;
  F.add(at(cyl(.012,.012,.04,'#b89458',{metalness:.8},8),-.24,-.375,0));
  // regulator: kenop hitam di bawah + manometer di depan
  F.add(at(cyl(.06,.06,.05,'#2b3036',null,20),0,-.12,0));const kn=at(cyl(.05,.058,.16,'#15181d',{roughness:.6},20),0,-.225,0);F.add(kn);W.regKnob=kn;
  for(let i=0;i<10;i++){const r=box(.012,.14,.012,'#2b3036');r.position.set(Math.cos(i*.628)*.056,-.225,Math.sin(i*.628)*.056);F.add(r);}
  const rg=gauge(.17,7,10,[4.5,5.5]);rg.position.set(0,.02,.105);F.add(rg);W.regGauge=rg;F.add(at(cz(.018,.03,'#b89458',{metalness:.8},8),0,.02,.09));
  // lubricator: mangkuk berisi oli + kubah intip tetesan
  bowl(.24);const oil=new THREE.Mesh(new THREE.CylinderGeometry(.068,.064,.11,20),new THREE.MeshStandardMaterial({color:G.col('#e0b24a'),transparent:true,opacity:.7,roughness:.15}));oil.position.set(.24,-.275,0);F.add(oil);
  F.add(at(cyl(.008,.008,.2,'#c9d1d8',{metalness:.8},6),.24,-.2,0));
  const dome=new THREE.Mesh(new THREE.SphereGeometry(.04,16,10,0,Math.PI*2,0,Math.PI/2),clear);dome.position.set(.24,.095,0);F.add(dome);F.add(at(cyl(.016,.016,.04,'#15181d',null,10),.24,.15,0));
  F.add(fit(-.37,0,0,'x-'));F.add(fit(.37,0,0,'x+'));
  // pelat nama
  const P=(t,w,x,y,bg,fg)=>F.add(at(G.labelPlane(t,w,.075,{bg:bg||'#1d3557',fg:fg||'#fff',fs:44}),x,y,.02-.0));
  [['FILTER',-.24],['REGULATOR',0],['LUBRICATOR',.24]].forEach(q=>F.add(at(G.labelPlane(q[0],.22,.06,{bg:'#1d3557',fg:'#fff',fs:40}),q[1],-.46,-.15)));
  [[['menyaring air','dan kotoran'],-.24],[['mengatur','tekanan kerja'],0],[['memberi','kabut oli'],.24]].forEach(q=>F.add(at(G.labelPlane(q[0],.22,.09,{bg:'#ffffff',fg:'#1d3557',fs:46}),q[1],-.545,-.15)));
  F.add(at(G.labelPlane('MASUK ➜',.34,.1,{bg:'#5a6b7b',fg:'#fff',fs:60}),-.84,-.16,-.15));F.add(at(G.labelPlane('dari kompresor · 8 bar',.34,.05,{bg:'#fff',fg:'#333',fs:30}),-.84,-.245,-.15));
  F.add(at(G.labelPlane('➜ KELUAR',.34,.1,{bg:'#1f8bff',fg:'#fff',fs:60}),.84,.36,-.15));F.add(at(G.labelPlane('ke mesin · 5 bar',.34,.05,{bg:'#fff',fg:'#333',fs:30}),.84,.275,-.15));
  F.add(at(G.labelPlane('UNIT F.R.L  (AIR SERVICE UNIT)',1.3,.12,{bg:'#f3b52f',fg:'#1a1300',fs:70}),0,.72,-.15));
  // panah aliran di atas unit
  const arrow=(x,c)=>{const a=mesh(new THREE.ConeGeometry(.035,.09,12),mat(c,{emissive:c,emissiveIntensity:.25}));a.rotation.z=-Math.PI/2;a.position.set(x,.2,0);F.add(a);return a;};
  W.arrows=[-.36,-.12,.12,.36].map((x,i)=>arrow(x,i<2?'#8fa3b1':'#1f8bff'));
  G.updaters.add((dt,t)=>W.arrows.forEach((a,i)=>{a.position.x=[-.36,-.12,.12,.36][i]+((t*.25+i*.0)%1)*.06;}));
  const l=G.textSprite('Unit F.R.L',{h:.26,bg:'rgba(29,53,87,.9)'});l.position.set(0,1.05,.15);F.add(l);}
// kebocoran pada sambungan keluar F.R.L (kepulan)
const puffs=[];for(let i=0;i<6;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.03,8,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5,depthWrite:false}));scene.add(s);puffs.push(s);}W.leakOn=true;
G.updaters.add((dt,t)=>puffs.forEach((s,i)=>{s.visible=W.leakOn;if(!W.leakOn)return;const k=((t*1.4+i/6)%1);s.position.set(FX+.47+k*.1,FY+.02+k*.22,FZ+.03+k*.2);s.scale.setScalar(.5+k*2.2);s.material.opacity=.5*(1-k);}));

/* ---------- selang biru F.R.L -> mesin press: berantakan (melintang lantai) dan rapi (menyusur dinding) ---------- */
const HOSE={roughness:.45},PX=6.2,PZ=-3.2;
W.hoseMessy=tube([[.47,FY,FZ],[.72,1.2,-7.66],[1.0,.3,-7.4],[1.5,.03,-6.9],[2.6,.03,-5.7],[3.5,.03,-5.2],[4.6,.03,-4.5],[5.5,.03,-4.2],[5.95,.25,-3.9],[6.12,.7,-3.72],[PX,.93,-3.62]],.02,'#1f8bff',HOSE,140);scene.add(W.hoseMessy);
W.hoseTidy=tube([[.47,FY,FZ],[.7,1.3,-7.74],[.82,.4,-7.84],[1.2,.05,-7.86],[4,.05,-7.86],[6.6,.05,-7.84],[6.95,.05,-7.4],[6.95,.05,-4.6],[6.7,.2,-3.95],[6.35,.7,-3.72],[PX,.93,-3.62]],.02,'#1f8bff',HOSE,140);W.hoseTidy.visible=false;scene.add(W.hoseTidy);
W.clips=[1.6,3,4.4,5.8].map(x=>{const c=at(box(.07,.05,.05,'#f3b52f'),x,.05,-7.9);c.visible=false;scene.add(c);return c;});

/* ---------- mesin press pneumatik ---------- */
{const M=new THREE.Group();M.position.set(PX,0,PZ);scene.add(M);W.press=M;
  const ST={metalness:.5,roughness:.45};
  M.add(at(box(1.35,.06,.85,'#59636c',ST),0,.85,0));[[-.6,-.36],[.6,-.36],[-.6,.36],[.6,.36]].forEach(q=>{M.add(at(box(.07,.82,.07,'#2b3036'),q[0],.41,q[1]));M.add(at(cyl(.05,.05,.02,'#111'),q[0],.01,q[1]));});
  M.add(at(box(1.25,.04,.75,'#3b444c'),0,.22,0));M.add(at(box(1.27,.1,.04,'#f3b52f'),0,.76,.41));
  M.add(at(box(.56,.07,.44,'#8d98a0',{metalness:.7,roughness:.3}),0,.915,-.05));                                   // bolster
  [-.34,.34].forEach(x=>M.add(at(cyl(.035,.035,.98,'#e2e8ec',{metalness:.95,roughness:.12},18),x,1.44,-.05)));     // kolom krom
  M.add(at(box(.9,.11,.4,'#3d6fa8',{metalness:.4,roughness:.5}),0,1.985,-.05));                                    // kepala silang
  // silinder kerja ganda: tabung aluminium + tutup + 4 batang pengikat
  M.add(at(cyl(.075,.075,.36,'#c4c9ce',{metalness:.85,roughness:.28},24),0,2.27,-.05));
  [2.065,2.475].forEach(y=>M.add(at(box(.19,.055,.19,'#9aa3ab',{metalness:.7,roughness:.35}),0,y,-.05)));
  [[-.075,-.075],[.075,-.075],[-.075,.075],[.075,.075]].forEach(q=>M.add(at(cyl(.008,.008,.46,'#c9d1d8',{metalness:.9},6),q[0],2.27,-.05+q[1])));
  M.add(at(G.labelPlane(['SILINDER','KERJA GANDA'],.13,.07,{bg:'#f2efe6',fg:'#111',fs:30}),0,2.27,.027));
  // pengatur kecepatan + selang kecil ke katup
  [2.065,2.475].forEach(y=>{M.add(at(cx(.016,.05,'#c9d1d8',{metalness:.8},10),-.12,y,-.05));M.add(at(cyl(.012,.012,.05,'#15181d',null,8),-.14,y+.04,-.05));});
  // batang piston + pelat peluncur + penumbuk (bergerak)
  const ram=new THREE.Group();M.add(ram);W.ram=ram;
  const rod=at(cyl(.024,.024,.5,'#f2f4f6',{metalness:1,roughness:.08},14),0,1.78,-.05);ram.add(rod);
  ram.add(at(box(.8,.05,.3,'#b9c2c9',{metalness:.7,roughness:.3}),0,1.5,-.05));[-.34,.34].forEach(x=>ram.add(at(cyl(.05,.05,.09,'#8d98a0',{metalness:.7},16),x,1.5,-.05)));
  ram.add(at(cyl(.055,.045,.16,'#444d55',{metalness:.6,roughness:.4},18),0,1.39,-.05));
  // cetakan + benda kerja
  M.add(at(box(.3,.05,.24,'#2b3036',{metalness:.4}),0,.975,-.05));const wp=at(box(.18,.03,.13,'#c8842c',{metalness:.5,roughness:.4}),0,1.015,-.05);M.add(wp);W.workpiece=wp;
  // katup kontrol arah 5/2 + peredam suara
  M.add(at(box(.24,.08,.07,'#e8eaec',{metalness:.3,roughness:.4}),0,.93,-.38));M.add(at(G.labelPlane('KATUP 5/2',.2,.045,{bg:'#fff',fg:'#1d3557',fs:30}),0,.935,-.343));
  [-.07,.07].forEach(x=>M.add(at(cyl(.014,.011,.05,'#a98a58',{metalness:.5,roughness:.7},10),x,.89+.0,-.42)));M.add(fit(0,.93,-.42,'z+'));M.children[M.children.length-1].rotation.x=-Math.PI/2;
  M.add(tube([[-.06,.97,-.38],[-.22,1.3,-.3],[-.24,1.9,-.16],[-.16,2.065,-.05]],.011,'#1f8bff',HOSE,40));
  M.add(tube([[.06,.97,-.38],[-.3,1.4,-.34],[-.34,2.2,-.2],[-.16,2.475,-.05]],.011,'#1f8bff',HOSE,40));
  // kotak tombol dua tangan + tombol darurat
  M.add(at(box(1.1,.1,.16,'#f3b52f',{roughness:.5}),0,.93,.34));const b1=at(cyl(.045,.045,.04,'#22b866',{emissive:'#0c4a26'},18),-.4,1,.34),b2=at(cyl(.045,.045,.04,'#22b866',{emissive:'#0c4a26'},18),.4,1,.34);M.add(b1,b2);W.pressBtns=[b1,b2];
  M.add(at(cyl(.05,.05,.02,'#ffd000',null,18),0,.985,.34));M.add(at(cyl(.035,.045,.04,'#d62828',null,18),0,1.015,.34));
  // pelindung samping bening
  [-.47,.47].forEach(x=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.015,.95,.5),new THREE.MeshStandardMaterial({color:G.col('#ffe9a0'),transparent:true,opacity:.22,roughness:.05,depthWrite:false}));p.position.set(x,1.42,-.05);M.add(p);});
  M.add(at(G.labelPlane(['MESIN PRESS PNEUMATIK','Tekan dua tombol hijau bersamaan'],1,.2,{bg:'#1d3557',fg:'#fff',fs:60}),0,.55,.44));
  const l=G.textSprite('Mesin press pneumatik',{h:.26,bg:'rgba(29,53,87,.9)'});l.position.set(0,2.85,0);M.add(l);
  G.addColBox(PX,PZ,1.5,1);
  W.ramY=0;G.updaters.add(()=>{ram.position.y=-W.ramY*.26;});
  W.pressCycle=()=>new Promise(res=>{W.pressBtns.forEach(b=>b.position.y=.985);G.sfx('tap');
    G.anim(.45,k=>{W.ramY=G.ease(k);},()=>{G.sfx('build');W.workpiece.scale.y=.55;W.workpiece.position.y=1.008;
      G.anim(.35,()=>{},()=>G.anim(.5,k=>{W.ramY=1-G.ease(k);},()=>{W.pressBtns.forEach(b=>b.position.y=1);res();}));});});
  W.newPiece=()=>{W.workpiece.scale.y=1;W.workpiece.position.y=1.015;};}
// bak hasil + bak bahan
{const bin=(x,c,t)=>{const g=grp(at(box(.5,.3,.36,c),0,.15,0),at(G.labelPlane(t,.4,.1,{bg:'#fff',fg:'#111',fs:44}),0,.16,.185));g.position.set(x,0,-1.55);scene.add(g);return g;};bin(5.1,'#1f8bff','BAHAN');W.binOut=bin(7.3,'#22b866','HASIL');}

/* ---------- lemari APD di samping pintu ruang kompresor ---------- */
{const L=new THREE.Group();L.position.set(-11.4,0,-1.05);scene.add(L);
  L.add(at(box(1.7,2,.5,'#1660b8',{roughness:.5}),0,1,0));L.add(at(box(.02,1.8,.02,'#0d3f7a'),0,1,.26));[-.12,.12].forEach(x=>L.add(at(box(.02,.18,.03,'#c9d1d8',{metalness:.8}),x,1.05,.265)));
  L.add(at(G.labelPlane('LEMARI APD',1.3,.24,{bg:'#fff',fg:'#1660b8',fs:90}),0,1.72,.256));
  L.add(at(G.labelPlane(['APD disediakan perusahaan','tanpa biaya · UU No. 1/1970'],1.3,.2,{bg:'#0d3f7a',fg:'#fff',fs:50}),0,.45,.256));
  // contoh APD di atas lemari: helm, kacamata, pelindung telinga
  L.add(at(mesh(new THREE.SphereGeometry(.16,18,10,0,Math.PI*2,0,Math.PI/2),mat('#ffd000',{roughness:.4})),-.55,2,0));L.add(at(cyl(.2,.2,.02,'#ffd000'),-.55,2.005,.03));
  L.add(at(box(.3,.09,.04,'#9fd4ff',{transparent:true,opacity:.75,roughness:.1}),0,2.06,.05));L.add(at(box(.32,.02,.05,'#111'),0,2.11,.05));
  L.add(at(cyl(.07,.07,.06,'#d62828').rotateZ(Math.PI/2),.4,2.08,0),at(cyl(.07,.07,.06,'#d62828').rotateZ(Math.PI/2),.7,2.08,0),at(box(.34,.025,.04,'#222'),.55,2.2,0));
  G.addColBox(-11.4,-1.05,1.7,.5);}

/* ---------- NPC ---------- */
W.npcs=[];
G.npc=function(o,x,z,yaw){const A=G.avatar(o);A.root.position.set(x,0,z);A.root.rotation.y=yaw||0;A.baseYaw=yaw||0;scene.add(A.root);W.npcs.push(A);
  G.updaters.add((dt,t)=>{if(!A.root.visible)return;A.idle(t);const dx=G.P.pos.x-A.root.position.x,dz=G.P.pos.z-A.root.position.z;const d=Math.hypot(dx,dz);
    let want=0;if(d<4.5&&!A.lockHead){want=Math.atan2(dx,dz)-A.root.rotation.y;want=((want+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;want=G.clamp(want,-1.1,1.1);}
    A.head.rotation.y=G.lerp(A.head.rotation.y,want,.1);});
  return A;};
G.bubble=function(A,text,dur){if(A.bub){A.root.remove(A.bub);}const s=G.textSprite(text,{h:.3,bg:'#ffffff',fg:'#111',pad:20});s.position.y=2.55;A.root.add(s);A.bub=s;setTimeout(()=>{if(A.bub===s){A.root.remove(s);A.bub=null;}},(dur||3)*1000);};
G.JAKA='Pak Jaka · Teknisi Utilitas';
G.NPC={jaka:G.npc({name:'Pak Jaka',skin:'#c68642',cap:'#1d3557',face:'smile'},-7.1,.7,0)};
G.NPC.opr=G.npc({name:'Mbak Rina · Operator',skin:'#e0ac69',hijab:'#f3b52f'},7.5,-2.2,-Math.PI/2);
})();
