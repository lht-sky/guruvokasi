/* Pneumatik Tycoon — APD yang terlihat dipakai avatar */
(function(){
'use strict';
const {mesh,mat,box,cyl,at,grp}=G;
G.apd=A=>{const P={};const h=A.head;
  P.helm=grp(at(mesh(new THREE.SphereGeometry(.215,20,12,0,Math.PI*2,0,Math.PI/2),mat('#ffd000',{roughness:.4})),0,.12,0),at(cyl(.27,.27,.02,'#ffd000'),0,.13,.04));h.add(P.helm);
  P.kacamata=grp(at(box(.34,.09,.03,'#1d2a33',{transparent:true,opacity:.8,roughness:.1}),0,.03,.2),at(box(.36,.02,.02,'#111'),0,.08,.2));h.add(P.kacamata);
  P.masker=grp(at(box(.24,.13,.05,'#f5f5f5'),0,-.09,.19));h.add(P.masker);
  P.earmuff=grp(at(cyl(.075,.075,.06,'#d62828').rotateZ(Math.PI/2),-.215,0,0),at(cyl(.075,.075,.06,'#d62828').rotateZ(Math.PI/2),.215,0,0),at(box(.44,.03,.05,'#222'),0,.2,0));h.add(P.earmuff);
  P.sarung=grp();[A.armL,A.armR].forEach(a=>{const g=at(box(.23,.2,.25,'#ff7a00'),0,-.62,0);a.add(g);P.sarung.add(new THREE.Group());(P._g=P._g||[]).push(g);});
  const set=(k,on)=>{if(k==='sarung')P._g.forEach(g=>g.visible=on);else if(P[k])P[k].visible=on;};Object.keys(P).forEach(k=>k[0]!=='_'&&set(k,false));A.wear=set;A.strip=()=>['helm','kacamata','masker','earmuff','sarung'].forEach(k=>set(k,false));return A;};
})();
