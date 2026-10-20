import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPages } from '../src/pages.mjs';
import { networkGraphic } from '../src/network.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const config = JSON.parse(fs.readFileSync('site.config.json', 'utf8'));
const catalog = JSON.parse(fs.readFileSync('catalog.json', 'utf8'));
const catalogIds = new Set();
for (const item of catalog) {
  if (!item.id || catalogIds.has(item.id) || !['business','product'].includes(item.kind) || !item.name || !item.description || !item.category) throw new Error('Each catalog entry needs a unique id, kind (business/product), name, category and description.');
  catalogIds.add(item.id);
  if (!/^https:\/\//.test(item.href) && !/^[a-z0-9][a-z0-9-]*\.html(?:#[a-z0-9-]+)?$/.test(item.href)) throw new Error('Catalog href must be an HTTPS URL or a local HTML filename.');
}
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let siteUrl = (process.env.SITE_URL || config.siteUrl || '').trim();
if (siteUrl) {
  const u = new URL(siteUrl);
  if (!['https:', 'http:'].includes(u.protocol) || u.search || u.hash || u.username || u.password) throw new Error('siteUrl must be a public HTTP(S) base URL without credentials, query or hash.');
  siteUrl = u.href.replace(/\/$/, '') + '/';
}
if (config.contactEmail && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.contactEmail)) throw new Error('Invalid contactEmail');
function external(url) { const u = new URL(url); if (u.protocol !== 'https:') throw new Error('External links must use HTTPS'); return esc(u.href); }
const arrow = '<svg class="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.5"/></svg>';
const north = '<svg class="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5"/></svg>';
const brand = '<span class="brand">evoxnet<span>.</span></span>';
const links = [['index.html','Home'],['ventures.html','Businesses & products'],['about.html','About']];
function header(current) { return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="container header-inner flex items-center justify-between"><a class="brand-link" href="index.html" aria-label="Evoxnet home">${brand}</a><button class="menu-toggle" aria-controls="main-nav" aria-expanded="false" aria-label="Open navigation"><span>Menu</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.5"/></svg></button><nav class="main-nav" id="main-nav" aria-label="Main navigation">${links.map(([href,label])=>`<a href="${href}" ${current===href?'aria-current="page"':''}>${esc(label)}</a>`).join('')}</nav></div></header>`; }
function footer() { return `<footer class="site-footer"><div class="container"><div class="footer-main"><div><a class="brand-link" href="index.html" aria-label="Evoxnet home">${brand}</a><p>Evolution Exploration Network</p></div><nav aria-label="Footer navigation"><a href="ventures.html">Businesses &amp; products</a><a href="about.html">About</a><a href="approach.html">How we work</a>${config.contactEmail?`<a href="mailto:${esc(config.contactEmail)}">Contact</a>`:''}${config.socialLinks.map(s=>`<a href="${external(s.url)}" rel="noopener noreferrer" target="_blank">${esc(s.label)} ↗</a>`).join('')}</nav></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Evoxnet</span><a href="privacy.html">Privacy</a></div></div></footer>`; }
const pageData = [
 ['index.html','Evoxnet | Evolution Exploration Network','Evoxnet brings our businesses and products together. Explore ZestMenu, our QR restaurant menu product, and learn about our company.'],
 ['about.html','About Evoxnet | Our Story & Purpose','Discover Evoxnet, the Evolution Exploration Network: an umbrella startup built to connect real-world business, digital products and purposeful innovation.'],
 ['ventures.html','Businesses & Products | Evoxnet','Browse the businesses and products under Evoxnet, starting with ZestMenu, our QR menu product for restaurants.'],
 ['zestmenu.html','ZestMenu | A QR Restaurant Menu Product by Evoxnet','Meet ZestMenu, Evoxnet’s QR restaurant menu product, previously known as QRrestaurant. A practical connection between hospitality and the digital world.'],
 ['approach.html','Research & Innovation | The Evoxnet Approach','Explore how Evoxnet approaches research and innovation: understand real problems, question assumptions, build useful solutions and keep improving.'],
 ['privacy.html','Privacy | Evoxnet','Learn how this Evoxnet website handles data, hosting information and optional email links.'],
 ['404.html','Page Not Found | Evoxnet','Find your way back to Evoxnet and explore our story, ventures and approach.']
];
function schema(file,title,description) {
  const org = {'@type':'Organization',name:'Evoxnet',alternateName:'Evolution Exploration Network',description:'An umbrella startup connecting real-world businesses, digital products and innovation.'};
  if (siteUrl) Object.assign(org, {'@id':`${siteUrl}#organization`,url:siteUrl,logo:`${siteUrl}assets/images/logo.svg`});
  if(config.contactEmail) org.email=config.contactEmail;
  if(config.socialLinks.length) org.sameAs=config.socialLinks.map(s=>new URL(s.url).href);
  const website = {'@type':'WebSite',name:'Evoxnet',description:pageData[0][2],inLanguage:'en'};
  if(siteUrl) Object.assign(website,{'@id':`${siteUrl}#website`,url:siteUrl,publisher:{'@id':`${siteUrl}#organization`}});
  const webpage = {'@type':file==='about.html'?'AboutPage':'WebPage',name:title,description,inLanguage:'en'};
  if(siteUrl) Object.assign(webpage,{'@id':`${siteUrl}${file==='index.html'?'':file}#webpage`,url:`${siteUrl}${file==='index.html'?'':file}`,isPartOf:{'@id':`${siteUrl}#website`},about:{'@id':`${siteUrl}#organization`}});
  const graph=[org,website,webpage];
  if(siteUrl && !['index.html','404.html'].includes(file)) graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:siteUrl},{'@type':'ListItem',position:2,name:title.split(' | ')[0],item:siteUrl+file}]});
  return JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');
}
function layout(file, body) {
 const [,title,description] = pageData.find(p=>p[0]===file);
 const canonical = siteUrl ? siteUrl+(file==='index.html'?'':file) : '';
 return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#173d32"><meta name="robots" content="${file==='404.html'?'noindex, follow':'index, follow, max-image-preview:large'}">${canonical?`<link rel="canonical" href="${esc(canonical)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(siteUrl)}assets/images/social-cover.png"><meta name="twitter:image" content="${esc(siteUrl)}assets/images/social-cover.png">`:''}<meta property="og:type" content="website"><meta property="og:site_name" content="Evoxnet"><meta property="og:locale" content="en_US"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image:alt" content="Evoxnet — Evolution Exploration Network"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicon-32.png"><link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png"><link rel="preload" href="assets/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="assets/css/tailwind.css"><link rel="stylesheet" href="assets/css/site.css"><script type="application/ld+json">${schema(file,title,description)}</script><script src="assets/js/main.js" defer></script>${file==='index.html'?'<script src="assets/js/network.js" defer></script>':''}</head><body>${header(file)}<main id="main">${body}</main>${footer()}</body></html>`;
}
const pages=createPages({config,esc,external,arrow,north,brand,catalog});
for (const [file,body] of Object.entries(pages)) {
 let html = layout(file,body);
 if(file==='404.html' && siteUrl) html=html.replace('<head>','<head><base href="'+esc(siteUrl)+'">');
 fs.writeFileSync(file,html);
}
fs.mkdirSync('assets/fonts',{recursive:true});
fs.writeFileSync('assets/images/network.svg',networkGraphic);
const fontSource='node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2';
if(fs.existsSync(fontSource)) fs.copyFileSync(fontSource,'assets/fonts/manrope-latin-wght-normal.woff2');
fs.writeFileSync('.nojekyll','');
fs.writeFileSync('robots.txt',`User-agent: *\nAllow: /\n${siteUrl?`\nSitemap: ${siteUrl}sitemap.xml\n`:''}`);
if(siteUrl) fs.writeFileSync('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageData.filter(p=>p[0]!=='404.html').map(([f])=>`  <url><loc>${esc(siteUrl+(f==='index.html'?'':f))}</loc></url>`).join('\n')}\n</urlset>\n`);
else if(fs.existsSync('sitemap.xml')) fs.unlinkSync('sitemap.xml');
console.log(`Built ${pageData.length} static pages. ${siteUrl?`SEO base: ${siteUrl}`:'Public URL pending; no invented canonical URLs. GitHub Actions will provide the Pages URL.'}`);
