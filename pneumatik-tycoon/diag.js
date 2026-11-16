/* Pneumatik Tycoon — pembangun gambar rangkaian yang bisa diketuk, tanya bergambar, keadaan bengkel aman */
(function(){
'use strict';
const {el,btn,row,modal,W}=G,I=G.SYMI,use=G.symUse,T=G.symT,ah=G.symAh,N=G.SYMN,D='stroke-dasharray="5 4"';
G.safeWorld=()=>{W.puddle.visible=false;W.drop.visible=false;const g=W.guard,b=W.guardOn;g.position.set(b[0],b[1],b[2]);g.rotation.set(b[3],b[4],b[5]);W.sparkOn=false;W.bare.visible=false;W.leakOn=false;W.hoseMessy.visible=false;W.hoseTidy.visible=true;W.clips.forEach(c=>c.visible=true);W.regGauge.userData.set(5);W.tankGauge.userData.set(8);};
const st=document.createElement('style');st.textContent=`.symopts.pic small{display:block;font:600 12.5px/1.25 var(--game);color:#12325e;margin-top:3px}.symopts.pic svg{max-height:104px}.symopts.c3{grid-template-columns:repeat(3,1fr)}@media (max-width:560px){.symopts.c3{grid-template-columns:1fr 1fr}}
.dgw .hs:hover{fill:rgba(243,181,47,.22)}.lic{background:linear-gradient(135deg,#243447,#1a2430);border:2px solid var(--accent);border-radius:14px;padding:10px 12px;margin:8px 0;text-align:center}.lic .jh{font:700 11.5px var(--game);letter-spacing:.08em;color:var(--accent)}.lic h3{margin:2px 0 4px;font:700 19px var(--game)}`;document.head.appendChild(st);
/* tanya dengan pilihan bergambar: opts [{svg,cap,ok,why}] */
G.askPic=(kick,title,top,opts,done,sc,cols)=>{let first=true;modal(b=>{b.appendChild(el('div','kick',kick));b.appendChild(el('h2','',title));if(top)b.appendChild(el('div','',top));const fb=el('div');const g=el('div','symopts pic'+(cols===3?' c3':''));
  const bs=G.shuffle(opts).map(o=>{const x=el('button','',o.svg+`<small>${o.cap}</small>`);x.onclick=()=>{if(x.disabled)return;G.initAudio();if(o.ok){bs.forEach(z=>z.disabled=true);x.className='ok';sc(first);G.sfx('ok');fb.innerHTML='';done(b,first);}
    else{first=false;x.className='bad';x.disabled=true;G.sfx('bad');fb.innerHTML=`<div class="fb bad">❌ ${o.why}</div>`;}};g.appendChild(x);return x;});b.appendChild(g);b.appendChild(fb);});};
/* gambar rangkaian dari daftar komponen segaris: seq [{id,flip,att,n,hot}] ; id 'blank' = kotak kosong */
G.diag=(seq,o)=>{o=o||{};const n=seq.length,Wd=175+110*n+70,hs=[],p=[],X=i=>175+110*i,nm=o.names!==false;
  const H=(k,x,y,w,h)=>hs.push(`<rect class="hs" data-k="${k}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="rgba(0,0,0,0)" stroke="none" pointer-events="all" style="cursor:pointer"/>`);
  const bl=(x,y,w,h,a)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" stroke-dasharray="7 5" stroke="${a.hot?'#e67e22':'currentColor'}" stroke-width="${a.hot?4:2.5}"/>`+T(x+w/2,y+h/2+5,a.n||'?','middle',a.hot?'#e67e22':undefined);
  p.push(use('motor',0,120,1),use('kompresor',104,120,1),'<path d="M164,125V75H180"/>');H('motor',30,136,62,58);H('kompresor',132,136,62,58);if(nm)p.push(T(60,136,'Motor'),T(196,170,'Kompresor','start'));
  seq.forEach((s,i)=>{const x=X(i);
    if(s.id==='blank')p.push(`<path d="M${x+5},75H${x+28}M${x+92},75H${x+115}"/>`,bl(x+28,46,64,58,s));
    else p.push(s.flip?`<g transform="translate(${x+120},30) scale(-1,1)">${I[s.id]}</g>`:use(s.id,x,30,1));
    if(s.id==='tangki'){if(nm)p.push(T(x+60,80,'Tangki'));const at=s.att===undefined?['safety','gauge','pswitch']:s.att;
      p.push(`<path d="M${x+27},91V104M${x+27},120V128" stroke-width="2"/><path d="M${x+21},104H${x+33}L${x+27},112ZM${x+21},120H${x+33}L${x+27},112Z" stroke-width="2"/>`);if(nm)p.push(T(x+37,121,'drain','start'));
      if(at[0]){if(at[0].blank)p.push(`<path d="M${x+40},59V50"/>`,bl(x+22,12,36,38,at[0]));else p.push(use(at[0],x+7,12.25,.55));H(at[0].blank?'bA':at[0],x+18,8,44,50);}
      if(at[1]){if(at[1].blank)p.push(`<path d="M${x+80},59V50"/>`,bl(x+62,12,36,38,at[1]));else p.push(use(at[1],x+47,12.25,.55));H(at[1].blank?'bB':at[1],x+62,8,40,50);}
      if(at[2]){p.push(`<path d="M${x+77},91V160H${x+87}" ${D}/>`);if(at[2].blank)p.push(bl(x+87,140,48,40,at[2]));else{p.push(use(at[2],x+84,133,.6));if(nm)p.push(T(x+158,170,N[at[2]],'start'));}H(at[2].blank?'bC':at[2],x+86,136,64,48);}}
    else if(nm&&s.id!=='blank')p.push(T(x+60,/filter|regulator|lubricator/.test(s.id)?142:112,N[s.id].replace(' (katup penutup)','')));
    H(i,x+22,s.id==='tangki'?58:34,76,s.id==='tangki'?34:84);});
  if(o.frame){const a=X(o.frame[0])+7,b=X(o.frame[1])+113;p.push(`<rect x="${a}" y="28" width="${b-a}" height="96" stroke-width="2" stroke-dasharray="12 4 2 4"/>`);if(nm)p.push(T((a+b)/2,20,'Unit F.R.L'));}
  p.push(`<path d="M${X(n)+5},75H${X(n)+34}"/>`,ah(X(n)+44,75,0),T(X(n)+30,102,'ke mesin'));
  if(o.p1)p.push(T(X(o.p1[0])+104,34,o.p1[1],'start','#c62828'));if(o.p2)p.push(T(X(n)+26,62,o.p2,'middle','#c62828'));
  return `<svg viewBox="0 0 ${Wd} 232" ${G.SYMG0} style="width:100%;height:auto;display:block">${p.join('')}${o.click?hs.join(''):''}</svg>`;};
/* modal gambar yang bisa diketuk: onTap(k, api) ; api.mark(k,ok,text), api.flash(k), api.done(html,btnLabel,fn), api.say(html) */
G.tapDiag=(kick,title,top,svg,onTap)=>modal(b=>{b.appendChild(el('div','kick',kick));b.appendChild(el('h2','',title));if(top)b.appendChild(el('div','',top));const w=el('div','dgw',svg);b.appendChild(w);const fb=el('div');b.appendChild(fb);const sv=w.querySelector('svg');let lock=false;
  const R=k=>sv.querySelector(`.hs[data-k="${k}"]`);
  const api={mark:(k,ok,text)=>{const r=R(k);if(!r)return;r.setAttribute('fill',ok?'rgba(34,184,102,.25)':'rgba(224,72,72,.3)');r.setAttribute('stroke',ok?'#22b866':'#e04848');r.setAttribute('stroke-width','3');r.style.pointerEvents='none';
      if(text){const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',+r.getAttribute('x')+3);t.setAttribute('y',+r.getAttribute('y')+15);t.setAttribute('font-size','15');t.setAttribute('font-weight','700');t.setAttribute('font-family','Arial,sans-serif');t.setAttribute('fill','#14904a');t.setAttribute('stroke','none');t.textContent=text;sv.appendChild(t);}},
    flash:k=>{const r=R(k);if(!r)return;r.setAttribute('fill','rgba(224,72,72,.35)');setTimeout(()=>r.setAttribute('fill','rgba(0,0,0,0)'),500);},
    say:h=>{fb.innerHTML=h;},done:(h,label,fn)=>{lock=true;fb.innerHTML=h;b.appendChild(row(btn(label||'Lanjut ▸','y',fn)));b.scrollTop=b.scrollHeight;}};
  sv.querySelectorAll('.hs').forEach(r=>r.addEventListener('click',()=>{if(lock)return;G.initAudio();const k=r.getAttribute('data-k');onTap(isNaN(+k)?k:+k,api);}));});
/* gelembung sabun pada sambungan bocor */
G.bubbles=(x,y,z,leak)=>{const g=new THREE.Group();g.position.set(x,y,z);const m=new THREE.MeshStandardMaterial({color:G.col('#ffffff'),transparent:true,opacity:leak?.55:.8,roughness:.05,metalness:.1,depthWrite:false});const bs=[];
  const n=leak?9:5;for(let i=0;i<n;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(leak?.03:.016,12,8),m);s.position.set(G.rand(-.05,.05),G.rand(-.02,.06),G.rand(.02,.07));s.userData.p=G.rand(0,6);g.add(s);bs.push(s);}
  const f=(dt,t)=>bs.forEach(s=>{const k=leak?(.6+((t*.7+s.userData.p)%1)*1.3):1;s.scale.setScalar(k);});G.updaters.add(f);G.scene.add(g);g.userData.kill=()=>{G.updaters.delete(f);G.scene.remove(g);};return g;};
})();
