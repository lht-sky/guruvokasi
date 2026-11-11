/* Pneumatik Tycoon — engine (renderer, avatar, kontrol, kamera, prompt, HUD, dialog, audio, save); sama dengan engine Pabrik Elektronik Tycoon */
(function(){
'use strict';
const G=window.G={};
const $=s=>document.querySelector(s);G.$=$;
const rand=(a,b)=>a+Math.random()*(b-a);G.rand=rand;
const lerp=(a,b,t)=>a+(b-a)*t;G.lerp=lerp;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));G.clamp=clamp;
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;G.ease=ease;
G.shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
G.pick=a=>a[Math.floor(Math.random()*a.length)];
G.esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
G.fmt=n=>Math.round(n).toLocaleString('id-ID');
/* ---------- warna seragam (ubah di sini) ---------- */
G.UNIFORM={body:'#1f3a68',stripe:'#ffd23f',reflect:'#e8eef2',shoe:'#1b1b1b'};

/* ---------- renderer ---------- */
const view=$('#view'),canvas=$('#c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputEncoding=THREE.sRGBEncoding;
const scene=new THREE.Scene();G.scene=scene;
scene.background=new THREE.Color('#8ec5f0').convertSRGBToLinear();
scene.fog=new THREE.Fog(scene.background.getHex(),60,140);
const camera=new THREE.PerspectiveCamera(55,1,.1,300);G.camera=camera;
const hemi=new THREE.HemisphereLight(0xdfefff,0x5a6b4a,.7);scene.add(hemi);G.hemi=hemi;
const sun=new THREE.DirectionalLight(0xfff4e0,.95);sun.position.set(18,30,16);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-32,right:32,top:32,bottom:-32,near:1,far:90});sun.shadow.bias=-.0005;scene.add(sun);scene.add(sun.target);
scene.add(new THREE.AmbientLight(0xffffff,.2));
function resize(){const w=view.clientWidth,h=view.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();}
addEventListener('resize',resize);G.resize=resize;

/* ---------- builders ---------- */
const col=c=>new THREE.Color(c).convertSRGBToLinear();G.col=col;
function mat(c,o){o=o||{};const m=new THREE.MeshStandardMaterial(Object.assign({roughness:.65,metalness:.05},o));m.color=col(c);if(o.emissive!==undefined)m.emissive=col(o.emissive);return m;}
function mesh(g,m){const x=new THREE.Mesh(g,m);x.castShadow=true;x.receiveShadow=true;return x;}
function box(w,h,d,c,o){return mesh(new THREE.BoxGeometry(w,h,d),mat(c,o));}
function cyl(rt,rb,h,c,o,s){return mesh(new THREE.CylinderGeometry(rt,rb,h,s||20),mat(c,o));}
function sph(r,c,o){return mesh(new THREE.SphereGeometry(r,16,12),mat(c,o));}
function at(m,x,y,z){m.position.set(x,y,z);return m;}
function grp(){const g=new THREE.Group();for(const a of arguments)if(a)g.add(a);return g;}
function cnv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function tex(c){const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;}
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath();}
Object.assign(G,{mat,mesh,box,cyl,sph,at,grp,cnv,tex,rr});
const FONT='"Fredoka","Barlow",sans-serif';G.FONT=FONT;
G.textSprite=function(text,o){o=Object.assign({fg:'#fff',bg:'rgba(17,21,27,.82)',h:.3,border:null,weight:700,pad:22},o||{});
  const fs=64;let c=cnv(8,8),x=c.getContext('2d');x.font=`${o.weight} ${fs}px ${FONT}`;const tw=x.measureText(text).width;
  c.width=Math.ceil(tw+o.pad*2);c.height=Math.ceil(fs+o.pad*1.2);x=c.getContext('2d');x.font=`${o.weight} ${fs}px ${FONT}`;
  if(o.bg){rr(x,3,3,c.width-6,c.height-6,Math.min(26,c.height/2-3));x.fillStyle=o.bg;x.fill();if(o.border){x.lineWidth=6;x.strokeStyle=o.border;x.stroke();}}
  x.fillStyle=o.fg;x.textAlign='center';x.textBaseline='middle';x.fillText(text,c.width/2,c.height/2+3);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(c),transparent:true,depthTest:o.depthTest!==undefined?o.depthTest:true}));
  s.scale.set(o.h*c.width/c.height,o.h,1);s.renderOrder=o.depthTest===false?30:5;return s;};
