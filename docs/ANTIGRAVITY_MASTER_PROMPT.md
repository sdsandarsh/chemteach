# Master Handoff Prompt — ChemTeach
*Paste everything below this line into Google Antigravity as your first message.*

---

## 1. What this project is

**ChemTeach** is a browser-based, teacher-led interactive slide-deck platform covering the complete **Class 11 NCERT Chemistry syllabus** (India), built for **one chemistry teacher** to project in a classroom for the **IVTJ JEE 2026–27 batch**. It spans **10 chapters, 33 teaching weeks, 88 session files**, from May 21, 2026 through December 29, 2026.

**Repo:** `https://github.com/sdsandarsh/chemteach` (branch: `main`)
**Live site:** `https://sdsandarsh.github.io/chemteach/` (GitHub Pages, deployed from `main` / root)
**Local working copy root:** the repo root is the `chemteach/` folder — that is what gets pushed to GitHub. A sibling `docs/` folder *outside* `chemteach/` (i.e. at `Chemistry_2026/`) holds the original planning documents (DOC1–DOC7) that originated this build — the user will upload these to you directly; read them before changing anything structural.

### Who uses it and how
- **One teacher, one laptop, one projector.** No login. No student-facing interface. No backend, no database, no server-side anything (currently).
- Teacher opens the dashboard (`index.html`), sees a "Today's Session" banner that matches today's date against the schedule, clicks into a chapter, picks a session, and presents it slide-by-slide using on-screen PREV/NEXT or arrow keys.
- All progress (completed sessions, last-opened, teacher notes, last slide reached) persists in **browser localStorage** — there is no sync between devices and no accounts.

