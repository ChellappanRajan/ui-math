# 09 · Average (integrate the UI over real traffic)

> **Question:** Given the screens people actually use, how tall is the page on average?

## Baby steps: from average to integral

**Plain average.** Three friends are 150, 160 and 170cm tall. The average is (150 + 160 + 170) / 3 = 160cm.

**Weighted average.** Your final grade is 70% exam and 30% homework. You got 80 on the exam and 100 on homework:

```
grade = 0.7 × 80 + 0.3 × 100 = 56 + 30 = 86
```

Each value is multiplied by "how much it counts", and the weights add up to 1.

**Integral.** Now imagine infinitely many values, one for every possible window width: 375px, 375.1px, 375.01px… Each has its own weight, "how common it is", called a **density** ρ(w) (the Greek letter rho). The weighted average becomes:

```
average = ∫ H(w) · ρ(w) dw
```

Read the ∫ sign as "add up, over every width, infinitely many thin slices". Each slice is "height at that width" × "how many people use that width". That's all an integral is: a weighted average with infinitely many pieces.

## Apply it to our grid

**Step 1: who visits?** Say 60% phones (widths around 390px), 15% tablets (around 800px) and 25% laptops (around 1440px). Each group is a bell curve, because not every phone is exactly 390px.

**Step 2: notice the shortcut.** Page height is a staircase ([chapter 08](08-signal.md)). Inside one step the height doesn't change, so the integral of each step is just:

```
(height of that step) × (share of visitors whose width lands on that step)
```

The share under a bell curve between two widths has a ready-made formula (the normal CDF), so there's no slow adding-up. This is a **closed form**: an exact answer you can write down.

**Step 3: add up the steps.**

| Widths | Columns | Height | Share of visitors | Height × share |
|---|---|---|---|---|
| below 288 | 1 | 532px | 0.00% | 0.0 |
| 288–423 | 2 | 274px | 54.78% | 150.1 |
| 424–831 | 3–5 | 188px | 16.29% | 30.6 |
| 832 and up | 6 | 102px | 28.91% | 29.5 |
| | | | **total** | **≈ 210.25px** |

The average visitor sees a page **210.25px** tall. Notice that most phone users get 2 columns, but a few wide phones (5.2% of all visitors) get 3.

## Why calculus here?

The question "what's the average over a *continuous* range of possibilities?" is exactly what integrals were invented for. And because our layout is piecewise flat, the integral collapses to a short sum: an exact answer with no guessing.

## Without it: sample visitors

The non-calculus way is **Monte Carlo sampling**: pick lots of random visitors from the traffic mix, lay out the page for each one and average the results.

| Visitors sampled | Average height | Error vs exact |
|---|---|---|
| 100 | 201.76px | 8.5px |
| 10,000 | 210.48px | 0.2px |
| exact integral | 210.25px | 0 |

Sampling always gets close, but the error only shrinks with the square root of the number of samples: 100 times more samples buys about 10 times less error. The integral is exact and instant.

A third option is real-user monitoring: measure actual page heights in production. That's great for truth, but you only learn the answer *after* shipping. The integral answers it *before* you ship a design change.

## Try it

- Demo: "Average" section. Move the phone, tablet and laptop sliders and watch the exact average update.
- Code: `averageHeight([60, 15, 25])` and `averageBySampling(...)` in [`src/layout.js`](../src/layout.js).

## Check yourself

<details><summary>1. If 100% of visitors are on laptops, what's the average height?</summary>

Laptop widths (around 1440px) are all above 832px, so everyone gets 6 columns: 102px.
</details>

<details><summary>2. Why did we not need to "add infinitely many slices" by hand?</summary>

Height is constant on each step, so each step's slices all have the same height. We only needed the total share per step, which the bell-curve formula gives directly.
</details>

<details><summary>3. When would the integral NOT have a neat closed form?</summary>

If height changed in a complicated curvy way inside each step (for example with text wrapping). Then you'd compute it numerically, which is still far more precise than random sampling.
</details>

Next: [10 · Imaginary](10-imaginary.md)
