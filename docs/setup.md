# Setup on one page

You need a text editor and a place to host files. Nothing else is needed for the basics.

## 1. Your conference

Open `conference.js` in a text editor. The `conference` block holds the name, dates, time zone and venue. Times everywhere in the file are local to that time zone, written as `09:30`.

Rooms, themes, sessions and items follow. A session is a block of time in one room. An item is a talk, keynote, workshop or poster inside a session. In a session of kind `talks`, items run one after the other, each `slot` minutes long (20 unless you say otherwise). Give an item its own `start` when the order has gaps.

Speakers are plain names. List a person under `people` to add an affiliation, a short bio or a website. `docs/conference-js.md` lists every field.

Keep the first line, `window.CONFERENCE = {`, and the `};` at the end as they are.

## 2. Look at it

Double-click `index.html`. It opens in your browser with your conference. Add `?sim=2027-05-10T11:30` to the address to see the app at that moment, in the conference time zone.

Open it on a phone and on a laptop as well. Tap a talk title to read the abstract, star two talks that overlap and look at Saved.

## 3. Publish

Upload the whole folder to a website that serves https. GitHub Pages, Netlify and Cloudflare Pages all work and are free for this. The service worker and the home-screen install need https. If the app lives in a subfolder, nothing needs changing.

The address you get is the link people will use.

## 4. Home-screen name and icons

Open `manifest.webmanifest` and write your conference name in `name` and `short_name`. Replace `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` and `favicon.svg` with your own.

## Optional, with Node.js

Node.js is a free program for tools that save work. Nothing above depends on it.

- Check the file for mistakes: `node tools/validate.mjs`. Lines that start with "error" need a fix. Lines that start with "note" are advice.
- Fill the link-preview tags and the manifest from the file: `node tools/setup.mjs`. Add `og-image.png` (1200 by 630) next to `index.html` for the preview picture. Run it again after any change to the name, colours or address.
- Fill the file from a spreadsheet: `node tools/csv-to-conference.mjs programme.csv`. It writes `conference.generated.js`. Read it once, then copy it over `conference.js`. The columns are listed at the top of `tools/csv-to-conference.mjs`, and `docs/example-programme.csv` shows a full file.
- Make a QR code: see `docs/organiser-kit.md`.

## During the conference

Open `admin.html` in your browser and press "Start without a server".

- **Announcements:** add one, write the text, choose when it shows and when it stops.
- **Programme changes:** pick the talk, then set a new start time, a new room, a new title, or tick "Cancelled".
- Press "Download live.json" and upload that file to your website, in the same folder as `index.html`. Replace the old one. Phones show the change within five minutes, or as soon as someone opens the app.

If you later set up the server, the same page publishes with one button and no upload.

After the last day the Now tab turns into a thank-you with a one-tap rating.
