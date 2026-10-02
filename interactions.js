'use strict';
/* Independently implemented orbital physics, scroll choreography and spatial gallery. */
(() => {
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 const mix=(a,b,t)=>a+(b-a)*t;
 const smooth=t=>t*t*(3-2*t);
 const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
 const $=s=>document.querySelector(s);
 const ns='http://www.w3.org/2000/svg';
 const point={x:innerWidth/2,y:innerHeight/2,tx:innerWidth/2,ty:innerHeight/2,known:false};
 const hero=$('.hero'),identity=$('#identity-motion'),core=$('#identity-core'),small=$('#identity-small'),ring=$('#identity-ring');
 const guides=[...identity.querySelectorAll('ellipse')];
 const satellites=[{el:small,angle:-.65,home:-.65,r:84,size:21,phase:0},{el:ring,angle:Math.PI/2,home:Math.PI/2,r:128,size:56,phase:.5}].map(s=>({...s,reach:s.r,axis:0,velocity:0,cycles:0}));
 let triggerTime=-10,aim={x:0,y:0},age=0;
 function activate(e){if(reducedMotion.matches||paused)return;const cx=innerWidth*.5,cy=innerHeight*.45;aim={x:e.clientX-cx,y:e.clientY-cy};triggerTime=age;satellites.forEach(s=>{s.cycles=0;});}
 hero.addEventListener('click',e=>{if(e.target.closest('a,[data-project],#motion-toggle'))return;activate(e);});
 $('#gravity-action').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate({clientX:innerWidth*.72,clientY:innerHeight*.35});}});
 const cursor=document.createElement('span');cursor.className='gravity-pointer';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);
 window.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;point.tx=e.clientX;point.ty=e.clientY;if(!point.known){point.x=e.clientX;point.y=e.clientY;}point.known=true;});
 document.documentElement.addEventListener('pointerleave',()=>{point.known=false;});
 window.addEventListener('blur',()=>{point.known=false;});
 let accentIndex=0;const colours=['#b481f8','#96b7d8','#bb9b1b'];
 document.addEventListener('click',e=>{if(e.target.closest('button,a'))return;document.documentElement.style.setProperty('--purple',colours[++accentIndex%colours.length]);});
 function updateIdentity(dt){
  const dock=smooth(clamp(scrollY/(innerHeight*.5))), mobile=innerWidth<680;
  const scale=mix(mobile?.6:1,mobile?0:.42,dock);
  const cx=mix(innerWidth*.5,55,dock),cy=mix(innerHeight*.45,135,dock);
  identity.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);
  identity.style.opacity=mobile?String(1-dock):'1';
  const attrs=(el,x,y,r)=>{el.setAttribute('cx',x);el.setAttribute('cy',y);el.setAttribute('r',r);};
  attrs(core,cx,cy,55*scale);
  const t=age-triggerTime,envelope=t<0?0:t<.9?1:1-smooth(clamp((t-.9)/1.8));
  satellites.forEach((sat,i)=>{
   const direction=Math.atan2(aim.y,aim.x)+sat.phase;
   sat.axis+=wrap(direction-sat.axis)*(1-Math.exp(-dt/.5));
   const near=sat.r-envelope*(sat.r-(i?114:82));
   sat.reach=mix(sat.reach,near+Math.min(Math.hypot(aim.x,aim.y),650)*envelope,1-Math.exp(-dt/.35));
   const a=(sat.reach+near)/2,ecc=Math.max(0,(sat.reach-near)/(sat.reach+near));
   const radius=a*(1-ecc*ecc)/(1-ecc*Math.cos(sat.angle-sat.axis));
   if(!paused&&!reducedMotion.matches){
    if(envelope>.005||sat.cycles>0&&sat.cycles<2.2){
     const speed=4.8*Math.pow(sat.r/Math.max(30,radius),1.25)*(1-.65*Math.pow(clamp(sat.cycles/2.2),2.2));
     sat.velocity=mix(sat.velocity,speed,1-Math.exp(-dt*20));sat.cycles+=Math.abs(sat.velocity)*dt/(Math.PI*2);
    }else{sat.velocity+=(-wrap(sat.angle-sat.home)*100-sat.velocity*18)*dt;}
    sat.angle+=sat.velocity*dt;
   }
   const rr=a*(1-ecc*ecc)/(1-ecc*Math.cos(sat.angle-sat.axis));
   attrs(sat.el,cx+Math.cos(sat.angle)*rr*scale,cy+Math.sin(sat.angle)*rr*scale,sat.size*scale);
   if(i)sat.el.setAttribute('stroke-width',String(30*scale));
   const g=guides[i],gx=cx+a*ecc*Math.cos(sat.axis)*scale,gy=cy+a*ecc*Math.sin(sat.axis)*scale;
   g.setAttribute('cx',gx);g.setAttribute('cy',gy);g.setAttribute('rx',a*scale);g.setAttribute('ry',a*Math.sqrt(1-ecc*ecc)*scale);g.setAttribute('transform',`rotate(${sat.axis*180/Math.PI} ${gx} ${gy})`);g.style.opacity=String(Math.min(.8,ecc*2)*(1-dock));
  });
  const coord=$('#identity-coordinate');coord.setAttribute('x',cx+80*scale);coord.setAttribute('y',cy+140*scale);coord.textContent=envelope>.02?`${Math.round(aim.x)}, ${Math.round(aim.y)}`:'';coord.style.opacity=String(1-dock);
 }
 // Gallery: points on a sphere, two-axis drag with momentum, depth blur and perspective.
 const journey=$('.gallery-journey'),gallery=$('#project-grid'),view=$('#gallery-view'),mask=$('.manifesto');
 document.querySelectorAll('a[href="#work"]').forEach(link=>link.addEventListener('click',e=>{if(gridMode)return;e.preventDefault();window.scrollTo({top:scrollY+journey.getBoundingClientRect().top+(journey.offsetHeight-innerHeight)*.47,behavior:reducedMotion.matches?'instant':'smooth'});}));
 let cards=[],rotX=.15,rotY=.3,vx=0,vy=0,drag=false,prevX=0,prevY=0,travel=0,blocked=false,gridMode=reducedMotion.matches;
 function collect(){cards=[...gallery.children].map((el,i,all)=>{const y=1-2*(i+.5)/all.length,r=Math.sqrt(1-y*y),a=i*2.399963;return {el,x:Math.cos(a)*r,y,z:Math.sin(a)*r};});}
 collect();new MutationObserver(collect).observe(gallery,{childList:true});
 function toggleGrid(on){gridMode=on;journey.classList.toggle('grid-browse',on);gallery.classList.toggle('orbit-view',!on);view.setAttribute('aria-pressed',String(on));view.textContent=on?'Orbit view':'Grid view';cards.forEach(c=>{c.el.removeAttribute('style');});}
 view.addEventListener('click',()=>{toggleGrid(!gridMode);$('#work').scrollIntoView({block:'start',behavior:'instant'});});toggleGrid(gridMode);
 $('#gallery-prev').addEventListener('click',()=>{rotY-=.5;});$('#gallery-next').addEventListener('click',()=>{rotY+=.5;});
 gallery.addEventListener('pointerdown',e=>{if(gridMode||e.button!==0)return;drag=true;prevX=e.clientX;prevY=e.clientY;travel=0;blocked=false;vx=vy=0;});
 window.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-prevX,dy=e.clientY-prevY;travel+=Math.abs(dx)+Math.abs(dy);rotY+=dx*.005;rotX-=dy*.005;vy=dx*.003;vx=-dy*.003;prevX=e.clientX;prevY=e.clientY;});
 window.addEventListener('pointerup',()=>{if(drag){blocked=travel>8;drag=false;}});window.addEventListener('pointercancel',()=>{drag=false;});
 gallery.addEventListener('click',e=>{if(blocked){e.stopPropagation();e.preventDefault();blocked=false;}},true);gallery.addEventListener('dragstart',e=>e.preventDefault());
 gallery.addEventListener('focusin',e=>{if(!gridMode&&e.target.matches(':focus-visible'))toggleGrid(true);});
 function updateGallery(dt){
  const rect=journey.getBoundingClientRect(),p=clamp(-rect.top/Math.max(1,rect.height-innerHeight));
  if(gridMode)return;
  const covering=1-smooth(clamp((p-.02)/.38));
  mask.style.clipPath=`circle(${covering*Math.hypot(innerWidth,innerHeight)*.65}px at 50% 50%)`;
  mask.style.pointerEvents=covering>.06?'auto':'none';mask.style.visibility=covering>.001?'visible':'hidden';
  if(rect.top>innerHeight||rect.bottom<0)return;
  const collapse=clamp((p-.78)/.2),shrink=Math.pow(1-collapse,2.2),entry=mix(2.3,1,1-Math.pow(1-clamp(p/.44),3));
  if(!paused&&!reducedMotion.matches&&!dialog.open&&!drag){rotY+=(.10+vy*60)*dt;rotX+=(.018+vx*60)*dt;vx*=Math.pow(.94,dt*60);vy*=Math.pow(.94,dt*60);}
  const w=gallery.clientWidth,h=gallery.clientHeight,radius=Math.min(w*.44,h*.6)*entry*shrink,perspective=Math.max(w*.9,900);
  const sy=Math.sin(rotY),cy=Math.cos(rotY),sx=Math.sin(rotX),cx=Math.cos(rotX);
  cards.forEach(c=>{const x=c.x*cy+c.z*sy,z=-c.x*sy+c.z*cy,y=c.y*cx-z*sx,depth=c.y*sx+z*cx;
   const projection=perspective/(perspective-depth*radius),zNorm=(depth+1)/2;
   c.el.style.transform=`translate3d(${x*radius*projection}px,${y*radius*projection}px,0) scale(${projection*shrink})`;
   c.el.style.filter=`brightness(${.26+.74*zNorm}) blur(${Math.pow(1-zNorm,2)*8}px)`;
   c.el.style.zIndex=String(Math.round(zNorm*100));c.el.style.opacity=String(shrink);c.el.style.pointerEvents=collapse>.8?'none':'';
  });
  $('.drag-label').style.opacity=String(clamp((p-.33)*9)*(1-collapse));
 }
 // Skills: actual near-neighbour plexus, rather than lines from the cursor to everything.
 const section=$('.creative-orbits'),universe=$('.skills-universe');
 const net=document.createElementNS(ns,'svg');net.classList.add('proximity-net');net.setAttribute('aria-hidden','true');section.append(net);
 const nodeEls=[$('.skills-core'),...section.querySelectorAll('.skill-planet')];
 const segments=[];for(let i=0;i<21;i++){const l=document.createElementNS(ns,'line');net.append(l);segments.push(l);}
 const guest=document.createElement('span');guest.className='guest-point';guest.setAttribute('aria-hidden','true');universe.append(guest);
 let guestAngle=.4,guestPull={x:0,y:0};
 function updatePlexus(dt){const box=section.getBoundingClientRect();if(box.bottom<0||box.top>innerHeight)return;
  net.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
  if(!paused&&!skillsPaused&&!reducedMotion.matches)guestAngle+=dt*.25;
  const ub=universe.getBoundingClientRect(),cx=ub.left+ub.width/2,cy=ub.top+ub.height/2,rad=ub.width*.22;
  const bx=cx+Math.cos(guestAngle)*rad,by=cy+Math.sin(guestAngle)*rad,dx=point.x-bx,dy=point.y-by,d=Math.hypot(dx,dy);
  const pull=point.known&&d<260?.95*(1-d/260):0;
  guestPull.x=mix(guestPull.x,dx*pull,1-Math.exp(-dt*(pull?3.4:1.1)));guestPull.y=mix(guestPull.y,dy*pull,1-Math.exp(-dt*(pull?3.4:1.1)));
  const gx=bx+guestPull.x,gy=by+guestPull.y;guest.style.left=`${(gx-ub.left)/ub.width*100}%`;guest.style.top=`${(gy-ub.top)/ub.height*100}%`;
  const points=nodeEls.map(el=>{const r=el.getBoundingClientRect();return {x:r.left+r.width/2-box.left,y:r.top+r.height/2-box.top};});points.push({x:gx-box.left,y:gy-box.top});
  if(point.known&&point.y>box.top&&point.y<box.bottom)points.push({x:point.x-box.left,y:point.y-box.top});
  let n=0;for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){const a=points[i],b=points[j],dist=Math.hypot(a.x-b.x,a.y-b.y);if(dist>=320||dist<4)continue;const l=segments[n++];l.setAttribute('x1',a.x);l.setAttribute('y1',a.y);l.setAttribute('x2',b.x);l.setAttribute('y2',b.y);l.style.opacity=String(Math.pow(1-dist/320,1.5)*.5);}
  for(;n<segments.length;n++)segments[n].style.opacity='0';
  const entrance=clamp((innerHeight-box.top)/(innerHeight*.6));$('.discipline-panel').style.clipPath=`circle(${mix(0,150,smooth(entrance))}% at 0% 50%)`;
 }
 // Individual words resolve as the biography moves into view.
 const bioWords=[];document.querySelectorAll('.about-layout p').forEach(p=>{const words=p.textContent.split(/\s+/);p.textContent='';words.forEach(word=>{const span=document.createElement('span');span.className='bio-word';span.textContent=word+' ';p.append(span);bioWords.push(span);});});
 function scrollWords(){for(const word of bioWords){const r=word.getBoundingClientRect();word.style.opacity=String(reducedMotion.matches?1:mix(.15,1,clamp((innerHeight*.87-r.top)/160)));}}
 let last=performance.now();
 function frame(now){const dt=Math.min((now-last)/1000,.033);last=now;if(!document.hidden){if(!paused)age+=dt;
  point.x=mix(point.x,point.tx,1-Math.exp(-dt*18));point.y=mix(point.y,point.ty,1-Math.exp(-dt*18));
  cursor.style.transform=`translate3d(${point.x}px,${point.y}px,0)`;cursor.style.opacity=point.known&&!reducedMotion.matches&&!dialog.open?'1':'0';
  const under=document.elementFromPoint(point.tx,point.ty);cursor.classList.toggle('on-light',!!under?.closest('.creative-orbits,.about,.contact,.manifesto'));cursor.classList.toggle('on-link',!!under?.closest('a,button'));
  updateIdentity(dt);updateGallery(dt);updatePlexus(dt);scrollWords();}
  requestAnimationFrame(frame);
 }requestAnimationFrame(frame);
})();