### You are NOT restricted to static HTML
The current implementation is vanilla HTML/CSS/JS with zero build tools, by original design choice (so the teacher could literally drag-and-drop files to GitHub's web uploader with no terminal). **That constraint no longer has to hold.** If you determine the project would be meaningfully better served by a static site generator, a bundler, a component framework, a small build pipeline, or even a thin backend (e.g. for cross-device progress sync, an admin CMS for editing slide content without touching raw HTML, or analytics) — propose it and do it. The two things that must NOT change without explicit confirmation from the user are:
1. It must remain free to host (GitHub Pages or equivalent static/cheap hosting) — the institution has no budget for paid infrastructure.
2. It must remain usable with **zero setup** by the teacher day-to-day (open a URL, teach). Any new build step is your concern, not theirs.

---

## 2. Current architecture (as of handoff)

```
chemteach/                          ← repo root, deployed as-is to GitHub Pages
├── index.html                      ← dashboard (chapter grid, today banner, progress)
├── README.md
├── SCHEDULE.json                   ← single source of truth for all 88 sessions' dates/topics/file paths
├── progress.js                     ← localStorage progress engine (ChemProgress API)
├── assets/
│   ├── design-tokens.css           ← ALL CSS variables (colors, fonts, spacing) + light/dark theme blocks
│   ├── dashboard.css                ← dashboard-only styles (chapter cards, session rows, header)
│   ├── session.css                  ← shared styles for every session slide-deck page
│   └── theme.js                     ← light/dark mode toggle, persisted via localStorage, shared site-wide
├── components/                      ← 11 reusable "pedagogical tool" JS modules (see §4)
│   ├── particle-sim.js
│   ├── model-3d.js
│   ├── analogy.js
│   ├── mnemonic.js
│   ├── visual-explain.js
│   ├── animation.js
│   ├── drag-drop.js
│   ├── comic-strip.js
│   ├── riddle.js
│   ├── story.js
│   └── scaffold.js
├── chapters/
│   └── chNN/weekWW/sessionSS-SS.html   ← one file per session, ALL 88 fully built (none are placeholders)
└── docs/                            ← planning docs (DOC1–DOC7) + this file
```

### Tech stack
- Pure HTML5 + CSS3 (custom properties / `var()` everywhere — no Sass/Less/PostCSS)
- Vanilla ES6+ JavaScript, no frameworks, no npm, no bundler
- No external fonts, no CDNs, no analytics, no telemetry — fully offline-capable once loaded
- Data: a single `SCHEDULE.json` (~88 entries) drives the dashboard; each session HTML file is self-contained otherwise

### Design system (`assets/design-tokens.css`)
A deep-indigo dark theme is default, with a plasma-blue / violet / gold spectral accent palette (inspired by a reference "Structure of Atom" deck the user supplied earlier), plus a full light-theme override toggled via `document.documentElement.setAttribute('data-theme', 'light'|'dark')`.

Key variables (dark defaults shown; see `[data-theme="light"]` block for the light overrides — **do not hardcode colors anywhere, always use these variables**, including inside JS-generated SVG/canvas where feasible):
```
--color-bg, --color-card, --color-card-hover
--color-accent (#2563FF), --color-highlight (#B347FF), --color-secondary (#00D4FF)
--color-text, --color-text-muted, --color-text-body
--color-success, --color-error, --color-warning
--color-panel-green/amber/cyan   (used by the "known-unknown" scaffold component)
--spec-1 through --spec-10        (a 10-color cycle used for chapter/session icon theming;
                                    has its OWN separate light-mode override since the bright
                                    dark-mode hues have poor contrast on white cards)
--radius, --radius-sm, --radius-lg, --shadow, --shadow-glow, --transition
--font-main, --font-mono
```
`body::before` renders an animated ambient nebula-glow radial-gradient background (also re-themed for light mode).

### Theme toggle mechanics
`assets/theme.js` is included in `<head>` of every page (dashboard + all 88 sessions), runs immediately to set `data-theme` before first paint (avoids flash), persists choice in `localStorage['chemteach_theme']`, and exposes `window.ChemTheme.toggle()` / `.current()`. Every page has a `.theme-toggle-btn` wired to `onclick="ChemTheme.toggle()"`.

---

## 3. Data model

### `SCHEDULE.json`
```json
{
  "sessions": [
    {
      "sessionId": "ch01_w01_s01-02",
      "chapter": 1,
      "chapterName": "Some Basic Concepts of Chemistry",
      "week": 1,
      "session": "01-02",
      "dates": ["2026-05-21", "2026-05-22"],
      "days": ["THU", "FRI"],
      "topics": ["1.1 Importance of Chemistry", "1.2 Nature of Matter", "..."],
      "file": "chapters/ch01/week01/session01-02.html"
    }
  ]
}
```
- `dates` were generated programmatically by walking forward through real school days (skipping Sundays and a fixed holiday list — Bakrid, Independence Day, Gandhi Jayanti, Dasara break, Deepawali, Christmas, etc.), **not hand-transcribed from the original micro-schedule text** — treat this as authoritative but verify against the teacher's actual calendar before the term if precision matters.
- The dashboard (`index.html`) fetches this file at runtime, groups sessions by `chapter` → `week`, and renders everything dynamically. **Nothing about chapter/week structure is hardcoded in the dashboard JS** except the `CHAPTERS` array (chapter number + display name) and a couple of icon-keyword tables (see §5).
- **Chapter/week boundaries do not perfectly match a naive "10 chapters of N weeks each" model.** A handful of sessions straddle chapter boundaries because the original school timetable didn't align content breaks with week breaks (e.g. a session might be "completes Ch2" while filed under Chapter 2's last week, even though the *next* session already starts Chapter 3 content in the same week). This was deliberately fixed once already (see §7, item 3) — if you reorganize chapters/weeks further, always move the **file**, update **`SCHEDULE.json`**'s `chapter`/`chapterName`/`file` fields, AND update the **session file's own internal references** (`SESSION_ID` JS const, `ChemProgress.setLastOpened(...)` call, the `.crumb` and `.session-title` text in the header) — all four must stay in sync or progress tracking breaks for that session.

