/* Pabrik Elektronik Tycoon — dunia: gedung pabrik PT TOI Elektronika, kantor, gudang, jalur, dock, truk, NPC, mesin */
(function(){
'use strict';
const {scene,mat,mesh,box,cyl,sph,at,grp,cnv,tex,rr}=G;
const W=G.W={};

/* ---------- textures ---------- */
function studTex(base,dark){const c=cnv(64,64),x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,64,64);
  x.fillStyle=dark;x.beginPath();x.arc(33,34,15,0,7);x.fill();x.fillStyle='rgba(255,255,255,.18)';x.beginPath();x.arc(30,30,13,0,7);x.fill();x.fillStyle=base;x.beginPath();x.arc(32,32,12,0,7);x.fill();
  x.strokeStyle='rgba(0,0,0,.08)';x.strokeRect(0,0,64,64);const t=tex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
function floorTex(){const S=32,c=cnv(36*S,24*S),x=c.getContext('2d');const X=v=>(v+18)*S,Z=v=>(v+12)*S;
  x.fillStyle='#9aa3ab';x.fillRect(0,0,c.width,c.height);
  for(let i=0;i<9000;i++){x.fillStyle=`rgba(${Math.random()<.5?255:0},${Math.random()<.5?255:0},${Math.random()<.5?255:0},.03)`;x.fillRect(Math.random()*c.width,Math.random()*c.height,2,2);}
  x.strokeStyle='rgba(255,255,255,.08)';x.lineWidth=2;for(let i=0;i<=36;i+=2){x.beginPath();x.moveTo(i*S,0);x.lineTo(i*S,c.height);x.stroke();}for(let j=0;j<=24;j+=2){x.beginPath();x.moveTo(0,j*S);x.lineTo(c.width,j*S);x.stroke();}
  // green walkway
  x.fillStyle='#3d9f63';x.fillRect(X(-18),Z(6),36*S,1.6*S);x.fillStyle='#ffd23f';x.fillRect(X(-18),Z(6)-4,36*S,6);x.fillRect(X(-18),Z(7.6)-2,36*S,6);
  x.fillStyle='rgba(255,255,255,.85)';x.font=`700 ${S*.7}px Fredoka, sans-serif`;x.textAlign='center';x.textBaseline='middle';
  for(let v=-12;v<=12;v+=12)x.fillText('JALUR PEJALAN KAKI',X(v),Z(6.8));
  // production zone
  x.strokeStyle='#ffd23f';x.lineWidth=7;x.strokeRect(X(-10.6),Z(-0.2),25.4*S,5.2*S);
  // hatched docks
  const hatch=(x0,z0,w,h)=>{x.save();x.beginPath();x.rect(X(x0),Z(z0),w*S,h*S);x.clip();x.fillStyle='#ffd23f';x.fillRect(X(x0),Z(z0),w*S,h*S);x.fillStyle='#222';for(let i=-30;i<60;i++){x.beginPath();x.moveTo(X(x0)+i*24,Z(z0));x.lineTo(X(x0)+i*24+12,Z(z0));x.lineTo(X(x0)+i*24+12-h*S,Z(z0)+h*S);x.lineTo(X(x0)+i*24-h*S,Z(z0)+h*S);x.fill();}x.restore();};
  hatch(-18,2,1.1,6);hatch(16.9,2,1.1,6);
  x.strokeStyle='#ffffff';x.lineWidth=5;x.setLineDash([16,10]);x.strokeRect(X(-17.4),Z(2.4),6.2*S,5.2*S);x.strokeRect(X(14.6),Z(2.4),2.6*S,5.2*S);x.setLineDash([]);
  x.fillStyle='rgba(255,255,255,.9)';x.font=`700 ${S*.62}px Fredoka, sans-serif`;x.fillText('AREA PENERIMAAN',X(-14.3),Z(2.9));x.fillText('PENGIRIMAN',X(15.9),Z(2.9));
  // spawn ring
  x.fillStyle='#1f8bff';x.beginPath();x.arc(X(0),Z(10),1.1*S,0,7);x.fill();x.fillStyle='#fff';x.font=`700 ${S*.5}px Fredoka`;x.fillText('MULAI',X(0),Z(10));
  return tex(c);}
function asphaltTex(){const c=cnv(256,256),x=c.getContext('2d');x.fillStyle='#3b3f45';x.fillRect(0,0,256,256);for(let i=0;i<3000;i++){x.fillStyle=`rgba(255,255,255,${Math.random()*.06})`;x.fillRect(Math.random()*256,Math.random()*256,2,2);}const t=tex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}

/* ---------- ground & roads ---------- */
const grass=new THREE.Mesh(new THREE.PlaneGeometry(150,120),new THREE.MeshStandardMaterial({map:studTex('#5fae4b','#4f9a3e'),roughness:.95}));
grass.material.map.repeat.set(150/1.2,120/1.2);grass.rotation.x=-Math.PI/2;grass.position.set(0,-.02,5);grass.receiveShadow=true;scene.add(grass);
const asp=asphaltTex();
function road(x0,x1,z0,z1){const w=x1-x0,d=z1-z0;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshStandardMaterial({map:asp.clone(),roughness:.9}));m.material.map.needsUpdate=true;m.material.map.repeat.set(w/6,d/6);m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,-.005,(z0+z1)/2);m.receiveShadow=true;scene.add(m);return m;}
road(-70,70,15,21);road(-31,-18,0,15);road(18,31,0,15);
for(let x=-66;x<70;x+=6){const l=new THREE.Mesh(new THREE.PlaneGeometry(3,.18),new THREE.MeshBasicMaterial({color:0xf0f0f0}));l.rotation.x=-Math.PI/2;l.position.set(x,0,18);scene.add(l);}
// trees (blocky)
function tree(x,z,s){s=s||1;const g=grp(at(box(.4*s,2*s,.4*s,'#7a5230'),0,1*s,0),at(box(2.2*s,1.6*s,2.2*s,'#3f8f3a'),0,2.6*s,0),at(box(1.5*s,1.1*s,1.5*s,'#4caa45'),0,3.7*s,0));g.position.set(x,0,z);scene.add(g);}
[[-40,-6],[-44,6],[-38,28],[-20,30],[0,32],[22,30],[40,28],[44,4],[40,-8],[-30,-18],[0,-20],[28,-18],[-50,20],[52,18]].forEach(([x,z],i)=>tree(x,z,.9+(i%3)*.2));

