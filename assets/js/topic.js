/* Renders one research-topic page: research/<slug>.html sets <body data-topic="<slug>">. */
(function () {
  "use strict";
  var K = window.KQT;
  var root = document.getElementById("topic");
  if (!K || !root) return;
  var esc = K.esc, icon = K.icon;
  var slug = document.body.getAttribute("data-topic");
  var t = K.topic(slug);
  if (!t) { root.innerHTML = '<h1 class="page-title">Topic not found</h1>'; return; }
  var ti = K.topicIndex(slug) + 1;
  document.title = t.name + " · Kim Q. Tran";

  var related = K.PUBS.filter(function (p) { return (p.topics || []).indexOf(slug) !== -1; })
    .sort(function (a, b) { return b.year - a.year || (b.citations || 0) - (a.citations || 0); });
  var code = [];
  related.forEach(function (p) {
    if (p.links && p.links.code && code.indexOf(p.links.code) === -1) code.push(p.links.code);
  });

  var others = K.TOPICS.filter(function (x) { return x.slug !== slug; }).map(function (x) {
    return '<a class="topic-chip" style="--tc: var(--t' + (K.topicIndex(x.slug) + 1) + ')" href="' + K.topicUrl(x.slug) + '">' + esc(x.name) + "</a>";
  }).join("");

  root.innerHTML =
    '<nav class="crumbs" aria-label="Breadcrumb"><a href="' + K.base + 'index.html">Home</a><span>/</span>' +
      '<a href="' + K.base + 'index.html#keywords">Keywords</a><span>/</span><span>' + esc(t.name) + "</span></nav>" +
    '<p class="eyebrow" style="color: var(--t' + ti + ')">Research topic</p>' +
    '<h1 class="page-title">' + esc(t.name) + "</h1>" +
    '<p class="lead">' + esc(t.lead) + "</p>" +
    '<div class="page-grid">' +
      "<div>" +
        '<figure class="viz" id="viz" data-viz="' + esc(t.viz) + '"><div class="viz-stage"></div>' +
          "<figcaption>" + esc(t.vizCaption || "") + "</figcaption></figure>" +
        t.sections.map(function (s) {
          return '<section class="block"><h2>' + esc(s.h) + "</h2><p>" + esc(s.p) + "</p></section>";
        }).join("") +
        '<section class="block"><h2>' + icon("file") + "Related papers (" + related.length + ')</h2><div class="related">' +
          related.map(function (p) {
            return '<a class="rel" href="' + K.pubUrl(p) + '"><span class="rel-year">' + esc(p.year) + '</span><span class="rel-title">' +
              esc(p.title) + '</span><span class="rel-venue">' + esc(p.venue) + (p.quartile ? " · ISI " + esc(p.quartile) : "") + "</span></a>";
          }).join("") + "</div></section>" +
      "</div>" +
      '<aside class="page-side">' +
        '<div class="panel"><h3 class="panel-title">' + icon("tag") + 'Keywords</h3><div class="tags-plain">' +
          (t.terms || []).map(function (w) { return "<span>" + esc(w) + "</span>"; }).join("") + "</div></div>" +
        (code.length ? '<div class="panel"><h3 class="panel-title">' + icon("github") + 'Related code</h3><div class="side-links">' +
          code.map(function (u) { return '<a class="btn" href="' + esc(u) + '" target="_blank" rel="noopener">' + icon("code") + esc(u.split("/").pop()) + "</a>"; }).join("") +
          "</div></div>" : "") +
        '<div class="panel"><h3 class="panel-title">' + icon("globe") + 'Other topics</h3><div class="topic-nav">' + others + "</div></div>" +
      "</aside>" +
    "</div>";

  if (window.KQTViz) window.KQTViz.mount(document.getElementById("viz"));
})();
