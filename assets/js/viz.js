/* Interactive visualizations for the research-topic pages.
 * Each is plain SVG/canvas, no libraries. KQTViz.mount(figureEl) picks the
 * one named in figureEl.dataset.viz. */
(function () {
  "use strict";
  var K = window.KQT;
  var esc = K ? K.esc : function (s) { return String(s); };
  var NS = "http://www.w3.org/2000/svg";

  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function hexToRgb(h) {
    h = h.replace("#", "");
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function slider(label, min, max, step, value, fmt) {
    var wrap = document.createElement("label");
    wrap.className = "control";
    wrap.innerHTML = '<span>' + esc(label) + ': <span class="val"></span></span><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '">';
    var input = wrap.querySelector("input"), val = wrap.querySelector(".val");
    function show() { val.textContent = fmt ? fmt(+input.value) : input.value; }
    input.addEventListener("input", show); show();
    return { el: wrap, input: input, get: function () { return +input.value; } };
  }
  function segmented(label, options, value, onChange) {
    var wrap = document.createElement("div");
    wrap.className = "control";
    wrap.innerHTML = "<span>" + esc(label) + '</span><div class="seg" role="group" aria-label="' + esc(label) + '"></div>';
    var seg = wrap.querySelector(".seg");
    options.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = o.label; b.setAttribute("data-v", o.value);
      if (o.value === value) b.classList.add("is-on");
      b.setAttribute("aria-pressed", o.value === value ? "true" : "false");
      b.addEventListener("click", function () {
        seg.querySelectorAll("button").forEach(function (x) { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        onChange(o.value);
      });
      seg.appendChild(b);
    });
    return wrap;
  }
  function controlsBox(stage) {
    var c = document.createElement("div");
    c.className = "controls";
    stage.parentNode.insertBefore(c, stage.nextSibling);
    return c;
  }
  function readout(stage) {
    var r = document.createElement("div");
    r.className = "viz-readout";
    stage.parentNode.insertBefore(r, stage.parentNode.querySelector("figcaption"));
    return r;
  }

  /* ------------------------------------------------------------------
   * 1. TPMS cross-section explorer (canvas)
   * ------------------------------------------------------------------ */
  var TPMS = {
    P: function (x, y, z) { return Math.cos(x) + Math.cos(y) + Math.cos(z); },
    G: function (x, y, z) { return Math.sin(x) * Math.cos(y) + Math.sin(y) * Math.cos(z) + Math.sin(z) * Math.cos(x); },
    IWP: function (x, y, z) {
      var cx = Math.cos(x), cy = Math.cos(y), cz = Math.cos(z);
      return 2 * (cx * cy + cy * cz + cz * cx) - (Math.cos(2 * x) + Math.cos(2 * y) + Math.cos(2 * z));
    }
  };
  var quantileCache = {};
  function sortedSamples(type) {
    if (quantileCache[type]) return quantileCache[type];
    var f = TPMS[type], N = 28, out = [], h = 2 * Math.PI / N;
    for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) for (var k = 0; k < N; k++) out.push(f((i + .5) * h, (j + .5) * h, (k + .5) * h));
    out.sort(function (a, b) { return a - b; });
    return (quantileCache[type] = out);
  }
  function vizTPMS(stage) {
    var state = { type: "G", z: 0.25, rho: 0.35, theta: 0 };
    var canvas = document.createElement("canvas");
    canvas.setAttribute("role", "img");
    stage.appendChild(canvas);
    var ctrl = controlsBox(stage);
    ctrl.appendChild(segmented("Cell type", [{ label: "Primitive (P)", value: "P" }, { label: "Gyroid (G)", value: "G" }, { label: "IWP", value: "IWP" }], state.type, function (v) { state.type = v; draw(); }));
    var sz = slider("Slice height z", 0, 1, 0.01, state.z, function (v) { return v.toFixed(2) + " × cell"; });
    var sr = slider("Relative density ρ̄", 0.1, 0.6, 0.01, state.rho, function (v) { return Math.round(v * 100) + "%"; });
    var st = slider("Crystal rotation θ (about x)", 0, 90, 1, state.theta, function (v) { return v + "°"; });
    [sz, sr, st].forEach(function (s) { ctrl.appendChild(s.el); s.input.addEventListener("input", function () { state.z = sz.get(); state.rho = sr.get(); state.theta = st.get(); draw(); }); });
    var out = readout(stage);

    function draw() {
      var W = Math.min(stage.clientWidth || 640, 900), H = Math.round(W * 0.55), dpr = Math.min(window.devicePixelRatio || 1, 2);
      var sc = Math.min(dpr, 1.25), w = Math.round(W * sc), h = Math.round(H * sc);
      canvas.width = w; canvas.height = h;
      canvas.style.aspectRatio = W + " / " + H;
      var ctx = canvas.getContext("2d");
      var img = ctx.createImageData(w, h);
      var f = TPMS[state.type];
      var samples = sortedSamples(state.type);
      var t = samples[Math.min(samples.length - 1, Math.floor(state.rho * samples.length))];
      var solid = hexToRgb(cssVar("--t1") || "#2a78d6");
      var voidc = hexToRgb(K && K.isDark() ? "#1a1e25" : "#f1f1ee");
      var cells = 2.0, L = cells * 2 * Math.PI;
      var th = state.theta * Math.PI / 180, ct = Math.cos(th), sn = Math.sin(th);
      var z0 = state.z * 2 * Math.PI, edge = 0.035 * (samples[samples.length - 1] - samples[0]);
      var count = 0;
      for (var py = 0; py < h; py++) {
        for (var px = 0; px < w; px++) {
          var x = px / w * L, y = py / h * L * (h / w);
          var yr = y * ct - z0 * sn, zr = y * sn + z0 * ct;   // rotate the lattice about x
          var d = f(x, yr, zr) - t;
          var a = Math.max(0, Math.min(1, 0.5 - d / edge));     // soft edge
          if (a > 0.5) count++;
          var o = (py * w + px) * 4;
          img.data[o] = voidc[0] + (solid[0] - voidc[0]) * a;
          img.data[o + 1] = voidc[1] + (solid[1] - voidc[1]) * a;
          img.data[o + 2] = voidc[2] + (solid[2] - voidc[2]) * a;
          img.data[o + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      var frac = count / (w * h);
      canvas.setAttribute("aria-label", state.type + " TPMS slice, relative density " + Math.round(state.rho * 100) + "%, rotation " + state.theta + " degrees");
      out.innerHTML = "Level set: solid where φ<sub>" + state.type + "</sub>(x, y, z) &lt; t = <strong>" + t.toFixed(2) + "</strong> · " +
        "volume fraction <strong>" + Math.round(state.rho * 100) + "%</strong> · this slice is <strong>" + Math.round(frac * 100) + "%</strong> solid";
    }
    draw();
    window.addEventListener("resize", debounce(draw, 150));
    if (K) K.onTheme(draw);
  }

  /* ------------------------------------------------------------------
   * 2. B-spline basis functions (SVG)
   * ------------------------------------------------------------------ */
  function basis(U, p, i, u) {
    // Cox–de Boor recursion
    if (p === 0) {
      if (U[i] <= u && u < U[i + 1]) return 1;
      if (u === U[U.length - 1] && U[i] < u && u <= U[i + 1]) return 1; // close the last span
      return 0;
    }
    var a = U[i + p] - U[i], b = U[i + p + 1] - U[i + 1];
    var left = a > 0 ? (u - U[i]) / a * basis(U, p - 1, i, u) : 0;
    var right = b > 0 ? (U[i + p + 1] - u) / b * basis(U, p - 1, i + 1, u) : 0;
    return left + right;
  }
  function vizBspline(stage) {
    var state = { p: 2, n: 4 };
    var W = 720, H = 320, m = { l: 44, r: 16, t: 16, b: 34 };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "plot", role: "img" }, stage);
    var ctrl = controlsBox(stage);
    ctrl.appendChild(segmented("Degree p", [1, 2, 3, 4].map(function (v) { return { label: "p = " + v, value: v }; }), state.p, function (v) { state.p = v; draw(); }));
    var sn = slider("Elements", 1, 8, 1, state.n);
    ctrl.appendChild(sn.el);
    sn.input.addEventListener("input", function () { state.n = sn.get(); draw(); });
    var out = readout(stage);

    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var p = state.p, n = state.n, U = [], i;
      for (i = 0; i <= p; i++) U.push(0);
      for (i = 1; i < n; i++) U.push(i / n);
      for (i = 0; i <= p; i++) U.push(1);
      var nb = U.length - p - 1;
      var X = function (u) { return m.l + u * (W - m.l - m.r); };
      var Y = function (v) { return H - m.b - v * (H - m.t - m.b) / 1.08; };
      // grid & axes
      [0, 0.5, 1].forEach(function (v) {
        el("line", { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), class: v === 0 ? "axis" : "grid" }, svg);
        el("text", { x: m.l - 8, y: Y(v) + 4, "text-anchor": "end", class: "tick" }, svg).textContent = v;
      });
      // element boundaries (knots)
      for (i = 0; i <= n; i++) {
        el("line", { x1: X(i / n), x2: X(i / n), y1: Y(0), y2: Y(0) + 6, class: "axis" }, svg);
        el("text", { x: X(i / n), y: H - 10, "text-anchor": "middle", class: "tick" }, svg).textContent = +(i / n).toFixed(2);
      }
      el("text", { x: W - m.r, y: H - 10, "text-anchor": "end", class: "lbl" }, svg).textContent = "ξ";
      // basis functions
      var S = 240;
      for (var b = 0; b < nb; b++) {
        var d = "";
        for (var s = 0; s <= S; s++) {
          var u = s / S;
          d += (s ? "L" : "M") + X(u).toFixed(1) + " " + Y(basis(U, p, b, u)).toFixed(1);
        }
        var path = el("path", { d: d, fill: "none", style: "stroke: var(--t2)", "stroke-width": 2, opacity: b % 2 ? 0.55 : 1 }, svg);
        el("title", {}, path).textContent = "N" + (b + 1) + "," + p + "(ξ)";
      }
      // partition of unity
      el("line", { x1: m.l, x2: W - m.r, y1: Y(1), y2: Y(1), class: "truth" }, svg);
      el("text", { x: m.l + 6, y: Y(1) - 6, class: "lbl" }, svg).textContent = "Σ Nᵢ = 1";
      svg.setAttribute("aria-label", nb + " B-spline basis functions of degree " + p + " on " + n + " elements");
      out.innerHTML = "<strong>" + nb + "</strong> basis functions · each element is covered by <strong>" + (p + 1) +
        "</strong> of them · continuity across element boundaries: <strong>C<sup>" + (p - 1) + "</sup></strong>" +
        (p >= 2 ? " (smooth slopes, as higher-order plate theories need)" : " (kinks at the boundaries, like standard linear elements)");
    }
    draw();
  }

  /* ------------------------------------------------------------------
   * 3. Probabilistic surrogate (Gaussian-process stand-in for a BNN)
   * ------------------------------------------------------------------ */
  function vizUQ(stage) {
    var truth = function (x) { return Math.sin(2.2 * x) + 0.25 * x; };
    var X0 = [0.4, 1.3, 2.9, 3.4];
    var state = { xs: X0.slice() };
    var noise = function (x) { return 0.06 * Math.sin(37 * x + 1.3); }; // deterministic "measurement noise"
    var W = 720, H = 330, m = { l: 44, r: 16, t: 30, b: 34 }, xmin = 0, xmax = 4, ymin = -2, ymax = 2.4;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "plot", role: "img", style: "cursor: crosshair" }, stage);
    var ctrl = controlsBox(stage);
    var ls = slider("Kernel length scale ℓ", 0.2, 1.5, 0.05, 0.6, function (v) { return v.toFixed(2); });
    ctrl.appendChild(ls.el);
    ls.input.addEventListener("input", draw);
    var btns = document.createElement("div");
    btns.className = "control";
    btns.innerHTML = '<span>Training data</span><div class="seg"><button type="button" data-a="add">Add a point</button><button type="button" data-a="reset">Reset</button></div>';
    ctrl.appendChild(btns);
    btns.addEventListener("click", function (e) {
      var a = e.target.getAttribute("data-a");
      if (a === "add") { state.xs.push(xmin + Math.random() * (xmax - xmin)); draw(); }
      if (a === "reset") { state.xs = X0.slice(); draw(); }
    });
    var out = readout(stage);
    var X = function (x) { return m.l + (x - xmin) / (xmax - xmin) * (W - m.l - m.r); };
    var Y = function (y) { return H - m.b - (y - ymin) / (ymax - ymin) * (H - m.t - m.b); };
    svg.addEventListener("click", function (e) {
      var r = svg.getBoundingClientRect();
      var x = xmin + ((e.clientX - r.left) / r.width * W - m.l) / (W - m.l - m.r) * (xmax - xmin);
      if (x >= xmin && x <= xmax && state.xs.length < 40) { state.xs.push(x); draw(); }
    });

    function gp(xs, ys, ell) {
      var n = xs.length, sf2 = 1, sn2 = 0.004, i, j, k;
      var kern = function (a, b) { var d = a - b; return sf2 * Math.exp(-0.5 * d * d / (ell * ell)); };
      var Kmat = [];
      for (i = 0; i < n; i++) { Kmat.push([]); for (j = 0; j < n; j++) Kmat[i].push(kern(xs[i], xs[j]) + (i === j ? sn2 : 0)); }
      var Lc = [];  // Cholesky
      for (i = 0; i < n; i++) { Lc.push(new Array(n).fill(0)); }
      for (i = 0; i < n; i++) for (j = 0; j <= i; j++) {
        var s = Kmat[i][j];
        for (k = 0; k < j; k++) s -= Lc[i][k] * Lc[j][k];
        Lc[i][j] = i === j ? Math.sqrt(Math.max(s, 1e-12)) : s / Lc[j][j];
      }
      function solveL(b) { var x = []; for (var i = 0; i < n; i++) { var s = b[i]; for (var k = 0; k < i; k++) s -= Lc[i][k] * x[k]; x.push(s / Lc[i][i]); } return x; }
      function solveLT(b) { var x = new Array(n); for (var i = n - 1; i >= 0; i--) { var s = b[i]; for (var k = i + 1; k < n; k++) s -= Lc[k][i] * x[k]; x[i] = s / Lc[i][i]; } return x; }
      var alpha = solveLT(solveL(ys));
      return function (x) {
        var ks = xs.map(function (xi) { return kern(x, xi); });
        var mu = 0; for (var i = 0; i < n; i++) mu += ks[i] * alpha[i];
        var v = solveL(ks), vv = 0; for (i = 0; i < n; i++) vv += v[i] * v[i];
        return [mu, Math.sqrt(Math.max(sf2 - vv, 0))];
      };
    }

    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var ys = state.xs.map(function (x) { return truth(x) + noise(x); });
      var post = gp(state.xs, ys, ls.get());
      var S = 160, up = "", lo = "", mean = "", tr = "", maxSd = 0;
      for (var s = 0; s <= S; s++) {
        var x = xmin + s / S * (xmax - xmin), r = post(x);
        maxSd = Math.max(maxSd, r[1]);
        mean += (s ? "L" : "M") + X(x).toFixed(1) + " " + Y(r[0]).toFixed(1);
        up += (s ? "L" : "M") + X(x).toFixed(1) + " " + Y(r[0] + 2 * r[1]).toFixed(1);
        lo = "L" + X(x).toFixed(1) + " " + Y(r[0] - 2 * r[1]).toFixed(1) + lo;
        tr += (s ? "L" : "M") + X(x).toFixed(1) + " " + Y(truth(x)).toFixed(1);
      }
      [-2, -1, 0, 1, 2].forEach(function (v) {
        el("line", { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), class: v === -2 ? "axis" : "grid" }, svg);
        el("text", { x: m.l - 8, y: Y(v) + 4, "text-anchor": "end", class: "tick" }, svg).textContent = v;
      });
      [0, 1, 2, 3, 4].forEach(function (v) { el("text", { x: X(v), y: H - 12, "text-anchor": "middle", class: "tick" }, svg).textContent = v; });
      el("text", { x: W - m.r, y: H - 12, "text-anchor": "end", class: "lbl" }, svg).textContent = "input x";
      el("path", { d: up + lo + "Z", class: "band" }, svg);
      el("path", { d: tr, class: "truth" }, svg);
      el("path", { d: mean, class: "mean" }, svg);
      state.xs.forEach(function (x, i) {
        var c = el("circle", { cx: X(x), cy: Y(ys[i]), r: 5, class: "pt" }, svg);
        el("title", {}, c).textContent = "x = " + x.toFixed(2) + ", y = " + ys[i].toFixed(2);
      });
      // legend (top)
      var lg = [["mean", "Mean prediction", "line"], ["band", "±2σ credible band", "rect"], ["truth", "True function", "line"], ["pt", "Training data", "dot"]];
      var lx = m.l;
      lg.forEach(function (g) {
        if (g[2] === "line") el("line", { x1: lx, x2: lx + 18, y1: 14, y2: 14, class: g[0] }, svg);
        else if (g[2] === "rect") el("rect", { x: lx, y: 8, width: 18, height: 12, class: g[0] }, svg);
        else el("circle", { cx: lx + 9, cy: 14, r: 5, class: g[0] }, svg);
        var t = el("text", { x: lx + 24, y: 18, class: "lbl" }, svg); t.textContent = g[1];
        lx += 24 + g[1].length * 6.6 + 18;
      });
      svg.setAttribute("aria-label", "Probabilistic surrogate with " + state.xs.length + " training points");
      out.innerHTML = "<strong>" + state.xs.length + "</strong> training points · largest uncertainty ±2σ = <strong>" + (2 * maxSd).toFixed(2) +
        "</strong> · click the chart to add data where the band is widest.";
    }
    draw();
  }

  /* ------------------------------------------------------------------
   * 4. SHAP waterfall for a toy linear model
   * ------------------------------------------------------------------ */
  function vizSHAP(stage) {
    var feats = [
      { name: "Porosity", w: -2.0, x0: 0.7 },
      { name: "Thickness ratio", w: 1.5, x0: 0.65 },
      { name: "Rotation angle", w: 0.8, x0: 0.85 },
      { name: "Temperature", w: -1.2, x0: 0.3 }
    ];
    var base = 3.0; // model output at the average input (all inputs = 0.5)
    var W = 720, H = 300, m = { l: 150, r: 70, t: 18, b: 34 };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "plot", role: "img" }, stage);
    var ctrl = controlsBox(stage);
    var sliders = feats.map(function (f) {
      var s = slider(f.name + " (normalized)", 0, 1, 0.01, f.x0, function (v) { return v.toFixed(2); });
      ctrl.appendChild(s.el);
      s.input.addEventListener("input", draw);
      return s;
    });
    var out = readout(stage);

    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var phi = feats.map(function (f, i) { return f.w * (sliders[i].get() - 0.5); });
      var pred = base + phi.reduce(function (a, b) { return a + b; }, 0);
      var lo = 1.5, hi = 4.5;
      var X = function (v) { return m.l + (v - lo) / (hi - lo) * (W - m.l - m.r); };
      var rowH = (H - m.t - m.b) / (feats.length + 1);
      [2, 3, 4].forEach(function (v) {
        el("line", { x1: X(v), x2: X(v), y1: m.t, y2: H - m.b, class: v === 3 ? "axis" : "grid" }, svg);
        el("text", { x: X(v), y: H - 12, "text-anchor": "middle", class: "tick" }, svg).textContent = v.toFixed(1);
      });
      el("text", { x: X(3), y: m.t - 4, "text-anchor": "middle", class: "tick" }, svg).textContent = "baseline E[f] = " + base.toFixed(1);
      var cur = base;
      feats.forEach(function (f, i) {
        var y = m.t + i * rowH + 6, v = phi[i], x0 = X(Math.min(cur, cur + v)), x1 = X(Math.max(cur, cur + v));
        el("text", { x: m.l - 10, y: y + rowH / 2, "text-anchor": "end", class: "lbl" }, svg).textContent = f.name;
        var r = el("rect", { x: x0, y: y, width: Math.max(x1 - x0, 1.5), height: rowH - 12, rx: 4,
          style: "fill: " + (v >= 0 ? "#e34948" : "var(--t1)") }, svg);
        el("title", {}, r).textContent = f.name + ": SHAP " + (v >= 0 ? "+" : "") + v.toFixed(2);
        el("text", { x: (v >= 0 ? x1 + 6 : x0 - 6), y: y + rowH / 2, "text-anchor": v >= 0 ? "start" : "end", class: "tick" }, svg).textContent = (v >= 0 ? "+" : "") + v.toFixed(2);
        cur += v;
        if (i < feats.length - 1) el("line", { x1: X(cur), x2: X(cur), y1: y + rowH - 12, y2: y + rowH + 6, class: "axis", "stroke-dasharray": "3 3" }, svg);
      });
      var yP = m.t + feats.length * rowH + 4;
      el("text", { x: m.l - 10, y: yP + 10, "text-anchor": "end", class: "lbl", "font-weight": "700" }, svg).textContent = "Prediction f(x)";
      el("circle", { cx: X(pred), cy: yP + 6, r: 6, style: "fill: var(--text)" }, svg);
      el("text", { x: X(pred) + 10, y: yP + 10, class: "lbl" }, svg).textContent = pred.toFixed(2);
      svg.setAttribute("aria-label", "SHAP waterfall: baseline " + base + ", prediction " + pred.toFixed(2));
      out.innerHTML = "Baseline <strong>" + base.toFixed(2) + "</strong> + " + phi.map(function (v) { return (v >= 0 ? "" : "(") + v.toFixed(2) + (v >= 0 ? "" : ")"); }).join(" + ") +
        " = prediction <strong>" + pred.toFixed(2) + "</strong>. Red pushes the output up, blue pulls it down.";
    }
    draw();
  }

  /* ------------------------------------------------------------------
   * 5. Gibson–Ashby scaling law
   * ------------------------------------------------------------------ */
  function vizScaling(stage) {
    var W = 720, H = 340, m = { l: 52, r: 120, t: 16, b: 40 };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "plot", role: "img" }, stage);
    var ctrl = controlsBox(stage);
    var sC = slider("Prefactor C", 0.2, 1.2, 0.01, 0.75, function (v) { return v.toFixed(2); });
    var sN = slider("Exponent n", 1, 3, 0.05, 1.6, function (v) { return v.toFixed(2); });
    var sR = slider("Relative density ρ̄", 0.05, 0.6, 0.01, 0.3, function (v) { return Math.round(v * 100) + "%"; });
    [sC, sN, sR].forEach(function (s) { ctrl.appendChild(s.el); s.input.addEventListener("input", draw); });
    var out = readout(stage);
    var X = function (r) { return m.l + r / 0.6 * (W - m.l - m.r); };
    var Y = function (e) { return H - m.b - e / 0.6 * (H - m.t - m.b); };
    function curve(C, n) {
      var d = "";
      for (var s = 0; s <= 120; s++) { var r = s / 120 * 0.6, e = Math.min(C * Math.pow(r, n), 0.62); d += (s ? "L" : "M") + X(r).toFixed(1) + " " + Y(e).toFixed(1); }
      return d;
    }
    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      [0, 0.2, 0.4, 0.6].forEach(function (v) {
        el("line", { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), class: v ? "grid" : "axis" }, svg);
        el("text", { x: m.l - 8, y: Y(v) + 4, "text-anchor": "end", class: "tick" }, svg).textContent = v.toFixed(1);
        el("text", { x: X(v), y: H - 22, "text-anchor": "middle", class: "tick" }, svg).textContent = Math.round(v * 100) + "%";
      });
      el("text", { x: (m.l + W - m.r) / 2, y: H - 4, "text-anchor": "middle", class: "lbl" }, svg).textContent = "Relative density ρ̄";
      var yl = el("text", { x: 14, y: (m.t + H - m.b) / 2, "text-anchor": "middle", class: "lbl", transform: "rotate(-90 14 " + ((m.t + H - m.b) / 2) + ")" }, svg);
      yl.textContent = "E* / Eₛ";
      el("path", { d: curve(1, 1), class: "truth" }, svg);
      el("path", { d: curve(1, 2), class: "truth" }, svg);
      var C = sC.get(), n = sN.get(), r = sR.get(), e = C * Math.pow(r, n);
      el("path", { d: curve(C, n), class: "mean", style: "stroke: var(--t5); stroke-width: 2.5" }, svg);
      el("line", { x1: X(r), x2: X(r), y1: Y(0), y2: Y(Math.min(e, 0.6)), class: "grid", "stroke-dasharray": "3 3" }, svg);
      el("circle", { cx: X(r), cy: Y(Math.min(e, 0.6)), r: 5, class: "pt", style: "fill: var(--t5)" }, svg);
      el("text", { x: W - m.r + 6, y: Y(Math.min(0.6, 1 * 0.6)) + 4, class: "lbl" }, svg).textContent = "n = 1 (stretching)";
      el("text", { x: W - m.r + 6, y: Y(0.36) + 4, class: "lbl" }, svg).textContent = "n = 2 (bending)";
      el("text", { x: W - m.r + 6, y: Y(Math.min(C * Math.pow(0.6, n), 0.6)) + 18, class: "lbl", style: "fill: var(--t5)" }, svg).textContent = "your C, n";
      svg.setAttribute("aria-label", "Gibson-Ashby scaling, C " + C + ", n " + n);
      out.innerHTML = "At ρ̄ = <strong>" + Math.round(r * 100) + "%</strong>: E*/Eₛ = " + C.toFixed(2) + " × " + r.toFixed(2) + "<sup>" + n.toFixed(2) + "</sup> = <strong>" + e.toFixed(3) +
        "</strong>, i.e. the lattice keeps " + (e * 100).toFixed(1) + "% of the solid's stiffness with " + Math.round(r * 100) + "% of its mass.";
    }
    draw();
  }

  /* ------------------------------------------------------------------
   * 6. MATER goals diagram
   * ------------------------------------------------------------------ */
  function vizMATER(stage) {
    var goals = [
      { k: "M", name: "Mitigated emissions" },
      { k: "A", name: "Affordable economy" },
      { k: "T", name: "Transformative energy" },
      { k: "E", name: "Ecological resilience" },
      { k: "R", name: "Responsible living" }
    ];
    var W = 720, H = 380, cx = W / 2, cy = 196, R = 132;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "plot", role: "img", "aria-label": "Five MATER sustainability goals around a central optimization" }, stage);
    var pts = goals.map(function (g, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
    el("path", { d: "M" + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L") + "Z", fill: "none", class: "grid", "stroke-width": 1.5 }, svg);
    pts.forEach(function (p) { el("line", { x1: cx, y1: cy, x2: p[0], y2: p[1], class: "grid" }, svg); });
    el("circle", { cx: cx, cy: cy, r: 54, style: "fill: var(--surface-2); stroke: var(--border-strong)" }, svg);
    var t1 = el("text", { x: cx, y: cy - 2, "text-anchor": "middle", style: "font: 800 22px var(--font-display); fill: var(--text)" }, svg); t1.textContent = "MATER";
    var t2 = el("text", { x: cx, y: cy + 18, "text-anchor": "middle", class: "tick" }, svg); t2.textContent = "BNN + NSGA-II";
    goals.forEach(function (g, i) {
      var p = pts[i], color = "var(--t" + (i + 1) + ")";
      var grp = el("g", { tabindex: 0, role: "img", "aria-label": g.name }, svg);
      el("circle", { cx: p[0], cy: p[1], r: 30, style: "fill: " + color }, grp);
      var tt = el("text", { x: p[0], y: p[1] + 7, "text-anchor": "middle", style: "font: 800 20px var(--font-display); fill: #fff" }, grp); tt.textContent = g.k;
      var below = p[1] > cy;
      var lx = p[0] + (Math.abs(p[0] - cx) < 5 ? 0 : (p[0] > cx ? 40 : -40));
      var ly = Math.abs(p[0] - cx) < 5 ? p[1] - 42 : p[1] + (below ? 46 : 4);
      var anchor = Math.abs(p[0] - cx) < 5 ? "middle" : (p[0] > cx ? "start" : "end");
      var lab = el("text", { x: lx, y: ly, "text-anchor": anchor, class: "lbl", style: "font-weight: 600" }, grp); lab.textContent = g.name;
      el("title", {}, grp).textContent = g.name;
    });
  }

  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

  var REGISTRY = { tpms: vizTPMS, bspline: vizBspline, uq: vizUQ, shap: vizSHAP, scaling: vizScaling, mater: vizMATER };
  window.KQTViz = {
    mount: function (fig) {
      if (!fig) return;
      var fn = REGISTRY[fig.getAttribute("data-viz")];
      var stage = fig.querySelector(".viz-stage");
      if (fn && stage) fn(stage);
    }
  };
})();