/* ---------- factory building ---------- */
const floor=new THREE.Mesh(new THREE.PlaneGeometry(36,24),new THREE.MeshStandardMaterial({map:floorTex(),roughness:.8}));floor.rotation.x=-Math.PI/2;floor.position.y=.005;floor.receiveShadow=true;scene.add(floor);
const slab=at(box(36.6,.2,24.6,'#7d858c'),0,-.1,0);scene.add(slab);
const wallM=mat('#e4e8ec',{roughness:.9}),wallM2=mat('#5a6b7b',{roughness:.8});
W.walls={back:[],left:[],right:[]};
function wall(w,h,d,x,y,z,list,m){const b=mesh(new THREE.BoxGeometry(w,h,d),(m||wallM).clone());at(b,x,y,z);scene.add(b);list&&list.push(b);return b;}
const WH=6.5;
wall(36.6,WH,.3,0,WH/2,-12.15,W.walls.back);wall(36.6,1.2,.32,0,.6,-12.13,W.walls.back,wallM2);
// left wall with dock door z 2..8
[[-12.3,2],[8,12.3]].forEach(([a,b])=>{wall(.3,WH,b-a,-18.15,WH/2,(a+b)/2,W.walls.left);wall(.32,1.2,b-a,-18.13,.6,(a+b)/2,W.walls.left,wallM2);});
wall(.3,WH-4.6,6,-18.15,4.6+(WH-4.6)/2,5,W.walls.left);
[[-12.3,2],[8,12.3]].forEach(([a,b])=>{wall(.3,WH,b-a,18.15,WH/2,(a+b)/2,W.walls.right);wall(.32,1.2,b-a,18.13,.6,(a+b)/2,W.walls.right,wallM2);});
wall(.3,WH-4.6,6,18.15,4.6+(WH-4.6)/2,5,W.walls.right);
// roll-up doors (open) + dock bumpers
[-1,1].forEach(s=>{scene.add(at(box(.5,.5,6.2,'#8a96a1',{metalness:.5}),s*18.15,4.45,5));scene.add(at(box(.6,.35,.35,'#222'),s*18.3,1.0,2.6));scene.add(at(box(.6,.35,.35,'#222'),s*18.3,1.0,7.4));
  scene.add(at(box(.08,4.6,.25,'#ffd23f'),s*18.32,2.3,1.95));scene.add(at(box(.08,4.6,.25,'#ffd23f'),s*18.32,2.3,8.05));});
G.addCol(-18.3,18.3,-12.3,-12);G.addCol(-18.3,-18,-12.3,2);G.addCol(-18.3,-18,8,12.3);G.addCol(18,18.3,-12.3,2);G.addCol(18,18.3,8,12.3);
// columns & trusses
[-18,-6,6,18].forEach(x=>{const c=at(box(.4,WH,.4,'#3d6fa8',{metalness:.4}),x,WH/2,12);scene.add(c);G.addColBox(x,12,.4,.4);});
[-9,-3,3,9].forEach(z=>{scene.add(at(box(36.4,.35,.22,'#3d6fa8',{metalness:.4}),0,WH-.2,z));
  [-12,0,12].forEach(x=>{const lamp=grp(at(cyl(.02,.02,1,'#333'),0,-.5,0),at(cyl(.15,.45,.25,'#dfe5ea',{metalness:.3}),0,-1.1,0),at(sph(.14,'#fffbe0',{emissive:'#fffbe0',emissiveIntensity:1}),0,-1.2,0));lamp.position.set(x,WH-.3,z);scene.add(lamp);});});
// fade walls when camera behind
G.fadeWalls=p=>{const f=(list,on)=>list.forEach(w=>{const o=on?.18:1;if(w.material.opacity!==o){w.material.transparent=on;w.material.opacity=o;w.material.depthWrite=!on;}});
  f(W.walls.back,p.z<-12.1);f(W.walls.left,p.x<-18);f(W.walls.right,p.x>18);};
// big sign on back wall
const sign=G.labelPlane('PT TOI ELEKTRONIKA',9,1.1,{bg:'#1d3557',fg:'#f3b52f',fs:110});at(sign,0,5.3,-11.98);scene.add(sign);
const logoP=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.2),new THREE.MeshBasicMaterial({transparent:true}));at(logoP,-5.4,5.3,-11.97);scene.add(logoP);
const logoP2=logoP.clone();logoP2.material=logoP.material;at(logoP2,5.4,5.3,-11.97);scene.add(logoP2);
G.onLogo.push(()=>{logoP.material.map=G.logoTex;logoP.material.needsUpdate=true;});if(G.logoTex){logoP.material.map=G.logoTex;}
// high windows back wall
[-14,-8,8,14].forEach(x=>{scene.add(at(new THREE.Mesh(new THREE.PlaneGeometry(3,1.2),new THREE.MeshBasicMaterial({color:G.col('#cfe9ff')})),x,5.2,-11.98));});

