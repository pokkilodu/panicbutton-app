import {ensureSeed,read,write,DB} from './models.js';
import {AdaptiveEngine} from './engine.js';
import * as AI from './ai.js';
import * as AN from './analytics.js';

ensureSeed();
const engine = new AdaptiveEngine();
const DEMO_SPEED = 1/60;

function $(id){return document.getElementById(id)}

// maintain previous dashboard pieces if present
function safeQuery(id){try{return $(id)}catch(e){return null}}

// Home interactions
function handleCTAs(){
  const start = safeQuery('start-prep');
  const explore = safeQuery('explore-features');
  const saveName = safeQuery('save-name');
  const nameInput = safeQuery('user-name');
  const ageInput = safeQuery('user-age');
  const classInput = safeQuery('user-class');

  if(explore){ explore.onclick = ()=>{ document.getElementById('features').scrollIntoView({behavior:'smooth'}); } }
  if(start){ start.onclick = ()=>{ startPreparationFlow(); } }
  if(saveName && nameInput){
    saveName.onclick = ()=>{
      const v = nameInput.value.trim();
      const age = ageInput && ageInput.value.trim();
      const cls = classInput && classInput.value.trim();
      if(!v) return alert('Enter a name');
      if(!age) return alert('Enter your age');
      if(!cls) return alert('Enter your class/grade');
      localStorage.setItem('np_user_name', v);
      localStorage.setItem('np_user_age', age);
      localStorage.setItem('np_user_class', cls);
      personalizeHeader();
      saveName.innerText='Saved';
      setTimeout(()=>saveName.innerText='Personalize',1000);
    }
  }
}

function personalizeHeader(){
  const name = localStorage.getItem('np_user_name');
  if(name){ const brand = document.querySelector('.brand-text .tag'); if(brand) brand.innerText = `Welcome, ${name}`; }
}

function startPreparationFlow(){
  // quick demo preparation action: scroll to features and highlight engine
  document.getElementById('features').scrollIntoView({behavior:'smooth'});
  const first = document.querySelector('.feature-card');
  if(first){ first.style.transform='translateY(-6px) scale(1.02)'; setTimeout(()=>first.style.transform='',900); }
}

// wire existing demo functions (if used as dashboard)
function attachLegacy(){
  const newSub = safeQuery('new-subject'); if(newSub){ newSub.onclick = ()=>{ const subs = read(DB.SUBJECTS_KEY)||[]; subs.push({id:'s'+(subs.length+1),name:'Physics',chapters:['Kinematics','Optics']}); write(DB.SUBJECTS_KEY,subs); location.reload(); } }
  const themeToggle = safeQuery('theme-toggle'); if(themeToggle){ themeToggle.onclick = ()=>{ document.documentElement.classList.toggle('dark'); themeToggle.innerText = document.documentElement.classList.contains('dark')? 'Light':'Dark'; } }
  // legacy trend rendering
  const trend = safeQuery('trend-vis'); if(trend){ const q = read(DB.QUESTIONS_KEY)||[]; AN.renderTrendSVG(trend, q); }
}

// initial boot
function init(){ personalizeHeader(); handleCTAs(); attachLegacy(); }

init();
