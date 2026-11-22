import fs from 'node:fs';
// Reader-only extraction from static HTML. Navigation and footer are excluded.
const clean=s=>s.replace(/<[^>]*>/g,' ').replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replace(/&(?:amp|lt|gt|quot|apos|nbsp);/g,x=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&nbsp;':' '}[x])).replace(/\s+/g,' ').trim();
const index=[];
for(const name of fs.readdirSync('.').filter(x=>x.endsWith('.html')).sort()){
 if(['404.html','index.html'].includes(name)||name.endsWith('-en.html'))continue;
 const html=fs.readFileSync(name,'utf8'),main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];if(!main)continue;
 let h='';const p=[];
 for(const m of main.matchAll(/<(h2|h3|summary|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)){
 const text=clean(m[2]);if(['h2','h3','summary'].includes(m[1].toLowerCase()))h=text;
 else if(text.length>35&&!text.includes('Révision éditoriale'))p.push({h,t:text});
 }
 index.push({url:name,title:clean(main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||name),p});
}
fs.writeFileSync('content-index.js','window.SITE_CONTENT='+JSON.stringify(index)+';\n');
console.log(`${index.length} pages, ${index.reduce((n,x)=>n+x.p.length,0)} passages. First: ${index[0].url}; last: ${index.at(-1).url}`);
