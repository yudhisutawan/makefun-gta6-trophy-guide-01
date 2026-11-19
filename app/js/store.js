import { STORAGE_KEY, SAVE_VERSION } from './config.js';
const fresh=()=>({version:SAVE_VERSION,earned:[],counters:{},notes:{},settings:{spoilersHidden:true,theme:'paper'}});
function normalize(value){if(!value||value.version!==SAVE_VERSION)return fresh();return {version:SAVE_VERSION,earned:[...new Set((value.earned||[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=55))].sort((a,b)=>a-b),counters:value.counters||{},notes:value.notes||{},settings:{...fresh().settings,...value.settings}}}
let state;
try{state=normalize(JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'))}catch{state=fresh()}
const listeners=new Set();
function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));listeners.forEach(fn=>fn(state))}
export const store={get:()=>state,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},earned(id){return state.earned.includes(id)},toggle(id){state.earned=state.earned.includes(id)?state.earned.filter(x=>x!==id):[...state.earned,id].sort((a,b)=>a-b);persist()},setNote(id,text){state.notes[id]=text;persist()},setCounter(id,n){state.counters[id]=Math.max(0,Number(n)||0);persist()},setting(key,value){state.settings[key]=value;persist()},reset(){state=fresh();persist()},export(){return new Blob([JSON.stringify(state,null,2)],{type:'application/json'})},async import(file){const parsed=normalize(JSON.parse(await file.text()));state=parsed;persist()}};
