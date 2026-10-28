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

**Rule 2, how much room n cards need.** Two paddings, n cards and the gaps between them (one fewer gap than cards):

```
need(n) = 16 + n·120 + (n − 1)·16 + 16
        = 136·n + 16
```

| n cards | need(n) |
|---|---|
| 1 | 152px |
| 2 | 288px |
| 3 | 424px |
| 4 | 560px |
| 5 | 696px |
| 6 | 832px |

**Rule 3, the number of columns.** This is the only "decision" in the layout. Meet the **step function**, a light switch:

```
step(x) = 0  if x is negative
step(x) = 1  if x is zero or positive
```

"Is there room for 2 cards?" is `step(c − need(2))`. If c is bigger than 288 the switch flips to 1. Add up one switch per possible column:

```
n = 1 + step(c − 288) + step(c − 424) + step(c − 560) + step(c − 696) + step(c − 832)
```

Try it with c = 620:

```
n = 1 + step(332) + step(196) + step(60) + step(−76) + step(−212)
  = 1 +    1     +    1     +    1    +     0     +     0
  = 4 columns
```

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
| weighted sum | `136·n + 16`, `16 + column·(cardWidth + 16)` |
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

Next: [01 · Velocity](01-velocity.md)
