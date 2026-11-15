// quick stills at given times for checking
const { chromium } = require('playwright'); const fs=require('fs'),path=require('path');
(async()=>{const [scenes,...ts]=process.argv.slice(2);const dir=__dirname;const b64=f=>fs.readFileSync(path.join(dir,'fonts',f)).toString('base64');
const html=`<style>@font-face{font-family:Hand;src:url(data:font/ttf;base64,${b64('PatrickHand.ttf')})}@font-face{font-family:Brush;src:url(data:font/ttf;base64,${b64('CaveatBrush.ttf')})}html,body{margin:0;background:#000}</style><div id="s"></div><script>const TIMING=${JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir,'timing-001.json'))).sentences)};\n${fs.readFileSync(path.join(dir,'lib.js'),'utf8')}\n${scenes.split(',').map(f=>fs.readFileSync(f,'utf8')).join('\n')}
window.draw=T=>{const sc=SCENES.slice().reverse().find(s=>T>=s.start&&T<s.end)||SCENES[SCENES.length-1];document.getElementById('s').innerHTML=frame(sc.draw(T-sc.start,T),T,sc.o)}</script>`;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>console.error('ERR',e.message));await p.setContent(html);await p.evaluate(()=>document.fonts.ready);
fs.mkdirSync('checks',{recursive:true});for(const t of ts){await p.evaluate(T=>window.draw(T),Number(t));await p.screenshot({path:`checks/t${t}.png`})}await b.close()})();
