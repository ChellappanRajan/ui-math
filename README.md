# ui-math

**Learn the 11 tricks of "Calculus of Interfaces" on the smallest dashboard possible: six cards in a CSS grid.**

React says `UI = f(props)`. Shu Ding (Vercel Labs), inspired by Cheng Lou's *Handwired*, compiled a real React dashboard into an actual math function and showed what becomes possible: velocities, gradient descent, proofs, breakpoints, geodesics, free animation, Fourier transforms, integrals and even complex numbers. ([original demo](https://calculus-of-interfaces.vercel.app/))

This repo teaches the same ideas **from zero**. Every chapter starts with a baby-step explanation of the math, works it out by hand on our grid with real numbers, explains *why* that particular math was chosen, and shows how you'd do it *without* calculus and what that costs.

## How to use this repo

1. **Read [chapter 00](docs/00-the-function.md) first.** It turns the CSS grid into a formula, and everything else builds on it.
2. **Open the demo** (`demo/index.html`) in a browser and keep it beside the chapter you're reading. Every chapter has a matching interactive section.
3. **Run the code** to check every number yourself:

```bash
npm test          # proves every number in the docs (Node 18+)
npm run numbers   # prints all the worked examples
```

No dependencies and no build step: just HTML, CSS and plain JavaScript.

## The chapters

Each chapter follows the same pattern: **Question → Baby steps → Apply it to our grid → Why this math? → Without calculus → Try it → Check yourself.**

| # | Chapter | The question | Math you'll learn |
|---|---|---|---|
| 00 | [The one function](docs/00-the-function.md) | How does CSS become a formula? | functions, min, step, floor |
| 01 | [Velocity](docs/01-velocity.md) | How fast does each card move when I resize? | derivative, slope |
| 02 | [Gradient](docs/02-gradient.md) | Can math pick gap, padding and card size for me? | gradient descent, penalties |
| 03 | [Proof](docs/03-proof.md) | Is the page short enough on *every* screen? | interval arithmetic, bisection |
| 04 | [Discontinuity](docs/04-discontinuity.md) | Where exactly does the layout jump? | continuity, jumps vs bends |
| 05 | [Geodesic](docs/05-geodesic.md) | Which transition makes fewest cards jump? | design space, shortest paths |
| 06 | [Smoothness](docs/06-smoothness.md) | Can the layout animate itself? | sigmoid, blending |
| 07 | [Linearity](docs/07-linearity.md) | Can I skip layout while resizing? | linear approximation |
| 08 | [Signal](docs/08-signal.md) | What if we JPEG-compress a dashboard? | Fourier transform |
| 09 | [Average](docs/09-average.md) | What page does the average visitor see? | integrals, weighted averages |
| 10 | [Imaginary](docs/10-imaginary.md) | What if window width is 696 + 24i px? | complex numbers, poles |
| 11 | [Proof in CI](docs/11-proof-in-ci.md) | Can a robot block layout bugs before merge? | formal methods |
| 12 | [Why calculus?](docs/12-why-calculus.md) | Why calculus, and what else could we use? | the big picture |

Stuck on something? The [learning log](docs/learning-log.md) lists questions asked while learning, with short answers and where each is explained.

## The short answer to "why calculus?"

UI props like window width, font size and gap are **continuous sliders**, and calculus is the math of continuous change. Once the UI is a formula, calculus answers "how fast?", "which way is better?", "what's next?" and "what's the average?" exactly, for all inputs at once, instead of by running the page over and over.

But not every trick is calculus. Proofs use interval arithmetic, breakpoints use real analysis, and the Fourier chapter shows a case where a plain table beats fancy math. [Chapter 12](docs/12-why-calculus.md) has the full map and a table of non-calculus alternatives.

## What's in the repo

```
docs/            13 tutorial chapters (start with 00)
demo/index.html  interactive page with all 11 tricks
src/layout.js    the one layout function + every trick, as plain JS
examples/        prints every worked example
test/            checks every number quoted in docs/
```

## The grid we use everywhere

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

## Credits

Ideas from [Calculus of Interfaces](https://calculus-of-interfaces.vercel.app/) by Shu Ding (Vercel Labs), inspired by Cheng Lou's Handwired. This repo is an independent beginner's tutorial; all code here is a small re-implementation written for teaching.
