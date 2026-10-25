---
name: cold-email-humanizer
description: Rewrite AI-sounding cold email so it reads as a person wrote it, without changing a single fact, merge tag, signature or the ask. Use when someone says "humanize this email", "this sounds like AI", "make this sound human", "remove the AI tells", "clean up this draft", "de-robot this", or pastes cold outreach copy that has stock openers, inflated vocabulary, em dashes or gushing praise. Also used as the first pass before cold-email-spintax when the draft is machine-written.
---

# Cold Email Humanizer

Cold email lives or dies on whether the reader believes a person wrote it. Machine-written drafts share a fingerprint: the same openers, the same inflated words, the same rhythms. This skill removes the fingerprint and leaves the message.

Author: Rohan Jhunjhunwala, fractional GTM engineer. Part of the open-source Spintax Bot repo. The rule engine in `src/spintax.js` does a find-and-replace version of this; a model should do the same job with better sentences.

## When to use

- Someone asks to humanize, clean up or de-AI a cold email, follow-up, breakup email, event invite or partnership note.
- A draft is about to be spun with `cold-email-spintax` and reads as AI-written. Humanize first, spin second.
- Someone asks "does this sound like AI?" Answer, then offer the rewrite.

Not for: long-form content, landing pages, blog posts. Those have their own rules. This skill is tuned for 40 to 120 word emails with a merge tag, a point and an ask.

## Hard rules

1. Never invent a fact. No new numbers, names, results, dates, customers, features, prices or claims. If the draft is vague, the rewrite is plain and vague, not plain and specific. If a sentence needs a real detail to work, write the plain version or ask.
2. Merge tags and signature tags stay exactly as written and exactly where they are: `{FIRST_NAME}`, `{{first_name}}`, `{{firstName|there}}`, `{SENDER_EMAIL_SIGNATURE}`, `%signature%`, `{{accountSignature}}`. Links too.
3. Keep the ask's intent. A request for a call stays a request for a call. A "reply if interested" stays a reply ask. A breakup email stays a breakup email. Wording can change; the thing being asked for cannot.
4. Keep every fact that is in the draft. You may compress or merge sentences; you may not drop the proof point, the offer or the reason for writing.
5. No em dashes or en dashes in the output. Use a comma, a colon, a period or a new sentence.
6. No exclamation marks in cold email.
7. Keep the structure: greeting line, short paragraphs, sign-off, signature tag on its own line. Merge paragraphs only when the result is clearer.
8. Do not add a signature, a P.S., a subject line or a disclaimer that was not there.
9. Match the register of the sender. A plain-spoken founder email stays plain-spoken. Do not make it formal, and do not add jokes or personality that is not in the draft.
10. Output the rewritten email in a code block, then one line listing what changed. Nothing else.

## Procedure

1. Read the draft once as the recipient. Note the one thing it is asking for and the two or three facts that support it. These survive no matter what.
2. Mark the tells. Go through `references/patterns.md` from the top: openers and closers, filler, inflated vocabulary, negative parallelism, rule of three, -ing tails, hedges and double hedges, gushing praise, dashes, exclamation marks, title case, emoji, curly quotes.
3. Rewrite sentence by sentence. Prefer the shortest plain version that keeps the fact. Prefer "is" and "has" over "serves as" and "boasts". Prefer a verb over a noun phrase ("we help X hire" over "we provide hiring solutions"). Say the thing the inflated word was hiding: "leverage our platform" is "use our platform"; "seamlessly integrates" is "works with the tools you already use".
4. Rebuild the ask as one plain question or one plain instruction. "Would love to schedule a call to discuss further!" becomes "Open to a short call?" or "Worth a quick chat this week?"
5. Cut a line that says nothing after the tells are removed ("I hope this finds you well" leaves nothing; drop the line and the blank it leaves).
6. Read the result aloud in your head. Target 50 to 90 words for a first-touch email, fewer for a bump. Every sentence should be one a person would type without thinking about it.
7. Self-check, then reply.

## Self-check

- [ ] Every fact, number and name from the draft is still there, and nothing new has appeared.
- [ ] Merge tags, signature tag and links are untouched and in place.
- [ ] The ask asks for the same thing.
- [ ] No em dashes, en dashes, exclamation marks, emoji, curly quotes or title case headings.
- [ ] No words from the inflated list in `references/patterns.md`.
- [ ] No "not just X, it's Y", no list of three abstract nouns, no "-ing" tail explaining the significance of the previous clause.
- [ ] No stock opener or closer.
- [ ] Reads like the same sender on a good day, not like a different person.

## Output format

```
<rewritten email>
```

Then one line: `Changed: removed the stock opener, cut "leverage" and "seamlessly", split the dash, replaced "don't hesitate" with a plain ask.`

If asked to also spin, hand the rewritten text to `cold-email-spintax` and follow that skill's output format instead.

## References

- `references/patterns.md`: the full catalogue of AI tells in cold email with before and after for each.
- `references/examples.md`: ten AI-written drafts, each with the rule-engine rewrite and a gold human rewrite, so the difference between "clean" and "good" is visible.
