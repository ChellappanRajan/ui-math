// Prints every number quoted in the docs, so you can check them yourself.
// Run: node examples/numbers.js
import * as U from '../src/layout.js';

const line = (t) => console.log('\n== ' + t + ' ==');

line('00 The function');
for (let n = 1; n <= 6; n++) console.log(`need(${n}) = ${U.need(n)}px`);
for (const W of [250, 400, 620, 1000]) {
  const L = U.layout(W);
  console.log(`W=${W}: columns=${U.hardCols(W)} cardWidth=${L.cw.toFixed(2)} H=${L.H}`);
}

line('01 Velocity at W=620');
const v = U.velocity(620);
console.log('Churn (card 3):', v[2]);
console.log('cardWidth 620 -> 630:', U.layout(620).cw, '->', U.layout(630).cw);
console.log('Churn x 620 -> 630:', U.layout(620).cards[2].x, '->', U.layout(630).cards[2].x);
console.log('finite diff across 560 (555 -> 565), card width:', U.finiteDifference(555, 10, (L) => L.cw).toFixed(2));
console.log('cardWidth at 555 and 565:', U.layout(555).cw.toFixed(2), U.layout(565).cw.toFixed(2));

line('02 Gradient');
const start = { g: 16, p: 16, m: 120 };
console.log('start score (tau=6):', U.score(start).toFixed(3));
U.SCREENS.forEach((W) => { const L = U.layout(W, { ...U.BASE, ...start }); console.log(` start ${W}: cw=${L.cw.toFixed(1)} H=${L.H}`); });
const res = U.descend(start, 80);
console.log('end knobs:', res.knobs, 'score:', res.history.at(-1).toFixed(3));
U.SCREENS.forEach((W) => { const L = U.layout(W, { ...U.BASE, ...res.knobs }); console.log(` end ${W}: cols=${U.hardCols(W, { ...U.BASE, ...res.knobs })} cw=${L.cw.toFixed(1)} H=${L.H}`); });
console.log('brute force grid, 41 values per knob, 3 knobs:', 41 ** 3, 'combos; 20 knobs:', (41 ** 20).toExponential(2));

line('03 Proof');
console.log('[320,1400] interval:', U.intervalHeight(320, 1400));
console.log('limit 300:', JSON.stringify(U.prove(320, 1400, U.BASE, 300)));
console.log('limit 250:', JSON.stringify(U.prove(320, 1400, U.BASE, 250)));
console.log('[320,860] interval:', U.intervalHeight(320, 860));
console.log('[860,1400] interval:', U.intervalHeight(860, 1400));

line('04 Discontinuity');
console.log(U.breakpoints());
for (const W of [559, 560, 899, 900, 901]) console.log(`W=${W} cw=${U.layout(W).cw.toFixed(2)}`);

line('05 Geodesic');
const A = { W: 650, M: 900 }, B = { W: 1000, M: 500 }, lerp = (a, b, t) => a + (b - a) * t;
const straight = (t) => ({ W: lerp(A.W, B.W, t), M: lerp(A.M, B.M, t) });
const wFirst = (t) => (t < 0.5 ? { W: lerp(A.W, B.W, 2 * t), M: A.M } : { W: B.W, M: lerp(A.M, B.M, 2 * t - 1) });
const mFirst = (t) => (t < 0.5 ? { W: A.W, M: lerp(A.M, B.M, 2 * t) } : { W: lerp(A.W, B.W, 2 * t - 1), M: B.M });
console.log('straight', U.countJumps(straight), 'window-first', U.countJumps(wFirst), 'max-width-first', U.countJumps(mFirst));
let peak = 0; for (let i = 0; i <= 1000; i++) { const q = straight(i / 1000); peak = Math.max(peak, Math.min(q.W, q.M)); }
console.log('straight path: highest box width', peak.toFixed(1));

line('06 Smoothness at W=696, tau=14');
console.log('weights:', U.weights(696, U.BASE, 14).map((x) => x && +x.toFixed(3)));
console.log('Tickets (card 5) soft:', U.layout(696, U.BASE, 14).cards[4]);
console.log('Tickets in 4 cols:', U.layoutN(4, 696).cards[4], 'in 5 cols:', U.layoutN(5, 696).cards[4]);
for (const x of [-4, -2, 0, 2, 4]) console.log(`sigmoid(${x}) = ${U.sigmoid(x).toFixed(3)}`);

line('07 Linearity from a=620');
const La = U.layout(620), va = U.velocity(620);
for (const W of [680, 700]) {
  const pred = La.cw + va[0].dw * (W - 620);
  console.log(`W=${W}: predicted cw=${pred.toFixed(2)} actual=${U.layout(W).cw.toFixed(2)}`);
}

line('08 Signal');
const NS = 256, xs = [], ys = [];
for (let j = 0; j < NS; j++) { const W = 200 + (900 * j) / NS; xs.push(W); ys.push(U.layout(W).H); }
const spec = U.dft(ys);
console.log('mean height a0 =', (spec[0].re / NS).toFixed(1));
for (const K of [1, 6, 30]) {
  const r = U.rebuild(spec, NS, K);
  const err = Math.max(...r.map((y, j) => Math.abs(y - ys[j])));
  console.log(`keep ${K}: worst error ${err.toFixed(1)}px`);
}

line('09 Average, mix 60/15/25');
const avg = U.averageHeight([60, 15, 25]);
console.log('exact average', avg.average.toFixed(2));
avg.pieces.forEach((p) => console.log(` ${p.columns} cols H=${p.H} share=${(p.share * 100).toFixed(2)}%`));
let seed = 42; const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
for (const n of [100, 10000]) console.log(`sampling ${n} visitors:`, U.averageBySampling([60, 15, 25], n, U.BASE, rand).toFixed(2));

line('10 Imaginary');
for (const z of [U.C(696, 24), U.C(696, 0), U.C(850, 24), U.C(620, 24)]) {
  console.log(`z=${z.re}+${z.im}i lifts:`, U.lift(z).map((x) => +x.toFixed(1)));
}
console.log('pole height pi*tau =', (Math.PI * 15).toFixed(1));

line('11 CI');
console.log('before gap16:', JSON.stringify(U.prove(320, 1440, U.BASE, 300).pieces));
console.log('after gap32:', JSON.stringify(U.prove(320, 1440, { ...U.BASE, g: 32 }, 300).pieces));
console.log('gap32 2 cols height:', U.heightForRows(3, { ...U.BASE, g: 32 }), 'need(3) with gap32:', U.need(3, { ...U.BASE, g: 32 }));
