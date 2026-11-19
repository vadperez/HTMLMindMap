# HTML Mind Map

A mind-map and reference-map editor that runs in Chrome and keeps every map as **one plain, self-contained HTML file on your own disk**. Install it once from this site and it works like a desktop app: own window, Start-menu entry, works offline.

**Open the app:** `https://<your-user>.github.io/HTMLMindMap/`

The first time it opens, it shows a **tutorial map** that walks through every feature. Open it again any time with **File › Tutorial**, from the taskbar icon's right-click menu (*Tutorial*), or at `…/HTMLMindMap/tutorial.html`.

---

## What it does

**Maps**
- Outline, map and details panes; each can be shown or hidden, and the map can take the whole window.
- Show the whole map to *N* levels (Alt+1 … Alt+6, Alt+0), or open single branches deeper with **+ / −**.
- Enter adds a topic, Tab adds a subtopic; drag, Ctrl+M or Ctrl+↑/↓ moves; Ctrl+Z / Ctrl+Y undo and redo.
- The **Shelf** parks branches (Ctrl+D) while you reorganize; Attach puts them back anywhere.
- Delete a branch, or remove only one topic with **Shift+Delete** (its subtopics move up).
- Replace the central topic with one of its main topics; branch colours per main topic, per topic or per subtopic.
- Notes, tags, links; search across titles, DOIs, authors and abstracts (Ctrl+F).
- Stays fast with thousands of topics.

**Papers and references**
- One *reference topic* per paper: title, link, DOI, authors, year, journal, volume, issue, pages, abstract.
- **Crossref lookup by DOI** fills in the bibliographic data.
- Papers filed under several topics are flagged (**2×**) and can be highlighted everywhere at once; references not filed under a topic are marked **∅**.
- Reference lists in APA 7, Vancouver, Harvard, Chicago author-date, Nature or Simple — copy, or save as Word (.docx), HTML or text. RIS and BibTeX export.

**Printing** (Letter by default, with preview)
- *Map*, *Outline*, *Atlas*, and *Poster* — a large map tiled over Letter sheets with 0.5 in glue strips and a guide sheet.
- Any number of levels, or exactly what is open on screen.

**Import / export**
- Opens MindMap `.html` maps; imports MindManager (`.mmap`), OPML, FreeMind, Markdown, indented text and JSON. Damaged or non-standard files are repaired where possible; an import report lists what was fixed.
- Exports OPML, Markdown, RIS, BibTeX, JSON.

**Housekeeping**
- *Diagnostics* (pulse button): map health, speed, the file being saved into, autosave copies, Crossref cache, storage used, the offline copy's version, browser features, stress test, copyable report.
- *Settings* (gear): e-mail for faster Crossref lookups (optional), font, label width.

## How a map moves through the app

```
 your disk                          the app (Chrome window)                          your disk / clipboard
 ─────────                          ───────────────────────                          ─────────────────────
 Map.html  ──Ctrl+O / drop──► open ─┐
 .mmap / OPML / FreeMind / .md ─────┴─► import ─► edit ─► autosave copies (in Chrome) ─► Ctrl+S ─► Map.html (same file)
                                                    │                                    ├─► reference list: .docx / .html / .txt / clipboard
                                                    └─► Crossref (DOI only, direct)      ├─► OPML / Markdown / RIS / BibTeX / JSON
                                                                                         └─► print / PDF (Map, Outline, Atlas, Poster)
```

- **Ctrl+S** writes the map back into the file it came from. The first save of a new map (or of the tutorial) asks where to put it; after that Chrome remembers the file (Chrome 122 and newer remember it between sessions too).
- A saved map contains the editor as well, so it also opens on its own by double-clicking it — offline, without installing anything.
- **File › Recent** reopens maps you opened or saved in the app.

## Install

1. Open the app address in **Chrome 110 or newer** (Windows 10 or 11, Intel or ARM).
2. Click the *Install* icon at the right of the address bar (or **⋮ › Cast, save and share › Install page as app**).
3. MindMap starts from the Start menu or taskbar in its own window, also without internet. Right-click its taskbar icon for *New map* and *Tutorial*.

Other browsers can show maps but cannot save into the same file (they lack the File System Access API); the app says so on start and saves by downloading instead.

## Where your files are stored

**Nothing you create is uploaded — not to GitHub, not anywhere.** GitHub only serves the app's own code.

