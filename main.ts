import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const project = fileURLToPath(new URL('.', import.meta.url));
const output = process.env.MAKEFUN_OUTPUT_DIR || '/output';
mkdirSync(output, { recursive: true });
cpSync(join(project, 'app'), join(output, 'app'), { recursive: true });
mkdirSync(join(output, 'screenshots'), { recursive: true });
if (existsSync(join(project, 'screenshots'))) cpSync(join(project, 'screenshots'), join(output, 'screenshots'), { recursive: true });
const limits = { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 };
writeFileSync(join(output, 'dossier.json'), buildDossier(output, limits));
