import {read,write,DB} from './models.js';

// Adaptive Study Engine — client-side demo
export class AdaptiveEngine{
  constructor(){
    // base plan (minutes): [theory,reinforce,mindmap,diagram,summary]
    this.basePlan = [30,15,10,10,5];
    this.timings = [...this.basePlan];
  }

  getTimings(){return this.timings}

  adjustByPerformance(performance){
    // performance: array of {topic,score 0-1}
    // lower scores increase time allocation for that topic-types
    const weakness = performance.filter(p=>p.score<0.6).length;
    const factor = 1 + Math.min(0.5, weakness*0.12);
    this.timings = this.basePlan.map(t => Math.round(t*factor));
    return this.timings;
  }

  // For demo: returns phased tasks with minutes
  planSession(subjectId, chapters=[], performance=[]){
    const adjusted = this.adjustByPerformance(performance);
    return chapters.map(ch=>({chapter:ch,phases:[
      {name:'Deep Theory',min:adjusted[0]},
      {name:'Reinforcement',min:adjusted[1]},
      {name:'Mindmap',min:adjusted[2]},
      {name:'Diagrams',min:adjusted[3]},
      {name:'Summary',min:adjusted[4]}
    ]}));
  }
}
