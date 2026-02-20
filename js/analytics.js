import {read} from './models.js';
import {analyzePreviousYears} from './ai.js';

export function computeMarksDistribution(questions){
  const map = {};
  questions.forEach(q=>{map[q.marks]=(map[q.marks]||0)+1});
  return map;
}

export function difficultyScore(questions){
  // simple heuristic: longer answers or high marks => harder
  return questions.map(q=>({id:q.id,score: Math.min(1, (q.marks/10) + ((q.text||'').length/200))}));
}

export function renderTrendSVG(container,questions){
  const res = analyzePreviousYears(questions||[]);
  const entries = Object.entries(res.byYear).sort((a,b)=>a[0]-b[0]);
  if(entries.length===0){container.innerText='No trend data'}
  else{
    const w = 400, h=120; let path=''; const max = Math.max(...entries.map(e=>e[1]));
    entries.forEach((e,i)=>{const x = (i/(entries.length-1||1))*(w-20)+10; const y = h - (e[1]/max)*(h-20)-10; path += (i?' L ':'M ')+x+' '+y});
    const svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="none" stroke="#fff" stroke-width="2"/></svg>`;
    container.innerHTML = svg;
  }
}
