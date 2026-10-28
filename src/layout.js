// The one function used in every chapter: a 6-card dashboard grid,
// written as plain math instead of CSS.
//
// The CSS it copies:
//   .grid { display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
//           gap: 16px; padding: 16px; max-width: 900px; margin: 0 auto; }
//   .grid > div { height: 70px; }
//
// Run `node examples/numbers.js` to print every number used in the docs.

export const N = 6;          // number of cards
export const CH = 70;        // card height in px
export const BASE = { g: 16, p: 16, m: 120, M: 900 }; // gap, padding, min card width, max-width

// ---------- the four building blocks ----------
export const step = (x) => (x >= 0 ? 1 : 0);              // light switch
export const sigmoid = (x) => 1 / (1 + Math.exp(-x));       // dimmer switch
export const relu = (x) => Math.max(0, x);                  // "no negatives"

// Width the box needs so that n cards fit in one row.
export function need(n, P = BASE) {
  return 2 * P.p + n * P.m + (n - 1) * P.g;
}

// Number of columns, written ONLY with step(): one switch per extra column.
export function hardCols(W, P = BASE) {
  const c = Math.min(W, P.M);
  let n = 1;
  for (let k = 2; k <= N; k++) n += step(c - need(k, P));
  return n;
}

// Same thing written with floor(), the way CSS grid's auto-fill works.
export function colsAt(c, P = BASE) {
  return Math.min(N, Math.max(1, Math.floor((c - 2 * P.p + P.g) / (P.m + P.g))));
}

export const heightForRows = (rows, P = BASE) => 2 * P.p + rows * CH + (rows - 1) * P.g;

// Layout for a FIXED number of columns n and box width c.
export function layoutN(n, c, P = BASE) {
  const inner = c - 2 * P.p;
  const cw = (inner - (n - 1) * P.g) / n;
  const rows = Math.ceil(N / n);
  const cards = [];
  for (let i = 0; i < N; i++) {
    const col = i % n;
    const row = Math.floor(i / n);
    cards.push({ x: P.p + col * (cw + P.g), y: P.p + row * (CH + P.g), w: cw });
  }
  return { cards, cw, rows, H: heightForRows(rows, P) };
}

// How much each "n columns" layout counts. With tau = 0 exactly one gets 1
// (hard switches). With tau > 0 neighbours share the weight (dimmers).
export function weights(c, P = BASE, tau = 0) {
  const s = [];
  for (let n = 1; n <= N + 1; n++) {
    if (n === 1) s[n] = 1;
    else if (n === N + 1) s[n] = 0;
    else s[n] = tau > 0 ? sigmoid((c - need(n, P)) / tau) : step(c - need(n, P));
  }
  const w = [];
  for (let n = 1; n <= N; n++) w[n] = s[n] - s[n + 1];
  return w;
}

// THE function: UI = f(W, props). Returns card boxes, card width, page height.
export function layout(W, P = BASE, tau = 0) {
  const c = Math.min(W, P.M);
  const off = (W - c) / 2; // margin: 0 auto centres the box
  const w = weights(c, P, tau);
  const cards = Array.from({ length: N }, () => ({ x: 0, y: 0, w: 0 }));
  let H = 0, cw = 0, cols = 0;
  for (let n = 1; n <= N; n++) {
    if (w[n] === 0) continue;
    const L = layoutN(n, c, P);
    L.cards.forEach((k, i) => {
      cards[i].x += w[n] * k.x;
      cards[i].y += w[n] * k.y;
      cards[i].w += w[n] * k.w;
    });
    H += w[n] * L.H;
    cw += w[n] * L.cw;
    cols += w[n] * n;
  }
  cards.forEach((k) => (k.x += off));
  return { cards, H, cw, cols, c, off, W };
}

// ---------- Trick 1: velocity (exact derivative, no re-render) ----------
export function velocity(W, P = BASE) {
  const n = hardCols(W, P);
  const boxGrows = W < P.M ? 1 : 0;   // dc/dW
  const centre = W < P.M ? 0 : 0.5;   // d(offset)/dW
  return Array.from({ length: N }, (_, i) => ({
    dx: centre + ((i % n) * boxGrows) / n,
    dw: boxGrows / n,
  }));
}

// The "without calculus" way: render twice and subtract.
export function finiteDifference(W, h, pick, P = BASE) {
  return (pick(layout(W + h, P)) - pick(layout(W, P))) / h;
}

