/* Pneumatik Tycoon — stasiun elektropneumatik bersama (Level 11–12): model 3D trainer, simulasi rangkaian, gambar rangkaian, papan pengawatan */
(function(){
'use strict';
const {scene,mesh,mat,box,cyl,sph,at,el,btn,row,modal,W}=G;const cx=W.cx,cz=W.cz;
const SX=8.3,SZ=.9,MT={metalness:.7,roughness:.3},YE='#f2c200',BU='#1f6fd0';
const E=G.EP={air:false,v24:false,S1:false,S2:false,ovA:false,ovB:false,x:0,vpos:'B',stage:0,f:{},p:5,led:{},wires:[],SX,SZ};
const led=(g,x,y,z,c)=>{const m=sph(.013,'#2a1010',{emissive:c||'#ff3b30',emissiveIntensity:0});m.position.set(x,y,z);g.add(m);return m;};
const L=(m,on)=>{m.material.emissiveIntensity=on?2.6:0;};
const lp=(g,t,w,h,x,y,z,bg,fg)=>{const ls=Array.isArray(t)?t:[t],ppm=Math.min(1500,820/w);g.add(at(G.canvasPlane(w,h,(c,W2,H2)=>{c.fillStyle=bg||'#1d3557';c.fillRect(0,0,W2,H2);c.fillStyle=fg||'#fff';c.textAlign='center';c.textBaseline='middle';let fs=H2/ls.length*.66;c.font=`700 ${fs}px Arial,sans-serif`;const mw=Math.max(...ls.map(q=>c.measureText(q).width));if(mw>W2*.92){fs*=W2*.92/mw;c.font=`700 ${fs}px Arial,sans-serif`;}ls.forEach((q,i)=>c.fillText(q,W2/2,H2*(i+.5)/ls.length+fs*.04));},ppm),x,y,z));};

/* ---------- model 3D ---------- */
E.build=()=>{const S=new THREE.Group();S.position.set(SX,0,SZ);scene.add(S);E.S=S;const zf=-.2;
  S.add(at(box(3.1,.06,.9,'#8a6d4a',{roughness:.7}),0,.86,0),at(box(3,.04,.8,'#3b444c'),0,.3,0));[[-1.45,-.38],[1.45,-.38],[-1.45,.38],[1.45,.38]].forEach(q=>S.add(at(box(.07,.86,.07,'#2b3036'),q[0],.43,q[1])));
  S.add(at(box(2.8,1.24,.04,'#c9ced3',{metalness:.6,roughness:.4}),0,1.52,-.32));for(let i=0;i<10;i++)S.add(at(box(2.76,.012,.005,'#8d98a0'),0,.98+i*.12,-.298));[-1.3,1.3].forEach(x=>S.add(at(box(.06,1.3,.3,'#5a6b7b',{metalness:.4}),x,1.5,-.42)));
  /* panel kontrol */
  S.add(at(box(.8,1.02,.02,'#f4f4f1',{roughness:.6}),-.92,1.5,-.285));[2.02,.98].forEach(y=>S.add(at(box(.86,.03,.16,'#5a6b7b'),-.92,y,-.22)));[-1.335,-.505].forEach(x=>S.add(at(box(.03,1.07,.16,'#5a6b7b'),x,1.5,-.22)));
  S.add(at(box(.72,.035,.012,'#b9c2c9',MT),-.92,1.74,-.268),at(box(.72,.06,.06,'#aab3bb'),-.92,1.5,-.245),at(box(.06,.36,.06,'#aab3bb'),-.56,1.3,-.245));
  S.add(at(box(.07,.17,.1,'#f1f1ee',{roughness:.5}),-1.2,1.74,-.21),at(box(.03,.045,.03,BU),-1.2,1.76,-.15));
  S.add(at(box(.24,.22,.13,'#9aa3ab',MT),-.97,1.74,-.2));E.led.G1=led(S,-.89,1.81,-.133,'#22ff66');
  S.add(at(box(.09,.07,.09,'#22272c'),-.68,1.69,-.215));const kc=new THREE.Mesh(new THREE.BoxGeometry(.08,.13,.08),new THREE.MeshStandardMaterial({color:G.col('#f39c12'),transparent:true,opacity:.55,roughness:.2}));kc.position.set(-.68,1.79,-.215);S.add(kc);E.led.K1=led(S,-.68,1.84,-.172);
  S.add(at(box(.36,.08,.08,'#15181d'),-1.02,1.1,-.235));for(let i=0;i<5;i++)S.add(at(cz(.012,.01,'#c9d1d8',MT,8),-1.15+i*.065,1.1,-.193));
  S.add(W.tube([[-1.12,.9,-.2],[-1.12,1,-.2],[-1.12,1.06,-.22]],.02,YE,{roughness:.6},12),at(cyl(.03,.03,.04,'#8d98a0',MT,10),-1.12,.985,-.2));
  lp(S,'PANEL KONTROL',.5,.07,-.92,2.075,-.2,'#f3b52f','#1a1300');lp(S,'Q1',.09,.045,-1.2,1.86,-.27,'#fff','#111');lp(S,'G1 · 24 VDC',.2,.045,-.97,1.74,-.133,'#fff','#111');lp(S,'K1',.09,.045,-.68,1.9,-.27,'#fff','#111');lp(S,'X1 · TB-1512',.3,.045,-1.02,1.19,-.27,'#fff','#111');lp(S,['SUMBER 220 V','masuk dari bawah'],.3,.07,-.7,1.24,-.27,'#fff','#c62828');
  /* F.R.L mini */
  S.add(at(box(.16,.16,.14,'#cdc4a6',{metalness:.55,roughness:.38}),-.28,1.62,zf),at(cyl(.045,.05,.09,'#15181d',{roughness:.6},18),-.28,1.745,zf));
  const bw=new THREE.Mesh(new THREE.CylinderGeometry(.06,.055,.16,20),new THREE.MeshStandardMaterial({color:G.col('#eaf6ff'),transparent:true,opacity:.3,roughness:.05,depthWrite:false}));bw.position.set(-.28,1.46,zf);S.add(bw);
  E.gauge=W.gauge(.15,0,10,[4.5,5.5]);E.gauge.position.set(-.28,1.62,zf+.075);S.add(E.gauge);E.gv=0;lp(S,'F.R.L',.14,.045,-.28,1.33,-.29,'#1d3557');
  S.add(W.tube([[-.44,.9,-.1],[-.46,1.3,-.16],[-.42,1.6,zf],[-.37,1.62,zf]],.016,'#5cbcff',{roughness:.45},30),W.tube([[-.2,1.62,zf],[-.06,1.58,-.17],[.1,1.08,-.15],[.33,1.02,-.17],[.35,1.14,zf]],.014,'#5cbcff',{roughness:.45},40));
  /* katup 5/2 double solenoid */
  const V=new THREE.Group();V.position.set(.35,1.22,zf);S.add(V);V.add(box(.28,.09,.09,'#c4c9ce',MT));[-1,1].forEach(s=>{V.add(at(box(.1,.085,.085,'#15181d',{roughness:.5}),s*.19,0,0),at(box(.075,.07,.075,'#22272c'),s*.19,.078,0),at(cyl(.014,.011,.05,'#a98a58',{metalness:.5,roughness:.7},10),s*.09,-.07,0));
    const o=cz(.013,.014,'#d62828',null,10);o.position.set(s*.1,0,.05);V.add(o);V.add(W.fit(s*.06,.045,0,''));});
  V.add(W.fit(0,-.045,0,'down'));E.led.Y1=led(V,-.19,.085,.04);E.led.Y2=led(V,.19,.085,.04);lp(V,'Y1',.09,.045,-.19,.16,-.06,'#fff','#111');lp(V,'Y2',.09,.045,.19,.16,-.06,'#fff','#111');lp(V,'KATUP 5/2 · AirTAC 4V120-06',.42,.05,0,-.15,-.08,'#1d3557');
  /* silinder kerja ganda magnetik */
  const C=new THREE.Group();C.position.set(0,1.78,zf);S.add(C);C.add(at(box(.07,.12,.12,'#b9c2c9',MT),.12,0,0),at(cx(.05,.4,'#dfe4e8',{metalness:.9,roughness:.2},24),.35,0,0),at(box(.07,.12,.12,'#b9c2c9',MT),.58,0,0),at(box(.05,.09,.04,'#59636c'),.07,0,-.06));
  E.rod=new THREE.Group();E.rod.add(cx(.018,.34,'#f2f4f6',{metalness:1,roughness:.08},14),at(cyl(.03,.03,.03,'#8d98a0',MT,6).rotateZ(Math.PI/2),.15,0,0),at(box(.05,.07,.06,'#59636c',{metalness:.5}),.19,0,0));E.rod.position.set(.47,0,0);C.add(E.rod);
  [.12,.58].forEach(x=>C.add(at(cyl(.016,.016,.05,'#c9d1d8',MT,10),x,.085,0),at(cyl(.022,.022,.03,'#15181d',null,12),x,.125,0),at(cyl(.02,.02,.012,'#1f8bff',null,12),x,.065,0)));
  const reed=(x,k)=>{const g=new THREE.Group();g.position.set(x,0,.056);g.add(box(.075,.03,.03,'#15181d'),at(box(.012,.11,.004,'#8d98a0',MT),0,0,-.004));E.led[k]=led(g,.022,0,.017);lp(g,k,.07,.04,0,-.075,-.02,'#fff','#111');C.add(g);return g;};reed(.2,'a0');E.reedA1=reed(.5,'a1');
  lp(C,'SILINDER KERJA GANDA · MA25×100',.5,.05,.35,.25,-.08,'#1d3557');
  const hose=p=>W.tube(p,.012,'#5cbcff',{roughness:.45},40);E.hN=new THREE.Group();E.hN.add(hose([[.29,1.31,zf],[.27,1.5,-.13],[.08,1.62,-.11],[.05,1.86,-.15],[.12,1.92,zf]]),hose([[.41,1.31,zf],[.46,1.5,-.13],[.67,1.62,-.11],[.67,1.86,-.15],[.58,1.92,zf]]));
  E.hS=new THREE.Group();E.hS.add(hose([[.29,1.31,zf],[.3,1.5,-.12],[.6,1.64,-.1],[.66,1.86,-.15],[.58,1.92,zf]]),hose([[.41,1.31,zf],[.4,1.5,-.15],[.12,1.64,-.14],[.05,1.86,-.15],[.12,1.92,zf]]));E.hS.visible=false;S.add(E.hN,E.hS);
  /* kotak tombol */
  const B=new THREE.Group();B.position.set(1.05,.95,.12);S.add(B);B.add(box(.38,.13,.22,'#e9edf0',{roughness:.5}));E.bS1=at(cyl(.04,.04,.03,'#22b866',{emissive:'#0c4a26'},18),-.09,.08,0);E.bS2=at(cyl(.04,.04,.03,'#f3b52f',{emissive:'#4a3600'},18),.09,.08,0);B.add(E.bS1,E.bS2);
  lp(B,'S1 MAJU',.16,.045,-.09,0,.112,'#22b866');lp(B,'S2 MUNDUR',.16,.045,.09,0,.112,'#f3b52f','#1a1300');
  /* kabel: tahap 1 kuning (daya), tahap 2–3 biru (kontrol 24 VDC) */
  const wire=(p,c)=>W.tube(p,.008,c===BU?'#1546b0':c,{roughness:.6},30),tm=(x,y,z)=>at(cyl(.011,.011,.035,'#ffffff',{roughness:.5},8),x,y,z);E.wg=[null,new THREE.Group(),new THREE.Group(),new THREE.Group()];
  E.wg[1].add(wire([[-1.15,1.14,-.2],[-1.2,1.3,-.17],[-1.2,1.65,-.17]],YE),wire([[-1.2,1.83,-.17],[-1.16,1.92,-.15],[-1.04,1.9,-.15],[-1.03,1.85,-.15]],YE),wire([[-.95,1.14,-.2],[-.86,1.32,-.16],[-.9,1.63,-.15]],YE),tm(-1.2,1.36,-.17),tm(-.87,1.36,-.16));
  E.wg[2].add(wire([[-.95,1.63,-.14],[-.9,1.5,-.2],[-.56,1.47,-.2],[-.5,1.03,-.19],[.62,.99,-.19],[1,.99,-.02],[1.05,.93,.02]],BU),wire([[-.5,1.01,-.2],[.05,1,-.2],[.16,1.1,-.16],[.16,1.3,-.16]],BU),wire([[.1,.99,-.2],[.5,.99,-.2],[.56,1.1,-.16],[.54,1.3,-.16]],BU),tm(.16,1.24,-.16),tm(.54,1.24,-.16),tm(-.5,1.1,-.19));
  E.wg[3].add(wire([[-.56,1.5,-.2],[-.4,1.9,-.24],[.2,2.0,-.24],[.48,1.9,-.16],[.5,1.8,-.13]],BU),wire([[-.68,1.66,-.17],[-.64,1.56,-.19],[-.58,1.5,-.2]],BU),tm(.48,1.9,-.16));
  E.wg.forEach(g=>{if(g){g.visible=false;S.add(g);}});
  const sp=G.textSprite('Stasiun elektropneumatik',{h:.26,bg:'rgba(29,53,87,.9)'});sp.position.set(0,2.4,-.2);S.add(sp);E.sp=sp;G.addColBox(SX,SZ-.1,3.2,1.1);
  const mt=new THREE.Mesh(new THREE.PlaneGeometry(4.2,2.6),new THREE.MeshStandardMaterial({color:G.col('#24405f'),transparent:true,opacity:.5,roughness:.9}));mt.rotation.x=-Math.PI/2;mt.position.set(SX,.012,SZ+1.1);scene.add(mt);
  G.updaters.add(E.tick);};
E.setStage=n=>{E.stage=n;for(let i=1;i<=3;i++)E.wg[i].visible=i<=n;};
E.fault=f=>{E.f=f||{};E.hS.visible=!!E.f.swap;E.hN.visible=!E.f.swap;E.reedA1.position.x=E.f.reed?.38:.5;};
E.tick=dt=>{const f=E.f,a1=E.x>.96&&!f.reed&&E.v24&&E.stage>=3,K1=a1,y1=E.v24&&E.stage>=2&&E.S1&&!f.wire,y2=E.v24&&E.stage>=2&&(E.S2||K1),A=(y1&&!f.coil)||E.ovA,B=y2||E.ovB;
  if(A&&!B)E.vpos='A';else if(B&&!A)E.vpos='B';let tg=E.vpos==='A'?1:0;if(f.swap)tg=1-tg;
  const sp=E.air?(f.fc?0:1)*(f.leak?.22:1)*(f.lowp?.28:1)*1.15:0,rem=tg-E.x,stp=sp*dt;E.moving=Math.abs(rem)>.001&&sp>0;if(E.moving){if(Math.abs(rem)<=stp)E.x=tg;else E.x+=Math.sign(rem)*stp;}
  E.rod.position.x=.47+E.x*.2;L(E.led.Y1,y1);L(E.led.Y2,y2);L(E.led.K1,K1);L(E.led.G1,E.v24);L(E.led.a1,a1);E.bS1.position.y=E.S1?.068:.08;E.bS2.position.y=E.S2?.068:.08;
  const pv=E.air?(f.lowp?2:E.p)-(f.leak&&E.moving?2:0):0;E.gv=G.lerp(E.gv,pv,Math.min(1,dt*3));if(Math.abs(E.gv-(E.gd||0))>.07){E.gd=E.gv;E.gauge.userData.set(E.gv);}
  E.y1=y1;E.y2=y2;E.K1=K1;E.a1=a1;};
E.press=async(k,dur)=>{E[k]=true;G.sfx('tap');await G.wait(dur);E[k]=false;};
E.cam=(close)=>{const k=G.camera.aspect<1?1.7:1,t=[SX+.1,1.5,SZ-.2],c=close?[SX+.35,1.95,SZ+1.75]:[SX-.2,1.8,SZ+2.9];if(G.player)G.player.root.visible=false;E.sp.visible=false;G.cinema={pos:new THREE.Vector3(t[0]+(c[0]-t[0])*k,t[1]+(c[1]-t[1])*k,t[2]+(c[2]-t[2])*k),look:new THREE.Vector3(t[0],close?1.0:1.2,t[2])};G.P.frozen=true;};
E.uncam=()=>{G.cinema=null;G.P.frozen=false;if(G.player)G.player.root.visible=true;E.sp.visible=true;};

/* ---------- gambar rangkaian kelistrikan (rel +24 V di atas, 0 V di bawah) ---------- */
G.epDiagram=stage=>{const o=s=>s>stage?' opacity=".22"':'',t=(x,y,s,a,c,z)=>`<text x="${x}" y="${y}" font-size="${z||12}" font-weight="700" font-family="Arial,sans-serif" text-anchor="${a||'start'}" fill="${c||'#12325e'}" stroke="none">${s}</text>`;
  const no=(x,n,a,b2,ye)=>`<path d="M${x},40V80M${x},112V${ye||190}M${x-10},82L${x},112"/>`+t(x-16,100,n,'end')+t(x+5,78,a,'start','#5b6b7a',10)+t(x+5,124,b2,'start','#5b6b7a',10);
  const coil=(x,n,d)=>`<rect x="${x-15}" y="190" width="30" height="24" fill="#fff"/>${d?`<path d="M${x-15},214L${x+15},190"/>`:''}<path d="M${x},214V262"/>`+t(x+20,207,n);
  return `<svg viewBox="0 0 560 292" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:auto;display:block;min-width:480px" role="img" aria-label="Gambar rangkaian kelistrikan">
  <g stroke="#c9a000"${o(1)}><path d="M22,80H68M100,80H148M22,222H148"/><rect x="68" y="68" width="32" height="24" fill="#fff"/><rect x="148" y="58" width="54" height="186" fill="#fff" stroke="#12325e"/>${t(30,72,'L',null,'#8a6d00')}${t(112,72,'L1',null,'#8a6d00')}${t(80,214,'N',null,'#8a6d00')}${t(84,60,'Q1','middle')}${t(175,146,'G1','middle')}${t(175,164,'~ / =','middle','#5b6b7a',11)}${t(8,84,'X1','start','#5b6b7a',10)}${t(8,226,'X1','start','#5b6b7a',10)}</g>
  <g stroke="${BU}"${o(2)}><path d="M202,75H216V40H536M202,227H216V262H536"/>${t(376,30,'+24 V   ·   kabel nomor 1','middle',BU)}${t(376,282,'0 V   ·   kabel nomor 2','middle',BU)}
   ${no(262,'S1','13','14')}${t(270,156,'3',null,'#c62828',14)}${coil(262,'Y1',1)}${no(350,'S2','13','14')}${t(358,160,'4',null,'#c62828',14)}${coil(350,'Y2',1)}</g>
  <g stroke="${BU}"${o(3)}>${no(410,'K1','13','14',130)}<path d="M410,130H350"/>${no(490,'a1','BN','BU')}${t(498,156,'5',null,'#c62828',14)}${coil(490,'K1',0)}${t(470,206,'A1','end','#5b6b7a',10)}</g></svg>`;};

/* ---------- papan pengawatan ---------- */
const TP={'Q1:1':[40,104],'Q1:2':[80,104],'G1:L':[150,104],'G1:N':[200,104],'G1:+':[250,104],'G1:−':[300,104],'S1:13':[375,104],'S1:14':[425,104],'S2:13':[495,104],'S2:14':[545,104],'a1:BN':[630,104],'a1:BU':[700,104],'X1:L':[60,278],'X1:N':[120,278],'K1:A1':[235,278],'K1:A2':[290,278],'K1:13':[345,278],'K1:14':[395,278],'Y1:1':[480,278],'Y1:2':[530,278],'Y2:1':[620,278],'Y2:2':[670,278]};
const LANE={L:150,L1:162,N:174,'1':186,'2':198,'3':210,'4':222,'5':234};
const NET={'X1:L':'L','Q1:1':'L','Q1:2':'L1','G1:L':'L1','X1:N':'N','G1:N':'N','G1:+':'1','S1:13':'1','S2:13':'1','a1:BN':'1','K1:13':'1','G1:−':'2','Y1:2':'2','Y2:2':'2','K1:A2':'2','S1:14':'3','Y1:1':'3','S2:14':'4','Y2:1':'4','K1:14':'4','a1:BU':'5','K1:A1':'5'};
const TST={X1:1,Q1:1,'G1:L':1,'G1:N':1,'G1:+':2,'G1:−':2,S1:2,S2:2,Y1:2,Y2:2,a1:3,K1:3},stOf=t=>TST[t]||TST[t.split(':')[0]],colOf=n=>/^[LN]/.test(n)?'k':'b';
const BLK=[['Q1 · MCB',16,42,88,78,1],['G1 · power supply 24 VDC',122,42,206,78,1],['S1 · MAJU',348,42,104,78,2],['S2 · MUNDUR',468,42,104,78,2],['a1 · reed switch depan',592,42,146,78,3],['X1 · terminal TB-1512',22,262,136,78,1],['K1 · relay',204,262,222,78,3],['Y1 · koil maju',448,262,114,78,2],['Y2 · koil mundur',588,262,114,78,2]];
const MK={1:['L','L1','N'],2:['1','2','3','4'],3:['1','2','4','5']};E.NET=NET;
G.wireBoard=(stage,title,intro,sc,done)=>{let sel=null,color=stage===1?'k':'b',mark=MK[stage][0],first=true,locked=false;const CC={k:'#e0b400',b:BU};
  modal(b=>{b.appendChild(el('div','kick',`Pengawatan · tahap ${stage} dari 3`));b.appendChild(el('h2','',title));b.appendChild(el('div','',intro));b.appendChild(el('div','dgw',G.epDiagram(stage)));
    const ctl=el('div');b.appendChild(ctl);const hint=el('div','spec');hint.style.margin='8px 0 0';b.appendChild(hint);const bd=el('div','dgw');bd.style.marginTop='6px';b.appendChild(bd);const fb=el('div');b.appendChild(fb);
    const drawCtl=()=>{ctl.innerHTML='';const r1=row();r1.appendChild(el('span','',`<b style="font:700 13px var(--game);color:#9fb0bf">Gulungan kabel:</b>`));[['k','🟡 Kuning'],['b','🔵 Biru']].forEach(c=>r1.appendChild(btn(c[1],color===c[0]?'y':'gr',()=>{color=c[0];drawCtl();})));
      r1.appendChild(el('span','',`<b style="font:700 13px var(--game);color:#9fb0bf;margin-left:8px">Tube marking:</b>`));MK[stage].forEach(m=>r1.appendChild(btn(m,mark===m?'y':'gr',()=>{mark=m;drawCtl();})));ctl.appendChild(r1);};
    const draw=()=>{const p=[];p.push(`<rect x="8" y="138" width="744" height="106" rx="6" fill="#e3e8ec" stroke="#aab3bb" stroke-width="2"/>`+[...Array(30)].map((_,i)=>`<rect x="${20+i*24.5}" y="140" width="7" height="5" fill="#aab3bb"/><rect x="${20+i*24.5}" y="237" width="7" height="5" fill="#aab3bb"/>`).join('')+`<text x="744" y="232" font-size="10.5" font-weight="700" font-family="Arial,sans-serif" text-anchor="end" fill="#8d98a0">KABEL DUCT</text>`);
      BLK.forEach(k=>{const dim=k[5]>stage,top=k[2]<130;p.push(`<g opacity="${dim?.25:1}"><rect x="${k[1]}" y="${k[2]}" width="${k[3]}" height="${k[4]}" rx="8" fill="#eef2f5" stroke="#8fa3b5" stroke-width="2"/><text x="${k[1]+k[3]/2}" y="${top?k[2]-7:k[2]+k[4]+15}" font-size="12" font-weight="700" font-family="Arial,sans-serif" text-anchor="middle" fill="#12325e">${k[0]}</text></g>`);});
      const tags=[];E.wires.forEach((w,i)=>{const a=TP[w.a],c=TP[w.b],ly=LANE[w.m]||192,sa=a[1]<ly?1:-1,sc2=c[1]<ly?1:-1,dx=c[0]-a[0],r=Math.min(7,Math.abs(dx)/2),sx=Math.sign(dx)||1;
        const d=`M${a[0]},${a[1]+sa*9}V${ly-sa*r}Q${a[0]},${ly} ${a[0]+sx*r},${ly}H${c[0]-sx*r}Q${c[0]},${ly} ${c[0]},${ly-sc2*r}V${c[1]+sc2*9}`;
        p.push(`<g data-w="${i}" style="cursor:${w.st===stage?'pointer':'default'}"><path d="${d}" fill="none" stroke="#12325e" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${CC[w.c]}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>`);
        [[a,sa],[c,sc2]].forEach(q=>tags.push(`<g data-w="${i}"><rect x="${q[0][0]-10}" y="${q[0][1]+q[1]*21-7.5}" width="20" height="15" rx="4" fill="#fff" stroke="#12325e" stroke-width="1.2"/><text x="${q[0][0]}" y="${q[0][1]+q[1]*21+4.2}" font-size="11" font-weight="700" font-family="Arial,sans-serif" text-anchor="middle" fill="#111">${w.m}</text></g>`));});p.push(tags.join(''));
      Object.keys(TP).forEach(k=>{const q=TP[k],dim=stOf(k)>stage,up=q[1]<130;p.push(`<g opacity="${dim?.25:1}" ${dim?'':`data-t="${k}" style="cursor:pointer"`}><circle cx="${q[0]}" cy="${q[1]}" r="17" fill="rgba(0,0,0,0)"/><circle cx="${q[0]}" cy="${q[1]}" r="9" fill="${sel===k?'#f3b52f':'#fff'}" stroke="${sel===k?'#c62828':'#12325e'}" stroke-width="2.5"/><circle cx="${q[0]}" cy="${q[1]}" r="3" fill="#8d98a0"/><text x="${q[0]}" y="${up?q[1]-15:q[1]+24}" font-size="11.5" font-weight="700" font-family="Arial,sans-serif" text-anchor="middle" fill="#12325e">${k.split(':')[1]}</text></g>`);});
      hint.innerHTML=sel?`Terminal <b>${sel}</b> dipilih — ketuk terminal tujuannya (atau ketuk lagi untuk batal).`:'Ketuk <b>terminal pertama</b>, lalu <b>terminal tujuan</b>. Kabel otomatis masuk ke kabel duct dan merapikan diri; kabel bernomor sama berjalan di jalur yang sama.';
      bd.innerHTML=`<svg viewBox="0 0 760 362" style="width:100%;height:auto;display:block;min-width:600px;touch-action:manipulation">${p.join('')}</svg>`;};
    bd.addEventListener('click',e=>{if(locked)return;G.initAudio();const t=e.target.closest('[data-t]'),w=e.target.closest('[data-w]');
      if(t){const k=t.getAttribute('data-t');if(!sel){sel=k;G.sfx('tap');}else if(sel===k)sel=null;else{if(!E.wires.some(x=>(x.a===sel&&x.b===k)||(x.a===k&&x.b===sel))){E.wires.push({a:sel,b:k,c:color,m:mark,st:stage});G.sfx('blip');}sel=null;}fb.innerHTML='';draw();}
      else if(w){const i=+w.getAttribute('data-w');if(E.wires[i].st===stage){E.wires.splice(i,1);G.sfx('tap');draw();}}});
    const check=()=>{const er=[],cnt={};E.wires.forEach(w=>{cnt[w.a]=(cnt[w.a]||0)+1;cnt[w.b]=(cnt[w.b]||0)+1;});Object.keys(cnt).forEach(k=>{if(cnt[k]>2)er.push(`Terminal <b>${k}</b> memuat ${cnt[k]} kabel. Paling banyak <b>dua skun</b> pada satu terminal — lanjutkan dari terminal lain pada nomor kabel yang sama.`);});
      E.wires.filter(w=>w.st===stage).forEach(w=>{const na=NET[w.a],nb=NET[w.b],pr=`${w.a} – ${w.b}`;
        if(na!==nb){const s=[na,nb].sort().join();er.push(s==='1,2'?`⚡ <b>HUBUNG SINGKAT</b>: ${pr} menyambung +24 V langsung ke 0 V. Power supply akan mati mendadak.`:(/^[LN]/.test(na)&&/^[LN]/.test(nb)&&(na==='N'||nb==='N'))?`⚡ <b>HUBUNG SINGKAT</b>: ${pr} menyambung fasa ke netral. MCB akan trip.`:(colOf(na)!==colOf(nb))?`☠️ ${pr} menyambung <b>220 VAC ke rangkaian 24 VDC</b>. Koil dan sensor akan terbakar.`:`${pr} tidak tersambung langsung pada gambar. Akibatnya koil yang salah akan menyala.`);}
        else{if(w.m!==na)er.push(`Tube marking kabel ${pr} tertulis “${w.m}”, padahal pada gambar nomornya “<b>${na}</b>”. Inspeksi akan gagal.`);if(w.c!==colOf(na))er.push(`Kabel ${pr} seharusnya <b>${colOf(na)==='k'?'kuning (jalur daya 220 VAC)':'biru (rangkaian kontrol 24 VDC)'}</b>.`);}});
      MK[stage].forEach(n=>{const ts=Object.keys(NET).filter(k=>NET[k]===n&&stOf(k)<=stage),par={};ts.forEach(k=>par[k]=k);const fd=k=>par[k]===k?k:(par[k]=fd(par[k]));E.wires.forEach(w=>{if(NET[w.a]===n&&NET[w.b]===n)par[fd(w.a)]=fd(w.b);});
        const lone=ts.filter(k=>fd(k)!==fd(ts[0]));if(lone.length)er.push(`Kabel nomor <b>${n}</b> belum lengkap: <b>${lone.join(', ')}</b> belum tersambung dengan ${ts[0]}.`);});
      if(er.length){first=false;G.sfx('bad');fb.innerHTML=`<div class="fb bad">❌ ${er.slice(0,3).join('<br>❌ ')}${er.length>3?`<br>… dan ${er.length-3} catatan lain.`:''}<br><small>Ketuk sebuah kabel untuk mencabutnya.</small></div>`;b.scrollTop=b.scrollHeight;return;}
      locked=true;sc(first);G.sfx('ok');rw.remove();ctl.remove();fb.innerHTML='';done(b,first);b.scrollTop=b.scrollHeight;};
    const rw=row(btn('Periksa ✓','y',check),btn('↺ Cabut kabel tahap ini','gr',()=>{E.wires=E.wires.filter(w=>w.st!==stage);sel=null;fb.innerHTML='';draw();}));b.appendChild(rw);drawCtl();draw();});};
/* kabel benar untuk tahap tertentu (dipakai Level 12 dan uji otomatis) */
E.preset=n=>{const P={1:[['X1:L','Q1:1','L'],['Q1:2','G1:L','L1'],['X1:N','G1:N','N']],2:[['G1:+','S1:13','1'],['S1:13','S2:13','1'],['G1:−','Y1:2','2'],['Y1:2','Y2:2','2'],['S1:14','Y1:1','3'],['S2:14','Y2:1','4']],3:[['S2:13','a1:BN','1'],['a1:BN','K1:13','1'],['Y2:2','K1:A2','2'],['a1:BU','K1:A1','5'],['K1:14','Y2:1','4']]};
  E.wires=E.wires.filter(w=>w.st!==n);P[n].forEach(q=>E.wires.push({a:q[0],b:q[1],c:colOf(q[2]),m:q[2],st:n}));};
})();
