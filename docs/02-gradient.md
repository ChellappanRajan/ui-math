# 02 · Gradient (let math pick the props)

> **Question:** On a phone (360px), tablet (768px) and laptop (1280px), no card should be narrower than 140px (so the description text isn't cut off), and the pages should be as short as possible. Which gap, padding and minimum card width do that?

## Baby steps: walking downhill in fog

You're on a hill in thick fog and want to reach the bottom. You can't see the valley, but you can feel the ground under your feet. The trick: **feel which way is downhill, take a small step that way, repeat.** That's gradient descent.

**One knob first.** Say the "badness" of a design is

```
f(x) = (x − 3)²
```

The best x is clearly 3 (badness 0). Pretend we don't know that. The derivative is

```
f′(x) = 2·(x − 3)
```

Start at x = 0. The slope is f′(0) = −6. Negative means "going right goes down", so step right:

```
x_new = x − 0.1 · f′(x)
x: 0 → 0.6 → 1.08 → 1.46 → 1.77 → … → 3
```

**Several knobs.** With three knobs (gap, padding, card width) there are three slopes. Put them in a list and you have the **gradient**:

```
gradient = ( ∂score/∂gap,  ∂score/∂padding,  ∂score/∂cardMin )
```

It points straight uphill. Step the opposite way.

## Apply it to our grid

**Step 1: write the goal as one number, the "score".** Lower is better.

```
score = Σ over 3 screens [ pageHeight / 100  +  ReLU(140 − cardWidth) ]
```

- `pageHeight / 100` rewards short pages.
- `ReLU(140 − cardWidth)` is 0 when the card is wide enough, and grows by 1 for every pixel it's too narrow. This is a **penalty**.

**Step 2: the starting design** (gap 16, padding 16, min card 120):

| Screen | card width | height | penalty |
|---|---|---|---|
| 360px | 156px ✓ | 274px | 0 |
| 768px | 134.4px ✗ | 188px | 5.6 |
| 1280px | 131.3px ✗ | 102px | 8.7 |

Score ≈ 5.64 + 14.3 ≈ **19.9**. Two screens cut off text.

**Step 3: walk downhill 80 times.** The result is gap 8px, padding 8px, min card ≈ 120px:

| Screen | columns | card width | height |
|---|---|---|---|
| 360px | 2 | 168px ✓ | 242px |
| 768px | 5 | 144px ✓ | 164px |
| 1280px | 6 | 140.7px ✓ | 86px |

Score ≈ **4.9**. No text is cut off, and the pages got shorter too. Tighter spacing made room for wider cards *and* saved height.

## The catch: light switches have no slope

The number of columns comes from `step()`. A step is perfectly flat everywhere except the instant it jumps. Flat ground means slope 0, so the gradient says "nowhere is downhill" and you never discover that one fewer column would help.

The fix, from [chapter 06](06-smoothness.md): replace `step` with `sigmoid` (a dimmer) while searching. A dimmer has a gentle slope near each breakpoint, so the walker can "feel" the breakpoint coming.

We also start **very soft** (wide dimmers that are felt from far away) and sharpen them step by step. Our first attempt used a fixed softness and got stuck: changing the minimum card width doesn't change the card width at all until a column drops off, so the walker felt no slope. This problem is called a **local minimum**. Gradient descent is powerful but not magic.

## Why calculus here?

The gradient is made of derivatives (chapter 01). It answers "if I nudge each knob, does the score get better or worse, and how much?" for all knobs at once. This is exactly how AI models are trained, just with three knobs instead of billions.

## Without calculus: try everything

**Brute force:** try 41 values per knob. With 3 knobs that's 41³ = 68,921 designs × 3 screens. A computer can do that. With 20 knobs it's 41²⁰ ≈ 1.8 × 10³², which is impossible.

**Random search:** try a few thousand random designs and keep the best. That's simple and fine for tiny problems, but gets worse quickly as knobs increase.

**The difference:** with automatic differentiation, the cost of one gradient barely grows with the number of knobs. That's why calculus wins when designs have many props.

> Our code measures each slope by nudging the knob 0.5px up and down (6 layouts per step). Shu's compiled function gets exact slopes in one pass. The idea is the same.

## Try it

- Demo: "Gradient" section. Press **Run 80 steps** and watch the red cut-off outlines disappear.
- Code: `score()`, `gradient()`, `descend()` in [`src/layout.js`](../src/layout.js).

## Check yourself

<details><summary>1. In f(x) = (x − 3)², what happens if the step size is huge, like 1.5?</summary>

x jumps from 0 to 9, then to −9, then to 27… it overshoots and bounces further away each time. Step size matters.
</details>

<details><summary>2. Why divide height by 100 in the score?</summary>

To put both goals on a similar scale. Without it, a 1px height saving would count as much as a whole pixel of cut-off text, and height would drown out readability.
</details>

<details><summary>3. Why does ReLU make a good penalty?</summary>

It's 0 when the rule is met, so it doesn't interfere with good designs, and it grows in a straight line when the rule is broken, so it always has a slope pointing back to "OK".
</details>

Next: [03 · Proof](03-proof.md)
