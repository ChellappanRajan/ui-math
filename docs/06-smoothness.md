# 06 · Smoothness (free layout animation)

> **Question:** What if we replace every light switch in the layout with a dimmer?

## Baby steps: light switch vs dimmer

**step(x)** is a light switch: off (0) until x reaches 0, then instantly on (1).

**sigmoid(x)** is a dimmer. It slides from 0 to 1 smoothly:

```
sigmoid(x) = 1 / (1 + e^(−x))
```

| x | −4 | −2 | 0 | 2 | 4 |
|---|---|---|---|---|---|
| step(x) | 0 | 0 | 1 | 1 | 1 |
| sigmoid(x) | 0.018 | 0.119 | **0.5** | 0.881 | 0.982 |

Far from 0 they agree. Near 0 the sigmoid is "halfway on".

**Softness τ (tau).** We use `sigmoid(x / τ)`. A bigger τ stretches the slide over more pixels. With τ = 14, the switch goes from "mostly off" to "mostly on" over about 60px of window width. As τ shrinks towards 0, the sigmoid becomes the step again.

## Apply it to our grid

**Step 1: how much each layout counts.** For each column count n we have a switch `s(n)` = "is there room for n columns?". The weight of "exactly n columns" is

```
weight(n) = s(n) − s(n + 1)
```

With hard switches, exactly one weight is 1 and the rest are 0. With dimmers, neighbours share.

**Step 2: blend the layouts.** Each card's position is the weighted average of where it would be in each layout:

```
x = Σ weight(n) · x_in_layout_n
```

**Worked example: W = 696 (exactly a breakpoint), τ = 14.**

- s(5) = sigmoid(0) = 0.5 (halfway: "is there room for 5?")
- s(4) ≈ 1 (plenty of room for 4)
- s(6) ≈ 0 (no room for 6)

So weight(4) = 0.5 and weight(5) = 0.5. Now follow the card "Tickets" (card 5):

| | x | y | width |
|---|---|---|---|
| in the 4-column layout (2nd row, first slot) | 16 | 102 | 154 |
| in the 5-column layout (1st row, last slot) | 560 | 16 | 120 |
| **blend 50 / 50** | **288** | **59** | **137** |

At this exact width, Tickets is *halfway along its journey* from the start of row 2 to the end of row 1. Drag the width a little either side and it slides the rest of the way. **The card glides instead of teleporting**, and there is no animation code anywhere.

## Why calculus here?

Calculus loves **smooth** functions, ones with a slope at every point. The step function has no useful slope (flat everywhere, infinite at the jump). The sigmoid has a nice slope everywhere. This one change:

- makes layout animations appear (this chapter),
- gives gradient descent something to feel ([chapter 02](02-gradient.md)),
- lets complex numbers work ([chapter 10](10-imaginary.md)).

Turning hard decisions into soft ones is a classic trick in machine learning, and it's the reason neural networks can be trained at all.

## Without it: animate between before and after

The usual way to animate a layout change is the **FLIP technique**:

1. **F**irst: measure where every card is now.
2. **L**ast: apply the change and measure again.
3. **I**nvert: use `transform` to move each card back to its old spot.
4. **P**lay: remove the transform with a CSS transition.

Newer browsers also offer the View Transitions API, which does something similar for you. These work well, but they only know *before* and *after*, and they need JavaScript to measure the page. The softened math gives **every in-between frame** directly from the formula, and the motion follows the layout's own rules.

## Try it

- Demo: "Smoothness" section. Press **Play a resize**, then untick the checkbox and play again to compare.
- Code: `layout(W, BASE, tau)` in [`src/layout.js`](../src/layout.js). Pass `tau = 0` for hard switches.

```js
layout(696, BASE, 14).cards[4]; // { x: 288, y: 59, w: 137 }  ← halfway
layout(696, BASE, 0).cards[4];  // jumps straight to the 5-column spot
```

## Check yourself

<details><summary>1. What does sigmoid(100) roughly equal?</summary>

Almost exactly 1. Far from 0 a sigmoid behaves like a step.
</details>

<details><summary>2. What happens to the animation if τ is very large, like 200?</summary>

Every layout blends with its neighbours almost all the time. Cards look smeared halfway between layouts even far from breakpoints. Too soft is as bad as too hard.
</details>

<details><summary>3. Why is weight(n) = s(n) − s(n + 1)?</summary>

s(n) means "at least n columns fit". Subtract "at least n + 1 fit" and what's left is "exactly n".
</details>

Next: [07 · Linearity](07-linearity.md)
