import { cp, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildDossier } from './vendor/makefun-frontend.ts';
const output=resolve(process.env.MAKEFUN_OUTPUT_DIR||'/output');
await mkdir(output,{recursive:true});
await cp('app',resolve(output,'app'),{recursive:true});
await cp('screenshots',resolve(output,'screenshots'),{recursive:true});
const dossier=buildDossier(output,{text_max_bytes:163840,screenshots:{max:4,max_bytes:262144},app:{max_files:993,max_bytes:50331648}});
await writeFile(resolve(output,'dossier.json'),dossier);
