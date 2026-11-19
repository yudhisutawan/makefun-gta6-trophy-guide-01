export function hidden(t,s){return s.settings.spoilersHidden&&t.kind==='story'&&t.hidden&&!s.earned.has(t.id)}
export function label(t,s){return hidden(t,s)?'Unrevealed story trophy':t.name}
export function description(t,s){return hidden(t,s)?'Earn this story trophy to reveal its official description.':t.description}
export function select(list,f,s){const q=f.query.trim().toLowerCase();return list.filter(t=>(f.kind==='all'||t.kind===f.kind)&&(f.grade==='all'||t.grade===f.grade)&&(f.status==='all'||(f.status==='earned')===s.earned.has(t.id))&&(!f.missables||t.missable==='maybe')&&(!q||(s.settings.spoilersHidden&&t.kind==='story'&&t.hidden&&!s.earned.has(t.id)?`unrevealed story trophy ${t.grade}`:`${t.name} ${t.description} ${t.guide}`).toLowerCase().includes(q)))}
