import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
const shots=JSON.parse(await readFile('shots.json','utf8'));
const server=spawn(process.execPath,['serve.ts','--port','8080'],{stdio:'ignore'});
const chrome=spawn(join(homedir(),'.cache/ms-playwright/chromium-1255/chrome-linux64/chrome'),['--headless','--no-sandbox','--disable-gpu','--disable-gpu-compositing','--use-gl=angle','--use-angle=swiftshader','--disable-dev-shm-usage','--remote-debugging-port=9223','--user-data-dir=/tmp/leonida-chrome','about:blank'],{stdio:'ignore'});
const errors=[];let ws;
try{
 for(let i=0;i<50;i++){try{await fetch('http://127.0.0.1:8080/');break}catch{await delay(100)}}
 for(let i=0;i<50;i++){try{await fetch('http://127.0.0.1:9223/json/version');break}catch{await delay(100)}}
 const targets=await fetch('http://127.0.0.1:9223/json').then(r=>r.json());const target=targets.find(t=>t.type==='page')||targets[0];ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((ok,no)=>{ws.onopen=ok;ws.onerror=no});
 let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}else if(['Runtime.consoleAPICalled','Runtime.exceptionThrown','Network.loadingFailed'].includes(m.method)){const p=m.params; if(m.method==='Runtime.consoleAPICalled'&&p.type==='error')errors.push('console error');else if(m.method==='Runtime.exceptionThrown')errors.push('page exception');else errors.push('request failed '+p.errorText)}else if(m.method==='Network.requestWillBeSent'){const u=m.params.request.url;if(!u.startsWith('http://127.0.0.1:8080/')&&!u.startsWith('data:')&&!u.startsWith('ws://127.0.0.1:9223/'))errors.push('external request '+u)}};
 const call=(method,params={})=>new Promise(resolve=>{const n=++id;pending.set(n,resolve);ws.send(JSON.stringify({id:n,method,params}))});
 await call('Page.enable');await call('Runtime.enable');await call('Network.enable');await mkdir('screenshots',{recursive:true});
 for(const shot of shots){errors.length=0;await call('Emulation.setDeviceMetricsOverride',{width:shot.viewport.width,height:shot.viewport.height,deviceScaleFactor:1,mobile:false});await call('Page.navigate',{url:'http://127.0.0.1:8080'+shot.path});let ready=false;for(let i=0;i<100;i++){await delay(100);const r=await call('Runtime.evaluate',{expression:'window.__shotReady===true',returnByValue:true});if(r.result?.result?.value){ready=true;break}}if(!ready){const d=await call('Runtime.evaluate',{expression:'JSON.stringify({url:location.href,title:document.title,ready:window.__shotReady,app:document.querySelector("#app")?.innerText.slice(0,400)})',returnByValue:true});throw Error('shot view did not become ready: '+shot.file+' '+JSON.stringify(d.result?.result)+' '+errors.join('; '))}await delay(1200);const snap=await call('Page.captureScreenshot',{format:'jpeg',quality:82,fromSurface:true});await writeFile('screenshots/'+shot.file,Buffer.from(snap.result.data,'base64'));if(errors.length)throw Error(shot.file+': '+errors.join('; '));const bytes=(await readFile('screenshots/'+shot.file)).length;if(bytes>262144)throw Error(shot.file+' exceeds 256 KiB');console.log(`${shot.file}: ${bytes} bytes`)}
}finally{try{ws?.close()}catch{}chrome.kill('SIGTERM');server.kill('SIGTERM')}
