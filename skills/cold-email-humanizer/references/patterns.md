# AI tells in cold email: the catalogue

Each pattern has what to look for, why it reads as machine-written, and a before and after. The after versions keep every fact from the before. Where the before has no fact, the after is short.

The rule engine in `src/spintax.js` handles the first few categories by find-and-replace. A model should recognise the pattern even when the wording is new.

## 1. Stock openers

Look for: "I hope this email finds you well", "I hope you're doing well", "I hope all is well", "I hope you're having a great week", "I trust this finds you well", "Happy Monday", "I wanted to reach out", "I just wanted to touch base", "I'm reaching out because", "My name is X and I am the Y at Z", "Allow me to introduce myself".

Why: every bulk email opens this way, so the reader's filter fires before the point arrives. The opener carries no information.

Before:
> I hope this email finds you well! I wanted to reach out because I came across {{company_name}} and was impressed.

After:
> I came across {{company_name}} last week and one thing stood out.

(Only say "last week" if the draft says when. Otherwise: "I came across {{company_name}} and one thing stood out.")

Before:
> I just wanted to touch base and introduce myself.

After:
> Quick intro.

## 2. Scene-setting and significance openers

Look for: "In today's fast-paced world", "In today's competitive landscape", "In an era of", "Now more than ever", "As you know", "It's no secret that", "The world of X is evolving".

Why: a throat-clear that tells the reader something they already know, in words they have seen a thousand times.

Before:
> In today's fast-paced digital landscape, it's crucial for brands to stand out.

After:
> Standing out as a brand is hard right now.

Or delete the line entirely if the next sentence makes the point.

## 3. Stock closers and pushy calls to action

Look for: "Please don't hesitate to reach out", "Feel free to reach out at your earliest convenience", "Looking forward to hearing from you", "I look forward to your response", "Let me know your thoughts!", "Would love to schedule a call to discuss further", "Don't miss out", "Reserve your spot today", "Act now", "Let's connect", "Let's hop on a call", "Wishing you continued success", "Warmest regards".

Why: the ask is buried under politeness or hype. A person asks one plain question.

Before:
> Would love to schedule a call to discuss further! Please don't hesitate to reach out if you have any questions.

After:
> Open to a short call next week?

Before:
> Don't miss out, reserve your spot today!

After:
> Want me to save you a seat?

Before:
> Feel free to reach out at your earliest convenience.

After:
> Reply anytime.

## 4. Filler and hedges

Look for: "just" (as a softener), "simply", "simply put", "truly", "really", "actually", "basically", "very", "incredibly", "in order to", "due to the fact that", "at this point in time", "in the event that", "has the ability to", "it is important to note that", "I understand you're incredibly busy, so I'll keep this brief", "which is totally understandable", "I believe there is", "might potentially", "could possibly", "I was wondering if perhaps".

Why: padding. Each one lengthens the sentence without adding meaning, and the double hedges ("might potentially") read as a machine being careful.

Before:
> I just wanted to circle back on my previous email. I understand you're incredibly busy, so I'll keep this brief.

After:
> Following up on my last email. I'll keep it short.

Before:
> In order to help you, we might potentially be able to reduce the time it takes.

After:
> We can cut the time it takes.

## 5. Inflated vocabulary

Look for the words in the left column. Replace with the right column or with the plain thing the word was standing in for.

