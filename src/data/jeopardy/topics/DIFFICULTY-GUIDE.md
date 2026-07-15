# Jeopardy Topic Difficulty Guide

Use this guide when creating or rebalancing topic files in `src/data/jeopardy/topics/`.
It defines how questions should scale across difficulty levels **1–5** so new topics stay consistent with the rest of the game.

**Calibration anchors:**
- **200** = giveaway questions
- **600** = common knowledge
- **1000** = niche knowledge

Levels 2 and 4 sit between these anchors. The board should feel approachable — most players should recognize answers well before the top tier.

---

## Quick reference

| Level | Points | Who should get it right | Clue style |
|------:|-------:|-------------------------|------------|
| **1** | 200 | Almost everyone | Giveaway — iconic names, obvious associations, instant recognition |
| **2** | 400 | Most people with light exposure | Very easy — famous examples, basic “what is…?” facts |
| **3** | 600 | Typical player / common knowledge | Well-known rules, main characters, popular story beats |
| **4** | 800 | Fans who pay attention | Specific details, deeper lore, numbers, dates, creators |
| **5** | 1000 | Specialists / completionists | Niche — obscure names, fine print, deep cuts, “which is NOT…?” |

**Target player:** casual trivia audience. Low tiers should feel generous; save obscurity for 800–1000.

---

## File structure

Each topic is a TypeScript file that calls `createTopic`:

```ts
import { createTopic } from '../createTopic';

export default createTopic('my-topic', 'My Topic Name', {
  1: [ /* 20 questions */ ],
  2: [ /* 20 questions */ ],
  3: [ /* 20 questions */ ],
  4: [ /* 20 questions */ ],
  5: [ /* 20 questions */ ],
});
```

Then register the import in `src/data/jeopardy/index.ts`.

### Required shape per question

```ts
{
  question: 'What classic game has players buy streets and build hotels?',
  answer: 'Monopoly',
  choices: ['Monopoly', 'The Game of Life', 'Risk', 'Clue'],
}
```

| Rule | Detail |
|------|--------|
| Questions per level | **Exactly 20** (100 total per topic) |
| Choices in the file | **Exactly 4** (all hand-written) |
| `choices[0]` | **Must equal `answer`** |
| Distinct choices | All 4 must differ (case-insensitive) |
| Distractors | **All 3 wrong options must be plausible** — same topic, same kind of thing, no filler/joke answers |
| Answer leak | **The answer must not appear in the question text** (see exceptions below) |

> **No auto-generated fourth option.** Every question must ship four real, deliberately chosen options. There is no longer a load-time distractor generator, so a lazy fourth choice (e.g. `'None of these'`, `'A power cable'`, an unrelated joke) will make the answer guessable by elimination — write four options that all look defensible.

Parenthetical glosses in answers are stripped before leak checks. Example: answer `Stormterror (Dvalin)` is checked as `Stormterror Dvalin` — do not put either word in the clue.

---

## Difficulty calibration

Difficulty is about **how well-known the fact is** — not clue length or wording complexity. When unsure, place the question **one level easier** rather than harder.

### Level 1 — Giveaway (200 pts)

**Goal:** Nearly everyone should get this. If it feels like a stretch at 200, it belongs at 400+.

**Ask about:**
- The single most famous example in a category (“What game uses Wild and Skip cards?” → Uno)
- Household names, logos, mascots, and one-word associations
- Answers obvious from context or pop culture osmosis
- “What is X?” where X is instantly picture-able

**Avoid:**
- Rules, numbers, or mechanics — even simple ones
- Secondary characters or anything beyond the #1 most famous fact
- Anything a non-fan would need to have actively engaged with the topic to know

**Good (Board Games):** “What classic game has players buy streets and build hotels?” → Monopoly  
**Good (Drugs):** “What stimulant in coffee and tea helps people feel more alert?” → Caffeine  
**Bad at 200:** “In Monopoly, how much money do you collect when you pass Go?” (that’s common knowledge → 600)

