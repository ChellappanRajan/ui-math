# 08 · Signal (the Fourier transform of a dashboard)

> **Question:** Page height across all window widths draws a wiggly line, like a sound wave. What happens if we compress it the way MP3 compresses music?

## Baby steps: everything is a sum of waves

**A chord.** When a piano plays a chord, your ear hears one sound, but it's really three pure notes added together. A good ear can pull them apart.

**Fourier's idea (1807).** *Any* line, however jagged, can be written as a sum of simple waves (sines and cosines) of different speeds:

```
f(x) = a₀ + a₁·wave₁(x) + a₂·wave₂(x) + a₃·wave₃(x) + …
```

- `a₀` is the average level.
- `wave₁` is one slow wave across the whole range, `wave₂` is two waves, and so on.
- Each `a` says "how much of this wave is in the recipe".

The **Fourier transform** is the machine that finds the recipe (all the `a` numbers) from the line.

**Compression.** Most recipes have a few big ingredients and lots of tiny ones. Keep only the big ones and you get a smaller recipe that tastes almost the same. That's how JPEG and MP3 work.

## Apply it to our grid

Our signal is page height H(W) for W from 200 to 1100px. From [chapter 00](00-the-function.md) it's a **staircase**:

| Widths | Columns | Height |
|---|---|---|
| below 288 | 1 | 532px |
| 288–423 | 2 | 274px |
| 424–831 | 3, 4 or 5 | 188px |
| 832 and up | 6 | 102px |

We sample it at 256 widths and run the Fourier transform. The biggest ingredient is a₀, the average height, ≈ **210px**. Then we rebuild from only the biggest K waves:

| Waves kept | Average error |
|---|---|
| 1 (just the average) | 84px |
| 6 | 34px |
| 30 | 10px |
| all 129 | 0px |

With a few waves the staircase becomes a wobbly hill. That's Shu's "JPEG-ish dashboard". You'll also see ripples next to every jump that never fully go away. That's called the **Gibbs phenomenon**, and it's the same reason JPEG photos look fuzzy around sharp edges.

## Why this math? (Honestly: for fun)

Shu's own words were "because you can". The point isn't that Fourier is useful for layout. It's that once the UI is a mathematical function, *every* tool in math is available, including ones from audio engineering.

There's a real lesson hidden here though: **pick the tool that fits the shape of your data.**

- Fourier waves are great for smooth, repeating things (sound, vibration).
- They're bad at steps. We needed 30 waves and still had a 10px error.
- Our staircase is described *exactly* by 4 heights and 3 breakpoints: 7 numbers.

## Without it: describe the staircase directly

The best "compression" of our layout isn't Fourier at all. It's the table above: 7 numbers, zero error. For step-shaped signals, mathematicians use **wavelets** (for example the Haar wavelet, which is made of little steps), and they compress staircases far better than waves.

## Is this calculus?

Partly. The Fourier transform is defined with an integral, and it belongs to a branch called **Fourier analysis** that grew out of calculus. Here we used the discrete version (a sum instead of an integral), which is plain arithmetic.

## Try it

- Demo: "Signal" section. Slide "Keep the biggest waves" from 1 to 60.
- Code: `dft()` and `rebuild()` in [`src/layout.js`](../src/layout.js).

## Check yourself

<details><summary>1. Why is the first ingredient always the average?</summary>

Wave number 0 doesn't wiggle at all. It's a flat line, and the flat line that fits best is the average.
</details>

<details><summary>2. Why don't the ripples next to a jump disappear when we add more waves?</summary>

Smooth waves can't make an instant jump. Adding more waves squeezes the ripples closer to the jump, but their height stays about the same (around 9% of the jump size).
</details>

<details><summary>3. Name a signal where Fourier compression would work well.</summary>

A pure musical note, a heartbeat or a pendulum's swing: anything smooth and repeating.
</details>

Next: [09 · Average](09-average.md)