G.labelPlane=function(lines,w,h,o){o=Object.assign({bg:'#ffffff',fg:'#111',fs:70,weight:700,border:null,align:'center'},o||{});
  const ppm=256,c=cnv(Math.max(8,Math.round(w*ppm)),Math.max(8,Math.round(h*ppm))),x=c.getContext('2d');
  if(o.bg!=='transparent'){x.fillStyle=o.bg;x.fillRect(0,0,c.width,c.height);}
  if(o.border){x.lineWidth=10;x.strokeStyle=o.border;x.strokeRect(5,5,c.width-10,c.height-10);}
  const L=[].concat(lines);let fs=o.fs;x.font=`${o.weight} ${fs}px ${FONT}`;const mw=Math.max(...L.map(t=>x.measureText(t).width));
  if(mw>c.width*.9)fs*=c.width*.9/mw;if(fs*1.18*L.length>c.height*.9)fs=c.height*.9/(1.18*L.length);
  x.font=`${o.weight} ${fs}px ${FONT}`;x.fillStyle=o.fg;x.textAlign='center';x.textBaseline='middle';
  L.forEach((t,i)=>x.fillText(t,c.width/2,c.height/2+(i-(L.length-1)/2)*fs*1.18));
  return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex(c),transparent:o.bg==='transparent'}));};
G.canvasPlane=function(w,h,draw,ppm){ppm=ppm||256;const c=cnv(Math.round(w*ppm),Math.round(h*ppm));draw(c.getContext('2d'),c.width,c.height);const t=tex(c);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}));m.userData.canvas=c;m.userData.redraw=f=>{f(c.getContext('2d'),c.width,c.height);t.needsUpdate=true;};return m;};
G.hit=function(w,h,d){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));};
G.worldPos=o=>{const v=new THREE.Vector3();o.getWorldPosition(v);return v;};
G.glow=function(o,on,c){o.traverse(m=>{if(m.isMesh&&m.material&&m.material.emissive){if(m.userData._e===undefined)m.userData._e=m.material.emissive.getHex();m.material.emissive.setHex(on?(c||0x553300):m.userData._e);}});};

/* logo texture */
G.logoTex=null;(function(){const img=new Image();img.onload=()=>{const c=cnv(128,128);c.getContext('2d').drawImage(img,0,0,128,128);G.logoTex=tex(c);G.onLogo&&G.onLogo.forEach(f=>f());};img.src=window.LOGO_SRC;})();
G.onLogo=[];

/* ---------- avatar (gaya blok) ---------- */
function faceTex(kind){const c=cnv(128,128),x=c.getContext('2d');x.fillStyle='#1b1b1b';
  if(kind==='glasses'){x.lineWidth=6;x.strokeStyle='#1b1b1b';x.strokeRect(22,38,32,24);x.strokeRect(74,38,32,24);x.beginPath();x.moveTo(54,48);x.lineTo(74,48);x.stroke();}
  x.beginPath();x.ellipse(38,50,7,10,0,0,7);x.fill();x.beginPath();x.ellipse(90,50,7,10,0,0,7);x.fill();
  x.lineWidth=7;x.lineCap='round';x.beginPath();x.arc(64,72,22,.15*Math.PI,.85*Math.PI);x.stroke();return tex(c);}
