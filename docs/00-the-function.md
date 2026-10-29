# 00 · The one function

> Goal of this chapter: understand how a CSS grid becomes a math formula. Every other chapter builds on this one.

## Step 1: What is a function?

A function is a machine. You put numbers in, you get numbers out, and the same input always gives the same output.

```
input  →  [ machine ]  →  output
  3    →  [ double it ] →    6
```

React's famous line `UI = f(props)` says the same thing about a web page:

```
props (window width, gap, padding…)  →  [ f ]  →  where every card goes
```

## Step 2: Our tiny dashboard

Six cards in a grid. This is the real CSS:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 16px;
  max-width: 900px;
  margin: 0 auto;
}
.grid > div { height: 70px; }
```

In plain words:

1. The box is never wider than 900px.
2. Fit as many cards in a row as possible, where each card is at least 120px.
3. Stretch the cards so the row is full.
4. Put 16px between cards and 16px around the edge.

## Step 3: Turn each rule into a formula

Call the window width **W**. That is the one input we change most.

**Rule 1, the box width.** "Never wider than 900" is the minimum of two numbers.

```
c = min(W, 900)
```

Try it: W = 620 gives c = 620. W = 1000 gives c = 900.

**Rule 2, how much room n cards need.** Picture 3 cards in a row:

```
| pad | card | gap | card | gap | card | pad |
  16    120    16    120    16    120    16
```

Add up each kind of piece separately:

| Piece | How many? | Each is | Total for 3 cards |
|---|---|---|---|
| left padding | 1 | 16px | 16 |
| cards | n | 120px | 3 × 120 = 360 |
| gaps (only *between* cards) | n − 1 | 16px | 2 × 16 = 32 |
| right padding | 1 | 16px | 16 |

16 + 360 + 32 + 16 = **424px**. Written for any n:

```
need(n) = 16 + n·120 + (n − 1)·16 + 16
```

The first 16 is the left padding on its own, and `n·120` is "n cards, each 120px wide". To simplify, open the bracket ((n − 1)·16 = 16n − 16), group the n terms (120n + 16n = 136n), and group the plain numbers (16 − 16 + 16 = 16):

```
need(n) = 136·n + 16
```

| n cards | need(n) |
|---|---|
| 1 | 152px |
| 2 | 288px |
| 3 | 424px |
| 4 | 560px |
| 5 | 696px |
| 6 | 832px |

> **This is an arithmetic progression (AP).** Each value is 136 more than the one before: 152, 288, 424, 560, 696, 832. The general nth-term formula is
>
> ```
> aₙ = a + (n − 1) · d       a = first term, d = common difference
> ```
>
> Here a = 152 (room for one card: 16 + 120 + 16) and d = 136 (one extra card costs its 120px plus one 16px gap). So need(n) = 152 + (n − 1)·136 = 136n + 16, the same formula. Quick test: any formula that simplifies to (number)·n + (number) is an AP, and the number multiplying n is d. Because the breakpoints form an AP, they are evenly spaced, 136px apart.

**Rule 3, the number of columns.** The browser's question is: *how many 120px cards fit in a box of width c?* You'd naturally answer it with a checklist. Try c = 620:

| Question | c = 620 |
|---|---|
| Does 1 card fit? | always yes (there is always at least 1 column) |
| Do 2 fit? Is 620 ≥ 288? | yes |
| Do 3 fit? Is 620 ≥ 424? | yes |
| Do 4 fit? Is 620 ≥ 560? | yes |
| Do 5 fit? Is 620 ≥ 696? | no |
| Do 6 fit? Is 620 ≥ 832? | no |

Count the yeses: **4 columns**. To count yeses with arithmetic, each "yes" must become 1 and each "no" 0. That's the job of the **step function**, a light switch:

```
step(x) = 0  if x is negative          ("no")
step(x) = 1  if x is zero or positive  ("yes")
```

"Do 4 cards fit?" means "is c ≥ 560?", which is the same as "is c − 560 ≥ 0?", which is `step(c − 560)`.

**Why is the step function needed at all?** Ordinary operations (+, −, ×, ÷) can't make decisions: nudge the input a little and the output only changes a little. But the column count *jumps*: 3 columns at 559px, 4 at 560px. In JavaScript you'd write `if (c >= 560)`. The step function is the **math version of an `if`**, and it's the only building block in our formula that can make that instant jump.

Turn the checklist into a sum, one switch per possible column:

```
n = 1 + step(c − 288) + step(c − 424) + step(c − 560) + step(c − 696) + step(c − 832)
```

Try it with c = 620:

```
n = 1 + step(332) + step(196) + step(60) + step(−76) + step(−212)
  = 1 +    1     +    1     +    1    +     0     +     0
  = 4 columns
