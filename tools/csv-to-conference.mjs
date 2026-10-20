#!/usr/bin/env node
// Turns a programme spreadsheet (saved as CSV) into the sessions, items, people, rooms and themes of conference.js.
// The conference block (name, dates, time zone, venue, look, modules) is taken from an existing conference.js.
//
// Usage: node tools/csv-to-conference.mjs programme.csv [--into conference.js] [--out conference.generated.js]
//
// Columns (header names are not case sensitive, order does not matter, extra columns are ignored):
//   date         2027-05-10
//   start, end   09:30  10:30            the talk's own times
//   room         Main Auditorium
//   session      Foundations I           talks with the same date, room and session name form one session
//   kind         talk | keynote | workshop | poster | plenary | break      (empty means talk)
//   title        the talk title, or the name of the break
//   speakers     Ada Okafor; Mei Tanaka  (separate with semicolons)
//   affiliations University of Lagos; Kyoto University   (same order as speakers, or one value for all)
//   themes       Foundations; Methods    (optional)
//   session_start, session_end   (optional) the session's own times when they are wider than its talks
//   abstract, url, id    (optional)
import { readFileSync } from "node:fs";
import { readConference, writeConference } from "./lib.mjs";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const flag = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const csvPath = args.find(a => !a.startsWith("--") && a !== flag("--into") && a !== flag("--out"));
if (!csvPath) { console.error("Usage: node tools/csv-to-conference.mjs programme.csv [--into conference.js] [--out out.json]"); process.exit(1); }
const intoPath = flag("--into") || "conference.js", outPath = flag("--out") || "conference.generated.js";

/* small CSV reader: quotes, commas and line breaks inside quotes, semicolon files from some spreadsheets */
function parseCsv(text) {
  text = text.replace(/^﻿/, "");
  const first = text.split(/\r?\n/)[0];
  const sep = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ";" : (first.includes("\t") ? "\t" : ",");
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === sep) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim()));
}
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 28) || "x";
const toMin = s => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
const fmt = m => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const timeOf = s => { const m = /^(\d{1,2})[:.h](\d\d)/.exec(String(s || "").trim()); return m ? fmt(+m[1] * 60 + +m[2]) : ""; };
const list = s => String(s || "").split(";").map(x => x.trim()).filter(Boolean);

const rows = parseCsv(readFileSync(csvPath, "utf8"));
const head = rows.shift().map(h => h.trim().toLowerCase());
const col = n => head.indexOf(n);
for (const need of ["date", "start", "title"]) if (col(need) < 0) { console.error(`The CSV needs a "${need}" column. Found: ${head.join(", ")}`); process.exit(1); }
const get = (r, n) => (col(n) >= 0 ? (r[col(n)] || "").trim() : "");

const base = readConference(intoPath);
const palette = ["#6c4fb3", "#2c6f9e", "#2b8a6a", "#b05a3c", "#9c4f7a", "#7a7a2b", "#3a7a8a", "#a05a2c"];
const rooms = new Map(), themes = new Map(), people = new Map(), warnings = [];
const shortRoom = n => { const t = n.replace(/^(Room|Salle|Raum|Sala)\s+/i, ""); return t.length <= 10 ? t : t.split(/\s+/).map(w => w.length > 6 ? w.slice(0, 3) + "." : w).join(" "); };
const roomId = name => { if (!name) return ""; if (!rooms.has(name)) { let id = slug(name); while ([...rooms.values()].some(r => r.id === id)) id += "-2"; rooms.set(name, { id, name, short: shortRoom(name) }); } return rooms.get(name).id; };
const themeId = name => { if (!themes.has(name)) themes.set(name, { id: slug(name), name, color: palette[themes.size % palette.length] }); return themes.get(name).id; };

const sessions = new Map(), items = []; let seq = 0;
const kindOf = k => { k = k.toLowerCase(); return ["talk", "keynote", "workshop", "poster", "plenary", "break"].includes(k) ? k : (k ? (warnings.push(`Unknown kind "${k}" treated as talk.`), "talk") : "talk"); };

