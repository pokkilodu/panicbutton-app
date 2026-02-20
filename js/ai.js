// Lightweight AI utilities for demo purposes (client-side)
// These are simple heuristics and SVG generators — replaceable by real AI APIs.

export function summarizeChapter(text, maxSentences=6){
  const sentences = text.split(/[\.\?!]\s+/).filter(Boolean);
  return sentences.slice(0,maxSentences).join('. ') + (sentences.length>maxSentences? ' ...':'' );
}

export function extractFormulas(text){
  // naive regex: capture common math expressions and LaTeX-like $...$
  const latex = [...text.matchAll(/\$(.+?)\$/g)].map(m=>m[1]);
  const inline = [...text.matchAll(/(?:\d|\w)[ \t]*[=<>+\-/*^].+?(?=[\s\.;,\n]|$)/g)].map(m=>m[0]);
  return Array.from(new Set([...latex,...inline]));
}

export function generateMindmap(center, nodes=[]){
  // returns an SVG string of a radial mindmap
  const w=800,h=300; const cx=100,cy=140; const r=80;
  let svg = `<svg class="svg-diagram" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<defs><style>.t{font:12px sans-serif;fill:#222}</style></defs>`;
  svg += `<g transform="translate(0,0)"><circle cx="${cx}" cy="${cy}" r="40" fill="#ffd1e8" stroke="#ff66b3"/></g>`;
  svg += `<text x="${cx}" y="${cy+4}" text-anchor="middle" class="t">${escapeHtml(center)}</text>`;
  nodes.forEach((n,i)=>{
    const angle = (Math.PI*2)*(i/nodes.length);
    const x = cx + Math.cos(angle)*(r+60);
    const y = cy + Math.sin(angle)*(r+30);
    svg += `<line x1="${cx+20*Math.cos(angle)}" y1="${cy+20*Math.sin(angle)}" x2="${x-10}" y2="${y-10}" stroke="#ffffff55"/>`;
    svg += `<rect x="${x-40}" y="${y-14}" width="80" height="28" rx="6" fill="#e7f1ff" stroke="#66a3ff"/>`;
    svg += `<text x="${x}" y="${y+4}" text-anchor="middle" class="t">${escapeHtml(n)}</text>`;
  });
  svg += `</svg>`;
  return svg;
}

export function generateDiagram(shape='flow', text=''){
  // basic SVG diagram generator for demo
  const w=600,h=220;
  let svg = `<svg class="svg-diagram" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect x="20" y="20" width="120" height="60" rx="10" fill="#fff0f6" stroke="#ff66b3"/>`;
  svg += `<text x="80" y="55" text-anchor="middle">Start</text>`;
  svg += `<rect x="220" y="20" width="160" height="60" rx="10" fill="#f0fff9" stroke="#34c38f"/>`;
  svg += `<text x="300" y="55" text-anchor="middle">Process</text>`;
  svg += `<rect x="460" y="20" width="120" height="60" rx="10" fill="#fff6e6" stroke="#ffb84d"/>`;
  svg += `<text x="520" y="55" text-anchor="middle">End</text>`;
  svg += `</svg>`;
  return svg;
}

export function analyzePreviousYears(questions){
  // simple frequency count by topic/year
  const byYear = {};
  questions.forEach(q=>{byYear[q.year] = (byYear[q.year]||0)+1});
  return {byYear, mostCommon: Object.entries(byYear).sort((a,b)=>b[1]-a[1])};
}

export function predictQuestions(questions, subject){
  // naive predicted questions: sample frequent topics
  const candidates = questions.filter(q=>q.subject===subject).slice(0,5);
  return candidates.map((q,i)=>({id:`p${i+1}`,text:`Predict: ${q.text}`,source:'predicted'}));
}

function escapeHtml(s){return (s+'').replace(/[&<>]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;' }[c]))}
