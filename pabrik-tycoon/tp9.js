/* TP 9 — Menerapkan prosedur penanganan limbah B3 sesuai standar kerja industri */
(function(){
'use strict';
const {scene,box,cyl,sph,at,grp,el,btn,row,say,modal,closeModal,toast,W,V}=G;
const R={step:-1,ok:0,total:0,n:0};G.TP9=R;const sc=ok=>{R.total++;if(ok)R.ok++;};let setStep;const TN=G.TINI;
const BIN={or:['Organik','#2e8b57','🍃',-9],an:['Anorganik','#e0b000','♻',-7.6],b3:['Limbah B3','#c62828','☣',-6.2]};
const mk={bat:()=>grp(at(cyl(.07,.07,.26,'#222').rotateZ(Math.PI/2),0,.07,0),at(cyl(.07,.07,.26,'#c8a200').rotateZ(Math.PI/2),0,.07,.16)),
 timah:()=>grp(at(G.mesh(new THREE.TorusGeometry(.13,.035,8,18),G.mat('#b8bec4',{metalness:.9,roughness:.3})).rotateX(Math.PI/2),0,.04,0),at(sph(.05,'#9aa1a8',{metalness:.9}),.1,.04,.12)),
 lampu:()=>grp(at(cyl(.045,.045,1,'#f8f8f8').rotateZ(Math.PI/2),0,.05,0),at(cyl(.05,.05,.06,'#aaa').rotateZ(Math.PI/2),-.5,.05,0),at(cyl(.05,.05,.06,'#aaa').rotateZ(Math.PI/2),.5,.05,0)),
 majun:()=>{const m=G.mesh(new THREE.IcosahedronGeometry(.2,1),G.mat('#5b4a3a',{flatShading:true}));m.scale.set(1.2,.45,1);return grp(at(m,0,.09,0));},
 ipa:()=>{const g=grp(at(cyl(.09,.1,.34,'#e9f1ff'),0,.17,0),at(cyl(.04,.04,.06,'#d62828'),0,.37,0));g.add(G.labelPlane('IPA',.14,.09,{bg:'#3d8bfd',fg:'#fff',fs:110}).translateY(.17).translateZ(.1));return g;},
 pcb:()=>grp(at(box(.42,.03,.3,'#1d7a3e'),0,.02,0),at(box(.1,.03,.07,'#111'),-.08,.05,.03)),
 botol:()=>grp(at(cyl(.08,.08,.4,'#9fd3ff',{transparent:true,opacity:.6}),0,.2,0),at(cyl(.04,.04,.06,'#2a7bd8'),0,.43,0)),
 kardus:()=>grp(at(box(.45,.3,.35,'#b98b55'),0,.15,0)),
 pisang:()=>{const g=new THREE.Group();for(let i=0;i<3;i++){const s=sph(.07,'#e8c33a');s.scale.set(3,.5,1);s.rotation.y=i*1.1;at(s,0,.04,0);g.add(s);}return g;}};
const IT=[{k:'bat',n:'Baterai bekas',b:'b3',p:[9.8,4.8],f:'Baterai mengandung logam berat dan bahan kimia yang mencemari tanah dan air.'},{k:'timah',n:'Sisa timah solder (dross)',b:'b3',p:[2.2,4.8],f:'Solder Sn-Pb mengandung timbal (Pb) yang beracun; dross dikumpulkan di wadah tertutup.'},
 {k:'lampu',n:'Lampu TL rusak',b:'b3',p:[-14.7,-1],f:'Lampu TL mengandung uap merkuri. Jangan dipecahkan.'},{k:'majun',n:'Majun bekas flux dan oli',b:'b3',p:[7.4,-9.4],f:'Kain yang terkontaminasi bahan kimia ikut menjadi limbah B3.'},
 {k:'ipa',n:'Botol bekas IPA',b:'b3',p:[-4.2,4.8],f:'Kemasan bekas bahan berbahaya tetap diperlakukan sebagai limbah B3.'},{k:'pcb',n:'PCB reject',b:'b3',p:[5.4,4.6],f:'Limbah elektronik mengandung logam berat; diserahkan ke pengelola berizin.'},
 {k:'botol',n:'Botol plastik minum',b:'an',p:[12.4,8.4],f:'Sampah anorganik yang dapat didaur ulang.'},{k:'kardus',n:'Kardus kemasan komponen',b:'an',p:[12.6,5],f:'Kardus bersih dapat didaur ulang.'},{k:'pisang',n:'Kulit pisang',b:'or',p:[.8,8.6],f:'Sampah organik: dapat membusuk dan dijadikan kompos.'}];
const TOT=IT.length;
function target(){if(G.held)return V(-7.6,9.6);let best=null,bd=1e9;IT.forEach(i=>{if(i.done)return;const d=Math.hypot(i.p[0]-G.P.pos.x,i.p[1]-G.P.pos.z);if(d<bd){bd=d;best=i;}});return best?V(best.p[0],best.p[1]):null;}
function drop(k){const I=R.cur;if(!I)return;if(I.b!==k){I.first=false;G.sfx('bad');toast(`❌ ${I.n} bukan ${BIN[k][0]}. ${k==='b3'?'Benda ini tidak mengandung bahan berbahaya.':I.b==='b3'?'Benda ini mengandung bahan berbahaya dan beracun!':'Pikirkan: bisa membusuk atau tidak?'}`,'bad');return;}
  sc(I.first!==false);const o=G.uncarry();scene.add(o);const a=G.P.pos.clone().setY(1.2),bp=new THREE.Vector3(BIN[k][3],.9,10.8);G.anim(.5,t=>{o.position.lerpVectors(a,bp,t);o.position.y+=Math.sin(t*Math.PI)*.5;o.scale.setScalar(1-t*.6);},()=>scene.remove(o));
  I.done=true;R.cur=null;R.n++;R.refresh();G.sfx('ok');G.addCoins(15,`${I.n} → ${BIN[k][0]}`);
  modal(b=>{b.appendChild(el('div','kick',`Terpilah ${R.n} dari ${TOT}`));b.appendChild(el('h2','',`${I.n} → ${BIN[k][2]} ${BIN[k][0]}`));b.appendChild(el('div','fb ok','✅ '+I.f));
    b.appendChild(row(btn('Lanjut ▸','y',async()=>{closeModal();if(R.n>=TOT){await say(TN,'Semua limbah terpilah! Tapi tong merah itu baru <b>langkah pertama</b>. Limbah B3 punya prosedur khusus sampai keluar dari pabrik. Bicara dengan saya di Pos K3.');setStep(2);}else G.marker.set(target());})));});}
const PR=[['🗂️','Pilah dari sampah lain','Limbah B3 tidak boleh tercampur sampah biasa'],['🛢️','Kemas dalam wadah tertutup yang sesuai','Wadah kuat, tidak bocor, tidak bereaksi dengan isinya'],['☣️','Pasang simbol dan label','Simbol bahaya, nama limbah, tanggal mulai disimpan'],['🏚️','Simpan di TPS Limbah B3','Tempat khusus: beratap, berlantai kedap, berventilasi'],['🚛','Serahkan ke pengelola berizin','Disertai dokumen serah terima (manifes)']];
const QUIZ=[{q:'Kaleng bekas cairan pembersih flux sudah kosong. Kaleng itu sebaiknya…',o:['dibuang ke wadah limbah B3, karena kemasan bekas bahan berbahaya tetap limbah B3','dibuang ke tong anorganik karena terbuat dari logam','dibakar supaya tidak menumpuk','dipakai sebagai tempat minum']},
 {q:'Mengapa limbah B3 tidak boleh dicampur dengan sampah biasa?',o:['Bahan beracunnya mencemari sampah lain, tanah, dan air, serta membahayakan petugas kebersihan','Karena tong sampah biasa cepat penuh','Karena limbah B3 berbau harum','Karena sampah biasa lebih mahal']},
 {q:'Urutan penanganan limbah B3 yang benar adalah…',o:['pilah → kemas → beri simbol dan label → simpan di TPS B3 → serahkan ke pengelola berizin','kemas → buang ke sungai → lapor','simpan → pilah → bakar → kubur','beri label → campur dengan sampah lain → buang ke TPA']}];
function finish(qok){G.finish({id:'tp9',no:9,name:'Penanganan Limbah B3',badge:'Pengelola Limbah Andal ♻️',R,val:R.ok,metric:`${TOT} limbah terpilah`,lines:[`Limbah terpilah: ${R.n}/${TOT}`,`Kuis analisis: ${qok}/3`],
  points:['Limbah B3 bengkel elektronika: <b>baterai, sisa timah solder, lampu TL, PCB bekas, majun terkontaminasi, kemasan bekas bahan kimia</b>.','Prosedur: <b>pilah → kemas → simbol & label → simpan di TPS B3 → serahkan ke pengelola berizin</b>.','Limbah lain dipilah menjadi <b>organik</b> dan <b>anorganik</b>.','Diatur dalam <b>PP No. 22 Tahun 2021</b>.'],
  reflect:'Di rumahmu, ke mana biasanya baterai bekas dan lampu rusak dibuang? Langkah kecil apa yang bisa keluargamu lakukan?'});}
G.startTP9=async()=>{G.buildLine();G.k3Post();G.lineRun(true);
  Object.keys(BIN).forEach(k=>{const B=BIN[k];const g=grp(at(box(1,1.1,.8,B[1],{roughness:.5}),0,.55,0),at(box(1.06,.07,.86,'#2a2a2a'),0,1.13,0));g.add(G.labelPlane([B[2],B[0].toUpperCase()],.8,.5,{bg:'#fff',fs:64}).translateY(.6).translateZ(-.405).rotateY(Math.PI));g.position.set(B[3],0,10.8);scene.add(g);G.addColBox(B[3],10.8,1.05,.85);
    G.addInter({pos:V(B[3],9.9),obj:`Tong ${B[0]}`,label:()=>`Masukkan ${R.cur?R.cur.n:''}`,r:1.1,on:()=>R.step===1&&!!G.held,fn:()=>drop(k)});});
  const ts=G.labelPlane('TPS SEMENTARA · PILAH LIMBAH',3.6,.4,{bg:'#1d3557',fg:'#ffc727',fs:80});ts.rotation.y=Math.PI;at(ts,-7.6,2.4,11.4);scene.add(ts);scene.add(at(box(.06,2.4,.06,'#555'),-9.4,1.2,11.4));scene.add(at(box(.06,2.4,.06,'#555'),-5.8,1.2,11.4));
  IT.forEach(I=>{I.o=mk[I.k]();I.o.scale.setScalar(1.5);I.o.position.set(I.p[0],0,I.p[1]);scene.add(I.o);I.ring=G.ring(I.p[0],I.p[1]);I.ring.visible=I.o.visible=false;
    G.addInter({pos:V(I.p[0],I.p[1]),obj:I.n,label:'Ambil',r:1.6,on:()=>R.step===1&&!I.done&&!G.held,fn:()=>{I.o.position.set(0,0,0);G.carry(I.o);scene.remove(I.ring);R.cur=I;toast(`Membawa: ${I.n}. Bawa ke tong yang tepat ➜`);G.marker.set(target());}});});
  setStep=G.quest(R,'TP 9 · LIMBAH B3',()=>['Temui Bu Tini di Pos K3',`Angkut & pilah limbah (${R.n}/${TOT})`,'Susun prosedur limbah B3 bersama Bu Tini'],n=>n===0||n===2?V(11.5,9.4):n===1?target():null);
  G.addInter({pos:V(11.5,9.4),obj:TN,label:'Bicara',r:2,fn:async()=>{if(R.step===0){await say(TN,'Setelah shift selesai, sisa bahan berserakan di seluruh pabrik. Sebagian terlihat biasa, padahal termasuk <b>Bahan Berbahaya dan Beracun (B3)</b>.');await say(TN,`Ada <b>${TOT} benda</b> bertanda lingkaran kuning. <b>Ambil</b> satu per satu, lalu <b>bawa</b> ke tong yang tepat di TPS (sisi kiri depan pabrik): hijau organik, kuning anorganik, merah B3.`);
      IT.forEach(I=>{I.o.visible=I.ring.visible=true;});setStep(1);}
    else if(R.step===2)G.orderGame('Prosedur penanganan limbah B3','Urutkan langkah dari awal sampai limbah keluar dari pabrik.',PR,sc,b=>{b.appendChild(el('div','fb ok','✅ Lima langkah itu memastikan limbah B3 <b>tidak pernah tercampur</b> dan selalu <b>terlacak</b>.'));
        b.appendChild(el('div','know','<b>Tahukah kamu?</b> Pengelolaan limbah B3 diatur dalam <b>PP No. 22 Tahun 2021</b>. Penghasil limbah bertanggung jawab atas limbahnya sampai ditangani pengelola berizin.'));b.appendChild(row(btn('Lanjut ▸','y',()=>{G.addCoins(30,'Prosedur B3 dikuasai');G.quiz(QUIZ,sc,finish);})));});
    else await say(TN,G.pick(['Ragu? Tanyakan: apakah benda ini pernah berisi atau terkena bahan kimia?','Kemasan bekas bahan berbahaya tetap limbah B3.','Satu baterai di tong yang salah mencemari satu tong penuh.']));}});
  R.step=-1;R.refresh();await say('Pak Harun · Kepala Pabrik','Dinas Lingkungan Hidup akan berkunjung minggu depan. Saya ingin pengelolaan limbah kita <b>rapi dan benar</b>.');await say('Pak Harun · Kepala Pabrik','Bantu <b>Bu Tini</b> memilah limbah pabrik. Temui beliau di Pos K3.');setStep(0);};
})();
