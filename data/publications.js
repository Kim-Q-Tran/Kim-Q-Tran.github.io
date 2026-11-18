/*
 * Publication list. Sources: Google Scholar (citations, 18 Nov 2026),
 * ORCID 0000-0003-0924-9235, Crossref/OpenAlex (volumes, DOIs, keywords,
 * corresponding authors), the CV ("selected" = the CV's Selected Publications).
 *
 * HOW TO ADD THINGS
 * -----------------
 * Accepted manuscript PDF:
 *   1. Put the file in  papers/<id>.pdf   (e.g. papers/ijms2024-rottpms.pdf)
 *   2. Set  pdf: "papers/<id>.pdf"  on that entry.
 *
 * Demonstration figures (shown on the paper's own page, pub/<id>.html):
 *   1. Put images in  assets/img/papers/<id>/  (e.g. fig1.jpg)
 *   2. Add them:  figures: [{ src: "assets/img/papers/<id>/fig1.jpg", caption: "..." }]
 *
 * Card thumbnail (graphical abstract):
 *   image: "assets/img/papers/<id>.jpg"
 *
 * A newly accepted paper:
 *   Copy any entry, give it a new unique id, set status: "accepted"
 *   (or "in-review" / "preprint"), then run tools/build-pages.ps1 once
 *   to create its page in pub/.
 *
 * Field reference
 *   type          : "journal" | "conference" | "book" | "chapter"
 *   status        : "published" | "accepted" | "in-review" | "preprint"
 *   topics        : slugs from data/topics.js; the first one is the primary keyword
 *   quartile      : JCR best quartile "Q1".."Q4", or "" if the journal is not in JCR
 *   rank          : for conferences, CORE rank such as "A*", "A", "B" (or "")
 *   corresponding : names of corresponding authors (marked with ✉)
 *   highlights    : 2–4 short bullet points for the paper page
 *   links         : optional { code, data, arxiv, oa, scholar }
 *   oa            : link to a free, legal full text (open access / repository)
 */
