import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
const files=fs.readdirSync('.').filter(n=>n.endsWith('.html'));
test('les 34 pages ont une description structurée propre à leur contenu',()=>{
 assert.equal(files.length,34);
 for(const name of files){const html=fs.readFileSync(name,'utf8');const desc=html.match(/<meta name="description" content="([^"]*)"/)?.[1];for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){const d=JSON.parse(m[1]);if(['Article','WebPage'].includes(d['@type'])&&d.description)assert.equal(d.description.replace(/&amp;/g,'&'),desc?.replace(/&amp;/g,'&'),name);}}
});
test('les préparations sensibles gardent leurs précautions à proximité',()=>{const html=fs.readFileSync('recettes.html','utf8');assert.match(html,/<h2>Tiramisu<\/h2><p class="cb-notice">/);assert.match(html,/<h2>Cold brew, café infusé à froid<\/h2><p class="cb-notice">/);assert.match(html,/dans les 24 heures/);});
test('le flux ne prétend pas connaître une heure de publication à venir',()=>{assert.doesNotMatch(fs.readFileSync('feed.xml','utf8'),/<pubDate>/);});
test('le générateur historique demande un accord explicite avant tout écrasement',()=>{const js=fs.readFileSync('scripts/build-site.mjs','utf8');assert.ok(js.indexOf('--allow-legacy-overwrite')<js.indexOf('const ORIGIN'));assert.match(js,/process.exit\(1\)/);});
