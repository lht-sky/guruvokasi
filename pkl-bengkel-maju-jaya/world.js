/* PKL Bengkel Las Maju Jaya — dunia: bengkel fabrikasi, stasiun kerja, NPC, kendaraan pelanggan */
(function(){
'use strict';
const {scene,mat,mesh,box,cyl,sph,at,grp,cnv,tex}=G;
const W=G.W={npcs:[]};
const HX=15,HZ=8,WH=5,FW=30,FD=16;
const add=m=>{scene.add(m);return m;};
G.V=(x,z)=>new THREE.Vector3(x,0,z);

/* ---------- tekstur ---------- */
function studTex(base,dark){const c=cnv(64,64),x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,64,64);
  x.fillStyle=dark;x.beginPath();x.arc(33,34,15,0,7);x.fill();x.fillStyle='rgba(255,255,255,.18)';x.beginPath();x.arc(30,30,13,0,7);x.fill();x.fillStyle=base;x.beginPath();x.arc(32,32,12,0,7);x.fill();
  const t=tex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
function floorTex(){const S=36,c=cnv(FW*S,FD*S),x=c.getContext('2d');const X=v=>(v+HX)*S,Z=v=>(v+HZ)*S;
  x.fillStyle='#a3abb2';x.fillRect(0,0,c.width,c.height);
  for(let i=0;i<8000;i++){x.fillStyle=`rgba(${Math.random()<.5?255:0},${Math.random()<.5?255:0},${Math.random()<.5?255:0},.03)`;x.fillRect(Math.random()*c.width,Math.random()*c.height,2,2);}
  x.strokeStyle='rgba(255,255,255,.08)';x.lineWidth=2;for(let i=0;i<=FW;i+=2){x.beginPath();x.moveTo(i*S,0);x.lineTo(i*S,c.height);x.stroke();}for(let j=0;j<=FD;j+=2){x.beginPath();x.moveTo(0,j*S);x.lineTo(c.width,j*S);x.stroke();}
  const lab=(t,cx,cz,fs,col)=>{x.fillStyle=col||'rgba(255,255,255,.92)';x.font=`700 ${S*(fs||.42)}px Fredoka, sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(t,X(cx),Z(cz));};
  // kantor
  x.fillStyle='rgba(40,90,125,.28)';x.fillRect(X(-15),Z(-8),5*S,4.6*S);lab('KANTOR',-12.5,-3.8);
  // jalur pejalan kaki
  x.fillStyle='#3d9f63';x.fillRect(X(-15),Z(-3.2),21.6*S,1.5*S);x.fillRect(X(-2),Z(-1.7),2*S,9.7*S);
  x.fillStyle='#ffd23f';x.fillRect(X(-15),Z(-3.2)-3,21.6*S,5);x.fillRect(X(-15),Z(-1.7)-2,13*S,5);x.fillRect(X(0),Z(-1.7)-2,6.6*S,5);
  lab('JALUR PEJALAN KAKI',-8,-2.45,.5);lab('JALUR PEJALAN KAKI',3.2,-2.45,.5);
  // zona stasiun
  x.strokeStyle='#ffd23f';x.lineWidth=6;
  [[-9.1,3.2,'MEJA UKUR'],[-5.4,3.8,'MEJA KERJA'],[-1.2,2.8,'AREA POTONG'],[2,3.2,'BOR DUDUK']].forEach(([x0,w,t])=>{x.strokeRect(X(x0),Z(-7.9),w*S,4.3*S);lab(t,x0+w/2,-4,.36);});
  // area las (arsir merah)
  x.save();x.beginPath();x.rect(X(6.6),Z(-8),5*S,3.6*S);x.clip();x.fillStyle='rgba(178,58,46,.25)';x.fillRect(X(6.6),Z(-8),5*S,3.6*S);x.restore();
  x.strokeStyle='#e04848';x.lineWidth=7;x.strokeRect(X(6.6),Z(-8),5*S,3.6*S);lab('AREA LAS · AWAS SINAR LAS',9.1,-3.95,.34,'#ffe1dc');
  // zona terkunci
  x.strokeStyle='#ffffff';x.lineWidth=5;x.setLineDash([16,10]);x.strokeRect(X(11.9),Z(-8),3.1*S,9.4*S);x.strokeRect(X(10.4),Z(2.8),4.6*S,4.9*S);x.setLineDash([]);
  // APD & rak material
  x.strokeStyle='#ffd23f';x.setLineDash([]);x.strokeRect(X(-15),Z(1.4),2.2*S,2.2*S);lab('APD',-13.9,4,.36);
  lab('RAK MATERIAL',-13.3,-.2,.3);
  return tex(c);}
function asphaltTex(){const c=cnv(256,256),x=c.getContext('2d');x.fillStyle='#3b3f45';x.fillRect(0,0,256,256);for(let i=0;i<3000;i++){x.fillStyle=`rgba(255,255,255,${Math.random()*.06})`;x.fillRect(Math.random()*256,Math.random()*256,2,2);}const t=tex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}

/* ---------- halaman, jalan, pohon ---------- */
const grass=new THREE.Mesh(new THREE.PlaneGeometry(130,110),new THREE.MeshStandardMaterial({map:studTex('#5fae4b','#4f9a3e'),roughness:.95}));
grass.material.map.repeat.set(130/1.2,110/1.2);grass.rotation.x=-Math.PI/2;grass.position.set(0,-.02,5);grass.receiveShadow=true;scene.add(grass);
function slab(x0,x1,z0,z1,m,y){const p=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),m);p.rotation.x=-Math.PI/2;p.position.set((x0+x1)/2,y||-.005,(z0+z1)/2);p.receiveShadow=true;scene.add(p);return p;}
const asp=asphaltTex();asp.repeat.set(22,1);slab(-65,65,16,22,new THREE.MeshStandardMaterial({map:asp,roughness:.9}));
slab(-17,17,8,16,mat('#c4c7c2',{roughness:.95}),-.008);
for(let x=-60;x<64;x+=6){const l=new THREE.Mesh(new THREE.PlaneGeometry(3,.18),new THREE.MeshBasicMaterial({color:0xf0f0f0}));l.rotation.x=-Math.PI/2;l.position.set(x,0,19);scene.add(l);}
function tree(x,z,s){s=s||1;const g=grp(at(box(.4*s,2*s,.4*s,'#7a5230'),0,1*s,0),at(box(2.2*s,1.6*s,2.2*s,'#3f8f3a'),0,2.6*s,0),at(box(1.5*s,1.1*s,1.5*s,'#4caa45'),0,3.7*s,0));g.position.set(x,0,z);scene.add(g);G.addColBox(x,z,.5*s,.5*s);}
[[-22,-4],[-26,8],[-21,13],[-20,26],[-9,27],[9,27],[22,26],[26,6],[21,13],[23,-6],[-14,-14],[2,-15],[15,-14],[-32,18],[34,16]].forEach(([x,z],i)=>tree(x,z,.9+(i%3)*.2));

/* ---------- gedung ---------- */
const floor=new THREE.Mesh(new THREE.PlaneGeometry(FW,FD),new THREE.MeshStandardMaterial({map:floorTex(),roughness:.85}));floor.rotation.x=-Math.PI/2;floor.position.y=.01;floor.receiveShadow=true;scene.add(floor);
W.walls={back:[],left:[],right:[]};
function wall(w,h,d,x,y,z,list,c){const m=at(mesh(new THREE.BoxGeometry(w,h,d),mat(c||'#dfe5ea',{roughness:.9})),x,y,z);scene.add(m);list.push(m);return m;}
wall(FW+.6,WH,.3,0,WH/2,-HZ-.15,W.walls.back);wall(FW+.6,1.2,.32,0,.6,-HZ-.13,W.walls.back,'#2f5f8a');
wall(.3,WH,FD+.3,-HX-.15,WH/2,0,W.walls.left);wall(.32,1.2,FD+.3,-HX-.13,.6,0,W.walls.left,'#2f5f8a');
wall(.3,WH,FD+.3,HX+.15,WH/2,0,W.walls.right);wall(.32,1.2,FD+.3,HX+.13,.6,0,W.walls.right,'#2f5f8a');
G.addCol(-HX-.3,HX+.3,-HZ-.3,-HZ);G.addCol(-HX-.3,-HX,-HZ-.3,HZ+.2);G.addCol(HX,HX+.3,-HZ-.3,HZ+.2);
[-15,-5,5,15].forEach(x=>{add(at(box(.4,WH,.4,'#3d6fa8',{metalness:.4}),x,WH/2,HZ));G.addColBox(x,HZ,.4,.4);});
[-5.5,-1.8,1.8,5.5].forEach(z=>{add(at(box(FW+.4,.32,.2,'#3d6fa8',{metalness:.4}),0,WH-.2,z));
  [-10,0,10].forEach(x=>{const lamp=grp(at(cyl(.02,.02,.9,'#333'),0,-.45,0),at(cyl(.15,.42,.24,'#dfe5ea',{metalness:.3}),0,-1,0),at(sph(.13,'#fffbe0',{emissive:'#fffbe0',emissiveIntensity:1}),0,-1.1,0));lamp.position.set(x,WH-.3,z);scene.add(lamp);});});
G.fadeWalls=p=>{const f=(list,on)=>list.forEach(w=>{const o=on?.18:1;if(w.material.opacity!==o){w.material.transparent=on;w.material.opacity=o;w.material.depthWrite=!on;}});
  f(W.walls.back,p.z<-HZ);f(W.walls.left,p.x<-HX);f(W.walls.right,p.x>HX);};
add(at(box(FW+.6,1.5,.3,'#1c2420'),0,WH+.75,HZ));
const sign=G.labelPlane('BENGKEL LAS MAJU JAYA',13,1.15,{bg:'#1c2420',fg:'#f3b52f',fs:120});at(sign,0,WH+.75,HZ+.16);scene.add(sign);
const sign2=G.labelPlane('BENGKEL LAS MAJU JAYA',9,.8,{bg:'#1d3557',fg:'#f3b52f',fs:110});at(sign2,-1,4.2,-HZ+.02);scene.add(sign2);
const k3=G.labelPlane(['UTAMAKAN','KESELAMATAN KERJA'],3,.9,{bg:'#22b866',fg:'#ffffff',fs:70});at(k3,6,3.6,-HZ+.02);scene.add(k3);
const lbl=(t,x,y,z,o)=>{const s=G.textSprite(t,Object.assign({h:.34},o||{}));s.position.set(x,y,z);scene.add(s);return s;};

/* ---------- stasiun (posisi berdiri pemain) ---------- */
W.ST={kantor:{x:-12.5,z:-4.2},apd:{x:-13.3,z:2.5},ukur:{x:-7.5,z:-5.1},meja:{x:-3.5,z:-5.5},potong:{x:.2,z:-5.5},bor:{x:3.6,z:-5.6}};
const legs=(x,z,w,d,h,c)=>[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>add(at(box(.09,h,.09,c||'#5b4a36'),x+a*(w/2-.08),h/2,z+b*(d/2-.08))));
const vise=(x,y,z)=>{add(at(box(.38,.2,.3,'#285a7d',{metalness:.4}),x,y+.1,z));add(at(box(.12,.16,.38,'#1c2420'),x,y+.28,z));add(at(cyl(.02,.02,.4,'#c9cdd0',{metalness:.8}),x,y+.12,z+.3).rotateX(Math.PI/2));};
// kantor
add(at(box(2.2,.08,.9,'#8b6a45'),-12.5,.8,-5.6));legs(-12.5,-5.6,2.2,.9,.78);G.addColBox(-12.5,-5.6,2.2,.9);
add(at(box(.55,.36,.05,'#1c2420'),-13,1.06,-5.75));add(at(box(.5,.02,.34,'#f7f8f4'),-12.1,.85,-5.5));
const papan=G.canvasPlane(3,1.7,(x,w,h)=>{x.fillStyle='#f7f8f4';x.fillRect(0,0,w,h);x.fillStyle='#285a7d';x.fillRect(0,0,w,h*.2);x.fillStyle='#fff';x.font=`700 ${h*.13}px Fredoka,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('PAPAN ORDER',w/2,h*.11);
  ['#f2c230','#9fd3a8','#f5b7a8','#bfd7ea','#f2c230','#e8d6f5'].forEach((c,i)=>{x.fillStyle=c;const cx=w*(.08+(i%3)*.3),cy=h*(.28+Math.floor(i/3)*.34);x.fillRect(cx,cy,w*.24,h*.26);x.fillStyle='rgba(0,0,0,.35)';for(let k=0;k<3;k++)x.fillRect(cx+w*.02,cy+h*(.05+k*.06),w*(.2-k*.04),h*.02);});});
at(papan,-12.5,2.4,-HZ+.02);scene.add(papan);
// lemari APD
add(at(box(.6,2.1,1.6,'#285a7d',{metalness:.3}),-14.6,1.05,2.5));G.addColBox(-14.6,2.5,.7,1.7);
['#f7f8f4','#f2c230','#f2c230'].forEach((c,i)=>{const h=mesh(new THREE.SphereGeometry(.19,12,8,0,Math.PI*2,0,Math.PI/2),mat(c));at(h,-14.55,2.1,2+i*.5);scene.add(h);});
add(at(box(.04,.5,1.2,'#b08b5e'),-14.28,1.2,2.5));lbl('LEMARI APD',-14.3,2.9,2.5);
// rak material
[-3,-1.5,0].forEach(z=>add(at(box(.1,1.8,.1,'#3b4448'),-14.5,.9,z)));
for(let i=0;i<9;i++)add(at(box(.07,.07,3.2,'#8e989c',{metalness:.6}),-14.5-(i%3)*.09+.09,.45+Math.floor(i/3)*.55,-1.5));
G.addColBox(-14.5,-1.5,.8,3.4);
// meja ukur
add(at(box(2.4,.25,1.2,'#3a3f44',{roughness:.3}),-7.5,.82,-6.6));legs(-7.5,-6.6,2.4,1.2,.7,'#5f6b70');G.addColBox(-7.5,-6.6,2.4,1.2);
add(at(box(.5,.03,.1,'#c9cdd0',{metalness:.8}),-8.2,.96,-6.4));add(at(box(1,.012,.06,'#e0c24a'),-7.2,.955,-6.25));lbl('MEJA UKUR',-7.5,2.3,-6.6);
// meja kerja
add(at(box(3,.1,1.1,'#8b6a45'),-3.5,.9,-6.9));legs(-3.5,-6.9,3,1.1,.86);add(at(box(1.1,.5,.9,'#6d7a80'),-4.3,.5,-6.9));G.addColBox(-3.5,-6.9,3,1.1);
vise(-3.2,.95,-6.6);add(at(box(.05,.03,.6,'#5f6b70',{metalness:.7}),-2.5,.97,-6.8));add(at(box(.06,.06,.18,'#8b6a45'),-2.5,.97,-6.42));lbl('MEJA KERJA',-3.5,2.3,-6.9);
// area potong
add(at(cyl(.12,.18,.9,'#5f6b70'),.2,.45,-6.7));vise(.2,.9,-6.7);G.addColBox(.2,-6.7,.6,.6);
const saw=grp(at(box(.04,.04,.7,'#2e4756'),0,.28,0),at(box(.04,.3,.04,'#2e4756'),0,.14,-.33),at(box(.04,.3,.04,'#2e4756'),0,.14,.33),at(box(.012,.03,.66,'#c9cdd0'),0,0,0),at(box(.06,.16,.08,'#b23a2e'),0,.12,.42));saw.position.set(.55,1.25,-6.7);scene.add(saw);
add(at(box(.75,.12,.45,'#285a7d'),1.3,.06,-7.3));add(at(cyl(.3,.3,.03,'#c9cdd0',{metalness:.7}),1.3,.46,-7.35).rotateX(Math.PI/2));G.addColBox(1.3,-7.3,.8,.5);lbl('AREA POTONG',.4,2.3,-6.8);
// bor duduk
add(at(box(.7,.1,.9,'#285a7d'),3.6,.05,-7));add(at(cyl(.07,.07,2.2,'#5f6b70',{metalness:.6}),3.6,1.1,-7.25));add(at(box(.6,.06,.6,'#285a7d'),3.6,.95,-6.75));
add(at(box(.5,.5,.9,'#285a7d'),3.6,2.05,-6.95));add(at(box(.36,.32,.36,'#3b4448'),3.6,2.1,-7.4));
W.spindle=grp(at(cyl(.06,.06,.2,'#8e989c',{metalness:.7}),0,.1,0),at(cyl(.025,.012,.34,'#d9dde0',{metalness:.8},8),0,-.2,0));W.spindle.position.set(3.6,1.7,-6.75);scene.add(W.spindle);
G.addColBox(3.6,-7,.8,1);lbl('BOR DUDUK',3.6,3,-7);
G.updaters.add(dt=>{if(W.drillOn)W.spindle.rotation.y+=dt*30;W.spindle.position.y=1.7-(W.drillP||0)*.22;});
// area las
W.weld=[];
[[8,-6.6],[10.3,-6.6]].forEach(([x,z])=>{
  [x-1.05,x+1.05].forEach(cx=>{const s=at(mesh(new THREE.BoxGeometry(.05,2,2.6),mat('#b23a2e',{transparent:true,opacity:.5})),cx,1,z+.5);s.castShadow=false;scene.add(s);});
  add(at(box(1.3,.06,.7,'#3b4448',{metalness:.5}),x,.82,z-.6));legs(x,z-.6,1.3,.7,.8,'#3b4448');add(at(box(.9,.05,.05,'#7d878b'),x,.88,z-.6));
  add(at(box(.5,.44,.64,'#e0a100'),x+.7,.22,z+.9));
  const li=new THREE.PointLight(0x9fd3ff,1.5,5);li.position.set(x,1.2,z-.5);scene.add(li);
  const sp=at(sph(.07,'#ffffff',{emissive:'#bfe3ff',emissiveIntensity:3}),x,.93,z-.55);scene.add(sp);W.weld.push({li,sp});});
G.updaters.add(()=>W.weld.forEach(w=>{const k=Math.random();w.li.intensity=.6+k*2.2;w.sp.scale.setScalar(.5+k*1.2);}));
G.addCol(6.6,11.6,-8,-4.6);
// bubut & milling (terkunci)
add(at(box(2.4,1,.8,'#7d878b',{metalness:.4}),13.4,.5,-6.6));add(at(box(.7,.6,.7,'#5f6b70'),12.5,1.2,-6.6));add(at(cyl(.12,.12,1.4,'#c9cdd0',{metalness:.8}),13.6,1.2,-6.6).rotateZ(Math.PI/2));
add(at(box(1,2.1,1,'#7d878b',{metalness:.4}),13.4,1.05,-3));add(at(box(1.5,.12,.7,'#5f6b70'),13.4,1.05,-2.4));
for(let z=-8;z<=1.4;z+=1.57)add(at(cyl(.05,.05,.95,'#1c2420'),11.9,.47,z));add(at(box(.04,.08,9.4,'#f3b52f'),11.9,.85,-3.3));add(at(box(3.1,.08,.04,'#f3b52f'),13.45,.85,1.4));add(at(cyl(.05,.05,.95,'#1c2420'),14.9,.47,1.4));
G.addCol(11.8,15,-8,1.5);lbl('🔒 TAHAP 2 · BUBUT & MILLING',13.4,3,-3,{bg:'rgba(60,70,80,.9)'});
// ruang CNC (terkunci)
const glass=(w,h,d,x,z)=>{const g=at(mesh(new THREE.BoxGeometry(w,h,d),mat('#9fd3ff',{transparent:true,opacity:.22,roughness:.1})),x,h/2,z);g.castShadow=false;scene.add(g);};
glass(.08,2.8,4.9,10.4,5.25);glass(4.6,2.8,.08,12.7,2.8);
add(at(box(1.9,2,1.5,'#e8ecef'),13,1,5.6));add(at(box(1,.75,.05,'#1d4b70'),12.8,1.2,4.83));add(at(box(.34,.6,.2,'#3b4448'),13.75,1.5,4.8));
G.addCol(10.3,15,2.7,7.7);lbl('🔒 TAHAP 3 · CNC',12.7,3.2,5,{bg:'rgba(60,70,80,.9)'});
// APAR
add(at(cyl(.1,.1,.5,'#e04848'),-5.4,.9,7.9));add(at(cyl(.1,.1,.5,'#e04848'),4.6,.9,7.9));

/* ---------- NPC ---------- */
G.npc=function(o,x,z,yaw){const A=G.avatar(o);A.root.position.set(x,0,z);A.root.rotation.y=yaw||0;scene.add(A.root);W.npcs.push(A);
  G.updaters.add((dt,t)=>{if(!A.root.visible)return;A.idle(t);const dx=G.P.pos.x-A.root.position.x,dz=G.P.pos.z-A.root.position.z;const d=Math.hypot(dx,dz);
    let want=0;if(d<4.5&&!A.lockHead){want=Math.atan2(dx,dz)-A.root.rotation.y;want=((want+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;want=G.clamp(want,-1.1,1.1);}
    A.head.rotation.y=G.lerp(A.head.rotation.y,want,.1);});
  return A;};
G.bubble=function(A,text,dur){if(A.bub){A.root.remove(A.bub);}const s=G.textSprite(text,{h:.3,bg:'#ffffff',fg:'#111',pad:20});s.position.y=2.55;A.root.add(s);A.bub=s;setTimeout(()=>{if(A.bub===s){A.root.remove(s);A.bub=null;}},(dur||3)*1000);};
/* berjalan lewat titik-titik; jalur baru menggantikan jalur lama */
W.go=(A,pts,yawEnd)=>new Promise(res=>{const old=A._res;A.path=pts.map(p=>G.V(p[0],p[1]));A.yawEnd=yawEnd;A._res=res;if(old)old();});
G.updaters.add(dt=>W.npcs.forEach(A=>{if(!A.path){A.walk(dt,0);return;}const t=A.path[0],p=A.root.position,dx=t.x-p.x,dz=t.z-p.z,d=Math.hypot(dx,dz),st=3.3*dt;
  if(d<=st){p.x=t.x;p.z=t.z;A.path.shift();if(!A.path.length){A.path=null;if(A.yawEnd!==undefined)A.root.rotation.y=A.yawEnd;const r=A._res;A._res=null;r&&r();}}
  else{p.x+=dx/d*st;p.z+=dz/d*st;A.root.rotation.y=Math.atan2(dx,dz);}A.walk(dt,3.3);}));
const N=G.NPC={};
N.mandor=G.npc({name:'Pak Mandor',skin:'#c68642',body:'#6b5b3a',cap:'#f7f8f4',face:'glasses',tagColor:'#ffe08a'},-1,9.6,0);
N.rina=G.npc({name:'Bu Rina',skin:'#e0ac69',hijab:'#2e6f95',uniform:false,shirt:'#e8e2d0'},-12.5,-6.7,0);
N.dodi=G.npc({name:'Mas Dodi',skin:'#b97a4a',cap:'#f2c230'},-11,-.8,0);
N.dodi.root.add(at(box(.5,.3,.3,'#9c7a4e'),0,1.05,.32));N.dodi.busy=1;
N.wawan=G.npc({name:'Mas Wawan',skin:'#c68642',body:'#4a5560',cap:'#2f3438'},8,-6,Math.PI);
N.sarno=G.npc({name:'Pak Sarno',skin:'#a86b3c',body:'#4a5560',cap:'#2f3438'},10.3,-6,Math.PI);
[N.wawan,N.sarno].forEach(A=>{A.busy=1;A.lockHead=true;A.head.add(at(box(.36,.38,.08,'#1c2420'),0,0,.2));});
N.cust=[G.npc({name:'Pelanggan',skin:'#c68642',uniform:false,shirt:'#c0392b',hair:'#1b1b1b'},0,40,0),
  G.npc({name:'Pelanggan',skin:'#e0ac69',uniform:false,shirt:'#2f7d4a',cap:'#1d3557'},0,40,0),
  G.npc({name:'Pelanggan',skin:'#e0ac69',uniform:false,shirt:'#7d4a9c',hijab:'#d9c2a0'},0,40,0)];
N.cust.forEach(A=>A.root.visible=false);
(async function patrol(){const R=[[-11,-.8],[-6,-2.5],[2,-2.5],[5.6,-2.6],[5.6,-4.2],[2,-2.5],[-9,-2.5]];let i=0;for(;;){await G.wait(G.rand(2.5,5));i=(i+1)%R.length;await W.go(N.dodi,[R[i]]);}})();
const CHAT=[[N.wawan,'Awas sinar las!'],[N.sarno,'Arus 80 ampere, pas.'],[N.dodi,'Permisi, bawa material!'],[N.rina,'Order masuk terus, nih.'],[N.dodi,'Jangan lupa kacamata!'],[N.wawan,'Terak dibersihkan dulu.']];
setInterval(()=>{const c=G.pick(CHAT);if(c[0].root.visible&&!G.ui.busy())G.bubble(c[0],c[1],2.6);},6500);

/* ---------- kendaraan pelanggan ---------- */
W.vehicle=function(kind,color){const g=new THREE.Group(),wh=[];
  const wheel=(x,z,r)=>{const m=cyl(r,r,.18,'#1c2420');m.rotation.x=Math.PI/2;m.position.set(x,r,z);g.add(m);wh.push(m);};
  if(kind==='motor'){g.add(at(box(1.3,.32,.32,color),0,.58,0));g.add(at(box(.6,.12,.3,'#1c2420'),-.15,.8,0));g.add(at(box(.08,.5,.5,'#3b4448'),.5,.95,0));wheel(.58,0,.28);wheel(-.58,0,.28);g.add(at(box(.4,.3,.4,'#9c7a4e'),-.6,.98,0));}
  else{g.add(at(box(3.6,.55,1.7,color),0,.7,0));g.add(at(box(1.5,.85,1.6,color),.85,1.4,0));g.add(at(box(1.52,.4,1.62,'#2e4756',{roughness:.2}),.92,1.52,0));
    g.add(at(box(1.9,.36,.08,color),-.8,1.15,.81));g.add(at(box(1.9,.36,.08,color),-.8,1.15,-.81));g.add(at(box(.08,.36,1.7,color),-1.76,1.15,0));[[1.15,.85],[1.15,-.85],[-1.15,.85],[-1.15,-.85]].forEach(([x,z])=>wheel(x,z,.36));}
  g.position.set(-62,0,17.6);scene.add(g);
  const drive=(x0,x1,dur)=>new Promise(r=>{G.sfx('truck');G.anim(dur,k=>{const e=G.ease(k);g.position.x=G.lerp(x0,x1,e);wh.forEach(w=>w.rotation.z=-g.position.x*2.5);},r);});
  return {g,drive,remove:()=>scene.remove(g)};};
})();
