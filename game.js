{
const PI=Math.PI,TAU=PI*2;
const $=s=>document.querySelector(s);
let RNG=Math.random;const mulberry=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const rnd=n=>Math.floor(RNG()*n),rf=(a,b)=>a+RNG()*(b-a),clamp=(v,a,b)=>v<a?a:v>b?b:v;
const wrapA=a=>{while(a>PI)a-=TAU;while(a<-PI)a+=TAU;return a};
const T=4,WALLH=5;
const HEROES={
 barbarian:{name:'Barbarian',col:0x7a4a26,css:'#d08a48',hp:1000,speed:3.6,eye:1.85,rad:.72,rate:.85,sec:'cool',torch:0xffa860,
  tiers:['Iron Crescent','Twin Reaver','Bloodsteel Cleaver','Runed Stormsplitter','Skull Worldbreaker'],tint:[0xb0b0b0,0xffffff,0xffb0a0,0xd0fff8,0xffffff],glow:[0,0,0xff4020,0x40ffe0,0xa8d8ff],
  a1:'Axe Slam',a1cd:10,blurb:'Big, slow, leather and fur. Most health. Throws stunningly powerful double-bladed battle axes without end. His ground slam kills everything around him.'},
 elf:{name:'Elf',col:0x2f7a30,css:'#5cc95f',hp:500,speed:7.2,eye:1.55,rad:.55,rate:.16,sec:'shield',shield:220,torch:0xffd8a0,
  tiers:['Carved Ashwood Bow','Silverstring','Windrunner','Starsong','Moonfire Longbow'],tint:[0xffffff,0xf0f4ff,0xc8ffd8,0xc8e0ff,0xfff0c0],glow:[0,0,0x60ff90,0x80b8ff,0xffd070],
  a1:'Dash',a1cd:1.3,blurb:'Twice as fast as the Barbarian, with lightning arrows from a carved bow. A small shield soaks hits and regrows, and his health heals slowly. Half the Barbarian’s health.'},
 wizard:{name:'Wizard',col:0xd8dbe0,css:'#e3e9f0',hp:650,speed:4.6,eye:1.7,rad:.6,rate:.24,sec:'mana',torch:0xc8dcff,
  tiers:['Spark Bolt','Arc Lance','Frost Lightning','Prism Beam','Starfire'],tint:[0xbfe4ff,0xb88cff,0x7ff0ff,0xff8cf0,0xfff09a],glow:[0x9fd8ff,0xb88cff,0x7ff0ff,0xff8cf0,0xfff09a],
  a1:'Heal',a1cd:1.2,blurb:'Magic beams from his fingertips and a spiral staff to swing. Heals himself and nearby friends. His eternal bubble lets in only 1 enemy in 15. Kills refill his magic.'},
 valkyrie:{name:'Valkyrie',col:0xb3202e,css:'#e8505d',hp:800,speed:5.2,eye:1.68,rad:.58,rate:.3,sec:'cool',torch:0xffb878,
  tiers:['Ruby Dagger','Swiftsteel','Hawkfang','Spirit Talon','Phoenix Barb'],tint:[0xffffff,0xf0f8ff,0xfff0d0,0xd0f4ff,0xd8f8ff],glow:[0,0,0xffb040,0x80e0ff,0x80e8ff],
  a1:'Blade Fan',a1cd:7,blurb:'A warrior in red and gold. Endless ruby-hilted throwing daggers that fly faster and farther as she grows. More health than the Wizard, less than the Barbarian.'}
};
const HK=Object.keys(HEROES);
const TIERP=[0,420,1050,1800,2700];
const EDEF={
 ghost:{hp:2,speed:3.4,touch:18,pts:10,burst:0xbfd0ff,r:.45,kami:true,eye:[.5,.95,1],ey:1.6,ez:.32,ex:.09,gen:0x7fd8ff},
 tspider:{hp:9000,speed:0,touch:25,pts:5000,burst:0x803020,r:2.2,boss:true,eye:[1,.1,.1],ey:3.4,ez:.3,ex:.1,gen:0xff2020},
 egg:{hp:30,speed:0,touch:0,pts:25,burst:0x9a8060,r:.75,egg:true,eye:[0,0,0],ey:0,ez:0,ex:0,gen:0xd09040},
 gremlin:{hp:10,speed:4.6,touch:16,pts:75,burst:0x6a8a30,r:.42,eye:[1,.9,.2],ey:1.25,ez:.25,ex:.07,gen:0x9fe060},
 spiderling:{hp:4,speed:5.6,touch:10,pts:15,burst:0x503020,r:.5,eye:[1,.1,.1],ey:.7,ez:.45,ex:.08,gen:0xff2020},
 grunt:{hp:5,speed:3.1,touch:12,pts:20,burst:0x8fa040,r:.5,eye:[1,.2,.1],ey:1.82,ez:.3,ex:.12,gen:0x9fe060},
 demon:{hp:7,speed:2.7,touch:14,pts:30,burst:0xff5030,r:.5,shoots:true,eye:[1,.85,.2],ey:2.1,ez:.3,ex:.13,gen:0xff7030},
 lobber:{hp:4,speed:2.8,touch:6,pts:40,burst:0xb08850,r:.42,lob:true,eye:[1,.6,.1],ey:1.18,ez:.27,ex:.08,gen:0xffb040},
 sorcerer:{hp:6,speed:3.2,touch:12,pts:50,burst:0xb060ff,r:.5,blink:true,eye:[.85,.45,1],ey:1.8,ez:.24,ex:.08,gen:0xc070ff},
 death:{hp:1e9,speed:3.5,touch:0,pts:1000,burst:0x403848,r:.5,death:true,eye:[1,.1,.05],ey:2.08,ez:.2,ex:.08,gen:0xff2030},
 gargoyle:{hp:4,speed:4.2,touch:11,pts:30,burst:0x70ff60,r:.5,eye:[.6,1,.3],ey:2.1,ez:.3,ex:.1,gen:0x80ff60},
 naga:{hp:14,speed:2.3,touch:22,pts:60,burst:0xc8a050,r:.62,eye:[1,.2,.1],ey:2.0,ez:.3,ex:.1,gen:0xd0a050},
 eel:{hp:3,speed:5.4,touch:13,pts:40,burst:0x60ff90,r:.45,water:true,eye:[.5,1,.6],ey:.6,ez:.5,ex:.08,gen:0x60ff90},
 drowned:{hp:6,speed:2.4,touch:14,pts:35,burst:0x8a9a70,r:.5,water:true,eye:[.4,1,1],ey:1.95,ez:.25,ex:.09,gen:0x60c0c0},
 drownbrute:{hp:13,speed:1.9,touch:24,pts:60,burst:0x9a7a50,r:.6,water:true,eye:[1,.5,.2],ey:2.05,ez:.25,ex:.1,gen:0xc08040}
};
const N8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
const ICON={
 barbarian:'<svg viewBox="0 0 24 24"><path d="M12 3v18M12 5c-5 0-7 3-7 7 3 0 5-2 7-4M12 5c5 0 7 3 7 7-3 0-5-2-7-4"/></svg>',
 elf:'<svg viewBox="0 0 24 24"><path d="M7 3c8 4 8 14 0 18M7 3v18M3 12h16M16 9l3 3-3 3"/></svg>',
 wizard:'<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="3"/><path d="M12 8v14M9 11l6 3M9 15l6 3"/></svg>',
 valkyrie:'<svg viewBox="0 0 24 24"><path d="M12 2l3 10H9zM7 13h10M12 13v8"/></svg>'
};
const COARSE=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
let quality=COARSE?'fast':'high';try{const q=localStorage.getItem('sgvr-q');if(q==='fast'||q==='high')quality=q}catch(e){}

// ---------- renderer & scene
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.shadowMap.autoUpdate=false;
renderer.setSize(innerWidth,innerHeight);renderer.xr.enabled=true;
$('#stage').appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0b0705);scene.fog=new THREE.FogExp2(0x0b0705,.034);
const HEMI=new THREE.HemisphereLight(0x8a6e5a,0x1a100a,.55);scene.add(HEMI);
const menuCam=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.05,120);scene.add(menuCam);
const _v=new THREE.Vector3(),_v2=new THREE.Vector3(),_q=new THREE.Quaternion(),_up=new THREE.Vector3(0,1,0);
const lin=h=>new THREE.Color(h).convertSRGBToLinear();
function std(o){o=o||{};const c=o.color,e=o.emissive;delete o.color;delete o.emissive;const m=new THREE.MeshStandardMaterial(Object.assign({roughness:.75,metalness:0},o));if(c!==undefined)m.color.copy(lin(c));if(e!==undefined)m.emissive.copy(lin(e));return m}
const stdv=o=>std(Object.assign({vertexColors:true},o||{}));

// ---------- procedural PBR surfaces
function surf(w,h,draw,str){
 const mk=()=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
 const A=mk(),Hc=mk(),R=mk();draw(A.getContext('2d'),Hc.getContext('2d'),R.getContext('2d'),w,h);
 const hd=Hc.getContext('2d').getImageData(0,0,w,h).data,N=mk(),nx=N.getContext('2d'),nd=nx.createImageData(w,h);
 const H=(x,y)=>hd[(((y+h)%h)*w+((x+w)%w))*4]/255;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const dx=(H(x+1,y)-H(x-1,y))*str,dy=(H(x,y+1)-H(x,y-1))*str,l=Math.sqrt(dx*dx+dy*dy+1),o=(y*w+x)*4;nd.data[o]=(-dx/l*.5+.5)*255;nd.data[o+1]=(dy/l*.5+.5)*255;nd.data[o+2]=(1/l*.5+.5)*255;nd.data[o+3]=255}
 nx.putImageData(nd,0,0);
 const t=c=>{const x=new THREE.CanvasTexture(c);x.wrapS=x.wrapT=THREE.RepeatWrapping;x.anisotropy=8;return x};
 const map=t(A);map.encoding=THREE.sRGBEncoding;return{map,normalMap:t(N),roughnessMap:t(R)};
}
const speck=(c,w,h,n,a)=>{for(let i=0;i<n;i++){c.fillStyle=`rgba(${Math.random()<.5?0:255},${Math.random()<.5?0:255},${Math.random()<.5?0:255},${Math.random()*a})`;c.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*2)}};
function stone(a,hc,r,w,h,cracks){
 a.fillStyle='#1a120c';a.fillRect(0,0,w,h);hc.fillStyle='#202020';hc.fillRect(0,0,w,h);r.fillStyle='#f0f0f0';r.fillRect(0,0,w,h);
 let y=0;while(y<h){const rh=58+rnd(26);let x=-rnd(90);while(x<w){const bw=90+rnd(70),m=4;
   a.fillStyle=`hsl(${20+rnd(14)},${10+rnd(14)}%,${24+rnd(14)}%)`;a.fillRect(x+m,y+m,bw-2*m,rh-2*m);
   for(let b=0;b<7;b++){const g=90+b*22;hc.fillStyle=`rgb(${g},${g},${g})`;hc.fillRect(x+m+b,y+m+b,bw-2*m-2*b,rh-2*m-2*b)}
   for(let k=0;k<40;k++){const v=150+rnd(90);hc.fillStyle=`rgba(${v},${v},${v},.5)`;hc.fillRect(x+m+8+Math.random()*(bw-30),y+m+8+Math.random()*(rh-30),3+rnd(9),3+rnd(7))}
   a.fillStyle='rgba(255,220,170,.06)';a.fillRect(x+m,y+m,bw-2*m,6);a.fillStyle='rgba(0,0,0,.25)';a.fillRect(x+m,y+rh-m-6,bw-2*m,6);
   r.fillStyle=`rgb(${200+rnd(40)},${200+rnd(40)},${200+rnd(40)})`;r.fillRect(x+m,y+m,bw-2*m,rh-2*m);x+=bw}y+=rh}
 speck(a,w,h,9000,.12);
 let gr=a.createLinearGradient(0,h*.72,0,h);gr.addColorStop(0,'rgba(30,40,20,0)');gr.addColorStop(1,'rgba(30,40,18,.6)');a.fillStyle=gr;a.fillRect(0,h*.72,w,h*.28);
 gr=a.createLinearGradient(0,0,0,h*.25);gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');a.fillStyle=gr;a.fillRect(0,0,w,h*.25);
 if(cracks)for(let k=0;k<7;k++){let px=w*.5+rf(-60,60),py=h*.5+rf(-80,80);a.strokeStyle='rgba(0,0,0,.85)';hc.strokeStyle='#000';a.lineWidth=hc.lineWidth=4-k*.3;a.beginPath();hc.beginPath();a.moveTo(px,py);hc.moveTo(px,py);for(let s=0;s<9;s++){px+=rf(-40,40);py+=rf(-45,45);a.lineTo(px,py);hc.lineTo(px,py)}a.stroke();hc.stroke()}
 if(cracks){a.fillStyle='rgba(255,140,60,.12)';a.fillRect(0,0,w,h)}
}
const WALL=surf(512,640,(a,hc,r,w,h)=>stone(a,hc,r,w,h,false),3.2);
const CRACK=surf(512,640,(a,hc,r,w,h)=>stone(a,hc,r,w,h,true),3.2);
const FLOOR=surf(512,512,(a,hc,r,w,h)=>{
 a.fillStyle='#0e0a07';a.fillRect(0,0,w,h);hc.fillStyle='#181818';hc.fillRect(0,0,w,h);r.fillStyle='#fff';r.fillRect(0,0,w,h);
 for(let j=0;j<2;j++)for(let i=0;i<2;i++){const x=i*256+4+rnd(6),y=j*256+4+rnd(6),s=244-rnd(10);a.fillStyle=`hsl(${22+rnd(10)},${8+rnd(8)}%,${16+rnd(8)}%)`;a.fillRect(x,y,s,s);
  for(let b=0;b<6;b++){const g=110+b*20;hc.fillStyle=`rgb(${g},${g},${g})`;hc.fillRect(x+b,y+b,s-2*b,s-2*b)}r.fillStyle=`rgb(${185+rnd(50)},${185+rnd(50)},${185+rnd(50)})`;r.fillRect(x,y,s,s);
  a.strokeStyle='rgba(0,0,0,.55)';hc.strokeStyle='#202020';a.lineWidth=hc.lineWidth=2;for(let c=0;c<2;c++){a.beginPath();hc.beginPath();let px=x+rnd(s),py=y+rnd(s);a.moveTo(px,py);hc.moveTo(px,py);for(let k=0;k<5;k++){px+=rf(-40,40);py+=rf(-40,40);a.lineTo(px,py);hc.lineTo(px,py)}a.stroke();hc.stroke()}}
 speck(a,w,h,8000,.1);
 for(let k=0;k<3;k++){const x=rnd(w),y=rnd(h),rx=30+rnd(60),ry=20+rnd(40);r.fillStyle='rgb(35,35,35)';r.beginPath();r.ellipse(x,y,rx,ry,Math.random()*3,0,TAU);r.fill();a.fillStyle='rgba(0,0,0,.35)';a.beginPath();a.ellipse(x,y,rx,ry,0,0,TAU);a.fill()}
},2.5);
const WOOD=surf(256,320,(a,hc,r,w,h)=>{
 for(let i=0;i<5;i++){const x=i*51;a.fillStyle=`hsl(${24+rnd(6)},${35+rnd(15)}%,${18+rnd(8)}%)`;a.fillRect(x,0,51,h);hc.fillStyle='#b0b0b0';hc.fillRect(x+2,0,47,h);hc.fillStyle='#303030';hc.fillRect(x,0,2,h);a.fillStyle='rgba(0,0,0,.6)';a.fillRect(x,0,2,h);
  for(let k=0;k<26;k++){a.strokeStyle=`rgba(0,0,0,${Math.random()*.3})`;a.beginPath();const gx=x+4+Math.random()*43;a.moveTo(gx,0);a.bezierCurveTo(gx+rf(-6,6),h*.3,gx+rf(-6,6),h*.7,gx+rf(-4,4),h);a.stroke()}}
 r.fillStyle='#d8d8d8';r.fillRect(0,0,w,h);
 for(const y of [50,250]){a.fillStyle='#2c2a2a';a.fillRect(0,y,w,26);hc.fillStyle='#f0f0f0';hc.fillRect(0,y,w,26);r.fillStyle='#707070';r.fillRect(0,y,w,26);for(let x=12;x<w;x+=40){a.fillStyle='#4a4848';a.beginPath();a.arc(x,y+13,5,0,TAU);a.fill()}}
 speck(a,w,h,2500,.1);
},2.2);
// hero surfaces
function scrolls(ctxs,w,h,n,lw){for(let i=0;i<n;i++){const x=rnd(w),y=rnd(h),R=8+rnd(20),st=Math.random()*TAU,dir=Math.random()<.5?1:-1;for(const [c,col] of ctxs){c.strokeStyle=col;c.lineWidth=lw;c.beginPath();for(let t=0;t<10;t+=.25){const rr=R*(1-t/11),an=st+t*dir;c.lineTo(x+Math.cos(an)*rr,y+Math.sin(an)*rr)}c.stroke()}}}
function knots(ctxs,w,h,lw){for(let y=0;y<h;y+=32)for(let x=0;x<w;x+=32)for(const [c,col] of ctxs){c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.moveTo(x,y+16);c.bezierCurveTo(x+8,y,x+24,y+32,x+32,y+16);c.moveTo(x,y+16);c.bezierCurveTo(x+8,y+32,x+24,y,x+32,y+16);c.stroke()}}
const TX={
 leather:surf(256,256,(a,hc,r,w,h)=>{a.fillStyle='#4a2414';a.fillRect(0,0,w,h);hc.fillStyle='#808080';hc.fillRect(0,0,w,h);r.fillStyle='#b8b8b8';r.fillRect(0,0,w,h);speck(a,w,h,4000,.12);
  scrolls([[a,'rgba(18,6,2,.55)'],[hc,'#d8d8d8']],w,h,22,3);
  a.fillStyle='rgba(230,200,150,.45)';for(let x=4;x<w;x+=11){a.fillRect(x,10,6,2);a.fillRect(x,h-12,6,2)}
  for(let x=18;x<w;x+=48)for(const y of [26,h-28]){a.fillStyle='#b8b8b0';a.beginPath();a.arc(x,y,6,0,TAU);a.fill();hc.fillStyle='#fff';hc.beginPath();hc.arc(x,y,6,0,TAU);hc.fill();r.fillStyle='#303030';r.beginPath();r.arc(x,y,6,0,TAU);r.fill()}
  a.strokeStyle='rgba(20,10,4,.8)';a.lineWidth=2;for(let x=30;x<w;x+=48){a.beginPath();a.moveTo(x,60);a.lineTo(x+20,90);a.lineTo(x,120);a.lineTo(x+20,150);a.lineTo(x,180);a.stroke()}},3),
 wool:surf(256,256,(a,hc,r,w,h)=>{a.fillStyle='#3a6a2c';a.fillRect(0,0,w,h);hc.fillStyle='#808080';hc.fillRect(0,0,w,h);r.fillStyle='#fff';r.fillRect(0,0,w,h);for(let i=0;i<12000;i++){const x=Math.random()*w,y=Math.random()*h;a.fillStyle=`hsla(${92+rnd(28)},${30+rnd(25)}%,${24+rnd(26)}%,.55)`;a.fillRect(x,y,2,2);const v=rnd(255);hc.fillStyle=`rgba(${v},${v},${v},.5)`;hc.fillRect(x,y,2,2)}},2.2),
 fur:surf(256,256,(a,hc,r,w,h)=>{a.fillStyle='#4a3018';a.fillRect(0,0,w,h);hc.fillStyle='#606060';hc.fillRect(0,0,w,h);r.fillStyle='#fff';r.fillRect(0,0,w,h);for(let i=0;i<5000;i++){const x=Math.random()*w,y=Math.random()*h,l=rf(5,14),an=PI/2+rf(-.6,.6),v=120+rnd(130);a.strokeStyle=`hsla(${24+rnd(12)},${30+rnd(25)}%,${18+rnd(38)}%,.75)`;hc.strokeStyle=`rgba(${v},${v},${v},.6)`;for(const c of [a,hc]){c.lineWidth=1.6;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(an)*l*.5+2,y+Math.sin(an)*l*.5,x+Math.cos(an)*l,y+Math.sin(an)*l);c.stroke()}}},2.6),
 gold:surf(256,256,(a,hc,r,w,h)=>{a.fillStyle='#c0903a';a.fillRect(0,0,w,h);hc.fillStyle='#707070';hc.fillRect(0,0,w,h);r.fillStyle='#606060';r.fillRect(0,0,w,h);knots([[a,'rgba(110,70,15,.75)'],[hc,'#e8e8e8'],[r,'#909090']],w,h,3);speck(a,w,h,2500,.15)},3),
 redgold:surf(256,256,(a,hc,r,w,h)=>{a.fillStyle='#7a1620';a.fillRect(0,0,w,h);hc.fillStyle='#707070';hc.fillRect(0,0,w,h);r.fillStyle='#a0a0a0';r.fillRect(0,0,w,h);speck(a,w,h,2000,.12);scrolls([[a,'#d6aa48'],[hc,'#f0f0f0'],[r,'#404040']],w,h,26,4);
  for(const [c,col] of [[a,'#d6aa48'],[hc,'#f0f0f0'],[r,'#404040']]){c.fillStyle=col;c.fillRect(0,0,w,14);c.fillRect(0,h-14,w,14)}},3),
 bow:surf(512,64,(a,hc,r,w,h)=>{a.fillStyle='#6e4020';a.fillRect(0,0,w,h);hc.fillStyle='#909090';hc.fillRect(0,0,w,h);r.fillStyle='#a8a8a8';r.fillRect(0,0,w,h);
  for(let i=0;i<70;i++){const y=Math.random()*h;a.strokeStyle=`rgba(${rnd(2)?30:140},${rnd(2)?15:80},8,.3)`;a.lineWidth=1;a.beginPath();a.moveTo(0,y);for(let x=0;x<=w;x+=16)a.lineTo(x,y+Math.sin(x*.03+i)*2);a.stroke()}
  for(let x=34;x<w;x+=64){a.fillStyle='rgba(28,12,4,.75)';hc.fillStyle='#2a2a2a';for(const c of [a,hc]){c.beginPath();c.ellipse(x,h/2,24,10,0,0,TAU);c.fill()}a.fillStyle='rgba(150,96,44,.7)';hc.fillStyle='#a0a0a0';for(const c of [a,hc]){c.beginPath();c.ellipse(x,h/2,19,7,0,0,TAU);c.fill()}
   a.strokeStyle='rgba(30,14,4,.85)';a.lineWidth=1.5;a.beginPath();a.moveTo(x-19,h/2);a.lineTo(x+19,h/2);for(let k=-14;k<=12;k+=4){a.moveTo(x+k,h/2);a.lineTo(x+k+5,h/2-5);a.moveTo(x+k,h/2);a.lineTo(x+k+5,h/2+5)}a.stroke()}},3),
 steel:surf(256,256,(a,hc,r,w,h)=>{a.fillStyle='#9a9ea4';a.fillRect(0,0,w,h);hc.fillStyle='#808080';hc.fillRect(0,0,w,h);r.fillStyle='#5a5a5a';r.fillRect(0,0,w,h);
  for(let i=0;i<600;i++){const x=Math.random()*w,y=Math.random()*h,an=Math.random()*PI,l=rf(5,30);a.strokeStyle=`rgba(${rnd(2)?40:230},${rnd(2)?40:230},${rnd(2)?40:230},.13)`;a.beginPath();a.moveTo(x,y);a.lineTo(x+Math.cos(an)*l,y+Math.sin(an)*l);a.stroke()}
  for(let i=0;i<220;i++){const x=Math.random()*w,y=Math.random()*h,s=1+Math.random()*2.5;a.fillStyle='rgba(40,36,32,.45)';hc.fillStyle='#404040';r.fillStyle='#a8a8a8';for(const c of [a,hc,r]){c.beginPath();c.arc(x,y,s,0,TAU);c.fill()}}},2),
 skin:surf(128,128,(a,hc,r,w,h)=>{a.fillStyle='#c98a66';a.fillRect(0,0,w,h);hc.fillStyle='#808080';hc.fillRect(0,0,w,h);r.fillStyle='#b0b0b0';r.fillRect(0,0,w,h);speck(a,w,h,1500,.05);for(let i=0;i<400;i++){const v=110+rnd(40);hc.fillStyle=`rgb(${v},${v},${v})`;hc.fillRect(Math.random()*w,Math.random()*h,2,2)}},1.2),
 hairy:surf(256,256,(a,hc,r,w,h)=>{a.fillStyle='#b27450';a.fillRect(0,0,w,h);hc.fillStyle='#808080';hc.fillRect(0,0,w,h);r.fillStyle='#b8b8b8';r.fillRect(0,0,w,h);speck(a,w,h,3000,.06);
  for(let i=0;i<1600;i++){const x=Math.random()*w,y=Math.random()*h,an=-PI/2+rf(-.5,.5),l=rf(3,8);a.strokeStyle=`rgba(50,26,12,${rf(.25,.6)})`;a.lineWidth=.8;a.beginPath();a.moveTo(x,y);a.lineTo(x+Math.cos(an)*l,y+Math.sin(an)*l);a.stroke()}
  for(let i=0;i<14;i++){const x=rnd(w);hc.strokeStyle='#b0b0b0';hc.lineWidth=5;hc.beginPath();hc.moveTo(x,0);hc.bezierCurveTo(x+rf(-30,30),h*.3,x+rf(-30,30),h*.7,x+rf(-20,20),h);hc.stroke()}},2),
 cloth:surf(256,256,(a,hc,r,w,h)=>{a.fillStyle='#8a1420';a.fillRect(0,0,w,h);hc.fillStyle='#808080';hc.fillRect(0,0,w,h);r.fillStyle='#e0e0e0';r.fillRect(0,0,w,h);for(let y=0;y<h;y+=2){a.fillStyle=`rgba(0,0,0,${Math.random()*.08})`;a.fillRect(0,y,w,1)}for(let i=0;i<10;i++){const x=rnd(w);for(const [c,col] of [[a,'rgba(0,0,0,.22)'],[hc,'#505050']]){c.strokeStyle=col;c.lineWidth=10;c.beginPath();c.moveTo(x,0);c.lineTo(x+rf(-10,10),h);c.stroke()}}
  for(const [c,col] of [[a,'#c89a3a'],[hc,'#d0d0d0']]){c.fillStyle=col;c.fillRect(0,h-26,w,16)}knots([[a,'rgba(90,10,10,.7)']],w,22,2)},2)
};
TX.robe=surf(256,256,(a,hc,r,w,h)=>{a.fillStyle='#dfe1e8';a.fillRect(0,0,w,h);hc.fillStyle='#808080';hc.fillRect(0,0,w,h);r.fillStyle='#b8b8b8';r.fillRect(0,0,w,h);
 scrolls([[a,'rgba(150,155,178,.35)'],[hc,'#a8a8a8']],w,h,34,2);
 for(let i=0;i<9;i++){const x=rnd(w);for(const [c,col] of [[a,'rgba(90,96,125,.16)'],[hc,'#505050']]){c.strokeStyle=col;c.lineWidth=12;c.beginPath();c.moveTo(x,0);c.lineTo(x+rf(-12,12),h);c.stroke()}}
 for(const [c,col] of [[a,'#c8973a'],[hc,'#e8e8e8'],[r,'#4a4a4a']]){c.fillStyle=col;c.fillRect(0,h-44,w,34)}
 for(const c of [a,hc]){c.save();c.translate(0,h-42)}knots([[a,'rgba(105,66,12,.9)'],[hc,'#ffffff']],w,30,2.5);for(const c of [a,hc])c.restore()},2.2);
const RUNECIRCLE=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.translate(128,128);x.strokeStyle='#fff';x.shadowColor='#bfe8ff';x.shadowBlur=8;
 for(const [r,lw] of [[122,3],[100,2],[84,2.5],[46,2]]){x.lineWidth=lw;x.beginPath();x.arc(0,0,r,0,TAU);x.stroke()}
 x.lineWidth=2;for(let k=0;k<24;k++){x.save();x.rotate(k/24*TAU);const g=k%5;x.beginPath();x.moveTo(0,-104);x.lineTo(0,-118);if(g===0){x.moveTo(0,-118);x.lineTo(6,-112)}else if(g===1){x.moveTo(-5,-110);x.lineTo(5,-116)}else if(g===2){x.moveTo(0,-112);x.lineTo(6,-106);x.lineTo(0,-104)}else if(g===3){x.moveTo(-5,-114);x.lineTo(5,-108)}else{x.moveTo(0,-118);x.lineTo(6,-111);x.lineTo(0,-104)}x.stroke();x.restore()}
 x.lineWidth=1.6;for(let k=0;k<6;k++){const a=k/6*TAU,b=(k+2)/6*TAU;x.beginPath();x.moveTo(Math.cos(a)*84,Math.sin(a)*84);x.lineTo(Math.cos(b)*84,Math.sin(b)*84);x.stroke()}
 for(let k=0;k<48;k++){const a=k/48*TAU,o=k%4?90:98;x.beginPath();x.moveTo(Math.cos(a)*84,Math.sin(a)*84);x.lineTo(Math.cos(a)*o,Math.sin(a)*o);x.stroke()}
 return new THREE.CanvasTexture(c)})();
const RUNE=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,256,256);x.strokeStyle='#fff';x.lineWidth=3;
 for(let y=14;y<256;y+=30)for(let i=8;i<248;i+=18){const g=rnd(5);x.beginPath();x.moveTo(i,y);x.lineTo(i,y+18);if(g===0){x.moveTo(i,y);x.lineTo(i+9,y+7)}else if(g===1){x.moveTo(i,y+9);x.lineTo(i+9,y)}else if(g===2){x.moveTo(i,y+5);x.lineTo(i+9,y+12);x.lineTo(i,y+18)}else if(g===3){x.moveTo(i-4,y+6);x.lineTo(i+6,y+12)}else{x.moveTo(i,y);x.lineTo(i+8,y+9);x.lineTo(i,y+18)}x.stroke()}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2.5,2.5);return t})();
const SMOKE=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.shadowColor='#fff';x.shadowBlur=10;
 for(let k=0;k<7;k++){x.strokeStyle=`rgba(255,255,255,${rf(.15,.4)})`;x.lineWidth=rf(2,6);x.beginPath();let px=64+rf(-20,20),py=124;x.moveTo(px,py);for(let s=0;s<6;s++){x.quadraticCurveTo(px+rf(-35,35),py-12,px+rf(-15,15),py-22);px=px+rf(-15,15);py-=22}x.stroke()}
 return new THREE.CanvasTexture(c)})();
const matFrom=(s,o)=>{o=Object.assign({},o||{});const tint=o.tint;delete o.tint;const m=new THREE.MeshStandardMaterial(Object.assign({map:s.map,normalMap:s.normalMap,roughnessMap:s.roughnessMap,roughness:1,metalness:0},o));if(tint!==undefined)m.color.copy(lin(tint));return m};
const MAT={
 leather:matFrom(TX.leather),leatherDark:matFrom(TX.leather,{tint:0x8a7060}),wool:matFrom(TX.wool),woolDark:matFrom(TX.wool,{tint:0x6a8a60}),robe:std({color:0xd8dce2,roughness:.95}),
 fur:matFrom(TX.fur),hair:matFrom(TX.fur,{tint:0xd07040}),hairBlack:matFrom(TX.fur,{tint:0x303030}),hairRed:matFrom(TX.fur,{tint:0xff6040}),
 gold:matFrom(TX.gold,{metalness:.85}),redgold:matFrom(TX.redgold,{metalness:.55}),cloth:matFrom(TX.cloth,{side:THREE.DoubleSide}),
 skin:matFrom(TX.skin),tan:matFrom(TX.hairy,{tint:0xffd8c0}),hairy:matFrom(TX.hairy),
 steel:matFrom(TX.steel,{metalness:.85}),iron:matFrom(TX.steel,{metalness:.8,tint:0x707070}),bowWood:matFrom(TX.bow),wood:matFrom(TX.bow,{tint:0xb08060}),dark:std({color:0x0a0806,roughness:.6}),
 bone:std({color:0xd8c898,roughness:.55,metalness:.2}),ruby:std({color:0xc0101c,roughness:.12,metalness:.4,emissive:0x400004})
};
MAT.robe=matFrom(TX.robe,{side:THREE.DoubleSide});MAT.gem=std({color:0xbfe8ff,roughness:.1,metalness:.2,emissive:0x3a8aff});MAT.beard=std({color:0xe6e6e6,roughness:.95});MAT.silver=std({color:0xe8eaf0,metalness:.9,roughness:.22});
class Ribbon extends THREE.Curve{constructor(ph,rad,turns,y0,y1){super();this.ph=ph;this.rad=rad;this.turns=turns;this.y0=y0;this.y1=y1}getPoint(t,o){o=o||new THREE.Vector3();const a=this.ph+t*TAU*this.turns;return o.set(Math.cos(a)*this.rad,this.y0+t*(this.y1-this.y0),Math.sin(a)*this.rad)}}
function makeStaff(len,below){const g=new THREE.Group(),top=len-below,add=(geo,mat,p,r)=>{const m=new THREE.Mesh(geo,mat);if(p)m.position.set(p[0],p[1],p[2]);if(r)m.rotation.set(r[0],r[1],r[2]);m.castShadow=true;g.add(m);return m};
 add(Cy(.03,.034,len,16),MAT.silver,[0,top-len/2,0]);
 add(new THREE.TubeGeometry(new Ribbon(0,.036,len*2.4,-below,top),Math.round(len*120),.012,6),MAT.gold);add(new THREE.TubeGeometry(new Ribbon(PI,.036,len*2.4,-below,top),Math.round(len*120),.009,6),MAT.silver);
 add(new THREE.TorusGeometry(.045,.016,8,20),MAT.gold,[0,top,0],[PI/2,0,0]);
 add(new THREE.TubeGeometry(new Ribbon(0,.07,1.15,top,top+.28),60,.016,6),MAT.silver);add(new THREE.TubeGeometry(new Ribbon(PI,.07,1.15,top,top+.28),60,.013,6),MAT.gold);
 add(new THREE.TorusGeometry(.14,.02,8,32,PI*1.35),MAT.silver,[0,top+.2,0],[0,0,-PI/2+.3]);add(new THREE.TorusGeometry(.125,.013,8,32,PI*1.25),MAT.gold,[0,top+.2,0],[0,PI/2,PI/2+.5]);
 add(Co(.016,.09,8),MAT.silver,[.09,top+.36,0],[0,0,-.6]);
 const orb=add(Sp(.08,20,14),new THREE.MeshBasicMaterial({color:0xdff4ff}),[0,top+.2,0]);const halo=add(Sp(.17,16,12),ADD({color:0x8fc8ff,opacity:.32}),[0,top+.2,0]);halo.castShadow=orb.castShadow=false;
 return{g,orb,halo}}
const wallMat=new THREE.MeshStandardMaterial(Object.assign({roughness:1,metalness:0},WALL));wallMat.normalScale.set(1.4,1.4);
const crackMat=new THREE.MeshStandardMaterial(Object.assign({roughness:1,metalness:0},CRACK));crackMat.normalScale.set(1.6,1.6);
const floorMat=new THREE.MeshStandardMaterial(Object.assign({roughness:1,metalness:0},FLOOR));floorMat.normalScale.set(1.2,1.2);
const ceilMat=new THREE.MeshStandardMaterial({map:FLOOR.map,normalMap:FLOOR.normalMap,roughness:1,color:lin(0x5a4636)});
const woodMat=new THREE.MeshStandardMaterial(Object.assign({roughness:1,metalness:.1},WOOD));
const wallGeo=new THREE.BoxGeometry(T,WALLH,T);

// merge parts into one vertex-coloured geometry (colours given in sRGB); keeps uvs
function merge(parts){
 const pos=[],nor=[],col=[],uv=[],m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),c=new THREE.Color();
 for(const pt of parts){const g0=pt[0],p=pt[2]||[0,0,0],r=pt[3]||[0,0,0],s=pt[4]||[1,1,1];
  const g=g0.index?g0.toNonIndexed():g0.clone();m.compose(new THREE.Vector3(p[0],p[1],p[2]),q.setFromEuler(e.set(r[0],r[1],r[2])),new THREE.Vector3(s[0],s[1],s[2]));g.applyMatrix4(m);c.setHex(pt[1]).convertSRGBToLinear();
  const P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv;for(let i=0;i<P.count;i++){pos.push(P.getX(i),P.getY(i),P.getZ(i));nor.push(N.getX(i),N.getY(i),N.getZ(i));col.push(c.r,c.g,c.b);uv.push(U?U.getX(i):0,U?U.getY(i):0)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));return g}
const Cy=(a,b,h,n,o,ts,tl)=>new THREE.CylinderGeometry(a,b,h,n||12,1,!!o,ts||0,tl===undefined?TAU:tl);
const Sp=(r,a,b)=>new THREE.SphereGeometry(r,a||14,b||10);
const Hs=(r)=>new THREE.SphereGeometry(r,14,8,0,TAU,0,PI/2);
const Bx=(x,y,z)=>new THREE.BoxGeometry(x,y,z);
const Co=(r,h,n)=>new THREE.ConeGeometry(r,h,n||10);
const V2=(x,y)=>new THREE.Vector2(x,y);
const Oc=r=>new THREE.OctahedronGeometry(r);
const Dd=r=>new THREE.DodecahedronGeometry(r);
const CYL=new THREE.CylinderGeometry(1,1,1,12),CYLT=new THREE.CylinderGeometry(.82,1,1,14),SPH=new THREE.SphereGeometry(1,14,10),BRACER=new THREE.CylinderGeometry(1.08,1.2,1,18,1,true);
const ext=(shape,depth,bev)=>{const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:bev,bevelSize:bev,bevelSegments:2,curveSegments:18});g.translate(0,0,-depth/2);return g};

// ---------- weapons
const CRESCENT=ext((()=>{const s=new THREE.Shape();s.moveTo(.04,.15);s.quadraticCurveTo(.2,.18,.33,.42);s.quadraticCurveTo(.62,0,.33,-.42);s.quadraticCurveTo(.2,-.18,.04,-.15);s.lineTo(.04,.15);
 for(const [x,y] of [[.19,.06],[.19,-.06],[.27,.12],[.27,-.12]]){const h=new THREE.Path();h.absarc(x,y,.026,0,TAU,true);s.holes.push(h)}return s})(),.03,.012);
const BATWING=ext((()=>{const s=new THREE.Shape();s.moveTo(.1,.16);s.lineTo(.24,.56);s.quadraticCurveTo(.66,.1,.26,-.56);s.lineTo(.2,-.2);s.quadraticCurveTo(.28,-.12,.18,-.07);s.quadraticCurveTo(.27,0,.18,.07);s.quadraticCurveTo(.28,.12,.2,.2);s.lineTo(.1,.16);
 const h=new THREE.Path();h.absellipse(.38,0,.035,.12,0,TAU,true);s.holes.push(h);return s})(),.03,.012);
function axeParts(t){const W=t>=5,bc=[0x9a9ca2,0xd8dce2,0xb06058,0xe0f0f4,0xe8f0f8][t-1],P=[];
 P.push([W?BATWING:CRESCENT,bc,[0,.38,0],[0,0,0],[1,1,1],'blade'],[W?BATWING:CRESCENT,bc,[0,.38,0],[0,PI,0],[1,1,1],'blade']);
 P.push(W?[Cy(.03,.032,1.05,12),0xa8aeb6,[0,-.1,0],0,0,'steel']:[Cy(.034,.038,1.05,12),0x6a4424,[0,-.1,0],0,0,'wood']);
 P.push([Cy(.048,.048,.07,12),0x55555a,[0,.2,0],0,0,'iron'],[Cy(.048,.048,.07,12),0x55555a,[0,.56,0],0,0,'iron'],[Co(.03,.18,8),bc,[0,.7,0],0,0,'blade']);
 if(!W){P.push([Bx(.09,.32,.06),0x55555a,[0,.38,0],0,0,'iron']);for(let y=-.5;y<.15;y+=.13)P.push([Sp(.013,6,4),0xa0a0a0,[0,y,.036],0,0,'iron']);P.push([Sp(.04),0x55555a,[0,-.64,0],0,0,'iron'])}
 else{P.push([new THREE.TorusGeometry(.15,.024,8,28),0x9aa0a8,[0,.38,0],0,0,'steel']);for(let k=0;k<8;k++){const a=k/8*TAU;P.push([Co(.028,.12,6),0x8a9098,[Math.cos(a)*.19,.38+Math.sin(a)*.19,0],[0,0,a-PI/2],0,'steel'])}
  P.push([Sp(.075),0xd8c890,[0,.4,0],0,[1,1.1,.95],'bone'],[Bx(.075,.045,.05),0xd8c890,[0,.32,.012],0,0,'bone'],[Sp(.02),0x101010,[-.027,.41,.062],0,0,'dark'],[Sp(.02),0x101010,[.027,.41,.062],0,0,'dark']);
  for(let y=-.55;y<.1;y+=.06)P.push([Cy(.036,.036,.02,12),0x8a9098,[0,y,0],0,0,'steel']);P.push([Sp(.05),0xd8c890,[0,-.66,0],0,[1,1.1,1],'bone'])}
 return P}
const DAGBLADE=ext((()=>{const s=new THREE.Shape();s.moveTo(0,.42);s.quadraticCurveTo(.058,.24,.044,.07);s.quadraticCurveTo(.052,.012,.03,0);s.lineTo(-.03,0);s.quadraticCurveTo(-.052,.012,-.044,.07);s.quadraticCurveTo(-.058,.24,0,.42);return s})(),.008,.007);
const DAGGUARD=ext((()=>{const s=new THREE.Shape();s.moveTo(-.13,-.04);s.quadraticCurveTo(-.07,.025,0,.018);s.quadraticCurveTo(.07,.025,.13,-.04);s.lineTo(.12,-.055);s.quadraticCurveTo(.06,-.008,0,-.016);s.quadraticCurveTo(-.06,-.008,-.12,-.055);s.lineTo(-.13,-.04);return s})(),.028,.006);
function daggerParts(t){const bc=[0xc8ccd2,0xe0e6ee,0xe8e0d0,0xd8eef8,0xe0f0ff][t-1],P=[[DAGBLADE,bc,[0,0,0],0,0,'blade'],[Bx(.008,.3,.018),0xf0f0f0,[0,.17,0],0,0,'blade'],[DAGGUARD,0xc8983a,[0,0,0],0,0,'gold'],
 [Oc(.022),0xc0101c,[0,.005,.02],0,[1,1.3,.7],'ruby'],[Oc(.022),0xc0101c,[0,.005,-.02],0,[1,1.3,.7],'ruby'],[Cy(.017,.019,.11,12),0x7a1620,[0,-.065,0],0,0,'redgold'],[Sp(.027),0xc8983a,[0,-.135,0],0,0,'gold'],[Co(.014,.04,8),0xc8983a,[0,-.17,0],[PI,0,0],0,'gold']];
 if(t>=5)for(const y of [.1,.17,.24,.31]){const w=.05-y*.06;P.push([Co(.011,.055,5),bc,[w,y,0],[0,0,-2.214],0,'blade'],[Co(.011,.055,5),bc,[-w,y,0],[0,0,2.214],0,'blade'])}
 return P}
function arrowParts(){const P=[[Cy(.011,.011,.82,6),0xc8a878,[0,0,0],[PI/2,0,0]],[Co(.03,.1,4),0xd0d4d8,[0,0,.46],[PI/2,0,0]],[Cy(.014,.012,.04,6),0x3a2a1a,[0,0,.4],[PI/2,0,0]],[Cy(.014,.014,.03,6),0x2a1a10,[0,0,-.41],[PI/2,0,0]]];
 for(let k=0;k<3;k++){const a=k*TAU/3;for(let s=0;s<5;s++)P.push([Bx(.003,.026,.026),s%2?0x6a4a2a:0xf0e6d0,[Math.cos(a)*.026,Math.sin(a)*.026,-.28-s*.026],[0,0,a-PI/2]])}return P}
const strip=P=>P.map(p=>[p[0],p[1],p[2],p[3]||[0,0,0],p[4]||[1,1,1]]);
function buildParts(P,mats){const g=new THREE.Group();for(const p of P){const m=new THREE.Mesh(p[0],mats[p[5]]||MAT.iron);m.position.set(...p[2]);if(p[3])m.rotation.set(...p[3]);if(p[4])m.scale.set(...p[4]);g.add(m)}return g}
function bladeMat(t,glow,base){const m=new THREE.MeshStandardMaterial({map:TX.steel.map,normalMap:TX.steel.normalMap,roughnessMap:TX.steel.roughnessMap,metalness:.9,roughness:1});m.color.copy(lin(base));if(glow&&t>=4){m.emissiveMap=RUNE;m.emissive.copy(lin(glow));m.emissiveIntensity=1.6}else if(glow){m.emissive.copy(lin(glow));m.emissiveIntensity=.08}return m}

// ---------- monsters
const GEO={};
{const tat=[];for(let k=0;k<9;k++){const a=k/9*TAU;tat.push([Co(.13,.45,5),0xc8d0ee,[Math.sin(a)*.58,-.05,Math.cos(a)*.58],[PI,0,0]])}
GEO.ghost=merge([[new THREE.LatheGeometry([V2(.6,.12),V2(.66,.3),V2(.58,.7),V2(.54,1.15),V2(.46,1.48),V2(.3,1.72),V2(.01,1.8)],18),0xdfe6ff],
 [Hs(.36),0xc0c8e8,[0,1.6,-.02],[0,0,0],[1,1.15,1]],[Sp(.24),0x05060c,[0,1.56,.17],[0,0,0],[1,1.1,.8]],
 [Co(.1,.75,6),0xd6dcf8,[-.48,1.18,.3],[1.2,0,.35]],[Co(.1,.75,6),0xd6dcf8,[.48,1.18,.3],[1.2,0,-.35]]].concat(tat))}
GEO.grunt=merge([[Cy(.14,.16,.62),0x4a3826,[-.2,.4,0]],[Cy(.14,.16,.62),0x4a3826,[.2,.4,0]],[Bx(.22,.14,.36),0x2a1c10,[-.2,.07,.05]],[Bx(.22,.14,.36),0x2a1c10,[.2,.07,.05]],
 [Cy(.4,.46,.85,14),0x5a3a20,[0,1.1,0]],[Sp(.42),0x6f8a3a,[0,1.0,.1],[0,0,0],[1,.8,.8]],[Cy(.5,.5,.12,14),0x2a1c10,[0,.75,0]],[Bx(.12,.1,.08),0xc0a040,[0,.75,.48]],
 [Hs(.24),0x8a8f96,[-.5,1.48,0],[0,0,-.4]],[Hs(.24),0x8a8f96,[.5,1.48,0],[0,0,.4]],[Cy(.1,.12,.6),0x6f8a3a,[-.58,1.12,.1],[.3,0,.2]],[Cy(.1,.12,.6),0x6f8a3a,[.58,1.12,.1],[.3,0,-.2]],
 [Sp(.3),0x6f8a3a,[0,1.75,.05]],[Bx(.3,.14,.22),0x5f7a30,[0,1.6,.18]],[Hs(.32),0x6a6e74,[0,1.82,0]],[Co(.06,.3,6),0xe8dcc0,[-.28,2.0,0],[0,0,.9]],[Co(.06,.3,6),0xe8dcc0,[.28,2.0,0],[0,0,-.9]],
 [Co(.035,.14,5),0xf0ead8,[-.09,1.62,.3],[-.4,0,0]],[Co(.035,.14,5),0xf0ead8,[.09,1.62,.3],[-.4,0,0]],
 [Cy(.06,.16,1.0,8),0x5a3a1c,[.62,1.0,.4],[.9,0,-.2]],[Co(.05,.14,4),0xa0a4aa,[.66,1.3,.9],[.9,0,0]],[Co(.05,.14,4),0xa0a4aa,[.55,1.25,.85],[.9,0,.9]],[Co(.05,.14,4),0xa0a4aa,[.75,1.22,.8],[.9,0,-.9]]]);
{const wing=new THREE.Shape();wing.moveTo(0,0);wing.lineTo(1.1,.55);wing.lineTo(1.2,-.1);wing.lineTo(.95,.05);wing.lineTo(.85,-.35);wing.lineTo(.6,-.05);wing.lineTo(.45,-.4);wing.lineTo(.3,-.05);wing.lineTo(0,-.2);
 const wg=new THREE.ShapeGeometry(wing);
 GEO.demon=merge([[Cy(.13,.1,.5),0x5a0f0c,[-.22,.62,-.05],[.35,0,0]],[Cy(.1,.08,.5),0x5a0f0c,[-.22,.22,.08],[-.35,0,0]],[Cy(.13,.1,.5),0x5a0f0c,[.22,.62,-.05],[.35,0,0]],[Cy(.1,.08,.5),0x5a0f0c,[.22,.22,.08],[-.35,0,0]],
  [Cy(.3,.42,.9,14),0x8a1a14,[0,1.25,0]],[Sp(.44),0x9a221a,[0,1.6,.05],[0,0,0],[1.15,.8,.85]],[Bx(.08,.4,.02),0xffa020,[0,1.45,.42]],[Sp(.3),0xa02a1e,[0,2.08,.04]],[Bx(.3,.12,.2),0x7a120e,[0,1.96,.22]],
  [Co(.08,.5,8),0xe0d0a0,[-.22,2.42,-.05],[-.4,0,.55]],[Co(.08,.5,8),0xe0d0a0,[.22,2.42,-.05],[-.4,0,-.55]],
  [Cy(.1,.12,.65),0x8a1a14,[-.6,1.4,.15],[.5,0,.4]],[Cy(.1,.12,.65),0x8a1a14,[.6,1.4,.15],[.5,0,-.4]],[Co(.04,.12,4),0x111111,[-.7,1.1,.45],[1.5,0,0]],[Co(.04,.12,4),0x111111,[.7,1.1,.45],[1.5,0,0]],
  [wg,0x3a0806,[.25,1.75,-.32],[0,-.5,0],[1.3,1.3,1]],[wg,0x3a0806,[-.25,1.75,-.32],[0,PI+.5,0],[1.3,1.3,1]],[Co(.06,.9,6),0x6a100c,[0,.85,-.55],[-1.9,0,0]],[Co(.08,.2,4),0x6a100c,[0,.55,-.95],[-1.9,0,0]]])}
GEO.lobber=merge([[Cy(.1,.1,.4),0x4a3020,[-.14,.22,0]],[Cy(.1,.1,.4),0x4a3020,[.14,.22,0]],[Sp(.34),0x8a6a40,[0,.72,.05],[0,0,0],[1,1.1,.9]],[Sp(.36),0x6a5030,[0,.9,-.32]],[Cy(.03,.03,.5,5),0x3a2a1a,[0,1.1,-.2],[.6,0,0]],
 [Sp(.24),0x9a8050,[0,1.12,.12]],[Co(.1,.32,6),0x9a8050,[-.26,1.2,.08],[0,0,1.2]],[Co(.1,.32,6),0x9a8050,[.26,1.2,.08],[0,0,-1.2]],[Co(.05,.14,5),0xb09060,[0,1.1,.36],[1.4,0,0]],[Dd(.16),0x777068,[.32,1.05,.25]],[Cy(.07,.08,.4),0x8a6a40,[.3,.85,.2],[.6,0,-.3]]]);
GEO.sorcerer=merge([[Co(.62,1.7,16),0x4a1a6a,[0,.85,0]],[Cy(.36,.5,.5,14),0x5a2280,[0,1.5,0]],[Co(.36,.7,14),0x4a1a6a,[0,2.0,-.05]],[Sp(.22),0x0a0412,[0,1.82,.12]],[Cy(.3,.32,.08,14),0xd0a040,[0,1.32,0]],
 [Cy(.09,.12,.6),0x5a2280,[-.45,1.4,.15],[.6,0,.4]],[Cy(.09,.12,.6),0x5a2280,[.45,1.4,.15],[.6,0,-.4]],[Cy(.03,.03,2.1,6),0x2a1a10,[.6,1.05,.3]],[Oc(.14),0xd890ff,[.6,2.2,.3],[0,0,0],[1,1.6,1]]]);
GEO.death=merge([[Co(.62,2.0,18),0x121014,[0,1.0,0]],[Cy(.4,.5,.4,14),0x181418,[0,1.75,0]],[Co(.42,.9,14),0x101012,[0,2.3,-.08]],[Sp(.2),0xd8d0c0,[0,2.02,.12],[0,0,0],[.9,1.1,.9]],[Bx(.24,.12,.06),0x1a1612,[0,1.94,.29]],
 [Cy(.1,.13,.7),0x121014,[-.5,1.55,.2],[.7,0,.4]],[Cy(.1,.13,.7),0x121014,[.5,1.55,.2],[.7,0,-.4]],[Cy(.035,.035,2.6,6),0x3a2a1a,[.7,1.4,.35],[0,0,.15]],
 [new THREE.TorusGeometry(.6,.035,4,20,PI*.7),0xc8ccd2,[.55,2.55,.05],[PI/2,0,.4],[1,1,.3]]]);
GEO.axe=merge(strip(axeParts(2))).translate(0,-.1,0);GEO.axe5=merge(strip(axeParts(5))).translate(0,-.1,0);
GEO.knife=merge(strip(daggerParts(2))).translate(0,-.1,0);GEO.knife5=merge(strip(daggerParts(5))).translate(0,-.1,0);
GEO.arrow=merge(arrowParts());
const ITEMGEO={
 food:merge([[Cy(.5,.45,.06,20),0xd8d0c0,[0,.03,0]],[Sp(.3),0x8a3a1c,[0,.3,0],[0,0,0],[1.35,.9,1]],[Sp(.22),0xa8522a,[.05,.38,.05],[0,0,0],[1.2,.6,.9]],[Cy(.05,.05,.5,6),0xf0ead8,[.45,.33,0],[0,0,PI/2]],[Sp(.08),0xf0ead8,[.7,.36,.04]],[Sp(.08),0xf0ead8,[.7,.3,-.04]],[Sp(.1),0x40a030,[-.3,.1,.2]]]),
 potion:merge([[Sp(.3,16,12),0x2f6bff,[0,.32,0]],[Cy(.08,.1,.24,10),0x8fb0ff,[0,.66,0]],[Cy(.09,.08,.1,8),0x8a5a30,[0,.82,0]]]),
 charm:merge([[new THREE.TorusGeometry(.3,.06,10,24),0xf0c040,[0,.7,0]],[Oc(.17),0xff3070,[0,.7,0]],[Cy(.02,.02,.4,4),0xf0c040,[0,1.1,0]]]),
 key:merge([[new THREE.TorusGeometry(.17,.055,8,16),0xf2c94c,[-.32,.6,0]],[Bx(.62,.08,.08),0xf2c94c,[.12,.6,0]],[Bx(.08,.2,.08),0xf2c94c,[.36,.48,0]],[Bx(.08,.15,.08),0xf2c94c,[.22,.5,0]]]),
 treasure:merge([[Co(.5,.42,14),0xd8a830,[0,.21,0]],[Cy(.13,.13,.04,12),0xffd24a,[.35,.05,.2]],[Cy(.13,.13,.04,12),0xffd24a,[-.3,.05,.3]],[Cy(.13,.13,.04,12),0xffd24a,[0,.45,0]],[Oc(.12),0xff2a40,[.15,.38,.15]],[Oc(.1),0x2aff80,[-.18,.32,.1]],[Oc(.1),0x40a0ff,[0,.3,-.25]]]),
 chest:merge([[Bx(1.1,.6,.72),0x6b4422,[0,.3,0]],[Cy(.36,.36,1.1,14,false,0,PI),0x7a4e28,[0,.6,0],[0,0,PI/2]],[Bx(.08,.64,.76),0xd0a040,[-.4,.3,0]],[Bx(.08,.64,.76),0xd0a040,[.4,.3,0]],[Bx(.16,.18,.06),0xe8c050,[0,.56,.37]]])
};
const IMAT={food:stdv({roughness:.55}),potion:stdv({roughness:.08,metalness:.1,transparent:true,opacity:.85,emissive:0x0a1a60}),charm:stdv({roughness:.25,metalness:.9}),key:stdv({roughness:.3,metalness:.95}),treasure:stdv({roughness:.28,metalness:.9}),chest:stdv({roughness:.7,metalness:.2})};
const GENGEO=merge([[Cy(1.0,1.15,.4,8),0x4a423a,[0,.2,0]],[Cy(.85,1.0,.3,8),0x5a5048,[0,.5,0]],[Cy(.55,.55,.08,16),0x050202,[0,.66,0]],[Sp(.22),0xe8e0c8,[.6,.75,.35]],[Sp(.22),0xe8e0c8,[-.55,.72,-.35]],[Sp(.2),0xe8e0c8,[.35,.72,-.6]],[Sp(.2),0xe8e0c8,[-.3,.75,.6]],
 [Cy(.06,.06,.9,6),0xe8e0c8,[-.3,.68,.65],[0,0,1.2]],[Cy(.06,.06,.9,6),0xe8e0c8,[.7,.62,0],[1.3,0,.2]],[Sp(.07),0x000000,[.55,.8,.54]],[Sp(.07),0x000000,[.68,.8,.48]],[Co(.12,.5,6),0x3a342e,[.9,.6,-.6]],[Co(.12,.6,6),0x3a342e,[-.9,.6,.5]]]);
const genMat=stdv({roughness:.85});
const DOORGEO=new THREE.BoxGeometry(T,WALLH*.94,T*.5);
const SCONCE=merge([[Bx(.3,.45,.06),0x2a2826,[0,0,.03]],[Bx(.06,.06,.42),0x2a2826,[0,-.08,.22]],[Cy(.13,.07,.18,10),0x353230,[0,.04,.42]],[Cy(.04,.05,.42,6),0x4a3018,[0,.2,.42]]]);
const DECOR=merge([[Dd(.22),0x4a423a,[0,.1,0]],[Dd(.14),0x3a342e,[.35,.06,.15]],[Dd(.1),0x5a5048,[-.25,.05,.25]],[Cy(.035,.035,.5,5),0xd8d0c0,[.1,.04,-.25],[0,.6,PI/2]],[Sp(.13),0xd8d0c0,[-.15,.12,-.2]],[Cy(.03,.03,.35,5),0xd8d0c0,[-.3,.03,-.1],[0,-.4,PI/2]]]);
const decorMat=stdv({roughness:.9});

// ---------- glows
function glowTex(fn){const c=document.createElement('canvas');c.width=c.height=64;fn(c.getContext('2d'));return new THREE.CanvasTexture(c)}
const SOFT=glowTex(x=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
const FLAME=glowTex(x=>{x.save();x.translate(32,40);x.scale(1,1.6);const g=x.createRadialGradient(0,0,0,0,0,20);g.addColorStop(0,'rgba(255,250,220,1)');g.addColorStop(.3,'rgba(255,200,90,.9)');g.addColorStop(.65,'rgba(255,90,20,.45)');g.addColorStop(1,'rgba(120,20,0,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,20,0,TAU);x.fill();x.restore()});
class Glow{constructor(tex,size,max){this.max=max;this.n=0;this.size=size;this.pos=new Float32Array(max*3);this.col=new Float32Array(max*3);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(this.pos,3));g.setAttribute('color',new THREE.BufferAttribute(this.col,3));g.attributes.position.setUsage(THREE.DynamicDrawUsage);g.attributes.color.setUsage(THREE.DynamicDrawUsage);
 this.mat=new THREE.PointsMaterial({size,map:tex,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true});this.pts=new THREE.Points(g,this.mat);this.pts.frustumCulled=false;this.g=g;scene.add(this.pts)}
 add(x,y,z,r,g,b){if(this.n>=this.max)return;const i=this.n*3;this.pos[i]=x;this.pos[i+1]=y;this.pos[i+2]=z;this.col[i]=r;this.col[i+1]=g;this.col[i+2]=b;this.n++}
 end(){this.g.setDrawRange(0,this.n);this.g.attributes.position.needsUpdate=true;this.g.attributes.color.needsUpdate=true}scale(s){this.mat.size=this.size*s}}
const GL={flame:new Glow(FLAME,1.7,400),halo:new Glow(SOFT,3.2,300),orb:new Glow(SOFT,1.2,900),eye:new Glow(SOFT,.3,1200),spark:new Glow(SOFT,.32,1800)};
const RGB=h=>[(h>>16&255)/255,(h>>8&255)/255,(h&255)/255];

// ---------- instanced pools
class Pool{constructor(geo,mat,max){this.m=new THREE.InstancedMesh(geo,mat,max);this.m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.m.frustumCulled=false;this.max=max;this.n=0;this.m.setColorAt(0,new THREE.Color(1,1,1));this.m.count=0;scene.add(this.m)}}
const ADD=o=>new THREE.MeshBasicMaterial(Object.assign({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending},o||{}));
const POOLS={
 ghost:new Pool(GEO.ghost,stdv({transparent:true,opacity:.7,emissive:0x3a4a8a,roughness:.4,side:THREE.DoubleSide,depthWrite:false}),420),
 grunt:new Pool(GEO.grunt,stdv({roughness:.75,metalness:.15}),420),
 demon:new Pool(GEO.demon,stdv({roughness:.45,emissive:0x2a0402,side:THREE.DoubleSide}),420),
 lobber:new Pool(GEO.lobber,stdv({roughness:.85}),300),
 sorcerer:new Pool(GEO.sorcerer,stdv({roughness:.55,emissive:0x14061e}),300),
 gargoyle:new Pool(GEO.demon,stdv({roughness:.5,emissive:0x0a2004,side:THREE.DoubleSide}),420),naga:new Pool(GEO.grunt,stdv({roughness:.6}),300),eel:new Pool(GEO.ghost,stdv({roughness:.3,emissive:0x0a3a14}),200),drowned:new Pool(GEO.grunt,stdv({roughness:.8}),300),gremlin:new Pool(GEO.grunt,stdv({roughness:.7}),120),drownbrute:new Pool(GEO.grunt,stdv({roughness:.8}),200),
 death:new Pool(GEO.death,stdv({roughness:.95,metalness:.1,side:THREE.DoubleSide}),20),
 axe:new Pool(GEO.axe,stdv({metalness:.85,roughness:.32}),150),axe5:new Pool(GEO.axe5,stdv({metalness:.85,roughness:.32,emissive:0x203040}),150),
 arrow:new Pool(GEO.arrow,stdv({roughness:.6}),400),
 knife:new Pool(GEO.knife,stdv({metalness:.85,roughness:.3}),400),knife5:new Pool(GEO.knife5,stdv({metalness:.85,roughness:.3,emissive:0x103040}),400),
 rock:new Pool(Dd(.22),std({color:0x7a7068,roughness:.95}),80),
 bolt:new Pool(new THREE.SphereGeometry(.16,10,8),ADD(),400),
 fire:new Pool(new THREE.SphereGeometry(.26,10,8),ADD(),200),
 part:new Pool(new THREE.BoxGeometry(.12,.12,.12),std({roughness:.8}),600)
};
const D=new THREE.Object3D();D.rotation.order='YXZ';const TC=new THREE.Color();

// ---------- sound
const BUILD='20261127120023',V=u=>u+(u.indexOf('?')<0?'?':'&')+'v='+BUILD;
let AC=null,musicOn=true,musicT=0,step=0,nb=null;const lastS={};
function initAudio(){try{if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();const b=AC.createBuffer(1,AC.sampleRate,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;nb=b}if(AC.state==='suspended')AC.resume()}catch(e){AC=null}}
function tone(f,d,type,v,f2,at){if(!AC)return;const t=at||AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v||.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02)}
function noise(d,v,f){if(!AC||!nb)return;const t=AC.currentTime,s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=nb;fl.type='lowpass';fl.frequency.value=f||800;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(g);g.connect(AC.destination);s.start(t);s.stop(t+d)}
function sfx(name){const n=performance.now();if(lastS[name]&&n-lastS[name]<45)return;lastS[name]=n;const at=AC?AC.currentTime:0;switch(name){
 case 'axe':tone(200,.2,'sawtooth',.06,80);noise(.12,.05,2000);break;case 'arrow':tone(900,.06,'triangle',.05,1700);noise(.05,.04,3000);break;case 'magic':tone(1300,.12,'sine',.05,380);tone(2600,.08,'sine',.02,900);break;case 'knife':tone(1500,.05,'square',.03,2400);break;
 case 'hit':tone(240,.05,'square',.03,110);break;case 'kill':tone(140,.09,'sawtooth',.04,55);break;case 'hurt':tone(160,.1,'square',.05,70);break;case 'clang':tone(1800,.15,'square',.03,1600);break;
 case 'food':tone(520,.1,'triangle',.08,880);tone(880,.12,'triangle',.06,0,at+.08);break;case 'gold':tone(1200,.08,'square',.04);tone(1600,.1,'square',.04,0,at+.07);break;
 case 'key':tone(1000,.15,'triangle',.06,1500);break;case 'door':noise(.4,.2,300);tone(90,.3,'sawtooth',.06,50);break;case 'wood':noise(.1,.1,900);break;case 'crumble':noise(.8,.35,350);tone(60,.5,'sawtooth',.08,30);break;
 case 'slam':noise(.7,.5,260);tone(70,.6,'sawtooth',.18,28);break;case 'potion':noise(.8,.35,1400);tone(200,.7,'square',.08,1400);break;
 case 'heal':tone(600,.35,'sine',.08,1300);break;case 'dash':tone(300,.14,'triangle',.05,1000);break;case 'swing':noise(.15,.15,1800);break;case 'drain':tone(90,.2,'sawtooth',.05,60);break;
 case 'up':[523,659,784,1047].forEach((f,i)=>tone(f,.14,'square',.05,0,at+i*.08));break;case 'gen':noise(.5,.3,600);tone(120,.4,'square',.06,40);break;case 'fireball':tone(300,.25,'sawtooth',.03,120);break;case 'lob':tone(260,.2,'triangle',.04,520);break;case 'thud':noise(.25,.2,400);break;}}
const RIFF=[40,40,52,40,43,43,55,43,38,38,50,38,45,47,48,47];
// your "Dungeon Master" soundtrack: one part per level, at 40% volume so the sound effects stay clear
const SONGS=[1,2,3,4].map(n=>`music/dungeon-master-${n}.mp3`),BGM=new Audio();BGM.loop=true;BGM.preload='auto';BGM.volume=.2;let bgmSrc='',bgmT=-9999;
const songFor=()=>G.treasure?G.level%SONGS.length:(G.level-1)%SONGS.length;
// angel levels play "Healing Waters" instead, faint far away and loud by her spring, and from her direction
const ANGEL_SONG='music/healing-waters.mp3';
// level 1 Dungeon Master, level 2 Dungeon Love, level 3 Dung Eater, then they take turns (angel, flood and treasure levels have their own; Dig Down past 15)
const ROT=['music/dungeon-master-1.mp3','music/dungeon-love.mp3','music/dung-eater.mp3'],TREASURE_SONG='music/treasure-room-run.mp3';
// recorded voice lines, played over the music on every device (phones and headsets ignore the browser's speech voice)
const VO={},VON=['treasure','run-go','strength'];let duckUntil=0;
function voPreload(){if(!AC||VO._p)return;VO._p=1;for(const n of VON)fetch(V('music/vo-'+n+'.mp3')).then(r=>r.arrayBuffer()).then(b=>new Promise((ok,no)=>{const q=AC.decodeAudioData(b,ok,no);if(q&&q.then)q.then(ok,no)})).then(buf=>{VO[n]=buf}).catch(()=>{})}
function voice(n,duck,tries){if(!tries&&window.__vlog)window.__vlog.push(n+(duck?'(duck)':''));if(!AC||G&&G.demo)return;voPreload();const b=VO[n];if(!b){if((tries||0)<12)setTimeout(()=>voice(n,duck,(tries||0)+1),250);return}
 try{const s=AC.createBufferSource(),g=AC.createGain();g.gain.value=n==='strength'?.15:1;s.buffer=b;s.connect(g);g.connect(AC.destination);s.start();if(duck)duckUntil=performance.now()+b.duration*1000+300}catch(e){}}let BGMR=null;const _ad=new THREE.Vector3();
function bgmRoute(){if(BGMR!==null||!AC)return;try{const s=AC.createMediaElementSource(BGM),g=AC.createGain(),pan=AC.createStereoPanner?AC.createStereoPanner():null;if(pan){s.connect(pan);pan.connect(g)}else s.connect(g);g.connect(AC.destination);g.gain.value=.2;BGM.volume=1;BGMR={g,pan}}catch(e){BGMR=false}}
function musicMix(){let vol=.2,pan=0;const pl=G&&G.pools&&G.pools[0];
 if(pl){let best=null,bd=1e9;for(const p of players)if(p.local&&p.alive){const d=Math.hypot(p.x-pl.x,p.z-pl.z);if(d<bd){bd=d;best=p}}
  if(best){const k=clamp(1-(bd-4)/40,0,1);vol=.2*(1-.65*k*k);const now=performance.now();
   // she speaks: the music all but stops, then her song starts again from the top
   if(G.angelTalk){if(now<G.angelTalk)vol=.008;else{G.angelTalk=0;try{BGM.currentTime=0}catch(e){}const g=BGMR&&BGMR.g;if(g)g.gain.value=vol}}try{best.cam.getWorldDirection(_ad);const fx=_ad.x,fz=_ad.z,fl=Math.hypot(fx,fz)||1,ux=(pl.x-best.x)/(bd||1),uz=(pl.z-best.z)/(bd||1);pan=bd>2.5?clamp((ux*(-fz/fl)+uz*(fx/fl))*.85,-.85,.85):0}catch(e){}}else vol=.2}
 bgmRoute();if(BGMR){const g=BGMR.g.gain;g.value+=(vol-g.value)*.06;if(BGMR.pan){const pp=BGMR.pan.pan;pp.value+=(pan-pp.value)*.1}}else BGM.volume=clamp(BGM.volume+(vol-BGM.volume)*.06,0,1)}
// the menu's looping "ahh": starts after the warning screen, gapless, fades out when the dungeon music begins
let BOOTDONE=!document.getElementById('boot');const MENU={buf:null,src:null,g:null,loading:false};
function menuLoopTick(){if(!AC)return;const want=musicOn&&BOOTDONE&&!$('#menu').hidden;
 if(want&&!MENU.buf&&!MENU.loading){MENU.loading=true;fetch(V('music/menu-loop.wav')).then(r=>r.arrayBuffer()).then(b=>new Promise((ok,no)=>{const p=AC.decodeAudioData(b,ok,no);if(p&&p.then)p.then(ok,no)})).then(buf=>{MENU.buf=buf}).catch(()=>{MENU.loading=false})}
 if(want&&MENU.buf&&!MENU.src){if(!MENU.g){MENU.g=AC.createGain();MENU.g.gain.value=0;MENU.g.connect(AC.destination)}const s=AC.createBufferSource();s.buffer=MENU.buf;s.loop=true;s.loopStart=3.0;s.loopEnd=MENU.buf.duration;s.connect(MENU.g);s.start();MENU.src=s}
 if(MENU.g){const t=want?.1375:0;MENU.g.gain.value+=(t-MENU.g.gain.value)*(want?.04:.08);if(!want&&MENU.src&&MENU.g.gain.value<.01){try{MENU.src.stop()}catch(e){}MENU.src=null}}}
function music(){menuLoopTick();const want=musicOn&&G&&!G.demo&&!G.over&&!G.paused&&!!G.lg;if(!want){if(!BGM.paused)BGM.pause();return}
 musicMix();voPreload();const me=players.find(p=>p.local)||players[0],src=me&&inMarket(me)?'music/heavenly-market.mp3':G.pools&&G.pools.length?ANGEL_SONG:G.flood?'music/flooded-dungeon.mp3':G.treasure?TREASURE_SONG:G.lair?'music/troll-spider-boss.mp3':G.level>15?'music/dig-down.mp3':ROT[(G.level-1)%ROT.length];if(src!==bgmSrc){bgmSrc=src;BGM.src=V(src);bgmT=-9999}
 if(BGM.paused&&performance.now()-bgmT>1500){bgmT=performance.now();try{const r=BGM.play();if(r&&r.catch)r.catch(()=>{})}catch(e){}}}
function unlockMusic(){try{bgmSrc=SONGS[0];BGM.src=V(SONGS[0]);const r=BGM.play();if(r&&r.then)r.then(()=>{if(!G||G.demo)BGM.pause()}).catch(()=>{})}catch(e){}}
let sayT=0;function say(t,force){const n=performance.now();if(!force&&n-sayT<2500)return;sayT=n;try{const u=new SpeechSynthesisUtterance(t);u.rate=.9;u.pitch=.5;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}

// ---------- state
let G=null,players=[];
const humans=()=>players.filter(p=>p.local);
function newState(){return{level:1,treasure:false,time:0,enemies:[],proj:[],eproj:[],rocks:[],items:[],gens:[],chests:[],parts:[],fx:[],embers:[],sconces:[],flash:0,transT:0,paused:false,over:false,passCtr:0,nxt:new Int32Array(2400),flowT:0,bannerT:0,lightT:0,fxq:[],tick:0}}
const SL=[];for(let k=0;k<4;k++){const l=new THREE.PointLight(0xff8a3a,0,15,2);scene.add(l);SL.push(l)}
// lights that ride along with the newest heroes' shots once the angel has blessed the weapons
const SHL=[];for(let k=0;k<3;k++){const l=new THREE.PointLight(0xffe2a8,0,14,2);scene.add(l);SHL.push(l)}
function shotLights(){let k=0;if(G&&G.glowShots&&G.proj)for(let i=G.proj.length-1;i>=0&&k<SHL.length;i--){const b=G.proj[i];if(b.dead||!(b.owner||G.net==='client'))continue;const l=SHL[k++];l.position.set(b.x,b.y||1.2,b.z);l.color.setHex(b.glow||(b.kind==='bolt'?0x9fd8ff:0xffe2a8));l.intensity=2.4}
 for(;k<SHL.length;k++)SHL[k].intensity=0}

// ---------- level generation
// flood levels: an easy one at 7, then 22, 29, 36 ...; the angel's spring: every other level 10-16, then on the level right after each flood (and 31, just after the Troll Spider)
const isFlood=l=>l===7||l>=22&&(l-15)%7===0,angelLv=l=>l>=10&&l<=16?l%2===0:l>16&&l!==30&&(l===31||isFlood(l-1));
function genLevel(lv,tr){
 const W=tr?26:Math.min(30+lv*3,64),H=W,g=new Uint8Array(W*H).fill(1),rooms=[];let tries=0;const want=tr?6:Math.min(7+Math.floor(lv*1.5),24);
 while(rooms.length<want&&tries++<1500){const w=3+rnd(8),h=3+rnd(8),x=1+rnd(W-w-2),y=1+rnd(H-h-2);if(rooms.some(r=>x<r.x+r.w+2&&x+w+2>r.x&&y<r.y+r.h+2&&y+h+2>r.y))continue;rooms.push({x,y,w,h,cx:x+(w>>1),cy:y+(h>>1)})}
 if(rooms.length<3)return genLevel(lv,tr);
 for(const r of rooms)for(let j=r.y;j<r.y+r.h;j++)for(let i=r.x;i<r.x+r.w;i++)g[j*W+i]=0;
 const chain=[rooms[0]],left=rooms.slice(1);
 while(left.length){const a=chain[chain.length-1];let bi=0,bd=1e9;left.forEach((r,k)=>{const d=Math.abs(r.cx-a.cx)+Math.abs(r.cy-a.cy);if(d<bd){bd=d;bi=k}});chain.push(left.splice(bi,1)[0])}
 const dig=(i,j,wd)=>{for(let a=0;a<wd;a++)for(let b=0;b<wd;b++){const x=i+a,y=j+b;if(x>0&&y>0&&x<W-1&&y<H-1)g[y*W+x]=0}};
 const corr=(a,b)=>{const wd=RNG()<.35?2:1;let x=a.cx,y=a.cy;if(RNG()<.5){while(x!==b.cx){dig(x,y,wd);x+=Math.sign(b.cx-x)}while(y!==b.cy){dig(x,y,wd);y+=Math.sign(b.cy-y)}}else{while(y!==b.cy){dig(x,y,wd);y+=Math.sign(b.cy-y)}while(x!==b.cx){dig(x,y,wd);x+=Math.sign(b.cx-x)}}dig(x,y,wd)};
 for(let k=0;k<chain.length-1;k++)corr(chain[k],chain[k+1]);
 const extra=2+rnd(3)+Math.floor(lv/3);for(let k=0;k<extra;k++){const a=chain[rnd(chain.length)],b=chain[rnd(chain.length)];if(a!==b)corr(a,b)}
 for(const r of chain.slice(1,-1))if(r.w>=6&&r.h>=6&&RNG()<.6){g[(r.y+2)*W+r.x+2]=1;g[(r.y+r.h-3)*W+r.x+r.w-3]=1}
 const start=chain[0],ex=chain[chain.length-1];
 if(!tr)for(let j=ex.y-1;j<=ex.y+ex.h;j++)for(let i=ex.x-1;i<=ex.x+ex.w;i++){if(i>=ex.x&&i<ex.x+ex.w&&j>=ex.y&&j<ex.y+ex.h)continue;if(g[j*W+i]===0)g[j*W+i]=2}
 g[ex.cy*W+ex.cx]=0;
 // cracked walls: single-thickness walls with open floor on both sides
 if(!tr){const cand=[];for(let j=2;j<H-2;j++)for(let i=2;i<W-2;i++){const k=j*W+i;if(g[k]!==1)continue;if((g[k-1]===0&&g[k+1]===0)||(g[k-W]===0&&g[k+W]===0))cand.push(k)}
  for(let n=Math.min(cand.length,6+lv);n>0;n--){const k=cand.splice(rnd(cand.length),1)[0];if(k!==undefined)g[k]=3}}
 let secret=null;
 if(!tr&&angelLv(lv)){const mids=chain.slice(1,-1);for(let t=0;t<80&&!secret&&mids.length;t++){const r=mids[rnd(mids.length)],side=rnd(4);let wx,wy,x0,y0;
  if(side===0){wx=r.x+r.w;wy=r.cy;x0=wx+1;y0=wy-1}else if(side===1){wx=r.x-1;wy=r.cy;x0=wx-3;y0=wy-1}else if(side===2){wx=r.cx;wy=r.y+r.h;x0=wx-1;y0=wy+1}else{wx=r.cx;wy=r.y-1;x0=wx-1;y0=wy-3}
  if(x0<2||y0<2||x0+4>W-1||y0+4>H-1||g[wy*W+wx]!==1)continue;let ok=true;
  for(let j=y0-1;j<=y0+3&&ok;j++)for(let i=x0-1;i<=x0+3;i++){if(i===wx&&j===wy)continue;if(g[j*W+i]!==1){ok=false;break}}
  if(!ok)continue;for(let j=y0;j<y0+3;j++)for(let i=x0;i<x0+3;i++)g[j*W+i]=0;g[wy*W+wx]=3;secret={k:wy*W+wx,x:x0,y:y0,cx:x0+1,cy:y0+1}}}
  if(secret){secret.ex=secret.k%W;secret.ey=Math.floor(secret.k/W)}
 // after level 30: a few Troll Spider nests, each room's narrow doorways webbed over
 let nests=[],webs=[];if(!tr&&lv>30){const mids=chain.slice(1,-1).filter(r=>!(secret&&r===secret));for(let n=0;n<2+(lv>40?1:0)&&mids.length;n++)nests.push(mids.splice(rnd(mids.length),1)[0]);
  // every opening into a nest room gets a web across it
  for(const r of nests){let n=0;const side=(i,j,across)=>{const k=j*W+i;if(n<8&&i>0&&j>0&&i<W-1&&j<H-1&&g[k]===0){webs.push([k,across]);n++}};
   for(let i=r.x;i<r.x+r.w;i++){side(i,r.y-1,0);side(i,r.y+r.h,0)}for(let j=r.y;j<r.y+r.h;j++){side(r.x-1,j,1);side(r.x+r.w,j,1)}}
  for(const [k] of webs)g[k]=3}
 // the heavenly market: a walled-off patch of sky beside the map, reached only through the angel's portal
 if(secret){const MW=10,MH=12,GAP=40,W2=W+GAP+MW+2,g2=new Uint8Array(W2*H).fill(1);for(let j=0;j<H;j++)for(let i=0;i<W;i++)g2[j*W2+i]=g[j*W+i];
  const fix=k=>Math.floor(k/W)*W2+k%W;for(const w of webs)w[0]=fix(w[0]);secret.k=fix(secret.k);
  const x0=W+GAP,y0=2;for(let j=y0;j<y0+MH;j++)for(let i=x0;i<x0+MW;i++)g2[j*W2+i]=0;
  const cx=x0+MW/2;g2[y0*W2+cx-1]=1;g2[y0*W2+cx]=1;
  return{W:W2,Wd:W,H,g:g2,start,ex,rooms:chain,secret,webs,nests,market:{x0,y0,w:MW,h:MH,cx}}}
 return{W,H,g,start,ex,rooms:chain,secret,webs,nests};
}
const blk=(i,j)=>i<0||j<0||i>=G.W||j>=G.H||G.g[j*G.W+i]!==0;
function blk2(g,W,H,i,j){return i<0||j<0||i>=W||j>=H||g[j*W+i]===1||g[j*W+i]===3}

function buildLevel(){
 if(G.lg)scene.remove(G.lg);
 const lg=G.lg=new THREE.Group();scene.add(lg);
 if(G.net!=='client')G.seed=(Math.random()*2e9)|0;RNG=mulberry(G.seed);G.genId=0;G.chestId=0;
 const tr=G.treasure,lv=G.level,L=(lv===30&&!tr)?genLair():genLevel(lv,tr),W=L.W,H=L.H,g=L.g,Wd=L.Wd||W;
 Object.assign(G,{W,H,Wd,g,market:null,portals:[],envM:undefined,env0:null,enemies:[],proj:[],eproj:[],rocks:[],items:[],gens:[],chests:[],parts:[],fx:[],sconces:[],doorMesh:new Map(),doorHp:new Map(),crack:new Map(),flood:null,deathCalm:false,boss:null,tsSeen:0,tsAwake:false,arena:null,wet:null,wetRooms:null,waves:[],orbs:[],remains:[],exitLocked:false,tsNet:null,tsOrb:null,tsRem:null,pools:[],secret:L.secret||null,secretOpen:false,transT:0,flowT:0,lightT:0});
 G.dist=new Uint16Array(W*H);G.hdist=new Uint16Array(W*H);G.q=new Int32Array(W*H);G.head=new Int32Array(W*H);
 const isWall=k=>g[k]===1,mm=new THREE.Matrix4(),qq=new THREE.Quaternion(),one=new THREE.Vector3(1,1,1);
 const vis=[],faces=[];for(let j=0;j<H;j++)for(let i=0;i<Wd;i++){const k=j*W+i;if(!isWall(k))continue;let near=false;for(const [a,b] of N8){const x=i+a,y=j+b;if(x>=0&&y>=0&&x<W&&y<H&&!isWall(y*W+x)){near=true;if((!a||!b)&&g[y*W+x]===0)faces.push([i,j,a,b])}}if(near)vis.push([i,j])}
 const im=new THREE.InstancedMesh(wallGeo,wallMat,Math.max(1,vis.length));vis.forEach((c,n)=>{mm.makeTranslation(c[0]*T+T/2,WALLH/2,c[1]*T+T/2);im.setMatrixAt(n,mm)});im.count=vis.length;im.castShadow=im.receiveShadow=true;lg.add(im);
 const WEB=new Map(L.webs||[]);for(let k=0;k<W*H;k++)if(g[k]===3){if(WEB.has(k)){const m=webMesh(k,WEB.get(k),W);lg.add(m);G.crack.set(k,{mesh:m,hp:6,web:1});continue}const m=new THREE.Mesh(wallGeo,L.secret&&k===L.secret.k?wallMat:crackMat);m.position.set((k%W)*T+T/2,WALLH/2,Math.floor(k/W)*T+T/2);m.castShadow=m.receiveShadow=true;lg.add(m);G.crack.set(k,{mesh:m,hp:9})}
 if(tr)wallMat.color.setRGB(1,.85,.55);else if(L.boss){wallMat.color.setHSL(.06,.12,.4);crackMat.color.setHSL(.06,.12,.4)}else{const c=new THREE.Color().setHSL((.03+lv*.11)%1,.35,.82);wallMat.color.copy(c);crackMat.color.copy(c)}
 FLOOR.map.repeat.set(Wd,H);FLOOR.normalMap.repeat.set(Wd,H);FLOOR.roughnessMap.repeat.set(Wd,H);
 const fl=new THREE.Mesh(new THREE.PlaneGeometry(Wd*T,H*T),floorMat);fl.rotation.x=-PI/2;fl.position.set(Wd*T/2,0,H*T/2);fl.receiveShadow=true;lg.add(fl);
 const ce=new THREE.Mesh(new THREE.PlaneGeometry(Wd*T,H*T),ceilMat);ce.rotation.x=PI/2;ce.position.set(Wd*T/2,WALLH,H*T/2);lg.add(ce);
 const floors=[];for(let j=0;j<H;j++)for(let i=0;i<Wd;i++)if(g[j*W+i]===0||g[j*W+i]===2)floors.push([i,j]);
 const bm=L.boss?[]:floors.filter(c=>c[1]%2===0);const beams=new THREE.InstancedMesh(new THREE.BoxGeometry(T,.4,.5),woodMat,Math.max(1,bm.length));bm.forEach((c,n)=>{mm.makeTranslation(c[0]*T+T/2,WALLH-.2,c[1]*T+T/2);beams.setMatrixAt(n,mm)});beams.count=bm.length;beams.castShadow=true;lg.add(beams);
 const dc=floors.filter(c=>RNG()<.14&&N8.slice(0,4).some(([a,b])=>blk2(g,W,H,c[0]+a,c[1]+b)));const dec=new THREE.InstancedMesh(DECOR,decorMat,Math.max(1,dc.length));
 dc.forEach((c,n)=>{qq.setFromAxisAngle(_up,Math.random()*TAU);mm.compose(new THREE.Vector3(c[0]*T+T/2+rf(-1.3,1.3),0,c[1]*T+T/2+rf(-1.3,1.3)),qq,one.clone().setScalar(rf(.8,1.4)));dec.setMatrixAt(n,mm)});dec.count=dc.length;dec.castShadow=dec.receiveShadow=true;lg.add(dec);
 const sc=faces.filter(()=>RNG()<(L.boss?.045:.15));const sm=new THREE.InstancedMesh(SCONCE,stdv({metalness:.6,roughness:.5}),Math.max(1,sc.length));
 sc.forEach((f,n)=>{const [i,j,a,b]=f,x=i*T+T/2+a*T/2,z=j*T+T/2+b*T/2;qq.setFromAxisAngle(_up,Math.atan2(a,b));mm.compose(new THREE.Vector3(x,2.8,z),qq,one);sm.setMatrixAt(n,mm);G.sconces.push({x:x+a*.42,y:3.38,z:z+b*.42,ph:Math.random()*9})});sm.count=sc.length;lg.add(sm);
 for(let k=0;k<W*H;k++)if(g[k]===2){const i=k%W,j=Math.floor(k/W),m=new THREE.Mesh(DOORGEO,woodMat);m.position.set(i*T+T/2,WALLH*.47,j*T+T/2);if((i>0&&g[k-1]===0)||(i<W-1&&g[k+1]===0))m.rotation.y=PI/2;m.castShadow=m.receiveShadow=true;lg.add(m);G.doorMesh.set(k,m);G.doorHp.set(k,6)}
 const exg=new THREE.Group(),swirl=glowTex(x=>{x.translate(32,32);for(let a=0;a<3;a++){x.rotate(TAU/3);x.strokeStyle='rgba(120,255,160,.9)';x.lineWidth=4;x.beginPath();for(let t=0;t<1;t+=.02){const r=t*30,an=t*7;x.lineTo(Math.cos(an)*r,Math.sin(an)*r)}x.stroke()}});
 const dais=new THREE.Mesh(Cy(2.0,2.2,.22,24),std({color:0x5a5048,roughness:.8}));dais.position.y=.11;dais.receiveShadow=true;exg.add(dais);
 const ringM=new THREE.Mesh(new THREE.TorusGeometry(1.75,.1,8,40),std({color:0xc8a040,metalness:.9,roughness:.3}));ringM.rotation.x=PI/2;ringM.position.y=.25;exg.add(ringM);
 const disc=new THREE.Mesh(new THREE.CircleGeometry(1.65,40),ADD({map:swirl,color:0x60ff90,side:THREE.DoubleSide}));disc.rotation.x=-PI/2;disc.position.y=.24;exg.add(disc);
 const beam=new THREE.Mesh(Cy(1.3,1.65,WALLH,24,true),ADD({color:0x30ff70,opacity:.16,side:THREE.DoubleSide}));beam.position.y=WALLH/2;exg.add(beam);
 const xl=new THREE.PointLight(0x50ff90,1.6,16,2);xl.position.y=1.5;exg.add(xl);
 G.exit={x:L.ex.cx*T+T/2,z:L.ex.cy*T+T/2,beam,disc,g:exg};exg.position.set(G.exit.x,0,G.exit.z);lg.add(exg);
 G.lair=!!L.boss;if(L.boss){G.exitLocked=true;exg.visible=false;lairDress(lg,W,H,g);G.arena={x:L.arena.i*T+T/2,z:L.arena.j*T+T/2,r:L.arena.r*T};wetRooms(lg,L)}
 if(HEMI.color&&HEMI.color.setHex)HEMI.color.setHex(0x8a6e5a);HEMI.intensity=L.boss?.1:.55;scene.fog.density=L.boss?.064:.034;scene.fog.color.setHex(L.boss?0x040202:0x0b0705);scene.background.setHex(L.boss?0x040202:0x0b0705);
 const inR=(c,r)=>c[0]>=r.x&&c[0]<r.x+r.w&&c[1]>=r.y&&c[1]<r.y+r.h;
 const cells=[];for(let j=0;j<H;j++)for(let i=0;i<Wd;i++)if(g[j*W+i]===0&&!inR([i,j],L.start)&&!(i===L.ex.cx&&j===L.ex.cy)&&!(L.secret&&inR([i,j],{x:L.secret.x,y:L.secret.y,w:3,h:3})))cells.push([i,j]);
 const roomCells=cells.filter(c=>L.rooms.slice(1).some(r=>inR(c,r)&&(tr||r!==L.ex)));
 const corrCells=cells.filter(c=>!L.rooms.some(r=>inR(c,r)));
 const used=new Set(),take=arr=>{for(let t=0;t<50;t++){const c=arr[rnd(arr.length)];const k=c[1]*W+c[0];if(!used.has(k)){used.add(k);return c}}return arr[rnd(arr.length)]};
 const wc=c=>[c[0]*T+T/2+rf(-.6,.6),c[1]*T+T/2+rf(-.6,.6)];
 const sx=L.start.cx*T+T/2,sz=L.start.cy*T+T/2;G.start={x:sx,z:sz};
 const put=(type,n,arr)=>{for(let k=0;k<n;k++){const p=wc(take(arr||cells));addItem(type,p[0],p[1])}};
 if(tr){put('treasure',34,roomCells.length?roomCells:cells);put('food',3);put('charm',2);put('potion',2);put('key',1);for(let k=0;k<8;k++){const p=wc(take(cells));addChest(p[0],p[1])}G.timer=106;if(!G.demo)voice('treasure')}
 else if(L.boss){const inA=c=>L.arenaMask[c[1]*W+c[0]],dung=cells.filter(c=>!inA(c)),arC=cells.filter(inA);
  put('food',4,arC);put('potion',2,arC);put('food',12,dung);put('potion',4,dung);put('charm',3,dung);put('treasure',30,dung);for(let k=0;k<8;k++){const p=wc(take(dung));addChest(p[0],p[1])}
  if(G.net!=='client'){spawnBoss();lairCritters(L,dung)}}
 else{
  // monster schedule: only ghosts and green grunts for levels 1-8, then one new kind a level; snake trolls at 15, fire devils at 20, Death at 25
  const types=['ghost','grunt'];for(const [L,t] of [[9,'gargoyle'],[10,'lobber'],[11,'sorcerer'],[15,'naga'],[20,'demon']])if(lv>=L)types.push(t);
  const ng=(Math.min(3+lv*1.5,22)*(lv===7?.5:1))|0;for(let k=0;k<ng;k++){const c=take(roomCells.length?roomCells:cells);addGen(types[rnd(types.length)],c[0]*T+T/2,c[1]*T+T/2)}
  for(const r of L.nests||[]){addGen('spiderling',r.cx*T+T/2,r.cy*T+T/2);const gn=G.gens[G.gens.length-1];gn.rate=Math.max(1.1,gn.rate*1.6);if(G.net!=='client')nestEggs(r)}
  if(lv>=25&&Math.random()<.65){const c=take(roomCells.length?roomCells:cells);addGen('death',c[0]*T+T/2,c[1]*T+T/2)}
  put('food',3+rnd(2)+Math.floor(lv/3));put('potion',1+(lv%2));put('charm',1);put('treasure',4+lv);for(let k=0;k<3+rnd(3);k++){const p=wc(take(cells));addChest(p[0],p[1])}
  let groups=0;const seen=new Uint8Array(W*H);for(let k=0;k<W*H;k++)if(g[k]===2&&!seen[k]){groups++;const st=[k];seen[k]=1;while(st.length){const c=st.pop();for(const d of [1,-1,W,-W]){const n=c+d;if(n>=0&&n<W*H&&g[n]===2&&!seen[n]){seen[n]=1;st.push(n)}}}}
  const reach=new Uint8Array(W*H),q=[L.start.cy*W+L.start.cx];reach[q[0]]=1;while(q.length){const c=q.pop();for(const d of [1,-1,W,-W]){const n=c+d;if(n>=0&&n<W*H&&g[n]===0&&!reach[n]){reach[n]=1;q.push(n)}}}
  const rc=cells.filter(c=>reach[c[1]*W+c[0]]);put('key',Math.min(groups,4)+1,rc.length?rc:cells);
  const far=c=>Math.hypot(c[0]-L.start.cx,c[1]-L.start.cy)>5;const fc=corrCells.filter(far),fr=cells.filter(far);const ne=Math.min(45+lv*14,260);
  if(G.net!=='client')for(let k=0;k<ne;k++){const pool=(Math.random()<.7&&fc.length)?fc:fr;const c=pool[rnd(pool.length)]||cells[rnd(cells.length)];spawnEnemy(types[rnd(types.length)],c[0]*T+T/2+rf(-1.4,1.4),c[1]*T+T/2+rf(-1.4,1.4))}
 }
 RNG=Math.random;const off=[[-1,-1],[1,-1],[-1,1],[1,1]];
 if(G.net!=='client')players.forEach((p,i)=>{const o=off[p.i%4];p.x=sx+o[0]*1.4;p.z=sz+o[1]*1.4;p.yaw=0;p.pitch=0;p.tgold=0;p.spawn={x:p.x,z:p.z}});
 if(L.secret){makePool(L.secret.cx*T+T/2,L.secret.cy*T+T/2);if(L.market)makeMarket(L)}
 for(const q of players)if(q.uw){q.uw.material.opacity=0;q.uw.visible=false}
 if(!tr&&isFlood(lv))makeFlood(lv===7);
 for(const p of players)applyGrowth(p,G.level===1&&!G.treasure&&!p.grown);for(const p of players)p.grown=true;
 G.cap=tr?0:Math.min(130+lv*30,380);G.dmgScale=1+(lv-1)*.1;G.spd=1+Math.min(lv,12)*.03;
 G.embers=[];drawMapBase();assignLights();
 if(!G.demo){if(tr){banner('Treasure Room','Grab the gold and reach the exit in 1:46',3)}
  else if(L.boss){banner('Level 30 · The Troll Spider’s Lair','Cut through the webs and find his cave at the heart of the dungeon',4.5);if(G.time>2)say('Level 30. The Troll Spider.',true)}
  else{banner('Level '+lv,lv===1?'Find the green portal of the exit':lv===25?'Beware: Death walks these halls':'The horde grows stronger',2.5);if(G.time>2)say(lv===25?'Level 25. Beware of Death.':'Level '+lv,true)}}
}
function addItem(type,x,z){const m=new THREE.Mesh(ITEMGEO[type],IMAT[type]);m.position.set(x,0,z);m.castShadow=true;G.lg.add(m);G.items.push({type,x,z,mesh:m,ph:Math.random()*6})}
function addChest(x,z){const m=new THREE.Mesh(ITEMGEO.chest,IMAT.chest);m.position.set(x,0,z);m.rotation.y=rnd(4)*PI/2;m.castShadow=m.receiveShadow=true;G.lg.add(m);G.chests.push({id:G.chestId++,x,z,mesh:m})}
// monster toughness by level: gentler now that weapon upgrades come slower (+12% a level to 15, then +6% a level)
function enemyHpMul(L){return L<=15?1+(L-1)*.12:2.68+(L-15)*.06}
function addGen(type,x,z){const m=new THREE.Mesh(GENGEO,genMat);m.position.set(x,0,z);m.castShadow=m.receiveShadow=true;G.lg.add(m);const lvl=1+rnd(3),hp=type==='death'?8:lvl*4+G.level*.5;G.gens.push({id:G.genId++,type,x,z,mesh:m,hp,max:hp,t:rf(.5,2),rate:type==='death'?7:Math.max(.55,2.0-G.level*.1-lvl*.2),c:RGB(EDEF[type].gen)})}
function spawnEnemy(type,x,z){if(G.enemies.length>=400)return;if(type==='death'&&G.enemies.filter(e=>e.type==='death').length>=2)return;const D0=EDEF[type];G.passCtr++;
 G.enemies.push({type,x,z,hp:D0.hp*enemyHpMul(G.level),atk:0,stun:0,flash:0,kx:0,kz:0,rot:Math.random()*TAU,ph:Math.random()*6,fire:rf(1.5,3),pass:G.passCtr%15===0,moving:0,blink:rf(1,3),hidden:false,drained:0})}
function assignLights(){const N=quality==='high'?4:2;if(!G.sconces||!G.sconces.length){SL.forEach(l=>l.intensity=0);return}
 const ref=humans().filter(p=>p.alive);if(!ref.length&&G.start)ref.push(G.start);
 const s=G.sconces.map(c=>({c,d:Math.min(...ref.map(p=>(p.x-c.x)**2+(p.z-c.z)**2))})).sort((a,b)=>a.d-b.d);
 SL.forEach((l,k)=>{const c=k<N&&s[k]?s[k].c:null;l.userData.c=c;if(c)l.position.set(c.x,c.y,c.z);else l.intensity=0})}

// ---------- minimap
function drawMapBase(){const c=G.mapC||(G.mapC=document.createElement('canvas'));c.width=G.Wd||G.W;c.height=G.H;const x=c.getContext('2d');for(let j=0;j<G.H;j++)for(let i=0;i<(G.Wd||G.W);i++){const v=G.g[j*G.W+i];const wb=v===3&&G.crack.get(j*G.W+i)&&G.crack.get(j*G.W+i).web;x.fillStyle=v===1?'#2a1d14':v===2?'#e0902a':wb?'#d8d8e4':v===3?'#8a5a3a':G.wet&&G.wet[j*G.W+i]?'#3f7484':'#7a6650';x.fillRect(i,j,1,1)}
 const s=G.secret;if(s){if(G.g[s.k]!==0){x.fillStyle='#2a1d14';x.fillRect(s.x,s.y,3,3);x.fillRect(s.k%G.W,Math.floor(s.k/G.W),1,1)}else{x.fillStyle='#7fe0ff';x.fillRect(s.cx,s.cy,1,1)}}}
function drawMini(cv,p){const c=cv.getContext('2d'),S=cv.width,k=S/(Math.max(G.Wd||G.W,G.H)*T);c.clearRect(0,0,S,S);c.imageSmoothingEnabled=false;c.drawImage(G.mapC,0,0,(G.Wd||G.W)*T*k,G.H*T*k);
 c.fillStyle='#ff4030';for(const g of G.gens)c.fillRect(g.x*k-2,g.z*k-2,4,4);
 if(!G.exitLocked){c.fillStyle='#40ff80';c.beginPath();c.arc(G.exit.x*k,G.exit.z*k,4,0,TAU);c.fill()}
 for(const q of players){if(!q.alive)continue;c.fillStyle=q.H.css;c.beginPath();c.arc(q.x*k,q.z*k,q===p?3.6:2.6,0,TAU);c.fill();if(q.ai){c.strokeStyle='#fff';c.lineWidth=1;c.stroke()}}
 if(p){c.strokeStyle='#fff';c.lineWidth=1.5;c.beginPath();c.moveTo(p.x*k,p.z*k);c.lineTo(p.x*k-Math.sin(p.yaw)*9,p.z*k-Math.cos(p.yaw)*9);c.stroke()}}

// ---------- hands, arms and smoke for first-person views
function makeHand(mat,size,left){const g=new THREE.Group(),s=left?-1:1,fingers=[];
 const palm=new THREE.Mesh(SPH,mat);palm.scale.set(.05,.021,.058);palm.position.z=-.02;g.add(palm);
 const L=[.052,.06,.057,.046];
 for(let i=0;i<4;i++){const k=new THREE.Group();k.position.set((-.034+i*.0225)*s,0,-.068);g.add(k);
  const a=new THREE.Mesh(CYL,mat);a.scale.set(.0108,L[i]*.55,.0108);a.rotation.x=-PI/2;a.position.z=-L[i]*.275;k.add(a);
  const kn=new THREE.Mesh(SPH,mat);kn.scale.setScalar(.012);k.add(kn);
  const j=new THREE.Group();j.position.z=-L[i]*.55;k.add(j);const b=new THREE.Mesh(CYL,mat);b.scale.set(.0098,L[i]*.45,.0098);b.rotation.x=-PI/2;b.position.z=-L[i]*.225;j.add(b);
  const tip=new THREE.Mesh(SPH,mat);tip.scale.setScalar(.0098);tip.position.z=-L[i]*.45;j.add(tip);fingers.push([k,j])}
 const th=new THREE.Group();th.position.set(-.046*s,-.006,-.03);g.add(th);const t1=new THREE.Mesh(CYL,mat);t1.scale.set(.013,.045,.013);t1.rotation.x=-PI/2;t1.position.z=-.022;th.add(t1);const tj=new THREE.Group();tj.position.z=-.045;th.add(tj);const t2=new THREE.Mesh(CYL,mat);t2.scale.set(.0115,.036,.0115);t2.rotation.x=-PI/2;t2.position.z=-.017;tj.add(t2);const t3=new THREE.Mesh(SPH,mat);t3.scale.setScalar(.0115);t3.position.z=-.035;tj.add(t3);
 g.scale.setScalar(size);
 const setCurl=c=>{for(const [k,j] of fingers){k.rotation.x=-c;j.rotation.x=-c*1.15}th.rotation.x=-c*.35;tj.rotation.x=-c*.5;th.rotation.y=(.9-c*.45)*s};
 setCurl(1.3);g.traverse(o=>{o.frustumCulled=false});return{g,setCurl,fingers}}
function segMesh(geo,mat,r){const m=new THREE.Mesh(geo,mat);m.userData.r=r;m.frustumCulled=false;return m}
function setSeg(m,a,b,len){_v.subVectors(b,a);const L=len||_v.length();_v.normalize();m.position.copy(a).addScaledVector(_v,L/2);m.scale.set(m.userData.r,L,m.userData.r);m.quaternion.setFromUnitVectors(_up,_v)}
function makeArm(root,skin,bracerMat,r,sleeve,sf){const fa=segMesh(CYLT,skin,r),br=segMesh(BRACER,bracerMat,r*(sf?1.3:1)),sl=sleeve?segMesh(sf?CYLT:CYL,sleeve,r*(sf||1.25)):null;root.add(fa);root.add(br);if(sl)root.add(sl);
 return(wrist,elbow)=>{setSeg(fa,elbow,wrist);_v2.subVectors(elbow,wrist).normalize();const b0=wrist.clone().addScaledVector(_v2,.03),b1=wrist.clone().addScaledVector(_v2,.27);setSeg(br,b1,b0);if(sl){const s0=wrist.clone().addScaledVector(_v2,.25);setSeg(sl,elbow,s0)}}}
function makeWisps(parent,color,y,size){const ws=[];for(let k=0;k<3;k++){const m=new THREE.Mesh(new THREE.PlaneGeometry(size,size*1.6),ADD({map:SMOKE,color,opacity:.35,side:THREE.DoubleSide}));m.position.y=y;m.rotation.y=k*PI/3;m.frustumCulled=false;parent.add(m);ws.push(m)}
 return{ws,set(on,col){for(const m of ws){m.visible=on;if(col!==undefined)m.material.color.setHex(col)}},tick(t){ws.forEach((m,k)=>{m.rotation.y=k*PI/3+t*.6*(k%2?1:-1);m.material.opacity=.22+.14*Math.sin(t*2+k*2);m.scale.y=1+.15*Math.sin(t*1.7+k)})}}}
class Helix extends THREE.Curve{getPoint(t,o){o=o||new THREE.Vector3();const a=t*TAU*6;return o.set(Math.cos(a)*.045,-.55+t*1.5,Math.sin(a)*.045)}}
const P3=(x,y,z)=>new THREE.Vector3(x,y,z);

// ---------- first-person viewmodels
function viewModel(hk){
 const root=new THREE.Group(),H=HEROES[hk];const vm={root,hand:[0,0,0],tier:1};
 const M=(geo,mat,p,r,parent)=>{const m=new THREE.Mesh(geo,mat);if(p)m.position.set(p[0],p[1],p[2]);if(r)m.rotation.set(r[0],r[1],r[2]);(parent||root).add(m);return m};
 if(hk==='barbarian'){
  const A=P3(.24,-.36,-.62),tilt=.28,d=P3(Math.sin(tilt),Math.cos(tilt),0);vm.hand=[A.x,A.y,A.z];
  const axeG=new THREE.Group();axeG.position.copy(A);axeG.rotation.z=-tilt;root.add(axeG);let axe=null,wisp=null;
  vm.setTier=t=>{if(axe)axeG.remove(axe);const bm=bladeMat(t,H.glow[t-1],[0x9a9ca2,0xd8dce2,0xb06058,0xe0f0f4,0xe8f0f8][t-1]);axe=buildParts(axeParts(t),{blade:bm,wood:MAT.wood,iron:MAT.iron,steel:MAT.steel,bone:MAT.bone,dark:MAT.dark});axeG.add(axe);
   wisp=t>=4?makeWisps(axe,H.glow[t-1],.38,.9):null;axe.traverse(o=>{o.frustumCulled=false})};
  const hu=makeHand(MAT.hairy,1.4,false),hl=makeHand(MAT.hairy,1.4,true);hu.g.rotation.order=hl.g.rotation.order='ZXY';root.add(hu.g);root.add(hl.g);
  const armR=makeArm(root,MAT.hairy,MAT.leather,.068),armL=makeArm(root,MAT.hairy,MAT.leather,.068);
  vm.update=(p,t)=>{const a=p.anim,thrown=a>.5,ret=a>0&&!thrown?a*1.2:0,bob=Math.sin(p.bob)*.015;
   axeG.position.set(A.x,A.y-ret*.5+bob,A.z);if(axe)axe.visible=!thrown;
   const spread=thrown?(a-.5)*2:0;
   const up=A.clone().addScaledVector(d,0).add(P3(.02+spread*.12,bob+spread*.1,.035-spread*.12)),lo=A.clone().addScaledVector(d,-.2).add(P3(-.02-spread*.14,bob+spread*.06,.035-spread*.1));
   hu.g.position.copy(up);hl.g.position.copy(lo);hu.g.rotation.set(PI/2-spread*.9,0,PI/2-tilt);hl.g.rotation.set(PI/2-spread*.9,0,-PI/2-tilt);hu.setCurl(thrown?.25:1.45);hl.setCurl(thrown?.25:1.45);
   armR(up.clone().add(P3(.05,-.05,.07)),P3(.62,-.95,.15));armL(lo.clone().add(P3(-.05,-.05,.07)),P3(-.1,-1.05,.1));
   if(wisp){wisp.set(!thrown);wisp.tick(t)}}}
 if(hk==='elf'){
  const B=new THREE.Group();B.position.set(-.2,-.1,-.78);B.rotation.set(0,.12,.1);root.add(B);vm.hand=[-.2,-.1,-.78];
  const bowMat=MAT.bowWood.clone();vm.bowMat=bowMat;
  const curve=new THREE.CatmullRomCurve3([P3(0,-.82,.13),P3(0,-.78,.18),P3(0,-.66,.17),P3(0,-.45,.1),P3(0,-.22,.03),P3(0,0,0),P3(0,.22,.03),P3(0,.45,.1),P3(0,.66,.17),P3(0,.78,.18),P3(0,.82,.13)]);
  const tube=new THREE.TubeGeometry(curve,90,.022,8);M(tube,bowMat,null,null,B);M(Cy(.03,.03,.16,12),MAT.leather,[0,0,.005],null,B);
  const TOP=P3(0,.82,.13),BOT=P3(0,-.82,.13);const sMat=std({color:0xe8e0d0,roughness:.6});const s1=segMesh(CYL,sMat,.0035),s2=segMesh(CYL,sMat,.0035);B.add(s1);B.add(s2);
  const arrow=new THREE.Mesh(GEO.arrow,stdv({roughness:.6}));arrow.rotation.y=PI;B.add(arrow);
  const wisp=makeWisps(B,0x80ff90,.0,.5);wisp.set(false);
  const hl=makeHand(MAT.skin,1.05,true),hr=makeHand(MAT.skin,1.05,false);hl.g.rotation.order=hr.g.rotation.order='ZXY';B.add(hl.g);B.add(hr.g);hl.g.position.set(.012,0,.03);hl.g.rotation.set(PI/2,0,-PI/2);
  const goldBand=std({color:0xd0a040,metalness:.9,roughness:.3});
  const armL=makeArm(root,MAT.skin,MAT.leather,.055,MAT.wool),armR=makeArm(root,MAT.skin,MAT.leather,.055,MAT.wool);
  const band1=segMesh(CYL,goldBand,.064),band2=segMesh(CYL,goldBand,.064);root.add(band1);root.add(band2);
  vm.setTier=t=>{bowMat.color.setHex([0xffffff,0xe8e4dc,0xffffff,0xffffff,0xfff2d8][t-1]);bowMat.emissive.setHex(H.glow[t-1]||0);bowMat.emissiveIntensity=t>=3?.35:0;sMat.color.setHex(t>=2?0xf0f4ff:0xe8e0d0);wisp.set(t>=3,H.glow[t-1])};
  const wl=new THREE.Vector3(),wr=new THREE.Vector3(),tmp=new THREE.Vector3();
  vm.update=(p,t)=>{const dr=p.draw||0,N=P3(0,0,.13+dr*.36);arrow.visible=dr>.12;arrow.position.set(.018,0,N.z-.4);setSeg(s1,TOP,N);setSeg(s2,BOT,N);
   hr.g.position.set(.035,.0,N.z+.02);hr.g.rotation.set(PI/2,0,PI/2+.3);hr.setCurl(dr>.12?1.05:.35);
   B.position.y=-.1+Math.sin(p.bob)*.015;B.updateMatrixWorld();root.updateMatrixWorld();
   wl.set(.01,-.07,.06).applyMatrix4(B.matrix);wr.set(.06,-.05,N.z+.07).applyMatrix4(B.matrix);armL(wl,P3(-.5,-.85,.1));armR(wr,P3(.55,-.8,.3));
   _v2.subVectors(P3(-.5,-.85,.1),wl).normalize();tmp.copy(wl).addScaledVector(_v2,.15);setSeg(band1,tmp,tmp.clone().addScaledVector(_v2,.025));_v2.subVectors(P3(.55,-.8,.3),wr).normalize();tmp.copy(wr).addScaledVector(_v2,.15);setSeg(band2,tmp,tmp.clone().addScaledVector(_v2,.025));
   wisp.tick(t)}}
 if(hk==='wizard'){
  const st=new THREE.Group();st.position.set(.3,-.42,-.68);st.rotation.set(-.25,0,-.18);root.add(st);vm.hand=[.3,-.42,-.68];
  const staff=makeStaff(1.6,.5);st.add(staff.g);
  const hr=makeHand(MAT.skin,1.08,false);hr.g.rotation.order='ZXY';hr.g.position.set(0,0,.035);hr.g.rotation.set(PI/2,0,PI/2);hr.setCurl(1.45);st.add(hr.g);
  const lh=makeHand(MAT.skin,1.12,true);lh.g.rotation.set(PI/2-.12,.2,.28);lh.setCurl(.1);root.add(lh.g);
  const fg=lh.fingers[1][0];const ringB=new THREE.Mesh(new THREE.TorusGeometry(.0125,.0035,6,16),MAT.gold);ringB.position.z=-.018;fg.add(ringB);const gem=new THREE.Mesh(Oc(.009),MAT.gem);gem.position.set(0,.012,-.018);gem.scale.set(1,.6,1.4);fg.add(gem);
  const rc=new THREE.Mesh(new THREE.PlaneGeometry(.6,.6),ADD({map:RUNECIRCLE,color:H.tint[0],opacity:0,side:THREE.DoubleSide}));root.add(rc);
  const beamC=new THREE.Mesh(new THREE.CylinderGeometry(.025,.01,1,10,1,true),ADD({color:0xffffff,opacity:0})),beamG=new THREE.Mesh(new THREE.CylinderGeometry(.09,.03,1,12,1,true),ADD({color:H.tint[0],opacity:0}));for(const m of [beamC,beamG]){m.rotation.x=-PI/2;root.add(m)}
  const glow=new THREE.Mesh(Sp(.06),ADD({color:H.tint[0],opacity:.85}));root.add(glow);
  const armR=makeArm(root,MAT.skin,MAT.gold,.056,MAT.robe,2.1),armL=makeArm(root,MAT.skin,MAT.gold,.056,MAT.robe,2.1);
  vm.setTier=t=>{const c=H.tint[t-1];staff.halo.material.color.setHex(c);staff.orb.material.color.setHex(t>=4?0xffffff:0xdff4ff);rc.material.color.setHex(c);beamG.material.color.setHex(c);glow.material.color.setHex(c)};
  const pal=new THREE.Vector3();
  vm.update=(p,t)=>{const a=p.anim,b=p.anim2,bob=Math.sin(p.bob)*.015;
   st.rotation.z=-.18+Math.sin(b*PI)*1.4;st.rotation.x=-.25-Math.sin(b*PI)*.6;st.position.y=-.42+bob;
   lh.g.position.set(-.26,-.2+bob,-.62-a*.08);pal.set(lh.g.position.x+.005,lh.g.position.y+.06,lh.g.position.z-.03);
   rc.position.set(pal.x-.01,pal.y+.03,pal.z-.09);rc.rotation.z=t*1.2;rc.scale.setScalar(.75+a*.45);rc.material.opacity=Math.min(.95,a*1.3)+(p.tier>=3?.08:0);
   const bo=a>.45?(a-.45)*1.8:0,L=11;for(const m of [beamC,beamG]){m.position.set(pal.x,pal.y,pal.z-L/2-.05);m.scale.set(1+bo*.5,L,1+bo*.5);m.material.opacity=bo*(m===beamC?1:.5)}
   glow.position.copy(pal);glow.scale.setScalar(.5+a*2.4);staff.halo.scale.setScalar(1+Math.sin(t*5)*.15);
   st.updateMatrix();const w=P3(.04,-.08,.09).applyMatrix4(st.matrix);armR(w,P3(.55,-.95,.15));armL(P3(pal.x+.03,pal.y-.13,pal.z+.08),P3(-.55,-.95,.1))}}
 if(hk==='valkyrie'){
  const DG=new THREE.Group();DG.position.set(.22,-.22,-.56);DG.rotation.set(-.2,0,-.12);root.add(DG);vm.hand=[.22,-.22,-.56];let dag=null,wisp=null;
  vm.setTier=t=>{if(dag)DG.remove(dag);const bm=bladeMat(t,H.glow[t-1],[0xc8ccd2,0xe0e6ee,0xe8e0d0,0xd8eef8,0xe0f0ff][t-1]);dag=buildParts(daggerParts(t),{blade:bm,gold:MAT.gold,redgold:MAT.redgold,ruby:MAT.ruby});DG.add(dag);wisp=t>=3?makeWisps(dag,H.glow[t-1],.2,.45):null;dag.traverse(o=>{o.frustumCulled=false})};
  const hr=makeHand(MAT.skin,1.0,false),hl=makeHand(MAT.skin,1.0,true);hr.g.rotation.order='ZXY';root.add(hr.g);root.add(hl.g);
  const armR=makeArm(root,MAT.skin,MAT.redgold,.056),armL=makeArm(root,MAT.skin,MAT.redgold,.056);
  vm.update=(p,t)=>{const a=p.anim,thrown=a>.45,bob=Math.sin(p.bob)*.015,fl=thrown?(a-.45)*1.8:0;
   DG.position.set(.22,-.22+bob-(a>0&&!thrown?a*.4:0),-.56-fl*.12);if(dag)dag.visible=!thrown;
   const g=DG.position.clone().add(P3(0,-.065,.01));hr.g.position.copy(g);hr.g.rotation.set(PI/2-fl*.8,0,PI/2-.12);hr.setCurl(thrown?.35:1.4);
   hl.g.position.set(-.24,-.3+bob,-.55);hl.g.rotation.set(-.5,.3,.2);hl.setCurl(.45+Math.sin(t*1.3)*.05);
   armR(g.clone().add(P3(.04,-.06,.07)),P3(.45,-.85,.15));armL(P3(-.22,-.33+bob,-.5),P3(-.5,-.9,.1));if(wisp){wisp.set(!thrown);wisp.tick(t)}}}
 vm.setTier(1);root.traverse(o=>{o.frustumCulled=false});return vm}
function setLayer(o,l){o.traverse(c=>c.layers.set(l))}

// ---------- hero bodies (what other players and allies look like)
function makeBody(hk){const root=new THREE.Group(),M=MAT;
 const add=(par,geo,mat,p,r,s)=>{const m=new THREE.Mesh(geo,mat);if(p)m.position.set(p[0],p[1],p[2]);if(r)m.rotation.set(r[0],r[1],r[2]);if(s)m.scale.set(s[0],s[1],s[2]);m.castShadow=true;par.add(m);return m};
 const grp=(x,y)=>{const g=new THREE.Group();g.position.set(x,y,0);root.add(g);return g};
 const lL=grp(-.15,.92),lR=grp(.15,.92),aL=grp(-.42,1.5),aR=grp(.42,1.5);
 if(hk==='barbarian'){const sk=M.tan;
  for(const g of [lL,lR]){add(g,Cy(.12,.1,.48,12),sk,[0,-.24,0]);add(g,Cy(.13,.11,.4,12),M.leatherDark,[0,-.66,0]);add(g,Cy(.16,.15,.12,12),M.fur,[0,-.46,0]);add(g,Bx(.2,.1,.3),M.leatherDark,[0,-.87,.05])}
  add(root,Cy(.38,.3,.62,16),sk,[0,1.25,0]);add(root,SPH,sk,[0,1.4,.1],0,[.36,.22,.22]);add(root,Bx(.09,.8,.04),M.leather,[0,1.25,.28],[0,0,.7]);add(root,Bx(.09,.8,.04),M.leather,[0,1.25,.28],[0,0,-.7]);add(root,Bx(.09,.8,.04),M.leather,[0,1.25,-.28],[0,0,.7]);add(root,Bx(.09,.8,.04),M.leather,[0,1.25,-.28],[0,0,-.7]);
  add(root,Cy(.35,.35,.13,18),M.leather,[0,.95,0]);add(root,Cy(.07,.07,.03,14),M.steel,[0,.95,.35],[PI/2,0,0]);add(root,Cy(.34,.46,.44,18,true),M.leather,[0,.71,0]);add(root,Cy(.35,.47,.4,18,true),M.fur,[0,.68,0]);
  add(root,SPH,M.fur,[-.32,1.55,0],0,[.24,.17,.26]);add(root,SPH,M.fur,[.32,1.55,0],0,[.24,.17,.26]);
  add(root,Sp(.19),sk,[0,1.8,.01]);add(root,SPH,M.hair,[0,1.86,-.03],0,[.2,.17,.21]);add(root,Cy(.14,.07,.65,10),M.hair,[0,1.5,-.18]);add(root,Co(.12,.26,12),M.hair,[0,1.62,.13],[PI,0,0]);
  for(const g of [aL,aR]){add(g,Sp(.13),sk,[0,0,0]);add(g,Cy(.11,.1,.36,12),sk,[0,-.2,0]);add(g,Cy(.105,.11,.22,12),M.leather,[0,-.48,0]);add(g,Sp(.08),sk,[0,-.63,0])}
  const ax=buildParts(axeParts(1),{blade:bladeMat(1,0,0x9a9ca2),wood:M.wood,iron:M.iron,steel:M.steel,bone:M.bone,dark:M.dark});ax.position.set(0,-.62,.12);ax.rotation.x=-.2;aR.add(ax);root.scale.setScalar(1.18)}
 if(hk==='elf'){
  for(const g of [lL,lR]){add(g,Cy(.09,.08,.5,12),M.woolDark,[0,-.25,0]);add(g,Cy(.1,.09,.42,12),M.leather,[0,-.66,0]);add(g,Bx(.15,.08,.26),M.leatherDark,[0,-.88,.05])}
  add(root,Cy(.25,.36,1.0,16),M.wool,[0,1.08,0]);add(root,Cy(.27,.27,.08,16),M.leather,[0,.98,0]);add(root,Bx(.06,.7,.03),M.leather,[0,1.3,.24],[0,0,.6]);
  add(root,Sp(.17),M.skin,[0,1.78,.01]);add(root,SPH,M.hairBlack,[0,1.84,-.02],0,[.18,.15,.19]);for(let k=0;k<7;k++){const a=k/7*PI-PI/2;add(root,Co(.05,.16,5),M.hairBlack,[Math.sin(a)*.12,1.92,Math.cos(a)*.06-.04],[-.4,a,0])}
  add(root,Co(.035,.14,5),M.skin,[-.18,1.82,0],[0,0,1.2]);add(root,Co(.035,.14,5),M.skin,[.18,1.82,0],[0,0,-1.2]);
  add(root,Cy(.07,.06,.6,10),M.leather,[.1,1.35,-.26],[0,0,-.4]);for(let k=0;k<4;k++)add(root,Cy(.008,.008,.3,4),M.wood,[.2+k*.02,1.7,-.3],[0,0,-.4]);
  for(const g of [aL,aR]){add(g,Sp(.09),M.wool,[0,0,0]);add(g,Cy(.08,.07,.36,12),M.wool,[0,-.2,0]);add(g,Cy(.075,.08,.2,12),M.leather,[0,-.46,0]);add(g,Sp(.06),M.skin,[0,-.6,0])}
  const bowc=new THREE.CatmullRomCurve3([P3(0,-.6,.1),P3(0,-.3,.02),P3(0,0,0),P3(0,.3,.02),P3(0,.6,.1)]);add(aL,new THREE.TubeGeometry(bowc,30,.018,6),M.bowWood,[0,-.6,.05])}
 if(hk==='wizard'){
  for(const g of [lL,lR]){add(g,Cy(.08,.08,.8,10),M.robe,[0,-.4,0]);add(g,Bx(.15,.09,.27),std({color:0xd8d4cc,roughness:.6}),[0,-.86,.05])}
  add(root,Cy(.3,.68,1.6,22,true),M.robe,[0,.82,0]);add(root,Cy(.36,.74,1.25,22,true),M.robe,[0,1.0,-.03]);add(root,Cy(.27,.33,.6,18),M.robe,[0,1.36,0]);
  add(root,Cy(.31,.31,.1,18),M.gold,[0,1.08,0]);add(root,Sp(.05),M.gem,[0,1.08,.31]);add(root,Bx(.1,.9,.02),M.gold,[0,.62,.5],[-.35,0,0]);
  add(root,SPH,M.robe,[0,1.56,0],0,[.44,.19,.33]);add(root,Sp(.04),M.gem,[-.22,1.6,.22]);add(root,Sp(.04),M.gem,[.22,1.6,.22]);
  add(root,Oc(.16),M.gold,[0,1.32,-.33],0,[1,1.5,.2]);add(root,Sp(.045),M.gem,[0,1.32,-.36]);
  add(root,Sp(.17),M.skin,[0,1.8,.02]);add(root,SPH,M.robe,[0,1.86,-.03],0,[.24,.26,.25]);add(root,Co(.2,.32,14),M.robe,[0,2.08,-.09],[-.35,0,0]);
  add(root,Co(.13,.6,12),M.beard,[0,1.46,.15],[PI+.12,0,0]);add(root,Bx(.16,.03,.04),M.beard,[0,1.73,.17]);
  add(root,Sp(.02),new THREE.MeshBasicMaterial({color:0xcfeeff}),[-.06,1.83,.16]);add(root,Sp(.02),new THREE.MeshBasicMaterial({color:0xcfeeff}),[.06,1.83,.16]);
  for(const g of [aL,aR]){add(g,Sp(.1),M.robe,[0,0,0]);add(g,Cy(.08,.18,.62,14,true),M.robe,[0,-.32,0]);add(g,Cy(.18,.18,.06,14,true),M.gold,[0,-.62,0]);add(g,Sp(.055),M.skin,[0,-.64,0])}
  const sf=makeStaff(2.05,.86);sf.g.position.set(0,-.64,.12);aR.add(sf.g)}
 if(hk==='valkyrie'){
  for(const g of [lL,lR]){add(g,Cy(.085,.075,.45,12),M.skin,[0,-.22,0]);add(g,Cy(.1,.09,.46,12),M.gold,[0,-.64,0]);add(g,Bx(.14,.1,.26),M.gold,[0,-.88,.04])}
  add(root,Cy(.24,.27,.55,16),M.redgold,[0,1.3,0]);add(root,Cy(.27,.48,.62,18,true),M.cloth,[0,.75,0]);add(root,Bx(.62,1.25,.03),M.cloth,[0,1.0,-.3]);add(root,Cy(.25,.25,.08,16),M.gold,[0,1.02,0]);
  add(root,SPH,M.gold,[-.3,1.55,0],0,[.14,.1,.16]);add(root,SPH,M.gold,[.3,1.55,0],0,[.14,.1,.16]);
  add(root,Sp(.17),M.skin,[0,1.78,.01]);add(root,SPH,M.hairRed,[0,1.83,-.03],0,[.19,.17,.2]);add(root,Cy(.15,.1,.75,12),M.hairRed,[0,1.45,-.15]);add(root,Cy(.18,.18,.04,16),M.gold,[0,1.86,0]);
  for(const s of [-1,1])add(root,new THREE.ShapeGeometry((()=>{const w=new THREE.Shape();w.moveTo(0,0);w.quadraticCurveTo(.1,.18,.22,.24);w.quadraticCurveTo(.14,.1,.18,.04);w.quadraticCurveTo(.08,.04,0,0);return w})()),M.gold,[s*.17,1.88,0],[0,s>0?0:PI,0]);
  for(const g of [aL,aR]){add(g,Sp(.08),M.gold,[0,0,0]);add(g,Cy(.065,.055,.34,12),M.skin,[0,-.2,0]);add(g,Cy(.07,.07,.2,12),M.redgold,[0,-.45,0]);add(g,Sp(.05),M.skin,[0,-.58,0])}
  const dg=buildParts(daggerParts(1),{blade:bladeMat(1,0,0xc8ccd2),gold:M.gold,redgold:M.redgold,ruby:M.ruby});dg.position.set(0,-.6,.06);aR.add(dg)}
 return{root,lL,lR,aL,aR,anim(mv,t,sh){const s=Math.sin(t*8)*.55*mv;lL.rotation.x=s;lR.rotation.x=-s;aL.rotation.x=-s*.7;aR.rotation.x=sh>0?-1.3*sh:s*.7}}}

// ---------- your art: first-person shooting shots and character turnaround sheets
const FPSET={barbarian:(t,p)=>({idle:t>=5?(p.cd1>0?'barb_skull':'barb_skull_smoke'):t>=3?'barb_rune':'barb_hold_iron',fire:t>=5?'barb_skull_ghost':t>=3?'barb_rune_ghost':'barb_throw',at:.25,filter:''}),
 elf:t=>({idle:t>=3?'elf_draw_magic':'elf_draw',fire:t>=3?'elf_release_magic':'elf_release',at:.55,filter:''}),
 valkyrie:t=>({idle:t>=5?'valk_hold_spirit':t>=3?'valk_hold_glow':'valk_hold',fire:t>=3?'valk_empty':'valk_throw',at:.6,fire2:'valk_empty',at2:.12,filter:''}),
 wizard:t=>({idle:t>=3?'wiz_L_glow':'wiz_L_idle',fire:'wiz_L_glow',at:.3,filter:'',staff:t>=3?'wiz_S_glow':'wiz_S_idle',staffFire:'wiz_S_glow'})};
const FPL={elf:{h:1,dy:0},barbarian:{h:1.04,dy:.3,dx:.2,vdx:.05},valkyrie:{h:.76,dy:.17},wizard:{h:1,dy:0}};
let FP_OK=true;{let left=0;for(const n of ['barb_hold_iron','barb_rune','barb_rune_ghost','barb_skull','barb_skull_smoke','barb_skull_ghost','valk_empty','vr_hand_r','vr_staff_l','vr_sleeve_r','vr_sleeve_l','wiz_L_idle','wiz_L_glow','wiz_S_idle','wiz_S_glow','barb_hold','barb_hold_skull','barb_throw','barb_throw_skull','elf_draw','elf_draw_magic','elf_release','elf_release_magic','valk_hold','valk_hold_glow','valk_hold_spirit','valk_throw','wiz_idle','wiz_glow']){const im=new Image();left++;im.onerror=()=>{FP_OK=false};im.src=V('fp/'+n+'.webp')}}
function fpTick(){for(const p of humans()){const e=p.el;if(!e||!e.fp)continue;const vr=renderer.xr.isPresenting&&p.i===0;const show=FP_OK&&p.alive&&!vr;e.fpw.style.display=show?'':'none';if(!show)continue;
 const S=FPSET[p.hero](p.tier,p),firing=p.anim>S.at,src='fp/'+(firing?S.fire:S.fire2&&p.anim>S.at2?S.fire2:S.idle)+'.webp';if(e.fpSrc!==src){e.fpSrc=src;e.fp.src=V(src)}
 const kick=firing?18:p.anim*10,swing=p.hero==='wizard'?-Math.sin(p.anim2*PI)*12:p.hero==='barbarian'?-Math.sin(p.anim2*PI)*8:0,glow=p.hero==='wizard'&&firing&&!SAFE.on?' brightness(1.35)':'';
 const L=FPL[p.hero],ph=e.root.clientHeight||innerHeight,pw=e.root.clientWidth||innerWidth,wz=e.wzb;if(!wz)e.fp.style.height=(L.h*100)+'%';
 e.fp.style.filter=(S.filter+glow).trim()||'none';(wz||e.fp).style.transform=`translate(${((L.dx||0)*pw-p.sway*60).toFixed(1)}px,${(L.dy*ph+Math.sin(p.bob)*7+kick*(wz?.4:1)).toFixed(1)}px) rotate(${(wz?0:swing).toFixed(1)}deg)`;
 if(wz&&e.fp2){const now=performance.now();
  e.hl=(e.hl||0)+((p.anim>.05?1:0)-(e.hl||0))*(p.anim>.05?.45:.12);const hd=1-e.hl;
  e.fp.style.transformOrigin='94% 100%';e.fp.style.transform=`translate(3%,${(hd*46).toFixed(1)}%) rotate(${(hd*16).toFixed(1)}deg)`;
  const heal=now-(p.healAt||-1e9),sw=now-(p.staffAt||-1e9),upH=heal<1000?Math.min(1,heal/160,(1000-heal)/260):0,upS=sw<520?Math.min(1,sw/90,(520-sw)/200):0,up=clamp(Math.max(upH,upS),0,1),d=1-up*up*(3-2*up);
  const s2='fp/'+(firing?S.staffFire:S.staff)+'.webp';if(e.fp2Src!==s2){e.fp2Src=s2;e.fp2.src=V(s2)}
  e.fp2.style.display=d>.98?'none':'';e.fp2.style.filter=glow?glow.trim():'none';e.fp2.style.transform=`translate(-8%,${(d*88).toFixed(1)}%) rotate(${(-(d*16)+(upS>0&&upH===0?sw/520*10:0)).toFixed(1)}deg)`}}}

const SPR={barbarian:{f:'barbarian',h:2.35},elf:{f:'elf',h:2.25},wizard:{f:'wizard',h:2.45},valkyrie:{f:'valkyrie',h:2.3,atk:'valkyrie_throw'}};
const SPRTEX={},texLoader=new THREE.TextureLoader();{const _ld=texLoader.load.bind(texLoader);texLoader.load=(u,...a)=>_ld(V(u),...a)}
function sprTex(name,cb){let e=SPRTEX[name];if(!e){e=SPRTEX[name]={tex:null,cbs:[]};try{texLoader.load('sprites/'+name+'.webp',t=>{t.encoding=THREE.sRGBEncoding;e.tex=t;for(const f of e.cbs)f(t);e.cbs=[]},undefined,()=>{e.cbs=[]})}catch(x){}}if(e.tex)cb(e.tex);else e.cbs.push(cb)}
function cloneStrip(t){const c=t.clone();c.needsUpdate=true;c.repeat.set(1/8,1);c.wrapS=THREE.ClampToEdgeWrapping;return c}
function addBillboard(b,hk){const S=SPR[hk],geo=new THREE.PlaneGeometry(S.h/2,S.h);geo.translate(0,S.h/2,0);
 const mk=()=>new THREE.MeshLambertMaterial({alphaTest:.45,side:THREE.DoubleSide});const m=new THREE.Mesh(geo,mk());m.visible=false;m.frustumCulled=false;b.root.add(m);b.bb=m;b.bbMat=m.material;
 sprTex(S.f,t=>{b.bbMat.map=cloneStrip(t);b.bbMat.needsUpdate=true;m.visible=true;b.model.visible=false});
 if(S.atk){b.bbAtkMat=mk();sprTex(S.atk,t=>{b.bbAtkMat.map=cloneStrip(t);b.bbAtkMat.needsUpdate=true;b.atkReady=true})}}
const _cp=new THREE.Vector3();
function faceBills(cam){if(G&&G.pools)for(const pl of G.pools){cam.getWorldPosition(_cp);const a=Math.atan2(_cp.x-pl.x,_cp.z-pl.z);pl.angel.rotation.y=a;if(pl.bub)pl.bub.rotation.y=a;const s=Math.round(Math.sin(G.time*.45)*1.3);if(pl.angel.material.map)pl.angel.material.map.offset.x=((s+8)%8)/8}
cam.getWorldPosition(_cp);for(const p of players){const b=p.body;if(!b.bb||!b.bb.visible)continue;const dx=_cp.x-p.x,dz=_cp.z-p.z,L=Math.hypot(dx,dz)||1;b.bb.rotation.y=Math.atan2(dx,dz);
 const ux=dx/L,uz=dz/L,fx=-Math.sin(p.yaw),fz=-Math.cos(p.yaw),th=Math.atan2(fx*uz-fz*ux,fx*ux+fz*uz),idx=((Math.round(th/(PI/4)))%8+8)%8;
 const mat=b.atkReady&&p.anim>.2?b.bbAtkMat:b.bbMat;if(b.bb.material!==mat)b.bb.material=mat;if(mat.map)mat.map.offset.x=idx/8}}

// ---------- your monster sheets, drawn as camera-facing sprites (front, 3/4 and side views)
const MSPR={ghost:{h:2.6,f:1},grunt:{h:2.55},demon:{h:3.0,f:1},lobber:{h:1.9,f:1},sorcerer:{h:2.75},death:{h:3.15,f:1},gargoyle:{h:2.85,f:1},naga:{h:2.6},eel:{h:1.2,w:2.4},drowned:{h:2.6},drownbrute:{h:2.75},knife:{h:.62,p:1},knife5:{h:.7,p:1},spiderling:{h:2.4},gremlin:{h:1.85,src:'grunt'}};
const BBV=`attribute float iYaw;attribute vec3 iTint;varying vec2 vUv;varying vec3 vTint;
#include <fog_pars_vertex>
void main(){vec3 c=(modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.)).xyz;vec3 to=cameraPosition-c;to.y=0.;vec3 u=to/max(length(to),.001);vec3 r=vec3(u.z,0.,-u.x);
 float th=atan(sin(iYaw)*u.z-cos(iYaw)*u.x,sin(iYaw)*u.x+cos(iYaw)*u.z);float k=mod(floor(th/0.7853982+0.5)+8.,8.);
 float fr=0.;if(k>.5&&k<1.5)fr=1.;else if(k>1.5&&k<3.5)fr=2.;else if(k>4.5&&k<6.5)fr=3.;else if(k>6.5)fr=4.;
 vUv=vec2((uv.x+fr)/8.,uv.y);vTint=iTint;vec3 wp=c+r*position.x+vec3(0.,position.y,0.);
 vec4 mvPosition=viewMatrix*vec4(wp,1.);gl_Position=projectionMatrix*mvPosition;
 #include <fog_vertex>
}`;
const BBF=`uniform sampler2D map;varying vec2 vUv;varying vec3 vTint;
#include <fog_pars_fragment>
void main(){vec4 t=texture2D(map,vUv);if(t.a<.35)discard;gl_FragColor=vec4(t.rgb*vTint,1.);
#include <fog_fragment>
}`;
const MPOOL={};
for(const [type,S] of Object.entries(MSPR)){const geo=new THREE.PlaneGeometry(S.w||S.h/2,S.h);geo.translate(0,S.h/2,0);const max=type==='death'?20:S.p?300:420;
 const mat=new THREE.ShaderMaterial({uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{map:{value:null}}]),vertexShader:BBV,fragmentShader:BBF,fog:true,side:THREE.DoubleSide});
 const m=new THREE.InstancedMesh(geo,mat,max);m.frustumCulled=false;m.count=0;m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
 const yaw=new THREE.InstancedBufferAttribute(new Float32Array(max),1),tint=new THREE.InstancedBufferAttribute(new Float32Array(max*3),3);yaw.setUsage(THREE.DynamicDrawUsage);tint.setUsage(THREE.DynamicDrawUsage);geo.setAttribute('iYaw',yaw);geo.setAttribute('iTint',tint);
 const P={m,yaw,tint,max,n:0,ok:false};MPOOL[type]=P;scene.add(m);
 try{texLoader.load('sprites/m_'+(S.src||type)+'.webp',t=>{mat.uniforms.map.value=t;P.ok=true},undefined,()=>{})}catch(x){}}

// ---------- players
function makePlayer(hk,ctrl,i){
 const H=HEROES[hk],ai=ctrl==='ai',net=ctrl==='net',puppet=ctrl==='puppet',local=!ai&&!net&&!puppet,dolly=new THREE.Group(),cam=new THREE.PerspectiveCamera(75,1,.05,80);cam.position.y=H.eye;dolly.add(cam);scene.add(dolly);
 for(let j=0;j<4;j++)if(j!==i)cam.layers.enable(10+j);cam.layers.enable(20+i);
 const vm=viewModel(hk);cam.add(vm.root);setLayer(vm.root,20+i);
 const inner=makeBody(hk),body={root:new THREE.Group(),model:inner.root,anim:inner.anim};body.root.add(inner.root);addBillboard(body,hk);scene.add(body.root);setLayer(body.root,renderer.xr.isPresenting&&i!==0?0:10+i);
 const light=new THREE.PointLight(H.torch,local?1.15:.7,local?22:14,1.7);light.shadow.mapSize.set(512,512);light.shadow.camera.near=.4;light.shadow.camera.far=24;light.shadow.bias=-.004;light.shadow.normalBias=.03;scene.add(light);
 let bubble=null;if(hk==='wizard'){bubble=new THREE.Group();bubble.add(new THREE.Mesh(Sp(3.6,32,20),ADD({color:0x6fa8ff,opacity:.06,side:THREE.DoubleSide})));const ring=new THREE.Mesh(new THREE.RingGeometry(3.45,3.6,64),ADD({color:0x9fd8ff,opacity:.45,side:THREE.DoubleSide}));ring.rotation.x=-PI/2;ring.position.y=.05;bubble.add(ring);scene.add(bubble)}
 return{netId:'h'+i,i,hero:hk,H,ctrl,ai,net,puppet,local,nc:{a1:0,a2:0,pt:0,ea:0},x:0,z:0,yaw:0,pitch:0,hp:H.hp,max:0,smax:0,shield:0,mana:100,alive:true,keys:0,potions:1,pouch:0,score:0,kills:0,power:0,tier:1,cool:0,cd1:0,cd2:0,dash:0,dx:0,dz:0,mvx:0,mvz:-1,lastHit:-9,buff:null,buffT:0,anim:0,anim2:0,draw:1,shake:0,bob:0,sway:0,moving:0,prev:[],nextWarn:0,nextDie:0,hurt:0,msgT:0,tgold:0,dolly,cam,vm,body,light,bubble};
}
function applyQuality(){const vr=renderer.xr.isPresenting;for(const p of players)p.light.castShadow=quality==='high'&&!vr&&p.local;if(!vr){const n=Math.max(1,humans().length);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,COARSE?1:quality==='high'?(n>2?1.1:1.5):1));renderer.setSize(innerWidth,innerHeight)}if(G)assignLights()}
function teardown(){if(G&&G.lg){scene.remove(G.lg);G.lg=null}for(const p of players){scene.remove(p.dolly);scene.remove(p.body.root);scene.remove(p.light);if(p.bubble)scene.remove(p.bubble)}players=[];$('#hud').innerHTML='';$('#timer').hidden=true}
function tierOf(pw){let t=1;for(let k=0;k<TIERP.length;k++)if(pw>=TIERP[k])t=k+1;return t}
function gainPower(p,n){if(!p)return;p.power+=n;const t=tierOf(p.power);if(t>p.tier){p.tier=t;p.vm.setTier(t);pmsg(p,'Upgraded: '+p.H.tiers[t-1]+'!');sfx('up');burst(p.x,1.2,p.z,p.H.glow[t-1]||0xffd070,24,4);if(!p.ai&&t>=4)say(p.H.name+' grows stronger!')}}
function pmsg(p,t){if(!p.el)return;p.el.msg.textContent=t;p.el.msg.style.opacity=1;p.msgT=2.4}
function rumble(p,ms,s){if(p&&p.i===0&&!p.ai&&!p.net&&!p.puppet&&renderer.xr.isPresenting){try{const ss=renderer.xr.getSession();if(ss)for(const src of ss.inputSources){const h=src.gamepad&&src.gamepad.hapticActuators&&src.gamepad.hapticActuators[0];if(h&&h.pulse)h.pulse(Math.min(1,s),ms)}}catch(e){}return}
 if(!p.ctrl||!p.ctrl.startsWith('gp'))return;try{const gp=navigator.getGamepads()[+p.ctrl[2]];if(gp&&gp.vibrationActuator){const r=gp.vibrationActuator.playEffect('dual-rumble',{duration:ms,strongMagnitude:s,weakMagnitude:s*.6});if(r&&r.catch)r.catch(()=>{})}}catch(e){}}

// ---------- input
const keys={},pressed=new Set(),mouse={dx:0,dy:0,l:false,rp:false,mp:false};
const running=()=>G&&!G.demo&&!G.over;
addEventListener('keydown',e=>{keys[e.code]=true;if(!e.repeat)pressed.add(e.code);if(running()&&['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(running()&&(e.code==='Enter'||(e.code==='Escape'&&!document.pointerLockElement))){e.preventDefault();if(!e.repeat)setPause(!G.paused)}});
addEventListener('keyup',e=>{keys[e.code]=false});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;mouse.l=false});
const cv=renderer.domElement;
cv.addEventListener('mousedown',e=>{if(e.button===0)mouse.l=true;if(e.button===2)mouse.rp=true;if(e.button===1){mouse.mp=true;e.preventDefault()}});
addEventListener('mouseup',e=>{if(e.button===0)mouse.l=false});
cv.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('mousemove',e=>{if(document.pointerLockElement===cv){mouse.dx+=e.movementX;mouse.dy+=e.movementY}});
function lockPointer(){try{const r=cv.requestPointerLock();if(r&&r.catch)r.catch(()=>{})}catch(e){}}
cv.addEventListener('click',()=>{if(running()&&!G.paused&&players[0]&&players[0].ctrl==='km'&&!renderer.xr.isPresenting&&document.pointerLockElement!==cv)lockPointer()});
let wasLocked=false;
document.addEventListener('pointerlockchange',()=>{const l=document.pointerLockElement===cv;if(!l&&wasLocked&&running()&&!G.paused)setPause(true);wasLocked=l});
const dz=v=>Math.abs(v)<.18?0:v;
function readInput(p,dt){
 if(p.ai)return aiInput(p,dt);
 const o={mx:0,mz:0,lx:0,ly:0,fire:false,a1:false,a2:false,pot:false,eat:false,dash:false},c=p.ctrl;
 if(p.i===0&&renderer.xr.isPresenting){const s=renderer.xr.getSession();const pr=p.vrPrev||(p.vrPrev={});const now={};
  if(s)for(const src of s.inputSources){const gp=src.gamepad;if(!gp)continue;const ax=gp.axes,sx=ax.length>=4?ax[2]:ax[0]||0,sy=ax.length>=4?ax[3]:ax[1]||0,b=i=>!!(gp.buttons[i]&&gp.buttons[i].pressed);
   if(src.handedness==='left'){o.mx=dz(sx);o.mz=-dz(sy);now.lt=b(0);now.x=b(4)||b(5);now.lg=b(1)}else{if(COMF.turn==='smooth')o.lx=dz(sx)*2.2*dt;else if(Math.abs(sx)>.7){if(!p.snap){o.lx=Math.sign(sx)*(COMF.turn==='snap45'?PI/4:PI/6);p.snap=true}}else p.snap=false;o.fire=b(0);now.g=b(1);now.a=b(4);now.b=b(5)}}
  o.a1=now.g&&!pr.g;o.a2=now.lt&&!pr.lt;o.dash=now.a&&!pr.a;o.pot=(now.b&&!pr.b)||(now.x&&!pr.x);o.eat=now.lg&&!pr.lg;p.vrPrev=now;return o}
 if(c==='km'){o.mz=(keys.KeyW?1:0)-(keys.KeyS?1:0);o.mx=(keys.KeyD?1:0)-(keys.KeyA?1:0);
  o.lx=mouse.dx*.0024+((keys.ArrowRight?1:0)-(keys.ArrowLeft?1:0))*2.4*dt;o.ly=mouse.dy*.0024+((keys.ArrowDown?1:0)-(keys.ArrowUp?1:0))*1.5*dt;
  o.fire=mouse.l||!!keys.ControlLeft;o.a1=pressed.has('Space')||mouse.rp;o.a2=pressed.has('KeyF')||pressed.has('KeyQ')||mouse.mp;o.pot=pressed.has('KeyR');o.eat=pressed.has('KeyE');o.dash=pressed.has('ShiftLeft')||pressed.has('ShiftRight')}
 else if(c==='touch'){o.mx=TOUCH.mx;o.mz=-TOUCH.my;o.lx=TOUCH.dx*.006;o.ly=TOUCH.dy*.004;o.fire=TOUCH.fire;o.a1=!!TOUCH.e.a1;o.a2=!!TOUCH.e.a2;o.pot=!!TOUCH.e.pot;o.eat=!!TOUCH.e.eat;o.dash=!!TOUCH.e.dash}
 else if(c==='k2'){o.mz=(keys.KeyI?1:0)-(keys.KeyK?1:0);o.mx=(keys.KeyO?1:0)-(keys.KeyU?1:0);o.lx=((keys.KeyL?1:0)-(keys.KeyJ?1:0))*2.4*dt;o.fire=!!keys.KeyN;o.a1=pressed.has('KeyM');o.a2=pressed.has('KeyB');o.pot=pressed.has('KeyH');o.eat=pressed.has('KeyY');o.dash=pressed.has('KeyP')}
 else if(c&&c.startsWith('gp')){const pads=navigator.getGamepads?navigator.getGamepads():[];const gp=pads[+c[2]];if(gp){const b=i=>!!(gp.buttons[i]&&(gp.buttons[i].pressed||gp.buttons[i].value>.5)),ax=gp.axes;
  // standard mapping (PS4 / DualShock 4): 0 Cross, 1 Circle, 2 Square, 3 Triangle, 4 L1, 5 R1, 6 L2, 7 R2, 9 Options
  o.mx=dz(ax[0]||0);o.mz=-dz(ax[1]||0);o.lx=dz(ax[2]||0)*2.8*dt;o.ly=dz(ax[3]||0)*1.8*dt;o.fire=b(7)||b(5);
  const st=[b(0)||b(6),b(2)||b(4),b(3),b(1),b(10)];o.a1=st[0]&&!p.prev[0];o.a2=st[1]&&!p.prev[1];o.pot=st[2]&&!p.prev[2];o.eat=st[3]&&!p.prev[3];o.dash=st[4]&&!p.prev[4];if(p.hero!=='wizard'&&o.a2){o.a2=false;o.dash=true}p.prev=st}}
 return o;
}
let padStart=[];
function pollPads(){const pads=navigator.getGamepads?navigator.getGamepads():[];let n=0,names=[];for(let i=0;i<pads.length;i++){const gp=pads[i];if(!gp)continue;n++;names.push(/054c|dualshock|wireless controller|playstation/i.test(gp.id)?'PS4':'gamepad');const s=!!(gp.buttons[9]&&gp.buttons[9].pressed);if(s&&!padStart[i]&&running())setPause(!G.paused);padStart[i]=s;
  // using a controller on a phone hides the touch buttons; touching the screen brings them back
  if(G&&!G.demo&&!renderer.xr.isPresenting){const hs=humans();if(hs.length===1&&hs[0].ctrl==='touch'&&(gp.buttons.some(b=>b&&b.pressed)||gp.axes.some(a=>Math.abs(a)>.5))){hs[0].ctrl='gp'+i;showTouch()}}}
 if(n!==pollPads.n){pollPads.n=n;$('#padNote').textContent=n?`${n} controller${n>1?'s':''} ready (${names.join(', ')})`:'No controllers found yet: press a button on one to wake it.'}}

// ---------- computer allies
function aiInput(p,dt){const o={mx:0,mz:0,lx:0,ly:0,fire:false,a1:false,a2:false,pot:false,eat:false};
 const hs=players.filter(q=>!q.ai&&q.alive);let lead=null,ld=1e9;for(const q of hs){const d=Math.hypot(q.x-p.x,q.z-p.z);if(d<ld){ld=d;lead=q}}
 const cand=[];let death=null,dd=1e9;
 for(const e of G.enemies){if(e.dead||e.hidden)continue;const d=Math.hypot(e.x-p.x,e.z-p.z);if(EDEF[e.type].death){if(d<dd){dd=d;death=e}continue}if(d<17)cand.push([d,e])}
 cand.sort((a,b)=>a[0]-b[0]);let tgt=null,td=1e9;for(let k=0;k<cand.length&&k<6;k++){if(los(p.x,p.z,cand[k][1].x,cand[k][1].z)){tgt=cand[k][1];td=cand[k][0];break}}
 if(!tgt)for(const g of G.gens){const d=Math.hypot(g.x-p.x,g.z-p.z);if(d<15&&d<td&&los(p.x,p.z,g.x,g.z)){tgt=g;td=d}}
 let wx=0,wz=0;
 if(death&&dd<6){wx=p.x-death.x;wz=p.z-death.z;if(dd<2.5&&p.potions>0)o.pot=true}
 else if(lead&&ld>4.5){const W=G.W,ti=Math.floor(p.x/T),tj=Math.floor(p.z/T),d0=(ti>=0&&tj>=0&&ti<W&&tj<G.H)?G.hdist[tj*W+ti]:65535;let tx=lead.x,tz=lead.z;
  if(d0>1&&d0<65535){let best=d0,bi=-1,bj=-1;for(const [a,b] of N8){const ni=ti+a,nj=tj+b;if(blk(ni,nj))continue;if(a&&b&&(blk(ti+a,tj)||blk(ti,tj+b)))continue;const v=G.hdist[nj*W+ni];if(v<best){best=v;bi=ni;bj=nj}}if(bi>=0){tx=bi*T+T/2;tz=bj*T+T/2}}
  wx=tx-p.x;wz=tz-p.z}
 else{let it=null,idd=7;for(const i of G.items){if(i.gone)continue;if(i.type==='food'&&p.hp>p.max*.6&&p.pouch>=6)continue;const d=Math.hypot(i.x-p.x,i.z-p.z);if(d<idd&&(!lead||Math.hypot(i.x-lead.x,i.z-lead.z)<10)){idd=d;it=i}}
  if(it){wx=it.x-p.x;wz=it.z-p.z}else if(tgt&&td<3.2&&p.hero!=='barbarian'){wx=p.x-tgt.x;wz=p.z-tgt.z}else if(lead&&ld>2.5){wx=lead.x-p.x;wz=lead.z-p.z}}
 const wl=Math.hypot(wx,wz);if(wl>.01){wx/=wl;wz/=wl}
 let want=p.yaw;if(tgt)want=Math.atan2(-(tgt.x-p.x),-(tgt.z-p.z));else if(wl>.01)want=Math.atan2(-wx,-wz);
 const diff=wrapA(want-p.yaw);o.lx=-clamp(diff,-7*dt,7*dt);
 o.fire=!!tgt&&Math.abs(diff)<.3&&!(p.hero==='wizard'&&p.mana<10&&td<3.4);
 let near=0;for(const [d] of cand)if(d<7)near++;
 if(p.hero==='barbarian'&&near>=7)o.a1=true;
 if(p.hero==='elf'&&p.hp<p.max*.4&&cand.length&&cand[0][0]<2.5)o.a1=true;
 if(p.hero==='wizard'){if(p.mana>=25&&players.some(q=>q.alive&&q.hp<q.max*.55&&Math.hypot(q.x-p.x,q.z-p.z)<9))o.a1=true;if(cand.length&&cand[0][0]<3.2)o.a2=true}
 if(p.hero==='valkyrie'&&near>=6)o.a1=true;
 if(p.pouch>0&&p.hp<p.max*.35)o.eat=true;
 const y2=p.yaw-o.lx,fx=-Math.sin(y2),fz=-Math.cos(y2),rx=-fz,rz=fx;o.mz=wx*fx+wz*fz;o.mx=wx*rx+wz*rz;return o}

// ---------- world helpers
function collide(o,r){const i0=Math.floor((o.x-r)/T),i1=Math.floor((o.x+r)/T),j0=Math.floor((o.z-r)/T),j1=Math.floor((o.z+r)/T);
 for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){if(!blk(i,j))continue;const nx=clamp(o.x,i*T,i*T+T),nz=clamp(o.z,j*T,j*T+T);let dx=o.x-nx,dz2=o.z-nz;const d2=dx*dx+dz2*dz2;
  if(d2<r*r){if(d2>1e-8){const d=Math.sqrt(d2);o.x+=dx/d*(r-d);o.z+=dz2/d*(r-d)}else{const cx=i*T+T/2,cz=j*T+T/2;dx=o.x-cx;dz2=o.z-cz;if(Math.abs(dx)>Math.abs(dz2))o.x=dx>0?i*T+T+r:i*T-r;else o.z=dz2>0?j*T+T+r:j*T-r}}}}
function bfs(dist,srcs){const W=G.W,H=G.H,g=G.g,q=G.q;dist.fill(65535);let h=0,t=0;
 for(const p of srcs){const i=Math.floor(p.x/T),j=Math.floor(p.z/T),k=j*W+i;if(i>=0&&j>=0&&i<W&&j<H&&dist[k]!==0){dist[k]=0;q[t++]=k}}
 while(h<t){const k=q[h++],d=dist[k]+1,i=k%W,j=(k/W)|0;if(i>0&&g[k-1]===0&&dist[k-1]>d){dist[k-1]=d;q[t++]=k-1}if(i<W-1&&g[k+1]===0&&dist[k+1]>d){dist[k+1]=d;q[t++]=k+1}if(j>0&&g[k-W]===0&&dist[k-W]>d){dist[k-W]=d;q[t++]=k-W}if(j<H-1&&g[k+W]===0&&dist[k+W]>d){dist[k+W]=d;q[t++]=k+W}}}
function computeFlow(){bfs(G.dist,players.filter(p=>p.alive));bfs(G.hdist,players.filter(p=>!p.ai&&p.alive))}
function buildBuckets(){G.head.fill(-1);const E=G.enemies;for(let k=0;k<E.length&&k<G.nxt.length;k++){const e=E[k];if(e.dead)continue;const i=Math.floor(e.x/T),j=Math.floor(e.z/T);if(i<0||j<0||i>=G.W||j>=G.H)continue;const id=j*G.W+i;G.nxt[k]=G.head[id];G.head[id]=k}}
function nearest(e){let best=null,bd=1e9;for(const p of players){if(!p.alive)continue;const d=(p.x-e.x)**2+(p.z-e.z)**2;if(d<bd){bd=d;best=p}}return best?{p:best,d:Math.sqrt(bd)}:null}
function los(x0,z0,x1,z1){const d=Math.hypot(x1-x0,z1-z0),n=Math.ceil(d/1.2);for(let k=1;k<n;k++){const x=x0+(x1-x0)*k/n,z=z0+(z1-z0)*k/n;if(blk(Math.floor(x/T),Math.floor(z/T)))return false}return true}
function burst(x,y,z,col,n,sp){if(G.net==='host'&&n>=8&&G.fxq.length<14)G.fxq.push([0,Math.round(x*4),Math.round(y*4),Math.round(z*4),col,n]);for(let k=0;k<n&&G.parts.length<1300;k++){const a=Math.random()*TAU,s=rf(1,sp||5);G.parts.push({x,y,z,vx:Math.cos(a)*s,vy:rf(1,5),vz:Math.sin(a)*s,life:rf(.35,.9),c:col,g:k%2===0})}}
function spark(x,y,z,col,life){if(G.parts.length<1300)G.parts.push({x,y,z,vx:rf(-.3,.3),vy:rf(.2,1),vz:rf(-.3,.3),life:life||.3,c:col,g:true,ng:true})}
function ring(x,z,r,col){if(G.net==='host'&&G.fxq.length<14)G.fxq.push([1,Math.round(x*4),0,Math.round(z*4),col,Math.round(r)]);const m=new THREE.Mesh(new THREE.RingGeometry(.8,1,64),ADD({color:col,opacity:.9,side:THREE.DoubleSide}));m.rotation.x=-PI/2;m.position.set(x,.15,z);scene.add(m);G.fx.push({m,t:0,dur:.45,r})}
function openDoor(k,p,useKey){const W=G.W,st=[k];G.g[k]=0;while(st.length){const c=st.pop();const m=G.doorMesh.get(c);if(m){G.lg.remove(m);G.doorMesh.delete(c);burst(m.position.x,1.5,m.position.z,0x8a6040,12,4)}for(const d of [1,-1,W,-W]){const n=c+d;if(n>=0&&n<W*G.H&&G.g[n]===2){G.g[n]=0;st.push(n)}}}if(useKey&&p)p.keys--;sfx('door');if(p)pmsg(p,useKey?'Door unlocked':'Door smashed open');drawMapBase();G.flowT=0}
function hitTile(k,dmg,p,x,z){const v=G.g[k];if(v===2){const hp=(G.doorHp.get(k)||6)-dmg;G.doorHp.set(k,hp);burst(x,1.4,z,0x8a6040,4,3);sfx('wood');if(hp<=0)openDoor(k,p,false)}
 else if(v===3){const c=G.crack.get(k);if(!c)return;const wb=c.web;c.hp-=dmg;burst(x,1.6,z,wb?0xe4e4ec:0x8a7a68,5,3);sfx(wb?'wood':'thud');if(c.hp<=0){G.g[k]=0;G.lg.remove(c.mesh);G.crack.delete(k);const cx=(k%G.W)*T+T/2,cz=Math.floor(k/G.W)*T+T/2;burst(cx,2,cz,wb?0xe8e8f0:0x8a7a68,wb?26:40,wb?4:7);sfx(wb?'wood':'crumble');if(p)pmsg(p,wb?'Web torn away!':'Wall broken!');drawMapBase();G.flowT=0}}}
function breakAround(x,z,R,dmg,p){const i0=Math.floor((x-R)/T),i1=Math.floor((x+R)/T),j0=Math.floor((z-R)/T),j1=Math.floor((z+R)/T);for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){if(i<0||j<0||i>=G.W||j>=G.H)continue;const k=j*G.W+i,v=G.g[k];if((v===2||v===3)&&Math.hypot(i*T+T/2-x,j*T+T/2-z)<R+2)hitTile(k,dmg,p,i*T+T/2,j*T+T/2)}}

// ---------- combat
function hurtEnemy(e,dmg,p,kx,kz,stun){if(e.dead)return;const D0=EDEF[e.type];if(D0.death){sfx('clang');burst(e.x,1.5,e.z,0xc0c0c0,3,2);return}if(e.hidden)return;
 if(D0.boss){if(p)dmg*=BOSSMUL[p.hero]||1;kx=undefined;stun=0}
 if(e.stone&&e.frz>0){burst(e.x,1.2,e.z,0x9a9a9a,14,5);killEnemy(e,p);return}
 if(p&&p.stone&&!D0.boss&&!D0.egg&&Math.random()<.12*p.stone){e.frz=4;e.stone=1;burst(e.x,1.2,e.z,0xb0b0b0,8,3);return}if(p&&p.buff==='might'&&p.buffT>0)dmg*=2;e.hp-=dmg;e.flash=.12;if(kx!==undefined){e.kx=kx;e.kz=kz}if(stun)e.stun=Math.max(e.stun,stun);sfx('hit');if(e.hp<=0)killEnemy(e,p)}
function killEnemy(e,p){if(e.dead)return;e.dead=true;const D0=EDEF[e.type];if(D0.egg)tsRemain(e.x,e.z,'egg_smashed');if(D0.boss)bossDown(e);burst(e.x,1.2,e.z,D0.burst,12,5);sfx('kill');
 if(p){p.score+=D0.pts;p.kills++;gainPower(p,D0.death?20:1);if(D0.death)pmsg(p,'Death destroyed! +1000')}for(const w of players)if(w.hero==='wizard'&&w.alive)w.mana=Math.min(100,w.mana+(w===p?4:1));
 // killing Death silences the whole level: every monster on the map falls at once, and generators only wake again if you walk right up to them
 if(D0.death&&p&&!G.deathCalm){G.deathCalm=true;for(const o of G.enemies)if(!o.dead){o.dead=true;burst(o.x,1.2,o.z,EDEF[o.type].burst,6,4)}G.flash=1;sfx('potion');
  banner('Death is destroyed!','Every monster falls. Stay clear of the generators and the way to the exit is quiet',3.5);for(const q of humans())rumble(q,500,1)}}
function hurtGen(gn,d,p){if(gn.dead)return;gn.hp-=d;burst(gn.x,.8,gn.z,0xc8b8a0,4);if(gn.hp<=0){gn.dead=true;G.lg.remove(gn.mesh);burst(gn.x,.8,gn.z,0xe8e0c8,30,7);sfx('gen');if(p){p.score+=50;gainPower(p,3)}G.gensKilled=(G.gensKilled||0)+1;if((G.level===1&&!G.saidStrength)||G.gensKilled%3===0){G.saidStrength=true;voice('strength')}/* level 1's first generator, then every third one */G.gens=G.gens.filter(g=>!g.dead);drawMapBase()}}
function openChest(c,p){if(c.open)return;c.open=true;if(p&&p.local)rumble(p,70,.35);G.lg.remove(c.mesh);burst(c.x,.6,c.z,0xd0a040,16);G.chests=G.chests.filter(x=>!x.open);const r=Math.random();
 if(r<.06&&!G.treasure&&!G.lair){for(let k=0;k<6;k++)spawnEnemy('ghost',c.x+rf(-2,2),c.z+rf(-2,2));if(p)pmsg(p,'A trap! Ghosts burst out');sfx('hurt');return}
 const t=r<.45?'treasure':r<.68?'food':r<.78?'potion':r<.9?'charm':'key';addItem(t,c.x,c.z);if(r<.3)addItem('treasure',c.x+rf(-.5,.5),c.z+rf(-.5,.5));sfx('gold')}
function hurtPlayer(p,amt){if(!p.alive||G.transT>0||G.over)return;if(p.buff==='ward'&&p.buffT>0)return;amt*=G.dmgScale;p.lastHit=G.time;p.hurt=Math.min(1,p.hurt+.45);
 if(p.shield>0){const s=Math.min(p.shield,amt);p.shield-=s;amt-=s}
 if(amt>0){p.hp-=amt;sfx('hurt');rumble(p,110,clamp(amt/25,.25,1))}if(p.hp<=0){if(p.pouch>0){p.pouch--;p.hp=150;pmsg(p,'Saved by stored food!');sfx('food');return}p.hp=0;p.alive=false;p.body.root.visible=false;if(p.bubble)p.bubble.visible=false;burst(p.x,1,p.z,0xff2020,30,6);say(p.H.name+' has fallen',true);pmsg(p,'');rumble(p,500,1)}}
const fwd=p=>({x:-Math.sin(p.yaw),z:-Math.cos(p.yaw)});
const XR={c:[],left:null,right:null,hud:null};
function assistDir(p,dx,dz){let best=null,bd=.32;for(const e of G.enemies){if(e.dead||e.hidden)continue;const ex=e.x-p.x,ez=e.z-p.z,d=Math.hypot(ex,ez);if(d>20||d<.5)continue;const a=Math.acos(clamp((ex*dx+ez*dz)/d,-1,1));if(a<bd&&los(p.x,p.z,e.x,e.z)){bd=a;best=[ex/d,ez/d]}}return best}
function aim(p){const a=aim0(p);a.dy=p.aim3d?(a.dy!==undefined?a.dy:Math.sin(clamp(p.net?(p.aimPitch||0):p.pitch,-1.3,1.3))):0;return a}
function aim0(p){if(p.net){const y=p.aimYaw!==undefined?p.aimYaw:p.yaw;let dx=-Math.sin(y),dz=-Math.cos(y);if(p.assist){const a=assistDir(p,dx,dz);if(a){dx=a[0];dz=a[1]}}const w=p.hero==='wizard'?.38:0;return{dx,dz,ox:p.x+dx*.5-dz*w,oy:p.H.eye-(w?.55:.4),oz:p.z+dz*.5+dx*w}}
 if(p.i===0&&p.local&&renderer.xr.isPresenting&&vrHandAim(p)&&VRART.on&&XR.right){vrAimVec(p,_v);const vy=_v.lengthSq()>1e-6?_v.y/_v.length():0;_v.y=0;if(_v.lengthSq()>1e-4){_v.normalize();vrAimPos(p,_v2);const o=handShot(p);o.dy=vy;return o}}
 if(p.local&&(p.ctrl==='touch'||(p.ctrl&&p.ctrl.startsWith('gp')))){const f=fwd(p),a=assistDir(p,f.x,f.z);if(a)return{dx:a[0],dz:a[1],ox:p.x+a[0]*.5,oy:p.H.eye-.4,oz:p.z+a[1]*.5}}
 if(p.i===0&&p.local&&renderer.xr.isPresenting&&XR.right&&!VRART.on){XR.right.getWorldQuaternion(_q);_v.set(0,0,-1).applyQuaternion(_q);const vy=_v.y;_v.y=0;if(_v.lengthSq()>1e-4){_v.normalize();XR.right.getWorldPosition(_v2);const o=handShot(p);o.dy=vy;return o}}
 const f=fwd(p);if(p.hero==='wizard')return{dx:f.x,dz:f.z,ox:p.x+f.x*.5-f.z*.38,oy:p.H.eye-.55,oz:p.z+f.z*.5+f.x*.38};return{dx:f.x,dz:f.z,ox:p.x+f.x*.5,oy:p.H.eye-.4,oz:p.z+f.z*.5}}
// VR: shots leave from your hand itself (unless the hand is poking into a wall)
function handShot(p){let ox=_v2.x+_v.x*.12,oz=_v2.z+_v.z*.12;if(blockedAt(ox,oz,.15)){ox=p.x+_v.x*.5;oz=p.z+_v.z*.5}return{dx:_v.x,dz:_v.z,ox,oy:clamp(_v2.y,.6,2),oz}}
function shoot(p,kind,ang,o){const a=aim(p),c=Math.cos(ang),s=Math.sin(ang),dy=clamp(a.dy||0,-.97,.97),hz=Math.sqrt(1-dy*dy),dx=(a.dx*c-a.dz*s)*hz,dz2=(a.dx*s+a.dz*c)*hz;G.proj.push(Object.assign({kind,x:a.ox,y:a.oy,z:a.oz,vx:dx*o.speed,vz:dz2*o.speed,vy:dy*o.speed,owner:p,hit:null,spin:Math.random()*6,tint:p.H.tint[p.tier-1],glow:p.H.glow[p.tier-1],tier:p.tier},o))}
function fire(p){const t=p.tier,haste=p.buff==='haste'&&p.buffT>0?.62:1;
 if(p.hero==='barbarian'){const o={speed:17+t*2,dmg:7+t*3,pierce:t,life:1.6+t*.15,r:.75+t*.08,knock:9,stun:.7,scale:1+t*.1};shoot(p,'axe',0,o);if(t>=5){shoot(p,'axe',.12,Object.assign({},o));shoot(p,'axe',-.12,Object.assign({},o))}p.cool=p.H.rate*haste;sfx('axe')}
 else if(p.hero==='elf'){const n=[1,1,2,3,5][t-1];for(let k=0;k<n;k++)shoot(p,'arrow',(k-(n-1)/2)*.09,{speed:46,dmg:1.3+t*.4,pierce:t>=4?1:0,life:.9,r:.5,knock:2,scale:1});p.cool=Math.max(.09,p.H.rate-.012*t)*haste;p.draw=0;sfx('arrow')}
 else if(p.hero==='wizard'){if(p.mana<2){pmsg(p,'Out of magic: swing the staff to win it back');p.cool=.5;return}p.mana-=2;const n=[1,2,3,3,5][t-1],pi=[0,0,1,3,4][t-1];for(let k=0;k<n;k++)shoot(p,'bolt',(k-(n-1)/2)*.07,{speed:36,dmg:1.6+t*.45,pierce:pi,life:.9,r:.5+t*.05,knock:1.5,scale:1+t*.15});p.cool=p.H.rate*haste;sfx('magic')}
 else{const n=t>=5?3:t>=3?2:1,spd=22+t*5;for(let k=0;k<n;k++)shoot(p,'knife',(k-(n-1)/2)*.08,{speed:spd,dmg:2+t*.6,pierce:t>=4?1:0,life:(16+t*7)/spd,r:.55,knock:3,scale:1});p.cool=Math.max(.14,.32-t*.035)*haste;sfx('knife')}
 p.anim=1}
// every hero can dash: Elf farthest, Valkyrie a little less, Barbarian a little less again; the Wizard blinks the Valkyrie's distance
const DASHK={elf:1,valkyrie:.9,barbarian:.8,wizard:.9};
function blockedAt(x,z,r){for(const [ox,oz] of [[-r,-r],[r,-r],[-r,r],[r,r],[0,0]]){const i=Math.floor((x+ox)/T),j=Math.floor((z+oz)/T);if(i<0||j<0||i>=G.W||j>=G.H||G.g[j*G.W+i]!==0)return true}return false}
const growth=()=>.25+.05*Math.max(0,((G&&G.level)||1)-1);
function shieldBase(p){return p.hero==='elf'?220:110}
function applyGrowth(p,fresh){const old=p.max||0,g=growth();p.max=Math.round(p.H.hp*g);p.smax=Math.round(shieldBase(p)*g);if(fresh||!old){p.hp=p.max;p.shield=p.smax}else{p.hp=Math.min(p.max,p.hp+Math.max(0,p.max-old));p.shield=Math.min(p.smax,p.shield||0)}}
function doDash(p){if(!p.alive||(p.cdD||0)>0||p.dash>0)return;const m=Math.hypot(p.mvx||0,p.mvz||0),f=fwd(p);let dx=m>.1?p.mvx/m:f.x,dz=m>.1?p.mvz/m:f.z;
 if(p.hero==='wizard'){const D=.22*28*DASHK.wizard,r=p.H.rad;let d=0;while(d+.2<=D&&!blockedAt(p.x+dx*(d+.2),p.z+dz*(d+.2),r))d+=.2;
  if(d<.6){pmsg(p,'No room to blink');return}burst(p.x,1.2,p.z,0xb39cff,28,4);ring(p.x,p.z,1.4,0xb39cff);p.x+=dx*d;p.z+=dz*d;burst(p.x,1.2,p.z,0xd0c0ff,28,4);ring(p.x,p.z,1.4,0xd0c0ff);sfx('magic');p.cdD=2.4;rumble(p,60,.3);return}
 p.dx=dx;p.dz=dz;p.dash=.22;p.dashSp=28*DASHK[p.hero];sfx('dash');p.cdD=p.hero==='elf'?1.8:2.4;rumble(p,60,.3)}
function ability1(p){if(p.cd1>0)return;const H=p.H;
 if(p.hero==='barbarian'){const R=6.5+p.tier*.7;for(const e of G.enemies)if(!e.dead&&Math.hypot(e.x-p.x,e.z-p.z)<R){if(EDEF[e.type].boss)hurtEnemy(e,e.max*.025/(BOSSMUL[p.hero]||1),p);else killEnemy(e,p)}for(const g of G.gens.slice())if(Math.hypot(g.x-p.x,g.z-p.z)<R)hurtGen(g,10,p);for(const c of G.chests.slice())if(Math.hypot(c.x-p.x,c.z-p.z)<R)openChest(c,p);breakAround(p.x,p.z,R*.6,99,p);ring(p.x,p.z,R,0xffb060);burst(p.x,.3,p.z,0xa08060,40,9);p.shake=.5;p.anim2=1;sfx('slam');rumble(p,350,1)}
 else if(p.hero==='elf'){const m=Math.hypot(p.mvx,p.mvz);const f=fwd(p);p.dx=m>.1?p.mvx/m:f.x;p.dz=m>.1?p.mvz/m:f.z;p.dash=.22;p.dashSp=28;sfx('dash')}
 else if(p.hero==='wizard'){if(p.mana<25){pmsg(p,'Need 25 magic to heal');return}p.mana-=25;for(const q of players){if(!q.alive||Math.hypot(q.x-p.x,q.z-p.z)>9)continue;q.hp=Math.min(q.max,q.hp+Math.max(60,Math.round(180*growth())));burst(q.x,1.2,q.z,0x60ff90,24,3);if(q!==p)pmsg(q,'Healed by the Wizard')}pmsg(p,'Heal!');sfx('heal');p.healAt=performance.now()}
 else{for(let k=0;k<16;k++)shoot(p,'knife',k/16*TAU,{speed:24+p.tier*4,dmg:2.5+p.tier*.6,pierce:1,life:.9,r:.55,knock:4,scale:1});p.anim=1;sfx('knife')}
 p.cd1=H.a1cd}
function ability2(p){if(p.hero!=='wizard'||p.cd2>0)return;p.cd2=.5;p.anim2=1;p.staffAt=performance.now();sfx('swing');const f=fwd(p),dmg=2.5+p.tier*.6;
 {const t=p.tier,R=4.3+t*.55,maxHit=1+t,wave=2+t*1.3,kb=7+t*2.5,hits=[];
  for(const e of G.enemies){if(e.dead||e.hidden)continue;const dx=e.x-p.x,dz2=e.z-p.z,d=Math.hypot(dx,dz2);if(d>0&&d<R&&(dx*f.x+dz2*f.z)/d>(t>=4?.05:.3))hits.push([d,e,dx,dz2])}
  hits.sort((a,b)=>a[0]-b[0]);for(const [d,e,dx,dz2] of hits.slice(0,maxHit))hurtEnemy(e,d<3.4?dmg+wave:wave,p,dx/d*kb,dz2/d*kb,.5+t*.1);
  const cx=p.x+f.x*2.4,cz=p.z+f.z*2.4;ring(cx,cz,1.2+t*.35,t>=3?0xb39cff:0x9fd8ff);burst(cx,.3,cz,t>=3?0xb39cff:0xbfe8ff,14+t*6,3+t);p.shake=Math.max(p.shake,.15+t*.04);rumble(p,90,.3+t*.1)}
 for(const g of G.gens.slice())if(Math.hypot(g.x-p.x,g.z-p.z)<3.6)hurtGen(g,dmg,p);for(const c of G.chests.slice())if(Math.hypot(c.x-p.x,c.z-p.z)<3)openChest(c,p);breakAround(p.x+f.x*2,p.z+f.z*2,1,dmg,p)}
function blast(p,x,z,R){for(const e of G.enemies)if(!e.dead&&Math.hypot(e.x-x,e.z-z)<R){if(EDEF[e.type].boss)hurtEnemy(e,e.max*.04/(BOSSMUL[p.hero]||1),p);else killEnemy(e,p)}for(const g of G.gens.slice())if(Math.hypot(g.x-x,g.z-z)<R)hurtGen(g,10,p);ring(x,z,R,0x80a0ff);burst(x,1,z,0x80a0ff,40,8)}
function usePotion(p){if(p.potions<=0){pmsg(p,'No potions');return}p.potions--;blast(p,p.x,p.z,20);G.flash=1;sfx('potion');rumble(p,400,.8);
 // stronger potions as the dungeon gets deeper: monsters near you and your fellowship freeze in time (wherever they are), generators stall, flood water stops rising
 const fz=Math.min(4+G.level*.25,12),near=players.filter(q=>q.alive);let n=0;
 for(const e of G.enemies)if(!e.dead&&near.some(q=>Math.hypot(e.x-q.x,e.z-q.z)<30)){e.frz=EDEF[e.type].boss?2:Math.max(e.frz||0,fz);n++}G.genFrz=Math.max(G.genFrz||0,fz);
 let msg='Time freezes for '+Math.round(fz)+'s!';if(G.flood){const wf=Math.min(8+G.level*.3,20);G.flood.frz=Math.max(G.flood.frz||0,wf);msg+=' The water stops for '+Math.round(wf)+'s'}
 for(const q of humans())pmsg(q,msg);ring(p.x,p.z,30,0xbfeaff)}
function eat(p){if(p.pouch<=0){pmsg(p,'No stored food');return}if(p.hp>=p.max){pmsg(p,'Health is full');return}const fh=Math.max(50,Math.round(150*growth()));p.pouch--;p.hp=Math.min(p.max,p.hp+fh);pmsg(p,'Ate stored food: +'+fh);sfx('food')}

// ---------- updates
function updatePlayer(p,dt){
 const H=p.H;if(p.msgT>0){p.msgT-=dt;if(p.msgT<=0&&p.el)p.el.msg.style.opacity=0}
 p.hurt=Math.max(0,p.hurt-dt*1.8);p.anim=Math.max(0,p.anim-dt*4);p.anim2=Math.max(0,p.anim2-dt*3.2);p.shake=Math.max(0,p.shake-dt);p.draw=Math.min(1,p.draw+dt/(H.rate*.75));
 const vr=p.i===0&&!p.ai&&renderer.xr.isPresenting;iceTick(p,dt);
 if(!p.alive){syncPlayer(p,vr,dt);return}
 const client=G.net==='client';let inp;
 if(p.net){const m=p.netMe||{};inp={mx:0,mz:0,lx:0,ly:0,fire:!!m.f,a1:false,a2:false,pot:false,eat:false};if((m.fc|0)>(p.nc.fc|0)){p.fireLatch=true;p.nc.fc=m.fc|0}if(p.fireLatch&&p.cool<=0){inp.fire=true;p.fireLatch=false}
  for(const [k,f] of [['a1','a1'],['a2','a2'],['pt','pot'],['ea','eat']]){const v=m[k]|0;if(v>p.nc[k]){inp[f]=true}p.nc[k]=v}if(p.pfz>0)icy(inp);if(inMarket(p))calm(inp);p.aimPitch=typeof m.ap==='number'?clamp(m.ap,-1.3,1.3):0;
  if(m.s===G.seed&&typeof m.x==='number'){p.x=clamp(m.x,0,G.W*T);p.z=clamp(m.z,0,G.H*T);p.yaw=+m.y||0;p.aimYaw=typeof m.ay==='number'?m.ay:p.yaw;p.moving=m.mv?1:0;p.assist=!!m.as}else if(p.spawn){p.x=p.spawn.x;p.z=p.spawn.z}}
 else{inp=readInput(p,dt);if(p.pfz>0)icy(inp);if(inMarket(p))calm(inp);if(inp.dash)doDash(p);p.yaw-=inp.lx;p.pitch=clamp(p.pitch-inp.ly,-1.2,1.2);p.sway+=(clamp(inp.lx*6,-.25,.25)-p.sway)*Math.min(1,dt*10)}
 p.cool-=dt;p.cd1-=dt;p.cd2-=dt;p.cdD=(p.cdD||0)-dt;if(p.buffT>0){p.buffT-=dt;if(p.buffT<=0){p.buff=null;if(p.charms>0&&!client&&p.alive){p.charms--;useCharm(p)}}}
 if(!p.net){
 let fx,fz;if(vr){p.cam.getWorldDirection(_v);_v.y=0;if(_v.lengthSq()<1e-4)_v.set(0,0,-1);_v.normalize();fx=_v.x;fz=_v.z}else{const f=fwd(p);fx=f.x;fz=f.z}
 const rx=-fz,rz=fx;let mx=fx*inp.mz+rx*inp.mx,mz=fz*inp.mz+rz*inp.mx;const ml=Math.hypot(mx,mz);if(ml>1){mx/=ml;mz/=ml}p.mvx=mx;p.mvz=mz;p.moving+=((ml>.1?1:0)-p.moving)*Math.min(1,dt*8);
 const sp=H.speed*(p.buff==='haste'&&p.buffT>0?1.45:1)*(p.blessT>0?1.3:1)*floodSlow()*(G.wet&&wetAt(p.x,p.z)?.82:1);let vx=mx*sp,vz=mz*sp;
 if(p.dash>0){p.dash-=dt;vx=p.dx*(p.dashSp||28);vz=p.dz*(p.dashSp||28);spark(p.x,1,p.z,0x9fffa0,.3)}
 const steps=Math.max(1,Math.ceil(Math.hypot(vx,vz)*dt/.35));
 for(let s=0;s<steps;s++){p.x+=vx*dt/steps;p.z+=vz*dt/steps;
  if(p.keys>0&&!client){const r=H.rad+.2,i0=Math.floor((p.x-r)/T),i1=Math.floor((p.x+r)/T),j0=Math.floor((p.z-r)/T),j1=Math.floor((p.z+r)/T);for(let j=j0;j<=j1&&p.keys>0;j++)for(let i=i0;i<=i1&&p.keys>0;i++)if(i>=0&&j>=0&&i<G.W&&j<G.H&&G.g[j*G.W+i]===2)openDoor(j*G.W+i,p,true)}
  collide(p,H.rad)}
 for(const g of G.gens){const dx=p.x-g.x,dz2=p.z-g.z,d=Math.hypot(dx,dz2),m=H.rad+1.05;if(d<m&&d>1e-4){p.x=g.x+dx/d*m;p.z=g.z+dz2/d*m}}
 if(ml>.1)p.bob+=dt*sp*2.2;}
 if(client){clientLocal(p,inp,dt);syncPlayer(p,vr,dt);return}
 if(inp.fire&&p.cool<=0)fire(p);if(inp.a1)ability1(p);if(inp.a2)ability2(p);if(inp.pot)usePotion(p);if(inp.eat)eat(p);
 if(G.time-p.lastHit>(H.sec==='shield'?2.5:3.5))p.shield=Math.min(p.smax,p.shield+p.smax*(H.sec==='shield'?.16:.1)*dt);
 if(H.sec==='shield'){if(G.time-p.lastHit>4)p.hp=Math.min(p.max,p.hp+4*growth()*dt)}
 else if(G.transT<=0&&!inMarket(p))p.hp-=1.5*clamp(p.max/H.hp,.5,1)*dt;
 if(p.hp<p.max*.2&&p.pouch>0&&!p.ai){eat(p)}
 if(p.net&&p.dash>0)p.dash-=dt;
 if(p.hp<=0){p.hp=1;hurtPlayer(p,999)}
 if(p.local){if(p.hp<p.max*.1&&G.time>p.nextDie){p.nextDie=G.time+20;p.nextWarn=G.time+10;say(H.name+' is about to die!',true)}
  else if(p.hp<p.max*.25&&G.time>p.nextWarn){p.nextWarn=G.time+25;say(H.name+' needs food, badly!',true)}}
 // pickups, pulled toward you when close
 for(const it of G.items){if(it.gone)continue;let dx=p.x-it.x,dz2=p.z-it.z;const d=Math.hypot(dx,dz2);
  if(d<3.2&&d>.05&&!(it.type==='potion'&&p.potions>=potCap(p))){const pull=Math.min(d,7*dt);it.x+=dx/d*pull;it.z+=dz2/d*pull;it.mesh.position.x=it.x;it.mesh.position.z=it.z}
  if(d>1.25)continue;
  if(it.type==='food'){if(p.hp>=p.max-Math.max(15,p.max*.12)&&p.pouch<foodCap(p)){p.pouch++;pmsg(p,`Food stored for later (${p.pouch}/${capTxt(foodCap(p))})`)}else{const fh=Math.max(50,Math.round(150*growth()));p.hp=Math.min(p.max,p.hp+fh);pmsg(p,'Food: +'+fh+' health')}sfx('food')}
  else if(it.type==='potion'){if(p.potions>=potCap(p))continue;p.potions++;pmsg(p,'Potion');sfx('key')}
  else if(it.type==='charm'){if(p.buffT>0&&(p.charms|0)<charmCap(p)){p.charms=(p.charms|0)+1;pmsg(p,`Charm saved: it starts when this one ends (${p.charms}/${capTxt(charmCap(p))})`);sfx('key')}else useCharm(p)}
  else if(it.type==='key'){p.keys++;pmsg(p,'Key: walk into a door');sfx('key')}
  else{p.score+=100;if(G.treasure)p.tgold+=100;sfx('gold');burst(it.x,.6,it.z,0xffd24a,10,3)}
  it.gone=true;G.lg.remove(it.mesh);if(p.local)rumble(p,40,.22)}
 for(const c of G.chests.slice())if(Math.hypot(c.x-p.x,c.z-p.z)<H.rad+.75)openChest(c,p);
 if(!p.ai&&G.transT<=0&&!G.exitLocked&&Math.hypot(p.x-G.exit.x,p.z-G.exit.z)<1.7)exitReached();
 syncPlayer(p,vr,dt);
}
function syncPlayer(p,vr,dt){p.dolly.position.set(p.x,0,p.z);p.dolly.rotation.y=p.yaw;
 if(!vr&&p.local){p.cam.rotation.x=p.pitch;const sh=p.shake*(SAFE.on?.06:.25);p.cam.position.set(rf(-sh,sh),p.H.eye+Math.sin(p.bob)*.05+rf(-sh,sh),0);const f=p.dash>0?88:75;if(Math.abs(p.cam.fov-f)>.1){p.cam.fov+=(f-p.cam.fov)*Math.min(1,dt*12);p.cam.updateProjectionMatrix()}p.vm.root.rotation.y=p.sway;p.vm.root.position.x=Math.sin(p.bob*.5)*.012}
 if(p.local){p.vm.update(p,G.time);p.vm.root.visible=vr||!FP_OK}
 const b=p.body;b.root.position.set(p.x,Math.abs(Math.sin(G.time*8))*.04*p.moving,p.z);b.model.rotation.y=p.yaw+PI;b.anim(p.moving,G.time,p.anim);
 const fl=1+Math.sin(G.time*13+p.i)*.05+Math.sin(G.time*29)*.04;p.light.position.set(p.x+Math.sin(p.yaw+.8)*.3,2.6,p.z+Math.cos(p.yaw+.8)*.3);p.light.intensity=(p.alive?(p.local?1.15:.7):.3)*fl;
 if(p.bubble){p.bubble.position.set(p.x,0,p.z);p.bubble.visible=p.alive}
 if(vr)p.vm.root.visible=!VRART.on;
 if(vr&&XR.right&&p.vm.root.parent!==XR.right){XR.right.add(p.vm.root);p.vm.root.position.set(-p.vm.hand[0],-p.vm.hand[1],-p.vm.hand[2]);setLayer(p.vm.root,0)}}
function spawnFromGens(dt){if(G.transT>0)return;if(G.genFrz>0){G.genFrz-=dt;return}for(const g of G.gens){g.t-=dt;if(Math.random()<dt*4)G.parts.push({x:g.x+rf(-.4,.4),y:.7,z:g.z+rf(-.4,.4),vx:0,vy:rf(1,2.5),vz:0,life:rf(.5,1),c:EDEF[g.type].gen,g:true,ng:true});
 if(g.t>0)continue;g.t=g.rate*rf(.7,1.3);if(G.enemies.length>=G.cap)continue;const n=nearest(g);if(!n||n.d>(G.deathCalm?9:42))continue;const a=Math.random()*TAU;spawnEnemy(g.type,g.x+Math.cos(a)*1.5,g.z+Math.sin(a)*1.5)}}
function updateEnemies(dt){const W=G.W,E=G.enemies,wiz=players.filter(p=>p.hero==='wizard'&&p.alive),kd=Math.pow(.02,dt);
 for(let k=0;k<E.length;k++){const e=E[k];if(e.dead)continue;const D0=EDEF[e.type];if(D0.boss){bossAI(e,dt);continue}if(D0.egg){eggAI(e,dt);continue}if(e.frz>0){e.frz-=dt;if(e.frz<=0)e.stone=0;continue}e.atk-=dt;e.stun-=dt;e.flash-=dt;
  if(e.kx||e.kz){e.x+=e.kx*dt;e.z+=e.kz*dt;e.kx*=kd;e.kz*=kd;if(Math.abs(e.kx)+Math.abs(e.kz)<.1)e.kx=e.kz=0}
  if(D0.water&&waterAI(e,dt))continue;
  if(D0.blink){e.blink-=dt;if(e.blink<=0){e.hidden=!e.hidden;e.blink=e.hidden?rf(1,1.6):rf(1.8,2.8);burst(e.x,1.4,e.z,0xc070ff,8,2)}}
  const n=nearest(e);const ox=e.x,oz=e.z;
  if(n&&e.stun<=0){let tx=n.p.x,tz=n.p.z,flee=false;
   if(D0.lob&&n.d<7)flee=true;
   if(!flee&&!(D0.lob&&n.d<11&&los(e.x,e.z,n.p.x,n.p.z))){const ti=Math.floor(e.x/T),tj=Math.floor(e.z/T),id=tj*W+ti,d0=(ti>=0&&tj>=0&&ti<W&&tj<G.H)?G.dist[id]:65535;
    if(d0>1&&d0<65535){let best=d0,bi=-1,bj=-1;for(const [a,b] of N8){const ni=ti+a,nj=tj+b;if(blk(ni,nj))continue;if(a&&b&&(blk(ti+a,tj)||blk(ti,tj+b)))continue;const v=G.dist[nj*W+ni];if(v<best){best=v;bi=ni;bj=nj}}if(bi>=0){tx=bi*T+T/2+rf(-.8,.8);tz=bj*T+T/2+rf(-.8,.8)}}
    else if(d0===65535){tx=e.x;tz=e.z}}
   else if(!flee){tx=e.x;tz=e.z}
   let dx=tx-e.x,dz2=tz-e.z;if(flee){dx=e.x-n.p.x;dz2=e.z-n.p.z}const dl=Math.hypot(dx,dz2);
   if(dl>.05){const s=D0.speed*G.spd*(e.hidden?1.4:1)*(G.flood&&G.flood.h>.4?(e.type==='naga'?1.6:D0.water?1:.85):1)*dt;e.x+=dx/dl*s;e.z+=dz2/dl*s}
   const fx=n.p.x-e.x,fz=n.p.z-e.z;e.rot=Math.atan2(flee||dl<.05?fx:dx,flee||dl<.05?fz:dz2);
   if(D0.shoots&&(e.fire-=dt)<=0){e.fire=rf(1.8,3.2);if(n.d<18&&los(e.x,e.z,n.p.x,n.p.z)){const l=Math.hypot(fx,fz)||1;G.eproj.push({x:e.x+fx/l*.6,y:1.5,z:e.z+fz/l*.6,vx:fx/l*13,vz:fz/l*13,life:2.2});sfx('fireball')}}
   if(D0.lob&&(e.fire-=dt)<=0){e.fire=rf(2,3.2);if(n.d<16){const tt=1.1,vy=14*tt/2;G.rocks.push({x:e.x,y:1.4,z:e.z,vx:(n.p.x-e.x)/tt,vy,vz:(n.p.z-e.z)/tt,spin:0});sfx('lob')}}}
  const i=Math.floor(e.x/T),j=Math.floor(e.z/T);if(i>=0&&j>=0&&i<W&&j<G.H){for(let o=G.head[j*W+i];o>=0;o=G.nxt[o]){if(o===k)continue;const f=E[o];if(!f||f.dead)continue;const dx=e.x-f.x,dz2=e.z-f.z,d2=dx*dx+dz2*dz2;if(d2<.72&&d2>1e-6){const d=Math.sqrt(d2),pu=(.85-d)*.5;e.x+=dx/d*pu;e.z+=dz2/d*pu}}}
  collide(e,D0.r);
  if(G.wet&&e.type==='spiderling'&&wetAt(e.x,e.z)&&!wetAt(ox,oz)){e.x=ox;e.z=oz}
  if(!e.pass&&!D0.death)for(const w of wiz){const dx=e.x-w.x,dz2=e.z-w.z,d=Math.hypot(dx,dz2);if(d<3.6&&d>1e-4){e.x=w.x+dx/d*3.6;e.z=w.z+dz2/d*3.6;collide(e,D0.r)}}
  e.moving+=((Math.hypot(e.x-ox,e.z-oz)>dt*.5?1:0)-e.moving)*Math.min(1,dt*8);
  if(!(D0.water&&(e.hidden||G.time-(e.riseAt||-9)<1)))for(const p of players){if(!p.alive)continue;if(G.wet&&e.type==='spiderling'&&wetAt(p.x,p.z))continue;const dx=e.x-p.x,dz2=e.z-p.z,d=Math.hypot(dx,dz2),m=p.H.rad+D0.r;if(d>=m)continue;
   if(D0.death){const am=70*dt;hurtPlayer(p,am/G.dmgScale);e.drained+=am;if(Math.random()<.3)spark(p.x,1.3,p.z,0xff2020,.4);sfx('drain');if(e.drained>=220){e.dead=true;burst(e.x,1.5,e.z,0x403848,20,3)}if(d>1e-4){e.x=p.x+dx/d*m;e.z=p.z+dz2/d*m}break}
   if(D0.kami){hurtPlayer(p,D0.touch);e.dead=true;burst(e.x,1.2,e.z,D0.burst,8);break}
   if(e.atk<=0){hurtPlayer(p,D0.touch);e.atk=.75}if(d>1e-4){e.x=p.x+dx/d*m;e.z=p.z+dz2/d*m}}
 }}
function updateProj(dt){
 for(const b of G.proj){if(b.dead)continue;b.spin+=dt*16;b.life-=dt;if(b.life<=0){b.dead=true;continue}
  if(b.kind==='bolt'&&Math.random()<.7)spark(b.x,b.y,b.z,b.tint,.25);else if(b.glow&&b.tier>=3&&Math.random()<.6)spark(b.x,b.y,b.z,b.glow,.35);
  for(let s=0;s<2&&!b.dead;s++){b.x+=b.vx*dt/2;b.z+=b.vz*dt/2;if(b.vy){b.y+=b.vy*dt/2;if(b.y<.06||b.y>WALLH-.08){b.dead=true;burst(b.x,clamp(b.y,.1,WALLH-.2),b.z,b.kind==='bolt'?b.tint:0xffd080,6,2);break}}const ti=Math.floor(b.x/T),tj=Math.floor(b.z/T);if(blk(ti,tj)){b.dead=true;burst(b.x,b.y,b.z,b.kind==='bolt'?b.tint:0xffd080,6,2);if(ti>=0&&tj>=0&&ti<G.W&&tj<G.H)hitTile(tj*G.W+ti,b.dmg*(b.kind==='axe'?2:1),b.owner,b.x,b.z);break}hitTest(b)}}
 for(const f of G.eproj){if(f.dead)continue;f.life-=dt;f.x+=f.vx*dt;f.z+=f.vz*dt;if(Math.random()<.6)spark(f.x,f.y,f.z,0xff6020,.3);if(f.life<=0||blk(Math.floor(f.x/T),Math.floor(f.z/T))){f.dead=true;burst(f.x,f.y,f.z,0xff7020,6,2);continue}
  for(const w of players)if(w.hero==='wizard'&&w.alive&&Math.hypot(f.x-w.x,f.z-w.z)<3.6){f.dead=true;burst(f.x,f.y,f.z,0x9fd8ff,8,2)}
  if(f.dead)continue;for(const p of players)if(p.alive&&Math.hypot(f.x-p.x,f.z-p.z)<p.H.rad+.3){hurtPlayer(p,14);f.dead=true;burst(f.x,f.y,f.z,0xff7020,10,3);break}}
 for(const r of G.rocks){if(r.dead)continue;r.vy-=14*dt;r.x+=r.vx*dt;r.y+=r.vy*dt;r.z+=r.vz*dt;r.spin+=dt*8;
  if(r.y<=.25){r.dead=true;burst(r.x,.3,r.z,0x8a8078,10,3);sfx('thud');for(const p of players)if(p.alive&&Math.hypot(r.x-p.x,r.z-p.z)<1.4)hurtPlayer(p,15)}}}
function hitTest(b){const ti=Math.floor(b.x/T),tj=Math.floor(b.z/T);
 for(let a=-1;a<=1;a++)for(let c=-1;c<=1;c++){const i=ti+a,j=tj+c;if(i<0||j<0||i>=G.W||j>=G.H)continue;for(let k=G.head[j*G.W+i];k>=0;k=G.nxt[k]){const e=G.enemies[k];if(!e||e.dead||e.hidden)continue;if(b.vy&&(b.y>tallOf(e)+.35||b.y<-.3))continue;const rr=b.r+EDEF[e.type].r,dx=e.x-b.x,dz2=e.z-b.z;if(dx*dx+dz2*dz2>rr*rr)continue;if(b.hit&&b.hit.includes(e))continue;(b.hit||(b.hit=[])).push(e);const vl=Math.hypot(b.vx,b.vz)||1;hurtEnemy(e,b.dmg,b.owner,b.vx/vl*b.knock,b.vz/vl*b.knock,b.stun);if(EDEF[e.type].death){b.dead=true;return}if(--b.pierce<0){b.dead=true;return}}}
 for(const g of G.gens)if(Math.hypot(g.x-b.x,g.z-b.z)<1.1+b.r*.5){hurtGen(g,b.dmg,b.owner);b.dead=true;return}
 for(const c of G.chests)if(Math.hypot(c.x-b.x,c.z-b.z)<.8+b.r*.5){openChest(c,b.owner);b.dead=true;return}
 for(const it of G.items){if(it.gone||(it.type!=='food'&&it.type!=='potion'))continue;if(Math.hypot(it.x-b.x,it.z-b.z)>.55+b.r*.4)continue;if(Math.hypot(it.x-b.owner.x,it.z-b.owner.z)<2.2)continue;it.gone=true;G.lg.remove(it.mesh);b.dead=true;
  if(it.type==='food'){burst(it.x,.4,it.z,0x8a3a1c,14,3);if(!b.owner.ai){say(b.owner.H.name+' shot the food!',true);pmsg(b.owner,'You shot the food!')}}else{sfx('potion');blast(b.owner,it.x,it.z,7)}return}}
function updateParts(dt){for(const q of G.parts){q.life-=dt;if(!q.ng)q.vy-=14*dt;q.x+=q.vx*dt;q.y=Math.max(.05,q.y+q.vy*dt);q.z+=q.vz*dt}G.parts=G.parts.filter(q=>q.life>0);
 for(const f of G.fx){f.t+=dt;const k=f.t/f.dur;f.m.scale.setScalar(.5+k*f.r);f.m.material.opacity=Math.max(0,.9*(1-k))}G.fx=G.fx.filter(f=>{if(f.t>=f.dur){scene.remove(f.m);f.m.geometry.dispose();f.m.material.dispose();return false}return true});
 const hs=humans().filter(p=>p.alive),ref=hs.length?hs:[G.start];for(const r of ref){if(!r)continue;while(G.embers.length<ref.length*45)G.embers.push({x:r.x+rf(-9,9),y:rf(0,WALLH),z:r.z+rf(-9,9),vy:rf(.1,.5),ph:Math.random()*9,c:Math.random()<.5?[1,.45,.12]:[.5,.42,.35]})}
 for(const m of G.embers){m.y+=m.vy*dt;m.x+=Math.sin(G.time+m.ph)*dt*.3;if(m.y>WALLH){m.y=0;const r=ref[rnd(ref.length)];if(r){m.x=r.x+rf(-9,9);m.z=r.z+rf(-9,9)}}}
 if(G.exit&&!G.exitLocked&&Math.random()<dt*25)G.parts.push({x:G.exit.x+rf(-1.4,1.4),y:.3,z:G.exit.z+rf(-1.4,1.4),vx:0,vy:rf(1,3),vz:0,life:rf(.8,1.6),c:0x60ff90,g:true,ng:true})}
function animItems(dt){for(const it of G.items){if(it.gone)continue;it.mesh.rotation.y=G.time*1.3+it.ph;it.mesh.position.y=.15+Math.sin(G.time*2.5+it.ph)*.12}
 for(const g of G.gens)g.mesh.scale.setScalar(.55+.45*clamp(g.hp/g.max,0,1));
 if(G.exit){G.exit.beam.material.opacity=.12+Math.sin(G.time*3)*.05;G.exit.disc.rotation.z=G.time*1.6}
 if((G.lightT-=(dt||1/60))<=0){G.lightT=.3;assignLights()}
 for(const l of SL){const c=l.userData.c;if(c)l.intensity=1.25+Math.sin(G.time*11+c.ph)*.18+Math.sin(G.time*23+c.ph)*.1}}
function exitReached(){G.transT=1.3;sfx('up');if(G.treasure){for(const p of players)if(p.alive)gainPower(p,50);banner('Treasure claimed!','Your weapons grow stronger',1.6)}else banner('Level '+G.level+' cleared!','',1.4)}
function nextLevel(){if(G.treasure){G.treasure=false;G.level++}else if(G.level%2===0)G.treasure=true;else G.level++;
 for(const p of players){if(!p.alive){p.alive=true;p.hp=Math.max(p.hp,p.max*.5);p.body.root.visible=!(p.i===0&&renderer.xr.isPresenting);p.shield=p.smax||0}p.dash=0}buildLevel();$('#timer').hidden=!G.treasure}
function timeUp(){G.timer=0;for(const p of players)p.score-=p.tgold;banner("Time's up!",'The treasure fades away',1.6);G.transT=1.6}
function gameOver(){G.over=true;advertise();showTouch();if(document.pointerLockElement)document.exitPointerLock();say('Game over',true);
 setTimeout(()=>{$('#overSub').textContent=`The party fell on ${G.treasure?'a treasure room after level '+G.level:'level '+G.level}.`;$('#finalScores').innerHTML=players.map(p=>`<tr><td style="color:${p.H.css}">${p.H.name}${p.ai?' (ally)':''} · ${p.H.tiers[p.tier-1]}</td><td>${p.score.toLocaleString()} gold · ${p.kills} foes</td></tr>`).join('');$('#over').hidden=false;$('#againBtn').focus();if(renderer.xr.isPresenting){try{renderer.xr.getSession().end()}catch(e){}}},1400)}
function update(dt){
 G.time+=dt;if(G.bannerT>0){G.bannerT-=dt;if(G.bannerT<=0)$('#banner').classList.remove('show')}
 if(G.demo){const s=G.start;menuCam.position.set(s.x,1.8,s.z);menuCam.rotation.set(0,G.time*.12,0);animItems(dt);updateParts(dt);return}
 if(G.net==='client'){clientUpdate(dt);return}
 if(G.net==='host')hostNet(dt);
 if(G.transT>0){G.transT-=dt;if(G.transT<=0){nextLevel();return}}
 if(G.treasure&&G.transT<=0&&!G.over){G.timer-=dt;$('#timer').textContent=Math.max(0,Math.ceil(G.timer))+'s';if(G.timer<=0)timeUp()}
 if((G.flowT-=dt)<=0){computeFlow();G.flowT=.25}
 buildBuckets();
 for(const p of players)updatePlayer(p,dt);
 spawnFromGens(dt);updateEnemies(dt);updateProj(dt);updateParts(dt);animItems(dt);
 G.enemies=G.enemies.filter(e=>!e.dead);G.proj=G.proj.filter(b=>!b.dead);G.eproj=G.eproj.filter(b=>!b.dead);G.rocks=G.rocks.filter(r=>!r.dead);if(G.items.length>40)G.items=G.items.filter(i=>!i.gone);
 G.flash=Math.max(0,G.flash-dt*2.2);
 const hs=players.filter(p=>!p.ai);if(!G.over&&hs.length&&hs.every(p=>!p.alive))gameOver();
}
const ITEMGLOW={potion:[.25,.45,1],key:[.9,.7,.25],treasure:[.9,.7,.2],charm:[1,.3,.6],food:[.5,.3,.1]};
function flushAll(){for(const k in POOLS)POOLS[k].n=0;for(const k in GL)GL[k].n=0;for(const k in MPOOL)MPOOL[k].n=0;if(EELTOP)for(const P of EELTOP)P.n=0;for(const k in SKTOP)SKTOP[k].n=0;
 const put=(k,x,y,z,ry,rx,rz,s,sz,col)=>{const P=POOLS[k];if(P.n>=P.max)return;D.position.set(x,y,z);D.rotation.set(rx,ry,rz);D.scale.set(s,s,s*sz);D.updateMatrix();P.m.setMatrixAt(P.n,D.matrix);P.m.setColorAt(P.n,TC.setHex(col).convertSRGBToLinear());P.n++};
 const t=G.time;
 tsDraw();
 for(const e of G.enemies){if(e.dead)continue;const D0=EDEF[e.type];if(D0.boss||D0.egg)continue;
  if(D0.water&&drawWater(e,t))continue;
  if(e.hidden){if(Math.random()<.3)GL.spark.add(e.x+rf(-.4,.4),rf(.3,2),e.z+rf(-.4,.4),.5,.25,.7);continue}
  const fl=e.type==='ghost'||e.type==='death',y=fl?.12+Math.sin(t*3+e.ph)*.12:Math.abs(Math.sin(t*9+e.ph))*.08*e.moving;
  const rz=fl?Math.sin(t*2+e.ph)*.08:Math.sin(t*9+e.ph)*.09*e.moving,rx=.12*e.moving+(e.flash>0?-.25:0);
  const MP=MPOOL[e.type];if(MP&&MP.ok){if(MP.n<MP.max){const i=MP.n++;D.position.set(e.x,D0.water?waterY(e,t):(MSPR[e.type].f?.15+Math.sin(t*2.6+e.ph)*.12:Math.abs(Math.sin(t*8+e.ph))*.05*e.moving),e.z);D.rotation.set(0,0,0);D.scale.set(1,1,1);D.updateMatrix();MP.m.setMatrixAt(i,D.matrix);MP.yaw.array[i]=e.rot;const fl=e.flash>0,fr=e.frz>0,st=fr&&e.stone;MP.tint.array[i*3]=st?.62:fr?.6:fl?1.3:.88;MP.tint.array[i*3+1]=st?.62:fr?.88:fl?.45:.84;MP.tint.array[i*3+2]=st?.62:fr?1.35:fl?.4:.82}continue}
  put(e.type,e.x,y,e.z,e.rot,rx,rz,1,1,e.frz>0?(e.stone?0x8a8a8a:0x9fd8ff):e.flash>0?0xff6050:0xffffff);
  const s=Math.sin(e.rot),c=Math.cos(e.rot),ey=y+D0.ey,ez=D0.ez,ex=D0.ex,col=D0.eye,br=e.type==='ghost'?1.4:1.2;
  GL.eye.add(e.x+s*ez+c*ex,ey,e.z+c*ez-s*ex,col[0]*br,col[1]*br,col[2]*br);GL.eye.add(e.x+s*ez-c*ex,ey,e.z+c*ez+s*ex,col[0]*br,col[1]*br,col[2]*br);
  if(e.type==='sorcerer')GL.orb.add(e.x+c*.6+s*.3,y+2.2,e.z-s*.6+c*.3,.6,.3,.8)}
 shotLights();
 for(const b of G.proj){if(b.dead)continue;const ry=Math.atan2(b.vx,b.vz);
  if(b.kind==='axe')put(b.tier>=5?'axe5':'axe',b.x,b.y,b.z,ry,b.spin,0,b.scale,1,b.tint);else if(b.kind==='knife'){const kk=b.tier>=5?'knife5':'knife',KP=MPOOL[kk];if(KP&&KP.ok&&KP.n<KP.max){const i=KP.n++;D.position.set(b.x,b.y-MSPR[kk].h/2,b.z);D.rotation.set(0,0,0);D.scale.set(1,1,1);D.updateMatrix();KP.m.setMatrixAt(i,D.matrix);KP.yaw.array[i]=0;KP.tint.array[i*3]=KP.tint.array[i*3+1]=KP.tint.array[i*3+2]=1}else put(kk,b.x,b.y,b.z,ry,b.spin*1.4,0,1.5,1,b.tint)}
  else if(b.kind==='arrow')put('arrow',b.x,b.y,b.z,ry,0,0,1,1,b.tint);else if(b.kind==='fire'){put('fire',b.x,b.y,b.z,0,0,0,1,1,0xff7020);GL.orb.add(b.x,b.y,b.z,1,.45,.1)}else if(b.kind==='rock')put('rock',b.x,b.y,b.z,b.spin,b.spin*.7,0,1,1,0xffffff);else{put('bolt',b.x,b.y,b.z,ry,0,0,b.scale,5,b.tint);const c=RGB(b.tint);GL.orb.add(b.x,b.y,b.z,c[0],c[1],c[2])}
  if(b.glow&&b.tier>=3&&b.kind!=='bolt'){const c=RGB(b.glow);GL.orb.add(b.x,b.y,b.z,c[0]*.6,c[1]*.6,c[2]*.6)}}
 for(const f of G.eproj)if(!f.dead){put('fire',f.x,f.y,f.z,0,0,0,1+Math.sin(t*20)*.1,1,0xff7020);GL.orb.add(f.x,f.y,f.z,1,.45,.1)}
 for(const r of G.rocks)if(!r.dead)put('rock',r.x,r.y,r.z,r.spin,r.spin*.7,0,1,1,0xffffff);
 for(const q of G.parts){const c=RGB(q.c),a=clamp(q.life*1.6,0,1);if(q.g)GL.spark.add(q.x,q.y,q.z,c[0]*a,c[1]*a,c[2]*a);else put('part',q.x,q.y,q.z,q.life*9,q.life*7,0,clamp(q.life*1.6,.2,1),1,q.c)}
 for(const m of G.embers){const tw=.35+.35*Math.sin(t*3+m.ph);GL.spark.add(m.x,m.y,m.z,m.c[0]*tw,m.c[1]*tw,m.c[2]*tw)}
 for(const s of G.sconces){const f=.85+Math.sin(t*14+s.ph)*.1+Math.random()*.08;GL.flame.add(s.x,s.y+Math.sin(t*9+s.ph)*.03,s.z,f,f*.9,f*.8)}
 for(const it of G.items){if(it.gone)continue;const c=ITEMGLOW[it.type];if(c){const k=.35+.15*Math.sin(t*3+it.ph);GL.halo.add(it.x,it.mesh.position.y+.5,it.z,c[0]*k,c[1]*k,c[2]*k)}}
 for(const g of G.gens)GL.halo.add(g.x,.9,g.z,g.c[0]*.5,g.c[1]*.5,g.c[2]*.5);
 for(const c of G.chests)GL.halo.add(c.x,.7,c.z,.35,.25,.08);
 for(const p of players)if(p.ai&&p.alive){const c=RGB(parseInt(p.H.css.slice(1),16));GL.orb.add(p.x,2.55,p.z,c[0]*.5,c[1]*.5,c[2]*.5)}
 if(G.exit&&!G.exitLocked){GL.halo.add(G.exit.x,.8,G.exit.z,.25,.9,.45);GL.halo.add(G.exit.x,2.4,G.exit.z,.12,.45,.22)}
 for(const k in POOLS){const P=POOLS[k];P.m.count=P.n;P.m.instanceMatrix.needsUpdate=true;if(P.m.instanceColor)P.m.instanceColor.needsUpdate=true}
 if(EELTOP)for(const P of EELTOP){P.m.count=P.n;P.m.instanceMatrix.needsUpdate=true}for(const k in SKTOP){const P=SKTOP[k];P.m.count=P.n;P.m.instanceMatrix.needsUpdate=true}
 for(const k in MPOOL){const P=MPOOL[k];P.m.count=P.n;P.m.instanceMatrix.needsUpdate=true;P.yaw.needsUpdate=true;P.tint.needsUpdate=true}
 for(const k in GL)GL[k].end()}

// ---------- HUD
function rects(n){const W=innerWidth,H=innerHeight,w2=Math.floor(W/2),h2=Math.floor(H/2);if(n<=1)return[{x:0,y:0,w:W,h:H}];if(n===2)return[{x:0,y:0,w:W,h:h2},{x:0,y:h2,w:W,h:H-h2}];return[{x:0,y:0,w:w2,h:h2},{x:w2,y:0,w:W-w2,h:h2},{x:0,y:h2,w:w2,h:H-h2},{x:w2,y:h2,w:W-w2,h:H-h2}]}
function buildHud(){const h=$('#hud'),hs=humans();
 h.innerHTML=hs.map(p=>`<div class="ph" id="ph${p.i}" style="--c:${p.H.css}"><div class="fpw fpw-${p.hero}">${p.hero==='wizard'?'<div class="wzb"><img class="fp" alt=""><img class="fp2" alt=""></div>':'<img class="fp" alt="">'}</div><div class="vgn"></div><div class="flash"></div><div class="vig"></div><div class="angelsay"><img src="${V('sprites/angel_face.webp')}" alt=""><div><b>Angel Princess</b><p></p></div></div><div class="cross"></div><div class="top"><b class="nm">${p.H.name}</b><span class="tier"></span><span class="score"></span></div><canvas class="mini" width="132" height="132"></canvas><div class="msg"></div><div class="bars"><div class="allies"></div><div class="inv"></div><div class="bar hp"><i></i><b class="shd"></b><em></em></div><div class="bar sec"><i></i><em></em></div></div><div class="dead"><div>${p.H.name} has fallen<br><small>Back on the next level if a friend reaches the exit</small></div></div></div>`).join('')+(hs.length===3?'<div class="ph" id="phmap"><canvas class="bigmap" width="300" height="300"></canvas></div>':'');
 for(const p of hs){const r=$('#ph'+p.i),q=s=>r.querySelector(s);p.el={root:r,say:q('.angelsay'),fp:q('.fp'),fp2:q('.fp2'),wzb:q('.wzb'),fpw:q('.fpw'),flash:q('.flash'),vig:q('.vig'),tier:q('.tier'),score:q('.score'),mini:q('.mini'),msg:q('.msg'),inv:q('.inv'),allies:q('.allies'),hpI:q('.hp i'),hpB:q('.bar.hp'),shd:q('.shd'),secB:q('.bar.sec'),hpE:q('.hp em'),secI:q('.sec i'),secE:q('.sec em')}}
 layoutHud()}
function layoutHud(){const hs=humans(),R=rects(hs.length);hs.forEach((p,i)=>{const s=p.el&&p.el.root.style,r=R[i];if(!s)return;s.left=r.x+'px';s.top=r.y+'px';s.width=r.w+'px';s.height=r.h+'px'});const m=$('#phmap');if(m){const r=R[3];Object.assign(m.style,{left:r.x+'px',top:r.y+'px',width:r.w+'px',height:r.h+'px'})}}
let hudT=0;
function hudTick(dt){if(!G||G.demo||!players.length||!G.lg)return;fpTick();const hs=humans();for(const p of hs){if(p.el){p.el.vig.style.opacity=p.hurt*(SAFE.on?.3:.8);p.el.flash.style.opacity=G.flash*(SAFE.on?.1:.85)}}
 if((hudT-=dt)>0)return;hudT=.1;const allies=players.filter(p=>p.ai);
 for(const p of hs){const e=p.el,H=p.H;if(!e)continue;e.root.classList.toggle('isdead',!p.alive);
  e.hpI.style.transform=`scaleX(${clamp(p.hp/p.max,0,1)})`;e.hpE.textContent=Math.ceil(p.hp)+' health'+(H.sec!=='shield'&&p.smax?' · shield '+Math.ceil(p.shield):'');
  {const pw=e.root.clientWidth||innerWidth,base=Math.min(340,pw*.58),w=Math.min(pw-28,base*(p.max/H.hp));if(e.hpW!==Math.round(w)){e.hpW=Math.round(w);e.hpB.style.width=e.hpW+'px';e.secB.style.width=Math.round(base)+'px'}e.shd.style.transform=`scaleX(${clamp(p.smax?p.shield/p.smax:0,0,1)})`}
  let f,t;if(H.sec==='shield'){f=p.shield/(p.smax||1);t='Shield '+Math.ceil(p.shield)}else if(H.sec==='mana'){f=p.mana/100;t='Magic '+Math.floor(p.mana)}else{f=1-Math.max(0,p.cd1)/H.a1cd;t=H.a1+(p.cd1>0?' '+p.cd1.toFixed(1)+'s':' ready')}
  e.secI.style.transform=`scaleX(${clamp(f,0,1)})`;e.secE.textContent=t;
  const pow=H.sec==='cool'?'':' · '+H.a1+(p.cd1>0?' '+p.cd1.toFixed(1)+'s':' ready');
  e.inv.textContent=`Keys ${p.keys} · Potions ${p.potions} · Food ${p.pouch}${p.charms?' · Charms '+p.charms:''}${pow}${p.buffT>0?' · '+{might:'Might',haste:'Haste',ward:'Warding'}[p.buff]+' '+Math.ceil(p.buffT)+'s':''}`;
  const team=players.filter(q=>q!==p&&!q.local);e.allies.textContent=team.length?'Team: '+team.map(a=>`${a.H.name}${a.ai?' (ally)':''} ${a.alive?Math.round(a.hp/a.max*100)+'%':'fallen'}`).join(' · '):'';
  e.tier.textContent=H.tiers[p.tier-1]+' (power '+p.tier+'/5)';e.score.textContent=p.score.toLocaleString()+' gold';
  drawMini(e.mini,p)}
 const bm=document.querySelector('.bigmap');if(bm)drawMini(bm,null);bossBar();
 if(renderer.xr.isPresenting&&XR.hud)drawVRHud()}
function bossFrac(){if(G.net==='client')return G.tsNet?G.tsNet[1]/1000:-1;const b=G.boss;return b&&!b.dead&&G.tsAwake?clamp(b.hp/b.max,0,1):-1}
function bossBar(){const f=bossFrac(),el=$('#bossbar');if(el){el.hidden=f<0||renderer.xr.isPresenting;if(f>=0)el.querySelector('span').style.transform=`scaleX(${f})`}
 if(XR.bossM){XR.bossM.visible=f>=0;if(f>=0){const x=XR.bossC.getContext('2d');x.clearRect(0,0,512,64);x.fillStyle='rgba(10,4,4,.65)';x.fillRect(0,0,512,64);x.fillStyle='#e8c0b0';x.font='bold 22px serif';x.textAlign='center';x.fillText('TROLL SPIDER',256,22);x.fillStyle='#3a0806';x.fillRect(16,32,480,22);x.fillStyle='#d8261a';x.fillRect(16,32,480*f,22);XR.bossM.material.map.needsUpdate=true}}}
function banner(t,s,d){$('#bT').textContent=t;$('#bS').textContent=s||'';$('#banner').classList.add('show');G.bannerT=d||2}

// ---------- VR
// VR HUD: locked to your view, up in the corners and see-through, so it follows your head without sitting on your wrist or over the action.
// Upper left: health, shield/magic, keys, potions, food. Upper right: the mini map.
function drawVRHud(){const p=players[0],c=XR.hudC,x=c.getContext('2d'),H=p.H;x.clearRect(0,0,512,256);
 x.fillStyle='rgba(10,6,4,.55)';x.beginPath();x.roundRect?x.roundRect(0,0,512,256,22):x.rect(0,0,512,256);x.fill();
 x.fillStyle=H.css;x.font='bold 34px serif';x.fillText(H.name+' · Level '+G.level,18,44);const rc=roomCode();if(rc){x.textAlign='right';x.fillStyle='#ffc35a';x.font='bold 28px sans-serif';x.fillText('Room '+rc,496,42);x.textAlign='left'}
 const bar=(y,f,bg,fg,t)=>{x.fillStyle=bg;x.fillRect(18,y,476,30);x.fillStyle=fg;x.fillRect(18,y,476*clamp(f,0,1),30);x.fillStyle='#fff';x.font='bold 22px sans-serif';x.fillText(t,28,y+23)};
 bar(60,p.hp/p.max,'#4a0806','#e94a3a',Math.ceil(p.hp)+' / '+p.max+' health');
 let f,t;if(H.sec==='shield'){f=p.shield/(p.smax||1);t='Shield '+Math.ceil(p.shield)}else if(H.sec==='mana'){f=p.mana/100;t='Magic '+Math.floor(p.mana)}else{f=p.smax?p.shield/p.smax:(p.cd1>0?1-p.cd1/(H.cd1||5):1);t=p.smax?'Shield '+Math.ceil(p.shield):H.a1+(p.cd1>0?' '+p.cd1.toFixed(1)+'s':' ready')}
 bar(98,f,'#0b2238',H.sec==='mana'?'#6a8cff':'#4fb6e8',t);
 x.font='bold 30px sans-serif';const items=[['🗝',p.keys,'#ffd060'],['🧪',p.potions,'#ff7ad0'],['🍖',p.pouch,'#ffb070'],['✨',p.charms|0,'#b0e8ff']];let ix=18;
 for(const [ic,n,col] of items){x.fillStyle=col;x.fillText(ic+' '+n,ix,170);ix+=104}x.fillStyle='#ffd34a';x.font='bold 24px sans-serif';x.textAlign='right';x.fillText('💰 '+p.score.toLocaleString(),496,212);x.textAlign='left';
 x.font='22px sans-serif';x.fillStyle='#e8dcc8';x.fillText(H.tiers[p.tier-1]+' ('+p.tier+'/5)'+(G.treasure?'   Time '+Math.ceil(G.timer)+'s':''),18,212);
 XR.hud.material.map.needsUpdate=true;
 if(XR.map){const m=XR.mapC,y=m.getContext('2d');drawMini(m,p);y.globalCompositeOperation='destination-over';y.fillStyle='rgba(10,6,4,.6)';y.fillRect(0,0,m.width,m.height);y.globalCompositeOperation='source-over';XR.map.material.map.needsUpdate=true}}
function roomCode(){return NET.code&&NET.nr?NET.code.slice(1).toUpperCase():''}
for(let i=0;i<2;i++){const c=renderer.xr.getController(i);c.addEventListener('connected',e=>{c.userData.hand=e.data.handedness;if(e.data.handedness==='right')XR.right=c;if(e.data.handedness==='left')XR.left=c});c.addEventListener('disconnected',()=>{if(XR.right===c)XR.right=null;if(XR.left===c)XR.left=null});XR.c.push(c)}
function onVRStart(){const p=players[0];if(!p)return;showTouch();for(const c of XR.c)p.dolly.add(c);for(const q of players)setLayer(q.body.root,0);p.body.root.visible=false;applyQuality();
 const hp=(w,h,cv)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,opacity:.9,depthTest:false,depthWrite:false,fog:false}));m.renderOrder=999;m.frustumCulled=false;p.cam.add(m);return m};
 XR.hudC=document.createElement('canvas');XR.hudC.width=512;XR.hudC.height=256;XR.hud=hp(.34,.17,XR.hudC);XR.hud.position.set(-.37,.25,-.9);XR.hud.rotation.set(-.22,.38,0);
 XR.mapC=document.createElement('canvas');XR.mapC.width=XR.mapC.height=256;XR.map=hp(.21,.21,XR.mapC);XR.map.position.set(.4,.26,-.9);XR.map.rotation.set(-.22,-.4,0);
 XR.bossC=document.createElement('canvas');XR.bossC.width=512;XR.bossC.height=64;XR.bossM=hp(.36,.045,XR.bossC);XR.bossM.position.set(0,.34,-.9);XR.bossM.rotation.x=-.3;XR.bossM.visible=false;$('#hud').hidden=true}
function onVREnd(){vrMenuClose();vrArtHide();wizHide();const p=players[0];$('#hud').hidden=false;for(const k of ['hud','map','bossM'])if(XR[k]){if(XR[k].parent)XR[k].parent.remove(XR[k]);XR[k]=null};if(!p)return;p.cam.add(p.vm.root);p.vm.root.position.set(0,0,0);setLayer(p.vm.root,20);players.forEach(q=>setLayer(q.body.root,10+q.i));p.body.root.visible=p.alive;applyQuality();showTouch();if(running())setPause(true)}
async function enterVR(){if(!navigator.xr){menuMsg('This browser has no VR support. Open the page in your headset’s browser.');return}
 try{const s=await navigator.xr.requestSession('immersive-vr',{optionalFeatures:['local-floor','bounded-floor']});if(!G||G.demo)startGame(true);renderer.xr.setReferenceSpaceType('local-floor');await renderer.xr.setSession(s);onVRStart();watchXR(s)}
 catch(err){menuMsg('VR could not start here. Open this page directly in your headset’s browser, then press Enter VR.')}}
if(navigator.xr&&navigator.xr.isSessionSupported)navigator.xr.isSessionSupported('immersive-vr').then(ok=>{if(ok)$('#vrNote').textContent='VR headset detected. Press Enter VR: Player 1 wears the headset.'}).catch(()=>{});

// ---------- render loop
function render(){renderer.shadowMap.needsUpdate=true;
 if(renderer.xr.isPresenting){for(const k in GL)GL[k].scale(1);renderer.setScissorTest(false);if(players[0]){faceBills(players[0].cam);vrArtTick(players[0]);vigTick(players[0]);vrDeadTick(players[0])}renderer.render(scene,players[0]?players[0].cam:menuCam);return}
 const W=innerWidth,H=innerHeight,hs=humans();
 if(!G||G.demo||!hs.length||!G.lg){for(const k in GL)GL[k].scale(1);renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);menuCam.aspect=W/H;menuCam.updateProjectionMatrix();renderer.render(scene,menuCam);return}
 const R=rects(hs.length);renderer.setScissorTest(true);
 if(hs.length===3){renderer.setViewport(0,0,W,H);renderer.setScissor(0,0,W,H);renderer.clear()}
 hs.forEach((p,i)=>{const r=R[i],y=H-r.y-r.h;for(const k in GL)GL[k].scale(r.h/H);renderer.setViewport(r.x,y,r.w,r.h);renderer.setScissor(r.x,y,r.w,r.h);p.cam.aspect=r.w/r.h;p.cam.updateProjectionMatrix();faceBills(p.cam);renderer.render(scene,p.cam);renderer.shadowMap.needsUpdate=false});
 renderer.setScissorTest(false)}
let last=performance.now();
renderer.setAnimationLoop(()=>{const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;pollPads();
 if(G&&G.lg&&!G.demo&&!G.paused){poolTick(dt);floodTick(dt);tsTick(dt);if(G.wet)wetTick(dt);if(G.market||G.portals.length)marketTick(dt)}
 if(G&&renderer.xr.isPresenting)vrMenuTick();
 if(G&&G.paused&&G.net==='host'&&!G.over)hostNet(dt);
 if(G&&(!G.paused||G.net==='client'))update(dt);pressed.clear();TOUCH.dx=TOUCH.dy=0;TOUCH.e={};mouse.dx=mouse.dy=0;mouse.rp=mouse.mp=false;
 if(G&&G.lg)flushAll();hudTick(dt);music();render()});
addEventListener('resize',()=>{if(!renderer.xr.isPresenting)renderer.setSize(innerWidth,innerHeight);if(players.length)layoutHud()});

// ---------- online co-op across devices (computer, headset, phone)
const DEV=/OculusBrowser|Quest|Pico/i.test(navigator.userAgent)?'VR headset':COARSE?'phone':'computer';
const LAN={h:null};
const NET={vis:'wifi',p2p:false,room:null,nr:null,mode:null,code:null,myId:'c'+Math.random().toString(36).slice(2,9),sendT:0,adT:0,lastTick:-1,hostSeen:0,cnt:{a1:0,a2:0,pt:0,ea:0},hosts:[]};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const b64=u8=>{let s='';for(let i=0;i<u8.length;i++)s+=String.fromCharCode(u8[i]);return btoa(s)};
const unb64=s=>{try{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}catch(e){return new Uint8Array(0)}};
const ET=['ghost','grunt','demon','lobber','sorcerer','death','gargoyle','naga','eel','drowned','drownbrute','tspider','egg','spiderling','gremlin'],PK=['axe','axe5','arrow','knife','knife5','bolt','fire','rock'],PSPD=[22,22,46,35,35,36,13,9],IT=['food','potion','charm','key','treasure'];
const q11=v=>clamp(Math.round(v*8),0,2047),angQ=(a,n)=>((Math.round(a/TAU*n)%n)+n)%n;
function pack(list,fn){const u=new Uint8Array(list.length*4),dv=new DataView(u.buffer);list.forEach((o,i)=>dv.setUint32(i*4,fn(o)>>>0));return b64(u)}
function unpack(s,fn){const u=unb64(typeof s==='string'?s:''),dv=new DataView(u.buffer),out=[];for(let i=0;i+3<u.length;i+=4)out.push(fn(dv.getUint32(i)));return out}
const packE=e=>q11(e.x)<<21|q11(e.z)<<10|angQ(e.rot,16)<<6|Math.max(0,ET.indexOf(e.type))<<2|(e.flash>0?2:0)|(e.hidden?1:0);
function hostSnap(){const rem=players.filter(p=>p.net&&p.alive);let E=G.enemies.filter(e=>!e.dead);const BE=E.filter(e=>e.type==='tspider');if(BE.length)E=BE.concat(E.filter(e=>e.type!=='tspider'));
 if(E.length>260&&!BE.length)E=E.map(e=>[rem.length?Math.min(...rem.map(p=>(p.x-e.x)**2+(p.z-e.z)**2)):0,e]).sort((a,b)=>a[0]-b[0]).slice(0,260).map(a=>a[1]);
 const J=[];for(let bi=G.proj.length-1;bi>=0;bi--){const b=G.proj[bi];if(!b.dead&&J.length<220)J.push([b.kind==='axe'?(b.tier>=5?1:0):b.kind==='arrow'?2:b.kind==='knife'?(b.tier>=5?4:3):5,b.x,b.z,Math.atan2(b.vx,b.vz),b.tier>=3,b.y])}
 for(const f of G.eproj)if(!f.dead&&J.length<260)J.push([6,f.x,f.z,Math.atan2(f.vx,f.vz),0,1.5]);for(const r of G.rocks)if(!r.dead&&J.length<280)J.push([7,r.x,r.z,Math.atan2(r.vx,r.vz),0,r.y]);
 const pj=o=>q11(o[1])<<21|q11(o[2])<<10|o[0]<<7|angQ(o[3],64)<<1|(o[4]?1:0);
 const s={v:1,fh:G.flood?Math.round(G.flood.h*100):0,ps:G.paused?1:0,t:++G.tick,sd:G.seed,lv:G.level,tr:G.treasure?1:0,tm:Math.max(0,Math.ceil(G.timer||0)),ov:G.over?1:0,fl:Math.round(G.flash*10),
  P:players.map(p=>[p.netId,p.hero,Math.round(p.x*10),Math.round(p.z*10),Math.round(p.yaw*100),Math.max(0,Math.ceil(p.hp)),Math.ceil(p.shield),Math.floor(p.mana),p.keys,p.potions,p.pouch,p.score,p.tier,p.alive?1:0,Math.round(p.anim*10),Math.round(Math.max(0,p.cd1)*10),p.buffT>0?['might','haste','ward'].indexOf(p.buff)+1:0,Math.ceil(Math.max(0,p.buffT)),p.kills,p.moving>.5?1:0,Math.round((p.spawn?p.spawn.x:p.x)*10),Math.round((p.spawn?p.spawn.z:p.z)*10),p.ai?1:0,Math.round((p.pfz||0)*10),p.carry|0,p.aim3d?1:0,p.charms|0]),
  E:pack(E,packE),J:pack(J,pj),Jy:J.map(o=>String.fromCharCode(48+clamp(Math.round((o[5]||1.25)*10),0,70))).join(''),I:pack(G.items.filter(i=>!i.gone).slice(0,90),i=>q11(i.x)<<21|q11(i.z)<<10|Math.max(0,IT.indexOf(i.type))),
  Gn:G.gens.map(g=>g.id+'.'+Math.round(clamp(g.hp/g.max,0,1)*9)).join(','),C:G.chests.map(c=>c.id).join(','),
  B:G.boss&&!G.boss.dead&&G.tsAwake?[['idle','wind','slam','orbturn','orb','lay','roar','vanish','appear'].indexOf(G.boss.bs),Math.round(G.boss.hp/G.boss.max*1000),Math.round((G.boss.fade===undefined?1:G.boss.fade)*100),Math.round(Math.min(G.boss.bt,9)*100)]:0,
  Ob:(G.orbs||[]).filter(f=>!f.dead).slice(0,30).map(f=>[Math.round(f.x*10),Math.round(f.z*10)]),Wv:(G.waves||[]).map(w=>[Math.round(w.x*10),Math.round(w.z*10),Math.round(w.dx*100),Math.round(w.dz*100),Math.round(w.d*10)]),Rm:G.remains||[],
  D:[...G.doorMesh.keys()].map(k=>k.toString(36)).join(','),K:[...G.crack.keys()].map(k=>k.toString(36)).join(','),F:G.fxq.splice(0,14)};
 while(JSON.stringify(s).length>3900&&E.length>20){E=E.slice(0,Math.floor(E.length*.8));s.E=pack(E,packE)}
 return s}
function removePlayer(p){scene.remove(p.dolly);scene.remove(p.body.root);scene.remove(p.light);if(p.bubble)scene.remove(p.bubble);players=players.filter(q=>q!==p)}
function advertise(){if(!NET.room)return;try{const r=NET.room.presence({host:NET.mode==='host'&&G&&!G.demo&&!G.over?{code:NET.code,dv:DEV,lv:G.level,n:players.length,vis:NET.vis,lan:LAN.h}:null});if(r&&r.catch)r.catch(()=>{})}catch(e){}}
function hostNet(dt){if(!NET.nr)return;let any=false;
 for(const pr of NET.nr.peers()){if(pr.sameTab)continue;const m=pr.presence&&pr.presence.me;if(!m||typeof m.id!=='string'||!HEROES[m.h])continue;any=true;
  let p=players.find(q=>q.netId===m.id);
  if(!p&&!G.over&&players.length<4){const used=new Set(players.map(q=>q.i));let i=0;while(used.has(i))i++;p=makePlayer(m.h,'net',i);p.netId=m.id;applyGrowth(p,true);p.grown=true;const h=players.find(q=>q.local&&q.alive)||players[0];p.x=h?h.x+1:G.start.x;p.z=h?h.z:G.start.z;p.spawn={x:p.x,z:p.z};p.nc={a1:m.a1|0,a2:m.a2|0,pt:m.pt|0,ea:m.ea|0,fc:m.fc|0};players.push(p);applyQuality();
   for(const q of humans())pmsg(q,p.H.name+' joined from the '+String(m.dv||'other device').slice(0,20));say(p.H.name+' has joined the game',true);sfx('up');NET.adT=0}
  if(p){p.netMe=m;p.netSeen=G.time}}
 for(const p of players.slice())if(p.net&&G.time-(p.netSeen||0)>6){for(const q of humans())pmsg(q,p.H.name+' left the game');removePlayer(p);NET.adT=0}
 if(any&&(NET.sendT-=dt)<=0){NET.sendT=.05;try{const r=NET.nr.presence({g:hostSnap()});if(r&&r.catch)r.catch(()=>{})}catch(e){}}
 if((NET.adT-=dt)<=0){NET.adT=3;advertise()}}
// a paused host whose screen is off or tab hidden still keeps the other devices connected
setInterval(()=>{if(G&&G.paused&&G.net==='host'&&!G.over)hostNet(.25)},250);
const newCode=()=>'g'+String(Math.floor(100000+Math.random()*900000));
function prepRoom(){if(!NET.room||NET.pre||NET.preBusy)return;NET.preBusy=true;const code=newCode();Promise.resolve(NET.room.join(code)).then(nr=>{NET.pre={code,nr};NET.preBusy=false}).catch(()=>{NET.preBusy=false})}
async function startHosting(){if(!NET.room)return;NET.mode='host';G.net='host';if(NET.pre){NET.code=NET.pre.code;NET.nr=NET.pre.nr;NET.pre=null;advertise();showRoomInfo();return}NET.code=newCode();try{NET.nr=await NET.room.join(NET.code);advertise();showRoomInfo()}catch(e){NET.nr=null}}
async function joinGame(code,vr){if(!NET.room)return;const sess=null;unlockMusic();NET.wantVR=!!(vr&&navigator.xr);
 const s=slots[0],ctrl=(s.ctrl==='off'||s.ctrl==='ai')?(COARSE?'touch':'km'):s.ctrl;
 initAudio();teardown();G=newState();G.net='client';NET.mode='client';NET.code=code;NET.lastTick=-1;NET.hostSeen=performance.now();NET.cnt={a1:0,a2:0,pt:0,ea:0,fc:0};
 const p=makePlayer(s.hero,ctrl,0);p.netId=NET.myId;players=[p];applyQuality();buildHud();$('#menu').hidden=true;banner('Joining the game…','Waiting for the dungeon from the host',4);
 try{NET.nr=await NET.room.join(code)}catch(e){toMenu();menuMsg('Could not join that game. Try again.');return}
 if(sess){try{renderer.xr.setReferenceSpaceType('local-floor');await renderer.xr.setSession(sess);onVRStart();watchXR(sess)}catch(e){}}
 showTouch()}
function syncStats(p,a){const hp=a[5];if(a[8]>p.keys||a[9]>p.potions||a[10]>p.pouch||a[11]>p.score+0)rumble(p,40,.22);if(hp<p.hp-1){p.hurt=Math.min(1,p.hurt+.4);sfx('hurt');rumble(p,100,.5)}else if(hp>p.hp+60)pmsg(p,'Health +'+Math.round(hp-p.hp));
 if(a[8]>p.keys)pmsg(p,'Key: walk into a door');if(a[9]>p.potions)pmsg(p,'Potion');if(a[10]>p.pouch)pmsg(p,'Food stored for later');if(a[11]>p.score)sfx('gold');
 if(a[12]>p.tier&&a[12]<=5){p.tier=a[12];p.vm.setTier(p.tier);pmsg(p,'Upgraded: '+p.H.tiers[p.tier-1]+'!');sfx('up')}
 {const fz=(a[23]|0)/10;if(fz>(p.pfz||0)+.5){p.pfz=fz;pmsg(p,'Frozen solid by his orb! 4 seconds');rumble(p,600,.9)}}
 if((a[24]|0)>(p.carry|0)){pmsg(p,'Your satchel grows: carry '+['double','triple','unlimited'][(a[24]|0)-1]+' potions, charms and food');sfx('up')}if(a[25]&&!p.aim3d){pmsg(p,'True Flight: your weapons now fly wherever you aim');sfx('up')}p.carry=a[24]|0;p.aim3d=!!a[25];p.charms=a[26]|0;
 const was=p.alive;p.hp=hp;p.shield=a[6];p.mana=a[7];p.keys=a[8];p.potions=a[9];p.pouch=a[10];p.score=a[11];p.alive=!!a[13];p.cd1=a[15]/10;p.buff=[null,'might','haste','ward'][a[16]]||null;p.buffT=a[17];p.kills=a[18];
 if(was&&!p.alive){say(p.H.name+' has fallen',true);rumble(p,500,1)}if(!was&&p.alive)p.body.root.visible=!renderer.xr.isPresenting}
function applySnap(s){if(!s||typeof s!=='object')return;
 if(!G.lg||s.sd!==G.seed||s.lv!==G.level||!!s.tr!==G.treasure){G.seed=s.sd|0;G.level=clamp(s.lv|0,1,99);G.treasure=!!s.tr;for(const q of players.filter(q=>q.puppet))removePlayer(q);buildLevel();
  const me=(s.P||[]).find(a=>a[0]===NET.myId),p=players[0];if(me){p.x=me[20]/10;p.z=me[21]/10}else{p.x=G.start.x;p.z=G.start.z}p.yaw=0;showTouch()}
 G.timer=s.tm|0;if(G.flood)G.flood.h=(s.fh|0)/100;G.tsNet=s.B||null;G.tsOrb=s.Ob||null;G.tsRem=s.Rm||null;G.waves=(s.Wv||[]).map(w=>({x:w[0]/10,z:w[1]/10,dx:w[2]/100,dz:w[3]/100,d:w[4]/10,w:1.7}));if(s.B)G.tsSeen=1;else if(G.tsSeen&&G.exitLocked){G.exitLocked=false;G.tsSeen=0;if(G.exit&&G.exit.g)G.exit.g.visible=true;banner('The Troll Spider is dead!','The exit has opened in the middle of his lair',4)}G.flash=Math.max(G.flash,(s.fl|0)/10);
 const seen=new Set();
 for(const a of Array.isArray(s.P)?s.P:[]){if(!Array.isArray(a)||!HEROES[a[1]])continue;seen.add(a[0]);
  if(a[0]===NET.myId){syncStats(players[0],a);continue}
  let q=players.find(x=>x.puppet&&x.netId===a[0]);if(!q){const used=new Set(players.map(x=>x.i));let i=0;while(used.has(i))i++;if(i>3)continue;q=makePlayer(a[1],'puppet',i);q.netId=a[0];applyGrowth(q,true);q.grown=true;q.x=a[2]/10;q.z=a[3]/10;players.push(q);applyQuality()}
  q.tx=a[2]/10;q.tz=a[3]/10;q.yaw=a[4]/100;q.hp=a[5];q.alive=!!a[13];q.anim=a[14]/10;q.moving=a[19];q.tier=a[12];q.ai=!!a[22];q.body.root.visible=q.alive}
 for(const q of players.slice())if(q.puppet&&!seen.has(q.netId))removePlayer(q);
 const NE=unpack(s.E,v=>({x:(v>>>21)/8,z:((v>>>10)&2047)/8,rot:((v>>>6)&15)/16*TAU,type:ET[(v>>>2)&15]||'ghost',flash:v&2?.1:0,hidden:!!(v&1)}));
 const old=G.enemies;G.enemies=NE.map((n,i)=>{const o=old[i];if(o&&o.type===n.type&&Math.hypot(o.x-n.x,o.z-n.z)<3){o.tx=n.x;o.tz=n.z;o.rot=n.rot;o.flash=n.flash;if(o.hidden&&!n.hidden&&EDEF[o.type].water)surface(o);o.hidden=n.hidden;return o}return Object.assign(n,{tx:n.x,tz:n.z,ph:Math.random()*6,moving:0})});
 G.proj=unpack(s.J,v=>{const k=(v>>>7)&7,d=((v>>>1)&63)/64*TAU,kind=PK[k];return{kind:kind.replace('5',''),tier:kind.endsWith('5')?5:(v&1?3:1),x:(v>>>21)/8,z:((v>>>10)&2047)/8,y:k===7?1.6:1.25,vx:Math.sin(d)*PSPD[k],vz:Math.cos(d)*PSPD[k],spin:Math.random()*6,scale:1.2,tint:k===5?0xbfe4ff:0xffffff,glow:v&1?0x9fe8ff:0}});if(typeof s.Jy==='string')G.proj.forEach((b,i)=>{const c=s.Jy.charCodeAt(i);if(c>=48)b.y=(c-48)/10});
 const NI=unpack(s.I,v=>({x:(v>>>21)/8,z:((v>>>10)&2047)/8,type:IT[v&7]||'treasure'}));
 for(let i=0;i<Math.max(NI.length,G.items.length);i++){const n=NI[i],o=G.items[i];
  if(n&&o&&!o.gone&&o.type===n.type){o.x=n.x;o.z=n.z;o.mesh.position.x=n.x;o.mesh.position.z=n.z;continue}
  if(o&&!o.gone){G.lg.remove(o.mesh);o.gone=true}if(n){const m=new THREE.Mesh(ITEMGEO[n.type],IMAT[n.type]);m.position.set(n.x,0,n.z);G.lg.add(m);G.items[i]={type:n.type,x:n.x,z:n.z,mesh:m,ph:Math.random()*6}}}
 G.items.length=NI.length;
 const gs=new Map(String(s.Gn||'').split(',').filter(Boolean).map(t=>{const [a,b]=t.split('.');return[+a,+b]}));
 for(const g of G.gens){if(!gs.has(g.id)){if(!g.dead){g.dead=true;G.lg.remove(g.mesh)}}else g.hp=g.max*gs.get(g.id)/9}G.gens=G.gens.filter(g=>!g.dead);
 const cs=new Set(String(s.C||'').split(',').filter(Boolean).map(Number));for(const c of G.chests)if(!cs.has(c.id)&&!c.open){c.open=true;G.lg.remove(c.mesh)}G.chests=G.chests.filter(c=>!c.open);
 let ch=false;const ds=new Set(String(s.D||'').split(',').filter(Boolean).map(t=>parseInt(t,36)));for(const [k,m] of [...G.doorMesh])if(!ds.has(k)){G.lg.remove(m);G.doorMesh.delete(k);G.g[k]=0;ch=true}
 const ks=new Set(String(s.K||'').split(',').filter(Boolean).map(t=>parseInt(t,36)));for(const [k,c] of [...G.crack])if(!ks.has(k)){G.lg.remove(c.mesh);G.crack.delete(k);G.g[k]=0;ch=true}if(ch)drawMapBase();
 for(const f of Array.isArray(s.F)?s.F:[]){if(!Array.isArray(f))continue;if(f[0]===0){burst(f[1]/4,f[2]/4,f[3]/4,f[4]|0,Math.min(40,f[5]|0),5);sfx('kill')}else{ring(f[1]/4,f[3]/4,Math.min(30,f[5]|0),f[4]|0);sfx('slam')}}
 if(s.ov&&!G.over){G.over=true;if(document.pointerLockElement)document.exitPointerLock();showTouch();showOver('Game over','The party has fallen.')}}
function showOver(t,sub){$('#vrReady').hidden=true;if(renderer.xr.isPresenting){try{renderer.xr.getSession().end()}catch(e){}}$('#over h2').textContent=t;$('#overSub').textContent=sub;$('#finalScores').innerHTML=players.map(p=>`<tr><td style="color:${p.H.css}">${p.H.name}${p.ai?' (ally)':''} · ${esc(p.H.tiers[p.tier-1])}</td><td>${p.score.toLocaleString()} gold · ${p.kills} foes</td></tr>`).join('');$('#over').hidden=false;$('#againBtn').focus()}
function clientLocal(p,inp,dt){if(inp.fire&&!p.netFire)NET.cnt.fc=(NET.cnt.fc|0)+1;p.netFire=inp.fire;
 if(inp.fire&&p.cool<=0&&!(p.hero==='wizard'&&p.mana<2)){p.anim=1;p.cool=p.H.rate*(p.buff==='haste'&&p.buffT>0?.62:1);if(p.hero==='elf')p.draw=0;sfx({barbarian:'axe',elf:'arrow',wizard:'magic',valkyrie:'knife'}[p.hero])}
 if(inp.a1){NET.cnt.a1++;if(p.cd1<=0){if(p.hero==='elf'){const m=Math.hypot(p.mvx,p.mvz),f=fwd(p);p.dx=m>.1?p.mvx/m:f.x;p.dz=m>.1?p.mvz/m:f.z;p.dash=.22;p.dashSp=28;sfx('dash')}if(p.hero==='barbarian'){p.shake=.5;rumble(p,350,1)}if(p.hero==='valkyrie')p.anim=1;if(p.hero==='wizard'&&p.mana>=25)p.healAt=performance.now()}}
 if(inp.a2){NET.cnt.a2++;if(p.hero==='wizard'){p.anim2=1;p.staffAt=performance.now();sfx('swing')}}
 if(inp.pot)NET.cnt.pt++;if(inp.eat)NET.cnt.ea++;
 if(p.hp<p.max*.1&&G.time>p.nextDie){p.nextDie=G.time+20;p.nextWarn=G.time+10;say(p.H.name+' is about to die!',true)}else if(p.hp<p.max*.25&&G.time>p.nextWarn){p.nextWarn=G.time+25;say(p.H.name+' needs food, badly!',true)}}
function clientUpdate(dt){const nr=NET.nr;let hp=null;
 if(nr)for(const pr of nr.peers())if(!pr.sameTab&&pr.presence&&pr.presence.g){hp=pr;break}
 if(hp){const s=hp.presence.g;if(s&&s.t!==NET.lastTick){const first=NET.lastTick<0;NET.hostSeen=performance.now();NET.lastTick=s.t;applySnap(s);if(first&&NET.wantVR&&!renderer.xr.isPresenting){NET.wantVR=false;$('#vrReady').hidden=false}}if(s&&s.ps&&!(G.bannerT>.3))banner('The host paused the game','It carries on when they resume',1)}
 else if(nr&&NET.lastTick<0&&!G.over&&!(G.bannerT>.3)&&performance.now()-NET.hostSeen>3000){banner('Connecting to the host…','Keep the host’s game open. This can take a few seconds',1)}
 if(nr&&performance.now()-NET.hostSeen>(NET.lastTick<0?35000:15000)&&!G.over){G.over=true;if(document.pointerLockElement)document.exitPointerLock();showTouch();showOver('Connection lost','The host’s game ended or this device lost the connection.')}

 if(nr&&(NET.sendT-=dt)<=0){NET.sendT=.05;const p=players[0];let ay=p.yaw,y=p.yaw,ap=p.pitch;
  if(renderer.xr.isPresenting){p.cam.getWorldDirection(_v);y=ay=Math.atan2(-_v.x,-_v.z);ap=Math.asin(clamp(_v.y,-1,1));if(vrHandAim(p)&&VRART.on&&XR.right){vrAimVec(p,_v);if(Math.hypot(_v.x,_v.z)>.01){ay=Math.atan2(-_v.x,-_v.z);ap=Math.asin(clamp(_v.y/(_v.length()||1),-1,1))}}else if(XR.right&&!VRART.on){XR.right.getWorldQuaternion(_q);_v.set(0,0,-1).applyQuaternion(_q);if(Math.hypot(_v.x,_v.z)>.01){ay=Math.atan2(-_v.x,-_v.z);ap=Math.asin(clamp(_v.y,-1,1))}}}
  try{const r=nr.presence({me:{id:NET.myId,h:p.hero,dv:DEV,s:G.seed,x:+p.x.toFixed(2),z:+p.z.toFixed(2),y:+y.toFixed(3),ay:+ay.toFixed(3),ap:+ap.toFixed(3),mv:p.moving>.5?1:0,f:p.alive&&p.netFire?1:0,fc:NET.cnt.fc|0,a1:NET.cnt.a1,a2:NET.cnt.a2,pt:NET.cnt.pt,ea:NET.cnt.ea,as:(p.ctrl==='touch'||p.ctrl.startsWith('gp'))?1:0}});if(r&&r.catch)r.catch(()=>{})}catch(e){}}
 if(!G.lg)return;
 for(const p of players){if(p.puppet){const k=Math.min(1,dt*12);p.x+=(p.tx-p.x)*k;p.z+=(p.tz-p.z)*k;syncPlayer(p,false,dt)}else updatePlayer(p,dt)}
 for(const e of G.enemies){if(e.tx===undefined)continue;const k=Math.min(1,dt*14),ox=e.x,oz=e.z;e.x+=(e.tx-e.x)*k;e.z+=(e.tz-e.z)*k;e.moving+=((Math.hypot(e.x-ox,e.z-oz)>dt*.4?1:0)-e.moving)*Math.min(1,dt*6)}
 for(const b of G.proj){b.x+=b.vx*dt;b.z+=b.vz*dt;b.spin+=dt*16}
 updateParts(dt);animItems(dt);G.flash=Math.max(0,G.flash-dt*2.2);
 const tmr=$('#timer');if(G.treasure){tmr.hidden=false;tmr.textContent=G.timer+'s'}else tmr.hidden=true;
}
function lobbyHosts(peers){return peers.filter(p=>!p.sameTab&&p.presence&&p.presence.host&&typeof p.presence.host.code==='string'&&/^g[a-z0-9]{1,12}$/.test(p.presence.host.code)).map(p=>p.presence.host)
 .filter(h=>!NET.p2p||!h.vis||h.vis==='public'||(h.vis==='wifi'&&LAN.h&&h.lan===LAN.h)).sort((a,b)=>(b.lan===LAN.h)-(a.lan===LAN.h))}
function renderLobby(){const box=$('#netList');if(!box)return;$('#joinCodeVR').hidden=!navigator.xr;if(!NET.room){box.innerHTML='';return}const hs=NET.hosts;
 $('#netStatus').textContent=hs.length?'Open games. Pick your hero in Player 1 above, then join:':NET.p2p?'No open games right now. Start one with “Enter the dungeon”. Phones, tablets and headsets on the same WiFi will see it here, or friends can type your room code.':'No game running yet. Start one on any device with “Enter the dungeon”. Then open this same page on your other devices (headset, phone, tablet); the game shows up here to join.';
 box.innerHTML=hs.map(h=>{const here=LAN.h&&h.lan===LAN.h;return`<div class="game"><span>Game on the ${esc(h.dv)} · Level ${h.lv|0} · ${h.n|0}/4 heroes${here?'<i class="tag">On your WiFi</i>':h.vis==='public'?'<i class="tag pub">Public</i>':''}</span>${(h.n|0)>=4?'<em>Full</em>':`<button class="alt" data-join="${esc(h.code)}">Join</button>${navigator.xr?`<button class="alt" data-joinvr="${esc(h.code)}">Join in VR</button>`:''}`}</div>`}).join('')}
$('#netList').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const c=b.dataset.join||b.dataset.joinvr;if(c&&/^g[a-z0-9]{1,12}$/.test(c))joinGame(c,!!b.dataset.joinvr)});
// room codes: shown to the host on the pause screen, typed (or opened as a link / QR) by friends
function codeOf(raw){let c=String(raw||'').toLowerCase().replace(/[^a-z0-9]/g,'');if(c&&c[0]!=='g')c='g'+c;return/^g[a-z0-9]{4,12}$/.test(c)?c:null}
function showRoomInfo(){const ri=$('#roomInfo');if(!ri||!NET.code)return;const shown=NET.code.slice(1).toUpperCase(),link=location.href.split(/[?#]/)[0]+'?join='+shown;
 ri.innerHTML=`Room code<b>${esc(shown)}</b>${NET.p2p&&/^https:/.test(location.href)?`<img alt="QR code to join this game" src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}">Scan with a phone, or open the page and type the code.`:'Friends type this code under “Play together”.'}`;ri.hidden=false}
function joinByCode(vr){const c=codeOf($('#joinCode').value);if(!c){menuMsg('Type the room code shown on the host’s pause screen.');return}if(!NET.room){menuMsg('Online play is still connecting. Try again in a moment.');return}joinGame(c,vr)}
$('#joinCodeBtn').addEventListener('click',()=>joinByCode(false));$('#joinCodeVR').addEventListener('click',()=>joinByCode(true));
$('#joinCode').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();joinByCode(false)}});
// on-screen number pad, so codes can be entered with a VR controller pointer, a mouse or a finger without the system keyboard
for(const b of document.querySelectorAll('#codePad button')){b.addEventListener('pointerdown',e=>e.preventDefault());b.addEventListener('click',()=>{const inp=$('#joinCode'),k=b.dataset.k;
 if(k==='del')inp.value=inp.value.slice(0,-1);else if(k==='go')joinByCode(false);else if(k==='govr')joinByCode(true);else if(inp.value.replace(/\D/g,'').length<6)inp.value=inp.value.replace(/\D/g,'')+k;try{sfx('pick')}catch(x){}})}
{const sel=$('#netVis');try{const v=localStorage.getItem('sgvr_vis');if(v&&[...sel.options].some(o=>o.value===v))sel.value=v}catch(x){}NET.vis=sel.value;sel.addEventListener('change',()=>{NET.vis=sel.value;try{localStorage.setItem('sgvr_vis',sel.value)}catch(x){}advertise()})}
{const q=new URLSearchParams(location.search).get('join');if(q&&codeOf(q)){$('#joinCode').value=q.toUpperCase();setTimeout(()=>menuMsg('Pick your hero in Player 1, then press Join next to the room code.'),50)}}

// devices on the same WiFi share one public address; only a scrambled tag of it is shared, never the address itself
(async()=>{try{const r=await fetch('https://api.ipify.org?format=json',{cache:'no-store'});const j=await r.json();let h=7;for(const c of String(j.ip)+'|sgvr')h=(Math.imul(h,31)+c.charCodeAt(0))|0;LAN.h=(h>>>0).toString(36)}catch(e){LAN.h=null}advertise();
 if(NET.room)NET.hosts=lobbyHosts(NET.room.peers?NET.room.peers():[]);renderLobby()})();

// online play outside claude.ai: peer-to-peer rooms through Trystero (no game server needed)
const P2P_APP='super-gauntlet-vr-v1';
async function loadTrystero(){if(window.__TRYSTERO)return window.__TRYSTERO;for(const u of ['https://esm.run/trystero@0.21.8','https://esm.sh/trystero@0.21.8']){try{const m=await import(u);if(m&&m.joinRoom)return m}catch(e){}}return null}
function p2pRoom(T,name){const room=T.joinRoom({appId:P2P_APP},name),[send,get]=room.makeAction('pres'),others=new Map(),subs=[];let mine={};
 const list=()=>[...others.values()].map(v=>({sameTab:false,presence:v}));
 const fire=()=>{const l=list();for(const f of subs)try{f({peers:l})}catch(e){}};
 get((d,id)=>{if(d&&typeof d==='object'&&!Array.isArray(d)){others.set(id,d);fire()}});
 room.onPeerJoin(id=>{try{send(mine,id)}catch(e){}});room.onPeerLeave(id=>{others.delete(id);fire()});
 return{presence(o){mine=Object.assign({},mine,o);try{send(mine)}catch(e){}return Promise.resolve()},peers:list,onPeers(f){subs.push(f);return()=>{}},
  leave(){try{room.leave()}catch(e){}others.clear();return Promise.resolve()},join:async code=>p2pRoom(T,'game-'+code)}}
(async()=>{try{let r=null;
 if(window.claude&&window.claude.use){try{r=await window.claude.use('room')}catch(e){r=null}}
 if(!r){const T=await loadTrystero();if(!T){$('#netStatus').textContent='Online play could not connect. Check the internet connection and reload the page.';return}r=p2pRoom(T,'lobby');NET.p2p=true}
 NET.room=r;setTimeout(prepRoom,500);$('#netVis').closest('.netrow').hidden=!NET.p2p;r.onPeers(ch=>{NET.hosts=lobbyHosts(ch.peers);renderLobby()},()=>{NET.room=null;renderLobby()});advertise();renderLobby()}catch(e){$('#netStatus').textContent='Online play could not start on this device.'}})();

// ---------- touch controls (phones and tablets)
const TOUCH={mx:0,my:0,dx:0,dy:0,fire:false,e:{}};
{const st=$('#tStick'),knob=st.querySelector('i');let sid=null,lid=null,lx=0,ly=0;
 const mv=e=>{const r=st.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let x=(e.clientX-cx)/60,y=(e.clientY-cy)/60;const l=Math.hypot(x,y);if(l>1){x/=l;y/=l}TOUCH.mx=x;TOUCH.my=y;knob.style.transform=`translate(${x*45}px,${y*45}px)`};
 st.addEventListener('pointerdown',e=>{sid=e.pointerId;try{st.setPointerCapture(e.pointerId)}catch(x){}mv(e);e.preventDefault()});st.addEventListener('pointermove',e=>{if(e.pointerId===sid)mv(e)});
 const end=e=>{if(e.pointerId===sid){sid=null;TOUCH.mx=TOUCH.my=0;knob.style.transform=''}};st.addEventListener('pointerup',end);st.addEventListener('pointercancel',end);
 const lk=$('#tLook');lk.addEventListener('pointerdown',e=>{lid=e.pointerId;lx=e.clientX;ly=e.clientY;try{lk.setPointerCapture(e.pointerId)}catch(x){}});lk.addEventListener('pointermove',e=>{if(e.pointerId!==lid)return;TOUCH.dx+=e.clientX-lx;TOUCH.dy+=e.clientY-ly;lx=e.clientX;ly=e.clientY});
 const le=e=>{if(e.pointerId===lid)lid=null};lk.addEventListener('pointerup',le);lk.addEventListener('pointercancel',le);
 for(const b of document.querySelectorAll('#tBtns .tb')){const k=b.dataset.b;b.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();if(k==='fire')TOUCH.fire=true;else TOUCH.e[k]=true});const up=()=>{if(k==='fire')TOUCH.fire=false};b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up)}
 $('#tPause').addEventListener('click',()=>{if(running())setPause(true)})}
addEventListener('touchstart',()=>{const hs=typeof humans==='function'&&G&&!G.demo?humans():[];if(hs.length===1&&(hs[0].ctrl==='km'||hs[0].ctrl.startsWith('gp'))&&!renderer.xr.isPresenting){hs[0].ctrl='touch';if(slots[0].ctrl==='km'){slots[0].ctrl='touch';try{saveSlots()}catch(e){}}showTouch()}},{passive:true});
function showTouch(){const p=humans()[0];const on=!!(p&&p.ctrl==='touch'&&running()&&!(G&&G.paused)&&!renderer.xr.isPresenting);$('#touch').hidden=!on;document.body.classList.toggle('touching',on);if(on){$('#tBtns [data-b=a2]').hidden=p.hero!=='wizard';$('#tBtns [data-b=a1]').textContent=p.H.a1;$('#tBtns [data-b=dash]').textContent=p.hero==='wizard'?'Blink':'Dash'}}

// ---------- menu
const CTRL=[['off','Not playing'],['km','Mouse + keyboard (WASD)'],['k2','Keyboard 2 (IJKL)'],['touch','Touch screen (phone / tablet)'],['gp0','Controller 1 (PS4 / Xbox)'],['gp1','Controller 2'],['gp2','Controller 3'],['gp3','Controller 4'],['ai','Computer ally']];
const slots=[{hero:'barbarian',ctrl:'km'},{hero:'elf',ctrl:'off'},{hero:'wizard',ctrl:'off'},{hero:'valkyrie',ctrl:'off'}];
try{const s=JSON.parse(localStorage.getItem('sgvr-slots')||'null');if(Array.isArray(s)&&s.length===4)s.forEach((v,i)=>{if(v&&HEROES[v.hero])slots[i].hero=v.hero;if(v&&CTRL.some(c=>c[0]===v.ctrl))slots[i].ctrl=v.ctrl})}catch(e){}
if(COARSE&&slots[0].ctrl==='km')slots[0].ctrl='touch';
const TOUCHDEV=COARSE||(navigator.maxTouchPoints>0&&!(window.matchMedia&&matchMedia('(pointer:fine)').matches));
if(TOUCHDEV&&slots[0].ctrl==='km')slots[0].ctrl='touch';
const saveSlots=()=>{try{localStorage.setItem('sgvr-slots',JSON.stringify(slots))}catch(e){}};
const stat=(l,f)=>`<div class="stat"><span>${l}</span><div><i style="width:${Math.round(f*100)}%"></i></div></div>`;
function renderSlots(){$('#slots').innerHTML=slots.map((s,i)=>{const H=HEROES[s.hero];return `<div class="slot ${s.ctrl!=='off'?'on':''}" style="--c:${H.css}"><div class="sh"><b>Player ${i+1}</b><span>${s.ctrl==='off'?'Not joined':H.name+(s.ctrl==='ai'?' (computer)':'')}</span></div><div class="heroes">${HK.map(k=>`<button class="hb" data-s="${i}" data-h="${k}" aria-pressed="${k===s.hero}" style="--c:${HEROES[k].css}">${ICON[k]}<span>${HEROES[k].name}</span></button>`).join('')}</div><p class="blurb">${H.blurb}</p>${stat('Health',H.hp/1000)}${stat('Speed',H.speed/7.2)}<label>Controls<select id="ctl${i}" data-s="${i}">${CTRL.map(c=>`<option value="${c[0]}"${c[0]===s.ctrl?' selected':''}>${c[1]}</option>`).join('')}</select></label></div>`}).join('')}
$('#slots').addEventListener('click',e=>{const b=e.target.closest('.hb');if(!b)return;const i=+b.dataset.s;slots[i].hero=b.dataset.h;if(slots[i].ctrl==='off'){const used=new Set(slots.map(s=>s.ctrl));const free=CTRL.map(c=>c[0]).find(c=>c!=='off'&&c!=='ai'&&!used.has(c)&&(c[0]!=='g'||(navigator.getGamepads&&navigator.getGamepads()[+c[2]])));slots[i].ctrl=free||(i===0?'km':'ai')}saveSlots();renderSlots();const nb=document.querySelector(`.hb[data-s="${i}"][data-h="${b.dataset.h}"]`);if(nb)nb.focus()});
$('#slots').addEventListener('change',e=>{const s=e.target.closest('select');if(!s)return;const i=+s.dataset.s,v=s.value;if(v!=='off'&&v!=='ai')slots.forEach((o,j)=>{if(j!==i&&o.ctrl===v)o.ctrl='off'});slots[i].ctrl=v;saveSlots();renderSlots();const n=$('#ctl'+i);if(n)n.focus()});
function menuMsg(t){$('#menuMsg').textContent=t}
function startGame(vr){let act=slots.filter(s=>s.ctrl!=='off').map(s=>({hero:s.hero,ctrl:s.ctrl}));
 if(!act.some(a=>a.ctrl!=='ai')){if(vr)act.unshift({hero:slots[0].hero,ctrl:'km'});else{menuMsg('At least one player needs real controls (keyboard or controller). The others can be computer allies.');return}}
 act=act.filter(a=>a.ctrl!=='ai').concat(act.filter(a=>a.ctrl==='ai'));
 menuMsg('');initAudio();unlockMusic();teardown();G=newState();players=act.map((s,i)=>makePlayer(s.hero,s.ctrl,i));
 // testing: start deeper in, with the weapon power you'd have earned by then
 {const q=+(new URLSearchParams(location.search).get('level'))||0,sel=+(($('#startLv')||{}).value)||1,sl=clamp(Math.round(q||sel),1,99);if(sl>1){G.level=sl;const pw=sl>=25?2000:sl>=20?1800:sl>=10?1050:sl>=7?420:0;for(const p of players){p.power=pw;p.tier=tierOf(pw);p.vm.setTier(p.tier)}}}
 applyQuality();buildLevel();buildHud();$('#menu').hidden=true;$('#timer').hidden=true;
 if(!vr&&players[0].ctrl==='km')lockPointer();startHosting();showTouch();const hn=humans().map(p=>p.H.name),an=players.filter(p=>p.ai).map(p=>p.H.name);say('Welcome, '+hn.join(' and ')+(an.length?'. Your allies: '+an.join(' and '):'')+'. Level 1.',true)}
function quitWarning(){const others=players.filter(q=>q.net).length;if(NET.mode==='host'&&others)return'You are the host. Quitting ends the game for everyone ('+others+(others>1?' other players':' other player')+').';if(NET.mode==='client')return'You will leave this game. The others keep playing.';return'Your progress in this dungeon will be lost.'}
function toMenu(){$('#quitAsk').hidden=true;$('#vrReady').hidden=true;NET.wantVR=false;const ri=$('#roomInfo');if(ri){ri.hidden=true;ri.innerHTML=''}if(NET.nr){try{const r=NET.nr.leave();if(r&&r.catch)r.catch(()=>{})}catch(e){}NET.nr=null}NET.mode=null;advertise();setTimeout(prepRoom,300);$('#over h2').textContent='Game over';if(document.pointerLockElement)document.exitPointerLock();if(renderer.xr.isPresenting){try{renderer.xr.getSession().end()}catch(e){}}teardown();G=newState();G.demo=true;buildLevel();$('#pause').hidden=true;$('#over').hidden=true;$('#menu').hidden=false;$('#banner').classList.remove('show');renderSlots();renderLobby();showTouch();$('#startBtn').focus()}
// headset off, system menu open, app switched or tab hidden: pause; put the headset back on: resume after a short countdown
let autoPaused=false,autoT=0;
function autoPause(){if(running()&&!G.paused){setPause(true);autoPaused=true;clearTimeout(autoT)}}
function autoResume(){if(!autoPaused||!G||!G.paused)return;clearTimeout(autoT);banner('Welcome back','The game carries on in 3 seconds',3);autoT=setTimeout(()=>{if(autoPaused&&G&&G.paused){autoPaused=false;setPause(false);bgmT=-9999;music()}},3000)}
function watchXR(s){s.addEventListener('visibilitychange',()=>{if(s.visibilityState==='visible')autoResume();else autoPause()});s.addEventListener('end',()=>{onVREnd();autoPause();autoPaused=false})}
document.addEventListener('visibilitychange',()=>{if(document.hidden)autoPause();else if(!renderer.xr.isPresenting)autoPaused=false});
function setPause(v){{const vb=$('#vrBack');if(vb)vb.hidden=!(v&&XRSUP.ok&&!renderer.xr.isPresenting)}if(renderer.xr.isPresenting){if(v&&G&&!G.demo)vrMenuOpen();else vrMenuClose()}else vrMenuClose();if(!v){autoPaused=false;clearTimeout(autoT)}if(!G||G.demo)return;G.paused=v;$('#pause').hidden=!v;showTouch();if(v){if(document.pointerLockElement)document.exitPointerLock();$('#resumeBtn').focus()}}
const musicLbl=()=>{$('#musicBtn').textContent=$('#music2').textContent='Music: '+(musicOn?'on':'off')};
$('#startBtn').addEventListener('click',()=>startGame(false));
$('#vrBtn').addEventListener('click',enterVR);$('#vrReadyBtn').addEventListener('click',()=>{$('#vrReady').hidden=true;enterVR()});$('#vrReadyNo').addEventListener('click',()=>{$('#vrReady').hidden=true});$('#vrBack').addEventListener('click',()=>{setPause(false);enterVR()});
$('#musicBtn').addEventListener('click',()=>{musicOn=!musicOn;musicLbl()});$('#music2').addEventListener('click',()=>{musicOn=!musicOn;musicLbl()});
$('#quality').value=quality;$('#quality').addEventListener('change',e=>{quality=e.target.value;try{localStorage.setItem('sgvr-q',quality)}catch(x){}applyQuality()});
$('#resumeBtn').addEventListener('click',()=>{setPause(false);initAudio();bgmT=-9999;music();if(players[0]&&players[0].ctrl==='km'&&!renderer.xr.isPresenting)lockPointer()});
$('#quitBtn').addEventListener('click',()=>{$('#quitMsg').textContent=quitWarning();$('#quitAsk').hidden=false;$('#quitNo').focus()});$('#quitYes').addEventListener('click',()=>{$('#quitAsk').hidden=true;toMenu()});$('#quitNo').addEventListener('click',()=>{$('#quitAsk').hidden=true;$('#resumeBtn').focus()});$('#againBtn').addEventListener('click',toMenu);
renderSlots();applyQuality();G=newState();G.demo=true;buildLevel();

// ---------- pause menu inside the headset: click the left thumbstick to open it; thumbstick up/down to choose, trigger or A/X to press
const XRSUP={ok:false};try{if(navigator.xr&&navigator.xr.isSessionSupported)navigator.xr.isSessionSupported('immersive-vr').then(v=>{XRSUP.ok=!!v}).catch(()=>{})}catch(e){}
const VRM={mesh:null,c:null,sel:0,prev:{},nav:0,items:[]};
function vrMenuItems(){return[['resume','Resume'],['turn','Turning: '+({snap30:'snap 30°',snap45:'snap 45°',smooth:'smooth'}[COMF.turn])],['vig','Comfort vignette: '+(COMF.vig?'on':'off')],['hands','Hands: '+(VRART.on?'my art':'3D models')],['music','Music: '+(musicOn?'on':'off')],['quit',VRM.sure?'Press again to quit':'Quit to hero select']]}
function vrMenuDraw(){const c=VRM.c,x=c.getContext('2d');VRM.items=vrMenuItems();x.clearRect(0,0,1024,1000);
 x.fillStyle='rgba(14,9,6,.92)';x.strokeStyle='#ffc35a';x.lineWidth=6;x.beginPath();x.roundRect?x.roundRect(6,6,1012,988,28):x.rect(6,6,1012,988);x.fill();x.stroke();
 x.textAlign='center';x.fillStyle='#ffc35a';x.font='bold 64px serif';x.fillText('Paused',512,86);
 const rc=roomCode();if(rc){x.fillStyle='#e8d6b4';x.font='30px sans-serif';x.fillText(NET.mode==='host'?'Friends join with this room code':'You are in game',512,140);x.fillStyle='#fff1d0';x.font='bold 96px sans-serif';x.fillText(rc,512,236);
  x.fillStyle='#bfae90';x.font='26px sans-serif';x.fillText('Open the game on another device, type the code under “Play together”',512,282)}
 else{x.fillStyle='#bfae90';x.font='28px sans-serif';x.fillText('Not playing online right now',512,170)}
 VRM.items.forEach(([k,t],i)=>{const y=320+i*96,on=i===VRM.sel;x.fillStyle=on?'#c8741e':'rgba(255,255,255,.08)';x.fillRect(212,y,600,84);x.strokeStyle=on?'#ffe0a0':'rgba(255,220,160,.35)';x.lineWidth=on?5:2;x.strokeRect(212,y,600,84);x.fillStyle='#fff4dc';x.font='bold 42px sans-serif';x.fillText(t,512,y+56)});
 if(VRM.sure){x.fillStyle='#ff9a70';x.font='bold 26px sans-serif';x.fillText(quitWarning(),512,930)}x.fillStyle='#9d8c70';x.font='24px sans-serif';x.fillText('Thumbstick up/down to choose · trigger or A/X to press · click left stick to resume',512,966);x.textAlign='left';VRM.mesh.material.map.needsUpdate=true}
function vrMenuOpen(){const p=players[0];if(!p)return;if(!VRM.mesh){VRM.c=document.createElement('canvas');VRM.c.width=1024;VRM.c.height=1000;
  VRM.mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.074),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(VRM.c),transparent:true,depthTest:false,fog:false}));VRM.mesh.renderOrder=999;VRM.mesh.frustumCulled=false}
 VRM.sel=0;VRM.sure=false;const pos=new THREE.Vector3(),dir=new THREE.Vector3();p.cam.getWorldPosition(pos);p.cam.getWorldDirection(dir);dir.y=0;if(dir.lengthSq()<1e-4)dir.set(0,0,-1);dir.normalize?dir.normalize():0;
 VRM.mesh.position.set(pos.x+dir.x*1.3,pos.y-.05,pos.z+dir.z*1.3);VRM.mesh.rotation.set(0,Math.atan2(-dir.x,-dir.z),0);if(VRM.mesh.parent!==scene)scene.add(VRM.mesh);VRM.mesh.visible=true;vrMenuDraw()}
function vrMenuClose(){if(VRM.mesh)VRM.mesh.visible=false}
function vrMenuTick(){const s=renderer.xr.getSession();if(!s)return;const now={};let sy=0;
 for(const src of s.inputSources){const gp=src.gamepad;if(!gp)continue;const b=i=>!!(gp.buttons[i]&&gp.buttons[i].pressed),ax=gp.axes,y=ax.length>=4?ax[3]:ax[1]||0;
  if(src.handedness==='left'){now.ls=b(3);now.lt=b(0);now.x=b(4)}else{now.rt=b(0);now.a=b(4)}if(Math.abs(y)>Math.abs(sy))sy=y}
 const pr=VRM.prev,hit=k=>now[k]&&!pr[k];VRM.prev=now;
 if(hit('ls')){if(running()&&!G.paused)setPause(true);else if(G.paused){setPause(false);bgmT=-9999;music()}return}
 if(!G.paused||!VRM.mesh||!VRM.mesh.visible)return;
 const d=sy>.6?1:sy<-.6?-1:0;if(d&&d!==VRM.nav){VRM.sure=false;VRM.sel=(VRM.sel+d+VRM.items.length)%VRM.items.length;vrMenuDraw();try{sfx('pick')}catch(e){}}VRM.nav=d;
 if(hit('rt')||hit('a')||hit('x')||hit('lt')){const k=VRM.items[VRM.sel][0];
  if(k==='resume'){setPause(false);bgmT=-9999;music()}else if(k==='music'){musicOn=!musicOn;musicLbl();vrMenuDraw()}else if(k==='hands'){setVRArt(!VRART.on);vrMenuDraw()}else if(k==='turn'){setComf('turn',{snap30:'snap45',snap45:'smooth',smooth:'snap30'}[COMF.turn]);vrMenuDraw()}else if(k==='vig'){setComf('vig',!COMF.vig);vrMenuDraw()}
  else if(k==='quit'){if(!VRM.sure){VRM.sure=true;vrMenuDraw()}else{VRM.sure=false;vrMenuClose();try{s.end()}catch(e){}toMenu()}}}}

// ---------- your first-person art inside the headset: the same shots as on the screen, held in front of your view
const VRART={on:true,planes:{},tex:{},hero:null};
try{const v=localStorage.getItem('sgvr_vrart');if(v)VRART.on=v==='1'}catch(e){}
function setVRArt(v){VRART.on=!!v;try{localStorage.setItem('sgvr_vrart',VRART.on?'1':'0')}catch(e){}const p=players[0];if(p&&p.vm)p.vm.root.visible=!VRART.on;if(!VRART.on)vrArtHide()}
function vrTex(n){let t=VRART.tex[n];if(!t){t=VRART.tex[n]=texLoader.load('fp/'+n+'.webp');t.encoding=THREE.sRGBEncoding}return t}
function vrPlane(w,h){const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({transparent:true,alphaTest:.03,depthTest:false,depthWrite:false,fog:false}));m.renderOrder=990;m.frustumCulled=false;return m}
function vrArtHide(){for(const k in VRART.planes){const P=VRART.planes[k];P.a.visible=false;if(P.b)P.b.visible=false}}
const VRH=1.3,VRZ=-.72,VRW=VRH*16/9;// the flat screen's frame, rebuilt at arm's length
// VR Wizard: your right hand is his glowing magic hand on its sleeve; your left holds the staff on the other sleeve.
// Each hand turns freely at the wrist with the controller, and each sleeve reaches back from the wrist toward your shoulder.
const WH={hand:null,staff:null,sr:null,sl:null};const _wq=new THREE.Quaternion(),_wp=new THREE.Vector3(),_m4=new THREE.Matrix4(),_X=new THREE.Vector3(),_Y=new THREE.Vector3(),_Z=new THREE.Vector3(),_hd=new THREE.Vector3(),_sh=new THREE.Vector3(),_cr=new THREE.Vector3(),_wr=new THREE.Vector3(),_f=new THREE.Vector3();
const WHD={hand:{w:.155,h:.195,g:[.731,.81],cuff:[.731,.81],dir:[.68,-.73],L:.47,T:.17},staff:{w:.2215,h:.56,g:[.55,.74],cuff:[.484,.847],dir:[-.334,-.943],L:.52,T:.19},tuck:.02};
let p0=null;
function wizHide(){for(const k in WH)if(WH[k])WH[k].visible=false;hmHide('')}
function whMesh(name,w,h,ax,ay,order){const g=new THREE.PlaneGeometry(w,h);g.translate((.5-ax)*w,(ay-.5)*h,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:vrTex(name),transparent:true,alphaTest:.05,side:THREE.DoubleSide,fog:false}));m.frustumCulled=false;m.renderOrder=order;scene.add(m);return m}
function faceBasis(pos,dir){p0.cam.getWorldPosition(_Z);_Z.sub(pos);if(_Z.lengthSq()<1e-6)_Z.set(0,0,1);_Z.normalize();_Y.copy(dir).addScaledVector(_Z,-dir.dot(_Z));if(_Y.lengthSq()<1e-6)_Y.set(0,1,0);_Y.normalize();_X.crossVectors(_Y,_Z).normalize();_m4.makeBasis(_X,_Y,_Z);return _m4}
// The sleeve rides on the hand picture itself and is drawn over it: its cuff covers the wrist band and it runs the way that opening faces,
// so arm and hand always line up whichever way the hand turns.
function whSleeve(parent,name,D,right){const g=new THREE.PlaneGeometry(1,1);g.translate(right?.47:-.47,-.212,0);
 const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:vrTex(name),transparent:true,alphaTest:.05,side:THREE.DoubleSide,fog:false}));m.frustumCulled=false;m.renderOrder=988;
 const k=WHD.tuck;m.scale.set(D.L,D.T,1);m.position.set((D.cuff[0]-D.g[0])*D.w-D.dir[0]*k,(D.g[1]-D.cuff[1])*D.h-D.dir[1]*k,.002);
 m.rotation.z=right?Math.atan2(D.dir[1],D.dir[0]):Math.atan2(-D.dir[1],-D.dir[0]);parent.add(m);return m}
// 3D Wizard arms (from the user's Tripo models), loaded only when the Wizard is played in VR. Until they arrive the picture arms show.
// 3D arms (from the user's Tripo models), loaded only when that hero is played in VR. Until they arrive the picture arms show.
const HM={wizard:{state:0,f:['wiz_arm_r','wiz_arm_l']},valkyrie:{state:0,f:['valk_arm_r','valk_arm_l']},
 elf:{state:0,f:['elf_arm_r','elf_arm_l'],tx:{r:{fist:'elf_fist',open:'elf_open'},l:{bow:'elf_bow'}}},
 barbarian:{state:0,f:['barb_arm_r','barb_arm_l'],tx:{r:{hand:'barb_axe1',axe:'barb_axe1',hand5:'barb_axe5',axe5:'barb_axe5',empty:'barb_open_r'},l:{hand:'barb_open_l'}}}};
function wmPart(buf){const dv=new DataView(buf),jl=dv.getUint32(0,true),meta=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,4,jl)));let o=4+jl;const al=n=>n+((4-n%4)%4),out={};
 for(const m of meta){const q=new Uint16Array(buf,o,m.nv*3);o+=al(m.nv*6);const uq=new Uint16Array(buf,o,m.nv*2);o+=al(m.nv*4);const idx=m.i32?new Uint32Array(buf,o,m.ni):new Uint16Array(buf,o,m.ni);o+=al(m.ni*(m.i32?4:2));
  const pos=new Float32Array(m.nv*3),uv=new Float32Array(m.nv*2);for(let i=0;i<m.nv;i++){for(let k=0;k<3;k++)pos[i*3+k]=m.mn[k]+q[i*3+k]/65535*(m.mx[k]-m.mn[k]);uv[i*2]=uq[i*2]/65535;uv[i*2+1]=uq[i*2+1]/65535}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setIndex(new THREE.BufferAttribute(idx,1));g.computeVertexNormals();out[m.name]=g}
 return out}
function hmLoad(hero){const M=HM[hero];if(!M||M.state)return;M.state=1;
 const TC={},tex=(n,lin)=>{if(TC[n])return TC[n];const t=texLoader.load('fp/'+n+'.jpg');if(!lin)t.encoding=THREE.sRGBEncoding;t.nm=n;return TC[n]=t};
 // Phong so Tripo's bumpy-detail (normal) maps show: leather grain, knuckles, engraving
 const mat=t=>new THREE.MeshPhongMaterial({map:t,normalMap:t&&t.nm?tex(t.nm+'_n',1):null,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.4,shininess:14,specular:0x262220,side:THREE.DoubleSide});
 const MC={},grp=(parts,t,t2,tx)=>{const g=new THREE.Group();g.parts={};const m=mat(t);for(const k in parts){const own=tx&&tx[k];const x=new THREE.Mesh(parts[k],k==='disk'?new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}):/^(dagger|axe)/.test(k)?mat(own?tex(own):t):own?(MC[own]||(MC[own]=mat(tex(own)))):k==='empty'?mat(t2):m);x.frustumCulled=false;x.renderOrder=986;g.add(x);g.parts[k]=x}g.visible=false;return g};
 Promise.all(M.f.map(n=>fetch(V('fp/'+n+'.txt')).then(r=>{if(!r.ok)throw 0;return r.text()}).then(t=>{const b=atob(t.trim()),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer}))).then(([br,bl])=>{
  const tx=M.tx||{},tl=tx.l?null:tex(M.f[1]),tr=tx.r?null:tex(M.f[0]);M.r=grp(wmPart(br),tr,tl,tx.r);M.l=grp(wmPart(bl),tl,null,tx.l);
  if(M.f[0]==='valk_arm_r'){const tw=new THREE.Group();tw.scale.x=-1;tw.parts={};for(const k of ['hand','dagger','empty']){const src=M.r.parts[k];if(!src)continue;const x=new THREE.Mesh(src.geometry,src.material);x.frustumCulled=false;x.renderOrder=986;tw.add(x);tw.parts[k]=x}tw.visible=false;M.l.add(tw);M.l.twin=tw}M.state=2}).catch(()=>{M.state=3})}
function vrHandAim(p){return p.hero==='wizard'||(p.hero==='valkyrie'||p.hero==='barbarian'||p.hero==='elf'&&XR.left)&&HM[p.hero].state===2}
// where a VR shot comes from: the right controller, or for the Elf the bow (nock to grip while drawn, else where the bow hand points)
function vrAimVec(p,v){if(p.hero==='elf'&&XR.left){if(ELF.drawn)return v.copy(ELF.grip).sub(ELF.nock).normalize();XR.left.getWorldQuaternion(_q);return v.set(0,0,-1).applyQuaternion(_q)}XR.right.getWorldQuaternion(_q);return v.set(0,0,-1).applyQuaternion(_q)}
function vrAimPos(p,v){return (p.hero==='elf'&&XR.left?XR.left:XR.right).getWorldPosition(v)}
// Elf: bow in the left hand (its limbs bend as you draw), string from tip to tip, arrow nocked from the right fist; on release the open hand shows
const ELF={drawn:false,nock:new THREE.Vector3(),grip:new THREE.Vector3()},EB={u:[-.119,.993,0],a:[-.03,-.004,1],tT:[-.014,.463,.118],tB:[.096,-.452,.118]},_nl=new THREE.Vector3(),_tg=new THREE.Vector3();
function elfArrow(){const g=new THREE.Group(),wood=new THREE.MeshLambertMaterial({color:0x8a5a30}),head=new THREE.MeshLambertMaterial({color:0xb8c0c8,emissive:0x000000}),fl=new THREE.MeshLambertMaterial({color:0x3f7a3a,side:THREE.DoubleSide});
 const sh=new THREE.Mesh(new THREE.CylinderGeometry(.0045,.0045,.7,6),wood);sh.rotation.x=PI/2;sh.position.z=.35;g.add(sh);
 const hd=new THREE.Mesh(new THREE.ConeGeometry(.012,.05,6),head);hd.rotation.x=PI/2;hd.position.z=.72;g.add(hd);g.head=hd;
 for(let k=0;k<3;k++){const pv=new THREE.Group();pv.rotation.z=k*TAU/3;const f=new THREE.Mesh(new THREE.PlaneGeometry(.08,.022),fl);f.rotation.y=PI/2;f.position.set(0,.012,.07);pv.add(f);g.add(pv)}
 g.traverse(o=>{o.frustumCulled=false;o.renderOrder=986});return g}
function elfModelTick(p){const M=HM.elf,a=p.anim;hmAttach(M);
 if(!M.rest){const g=M.l.parts.bow.geometry;M.rest=g.attributes.position.array.slice();M.k=-1;
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(9),3));M.str=new THREE.Line(sg,new THREE.LineBasicMaterial({color:0xe8e2d0}));M.str.frustumCulled=false;M.l.add(M.str);
  M.arrow=elfArrow();M.l.add(M.arrow)}
 const rel=a>.12,u=EB.u,ar=EB.a;
 _nl.set(0,.01,-.04);XR.right.localToWorld(_nl);ELF.nock.copy(_nl);M.l.worldToLocal(_nl);M.l.getWorldPosition(ELF.grip);
 const d=_nl.x*ar[0]+_nl.y*ar[1]+_nl.z*ar[2],along=_nl.x*u[0]+_nl.y*u[1]+_nl.z*u[2];
 const drawn=!rel&&d>.06&&_nl.length()<.9&&Math.abs(along)<.35,k=drawn?clamp((d-.06)/.45,0,1):0;ELF.drawn=drawn;
 if(Math.abs(k-M.k)>.01){M.k=k;const g=M.l.parts.bow.geometry,P=g.attributes.position.array,R=M.rest,b=.09*k;
  for(let i=0;i<P.length;i+=3){const s=(R[i]*u[0]+R[i+1]*u[1]+R[i+2]*u[2])/.46,w0=Math.max(0,Math.abs(s)-.1),w=w0*w0/.81*b;P[i]=R[i]+ar[0]*w;P[i+1]=R[i+1]+ar[1]*w;P[i+2]=R[i+2]+ar[2]*w}
  g.attributes.position.needsUpdate=true}
 const b=.09*k,S=M.str.geometry.attributes.position.array;
 S[0]=EB.tT[0]+ar[0]*b;S[1]=EB.tT[1]+ar[1]*b;S[2]=EB.tT[2]+ar[2]*b;S[6]=EB.tB[0]+ar[0]*b;S[7]=EB.tB[1]+ar[1]*b;S[8]=EB.tB[2]+ar[2]*b;
 if(drawn){S[3]=_nl.x;S[4]=_nl.y;S[5]=_nl.z}else{S[3]=(S[0]+S[6])/2;S[4]=(S[1]+S[7])/2;S[5]=(S[2]+S[8])/2}M.str.geometry.attributes.position.needsUpdate=true;
 const A=M.arrow;A.visible=!rel;if(!rel){A.position.copy(_nl);if(drawn)A.lookAt(ELF.grip);else{XR.right.getWorldQuaternion(_q);_tg.set(0,0,-1).applyQuaternion(_q).add(ELF.nock);A.lookAt(_tg)}
  const gl=p.tier>=3&&p.H.glow?p.H.glow[p.tier-1]:0;A.head.material.emissive.setHex(gl||0)}
 M.r.parts.fist.visible=!rel;M.r.parts.open.visible=rel;M.r.position.set(0,0,0);M.r.rotation.z=0}
function hmHide(except){for(const k in HM){const M=HM[k];if(M.state===2&&k!==except)M.r.visible=M.l.visible=false}}
function hmAttach(M){if(M.r.parent!==XR.right)XR.right.add(M.r);if(M.l.parent!==XR.left)XR.left.add(M.l);M.r.visible=M.l.visible=true}
// Barbarian: plain axe in his right fist (skull axe at tier 5, glowing from tier 3); on the throw it's gone and his open hand shows; open gauntlet hand on the left
function barbModelTick(p){const M=HM.barbarian,a=p.anim,t=p.tier;hmAttach(M);
 const snap=a>.55?Math.sin((1-a)/.45*PI):0;M.r.position.set(0,snap*.04,-snap*.14);M.r.rotation.x=-snap*.7;
 const out=a>.12&&a<.7,five=t>=5,P=M.r.parts;P.hand.visible=P.axe.visible=!out&&!five;P.hand5.visible=P.axe5.visible=!out&&five;P.empty.visible=out;
 const ax=five?P.axe5:P.axe;ax.material.emissive.setHex(t>=3?(p.H.glow&&p.H.glow[t-1])||0xff8040:0xffffff);ax.material.emissiveIntensity=t>=3?.75:.4;
 M.l.position.set(0,Math.sin(p.bob||0)*.006,0)}
function wizModelTick(p){const M=HM.wizard,firing=p.anim>.05;hmAttach(M);
 M.r.position.set(0,0,firing?-.03*p.anim:0);M.r.parts.disk.material.color.setScalar(1+(firing?p.anim*.8:0));
 M.l.rotation.x=p.anim2>0?-Math.sin(Math.min(1,p.anim2)*PI)*.7:0;
 for(const k of ['hand','staff','sr','sl'])if(WH[k])WH[k].visible=false}
// Valkyrie: dagger in the right hand (thrown: the arm snaps forward and her open, empty hand shows until the next one is drawn), open bracer hand on the left
function valkModelTick(p){const M=HM.valkyrie,a=p.anim;hmAttach(M);
 const snap=a>.6?Math.sin((1-a)/.4*PI):0;M.r.position.set(0,snap*.03,-snap*.12);M.r.rotation.x=-snap*.5;
 const d=M.r.parts.dagger,out=a>.12&&a<.75;d.visible=M.r.parts.hand.visible=!out;if(M.r.parts.empty)M.r.parts.empty.visible=out;
 // tier 3+: she throws two at once, so her left hand holds a mirrored dagger and throws with the right
 const tw=M.l.twin,two=!!tw&&p.tier>=3;M.l.parts.hand.visible=!two;if(tw){tw.visible=two;tw.parts.hand.visible=tw.parts.dagger.visible=!out;if(tw.parts.empty)tw.parts.empty.visible=out}d.material.emissive.setHex(p.tier>=5?0x9fd8ff:p.tier>=3?0xffc070:0xffffff);d.material.emissiveIntensity=p.tier>=3?.8:.4;
 if(two){M.l.position.set(0,snap*.03,-snap*.12);M.l.rotation.x=-snap*.5}else{M.l.position.set(0,Math.sin(p.bob||0)*.006,0);M.l.rotation.x=0}}
function wizHandsTick(p){p0=p;hmLoad('wizard');if(HM.wizard.state===2){wizModelTick(p);return}if(!WH.hand){const H=WHD.hand,S=WHD.staff;WH.hand=whMesh('vr_hand_r',H.w,H.h,H.g[0],H.g[1],986);WH.staff=whMesh('vr_staff_l',S.w,S.h,S.g[0],S.g[1],986);
  WH.sr=whSleeve(WH.hand,'vr_sleeve_r',H,true);WH.sl=whSleeve(WH.staff,'vr_sleeve_l',S,false)}
 const firing=p.anim>.05;
 // right: magic hand (pivots at the wrist, points where the controller points, kicks a little when casting)
 XR.right.getWorldPosition(_wp);XR.right.getWorldQuaternion(_wq);_f.set(0,0,-1).applyQuaternion(_wq);
 WH.hand.quaternion.setFromRotationMatrix(faceBasis(_wp,_f));WH.hand.position.copy(_wp).addScaledVector(_f,firing?.03*p.anim:0);WH.hand.visible=true;WH.sr.visible=true;
 // left: staff in the fist
 XR.left.getWorldPosition(_wp);XR.left.getWorldQuaternion(_wq);_f.set(0,0,-1).applyQuaternion(_wq);_f.y+=.35;_f.normalize();
 WH.staff.quaternion.setFromRotationMatrix(faceBasis(_wp,_f));if(p.anim2>0)WH.staff.rotateZ(Math.sin(p.anim2*PI)*.7);WH.staff.position.copy(_wp);WH.staff.visible=true;WH.sl.visible=true}
function vrArtTick(p){if(!VRART.on||!p.alive||(G&&G.paused)){vrArtHide();wizHide();return}
 if(p.hero==='wizard'&&XR.left&&XR.right){vrArtHide();hmHide('wizard');wizHandsTick(p);return}
 if(p.hero==='elf'&&XR.left&&XR.right){hmLoad('elf');if(HM.elf.state===2){vrArtHide();for(const k in WH)if(WH[k])WH[k].visible=false;hmHide('elf');elfModelTick(p);return}}
 if(p.hero==='barbarian'&&XR.left&&XR.right){hmLoad('barbarian');if(HM.barbarian.state===2){vrArtHide();for(const k in WH)if(WH[k])WH[k].visible=false;hmHide('barbarian');barbModelTick(p);return}}
 if(p.hero==='valkyrie'&&XR.left&&XR.right){hmLoad('valkyrie');if(HM.valkyrie.state===2){vrArtHide();for(const k in WH)if(WH[k])WH[k].visible=false;hmHide('valkyrie');valkModelTick(p);return}}
 wizHide();
 let P=VRART.planes[p.hero];const wiz=p.hero==='wizard',L=FPL[p.hero];
 if(!P||P.cam!==p.cam){if(P){P.a.parent&&P.a.parent.remove(P.a);P.b&&P.b.parent&&P.b.parent.remove(P.b)}
  if(wiz){const w=VRW*1.22,h=w*9/16;P={a:vrPlane(w,h),b:vrPlane(w,h),w,h}}else{const h=VRH*.78*L.h;P={a:vrPlane(h*672/900,h),b:null,h}}
  P.cam=p.cam;p.cam.add(P.a);if(P.b)p.cam.add(P.b);VRART.planes[p.hero]=P}
 if(VRART.hero!==p.hero){vrArtHide();VRART.hero=p.hero}
 const S=FPSET[p.hero](p.tier,p),firing=p.anim>S.at,src=firing?S.fire:S.fire2&&p.anim>S.at2?S.fire2:S.idle;
 if(P.src!==src){P.src=src;P.a.material.map=vrTex(src);P.a.material.needsUpdate=true}
 const kick=(firing?18:p.anim*10)/700*VRH,bob=Math.sin(p.bob)*7/700*VRH,swing=wiz?0:p.hero==='barbarian'?-Math.sin(p.anim2*PI)*8:0;
 if(wiz){P.a.position.set(0,-VRH/2-.14*VRW+bob-kick*.4,VRZ);P.a.rotation.set(0,0,0);P.a.visible=true;
  const now=performance.now()/1000;if(p.vrDip===undefined)p.vrDip=now+5+Math.random()*6;let dip=0;const dt=now-p.vrDip;
  if(dt>0){dip=dt<.35?dt/.35:dt<1.15?1:dt<1.6?1-(dt-1.15)/.45:0;if(dt>=1.6)p.vrDip=now+6+Math.random()*7}
  const sw=p.anim2>0?Math.pow(Math.sin(Math.min(1,p.anim2)*PI),.6):0,d=Math.max(sw,dip*dip*(3-2*dip)),s2=firing?S.staffFire:S.staff;
  if(P.src2!==s2){P.src2=s2;P.b.material.map=vrTex(s2);P.b.material.needsUpdate=true}
  P.b.position.set(-d*.06*P.w,P.a.position.y-d*.78*P.h,VRZ+.001);P.b.rotation.set(0,0,-d*14*PI/180);P.b.visible=true}
 else{P.a.position.set((L.vdx!==undefined?L.vdx:(L.dx||0))*VRW,-VRH/2-L.dy*VRH+bob-kick,VRZ);P.a.rotation.set(0,0,-swing*PI/180);P.a.visible=true}}

// ---------- hidden healing springs with an angel princess (levels 10, 12, 14 ...)
const ANGEL_LINE='Brave hero, your quest is a hard one, and I wish to help you. Step into my healing waters and be restored.';
const ANGEL_FACE=new Image();ANGEL_FACE.src=V('sprites/angel_face.webp');
function ripTex(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');for(let i=0;i<7;i++){x.strokeStyle=`rgba(255,245,210,${.55-i*.06})`;x.lineWidth=5-i*.5;x.beginPath();x.arc(128,128,30+i*15,0,TAU);x.stroke()}return new THREE.CanvasTexture(c)}
function haloTex(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),gr=x.createRadialGradient(64,64,4,64,64,64);gr.addColorStop(0,'rgba(255,240,190,.9)');gr.addColorStop(.45,'rgba(255,220,150,.35)');gr.addColorStop(1,'rgba(255,210,140,0)');x.fillStyle=gr;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)}
function makePool(x,z){const grp=new THREE.Group();grp.position.set(x,0,z);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(2.3,.3,10,40),new THREE.MeshStandardMaterial({color:0xe2d8c6,roughness:.7}));rim.rotation.x=-PI/2;rim.position.y=.16;rim.receiveShadow=true;
 const water=new THREE.Mesh(new THREE.CircleGeometry(2.25,48),new THREE.MeshStandardMaterial({color:0x5cc8ee,emissive:0x2a9fd0,emissiveIntensity:.8,roughness:.06,metalness:.1,transparent:true,opacity:.9}));water.rotation.x=-PI/2;water.position.y=.13;
 const ring=new THREE.Mesh(new THREE.PlaneGeometry(4.4,4.4),new THREE.MeshBasicMaterial({map:ripTex(),transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}));ring.rotation.x=-PI/2;ring.position.y=.15;
 const ageo=new THREE.PlaneGeometry(1.35,2.7);ageo.translate(0,1.35,0);const angel=new THREE.Mesh(ageo,new THREE.MeshBasicMaterial({alphaTest:.4,side:THREE.DoubleSide}));angel.position.set(x,1.2,z);angel.frustumCulled=false;
 sprTex('angel',t=>{angel.material.map=cloneStrip(t);angel.material.needsUpdate=true});
 const halo=new THREE.Mesh(new THREE.PlaneGeometry(3.2,3.6),new THREE.MeshBasicMaterial({map:haloTex(),transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));halo.position.set(0,1.4,-.05);angel.add(halo);
 grp.add(rim,water,ring);G.lg.add(grp);G.lg.add(angel);
 G.pools.push({x,z,r:2.2,water,ring,angel,halo,greeted:new Set(),blessed:new Set(),spoke:false,bub:null,bubT:0})}
function sayAngel(t){try{const u=new SpeechSynthesisUtterance(t);u.rate=.92;u.pitch=1.5;const f=speechSynthesis.getVoices().find(v=>/female|samantha|zira|victoria|karen|moira|tessa|fiona|aria|jenny/i.test(v.name));if(f)u.voice=f;speechSynthesis.cancel();speechSynthesis.speak(u);sayT=performance.now()}catch(e){}}
function angelBubble(pl){if(!pl.bub){const c=document.createElement('canvas');c.width=1024;c.height=300;const x=c.getContext('2d');
  x.fillStyle='rgba(30,20,10,.92)';x.fillRect(0,0,1024,300);x.strokeStyle='#ffd98a';x.lineWidth=8;x.strokeRect(4,4,1016,292);
  try{x.save();x.beginPath();x.arc(150,150,112,0,TAU);x.clip();x.drawImage(ANGEL_FACE,38,38,224,224);x.restore()}catch(e){}
  x.fillStyle='#ffd98a';x.font='bold 40px serif';x.fillText('Angel Princess',290,70);x.fillStyle='#fff3dc';x.font='34px sans-serif';
  let line='',y=120;for(const w of ANGEL_LINE.split(' ')){if(x.measureText(line+w).width>700){x.fillText(line,290,y);line='';y+=44}line+=w+' '}x.fillText(line,290,y);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(1.9,.56),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false,fog:false}));m.renderOrder=995;m.position.set(pl.x,4.4,pl.z);G.lg.add(m);pl.bub=m}
 pl.bub.visible=true;pl.bubT=10}
// the angel's gifts, once per spring for each hero who steps in:
//  - the weapon jumps up a power level
//  - the first spring blesses every hero's weapon with light: thrown axes, knives, arrows and bolts light up the halls they fly through
//  - the Wizard's magic refills by itself, faster with each spring; from his second spring his bolts can turn monsters to stone
function angelBless(p){p.springs=(p.springs||0)+1;
 if(G.net!=='client'&&p.tier<5&&G.level<=16)gainPower(p,Math.max(0,TIERP[p.tier]-p.power));
 if(!G.glowShots){G.glowShots=true;banner('The angel blesses your weapons','Every shot now carries light into the dark',3);for(const q of humans())pmsg(q,'Your weapons now shine as they fly')}
 if(p.hero==='wizard'){p.manaRegen=Math.min(6,(p.manaRegen||0)+2);let m='Your magic now refills by itself';if(p.springs>=2){p.stone=Math.min(3,(p.stone||0)+1);m+=' · Your bolts can turn monsters to stone'}if(p.el)pmsg(p,m)}}
function poolTick(dt){const t=G.time;for(const p of players)if(p.manaRegen&&p.alive&&G.net!=='client')p.mana=Math.min(100,p.mana+p.manaRegen*dt);
 if(G.secret&&!G.secretOpen&&G.g[G.secret.k]===0){G.secretOpen=true;drawMapBase();sfx('up');for(const q of humans())pmsg(q,'A hidden spring!')}
 for(const p of players){if(p.blessT>0)p.blessT-=dt;if(p.sayT>0){p.sayT-=dt;if(p.sayT<=0&&p.el&&p.el.say)p.el.say.style.opacity=0}}
 if(!G.pools.length)return;
 // a faint golden shimmer on the hidden wall is the only clue
 if(G.secret&&!G.secretOpen&&Math.random()<dt*2.5){const s=G.secret,wx=(s.k%G.W)*T+T/2,wz=Math.floor(s.k/G.W)*T+T/2;spark(wx+rf(-2.1,2.1),rf(.6,2.6),wz+rf(-2.1,2.1),0xffe6a0,.9)}
 for(const pl of G.pools){pl.water.material.emissiveIntensity=.75+Math.sin(t*2.2)*.25;pl.ring.rotation.z=t*.25;pl.ring.material.opacity=.4+Math.sin(t*2.8)*.15;pl.angel.position.y=1.2+Math.sin(t*1.4)*.13;pl.halo.material.opacity=.5+Math.sin(t*1.7)*.15;
  if(Math.random()<dt*5)spark(pl.x+rf(-1.9,1.9),.35,pl.z+rf(-1.9,1.9),0xfff0b0,.7);
  if(pl.bub){pl.bubT-=dt;if(pl.bubT<=0)pl.bub.visible=false}
  for(const p of players){if(!p.alive)continue;const d=Math.hypot(p.x-pl.x,p.z-pl.z),fast=p.hero==='barbarian'||p.hero==='valkyrie';
   if(d<pl.r){if(G.net!=='client'){p.hp=Math.min(p.max,p.hp+p.max*.7*dt);p.shield=Math.min(p.smax,p.shield+p.smax*.8*dt);p.mana=Math.min(100,p.mana+80*dt)}
    if(fast)p.blessT=60;if(Math.random()<dt*10)spark(p.x+rf(-.4,.4),rf(.4,1.8),p.z+rf(-.4,.4),0xbff4ff,.6);
    if(!p.inPool){p.inPool=true;if(p.el){pmsg(p,'The healing waters restore you'+(fast?' · Swift blessing for 60 seconds':''));sfx('potion')}if(!pl.blessed.has(p.i)){pl.blessed.add(p.i);angelBless(p)}}}
   else if(p.inPool&&d>pl.r+.3)p.inPool=false;
   if(p.el&&d<11&&(G.secretOpen||!G.secret)&&!pl.greeted.has(p.i)){pl.greeted.add(p.i);if(p.el.say){sayBox(p,'Angel Princess','sprites/angel_face.webp',ANGEL_LINE)}
    if(!pl.spoke){pl.spoke=true;G.angelTalk=performance.now()+9000;sayAngel(ANGEL_LINE)}if(renderer.xr.isPresenting&&p.i===0)angelBubble(pl)}}}}

// ---------- level 30: the Troll Spider's lair. One huge, dark cave with stalactites, his eggs, and him.
// He mostly stays put and turns to face you; he slams his hammer to send a straight shockwave, turns his back to fire red web orbs,
// lays eggs that hatch into baby troll spiders unless you smash them, and blinks out to reappear right in front of someone.
const TS={tex:{},mesh:null,eggM:[],remM:[],orbM:[],waveM:[],stal:null};
const BOSSMUL={barbarian:1.6,elf:.45,wizard:.85,valkyrie:.7};
const TSF=['front','q_r','q_l','side_r','side_l','bq_r','bq_l','back','raise','raise2','slam','slam2','gback','gbq_a','gbq_b','roar','roar_r','roar_l','roar_back','egg','egg_hatched','egg_smashed','orb','egg_web'];
function tsTex(n){let t=TS.tex[n];if(!t){t=TS.tex[n]=texLoader.load('sprites/ts_'+n+'.webp');t.encoding=THREE.sRGBEncoding}return t}
const TSV=`varying vec2 vUv;
#include <fog_pars_vertex>
void main(){vec3 c=(modelMatrix*vec4(0.,0.,0.,1.)).xyz;vec3 to=cameraPosition-c;to.y=0.;vec3 u=to/max(length(to),.001);vec3 r=vec3(u.z,0.,-u.x);
 vUv=uv;vec3 wp=c+r*position.x*length(modelMatrix[0].xyz)+vec3(0.,position.y*length(modelMatrix[1].xyz),0.);vec4 mvPosition=viewMatrix*vec4(wp,1.);gl_Position=projectionMatrix*mvPosition;
 #include <fog_vertex>
}`;
const TSFR=`uniform sampler2D map;uniform float op;uniform vec3 tint;varying vec2 vUv;
#include <fog_pars_fragment>
void main(){vec4 t=texture2D(map,vUv);if(t.a<.4||op<.02)discard;gl_FragColor=vec4(t.rgb*tint,op);
#include <fog_fragment>
}`;
function tsBill(w,h){const geo=new THREE.PlaneGeometry(w,h);geo.translate(0,h/2,0);const mat=new THREE.ShaderMaterial({uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{map:{value:null},op:{value:1},tint:{value:new THREE.Color(1,1,1)}}]),vertexShader:TSV,fragmentShader:TSFR,fog:true,transparent:true,side:THREE.DoubleSide});mat.uniforms.tint={value:new THREE.Color(1,1,1)};
 const m=new THREE.Mesh(geo,mat);m.frustumCulled=false;return m}
function tsSetTex(m,n){const t=tsTex(n);if(m.material.uniforms.map.value!==t)m.material.uniforms.map.value=t}
// level 30: a huge, pitch-dark warren of rooms and web-sealed doorways (some rooms flooded) wrapped around the Troll Spider's cave at its heart
function genLair(){const W=62,H=62,g=new Uint8Array(W*H).fill(1),cx=31,cy=31,AR=10,arena=new Uint8Array(W*H),inRoom=new Uint8Array(W*H);
 for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){const dx=i-cx,dy=j-cy,a=Math.atan2(dy,dx),R=9.6+Math.sin(a*3+1.3)*.9+Math.sin(a*5+.4)*.6;if(Math.hypot(dx,dy)<R){g[j*W+i]=0;arena[j*W+i]=1}}
 const rooms=[];let tries=0;
 while(rooms.length<26&&tries++<4000){const w=4+rnd(7),h=4+rnd(7),x=2+rnd(W-w-4),y=2+rnd(H-h-4);if(x<cx+AR+3&&x+w>cx-AR-3&&y<cy+AR+3&&y+h>cy-AR-3)continue;if(rooms.some(r=>x<r.x+r.w+2&&x+w+2>r.x&&y<r.y+r.h+2&&y+h+2>r.y))continue;rooms.push({x,y,w,h,cx:x+(w>>1),cy:y+(h>>1)})}
 for(const r of rooms)for(let j=r.y;j<r.y+r.h;j++)for(let i=r.x;i<r.x+r.w;i++){g[j*W+i]=0;inRoom[j*W+i]=1}
 let si=0,sd=-1;rooms.forEach((r,k)=>{const d=Math.hypot(r.cx-cx,r.cy-cy);if(d>sd){sd=d;si=k}});
 const chain=[rooms[si]],left=rooms.filter((r,k)=>k!==si);
 while(left.length){const a=chain[chain.length-1];let bi=0,bd=1e9;left.forEach((r,k)=>{const d=Math.abs(r.cx-a.cx)+Math.abs(r.cy-a.cy);if(d<bd){bd=d;bi=k}});chain.push(left.splice(bi,1)[0])}
 const dig=(i,j,wd)=>{for(let a=0;a<wd;a++)for(let b=0;b<wd;b++){const x=i+a,y=j+b;if(x>0&&y>0&&x<W-1&&y<H-1)g[y*W+x]=0}};
 const corr=(a,b)=>{const wd=RNG()<.2?2:1;let x=a.cx,y=a.cy;if(RNG()<.5){while(x!==b.cx){dig(x,y,wd);x+=Math.sign(b.cx-x)}while(y!==b.cy){dig(x,y,wd);y+=Math.sign(b.cy-y)}}else{while(y!==b.cy){dig(x,y,wd);y+=Math.sign(b.cy-y)}while(x!==b.cx){dig(x,y,wd);x+=Math.sign(b.cx-x)}}dig(x,y,wd)};
 for(let k=0;k<chain.length-1;k++)corr(chain[k],chain[k+1]);
 const A={cx,cy};corr(chain[chain.length-1],A);
 chain.slice(1,-1).sort((a,b)=>Math.hypot(a.cx-cx,a.cy-cy)-Math.hypot(b.cx-cx,b.cy-cy)).slice(0,2).forEach(r=>corr(r,A));
 for(let k=0;k<5;k++){const a=chain[rnd(chain.length)],b=chain[rnd(chain.length)];if(a!==b)corr(a,b)}
 // the cave's rock pillars go in last so no tunnel cuts through them
 for(const [a,r] of [[.8,6],[2.4,6.3],[3.9,5.8],[5.5,6.2]]){const pi=Math.round(cx+Math.cos(a)*r),pj=Math.round(cy+Math.sin(a)*r);for(const [di,dj] of [[0,0],[1,0],[0,1],[1,1]])g[(pj+dj)*W+pi+di]=1}
 // webs over the narrow doorways into rooms and into the cave
 const open=k=>g[k]===0,room=k=>inRoom[k]||arena[k],webs=[];
 for(let j=2;j<H-2;j++)for(let i=2;i<W-2;i++){const k=j*W+i;if(g[k]!==0||room(k))continue;
  const h=g[k-W]===1&&g[k+W]===1&&open(k-1)&&open(k+1)&&(room(k-1)||room(k+1)),v=g[k-1]===1&&g[k+1]===1&&open(k-W)&&open(k+W)&&(room(k-W)||room(k+W));
  if((h||v)&&!webs.some(w=>Math.abs(w[0]-k)===1||Math.abs(w[0]-k)===W)&&RNG()<.8)webs.push([k,h?1:0])}
 for(const [k] of webs)g[k]=3;
 // a few rooms stand in dark water
 const wet=new Uint8Array(W*H),cand=chain.slice(2),wetRooms=[];for(let k=0;k<5&&cand.length;k++){const r=cand.splice(rnd(cand.length),1)[0];wetRooms.push(r);for(let j=r.y;j<r.y+r.h;j++)for(let i=r.x;i<r.x+r.w;i++)if(g[j*W+i]===0)wet[j*W+i]=1}
 const start=chain[0],ex={x:cx-1,y:cy-1,w:3,h:3,cx,cy};
 return{W,H,g,start,ex,rooms:chain,secret:null,boss:true,arena:{i:cx,j:cy,r:AR-.5},arenaMask:arena,webs,wet,wetRooms}}
let WEBTEX=null,WETTEX=null;
function webMesh(k,across,W){if(!WEBTEX){const c=document.createElement('canvas');c.width=256;c.height=320;const x=c.getContext('2d');x.clearRect(0,0,256,320);const ox=128+rf(-20,20),oy=150;
  x.strokeStyle='rgba(235,235,242,.85)';x.lineWidth=2;const sp=[];for(let a=0;a<16;a++){const t=a/16*TAU+rf(-.1,.1),r=260;sp.push(t);x.beginPath();x.moveTo(ox,oy);x.lineTo(ox+Math.cos(t)*r,oy+Math.sin(t)*r);x.stroke()}
  x.lineWidth=1.4;for(let r=12;r<240;r+=10+r*.08){x.beginPath();sp.forEach((t,n)=>{const rr=r*(1+Math.sin(n*1.7+r)*.06),px=ox+Math.cos(t)*rr,py=oy+Math.sin(t)*rr+r*.06;n?x.lineTo(px,py):x.moveTo(px,py)});x.closePath();x.stroke()}
  for(let n=0;n<3;n++){const px=rf(40,216),py=rf(60,280);x.fillStyle='rgba(225,220,210,.9)';x.beginPath();x.ellipse(px,py,7,14,rf(-.4,.4),0,TAU);x.fill()}
  WEBTEX=new THREE.CanvasTexture(c)}
 const m=new THREE.Mesh(new THREE.PlaneGeometry(T,WALLH),new THREE.MeshStandardMaterial({map:WEBTEX,transparent:true,alphaTest:.08,side:THREE.DoubleSide,roughness:1,emissive:0x2a2a30,depthWrite:false}));
 m.position.set((k%W)*T+T/2,WALLH/2,Math.floor(k/W)*T+T/2);if(across)m.rotation.y=PI/2;return m}
function wetRooms(lg,L){if(!L.wetRooms||!L.wetRooms.length)return;G.wet=L.wet;G.wetRooms=L.wetRooms;
 if(!WETTEX){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#163c46';x.fillRect(0,0,256,256);for(let i=0;i<120;i++){x.strokeStyle=`rgba(150,210,225,${.05+Math.random()*.12})`;x.lineWidth=1+Math.random()*2;x.beginPath();x.arc(Math.random()*256,Math.random()*256,5+Math.random()*22,Math.random()*3,Math.random()*3+2);x.stroke()}
  WETTEX=new THREE.CanvasTexture(c);WETTEX.wrapS=WETTEX.wrapT=THREE.RepeatWrapping;if(WETTEX.repeat)WETTEX.repeat.set(3,3)}
 for(const r of L.wetRooms){const m=new THREE.Mesh(new THREE.PlaneGeometry(r.w*T,r.h*T),new THREE.MeshStandardMaterial({map:WETTEX,color:0x5f9aa8,emissive:0x061a20,roughness:.12,metalness:.3,transparent:true,opacity:.72,depthWrite:false}));m.rotation.x=-PI/2;m.position.set((r.x+r.w/2)*T,.3,(r.y+r.h/2)*T);m.renderOrder=2;lg.add(m)}}
function wetAt(x,z){const w=G.wet;if(!w)return false;const i=Math.floor(x/T),j=Math.floor(z/T);return i>=0&&j>=0&&i<G.W&&j<G.H&&w[j*G.W+i]===1}
// drips from the roof, and splashing as you wade
function wetTick(dt){if(WETTEX&&WETTEX.offset){WETTEX.offset.x=(G.time*.02)%1;WETTEX.offset.y=(G.time*.013)%1}const me=players.find(p=>p.local&&p.alive)||players[0];
 for(const r of G.wetRooms){const x0=r.x*T,z0=r.y*T;if(me&&Math.hypot(me.x-x0-r.w*T/2,me.z-z0-r.h*T/2)>32)continue;
  if(Math.random()<dt*r.w*r.h*.05&&G.parts.length<1300){const x=x0+Math.random()*r.w*T,z=z0+Math.random()*r.h*T;G.parts.push({x,y:WALLH-.3,z,vx:0,vy:-2,vz:0,life:.62,c:0xbfe8f4,g:true});burst(x0+Math.random()*r.w*T,.33,z0+Math.random()*r.h*T,0x9fd0dc,2,1.2)}}
 for(const p of players)if(p.alive&&p.moving>.5&&wetAt(p.x,p.z)&&Math.random()<dt*5)burst(p.x+rf(-.3,.3),.35,p.z+rf(-.3,.3),0xcfefff,3,2)}
// ---------- carrying limits (raised in the heavenly market)
const CAPS={pot:[9,18,27,1e9],food:[6,12,18,1e9],charm:[2,4,6,1e9]};
const potCap=p=>CAPS.pot[p.carry|0],foodCap=p=>CAPS.food[p.carry|0],charmCap=p=>CAPS.charm[p.carry|0],capTxt=n=>n>=1e9?'∞':n;
function useCharm(p){p.buff=['might','haste','ward'][Math.floor(Math.random()*3)];p.buffT=15;pmsg(p,{might:'Charm of Might: double damage',haste:'Charm of Haste: swift feet and hands',ward:'Charm of Warding: untouchable'}[p.buff]);sfx('up')}
function calm(i){i.fire=i.a1=i.a2=i.pot=false}
const inMarket=p=>!!(G&&G.market&&p.x>G.Wd*T);
// how tall each monster stands, so aimed shots can fly over or under them
function tallOf(e){const t=e.type;return t==='tspider'?4.8:t==='egg'?1.3:t==='spiderling'?1.0:t==='eel'?.9:t==='gremlin'?1.6:t==='lobber'?1.7:t==='death'?3:2.5}
// nests after level 30: a clutch of sleeping eggs around each Troll Spider generator
function nestEggs(r){const R=Math.random;for(let n=4+Math.floor(R()*3),k=0;k<n;k++){const x=(r.x+.5+R()*(r.w-1))*T,z=(r.y+.5+R()*(r.h-1))*T;if(blockedAt(x,z,.9)||Math.hypot(x-(r.cx*T+T/2),z-(r.cy*T+T/2))<2.2)continue;const b=G.enemies.length;spawnEnemy('egg',x,z);const e=G.enemies[b];if(e){e.hp=e.max=30*enemyHpMul(G.level)/2.7;e.dorm=1;e.hatch=Infinity}}}
function sayBox(p,name,img,text){const b=p.el&&p.el.say;if(!b)return;b.querySelector('b').textContent=name;const im=b.querySelector('img');if(!im.src.endsWith(img.split('/').pop()))im.src=V(img);b.querySelector('p').textContent=text;b.style.opacity=1;p.sayT=9}
function sayShop(t){try{const u=new SpeechSynthesisUtterance(t);u.rate=.92;u.pitch=.85;const v=speechSynthesis.getVoices().find(v=>/male|david|daniel|alex|george|fred|guy|mark|arthur/i.test(v.name)&&!/female/i.test(v.name));if(v)u.voice=v;speechSynthesis.cancel();speechSynthesis.speak(u);sayT=performance.now()}catch(e){}}
const SHOP_LINE='Welcome, traveler, to the market of the heavens. Stand upon a light before my counter, and what you need is yours, for a price in gold.';
const SHOP={aim:20000,carry:[10000,40000,250000]};
// a glowing doorway: one at the back of the angel's room, one in the clouds to bring you home
function makePortal(x,z,nx,nz,sky,par){const grp=new THREE.Group();grp.position.set(x,0,z);grp.rotation.y=Math.atan2(nx,nz);
 const glow=new THREE.Mesh(new THREE.PlaneGeometry(5.4,5.2),new THREE.MeshBasicMaterial({map:haloTex(),transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false,fog:!sky}));glow.position.set(0,1.9,-.04);
 const door=new THREE.Mesh(new THREE.PlaneGeometry(3.4,3.46),new THREE.MeshBasicMaterial({transparent:true,alphaTest:.06,side:THREE.DoubleSide,fog:!sky}));door.position.y=1.73;
 sprTex('portal',t=>{door.material.map=t;door.material.needsUpdate=true});
 const l=new THREE.PointLight(0xffe2a0,1.5,14,2);l.position.set(0,1.8,.8);grp.add(glow,door,l);(par||G.lg).add(grp);return{x,z,nx,nz,glow,light:l,grp}}
let SKYTEX=null,CLOUDTEX=null,PUFFTEX=null;
function puffTex(){if(PUFFTEX)return PUFFTEX;const c=document.createElement('canvas');c.width=256;c.height=160;const x=c.getContext('2d');x.clearRect(0,0,256,160);
 for(let i=0;i<26;i++){const px=40+Math.random()*176,py=70+Math.random()*60-(Math.abs(px-128)<50?30:0),r=22+Math.random()*30,gr=x.createRadialGradient(px,py,2,px,py,r);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.55,'rgba(246,250,255,.95)');gr.addColorStop(1,'rgba(225,236,250,0)');x.fillStyle=gr;x.beginPath();x.arc(px,py,r,0,TAU);x.fill()}
 return PUFFTEX=new THREE.CanvasTexture(c)}
function signTex(title,lines){const c=document.createElement('canvas');c.width=640;c.height=320;const x=c.getContext('2d');x.fillStyle='rgba(255,250,236,.92)';x.fillRect(0,0,640,320);x.strokeStyle='#d8a838';x.lineWidth=10;x.strokeRect(5,5,630,310);
 x.textAlign='center';x.fillStyle='#8a5a08';x.font='bold 50px serif';x.fillText(title,320,70);x.fillStyle='#3a2a10';x.font='30px sans-serif';lines.forEach((t,i)=>x.fillText(t,320,128+i*44));x.fillStyle='#a06a10';x.font='italic 26px serif';x.fillText('Stand in the light to buy',320,296);return new THREE.CanvasTexture(c)}
function makeMarket(L){const M=L.market,lg=G.lg,cx=M.cx*T,z0=M.y0*T,z1=(M.y0+M.h)*T,mz=(z0+z1)/2;
 if(!SKYTEX){SKYTEX=texLoader.load('sprites/sky_pano.jpg');SKYTEX.wrapS=THREE.MirroredRepeatWrapping||THREE.RepeatWrapping;if(SKYTEX.repeat)SKYTEX.repeat.set(4,1);CLOUDTEX=texLoader.load('sprites/cloud_floor.jpg');CLOUDTEX.wrapS=CLOUDTEX.wrapT=THREE.MirroredRepeatWrapping||THREE.RepeatWrapping}
 const mg=new THREE.Group();lg.add(mg);
 const sky=new THREE.Mesh(new THREE.CylinderGeometry(50,50,43,48,1,true),new THREE.MeshBasicMaterial({map:SKYTEX,side:THREE.DoubleSide,fog:false}));sky.position.set(cx,-1.1,mz);mg.add(sky);
 const cf=CLOUDTEX.clone?CLOUDTEX.clone():CLOUDTEX;if(cf.repeat)cf.repeat.set(3,3);cf.needsUpdate=true;
 const fl=new THREE.Mesh(new THREE.PlaneGeometry(M.w*T+8,M.h*T+8),new THREE.MeshBasicMaterial({map:cf,color:0xf4f8ff,fog:false}));fl.rotation.x=-PI/2;fl.position.set(cx,.01,mz);mg.add(fl);
 const sea=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshBasicMaterial({map:CLOUDTEX,color:0xe8f0fc,fog:false}));if(CLOUDTEX.repeat)CLOUDTEX.repeat.set(5,5);sea.rotation.x=-PI/2;sea.position.set(cx,-.9,mz);mg.add(sea);
 // soft cloud banks around the edge of the walkway, and more drifting out on the sea of cloud
 const puffs=[];const pt=puffTex();const puff=(x,z,w,y)=>{const m=tsBill(w,w*.62);m.material.uniforms.map.value=pt;m.material.fog=false;m.position.set(x,y,z);mg.add(m);puffs.push(m)};
 for(let k=0;k<26;k++){const t=k/26*TAU,rx=M.w*T/2+3,rz=M.h*T/2+3;puff(cx+Math.cos(t)*rx*rf(.95,1.15),mz+Math.sin(t)*rz*rf(.95,1.15),rf(7,12),-1.2)}
 for(let k=0;k<22;k++){const t=Math.random()*TAU,r=rf(32,46);puff(cx+Math.cos(t)*r,mz+Math.sin(t)*r,rf(14,26),-3)}
 // the merchant behind his counter
 const keep=tsBill(8.4,4.76);keep.position.set(cx,0,z0+T+.15);mg.add(keep);
 const kl=new THREE.PointLight(0xfff0c8,1.2,16,2);kl.position.set(cx,3.6,z0+T+2.5);mg.add(kl);
 const pads=[['aim','TRUE FLIGHT',['Your weapons fly exactly where you aim:','up, down, any angle you like',SHOP.aim.toLocaleString()+' gold']],
  ['carry','BIGGER SATCHEL',['Carry more potions, charms and food','Double 10,000 · Triple 40,000','Bottomless 250,000 gold']]].map(([kind,title,lines],i)=>{
  const x=cx+(i?3.4:-3.4),z=z0+T+4.6;const disc=new THREE.Mesh(new THREE.CircleGeometry(1.15,40),new THREE.MeshBasicMaterial({map:haloTex(),color:0xffd870,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));disc.rotation.x=-PI/2;disc.position.set(x,.04,z);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.15,.06,6,40),new THREE.MeshBasicMaterial({color:0xffe08a,fog:false}));ring.rotation.x=PI/2;ring.position.set(x,.05,z);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(3,1.5),new THREE.MeshBasicMaterial({map:signTex(title,lines),transparent:true,fog:false,side:THREE.DoubleSide}));sign.position.set(x,2.7,z-.3);
  mg.add(disc,ring,sign);return{kind,x,z,disc,ring}});
 for(const f of ['front','q1','q1_m','q2','q2_m','side','side_m','back'])sprTex('sk_'+f,()=>{});
 mg.visible=false;G.market={...M,mg,keep,pads,puffs,greeted:new Set(),spawn:{x:cx,z:z1-3.4,yaw:0}};
 // the two doorways
 const s=L.secret,dx=Math.sign(s.cx-s.ex),dz=Math.sign(s.cy-s.ey),px=(s.cx+.5+dx*1.5)*T-dx*.08,pz=(s.cy+.5+dz*1.5)*T-dz*.08;
 const A=makePortal(px,pz,-dx,-dz,false);A.to='market';A.back={x:px-dx*2.7,z:pz-dz*2.7,yaw:Math.atan2(dx,dz)};
 const B=makePortal(cx,z1-.08,0,-1,true,mg);B.to='dungeon';G.portals=[A,B]}
function tele(p,x,z,yaw){p.x=x;p.z=z;p.yaw=yaw;p.pitch=0;p.portalCd=1.2;if(p.spawn&&p.ai){}if(p.local){G.flash=Math.max(G.flash,.75);sfx('potion');rumble(p,250,.5)}burst(x,1.2,z,0xfff0c0,20,3)}
function setSkyEnv(on){if(G.envM===on)return;if(G.envM===undefined&&!on){G.envM=false;return}G.envM=on;
 if(!G.env0)G.env0={h:HEMI.intensity,fd:scene.fog.density,fc:scene.fog.color.getHex(),bg:scene.background.getHex(),hc:HEMI.color?HEMI.color.getHex():0};const E=G.env0;
 if(G.market)G.market.mg.visible=on;HEMI.intensity=on?1.25:E.h;scene.fog.density=on?.012:E.fd;scene.fog.color.setHex(on?0xcfe2f6:E.fc);scene.background.setHex(on?0x9cc4ea:E.bg);if(HEMI.color&&HEMI.color.setHex)HEMI.color.setHex(on?0xfff6e6:E.hc)}
function marketTick(dt){const t=G.time,M=G.market,host=G.net!=='client';
 for(const P of G.portals){P.glow.material.opacity=.45+Math.sin(t*2.4)*.15;P.light.intensity=1.3+Math.sin(t*3.1)*.3;if(Math.random()<dt*6)spark(P.x+P.nx*.3+rf(-1.2,1.2)*Math.abs(P.nz)+(Math.abs(P.nx)?0:0),rf(.4,3.2),P.z+P.nz*.3+rf(-1.2,1.2)*Math.abs(P.nx),0xfff0b0,.8)}
 for(const p of players){if(!p.alive)continue;if(p.portalCd>0){p.portalCd-=dt;continue}if(!p.local)continue;
  for(const P of G.portals){if(Math.hypot(p.x-(P.x+P.nx*.7),p.z-(P.z+P.nz*.7))>1.3)continue;
   if(P.to==='market'){tele(p,M.spawn.x+(p.i%2?1.2:-1.2),M.spawn.z,M.spawn.yaw);pmsg(p,'The market of the heavens')}else{const A=G.portals[0];tele(p,A.back.x,A.back.z,A.back.yaw);pmsg(p,'Back to the dungeon')}break}}
 if(!M)return;
 const me=players.find(p=>p.local)||players[0];setSkyEnv(!!me&&inMarket(me));
 // the merchant turns to whoever is looking
 const cam=players[0]&&players[0].cam;if(cam){cam.getWorldPosition(_v);const ux=_v.x-M.keep.position.x,uz=_v.z-M.keep.position.z,a=Math.atan2(-ux,uz)*180/PI,aa=Math.abs(a);
  const f=aa<12?'front':aa<33?(a>0?'q1':'q1_m'):aa<62?(a>0?'q2':'q2_m'):aa<125?(a<0?'side':'side_m'):'back';if(M.frame!==f){M.frame=f;const tx=SPRTEX['sk_'+f];if(tx&&tx.tex)M.keep.material.uniforms.map.value=tx.tex;else sprTex('sk_'+f,x=>{if(M.frame===f)M.keep.material.uniforms.map.value=x})}}
 M.keep.position.y=Math.sin(t*1.3)*.05;
 for(const pd of M.pads){pd.disc.material.opacity=.55+Math.sin(t*2+pd.x)*.2;pd.ring.rotation.z=t*.5}
 for(const p of players){if(!p.alive||!inMarket(p))continue;
  if(p.local&&!M.greeted.has(p.i)&&Math.hypot(p.x-M.keep.position.x,p.z-M.keep.position.z)<12){M.greeted.add(p.i);sayBox(p,'Heavenly Merchant','sprites/sk_face.webp',SHOP_LINE);if(M.greeted.size===1)sayShop(SHOP_LINE);else pmsg(p,'Stand on a light to buy')}
  let on=null;for(const pd of M.pads)if(Math.hypot(p.x-pd.x,p.z-pd.z)<1.15)on=pd;
  if(!on){p.padT=0;p.padK=null;continue}if(p.padK!==on.kind){p.padK=on.kind;p.padT=0;p.padDone=false;if(p.local)pmsg(p,padInfo(p,on.kind))}
  if(p.padDone)continue;p.padT+=dt;if(Math.random()<dt*14)spark(on.x+rf(-1,1),rf(.1,1.6),on.z+rf(-1,1),0xffe080,.6);
  if(p.padT>=1.6){p.padDone=true;if(host)buy(p,on.kind);else if(p.local){const c=priceOf(p,on.kind);pmsg(p,c<0?padInfo(p,on.kind):p.score<c?'You need '+c.toLocaleString()+' gold':'Buying…')}}}}
function priceOf(p,k){if(k==='aim')return p.aim3d?-1:SHOP.aim;const t=p.carry|0;return t>=3?-1:SHOP.carry[t]}
function padInfo(p,k){const c=priceOf(p,k);if(k==='aim')return c<0?'You already have True Flight':'True Flight: '+c.toLocaleString()+' gold · you have '+p.score.toLocaleString();
 return c<0?'Your satchel is already bottomless':['Double','Triple','Bottomless'][p.carry|0]+' satchel: '+c.toLocaleString()+' gold · you have '+p.score.toLocaleString()}
function buy(p,k){const c=priceOf(p,k);if(c<0){pmsg(p,padInfo(p,k));return}if(p.score<c){pmsg(p,'You need '+c.toLocaleString()+' gold (you have '+p.score.toLocaleString()+')');sfx('thud');return}
 p.score-=c;if(k==='aim'){p.aim3d=true;pmsg(p,'True Flight: your weapons now fly wherever you aim')}else{p.carry=(p.carry|0)+1;pmsg(p,'Your satchel grows: carry '+['double','triple','unlimited'][p.carry-1]+' potions, charms and food')}
 sfx('up');sfx('gold');burst(p.x,1.4,p.z,0xffe080,30,4);if(p.local)rumble(p,300,.6);if(p.local&&!p.ai)sayShop(k==='aim'?'Your weapons will now fly true. Aim well.':'A finer satchel. May it never be empty.')}
// what waits in the dark: sleeping egg clutches, packs of baby spiders, the odd gremlin, and a skeleton under the water in each flooded room
function lairCritters(L,cells){const R=Math.random,W=L.W,pick=a=>a[Math.floor(R()*a.length)],far=cells.filter(c=>Math.hypot(c[0]-L.start.cx,c[1]-L.start.cy)>9),dry=far.filter(c=>!L.wet[c[1]*W+c[0]]);if(!dry.length)return;
 const at=c=>[c[0]*T+T/2+(R()-.5)*2.4,c[1]*T+T/2+(R()-.5)*2.4];
 for(let k=0;k<15;k++){const c=pick(dry),n=2+Math.floor(R()*3);for(let m=0;m<n;m++){const a=R()*TAU,r=R()*1.7,x=c[0]*T+T/2+Math.cos(a)*r,z=c[1]*T+T/2+Math.sin(a)*r;if(blockedAt(x,z,.9))continue;const b=G.enemies.length;spawnEnemy('egg',x,z);const e=G.enemies[b];if(e){e.hp=e.max=30*enemyHpMul(G.level)/2.7;e.dorm=1;e.hatch=Infinity}}}
 for(let k=0;k<11;k++){const c=pick(dry),n=3+Math.floor(R()*3);for(let m=0;m<n;m++){const p=at(c);if(!blockedAt(p[0],p[1],.5))spawnEnemy('spiderling',p[0],p[1])}}
 for(let k=0;k<7;k++){const p=at(pick(dry));if(!blockedAt(p[0],p[1],.5))spawnEnemy('gremlin',p[0],p[1])}
 for(const r of L.wetRooms){const b=G.enemies.length;spawnEnemy('drowned',(r.x+r.w/2)*T,(r.y+r.h/2)*T);const e=G.enemies[b];if(e){e.hidden=true;e.lurk=1;e.wait=.8}}}
// frozen by an orb: you can look around, but you can't move, dash, shoot or use anything
function icy(i){i.mx=i.mz=0;i.fire=i.a1=i.a2=i.dash=i.pot=i.eat=false}
function iceTick(p,dt){if(p.pfz>0)p.pfz=Math.max(0,p.pfz-dt);if(!p.alive)p.pfz=0;if(!p.local||!p.cam)return;const on=p.pfz>0;
 if(!p.ice){if(!on)return;const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');const gr=x.createRadialGradient(128,128,30,128,128,182);gr.addColorStop(0,'rgba(200,235,255,0.1)');gr.addColorStop(.6,'rgba(210,240,255,0.35)');gr.addColorStop(1,'rgba(235,250,255,0.95)');x.fillStyle=gr;x.fillRect(0,0,256,256);
  x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=1.5;for(let n=0;n<40;n++){const a=Math.random()*TAU,r0=90+Math.random()*40;let px=128+Math.cos(a)*r0,py=128+Math.sin(a)*r0;x.beginPath();x.moveTo(px,py);for(let s=0;s<4;s++){px+=Math.cos(a+rf(-.6,.6))*14;py+=Math.sin(a+rf(-.6,.6))*14;x.lineTo(px,py)}x.stroke()}
  p.ice=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.4),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,opacity:0,depthTest:false,depthWrite:false,fog:false}));p.ice.renderOrder=998;p.ice.position.set(0,0,-.3);p.ice.frustumCulled=false;p.cam.add(p.ice)}
 const m=p.ice.material;m.opacity+=((on?Math.min(1,p.pfz*1.5):0)-m.opacity)*.25;p.ice.visible=m.opacity>.02}
function lairDress(lg,W,H,g){const rock=new THREE.MeshStandardMaterial({color:0x2a2320,roughness:1});
 const cells=[];for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(g[j*W+i]===0)cells.push([i,j]);
 const n=Math.min(900,cells.length*2),geo=new THREE.ConeGeometry(.5,1,7);geo.translate(0,-.5,0);const im=new THREE.InstancedMesh(geo,rock,n),mm=new THREE.Matrix4(),q=new THREE.Quaternion();
 for(let k=0;k<n;k++){const c=cells[Math.floor(Math.random()*cells.length)],len=rf(.6,2.4),s=rf(.35,.9);mm.compose(new THREE.Vector3(c[0]*T+rf(.3,T-.3),WALLH,c[1]*T+rf(.3,T-.3)),q,new THREE.Vector3(s,len,s));im.setMatrixAt(k,mm)}
 im.count=n;im.castShadow=true;lg.add(im);
 // stalagmites hugging the walls
 const near=cells.filter(([i,j])=>[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>g[(j+b)*W+i+a]===1)),m2=new THREE.InstancedMesh(new THREE.ConeGeometry(.45,1,7).translate(0,.5,0),rock,Math.max(1,near.length));
 near.forEach((c,k)=>{const s=rf(.4,.9);mm.compose(new THREE.Vector3(c[0]*T+rf(.5,T-.5),0,c[1]*T+rf(.5,T-.5)),q,new THREE.Vector3(s,rf(.5,1.6),s));m2.setMatrixAt(k,mm)});m2.count=near.length;lg.add(m2);
 // old egg nests in webs along the walls
 for(let k=0;k<18&&near.length;k++){const c=near[Math.floor(Math.random()*near.length)],m=tsBill(2.6,1.45);tsSetTex(m,'egg_web');m.material.uniforms.tint.value.setRGB(.55,.5,.5);m.position.set(c[0]*T+T/2+rf(-1,1),0,c[1]*T+T/2+rf(-1,1));lg.add(m)}}
function spawnBoss(){const n=Math.max(1,players.filter(p=>p.alive).length),hp=9000*(1+.7*(n-1));const before=G.enemies.length;spawnEnemy('tspider',G.arena?G.arena.x:13*T+T/2,G.arena?G.arena.z:13*T+T/2);const e=G.enemies[before];if(!e)return;
 Object.assign(e,{hp,max:hp,rot:PI,bs:'idle',bt:0,cd:3,home:{x:e.x,z:e.z},lastLay:-6,lastBlink:0,rage:0,fade:1,atk:0});G.boss=e}
function inArena(p,pad){const A=G.arena;return !A||Math.hypot(p.x-A.x,p.z-A.z)<A.r+(pad||0)}
function tsTarget(e){const al=players.filter(p=>p.alive&&inArena(p,8));if(!al.length)return null;if(!e.tgt||!e.tgt.alive||Math.random()<.004){let b=null,bd=1e9;for(const p of al){const d=Math.hypot(p.x-e.x,p.z-e.z);if(d<bd){bd=d;b=p}}e.tgt=b}return e.tgt}
function angTo(e,p){return Math.atan2(p.x-e.x,p.z-e.z)}
function turnTo(e,a,sp,dt){let d=a-e.rot;d=Math.atan2(Math.sin(d),Math.cos(d));e.rot+=clamp(d,-sp*dt,sp*dt);return Math.abs(d)}
function bossAI(e,dt){if(!G.tsAwake){if(!players.some(q=>q.alive&&inArena(q,-2)))return;G.tsAwake=true;e.bs='roar';e.bt=0;e.laid=1;sfx('drain');G.flash=Math.max(G.flash,.4);banner('The Troll Spider awakens!','Smash his eggs · Dodge his shockwave · His red orbs freeze you solid',3.5);for(const q of humans()){pmsg(q,'The Troll Spider wakes!');rumble(q,600,1)}}
 const p=tsTarget(e);e.bt+=dt;e.cd-=dt;const fx=Math.sin(e.rot),fz=Math.cos(e.rot),rage=e.rage,fast=1+rage*.25;
 if(e.frz>0){e.frz-=dt;return}
 const hpF=e.hp/e.max;if((hpF<.66&&rage<1)||(hpF<.33&&rage<2)){e.rage++;e.bs='roar';e.bt=0;sfx('drain');for(const q of humans()){pmsg(q,'The Troll Spider roars! More eggs!');rumble(q,500,.8)}}
 if(!p)return;const d=Math.hypot(p.x-e.x,p.z-e.z),a=angTo(e,p);
 // big body: push heroes out and hurt on contact
 for(const q of players){if(!q.alive||e.hidden)continue;const dx=q.x-e.x,dz=q.z-e.z,dd=Math.hypot(dx,dz),m=2.3+q.H.rad;if(dd<m&&dd>1e-3){q.x=e.x+dx/dd*m;q.z=e.z+dz/dd*m;if((e.atk-=dt)<=0){e.atk=.8;hurtPlayer(q,25)}}}
 switch(e.bs){
 case 'idle':{turnTo(e,a,1.1*fast,dt);const off=Math.hypot(e.x-e.home.x,e.z-e.home.z);
  if(d>16&&off<4){e.x+=fx*.7*dt;e.z+=fz*.7*dt}else if(d<3.8&&off<4){e.x-=fx*.7*dt;e.z-=fz*.7*dt}collide(e,1.6);
  if(e.cd<=0){const r=Math.random(),eggs=G.enemies.filter(x=>!x.dead&&x.type==='egg').length;
   if(G.time-e.lastBlink>9&&r<.25){e.bs='vanish';e.bt=0;e.lastBlink=G.time;sfx('drain')}
   else if(d<10&&turnTo(e,a,0,dt)<.6){e.bs='wind';e.bt=0}
   else if(eggs<5+rage*2&&G.time-e.lastLay>13/fast){e.bs='lay';e.bt=0;e.lastLay=G.time}
   else{e.bs='orbturn';e.bt=0}}break}
 case 'wind':turnTo(e,a,.5,dt);if(e.bt>(e.quick?.7:.95)/Math.sqrt(fast)){e.bs='slam';e.bt=0;e.quick=0;tsWave(e);sfx('gen');G.flash=Math.max(G.flash,.25);for(const q of humans())if(Math.hypot(q.x-e.x,q.z-e.z)<20)rumble(q,350,1)}break;
 case 'slam':if(e.bt>.65){e.bs='idle';e.cd=rf(1.2,2)/fast}break;
 case 'orbturn':if(turnTo(e,a+PI,2.4,dt)<.25||e.bt>1.6){e.bs='orb';e.bt=0;e.shots=0}break;
 case 'orb':turnTo(e,a+PI,.8,dt);if(e.bt>.25*(e.shots+1)&&e.shots<4+rage){e.shots++;tsOrb(e,p)}if(e.bt>.25*(5+rage)+.4){e.bs='idle';e.cd=rf(1.4,2.2)/fast}break;
 case 'lay':if(e.bt>.6&&!e.laid){e.laid=1;tsLay(e,2+(Math.random()<.5?1:0))}if(e.bt>1.4){e.bs='idle';e.laid=0;e.cd=rf(1,1.8)/fast}break;
 case 'roar':if(e.bt>.9&&!e.laid){e.laid=1;tsLay(e,3,true)}if(e.bt>1.8){e.bs='idle';e.laid=0;e.cd=1}break;
 case 'vanish':{const t=e.bt;e.fade=t<.7?(Math.sin(t*40)>0?1:.15)*(1-t/.7):0;e.hidden=t>.45;
  if(t>1.5){const q=players.filter(x=>x.alive&&inArena(x,8));const v=q[Math.floor(Math.random()*q.length)]||p;const f=fwd(v);let ok=false;
   for(const k of [4.6,3.8,5.6,3.2])for(const s of [0,.6,-.6,1.2,-1.2]){if(ok)break;const c=Math.cos(s),sn=Math.sin(s),dx=f.x*c-f.z*sn,dz=f.x*sn+f.z*c,x=v.x+dx*k,z=v.z+dz*k;if(!blockedAt(x,z,1.8)){e.x=x;e.z=z;ok=true}}
   e.rot=angTo(e,v);e.tgt=v;e.home={x:e.x,z:e.z};e.bs='appear';e.bt=0;burst(e.x,1.5,e.z,0x301010,24,5);sfx('drain')}break}
 case 'appear':{const t=e.bt;e.hidden=false;e.fade=t<.5?(Math.sin(t*40)>0?1:.2)*Math.min(1,t/.5+.3):1;turnTo(e,a,2,dt);if(t>.5){e.fade=1;e.bs='wind';e.bt=0;e.quick=1}break}}}
function tsWave(e){const dx=Math.sin(e.rot),dz=Math.cos(e.rot);(G.waves||(G.waves=[])).push({x:e.x+dx*2,z:e.z+dz*2,dx,dz,d:0,max:20,w:1.7,hit:new Set()})}
function tsOrb(e,p){const dx=-Math.sin(e.rot),dz=-Math.cos(e.rot),x=e.x+dx*2.1,z=e.z+dz*2.1,tx=p.x-x,tz=p.z-z,l=Math.hypot(tx,tz)||1,s=rf(-.08,.08),c=Math.cos(s),sn=Math.sin(s),vx=(tx/l*c-tz/l*sn)*11,vz=(tx/l*sn+tz/l*c)*11;
 (G.orbs||(G.orbs=[])).push({x,y:1.5,z,vx,vz,life:3});sfx('fireball')}
function tsLay(e,n,around){for(let k=0;k<n;k++){for(let t=0;t<20;t++){let x,z;if(around){const a=Math.random()*TAU,r=rf(5,11);x=e.home.x+Math.cos(a)*r;z=e.home.z+Math.sin(a)*r}else{const s=rf(-1.1,1.1),r=rf(3.2,6),bx=-Math.sin(e.rot+s),bz=-Math.cos(e.rot+s);x=e.x+bx*r;z=e.z+bz*r}
  if(blockedAt(x,z,.9))continue;const before=G.enemies.length;spawnEnemy('egg',x,z);const g=G.enemies[before];if(g){g.hp=g.max=30*enemyHpMul(G.level)/2.7;g.hatch=G.time+rf(14,18);burst(x,.6,z,0xd09040,10,3)}break}}sfx('lob')}
function eggAI(e,dt){if(e.dorm){if((e.chk=(e.chk||0)-dt)>0)return;e.chk=.3;const n=nearest(e);if(n&&n.d<7.5&&los(e.x,e.z,n.p.x,n.p.z)){e.dorm=0;e.hatch=G.time+rf(3,5.5)}return}
 if(G.time>=e.hatch){e.dead=true;tsRemain(e.x,e.z,'egg_hatched');burst(e.x,.8,e.z,0xd09040,16,4);sfx('kill');for(let k=0;k<3;k++){const a=Math.random()*TAU;spawnEnemy('spiderling',e.x+Math.cos(a)*.8,e.z+Math.sin(a)*.8)}}}
function tsRemain(x,z,kind){const R=G.remains||(G.remains=[]);if(R.length<40)R.push([Math.round(x*10),Math.round(z*10),kind==='egg_hatched'?1:2])}
function bossDown(e){G.exitLocked=false;if(G.exit&&G.exit.g)G.exit.g.visible=true;for(const o of G.enemies)if(!o.dead&&o!==e&&(o.type==='egg'||o.type==='spiderling')){o.dead=true;burst(o.x,1,o.z,EDEF[o.type].burst,6,4)}G.orbs=[];G.waves=[];G.flash=1;sfx('up');
 burst(e.x,2.2,e.z,0x803020,40,8);banner('The Troll Spider is dead!','The exit has opened in the middle of his lair',4);for(const q of humans())rumble(q,700,1)}
// shockwaves and orbs (the host decides who gets hit; everyone sees them)
function tsTick(dt){const host=G.net!=='client';
 for(const w of G.waves||[]){if(w.dead)continue;if(host){w.d+=14*dt;if(w.d>w.max||blk(Math.floor((w.x+w.dx*w.d)/T),Math.floor((w.z+w.dz*w.d)/T)))w.dead=true}
  const fx=w.x+w.dx*w.d,fz=w.z+w.dz*w.d;for(let k=0;k<3;k++){const s=rf(-w.w,w.w);burst(fx-w.dz*s,.2,fz+w.dx*s,k?0x9a8060:0xffa040,2,2.5)}
  if(host)for(const p of players){if(!p.alive||w.hit.has(p))continue;const rx=p.x-w.x,rz=p.z-w.z,al=rx*w.dx+rz*w.dz,lat=Math.abs(rx*w.dz-rz*w.dx);if(lat<w.w+p.H.rad&&Math.abs(al-w.d)<1.3){w.hit.add(p);hurtPlayer(p,55);rumble(p,400,1);pmsg(p,'Shockwave! Dash sideways to dodge it')}}}
 if(host&&G.waves)G.waves=G.waves.filter(w=>!w.dead);
 for(const f of G.orbs||[]){if(f.dead)continue;if(host){f.life-=dt;f.x+=f.vx*dt;f.z+=f.vz*dt;if(f.life<=0||blk(Math.floor(f.x/T),Math.floor(f.z/T))){f.dead=true;burst(f.x,f.y,f.z,0xff4020,8,2.5);continue}
   for(const w of players)if(w.hero==='wizard'&&w.alive&&Math.hypot(f.x-w.x,f.z-w.z)<3.6){f.dead=true;burst(f.x,f.y,f.z,0x9fd8ff,8,2)}
   if(!f.dead)for(const p of players)if(p.alive&&Math.hypot(f.x-p.x,f.z-p.z)<p.H.rad+.45){hurtPlayer(p,28);if(p.alive&&!(p.pfz>0)&&G.time>(p.pfzImm||0)){p.pfz=4;p.pfzImm=G.time+5.5;pmsg(p,'Frozen solid by his orb! 4 seconds');rumble(p,600,.9);burst(p.x,1.3,p.z,0xbfe8ff,18,3)}f.dead=true;burst(f.x,f.y,f.z,0xff4020,12,3);break}}
  if(Math.random()<.7)spark(f.x+rf(-.2,.2),f.y+rf(-.2,.2),f.z+rf(-.2,.2),Math.random()<.5?0xffffff:0xff5020,.35)}
 if(host&&G.orbs)G.orbs=G.orbs.filter(f=>!f.dead)}
// drawing: the boss picks a picture from where you stand and what he is doing
function tsFrame(e,s){const st=e.bs||'idle',front=Math.abs(s)<=1,R=s>0;
 if(st==='wind'||st==='appear')return front?(Math.floor(G.time*6)%2?'raise2':'raise'):null;
 if(st==='slam')return front?(e.bt<.25?'slam':'slam2'):null;
 if(st==='orb'||st==='orbturn'||st==='lay')return Math.abs(s)>=4?'gback':Math.abs(s)===3?(R?'gbq_b':'gbq_a'):null;
 if(st==='roar')return front?'roar':Math.abs(s)===2?(R?'roar_r':'roar_l'):'roar_back';return null}
function tsDraw(){const cam=players[0]&&players[0].cam;if(!cam||!G.lg)return;cam.getWorldPosition(_v);
 const bs=G.enemies.filter(e=>!e.dead&&e.type==='tspider');
 if(!TS.mesh){TS.mesh=tsBill(5.4,4.9);scene.add(TS.mesh)}TS.mesh.visible=false;
 for(const e of bs){const N=G.net==='client'&&G.tsNet;if(N){e.bs=['idle','wind','slam','orbturn','orb','lay','roar','vanish','appear'][N[0]]||'idle';e.fade=N[2]/100;e.bt=N[3]/100}
  const ux=_v.x-e.x,uz=_v.z-e.z,l=Math.hypot(ux,uz)||1,fx=Math.sin(e.rot),fz=Math.cos(e.rot),dot=(fx*ux+fz*uz)/l,cr=(fx*uz-fz*ux)/l,s=Math.round(Math.atan2(cr,dot)/(PI/4));
  const idle={0:'front',1:'q_r','-1':'q_l',2:'side_r','-2':'side_l',3:'bq_r','-3':'bq_l',4:'back','-4':'back'}[s];
  tsSetTex(TS.mesh,tsFrame(e,s)||idle);const m=TS.mesh;m.visible=(e.fade===undefined?1:e.fade)>.02&&!e.hidden;m.position.set(e.x,0,e.z);m.material.uniforms.op.value=e.fade===undefined?1:e.fade;
  const fl=e.flash>0;m.material.uniforms.tint.value.setRGB(fl?1.5:.78,fl?.6:.72,fl?.55:.72);
  if((e.bs==='orb'||e.bs==='lay')&&Math.random()<.5)GL.orb.add(e.x-fx*2,1.4,e.z-fz*2,1,.25,.05);GL.orb.add(e.x+fx*.8,2.2,e.z+fz*.8,.35,.04,.02)}
 // eggs
 const eggs=G.enemies.filter(e=>!e.dead&&e.type==='egg');while(TS.eggM.length<eggs.length){const m=tsBill(1.05,1.3);tsSetTex(m,'egg');scene.add(m);TS.eggM.push(m)}
 TS.eggM.forEach((m,i)=>{const e=eggs[i];m.visible=!!e;if(!e)return;const left=e.hatch?e.hatch-G.time:9,sh=left<5?Math.sin(G.time*(30-left*4))*.06*(5-left)/5:0;m.position.set(e.x+sh,0,e.z);const fl=e.flash>0;m.material.uniforms.tint.value.setRGB(fl?1.6:.85+(left<5?.3*(5-left)/5:0),fl?.7:.8,fl?.6:.75)});
 // shells left behind
 const R=(G.net==='client'?G.tsRem:G.remains)||[];while(TS.remM.length<R.length){const m=tsBill(1,1);scene.add(m);TS.remM.push(m)}
 TS.remM.forEach((m,i)=>{const r=R[i];m.visible=!!r&&!!G.lg;if(!r)return;const big=r[2]===2;tsSetTex(m,big?'egg_smashed':'egg_hatched');m.scale.set(big?2.1:1.05,big?1:1.3,1);m.position.set(r[0]/10,0,r[1]/10);m.material.uniforms.tint.value.setRGB(.75,.7,.68)});
 // orbs
 const O=G.net==='client'?(G.tsOrb||[]).map(o=>({x:o[0]/10,y:1.5,z:o[1]/10})):(G.orbs||[]).filter(f=>!f.dead);while(TS.orbM.length<O.length){const m=tsBill(.95,.95);tsSetTex(m,'orb');m.material.uniforms.tint.value.setRGB(1.4,1.1,1.05);scene.add(m);TS.orbM.push(m)}
 TS.orbM.forEach((m,i)=>{const o=O[i];m.visible=!!o;if(!o)return;m.position.set(o.x,o.y-.47,o.z);GL.orb.add(o.x,o.y,o.z,1,.3,.08)})}
function tsClear(){for(const a of [TS.eggM,TS.remM,TS.orbM])for(const m of a)m.visible=false;if(TS.mesh)TS.mesh.visible=false}

// ---------- flood levels (an easy one at 7, then 22, 29, 36 ...): the water rises; past the knees heroes slow down and snake trolls swim faster
function makeFlood(easy){const w=G.W*T,h=G.H*T,c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#1d5866';x.fillRect(0,0,256,256);
 for(let i=0;i<140;i++){x.strokeStyle=`rgba(170,230,240,${.05+Math.random()*.12})`;x.lineWidth=1+Math.random()*2;x.beginPath();const a=Math.random()*256,b=Math.random()*256,r=6+Math.random()*26;x.arc(a,b,r,Math.random()*3,Math.random()*3+2);x.stroke()}
 const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat&&tex.repeat.set(G.W/2,G.H/2);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tex,color:0x7fc4d0,emissive:0x0b3440,roughness:.15,metalness:.2,transparent:true,opacity:.62,depthWrite:false}));
 m.rotation.x=-PI/2;m.position.set(w/2,.02,h/2);m.renderOrder=2;G.lg.add(m);G.flood=easy?{h:.02,mesh:m,tex,said:0,max:2.6,rate:1.3/260,quota:{eel:2,drowned:1}}:{h:.02,mesh:m,tex,said:0,max:2.6,rate:1.3/170};makeFalls(easy?3:5);
 if(!G.demo){banner('The dungeon is flooding!','Find the keys and the exit before the water rises',3.5);say('The dungeon is flooding! Find the exit!',true)}}
// water pours in through openings high on the walls and splashes where it hits the surface
function makeFalls(n){const f=G.flood,W=G.W,g=G.g,c=document.createElement('canvas');c.width=64;c.height=256;const x=c.getContext('2d');x.clearRect(0,0,64,256);
 for(let i=0;i<46;i++){const a=Math.random()*64,w=2+Math.random()*7;const gr=x.createLinearGradient(0,0,0,256);gr.addColorStop(0,'rgba(220,245,255,.0)');gr.addColorStop(.5,`rgba(200,238,250,${.35+Math.random()*.4})`);gr.addColorStop(1,'rgba(220,245,255,.0)');x.fillStyle=gr;x.fillRect(a,Math.random()*128,w,128+Math.random()*128)}
 const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;f.falls=[];f.fallTex=tex;
 const spots=[];for(let j=1;j<G.H-1;j++)for(let i=1;i<W-1;i++){if(g[j*W+i]!==1)continue;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])if(g[(j+dz)*W+i+dx]===0&&g[(j+dz*2)*W+i+dx*2]===0)spots.push([i,j,dx,dz])}
 const sx=G.start?G.start.x:0,sz=G.start?G.start.z:0;
 for(let k=0;k<n&&spots.length;k++){let best=null,bs=-1;for(let t=0;t<40;t++){const c=spots[rnd(spots.length)],px=c[0]*T+T/2,pz=c[1]*T+T/2;let sc=Math.hypot(px-sx,pz-sz)>10?1:0;for(const o of f.falls)sc+=Math.min(1,Math.hypot(o.x-px,o.z-pz)/30);if(sc>bs){bs=sc;best=c}}
  const [i,j,dx,dz]=best,wx=i*T+T/2+dx*(T/2+.03),wz=j*T+T/2+dz*(T/2+.03),ry=Math.atan2(dx,dz),top=WALLH*.74;
  const hole=new THREE.Mesh(new THREE.CircleGeometry(.62,20),new THREE.MeshBasicMaterial({color:0x0b0806}));hole.position.set(wx,top+.25,wz);hole.rotation.y=ry;G.lg.add(hole);
  const lip=new THREE.Mesh(new THREE.TorusGeometry(.66,.09,6,20),new THREE.MeshStandardMaterial({color:0x4a4038,roughness:.9}));lip.position.copy(hole.position);lip.rotation.y=ry;G.lg.add(lip);
  const geo=new THREE.PlaneGeometry(1.05,1);geo.translate(0,-.5,0);const sh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:tex,color:0xcdeefa,transparent:true,opacity:.85,depthWrite:false,side:THREE.DoubleSide,fog:true}));
  sh.position.set(wx+dx*.32,top+.35,wz+dz*.32);sh.rotation.y=ry;sh.rotation.x=0;G.lg.add(sh);f.falls.push({x:wx+dx*.55,z:wz+dz*.55,top:top+.35,sh,t:0})}}
function fallsTick(f,dt){if(!f.falls)return;const frz=f.frz>0;if(f.fallTex.offset&&!frz)f.fallTex.offset.y=(f.fallTex.offset.y+dt*1.6)%1;
 for(const w of f.falls){const len=Math.max(.05,w.top-f.h);w.sh.scale.y=len;w.sh.material.opacity=frz?.5:.85;w.sh.material.color.setHex(frz?0xffffff:0xcdeefa);
  if(!frz&&(w.t-=dt)<=0){w.t=.07;burst(w.x+rf(-.3,.3),f.h+.05,w.z+rf(-.3,.3),0xd8f4ff,4,2.6);if(Math.random()<.5)spark(w.x+rf(-.6,.6),f.h+.02,w.z+rf(-.6,.6),0xffffff,.5)}}}
// under the water: blue haze over your eyes and you start drowning
function drownTick(f,dt){for(const p of players){if(!p.alive)continue;let eye=p.H.eye;if(p.local&&p.cam){p.cam.getWorldPosition(_v);eye=_v.y}const under=f.h>eye-.04;
  if(p.local&&p.cam){if(!p.uw){p.uw=new THREE.Mesh(new THREE.PlaneGeometry(3,3),new THREE.MeshBasicMaterial({color:0x14586a,transparent:true,opacity:0,depthTest:false,depthWrite:false,fog:false}));p.uw.renderOrder=997;p.uw.position.set(0,0,-.3);p.uw.frustumCulled=false;p.cam.add(p.uw)}
   p.uw.material.opacity+=((under?.55:0)-p.uw.material.opacity)*.15;p.uw.visible=p.uw.material.opacity>.02}
  if(under&&G.net!=='client'&&G.transT<=0){hurtPlayer(p,p.max*.07*dt/G.dmgScale);if(!p.drownSaid){p.drownSaid=1;pmsg(p,'You’re underwater! You’re drowning!');rumble(p,300,.7)}}else p.drownSaid=0}}
function floodSlow(){const f=G&&G.flood;return f?1-clamp((f.h-.45)/.8,0,1)*.45:1}
function floodTick(dt){const f=G.flood;if(!f)return;if(f.frz>0){f.frz-=dt;if(f.frz<=0)for(const q of humans())pmsg(q,'The water moves again!')}else if(G.net!=='client'&&G.transT<=0)f.h=Math.min(f.max,f.h+f.rate*dt);
 if(f.mesh.material.color)f.mesh.material.color.setHex(f.frz>0?0xdaf6ff:0x7fc4d0);
 f.mesh.position.y=f.h;if(f.tex.offset){f.tex.offset.x=(G.time*.015)%1;f.tex.offset.y=(G.time*.01)%1}
 const marks=[[.45,'The water is at your knees'],[.85,'The water is at your waist. You’re slowing down'],[1.2,'The water is at your chest! Hurry!'],[1.6,'The water is over your head! Get to the exit!']];
 if(f.said<marks.length&&f.h>=marks[f.said][0]){for(const q of humans()){pmsg(q,marks[f.said][1]);rumble(q,180,.4)}if(f.said>=1)voice('run-go');else say(marks[f.said][1],true);f.said++}
 if(G.net!=='client'&&G.transT<=0&&!(f.frz>0))waterSpawn(f,dt);fallsTick(f,dt);drownTick(f,dt);
 if(f.h>.3&&Math.random()<dt*3)for(const q of players)if(q.alive&&q.moving>.5)spark(q.x+rf(-.5,.5),f.h+.05,q.z+rf(-.5,.5),0xbfeaff,.4)}

// ---------- VR comfort: turning style and a darkened edge while moving
const COMF={turn:'snap30',vig:false};try{const c=JSON.parse(localStorage.getItem('sgvr_comfort')||'{}');if(['snap30','snap45','smooth'].includes(c.turn))COMF.turn=c.turn;COMF.vig=!!c.vig}catch(e){}
function setComf(k,v){COMF[k]=v;try{localStorage.setItem('sgvr_comfort',JSON.stringify(COMF))}catch(e){}const t=$('#comfTurn'),g=$('#comfVig');if(t)t.value=COMF.turn;if(g)g.checked=COMF.vig}
$('#comfTurn').value=COMF.turn;$('#comfVig').checked=COMF.vig;$('#comfTurn').addEventListener('change',e=>setComf('turn',e.target.value));$('#comfVig').addEventListener('change',e=>setComf('vig',e.target.checked));
let VIG=null;
function vigTick(p){if(!p||!p.cam)return;if(!VIG){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),gr=x.createRadialGradient(128,128,40,128,128,128);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.55,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,1)');x.fillStyle=gr;x.fillRect(0,0,256,256);
  VIG=new THREE.Mesh(new THREE.PlaneGeometry(2.2,2.2),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false,depthWrite:false,fog:false,opacity:0}));VIG.renderOrder=998;VIG.position.set(0,0,-.5);VIG.frustumCulled=false}
 if(VIG.parent!==p.cam)p.cam.add(VIG);const want=COMF.vig&&renderer.xr.isPresenting&&!G.paused?clamp((p.moving||0)+(p.dash>0?1:0),0,1)*.9:0;VIG.material.opacity+=(want-VIG.material.opacity)*.2;VIG.visible=VIG.material.opacity>.02}

// ---------- water monsters on flood levels: electric eels and drowned skeletons rise from the water (no generators)
// three swim frames: curved, straight, curved the other way, straight ... so he wiggles as he swims
const EELTOP=(()=>{try{const fr=[];for(const k of [1,0,2,0]){}for(const k of [0,1,2]){const geo=new THREE.PlaneGeometry(1.15,2.3),mat=new THREE.MeshBasicMaterial({transparent:true,opacity:.85,depthWrite:false,fog:true,color:0x9fe8c8}),m=new THREE.InstancedMesh(geo,mat,160);m.count=0;m.frustumCulled=false;m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(m);
  const P={m,n:0,max:160,ok:false};texLoader.load('sprites/m_eel_top'+k+'.webp',t=>{t.encoding=THREE.sRGBEncoding;mat.map=t;mat.needsUpdate=true;P.ok=true},undefined,()=>{});fr.push(P)}return fr}catch(e){return null}})();
const EELSEQ=[1,0,2,0];
// drowned skeletons seen from above, under the surface, before they rise
const SKTOP={};for(const [k,w,h] of [['drowned',1.55,2.3],['drownbrute',1.95,2.3]]){try{const mat=new THREE.MeshBasicMaterial({transparent:true,opacity:.72,depthWrite:false,fog:true,color:0x8ec4c8}),m=new THREE.InstancedMesh(new THREE.PlaneGeometry(w,h),mat,80);m.count=0;m.frustumCulled=false;m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(m);
 const P={m,n:0,max:80,ok:false};texLoader.load('sprites/m_'+k+'_top.webp',t=>{t.encoding=THREE.sRGBEncoding;mat.map=t;mat.needsUpdate=true;P.ok=true},undefined,()=>{});SKTOP[k]=P}catch(e){}}
function surface(e){e.riseAt=G.time;const h=G.flood?G.flood.h:0;burst(e.x,h+.1,e.z,0xbfeaff,18,3.5);ring(e.x,e.z,1.3,0xbfeaff);if(G.time-(G.splashT||0)>.25){G.splashT=G.time;sfx('dash')}}
function waterY(e,t){const h=G.flood?G.flood.h:0;if(e.type==='eel')return Math.max(0,h-.62)+Math.sin(t*5+e.ph)*.12;const r=clamp((t-(e.riseAt||-9))/1,0,1);return -(1-r)*(1-r)*2.6}
function drawWater(e,t){if(!e.hidden)return false;const h=G.flood?G.flood.h:.3;
 if(e.type==='eel'){const P=EELTOP&&EELTOP[EELSEQ[Math.floor(t*(e.moving>.3?7:3)+e.ph*2)%4]];if(P&&P.ok&&P.n<P.max){D.position.set(e.x,h-.07,e.z);D.rotation.set(-PI/2,0,e.rot);D.scale.set(1,1,1);D.updateMatrix();P.m.setMatrixAt(P.n++,D.matrix)}if(Math.random()<.25)GL.spark.add(e.x+rf(-.3,.3),h+.03,e.z+rf(-.3,.3),.3,1,.6);return true}
 const SP=SKTOP[e.type];if(SP&&SP.ok&&SP.n<SP.max){D.position.set(e.x,h-.3+Math.sin(t*2+e.ph)*.04,e.z);D.rotation.set(-PI/2,0,e.rot);D.scale.set(1,1,1);D.updateMatrix();SP.m.setMatrixAt(SP.n++,D.matrix)}
 if(Math.random()<.5)GL.spark.add(e.x+rf(-.6,.6),h+.04,e.z+rf(-.6,.6),.55,.8,.85);if(Math.random()<.06)ring(e.x,e.z,.6+Math.random()*.8,0x9fd8e8);return true}
function waterAI(e,dt){const f=G.flood,n=nearest(e);
 if(e.type==='eel'){if(e.hidden){if(n&&n.d<4.5){e.hidden=false;surface(e)}}else if(n&&n.d>9.5&&G.time-(e.riseAt||0)>2.5){e.hidden=true;burst(e.x,(f?f.h:0)+.1,e.z,0x9fffc0,8,2)}return false}
 if(e.hidden){if(e.lurk&&!(n&&n.d<6.5))return true;e.wait=(e.wait||1.3)-dt;if(e.wait<=0){e.hidden=false;surface(e)}return true}
 return G.time-(e.riseAt||-9)<1}
function waterSpawn(f,dt){if(f.h<.35||G.deathCalm)return;const deep=clamp((f.h-.35)/(1.3-.35),0,1),rate=(.3+2.4*Math.pow(deep,1.4))*(1+Math.max(0,G.level-22)*.03);
 if(Math.random()>rate*dt)return;let wm=0;for(const e of G.enemies)if(!e.dead&&EDEF[e.type].water)wm++;if(wm>=18+deep*40||G.enemies.length>=G.cap)return;
 const alive=players.filter(p=>p.alive);if(!alive.length)return;const p=alive[Math.floor(Math.random()*alive.length)];
 for(let k=0;k<12;k++){const a=Math.random()*TAU,d=rf(5,13),x=p.x+Math.cos(a)*d,z=p.z+Math.sin(a)*d;if(blockedAt(x,z,.6))continue;
  let type;if(f.quota){const left=Object.keys(f.quota).filter(k=>f.quota[k]>0);if(!left.length)return;type=left[rnd(left.length)]}else{const r=Math.random();type=r<.35?'eel':r<.8?'drowned':'drownbrute'}const before=G.enemies.length;spawnEnemy(type,x,z);const e=G.enemies[before];if(e&&e.type===type){e.hidden=true;e.wait=rf(1,1.8);if(f.quota)f.quota[type]--}return}}

let VRDEAD=null;
function vrDeadTick(p){const show=!!(p&&!p.alive&&G&&!G.over&&renderer.xr.isPresenting);if(!show){if(VRDEAD)VRDEAD.visible=false;return}
 if(!VRDEAD){const c=document.createElement('canvas');c.width=1024;c.height=300;const x=c.getContext('2d');x.fillStyle='rgba(40,0,0,.82)';x.fillRect(0,0,1024,300);x.strokeStyle='#ff9a70';x.lineWidth=6;x.strokeRect(3,3,1018,294);
  x.textAlign='center';x.fillStyle='#ffc35a';x.font='bold 70px serif';x.fillText('You have fallen',512,110);x.fillStyle='#fff1d6';x.font='34px sans-serif';x.fillText('You come back on the next level if a friend reaches the exit.',512,180);x.fillText('Click the left stick for the pause menu.',512,235);
  VRDEAD=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.32),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false,fog:false}));VRDEAD.renderOrder=997;VRDEAD.position.set(0,-.05,-1.4);VRDEAD.frustumCulled=false}
 if(VRDEAD.parent!==p.cam)p.cam.add(VRDEAD);VRDEAD.visible=true}

// ---------- loading screen, safety warnings, reduce-flashing option
const SAFE={on:false};
function setSafe(v){SAFE.on=!!v;document.body.classList.toggle('safe',SAFE.on);for(const id of ['bootSafe','safeFx']){const c=document.getElementById(id);if(c)c.checked=SAFE.on}try{localStorage.setItem('sgvr_safe',SAFE.on?'1':'0')}catch(x){}}
(function boot(){let saved=null;try{saved=localStorage.getItem('sgvr_safe')}catch(x){}
 let rm=false;try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(x){}
 setSafe(saved===null?rm:saved==='1');
 for(const id of ['bootSafe','safeFx']){const c=document.getElementById(id);if(c)c.addEventListener('change',()=>setSafe(c.checked))}
 const el=document.getElementById('boot');if(!el)return;
 for(const i of el.querySelectorAll('.bheroes i'))i.style.backgroundImage=`url(${V('sprites/'+i.dataset.s+'.webp')})`;
 const fp=['barb_hold_iron','barb_throw','barb_rune','barb_rune_ghost','barb_skull','barb_skull_smoke','barb_skull_ghost','elf_draw','elf_release','elf_draw_magic','elf_release_magic','valk_hold','valk_hold_glow','valk_hold_spirit','valk_throw','valk_empty','vr_hand_r','vr_staff_l','vr_sleeve_r','vr_sleeve_l','wiz_L_idle','wiz_L_glow','wiz_S_idle','wiz_S_glow'];
 const sp=['angel','angel_face','elf','barbarian','wizard','valkyrie','valkyrie_throw','m_ghost','m_grunt','m_demon','m_gargoyle','m_lobber','m_sorcerer','m_naga','m_death','m_knife','m_knife5','m_eel','m_eel_top0','m_eel_top1','m_eel_top2','m_drowned','m_drownbrute','m_drowned_top','m_drownbrute_top'];
 const urls=[...fp.map(n=>'fp/'+n+'.webp'),...sp.map(n=>'sprites/'+n+'.webp')];
 const bar=document.getElementById('bootBar'),txt=document.getElementById('bootTxt'),go=document.getElementById('bootGo');let done=0,ready=false;
 const finish=()=>{if(ready)return;ready=true;bar.style.width='100%';txt.textContent='Ready. Please read the warnings below.';go.disabled=false;go.textContent='I understand — continue'};
 const step=()=>{done++;bar.style.width=Math.round(done/urls.length*100)+'%';txt.textContent=`Loading heroes and monsters… ${Math.round(done/urls.length*100)}%`;if(done>=urls.length)finish()};
 for(const u of urls){const im=new Image();im.onload=im.onerror=step;im.src=V(u)}
 setTimeout(finish,15000);
 go.addEventListener('click',()=>{if(!ready)return;try{initAudio()}catch(x){}BOOTDONE=true;el.hidden=true;el.style.display='none';const b=document.getElementById('startBtn');if(b)b.focus()});
 // reopening the game (a phone or headset waking the old page, or coming back after a while) shows the warnings again
 const reshow=()=>{if(G&&!G.demo&&!G.over)return;el.hidden=false;el.style.display='';BOOTDONE=false;el.scrollTop=0;if(ready)go.disabled=false};
 addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
 let hidAt=0;document.addEventListener('visibilitychange',()=>{if(document.hidden)hidAt=Date.now();else if(hidAt&&Date.now()-hidAt>60000)reshow()});
})();

//__DBG__
}