G.avatar=function(o){o=Object.assign({skin:'#e0ac69',body:G.UNIFORM.body,stripe:G.UNIFORM.stripe,hair:'#2b1d14',hijab:null,face:'smile',name:null,cap:null,uniform:true,shirt:null,tagColor:'#fff'},o||{});
  const root=new THREE.Group();const skin=mat(o.skin,{roughness:.55});
  const bodyC=o.uniform?o.body:(o.shirt||'#c0392b');const bodyM=mat(bodyC,{roughness:.7}),pantsM=mat(o.uniform?o.body:'#2c3e50',{roughness:.75});
  const stripeM=mat(o.stripe,{emissive:o.stripe,emissiveIntensity:.15}),refM=mat(G.UNIFORM.reflect,{metalness:.6,roughness:.3});
  const torso=new THREE.Group();torso.position.y=1.1;root.add(torso);
  torso.add(mesh(new THREE.BoxGeometry(.52,.62,.27),bodyM));
  if(o.uniform){torso.add(at(box(.53,.045,.28,o.stripe,{emissive:o.stripe,emissiveIntensity:.2}),0,-.12,0));torso.add(at(box(.53,.02,.28,G.UNIFORM.reflect,{metalness:.6,roughness:.3}),0,-.155,0));
    const zip=at(box(.012,.5,.005,'#888',{metalness:.8}),0,.03,.138);torso.add(zip);
    const patch=new THREE.Mesh(new THREE.PlaneGeometry(.13,.13),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true}));at(patch,.13,.14,.137);torso.add(patch);
    const setLogo=()=>{patch.material.map=G.logoTex;patch.material.needsUpdate=true;};if(G.logoTex)setLogo();else G.onLogo.push(setLogo);
    const back=G.labelPlane('TOI',.36,.16,{bg:'transparent',fg:o.stripe,fs:120});back.rotation.y=Math.PI;at(back,0,.1,-.137);torso.add(back);}
  // collar
  torso.add(at(box(.3,.05,.2,bodyC),0,.33,0));
  const head=new THREE.Group();head.position.y=1.62;root.add(head);
  const hm=mesh(new THREE.CylinderGeometry(.19,.19,.36,20),skin);head.add(hm);
  head.add(at(sph(.19,o.skin),0,.17,0).translateY(0));head.children[1].scale.y=.25;
  head.add(at(sph(.19,o.skin),0,-.17,0));head.children[2].scale.y=.25;
  const face=new THREE.Mesh(new THREE.PlaneGeometry(.3,.3),new THREE.MeshBasicMaterial({map:faceTex(o.face),transparent:true}));at(face,0,0,.193);head.add(face);
  if(o.hijab){const hj=mat(o.hijab,{roughness:.8});const h1=mesh(new THREE.CylinderGeometry(.215,.215,.42,20,1,true,Math.PI*.72,Math.PI*1.56),hj);h1.material.side=THREE.DoubleSide;at(h1,0,.02,0);head.add(h1);
    const top=mesh(new THREE.SphereGeometry(.216,20,10,0,Math.PI*2,0,Math.PI/2),hj);at(top,0,.17,0);top.scale.y=.42;head.add(top);
    const drape=mesh(new THREE.CylinderGeometry(.22,.3,.22,20),hj);at(drape,0,-.26,0);head.add(drape);}
  else if(o.hair){const hm2=mat(o.hair,{roughness:.9});const hr=mesh(new THREE.BoxGeometry(.4,.13,.4),hm2);at(hr,0,.17,-.01);head.add(hr);head.add(at(mesh(new THREE.BoxGeometry(.4,.26,.08),hm2),0,.06,-.17));}
  if(o.cap){const cm=mat(o.cap);head.add(at(mesh(new THREE.CylinderGeometry(.205,.205,.12,20),cm),0,.2,0));head.add(at(box(.24,.025,.16,o.cap),0,.15,.24));}
  head.add(at(mesh(new THREE.CylinderGeometry(.07,.08,.1,10),skin),0,-.22,0));
  const limb=(x,y,isArm)=>{const p=new THREE.Group();p.position.set(x,y,0);const m=isArm?bodyM:pantsM;
    const L=mesh(new THREE.BoxGeometry(isArm?.22:.25,isArm?.6:.78,isArm?.24:.26),m);L.position.y=isArm?-.27:-.39;p.add(L);
    if(o.uniform){p.add(at(box(isArm?.225:.255,.04,isArm?.245:.265,o.stripe,{emissive:o.stripe,emissiveIntensity:.2}),0,isArm?-.42:-.5,0));p.add(at(box(isArm?.225:.255,.018,isArm?.245:.265,G.UNIFORM.reflect,{metalness:.6}),0,isArm?-.455:-.535,0));}
    if(isArm)p.add(at(mesh(new THREE.BoxGeometry(.2,.13,.22),skin),0,-.63,0));
    else p.add(at(box(.27,.12,.32,G.UNIFORM.shoe),0,-.74,.03));
    root.add(p);return p;};
  const armL=limb(-.38,1.38,true),armR=limb(.38,1.38,true),legL=limb(-.13,.8,false),legR=limb(.13,.8,false);
  let tag=null;if(o.name){tag=G.textSprite(o.name,{h:.24,bg:'rgba(0,0,0,.45)',fg:o.tagColor,pad:18});tag.position.y=2.15;root.add(tag);}
  const A={root,head,torso,armL,armR,legL,legR,tag,phase:0,amt:0,busy:0,
    walk(dt,speed){A.amt=lerp(A.amt,Math.min(1,speed/4),.2);A.phase+=dt*speed*2.2;const s=Math.sin(A.phase)*.75*A.amt;
      A.legL.rotation.x=s;A.legR.rotation.x=-s;if(!A.busy){A.armL.rotation.x=-s;A.armR.rotation.x=s;}A.torso.position.y=1.1+Math.abs(Math.cos(A.phase))*.04*A.amt;},
    idle(t){if(A.busy){A.armL.rotation.x=-1.1+Math.sin(t*6)*.15;A.armR.rotation.x=-1.1+Math.cos(t*6.5)*.15;}else{A.armL.rotation.z=-.05-Math.sin(t*1.5)*.03;A.armR.rotation.z=.05+Math.sin(t*1.5)*.03;}},
    wave(on){A.armR.rotation.z=on?2.6:.05;A.armR.rotation.x=0;}};
  root.traverse(m=>{if(m.isMesh){m.castShadow=true;}});
  return A;};

