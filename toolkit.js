/* Scroll-driven card decks. Assets and choreography reference: guillaumezhu.com/#toolkit. */
(()=>{
 const section=document.querySelector('#toolkit');if(!section)return;
 const front=section.querySelector('.tk-frontend'),art=section.querySelector('.tk-art');
 const decks=[front,art].map(w=>({wheel:w,slots:[...w.children],shown:-1,angle:0,velocity:0}));
 const frontLabel=section.querySelector('.tk-front-label'),artLabel=section.querySelector('.tk-art-label');
 const flipper=section.querySelector('.tk-flipper');
 const clamp=(x)=>Math.max(0,Math.min(1,x)),phase=(p,a,b)=>clamp((p-a)/(b-a));
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let listMode=reduce.matches,p=0,lastTime=0,active=false,dirty=true,animations=[];
 const observer=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;if(active)requestAnimationFrame(frame)});observer.observe(section);
 const view=section.querySelector('#tk-view');
 function setList(value){listMode=value;section.classList.toggle('tk-list',value);view.textContent=value?'View animated toolkit':'View all tools';dirty=true;if(value){decks.forEach(d=>d.slots.forEach(s=>{const b=s.querySelector('button');b.tabIndex=0;b.style.pointerEvents='auto'}));}else{section.scrollIntoView();requestAnimationFrame(frame)}}
 view.addEventListener('click',()=>setList(!listMode));if(listMode)setList(true);
 function scrollStep(direction){const stops=[...Array.from({length:8},(_,i)=>i*.3/8),.325,.4,...Array.from({length:decks[1].slots.length},(_,i)=>.45+i*.45/decks[1].slots.length),.96];const next=direction>0?stops.find(x=>x>p+.005):stops.slice().reverse().find(x=>x<p-.005);if(next!==undefined)window.scrollTo({top:section.offsetTop+next*(section.offsetHeight-innerHeight),behavior:reduce.matches?'instant':'smooth'})}
 section.querySelector('#tk-next').addEventListener('click',()=>scrollStep(1));section.querySelector('#tk-previous').addEventListener('click',()=>scrollStep(-1));
 for(const deck of decks)deck.slots.forEach((slot,index)=>{
  slot.querySelector('button').addEventListener('click',()=>{
   animations.forEach(a=>a.cancel());animations=[];
   if(reduce.matches||document.body.classList.contains('paused'))return;
   deck.slots.forEach((other,j)=>{if(other.style.visibility!=='visible'&&!listMode)return;const strength=Math.max(.25,1-Math.abs(j-index)*.18);const a=other.querySelector('.tk-motion').animate([
    {transform:'translateY(0) scale(1)',offset:0},{transform:`translateY(${6*strength}px) scale(${1-.03*strength})`,offset:.118},{transform:`translateY(${-24*strength}px) scale(${1+.07*strength})`,offset:.382},{transform:`translateY(${5*strength}px) scale(${1-.014*strength})`,offset:.65},{transform:`translateY(${-2*strength}px) scale(1.005)`,offset:.82},{transform:'translateY(0) scale(1)',offset:1}
   ],{duration:680,delay:Math.abs(j-index)*45,easing:'ease-out'});animations.push(a)});
  });
 });
 function frame(time){if(!active)return;if(listMode){lastTime=time;return}const dt=Math.min((time-lastTime)/1000||.016,.035);lastTime=time;
  const r=section.getBoundingClientRect();const next=clamp(-r.top/(section.offsetHeight-innerHeight));const moving=Math.abs(next-p)>.00001;p=next;
  if(moving){animations.forEach(a=>a.cancel());animations=[]}
  const isArt=p>=.45;front.style.opacity=isArt?'0':'1';art.style.opacity=isArt?'1':'0';
  frontLabel.style.opacity=1-phase(p,.35,.40);artLabel.style.opacity=phase(p,.40,.45);flipper.style.transform=`rotateY(${180*phase(p,.35,.45)}deg)`;
  decks.forEach((d,k)=>{
   const start=k?.45:0,end=k?.90:.30,collapse=k?0:phase(p,end,end+.05);const count=Math.min(d.slots.length-1,Math.floor(phase(p,start,end)*d.slots.length));
   let target=-(count*3.5)/2*(1-collapse);d.velocity+=(target-d.angle)*190*dt;d.velocity*=Math.exp(-13*dt);d.angle+=d.velocity*dt;if(collapse>0){d.angle=target;d.velocity=0}d.wheel.style.transform=`rotate(${d.angle}deg)`;
   d.slots.forEach((slot,i)=>{let visible=i<=count;if(!k&&p>=.35)visible=i===d.slots.length-1;
    const was=slot.style.visibility==='visible';slot.style.visibility=visible?'visible':'hidden';slot.style.transform=`rotate(${i*3.5*(1-collapse)}deg)`;slot.style.zIndex=i+1;
    const button=slot.querySelector('button');button.tabIndex=visible&&(k===+isArt)?0:-1;button.style.pointerEvents=button.tabIndex===0?'auto':'none';
    if(visible&&!was&&!reduce.matches&&!document.body.classList.contains('paused'))slot.animate([{scale:'.94'},{scale:'1.013',offset:.6},{scale:'1'}],{duration:500,easing:'ease-out'});
   });
  });
  dirty=false;requestAnimationFrame(frame);
 }
 window.addEventListener('resize',()=>{dirty=true},{passive:true});
})();
