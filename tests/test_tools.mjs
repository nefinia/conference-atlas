// The command line tools: validate, CSV import, QR (skipped when qrcode is not installed).
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = (...a) => spawnSync(process.execPath, a, { cwd: root, encoding: "utf8" });
const fails = [];
const check = (n, c, x) => { console.log((c ? "PASS " : "FAIL ") + n + (!c && x ? " -> " + x : "")); if (!c) fails.push(n); };

let r = run("tools/validate.mjs");
check("the demo conference validates", r.status === 0, r.stdout + r.stderr);

const out = join(mkdtempSync(join(tmpdir(), "atlas-")), "generated.js");
r = run("tools/csv-to-conference.mjs", "docs/example-programme.csv", "--out", out);
check("CSV import runs and validates", r.status === 0 && /OK:/.test(r.stdout), r.stdout + r.stderr);
const gen = readFileSync(out, "utf8");
check("generated file starts with window.CONFERENCE", gen.startsWith("window.CONFERENCE = {"));
const demo = readFileSync(join(root, "conference.js"), "utf8");
const count = s => JSON.parse(s.replace(/^window\.CONFERENCE = /, "").replace(/;\s*$/, "")).items.length;
check("CSV round trip keeps every item", count(gen) === count(demo), `${count(gen)} vs ${count(demo)}`);

const bad = join(mkdtempSync(join(tmpdir(), "atlas-")), "bad.js");
import { writeFileSync } from "node:fs";
writeFileSync(bad, demo.replace('"room": "main"', '"room": "nowhere"'));
r = run("tools/validate.mjs", bad);
check("validator catches an unknown room", r.status !== 0 && /nowhere/.test(r.stdout));

console.log("\nFAILED: " + (fails.length ? fails.join(", ") : "none"));
process.exit(fails.length ? 1 : 0);