/* ---------- loop & anim ---------- */
G.anims=[];G.updaters=new Set();
G.anim=(dur,fn,done)=>{G.anims.push({t:0,dur,fn,done});};
G.wait=(s)=>new Promise(r=>G.anim(s,()=>{},r));
const clock=new THREE.Clock();G.T=0;

/* ---------- input ---------- */
const keys={};G.keys=keys;
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;keys[e.code]=true;if(e.code==='KeyE'||e.code==='Enter'){if(!G.ui.busy())G.tryInteract();}if(e.code==='Space'){G.jumpReq=true;e.preventDefault();}});
addEventListener('keyup',e=>{keys[e.code]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
const joy={x:0,y:0,id:null};G.joy=joy;
const joyEl=$('#joy'),joyK=$('#joyK');
function setTouch(){document.body.classList.add('touch');}
if(matchMedia('(pointer:coarse)').matches)setTouch();
addEventListener('touchstart',setTouch,{once:true,passive:true});
joyEl.addEventListener('pointerdown',e=>{joy.id=e.pointerId;joyEl.setPointerCapture(e.pointerId);joyMove(e);e.preventDefault();});
joyEl.addEventListener('pointermove',e=>{if(e.pointerId===joy.id)joyMove(e);});
const joyEnd=e=>{if(e.pointerId!==joy.id)return;joy.id=null;joy.x=joy.y=0;joyK.style.transform='';};
joyEl.addEventListener('pointerup',joyEnd);joyEl.addEventListener('pointercancel',joyEnd);
function joyMove(e){const r=joyEl.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const m=Math.hypot(dx,dy),R=r.width/2-14;if(m>R){dx*=R/m;dy*=R/m;}
  joy.x=dx/R;joy.y=dy/R;joyK.style.transform=`translate(${dx}px,${dy}px)`;}
$('#jump').addEventListener('pointerdown',e=>{G.jumpReq=true;e.preventDefault();});
// camera drag
const cam={yaw:0,pitch:.42,dist:7.5,minD:3,maxD:16};G.cam=cam;
const ptrs=new Map();let pinch=0;
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});G.initAudio();
  if(ptrs.size===2){const p=[...ptrs.values()];pinch=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}});
