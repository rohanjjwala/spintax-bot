---
name: cold-email-spintax
description: Write, humanize and convert spintax for cold email in the exact syntax of EmailBison, Smartlead or Instantly. Use when someone says "spintax", "spin this email", "add variations", "add spin blocks", "make versions of this email", "humanize then spin", "convert this spintax", or names EmailBison, Smartlead or Instantly together with email copy. Covers word-level, sentence-level and mixed spintax at 50, 80 or 100 percent intensity, an optional humanize pass first, and syntax conversion between the three platforms. Protects merge tags, signature tags, links, numbers and proper nouns, and never changes the meaning of the copy.
---

# Cold Email Spintax

Spintax gives a sending platform several ways to say the same sentence, so every copy of a campaign email is slightly different. Platforms pick one option per block at send time. Done well it lowers the "identical bulk mail" footprint without changing what the email says. Done badly it produces emails that read wrong, break merge tags or drift in meaning. This skill is the "done well" procedure.

Author: Rohan Jhunjhunwala, fractional GTM engineer. Part of the open-source Spintax Bot repo. The rule-based engine in `src/spintax.js` does the same job deterministically; this skill lets a model do it with judgement. Match the engine's rules, and beat it on the swaps it gets wrong (see `references/phrase-bank.md`, "Never swap").

## When to use

- Someone pastes a cold email and asks for spintax, spin blocks, variations or versions.
- Someone asks to prepare copy for EmailBison, Smartlead or Instantly.
- Someone asks to convert existing spintax from one of those platforms to another.
- Someone asks to humanize AI-sounding copy and then spin it. (Humanize alone is the sibling skill `cold-email-humanizer`.)

Do not use it for writing the email from scratch, for subject-line brainstorming, or for LinkedIn messages (those platforms do not parse spintax).

## Inputs to confirm

Ask only for what is missing, in one short message. Defaults in brackets if the person says "just do it".

1. Platform: EmailBison, Smartlead or Instantly. [Smartlead]
2. Intensity: 50, 80 or 100 percent. [80]
3. Mode: word, sentence or mixed. [word]
4. Humanize first: yes or no. [yes if the draft reads as AI-written, otherwise no]

If the email already contains merge tags, infer the platform from them: `{FIRST_NAME}` means EmailBison, `{{first_name}}` means Smartlead, `{{firstName}}` means Instantly. Confirm in the summary line rather than asking.

## Procedure

Work in this order every time. Details for each step live in `references/`.

### 1. Protect

Mark every token that must come through untouched and never go inside a block:

- Merge tags in any syntax: `{FIRST_NAME}`, `{{first_name}}`, `{{firstName}}`, `{{firstName|there}}`.
- Signature tags: `{SENDER_EMAIL_SIGNATURE}`, `%signature%`, `{{accountSignature}}`.
- Links, email addresses, phone numbers, dates, prices, percentages and every other number.
- Product names, company names, people's names, place names, job titles used as names, and anything in quotes.
- Existing spin blocks (keep them, convert their syntax if needed, never nest a new block inside).
- A line with an unclosed brace is broken input: leave the line exactly as written and say so in the summary.

### 2. Humanize (optional)

If asked, or if the draft has obvious AI tells, rewrite first using `cold-email-humanizer`. Keep every fact, number, name, merge tag, signature and the ask. Then spin the humanized text. Never spin first and humanize second.

### 3. Pick eligible phrases by intensity

An eligible phrase is a word or short phrase with at least one swap that fits the same grammatical slot and keeps the same meaning in this sentence. The safe list is `references/phrase-bank.md`. Numbers, names, protected tokens and anything on the "Never swap" list are not eligible.

- 50 percent: give a block to about half of the eligible phrases, spread evenly through the email, 2 options per block.
- 80 percent: give a block to most eligible phrases, 3 options per block where the group has 3 or more.
- 100 percent: give a block to every eligible phrase, up to 4 options per block.

The original wording is always one of the options. Options are the same length give or take a word.

### 4. Build the blocks for the mode

