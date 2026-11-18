/*
 * Site-wide settings.
 * Loaded with a plain <script> tag so the page also works when opened
 * straight from disk (file://), with no web server.
 */
window.SITE = {
  // true  -> show the dashed "coming soon" slots for manuscripts and figures
  //          and the "accepted papers" placeholder.
  // false -> hide every empty slot.
  showPlaceholders: true,

  // How many papers the home page shows before "Show more".
  papersPerPage: 5,

  // GitHub repository that hosts the site (used for discussion links).
  repo: "Kim-Q-Tran/Kim-Q-Tran.github.io",

  // Open discussion under each paper page.
  //  - Always shown: a link to GitHub Discussions for that paper.
  //  - Embedded comments (giscus): install the giscus app on the repository
  //    (https://github.com/apps/giscus), then set enabled: true.
  giscus: {
    enabled: false,
    repo: "Kim-Q-Tran/Kim-Q-Tran.github.io",
    repoId: "R_kgDOVzE1og",
    category: "General",
    categoryId: "DIC_kwDOVzE1os4DLbJS"
  },

  // Google Scholar snapshot (update these numbers by hand when you like).
  scholar: {
    profile: "https://scholar.google.com/citations?user=RnIIxAIAAAAJ&hl=en",
    userId: "RnIIxAIAAAAJ",
    asOf: "Nov 18, 2026",
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