canvas.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;const pv=ptrs.get(e.pointerId);const dx=e.clientX-pv.x,dy=e.clientY-pv.y;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size===1){cam.yaw-=dx*.007;cam.pitch=clamp(cam.pitch+dy*.005,.08,1.25);}
  else if(ptrs.size===2){const p=[...ptrs.values()];const d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(d>0){cam.dist=clamp(cam.dist*pinch/d,cam.minD,cam.maxD);pinch=d;}}});
const endP=e=>ptrs.delete(e.pointerId);canvas.addEventListener('pointerup',endP);canvas.addEventListener('pointercancel',endP);
canvas.addEventListener('wheel',e=>{e.preventDefault();cam.dist=clamp(cam.dist*(1+Math.sign(e.deltaY)*.1),cam.minD,cam.maxD);},{passive:false});

/* ---------- player & physics ---------- */
G.colliders=[];G.BOUNDS={x0:-34,x1:34,z0:-22,z1:30};// {x0,x1,z0,z1,on}
G.addCol=(x0,x1,z0,z1)=>{const c={x0:Math.min(x0,x1),x1:Math.max(x0,x1),z0:Math.min(z0,z1),z1:Math.max(z0,z1),on:true};G.colliders.push(c);return c;};
G.addColBox=(cx,cz,w,d)=>G.addCol(cx-w/2,cx+w/2,cz-d/2,cz+d/2);
const P={pos:new THREE.Vector3(0,0,9),vy:0,yaw:Math.PI,speed:0,frozen:false,R:.38};G.P=P;
function collide(p){for(const c of G.colliders){if(!c.on)continue;const qx=clamp(p.x,c.x0,c.x1),qz=clamp(p.z,c.z0,c.z1);let dx=p.x-qx,dz=p.z-qz;const d=Math.hypot(dx,dz);
  if(d<P.R){if(d>1e-5){p.x=qx+dx/d*P.R;p.z=qz+dz/d*P.R;}else{const l=p.x-c.x0,r=c.x1-p.x,t=p.z-c.z0,b=c.z1-p.z,m=Math.min(l,r,t,b);if(m===l)p.x=c.x0-P.R;else if(m===r)p.x=c.x1+P.R;else if(m===t)p.z=c.z0-P.R;else p.z=c.z1+P.R;}}}
  const B=G.BOUNDS;p.x=clamp(p.x,B.x0,B.x1);p.z=clamp(p.z,B.z0,B.z1);}
