const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'js/app.js'),'utf8'),games=JSON.parse(fs.readFileSync(path.join(root,'data/games.json'),'utf8')),manual=JSON.parse(fs.readFileSync(path.join(root,'data/ranking.json'),'utf8')).featuredGameIds;
class Element{
 constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.attrs={};this.style={};this.events={};this.className='';this.value='';this.classList={add:()=>{},remove:()=>{}}}
 append(...items){for(const item of items){item.parent=this;this.children.push(item)}}
 replaceChildren(...items){this.children=[];this.append(...items)}
 setAttribute(k,v){this.attrs[k]=String(v)}
 addEventListener(k,v){(this.events[k]||=[]).push(v)}
 remove(){this.removed=true;if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}
}
const descendants=(node,tag)=>node.children.flatMap(x=>[...(x.tagName===tag?[x]:[]),...descendants(x,tag)]);
async function fixture({ranking=[],apiFails=false,shareCancel=false}={}){
 const elements=Object.fromEntries(['ranking','grid','filters','sort','search','toast'].map(id=>['#'+id,new Element('div')]));elements['#sort'].value='default';const opened=[],shared=[],requests=[];
 const context={document:{querySelector:s=>elements[s]||null,createElement:tag=>new Element(tag)},navigator:{},window:{open(...args){opened.push(args)}},location:{href:'https://asobeatapps-ops.github.io/gamehome/'},URLSearchParams,AbortController,Date,console:{info(){}},setTimeout:()=>1,clearTimeout(){},fetch:async url=>{requests.push(url);if(url==='data/games.json')return{ok:true,json:async()=>games};if(url==='data/ranking.json')return{ok:true,json:async()=>({featuredGameIds:manual})};if(url==='data/config.json')return{ok:true,json:async()=>({apiBase:'https://ranking.example.test'})};if(apiFails)throw Error('API unavailable');return{ok:true,json:async()=>({top:ranking})}}};
 if(shareCancel)context.navigator.share=async data=>{shared.push(data);const e=Error('cancel');e.name='AbortError';throw e};
 vm.runInNewContext(source,context);for(let i=0;i<3;i++)await new Promise(setImmediate);
 return{elements,opened,shared,requests,async input(text){elements['#search'].events.input[0]({target:{value:text}})},sort(mode){elements['#sort'].value=mode;elements['#sort'].events.change[0]()}};
}
const titles=container=>container.children.filter(n=>n.className==='game-card').map(card=>descendants(card,'H3')[0].textContent);
test('published cards expose native HTTPS links with independent sharing, draft entries remain excluded',async()=>{
 const f=await fixture(),cards=f.elements['#grid'].children,published=games.filter(g=>g.status==='published');assert.equal(cards.length,published.length);
 for(let i=0;i<cards.length;i++){const card=cards[i],links=descendants(card,'A'),buttons=descendants(card,'BUTTON');assert.equal(links.length,1);assert.equal(links[0].href,published[i].url);assert.equal(links[0].target,'_blank');assert.match(links[0].rel,/noopener/);assert.equal(buttons.length,1);assert.ok(buttons[0].events.click);assert.equal(card.events.click,undefined);assert.equal(card.events.keydown,undefined);assert.equal(card.attrs.role,undefined);assert.equal(links[0].events.click,undefined)}
 assert.deepEqual(f.opened,[]);
});
test('search and category filtering still select the right games, including the empty state',async()=>{
 const f=await fixture();await f.input('レジ袋');assert.deepEqual(titles(f.elements['#grid']),['レジ袋いりません。']);await f.input('見つからない検索文字列');assert.equal(f.elements['#grid'].children[0].className,'empty');await f.input('');const category=f.elements['#filters'].children.find(b=>b.textContent==='パズル');category.onclick();assert.deepEqual(titles(f.elements['#grid']),games.filter(g=>g.status==='published'&&g.genre==='パズル').map(g=>g.title));
});
test('automatic TOP5 ignores unknown/draft IDs, orders real scores and keeps manual fill and popular sorting',async()=>{
 const f=await fixture({ranking:[{id:'asobeat_test',plays:99999},{id:'darekakuru',plays:9999},{id:'gohan_mada',plays:20},{id:'slot_bakuhatu',plays:30}]});const expected=['slot_bakuhatu','gohan_mada',...manual.filter(id=>!['slot_bakuhatu','gohan_mada'].includes(id))].slice(0,5).map(id=>games.find(g=>g.id===id).title);assert.deepEqual(titles(f.elements['#ranking']),expected);f.sort('popular');assert.deepEqual(titles(f.elements['#grid']).slice(0,5),expected);f.sort('name');assert.deepEqual(titles(f.elements['#grid']),games.filter(g=>g.status==='published').map(g=>g.title).sort((a,b)=>a.localeCompare(b,'ja')));
});
test('API failure preserves manual TOP5 and data fetch remains read-only',async()=>{const f=await fixture({apiFails:true});assert.deepEqual(titles(f.elements['#ranking']),manual.map(id=>games.find(g=>g.id===id).title));assert.ok(f.requests.includes('https://ranking.example.test/ranking'))});
test('sharing uses its own control and does not launch a game, cancellation is harmless',async()=>{const f=await fixture({shareCancel:true}),button=descendants(f.elements['#grid'].children[0],'BUTTON')[0];await button.events.click[0]();assert.equal(f.shared.length,1);assert.equal(f.shared[0].url,games.find(g=>g.status==='published').url);assert.deepEqual(f.opened,[]);const fallback=await fixture();await descendants(fallback.elements['#grid'].children[0],'BUTTON')[0].events.click[0]();assert.match(fallback.opened[0][0],/^https:\/\/twitter.com\/intent\/tweet\?/);assert.equal(fallback.opened.length,1)});
