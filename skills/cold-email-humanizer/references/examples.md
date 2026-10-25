# Ten drafts: before, rule-engine after, gold rewrite

The BEFORE drafts are `examples/inputs/ai-drafts/01` to `10`. The ENGINE AFTER is the rule-based output from `examples/10-humanize.md` (copied verbatim from `examples/examples.json`). The GOLD is a human rewrite that keeps every fact, merge tag, signature tag and the ask, runs 50 to 90 words, adds no claims, and reads as a person wrote it.

Study the gap between ENGINE AFTER and GOLD. The engine removes the tells and leaves the skeleton. The gold rewrite removes the tells and then writes the sentence a person would have written in the first place. That is the standard.

Note: the BEFORE drafts contain the em dashes and exclamation marks being removed. They are inputs, quoted exactly.

---

## 1. SaaS intro (Smartlead tags)

BEFORE:

<!-- verified: humanize item 0 input -->
```text
Hi {{first_name}},

I hope this email finds you well! I wanted to reach out because I came across {{company_name}} and was truly impressed by your innovative approach to leveraging cutting-edge technology.

Our robust platform seamlessly streamlines your sales workflow — it's a true game-changer for teams like yours.

Please don't hesitate to reach out if you'd like to delve deeper into this.

Best,
%signature%
```

ENGINE AFTER:

<!-- verified: humanize item 0 output -->
```text
Hi {{first_name}},

I'm writing because I came across {{company_name}} and was impressed by your new approach to using modern technology.

Our solid platform smoothly simplifies your sales workflow. It's a big change for teams like yours.

Reply anytime.

Best,
%signature%
```

GOLD:

```text
Hi {{first_name}},

I came across {{company_name}} and liked how your team is approaching new technology.

We built a platform that cuts the manual steps out of a sales workflow. Teams like yours are the ones who get the most out of it, which is why I am writing.

If you want a closer look, reply here and I will walk you through it.

Best,
%signature%
```

Why it is better than the engine: "solid platform smoothly simplifies" is clean but nobody talks like that. The gold says what the platform does in plain words and turns "don't hesitate to reach out" into one concrete reply ask.

---

## 2. Agency growth pitch (Instantly tags)

BEFORE:

<!-- verified: humanize item 1 input -->
```text
Hi {{firstName}},

I hope you're doing well. In today's fast-paced digital landscape, it's crucial for brands to stand out.

At our agency, we're passionate about helping businesses unlock their full potential and foster meaningful growth.

I'd love to explore how we can elevate {{companyName}} to the next level. Would you be open to a quick chat?

Warm regards,
{{accountSignature}}
```

ENGINE AFTER:

<!-- verified: humanize item 1 output -->
```text
Hi {{firstName}},

It's important for brands to stand out.

At our agency, we focus on helping businesses grow.

I'd love to explore how we can improve {{companyName}}. Would you be open to a quick chat?

Warm regards,
{{accountSignature}}
```

GOLD:

```text
Hi {{firstName}},

It is hard for a brand to stand out right now, and most of the pitches you get probably sound the same.

We help businesses grow, and I think there is room to do that for {{companyName}}. I would rather show you how than describe it in an email.

Open to a quick chat?

Warm regards,
{{accountSignature}}
```

Why: the engine left "It's important for brands to stand out." as an orphan sentence. The gold keeps the point, keeps the "grow" claim without inflating it, and keeps the exact ask.

---

## 3. HVAC answering service (EmailBison tags)

BEFORE:

<!-- verified: humanize item 2 input -->
```text
Hey {FIRST_NAME},

I just wanted to touch base and introduce myself. We're a leading provider of state-of-the-art answering solutions — designed to empower HVAC businesses like {COMPANY_NAME}.

Additionally, our solution integrates seamlessly with your existing tools, ensuring a frictionless experience.

Looking forward to hearing from you!

{SENDER_EMAIL_SIGNATURE}
```

ENGINE AFTER:

<!-- verified: humanize item 2 output -->
```text
Hey {FIRST_NAME},

I wanted to talk and introduce myself. We're a provider of modern answering solutions, designed to help HVAC businesses like {COMPANY_NAME}.

Also, our solution integrates smoothly with your existing tools.

{SENDER_EMAIL_SIGNATURE}
```

GOLD:

```text
Hey {FIRST_NAME},

Quick intro. We run an answering service built for HVAC companies like {COMPANY_NAME}, so the phone gets picked up when your team cannot get to it.

It works with the tools you already use, so nothing changes on your end.

If missed calls are a problem for you, reply here and I will send over how it works.

{SENDER_EMAIL_SIGNATURE}
```

Why: the engine kept "answering solutions" and "integrates smoothly", and it cut the closer without replacing the ask. The gold names the service plainly, turns "integrates seamlessly" into what it means for the reader, and restores a reply ask.