| What | Where exactly |
|---|---|
| **Your maps** | `.html` files in the folder **you** choose when you first save (e.g. `Documents\Maps\TOFD.html`). Copy, back up or e-mail them like any document. |
| Autosave copies (last 5 per map), recent-files list with file permissions, Crossref answers (kept 180 days) | Chrome's IndexedDB database `mindmap-app` for the site: `%LOCALAPPDATA%\Google\Chrome\User Data\Default\IndexedDB\https_<your-user>.github.io_0.indexeddb.leveldb` (and `…_0.indexeddb.blob`) |
| Offline copy of the app (≈ 1 MB) | `%LOCALAPPDATA%\Google\Chrome\User Data\Default\Service Worker\CacheStorage\` (one sub-folder per site, named by a hash) |
| Window layout and settings (`mindmap-prefs-v1`), stress-test results (`mindmap-stress`), "tutorial shown" flag (`htmlmindmap.firstRun`) | Chrome's Local Storage: `%LOCALAPPDATA%\Google\Chrome\User Data\Default\Local Storage\leveldb\` (one database for all sites) |
| Installed-app shortcut | `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Chrome Apps\HTML Mind Map.lnk` |

Notes
- `Default` is your Chrome profile folder. If you use several Chrome profiles it may be `Profile 1`, `Profile 2`, …: open `chrome://version` and read **Profile Path**.
- The files in those Chrome folders are databases, not maps; don't edit them by hand. To see the space used, restore an autosave or clear the Crossref cache, use the app's **Diagnostics** dialog.
- **Delete everything the app keeps in Chrome:** open `chrome://settings/content/siteDetails?site=https://<your-user>.github.io` › *Delete data*. Your map files are not affected. ⚠ If you also host another site at `<your-user>.github.io`, it shares this storage, and its stored data is deleted too.
- Maps opened **from disk** (`file://`) keep their autosaves and Crossref cache in a separate place in Chrome, not visible to the installed app. The map files themselves open in both.
- Crossref lookups go **directly from your computer to `api.crossref.org`**; only the DOI (and your e-mail, if you entered one in Settings) is sent.

## Network traffic and the GitHub free tier

GitHub Pages sites have a soft limit of **100 GB of traffic per month**, a 1 GB site size limit and a soft limit of 10 deployments per hour. This app stays far below all three:

| Event | Downloaded from GitHub |
|---|---|
| First visit on a computer | ≈ 1 MB once (app + tutorial + icons) |
| Every later start (installed or in a tab) | at most `sw.js`, a few KB — the app itself comes from Chrome's offline copy |
| New release (after you push one) | ≈ 1 MB once per computer |
| Opening, editing, saving maps | **0** — files stay on your disk |
| Crossref lookups | **0** from GitHub (they go to Crossref) |

Example: 2 computers × 30 starts a day for a month ≈ 6 MB at most, well under 0.01 % of the monthly limit. Publishing uses GitHub Actions, which is free for public repositories and for GitHub Pages, so it uses none of your Actions minutes. The site is about 1 MB of the 1 GB limit.

The site is public: anyone who knows the address can open the app (they get their own empty copy; they never see your maps). There are no analytics or cookies; like any web host, GitHub receives the requests for the app files.

## Publishing this repository (one time)

GitHub Free publishes Pages only from **public** repositories.

1. On GitHub: **New repository** › name `HTMLMindMap` › **Public** › no README or licence (they are included here) › *Create*.
2. *uploading an existing file* › drag in everything from this folder (`README.md`, `CHANGELOG.md`, `.gitignore`, `.gitattributes`, `docs\`, `tools\`) › *Commit changes*.
   With Git instead: `git init`, `git add .`, `git commit -m "MindMap 1.2.2"`, `git branch -M main`, `git remote add origin https://github.com/<your-user>/HTMLMindMap.git`, `git push -u origin main`.
3. **Settings › Pages** › *Build and deployment* › Source **Deploy from a branch** › Branch **main**, folder **/docs** › *Save*.
4. After about a minute the address appears at the top of that page: `https://<your-user>.github.io/HTMLMindMap/`.

Only the `docs` folder is published; `tools` stays in the repository.

## Releasing a new version

1. New app: `python tools/pwa_pack.py MindMap.html` → writes `docs/index.html`. Also open `docs/tutorial.html` from disk in the new MindMap.html (Ctrl+O), save it back into `docs/tutorial.html`, and run `python tools/pwa_pack.py docs/tutorial.html --tutorial` — so the tutorial carries the new code too.
   Changing only the tutorial: open `docs/tutorial.html` from disk, edit, save, then run the `--tutorial` line.
2. Change `VERSION` in `docs/sw.js` (e.g. `1.2.3`).
3. Commit and push. GitHub's cache can take up to 10 minutes to serve the new files.
4. Each installed copy shows *"A new version of MindMap is ready … Restart now"* the next time it starts. Nothing changes under an open map until you click it; unsaved changes are still protected by the app's own warning.

## Repository layout

```
docs/                     ← published by GitHub Pages
  index.html              the app with an empty map (MindMap.html + PWA lines in <head>)
  tutorial.html           the tutorial map, a normal MindMap file (opens on first run)
  pwa.js                  first-run tutorial, offline copy registration, update message
  sw.js                   the offline copy; change VERSION to release
  manifest.webmanifest    name, icons and taskbar shortcuts for installing
  icons/                  app icons (SVG + PNG)
  OFL-PT-Sans.txt         licence of the embedded PT Sans font
  .nojekyll               publish the files as they are (no Jekyll build)
tools/pwa_pack.py         adds the PWA lines to a MindMap file (saved maps never carry them)
CHANGELOG.md
```

## Licence

© Vad. All rights reserved. The code is public so that GitHub Pages can serve it; no licence to reuse it is granted unless a `LICENSE` file is added.

The built-in font PT Sans © 2009 ParaType Ltd. is used under the SIL Open Font License 1.1 (`docs/OFL-PT-Sans.txt`).
