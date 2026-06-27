# ChemTeach

Interactive Chemistry Teaching Platform for Vidyanidhi Group of Institutions
IVTJ JEE 2026–27 | Class 11 NCERT Chemistry | 10 Chapters | 33 Weeks

## Live Platform

[Open ChemTeach →](https://[username].github.io/chemteach/)

## What This Is

A standalone, browser-based teaching aid used by one chemistry faculty member
to deliver interactive sessions on a classroom projector. No installation
required. No login. No student interface. Open the URL and teach.

## Structure

- `index.html` — Dashboard with chapter grid and progress tracking
- `chapters/` — Session HTML files (one complete template, rest pending)
- `components/` — 11 reusable pedagogical tool engines
- `assets/` — Shared CSS (design tokens, dashboard, session styles)
- `progress.js` — localStorage progress engine
- `SCHEDULE.json` — All session dates and topic mappings

## How to Update

One change = one file:

- **Fix a slide**: edit the session HTML file's `data-config` JSON for that slide.
- **Change a tool everywhere**: edit the relevant file in `components/`.
- **Change colours platform-wide**: edit `assets/design-tokens.css`.

See `docs/` for the original planning documents.

## Built With

Vanilla HTML, CSS, JavaScript. No frameworks. No build tools. No dependencies.