| Inflated | Plain |
|---|---|
| leverage | use |
| utilize | use |
| enhance | improve |
| elevate | improve, raise |
| streamline | simplify, speed up |
| seamless, seamlessly | smooth, works with, without extra steps |
| frictionless | easy |
| robust | solid, reliable |
| cutting-edge, state-of-the-art, best-in-class | modern, current, or name the specific thing |
| innovative | new |
| game-changer, game-changing | a big change, or say what changes |
| unlock | get, open up |
| empower | help, let |
| revolutionize, transform, transformative | change, or say what changes |
| supercharge | grow, speed up |
| synergy | fit, overlap |
| delve into, deep dive | look at, dig into, go through |
| foster | build |
| showcase | show |
| pivotal, crucial, critical | important, or cut |
| comprehensive, holistic | complete, full, or cut |
| exceptional, unparalleled, top-notch, world-class | good, reliable, or cut |
| amazing, incredible, tremendous | great, real, or cut |
| thrilled, excited, delighted | glad |
| numerous | many |
| actionable insights | useful data, numbers you can act on |
| valuable insights | useful ideas |
| strategic value | value, or say what the value is |
| align with | fit |
| navigate the landscape of | handle, deal with |
| stay ahead of the curve | stay ahead |
| full potential | grow |
| to the next level | cut |
| meaningful growth | growth |
| commitment to excellence | standards, or cut |
| testament to | shows |
| tapestry, landscape (abstract), journey, ecosystem | cut or name the concrete thing |
| additionally, furthermore, moreover | also, or start the sentence plainly |
| underscore, highlight (verb), garner, intricate | show, get, complex |

Before:
> Our robust platform seamlessly streamlines your sales workflow, a true game-changer for teams like yours.

After:
> Our platform takes the manual steps out of your sales workflow.

Before:
> By leveraging our respective strengths, we could unlock significant mutual value.

After:
> Our strengths overlap in a useful way, and I think there is real value for both of us.

## 6. Negative parallelism

Look for: "It's not just about X, it's about Y", "not only X but also Y", "This isn't X. It's Y.", "more than a tool, it's a partner", and clipped tailing negations: "no fluff", "no guesswork", "no strings".

Why: a rhetorical shape machines reach for constantly. It also wastes the X clause on a thing you are not saying.

Before:
> It's not just about saving time, it's about transforming the way your team works.

After:
> It saves the team time, and it changes how the close gets done.

Before:
> We deliver results. No fluff, no guesswork.

After:
> We deliver results and show you how we got them.

## 7. Rule of three abstractions

Look for: three abstract nouns or adjectives in a row: "valuable insights, actionable strategies, and best practices", "faster, smarter, and more efficient", "innovation, inspiration, and impact", "trust, transparency, and results".

Why: the triplet sounds complete and says nothing. One concrete item beats three vague ones.

Before:
> Industry experts will share valuable insights, actionable strategies, and best practices to help you stay ahead of the curve.

After:
> The speakers will walk through what is working for them right now.

## 8. The "-ing" tail

Look for: a clause ending with a participle phrase that explains the significance of what came before: ", ensuring a frictionless experience", ", empowering your team to focus on what matters", ", driving growth across the organization", ", highlighting our commitment to", ", allowing you to", ", helping you to".

Why: fake depth bolted onto a plain statement. Either the tail says something concrete (make it a sentence) or it does not (cut it).

Before:
> Our solution integrates seamlessly with your existing tools, ensuring a frictionless experience.

After:
> It works with the tools you already use.

Before:
> We help companies hire faster, empowering their teams to focus on what matters most.

After:
> We help companies hire faster.

## 9. Gushing praise and flattery

Look for: "I was truly impressed by your innovative approach", "the amazing work your team is doing", "your impressive growth", "I'm a big fan of", "Congratulations on your incredible success", "love what you're building".

Why: praise without a specific is flattery, and the reader knows it was generated. Praise with a specific is fine, if the specific is in the draft.

Before:
> I came across {{companyName}} and couldn't help but notice the amazing work your team is doing in the space.

After:
> I came across {{companyName}} and your team's work stood out.

If the draft names the specific ("your new pricing page", "the Series A"), keep the specific and drop the adjective.

## 10. Self-praise and company boilerplate

Look for: "We are a leading provider of", "As a testament to our commitment to excellence", "We pride ourselves on", "We're passionate about", "Our dedicated team goes above and beyond", "award-winning", "trusted by thousands" (unless a number is given), "ensure your complete satisfaction".

Why: the reader cannot verify any of it, and every vendor says it.

Before:
> We're a leading provider of state-of-the-art answering solutions designed to empower HVAC businesses.

After:
> We run an answering service for HVAC companies.

