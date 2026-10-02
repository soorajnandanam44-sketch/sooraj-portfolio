'use strict';
const projects = window.PORTFOLIO_PROJECTS;
const grid = document.querySelector('#project-grid');
const dialog = document.querySelector('#project-dialog');
const media = document.querySelector('#dialog-media');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.querySelector('#motion-toggle');
let paused = reducedMotion.matches;
let lastTrigger = null;
const text = (tag, content, className) => {
  const node = document.createElement(tag); node.textContent = content;
  if (className) node.className = className;
  return node;
};
function renderProjects(filter = 'all') {
  grid.replaceChildren();
  const visible = projects.filter(p => p.selected && (filter === 'all' || p.filters.includes(filter)));
  visible.forEach(p => {
    const article = document.createElement('article'); article.className = 'project';
    const button = document.createElement('button'); button.className = 'project-button'; button.dataset.project = p.id;
    button.setAttribute('aria-label', `View ${p.title}`);
    const frame = document.createElement('div'); frame.className = 'project-image';
    const img = new Image(); img.src = p.image; img.alt = p.alt; img.loading = 'lazy'; img.width = 900; img.height = 600;
    frame.append(img, text('span', p.video ? '▶' : '↗', 'view-project'));
    const meta = document.createElement('div'); meta.className = 'project-meta';
    meta.append(text('span', p.category.toUpperCase()), text('span', String(projects.indexOf(p)+1).padStart(2,'0')));
    button.append(frame, meta, text('h3', p.title)); article.append(button); grid.append(article);
  });
  document.querySelector('#work-count').textContent = `${String(visible.length).padStart(2,'0')} PROJECTS`;
  const allCount = projects.filter(p => p.selected).length;
  const allSup = document.querySelector('[data-filter="all"] sup');
  if (allSup) allSup.textContent = allCount;
}
renderProjects();
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button));});
  renderProjects(button.dataset.filter);
}));
function openProject(id, trigger) {
  const project = projects.find(p => p.id === id); if (!project) return;
  lastTrigger = trigger;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-category').textContent = project.category.toUpperCase();
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#dialog-tools').textContent = project.tools;
  const external = document.querySelector('#dialog-external'); external.hidden = !project.external;
  if (project.external) external.href = project.external; else external.removeAttribute('href');
  const error = document.querySelector('#video-error'); error.hidden = true;
  media.replaceChildren();
  if (project.video) {
    const video = document.createElement('video'); video.controls = true; video.playsInline = true; video.poster = project.image;
    video.preload = 'metadata'; video.src = project.video; video.setAttribute('aria-label', project.title);
    video.addEventListener('error', () => {error.hidden = false;}); media.append(video);
  } else {const img = new Image(); img.src = project.image; img.alt = project.alt; media.append(img);}
  dialog.showModal(); document.body.style.overflow = 'hidden';
  document.querySelector('#close-dialog').focus();
}
document.addEventListener('click', e => {const trigger = e.target.closest('[data-project]'); if (trigger) openProject(trigger.dataset.project, trigger);});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => {if (e.target === dialog) {const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close', () => { const video=media.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load();}media.replaceChildren();document.body.style.overflow='';if(lastTrigger?.isConnected)lastTrigger.focus();});
function syncMotion() {document.body.classList.toggle('paused', paused);toggle.setAttribute('aria-pressed', String(paused));toggle.textContent = paused ? '▶ Resume motion' : 'Ⅱ Pause motion';}
toggle.addEventListener('click', () => {paused = !paused;syncMotion();});
reducedMotion.addEventListener('change', e => {paused = e.matches;syncMotion();});syncMotion();

document.querySelector("#year").textContent = new Date().getFullYear();
// Orbital skills: readable content stays still while its satellite controls revolve.
const disciplineData = {
 graphic: {number:'01 / PRIMARY DISCIPLINE',title:'Graphic design.',copy:'Bold visuals with a clear purpose. From campaign creative to visual identities, I use typography, colour, and composition to make ideas recognizable and memorable.',note:'Campaign creative · Visual identity · Art direction',href:'#work'},
 motion: {number:'02 / PRIMARY DISCIPLINE',title:'Ideas in motion.',copy:'A strong visual becomes a story through movement. I bring illustration, typography, and product narratives to life with rhythm, timing, and thoughtful animation.',note:'Motion graphics · Animated explainers · Commercial films',href:'#motion'},
 three: {number:'03 / PRODUCT & DIMENSION',title:'A new dimension.',copy:'Shape, texture, and light tell a product’s story. I create detailed 3D models and animations that reveal the form, materials, and personality of an object.',note:'Blender · Product animation · Lighting & materials',href:'#work'},
 web: {number:'04 / SECONDARY DISCIPLINE',title:'Beyond the frame.',copy:'I carry the visual story into digital experiences. Clear navigation and cohesive Webflow layouts give campaign ideas a home that is easy to explore.',note:'Webflow · Landing pages · Digital experiences',href:'#digital'}
};
document.querySelectorAll('[data-discipline]').forEach(button => button.addEventListener('click', () => {
 const key=button.dataset.discipline, data=disciplineData[key];
 document.querySelectorAll('[data-discipline]').forEach(b => {const selected=b.dataset.discipline===key;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
 for(const field of ['number','title','copy','note'])document.querySelector('#discipline-'+field).textContent=data[field];
 document.querySelector('#discipline-link').href=data.href;
 document.querySelector('#discipline-status').textContent=data.title+' '+data.copy;
}));
const skillsPause=document.querySelector('#skills-pause');
let skillsPaused=reducedMotion.matches;
function updateSkillsPause(){document.querySelector('.creative-orbits').classList.toggle('orbits-paused',skillsPaused);skillsPause.setAttribute('aria-pressed',String(skillsPaused));skillsPause.textContent=skillsPaused?'▶ Resume orbits':'Ⅱ Pause orbits';}
skillsPause.addEventListener('click',()=>{skillsPaused=!skillsPaused;updateSkillsPause();});
reducedMotion.addEventListener('change',e=>{skillsPaused=e.matches;updateSkillsPause();});
updateSkillsPause();

