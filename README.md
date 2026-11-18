# Kim Q. Tran — personal academic website

Live at **https://kim-q-tran.github.io/**

A static, dependency-free site for GitHub Pages. It also works **offline**:
double-click `index.html` and it opens straight from disk (no server, no CDN, no
web fonts).

```
index.html                  home page: about, keywords, news, publications, code,
                            experience, education, recognition, references
research/<slug>.html        one page per research topic (explanation + interactive visualization)
pub/<id>.html               one page per paper (highlights, figures, citation, open discussion)
data/publications.js        <- the publication list (edit this to add papers)
data/topics.js              <- research topics / keywords and their page text
data/site.js                settings, Google Scholar numbers, discussion settings
assets/css/style.css        all styling (light + dark theme)
assets/js/common.js         shared helpers (icons, theme, BibTeX, formatting)
assets/js/main.js           home page: charts, filters, "show more"
assets/js/paper.js          paper pages
assets/js/topic.js, viz.js  research-topic pages and their visualizations
assets/img/papers/          figures and thumbnails for papers
papers/                     <- accepted manuscripts (PDF), one per paper
tools/build-pages.ps1       creates pub/*.html and research/*.html from the data files
```

## Everyday edits

**Add an accepted-manuscript PDF to a paper**

1. Copy the PDF to `papers/<id>.pdf`. The `<id>` is the paper's `id` in
   `data/publications.js`, for example `papers/ijms2024-rottpms.pdf`.
2. In `data/publications.js`, set `pdf: "papers/ijms2024-rottpms.pdf"` on that entry.

The "Manuscript coming soon" slot becomes a real button, and the paper moves to
"Accepted manuscript here" in the Full text chart. Hover over a slot to see the
exact file name it expects.

**Add demonstration figures to a paper page**

1. Save the images in `assets/img/papers/<id>/` (for example `fig1.jpg`).
2. On that entry, list them:
   `figures: [{ src: "assets/img/papers/<id>/fig1.jpg", caption: "What the figure shows" }]`

**Add a newly accepted paper**

1. Copy an entry in `data/publications.js`, give it a new unique `id`, and set
   `status: "accepted"`. It appears under *Accepted / in press* on the home page.
2. Create its page once:
   ```
   powershell -ExecutionPolicy Bypass -File tools\build-pages.ps1
   ```
3. When it is published, set `status: "published"` and fill in `doi`, `volume`, `pages`.

**Other fields worth keeping current**

- `quartile`: JCR best quartile (`"Q1"`–`"Q4"`, or `""` if the journal is not in JCR).
  These feed the "By venue" chart. Check them against your JCR access each June.
- `rank`: CORE rank for conference papers (`"A*"`, `"A"`, …).
- `corresponding`: names of the corresponding authors (shown with ✉).
- `topics`: keywords from `data/topics.js`; the first one is the paper's primary keyword.
- `citations` per paper and `scholar` totals in `data/site.js`.

**News, experience, education, references**: edit `index.html` directly.

## Open discussion on paper pages

Each paper page links to GitHub Discussions on this repository ("Start a
discussion", "See existing threads"). To show comments **inside** the page:

1. Install the giscus app on this repository: https://github.com/apps/giscus
2. In `data/site.js` set `giscus.enabled: true` (the ids are already filled in).

## Sharing accepted manuscripts

Most publishers (Elsevier, Springer, World Scientific) let authors post the
**accepted manuscript** (not the publisher's typeset PDF) on a personal
website, usually with a link to the DOI. Check each journal's sharing policy
before uploading.

## Preview locally

Double-click `index.html`, or serve the folder with any static server.
Without JavaScript the paper and topic pages show only their title and summary.
