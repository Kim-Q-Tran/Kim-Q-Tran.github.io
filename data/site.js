/*
 * Site-wide settings.
 * Loaded with a plain <script> tag so the page also works when opened
 * straight from disk (file://), with no web server.
 */
window.SITE = {
  // true  -> show the dashed "add accepted manuscript" slots and the
  //          "accepted papers" placeholder (handy while the site is private).
  // false -> hide every empty slot before you make the site public.
  showPlaceholders: true,

  // Google Scholar snapshot (update these numbers by hand when you like).
  scholar: {
    profile: "https://scholar.google.com/citations?user=RnIIxAIAAAAJ&hl=en",
    userId: "RnIIxAIAAAAJ",
    asOf: "18 Nov 2026",
    citations: 707,
    hIndex: 14,
    i10Index: 14,
    perYear: [
      { year: 2023, count: 9 },
      { year: 2024, count: 105 },
      { year: 2025, count: 274 },
      { year: 2026, count: 310 }
    ]
  }
};
