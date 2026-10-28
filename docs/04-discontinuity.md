# 04 · Discontinuity (find every breakpoint)

> **Question:** Exactly where does the layout jump or change behaviour, without dragging the window around?

## Baby steps: drawing without lifting the pencil

A function is **continuous** if you can draw its graph without lifting the pencil. There are two ways to break that:

**A jump.** The pencil must leave the paper and land somewhere else.

```
        ●───────
        
────○
```

**A bend (a "kink").** No jump, but the line suddenly changes direction. The function is continuous, but its *speed* (the derivative) jumps.

```
            ──────────
          ╱
        ╱
```

So in the language of [chapter 01](01-velocity.md):

| What you see | In f(x) | In f′(x) | In the UI |
|---|---|---|---|
| jump | f jumps | undefined at that point | a card wraps to another row |
| bend | f is continuous | f′ jumps | something hits a limit, like max-width |

## Apply it to our grid

**Jumps.** Our only light switches are `step(c − need(n))`. A switch flips exactly when its inside is 0:

```
c − need(n) = 0   →   c = 136·n + 16
```

Solve for n = 2…6: **288, 424, 560, 696, 832px**. That's the complete list. No dragging needed, just five tiny equations.

Check one by hand. Just below 560px there are 3 columns; at 560 there are 4:

```
W = 559:  cardWidth = (559 − 32 − 32) / 3 = 165px
W = 560:  cardWidth = (560 − 32 − 48) / 4 = 120px
```

The card width falls from 165 to 120 at a single pixel. That's a jump. ✓

**The bend.** `min(W, 900)` is a ReLU in disguise ([chapter 00](00-the-function.md)). ReLU has a kink at 0, so `min(W, 900)` has a kink at W = 900:

```
W = 899:  cardWidth = 131.17 and growing at 1/6 px per px
W = 900:  cardWidth = 131.33
W = 901:  cardWidth = 131.33 and not growing at all
```

No jump, but the speed drops from 1/6 to 0. That's a bend. ✓

## The surprising part

Our CSS contains **zero** `@media` queries. Designers think of breakpoints as "the widths I wrote in the CSS". But the layout itself has 5 visual jumps and 1 bend that nobody declared. The math finds the real ones.

## Why this math?

This comes from **real analysis**, the careful study of continuity that sits underneath calculus. We need it because calculus tools (derivatives, linear prediction, smooth animation) only work *between* breakpoints. Knowing exactly where the breakpoints are tells you where each tool is safe.

## Without it: sweep every pixel

The non-math way: render the layout at 200px, 201px, 202px… 1100px and compare neighbours. That's 900 layouts, and:

- It can't see changes *between* two pixels (at fractional widths or zoom levels).
- It doesn't scale. With 2 props it's 900 × 900 = 810,000 layouts; with 3 props, 729 million.
- It tells you *that* something changed, not *what kind* (jump or bend).

Screenshot tests at fixed widths are even weaker: a jump between two tested widths is invisible.

## Try it

- Demo: "Discontinuity" section. The orange dashed lines are jumps; the teal line is the bend.
- Code: `breakpoints()` in [`src/layout.js`](../src/layout.js).

```js
breakpoints();
// { jumps: [{ width: 288, columns: 2 }, … { width: 832, columns: 6 }], bend: 900 }
```

## Check yourself

<details><summary>1. If the gap changes to 24px, where is the 3-column breakpoint?</summary>

need(3) = 32 + 3·120 + 2·24 = 440px.
</details>

<details><summary>2. Does the page height H have bends?</summary>

No. H only depends on the number of rows, so it's flat between breakpoints and only jumps. It's a "staircase".
</details>

<details><summary>3. What would cause a bend at 320px?</summary>

Something like `min-width: 320px` on the box. Below 320 the box stops shrinking, so speeds change suddenly.
</details>

Next: [05 · Geodesic](05-geodesic.md)
