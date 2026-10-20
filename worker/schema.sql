-- Database for the conference worker (Cloudflare D1).
-- Apply once:  npx wrangler d1 execute conference --remote --file=schema.sql
-- Running it again is safe.

-- Counters for daily limits. Keys hold anonymous hashes, never addresses.
CREATE TABLE IF NOT EXISTS usage (k TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0, day TEXT NOT NULL);

-- Money spent on the assistant, per conference, in US dollars.
CREATE TABLE IF NOT EXISTS spend (conf TEXT PRIMARY KEY, usd REAL NOT NULL DEFAULT 0);

-- Anonymous hourly totals of actions (Tally).
CREATE TABLE IF NOT EXISTS events (
  app TEXT NOT NULL, day TEXT NOT NULL, hour INTEGER NOT NULL, name TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (app, day, hour, name));

-- Encrypted backups. The server only ever sees ciphertext.
CREATE TABLE IF NOT EXISTS sync (
  conf TEXT NOT NULL, id TEXT NOT NULL, blob TEXT NOT NULL, updated INTEGER NOT NULL,
  PRIMARY KEY (conf, id));

-- The public board.
CREATE TABLE IF NOT EXISTS shared (
  sid INTEGER PRIMARY KEY AUTOINCREMENT, conf TEXT NOT NULL, kind TEXT NOT NULL, item TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '', text TEXT NOT NULL, author TEXT NOT NULL, at INTEGER NOT NULL,
  reports INTEGER NOT NULL DEFAULT 0, hidden INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS shared_conf ON shared (conf, hidden, at);
CREATE TABLE IF NOT EXISTS votes (sid INTEGER NOT NULL, voter TEXT NOT NULL, PRIMARY KEY (sid, voter));
CREATE TABLE IF NOT EXISTS reports (sid INTEGER NOT NULL, reporter TEXT NOT NULL, PRIMARY KEY (sid, reporter));

-- Private feedback for the organisers, and one rating per device.
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT, conf TEXT NOT NULL, text TEXT NOT NULL, contact TEXT NOT NULL DEFAULT '', at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS ratings (
  conf TEXT NOT NULL, author TEXT NOT NULL, rating INTEGER NOT NULL, at INTEGER NOT NULL, PRIMARY KEY (conf, author));

-- Programme changes and announcements posted from the admin page.
CREATE TABLE IF NOT EXISTS live (conf TEXT PRIMARY KEY, body TEXT NOT NULL, updated TEXT NOT NULL);