/* ---------- furniture helpers ---------- */
function desk(x,z,ry,w){w=w||1.6;const g=grp(at(box(w,.05,.75,'#d8c3a0'),0,.76,0),at(box(.05,.74,.7,'#5b6670'),-w/2+.04,.37,0),at(box(.05,.74,.7,'#5b6670'),w/2-.04,.37,0),at(box(w-.1,.4,.03,'#5b6670'),0,.5,-.34));g.position.set(x,0,z);g.rotation.y=ry||0;scene.add(g);return g;}
function monitor(draw){const g=new THREE.Group();g.add(at(box(.62,.4,.04,'#1b1f24'),0,.32,0));const sc=G.canvasPlane(.56,.34,draw,300);at(sc,0,.32,.022);g.add(sc);g.add(at(box(.06,.16,.06,'#333'),0,.08,-.02));g.add(at(box(.24,.02,.16,'#333'),0,.01,0));g.userData.screen=sc;return g;}
function chair(x,z,ry,c){const g=grp(at(box(.48,.08,.46,c||'#2f3b48'),0,.48,0),at(box(.48,.5,.06,c||'#2f3b48'),0,.78,-.21),at(cyl(.03,.03,.42,'#777'),0,.24,0),at(cyl(.24,.24,.03,'#555'),0,.03,0));g.position.set(x,0,z);g.rotation.y=ry||0;scene.add(g);return g;}
function glassWall(x0,z0,x1,z1,h){h=h||2.6;const len=Math.hypot(x1-x0,z1-z0),ang=Math.atan2(z1-z0,x1-x0);const g=new THREE.Group();
  const gl=new THREE.Mesh(new THREE.BoxGeometry(len,h-.3,.04),new THREE.MeshStandardMaterial({color:G.col('#a8d4f0'),transparent:true,opacity:.28,roughness:.05,metalness:.1,depthWrite:false}));gl.position.y=.3+(h-.3)/2;g.add(gl);
  g.add(at(box(len,.3,.08,'#c6cdd3'),0,.15,0));g.add(at(box(len,.07,.08,'#8f9aa4',{metalness:.5}),0,h,0));
  for(let i=0;i<=Math.round(len/1.5);i++)g.add(at(box(.06,h,.08,'#8f9aa4',{metalness:.5}),-len/2+i*len/Math.round(len/1.5),h/2,0));
  g.position.set((x0+x1)/2,0,(z0+z1)/2);g.rotation.y=-ang;scene.add(g);G.addCol(Math.min(x0,x1)-.06,Math.max(x0,x1)+.06,Math.min(z0,z1)-.06,Math.max(z0,z1)+.06);return g;}
function zoneSign(text,x,y,z,ry,w,bg){const s=G.labelPlane(text,w||3,.5,{bg:bg||'#1d3557',fg:'#fff',fs:80});at(s,x,y,z);s.rotation.y=ry||0;scene.add(s);
  const back=s.clone();back.rotation.y=(ry||0)+Math.PI;back.position.copy(s.position);scene.add(back);return s;}
W.desk=desk;W.monitor=monitor;W.chair=chair;W.zoneSign=zoneSign;

/* ---------- R&D office ---------- */
glassWall(-17.9,-6,-12.6,-6);glassWall(-11.2,-6,-10,-6);glassWall(-10,-6,-10,-12);
zoneSign('RUANG R&D · ENGINEERING',-13.9,3.1,-6,0,4.2,'#6a3fb5');
desk(-15.6,-9.6,0,2);desk(-12.4,-9.6,0,1.8);
const m1=monitor((x,w,h)=>{x.fillStyle='#0b1a2e';x.fillRect(0,0,w,h);x.strokeStyle='#4fd1ff';x.lineWidth=3;x.strokeRect(20,20,w-40,h-40);for(let i=0;i<12;i++){x.fillStyle='#ffd23f';x.fillRect(40+(i%4)*36,40+Math.floor(i/4)*26,14,10);}x.fillStyle='#d8e6ff';x.font='bold 18px sans-serif';x.fillText('Layout PCB v1.3',w-150,h-28);});
m1.position.set(-16.1,.78,-9.8);scene.add(m1);
const m2=monitor((x,w,h)=>{x.fillStyle='#f6f8fb';x.fillRect(0,0,w,h);x.strokeStyle='#1b3a6b';x.lineWidth=3;x.beginPath();x.moveTo(20,h/2);x.lineTo(60,h/2);x.stroke();x.strokeRect(60,h/2-20,40,40);x.beginPath();x.moveTo(100,h/2);x.lineTo(150,h/2);for(let i=0;i<4;i++){x.moveTo(150+i*20,h/2-15);x.lineTo(162+i*20,h/2);x.lineTo(150+i*20,h/2+15);}x.stroke();x.fillStyle='#1b3a6b';x.font='bold 16px sans-serif';x.fillText('Skema: Lampu Emergency',18,26);});
m2.position.set(-15.1,.78,-9.8);scene.add(m2);
const m3=monitor((x,w,h)=>{x.fillStyle='#202a35';x.fillRect(0,0,w,h);x.fillStyle='#e7e7e7';x.fillRect(40,40,w-80,h-80);x.fillStyle='#f3b52f';x.fillRect(60,60,(w-120),24);x.fillStyle='#333';x.font='bold 15px sans-serif';x.fillText('CAD casing ABS',60,h-50);});
m3.position.set(-12.4,.78,-9.8);scene.add(m3);
chair(-15.6,-8.7,Math.PI);chair(-12.4,-8.7,Math.PI);
// 3D printer
const pr=grp(at(box(.5,.04,.5,'#222'),0,.8,0),at(box(.04,.55,.04,'#222'),-.23,1.08,-.23),at(box(.04,.55,.04,'#222'),.23,1.08,-.23),at(box(.5,.04,.04,'#222'),0,1.35,-.23),at(box(.12,.1,.1,'#f3b52f'),.05,1.2,-.18),at(box(.38,.01,.38,'#2a2a2a'),0,.83,0),at(box(.12,.08,.12,'#e74c3c'),0,.88,0));pr.position.set(-11.7,0,-9.6);scene.add(pr);
W.printerHead=pr.children[4];G.updaters.add((dt,t)=>{W.printerHead.position.x=Math.sin(t*2.3)*.15;});
// oscilloscope + whiteboard
const osc=grp(at(box(.36,.22,.2,'#d6dbe0'),0,.9,0));const oscS=G.canvasPlane(.2,.14,(x,w,h)=>{x.fillStyle='#04140a';x.fillRect(0,0,w,h);x.strokeStyle='#3cff84';x.lineWidth=2;x.beginPath();for(let i=0;i<w;i++)x.lineTo(i,h/2+Math.sin(i/7)*h/4);x.stroke();},300);at(oscS,-.05,.9,.101);osc.add(oscS);osc.position.set(-14.7,0,-9.6);scene.add(osc);
const wb=G.canvasPlane(3,1.4,(x,w,h)=>{x.fillStyle='#fbfbfb';x.fillRect(0,0,w,h);x.strokeStyle='#888';x.lineWidth=10;x.strokeRect(0,0,w,h);x.fillStyle='#1b3a6b';x.font='bold 46px sans-serif';x.fillText('Produk: Lampu Emergency LED',30,70);
  x.font='32px sans-serif';['• 12 LED SMD 2835 putih','• Baterai Li-ion 18650 3,7 V','• IC pengisi TP4056 (1 A)','• Casing ABS + sakelar geser'].forEach((s,i)=>x.fillText(s,40,140+i*48));x.strokeStyle='#d33';x.lineWidth=6;x.strokeRect(470,120,240,200);x.fillStyle='#d33';x.fillText('Tenggat: 7 hari',480,370);},200);
