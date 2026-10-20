# The optional server

The assistant, the board, encrypted backup, private feedback, the organiser page and the statistics need one small server. It is a Cloudflare Worker with a D1 database, both inside your own Cloudflare account. One worker can serve several conferences.

Skip this page when you only want the programme online. The app works fully without it, and live.json covers announcements.

The worker was tested on a local copy with its database, and by a browser test of every feature against it. It has not been deployed from this template yet, so run through the steps once before the event and try each feature on your own phone.

## What you need

- A Cloudflare account (the free plan is enough for a conference).
- Node.js.
- For the assistant: an Anthropic API key. Without it the assistant stays off and everything else works.

## Steps

All commands run in the `worker/` folder.

1. Make the database:

       npx wrangler d1 create conference

   It prints a database id. Paste it into `wrangler.toml` as `database_id`.

2. Create the tables:

       npx wrangler d1 execute conference --remote --file=schema.sql

3. In `wrangler.toml`, edit the `CONFERENCES` block. The key is `conference.id` from your `conference.js`. Fill in:
   - `origins`: the website your app is served from, for example `https://example.org`. Only these sites may call the worker.
   - `conferenceUrl`: the address of your `conference.js`. The assistant reads the programme from there.
   - `budgetUsd`: the most the assistant may spend. It stops at 95% of it.
   - `dailyPerPerson` and `dailyPerNetwork`: questions per day.
   - `retentionUntil`: the date when board posts are deleted.

4. Check the prices in `PRICE_IN_PER_MTOK` and `PRICE_OUT_PER_MTOK` against the current price list for the model you chose. They drive the budget cap. The values in the file are a starting guess.

5. Set the two secrets. Each command asks for the value, so it never sits in a file:

       npx wrangler secret put ANTHROPIC_API_KEY
       npx wrangler secret put ADMIN_KEY

   `ADMIN_KEY` is a long random phrase. It opens the organiser page. `admin.html` can make one for you with the "Make one" button. Keep it in a password manager.

6. Publish the worker:

       npx wrangler deploy

   It prints the worker address, for example `https://conference-worker.yourname.workers.dev`.

7. In `conference.js`, set `backend.url` to that address and switch on the modules you want: `ask`, `board`, `sync`. Set `backend.tally` to `true` for the statistics. Upload the site again.

## The organiser page

Open `admin.html` on your site. Enter the worker address, the conference id and the admin key. They stay in that browser only. From there you can:

- write announcements with a start and end time in the conference time zone;
- change the programme: move a talk to another room or time, or mark it cancelled;
- read the feedback people sent;
- hide or show board posts.

Phones pick up a change within five minutes, or at once when someone opens the app.

## Statistics

With `backend.tally` on, the app counts anonymous actions as hourly totals: openings, tabs, stars, ratings, and new against returning devices. There are no cookies and no identifiers, and the counter respects Do Not Track. The overview in the organiser page shows the totals. The raw numbers can be fetched from `/stats` with the admin key.

## Privacy in short

- The server keeps no addresses. Limits use daily hashes.
- Backups are encrypted on the phone with a key the person holds. The server cannot read them. Unused backups are deleted after two years.
- Board posts are deleted on `retentionUntil`. People can delete their own at any time. Three reports hide a post.
- Feedback is private to the organisers.

## Before the event

Try each module on a phone, on mobile data as well as Wi-Fi. Post on the board, ask the assistant a question, make a backup and restore it on a second device, send feedback, publish an announcement from the organiser page and see it arrive. Look at the spend in the overview.