**Distractors:** Four **real same-category** options (all famous board games, all common drugs, etc.). The easy part is that the right one is a giveaway to anyone who knows the topic — **not** that the other three are jokes. Never pad with unrelated filler like `'A power cable'` or `'None of these'`.

---

### Level 2 — Very easy (400 pts)

**Goal:** Most people who’ve heard of the topic should know this without being a fan.

**Ask about:**
- The second tier of famous examples (well-known but not quite giveaway)
- Broad roles and settings (“What nation is ruled by the Raiden Shogun?” → Inazuma)
- Simple brand ↔ product pairs everyone has seen (Tylenol, Advil)
- Basic vocabulary of the topic

**Avoid:**
- Specific numbers, dates, or rule details
- Plot twists, hidden identities, or lore that requires playing/watching through
- Side characters unless they are widely meme-famous

**Good (Board Games):** “What game drops red and yellow discs into a vertical grid?” → Connect Four  
**Good (Drugs):** “What over-the-counter anti-inflammatory is sold under the brand name Advil?” → Ibuprofen  
**Good (Computing):** “What language do web pages use for their basic structure?” → HTML

**Distractors:** Four options of the same kind (all languages, all brands, all nations). A player who knows the topic still picks the answer easily, but someone guessing can’t eliminate three obvious throwaways.

---

### Level 3 — Common knowledge (600 pts)

**Goal:** The standard “most people who know this topic know this” tier. This is the **middle anchor** for difficulty.

**Ask about:**
- Popular rules, catchphrases, and widely shared facts
- Main characters, protagonists, and primary antagonists
- Headline story beats from the main experience (not side quests)
- Simple mechanics or features most players encounter
- Current-events-level awareness within the topic (e.g. Ozempic, Wordle)

**Avoid:**
- Deep lore, true names, or datamined details
- Creator/inventor attribution unless extremely famous
- Completionist or endgame-only content

**Good (Board Games):** “In Monopoly, how much money do you collect when you pass Go?” → $200  
**Good (Neon Open Worlds):** “What Fatui Harbinger duels the Traveler as Childe?” → Tartaglia  
**Good (Drugs):** “What GLP-1 injection became a famous weight-loss drug in the 2020s?” → Ozempic

**Distractors:** Real alternatives a fan might briefly consider — the wrong options should each be a genuinely possible answer to the clue.

---

### Level 4 — Fan detail (800 pts)

**Goal:** Rewards people who actually engage with the topic — but still not obscure trivia.

**Ask about:**
- Specific plot points, hidden identities, or story resolutions
- Character kits / signature abilities (describe the mechanic in plain language)
- Named locations, factions, or events beyond the headline level
- Specific numbers, dates, or rules that fans notice
- Inventors or creators when well-known within the community

**Avoid:**
- Beta content, cut lore, or wiki footnotes
- Facts that only appear in supplemental material most people skip
- Repeating a level 3 question with slightly different wording

**Good (Board Games):** “In Monopoly, which two dark-blue properties are the most expensive on the board?” → Boardwalk and Park Place  
**Good (Neon Open Worlds):** “What Geo Archon gave up his Gnosis during the Liyue Archon Quest?” → Morax (Zhongli)  
**Good (Computing):** “Who developed the C programming language at Bell Labs?” → Dennis Ritchie

**Distractors:** Close alternatives from the same franchise or field — names/dates/terms a knowledgeable fan could realistically mix up with the answer.

---

### Level 5 — Niche (1000 pts)

**Goal:** The hardest tier — specialist, completionist, or deep-cut knowledge. Fine to be obscure **here**.

**Ask about:**
- True names, codenames, formal titles, and legal/technical proper nouns
- “Which is NOT…?” and precise comparative facts
- Obscure characters, minor mechanics, and fine-print rules
- Historical/policy details and landmark dates
- Advanced terminology within the field