- Word mode: swap words and short phrases inside sentences. Structure of each sentence stays. If an "a" or "an" sits in front of the phrase, pull it into the block so every option carries the right article: `{a quick|a brief|an intro}`.
- Sentence mode: wrap whole sentences in one block with 2 to 4 complete rewrites of that sentence. Greeting, call to action, opt-out, follow-up bump and sign-off get the curated alternatives in `references/functions.md`. A sentence that contains a merge tag, link, signature or existing block cannot be wrapped; give it word-level swaps instead.
- Mixed mode: word-level swaps in the body, plus whole-sentence blocks for the greeting line, the call to action, the opt-out line, any follow-up bump and the sign-off.

Keep every block on one line. Keep paragraph breaks, blank lines, the subject line and the position of the sign-off exactly as in the original. Spin the subject line only lightly (one adjective at most) and never put a merge tag inside a subject block.

### 5. Write the syntax for the platform

- EmailBison: `{option one|option two}`, variables `{FIRST_NAME}`, signature `{SENDER_EMAIL_SIGNATURE}`. No inline fallbacks.
- Smartlead: `{option one|option two}`, variables `{{first_name}}`, signature `%signature%`. Variables stay outside blocks. No inline fallbacks.
- Instantly: `{{RANDOM | option one | option two}}`, variables `{{firstName}}`, fallbacks `{{firstName|there}}` allowed, signature `{{accountSignature}}`.

Full detail, including how to convert between platforms: `references/platforms.md`.

### 6. Self-check before replying

Render three random versions in your head, picking a different option in each block, and read them as the recipient would. Then run this list:

- [ ] Every option reads correctly in its sentence and means the same thing.
- [ ] a/an is right in every option.
- [ ] No merge tag, signature, link, email address or number inside any block.
- [ ] No block inside a block. Every brace opened is closed. Blocks match the platform syntax exactly.
- [ ] Original wording is one of the options in every block.
- [ ] No em dashes or en dashes anywhere, including options you wrote.
- [ ] No doubled words ("the the"), no space before punctuation, no "of I" or "to we" style pronoun breaks.
- [ ] No spam words: guarantee, guaranteed, act now, limited time, risk-free, no obligation, click here, buy now, cash, winner, urgent, earn money, double your, amazing, congratulations, 100% free, free money.
- [ ] Line breaks, subject, sign-off position and signature tag unchanged.
- [ ] Calls stayed calls where the email means phone calls. "Finance leads" stayed leads where it means people. "Cold email" stayed email where it means the channel.

Fix anything that fails, then reply.

## Hard rules

1. Never put a merge tag, signature tag, link, email address or number inside a spin block.
2. Every option must read correctly, keep the same meaning and roughly the same length. Never add a claim, number, name, promise or offer that is not in the original.
3. No nested blocks. 2 to 4 options per block. The original wording is always one option.
4. Keep line breaks, the subject line and the sign-off position exactly as written.
5. No em dashes or en dashes anywhere. No spam words.
6. Do not change what a word means in context. A phone call that goes to voicemail is not a meeting. "Answer every call" stays as written. Product names, proper nouns and numbers are never options.
7. Fix a/an so every option reads correctly.
8. Smartlead and EmailBison: no inline fallbacks; if the input has `{{first_name|there}}`, drop the fallback, keep `{{first_name}}`, and note it in the summary.
9. Return the spintax in a plain code block, nothing else above it.

## Output format

1. The finished spintax, in one plain text code block, in the platform's syntax. No headings or commentary above it.
2. Optional, if asked or if the person is new to spintax: two random renders in separate code blocks, labelled "Render 1" and "Render 2".
3. One summary line: platform, mode, intensity, number of blocks, approximate number of unique versions (product of option counts), and any notes (dropped fallback, line left as written, phrase not swapped and why).

Example summary line: `Smartlead, word, 80 percent, 11 blocks, about 15,000 versions. Dropped the inline fallback on {{first_name|there}} because Smartlead has no inline fallbacks.`

## References

- `references/functions.md`: exact definition of all 12 functions (word, sentence and mixed at 50, 80 and 100; humanize; humanize-then-spin; convert) with two verified input and output examples each.
- `references/platforms.md`: syntax, merge tags, signatures, fallbacks, HTML behaviour and conversion rules.
- `references/phrase-bank.md`: safe swap groups, context rules and the never-swap list.
- `references/examples/`: 120 engine-generated and lint-checked examples, 10 per function, with renders.
