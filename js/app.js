import {ensureSeed,read,write,DB} from './models.js';
import {AdaptiveEngine} from './engine.js';
import * as AI from './ai.js';
import * as AN from './analytics.js';

ensureSeed();

const engine = new AdaptiveEngine();
const DEMO_SPEED = 1/60; // minutes -> seconds for quick demo (1 minute = 1 second)

function $(id){return document.getElementById(id)}

function renderSubjects(){
  const subs = read(DB.SUBJECTS_KEY)||[]; const container = $('subjects'); container.innerHTML='';
  subs.forEach(s=>{
    const el = document.createElement('div'); el.className='subject fade-enter';
    el.innerHTML = `<div>${s.name}</div><div><button data-id="${s.id}" class="open">Open</button></div>`;
    container.appendChild(el);
  });
  container.querySelectorAll('.open').forEach(b=>b.onclick = ()=>openSubject(b.dataset.id));
}

function openSubject(id){
  const subs = read(DB.SUBJECTS_KEY)||[]; const s = subs.find(x=>x.id===id);
  if(!s) return;
  $('session-area').innerHTML = `<h3>${s.name}</h3><p>Chapters: ${s.chapters.join(', ')}</p>`;
}

function startAdaptiveSession(){
  const subs = read(DB.SUBJECTS_KEY)||[]; if(!subs[0]) return alert('No subject');
  const chapters = subs[0].chapters;
  const perf = read(DB.PERFORMANCE_KEY)||[];
  const plan = engine.planSession(subs[0].id, chapters, perf);
  $('session-area').innerHTML = `<div>Planned session for ${subs[0].name}</div>`;
  plan.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<h4>${p.chapter}</h4>`+p.phases.map(ph=>`<div>${ph.name}: ${ph.min} min</div>`).join('');
    $('session-area').appendChild(card);
  });
  // demo: run the first phase timers briefly
  runDemoTimers(plan);
}

function runDemoTimers(plan){
  // sequentially run short timers to simulate phases
  let seq = [];
  plan.forEach(p=>p.phases.forEach(ph=>seq.push({chapter:p.chapter,phase:ph.name,min:ph.min})));
  let i=0; const out = document.createElement('div'); out.id='session-log'; $('session-area').appendChild(out);
  function next(){
    if(i>=seq.length) return out.append(' Session complete');
    const cur = seq[i++]; out.append(`Starting ${cur.phase} for ${cur.chapter} (${cur.min} min)\n`);
    // demo timer
    setTimeout(next, Math.max(300, Math.round(cur.min*DEMO_SPEED*1000)));
  }
  next();
}

function startMockTest(){
  const qs = read(DB.QUESTIONS_KEY)||[]; if(qs.length===0) return alert('No questions');
  const sample = qs.slice(0,3);
  let score = 0; sample.forEach((q,i)=>{
    const correct = Math.random()>0.4; if(correct) score += q.marks; // random auto-eval demo
    write(DB.PERFORMANCE_KEY,[{topic:q.chapter,score:correct?0.9:0.4}]);
  });
  $('analytics-area').innerText = `Mock test finished — score: ${score}`;
}

function wire(){
  renderSubjects();
  $('new-subject').onclick = ()=>{ // add sample
    const subs = read(DB.SUBJECTS_KEY)||[]; subs.push({id:'s'+(subs.length+1),name:'Physics',chapters:['Kinematics','Optics']}); write(DB.SUBJECTS_KEY,subs); renderSubjects(); };
  $('start-session').onclick = startAdaptiveSession;
  $('start-mock').onclick = startMockTest;
  $('theme-toggle').onclick = ()=>document.documentElement.classList.toggle('dark');
  // show trend
  const q = read(DB.QUESTIONS_KEY)||[]; AN.renderTrendSVG($('analytics-area'), q);
}

wire();