at(wb,-14,1.8,-11.97);scene.add(wb);
G.addCol(-16.7,-14.5,-10,-9.2);G.addCol(-13.4,-11.4,-10,-9.2);

/* ---------- Purchasing office ---------- */
glassWall(-9.8,-7.6,-5.7,-7.6);glassWall(-4.3,-7.6,-3.6,-7.6);glassWall(-3.6,-7.6,-3.6,-12);
zoneSign('PURCHASING · PPIC',-6.7,3.1,-7.6,0,3.4,'#b5643f');
desk(-6.8,-10.2,0,2);const pm=monitor((x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#1d6b3a';x.fillRect(0,0,w,26);x.fillStyle='#fff';x.font='bold 16px sans-serif';x.fillText('Purchase Order',10,18);x.fillStyle='#333';for(let i=0;i<5;i++){x.fillRect(14,40+i*20,w*.5,8);x.fillRect(w*.7,40+i*20,w*.2,8);}});pm.position.set(-6.8,.78,-10.4);scene.add(pm);
chair(-6.8,-9.4,Math.PI);G.addCol(-7.9,-5.7,-10.6,-9.8);
const cab=grp(box(.5,1.3,.6,'#7f8c99',{metalness:.4}));cab.children[0].position.y=.65;for(let i=0;i<3;i++)cab.add(at(box(.1,.03,.02,'#ccc'),0,.3+i*.4,.31));cab.position.set(-9.2,0,-11.4);scene.add(cab);G.addColBox(-9.2,-11.4,.5,.6);
const ppic=G.canvasPlane(2.2,1.1,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#b5643f';x.fillRect(0,0,w,50);x.fillStyle='#fff';x.font='bold 32px sans-serif';x.fillText('Jadwal Produksi (PPIC)',16,36);
  x.strokeStyle='#bbb';x.lineWidth=2;for(let i=0;i<8;i++){x.beginPath();x.moveTo(20+i*60,60);x.lineTo(20+i*60,h-10);x.stroke();}x.fillStyle='#3d8bfd';x.fillRect(20,80,180,26);x.fillStyle='#2fbf6f';x.fillRect(140,120,240,26);x.fillStyle='#f3b52f';x.fillRect(300,160,120,26);},200);
at(ppic,-5.2,1.7,-11.97);scene.add(ppic);

/* ---------- K3 board, utilities (back center/right) ---------- */
const k3=G.canvasPlane(2.4,1.3,(x,w,h)=>{x.fillStyle='#14904a';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='bold 40px sans-serif';x.fillText('PAPAN K3 & 5R',24,52);x.font='28px sans-serif';
  ['Utamakan Keselamatan!','Ringkas · Rapi · Resik · Rawat · Rajin','Hari tanpa kecelakaan: 128'].forEach((s,i)=>x.fillText(s,24,110+i*44));},200);
at(k3,2.5,1.7,-11.97);scene.add(k3);
const apar=grp(at(cyl(.12,.12,.55,'#d62828',{roughness:.35}),0,.28,0),at(box(.16,.06,.06,'#222'),0,.6,0));apar.position.set(5,.5,-11.85);scene.add(apar);
const p3k=grp(box(.45,.35,.14,'#f5f5f5'),at(box(.07,.22,.01,'#14904a'),0,0,.075),at(box(.22,.07,.01,'#14904a'),0,0,.076));p3k.position.set(5.9,1.5,-11.9);scene.add(p3k);
// utility area: compressor + air tank + MDP (dipakai di TP 2)
zoneSign('RUANG UTILITAS',13.5,3.1,-7.8,0,3,'#3a4652');
const comp=grp(at(box(1.4,.9,.8,'#2f7bd8',{roughness:.5}),0,.6,0),at(cyl(.3,.3,1.6,'#c9d1d8',{metalness:.6}).rotateZ(Math.PI/2),0,.32,0),at(cyl(.18,.18,.12,'#555'),.55,1.1,0),at(box(.3,.2,.02,'#111'),-.4,.8,.41));comp.position.set(11.2,0,-10.6);scene.add(comp);W.compressor=comp;G.addColBox(11.2,-10.6,1.7,1);
const tank=grp(at(cyl(.4,.4,1.6,'#d6dbe0',{metalness:.5,roughness:.35}),0,.9,0),at(sph(.4,'#d6dbe0',{metalness:.5}),0,1.7,0),at(cyl(.06,.06,.2,'#555'),0,2.15,0));tank.position.set(13,0,-10.8);scene.add(tank);G.addColBox(13,-10.8,.9,.9);
const mdp=grp(at(box(1.2,2,.45,'#c3c9cf',{metalness:.3}),0,1,0));mdp.add(G.labelPlane(['MDP','400 V'],.5,.3,{bg:'#ffd23f',fs:70}).translateY(1.6).translateZ(.23));mdp.position.set(15.6,0,-11.7);scene.add(mdp);G.addColBox(15.6,-11.7,1.2,.5);
glassWall(9.8,-7.8,17.9,-7.8,1.1);

/* ---------- Gudang bahan baku (kiri) ---------- */
zoneSign('GUDANG BAHAN BAKU',-14.4,3.4,-1.6,Math.PI/2,3.6,'#2f7a4d');
function rack(x,z,ry,len,colors){const g=new THREE.Group();const L=len||3;[-L/2,L/2].forEach(px=>[-.5,.5].forEach(pz=>g.add(at(box(.08,3,.08,'#2d5f8f',{metalness:.4}),px,1.5,pz))));
  [.15,1.1,2.05].forEach((y,j)=>{g.add(at(box(L,.08,.1,'#f07f1a',{metalness:.3}),0,y,-.5));g.add(at(box(L,.08,.1,'#f07f1a',{metalness:.3}),0,y,.5));g.add(at(box(L-.1,.03,1,'#b88a5a'),0,y+.05,0));
    for(let k=0;k<3;k++){const c=colors?colors[(j+k)%colors.length]:'#c49562';const bx=at(box(.8,.55,.8,c),-L/2+.55+k*(L-1.1)/2,y+.35,0);g.add(bx);}});
  g.position.set(x,0,z);g.rotation.y=ry||0;scene.add(g);return g;}
rack(-16.2,-3.2,Math.PI/2,3.4,['#c49562','#b98b55','#d4a76a']);G.addColBox(-16.2,-3.2,1.2,3.6);
rack(-13.2,-3.2,Math.PI/2,3.4,['#5b8bc9','#c49562','#7aa860']);G.addColBox(-13.2,-3.2,1.2,3.6);
rack(-16.2,10.4,0,3.2,['#c49562','#d4a76a']);G.addColBox(-16.2,10.4,3.4,1.2);
// forklift
const fk=grp(at(box(1,.5,1.6,'#f3b52f'),0,.45,0),at(box(.9,.12,1,'#333'),0,1.5,-.2),at(box(.06,1.1,.06,'#333'),-.4,1,-.6),at(box(.06,1.1,.06,'#333'),.4,1,-.6),at(box(.1,1.9,.1,'#333'),-.3,.95,.85),at(box(.1,1.9,.1,'#333'),.3,.95,.85),at(box(.1,.04,.9,'#888',{metalness:.7}),-.2,.15,1.3),at(box(.1,.04,.9,'#888',{metalness:.7}),.2,.15,1.3),
  ...[[-.5,-.5],[.5,-.5],[-.5,.5],[.5,.5]].map(([a,b])=>at(cyl(.2,.2,.18,'#222').rotateZ(Math.PI/2),a,.2,b)));fk.position.set(-11.8,0,9.8);fk.rotation.y=-.6;scene.add(fk);G.addColBox(-11.8,9.8,1.6,2);
// IQC table
const iqc=grp(at(box(2,.06,.9,'#dfe4e8'),0,.85,0),at(box(1.9,.8,.05,'#7f8c99'),0,.42,-.4),at(box(.06,.82,.85,'#7f8c99'),-.95,.42,0),at(box(.06,.82,.85,'#7f8c99'),.95,.42,0));
iqc.add(at(box(.25,.08,.16,'#f2c230'),-.6,.92,0));iqc.add(at(box(.3,.25,.2,'#333'),.6,1,-.1));iqc.add(G.labelPlane('MEJA IQC',.8,.18,{bg:'#2f7a4d',fg:'#fff',fs:70}).translateY(.6).translateZ(.43));
iqc.position.set(-13.4,0,4.6);iqc.rotation.y=Math.PI/2;scene.add(iqc);G.addColBox(-13.4,4.6,1,2.1);W.iqcPos=new THREE.Vector3(-12.4,0,4.6);

/* ---------- Gudang barang jadi (kanan) ---------- */
zoneSign('GUDANG BARANG JADI',15.8,3.4,-1.6,-Math.PI/2,3.6,'#a33f3f');
rack(16.2,-3.4,Math.PI/2,3,['#c49562','#e2c08d']);G.addColBox(16.2,-3.4,1.2,3.2);
const pallet=grp(at(box(1.2,.14,1,'#b88a5a'),0,.07,0));pallet.position.set(15.7,0,5);scene.add(pallet);W.pallet=pallet;G.addColBox(15.7,5,1.3,1.1);

/* ---------- conveyor ---------- */
W.LINE={x0:-8.4,x1:13.9,z:2,y:.93,stations:[-7,-4.2,-1.4,1.4,4.2,7,9.8,12.6]};
(function(){const L=W.LINE,len=L.x1-L.x0,cx=(L.x0+L.x1)/2;const c=cnv(128,32),x=c.getContext('2d');x.fillStyle='#2a2d31';x.fillRect(0,0,128,32);x.fillStyle='#34383d';for(let i=0;i<128;i+=16)x.fillRect(i,0,6,32);
  const bt=tex(c);bt.wrapS=bt.wrapT=THREE.RepeatWrapping;bt.repeat.set(len*2,1);
  const belt=new THREE.Mesh(new THREE.BoxGeometry(len,.05,.56),new THREE.MeshStandardMaterial({map:bt,roughness:.85}));at(belt,cx,.89,L.z);belt.receiveShadow=true;scene.add(belt);W.beltTex=bt;
  [-1,1].forEach(s=>scene.add(at(box(len,.09,.05,'#c9d1d8',{metalness:.7,roughness:.3}),cx,.92,L.z+s*.31)));
  for(let xx=L.x0+.3;xx<L.x1;xx+=1.6){[-1,1].forEach(s=>scene.add(at(box(.05,.86,.05,'#9aa4ad',{metalness:.6}),xx,.43,L.z+s*.27)));scene.add(at(box(.05,.05,.6,'#9aa4ad',{metalness:.6}),xx,.25,L.z));}
  [L.x0,L.x1].forEach(xx=>scene.add(at(cyl(.06,.06,.6,'#777',{metalness:.7}).rotateX(Math.PI/2),xx,.89,L.z)));
  G.addCol(L.x0-.2,L.x1+.2,L.z-.9,L.z+.85);G.addCol(L.x0+1.6,L.x1-.4,L.z-1.9,L.z-.9);})();
W.beltSpeed=0;G.updaters.add(dt=>{W.beltTex.offset.x-=dt*W.beltSpeed*2;});

/* ---------- control panel with stack light ---------- */
(function(){const g=grp(at(box(.7,1.5,.4,'#c3c9cf',{metalness:.3}),0,.75,0),at(box(.6,.4,.03,'#202830'),0,1.15,.21));
  const hmi=G.canvasPlane(.5,.3,(x,w,h)=>{x.fillStyle='#0d2238';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='bold 22px sans-serif';x.fillText('LINE 1',10,28);x.fillStyle='#ff5a5a';x.fillText('STOP',10,60);},256);at(hmi,0,1.15,.225);g.add(hmi);W.hmi=hmi;
  const bs=at(cyl(.05,.05,.04,'#22b866',{emissive:'#0a3'}).rotateX(Math.PI/2),-.12,.8,.21),be=at(cyl(.05,.05,.04,'#e04848').rotateX(Math.PI/2),.12,.8,.21);g.add(bs,be);
  const pole=at(cyl(.025,.025,.5,'#888'),0,1.75,0);g.add(pole);
  const lights=['#e04848','#f3b52f','#22b866'].map((c,i)=>{const m=at(cyl(.07,.07,.12,c,{emissive:c,emissiveIntensity:0,transparent:true,opacity:.9}),0,2.05+i*-.13+.26,0);g.add(m);return m;});
  g.add(G.labelPlane('PANEL KONTROL LINE 1',.7,.12,{bg:'#1d3557',fg:'#fff',fs:60}).translateY(1.42).translateZ(.205));
  g.position.set(-9.6,0,3.7);g.rotation.y=.4;scene.add(g);G.addColBox(-9.6,3.7,.8,.6);W.ctrl=g;W.stack=lights;
  W.setStack=(s)=>{lights.forEach((m,i)=>m.material.emissiveIntensity=0);const idx={stop:0,warn:1,run:2}[s];if(idx!==undefined)lights[idx].material.emissiveIntensity=1.6;};W.setStack('stop');})();

/* ---------- spawn pad ---------- */
const spawn=grp(at(cyl(1.05,1.15,.1,'#1f8bff',{emissive:'#0a3c78',emissiveIntensity:.4}),0,.05,0));spawn.position.set(0,0,10);scene.add(spawn);

/* ---------- NPC ---------- */
W.npcs=[];
G.npc=function(o,x,z,yaw){const A=G.avatar(o);A.root.position.set(x,0,z);A.root.rotation.y=yaw||0;A.baseYaw=yaw||0;scene.add(A.root);W.npcs.push(A);
  G.updaters.add((dt,t)=>{if(!A.root.visible)return;A.idle(t);const dx=G.P.pos.x-A.root.position.x,dz=G.P.pos.z-A.root.position.z;const d=Math.hypot(dx,dz);
    let want=0;if(d<4.5&&!A.lockHead){want=Math.atan2(dx,dz)-A.root.rotation.y;want=((want+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;want=G.clamp(want,-1.1,1.1);}
    A.head.rotation.y=G.lerp(A.head.rotation.y,want,.1);});
  return A;};
G.bubble=function(A,text,dur){if(A.bub){A.root.remove(A.bub);}const s=G.textSprite(text,{h:.3,bg:'#ffffff',fg:'#111',pad:20});s.position.y=2.55;A.root.add(s);A.bub=s;setTimeout(()=>{if(A.bub===s){A.root.remove(s);A.bub=null;}},(dur||3)*1000);};

/* ---------- truck ---------- */
G.truck=function(color,label){const g=new THREE.Group();const body=new THREE.Group();g.add(body);
  body.add(at(box(4.6,2.5,2.3,'#f2f4f6',{roughness:.5}),-.9,1.85,0));
  const side=G.labelPlane(label,3.6,.8,{bg:'transparent',fg:color,fs:90});at(side,-.9,2.1,1.16);body.add(side);const side2=side.clone();side2.rotation.y=Math.PI;side2.position.set(-.9,2.1,-1.16);body.add(side2);
  body.add(at(box(4.62,.25,2.32,color),-.9,.72,0));
  body.add(at(box(1.7,1.9,2.2,color,{roughness:.4}),2.35,1.45,0));body.add(at(box(.05,.8,1.9,'#22303d',{roughness:.1,metalness:.4}),3.21,1.9,0));
  body.add(at(box(1,.6,.05,'#22303d',{roughness:.1}),2.5,1.9,1.11));body.add(at(box(1,.6,.05,'#22303d',{roughness:.1}),2.5,1.9,-1.11));
  body.add(at(box(.05,.18,.4,'#fff6c8',{emissive:'#fff6c8',emissiveIntensity:.8}),3.22,.95,.75));body.add(at(box(.05,.18,.4,'#fff6c8',{emissive:'#fff6c8',emissiveIntensity:.8}),3.22,.95,-.75));
  body.add(at(box(.3,.25,2.3,'#333'),3.15,.6,0));
  const wheels=[];[[2.4,1],[2.4,-1],[-.6,1],[-.6,-1],[-2.3,1],[-2.3,-1]].forEach(([a,b])=>{const w=at(cyl(.45,.45,.3,'#1d1d1d',{roughness:.9}).rotateX(Math.PI/2),a,.45,b);body.add(w);wheels.push(w);});
  const door=at(box(.05,2.3,2.1,'#d8dde2'),-3.22,1.85,0);body.add(door);
  g.userData={wheels,door};scene.add(g);return g;};
G.drive=function(tr,path,speed){speed=speed||7;return new Promise(res=>{let i=0;const seg=()=>{if(i>=path.length-1){G.sfx('truck');res();return;}
  const a=path[i],b=path[i+1];const ax=a[0],az=a[1],bx=b[0],bz=b[1],rev=!!b[2];const dist=Math.hypot(bx-ax,bz-az);const dir=Math.atan2(-(bz-az),bx-ax)+(rev?Math.PI:0);
  const r0=tr.rotation.y;let dr=((dir-r0+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
  G.anim(Math.max(.3,dist/(rev?speed*.45:speed)),k=>{const e=k<.15?k*k/.3:k;tr.position.x=G.lerp(ax,bx,k);tr.position.z=G.lerp(az,bz,k);tr.rotation.y=r0+dr*Math.min(1,k*4);
    tr.userData.wheels.forEach(w=>w.rotation.y+= .2);},()=>{i++;seg();});};tr.position.set(path[0][0],0,path[0][1]);seg();});};

/* ---------- machines (stasiun jalur SMT) ---------- */
const tower=(g,x,y,z)=>{const t=[ '#e04848','#f3b52f','#22b866'].map((c,i)=>at(cyl(.045,.045,.07,c,{emissive:c,emissiveIntensity:0}),x,y+i*-.075+.15,z));t.forEach(m=>g.add(m));g.add(at(cyl(.015,.015,.25,'#888'),x,y-.1,z));return t;};
const glass=()=>new THREE.MeshStandardMaterial({color:G.col('#9fd4ff'),transparent:true,opacity:.25,roughness:.05,depthWrite:false});
function plate(g,text,y,w){const s=G.labelPlane(text,w||1.4,.2,{bg:'#1d3557',fg:'#fff',fs:62});at(s,0,y,.0);g.add(s);return s;}
G.MACHINE={
 loader(){const g=new THREE.Group();g.add(at(box(1.1,.85,1.1,'#d9dee3',{metalness:.3}),0,.43,-.25));
   const mag=grp(at(box(.05,.6,.4,'#555'),-.2,1.2,-.25),at(box(.05,.6,.4,'#555'),.2,1.2,-.25));for(let i=0;i<9;i++)mag.add(at(box(.36,.012,.24,'#1d7a3e'),0,.95+i*.06,-.25));g.add(mag);
   const arm=at(box(.06,.06,.5,'#f3b52f'),0,.98,-.6);g.add(arm);const tl=tower(g,.45,1.35,-.65);
   g.userData.upd=(dt,t,run)=>{arm.position.z=-.6+(run?Math.max(0,Math.sin(t*2.4))*.3:0);tl[2].material.emissiveIntensity=run?1.5:0;tl[1].material.emissiveIntensity=run?0:1;};return g;},
 printer(){const g=new THREE.Group();g.add(at(box(1.5,.8,1.3,'#e6eaee',{metalness:.2}),0,.4,0));g.add(at(mesh(new THREE.BoxGeometry(1.5,.6,1.3),glass()),0,1.1,0));g.add(at(box(1.52,.08,1.32,'#c3cad1'),0,1.44,0));
   g.add(at(box(1.3,.02,.9,'#c0c6cc',{metalness:.8,roughness:.2}),0,1.0,0));const sq=at(box(1.2,.12,.04,'#f3b52f',{metalness:.4}),0,1.08,0);g.add(sq);
   const scr=G.canvasPlane(.36,.24,(x,w,h)=>{x.fillStyle='#0d2238';x.fillRect(0,0,w,h);x.fillStyle='#7ee2a5';x.font='bold 18px sans-serif';x.fillText('PASTE SAC305',8,24);x.fillText('Stensil 0,12 mm',8,50);},256);at(scr,.5,1.62,.4);scr.rotation.x=-.3;g.add(scr);g.add(at(box(.4,.28,.03,'#222'),.5,1.62,.385));
   const tl=tower(g,-.65,1.75,-.55);g.userData.upd=(dt,t,run)=>{if(run)sq.position.z=Math.sin(t*2)*.35;tl[2].material.emissiveIntensity=run?1.5:0;tl[1].material.emissiveIntensity=run?0:1;};return g;},
 pnp(){const g=new THREE.Group();g.add(at(box(1.9,.8,1.4,'#dfe4e8',{metalness:.2}),0,.4,0));g.add(at(mesh(new THREE.BoxGeometry(1.9,.75,1.4),glass()),0,1.18,0));g.add(at(box(1.92,.08,1.42,'#c3cad1'),0,1.58,0));
   const gan=at(box(.12,.1,1.3,'#3a4652',{metalness:.5}),0,1.4,0);g.add(gan);const head=grp(at(box(.2,.18,.16,'#e04848'),0,0,0),at(cyl(.012,.012,.14,'#ccc',{metalness:.9}),-.05,-.15,0),at(cyl(.012,.012,.14,'#ccc',{metalness:.9}),.05,-.15,0));head.position.set(0,1.28,0);g.add(head);
   for(let i=0;i<8;i++){const r=at(cyl(.13,.13,.04,['#f5f5f5','#f3b52f','#1f8bff','#e04848'][i%4]).rotateX(Math.PI/2),-.75+i*.21,.95,.78);g.add(r);}g.add(at(box(1.8,.12,.18,'#555'),0,.82,.78));
   const tl=tower(g,.85,1.85,-.6);g.userData.upd=(dt,t,run)=>{if(run){gan.position.x=Math.sin(t*3.1)*.7;head.position.x=gan.position.x;head.position.z=Math.sin(t*4.7)*.5;head.position.y=1.28+Math.max(0,Math.sin(t*9))*-.08;}
     tl[2].material.emissiveIntensity=run?1.5:0;tl[1].material.emissiveIntensity=run?0:1;};return g;},
 reflow(){const g=new THREE.Group();g.add(at(box(2.4,.75,1.1,'#c9d0d6',{metalness:.3}),0,.38,0));g.add(at(box(2.4,.55,1.1,'#9aa6b0',{metalness:.4}),0,1.1,0));
   const zones=[];['#ffb347','#ff8a3d','#ff3d1f','#4fb3ff'].forEach((c,i)=>{const z=at(box(.5,.12,.02,c,{emissive:c,emissiveIntensity:.2}),-.85+i*.57,1.05,.56);g.add(z);zones.push(z);});
   [-.7,.7].forEach(x=>g.add(at(cyl(.1,.1,.6,'#b8c0c8',{metalness:.7}),x,1.65,-.2)));
   const scr=G.canvasPlane(.5,.22,(x,w,h)=>{x.fillStyle='#120b05';x.fillRect(0,0,w,h);x.fillStyle='#ffb347';x.font='bold 22px monospace';x.fillText('PREHEAT 150°C',8,24);x.fillStyle='#ff5a3d';x.fillText('PUNCAK  245°C',8,50);},256);at(scr,.8,.62,.555);g.add(scr);
   g.add(at(box(2.5,.1,.08,'#ffd23f'),0,.78,.6));const tl=tower(g,1.1,1.75,-.45);
   g.userData.upd=(dt,t,run)=>{zones.forEach((z,i)=>z.material.emissiveIntensity=run?1.2+Math.sin(t*3+i)*.3:.15);tl[2].material.emissiveIntensity=run?1.5:0;tl[1].material.emissiveIntensity=run?0:1;};return g;},
 aoi(){const g=new THREE.Group();g.add(at(box(1.3,.8,1.2,'#3c4650',{metalness:.3}),0,.4,0));g.add(at(box(1.3,.75,1.2,'#46525e'),0,1.18,0));g.add(at(mesh(new THREE.BoxGeometry(.9,.4,.02),glass()),0,1.15,.61));
   const ring=at(mesh(new THREE.TorusGeometry(.14,.025,8,24),mat('#ffffff',{emissive:'#ffffff',emissiveIntensity:.3})).rotateX(Math.PI/2),0,1.25,0);g.add(ring);g.add(at(cyl(.05,.05,.2,'#111'),0,1.38,0));
   const arm=grp(at(box(.04,.5,.04,'#888'),0,.25,0));const mon=G.canvasPlane(.44,.3,(x,w,h)=>{x.fillStyle='#04140a';x.fillRect(0,0,w,h);x.fillStyle='#1d7a3e';x.fillRect(20,20,w-40,h-40);x.fillStyle='#ffd23f';for(let i=0;i<12;i++)x.fillRect(34+(i%4)*36,30+Math.floor(i/4)*24,12,8);x.fillStyle='#7ee2a5';x.font='bold 16px sans-serif';x.fillText('AOI: OK',w-80,h-8);},256);
   mon.position.set(0,.6,.02);arm.add(mon);arm.add(at(box(.48,.34,.03,'#222'),0,.6,0));arm.position.set(.75,1.55,.2);arm.rotation.y=-.5;g.add(arm);g.userData.aoiScreen=mon;
   const tl=tower(g,-.55,1.85,-.5);g.userData.upd=(dt,t,run)=>{ring.material.emissiveIntensity=run?1.6+Math.sin(t*12)*.4:.2;tl[2].material.emissiveIntensity=run?1.5:0;tl[1].material.emissiveIntensity=run?0:1;};return g;},
 assy(){const g=new THREE.Group();const b=grp(at(box(1.9,.06,.8,'#d8c3a0'),0,.86,-1),at(box(.06,.84,.75,'#5b6670'),-.9,.42,-1),at(box(.06,.84,.75,'#5b6670'),.9,.42,-1));g.add(b);
   ['#e04848','#1f8bff','#f3b52f','#22b866'].forEach((c,i)=>g.add(at(box(.26,.14,.2,c),-.6+i*.4,.96,-1.25)));for(let i=0;i<5;i++)g.add(at(cyl(.03,.03,.11,'#2a5bd7').rotateZ(Math.PI/2),-.5+i*.07,.92,-.85));
   g.add(at(cyl(.025,.03,.2,'#222'),.5,.98,-.85));g.add(G.labelPlane(['PERAKITAN','AKHIR'],.6,.25,{bg:'#f3b52f',fs:70}).translateY(1.4).translateZ(-1.38));g.userData.upd=()=>{};return g;},
 fqc(){const g=new THREE.Group();g.add(at(box(1.9,.06,.8,'#dfe4e8'),0,.86,-1));g.add(at(box(.06,.84,.75,'#5b6670'),-.9,.42,-1));g.add(at(box(.06,.84,.75,'#5b6670'),.9,.42,-1));
   const psu=grp(at(box(.4,.2,.3,'#e8e8e8'),0,0,0));const ps=G.canvasPlane(.2,.08,(x,w,h)=>{x.fillStyle='#160606';x.fillRect(0,0,w,h);x.fillStyle='#ff5a3d';x.font='bold 30px monospace';x.fillText('5.00V',6,32);},256);at(ps,-.05,.03,.151);psu.add(ps);psu.position.set(-.55,1,-1.1);g.add(psu);
   g.add(at(box(.1,.17,.04,'#f2c230'),.1,.98,-1.15));const jig=at(box(.4,.08,.3,'#1d3557'),.55,.93,-1);g.add(jig);
   const lamp=at(box(.3,.02,.2,'#fffbe0',{emissive:'#fffbe0',emissiveIntensity:0}),.55,.98,-1);g.add(lamp);g.userData.testLamp=lamp;
   g.add(G.labelPlane(['UJI FUNGSI','(FINAL QC)'],.6,.25,{bg:'#22b866',fg:'#fff',fs:70}).translateY(1.4).translateZ(-1.38));
   const rej=grp(at(box(.6,.5,.5,'#c62828'),0,.25,0),G.labelPlane('REJECT',.5,.14,{bg:'#fff',fg:'#c62828',fs:70}).translateY(.34).translateZ(.255));rej.position.set(.9,0,1.25);g.add(rej);g.userData.rej=rej;
   g.userData.upd=(dt,t,run)=>{};return g;},
 pack(){const g=new THREE.Group();g.add(at(box(1.9,.06,.8,'#d8c3a0'),0,.86,-1));g.add(at(box(.06,.84,.75,'#5b6670'),-.9,.42,-1));g.add(at(box(.06,.84,.75,'#5b6670'),.9,.42,-1));
   for(let i=0;i<4;i++)g.add(at(box(.5,.03,.4,'#c49562'),-.5,.9+i*.03,-1.1));g.add(at(cyl(.06,.06,.08,'#8a6d4a').rotateX(Math.PI/2),.2,.95,-1.1));g.add(at(box(.24,.16,.2,'#333'),.6,.97,-1.15));
   g.add(G.labelPlane('PENGEMASAN',.6,.16,{bg:'#a33f3f',fg:'#fff',fs:70}).translateY(1.4).translateZ(-1.38));g.userData.upd=()=>{};return g;}};
})();
