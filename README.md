# Kim Q. Tran — personal academic website

A static, dependency-free homepage for GitHub Pages. It also works **offline**:
double-click `index.html` and it opens straight from disk (no server, no CDN, no
web fonts).

```
index.html                 page content (about, news, experience, education, service)
assets/css/style.css       all styling (light + dark theme)
assets/js/main.js          publication list, filters, search, BibTeX, theme toggle
assets/img/profile.jpg     portrait (from the CV)
assets/img/papers/         optional graphical abstracts, one per paper
data/publications.js       ← the publication list (edit this to add papers)
data/site.js               settings + Google Scholar numbers
papers/                    ← accepted manuscripts (PDF), one per paper
```

## Everyday edits

**Add an accepted-manuscript PDF to a paper**

1. Copy the PDF to `papers/<id>.pdf`. The `<id>` is the paper's `id` in
   `data/publications.js`, for example `papers/ijms2024-rottpms.pdf`.
2. In `data/publications.js`, set `pdf: "papers/ijms2024-rottpms.pdf"` on that entry.

The dashed "Accepted manuscript · add PDF" slot on the card becomes a real button.
(Hover over a slot in the browser to see the exact file name it expects.)

**Add a newly accepted paper**

Copy an entry in `data/publications.js`, give it a new unique `id`, and set
`status: "accepted"` (or `"in-review"` / `"preprint"`). It appears under
*Accepted / in press* at the top of the list. When it is published, change the
status to `"published"` and fill in `doi`, `volume`, `pages`.

**Add a graphical abstract**

Save an image as `assets/img/papers/<id>.jpg` (4:3 looks best) and set
`image: "assets/img/papers/<id>.jpg"`. Without an image the card shows a
coloured tile with the journal abbreviation.

**Update citation numbers**

Edit `scholar` in `data/site.js` (totals and per-year bars) and `citations` on
each paper in `data/publications.js`.

**News, experience, education**: edit `index.html` directly.

## Before making it public

1. In `data/site.js` set `showPlaceholders: false` so empty PDF slots and the
   accepted-papers placeholder are hidden from visitors.
2. In `index.html` delete the `<meta name="robots" content="noindex, nofollow">` line.
3. Fill in the venue of the conference paper "Elastoplastic bending behaviors of
   steel plates…" (`conf-elastoplastic`). Google Scholar has the wrong venue for it.
4. Make the GitHub repository public, then turn on Pages:
   **Settings → Pages → Build and deployment → Deploy from a branch → `main` / root**.
   The site is then live at `https://kim-q-tran.github.io/`.

Note: GitHub Pages only serves private repositories on paid plans, and even then
the published site is public. Keep the repository private (with Pages off) until
you are happy with the content.

## Sharing accepted manuscripts

Most publishers (Elsevier, Springer, World Scientific) let authors post the
**accepted manuscript** (not the publisher's typeset PDF) on a personal
website, usually with a link to the DOI. Check each journal's sharing policy
before uploading.

## Preview locally

Double-click `index.html`, or serve the folder with any static server.