### `progress.js` — the `ChemProgress` API (localStorage key: `chemteach_v1`)
```js
ChemProgress.load()                          // returns full state object
ChemProgress.save(state)
ChemProgress.markComplete(sessionId)
ChemProgress.markIncomplete(sessionId)
ChemProgress.saveNote(sessionId, text)
ChemProgress.getNote(sessionId)
ChemProgress.setLastOpened(chapterNum, weekNum, sessionLabel)
ChemProgress.getLastOpened()
ChemProgress.setLastSlide(sessionId, slideNumber)
ChemProgress.getLastSlide(sessionId)
ChemProgress.isComplete(sessionId)
ChemProgress.chapterProgress(chapterNum)     // {completed, total, percent}
ChemProgress.reset()                          // wipes everything, used by the dashboard's reset button
```
State shape: `{ version, lastUpdated, lastOpened: {chapter,week,session}, sessions: { [sessionId]: {completed, completedAt, lastSlide, notes} } }`.

---

## 4. The 11 pedagogical components

Every session is a sequence of "slides," each one either a static HTML block (title card, summary card) or one of 11 reusable interactive tools. Each component is a standalone JS file exposing `window.<Name>.init(container, config)`:

| Component file | Global name | Purpose | Config shape (typical) |
|---|---|---|---|
| `particle-sim.js` | `ParticleSim` | Canvas particle simulation, HEAT/COOL buttons, solid↔liquid↔gas | `{initialState, particleColor, particleCount, labels:{solid,liquid,gas}, caption}` |
| `model-3d.js` | `Model3D` | CSS-3D-transform molecule/orbital viewer (no WebGL), drag to rotate | `{model, labels, rotatable, caption}` — built-in models: `atom-bohr`, `orbital-sp`, `water-molecule`, `co2-linear`, `methane-tetra`, `nacl-crystal`, `benzene-ring`, `ethene-planar` |
| `analogy.js` | `Analogy` | Side-by-side real-world vs chemistry comparison panels | `{realWorld:{label,visual,fact}, chemistry:{label,visual,fact}, bridge}` |
| `mnemonic.js` | `Mnemonic` | Flip card: front = mnemonic phrase, back = breakdown table | `{mnemonic, breakdown:[...], rule, tip}` |
| `visual-explain.js` | `VisualExplain` | Animated SVG diagrams with click-to-reveal steps | `{diagram, revealSteps, caption}` — named diagrams like `matter-classification-tree`, `periodic-table-blocks`, `bond-polarity-spectrum`, etc. |
| `animation.js` | `ChemAnimation` | Teacher-triggered (never auto-play) step animations | `{sequence, steps:[...], stepByStep, caption}` |
| `drag-drop.js` | `DragDrop` | Drag-and-drop sorting, green/red feedback, click-to-place fallback for touchscreens | `{instruction, items:[...], categories:[...], answers:{item:category}}` |
| `comic-strip.js` | `ComicStrip` | 3–5 panel SVG comic with flat-design characters | `{panels:[{character,expression,speech,caption}]}` — characters: `scientist`, `student`, `rutherford`, `dalton`, `atom-character` |
| `riddle.js` | `Riddle` | Question → optional hint → reveal answer + explanation | `{question, hint, answer, explanation}` |
| `story.js` | `Story` | Cinematic narrative slide with SVG background scene | `{setting, narrative, reveal, visual}` |
| `scaffold.js` | `Scaffold` | "Known → Bridge → New Idea" 3-panel sequential reveal | `{known:{label,text}, bridge:{label,text}, unknown:{label,text}}` |

All components style their UI chrome (buttons, captions, backgrounds) via the CSS variables in §2 — they automatically re-theme on light/dark toggle. **Deliberate pedagogical illustration colors are hardcoded by design** (e.g. comic character skin tones, specific molecule atom colors like gold nucleus / cyan electrons, scene background colors) — these should NOT be swapped for theme variables; they are content, not chrome.

---

## 5. Session file template & the chapter/session icon system

