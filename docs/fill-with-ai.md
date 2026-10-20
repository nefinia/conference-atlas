# Fill conference.js from a booklet or a PDF

When the programme only exists as a PDF, a web page or a Word file, an AI assistant can write the first version of `conference.js` for you. You read it through, fix what is wrong and run the validator.

Keep the people's data in mind. A programme booklet is public, so it is fine to paste. Do not paste registration lists.

## The easy route

Ask the assistant for a CSV, then use the importer. CSV is short and easy to check by eye.

1. Give the assistant the booklet text and this request:

> Turn this programme into a CSV with the columns date, start, end, room, session, kind, title, speakers, affiliations, themes, abstract. Dates look like 2027-05-10 and times like 09:30. kind is one of talk, keynote, workshop, poster, plenary, break. Separate several speakers with semicolons and keep the affiliations in the same order. Use only what the text says. Where something is missing, leave the cell empty. Do not guess times or names.

2. Save the answer as `programme.csv` and open it in a spreadsheet. Check ten rows against the booklet: times, rooms, spelling of names.
3. Run `node tools/csv-to-conference.mjs programme.csv`. It builds sessions, items, people, rooms and themes, and checks the result.
4. Copy `conference.generated.js` over `conference.js`, then edit the conference block (name, dates, venue, colours).

## The direct route

If you prefer, ask the assistant for the whole file. Give it the booklet, the file `docs/conference-js.md` and the demo `conference.js`, and ask:

> Write conference.js for this conference, in the same format as the demo. Use only what the booklet says. Leave a field out when the booklet does not give it. Tell me at the end which parts you were unsure about.

Then run `node tools/validate.mjs`. It lists unknown rooms, unknown themes, sessions that end before they start and talks that do not fit in their session.

## What to check by hand

- Time zone and dates in the conference block.
- Rooms: the order of the list is the order of the columns.
- Names of speakers, spelled the same in every place.
- Talks that run in parallel, which are the ones people compare.
- A look at the app with `?sim=` at a few moments of each day.

Other systems (Indico, Pretalx, Sched and similar) can usually export a spreadsheet. Export it, rename the columns to the ones above, and use the CSV importer.
