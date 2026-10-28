# 03 · Proof (interval arithmetic)

> **Question:** Can we be 100% sure the page stays under a height limit for **every** window width from 320px to 1400px, not just the 4 or 5 widths we happened to test?

## Baby steps: math on ranges

Normal math works on one number: 2 + 1 = 3.

**Interval arithmetic** works on a whole range at once. Write `[a, b]` for "some number between a and b, I don't know which".

| Rule | Example |
|---|---|
| [a, b] + k = [a + k, b + k] | [2, 3] + 1 = [3, 4] |
| [a, b] × k = [a·k, b·k] (k positive) | [2, 3] × 10 = [20, 30] |
| min([a, b], k) = [min(a, k), min(b, k)] | min([320, 1400], 900) = [320, 900] |
| any rule that only goes up: apply it to both ends | floor([2.2, 6.5]) = [2, 6] |

The key promise: **the true answer is always inside the range you get.** If every possible height is inside [102, 274], and 274 is below the limit, then the page is under the limit for every width in the range. That is a proof, not a test.

## Apply it to our grid

Check: "height ≤ 300px for every W from 320 to 1400".

| Step | Formula | Range |
|---|---|---|
| 1 | W | [320, 1400] |
| 2 | c = min(W, 900) | [320, 900] |
| 3 | columns n | [2, 6] |
| 4 | rows = ⌈6 / n⌉ (more columns, fewer rows, so the ends swap) | [1, 3] |
| 5 | H = 32 + rows·70 + (rows − 1)·16 | **[102, 274]** |

274 ≤ 300, so it's **proven**, with one calculation covering infinitely many widths.

**When the answer is "maybe".** Now try a limit of 250px. The range [102, 274] is partly above 250 and partly below, so we can't decide yet. Then we **cut the range in half** and check each half:

- [860, 1400]: columns [6, 6], height [102, 102] → **proven OK**.
- [320, 860]: still [102, 274] → "maybe" again, cut again…

After 25 checks the computer reports: **fails for 320–424px** (the 2-column layout, 274px tall), **proven OK from 424px up**. The cut-the-range-in-half idea is called **bisection**, and it's the same idea as binary search.

## The honest weakness: ranges can be too wide

Interval math is always *safe* but sometimes *pessimistic*. Classic example: if x is in [0, 1], what is x − x?

```
[0, 1] − [0, 1] = [0 − 1, 1 − 0] = [−1, 1]
```

The real answer is always 0, but interval math forgets that both x's are the same number. This is called the **dependency problem**. It never gives a wrong "proven", but it can say "maybe" more often than necessary. Splitting the range shrinks the problem, which is why we bisect.

## Is this calculus?

**No, and that's an important lesson.** Interval arithmetic is a separate branch of math (numerical analysis, or "validated numerics"). Not every trick in Shu's post is calculus. What they share is the *starting point*: once the UI is a formula, you can do math on it. Calculus is one tool; intervals are another.

Why intervals here? Because the question is about **all** inputs, not about speed. Derivatives tell you how things change near one point, and intervals tell you the bounds over a whole region.

## Without it: test samples

The normal approach is to test 320, 375, 768, 1024 and 1440px and hope. It's simple, but:

- It only checks the widths you picked. A bug at 517px slips through.
- Every extra prop multiplies the work: 5 widths × 5 font sizes × 5 zoom levels = 125 screenshots, and it's still not a proof.

Other "proof" tools exist too, like SMT solvers (programs that search for a counter-example or prove there is none). For a formula as simple as ours you could also solve it by hand. Interval arithmetic is attractive because it runs the *same* formula, just on ranges.

## Try it

- Demo: "Proof" section. Move the height limit and watch the green and red bar.
- Code: `intervalHeight()` and `prove()` in [`src/layout.js`](../src/layout.js).

```js
prove(320, 1400, BASE, 300);  // { pieces: [[320, 1400, 'pass']], checks: 1 }
prove(320, 1400, BASE, 250);  // fails 320–424, passes after, 25 checks
```

## Check yourself

<details><summary>1. If W is in [400, 500], what range is the number of columns?</summary>

c = [400, 500]. 400 fits 2 cards (≥ 288, < 424), and 500 fits 3 (≥ 424, < 560). So n = [2, 3].
</details>

<details><summary>2. Why does "rows = ⌈6/n⌉" swap the ends of the range?</summary>

More columns means fewer rows. The *biggest* n gives the *smallest* rows, so [2, 6] columns gives [⌈6/6⌉, ⌈6/2⌉] = [1, 3] rows.
</details>

<details><summary>3. Can interval arithmetic ever say "proven OK" when it's actually broken?</summary>

No. The real answer is always inside the range. It can only be too cautious ("maybe"), never wrong.
</details>

Next: [04 · Discontinuity](04-discontinuity.md)
