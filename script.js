const $=id=>document.getElementById(id);
const AL=['?','O','A','B'];
const S={st:0,sc:0,t0:Date.now(),st0:Date.now(),e:[0,0],g:[0,0],x:[0,0],f:[0,0],m:[0,0],ph:null,done:[],sel:null,pl:new Set(),nom:'',cl:'',popped:new Set(),pt:0,tray:[0,1,2,3,4,5,6,7,8,9]};
const SP=[
 {id:'tg',ok:'gamétogénèse',w:['mitose','respiration'],t:1,x:245,y:47},
 {id:'tf',ok:'fécondation',w:['pollinisation','gestation'],t:1,x:525,y:47},
 {id:'egg',ok:'cellule-œuf',w:['ovule','cellule mère des gamètes'],x:640,y:555},
 {id:'sp',ok:'spermatozoïdes',w:['ovules','chromosomes'],x:400,y:92},
 {id:'ov',ok:'ovules',w:['spermatozoïdes','allèles'],x:400,y:765},
 {id:'gt',ok:'gamétogénèse',w:['mitose','fécondation'],x:291,y:425},
 {id:'fe',ok:'fécondation',w:['gamétogénèse','mitose'],x:470,y:425}];
const P=[{k:'ph'},{k:'dd'},{k:'e'},{k:'g'},{k:'f'},{k:'m'},{k:'g2'},{k:'ann'},{k:'v'}];
const HELP={dd:"Prends les chromosomes n°9 dans la réserve (à droite) et fais-les glisser dans les cellules, un par un. Attention : combien de chromosomes faut-il dans chaque cellule ?",
 ph:"Souviens-toi de la séance précédente : quel est le groupe sanguin (phénotype) de la dépouille de Joseph Goulding ?",
 e:"Remonte le temps ! La cellule-œuf de Joseph contient 2 chromosomes de la paire n°9. Touche le gène (la bande colorée) de chaque chromosome pour choisir son allèle (O, A ou B), puis valide.",
 g:"Les chromosomes de la cellule-œuf viennent des deux gamètes qui ont fusionné. Écris leurs allèles (spermatozoïde et ovule reliés à la cellule-œuf), puis valide.",
 f:"Le père est de phénotype [A]. Écris les allèles de sa cellule du testicule : elle doit avoir pu fabriquer le spermatozoïde de Joseph. Puis valide.",
 m:"La mère est de phénotype [B]. Écris les allèles de sa cellule de l'ovaire : elle doit avoir pu fabriquer l'ovule de Joseph. Puis valide.",
 g2:"Chaque parent produit 2 gamètes : écris les allèles du 2e spermatozoïde (en haut) et du 2e ovule (en bas), puis valide.",
 v:"Conclusion de l'enquête : qui a raison ?"};
const OKM=["Bravo, bien joué ! 🎉","Tu remontes la piste comme un vrai généticien ! 🧬","Excellent raisonnement ! 👏","Continue, tu y es presque ! 🚀","Super, le modèle prend forme ! ✨","Quelle rigueur scientifique ! 🔬","Magnifique, tu progresses vite ! 🌟"];
// ---- audio
let AC,mu=false,mt,ms=0;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state=='suspended')AC.resume();return AC}
function bip(fr,d=.15,ty='sine',v=.08,a_=0){const a=ac();if(!a)return;const t=a.currentTime+a_,o=a.createOscillator(),g=a.createGain();o.type=ty;o.frequency.value=fr;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d)}
function kick(){const a=ac();if(!a)return;const t=a.currentTime,o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(40,t+.15);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+.2)}
function hat(){const a=ac();if(!a)return;const b=a.createBuffer(1,a.sampleRate*.05,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=a.createBufferSource(),g=a.createGain(),f=a.createBiquadFilter();f.type='highpass';f.frequency.value=7000;s.buffer=b;g.gain.value=.04;s.connect(f);f.connect(g);g.connect(a.destination);s.start()}
const mf=n=>440*Math.pow(2,(n-69)/12),CH=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]],PE=[69,72,74,76,79];
function tick(){const s=ms%8,ch=CH[Math.floor(ms/8)%4];
 if(s==0)ch.forEach(n=>bip(mf(n),2,'triangle',.018));
 if(s%4==0)bip(mf(ch[0]-12),.45,'sine',.06);
 bip(mf(ch[s%3]+12+(s>3?12:0)),.3,'sine',.03);
 if(S.st>=3&&s%2==1)hat();
 if(S.st>=4&&s%4==0)kick();
 if(Math.random()<.35)bip(mf(PE[Math.floor(Math.random()*5)]+(S.st>=6?12:0)),.5,'triangle',.025);
 ms++}
