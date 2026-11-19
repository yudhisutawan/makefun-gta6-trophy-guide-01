import { SOURCE_EXOPHASE, SOURCE_PSN } from './config.js';
const response=await fetch('/data/trophies.json');
if(!response.ok) throw new Error('Trophy data could not be loaded');
export const trophies=(await response.json()).trophies;
export const trophyById=new Map(trophies.map(t=>[t.id,t]));
export const sourceLinks={exophase:SOURCE_EXOPHASE,psnprofiles:SOURCE_PSN};
