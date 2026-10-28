# 05 · Geodesic (the calmest route between two designs)

> **Question:** We change two props at once: window width 650 → 1000px, and max-width 900 → 500px. Which way of getting there makes the fewest cards jump between rows?

## Baby steps: walking across a city with rivers

**A design is a point.** With two props, every design is a point on a map: across is window width W, and up is max-width M. Our start is (650, 900) and our end is (1000, 500).

**Regions.** Colour the map by the number of columns. You get areas of the same colour separated by borders. Crossing a border = cards jump.

**Rivers.** Think of each border as a river and each crossing as getting wet. The question becomes: *which route from start to end crosses the fewest rivers?*

**Geodesic.** In geometry a geodesic is the "shortest" path between two points, where you get to decide what "short" means. On a flat page it's a straight line. On a globe it's a curve (that's why flights to the US from India go over the Arctic). Here, "short" means "fewest jumps", and the shortest path is **not** the straight line.

## Apply it to our grid

The trick is to notice that columns only depend on **one** number, the box width:

```
c = min(W, M)
```

Start: min(650, 900) = 650 → 4 columns. End: min(1000, 500) = 500 → 3 columns. Remember the jumps from [chapter 04](04-discontinuity.md): 560 (3↔4), 696 (4↔5), 832 (5↔6).

**Route A: change both together (straight line).** W goes up and M goes down at the same time. At first W is the smaller one, so c rises from 650 up to about **766**, crossing 696 (4→5). Then M takes over and c falls to 500, crossing 696 again (5→4) and 560 (4→3).

→ **3 jumps.** A card wraps and then un-wraps for no reason.

**Route B: window first, then max-width.** W goes 650 → 1000 while M = 900, so c rises 650 → 900, crossing 696 and 832. Then M goes 900 → 500, so c falls 900 → 500, crossing 832, 696 and 560.

→ **5 jumps.** The worst.

**Route C: max-width first, then window.** M goes 900 → 500 while W = 650, so c falls 650 → 500, crossing only 560. Then W goes 650 → 1000, but M = 500 is now smaller, so c stays at 500.

→ **1 jump.** That's the geodesic.

**Can we do better than 1?** No. We start at 4 columns and end at 3, so at least one change *has* to happen. Route C is the best possible.

## Why this math?

"Geodesic" comes from **differential geometry**, which uses calculus to study shortest paths on curved surfaces. Finding the best path in general uses the **calculus of variations**: instead of finding the best *number*, you find the best *path*.

For our small problem we don't need the heavy machinery. The insight from the math is to think of designs as **points in a space** and changes as **paths**, and to measure the cost of a path. Once you see it that way, comparing a few routes is enough.

## Without it: just pick the obvious

Most transitions change all props at once (Route A), because that's what a CSS transition or a state update does by default. Nobody notices the extra wrap-and-unwrap until a user sees cards flicker.

The other non-calculus option is a **graph search**: chop the map into a grid of points, connect neighbours, give each step a cost (1 if it crosses a border), and run a shortest-path algorithm like Dijkstra's. That works well in 2 or 3 dimensions, but gets slow with many props, because the grid size explodes.

## Try it

- Demo: "Geodesic" section. The map shows the coloured regions; switch routes and drag along each one.
- Code: `countJumps(path)` in [`src/layout.js`](../src/layout.js).

## Check yourself

<details><summary>1. Why does Route A go UP before it goes down?</summary>

At the start W = 650 is smaller than M = 900, so c = W, and W is increasing. Only when the two meet (around 766) does the shrinking M become the limit.
</details>

<details><summary>2. If the end was max-width 700 instead of 500, how many jumps would Route C have?</summary>

c goes 650 → 650 (min(650, 700) = 650, no change), then W rises to 1000 and c rises to 700, crossing 696. So 1 jump (4 → 5).
</details>

<details><summary>3. In plain words, what's the design lesson?</summary>

When you shrink a limit and grow the space at the same time, apply the limit first. Then the growth can't push anything over a breakpoint.
</details>

Next: [06 · Smoothness](06-smoothness.md)