const sfx={ok:()=>[523,659,784].forEach((f,i)=>bip(f,.18,'triangle',.1,i*.09)),ko:()=>{bip(220,.25,'sawtooth',.06);bip(165,.3,'sawtooth',.06,.12)},clic:()=>bip(700,.06,'square',.04),win:()=>[523,659,784,1047,784,1047,1319].forEach((f,i)=>bip(f,.25,'triangle',.1,i*.12))};
$('mu').onclick=()=>{ac();mu=!mu;clearInterval(mt);if(mu)mt=setInterval(tick,230);$('mu').textContent=mu?'🔇 Couper':'🎵 Musique'};
// ---- état
function say(m){$('msg').textContent=m}
function pts(n){S.sc=Math.max(0,S.sc+n);$('sc').textContent=S.sc}
function good(adv=true){const s=(Date.now()-S.st0)/1000,b=Math.max(0,Math.round(50-s));pts(100+b);S.st0=Date.now();sfx.ok();if(adv)S.st++;draw();say(OKM[Math.floor(Math.random()*OKM.length)]+" (+100 pts, bonus rapidité +"+b+")")}
function bad(m){pts(-20);sfx.ko();draw();say(m+" (−20 pts) Réessaie !")}
setInterval(()=>$('tm').textContent=Math.round((Date.now()-S.t0)/1000),1000);
const shuf=a=>a.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(v=>v[1]);
let ACT=[];
// ---- dessin (schéma tourné d'un quart de tour vers la gauche : chromosomes horizontaux, gène à droite, allèle au-dessus)
function hchr(cx,cy,al,id){if(id&&!S.pl.has(id))return'';
 const c={'?':'#bbb',O:'#7d7d7d',A:'#e0605a',B:'#4a86d8'}[al||'?'],act=ACT.includes(id);
 return `<g ${id?`class="sl" data-i="${id}"`:''} transform="translate(${cx},${cy})" opacity="${act||al!='?'?1:.65}"><rect x="-8" y="-42.5" width="16" height="85" rx="8" fill="#d9c9f0" stroke="#7a5aa8" stroke-width="2"/><rect x="-8" y="15.5" width="16" height="12" fill="${c}"/>${al?`<text x="13" y="28" font-size="18" font-weight="700" fill="${c}">${al}</text>`:''}${act?`<rect x="-15" y="-50" width="30" height="100" rx="14" fill="none" stroke="#e8a200" stroke-width="4"/>`:''}<rect x="-16" y="-50" width="${al?48:32}" height="100" fill="transparent"/></g>`}
