/* Renders one paper page: pub/<id>.html sets <body data-id="<id>">. */
(function () {
  "use strict";
  var K = window.KQT;
  var root = document.getElementById("paper");
  if (!K || !root) return;
  var SITE = K.SITE, esc = K.esc, icon = K.icon;
  var id = document.body.getAttribute("data-id");

  var ordered = K.PUBS.slice().sort(function (a, b) {
    return b.year - a.year || String(b.online || "").localeCompare(String(a.online || "")) || (b.citations || 0) - (a.citations || 0);
  });
  var idx = -1;
  for (var i = 0; i < ordered.length; i++) if (ordered[i].id === id) idx = i;
  var p = ordered[idx];
  if (!p) {
    root.innerHTML = '<h1 class="page-title">Paper not found</h1><p><a href="' + K.base + 'index.html#publications">Back to all publications</a></p>';
    return;
  }
  document.title = p.title + " · Kim Q. Tran";
  var L = p.links || {};

  function link(href, ic, text, cls) {
    return '<a class="btn' + (cls ? " " + cls : "") + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + icon(ic) + text + "</a>";
  }

  /* badges */
  var badges = [];
  if (p.status && p.status !== "published") {
    badges.push('<span class="badge badge-status">' + esc({ accepted: "Accepted", "in-review": "Under review", preprint: "Preprint" }[p.status] || p.status) + "</span>");
  }
  badges.push(K.quartileBadge(p));
  badges.push('<span class="badge">' + (p.type === "conference" ? "Conference paper" : "Journal article") + "</span>");
  if (K.isFirst(p)) badges.push('<span class="badge badge-accent">First author</span>');
  if (K.selfCorresponding(p)) badges.push('<span class="badge badge-accent">Corresponding author</span>');
  if (p.selected) badges.push('<span class="badge badge-accent">' + icon("star") + "Selected</span>");
  if (K.fullText(p) !== "none") badges.push('<span class="badge badge-oa">' + icon("unlock") + "Free to read</span>");

  /* side: resources */
  var res = [];
  if (p.doi) res.push(link("https://doi.org/" + p.doi, "link", "Publisher version (DOI)", "btn-primary"));
  if (p.pdf) res.push(link(K.asset(p.pdf), "file", "Accepted manuscript (PDF)"));
  else if (SITE.showPlaceholders) {
    res.push('<span class="slot" title="Owner: add papers/' + esc(p.id) + '.pdf and set pdf in data/publications.js">' + icon("upload") + "Accepted manuscript coming soon</span>");
  }
  if (L.oa) res.push(link(L.oa, "unlock", "Free full text"));
  if (L.arxiv && L.arxiv !== L.oa) res.push(link(L.arxiv, "file", "arXiv preprint"));
  if (L.code) res.push(link(L.code, "github", "Source code"));
  if (L.data) res.push(link(L.data, "data", "Dataset"));
  if (L.scholar && SITE.scholar) {
    res.push(link("https://scholar.google.com/citations?view_op=view_citation&hl=en&user=" + SITE.scholar.userId +
      "&citation_for_view=" + SITE.scholar.userId + ":" + L.scholar, "cap", "Google Scholar"));
  }

  /* side: facts */
  var facts = [];
  facts.push(["Published in", "<em>" + esc(p.venue) + "</em>"]);
  var vol = [p.volume ? "Vol. " + esc(p.volume) + (p.issue ? "(" + esc(p.issue) + ")" : "") : "", p.pages ? "Art./pp. " + esc(p.pages) : ""].filter(Boolean).join(" · ");
  if (vol) facts.push(["Volume", vol]);
  facts.push(["Year", esc(p.year) + (K.fmtMonth(p.online) ? ' <span class="muted">(online ' + K.fmtMonth(p.online) + ")</span>" : "")]);
  if (p.type === "journal") facts.push(["ISI quartile", p.quartile ? "JCR " + esc(p.quartile) : "Not indexed in JCR"]);
  if (p.corresponding && p.corresponding.length) facts.push(["Corresponding author" + (p.corresponding.length > 1 ? "s" : ""), esc(p.corresponding.join(", "))]);
  if (p.status === "published") facts.push(["Citations", (p.citations || 0) + ' <span class="muted">(Google Scholar, ' + esc(SITE.scholar ? SITE.scholar.asOf : "") + ")</span>"]);
  if (p.doi) facts.push(["DOI", '<a href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">' + esc(p.doi) + "</a>"]);

  /* figures */
  var figs = (p.figures || []).map(function (f, n) {
    return '<figure class="fig"><img src="' + esc(K.asset(f.src)) + '" alt="' + esc(f.alt || f.caption || ("Figure " + (n + 1))) + '" loading="lazy">' +
      (f.caption ? "<figcaption><strong>Figure " + (n + 1) + ".</strong> " + esc(f.caption) + "</figcaption>" : "") + "</figure>";
  });
  if (!figs.length && SITE.showPlaceholders) {
    figs = [1, 2].map(function (n) {
      return '<div class="fig-empty" title="Owner: put images in assets/img/papers/' + esc(p.id) + '/ and list them under figures in data/publications.js">' +
        "<div>" + icon("image") + "Figure " + n + "<br><span class=\"small\">Demonstration figure coming soon</span></div></div>";
    });
  }

  /* discussion */
  var repo = SITE.repo || "";
  var pageUrl = location.protocol.indexOf("http") === 0 ? location.href.split("#")[0] : "";
  var newUrl = "https://github.com/" + repo + "/discussions/new?category=general&title=" +
    encodeURIComponent("[" + (p.venueShort || "Paper") + " " + p.year + "] " + p.title) +
    "&body=" + encodeURIComponent("Discussion of: " + p.title + (p.doi ? "\nhttps://doi.org/" + p.doi : "") + (pageUrl ? "\n" + pageUrl : "") + "\n\n");
  var searchUrl = "https://github.com/" + repo + "/discussions?discussions_q=" + encodeURIComponent(p.venueShort + " " + p.year);
  var discussion =
    '<div class="discussion">' +
      "<p>Questions, ideas for follow-up work, or found something to fix? This space is open for discussion. " +
      "Threads live in GitHub Discussions, so you need a free GitHub account to post.</p>" +
      '<div class="btns">' +
        '<a class="btn btn-primary" href="' + esc(newUrl) + '" target="_blank" rel="noopener">' + icon("chat") + "Start a discussion</a>" +
        '<a class="btn" href="' + esc(searchUrl) + '" target="_blank" rel="noopener">' + icon("users") + "See existing threads</a>" +
        '<a class="btn" href="mailto:kim.tran@ugent.be?subject=' + encodeURIComponent("About: " + p.title) + '">' + icon("mail") + "Email the author</a>" +
      "</div>" +
      '<div class="giscus-frame-wrap"><div class="giscus"></div></div>' +
    "</div>";

  var prev = ordered[idx - 1], next = ordered[idx + 1];
  var prevnext = '<nav class="prevnext" aria-label="More papers">' +
    (prev ? '<a href="' + K.pubUrl(prev) + '"><span class="dir">' + icon("left") + "Newer</span>" + esc(prev.title) + "</a>" : "<span></span>") +
    (next ? '<a class="next" href="' + K.pubUrl(next) + '"><span class="dir">Older' + icon("right") + "</span>" + esc(next.title) + "</a>" : "<span></span>") +
    "</nav>";

  root.innerHTML =
    '<nav class="crumbs" aria-label="Breadcrumb"><a href="' + K.base + 'index.html">Home</a><span>/</span>' +
      '<a href="' + K.base + 'index.html#publications">Publications</a><span>/</span><span>' + esc(p.venueShort) + " " + esc(p.year) + "</span></nav>" +
    '<div class="pub-top">' + badges.join("") + "</div>" +
    '<h1 class="page-title">' + esc(p.title) + "</h1>" +
    '<p class="pub-authors">' + K.authorsHTML(p) + "</p>" +
    '<p class="pub-venue">' + K.venueHTML(p) + "</p>" +
    '<div class="page-grid">' +
      "<div>" +
        '<section class="block"><h2>' + icon("file") + "In short</h2><p>" + esc(p.summary || "") + "</p></section>" +
        ((p.highlights && p.highlights.length) ? '<section class="block"><h2>' + icon("star") + 'Highlights</h2><ul class="highlights">' +
          p.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul></section>" : "") +
        (figs.length ? '<section class="block"><h2>' + icon("image") + 'Demonstration figures</h2><div class="fig-grid">' + figs.join("") + "</div></section>" : "") +
        '<section class="block"><h2>' + icon("tag") + 'Keywords</h2><div class="topic-nav">' + K.topicChips(p) + "</div>" +
          ((p.tags && p.tags.length) ? '<div class="tags-plain">' + p.tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>" : "") + "</section>" +
        '<section class="block"><h2>' + icon("quote") + 'Cite this paper</h2><div class="bibtex"><pre tabindex="0">' + esc(K.bibtex(p)) + "</pre>" +
          '<button class="btn copy js-copy" type="button">' + icon("copy") + '<span class="lbl">Copy</span></button></div></section>' +
        '<section class="block" id="discussion"><h2>' + icon("chat") + "Open discussion</h2>" + discussion + "</section>" +
      "</div>" +
      '<aside class="page-side">' +
        '<div class="panel"><h3 class="panel-title">' + icon("link") + 'Resources</h3><div class="side-links">' + res.join("") + "</div></div>" +
        '<div class="panel"><h3 class="panel-title">' + icon("book") + 'Details</h3><dl class="meta-list">' +
          facts.map(function (f) { return "<div><dt>" + f[0] + "</dt><dd>" + f[1] + "</dd></div>"; }).join("") + "</dl></div>" +
      "</aside>" +
    "</div>" + prevnext;

  /* optional embedded comments via giscus (needs the giscus GitHub app) */
  var g = SITE.giscus || {};
  if (g.enabled && g.repoId && g.categoryId && location.protocol.indexOf("http") === 0) {
    var s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    s.async = true; s.crossOrigin = "anonymous";
    var attrs = {
      "data-repo": g.repo, "data-repo-id": g.repoId, "data-category": g.category, "data-category-id": g.categoryId,
      "data-mapping": "specific", "data-term": p.id, "data-strict": "1", "data-reactions-enabled": "1",
      "data-emit-metadata": "0", "data-input-position": "top", "data-lang": "en", "data-loading": "lazy",
      "data-theme": K.isDark() ? "dark" : "light"
    };
    for (var a in attrs) s.setAttribute(a, attrs[a]);
    root.querySelector(".giscus-frame-wrap").appendChild(s);
  }
})();
