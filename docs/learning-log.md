# Learning log

The questions asked while learning this tutorial, in order, with the short answer to each and where the chapter now covers it. Reading them in order shows how the ideas build on each other: from "where does this formula come from?" to "what kind of math is it?".

## Chapter 00 · The one function

The questions focused on Rules 2 and 3 ([chapter 00](00-the-function.md)): the room formula `need(n)` and the column formula that uses `step()`.

| # | Question | Short answer | Now covered in |
|---|---|---|---|
| 1 | How does the formula for finding n work? What is the step function, and why is it required? | n counts the "yes" answers on a checklist ("do 2 fit? do 3 fit?…"). `step()` turns each yes/no into 1/0 so they can be added. It's needed because +, −, ×, ÷ can't make the instant jump from 3 to 4 columns; step is the math version of an `if`. | Rule 3: checklist table and "Why is the step function needed at all?" |
| 2 | Do we use arithmetic progression here? | Yes. need(n) gives 152, 288, 424… with common difference 136. Card x and y positions are APs too. Finding n is inverting the AP. The AP *sum* formula isn't used. | Rule 2: AP box; FAQ |
| 3 | In `16 + n × 120`, how does that part work? | It's two separate pieces: 16 is the left padding, and n × 120 is n cards of 120px each. Opening the bracket and grouping gives 136n + 16. | Rule 2: piece-by-piece table and simplification |
| 4 | Why not just divide width by card width to see how many fit? | Plain division (620 ÷ 120 = 5) forgets padding and gaps, and 5 cards actually need 696px. Corrected division, floor((c − 16) / 136), works and equals the step sum. The tutorial keeps the step form because each switch is a visible breakpoint. | Rule 3: "Why not just divide…?" |
| 5 | Is an arithmetic progression called a weighted sum? | No. An AP is a pattern in a list, and a weighted sum is an operation. The AP's nth-term formula happens to be a weighted sum, but most weighted sums aren't APs. | FAQ; building-blocks table |
| 6 | Is need(n) an AP formula? What's the general syntax? | Yes: aₙ = a + (n − 1)·d, with a = 152 and d = 136. Any formula of the form (number)·n + (number) is an AP. | Rule 2: AP box |

### What the questions revealed about the chapter

The first version of chapter 00 had gaps that caused these questions. Each is now fixed:

- **It jumped straight to `136·n + 16`** without showing the pieces or the algebra. → Added the row diagram, piece table and simplification steps.
- **It didn't name the pattern.** The numbers are an AP, which a beginner may already know from school. → Added the AP box connecting need(n) to aₙ = a + (n − 1)d.
- **It introduced `step()` before saying what question it answers.** → Rule 3 now starts with the plain checklist, then shows step as the tool for counting yeses.
- **It didn't say why `step()` is needed** instead of ordinary arithmetic. → Added the "math version of an `if`" explanation.
- **It didn't address the obvious shortcut (division).** → Added why plain division fails and the corrected `floor` version.
- **"Weighted sum" was used without a definition.** → Defined it in the building-blocks table and the FAQ.

### Learning path these questions followed

1. **Mechanics:** how does the n formula work? (Q1)
2. **Pattern recognition:** is this an AP? (Q2)
3. **Breaking the formula down:** what is each piece? (Q3)
4. **Challenging the method:** why not something simpler? (Q4)
5. **Connecting vocabulary:** how do AP and weighted sum relate? (Q5)
6. **Generalising:** what's the general AP syntax? (Q6)

This is a good pattern for any chapter: understand how it works, name the math, take it apart, question it, connect the terms, then generalise.
