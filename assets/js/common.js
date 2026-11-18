/* Shared helpers for every page (home, research topics, paper pages).
 * No dependencies; works from file:// as well as on GitHub Pages. */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var PUBS = window.PUBLICATIONS || [];
  var TOPICS = window.TOPICS || [];
  var base = (document.body && document.body.getAttribute("data-base")) || "";
  var SELF = /^(Kim Q\. Tran|Kim Tran-Quoc|K\. ?Q\. Tran)$/;
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------- icon sprite (injected so every page shares one copy) ---------- */
  var SPRITE = {
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    orcid: '<circle cx="12" cy="12" r="10"/><path d="M8.5 10v6M12 8h1.6a4 4 0 0 1 0 8H12z"/><circle cx="8.5" cy="7" r=".5"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    rg: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7.5 16V8h2.2a2 2 0 0 1 0 4H7.5m2.2 0 1.8 4M17 10a2 2 0 0 0-3.5 1.3v1.4A2 2 0 0 0 17 14v-1.2h-1.4"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    scopus: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    data: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    quote: '<path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
    unlock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
    right: '<path d="M5 12h14M13 5l7 7-7 7"/>',
    left: '<path d="M19 12H5M11 5l-7 7 7 7"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    copy: '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    tag: '<path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l8.7 8.7a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>'
  };
  (function injectSprite() {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>';
    for (var k in SPRITE) s += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + SPRITE[k] + "</symbol>";
    s += "</defs></svg>";
    var holder = document.createElement("div");
    holder.innerHTML = s;
    document.body.insertBefore(holder.firstChild, document.body.firstChild);
  })();

  /* ---------- small helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function icon(id) { return '<svg class="ico" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; }
  function isSelf(name) { return SELF.test(name); }
  function isFirst(p) { return !!(p.authors && p.authors.length && isSelf(p.authors[0])); }
  function isCorr(p, name) { return (p.corresponding || []).indexOf(name) !== -1; }
  function selfCorresponding(p) { return (p.corresponding || []).some(isSelf); }
  function ascii(s) { return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[Łł]/g, "l"); }
  function fmtMonth(iso) {
    var m = /^(\d{4})-(\d{2})/.exec(iso || "");
    return m ? MONTHS[+m[2] - 1] + " " + m[1] : "";
  }
  function topic(slug) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].slug === slug) return TOPICS[i];
    return null;
  }
  function topicIndex(slug) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].slug === slug) return i;
    return 0;
  }
  function pubUrl(p) { return base + "pub/" + p.id + ".html"; }
  function topicUrl(slug) { return base + "research/" + slug + ".html"; }
  function asset(path) { return /^(https?:)?\/\//.test(path) ? path : base + path; }

  /* ---------- formatting ---------- */
  function authorsHTML(p) {
    return p.authors.map(function (a) {
      var name = isSelf(a) ? '<span class="me">' + esc(a) + "</span>" : esc(a);
      if (isCorr(p, a)) name += '<span class="corr" title="Corresponding author" aria-label="corresponding author">✉</span>';
      return name;
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
  function quartileBadge(p) {
    if (p.type === "journal") {
      return p.quartile
        ? '<span class="badge badge-q badge-' + esc(p.quartile.toLowerCase()) + '" title="Journal Citation Reports (JCR) best quartile">ISI ' + esc(p.quartile) + "</span>"
        : '<span class="badge" title="Not indexed in JCR">Non-ISI</span>';
    }
    if (p.type === "conference" && p.rank) return '<span class="badge badge-q" title="CORE conference rank">CORE ' + esc(p.rank) + "</span>";
    return "";
  }
  function topicChips(p, cls) {
    return (p.topics || []).map(function (slug) {
      var t = topic(slug);
      if (!t) return "";
      return '<a class="topic-chip ' + (cls || "") + '" style="--tc: var(--t' + (topicIndex(slug) + 1) + ')" href="' + topicUrl(slug) + '">' + esc(t.name) + "</a>";
    }).join("");
  }
  function fullText(p) {
    if (p.links && p.links.oa) return "oa";
    if (p.pdf) return "accepted";
    return "none";
  }
  function pubCategory(p) {
    if (p.type === "book" || p.type === "chapter") return "book";
    if (p.type === "conference") return /^A\*?$/.test(p.rank || "") ? "confA" : "confOther";
    if (p.quartile === "Q1") return "q1";
    if (p.quartile === "Q2") return "q2";
    if (p.quartile === "Q3" || p.quartile === "Q4") return "q34";
    return "otherJ";
  }

  /* ---------- BibTeX ---------- */
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
      f.map(function (x) { return "  " + (x[0] + "          ").slice(0, w) + " = {" + x[1] + "}"; }).join(",\n") + "\n}";
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
  // Wire up every "Copy" button inside a .bibtex box (event delegation).
  document.addEventListener("click", function (e) {
    var copy = e.target.closest && e.target.closest(".js-copy");
    if (!copy) return;
    var pre = copy.parentNode.querySelector("pre");
    var label = copy.querySelector(".lbl");
    copyText(pre.textContent).then(function () {
      if (label) { label.textContent = "Copied"; setTimeout(function () { label.textContent = "Copy"; }, 1600); }
    }, function () {
      var r = document.createRange(); r.selectNodeContents(pre);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    });
  });

  /* ---------- theme ---------- */
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function effectiveDark() {
    var t = root.getAttribute("data-theme");
    if (t === "dark") return true;
    if (t === "light") return false;
    return !!(mq && mq.matches);
  }
  var themeListeners = [];
  function syncTheme() {
    root.classList.toggle("is-dark", effectiveDark());
    themeListeners.forEach(function (fn) { try { fn(); } catch (e) {} });
  }
  syncTheme();
  if (mq && mq.addEventListener) mq.addEventListener("change", syncTheme);
  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = effectiveDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncTheme();
    });
  });

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  window.KQT = {
    SITE: SITE, PUBS: PUBS, TOPICS: TOPICS, base: base,
    esc: esc, icon: icon, isSelf: isSelf, isFirst: isFirst, isCorr: isCorr, selfCorresponding: selfCorresponding,
    ascii: ascii, fmtMonth: fmtMonth, topic: topic, topicIndex: topicIndex,
    pubUrl: pubUrl, topicUrl: topicUrl, asset: asset,
    authorsHTML: authorsHTML, venueHTML: venueHTML, quartileBadge: quartileBadge, topicChips: topicChips,
    fullText: fullText, pubCategory: pubCategory, bibtex: bibtex, copyText: copyText,
    onTheme: function (fn) { themeListeners.push(fn); },
    isDark: effectiveDark
  };
})();