window.PUBLICATIONS = [
  {
    id: "asoc2027-mater",
    type: "journal", status: "published", selected: true,
    topics: ["sustainability", "scientific-ml", "generative-explainable-ai"],
    year: 2027, online: "2026-10-26",
    title: "A probabilistic neural network framework for multi-objective sustainable building design under tropical climate change",
    authors: ["Kim Q. Tran", "Duong Q. Nguyen", "Loi T. Huynh", "Hung Nguyen-Xuan", "Magd Abdel Wahab"],
    corresponding: ["Hung Nguyen-Xuan", "Magd Abdel Wahab"],
    venue: "Applied Soft Computing", venueShort: "ASOC",
    volume: "205", issue: "", pages: "116753",
    doi: "10.1016/j.asoc.2026.116753", quartile: "Q1",
    citations: 0,
    summary: "Proposes MATER, a five-goal sustainability model (mitigated emissions, affordable economy, transformative energy, ecological resilience, responsible living), and optimizes a Ho Chi Minh City residence over a 75-year life cycle under five World Bank climate scenarios using Bayesian neural network surrogates, NSGA-II and SHAP.",
    highlights: [
      "Defines MATER, five sustainability goals that are simpler to act on than the 17 UN SDGs.",
      "Trains Bayesian neural network surrogates on 75-year life-cycle energy simulations under five World Bank climate scenarios.",
      "Finds robust designs with confidence-based objectives and NSGA-II, then explains the design variables with SHAP."
    ],
    tags: ["Bayesian neural networks", "Multi-objective optimization", "Climate change", "Building energy", "SHAP"],
    links: {
      code: "https://github.com/Kim-Q-Tran/ProbAI4MATER",
      data: "https://doi.org/10.5281/zenodo.20310714",
      scholar: "9c2xU6iGI7YC"
    },
    pdf: "", image: "", figures: []
  },
  {
    id: "eabe2026-isdt",
    type: "journal", status: "published", selected: true,
    topics: ["computational-mechanics", "bio-inspired-materials"],
    year: 2026, online: "2026-07-15",
    title: "An iterative-order shear deformation model for anisotropic FG-TPMS materials: Single-layer plate theories and isogeometric analysis",
    authors: ["Kim Q. Tran", "Thoi V. Duong", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Engineering Analysis with Boundary Elements", venueShort: "EABE",
    volume: "191", issue: "", pages: "106896",
    doi: "10.1016/j.enganabound.2026.106896", quartile: "Q1",
    citations: 1,
    summary: "Introduces an iterative-order shear deformation theory (ISDT) that raises the order of shear functions step by step, and benchmarks eight equivalent single-layer theories, from classical to quasi-3D, for thick anisotropic FG-TPMS plates in isogeometric analysis.",
    highlights: [
      "An iterative way to generate ever-higher-order shear deformation functions (ISDT).",
      "Eight equivalent single-layer theories (CPT, FSDT, TSDT, FoSDT, GPT, RPT and two quasi-3D variants) compared on the same FG-TPMS plates.",
      "Shows where higher-order and quasi-3D terms are needed to capture transverse shear and normal stresses in thick plates."
    ],
    tags: ["Shear deformation theory", "Isogeometric analysis", "FG-TPMS", "Transverse stresses"],
    links: {
      code: "https://github.com/Kim-Q-Tran/Eval_ESL_FG-TPMS-plates",
      scholar: "mlAyqtXpCwEC"
    },
    pdf: "", image: "", figures: []
  },
  {
    id: "cas2026-movingiga",
    type: "journal", status: "published", selected: false,
    topics: ["computational-mechanics"],
    year: 2026, online: "2026-06-25",
    title: "A moving isogeometric analysis framework for the dynamic behavior of higher-order shear deformation beam models under moving loads",
    authors: ["Ngoc Thuan Do", "Kim Q. Tran", "Hung Nguyen-Xuan", "Van Hai Luong"],
    corresponding: ["Hung Nguyen-Xuan", "Van Hai Luong"],
    venue: "Computers & Structures", venueShort: "C&S",
    volume: "330", issue: "", pages: "108335",
    doi: "10.1016/j.compstruc.2026.108335", quartile: "Q1",
    citations: 0,
    summary: "Formulates isogeometric analysis in a moving coordinate system so that laminated, functionally graded and TPMS beams on viscoelastic foundations can be analyzed under traveling loads without remeshing.",
    highlights: [
      "Places the isogeometric discretization in a coordinate system that travels with the load.",
      "Covers laminated composite, functionally graded and TPMS beams with higher-order shear deformation theories.",
      "Studies how foundation stiffness, damping and load speed shape the dynamic response."
    ],
    tags: ["Moving loads", "Isogeometric analysis", "Viscoelastic foundation", "Beams"],
    links: { scholar: "WJVC3Jt7v1AC" },
    pdf: "", image: "", figures: []
  },
  {
    id: "fead2026-lanurm",
    type: "journal", status: "published", selected: true,
    topics: ["materials-design", "computational-mechanics", "bio-inspired-materials"],
    year: 2026, online: "2026-07-01",
    title: "A layer-wise NURBS-based reconstruction method for cross-sectionally coherent geometries (LaNURM): An application to orientation optimization of RotTPMS-based trabecular bones",
    authors: ["Thoi V. Duong", "Kim Q. Tran", "Khuong D. Nguyen", "Yuri Bazilevs", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Finite Elements in Analysis and Design", venueShort: "FEAD",
    volume: "260", issue: "", pages: "104602",
    doi: "10.1016/j.finel.2026.104602", quartile: "Q1",
    citations: 2,
    summary: "LaNURM rebuilds geometries with coherent cross-sections, such as the calcaneus and talus, layer by layer as NURBS, so that their porous RotTPMS interiors can be oriented optimally with isogeometric analysis.",
    highlights: [
      "Reconstructs geometries with coherent cross-sections, such as the calcaneus and talus, layer by layer as NURBS volumes.",
      "Produces analysis-ready models for isogeometric analysis straight from the reconstruction.",
      "Optimizes the orientation of RotTPMS lattices inside trabecular bone."
    ],
    tags: ["NURBS reconstruction", "Trabecular bone", "RotTPMS", "Lattice anisotropy"],
    links: { scholar: "IRz6iEL74y4C" },
    pdf: "", image: "", figures: []
  },
  {
    id: "cas2026-xai",
    type: "journal", status: "published", selected: true,
    topics: ["generative-explainable-ai", "scientific-ml", "bio-inspired-materials"],
    year: 2026, online: "2026-04-04",
    title: "Explainable artificial intelligence in uncertainty quantification of functionally graded triply periodic minimal surface nanoplates via nonlocal moving Kriging meshfree method and Bayesian neural networks",
    authors: ["Lieu B. Nguyen", "Kim Q. Tran"],
    corresponding: ["Lieu B. Nguyen"],
    venue: "Computers & Structures", venueShort: "C&S",
    volume: "326", issue: "", pages: "108217",
    doi: "10.1016/j.compstruc.2026.108217", quartile: "Q1",
    citations: 5,
    summary: "Combines a nonlocal moving Kriging meshfree solver with Bayesian neural networks and SHAP to quantify, and explain, how manufacturing uncertainties shift the vibration of size-dependent FG-TPMS nanoplates.",
    highlights: [
      "A nonlocal moving Kriging meshfree method captures size effects in FG-TPMS nanoplates.",
      "Manufacturing uncertainties, sampled with Latin hypercube sampling, are propagated through Bayesian neural networks.",
      "SHAP ranks which uncertain inputs drive the scatter in natural frequencies."
    ],
    tags: ["Explainable AI", "Uncertainty quantification", "Meshfree", "Nanoplates"],
    links: { scholar: "_5tno0g5mFcC" },
    pdf: "", image: "", figures: []
  },
  {
    id: "eswa2026-laygenid",
    type: "journal", status: "published", selected: false,
    topics: ["generative-explainable-ai"],
    year: 2026, online: "2026-04-10",
    title: "LayGenID: Layout-preserving multi-conditional diffusion transformer with LoRA fusion for interior design generation",
    authors: ["Duong Q. Nguyen", "Kim Q. Tran", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Expert Systems with Applications", venueShort: "ESWA",
    volume: "324", issue: "", pages: "132352",
    doi: "10.1016/j.eswa.2026.132352", quartile: "Q1",
    citations: 1,
    summary: "A diffusion transformer that fuses segmentation and depth conditions through LoRA and cross-attention, generating interior designs from text while keeping the room layout intact.",
    highlights: [
      "Conditions a diffusion transformer on both a segmentation map and a depth image of the room.",
      "Fuses the conditions with LoRA adapters and cross-attention.",
      "Keeps walls, windows and furniture where the input layout puts them while the style follows the text prompt."
    ],
    tags: ["Diffusion transformer", "Generative AI", "LoRA", "Interior design"],
    links: { scholar: "2VqYfGB8ITEC" },
    pdf: "", image: "", figures: []
  },
  {
    id: "ijssd2026-mem",
    type: "journal", status: "published", selected: false,
    topics: ["computational-mechanics", "bio-inspired-materials"],
    year: 2026, online: "",
    title: "Dynamic behavior of FG-TPMS plates on a viscoelastic foundation subjected to moving loads using moving element method",
    authors: ["Ngoc Thuan Do", "Kim Q. Tran", "Hung Nguyen-Xuan", "Van Hai Luong"],
    corresponding: [],
    venue: "International Journal of Structural Stability and Dynamics", venueShort: "IJSSD",
    volume: "26", issue: "10", pages: "2650071",
    doi: "10.1142/S0219455426500719", quartile: "Q2",
    citations: 22,
    summary: "Applies the moving element method to FG-TPMS plates on viscoelastic foundations and maps how load speed, porosity grading and foundation damping control the dynamic response.",
    highlights: [
      "FG-TPMS plates on viscoelastic foundations in a moving element framework, which avoids remeshing as the load travels.",
      "Examines load speed, porosity distribution and foundation damping.",
      "Reports the dynamic deflection of lightweight lattice plates under moving loads."
    ],
    tags: ["Moving element method", "FG-TPMS", "Dynamics", "Viscoelastic foundation"],
    links: { scholar: "4hFrxpcac9AC" },
    pdf: "", image: "", figures: []
  },
  {
    id: "eabe2025-cntr",
    type: "journal", status: "published", selected: true,
    topics: ["bio-inspired-materials", "materials-design", "computational-mechanics"],
    year: 2025, online: "2025-02-26",
    title: "A new thermoelastic model for agglomerated and randomly-oriented CNT-reinforced bio-inspired materials: Temperature-dependent free vibration analysis of FG-CNTR-TPMS plates",
    authors: ["Kim Q. Tran", "Thoi V. Duong", "Tien-Dat Hoang", "Magd Abdel Wahab", "Klaus Hackl", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Engineering Analysis with Boundary Elements", venueShort: "EABE",
    volume: "174", issue: "", pages: "106157",
    doi: "10.1016/j.enganabound.2025.106157", quartile: "Q1",
    citations: 26,
    summary: "A thermoelastic micromechanics model for agglomerated, randomly oriented carbon nanotubes inside TPMS lattices, paired with a new trigonometric/inverse-trigonometric HSDT to study temperature-dependent free vibration in IGA.",
    highlights: [
      "A new thermoelastic model for agglomerated, randomly oriented carbon nanotubes in TPMS materials.",
      "A multiscale computational framework for FG-CNTR-TPMS lightweight composites.",
      "A combined trigonometric and inverse-trigonometric shear function in a five-variable HSDT with IGA, applied to temperature-dependent free vibration."
    ],
    tags: ["CNT reinforcement", "Thermoelasticity", "Multiscale", "Free vibration"],
    links: {
      code: "https://github.com/Kim-Q-Tran/Temp_FG-CNTR-TPMS-Plates",
      oa: "https://biblio.ugent.be/publication/01JN6XS8P5MCP9YVS2M8XD8KT5",
      scholar: "umqufdRvDiIC"
    },
    pdf: "", image: "", figures: []
  },
  {
    id: "cmame2025-materialuq",
    type: "journal", status: "published", selected: true,
    topics: ["scientific-ml", "bio-inspired-materials"],
    year: 2025, online: "2024-12-11",
    title: "A data-driven uncertainty quantification framework in probabilistic bio-inspired porous materials (Material-UQ): An investigation for RotTMPS plates",
    authors: ["Duong Q. Nguyen", "Kim Q. Tran", "Thinh D. Le", "Magd Abdel Wahab", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Computer Methods in Applied Mechanics and Engineering", venueShort: "CMAME",
    volume: "435", issue: "", pages: "117603",
    doi: "10.1016/j.cma.2024.117603", quartile: "Q1",
    citations: 44,
    summary: "Material-UQ imputes incomplete material data with missForest and propagates property uncertainty through a Bayesian neural network trained with pSGLD, predicting probabilistic RotTPMS plate responses validated on real MatWeb metal data.",
    highlights: [
      "Handles incomplete material-property data with missForest imputation.",
      "A Bayesian neural network trained with preconditioned stochastic gradient Langevin dynamics (BNN-pSGLD) predicts responses with uncertainty.",
      "Validated on real metal data from MatWeb; output distributions help designers tune parameters."
    ],
    tags: ["Uncertainty quantification", "Bayesian neural networks", "Missing data", "RotTPMS"],
    links: {
      code: "https://github.com/Kim-Q-Tran/Material-UQ",
      scholar: "XvxMoLDsR5gC"
    },
    pdf: "", image: "", figures: []
  },
  {
    id: "mets2025-buckling",
    type: "journal", status: "published", selected: false,
    topics: ["bio-inspired-materials", "computational-mechanics"],
    year: 2025, online: "2025-03-01",
    title: "Thermo-mechanical buckling analysis of bio-inspired RotTPMS plates via quasi-3D HSDT isogeometric analysis",
    authors: ["Kim Q. Tran", "Thoi V. Duong", "Hoang X. Nguyen", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Materials and Emerging Technologies for Sustainability", venueShort: "METS",
    volume: "1", issue: "1", pages: "2550006",
    doi: "10.1142/S3060932125500062", quartile: "",
    citations: 18,
    summary: "Quasi-3D HSDT isogeometric study of thermal and thermo-mechanical buckling in rotated TPMS plates: primitive lattices reach roughly 30% higher critical temperature rise, and crystal rotation changes buckling loads by up to 300%.",
    highlights: [
      "Temperature-dependent RotTPMS materials in a six-variable quasi-3D HSDT with IGA.",
      "Critical thermal buckling temperature rise and thermo-mechanical buckling loads.",
      "Primitive (P) lattices resist thermal buckling best; crystal rotation changes buckling loads by up to 300%."
    ],
    tags: ["Thermal buckling", "RotTPMS", "Quasi-3D HSDT", "Temperature dependence"],
    links: {
      code: "https://github.com/Kim-Q-Tran/Ther-Mech_Buck_RotTPMS-Plates",
      scholar: "DUooU5lO8OsC"
    },
    pdf: "", image: "", figures: []
  },
  {
    id: "mets2025-shells",
    type: "journal", status: "published", selected: false,
    topics: ["computational-mechanics", "bio-inspired-materials"],
    year: 2025, online: "",
    title: "Natural vibrations of variable-thickness truncated spherical shells with functionally graded bio-inspired anisotropic TPMS materials using 3D NURBS-based discretization method",
    authors: ["Thoi V. Duong", "Khuong D. Nguyen", "Kim Q. Tran"],
    corresponding: [],
    venue: "Materials and Emerging Technologies for Sustainability", venueShort: "METS",
    volume: "1", issue: "4", pages: "2550016",
    doi: "10.1142/S3060932125500165", quartile: "",
    citations: 4,
    summary: "A fully three-dimensional NURBS discretization for the free vibration of truncated spherical shells whose thickness varies and whose anisotropic TPMS material is functionally graded.",
    highlights: [
      "Discretizes truncated spherical shells fully in 3D with NURBS instead of reducing them to a shell theory.",
      "Allows the thickness to vary along the shell.",
      "Models anisotropic, functionally graded TPMS materials and studies their natural frequencies."
    ],
    tags: ["3D NURBS", "Shells", "Free vibration", "Anisotropic TPMS"],
    links: { scholar: "6ZxmRoH8BuwC" },
    pdf: "", image: "", figures: []
  },
  {
    id: "tws2025-homog",
    type: "journal", status: "published", selected: false,
    topics: ["materials-design", "bio-inspired-materials", "sustainability"],
    year: 2025, online: "2025-03-10",
    title: "A stochastic multiscale asymptotic homogenization approach to 3D printed biodegradable resin TPMS bio-inspired structures",
    authors: ["Tien-Dat Hoang", "Thinh H. Ngo", "Kim Q. Tran", "Shaofan Li", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Thin-Walled Structures", venueShort: "TWS",
    volume: "212", issue: "", pages: "113100",
    doi: "10.1016/j.tws.2025.113100", quartile: "Q1",
    citations: 19,
    summary: "Couples asymptotic homogenization with uncertainty quantification to predict the scattered stiffness and damage of vat-photopolymerized biodegradable-resin gyroid and primitive structures.",
    highlights: [
      "Asymptotic homogenization links the TPMS unit cell to effective properties.",
      "A stochastic treatment captures the variability of 3D-printed (vat photopolymerization) biodegradable resin.",
      "Covers gyroid and primitive structures, including damage propagation."
    ],
    tags: ["Homogenization", "3D printing", "Biodegradable resin", "Stochastic"],
    links: { scholar: "sNmaIFBj_lkC" },
    pdf: "", image: "", figures: []
  },
  {
    id: "cs2025-perovskite",
    type: "journal", status: "published", selected: false,
    topics: ["sustainability", "bio-inspired-materials", "computational-mechanics"],
    year: 2025, online: "2024-09-06",
    title: "A size-dependent nonlinear analysis of perovskite solar panels with FG-CNTR-TPMS substrates",
    authors: ["Nam V. Nguyen", "Kim Q. Tran", "Nicholas Fantuzzi", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Composite Structures", venueShort: "CS",
    volume: "351", issue: "", pages: "118548",
    doi: "10.1016/j.compstruct.2024.118548", quartile: "Q1",
    citations: 24,
    summary: "Size-dependent, geometrically nonlinear bending and free vibration of perovskite solar microplates carried on CNT-reinforced, functionally graded TPMS substrates.",
    highlights: [
      "Perovskite solar panels on FG-CNTR-TPMS substrates at the micro scale.",
      "A size-dependent theory captures small-scale effects.",
      "Geometrically nonlinear bending and free vibration."
    ],
    tags: ["Perovskite solar cells", "Size effect", "Nonlinear bending", "CNT-TPMS"],
    links: { scholar: "a9-T7VOCCH8C" },
    pdf: "", image: "", figures: []
  },
  {
    id: "ijms2024-rottpms",
    type: "journal", status: "published", selected: true,
    topics: ["bio-inspired-materials", "materials-design"],
    year: 2024, online: "2024-02-09",
    title: "Design of 3D rotating triply periodic minimal surface (RotTPMS) lattice plates: Meanings of crystalline rotations and porosity",
    authors: ["Kim Q. Tran", "Thinh D. Le", "Nam V. Nguyen", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "International Journal of Mechanical Sciences", venueShort: "IJMS",
    volume: "270", issue: "", pages: "109090",
    doi: "10.1016/j.ijmecsci.2024.109090", quartile: "Q1",
    citations: 49,
    summary: "Introduces rotating TPMS (RotTPMS) lattices by rotating the anisotropic elastic matrix through crystalline angles, and shows with quasi-3D IGA how rotation and porosity together tune plate stiffness.",
    highlights: [
      "Verifies the transformation of the elastic constitutive matrix under rotation.",
      "A material rotation method that produces RotTPMS lattices from P, G and IWP cells.",
      "Quasi-3D six-variable HSDT with IGA for static and free vibration analysis of square plates."
    ],
    tags: ["RotTPMS", "Anisotropy", "Material rotation", "Lattice design"],
    links: {
      code: "https://github.com/Kim-Q-Tran/RotTPMS-Plates",
      scholar: "0izLItjtcgwC"
    },
    pdf: "", image: "", figures: []
  },
  {
    id: "apm2024-gplr",
    type: "journal", status: "published", selected: true,
    topics: ["bio-inspired-materials", "materials-design"],
    year: 2024, online: "2023-11-10",
    title: "Three novel computational modeling frameworks of 3D-printed graphene platelets reinforced functionally graded triply periodic minimal surface (GPLR-FG-TPMS) plates",
    authors: ["Kim Q. Tran", "Tien-Dat Hoang", "Jaehong Lee", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Applied Mathematical Modelling", venueShort: "APM",
    volume: "126", issue: "", pages: "667–697",
    doi: "10.1016/j.apm.2023.10.043", quartile: "Q1",
    citations: 88,
    summary: "Three grading frameworks, controlling mass density, elastic modulus or shear modulus, for graphene-platelet-reinforced FG-TPMS plates, comparing five porous cores in static and free-vibration isogeometric analysis.",
    highlights: [
      "Three grading frameworks: control of mass density, elastic modulus or shear modulus.",
      "Three porosity distributions combined with three GPL distributions, across five porous architectures (P, G, IWP, closed-cell and open-cell).",
      "A five-variable fifth-order shear deformation theory with IGA compares the efficiency of the five porous cores."
    ],
    tags: ["Graphene platelets", "Functional grading", "Porous cores", "IGA"],
    links: {
      code: "https://github.com/Kim-Q-Tran/GPLR-FG-TPMS-Plates",
      scholar: "LO7wyVUgiFcC"
    },
    pdf: "", image: "", figures: []
  },
  {
    id: "ewc2024-quasi3d",
    type: "journal", status: "published", selected: false,
    topics: ["computational-mechanics", "bio-inspired-materials"],
    year: 2024, online: "2023-10-20",
    title: "A refined quasi-3D isogeometric nonlinear model of functionally graded triply periodic minimal surface plates",
    authors: ["Nam V. Nguyen", "Kim Q. Tran", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Engineering with Computers", venueShort: "EWC",
    volume: "40", issue: "4", pages: "2161–2181",
    doi: "10.1007/s00366-023-01891-y", quartile: "Q1",
    citations: 33,
    summary: "A thickness-stretching quasi-3D von Kármán model for nonlinear static and dynamic responses of FG-TPMS plates, including blast loading and damping.",
    highlights: [
      "A refined quasi-3D theory that includes thickness stretching.",
      "Von Kármán geometric nonlinearity in isogeometric analysis.",
      "Nonlinear static, dynamic and blast responses with damping."
    ],
    tags: ["Quasi-3D", "Geometric nonlinearity", "Blast loading", "IGA"],
    links: { scholar: "_FM0Bhl9EiAC" },
    pdf: "", image: "", figures: []
  },
  {
    id: "eabe2024-solar",
    type: "journal", status: "published", selected: false,
    topics: ["sustainability", "bio-inspired-materials", "computational-mechanics"],
    year: 2024, online: "2024-06-26",
    title: "An isogeometric analysis of solar panels with a bio-inspired substrate",
    authors: ["Nam V. Nguyen", "Kim Q. Tran", "Trung Dieu Do", "Chien H. Thai", "Krzysztof Kamil Żur", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Engineering Analysis with Boundary Elements", venueShort: "EABE",
    volume: "166", issue: "", pages: "105854",
    doi: "10.1016/j.enganabound.2024.105854", quartile: "Q1",
    citations: 36,
    summary: "Isogeometric HSDT model of solar panels mounted on gyroid and primitive TPMS substrates, under wind pressure and thermal loading.",
    highlights: [
      "Solar panels with gyroid and primitive TPMS substrates, modeled with NURBS-based IGA and HSDT.",
      "Wind pressure and thermal loading.",
      "Static bending and free vibration responses."
    ],
    tags: ["Solar panels", "Bio-inspired substrate", "Wind and thermal loads", "IGA"],
    links: { scholar: "NXb4pA-qfm4C" },
    pdf: "", image: "", figures: []
  },
  {
    id: "tws2024-shells",
    type: "journal", status: "published", selected: false,
    topics: ["bio-inspired-materials", "computational-mechanics"],
    year: 2024, online: "2024-08-14",
    title: "Nonlinear thermo-mechanical static stability analysis of FG-TPMS shallow spherical shells",
    authors: ["Dang Thuy Dong", "Tran Quang Minh", "Bui Tien Tu", "Kim Q. Tran", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Thin-Walled Structures", venueShort: "TWS",
    volume: "205", issue: "", pages: "112343",
    doi: "10.1016/j.tws.2024.112343", quartile: "Q1",
    citations: 35,
    summary: "Nonlinear load–deflection stability of FG-TPMS shallow spherical shells on nonlinear elastic foundations under combined thermal and mechanical loads.",
    highlights: [
      "Shallow spherical shells made of FG-TPMS materials with different porosity distributions.",
      "Higher-order shear deformation theory with von Kármán nonlinearity, on nonlinear elastic foundations.",
      "Load–deflection paths under combined thermal and mechanical loading."
    ],
    tags: ["Shallow shells", "Nonlinear stability", "Thermo-mechanical", "Elastic foundation"],
    links: { scholar: "HtEfBTGE9r8C" },
    pdf: "", image: "", figures: []
  },
  {
    id: "amc2024-nonlocal",
    type: "journal", status: "published", selected: false,
    topics: ["computational-mechanics", "bio-inspired-materials"],
    year: 2024, online: "2023-11-25",
    title: "Nonlocal strain gradient-based isogeometric analysis of graphene platelets-reinforced functionally graded triply periodic minimal surface nanoplates",
    authors: ["Nam V. Nguyen", "Kim Q. Tran", "Jaehong Lee", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Applied Mathematics and Computation", venueShort: "AMC",
    volume: "466", issue: "", pages: "128461",
    doi: "10.1016/j.amc.2023.128461", quartile: "Q1",
    citations: 60,
    summary: "Nonlocal strain gradient IGA that captures both stiffness softening and hardening in GPL-reinforced FG-TPMS nanoplates for bending, vibration and dynamic instability.",
    highlights: [
      "Nonlocal strain gradient theory captures both stiffness softening and hardening at the nanoscale.",
      "GPL-reinforced FG-TPMS nanoplates modeled with IGA.",
      "Static bending, free vibration and dynamic instability under in-plane compression."
    ],
    tags: ["Nonlocal strain gradient", "Nanoplates", "Graphene platelets", "Dynamic instability"],
    links: { scholar: "anf4URPfarAC" },
    pdf: "", image: "", figures: []
  },
  {
    id: "cs2023-fgtpms",
    type: "journal", status: "published", selected: true,
    topics: ["bio-inspired-materials", "computational-mechanics"],
    year: 2023, online: "2023-04-05",
    title: "Modelling of functionally graded triply periodic minimal surface (FG-TPMS) plates",
    authors: ["Hung Nguyen-Xuan", "Kim Q. Tran", "Chien H. Thai", "Jaehong Lee"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Composite Structures", venueShort: "CS",
    volume: "315", issue: "", pages: "116981",
    doi: "10.1016/j.compstruct.2023.116981", quartile: "Q1",
    citations: 163,
    summary: "Sets up the FG-TPMS plate model: fitted effective-property laws for primitive, gyroid and IWP lattices, two grading patterns, and a seventh-order shear deformation theory in IGA for bending, buckling and vibration.",
    highlights: [
      "Material matrices of three TPMS structures (P, G and IWP).",
      "Two functional grading patterns (A and B).",
      "A seventh-order shear deformation theory with IGA for static, buckling and free vibration analysis of rectangular plates."
    ],
    tags: ["FG-TPMS", "Effective properties", "Seventh-order SDT", "IGA"],
    links: {
      code: "https://github.com/Kim-Q-Tran/IGA-FG-TPMS-Rectangular-Plates",
      arxiv: "https://arxiv.org/abs/2303.13838",
      oa: "https://arxiv.org/pdf/2303.13838",
      scholar: "GtLg2Ama23sC"
    },
    pdf: "", image: "", figures: []
  },
  {
    id: "ast2023-micro",
    type: "journal", status: "published", selected: false,
    topics: ["bio-inspired-materials", "computational-mechanics"],
    year: 2023, online: "2023-03-22",
    title: "An isogeometric analysis of functionally graded triply periodic minimal surface microplates",
    authors: ["Nam V. Nguyen", "Kim Q. Tran", "Phuc Phung-Van", "Jaehong Lee", "Hung Nguyen-Xuan"],
    corresponding: ["Hung Nguyen-Xuan"],
    venue: "Aerospace Science and Technology", venueShort: "AST",
    volume: "137", issue: "", pages: "108270",
    doi: "10.1016/j.ast.2023.108270", quartile: "Q1",
    citations: 68,
    summary: "Modified couple stress theory with a four-variable refined plate theory to capture size effects in FG-TPMS microplates.",
    highlights: [
      "Modified couple stress theory with a material length-scale parameter.",
      "A four-variable refined plate theory with IGA.",
      "Static bending, free vibration and buckling of FG-TPMS microplates."
    ],
    tags: ["Microplates", "Couple stress", "Size effect", "IGA"],
    links: { scholar: "4fGpz3EwCPoC" },
    pdf: "", image: "", figures: []
  },
  {
    id: "vjm2022-ml",
    type: "journal", status: "published", selected: true,
    topics: ["scientific-ml", "bio-inspired-materials"],
    year: 2022, online: "",
    title: "Machine learning for predicting mechanical behavior of concrete beams with 3D printed TPMS",
    authors: ["Kim Tran-Quoc", "Lieu B. Nguyen", "Van Hai Luong", "Hung Nguyen-Xuan"],
    corresponding: [],
    venue: "Vietnam Journal of Mechanics", venueShort: "VJM",
    volume: "44", issue: "4", pages: "538–584",
    doi: "10.15625/0866-7136/17999", quartile: "",
    citations: 9,
    summary: "Machine learning surrogates, trained on simulation data, that predict the mechanical behavior of concrete beams with 3D-printed TPMS cores; this work grew out of my M.Eng. thesis.",
    highlights: [
      "Simulation data for concrete beams with 3D-printed TPMS cores.",
      "Machine learning models predict the mechanical behavior quickly.",
      "Grew out of the M.Eng. thesis on machine learning for TPMS sandwich beams."
    ],
    tags: ["Machine learning", "Surrogate models", "Concrete beams", "3D printing"],
    links: {
      oa: "https://vjs.ac.vn/index.php/vjmech/article/view/17999",
      scholar: "bz8QjSJIRt4C"
    },
    pdf: "", image: "", figures: []
  },
  {
    id: "nme2026-pinn",
    type: "conference", status: "published", selected: false, rank: "",
    topics: ["scientific-ml", "bio-inspired-materials"],
    year: 2026, online: "",
    title: "An energy-based physics-informed neural networks approach for nonlinear analysis of bio-inspired TPMS plates via higher-order shear deformation theory",
    authors: ["Kim Q. Tran", "Hung Nguyen-Xuan", "Magd Abdel Wahab"],
    corresponding: [],
    venue: "9th International Conference on Numerical Modelling in Engineering (NME 2026)", venueShort: "NME",
    volume: "", issue: "", pages: "",
    doi: "", quartile: "",
    citations: 0,
    summary: "An energy-based PINN that minimizes the total potential energy of HSDT plate models to solve nonlinear problems for bio-inspired TPMS plates without labeled data.",
    highlights: [
      "Energy-based physics-informed neural network: the loss is the plate's total potential energy.",
      "Higher-order shear deformation theory for bio-inspired TPMS plates.",
      "Nonlinear analysis without labeled simulation data."
    ],
    tags: ["PINNs", "Energy method", "Nonlinear analysis", "TPMS plates"],
    links: { scholar: "OTTXONDVkokC" },
    pdf: "", image: "", figures: []
  },
  {
    // NOTE: Google Scholar lists this item with the wrong venue
    // (CMAME 194, 2005). Fill in the real conference and year here.
    id: "conf-elastoplastic",
    type: "conference", status: "published", selected: false, rank: "",
    topics: ["computational-mechanics"],
    year: 2026, online: "",
    title: "Elastoplastic bending behaviors of steel plates via 2D isogeometric analysis solution with higher-order shear deformation theory",
    authors: ["Kim Q. Tran", "Hung Nguyen-Xuan", "Magd Abdel Wahab"],
    corresponding: [],
    venue: "Conference paper", venueShort: "CONF",
    volume: "", issue: "", pages: "",
    doi: "", quartile: "",
    citations: 0,
    summary: "Extends 2D isogeometric HSDT plate analysis into the elastoplastic range to trace the bending behavior of steel plates.",
    highlights: [
      "An elastoplastic material model for steel plates.",
      "2D isogeometric analysis with a higher-order shear deformation theory.",
      "Bending response beyond the elastic limit."
    ],
    tags: ["Elastoplasticity", "Steel plates", "HSDT", "IGA"],
    links: { scholar: "IUKN3-7HHlwC" },
    pdf: "", image: "", figures: []
  }
];
