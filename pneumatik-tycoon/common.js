/* Pneumatik Tycoon — modul bersama: misi, tanya-jawab, kuis, susun urutan, Catatan Buku Tulis, kartu akhir level */
(function(){
'use strict';
const {scene,el,btn,row,modal,closeModal,toast}=G;
G.V=(x,z)=>new THREE.Vector3(x,0,z);
G.quest=(R,title,stepsFn,targetFn)=>{R.refresh=()=>G.setQuest(title,stepsFn(),R.step);return n=>{R.step=n;R.refresh();G.marker.set(targetFn(n)||null);};};
G.ask=(kick,title,top,opts,done,sc,keep)=>{let first=true;modal(b=>{b.appendChild(el('div','kick',kick));b.appendChild(el('h2','',title));if(top)b.appendChild(el('div','',top));const fb=el('div');
  const col=el('div');col.style.cssText='display:grid;gap:8px;margin-top:8px';const bs=(keep?opts:G.shuffle(opts)).map(o=>{const x=btn(o[0],'gr',()=>{if(o[1]){bs.forEach(z=>z.disabled=true);x.className='gbtn g';sc(first);G.sfx('ok');fb.innerHTML='';done(b,first);}
      else{first=false;x.className='gbtn r';x.disabled=true;G.sfx('bad');fb.innerHTML=`<div class="fb bad">❌ ${o[2]||'Belum tepat — amati lagi keadaannya.'}</div>`;}});x.style.cssText='text-align:left;width:100%';col.appendChild(x);return x;});
  b.appendChild(col);b.appendChild(fb);});};
G.quiz=(QZ,sc,done,qi,qok)=>{qi=qi||0;qok=qok||0;if(qi>=QZ.length){done(qok);return;}const Q=QZ[qi];modal(b=>{b.appendChild(el('div','kick',`Analisis · soal ${qi+1}/${QZ.length}`));b.appendChild(el('h2','',Q.q));const cc=el('div');cc.style.cssText='display:grid;gap:8px';
  const bs=G.shuffle(Q.o.map((o,i)=>i)).map(i=>{const x=btn(Q.o[i],'gr',()=>{bs.forEach(z=>z.disabled=true);const ok=i===0;sc(ok);x.className='gbtn '+(ok?'g':'r');G.sfx(ok?'ok':'bad');
    if(!ok)b.appendChild(el('div','fb bad','Jawaban yang tepat: <b>'+Q.o[0]+'</b>'));if(Q.w)b.appendChild(el('div','fb info',Q.w));b.appendChild(row(btn('Lanjut ▸','y',()=>G.quiz(QZ,sc,done,qi+1,qok+(ok?1:0)))));});x.style.cssText='text-align:left;width:100%';cc.appendChild(x);return x;});b.appendChild(cc);});};
G.orderGame=(title,intro,items,sc,onDone)=>{let seq=[],first=true;const sh=G.shuffle(items.map((x,i)=>i));
  modal(b=>{b.appendChild(el('div','kick','Susun urutan'));b.appendChild(el('h2','',title));b.appendChild(el('p','',intro));
    const slots=el('div','slots');items.forEach((x,i)=>slots.appendChild(el('div','slot',`<span class="n">${i+1}</span><span class="v" style="color:#6b7884">— ketuk kartu di bawah —</span>`)));b.appendChild(slots);
    const cards=el('div','cards');const cEls=sh.map(i=>{const it=items[i];const c=el('button','ocard',`<span class="ic">${it[0]}</span><span>${it[1]}<small>${it[2]}</small></span>`);
      c.onclick=()=>{if(seq.length>=items.length)return;G.sfx('tap');seq.push(i);c.classList.add('used');const s=slots.children[seq.length-1];s.classList.add('fill');s.querySelector('.v').innerHTML=`${it[0]} ${it[1]}`;s.querySelector('.v').style.color='';};cards.appendChild(c);return c;});
    b.appendChild(cards);const fb=el('div');b.appendChild(fb);
    const reset=()=>{seq=[];cEls.forEach(c=>c.classList.remove('used'));[...slots.children].forEach(s=>{s.className='slot';s.querySelector('.v').innerHTML='— ketuk kartu di bawah —';s.querySelector('.v').style.color='#6b7884';});};
    const r=row(btn('↺ Ulang','gr',()=>{reset();fb.innerHTML='';}),btn('Periksa ✓','y',()=>{if(seq.length<items.length){toast('Isi semua urutan dulu');return;}let wrong=0;seq.forEach((v,i)=>{slots.children[i].classList.add(v===i?'ok':'bad');if(v!==i)wrong++;});
      if(!wrong){G.sfx('ok');sc(first);fb.innerHTML='';r.remove();onDone(b);}else{G.sfx('bad');first=false;fb.innerHTML=`<div class="fb bad">❌ ${wrong} posisi belum tepat (bertanda merah). Ikuti arah aliran udara, lalu susun lagi.</div>`;setTimeout(reset,1600);}}));b.appendChild(r);});};
G.walk=(A,pts,yawEnd)=>new Promise(res=>{let i=0;const seg=()=>{if(i>=pts.length){A.legL.rotation.x=A.legR.rotation.x=0;if(yawEnd!==undefined)A.root.rotation.y=yawEnd;res();return;}
  const a=A.root.position.clone(),b=G.V(pts[i][0],pts[i][1]);const d=a.distanceTo(b);A.root.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);
  G.anim(Math.max(.2,d/3.2),k=>{A.root.position.lerpVectors(a,b,k);const s=Math.sin(k*d*3.2)*.7;A.legL.rotation.x=s;A.legR.rotation.x=-s;if(!A.busy){A.armL.rotation.x=-s;A.armR.rotation.x=s;}},()=>{i++;seg();});};seg();});
G.meters=list=>{let m=G.$('#meters');if(!m){m=el('div','pnl');m.id='meters';G.$('#hud').appendChild(m);}m.style.display=list&&list.length?'block':'none';if(!list)return;
  m.innerHTML=list.map(x=>{const good=x.inv?100-x.v:x.v;const c=good>=70?'#22b866':good>=45?'#f3b52f':'#e04848';return `<div class="mt">${x.ic} ${x.n} <span style="float:right">${x.txt||Math.round(x.v)+'%'}</span><i><b style="width:${Math.max(3,Math.min(100,x.v))}%;background:${c}"></b></i></div>`;}).join('');};
G.drop=(obj,y)=>{const y0=obj.position.y;obj.position.y=y0+(y||8);G.anim(.7,k=>{const e=k<.8?(k/.8)**2:1;obj.position.y=y0+(y||8)*(1-e)+(k>.8?Math.sin((k-.8)/.2*Math.PI)*.2:0);},()=>{obj.position.y=y0;G.sfx('build');});};
/* cincin penanda di lantai */
G.ring=(x,z,c)=>{const r=new THREE.Mesh(new THREE.RingGeometry(.34,.46,28),new THREE.MeshBasicMaterial({color:c||0xff7a00,transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false}));r.rotation.x=-Math.PI/2;r.position.set(x,.035,z);scene.add(r);
  const f=(dt,t)=>{r.scale.setScalar(1+Math.sin(t*4+x)*.14);r.material.opacity=.55+Math.sin(t*4+x)*.3;};G.updaters.add(f);r.userData.kill=()=>{G.updaters.delete(f);scene.remove(r);};return r;};

/* ---------- Catatan Buku Tulis ---------- */
const chain=(arr,c)=>`<div style="display:flex;flex-wrap:wrap;align-items:center;gap:4px 2px;line-height:1.25;padding:6px 0">${arr.map((x,i)=>`<span style="border:2px solid ${c||'#1d3557'};border-radius:6px;background:#fff;padding:3px 7px;font:600 13px var(--game);color:#12325e;text-align:center">${x}</span>${i<arr.length-1?'<b style="color:#c62828;font-size:17px">➜</b>':''}`).join('')}</div>`;
G.NOTES={
 l1:{j:'Pengenalan Sistem Pneumatik dan K3 Udara Bertekanan',
  baca:'Pneumatik adalah teknik yang memakai udara bertekanan untuk menggerakkan alat. Udara diisap dan dimampatkan oleh kompresor, lalu disimpan di dalam tangki. Saat dimampatkan, uap air di udara mengembun menjadi air yang disebut kondensat. Air ini mengendap di dasar tangki sehingga harus dibuang setiap hari lewat keran drain. Sebelum dipakai mesin, udara melewati unit F.R.L: filter menyaring air dan kotoran, regulator menurunkan tekanan ke tekanan kerja, dan lubricator menambahkan kabut oli. Di bengkel TOI, tekanan kerja praktik adalah 5 bar. Udara bertekanan menyimpan energi, sehingga selang yang lepas, sabuk yang terbuka, dan kabel yang rusak dapat mencelakai orang.',
  gambar:[chain(['Kompresor','Tangki udara<br><small>+ keran drain</small>','Keran &amp; pipa utama','<b>F</b>ilter','<b>R</b>egulator<br><small>5 bar</small>','<b>L</b>ubricator','Katup 5/2','Silinder<br><small>mesin press</small>']),
   'Gambar setiap komponen sebagai <b>kotak</b>, hubungkan dengan <b>garis berpanah</b> searah aliran udara, lalu tulis <b>MASUK</b> di kiri Filter dan <b>KELUAR</b> di kanan Lubricator. Tulis juga tekanannya: <b>8 bar</b> sebelum F.R.L dan <b>5 bar</b> sesudahnya.'],
  ist:[['Pneumatik','teknik menggerakkan alat dengan udara bertekanan'],['Kompresor','mesin yang mengisap dan memampatkan udara'],['Kondensat','air hasil pengembunan uap air di dalam tangki dan pipa'],['Unit F.R.L','rangkaian Filter, Regulator, dan Lubricator untuk menyiapkan udara sebelum dipakai'],['Tekanan kerja','tekanan udara yang disetel pada regulator untuk menjalankan alat; di bengkel TOI 5 bar']],
  tulis:['Apa yang akan terjadi pada tangki dan pada alat pneumatik jika kondensat <b>tidak pernah dibuang</b>? Jelaskan.','Apa akibatnya jika unit F.R.L dipasang <b>terbalik</b> (udara masuk dari sisi Lubricator)? Jelaskan dengan mengingat tugas Filter, Regulator, dan Lubricator.']}};
G.notebook=(id,done)=>{const N=G.NOTES[id],no=id.slice(1);let ok=false;modal(b=>{b.appendChild(el('div','kick',`📓 Catatan Buku Tulis · Level ${no}`));b.appendChild(el('h2','',N.j));
  b.appendChild(el('p','','Buka <b>buku tulismu</b>. Tulis tangan dengan rapi: bagian <b>A</b> dibaca lalu diringkas, bagian <b>B</b> digambar, bagian <b>C</b> disalin, bagian <b>D</b> dijawab dengan kalimatmu sendiri. Setelah selesai, minta <b>paraf guru</b>.'));
  b.appendChild(el('div','nb',`<h3>Level ${no} — ${N.j}</h3><div class="dt">Hari/tanggal: ……………  Nama: ${G.esc(G.save.name||'……………')}</div>
   <h3>A. Bacaan — baca, lalu tulis ringkasannya (3–4 kalimat)</h3><div>${N.baca}</div>
   <h3>B. Gambar — sketsa rangkaian jalur pneumatik</h3>${N.gambar.map(x=>`<div>${x}</div>`).join('')}
   <h3>C. Istilah penting — salin</h3>${N.ist.map(x=>`<div>• <b>${x[0]}</b>: ${x[1]}</div>`).join('')}
   <h3>D. Tulis dengan kalimatmu sendiri (minimal 3 kalimat tiap nomor)</h3>${N.tulis.map((x,i)=>`<div>${i+1}. ${x}</div>`).join('')}
   <div class="dt" style="text-align:right">Paraf guru: …………</div>`));
  if(!done){b.appendChild(row(btn('Tutup','y',G.openMenu)));return;}
  const go=btn('Lanjut ▸','y',()=>{closeModal();done();});go.disabled=true;const ck=btn('☐ Saya sudah menulis catatan ini di buku','gr',()=>{ok=!ok;ck.textContent=(ok?'☑':'☐')+' Saya sudah menulis catatan ini di buku';ck.className='gbtn '+(ok?'g':'gr');go.disabled=!ok;});
  b.appendChild(row(ck,go));});};
G.copyText=txt=>{const ok=()=>toast('Hasil tersalin ✓ Tempel di Google Classroom','ok');const fb=()=>{const t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();try{document.execCommand('copy');ok();}catch(e){toast('Gagal menyalin — tangkap layar saja','bad');}t.remove();};try{navigator.clipboard.writeText(txt).then(ok,fb);}catch(e){fb();}};
G.finish=o=>G.notebook(o.id,()=>{const R=o.R,ratio=R.total?R.ok/R.total:0,stars=ratio>=.85?3:ratio>=.65?2:1,pv=G.save.tp[o.id];
  if(!pv||stars>pv.stars||(stars===pv.stars&&(o.val||0)>(pv.laba||0)))G.save.tp[o.id]={stars,ok:R.ok,total:R.total,laba:o.val||0,date:new Date().toISOString().slice(0,10)};G.persist();G.confetti();G.sfx('win');G.meters(null);G.payIncome();
  const txt=`PNEUMATIK TYCOON — LEVEL ${o.no} ${o.name}\nNama: ${G.save.name}\nBintang: ${stars}/3 (benar pertama kali ${R.ok}/${R.total})\n${o.lines.join('\n')}\nCatatan buku tulis: sudah ditulis (paraf guru: ........)`;
  modal(b=>{b.appendChild(el('div','kick',`Level ${o.no} selesai · ${o.kode||''}`));b.appendChild(el('h2','',o.badge));b.appendChild(el('div','stars',`${'⭐'.repeat(stars)}<span style="opacity:.2">${'⭐'.repeat(3-stars)}</span>`));
    b.appendChild(el('p','',`Benar pada percobaan pertama: <b>${R.ok}/${R.total}</b> · ${o.metric}`));if(o.extra)b.appendChild(el('div','',o.extra()));
    b.appendChild(el('div','fb info','<b>Yang perlu kamu ingat:</b><br>'+o.points.map(p=>'• '+p).join('<br>')));b.appendChild(el('div','know','<b>💭 Refleksi:</b> '+o.reflect));
    b.appendChild(row(btn('📋 Salin hasil','y',()=>G.copyText(txt)),btn('↺ Main lagi','gr',()=>G.go(o.id)),btn('🛒 Toko bengkel','g',G.openShop),btn('Peta level','gr',()=>{closeModal();G.openMenu();})));});});
})();
