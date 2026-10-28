# 12 · Why calculus? (and what else)

> You've seen all 11 tricks. This chapter steps back and answers the big questions: why calculus, is it all calculus, and what would you do without it?

## The real starting point isn't calculus

Every trick depends on one move from [chapter 00](00-the-function.md): **turn the UI into a math function.** Before that move, the layout is JavaScript and CSS, which you can only *run*. After it, the layout is a formula, which you can *reason about*.

Shu's post uses many branches of math on that formula. Calculus is the biggest one, but not the only one.

## Why calculus specifically?

Calculus is the math of **continuous change**: how one quantity responds when another slides smoothly. UI props are exactly like that. Window width, font size, zoom, gap and padding are all continuous sliders. So the natural questions about UI are calculus questions:

| Natural question | Calculus tool |
|---|---|
| How fast does this card move when I resize? | derivative |
| Which way should I turn the knobs? | gradient |
| What will the layout be a bit further on? | linear approximation |
| What's the average over all screens? | integral |
| How do I make jumps smooth? | smooth functions (sigmoid) |

Our layout is **piecewise linear** (straight lines between breakpoints), which is the friendliest shape for calculus: derivatives are constants, predictions are exact, and integrals become short sums.

## Which math does each trick use?

| # | Trick | Branch of math | Is it calculus? |
|---|---|---|---|
| 01 | Velocity | differential calculus | ✓ yes |
| 02 | Gradient | multivariable calculus, optimisation | ✓ yes |
| 03 | Proof | interval arithmetic (numerical analysis) | ✗ no |
| 04 | Discontinuity | real analysis, solving equations | ~ the foundation of calculus |
| 05 | Geodesic | differential geometry / graph search | ~ in spirit |
| 06 | Smoothness | smooth approximations | ✓ yes (makes calculus possible) |
| 07 | Linearity | linear (Taylor) approximation | ✓ yes |
| 08 | Signal | Fourier analysis | ~ grew from calculus |
| 09 | Average | integral calculus, probability | ✓ yes |
| 10 | Imaginary | complex analysis | ~ calculus with complex numbers |
| 11 | Proof in CI | formal methods | ✗ no |

So the title "Calculus of Interfaces" is a good headline, but the honest summary is: **the UI becomes a math object, and all of math becomes available.**

## What would you do without calculus?

Every trick has a non-calculus alternative. They all share one pattern: **run the layout many times and look at the results.**

| # | Without calculus | Cost of that alternative |
|---|---|---|
| 01 | render twice, subtract (finite difference) | an extra layout per prop; wrong across breakpoints |
| 02 | try every combination, or random designs | explodes with the number of knobs (41²⁰ ≈ 10³²) |
| 03 | screenshot tests at fixed sizes | checks some sizes, proves nothing |
| 04 | render every pixel width, compare neighbours | slow; misses sub-pixel changes; explodes with more props |
| 05 | change all props at once, or a grid search | extra jumps, or a slow search |
| 06 | FLIP technique / View Transitions | only knows before and after; needs JS measurement |
| 07 | re-run layout every frame, or throttle | more work per frame, or choppy motion |
| 08 | list breakpoints and heights directly | actually *better* for a staircase |
| 09 | sample random visitors (Monte Carlo) | approximate; 100× samples for 10× accuracy |
| 10 | compute speed, set shadow by hand | more code, but simpler to read |
| 11 | screenshot review by a person | slow, subjective, misses sizes |

**When is the alternative fine?** For a 6-card grid on a modern laptop, honestly, most of the time. Browsers run layout fast. The math approach wins when:

- there are **many props** (sampling explodes, calculus doesn't),
- you need **guarantees** ("every screen", not "the screens I tried"),
- you need it **before shipping** (prediction instead of measurement),
- you care about **every in-between frame** (animation, resizing).

## The big ideas, in one paragraph each

1. **Sampling vs reasoning.** Running code tells you about the inputs you tried. Math tells you about *all* inputs at once.
2. **Hard vs soft decisions.** `if` statements (steps) are invisible to calculus. Replacing them with smooth dimmers is what makes slopes, optimisation and animation work. This is also the core idea of training neural networks.
3. **Piecewise thinking.** Most of the time the layout is simple (straight lines). All the drama happens at a few breakpoints. Find those, and everything in between is easy.
4. **Right tool, right shape.** Derivatives for speed, intervals for guarantees, integrals for averages, and a plain table when the data is a staircase.

## Where to go next

- Play with the [demo](../demo/index.html) and try to predict each number before you move a slider.
- Change `BASE` in [`src/layout.js`](../src/layout.js) (try gap 24, max-width 1200) and re-run `npm run numbers`.
- Read the original: [Calculus of Interfaces](https://calculus-of-interfaces.vercel.app/) by Shu Ding (Vercel Labs), inspired by Cheng Lou's Handwired.
- To learn the calculus itself: search for "3Blue1Brown Essence of Calculus", a free, visual video series that pairs very well with these chapters.
