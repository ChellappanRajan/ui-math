# 01 · Velocity (the derivative)

> **Question:** If the window gets 1px wider, how far does each card move, and how much does it grow?

## Baby steps: what is a derivative?

**Speed in a car.** You drive 60 km in 1 hour, so your speed is 60 km per hour. Speed is "how much one thing changes when another thing changes":

```
speed = change in distance / change in time
```

**Slope of a line.** On a graph, walk 1 step right and count how many steps you go up. That's the slope.

```
slope = rise / run
```

**Derivative.** The derivative of f is the slope of f at one exact point. We write it f′(x), or ∂f/∂x when there are several inputs and we only change x. Read ∂f/∂x as "how fast f changes when I nudge x only".

Three rules cover everything in this chapter:

| Function | Derivative | Why |
|---|---|---|
| a constant, like 16 | 0 | it never changes |
| a·x | a | x goes up 1, a·x goes up a |
| (x − 32) / 4 | 1/4 | the −32 doesn't move, ÷4 makes it 4 times slower |

## Apply it to our grid

Take W = 620. From [chapter 00](00-the-function.md) we have 4 columns and

```
cardWidth = (W − 32 − 48) / 4
```

**Card width speed.** Using the third rule:

```
∂cardWidth/∂W = 1/4 = 0.25
```

Every extra pixel of window adds 0.25px to each card, because 4 cards share it.

**Card position speed.** The card "Churn" is card 3, in column 2:

```
x = 16 + 2·(cardWidth + 16)
∂x/∂W = 2 · ∂cardWidth/∂W = 2 · 0.25 = 0.5
```

So Churn slides right at half the speed of the window edge. In general, a card in column k slides at `k/n`. The first column (k = 0) never moves.

**Above 900px** the box stops growing (∂c/∂W = 0). It only re-centres, because `margin: auto` splits the extra space between both sides, so every card moves at exactly 0.5.

**Check by hand.** At W = 620 the card width is 135, and at W = 630 it is 137.5. That's +2.5 over 10px, or 0.25 per px. ✓ Churn moves from x = 318 to x = 323: +5 over 10px, or 0.5. ✓

## Why calculus here?

A layout is something that **changes continuously** when you drag a slider, and calculus is the branch of math built to study change. The derivative answers "how fast?" for **every card and every prop in one calculation**, read straight from the formula. That is why Shu says the velocity is *computed, not measured*.

Our grid is **piecewise linear**: between breakpoints every formula is a straight line, so the derivative is a simple constant like 0.25. Exactly at a breakpoint the line breaks, and the derivative doesn't exist. That is the topic of [chapter 04](04-discontinuity.md).

## Without calculus: render twice and subtract

The non-calculus way is called a **finite difference**:

```
speed ≈ (layout(W + 10) − layout(W)) / 10
```

It works, but it has three problems:

1. **It costs extra layouts.** Each prop you study needs at least one more full layout run. With 10 props that's 10 extra runs. Automatic differentiation (what Shu's compiled function allows) gets all speeds in one pass.
2. **It breaks across breakpoints.** From 555 to 565px the grid goes from 3 to 4 columns. The card width jumps from 163.67 to 121.25, and the "speed" comes out as −4.24px per px. That is nonsense: nothing is actually shrinking at 4px per pixel.
3. **You have to pick the nudge size.** Too big and you cross breakpoints. Too small and rounding errors take over.

The exact derivative has none of these problems.

## Try it

- Demo: the "Velocity" section. Each card shows `→` (slide speed) and `↔` (grow speed).
- Code: `velocity(W)` in [`src/layout.js`](../src/layout.js), and `finiteDifference()` for the non-calculus version.

```js
import { velocity, finiteDifference } from '../src/layout.js';
velocity(620)[2];                               // { dx: 0.5, dw: 0.25 }
finiteDifference(555, 10, (L) => L.cw);         // -4.24  ← wrong across a breakpoint
```

## Check yourself

<details><summary>1. At W = 400 (2 columns), what is the card-width speed?</summary>

1/2 = 0.5. Two cards share each extra pixel.
</details>

<details><summary>2. Which card never moves sideways below 900px, and why?</summary>

Every card in the first column (k = 0): its x is 16 + 0·(…) = 16, a constant, and constants have derivative 0.
</details>

<details><summary>3. What does a derivative of 0.5 mean for an animation?</summary>

If the window edge moves 100px during a resize, that card moves 50px. You can plan the animation before it happens.
</details>

Next: [02 · Gradient](02-gradient.md)
