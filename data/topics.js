/*
 * Research topics (= the site's keywords). Each one gets its own page in
 * research/<slug>.html with an explanation and an interactive visualization.
 * Papers link to topics through their `topics` list in data/publications.js
 * (the first topic listed is the paper's primary keyword).
 *
 * Order matters: it fixes each topic's color in the charts.
 */
window.TOPICS = [
  {
    slug: "bio-inspired-materials",
    name: "Bio-inspired materials",
    short: "TPMS lattices, rotated (RotTPMS) and nano-reinforced porous materials.",
    viz: "tpms",
    lead: "Bone, sea-urchin spines and butterfly wings get their stiffness from porous architecture, not from extra mass. Triply periodic minimal surfaces (TPMS) are mathematical versions of these architectures: smooth, fully connected and 3D-printable. I study how their shape, density and orientation set the stiffness of plates and shells.",
    vizCaption: "A slice through two unit cells. Solid material fills the region where φ < t. Change the cell type, slice height, density threshold t and crystal rotation θ.",
    sections: [
      { h: "What is a TPMS?", p: "A TPMS is a surface with zero mean curvature that repeats in all three directions. It can be written as a level set φ(x, y, z) = t. Filling the region φ < t with material gives a solid lattice, and the threshold t controls its relative density. Primitive (P), Gyroid (G) and I-graph-wrapped package (IWP) are the three families I use most." },
      { h: "Grading and rotation", p: "Changing t through the thickness gives functionally graded FG-TPMS plates: dense skins where bending stresses peak and a light core in between. Rotating the unit cell (RotTPMS) turns the lattice's cubic anisotropy into a design variable, so the same porosity can be stiffer or softer depending on the crystal angle." },
      { h: "Reinforcement", p: "Adding graphene platelets (GPL) or carbon nanotubes (CNT) to the base material raises stiffness further. Agglomerated, randomly oriented CNTs need their own micromechanics model, which I developed for temperature-dependent analysis." }
    ],
    terms: ["TPMS", "RotTPMS", "FG-TPMS", "Graphene platelets", "CNT", "Porosity"]
  },
  {
    slug: "computational-mechanics",
    name: "Computational mechanics",
    short: "Isogeometric analysis, higher-order plate theories and meshfree methods.",
    viz: "bspline",
    lead: "To trust a new material we need models that are both accurate and fast. I develop plate and shell models for anisotropic, graded materials and solve them with isogeometric analysis (IGA), which uses the same smooth spline functions for the geometry and for the solution.",
    vizCaption: "B-spline basis functions on an open uniform knot vector. Raise the degree p for smoother, wider functions; add elements to refine the mesh.",
    sections: [
      { h: "Why splines?", p: "Classical finite elements join pieces that are only continuous at the nodes. B-spline and NURBS basis functions of degree p are C^(p−1) continuous across elements, which higher-order plate theories need, and they represent curved CAD geometry exactly." },
      { h: "Higher-order plate theories", p: "Equivalent single-layer theories describe how a plate deforms through its thickness with a shear function f(z). First-order theory needs a shear correction factor; third-, fifth- and seventh-order theories, and quasi-3D theories with thickness stretching, capture transverse stresses directly. My iterative-order theory (ISDT) builds these functions systematically." },
      { h: "Beyond standard IGA", p: "Meshfree moving Kriging, the moving element method and moving IGA handle size effects and loads that travel across a structure." }
    ],
    terms: ["Isogeometric analysis", "Shear deformation", "Quasi-3D", "Meshfree", "Moving loads", "Nonlinear"]
  },
  {
    slug: "scientific-ml",
    name: "Scientific machine learning",
    short: "Bayesian neural networks, PINNs and uncertainty quantification.",
    viz: "uq",
    lead: "Real materials vary: printed struts come out thicker or thinner than designed, and property data are often incomplete. Probabilistic machine learning predicts a distribution instead of a single number, so designers can see how confident each prediction is.",
    vizCaption: "Illustration of a probabilistic surrogate. A Gaussian process stands in for a Bayesian neural network: the line is the mean prediction and the band is ±2σ. Click the chart to add training points and watch the uncertainty shrink.",
    sections: [
      { h: "Probabilistic surrogates", p: "Bayesian neural networks (BNNs) place probability distributions on their weights. Trained on simulation data, they replace slow solvers in uncertainty quantification and return a mean and a credible band for every prediction. Material-UQ adds missing-data imputation in front of the BNN." },
      { h: "Physics-informed neural networks", p: "PINNs build the governing equations into training. The energy-based variant minimizes the structure's total potential energy, so it needs no labeled solutions." },
      { h: "Why it matters", p: "Fast surrogates make it practical to sample thousands of material scenarios, optimize under uncertainty and then explain the results." }
    ],
    terms: ["Bayesian neural networks", "PINNs", "Uncertainty quantification", "Surrogate", "Machine learning"]
  },
  {
    slug: "generative-explainable-ai",
    name: "Generative & explainable AI",
    short: "Diffusion models for design and SHAP explanations for engineering models.",
    viz: "shap",
    lead: "Machine learning is most useful in design when it can propose options and explain itself. I work with diffusion models that generate designs under hard constraints, and with explanation methods that show which inputs drive a prediction.",
    vizCaption: "A toy linear model with made-up weights (not taken from any paper), showing how SHAP values add up. Move the sliders: each bar is one input's push away from the baseline.",
    sections: [
      { h: "Generative design", p: "LayGenID conditions a diffusion transformer on a room's segmentation and depth maps, fused through LoRA adapters and cross-attention, so it can restyle an interior from a text prompt without moving walls or windows." },
      { h: "Explaining predictions", p: "SHAP (Shapley additive explanations) splits a prediction into contributions from each input, measured from a baseline: the model's average output. For a linear model each contribution is simply weight × (value − average). I use SHAP to rank uncertain material inputs and design variables." }
    ],
    terms: ["SHAP", "Explainable", "Diffusion", "Generative", "LoRA"]
  },
  {
    slug: "materials-design",
    name: "Materials design",
    short: "Homogenization, scaling laws, orientation optimization and inverse design.",
    viz: "scaling",
    lead: "Designing a lattice means choosing its cell type, density and orientation so that the structure meets a target. Homogenization turns a detailed unit cell into effective properties a plate model can use; optimization and inverse design then search that space.",
    vizCaption: "Gibson–Ashby scaling of effective stiffness with relative density. The dashed curves are the ideal stretching-dominated (n = 1) and bending-dominated (n = 2) limits; the solid curve uses your C and n.",
    sections: [
      { h: "Homogenization", p: "Asymptotic and numerical homogenization replace the micro-architecture with an equivalent anisotropic material. I add randomness to this step to reflect the variation that 3D printing introduces." },
      { h: "Scaling with density", p: "The effective stiffness of a cellular solid follows the Gibson–Ashby law E*/Eₛ = C·ρ̄ⁿ. Stretching-dominated lattices have n ≈ 1 and bending-dominated foams n ≈ 2. Fitted C and n for each TPMS cell feed the plate models." },
      { h: "Orientation and inverse design", p: "Rotating TPMS cells (RotTPMS) to follow the principal stress directions, as in the LaNURM bone study, is one way to design anisotropy on purpose." }
    ],
    terms: ["Homogenization", "Optimization", "Inverse design", "Multiscale", "Effective properties"]
  },
  {
    slug: "sustainability",
    name: "Sustainability",
    short: "Climate-resilient structures, building energy and renewable energy.",
    viz: "mater",
    lead: "Lightweight, efficient structures use less material and energy. My Ph.D. at Ghent University applies this to coastal protection: climate-resilient, bio-inspired breakwaters that also harvest wave energy. Earlier work looked at buildings under climate change and at solar panels.",
    vizCaption: "The five MATER goals proposed in our Applied Soft Computing paper. Each goal becomes a confidence-based objective in a multi-objective optimization.",
    sections: [
      { h: "MATER", p: "We proposed MATER, five goals that are easier to act on than the 17 UN Sustainable Development Goals: Mitigated emissions, Affordable economy, Transformative energy, Ecological resilience and Responsible living. A probabilistic AI framework optimizes a building design for all five at once under climate-change uncertainty." },
      { h: "Energy and materials", p: "TPMS substrates for solar panels, biodegradable 3D-printed resins, and lattice structures for wave-energy-harvesting breakwaters all aim at doing more with less material." }
    ],
    terms: ["Climate change", "Solar panels", "Building energy", "Biodegradable", "Wave energy"]
  }
];
