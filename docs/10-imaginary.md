# 10 · Imaginary (a complex window width)

> **Question:** What happens if the window width is a complex number, like 696 + 24i px?

## Baby steps: what is i?

**The number line** runs left (negative) to right (positive). Every ordinary number is a point on it.

**The puzzle.** What number times itself gives −1? Not 1 (1 × 1 = 1), not −1 (−1 × −1 = 1). Nothing on the line works.

**The invention.** Mathematicians simply named a new number **i** with the rule `i × i = −1`. It doesn't live on the number line. It points **sideways**, off the line.

**Complex numbers** combine both directions: `a + b·i`.

- `a` is the **real part** (left–right, the usual direction).
- `b` is the **imaginary part** (the new sideways direction).

You can add and multiply them with normal algebra, remembering i² = −1:

```
(2 + 3i) + (1 + i) = 3 + 4i
(2 + 3i) × (1 + i) = 2 + 2i + 3i + 3i² = 2 + 5i − 3 = −1 + 5i
```

So complex numbers give you **a second dimension for free**, without changing any formulas.

## The key fact: the imaginary part measures speed

Put a tiny imaginary nudge into a function and look at the imaginary part of the answer. Example with f(x) = x² at x = 3, nudged by 0.01i:

```
f(3 + 0.01i) = 9 + 2·3·0.01i + (0.01i)²
             = 9 + 0.06i − 0.0001
```

The imaginary part is **0.06**. The speed of x² at 3 is f′(3) = 6, and 0.01 × 6 = 0.06. In general:

```
imaginary part of f(x + y·i)  ≈  y × f′(x)
```

This is a real, standard technique called **complex-step differentiation**, and engineers use it to compute derivatives very precisely. For us it means: **things that move fast get a big imaginary part.**

## Apply it to our grid

Feed `W = a + y·i` into the **softened** layout from [chapter 06](06-smoothness.md) (the sigmoid version; the hard step can't take complex numbers). Every card position comes out complex:

- **Real part** → where we draw the card (same as normal).
- **Imaginary part** → how much the card is *moving*. We draw that as **lift**: a bigger shadow and a slightly larger card.

**One clean-up step.** Away from breakpoints, cards slide steadily ([chapter 01](01-velocity.md)), so they'd all lift a little all the time. We subtract that predictable part (y × ordinary speed). What's left is the lift caused by the *jump*.

**Results** (y = 24):

| Window | Lift of each card (Revenue → Uptime) |
|---|---|
| 696 + 0i (no imaginary part) | 0, 0, 0, 0, 0, 0 |
| 620 + 24i (far from a breakpoint) | 1, 2, 3, 10, 2, 7 (small) |
| 696 + 24i (right on a breakpoint) | 17, 34, 51, 68, **332**, 101 |

At 696px, "Tickets" is the card that moves from row 2 up to the end of row 1, the longest trip. It lifts by far the most. That's exactly what good motion design does by hand: **an element travelling across the screen rises, passes over the others, and lands.**

## Poles: why it gets dramatic near a breakpoint

The sigmoid is `1 / (1 + e^(−x))`. Euler found that `e^(iπ) = −1`. So when `x = iπ` the bottom of the fraction becomes 1 + (−1) = 0, and dividing by 0 blows up to infinity. That point is called a **pole**.

In our layout, x = (W − breakpoint) / τ, so the pole sits at

```
W = breakpoint + π·τ·i = 696 + 47.1i   (with τ = 15)
```

Picture the complex plane as a floor: real width across and imaginary height going away from you. Above every breakpoint, 47px "up", there's a spike to infinity. That's Shu's "every breakpoint becomes a pole above the real line". The demo keeps the imaginary part below 44, so we walk *around* the spike, not into it. The closer you get, the higher the cards lift.

## Why this math? (Honestly)

Complex analysis is a beautiful branch of mathematics that grew from calculus. **Complex-step derivatives are genuinely useful.** Using the imaginary part *as elevation* is a creative design idea, not an established technique. It's in the same spirit as the Fourier chapter: it shows how much becomes possible once the UI is a function.

## Without it: compute speed and map it yourself

You can get the same visual effect without complex numbers:

1. Compute each card's speed (chapter 01) or its distance travelled during a transition.
2. Set `box-shadow` and `scale()` from that number, for example in a keyframe animation.

That's simpler for a real product and easier for teammates to read. The complex-number version is elegant because it needs **no new code**: the same layout formula, fed a different kind of number, produces the extra dimension by itself.

## Try it

- Demo: "Imaginary" section. Press **Walk around the 696px breakpoint**, or drag the imaginary slider up near 696px.
- Code: `complexLayout(z)` and `lift(z)` in [`src/layout.js`](../src/layout.js).

```js
lift(C(696, 24)); // [16.9, 33.8, 50.7, 67.6, 331.6, 101.4]
lift(C(696, 0));  // all 0: no imaginary part, no lift
```

## Check yourself

<details><summary>1. What is i × i × i?</summary>

(i × i) × i = −1 × i = −i.
</details>

<details><summary>2. For card width (W − 80)/4, what is the imaginary part when W = 620 + 24i?</summary>

(620 + 24i − 80)/4 = 135 + 6i. The imaginary part is 6 = 24 × 0.25, which is y × speed, exactly.
</details>

<details><summary>3. Why can't the hard step() take a complex number?</summary>

step() asks "is x ≥ 0?". Complex numbers have no "bigger than": is 1 + i bigger than 2? There's no answer. The sigmoid only uses + × ÷ and e^x, which all work on complex numbers.
</details>

Next: [11 · Proof in CI](11-proof-in-ci.md)
