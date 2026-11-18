/* Home page: metrics, keyword cards, publication overview charts,
 * publication list (5 at a time) and "show more" toggles. */
(function () {
  "use strict";
  var K = window.KQT;
  if (!K) return;
  var SITE = K.SITE, PUBS = K.PUBS.slice(), TOPICS = K.TOPICS, esc = K.esc, icon = K.icon;
  var PER_PAGE = SITE.papersPerPage || 5;

  /* ---------------- metrics ---------------- */
  var sc = SITE.scholar;
  if (sc) {
    var journalCount = PUBS.filter(function (p) { return p.type === "journal" && p.status === "published"; }).length;
    var values = { citations: sc.citations, hIndex: sc.hIndex, i10Index: sc.i10Index, papers: journalCount, asOf: sc.asOf };
    document.querySelectorAll("[data-metric]").forEach(function (el) {
      var k = el.getAttribute("data-metric");
      if (values[k] != null) el.textContent = values[k];
    });
    var bars = document.getElementById("cites-bars");
    if (bars && sc.perYear && sc.perYear.length) {
      var max = Math.max.apply(null, sc.perYear.map(function (d) { return d.count; })) || 1;
      var last = sc.perYear.length - 1;
      bars.setAttribute("aria-label", "Citations per year: " + sc.perYear.map(function (d) { return d.year + ": " + d.count; }).join(", "));
      bars.innerHTML = sc.perYear.map(function (d, i) {
        var h = Math.max(2, Math.round((d.count / max) * 52));
        return '<button type="button" class="bar-col' + (i === last ? " is-labelled" : "") + '" aria-label="' + d.year + ": " + d.count + ' citations">' +
          '<span class="bar-val">' + d.count + "</span>" +
          '<span class="bar" style="height:' + h + 'px"></span>' +
          '<span class="bar-year">' + d.year + "</span></button>";
      }).join("");
    }
  }

  /* ---------------- keyword cards ---------------- */
  function relatedCount(slug) { return PUBS.filter(function (p) { return (p.topics || []).indexOf(slug) !== -1; }).length; }
  var grid = document.getElementById("topic-grid");
  if (grid) {
    grid.innerHTML = TOPICS.map(function (t, i) {
      var n = relatedCount(t.slug);
      return '<a class="topic-card" style="--tc: var(--t' + (i + 1) + ')" href="' + K.topicUrl(t.slug) + '">' +
        '<span class="topic-card-top"><span class="dot"></span><span class="topic-count">' + n + " paper" + (n === 1 ? "" : "s") + "</span></span>" +
        '<span class="topic-name">' + esc(t.name) + "</span>" +
        '<span class="topic-short">' + esc(t.short) + "</span>" +
        '<span class="topic-go">Visualization &amp; explanation ' + icon("right") + "</span></a>";
    }).join("");
  }
  var cloud = document.getElementById("kw-cloud");
  if (cloud) {
    var terms = [];
    TOPICS.forEach(function (t) { (t.terms || []).forEach(function (w) { if (terms.indexOf(w) === -1) terms.push(w); }); });
    cloud.innerHTML = terms.map(function (w) {
      return '<li><a href="#publications" class="js-kw" data-q="' + esc(w) + '">' + icon("tag") + esc(w) + "</a></li>";
    }).join("");
  }

  /* ---------------- overview donuts ---------------- */
  function donut(el, title, segments, centerValue, centerLabel) {
    if (!el) return;
    var total = segments.reduce(function (s, d) { return s + d.count; }, 0) || 1;
    // whole-number percentages that add up to exactly 100 (largest remainder)
    var raw = segments.map(function (d) { return d.count / total * 100; });
    var pcts = raw.map(Math.floor);
    var left = 100 - pcts.reduce(function (a, b) { return a + b; }, 0);
    raw.map(function (r, i) { return [r - Math.floor(r), i]; }).sort(function (a, b) { return b[0] - a[0]; })
      .slice(0, segments.some(function (d) { return d.count; }) ? left : 0).forEach(function (x) { pcts[x[1]]++; });
    segments.forEach(function (d, i) { d.pct = pcts[i]; });
    var R = 54, C = 2 * Math.PI * R, GAP = 2.5;
    var nonzero = segments.filter(function (d) { return d.count > 0; });
    var offset = 0;
    var arcs = nonzero.map(function (d) {
      var len = (d.count / total) * C;
      var dash = Math.max(len - (nonzero.length > 1 ? GAP : 0), 0.5);
      var s = '<circle class="arc" data-key="' + esc(d.key) + '" r="' + R + '" cx="70" cy="70" fill="none" ' +
        'style="stroke: ' + d.color + '" stroke-width="20" stroke-dasharray="' + dash.toFixed(2) + " " + (C - dash).toFixed(2) + '" ' +
        'stroke-dashoffset="' + (-offset).toFixed(2) + '" transform="rotate(-90 70 70)" tabindex="0" role="img" ' +
        'aria-label="' + esc(d.label) + ": " + d.count + " (" + d.pct + '%)"><title>' +
        esc(d.label) + ": " + d.count + " (" + d.pct + "%)</title></circle>";
      offset += len;
      return s;
    }).join("");
    var legend = segments.map(function (d) {
      var pct = d.pct;
      return '<li data-key="' + esc(d.key) + '" class="' + (d.count ? "" : "is-zero") + '">' +
        '<span class="swatch" style="background:' + d.color + '"></span>' +
        '<span class="lg-label">' + esc(d.label) + "</span>" +
        '<span class="lg-val">' + d.count + ' <span class="muted">· ' + pct + "%</span></span></li>";
    }).join("");
    el.innerHTML = '<figcaption class="donut-title">' + esc(title) + "</figcaption>" +
      '<div class="donut-body"><svg class="donut" viewBox="0 0 140 140" aria-hidden="false">' +
      '<circle r="' + R + '" cx="70" cy="70" fill="none" class="donut-track" stroke-width="20"/>' + arcs +
      '<text x="70" y="68" text-anchor="middle" class="donut-num">' + esc(centerValue) + "</text>" +
      '<text x="70" y="86" text-anchor="middle" class="donut-sub">' + esc(centerLabel) + "</text></svg>" +
      '<ul class="legend">' + legend + "</ul></div>";
    // hover/focus linking between arcs and legend rows
    function setActive(key) {
      el.querySelectorAll("[data-key]").forEach(function (n) { n.classList.toggle("is-dim", !!key && n.getAttribute("data-key") !== key); });
    }
    el.addEventListener("mouseover", function (e) { var n = e.target.closest("[data-key]"); setActive(n ? n.getAttribute("data-key") : null); });
    el.addEventListener("mouseleave", function () { setActive(null); });
    el.addEventListener("focusin", function (e) { var n = e.target.closest("[data-key]"); setActive(n ? n.getAttribute("data-key") : null); });
    el.addEventListener("focusout", function () { setActive(null); });
  }

  var published = PUBS.filter(function (p) { return p.status === "published" || !p.status; });
  function countBy(fn, key) { return published.filter(function (p) { return fn(p) === key; }).length; }

  donut(document.getElementById("donut-type"), "By venue",
    [
      { key: "q1", label: "ISI Q1 journals", color: "var(--c-q1)", count: countBy(K.pubCategory, "q1") },
      { key: "q2", label: "ISI Q2 journals", color: "var(--c-q2)", count: countBy(K.pubCategory, "q2") },
      { key: "q34", label: "ISI Q3–Q4 journals", color: "var(--c-q34)", count: countBy(K.pubCategory, "q34") },
      { key: "otherJ", label: "Other journals", color: "var(--c-otherj)", count: countBy(K.pubCategory, "otherJ") },
      { key: "confA", label: "Conferences (A/A*)", color: "var(--c-confa)", count: countBy(K.pubCategory, "confA") },
      { key: "confOther", label: "Other conferences", color: "var(--c-confo)", count: countBy(K.pubCategory, "confOther") },
      { key: "book", label: "Books & chapters", color: "var(--c-book)", count: countBy(K.pubCategory, "book") }
    ], published.length, "outputs");

  donut(document.getElementById("donut-fulltext"), "Full text",
    [
      { key: "oa", label: "Open access", color: "var(--c-oa)", count: countBy(K.fullText, "oa") },
      { key: "accepted", label: "Accepted manuscript here", color: "var(--c-acc)", count: countBy(K.fullText, "accepted") },
      { key: "none", label: "Publisher only (for now)", color: "var(--c-none)", count: countBy(K.fullText, "none") }
    ], (countBy(K.fullText, "oa") + countBy(K.fullText, "accepted")), "free to read");

  donut(document.getElementById("donut-topic"), "By primary keyword",
    TOPICS.map(function (t, i) {
      return { key: t.slug, label: t.name, color: "var(--t" + (i + 1) + ")",
        count: published.filter(function (p) { return (p.topics || [])[0] === t.slug; }).length };
    }), TOPICS.length, "keywords");

  /* ---------------- publication cards ---------------- */
  function thumbHTML(p) {
    var href = K.pubUrl(p);
    if (p.image) {
      return '<a class="pub-thumb has-image" href="' + href + '" tabindex="-1"><img src="' + esc(K.asset(p.image)) + '" alt="" loading="lazy"></a>';
    }
    var t = K.topic((p.topics || [])[0]);
    var idx = K.topicIndex((p.topics || [])[0]) + 1;
    return '<a class="pub-thumb" href="' + href + '" tabindex="-1" aria-hidden="true" style="--tile: var(--tile' + idx + ')">' +
      '<span><span class="thumb-venue">' + esc(p.venueShort || "") + '</span><span class="thumb-year">' + esc(p.year) + "</span></span>" +
      '<span class="thumb-area">' + esc(t ? t.name : "") + "</span></a>";
  }
  function badgesHTML(p) {
    var b = [];
    if (p.status && p.status !== "published") {
      var label = { accepted: "Accepted", "in-review": "Under review", preprint: "Preprint" }[p.status] || p.status;
      b.push('<span class="badge badge-status">' + esc(label) + "</span>");
    }
    b.push(K.quartileBadge(p));
    if (p.type === "conference") b.push('<span class="badge">Conference</span>');
    if (K.isFirst(p)) b.push('<span class="badge badge-accent">First author</span>');
    if (K.selfCorresponding(p)) b.push('<span class="badge badge-accent">Corresponding author</span>');
    if (p.selected) b.push('<span class="badge badge-accent">' + icon("star") + "Selected</span>");
    if (K.fullText(p) !== "none") b.push('<span class="badge badge-oa">' + icon("unlock") + "Free to read</span>");
    if (p.citations > 0 && p.status === "published") b.push('<span class="cites">Cited by <strong>' + p.citations + "</strong></span>");
    return b.join("");
  }
  function actionsHTML(p) {
    var L = p.links || {};
    var a = [];
    function link(href, ic, text, cls) {
      return '<a class="btn' + (cls ? " " + cls : "") + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + icon(ic) + text + "</a>";
    }
    a.push('<a class="btn btn-primary" href="' + K.pubUrl(p) + '">' + icon("right") + "Details &amp; figures</a>");
    if (p.doi) a.push(link("https://doi.org/" + p.doi, "link", "DOI"));
    if (p.pdf) {
      a.push(link(K.asset(p.pdf), "file", "Accepted manuscript"));
    } else if (SITE.showPlaceholders) {
      var hint = "Owner: add papers/" + p.id + ".pdf and set pdf: \"papers/" + p.id + ".pdf\" in data/publications.js";
      a.push('<span class="slot" title="' + esc(hint) + '">' + icon("upload") + "Manuscript coming soon</span>");
    }
    if (L.oa) a.push(link(L.oa, "unlock", "Free full text"));
    if (L.code) a.push(link(L.code, "github", "Code"));
    if (L.data) a.push(link(L.data, "data", "Data"));
    a.push('<button class="btn js-cite" type="button" aria-expanded="false" aria-controls="bib-' + esc(p.id) + '">' + icon("quote") + "Cite</button>");
    return a.join("");
  }
  function cardHTML(p) {
    return '<article class="pub' + (p.selected ? " is-selected" : "") + '" id="pub-' + esc(p.id) + '">' +
      thumbHTML(p) +
      '<div class="pub-body">' +
        '<div class="pub-top">' + badgesHTML(p) + "</div>" +
        '<h3 class="pub-title"><a href="' + K.pubUrl(p) + '">' + esc(p.title) + "</a></h3>" +
        '<p class="pub-authors">' + K.authorsHTML(p) + "</p>" +
        '<p class="pub-venue">' + K.venueHTML(p) + "</p>" +
        (p.summary ? '<p class="pub-summary">' + esc(p.summary) + "</p>" : "") +
        '<div class="pub-topics">' + K.topicChips(p) + "</div>" +
        '<div class="pub-actions">' + actionsHTML(p) + "</div>" +
        '<div class="bibtex" id="bib-' + esc(p.id) + '" hidden>' +
          '<pre tabindex="0">' + esc(K.bibtex(p)) + "</pre>" +
          '<button class="btn copy js-copy" type="button">' + icon("copy") + '<span class="lbl">Copy</span></button>' +
        "</div>" +
      "</div></article>";
  }
  function acceptedPlaceholder() {
    return '<div class="pub-placeholder">' + icon("plus") +
      "<div><strong>Newly accepted papers will appear here.</strong><br>" +
      '<span class="muted">Articles in press are listed with a link to the accepted manuscript once it is available.</span></div></div>';
  }

  /* ---------------- filtering, paging, rendering ---------------- */
  var listEl = document.getElementById("pub-list");
  var pagerEl = document.getElementById("pub-pager");
  var searchEl = document.getElementById("pub-search");
  var sortEl = document.getElementById("pub-sort");
  var filterBtns = document.querySelectorAll("#pub-filters .chip");
  var state = { filter: "all", q: "", sort: "year", shown: PER_PAGE };

  var FILTERS = {
    all: function () { return true; },
    selected: function (p) { return !!p.selected; },
    first: K.isFirst,
    journal: function (p) { return p.type === "journal"; },
    conference: function (p) { return p.type === "conference"; }
  };
  PUBS.forEach(function (p) {
    var topicNames = (p.topics || []).map(function (s) { var t = K.topic(s); return t ? t.name : ""; });
    p._hay = K.ascii([p.title, p.authors.join(" "), p.venue, p.venueShort, p.year, (p.tags || []).join(" "),
      topicNames.join(" "), p.summary, (p.highlights || []).join(" ")].join(" ").toLowerCase());
  });
  function sortPubs(arr) {
    return arr.slice().sort(function (a, b) {
      if (state.sort === "cites") return (b.citations || 0) - (a.citations || 0) || b.year - a.year;
      return b.year - a.year || String(b.online || "").localeCompare(String(a.online || "")) || (b.citations || 0) - (a.citations || 0);
    });
  }

  function render() {
    if (!listEl) return;
    var q = K.ascii(state.q.trim().toLowerCase());
    var terms = q ? q.split(/\s+/) : [];
    var items = sortPubs(PUBS.filter(FILTERS[state.filter]).filter(function (p) {
      return terms.every(function (t) { return p._hay.indexOf(t) !== -1; });
    }));
    var pending = items.filter(function (p) { return p.status && p.status !== "published"; });
    var done = items.filter(function (p) { return !p.status || p.status === "published"; });
    var visible = done.slice(0, state.shown);

    var html = "";
    if (pending.length || (SITE.showPlaceholders && state.filter === "all" && !q)) {
      html += '<h3 class="pub-group-title">Accepted / in press <span class="muted">' + pending.length + "</span></h3>";
      html += pending.length ? pending.map(cardHTML).join("") : acceptedPlaceholder();
    }
    if (!done.length && !pending.length) {
      html += '<div class="pub-empty">No publications match “' + esc(state.q) + '”.</div>';
    } else if (state.sort === "year") {
      var lastYear = null;
      visible.forEach(function (p) {
        if (p.year !== lastYear) {
          var n = done.filter(function (x) { return x.year === p.year; }).length;
          html += '<h3 class="pub-group-title">' + p.year + ' <span class="muted">' + n + "</span></h3>";
          lastYear = p.year;
        }
        html += cardHTML(p);
      });
    } else {
      html += visible.map(cardHTML).join("");
    }
    listEl.innerHTML = html;

    if (pagerEl) {
      var remaining = done.length - visible.length;
      pagerEl.innerHTML = '<span class="muted small">Showing ' + visible.length + " of " + done.length + "</span>" +
        (remaining > 0
          ? '<button class="btn btn-primary js-page-more" type="button">' + icon("chevron") + "Show " + Math.min(PER_PAGE, remaining) + " more</button>" +
            '<button class="btn js-page-all" type="button">Show all ' + done.length + "</button>"
          : (done.length > PER_PAGE ? '<button class="btn js-page-less" type="button">Show fewer</button>' : ""));
    }
  }
  function resetPaging() { state.shown = PER_PAGE; }

  function updateCounts() {
    filterBtns.forEach(function (b) {
      var c = PUBS.filter(FILTERS[b.getAttribute("data-filter")]).length;
      var span = b.querySelector(".count");
      if (span) span.textContent = c;
    });
  }
  function setFilter(f) {
    state.filter = f;
    filterBtns.forEach(function (x) {
      var on = x.getAttribute("data-filter") === f;
      x.classList.toggle("is-active", on);
      x.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  filterBtns.forEach(function (b) {
    b.addEventListener("click", function () { setFilter(b.getAttribute("data-filter")); resetPaging(); render(); });
  });
  if (searchEl) searchEl.addEventListener("input", function () { state.q = searchEl.value; resetPaging(); render(); });
  if (sortEl) sortEl.addEventListener("change", function () { state.sort = sortEl.value; resetPaging(); render(); });

  if (pagerEl) pagerEl.addEventListener("click", function (e) {
    if (e.target.closest(".js-page-more")) { state.shown += PER_PAGE; render(); }
    else if (e.target.closest(".js-page-all")) { state.shown = Infinity; render(); }
    else if (e.target.closest(".js-page-less")) {
      state.shown = PER_PAGE; render();
      document.getElementById("publications").scrollIntoView({ behavior: "smooth" });
    }
  });

  if (listEl) listEl.addEventListener("click", function (e) {
    var cite = e.target.closest(".js-cite");
    if (!cite) return;
    var box = document.getElementById(cite.getAttribute("aria-controls"));
    var open = cite.getAttribute("aria-expanded") === "true";
    cite.setAttribute("aria-expanded", open ? "false" : "true");
    if (box) box.hidden = open;
  });

  // keyword cloud -> search the publication list
  document.addEventListener("click", function (e) {
    var kw = e.target.closest && e.target.closest(".js-kw");
    if (!kw) return;
    e.preventDefault();
    var q = kw.getAttribute("data-q");
    setFilter("all");
    state.q = q; state.shown = PER_PAGE;
    if (searchEl) searchEl.value = q;
    render();
    document.getElementById("publications").scrollIntoView({ behavior: "smooth" });
  });

  setFilter("all");
  updateCounts();
  render();

  /* ---------------- generic "show more" toggles ---------------- */
  document.querySelectorAll(".js-more").forEach(function (btn) {
    var target = document.getElementById(btn.getAttribute("aria-controls"));
    var label = btn.querySelector(".lbl");
    var closedText = label ? label.textContent : "";
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      if (target) target.classList.toggle("is-collapsed", open);
      if (label) label.textContent = open ? closedText : "Show fewer";
    });
  });

  /* ---------------- nav highlight ---------------- */
  var navLinks = document.querySelectorAll(".nav a");
  if ("IntersectionObserver" in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && byId[en.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove("is-current"); });
          byId[en.target.id].classList.add("is-current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main .section[id]").forEach(function (s) { io.observe(s); });
  }
})();
