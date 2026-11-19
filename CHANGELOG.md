# Changelog

## 1.2.2 — 19 Nov 2026
- Installs from its web address (GitHub Pages) as an app that works offline; updates are offered with a "Restart now" bar.
- A tutorial map opens the first time; File › Tutorial and Help open it again.
- A map served from the web address (the tutorial) is treated as a starting copy: the first Ctrl+S asks where to save it, and it gets its own map id.
- Diagnostics shows where the app runs (installed window, browser tab or file on disk) and the version of the offline copy.
- Fix: the central topic's note, tags, DOI and abstract were lost when a map was reopened.

## 1.2.1 — 18 Nov 2026
- MindManager (`.mmap`), OPML and FreeMind import repairs what Chrome's strict XML parser rejects: forbidden characters, HTML entities, stray `&`, UTF-16 and other encodings, broken or truncated tags. An import report lists every repair.

## 1.2.0 — 18 Nov 2026
- Replace the central topic with one of its main topics (Delete on the central topic, or right-click › Make it the central topic).
- Shift+Delete removes a single topic and moves its subtopics up.
- Branch colours per main topic, per topic, or per subtopic.
- Import replaces an empty central topic automatically when it has a single main topic.

## 1.1.0 — 18 Nov 2026
- Per-branch depth (+ / −, the +/− circle, "Show below this topic"); print level "As on screen".
- Pane buttons and full-window map.
- Papers filed in several places (2×, ◆N), orphan references (∅).
- Reference lists in six styles; copy, Word, HTML, text. Volume, issue and pages fields.

## 1.0 — 17 Nov 2026
- First version: maps as self-contained HTML files, Crossref lookup, `.mmap` import, printing (map, outline, atlas, poster).
