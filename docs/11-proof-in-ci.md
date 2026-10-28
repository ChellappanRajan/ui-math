# 11 · Proof in CI (the future Shu describes)

> **Question:** A teammate changes the card gap from 16px to 32px. Before the change is merged, can a robot **prove** the page is never taller than 300px on any screen from 320px to 1440px?

## Baby steps: what is CI, and what is a proof?

**CI (continuous integration)** is a robot that runs checks every time someone changes the code. If a check fails, the change is blocked until it's fixed.

**A type checker** is a familiar CI check. In TypeScript, if a function needs a number and you pass text, it fails, and it does so *without running your program*, for *every possible run*. That's a proof.

**Today's layout checks** are screenshot tests: render the page at a few sizes, compare pictures with the last version, and ask a human whether the differences are OK. That's useful, but it's *testing*, not *proving*.

Shu's vision is to make layout as safe as types: **prove the rule holds for every screen size**, using the interval arithmetic from [chapter 03](03-proof.md).

## Apply it to our grid

**The rule:** `height ≤ 300px` for every W in [320, 1440].

**Before (gap 16px):** one interval check gives height in [102, 274]. 274 ≤ 300 → **✓ proven**.

**After (gap 32px):** the robot finds a problem.

```
2 columns, 3 rows: H = 32 + 3·70 + 2·32 = 306px   > 300  ✗
3 columns appear at need(3) = 32 + 3·120 + 2·32 = 456px
```

So the result is **✗ blocked: too tall for widths 320–455px**. The bigger gap made the 2-column layout 32px taller, which pushed it over the limit.

The robot names the *exact range* that fails, not just one screenshot. And it's guaranteed there are no other failing widths hiding between test sizes.

## Why this math?

This chapter combines the others:

- The UI is a formula ([chapter 00](00-the-function.md)), so a computer can reason about it.
- Interval arithmetic ([chapter 03](03-proof.md)) turns "for all widths" into a few range checks.
- Breakpoints ([chapter 04](04-discontinuity.md)) tell you exactly where things change.

Using math to *prove* software correct is a field called **formal methods**. It's already used for aircraft software, chips and cryptography. Shu's point is that UI could join that club once layout is a math function.

## Without it: screenshot testing

| | Screenshot tests | Proof |
|---|---|---|
| Checks | the sizes you list (e.g. 375, 768, 1440) | every size in the range |
| Finds a bug at 412px? | only if 412 is on your list | always |
| Output | "these pictures changed" | "fails exactly for 320–455px" |
| Needs a human to judge? | usually | no, the rule is written down |
| Handles many props (width × font size × zoom)? | the number of screenshots multiplies | one range check per prop box |

## The honest limits

Our formula is tiny. Real pages have text that wraps differently in every font, images that load late, and browser rounding. Shu's compiled dashboard already needs 2,608 operations, and proving properties of full real-world layouts is still research. Treat this chapter as a **direction**, not a tool you can install today.

## Try it

- Demo: "Proof in CI" section. Move "New gap" and the height rule, and watch the before/after bars.
- Code:

```js
prove(320, 1440, BASE, 300);              // [[320, 1440, 'pass']]
prove(320, 1440, { ...BASE, g: 32 }, 300); // fails 320–456, passes after
```

- Your own repo already does a small version of this: `npm test` runs `test/layout.test.js`, which checks every number in these docs.

## Check yourself

<details><summary>1. Which gap is the largest that still passes the 300px rule?</summary>

The 2-column height is 32 + 210 + 2·gap. It must be ≤ 300, so 2·gap ≤ 58, gap ≤ 29px. (Also check the range starts at 320: with gap 29, need(2) = 32 + 240 + 29 = 301, so 1 column (532px tall) never appears above 320. ✓)
</details>

<details><summary>2. Why can't a screenshot test prove anything?</summary>

It only looks at the sizes it renders. Any size in between is unchecked, and there are infinitely many in between.
</details>

<details><summary>3. What's one thing that makes real layouts harder to prove than ours?</summary>

Text wrapping: how many lines a sentence takes depends on the font, the exact width and the words, which turns into many more breakpoints.
</details>

Next: [12 · Why calculus?](12-why-calculus.md)