rows.forEach((r, n) => {
  const line = n + 2, date = get(r, "date"), start = timeOf(get(r, "start")), end = timeOf(get(r, "end")), title = get(r, "title");
  if (!date || !start || !title) { warnings.push(`Line ${line}: skipped (date, start and title are needed).`); return; }
  if (!/^\d{4}-\d\d-\d\d$/.test(date)) { warnings.push(`Line ${line}: date "${date}" should look like 2027-05-10.`); return; }
  const kind = kindOf(get(r, "kind")), room = roomId(get(r, "room")), sname = get(r, "session");
  const key = kind === "talk" ? `talks|${date}|${room}|${sname || title}` : (kind === "poster" ? `posters|${date}|${sname || "Poster session"}` : `${kind}|${date}|${start}|${room}|${title}`);
  let S = sessions.get(key);
  const ss = timeOf(get(r, "session_start")), se = timeOf(get(r, "session_end"));
  if (!S) {
    S = { id: `s${sessions.size + 1}`, date, room, _s: toMin(ss || start), _e: toMin(se || end || fmt(toMin(start) + 20)),
      title: kind === "talk" ? (sname || title) : kind === "poster" ? (sname || "Poster session") : title,
      kind: kind === "talk" ? "talks" : kind === "poster" ? "posters" : kind };
    sessions.set(key, S);
  } else { S._s = Math.min(S._s, toMin(ss || start)); S._e = Math.max(S._e, toMin(se || end || start)); }
  if (kind === "break" || (kind === "plenary" && !list(get(r, "speakers")).length)) return; // a session with nothing to list
  const names = list(get(r, "speakers")), affs = list(get(r, "affiliations"));
  names.forEach((nm, i) => {
    const aff = affs.length === 1 ? affs[0] : (affs[i] || "");
    if (!people.has(nm)) people.set(nm, { name: nm, ...(aff ? { affiliation: aff } : {}) });
    else if (aff && !people.get(nm).affiliation) people.get(nm).affiliation = aff;
    if (kind === "keynote" && !people.get(nm).role) people.get(nm).role = "Keynote";
  });
  const it = { id: get(r, "id") || `i${++seq}`, kind, session: S.id, title, speakers: names, themes: list(get(r, "themes")).map(themeId) };
  if (kind === "talk") { it.start = start; if (end) it.duration = toMin(end) - toMin(start); }
  if (get(r, "abstract")) it.abstract = get(r, "abstract");
  if (get(r, "url")) it.url = get(r, "url");
  items.push(it);
});

// single-item sessions that are not talks: a keynote or workshop is its own session already; poster rows keep no time
const outSessions = [...sessions.values()].map(S => { const { _s, _e, ...rest } = S; return { ...rest, start: fmt(_s), end: fmt(_e) }; })
  .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
for (const S of outSessions.filter(s => s.kind === "talks")) {
  const its = items.filter(i => i.session === S.id), d = its.map(i => i.duration).filter(Boolean);
  if (d.length && d.every(x => x === d[0])) { S.slot = d[0]; its.forEach(i => { delete i.duration; }); }
}
const ids = items.map(i => i.id), dup = ids.filter((x, i) => ids.indexOf(x) !== i);
if (dup.length) warnings.push(`Duplicate ids: ${[...new Set(dup)].join(", ")}. Give each row a unique id.`);

const out = { ...base, rooms: [...rooms.values()], themes: [...themes.values()], sessions: outSessions, items,
  people: [...people.values()] };
writeConference(outPath, out);
console.log(`Read ${rows.length} rows: ${outSessions.length} sessions, ${items.length} items, ${people.size} people, ${rooms.size} rooms, ${themes.size} themes.`);
console.log(`Written to ${outPath}. The conference block, events, practical info and announcements were kept from ${intoPath}.`);
for (const w of warnings) console.log("note: " + w);
const v = spawnSync(process.execPath, [new URL("./validate.mjs", import.meta.url).pathname, outPath], { encoding: "utf8" });
console.log("\nChecking the result:\n" + v.stdout.trim());
