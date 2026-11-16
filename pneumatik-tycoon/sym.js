/* Pneumatik Tycoon — pustaka simbol ISO 1219-1 (penyedia udara) sebagai SVG, tanya-simbol, dan tekstur simbol untuk dunia 3D */
(function(){
'use strict';
const {el,btn,row,modal}=G;
const ah=(x,y,a)=>`<path d="M0,0L-10,-5V5Z" transform="translate(${x},${y}) rotate(${a})" fill="currentColor" stroke="none"/>`;
const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="2.8" fill="currentColor" stroke="none"/>`;
const D='stroke-dasharray="5 4"';
const I={
 motor:`<circle cx="60" cy="45" r="23"/><text x="60" y="55" font-size="28" font-weight="700" font-family="Arial,sans-serif" text-anchor="middle" fill="currentColor" stroke="none">M</text><path d="M83,41H112M83,49H112"/>`,
 kompresor:`<circle cx="60" cy="45" r="24"/><path d="M60,21L52,34H68Z"/><path d="M60,21V5M60,69V85M8,41H36M8,49H36"/>`,
 check:`<path d="M5,45H44M44,45L61,28M44,45L61,62M65,45H115"/><circle cx="57" cy="45" r="8"/>`,
 tangki:`<path d="M32,29H88A16,16 0 0 1 88,61H32A16,16 0 0 1 32,29Z"/><path d="M5,45H16M104,45H115"/>`,
 safety:`<rect x="45" y="30" width="30" height="30"/><path d="M60,85V60M60,30V19"/><path d="M53,19H67L60,8Z"/><path d="M68,56V40"/>${ah(68,34,-90)}<path d="M75,45l4,-6 6,12 6,-12 6,12 4,-6"/><path d="M60,74H33V45H45" ${D}/>`,
 pswitch:`<rect x="38" y="24" width="46" height="42"/><path d="M5,45H38" ${D}/><path d="M56,56V80M56,56L73,41M74,36H112M74,56H112"/>${dot(56,56)}${dot(74,36)}${dot(74,56)}<text x="47" y="41" font-size="15" font-style="italic" font-weight="700" font-family="Arial,sans-serif" text-anchor="middle" fill="currentColor" stroke="none">p</text>`,
 gauge:`<circle cx="60" cy="40" r="23"/><path d="M47,51L68,33"/>${ah(73,28.5,-41)}<path d="M60,63V85"/>`,
 shutoff:`<path d="M5,45H40M80,45H115"/><path d="M40,31V59L60,45ZM80,31V59L60,45Z"/>`,
 filter:`<path d="M60,15L90,45L60,75L30,45Z"/><path d="M60,15V75" ${D}/><path d="M47,62H73"/><path d="M60,75V84M54,84H66"/><path d="M5,45H30M90,45H115"/>`,
 regulator:`<rect x="42" y="30" width="36" height="30"/><path d="M5,45H42M78,45H115"/><path d="M47,45H64"/>${ah(73,45,0)}<path d="M60,30l-5,-4 10,-5 -10,-5 10,-5 -5,-3"/><path d="M46,26L68,12"/>${ah(73,9,-32)}<path d="M97,45V73H60V60" ${D}/>`,
 lubricator:`<path d="M60,15L90,45L60,75L30,45Z"/><path d="M60,15V40"/><path d="M5,45H30M90,45H115"/>`,
 frls:`<rect x="34" y="36" width="52" height="34"/><path d="M60,36V70"/><path d="M5,53H34M86,53H115"/><circle cx="60" cy="17" r="11"/><path d="M54,22L65,13"/><path d="M60,28V36"/>`};
const use=(id,x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})">${I[id]}</g>`;
I.frl=`<rect x="14" y="5" width="222" height="90" stroke-width="2" stroke-dasharray="12 4 2 4"/>${use('filter',18,22,.62)}${use('regulator',88,22,.62)}${use('lubricator',158,22,.62)}<path d="M2,50H21M89,50H91M159,50H161M229,50H248" stroke-width="2"/>`;
const VB={frl:[250,100]};
const N={motor:'Motor listrik',kompresor:'Kompresor',check:'Katup satu arah',tangki:'Tangki udara',safety:'Katup pengaman',pswitch:'Pressure switch',gauge:'Manometer',shutoff:'Keran (katup penutup)',filter:'Filter',regulator:'Regulator',lubricator:'Lubricator',frl:'Unit F.R.L',frls:'Unit F.R.L (bentuk ringkas)'};
G.SYMN=N;
const G0='fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
G.sym=(id,style)=>{const v=VB[id]||[120,90];return `<svg viewBox="0 0 ${v[0]} ${v[1]}" ${G0} style="${style||'width:100%;height:auto;display:block'}" role="img" aria-label="Simbol ${N[id]}">${I[id]}</svg>`;};
/* gambar rangkaian penyedia udara lengkap */
const T=(x,y,t,a,c)=>`<text x="${x}" y="${y}" font-size="14" font-weight="700" font-family="Arial,sans-serif" text-anchor="${a||'middle'}" fill="${c||'currentColor'}" stroke="none">${t}</text>`;
G.symDiagram=style=>`<svg viewBox="0 0 915 262" ${G0} style="${style||'width:100%;height:auto;display:block'}" role="img" aria-label="Gambar rangkaian sistem penyedia udara">
 ${use('motor',0,120,1)}${use('kompresor',104,120,1)}<path d="M164,125V75H180"/>${use('check',175,30,1)}${use('tangki',285,30,1)}${use('safety',292,12.25,.55)}${use('gauge',332,12.25,.55)}
 <path d="M362,91V160H372" ${D}/>${use('pswitch',369,133,.6)}<path d="M402.6,181V238H60V188" stroke="#e67e22" stroke-width="2" stroke-dasharray="2 5"/>
 <path d="M312,91V104M312,120V128" stroke-width="2"/><path d="M306,104H318L312,112ZM306,120H318L312,112Z" stroke-width="2"/>
 ${use('shutoff',395,30,1)}${use('filter',505,30,1)}${use('regulator',615,30,1)}${use('lubricator',725,30,1)}<path d="M840,75H884"/>${ah(894,75,0)}
 <rect x="512" y="28" width="326" height="96" stroke-width="2" stroke-dasharray="12 4 2 4"/>
 ${T(60,136,'Motor')}${T(196,170,'Kompresor','start')}${T(164,222,'udara luar')}${T(232,112,'Katup satu arah')}${T(345,80,'Tangki')}${T(286,32,'Katup pengaman','end')}${T(402,32,'Manometer','start')}
 ${T(322,121,'drain','start')}${T(444,170,'Pressure switch','start')}${T(230,254,'kabel ke motor: mati di 8 bar, hidup lagi di 6 bar','middle','#e67e22')}${T(455,112,'Keran')}
 ${T(565,142,'Filter')}${T(675,142,'Regulator')}${T(785,142,'Lubricator')}${T(675,20,'Unit F.R.L')}${T(455,52,'8 bar','middle','#c62828')}${T(872,62,'5 bar','middle','#c62828')}${T(872,98,'ke mesin')}</svg>`;
G.SYMI=I;G.symUse=use;G.symT=T;G.symAh=ah;G.SYMG0=G0;
/* tekstur dari SVG untuk dunia 3D */
const toImg=(svg,w,h,cb)=>{const im=new Image();im.onload=()=>cb(im);im.onerror=()=>cb(null);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg.replace('<svg ',`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" color="#12325e" `).replace(/style="[^"]*"/,''));};
G.svgImg=toImg;
G.symPlane=(id,w)=>{const v=VB[id]||[120,90],h=w*v[1]/v[0],c=G.cnv(v[0]*4,v[1]*4),x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);const t=G.tex(c);
  const g=new THREE.Group();g.add(G.at(G.box(w+.03,h+.03,.012,'#1d3557'),0,0,-.008));const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}));g.add(m);
  toImg(G.sym(id),c.width,c.height,im=>{if(im){x.drawImage(im,0,0,c.width,c.height);t.needsUpdate=true;}});return g;};
