(()=>{
 const section=document.querySelector('#ai-toolkit');if(!section)return;
 const wheel=section.querySelector('.ai-wheel'),slots=[...wheel.children],view=section.querySelector('#ai-view');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let list=reduced.matches,visible=false,raf=0,angle=0,velocity=0,last=0,progress=0,animations=[];
 const clamp=v=>Math.min(1,Math.max(0,v));
 function schedule(){if(!raf&&visible&&!list)raf=requestAnimationFrame(render)}
 function setList(value,scrollToSection=false){list=value;section.classList.toggle('tk-list',list);view.textContent=list?'View animated toolkit':'View all tools';if(list){cancelAnimationFrame(raf);raf=0;slots.forEach(s=>{s.querySelector('button').tabIndex=0;s.querySelector('button').style.pointerEvents='auto'})}else{if(scrollToSection)section.scrollIntoView({behavior:'instant'});schedule()}}
 section.classList.add('ai-enhanced');setList(list);
 view.addEventListener('click',()=>setList(!list,true));reduced.addEventListener('change',e=>setList(e.matches));
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule()}).observe(section);
 section.querySelectorAll('[data-ai-step]').forEach(b=>b.addEventListener('click',()=>{const stops=[0,.15,.3,.45,.6,.85];const next=+b.dataset.aiStep>0?stops.find(p=>p>progress+.01):stops.slice().reverse().find(p=>p<progress-.01);if(next!==undefined)window.scrollTo({top:scrollY+section.getBoundingClientRect().top+next*(section.offsetHeight-innerHeight),behavior:reduced.matches?'instant':'smooth'})}));
 slots.forEach((slot,index)=>slot.querySelector('button').addEventListener('click',()=>{
  animations.forEach(a=>a.cancel());animations=[];if(reduced.matches||document.body.classList.contains('paused'))return;
  slots.forEach((s,i)=>{if(!list&&s.style.visibility!=='visible')return;const power=Math.max(.25,1-Math.abs(i-index)*.18);animations.push(s.querySelector('.tk-motion').animate([{transform:'translateY(0) scale(1)'},{transform:`translateY(${6*power}px) scale(.98)`,offset:.12},{transform:`translateY(${-24*power}px) scale(1.05)`,offset:.38},{transform:`translateY(${4*power}px) scale(.99)`,offset:.7},{transform:'translateY(0) scale(1)'}],{duration:680,delay:Math.abs(i-index)*45,easing:'ease-out'}))});
 }));
 function render(time){raf=0;if(!visible||list)return;const dt=Math.min((time-last)/1000||.016,.035);last=time;progress=clamp(-section.getBoundingClientRect().top/(section.offsetHeight-innerHeight));const count=Math.min(slots.length-1,Math.floor(progress/.75*slots.length));const target=-count*3.5/2;
  velocity+=(target-angle)*190*dt;velocity*=Math.exp(-13*dt);angle+=velocity*dt;wheel.style.transform=`rotate(${angle}deg)`;
  slots.forEach((s,i)=>{const show=i<=count,was=s.style.visibility==='visible';s.style.visibility=show?'visible':'hidden';s.style.transform=`rotate(${i*3.5}deg)`;s.style.zIndex=i+1;const b=s.querySelector('button');b.tabIndex=show?0:-1;b.style.pointerEvents=show?'auto':'none';if(show&&!was&&!reduced.matches&&!document.body.classList.contains('paused'))s.animate([{scale:'.94'},{scale:'1.013',offset:.6},{scale:'1'}],{duration:500,easing:'ease-out'})});schedule();
 }
})();