**Avoid:**
- Impossible gotchas with multiple valid answers
- Facts with zero connection to the topic’s popular experience
- Making level 5 easier than level 3 — niche does not mean “hard wording on an easy fact”

**Good (Board Games):** “In Monopoly, which railroad is NOT one of the four on the classic board?” → Union Pacific  
**Good (Neon Open Worlds):** “What Electro Archon’s true name is Baal?” → Ei  
**Good (Drugs):** “What 1970 US law created the modern system for scheduling controlled substances?” → Controlled Substances Act  
**Good (Computing):** “What is the Y combinator in lambda calculus?” → A fixed-point combinator that enables recursion without named functions

**Distractors:** Same tier of specificity — other obscure names, laws, or advanced terms that an expert could plausibly confuse with the answer. At this tier the distractors should be hard enough that even a specialist has to think.

---

## Question-writing rules

### 1. One clear fact per clue

Each question should test **one** piece of knowledge. Do not stack multiple unrelated facts.

**Bad:** “What pyro nation added in 5.0 has Saurians and a fire Archon named Murata?”  
**Good:** Split into separate questions at appropriate levels.

### 2. No answer leaks

The answer (including words inside parentheses) must not appear in the question.

**Bad:** “What Genshin dragon boss atop Stormterror’s Lair opens Act I?” → Stormterror (Dvalin)  
**Good:** “What wind dragon corrupted by the Abyss threatens Mondstadt in Act I?” → Stormterror (Dvalin)

**Bad:** “In Connect Four, how many discs do you need?” when answer is Four and question says “Four”  
**Good:** Rephrase to avoid the answer word: “In that vertical disc-dropping game, how many in a row do you need to win?”

### 3. Plausible distractors

Write **four** choices. `choices[0]` is the answer; the other three are distractors. Every one of the three distractors must be:
- From the **same topic**
- **Same kind** of thing as the answer (all people, all games, all countries, all dates, etc.)
- **Distinct** after normalization (ignoring parentheticals and punctuation)
- A **genuinely possible** answer to the clue — never filler, jokes, or unrelated nouns

**Difficulty scales with level (this is where you tune hardness):**

| Level | Distractor closeness |
|------:|----------------------|
| 1 (200) | Same category, but the answer is a giveaway to anyone who knows the topic. Distractors are real, not jokes. |
| 2 (400) | Well-known same-category options; a casual player still picks the answer, but can't eliminate throwaways. |
| 3 (600) | Real alternatives a fan might briefly consider. |
| 4 (800) | Close alternatives from the same field — easy to mix up without solid knowledge. |
| 5 (1000) | Expert-level near-misses; distractors should make even a specialist pause. |

**The elimination test:** could someone who does *not* know the answer rule out any option purely because it's silly or off-topic? If yes, replace that option. All four should look defensible at a glance.

**Bad:** `['Silicon Valley', 'Hollywood', 'Napa Valley', 'The Moon']` — three are clearly not tech hubs.  
**Good:** `['Silicon Valley', 'Seattle', 'Austin', 'Boston']` — all real US tech centers.

### 4. Scope by level

| Tier | Scope |
|------|--------|
| 200–400 | Mainstream only — iconic, widely recognizable |
| 600 | Common knowledge — popular facts most fans share |
| 800 | Fan detail — rewards engagement, still fair |
| 1000 | Niche — deep cuts, obscure names, fine print |

Do not put niche or meta-system trivia at 200–400. Save obscurity for 1000.

### 5. Balance within a level

Across each set of 20 questions at one difficulty:

- Mix **question types** (who / what / where / when / how / which)
- Mix **sub-areas** of the topic (don’t make all 20 about one character)
- Avoid repeating the **same answer** multiple times in one level unless the angle is clearly different
- Keep tone consistent: complete sentences, plain English, no trick phrasing

### 6. Parenthetical answers

