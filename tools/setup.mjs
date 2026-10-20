#!/usr/bin/env node
// Reads conference.js and fills in the things a browser needs before any script runs:
// the page title, the link-preview tags, the theme colour and the home-screen manifest.
// Run it again whenever the name, colour or description changes. Safe to run many times.
// Usage: node tools/setup.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { readConference } from "./lib.mjs";

const C = readConference("conference.js");
const c = C.conference, look = C.look || {};
const name = c.name, short = c.short || c.name;
const desc = (c.description || `Programme, people and topics for ${name}. Everything you save stays on your device.`).slice(0, 200);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

let html = readFileSync("index.html", "utf8");
const sub = (re, to) => { if (!re.test(html)) console.warn("note: could not find", re); html = html.replace(re, to); };
sub(/<title>[\s\S]*?<\/title>/, `<title>${esc(name)}</title>`);
sub(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`);
sub(/<meta name="theme-color" content="[^"]*">/, `<meta name="theme-color" content="${esc(look.head || "#2b2257")}">`);
sub(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(name)}">`);
sub(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`);
if (c.url) {
  if (/<meta property="og:url"/.test(html)) html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${esc(c.url)}">`);
  else html = html.replace(/(<meta property="og:type"[^>]*>)/, `$1\n<meta property="og:url" content="${esc(c.url)}">`);
  const img = c.url.replace(/\/?$/, "/") + "og-image.png";
  if (/<meta property="og:image"/.test(html)) html = html.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${esc(img)}">`);
  else html = html.replace(/(<meta property="og:description"[^>]*>)/, `$1\n<meta property="og:image" content="${esc(img)}">`);
}
writeFileSync("index.html", html);

const manifest = {
  name, short_name: short.slice(0, 12), description: desc,
  start_url: "./", scope: "./", display: "standalone",
  background_color: "#ffffff", theme_color: look.head || "#2b2257",
  icons: [
    { src: "icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "icon-512.png", sizes: "512x512", type: "image/png" },
    { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
  ]
};
writeFileSync("manifest.webmanifest", JSON.stringify(manifest, null, 2) + "\n");
console.log(`Updated index.html and manifest.webmanifest for "${name}".`);
if (!c.url) console.log("note: conference.url is empty, so the link-preview image address was not set.");
