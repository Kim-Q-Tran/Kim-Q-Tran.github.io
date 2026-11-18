/* Kim Q. Tran — homepage behaviour. No dependencies; runs from file:// too. */
(function () {
  "use strict";

  var SITE = window.SITE || { showPlaceholders: false, scholar: null };
  var PUBS = (window.PUBLICATIONS || []).slice();
  var SELF = /^(Kim Q\. Tran|Kim Tran-Quoc|K\. ?Q\. Tran)$/;
  var AREA_LABEL = { materials: "Bio-inspired materials", ai: "AI & uncertainty", methods: "Computational methods" };
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function icon(id) { return '<svg class="ico" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; }
  function isSelf(name) { return SELF.test(name); }
  function isFirst(p) { return p.authors && p.authors.length && isSelf(p.authors[0]); }
  function fmtMonth(iso) {
    if (!iso) return "";
    var m = /^(\d{4})-(\d{2})/.exec(iso);
    return m ? MONTHS[+m[2] - 1] + " " + m[1] : "";
  }
  function ascii(s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[Łł]/g, "l"); }

  /* ---------------- theme ---------------- */
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function effectiveDark() {
    var t = root.getAttribute("data-theme");
    if (t === "dark") return true;
    if (t === "light") return false;
    return !!(mq && mq.matches);
  }
  function syncTheme() { root.classList.toggle("is-dark", effectiveDark()); }
  syncTheme();
  if (mq && mq.addEventListener) mq.addEventListener("change", syncTheme);
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) toggle.addEventListener("click", function () {
    var next = effectiveDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncTheme();
  });

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
          '<span class="bar-val">' + d.count + '</span>' +
          '<span class="bar" style="height:' + h + 'px"></span>' +
          '<span class="bar-year">' + d.year + '</span></button>';
      }).join("");
    }
  }

  /* ---------------- BibTeX ---------------- */
  var SURNAME_OVERRIDES = {
    "Magd Abdel Wahab": ["Abdel Wahab", "Magd"],
    "Krzysztof Kamil Żur": ["Żur", "Krzysztof Kamil"]
  };
  function splitName(n) {
    if (SURNAME_OVERRIDES[n]) return SURNAME_OVERRIDES[n];
    var parts = n.trim().split(/\s+/);
    var last = parts.pop();
    return [last, parts.join(" ")];
  }
  function bibAuthor(n) { var s = splitName(n); return s[1] ? s[0] + ", " + s[1] : s[0]; }
  function bibEsc(s) { return String(s).replace(/&/g, "\\&").replace(/–/g, "--"); }
  function bibKey(p) {
    var last = ascii(splitName(p.authors[0])[0]).toLowerCase().replace(/[^a-z]/g, "");
    var stop = /^(a|an|the|of|on|in|for|and|with|via|to|3d|new|three|novel)$/i;
    var word = (p.title.split(/[^A-Za-z0-9]+/).filter(function (w) { return w && !stop.test(w); })[0] || "paper").toLowerCase();
    return last + p.year + word;
  }
  function bibtex(p) {
    var conf = p.type === "conference";
    var f = [
      ["title", "{" + bibEsc(p.title) + "}"],
      ["author", bibEsc(p.authors.map(bibAuthor).join(" and "))],
      [conf ? "booktitle" : "journal", bibEsc(p.venue)]
    ];
    if (p.volume) f.push(["volume", p.volume]);
    if (p.issue) f.push(["number", p.issue]);
    if (p.pages) f.push(["pages", bibEsc(p.pages)]);
    f.push(["year", String(p.year)]);
    if (p.doi) f.push(["doi", p.doi]);
    var w = Math.max.apply(null, f.map(function (x) { return x[0].length; }));
    return "@" + (conf ? "inproceedings" : "article") + "{" + bibKey(p) + ",\n" +
      f.map(function (x) { return "  " + (x[0] + "         ").slice(0, w) + " = {" + x[1] + "}"; }).join(",\n") + "\n}";
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  /* ---------------- publication card ---------------- */
  function authorsHTML(p) {
    return p.authors.map(function (a) {
      return isSelf(a) ? '<span class="me">' + esc(a) + "</span>" : esc(a);
    }).join(", ");
  }
  function venueHTML(p) {
    var s = "<em>" + esc(p.venue) + "</em>";
    if (p.volume) s += ", " + esc(p.volume) + (p.issue ? "(" + esc(p.issue) + ")" : "");
    if (p.pages) s += ", " + esc(p.pages);
    s += " · " + esc(p.year);
    var on = fmtMonth(p.online);
    if (on) s += ' <span class="muted">· online ' + on + "</span>";
    return s;
  }
  function thumbHTML(p) {
    if (p.image) {
      return '<div class="pub-thumb has-image"><img src="' + esc(p.image) + '" alt="Graphical abstract: ' + esc(p.title) + '" loading="lazy"></div>';
    }
    return '<div class="pub-thumb" data-area="' + esc(p.area || "materials") + '" aria-hidden="true">' +
      '<div><div class="thumb-venue">' + esc(p.venueShort || "") + '</div><div class="thumb-year">' + esc(p.year) + "</div></div>" +
      '<div class="thumb-area">' + esc(AREA_LABEL[p.area] || "") + "</div></div>";
  }
  function badgesHTML(p) {
    var b = [];
    if (p.status && p.status !== "published") {
      var label = { accepted: "Accepted", "in-review": "Under review", preprint: "Preprint" }[p.status] || p.status;
      b.push('<span class="badge badge-status">' + esc(label) + "</span>");
    }
    b.push('<span class="badge">' + (p.type === "conference" ? "Conference" : "Journal") + "</span>");
    if (isFirst(p)) b.push('<span class="badge badge-accent">First author</span>');
    if (p.selected) b.push('<span class="badge badge-accent">' + icon("star") + "Selected</span>");
    if (p.links && (p.links.oa || p.links.arxiv)) b.push('<span class="badge">' + icon("unlock") + "Free to read</span>");
    if (p.citations > 0 && p.status === "published") {
      b.push('<span class="cites">Cited by <strong>' + p.citations + "</strong></span>");
    }
    return b.join("");
  }
  function actionsHTML(p) {
    var L = p.links || {};
    var a = [];
    function link(href, ic, text, cls) {
      return '<a class="btn' + (cls ? " " + cls : "") + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + icon(ic) + text + "</a>";
    }
    if (p.doi) a.push(link("https://doi.org/" + p.doi, "link", "DOI", "btn-primary"));
    if (p.pdf) {
      a.push(link(p.pdf, "file", "Accepted manuscript"));
    } else if (SITE.showPlaceholders) {
      var hint = "Add the file as papers/" + p.id + ".pdf, then set pdf: \"papers/" + p.id + ".pdf\" for this entry in data/publications.js";
      a.push('<span class="slot" title="' + esc(hint) + '">' + icon("upload") + "Accepted manuscript · add PDF</span>");
    }
    if (L.oa && L.oa !== L.arxiv) a.push(link(L.oa, "unlock", "Open access"));
    if (L.arxiv) a.push(link(L.arxiv, "file", "arXiv"));
    if (L.code) a.push(link(L.code, "github", "Code"));
    if (L.data) a.push(link(L.data, "data", "Data"));
    if (L.scholar && sc) a.push(link("https://scholar.google.com/citations?view_op=view_citation&hl=en&user=" + sc.userId + "&citation_for_view=" + sc.userId + ":" + L.scholar, "cap", "Scholar"));
    a.push('<button class="btn js-cite" type="button" aria-expanded="false" aria-controls="bib-' + esc(p.id) + '">' + icon("quote") + "Cite</button>");
    return a.join("");
  }
  function cardHTML(p) {
    var titleInner = p.doi
      ? '<a href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">' + esc(p.title) + "</a>"
      : esc(p.title);
    return '<article class="pub' + (p.selected ? " is-selected" : "") + '" id="pub-' + esc(p.id) + '">' +
      thumbHTML(p) +
      '<div class="pub-body">' +
        '<div class="pub-top">' + badgesHTML(p) + "</div>" +
        '<h3 class="pub-title">' + titleInner + "</h3>" +
        '<p class="pub-authors">' + authorsHTML(p) + "</p>" +
        '<p class="pub-venue">' + venueHTML(p) + "</p>" +
        (p.summary ? '<p class="pub-summary">' + esc(p.summary) + "</p>" : "") +
        (p.tags && p.tags.length ? '<ul class="pub-tags" aria-label="Keywords">' + p.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : "") +
        '<div class="pub-actions">' + actionsHTML(p) + "</div>" +
        '<div class="bibtex" id="bib-' + esc(p.id) + '" hidden>' +
          '<pre tabindex="0">' + esc(bibtex(p)) + "</pre>" +
          '<button class="btn copy js-copy" type="button">' + icon("copy") + "Copy</button>" +
        "</div>" +
      "</div></article>";
  }
  function acceptedPlaceholder() {
    return '<div class="pub-placeholder">' + icon("plus") +
      "<div><strong>Space for newly accepted papers.</strong><br>" +
      'Add an entry with <code>status: "accepted"</code> to <code>data/publications.js</code> and it appears here, ' +
      'with its accepted manuscript at <code>papers/&lt;id&gt;.pdf</code>.</div></div>';
  }

  /* ---------------- filtering & rendering ---------------- */
  var listEl = document.getElementById("pub-list");
  var searchEl = document.getElementById("pub-search");
  var sortEl = document.getElementById("pub-sort");
  var filterBtns = document.querySelectorAll("#pub-filters .chip");
  var state = { filter: "all", q: "", sort: "year" };

  var FILTERS = {
    all: function () { return true; },
    selected: function (p) { return !!p.selected; },
    first: isFirst,
    journal: function (p) { return p.type === "journal"; },
    conference: function (p) { return p.type === "conference"; }
  };

  function haystack(p) {
    return [p.title, p.authors.join(" "), p.venue, p.venueShort, p.year, (p.tags || []).join(" "), p.summary]
      .join(" ").toLowerCase();
  }
  PUBS.forEach(function (p) { p._hay = ascii(haystack(p)); });

  function sortPubs(arr) {
    return arr.slice().sort(function (a, b) {
      if (state.sort === "cites") return (b.citations || 0) - (a.citations || 0) || b.year - a.year;
      return b.year - a.year || String(b.online || "").localeCompare(String(a.online || "")) || (b.citations || 0) - (a.citations || 0);
    });
  }

  function render() {
    if (!listEl) return;
    var q = ascii(state.q.trim().toLowerCase());
    var terms = q ? q.split(/\s+/) : [];
    var items = PUBS.filter(FILTERS[state.filter]).filter(function (p) {
      return terms.every(function (t) { return p._hay.indexOf(t) !== -1; });
    });
    items = sortPubs(items);

    var html = "";
    var pending = items.filter(function (p) { return p.status && p.status !== "published"; });
    var done = items.filter(function (p) { return !p.status || p.status === "published"; });

    if (pending.length || (SITE.showPlaceholders && state.filter === "all" && !q)) {
      html += '<h3 class="pub-group-title">Accepted / in press <span class="muted">' + pending.length + "</span></h3>";
      html += pending.length ? pending.map(cardHTML).join("") : acceptedPlaceholder();
    }

    if (!done.length && !pending.length) {
      html += '<div class="pub-empty">No publications match “' + esc(state.q) + '”.</div>';
    } else if (state.sort === "year") {
      var groups = {};
      var years = [];
      done.forEach(function (p) {
        if (!groups[p.year]) { groups[p.year] = []; years.push(p.year); }
        groups[p.year].push(p);
      });
      years.forEach(function (y) {
        html += '<h3 class="pub-group-title">' + y + ' <span class="muted">' + groups[y].length + "</span></h3>";
        html += groups[y].map(cardHTML).join("");
      });
    } else if (done.length) {
      html += done.map(cardHTML).join("");
    }
    listEl.innerHTML = html;
  }

  function updateCounts() {
    filterBtns.forEach(function (b) {
      var c = PUBS.filter(FILTERS[b.getAttribute("data-filter")]).length;
      var span = b.querySelector(".count");
      if (span) span.textContent = c;
    });
  }

  filterBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      state.filter = b.getAttribute("data-filter");
      filterBtns.forEach(function (x) { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      render();
    });
  });
  if (searchEl) searchEl.addEventListener("input", function () { state.q = searchEl.value; render(); });
  if (sortEl) sortEl.addEventListener("change", function () { state.sort = sortEl.value; render(); });

  if (listEl) listEl.addEventListener("click", function (e) {
    var cite = e.target.closest(".js-cite");
    if (cite) {
      var box = document.getElementById(cite.getAttribute("aria-controls"));
      var open = cite.getAttribute("aria-expanded") === "true";
      cite.setAttribute("aria-expanded", open ? "false" : "true");
      if (box) box.hidden = open;
      return;
    }
    var copy = e.target.closest(".js-copy");
    if (copy) {
      var pre = copy.parentNode.querySelector("pre");
      copyText(pre.textContent).then(function () {
        copy.lastChild.textContent = "Copied";
        setTimeout(function () { copy.lastChild.textContent = "Copy"; }, 1600);
      }, function () {
        var r = document.createRange(); r.selectNodeContents(pre);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      });
    }
  });

  filterBtns.forEach(function (x) { x.setAttribute("aria-pressed", x.classList.contains("is-active") ? "true" : "false"); });
  updateCounts();
  render();

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

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
