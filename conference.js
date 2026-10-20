window.CONFERENCE = {
 "schema": 1,
 "conference": {
  "id": "horizons27",
  "name": "Open Horizons 2027",
  "short": "Horizons 27",
  "tagline": "A demo conference for the template",
  "timezone": "Europe/Paris",
  "start": "2027-05-10",
  "end": "2027-05-11",
  "url": "https://example.org/horizons27/",
  "venue": {
   "name": "Maison des Sciences",
   "address": "12 rue des Écoles, 75005 Paris",
   "lat": 48.8467,
   "lng": 2.3445,
   "map": ""
  },
  "contact": {
   "name": "Organising team",
   "email": "hello@example.org"
  },
  "about": "Open Horizons is a made-up conference used to try the template. Replace this text with two or three plain sentences about your event.",
  "creditLine": ""
 },
 "look": {
  "accent": "#008b8b",
  "head": "#2b2257",
  "darkAccent": "#4cc4c4",
  "darkHead": "#c7b7ee"
 },
 "modules": {
  "now": true,
  "programme": true,
  "saved": true,
  "posters": true,
  "topics": true,
  "people": true,
  "social": true,
  "practical": true,
  "board": false,
  "ask": false,
  "sync": false
 },
 "backend": {
  "url": "",
  "tally": false
 },
 "rooms": [
  {
   "id": "main",
   "name": "Main Auditorium",
   "short": "Aud."
  },
  {
   "id": "b",
   "name": "Room B",
   "short": "B"
  },
  {
   "id": "c",
   "name": "Room C",
   "short": "C"
  },
  {
   "id": "foyer",
   "name": "Foyer",
   "short": "Foyer"
  }
 ],
 "themes": [
  {
   "id": "found",
   "name": "Foundations",
   "color": "#6c4fb3"
  },
  {
   "id": "meth",
   "name": "Methods",
   "color": "#2c6f9e"
  },
  {
   "id": "apps",
   "name": "Applications",
   "color": "#2b8a6a"
  },
  {
   "id": "soc",
   "name": "Society",
   "color": "#b05a3c"
  }
 ],
 "sessions": [
  {
   "id": "d1-open",
   "date": "2027-05-10",
   "start": "09:00",
   "end": "09:30",
   "room": "main",
   "title": "Opening",
   "kind": "plenary"
  },
  {
   "id": "d1-key",
   "date": "2027-05-10",
   "start": "09:30",
   "end": "10:30",
   "room": "main",
   "title": "Keynote",
   "kind": "keynote"
  },
  {
   "id": "d1-break1",
   "date": "2027-05-10",
   "start": "10:30",
   "end": "11:00",
   "room": "foyer",
   "title": "Coffee",
   "kind": "break"
  },
  {
   "id": "d1-a",
   "date": "2027-05-10",
   "start": "11:00",
   "end": "12:20",
   "room": "main",
   "title": "Foundations I",
   "kind": "talks",
   "slot": 20,
   "theme": "found"
  },
  {
   "id": "d1-b",
   "date": "2027-05-10",
   "start": "11:00",
   "end": "12:20",
   "room": "b",
   "title": "Methods I",
   "kind": "talks",
   "slot": 20,
   "theme": "meth"
  },
  {
   "id": "d1-c",
   "date": "2027-05-10",
   "start": "11:00",
   "end": "12:20",
   "room": "c",
   "title": "Applications I",
   "kind": "talks",
   "slot": 20,
   "theme": "apps"
  },
  {
   "id": "d1-lunch",
   "date": "2027-05-10",
   "start": "12:20",
   "end": "13:30",
   "room": "foyer",
   "title": "Lunch",
   "kind": "break"
  },
  {
   "id": "d1-posters",
   "date": "2027-05-10",
   "start": "15:00",
   "end": "16:30",
   "room": "foyer",
   "title": "Poster session",
   "kind": "posters"
  },
  {
   "id": "d1-ws",
   "date": "2027-05-10",
   "start": "13:30",
   "end": "15:00",
   "room": "c",
   "title": "Workshop",
   "kind": "workshop"
  },
  {
   "id": "d1-d",
   "date": "2027-05-10",
   "start": "13:30",
   "end": "15:00",
   "room": "main",
   "title": "Society and ethics",
   "kind": "talks",
   "slot": 30,
   "theme": "soc"
  },
  {
   "id": "d2-key",
   "date": "2027-05-11",
   "start": "09:00",
   "end": "10:00",
   "room": "main",
   "title": "Keynote",
   "kind": "keynote"
  },
  {
   "id": "d2-break1",
   "date": "2027-05-11",
   "start": "10:00",
   "end": "10:30",
   "room": "foyer",
   "title": "Coffee",
   "kind": "break"
  },
  {
   "id": "d2-a",
   "date": "2027-05-11",
   "start": "10:30",
   "end": "12:10",
   "room": "main",
   "title": "Foundations II",
   "kind": "talks",
   "slot": 20,
   "theme": "found"
  },
  {
   "id": "d2-b",
   "date": "2027-05-11",
   "start": "10:30",
   "end": "12:10",
   "room": "b",
   "title": "Methods II",
   "kind": "talks",
   "slot": 20,
   "theme": "meth"
  },
  {
   "id": "d2-close",
   "date": "2027-05-11",
   "start": "12:10",
   "end": "12:40",
   "room": "main",
   "title": "Closing",
   "kind": "plenary"
  }
 ],
 "items": [
  {
   "id": "k1",
   "kind": "keynote",
   "session": "d1-key",
   "title": "What we know and what we only assume",
   "speakers": [
    "Ada Okafor"
   ],
   "themes": [
    "found"
   ],
   "abstract": "An opening look at the questions the field keeps returning to, and the assumptions that sit under them."
  },
  {
   "id": "t1",
   "kind": "talk",
   "session": "d1-a",
   "title": "Three ways to state the same question",
   "speakers": [
    "Mei Tanaka"
   ],
   "themes": [
    "found"
   ],
   "abstract": "Comparing how different groups word the central question, and what each wording makes easy or hard."
  },
  {
   "id": "t2",
   "kind": "talk",
   "session": "d1-a",
   "title": "A small formal framework for comparison",
   "speakers": [
    "Lukas Brandt"
   ],
   "themes": [
    "found",
    "meth"
   ],
   "abstract": "A minimal formalism that lets two models be compared on shared ground."
  },
  {
   "id": "t3",
   "kind": "talk",
   "session": "d1-a",
   "title": "When definitions disagree",
   "speakers": [
    "Sana Haddad"
   ],
   "themes": [
    "found"
   ],
   "abstract": "A survey of where definitions diverge and why it matters for experiments."
  },
  {
   "id": "t4",
   "kind": "talk",
   "session": "d1-b",
   "title": "Measuring with imperfect instruments",
   "speakers": [
    "Tomás Rivera"
   ],
   "themes": [
    "meth"
   ],
   "abstract": "Error models for measurements that cannot be repeated."
  },
  {
   "id": "t5",
   "kind": "talk",
   "session": "d1-b",
   "title": "Open data for slow science",
   "speakers": [
    "Hanna Virtanen"
   ],
   "themes": [
    "meth",
    "soc"
   ],
   "abstract": "How a shared dataset changed the way three labs plan their work."
  },
  {
   "id": "t6",
   "kind": "talk",
   "session": "d1-b",
   "title": "Replication in practice",
   "speakers": [
    "Mei Tanaka",
    "Tomás Rivera"
   ],
   "themes": [
    "meth"
   ],
   "abstract": "Notes from a joint replication effort across two continents."
  },
  {
   "id": "t7",
   "kind": "talk",
   "session": "d1-c",
   "title": "From lab result to clinic",
   "speakers": [
    "Priya Raman"
   ],
   "themes": [
    "apps"
   ],
   "abstract": "What it takes for a result to leave the lab."
  },
  {
   "id": "t8",
   "kind": "talk",
   "session": "d1-c",
   "title": "Tools for field teams",
   "speakers": [
    "Jonas Eriksen"
   ],
   "themes": [
    "apps"
   ],
   "abstract": "Lightweight tools that work with poor connectivity."
  },
  {
   "id": "t9",
   "kind": "talk",
   "session": "d1-c",
   "title": "Learning from failed pilots",
   "speakers": [
    "Priya Raman"
   ],
   "themes": [
    "apps",
    "soc"
   ],
   "abstract": "Three pilots that did not work, and what each taught."
  },
  {
   "id": "t10",
   "kind": "talk",
   "session": "d1-d",
   "title": "Who gets a seat at the table",
   "speakers": [
    "Sana Haddad"
   ],
   "themes": [
    "soc"
   ],
   "abstract": "Participation and power in research collaborations."
  },
  {
   "id": "t11",
   "kind": "talk",
   "session": "d1-d",
   "title": "Writing for the people affected",
   "speakers": [
    "Hanna Virtanen"
   ],
   "themes": [
    "soc"
   ],
   "abstract": "Plain-language reporting as part of the method."
  },
  {
   "id": "w1",
   "kind": "workshop",
   "session": "d1-ws",
   "title": "Building a shared glossary",
   "speakers": [
    "Lukas Brandt",
    "Jonas Eriksen"
   ],
   "themes": [
    "found",
    "meth"
   ],
   "abstract": "A hands-on session to draft terms the whole room can use."
  },
  {
   "id": "k2",
   "kind": "keynote",
   "session": "d2-key",
   "title": "Looking ahead",
   "speakers": [
    "Elena Costa"
   ],
   "themes": [
    "soc",
    "found"
   ],
   "abstract": "Where the next five years of work might go."
  },
  {
   "id": "t12",
   "kind": "talk",
   "session": "d2-a",
   "title": "Priors we forgot we had",
   "speakers": [
    "Lukas Brandt"
   ],
   "themes": [
    "found"
   ],
   "abstract": "Making hidden assumptions visible in model design."
  },
  {
   "id": "t13",
   "kind": "talk",
   "session": "d2-a",
   "title": "A case for slower definitions",
   "speakers": [
    "Mei Tanaka"
   ],
   "themes": [
    "found"
   ],
   "abstract": "Why settling terms late can help."
  },
  {
   "id": "t14",
   "kind": "talk",
   "session": "d2-a",
   "title": "Bridging two vocabularies",
   "speakers": [
    "Elena Costa"
   ],
   "themes": [
    "found",
    "soc"
   ],
   "abstract": "Translating between two research communities."
  },
  {
   "id": "t15",
   "kind": "talk",
   "session": "d2-a",
   "title": "What counts as evidence",
   "speakers": [
    "Ada Okafor"
   ],
   "themes": [
    "found",
    "meth"
   ],
   "abstract": "Evidence standards compared across fields."
  },
  {
   "id": "t16",
   "kind": "talk",
   "session": "d2-b",
   "title": "Pipelines you can read",
   "speakers": [
    "Jonas Eriksen"
   ],
   "themes": [
    "meth",
    "apps"
   ],
   "abstract": "Analysis pipelines written to be read by others."
  },
  {
   "id": "t17",
   "kind": "talk",
   "session": "d2-b",
   "title": "Sampling for small groups",
   "speakers": [
    "Tomás Rivera"
   ],
   "themes": [
    "meth"
   ],
   "abstract": "Design choices for studies with few participants."
  },
  {
   "id": "t18",
   "kind": "talk",
   "session": "d2-b",
   "title": "Checks that catch mistakes early",
   "speakers": [
    "Hanna Virtanen"
   ],
   "themes": [
    "meth"
   ],
   "abstract": "Simple checks that save months of work."
  },
  {
   "id": "t19",
   "kind": "talk",
   "session": "d2-b",
   "title": "Sharing negative results",
   "speakers": [
    "Priya Raman"
   ],
   "themes": [
    "meth",
    "soc"
   ],
   "abstract": "Why and how to publish what did not work."
  },
  {
   "id": "p1",
   "kind": "poster",
   "session": "d1-posters",
   "title": "A first look at shared vocabularies",
   "speakers": [
    "Noor Ahmed"
   ],
   "themes": [
    "found"
   ]
  },
  {
   "id": "p2",
   "kind": "poster",
   "session": "d1-posters",
   "title": "Low-cost sensors in the field",
   "speakers": [
    "Pablo Ferreira"
   ],
   "themes": [
    "apps"
   ]
  },
  {
   "id": "p3",
   "kind": "poster",
   "session": "d1-posters",
   "title": "Notes on reproducible figures",
   "speakers": [
    "Ines Duarte"
   ],
   "themes": [
    "meth"
   ]
  },
  {
   "id": "p4",
   "kind": "poster",
   "session": "d1-posters",
   "title": "Community review in small fields",
   "speakers": [
    "Yusuf Demir"
   ],
   "themes": [
    "soc"
   ]
  },
  {
   "id": "p5",
   "kind": "poster",
   "session": "d1-posters",
   "title": "Teaching with open datasets",
   "speakers": [
    "Katarzyna Nowak"
   ],
   "themes": [
    "apps",
    "soc"
   ]
  },
  {
   "id": "p6",
   "kind": "poster",
   "session": "d1-posters",
   "title": "Modelling with partial information",
   "speakers": [
    "Ravi Menon"
   ],
   "themes": [
    "meth",
    "found"
   ]
  }
 ],
 "people": [
  {
   "name": "Ada Okafor",
   "affiliation": "University of Lagos",
   "role": "Keynote"
  },
  {
   "name": "Elena Costa",
   "affiliation": "Universidade do Porto",
   "role": "Keynote"
  },
  {
   "name": "Mei Tanaka",
   "affiliation": "Kyoto University"
  },
  {
   "name": "Lukas Brandt",
   "affiliation": "TU Wien"
  },
  {
   "name": "Sana Haddad",
   "affiliation": "American University of Beirut"
  },
  {
   "name": "Tomás Rivera",
   "affiliation": "Universidad de Chile"
  },
  {
   "name": "Hanna Virtanen",
   "affiliation": "University of Helsinki"
  },
  {
   "name": "Priya Raman",
   "affiliation": "IISc Bangalore"
  },
  {
   "name": "Jonas Eriksen",
   "affiliation": "Aarhus University"
  },
  {
   "name": "Noor Ahmed",
   "affiliation": "University of Cambridge"
  },
  {
   "name": "Pablo Ferreira",
   "affiliation": "Universidad de Sevilla"
  },
  {
   "name": "Ines Duarte",
   "affiliation": "NOVA Lisbon"
  },
  {
   "name": "Yusuf Demir",
   "affiliation": "Middle East Technical University"
  },
  {
   "name": "Katarzyna Nowak",
   "affiliation": "University of Warsaw"
  },
  {
   "name": "Ravi Menon",
   "affiliation": "IIT Madras"
  }
 ],
 "events": [
  {
   "id": "e1",
   "date": "2027-05-09",
   "start": "18:00",
   "end": "20:00",
   "title": "Welcome drinks",
   "place": "Café de la Place, 3 rue Mouffetard",
   "note": "Open to everyone, no registration."
  },
  {
   "id": "e2",
   "date": "2027-05-10",
   "start": "19:30",
   "end": "22:00",
   "title": "Conference dinner",
   "place": "Le Petit Jardin",
   "note": "Registered guests only."
  },
  {
   "id": "e3",
   "date": "2027-05-11",
   "start": "14:00",
   "end": "17:00",
   "title": "Walk along the Seine",
   "place": "Meet at the main entrance",
   "note": "Comfortable shoes."
  }
 ],
 "practical": [
  {
   "title": "Getting here",
   "body": "Metro line 10 to Cardinal Lemoine, then a five minute walk. Cycle racks are by the main entrance."
  },
  {
   "title": "Wi-Fi",
   "body": "Network: horizons27. Password: on your badge."
  },
  {
   "title": "Food",
   "body": "Coffee and lunch are served in the Foyer. Tell the registration desk about any dietary needs."
  },
  {
   "title": "Contacts",
   "body": "Registration desk: open from 8:30. Organisers: hello@example.org."
  }
 ],
 "announcements": [
  {
   "from": "2027-05-10T08:00:00+02:00",
   "until": "2027-05-10T18:00:00+02:00",
   "text": "Welcome. Lunch is in the <b>Foyer</b> from 12:20.",
   "more": "Vegetarian and vegan options are marked at the buffet."
  },
  {
   "from": "2027-05-11T08:00:00+02:00",
   "until": "2027-05-11T12:40:00+02:00",
   "text": "Today we close at <b>12:40</b>. Thank you for coming."
  }
 ],
 "strings": {}
};
