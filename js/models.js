// Sample database models stored in localStorage for a static demo
export const DB = {
  USERS_KEY: 'ap_users_v1',
  SUBJECTS_KEY: 'ap_subjects_v1',
  QUESTIONS_KEY: 'ap_questions_v1',
  PERFORMANCE_KEY: 'ap_performance_v1'
};

export function defaultSchemas(){
  return {
    users: [
      {id:'u1',name:'Demo Student',email:'demo@example.com'}
    ],
    subjects: [
      {id:'s1',name:'Mathematics',chapters:['Algebra','Calculus','Probability']}
    ],
    questions: [
      {id:'q1',subject:'s1',chapter:'Algebra',text:'Solve x^2-4=0',marks:4,answer:'x=±2',year:2022}
    ],
    performance: []
  };
}

export function read(key){
  const raw = localStorage.getItem(key);
  return raw? JSON.parse(raw): null;
}
export function write(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeed(){
  if(!read(DB.USERS_KEY)){
    const s = defaultSchemas();
    write(DB.USERS_KEY,s.users);
    write(DB.SUBJECTS_KEY,s.subjects);
    write(DB.QUESTIONS_KEY,s.questions);
    write(DB.PERFORMANCE_KEY,s.performance);
  }
}