```

**Why not just divide the width by the card width?** Plain division forgets the padding and the gaps:

```
620 ÷ 120 = 5.17  →  5 cards?   But 5 cards need 696px, and the box is only 620px.  ✗
```

Fixing it takes three steps: remove the padding (620 − 32 = 588), count each card *with* its gap as 136px, adding one extra gap for the last card ((588 + 16) ÷ 136 = 4.44), and round down to **4**. That gives a correct shortcut:

```
n = floor((c − 16) / 136)       (kept between 1 and 6)
```

It gives the same answer as the step sum at every width (`test/layout.test.js` checks this). The tutorial uses the step version because it matches the building blocks Shu's compiled dashboard uses (`floor` isn't one of them), and because each switch *is* a breakpoint you can find (chapter 04) or soften (chapter 06). Inside `floor` they're hidden. For pen-and-paper sums, the division form is quicker.

**Rule 4, card width.** Take the space inside the padding, remove the gaps, and share it equally:

```
cardWidth = (c − 32 − (n − 1)·16) / n
```

With c = 620 and n = 4: (620 − 32 − 48) / 4 = 540 / 4 = **135px**.

**Rule 5, page height.** Six cards in n columns need `rows = ⌈6 / n⌉` rows. The ⌈ ⌉ means "round up".

```
H = 32 + rows·70 + (rows − 1)·16
```

With 4 columns: rows = ⌈6/4⌉ = 2, so H = 32 + 140 + 16 = **188px**.

**Rule 6, where each card sits.** Card number i (counting from 0) is in column `i mod n` and row `⌊i / n⌋`:

```
x = 16 + column·(cardWidth + 16)
y = 16 + row·(70 + 16)
```

## Step 4: Check the math against the browser

| W | columns | card width | page height |
|---|---|---|---|
| 250px | 1 | 218px | 532px |
| 400px | 2 | 176px | 274px |
| 620px | 4 | 135px | 188px |
| 1000px | 6 | 131.33px | 102px |

The demo page draws the real CSS and our formulas side by side. They agree at every width. `test/layout.test.js` checks this for every half-pixel from 150 to 1400px.

## Step 5: Why does this matter?

JavaScript with `if` statements is hard to reason about. A formula made of `+`, `×`, `min`, and `step` is easy, because mathematicians have studied those for centuries. Shu's project does the same thing to a real React dashboard and gets 2,608 tiny operations. We have about 15. The ideas are identical.

The four building blocks Shu mentions are all here:

| Block | Where it appears in our grid |
|---|---|
| weighted sum (multiply each input by a weight, add, plus a constant) | `136·n + 16`, `16 + column·(cardWidth + 16)` |
| product | `rows · 70` |
| ReLU = max(0, x) | `min(W, 900)` is `W − max(0, W − 900)` |
| step | choosing the number of columns |

## Check yourself

<details><summary>1. How many columns at W = 700?</summary>

c = 700. 700 ≥ 696, so 5 switches are on: n = 5. Card width = (700 − 32 − 64) / 5 = 120.8px.
</details>

<details><summary>2. Why is there one fewer gap than cards?</summary>

Gaps sit *between* cards. 3 cards in a row have 2 spaces between them.
</details>

<details><summary>3. Rewrite min(W, 900) using only ReLU.</summary>

`min(W, 900) = W − ReLU(W − 900)`. If W is below 900 the ReLU is 0, so you get W. If W is above, you subtract the extra.
</details>

## Questions learners asked

These came up while working through this chapter. The full log is in [learning-log.md](learning-log.md).

<details><summary>Is an arithmetic progression the same as a weighted sum?</summary>

No. An **AP** is a *pattern in a list* (152, 288, 424… each +136). A **weighted sum** is an *operation*: multiply each input by a weight and add, like a grade = 0.7 × exam + 0.3 × homework. They meet here because the AP's nth-term formula, 136·n + 16, is a weighted sum with one input. But most weighted sums in this tutorial aren't APs: the score in chapter 02, the 50/50 layout blend in chapter 06 and the traffic average in chapter 09.
</details>

<details><summary>Do card positions form an AP too?</summary>

Yes. In one row at W = 620 (card width 135), cards sit at x = 16, 167, 318, 469: common difference 135 + 16 = 151. Rows sit at y = 16, 102, 188, … (at 620px only the first two are used): common difference 70 + 16 = 86. That's why the position formulas look like `16 + column·(cardWidth + 16)`.
</details>

<details><summary>Do we use the AP sum formula?</summary>

No. We never add the terms up, so n/2·(2a + (n − 1)d) isn't needed. We only use the nth-term formula, and "finding n" is asking how many terms of the AP fit under the box width.
</details>

Next: [01 · Velocity](01-velocity.md)