const lerpAng=(a,b,t)=>{let d=((b-a+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;return a+d*t;};
G.teleport=(x,z,yaw)=>{P.pos.set(x,0,z);if(yaw!==undefined){P.yaw=yaw;cam.yaw=yaw+Math.PI;}};
function updatePlayer(dt){const A=G.player;if(!A)return;let ix=0,iy=0;
  if(!G.ui.busy()&&!P.frozen){if(keys.KeyW||keys.ArrowUp)iy+=1;if(keys.KeyS||keys.ArrowDown)iy-=1;if(keys.KeyA||keys.ArrowLeft)ix-=1;if(keys.KeyD||keys.ArrowRight)ix+=1;ix+=joy.x;iy-=joy.y;}
  const m=Math.min(1,Math.hypot(ix,iy));const run=(keys.ShiftLeft||keys.ShiftRight)?1.45:1;
  let vx=0,vz=0;if(m>.08){const fx=-Math.sin(cam.yaw),fz=-Math.cos(cam.yaw),rx=Math.cos(cam.yaw),rz=-Math.sin(cam.yaw);const n=Math.hypot(ix,iy);
    vx=(fx*iy+rx*ix)/n*m;vz=(fz*iy+rz*ix)/n*m;P.yaw=lerpAng(P.yaw,Math.atan2(vx,vz),Math.min(1,dt*12));}
  const sp=5.2*run;P.pos.x+=vx*sp*dt;P.pos.z+=vz*sp*dt;collide(P.pos);
  if(G.jumpReq&&P.pos.y<=0.001&&!G.ui.busy()){P.vy=6.4;G.sfx('jump');}G.jumpReq=false;
  P.vy-=20*dt;P.pos.y=Math.max(0,P.pos.y+P.vy*dt);if(P.pos.y===0)P.vy=0;
  A.root.position.copy(P.pos);A.root.rotation.y=P.yaw;A.walk(dt,m*sp*(P.pos.y>0?.3:1));
  if(P.pos.y>0){A.armL.rotation.z=-.6;A.armR.rotation.z=.6;}else{A.armL.rotation.z=lerp(A.armL.rotation.z,-.04,.3);A.armR.rotation.z=lerp(A.armR.rotation.z,.04,.3);}}
const camTarget=new THREE.Vector3();
G.cinema=null;// {pos,look} override
function updateCamera(dt){
  if(G.cinema){camera.position.lerp(G.cinema.pos,Math.min(1,dt*2.5));camTarget.lerp(G.cinema.look,Math.min(1,dt*2.5));camera.lookAt(camTarget);return;}
  const t=new THREE.Vector3(P.pos.x,P.pos.y+1.5,P.pos.z);camTarget.lerp(t,Math.min(1,dt*10));
  const d=cam.dist*(camera.aspect<.8?1.25:1),cp=Math.cos(cam.pitch);
  const want=new THREE.Vector3(camTarget.x+Math.sin(cam.yaw)*cp*d,camTarget.y+Math.sin(cam.pitch)*d,camTarget.z+Math.cos(cam.yaw)*cp*d);
  want.y=Math.max(.5,want.y);camera.position.lerp(want,Math.min(1,dt*9));camera.lookAt(camTarget);
  G.fadeWalls&&G.fadeWalls(camera.position);}

/* ---------- proximity prompts ---------- */
G.inters=[];G.addInter=o=>{o=Object.assign({r:2.2,key:'E',on:()=>true,h:1.6},o);G.inters.push(o);return o;};
let curInter=null;const pEl=$('#prompt');
pEl.addEventListener('click',()=>{G.initAudio();G.tryInteract();});
G.tryInteract=()=>{if(curInter&&!G.ui.busy()){G.sfx('tap');curInter.fn();}};
const v3=new THREE.Vector3();
function updatePrompts(){let best=null,bd=1e9;if(!G.ui.busy()&&!P.frozen)for(const it of G.inters){if(!it.on())continue;const p=typeof it.pos==='function'?it.pos():it.pos;const d=Math.hypot(p.x-P.pos.x,p.z-P.pos.z);if(d<it.r&&d<bd){bd=d;best=it;}}
  curInter=best;if(!best){pEl.style.display='none';return;}
  const p=typeof best.pos==='function'?best.pos():best.pos;v3.set(p.x,(p.y||0)+best.h,p.z).project(camera);
  if(v3.z>1){pEl.style.display='none';return;}
  const w=view.clientWidth,h=view.clientHeight;pEl.style.display='flex';pEl.style.left=clamp((v3.x+1)/2*w,90,w-90)+'px';pEl.style.top=clamp((1-v3.y)/2*h,70,h-20)+'px';
  $('#pKey').textContent=document.body.classList.contains('touch')?'👆':best.key;$('#pObj').textContent=best.obj||'';$('#pAct').textContent=typeof best.label==='function'?best.label():best.label;}

/* ---------- quest marker ---------- */
G.marker=(function(){const g=new THREE.Group();const c=cnv(128,128),x=c.getContext('2d');x.fillStyle='#f3b52f';x.beginPath();x.moveTo(64,6);x.lineTo(118,64);x.lineTo(64,122);x.lineTo(10,64);x.closePath();x.fill();x.lineWidth=8;x.strokeStyle='#fff';x.stroke();x.fillStyle='#1a1300';x.font='900 64px '+FONT;x.textAlign='center';x.textBaseline='middle';x.fillText('!',64,68);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(c),depthTest:false,transparent:true}));s.scale.set(.8,.8,1);s.renderOrder=40;g.add(s);
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,12,16,1,true),new THREE.MeshBasicMaterial({color:0xffd24a,transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide}));beam.position.y=6;g.add(beam);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.55,.75,32),new THREE.MeshBasicMaterial({color:0xffd24a,transparent:true,opacity:.7,depthWrite:false,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.03;g.add(ring);
  g.visible=false;scene.add(g);G.updaters.add((dt,t)=>{s.position.y=3.2+Math.sin(t*3)*.18;ring.scale.setScalar(1+Math.sin(t*4)*.12);});
  return {g,set(p){if(!p){g.visible=false;return;}g.visible=true;g.position.set(p.x,0,p.z);G.markerPos=p;},get pos(){return g.visible?g.position:null;}};})();