Every session file follows an identical skeleton (see any file under `chapters/` for a live example): `<head>` loads `design-tokens.css`, `session.css`, `theme.js`; `<body>` has a fixed `.slide-header` (crumb/title + theme toggle/HOME/MARK COMPLETE/FULLSCREEN buttons), a sequence of `.slide` divs (each with `data-type` and, for interactive ones, `data-config='{...JSON...}'`), a fixed `.slide-nav` (PREV/counter/NEXT), then `<script>` tags loading `progress.js` + all 11 components + an inline script wiring slide navigation, keyboard shortcuts, and `ChemProgress` calls.

The **dashboard** (`index.html`) renders one animated SVG icon per chapter card and per session row from a large in-file icon library (~80 hand-built SVG icons with CSS-animation classes like `anim-bob`, `anim-pulse`, `anim-dash`, `anim-swing`, `anim-flicker`, `anim-scale`, `anim-jitter`, `anim-needle`, `anim-drip`). Icon choice works in two tiers:
1. `CHAPTER_BASE_ICON[idx]` — one default icon per chapter (e.g. Ch5 Thermodynamics → a flickering-flame thermometer).
2. `CHAPTER_VARIANTS[idx]` — an ordered array of `{kw: [...substrings], icon: 'iconName'}` checked against the session's lowercased topic text; first match wins, else falls back to the chapter base icon.

If you add/rename/move sessions, **topics text drives icon selection** — keep topic strings descriptive enough to keyword-match, or extend `CHAPTER_VARIANTS`. There is a `renderIcon(key)` helper and an `iconKeyFor(chapterIdx, topicsText)` function — both in `index.html`'s inline `<script>`.

---

## 6. Tone and pedagogical structure (for writing new content)

Each full session is built from a fixed teaching arc, NOT randomly assembled. The canonical pattern (used in every one of the 88 sessions) is roughly:
1. **Title card** (static) — chapter/week/session/date meta + topic list.
2. **`known-unknown` (Scaffold)** or **`story`** — hooks the student by contrasting what they already intuitively know against a question that breaks that intuition, then states today's answer/lesson.
3. 3–6 interactive tool slides covering the actual content (mix of `analogy`, `visual-explain`, `riddle`, `mnemonic`, `gamification`/`drag-drop`, `model-3d`, `comic-strip`, `animation`, `particle-sim` as appropriate to the topic).
4. Often a closing `known-unknown` bridging into the next session's topic.
5. **Summary card** (static) — bullet list of key concepts + NCERT classwork/assignment MCQ numbers.

Riddles always follow: provocative question → hint (optional) → answer → explanation that teaches the *reasoning*, not just the fact. Mnemonics always include a breakdown table and a "rule" + practical "tip." Stories use a historical/narrative hook with a punchy one-line "reveal." Keep this voice and structure for any new sessions you write — it is the house style the teacher has been trained to expect.

---

## 7. Known issues already fixed — DO NOT reintroduce these