function cell(cx,cy,col,t1,t2,a,b,ia,ib){return `<text x="${cx}" y="${cy-118}" text-anchor="middle" font-size="12" font-weight="700" fill="${col}">${t1}</text><text x="${cx}" y="${cy-104}" text-anchor="middle" font-size="11" fill="#666">${t2}</text><ellipse cx="${cx}" cy="${cy}" rx="105" ry="100" fill="${col}" fill-opacity=".3" stroke="${col}" stroke-width="3"/>${hchr(cx-40,cy,a,ia)}${hchr(cx+40,cy,b,ib)}${S.pl.has(ia)&&S.pl.has(ib)?`<text x="${cx}" y="${cy+78}" text-anchor="middle" font-size="13" fill="#555">paire n°9</text>`:''}`}
function gam(x,y,al,kind,id){const col=kind=='s'?'#4a86d8':'#e0605a';
 const sh=kind=='s'?`<ellipse cx="${x}" cy="${y}" rx="40" ry="55" fill="${col}" fill-opacity=".3" stroke="${col}" stroke-width="3"/><path d="M${x+40} ${y} q14 -10 26 4" stroke="${col}" stroke-width="3" fill="none"/>`:`<circle cx="${x}" cy="${y}" r="55" fill="${col}" fill-opacity=".3" stroke="${col}" stroke-width="3"/>`;
 return `<g>${sh}${hchr(x,y,al,id)}</g>`}