---

## 4. Recruiting (Smartlead tags)

BEFORE:

<!-- verified: humanize item 3 input -->
```text
Hi {{first_name}},

I hope this message finds you well. I noticed that {{company_name}} is growing rapidly, which is truly exciting!

As a testament to our commitment to excellence, we have helped numerous organizations navigate the complex landscape of hiring.

Feel free to reach out at your earliest convenience.

Best regards,
%signature%
```

ENGINE AFTER:

<!-- verified: humanize item 3 output -->
```text
Hi {{first_name}},

I noticed that {{company_name}} is growing rapidly, which is exciting.

We have helped many organizations with hiring.

Reply anytime.

Best regards,
%signature%
```

GOLD:

```text
Hi {{first_name}},

Saw that {{company_name}} is growing fast. Congrats.

Growth usually means a lot of open roles at once, and that is the part we handle. We have helped many organizations hire when the volume jumps.

If hiring is on your plate right now, reply and I will share how we work.

Best regards,
%signature%
```

Why: the engine's "We have helped many organizations with hiring." is true to the draft but reads like a form. The gold connects the growth signal to the offer without adding a number or a client name, and keeps the open-ended reply ask.

---

## 5. Finance close (Instantly tags)

BEFORE:

<!-- verified: humanize item 4 input -->
```text
Hi {{firstName}},

I'm reaching out to see if {{companyName}} might benefit from our comprehensive, end-to-end financial close solution.

It's not just about saving time — it's about transforming the way your team works, unlocking actionable insights, and driving strategic value.

Would love to schedule a call to discuss further!

Best,
{{accountSignature}}
```

ENGINE AFTER:

<!-- verified: humanize item 4 output -->
```text
Hi {{firstName}},

I'm reaching out to see if {{companyName}} might benefit from our end-to-end financial close solution.

It's about transforming the way your team works, getting useful data, and driving value.

Open to a quick call?

Best,
{{accountSignature}}
```

GOLD:

```text
Hi {{firstName}},

Is month-end close still a slog at {{companyName}}?

We built an end-to-end close solution. It saves the team time, but the bigger change is that finance gets numbers it can act on instead of just a finished close.

If close is painful right now, open to a short call?

Best,
{{accountSignature}}
```

Why: the engine deleted the "not just X" clause and left a list of three abstractions ("transforming the way your team works, getting useful data, and driving value"). The gold keeps the time saving and the "actionable insights" claim in plain words and drops the empty "strategic value".

---

## 6. Commercial cleaning (EmailBison tags)

BEFORE:

<!-- verified: humanize item 5 input -->
```text
Hey {FIRST_NAME},

I hope you are having a wonderful week! I am reaching out to introduce our top-notch commercial cleaning services.

We pride ourselves on delivering exceptional, unparalleled quality, and our dedicated team goes above and beyond to ensure your complete satisfaction.

Don't hesitate to let me know if this resonates with you.

{SENDER_EMAIL_SIGNATURE}
```

ENGINE AFTER:

<!-- verified: humanize item 5 output -->
```text
Hey {FIRST_NAME},

I am reaching out to introduce our reliable commercial cleaning services.

We focus on delivering high quality, and our team works hard to get it right.

Worth a look?

{SENDER_EMAIL_SIGNATURE}
```

GOLD:

```text
Hey {FIRST_NAME},

We clean commercial offices, and I wanted to introduce ourselves.

The pitch is simple: the work gets done properly on every visit, and if something gets missed we come back and fix it rather than argue about it.

If you are comparing cleaning vendors at the moment, reply here and I will send details.

{SENDER_EMAIL_SIGNATURE}
```

Why: the engine turned "don't hesitate to let me know if this resonates" into a bare "Worth a look?" with nothing to look at. The gold translates "exceptional quality" and "complete satisfaction" into the two concrete promises a cleaning buyer cares about, and gives a reply ask.

---

## 7. Follow-up bump (Smartlead tags)

BEFORE:

<!-- verified: humanize item 6 input -->
```text
Hi {{first_name}},

I just wanted to circle back on my previous email. I understand you're incredibly busy, so I'll keep this brief.

Simply put, we can help {{company_name}} supercharge its pipeline — it's that simple.

Let me know your thoughts!

%signature%
```

ENGINE AFTER:

<!-- verified: humanize item 6 output -->
```text
Hi {{first_name}},

I wanted to follow up on my previous email. I'll keep this short.

We can help {{company_name}} grow its pipeline.

Let me know your thoughts.

%signature%
```

GOLD:

