# 07 · Linearity (skip the layout while resizing)

> **Question:** While the user drags the window edge, the browser re-runs layout on every frame. Can we predict the layout instead?

## Baby steps: the tangent line

You know where a car is now, and its speed. Where will it be in 2 seconds?

```
future position = position now + speed × time
```

That's the whole idea. In math it's called **linear approximation** (or the tangent-line formula):

```
f(x) ≈ f(a) + f′(a) · (x − a)
```

- `a` is where you measured exactly.
- `f(a)` is the value there.
- `f′(a)` is the speed there ([chapter 01](01-velocity.md)).
- `x − a` is how far you moved.

For most functions this is only a guess that gets worse the further you go, because the speed itself changes. For a **straight line** the speed never changes, so the guess is **exact**.

## Apply it to our grid

Between breakpoints, every formula in our layout is a straight line in W ([chapter 00](00-the-function.md)). So the tangent line is not an approximation at all.

**Measure once at a = 620px:** card width = 135px, speed = 0.25 px per px.

**Predict W = 680px:**

```
cardWidth ≈ 135 + 0.25 × (680 − 620) = 135 + 15 = 150px
```

Actual (run the full layout): (680 − 80) / 4 = **150px**. Exact. ✓

**Predict W = 700px:**

```
cardWidth ≈ 135 + 0.25 × 80 = 155px
```

Actual: **120.8px**, because the window crossed the 696px breakpoint and a 5th column appeared. The prediction is off by 34px.

**So the rule is:**

1. Run the real layout once.
2. Remember every card's position and speed.
3. For each frame, use `position + speed × distance`, which is one multiply and one add per number.
4. When you cross a breakpoint ([chapter 04](04-discontinuity.md) tells you exactly where), run the real layout again.

Dragging from 620 to 690px might be 30 frames. That's 1 real layout and 30 cheap predictions instead of 30 layouts.

## Why calculus here?

This is the most practical idea in calculus: **if you know where something is and how fast it changes, you can predict nearby values.** Physics engines, weather models and GPS all use it. For our piecewise-linear layout it's even better than usual, because it's exact between breakpoints.

## Without it: just run layout every frame

That's what browsers do, and for a 6-card grid it's perfectly fast. The idea only pays off when layout is expensive: thousands of elements, complex text, or a slow device. Other common workarounds:

- **Throttling:** only re-layout every few frames. That's cheaper, but the animation looks choppy.
- **Scaling with `transform`:** stretch the old picture, then fix it at the end. That's fast but looks distorted while dragging.

Linear prediction gives correct positions on every frame for the cost of a multiply.

## Try it

- Demo: "Linearity" section. The dashed outlines are predictions and the solid cards are the real layout. Drag across 696px and watch them separate; press **Compute exactly here** to re-anchor.
- Code:

```js
const a = layout(620), v = velocity(620);
a.cw + v[0].dw * (680 - 620); // 150   (exact)
layout(680).cw;               // 150
```

## Check yourself

<details><summary>1. From a = 620, predict Churn's x at W = 650. (Churn is at x = 318, speed 0.5.)</summary>

318 + 0.5 × 30 = 333px. 650 is still below 696, so this is exact.
</details>

<details><summary>2. Why is the prediction exact here but only approximate for most functions?</summary>

The formula assumes the speed stays the same. In a straight line it does. In a curve, like x², the speed keeps changing, so errors grow with the distance (roughly with distance squared).
</details>

<details><summary>3. How do you know when to stop predicting?</summary>

When the window crosses a breakpoint. Our breakpoints are known in advance: 288, 424, 560, 696, 832px, plus the bend at 900px.
</details>

Next: [08 · Signal](08-signal.md)
