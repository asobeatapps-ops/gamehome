/* Shared tracker; load on each game, call ASOBEATTrack.play() only at actual game start. */
(function(){'use strict';
const script=document.currentScript;
const gameId=script?.dataset?.gameId||'';
const configured=script?.dataset?.api||'';
const idPattern=/^[a-z][a-z0-9_]{1,49}$/;
let endpoint='';
try{const base=new URL(configured);if(base.protocol==='https:')endpoint=new URL('play',base.href.replace(/\/?$/,'/')).href}catch{}
window.ASOBEATTrack={play:function(){if(!endpoint||!idPattern.test(gameId))return;try{
const ctrl=new AbortController();const cancel=setTimeout(()=>ctrl.abort(),4000);
fetch(endpoint,{method:'POST',mode:'cors',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({gameId}),signal:ctrl.signal}).catch(()=>{}).finally(()=>clearTimeout(cancel));
}catch{}}};
})();
