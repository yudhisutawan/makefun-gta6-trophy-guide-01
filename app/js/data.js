import catalogue from '../data/trophies.json' with {type:'json'};
export async function loadData(){const d=structuredClone(catalogue);d.byId=new Map(d.trophies.map(x=>[x.id,x]));return d}
