// Every number quoted in docs/ is checked here. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as U from '../src/layout.js';

const close = (a, b, eps = 0.01) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

test('00: step() sum equals CSS auto-fill floor()', () => {
  for (let W = 150; W <= 1400; W += 0.5) assert.equal(U.hardCols(W), U.colsAt(Math.min(W, 900)));
  assert.deepEqual([1, 2, 3, 4, 5, 6].map((n) => U.need(n)), [152, 288, 424, 560, 696, 832]);
  assert.equal(U.layout(620).cw, 135);
  assert.equal(U.layout(620).H, 188);
});

test('01: exact velocity matches a small nudge between breakpoints', () => {
  const v = U.velocity(620);
  assert.deepEqual(v[2], { dx: 0.5, dw: 0.25 });
  close(U.finiteDifference(620, 10, (L) => L.cards[2].x), 0.5);
  close(U.finiteDifference(555, 10, (L) => L.cw), -4.24);
});

test('02: gradient descent removes every cut-off card', () => {
  const { knobs } = U.descend({ g: 16, p: 16, m: 120 }, 80);
  for (const W of U.SCREENS) assert.ok(U.layout(W, { ...U.BASE, ...knobs }).cw >= U.MIN_READABLE);
  assert.equal(knobs.g, 8);
  assert.equal(knobs.p, 8);
});

test('03: interval proof', () => {
  const I = U.intervalHeight(320, 1400);
  assert.deepEqual([I.Hlo, I.Hhi], [102, 274]);
  assert.equal(U.prove(320, 1400, U.BASE, 300).checks, 1);
  const r = U.prove(320, 1400, U.BASE, 250).pieces;
  assert.equal(r[0][2], 'fail');
  close(r[0][1], 424, 0.5);
});

test('04: breakpoints solved by hand', () => {
  assert.deepEqual(U.breakpoints().jumps.map((j) => j.width), [288, 424, 560, 696, 832]);
  assert.equal(U.layout(559).cw, 165);
  assert.equal(U.layout(560).cw, 120);
});

test('05: route jump counts', () => {
  const A = { W: 650, M: 900 }, B = { W: 1000, M: 500 }, l = (a, b, t) => a + (b - a) * t;
  assert.equal(U.countJumps((t) => ({ W: l(A.W, B.W, t), M: l(A.M, B.M, t) })), 3);
  assert.equal(U.countJumps((t) => (t < 0.5 ? { W: l(A.W, B.W, 2 * t), M: A.M } : { W: B.W, M: l(A.M, B.M, 2 * t - 1) })), 5);
  assert.equal(U.countJumps((t) => (t < 0.5 ? { W: A.W, M: l(A.M, B.M, 2 * t) } : { W: l(A.W, B.W, 2 * t - 1), M: B.M })), 1);
});

test('06: sigmoid blend is halfway at a breakpoint', () => {
  const t = U.layout(696, U.BASE, 14).cards[4];
  close(t.x, 288);
  close(t.y, 59);
});

test('07: linear prediction is exact until a breakpoint', () => {
  const La = U.layout(620), v = U.velocity(620);
  close(La.cw + v[0].dw * 60, U.layout(680).cw);
  assert.ok(Math.abs(La.cw + v[0].dw * 80 - U.layout(700).cw) > 30);
});

test('09: exact average agrees with sampling', () => {
  const exact = U.averageHeight([60, 15, 25]).average;
  close(exact, 210.25, 0.05);
  let seed = 7; const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  close(U.averageBySampling([60, 15, 25], 20000, U.BASE, rand), exact, 3);
});

test('10: no imaginary part, no lift; far from breakpoints, little lift', () => {
  assert.ok(U.lift(U.C(696, 0)).every((x) => x < 1e-9));
  assert.ok(Math.max(...U.lift(U.C(696, 24))) > 100);
});

test('11: CI proof catches the gap change', () => {
  assert.equal(U.prove(320, 1440, U.BASE, 300).pieces.length, 1);
  const after = U.prove(320, 1440, { ...U.BASE, g: 32 }, 300).pieces;
  assert.equal(after[0][2], 'fail');
  close(after[0][1], 456, 0.5);
});