1. **Critical: apostrophes inside `data-config='...'` truncate the attribute.** Every session's interactive slide config is embedded as `data-config='{"text": "..."}'` using a **single-quote** HTML attribute delimiter. Any literal apostrophe in the JSON text (e.g. "Dalton's," "Hess's," "can't") prematurely closes the attribute at the browser's HTML parser level, truncating the JSON, so `JSON.parse(slide.dataset.config)` throws and the slide silently renders blank. **Fix applied:** every apostrophe inside a `data-config` JSON value is HTML-entity-encoded as `&#39;` (the browser decodes it back to `'` when populating `.dataset`, so the JS-side JSON is unaffected). **If you regenerate or hand-edit any session file, you must apply this same encoding to any apostrophe inside a `data-config` attribute, or write new content through a code path that does this automatically.** Consider this the single highest-value structural fix you could make if you ever touch the build pipeline: e.g. switching to `<script type="application/json">` blocks per slide instead of attributes would eliminate this entire class of bug.
2. **CSS Grid stretch bug:** `.chapter-grid` must keep `align-items: start` — without it, expanding one chapter card's `weeks-panel` stretches its sibling card in the same grid row, leaving visible blank space in the sibling.
3. **Chapter/week boundary mismatch:** session `ch02_w08_s01-02` ("2.6 Orbitals, Quantum Numbers, Shapes") was originally misfiled under Chapter 3 (it's the tail end of Chapter 2's atomic-structure content). It now correctly lives under `chapters/ch02/week08/` and is `SCHEDULE.json`'s last Chapter 2 entry; Chapter 3 now starts cleanly with "3.1-3.2 Genesis of Periodic Classification." Watch for similar mid-week chapter transitions elsewhere in the syllabus if you touch chapter ordering.
4. **Hardcoded chrome colors:** `.slide-header`/`.slide-nav` backgrounds and the dashboard header background were originally hardcoded `rgba(13,27,42,...)` (dark navy) and did not re-theme in light mode. Fixed to use `var(--color-overlay)` / `var(--color-card)`. Audit any new CSS you write the same way — search for raw hex/rgba before committing.
5. **Today-badge/topic spacing:** the `.topic` and `.today-badge` spans had no margin between them in the generated HTML, visually running together. Fixed with `margin-left` on the badge.

---

## 8. What's already done (state at handoff)

- All 88 sessions across all 10 chapters are **fully built** (no `<!-- CONTENT PENDING -->` placeholders remain).
- Full design system + light/dark theme toggle, working site-wide.
- ~80-icon animated SVG library, concept-matched per chapter and per session via keyword detection.
- All known structural bugs in §7 are fixed and verified (zero broken `data-config` attributes, confirmed by a brace/quote-balance audit script).
- Pushed to `main` on GitHub, live on GitHub Pages.

## 9. Suggested next steps (not yet done — your call on priority/approach)

- **Verify `SCHEDULE.json` dates** against the teacher's actual final calendar (the programmatic date-walk is a best-effort reconstruction, not hand-verified against the original micro-schedule line by line).
- **Cross-device/cloud progress sync** — currently localStorage-only, tied to one browser on one machine. If the teacher ever switches laptops, all progress/notes are lost. Worth a backend or even just an export/import-JSON button as a stopgap.
- **Authoring tooling** — right now every new session is hand-written HTML with inline JSON configs (fragile, as §7.1 shows). A small content-authoring layer (even a simple Python/Node script that takes structured YAML/JSON per session and emits the HTML with correct encoding) would remove an entire class of future bugs and dramatically speed up content edits.
- **Automated tests** — there are currently zero automated checks. At minimum, a script that (a) validates every `data-config` is parseable JSON after entity-decoding, (b) confirms every `SCHEDULE.json` `file` path exists, and (c) confirms every session file's internal `SESSION_ID`/`crumb`/`ChemProgress.setLastOpened` args match its `SCHEDULE.json` entry, would catch regressions immediately. This logic already exists ad hoc as throwaway Python scripts during development — formalize it.
- **Accessibility pass** — keyboard navigation exists (arrow keys, F for fullscreen) but no formal a11y audit (ARIA labels, focus management, screen-reader testing) has been done.
- **Print/PDF export** — `session.css` has a barebones `@media print` block; could be expanded into a proper "export session as handout PDF" feature for students.

---

## 10. How to work with the user

The user is a non-developer setting this up for a teacher; expect plain-English requests describing what they see in screenshots, not technical bug reports. Confirm understanding of *what's visually wrong* before diving into code, but you have full latitude on *how* to fix it — they have explicitly said you are not bound to the current static-HTML-only architecture if a better approach serves the project. They will upload the original planning documents (DOC1_PRD, DOC2_IA, DOC3_ContentSpec, DOC4_ComponentLibrary, DOC5_ProgressState, DOC6_GitHubStructure, DOC7_UpdateProtocol) — read all of them before making structural changes, since they contain the original intent behind decisions you'll find encoded in this codebase (e.g. why localStorage, why no frameworks, why this exact component list).
