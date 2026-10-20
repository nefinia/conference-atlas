#!/usr/bin/env node
// Checks conference.json and says what to fix, in plain words.
// Usage: node tools/validate.mjs [path/to/conference.js]
import { readConference } from "./lib.mjs";

const file = process.argv[2] || "conference.js";
let C;
try { C = readConference(file); }
catch (e) { console.error(`Cannot read ${file}: ${e.message}`); process.exit(1); }

const errors = [], warnings = [];
const err = m => errors.push(m), warn = m => warnings.push(m);
const isTime = s => typeof s === "string" && /^([01]?\d|2[0-3]):[0-5]\d$/.test(s);
const isDate = s => typeof s === "string" && /^\d{4}-\d\d-\d\d$/.test(s) && !isNaN(Date.parse(s));
const toMin = s => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
const dupes = (list, what) => {
  const seen = new Set();
  for (const x of list) { if (seen.has(x)) err(`${what} "${x}" appears more than once.`); seen.add(x); }
  return seen;
};

const c = C.conference || {};
for (const k of ["id", "name", "timezone", "start", "end"]) if (!c[k]) err(`conference.${k} is missing.`);
if (c.id && !/^[a-z0-9-]{2,30}$/.test(c.id)) err(`conference.id "${c.id}" should be 2 to 30 lowercase letters, digits or hyphens.`);
try { new Intl.DateTimeFormat("en", { timeZone: c.timezone }); } catch { err(`conference.timezone "${c.timezone}" is not a valid time zone name (for example Europe/Paris).`); }
if (c.start && !isDate(c.start)) err(`conference.start "${c.start}" should look like 2027-05-10.`);
if (c.end && !isDate(c.end)) err(`conference.end "${c.end}" should look like 2027-05-11.`);
if (isDate(c.start) && isDate(c.end) && c.end < c.start) err("conference.end is before conference.start.");

const rooms = dupes((C.rooms || []).map(r => r.id), "Room id");
const themes = dupes((C.themes || []).map(t => t.id), "Theme id");
const sessions = new Map();
dupes((C.sessions || []).map(s => s.id), "Session id");
for (const s of C.sessions || []) {
  sessions.set(s.id, s);
  if (!isDate(s.date)) err(`Session ${s.id}: date "${s.date}" should look like 2027-05-10.`);
  else if (isDate(c.start) && isDate(c.end) && (s.date < c.start || s.date > c.end)) warn(`Session ${s.id}: ${s.date} is outside the conference dates.`);
  if (!isTime(s.start) || !isTime(s.end)) err(`Session ${s.id}: start and end need the form 09:30.`);
  else if (toMin(s.end) <= toMin(s.start)) err(`Session ${s.id}: it ends before it starts.`);
  if (s.room && !rooms.has(s.room)) err(`Session ${s.id}: room "${s.room}" is not in the rooms list.`);
  if (s.theme && !themes.has(s.theme)) err(`Session ${s.id}: theme "${s.theme}" is not in the themes list.`);
  if (!s.title) err(`Session ${s.id}: title is missing.`);
}

const people = new Set((C.people || []).map(p => p.name));
dupes((C.people || []).map(p => p.name), "Person");
dupes((C.items || []).map(i => i.id), "Item id");
const perSession = {};
for (const it of C.items || []) {
  if (!it.title) err(`Item ${it.id}: title is missing.`);
  const s = sessions.get(it.session);
  if (!s) { err(`Item ${it.id}: session "${it.session}" does not exist.`); continue; }
  (perSession[it.session] ||= []).push(it);
  if (it.start && !isTime(it.start)) err(`Item ${it.id}: start "${it.start}" should look like 11:20.`);
  for (const t of it.themes || []) if (!themes.has(t)) err(`Item ${it.id}: theme "${t}" is not in the themes list.`);
  for (const n of it.speakers || []) if (!people.has(n)) warn(`Item ${it.id}: "${n}" is not in the people list (their affiliation will be blank).`);
}
for (const [id, list] of Object.entries(perSession)) {
  const s = sessions.get(id);
  if (!isTime(s.start) || !isTime(s.end)) continue;
  const timed = list.filter(i => i.kind !== "poster" && s.kind === "talks");
  const need = timed.reduce((sum, i) => sum + (i.duration || s.slot || 20), 0);
  const have = toMin(s.end) - toMin(s.start);
  if (need > have) warn(`Session ${id} holds ${need} minutes of talks but only lasts ${have}.`);
}
for (const e of C.events || []) {
  if (!isDate(e.date)) err(`Event ${e.id || e.title}: date should look like 2027-05-10.`);
  if (e.start && !isTime(e.start)) err(`Event ${e.id || e.title}: start should look like 19:30.`);
}
for (const a of C.announcements || []) {
  if (isNaN(Date.parse(a.from)) || isNaN(Date.parse(a.until))) err(`Announcement "${String(a.text).slice(0, 30)}…": from and until need a full date and time with offset, like 2027-05-10T08:00:00+02:00.`);
}
const m = C.modules || {};
if ((m.ask || m.board || m.sync) && !(C.backend && C.backend.url)) warn("ask, board or sync is switched on but backend.url is empty. Those tabs will stay hidden until a worker address is set.");

for (const w of warnings) console.log("note:  " + w);
for (const e of errors) console.log("error: " + e);
console.log(errors.length ? `\n${errors.length} problem(s) to fix.` : `\nOK: ${(C.items || []).length} items, ${sessions.size} sessions, ${people.size} people.`);
process.exit(errors.length ? 1 : 0);