Before:
> We pride ourselves on delivering exceptional, unparalleled quality, and our dedicated team goes above and beyond to ensure your complete satisfaction.

After:
> The work gets done properly and if something is missed we fix it.

## 11. Em dashes, en dashes and double hyphens

Look for: the em dash (the long dash), the en dash (the shorter one often used in ranges), a double hyphen " -- ", and a single hyphen with spaces around it used as a dash. Also number ranges joined by a dash.

Why: the most reliable single tell. Humans typing email almost never produce an em dash.

Fix, in order of preference: a period and a new sentence, a comma, a colon, a rewrite. Ranges become "5 to 10". This file writes the dash as " -- " in the examples so that the file itself stays dash-free; in real drafts you will see the long dash character.

Before:
> Our platform streamlines your workflow -- it's a true game-changer for teams like yours.

After:
> Our platform simplifies your workflow. Teams like yours get the most out of it.

Before:
> We typically save clients 5 -- 10 hours a week.

After:
> We typically save clients 5 to 10 hours a week.

## 12. Exclamation marks

Look for: any "!" in a cold email.

Why: forced enthusiasm. One in a reply to a friend is fine; one in a cold email reads as a template.

Before:
> Let me know your thoughts!

After:
> Let me know what you think.

## 13. Title case, headings, bold and bullets in a short email

Look for: a Subject written In Title Case, bold phrases in the body, bullet lists in a 60-word email, a heading above the body, inline-header bullets ("**Speed:** we are fast").

Why: structure built for a document, not a note between two people.

Before:
> **Why Us:** Faster Onboarding, Better Support, Lower Cost.

After:
> Onboarding takes a week, support answers the same day, and it costs less than what you have now.

(Only if those three facts are in the draft. Otherwise: "Onboarding is quick and support is fast.")

## 14. Emoji and decorative symbols

Look for: any emoji, a rocket or wave in the subject, check marks as bullets, arrows.

Why: cold email from a person does not have them. They also trip some spam filters.

Fix: remove. Do not replace with a word.

## 15. Curly quotes and odd spacing

Look for: curly quotes and apostrophes, double spaces, a space before punctuation.

Why: copy pasted from a generator or a document. Harmless on their own but they travel with the other tells.

Fix: straight quotes, single spaces, no space before punctuation.

## 16. Vague authority and weasel words

Look for: "studies show", "experts agree", "industry leaders are", "many companies like yours", "research suggests", with no source or number.

Why: a claim that cannot be checked. In cold email it also sounds like a pitch deck.

Before:
> Studies show that companies like yours lose significant revenue to missed calls.

After:
> Missed calls after 5pm are missed jobs.

(The after only holds if the draft is about after-hours calls. Never add the study if it is not in the draft; cut the claim.)

## 17. Copula avoidance

Look for: "serves as", "stands as", "represents", "boasts", "features", "offers a" where "is" or "has" would do.

Before:
> Our platform serves as a comprehensive solution and boasts over 200 integrations.

After:
> Our platform has 200 integrations.

## 18. Over-explaining the obvious

Look for: "which is totally understandable given how busy things can get", "I know your inbox is full", "I realize you get a lot of these emails", "I know you're busy, so".

Why: apologising for the email makes it longer. The reader already knows they are busy.

Before:
> I've reached out a few times and haven't heard back, which is totally understandable given how busy things can get.

After:
> I've reached out a few times and haven't heard back, so I'll stop here.

## 19. Lines that empty out

After removing the tells, some lines say nothing: "I hope this finds you well." becomes nothing. "Wishing you continued success!" becomes nothing. Delete the line and the blank line it leaves. Never leave "Hi {{first_name}}," followed by two blank lines.

## 20. What to keep

Not every short word is a tell. Keep: contractions, "quick question", "congrats", a plain "thanks", a one-line P.S. if it carries a fact, a specific compliment that names the thing. The goal is the sender's voice without the generator's habits, not a different voice.

## The ten-second test

Read the rewrite and ask: would this sender type this sentence on a phone, to one person, without a template? If a sentence fails, it is still a tell.
