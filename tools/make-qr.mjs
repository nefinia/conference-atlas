#!/usr/bin/env node
// Makes a QR code for the app, for badges, slides and posters.
// First time only:  npm install qrcode
// Usage: node tools/make-qr.mjs [address] [file.svg|file.png]
// With no address it uses conference.url from conference.js. SVG scales to any size for print.
import { readConference } from "./lib.mjs";

let QR;
try { QR = (await import("qrcode")).default; }
catch { console.error('This tool needs the qrcode package. Run "npm install qrcode" once, then try again.'); process.exit(1); }

const url = process.argv[2] || readConference("conference.js").conference.url;
const out = process.argv[3] || "qr.svg";
if (!url) { console.error("No address. Give one, or fill conference.url in conference.js."); process.exit(1); }
if (/\.png$/i.test(out)) await QR.toFile(out, url, { errorCorrectionLevel: "M", width: 1200, margin: 2 });
else (await import("node:fs")).writeFileSync(out, await QR.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 2 }));
console.log(`Wrote ${out} for ${url}`);