Use parentheses sparingly for disambiguation:

```ts
answer: 'Raiden Shogun (Ei)'
answer: 'Eurodollars (eddies)'
answer: 'Their lost twin (Aether or Lumine)'
```

Remember: text inside parentheses is still checked for leaks.

---

## Special topic exceptions

| Topic ID | Exception |
|----------|-----------|
| `riddles` | Exactly **3** choices total (not 4). Questions are prefixed with `Riddle:`. |
| `finish-the-quote` | Answer **may** appear in the question (lyrics/quotes). Still needs **4** choices. |

All other topics follow the standard rules above (exactly **4** hand-written choices).

---

## Examples by level (same topic)

**Board Games & Puzzles** — how difficulty should climb on the easier scale:

| Level | Points | Example question | Answer |
|------:|-------:|------------------|--------|
| 1 | 200 | What classic game has players buy streets and build hotels on a city board? | Monopoly |
| 2 | 400 | What game drops red and yellow discs into a vertical grid? | Connect Four |
| 3 | 600 | In Monopoly, how much money do you collect when you pass Go? | $200 |
| 4 | 800 | In Monopoly, which two dark-blue properties are the most expensive on the board? | Boardwalk and Park Place |
| 5 | 1000 | In Monopoly, which railroad is NOT one of the four on the classic board? | Union Pacific |

Notice: giveaway → very easy → common knowledge → fan detail → niche. Same franchise, steadily narrower audience.

---

## Checklist before submitting a new topic

- [ ] File exports `createTopic(id, name, bank)` with **20 questions × 5 levels**
- [ ] Topic registered in `src/data/jeopardy/index.ts`
- [ ] Every question has **exactly 4 choices** (riddles: 3)
- [ ] Every `choices[0]` matches `answer`
- [ ] All four choices are distinct
- [ ] **All three distractors are plausible, same-category, and none can be eliminated as silly/off-topic**
- [ ] Distractor closeness **scales with level** (giveaway-but-real at 1 → expert near-miss at 5)
- [ ] No answer words appear in any question (unless exempt topic)
- [ ] Level 1 questions are **giveaways**; level 3 is **common knowledge**; level 5 is **niche**
- [ ] Nothing obscure or meta-heavy below level 4
- [ ] Topic loads without `createTopic` throwing (import the file or run a build)

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Level 1 asks rules, numbers, or secondary characters | Move to 600+ or simplify to a giveaway fact |
| Level 3 reads like specialist/deep lore | Move down to 400–600 or up to 800 if truly fan-only |
| Level 5 asks common knowledge with hard wording | Move to 600–800; level 5 should be genuinely niche |
| Level 5 is easier than level 3 | Swap levels — difficulty must increase on average |
| Answer hidden in the clue | Rephrase the question |
| Distractors from unrelated categories | Use same topic, same type |
| Filler/joke fourth option (`'None of these'`, `'A power cable'`) | Replace with a fourth real same-category option |
| One or more distractors are obviously eliminable | Make all three defensible so the answer can't be guessed |
| Meta/system trivia (currencies, patch numbers) at low tiers | Cut or move to 800–1000 |
| Overly long questions | Shorten; one fact per clue |

---

## For AI assistants

When the user asks to add or rebalance a Jeopardy topic:

1. **Read this file first** for difficulty calibration.
2. **Read 1–2 existing topics** in the same domain (e.g. `board-games.ts`, `drugs.ts`) for tone and format.
3. **Draft all 100 questions** before editing the file.
4. **Validate** that `createTopic` accepts the file (no count errors, no answer leaks, no duplicate choices).
5. **Rebalance** by moving misfit questions to the correct level rather than only rewriting wording.

**Calibration sanity check:** If most players would miss a 200-point clue, it is too hard. If most players would get a 1000-point clue, it is too easy. Anchor at **200 = giveaway**, **600 = common knowledge**, **1000 = niche**.
