# Tests

These check the app in a real browser and the command line tools. They take about a minute.

## Run them

    pip install playwright
    playwright install chromium
    python3 tests/run_all.py

The tools test needs Node.js. Each line of the result is one group of checks. A group fails when any check in it fails, and its output is printed.

## What they cover

- **app:** programme, stars, overlap warning, calendar, saved views, calendar and Markdown export, announcements and programme changes from `live.json`, dark mode, a 320 pixel screen, the thank-you screen after the event.
- **file:** the app opens by double-click, with no server.
- **notes:** notes of your own, kept after a reload, included in the download, and deleted on request.
- **offline:** after one visit the app and its data work without a connection, and other pages on the site are left alone.
- **admin without server:** the organiser page builds `live.json` for download.
- **tools:** the checker, the CSV import and its round trip.

## Not included yet

The tests for the optional server (board, assistant, backup, feedback, statistics) need Cloudflare's local tools and a local database. They are not in this folder yet.
