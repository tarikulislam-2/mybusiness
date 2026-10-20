import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
assert(fs.existsSync(root),'Run npm run build first.');
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const titles=new Set(),descriptions=new Set();
let linkCount=0,resourceCount=0;
for(const file of files){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 assert(html.startsWith('<!DOCTYPE html>'),`${file}: missing doctype`);
 assert(/<html lang="en">/.test(html),`${file}: document language`);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: exactly one H1`);
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 const desc=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
 assert(title && !titles.has(title),`${file}: unique title`); titles.add(title);
 assert(desc && !descriptions.has(desc),`${file}: unique description`); descriptions.add(desc);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,`${file}: duplicate IDs`);
 assert(html.includes('id="main"'),`${file}: main landmark`);
 assert(html.includes('name="viewport"'),`${file}: responsive viewport`);
 for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
   const json=JSON.parse(m[1]); assert.equal(json['@context'],'https://schema.org'); assert(json['@graph'].length>=3);
 }
 assert(!/<script[^>]+src="https?:/.test(html),`${file}: unexpected external script`);
 for(const img of html.matchAll(/<img\b[^>]*>/g)){
   assert(/\balt="[^"]*"/.test(img[0]),`${file}: image missing alternative text`);
   assert(/\bwidth="\d+"/.test(img[0])&&/\bheight="\d+"/.test(img[0]),`${file}: image dimensions`);
 }
 for(const m of html.matchAll(/\b(href|src)="([^"]+)"/g)){
   const [type,url]=[m[1],m[2]];
   if(/^(https?:|mailto:|data:)/.test(url)) continue;
   assert(url!=='#',`${file}: placeholder link`);
   const [pathname,fragment]=url.split('#');
   const target=pathname||file;
   const dest=path.resolve(root,target.split('?')[0]);
   assert(dest.startsWith(root+path.sep),`${file}: escaped static directory`);
   assert(fs.existsSync(dest),`${file}: missing ${url}`);
   if(fragment&&target.endsWith('.html')){
     const content=fs.readFileSync(dest,'utf8');
     assert(content.includes(`id="${fragment}"`),`${file}: missing fragment ${url}`);
   }
   if(type==='href')linkCount++; else resourceCount++;
 }
 for(const m of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)) for(const id of m[1].split(' ')) assert(ids.includes(id),`${file}: missing ARIA target ${id}`);
 const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];
 if(canonical){
   assert(['http:','https:'].includes(new URL(canonical).protocol));
   if(file!=='404.html')assert(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').includes(canonical),`${file}: not in sitemap`);
 }
 if(process.env.GITHUB_ACTIONS) assert(canonical,`${file}: deployed build needs a real canonical URL`);
}
for(const css of ['site.css','tailwind.css']){
 const content=fs.readFileSync(path.join(root,'assets/css',css),'utf8');
 assert(content.length>100,`${css}: empty stylesheet`);
 for(const m of content.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) if(!/^(data:|https?:)/.test(m[1])) assert(fs.existsSync(path.resolve(root,'assets/css',m[1])),`${css}: missing ${m[1]}`);
}
assert(fs.existsSync(path.join(root,'.nojekyll')));
assert(fs.existsSync(path.join(root,'assets/images/social-cover.png')));
console.log(`PASS: ${files.length} pages; ${linkCount} local links and ${resourceCount} resource references; unique metadata, structured data, image attributes, ARIA references and CSS assets.`);
console.log('This structural check does not substitute for a real-browser layout/accessibility audit.');
