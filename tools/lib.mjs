// Shared by the tools. conference.js holds the data as:  window.CONFERENCE = { ... };
import { readFileSync, writeFileSync } from "node:fs";

export function readConference(file) {
  const text = readFileSync(file, "utf8").replace(/^﻿/, "");
  if (/\.json$/i.test(file)) return JSON.parse(text);
  const m = /^\s*window\.CONFERENCE\s*=\s*([\s\S]*?);?\s*$/.exec(text);
  if (!m) throw new Error('the file should start with "window.CONFERENCE = {"');
  return JSON.parse(m[1]);
}

export function writeConference(file, data) {
  const json = JSON.stringify(data, null, 1);
  writeFileSync(file, /\.json$/i.test(file) ? json : `window.CONFERENCE = ${json};\n`);
}