```text
Hi {{first_name}},

Following up on my last email in case it got buried.

The short version: we help companies like {{company_name}} put more pipeline on the board, and I would like to know if that is a priority for you this quarter.

Any thoughts either way? If the timing is off, say so and I will leave it there.

%signature%
```

Why: the engine's version is fine but flat ("We can help {{company_name}} grow its pipeline."). The gold keeps the pipeline claim, keeps "let me know your thoughts" as the ask, and adds an easy out, which is what a bump needs.

---

## 8. Partnership (Instantly tags)

BEFORE:

<!-- verified: humanize item 7 input -->
```text
Hi {{firstName}},

I came across {{companyName}} and couldn't help but notice the amazing work your team is doing in the space.

I believe there is a tremendous opportunity for synergy between our organizations. By leveraging our respective strengths, we could unlock significant mutual value.

I'd be thrilled to explore this further at your convenience.

Cheers,
{{accountSignature}}
```

ENGINE AFTER:

<!-- verified: humanize item 7 output -->
```text
Hi {{firstName}},

I came across {{companyName}} and noticed the great work your team is doing.

I think there's a real opportunity for fit between our organizations. By using our respective strengths, we could get significant mutual value.

I'd be glad to explore this further when it suits you.

Cheers,
{{accountSignature}}
```

GOLD:

```text
Hi {{firstName}},

I came across {{companyName}} and your team's work stood out.

I think our two companies are strong in different places, and there is a real chance we could help each other: what you do well covers the gaps in what we do, and the other way round.

Would you be open to a short conversation about what that could look like, whenever it suits you?

Cheers,
{{accountSignature}}
```

Why: the engine produced "a real opportunity for fit between our organizations", which is not English anyone speaks. The gold says what "synergy" and "respective strengths" mean, keeps "at your convenience" as "whenever it suits you", and keeps the ask.

---

## 9. Webinar invite (EmailBison tags)

BEFORE:

<!-- verified: humanize item 8 input -->
```text
Hi {FIRST_NAME},

I'm excited to invite you to our exclusive, can't-miss webinar — a deep dive into the ever-evolving world of outbound sales!

Industry experts will share valuable insights, actionable strategies, and best practices to help you stay ahead of the curve.

Don't miss out — reserve your spot today!

{SENDER_EMAIL_SIGNATURE}
```

ENGINE AFTER:

<!-- verified: humanize item 8 output -->
```text
Hi {FIRST_NAME},

I'd like to invite you to our webinar on outbound sales.

Industry experts will share what is working right now to help you stay ahead.

Want me to save you a seat?

{SENDER_EMAIL_SIGNATURE}
```

GOLD:

```text
Hi {FIRST_NAME},

We are hosting a webinar on outbound sales. The speakers are people who run outbound every day, and they will walk through what is working for them right now and the mistakes they see most often.

If that is useful, want me to save you a seat? Reply here and I will send the details.

{SENDER_EMAIL_SIGNATURE}
```

Why: the engine's rewrite is short and correct but reads like a calendar notification. The gold keeps "industry experts" as something a person would say, keeps the "insights and best practices" promise in concrete terms, and keeps the seat ask.

---

## 10. Breakup email (Smartlead tags)

BEFORE:

<!-- verified: humanize item 9 input -->
```text
Hi {{first_name}},

I hope all is well. I've reached out a few times and haven't heard back, which is totally understandable given how busy things can get.

I just wanted to say that if you ever want to revisit this, my door is always open. It would truly be a pleasure to support {{company_name}} on its journey.

Wishing you continued success!

%signature%
```

ENGINE AFTER:

<!-- verified: humanize item 9 output -->
```text
Hi {{first_name}},

I've reached out a few times and haven't heard back.

I wanted to say that if you ever want to revisit this, I'm happy to help. I'd be glad to support {{company_name}}.

%signature%
```

GOLD:

```text
Hi {{first_name}},

I have reached out a few times and have not heard back, so I will stop here.

No hard feelings. If the timing is wrong or this is not a priority, that is fair.

If you ever want to revisit it, reply to this thread and I will pick it back up. I would still be glad to help {{company_name}}.

%signature%
```

Why: the engine cut the padding but left "I wanted to say that if you ever want to revisit this, I'm happy to help. I'd be glad to support {{company_name}}." which says the same thing twice. The gold keeps the no-reply fact, the open door and the offer to help, in the order a person would say them, and closes the loop.

---

## What the gold rewrites have in common

- One idea per sentence. No sentence longer than about 25 words.
- The ask is a single question or a single instruction, in the last line before the sign-off.
- Every claim traces to the draft. Where the draft was vague ("meaningful growth"), the rewrite is plain, not newly specific.
- Merge tags and signature tags sit exactly where they were.
- No dashes, no exclamation marks, no words from the inflated list.
- 50 to 90 words including the greeting and sign-off.