/* ---------- UI ---------- */
let modalOpen=false,dlgOpen=false;
G.ui={busy:()=>modalOpen||dlgOpen};
G.el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
G.toast=(m,k)=>{const t=G.el('div','tst pnl '+(k||''),m);$('#toasts').appendChild(t);setTimeout(()=>t.remove(),2900);};
G.modal=(build)=>{const b=$('#mbox');b.innerHTML='';build(b);$('#modal').classList.add('show');modalOpen=true;b.scrollTop=0;};
G.closeModal=()=>{$('#modal').classList.remove('show');modalOpen=false;canvas.focus();};
G.btn=(label,cls,fn)=>{const b=G.el('button','gbtn '+(cls||''),label);b.onclick=()=>{G.initAudio();G.sfx('tap');fn&&fn();};return b;};
G.row=(...btns)=>{const r=G.el('div','row');btns.forEach(b=>r.appendChild(b));return r;};
let typeT=null;
G.say=(who,text,choices)=>new Promise(res=>{const d=$('#dlg');d.style.display='block';dlgOpen=true;$('#dWho').textContent=who;const tx=$('#dTxt'),ch=$('#dCh');ch.innerHTML='';
  clearInterval(typeT);let i=0;const plain=text;tx.innerHTML='';const full=()=>{clearInterval(typeT);tx.innerHTML=plain;i=plain.length;};
  typeT=setInterval(()=>{i+=2;if(i>=plain.length){full();showCh();}else{const s=plain.slice(0,i);tx.innerHTML=s.replace(/<[^>]*$/,'');if(i%6===0)G.sfx('blip');}},22);
  const showCh=()=>{if(ch.childElementCount)return;const C=choices||[{t:'Lanjut ▸'}];C.forEach((c,k)=>{const b=G.btn(c.t,c.cls||(k===0?'y':''),()=>{d.style.display='none';dlgOpen=false;ch.innerHTML='';res(k);});ch.appendChild(b);});};
  tx.onclick=()=>{if(i<plain.length){full();showCh();}};setTimeout(()=>{if(i>=plain.length)showCh();},10);
  d.onclick=e=>{if(e.target===d||e.target===tx){if(i<plain.length){full();showCh();}}};});
G.confetti=()=>{const c=$('#confetti');const cs=['#f3b52f','#22b866','#1f8bff','#e04848','#fff'];for(let i=0;i<80;i++){const d=document.createElement('i');d.style.left=rand(0,100)+'%';d.style.background=cs[i%5];d.style.animationDuration=rand(1.8,3.4)+'s';d.style.animationDelay=rand(0,.6)+'s';c.appendChild(d);}setTimeout(()=>c.innerHTML='',4300);};
$('#qTog').parentElement.onclick=()=>{$('#quest').classList.toggle('min');$('#qTog').textContent=$('#quest').classList.contains('min')?'▸':'▾';};
G.setQuest=(title,items,cur)=>{$('#qTitle').textContent=title;const ol=$('#qList');ol.innerHTML='';items.forEach((it,i)=>{const li=G.el('li',i<cur?'done':i===cur?'now':'',`<span class="b">${i<cur?'✓':''}</span><span>${it}</span>`);ol.appendChild(li);});};