const arr=(a,b,c,d)=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>`;
function spot(sp,k){const f=S.done.includes(sp.id);if(!f&&!sp.t&&k!='ann'&&k!='v'&&k!='end')return'';
 const w=f?sp.ok.length*8.4+22:(sp.t?150:100),on=!f&&k=='ann',sel=S.sel==sp.id;
 return `<g class="sl ${on&&!sel?'bl':''}" data-sp="${sp.id}"><rect x="${sp.x-w/2}" y="${sp.y-13}" width="${w}" height="26" rx="13" fill="${f?'#2a6f6b':'#fff'}" fill-opacity="${f?1:.7}" stroke="${f?'#2a6f6b':'#e8a200'}" stroke-width="${sel?4:2}" ${f?'':'stroke-dasharray="6 4"'}/><text x="${sp.x}" y="${sp.y+5}" text-anchor="middle" font-size="14" font-weight="700" fill="${f?'#fff':'#c88a00'}">${f?sp.ok:'?'}</text><rect x="${sp.x-w/2}" y="${sp.y-22}" width="${w}" height="44" fill="transparent"/></g>`}
function draw(){
 const k=(P[S.st]||{k:'end'}).k;
 ACT={e:['e0','e1'],g:['s','o'],f:['f0','f1'],m:['m0','m1'],g2:['s2','o2']}[k]||[];
 document.documentElement.style.setProperty('--h',170+S.st*28+S.done.length*6);$('pb').style.width=Math.round((S.st+S.done.length/SP.length)/P.length*100)+'%';
 const W=k=='dd'?960:760;$('sv').setAttribute('viewBox',`0 0 ${W} 800`);
 let h=`<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="#888"/></marker></defs><style>text{font-family:system-ui,sans-serif}</style><rect width="${W}" height="800" fill="#fbf9f3"/>`;
 h+='<text x="380" y="24" text-anchor="middle" font-size="15" font-weight="700" fill="#333">Schéma représentant la transmission des chromosomes</text><text x="94" y="52" font-size="15" font-weight="700" fill="#333">lors de la</text><text x="332" y="52" font-size="15" font-weight="700" fill="#333">puis lors de la</text>';
 SP.filter(s=>s.t).forEach(s=>h+=spot(s,k));
 h+=cell(125,250,'#4a86d8','PÈRE — phénotype [A]','(cellule du testicule)',AL[S.f[0]],AL[S.f[1]],'f0','f1')+cell(125,600,'#e0605a','MÈRE — phénotype [B]',"(cellule de l'ovaire)",AL[S.m[0]],AL[S.m[1]],'m0','m1');
 h+=arr(232,240,346,172)+arr(232,262,346,328)+arr(232,590,346,522)+arr(232,612,346,678);
 h+=gam(400,165,AL[S.x[0]],'s','s2')+gam(400,335,AL[S.g[0]],'s','s')+gam(400,515,AL[S.g[1]],'o','o')+gam(400,685,AL[S.x[1]],'o','o2');
 h+=arr(472,345,546,400)+arr(456,500,546,452);
 h+=`<ellipse cx="640" cy="425" rx="100" ry="100" fill="#e8c84a" fill-opacity=".35" stroke="#c9a400" stroke-width="3"/>${hchr(600,425,AL[S.e[0]],'e0')}${hchr(680,425,AL[S.e[1]],'e1')}${S.pl.has('e0')&&S.pl.has('e1')?'<text x="640" y="503" text-anchor="middle" font-size="13" fill="#555">paire n°9</text>':''}<text x="630" y="600" text-anchor="middle" font-size="14" font-weight="700" fill="#7a5f00">Joseph Goulding</text><text x="630" y="620" text-anchor="middle" font-size="13" font-weight="700" fill="#7a5f00">groupe sanguin (phénotype) : [${S.ph||'?'}]</text>`;
 SP.filter(s=>!s.t).forEach(s=>h+=spot(s,k));
 if(k=='dd'){h+='<rect x="756" y="105" width="196" height="300" rx="12" fill="#efe9dc" stroke="#c9b98f" stroke-width="2"/><text x="854" y="132" text-anchor="middle" font-size="13" font-weight="700" fill="#7a6a3a">Réserve de chromosomes n°9</text><text x="854" y="150" text-anchor="middle" font-size="11" fill="#7a6a3a">glisse-les dans les cellules</text>';S.tray.forEach((t,i)=>{h+=`<g data-t="${t}" style="touch-action:none;cursor:grab">${hchr(780+(i%5)*36,215+Math.floor(i/5)*115,'',null)}</g>`})}
 h+=tagSVG();$('sv').innerHTML=h;
 const q=$('q');q.innerHTML='';
 if(k=='ph'){say(HELP.ph);['O','A','B','AB'].forEach(g=>btn('Groupe '+g,()=>{if(g=='O'){S.ph='O';good()}else bad("Ce n'est pas le groupe sanguin trouvé sur la dépouille.")}))}
 else if(k=='dd'){say(HELP.dd);bindDrag()}
 else if(k=='e'){say(HELP.e);btn("✅ Valider la cellule-œuf",valE)}
 else if(k=='g'){say(HELP.g);btn("✅ Valider les gamètes",valG)}
 else if(k=='f'||k=='m'){say(HELP[k]);btn("✅ Valider "+(k=='f'?'le père':'la mère'),()=>val(k))}
 else if(k=='g2'){say(HELP.g2);btn("✅ Valider les 2 autres gamètes",valG2)}
 else if(k=='ann'){if(S.sel)propose(S.sel);else say(`Touche un emplacement qui clignote lentement pour y placer un terme (${S.done.length}/${SP.length}).`)}
 else if(k=='v'){say(HELP.v);btn("Les neveux ont raison",()=>fin(false));btn("Les autorités ont raison",()=>fin(true))}
 const M={e0:[S.e,0],e1:[S.e,1],s:[S.g,0],o:[S.g,1],s2:[S.x,0],o2:[S.x,1],f0:[S.f,0],f1:[S.f,1],m0:[S.m,0],m1:[S.m,1]};
 document.querySelectorAll('[data-i]').forEach(e=>e.onclick=()=>{ac();const id=e.dataset.i;if(ACT.includes(id)){const [a,n]=M[id];a[n]=a[n]%3+1;sfx.clic();draw()}else say("Ce n'est pas le moment de modifier ce chromosome.")});
 document.querySelectorAll('[data-sp]').forEach(e=>e.onclick=()=>{ac();if(k!='ann'){say("Les termes se placent à la fin, quand tous les allèles sont écrits.");return}const id=e.dataset.sp;if(S.done.includes(id))return;sfx.clic();S.sel=id;draw()});
 ensurePop(k);
}
const ZN={mo:{x:20,y:500,w:210,h:200,s:['m0','m1']},fa:{x:20,y:150,w:210,h:200,s:['f0','f1']},egg:{x:540,y:325,w:200,h:200,s:['e0','e1']},s2:{x:350,y:110,w:100,h:110,s:['s2']},s:{x:350,y:280,w:100,h:110,s:['s']},o:{x:350,y:460,w:100,h:110,s:['o']},o2:{x:350,y:630,w:100,h:110,s:['o2']}};
let drag=null;
function svgPt(e){const s=$('sv'),p=s.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(s.getScreenCTM().inverse())}
function bindDrag(){document.querySelectorAll('[data-t]').forEach(el=>{
 el.onpointerdown=ev=>{ac();ev.preventDefault();el.setPointerCapture(ev.pointerId);drag={el,p0:svgPt(ev),id:+el.dataset.t};el.setAttribute('opacity','.8')};
 el.onpointermove=ev=>{if(!drag||drag.el!==el)return;const p=svgPt(ev);el.setAttribute('transform',`translate(${p.x-drag.p0.x},${p.y-drag.p0.y})`)};
 el.onpointerup=ev=>{if(!drag||drag.el!==el)return;const p=svgPt(ev),id=drag.id;drag=null;drop(id,p)};
 el.onpointercancel=()=>{drag=null;draw()}})}
function drop(id,p){const z=Object.keys(ZN).find(k=>{const r=ZN[k];return p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h});
 if(!z){draw();say("Dépose le chromosome à l'intérieur d'une cellule.");return}
 const sl=ZN[z].s.find(s=>!S.pl.has(s));
 if(!sl)return bad(['fa','mo','egg'].includes(z)?"Cette cellule contient déjà sa paire : la cellule-œuf et les cellules du testicule et de l'ovaire ont 2 chromosomes n°9.":"Un gamète ne contient qu'UN seul chromosome de chaque paire.");
 S.pl.add(sl);S.tray=S.tray.filter(t=>t!=id);sfx.clic();pts(10);
 if(!S.tray.length)good();else{draw();say(`Bien placé ! Encore ${S.tray.length} chromosome${S.tray.length>1?'s':''} à placer.`)}}
function propose(id){const sp=SP.find(s=>s.id==id);say("Quel terme faut-il placer à cet endroit ?");shuf([sp.ok,...sp.w]).forEach(o=>btn(o,()=>{if(o==sp.ok){S.done.push(id);S.sel=null;good(S.done.length==SP.length)}else bad("Ce n'est pas le bon terme pour cet emplacement.")}))}
function btn(t,f){const b=document.createElement('button');b.textContent=t;b.onclick=()=>{ac();f()};$('q').appendChild(b)}
function valE(){if(S.e.includes(0))return bad("Il reste un gène sans allèle.");
 if(S.e.some(x=>x!=1))return bad("Le groupe [O] ne s'exprime que si les deux allèles sont O (l'allèle O est récessif).");good()}
function valG(){if(S.g.includes(0))return bad("Il reste un gène sans allèle.");
 if(S.g.some(x=>x!=1))return bad("Les chromosomes de la cellule-œuf viennent des gamètes : le spermatozoïde et l'ovule portent donc O.");good()}
function val(w){const a=(w=='f'?S.f:S.m).map(i=>AL[i]),X=w=='f'?'A':'B',Y=w=='f'?'B':'A',n=w=='f'?'le père':'la mère';
 if(a.includes('?'))return bad("Il reste un gène sans allèle.");
 if(a.includes(Y))return bad(`Avec un allèle ${Y}, ${n} ne serait pas de groupe ${X}.`);
 if(!a.includes('O'))return bad("Cette cellule ne peut pas donner un gamète O comme celui de Joseph : il lui faut un allèle O.");
 if(!a.includes(X))return bad(`Sans allèle ${X}, ${n} serait de groupe O et non ${X}.`);
 good()}
function valG2(){if(S.x.includes(0))return bad("Il reste un gène sans allèle.");
 const fo=S.f[1-S.f.indexOf(1)],mo=S.m[1-S.m.indexOf(1)];
 if(S.x[0]!=fo||S.x[1]!=mo)return bad("Le 2e gamète reçoit l'autre chromosome de la paire du parent (celui qui n'est pas dans le gamète de Joseph).");good()}
function fin(ok){if(ok){S.st++;pts(150);sfx.win();draw();say("🏆 Enquête résolue ! Score final : "+S.sc+" pts");
 const c=$('cons');c.hidden=false;c.innerHTML="<b>Conclusion :</b> le père (A) peut être A//O et la mère (B) peut être B//O. Chacun transmet son allèle O à Joseph : il est O//O, donc de groupe O. Les neveux ont raison sur le groupe des parents, mais ce n'est pas contradictoire : la dépouille peut bien être celle de Joseph. <b>Les autorités militaires ont raison.</b> 📸 Pense à ta capture d'écran !"}
 else bad("Réfléchis : avec des parents A//O et B//O, un enfant O est-il possible ?")}
$('cap').onclick=async()=>{try{const s=$('sv').cloneNode(true),vb=$('sv').viewBox.baseVal,W=vb.width*2,H=vb.height*2;s.setAttribute('width',W);s.setAttribute('height',H);
 const tg=s.querySelector('#tag');if(tg){const tt=tg.querySelectorAll('text');tt[1].textContent=tagL2()}
 const u='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(s));
 const im=new Image();await new Promise((r,j)=>{im.onload=r;im.onerror=j;im.src=u});
 const c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').drawImage(im,0,0);
 const bl=await new Promise(r=>c.toBlob(r,'image/png'));
 const a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download='enquete-goulding.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);say("📸 Capture enregistrée !")}catch(e){say("Capture impossible ici : utilise la capture d'écran de ton iPad (bouton du haut + volume).")}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tagL2=()=>`Score : ${S.sc} pts · Temps : ${Math.round((Date.now()-S.t0)/1000)} s · ${new Date().toLocaleDateString('fr-FR')}`;
function tagSVG(){return `<g id="tag"><rect x="480" y="738" width="270" height="50" rx="12" fill="#fff8e1" stroke="#c9a400" stroke-width="2"/><text x="615" y="758" text-anchor="middle" font-size="13" font-weight="700" fill="#5a4a00">Élève : ${esc(S.nom)} — ${esc(S.cl)}</text><text x="615" y="777" text-anchor="middle" font-size="11" fill="#5a4a00">${tagL2()}</text></g>`}
const CONS={
 ph:['Étape 1/9 · Le phénotype de Joseph',`<p>À droite du schéma se trouve la <b>cellule-œuf</b> dont est issu Joseph Goulding.</p><p>Choisis, avec les boutons, le <b>groupe sanguin (phénotype)</b> trouvé sur sa dépouille lors de la séance précédente.</p><p>✅ +100 pts (+ bonus de rapidité) · ❌ −20 pts</p>`],
 dd:['Étape 2/9 · Les chromosomes dans les cellules',`<p>Dans la <b>réserve</b> (à droite), prends les chromosomes n°9 <b>un par un</b>, avec le doigt ou la souris, et dépose-les dans les cellules : cellule du père, cellule de la mère, cellule-œuf et les 4 gamètes.</p><p>Réfléchis : combien de chromosomes n°9 faut-il dans chaque cellule ? et dans chaque gamète ?</p><p>✅ +10 pts par bon dépôt · ❌ −20 pts si la cellule est déjà complète</p>`],
 e:['Étape 3/9 · Les allèles de la cellule-œuf',`<p>On remonte le temps ! Touche le <b>gène</b> (la bande colorée) de chacun des 2 chromosomes de la cellule-œuf : l'<b>allèle</b> change à chaque appui (O, A, B).</p><p>Choisis des allèles qui expliquent le phénotype de Joseph, puis appuie sur <b>Valider</b>.</p>`],
 g:['Étape 4/9 · Les gamètes de Joseph',`<p>La cellule-œuf provient de la rencontre d'un spermatozoïde et d'un ovule : ce sont les deux gamètes reliés à la cellule-œuf par une flèche.</p><p>Inscris l'allèle porté par le chromosome de chacun, puis valide. Indice : chaque chromosome de la cellule-œuf vient d'un gamète.</p>`],
 f:['Étape 5/9 · La cellule du père',`<p>Le père a pour phénotype <b>[A]</b>. Écris les allèles des 2 chromosomes de sa <b>cellule du testicule</b> : elle doit pouvoir produire le spermatozoïde de Joseph.</p><p>Touche le gène de chaque chromosome, puis valide.</p>`],
 m:['Étape 6/9 · La cellule de la mère',`<p>La mère a pour phénotype <b>[B]</b>. Écris les allèles des 2 chromosomes de sa <b>cellule de l'ovaire</b> : elle doit pouvoir produire l'ovule de Joseph.</p><p>Touche le gène de chaque chromosome, puis valide.</p>`],
 g2:['Étape 7/9 · Les 2 autres gamètes',`<p>Chaque cellule des parents produit 2 gamètes. Complète les allèles du <b>2ᵉ spermatozoïde</b> (en haut) et du <b>2ᵉ ovule</b> (en bas).</p><p>Réfléchis : où va l'autre chromosome de la paire du parent ?</p>`],
 ann:['Étape 8/9 · Annoter le schéma',`<p>Des emplacements <b>clignotent lentement</b>. Touches-en un (dans l'ordre que tu veux), puis choisis le bon terme parmi 3 propositions.</p><p>Les 2 blancs du <b>titre</b> sont aussi à compléter.</p><p>✅ +100 pts par terme · ❌ −20 pts</p>`],
 v:['Étape 9/9 · Le verdict',`<p>Observe ton schéma complet : avec les phénotypes du père et de la mère, Joseph peut-il être de phénotype [O] ? Choisis qui a raison : <b>les neveux</b> ou <b>les autorités militaires</b>.</p><p>Ensuite, fais la <b>capture d'écran</b> : elle contient ton prénom, ta classe et ton score.</p>`]};
