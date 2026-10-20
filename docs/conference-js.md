# conference.js

Everything about your conference lives in this one file. The demo file in the folder is a full example. Times are local to `conference.timezone` and written `09:30`. Dates are written `2027-05-10`. `node tools/validate.mjs` checks the file and says what to fix.

## conference

| Field | Meaning |
|---|---|
| `id` | Short name in lowercase letters, digits and hyphens. The server uses it to tell conferences apart. |
| `name`, `short` | Full name and the short name shown in the header. |
| `tagline` | One line under the name when there is no venue. |
| `timezone` | A name such as `Europe/Paris`. The clock and all times follow it. |
| `start`, `end` | First and last day. |
| `url` | The final address of the app. |
| `website` | Optional. The conference's own website. When set, the footer links to it. |
| `venue` | `name`, `address`, `lat`, `lng`, and `map` (an address to a map image, optional). |
| `contact` | `name` and `email`, shown in Practical. |
| `about` | Two or three plain sentences. |
| `creditLine` | Optional. A line of your own at the bottom, for example who organises the event. |
| `credit` | The app adds a small line at the bottom, "Conference Atlas, by Sofia Gallego / CosmoVentures", with links. Set `"credit": false` to hide it. |

## look

Four colours: `accent`, `head`, `darkAccent`, `darkHead`. The second pair is used in dark mode. Everything else follows from them.

## modules

Each tab is a switch: `now`, `programme`, `saved`, `posters`, `topics`, `people`, `social`, `practical`, `board`, `ask`, `sync`. The last three also need `backend.url`.

## backend

`url` is the address of your worker (empty when you have none). `tally` turns the anonymous statistics on.

## rooms and themes

    { "id": "main", "name": "Main Auditorium", "short": "Aud." }
    { "id": "found", "name": "Foundations", "color": "#6c4fb3" }

Parallel sessions appear side by side in the order of the `rooms` list.

## sessions

A session is a block of time.

    { "id": "d1-a", "date": "2027-05-10", "start": "11:00", "end": "12:20",
      "room": "main", "title": "Foundations I", "kind": "talks", "slot": 20, "theme": "found" }

`kind` is one of `talks`, `keynote`, `workshop`, `plenary`, `posters`, `break`. In a `talks` session the items follow each other, each `slot` minutes long. Keynotes, workshops, plenaries and posters take the time of their session.

## items

An item is a talk, keynote, workshop or poster.

    { "id": "t5", "kind": "talk", "session": "d1-b", "title": "Open data for slow science",
      "speakers": ["Hanna Virtanen"], "themes": ["meth", "soc"], "abstract": "..." }

- `session` is the id of the session it belongs to.
- `start` and `duration` (minutes) are optional and place a talk exactly when the order has gaps.
- `no` is a poster number.
- `url` adds a link.
- Long abstracts can live in a separate file. Put `"abstractsUrl": "abstracts.json"` at the top level of the file, and in that file map each item id to its text. This keeps `conference.js` small and fast.

## people

    { "name": "Ada Okafor", "affiliation": "University of Lagos", "role": "Keynote",
      "bio": "...", "url": "https://..." }

Names must match the names in the items' `speakers`.

## events

Social events outside the sessions.

    { "id": "e1", "date": "2027-05-09", "start": "18:00", "end": "20:00",
      "title": "Welcome drinks", "place": "Café de la Place", "note": "Open to everyone." }

Each one can be added to a calendar.

## practical

A list of blocks with a `title` and a `body`. Use it for getting there, lunch, Wi-Fi, accessibility and contacts.

## announcements

    { "from": "2027-05-10T08:00:00+02:00", "until": "2027-05-10T18:00:00+02:00",
      "text": "Lunch is in the <b>Foyer</b>.", "more": "Longer text shown on tap." }

Text may use `<b>`, `<i>`, `<em>`, `<strong>`, `<u>`, `<br>` and links. Anything else is removed. Announcements added later, through `live.json` or the organiser page, work the same way.

## strings

Optional. Rename a tab, for example `{ "board": "Notice board", "ask": "Ask" }`.