/* gaya */
const st=document.createElement('style');st.textContent=`.symopts{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:10px 0}.symopts button{background:#fff;border:4px solid #34414e;border-radius:12px;padding:6px 10px;color:#12325e}.symopts svg{max-height:112px;margin:auto}.symopts button.ok{border-color:#22b866}.symopts button.bad{border-color:#e04848;opacity:.5}
#modal.low{align-items:flex-end;background:rgba(5,8,11,.08)}#modal.low #mbox{max-height:56%}.low .symopts{grid-template-columns:repeat(4,1fr)}.low .symopts svg{max-height:84px}
.symcard{background:#fff;border-radius:12px;padding:8px;color:#12325e;border:3px solid #f3b52f}.kcard{display:grid;grid-template-columns:200px 1fr;gap:12px;align-items:start;margin-top:8px}@media (max-width:560px){.kcard{grid-template-columns:1fr}.kcard .symcard{max-width:230px;margin:auto}}
.kcard dl{margin:0;font:500 14px/1.45 var(--game)}.kcard dt{font:700 11.5px var(--game);letter-spacing:.06em;text-transform:uppercase;color:var(--accent);margin-top:6px}.kcard dt:first-child{margin-top:0}.kcard dd{margin:0;color:#dfe6ec}
.dgw{background:#fff;border-radius:12px;padding:8px;color:#12325e;overflow-x:auto}.dgw svg{min-width:640px}
.sflow{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:8px 0}.sflow .ss{width:78px;height:62px;border:2px dashed #3a4652;border-radius:10px;background:#1a222b;display:grid;place-items:center;font:700 15px var(--game);color:#6b7884}.sflow .ss.fill{background:#fff;border-style:solid;color:#12325e}.sflow .ss.ok{border-color:#22b866;border-width:3px}.sflow .ss.bad{border-color:#e04848;border-width:3px}.sflow .ss svg{width:70px}.sflow b{color:#f3b52f}
.stiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px;margin:8px 0}.stiles button{background:#fff;border:3px solid #34414e;border-radius:10px;padding:4px 6px;color:#12325e}.stiles button.used{opacity:.25;pointer-events:none}
.nb table.st{border-collapse:collapse;width:100%;line-height:1.3;background:rgba(255,255,255,.75)}.nb table.st td{border:1.5px solid #8fa3b5;padding:3px 6px;font-size:13.5px;vertical-align:middle}.nb table.st td:nth-child(2){width:92px;color:#12325e}.nb table.st svg{width:84px}`;document.head.appendChild(st);
/* tanya: pilih simbol yang benar */
G.askSym=(kick,title,top,ids,ok,done,sc)=>{let first=true;modal(b=>{b.appendChild(el('div','kick',kick));b.appendChild(el('h2','',title));if(top)b.appendChild(el('div','',top));const fb=el('div');const g=el('div','symopts');
  const bs=G.shuffle(ids).map(id=>{const x=el('button','',G.sym(id));x.setAttribute('aria-label','Pilihan simbol');x.onclick=()=>{if(x.disabled)return;G.initAudio();if(id===ok){bs.forEach(z=>z.disabled=true);x.className='ok';sc(first);G.sfx('ok');fb.innerHTML='';done(b,first);}
    else{first=false;x.className='bad';x.disabled=true;G.sfx('bad');fb.innerHTML=`<div class="fb bad">❌ Itu simbol <b>${N[id]}</b>. Amati lagi bendanya, lalu pilih simbol yang sesuai.</div>`;}};g.appendChild(x);return x;});b.appendChild(g);b.appendChild(fb);});};