function showPop(t,html,form,btn){$('ptit').textContent=t;$('ptxt').innerHTML=html;$('pform').hidden=!form;$('perr').textContent='';$('pgo').textContent=btn||`J'ai compris ✔`;$('pop').hidden=false;S.pt=Date.now()}
function showIntro(){showPop('Bienvenue, jeune enquêteur !',`<p>Joseph Goulding, soldat australien, a été identifié grâce à sa dépouille. Ses neveux contestent cette identification, les autorités militaires la confirment.</p><p>À toi de trancher en construisant le schéma de la transmission des chromosomes lors de la gamétogénèse puis de la fécondation.</p><p><b>Inscris ton prénom et ta classe</b> : ils apparaîtront sur ta capture d'écran finale.</p>`,true,`Commencer l'enquête`)}
function ensurePop(k){if(!S.nom){if($('pop').hidden)showIntro();return}if(CONS[k]&&!S.popped.has(k)){S.popped.add(k);showPop(CONS[k][0],CONS[k][1],false)}}
$('hp').onclick=()=>{ac();const k=(P[S.st]||{}).k;if(S.nom&&CONS[k])showPop(CONS[k][0],CONS[k][1],false)};
$('pgo').onclick=()=>{ac();if(!S.nom){const n=$('inom').value.trim(),c=$('icl').value.trim();if(!n||!c){$('perr').textContent='Écris ton prénom et ta classe pour commencer.';return}S.nom=n;S.cl=c}
 const d=Date.now()-S.pt;S.t0+=d;S.st0+=d;$('pop').hidden=true;draw()};
draw();