// ---------- Trick 2: gradient descent ----------
export const SCREENS = [360, 768, 1280];
export const MIN_READABLE = 140;
export function score(knobs, tau = 6) {
  let s = 0;
  for (const W of SCREENS) {
    const L = layout(W, { ...BASE, ...knobs }, tau);
    s += L.H / 100 + relu(MIN_READABLE - L.cw);
  }
  return s;
}
export const KNOB_LIMITS = { g: [8, 48], p: [8, 48], m: [80, 260] };
export function gradient(knobs, tau = 6, h = 0.5) {
  const gr = {};
  for (const k of ['g', 'p', 'm']) {
    const up = { ...knobs, [k]: knobs[k] + h };
    const down = { ...knobs, [k]: knobs[k] - h };
    gr[k] = (score(up, tau) - score(down, tau)) / (2 * h);
  }
  return gr;
}
export function descend(start, steps = 80) {
  let P = { ...start };
  const history = [score(P)];
  for (let it = 0; it < steps; it++) {
    const tau = Math.max(4, 40 * Math.pow(0.95, it)); // start very soft, sharpen
    const lr = Math.max(0.3, 3 * Math.pow(0.97, it));
    const gr = gradient(P, tau);
    const norm = Math.hypot(gr.g, gr.p, gr.m);
    if (norm < 1e-9) break;
    for (const k of ['g', 'p', 'm']) {
      const [lo, hi] = KNOB_LIMITS[k];
      P[k] = Math.min(hi, Math.max(lo, P[k] - (lr * gr[k]) / norm));
    }
    history.push(score(P));
  }
  return { knobs: P, history };
}

// ---------- Trick 3: interval arithmetic proof ----------
export function intervalHeight(lo, hi, P = BASE) {
  const clo = Math.min(lo, P.M), chi = Math.min(hi, P.M);
  const nlo = colsAt(clo, P), nhi = colsAt(chi, P);
  const rlo = Math.ceil(N / nhi), rhi = Math.ceil(N / nlo);
  return { clo, chi, nlo, nhi, rlo, rhi, Hlo: heightForRows(rlo, P), Hhi: heightForRows(rhi, P) };
}
export function prove(lo, hi, P, limit) {
  const pieces = [];
  let checks = 0;
  (function check(a, b, depth) {
    checks++;
    const I = intervalHeight(a, b, P);
    if (I.Hhi <= limit) pieces.push([a, b, 'pass']);
    else if (I.Hlo > limit) pieces.push([a, b, 'fail']);
    else if (b - a < 0.5 || depth > 16) pieces.push([a, b, 'mixed']);
    else { const mid = (a + b) / 2; check(a, mid, depth + 1); check(mid, b, depth + 1); }
  })(lo, hi, 0);
  const merged = [];
  for (const s of pieces) {
    const last = merged[merged.length - 1];
    if (last && last[2] === s[2]) last[1] = s[1];
    else merged.push(s.slice());
  }
  return { pieces: merged, checks };
}

// ---------- Trick 4: discontinuities, solved by hand ----------
export function breakpoints(P = BASE) {
  const jumps = [];
  for (let n = 2; n <= N; n++) { const w = need(n, P); if (w < P.M) jumps.push({ width: w, columns: n }); }
  return { jumps, bend: P.M };
}

// ---------- Trick 5: least-jump path in prop space ----------
export function countJumps(path, samples = 800) {
  let jumps = 0, prev = null;
  for (let i = 0; i <= samples; i++) {
    const q = path(i / samples);
    const n = hardCols(q.W, { ...BASE, M: q.M });
    if (prev !== null && n !== prev) jumps++;
    prev = n;
  }
  return jumps;
}

// ---------- Trick 8: discrete Fourier transform ----------
export function dft(signal) {
  const n = signal.length, out = [];
  for (let k = 0; k <= n / 2; k++) {
    let re = 0, im = 0;
    for (let j = 0; j < n; j++) {
      const a = (2 * Math.PI * k * j) / n;
      re += signal[j] * Math.cos(a);
      im -= signal[j] * Math.sin(a);
    }
    out.push({ k, re, im, amp: Math.hypot(re, im) * (k === 0 || k === n / 2 ? 1 : 2) });
  }
  return out;
}
export function rebuild(spectrum, n, keep) {
  const kept = spectrum.slice().sort((a, b) => b.amp - a.amp).slice(0, keep);
  return Array.from({ length: n }, (_, j) => {
    let s = 0;
    for (const c of kept) {
      const f = c.k === 0 || c.k === n / 2 ? 1 : 2;
      const a = (2 * Math.PI * c.k * j) / n;
      s += f * (c.re * Math.cos(a) - c.im * Math.sin(a));
    }
    return s / n;
  });
}