/* susun simbol menjadi jalur */
G.symOrder=(title,intro,ids,sc,onDone)=>{let seq=[],first=true;const sh=G.shuffle(ids.map((x,i)=>i));
  modal(b=>{b.appendChild(el('div','kick','Susun gambar rangkaian'));b.appendChild(el('h2','',title));b.appendChild(el('p','',intro));
    const fl=el('div','sflow');const ss=ids.map((x,i)=>{const s=el('div','ss',String(i+1));fl.appendChild(s);if(i<ids.length-1)fl.appendChild(el('b','','➜'));return s;});b.appendChild(fl);
    const tl=el('div','stiles');const ts=sh.map(i=>{const c=el('button','',G.sym(ids[i]));c.setAttribute('aria-label','Kartu simbol');c.onclick=()=>{if(seq.length>=ids.length)return;G.initAudio();G.sfx('tap');seq.push(i);c.classList.add('used');const s=ss[seq.length-1];s.classList.add('fill');s.innerHTML=G.sym(ids[i]);};tl.appendChild(c);return c;});b.appendChild(tl);
    const fb=el('div');b.appendChild(fb);const reset=()=>{seq=[];ts.forEach(c=>c.classList.remove('used'));ss.forEach((s,i)=>{s.className='ss';s.innerHTML=String(i+1);});};
    const r=row(btn('↺ Ulang','gr',()=>{reset();fb.innerHTML='';}),btn('Periksa ✓','y',()=>{if(seq.length<ids.length){G.toast('Isi semua kotak dulu');return;}let wrong=0;seq.forEach((v,i)=>{ss[i].classList.add(v===i?'ok':'bad');if(v!==i)wrong++;});
      if(!wrong){G.sfx('ok');sc(first);fb.innerHTML='';r.remove();tl.remove();onDone(b);}else{G.sfx('bad');first=false;fb.innerHTML=`<div class="fb bad">❌ ${wrong} kotak belum tepat (bertanda merah). Ikuti jalannya udara dari sumber tenaga sampai ke mesin.</div>`;setTimeout(reset,1800);}}));b.appendChild(r);});};
})();