/* ---------- coins & save ---------- */
const KEY='pneumatikTOI_v1';G.KEY=KEY;
G.save={name:'',coins:200,tp:{}};try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)Object.assign(G.save,s);}catch(e){}
G.persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(G.save));}catch(e){}};
let shownCoins=G.save.coins;
G.addCoins=(n,why)=>{G.save.coins=Math.round(G.save.coins+n);G.persist();if(why)G.toast(`${n>=0?'+':''}${G.fmt(n)} ¢ · ${why}`,n>=0?'gold':'bad');if(n>0)G.sfx('coin');};
function updCoins(){shownCoins=lerp(shownCoins,G.save.coins,.15);if(Math.abs(shownCoins-G.save.coins)<1)shownCoins=G.save.coins;$('#coins').textContent=G.fmt(shownCoins);}

/* ---------- audio ---------- */
let actx=null,muted=false;
G.initAudio=()=>{if(actx)return;try{actx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}};
function tone(f,d,type,vol,when,slide){if(!actx||muted)return;try{const t0=actx.currentTime+(when||0),o=actx.createOscillator(),g=actx.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t0+d);
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol||.12,t0+.01);g.gain.exponentialRampToValueAtTime(.001,t0+d);o.connect(g);g.connect(actx.destination);o.start(t0);o.stop(t0+d+.05);}catch(e){}}
G.sfx=k=>{if(!actx)return;if(actx.state==='suspended')actx.resume();
  ({ok:()=>{tone(660,.12,'triangle',.16);tone(990,.18,'triangle',.16,.1);},bad:()=>tone(150,.3,'sawtooth',.1),tap:()=>tone(560,.05,'square',.05),blip:()=>tone(820,.03,'square',.025),
    coin:()=>{tone(988,.08,'square',.07);tone(1319,.25,'square',.07,.08);},jump:()=>tone(300,.18,'sine',.1,0,700),build:()=>{tone(200,.2,'square',.09,0,90);tone(520,.2,'triangle',.12,.18);},
    win:()=>[523,659,784,1046,1318].forEach((f,i)=>tone(f,.25,'triangle',.15,i*.11)),truck:()=>tone(80,.8,'sawtooth',.05,0,60),beep:()=>tone(1200,.08,'sine',.08)}[k]||(()=>{}))();};
$('#sndBtn').onclick=()=>{muted=!muted;$('#sndBtn').textContent=muted?'🔇':'🔊';};

/* ---------- main loop ---------- */
G.start=()=>{resize();(function loop(){requestAnimationFrame(loop);const ts=G.timeScale||1;const dt=Math.min(clock.getDelta(),.05)*ts;G.T+=dt;
  for(let i=G.anims.length-1;i>=0;i--){const a=G.anims[i];a.t+=dt;const k=Math.min(a.t/a.dur,1);a.fn(k);if(k>=1){G.anims.splice(i,1);a.done&&a.done();}}
  G.updaters.forEach(f=>f(dt,G.T));updatePlayer(dt);updateCamera(dt);updatePrompts();updCoins();
  if(G.marker.pos){const d=Math.hypot(G.marker.pos.x-P.pos.x,G.marker.pos.z-P.pos.z);$('#qDist').textContent=d>3?`➜ ${Math.round(d)} m menuju tanda ◆`:'';}else $('#qDist').textContent=G.radar||'';
  sun.position.set(P.pos.x+18,30,P.pos.z+16);sun.target.position.set(P.pos.x,0,P.pos.z);
  renderer.render(scene,camera);})();};
})();
