import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('app');
const args = process.argv.slice(2); const flag = args.indexOf('--port');
const port = flag >= 0 ? Number(args[flag + 1]) : 8080;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
createServer(async (req,res) => {
 try { const path = decodeURIComponent(new URL(req.url,'http://localhost').pathname); const file=resolve(root, '.'+path);
 if (file!==root && !file.startsWith(root+sep)) throw new Error('outside app');
 const body=await readFile(file===root?resolve(root,'index.html'):file);
 res.writeHead(200,{'content-type':types[extname(file===root?resolve(root,'index.html'):file)]||'application/octet-stream','cache-control':'no-store'});res.end(body);
 } catch {res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Leonida Atlas at http://localhost:${port}`));