// ---------- Trick 9: exact average over real traffic ----------
const erf = (x) => {
  const s = Math.sign(x); x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
};
export const normalCdf = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
export const TRAFFIC_GROUPS = [
  { name: 'phones', mean: 390, sd: 25 },
  { name: 'tablets', mean: 800, sd: 50 },
  { name: 'laptops', mean: 1440, sd: 160 },
];
export function averageHeight(mix, P = BASE) {
  const total = mix.reduce((a, b) => a + b, 0) || 1;
  const share = mix.map((v) => v / total);
  const edges = [-Infinity];
  for (let n = 2; n <= N; n++) edges.push(need(n, P));
  edges.push(Infinity);
  const pieces = [];
  let avg = 0;
  for (let k = 0; k < N; k++) {
    const n = k + 1, H = heightForRows(Math.ceil(N / n), P);
    let s = 0;
    TRAFFIC_GROUPS.forEach((g, i) => (s += share[i] * (normalCdf((edges[k + 1] - g.mean) / g.sd) - normalCdf((edges[k] - g.mean) / g.sd))));
    pieces.push({ from: edges[k], to: edges[k + 1], columns: n, H, share: s });
    avg += H * s;
  }
  return { average: avg, pieces };
}
export function averageBySampling(mix, visitors, P = BASE, rand = Math.random) {
  const total = mix.reduce((a, b) => a + b, 0);
  let sum = 0;
  for (let v = 0; v < visitors; v++) {
    let r = rand() * total, gi = 0;
    while (r > mix[gi]) { r -= mix[gi]; gi++; }
    const g = TRAFFIC_GROUPS[Math.min(gi, 2)];
    const u1 = rand() || 1e-12, u2 = rand();
    const W = g.mean + g.sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    sum += layout(W, P).H;
  }
  return sum / visitors;
}

// ---------- Trick 10: complex widths ----------
export const C = (re, im = 0) => ({ re, im });
export const cadd = (a, b) => C(a.re + b.re, a.im + b.im);
export const csub = (a, b) => C(a.re - b.re, a.im - b.im);
export const cmul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
export const cscale = (a, k) => C(a.re * k, a.im * k);
export const cdiv = (a, b) => { const d = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
export const csigmoid = (z) => { const e = Math.exp(-z.re); return cdiv(C(1), cadd(C(1), C(e * Math.cos(z.im), -e * Math.sin(z.im)))); };

// Soft layout with a complex window width z (no max-width, so the box = z).
export function complexLayout(z, P = BASE, tau = 15) {
  const s = [];
  for (let n = 1; n <= N + 1; n++) s[n] = n === 1 ? C(1) : n === N + 1 ? C(0) : csigmoid(cscale(csub(z, C(need(n, P))), 1 / tau));
  const cards = Array.from({ length: N }, () => ({ x: C(0), y: C(0), w: C(0) }));
  for (let n = 1; n <= N; n++) {
    const wn = csub(s[n], s[n + 1]);
    const cw = cscale(csub(z, C(2 * P.p + (n - 1) * P.g)), 1 / n);
    for (let i = 0; i < N; i++) {
      const col = i % n, row = Math.floor(i / n);
      cards[i].x = cadd(cards[i].x, cmul(wn, cadd(C(P.p), cscale(cadd(cw, C(P.g)), col))));
      cards[i].y = cadd(cards[i].y, cmul(wn, C(P.p + row * (CH + P.g))));
      cards[i].w = cadd(cards[i].w, cmul(wn, cw));
    }
  }
  return cards;
}
// Lift = imaginary part left over after removing ordinary steady sliding.
// (Im f(x + iy) ≈ y·f′(x), so steady movers have a small, predictable
//  imaginary part; we subtract it so only the jump near a breakpoint lifts.)
export function lift(z, P = BASE, tau = 15) {
  const cards = complexLayout(z, P, tau);
  const n = hardCols(z.re, { ...P, M: Infinity });
  return cards.map((k, i) => {
    const vx = (i % n) / n, vw = 1 / n;
    return Math.abs(k.x.im - z.im * vx) + Math.abs(k.y.im) + Math.abs(k.w.im - z.im * vw);
  });
}
