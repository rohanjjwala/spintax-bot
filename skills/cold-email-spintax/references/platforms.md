# Platform syntax reference

Three sending platforms, three syntaxes. Get these exactly right or the platform sends the braces to the prospect.

## Quick table

| | EmailBison | Smartlead | Instantly |
|---|---|---|---|
| Spin block | `{a\|b\|c}` | `{a\|b\|c}` | `{{RANDOM \| a \| b \| c}}` |
| First name | `{FIRST_NAME}` | `{{first_name}}` | `{{firstName}}` |
| Company | `{COMPANY_NAME}` | `{{company_name}}` | `{{companyName}}` |
| Custom variable "city" | `{CITY}` | `{{city}}` | `{{city}}` |
| Custom variable "job title" | `{JOB_TITLE}` | `{{job_title}}` | `{{jobTitle}}` |
| Signature | `{SENDER_EMAIL_SIGNATURE}` | `%signature%` | `{{accountSignature}}` |
| Inline fallback | Not supported | Not supported | `{{firstName\|there}}` |
| Variable inside a block | Never | Never | Never |
| Nested blocks | Never | Never | Never |

Case matters: `{first_name}` is not an EmailBison variable and `{{FIRST_NAME}}` is not a Smartlead one. `RANDOM` in Instantly is upper case.

## EmailBison

- Block: `{option one|option two|option three}`. Single braces, pipe separated, no spaces required around the pipes. Options may contain spaces, commas and question marks.
- Variables: single braces, upper snake case: `{FIRST_NAME}`, `{COMPANY_NAME}`, `{CITY}`. Multi-word names join with underscores.
- Signature: `{SENDER_EMAIL_SIGNATURE}` on its own line at the end.
- Fallbacks: none inline. If a lead has no value, the platform inserts an empty string or the fallback set at campaign level. Write copy that survives an empty value: "Hi {FIRST_NAME}," becomes "Hi ," so set a campaign-level fallback or keep the greeting line out of risk.
- Ambiguity: a variable and a one-option block look alike (`{FIRST_NAME}` vs `{Hi}`). EmailBison treats a single-brace token without a pipe as a variable. Never write a one-option block.
- HTML: EmailBison stores each paragraph as `<p>...</p>` with `<p><br></p>` between paragraphs. A block must sit inside one paragraph; never let a block cross a paragraph or line break.

## Smartlead

- Block: `{option one|option two|option three}`. Same shape as EmailBison.
- Variables: double braces, lower snake case: `{{first_name}}`, `{{company_name}}`, `{{job_title}}`. Custom fields use the column header in snake case.
- Signature: `%signature%` on its own line at the end. Also seen: `{{signature}}` in some accounts; prefer `%signature%` unless the person's existing copy uses the other form.
- Fallbacks: not inline. Smartlead fills missing values from the lead sheet; a blank cell becomes an empty string. If the input contains `{{first_name|there}}` (copied from Instantly), drop the fallback part, keep `{{first_name}}`, and say so.
- Variables must stay outside spin blocks. `{Hi {{first_name}}|Hey {{first_name}}}` breaks. Write `{Hi|Hey} {{first_name}},` instead.
- HTML: Smartlead joins lines with `<br>` and paragraphs with `<br><br>`. Keep each block on one line.
- Subject line: spintax works in the subject. Keep it to one small block, no variables inside the block.

## Instantly

- Block: `{{RANDOM | option one | option two | option three}}`. Double braces, the literal word `RANDOM`, then options separated by pipes. Spaces around the pipes are conventional and safe; the platform trims them.
- Variables: double braces, camel case: `{{firstName}}`, `{{companyName}}`, `{{jobTitle}}`, `{{city}}`.
- Inline fallbacks allowed: `{{firstName|there}}`, `{{companyName|your company}}`. The fallback is plain text after a pipe inside the variable's own braces. This is a variable, not a spin block: it has no `RANDOM`.
- Signature: `{{accountSignature}}` on its own line at the end.
- Variables stay outside spin blocks here too. `{{RANDOM | Hi {{firstName}} | Hey {{firstName}}}}` nests braces and breaks. Write `{{RANDOM | Hi | Hey}} {{firstName}},`.
- HTML: Instantly stores each line as `<div>...</div>` with `<div><br></div>` between paragraphs. One block per line, never across lines.
- A single-brace block `{a|b}` pasted into Instantly is sent literally. Convert it.

## Rules that hold on every platform

1. One block never contains another block, a variable, a signature tag, a link, an email address or a number.
2. A block never spans a line break or paragraph break.
3. Two to four options per block. One option is not a block. More than four adds little and makes checking harder.
4. The original wording is always one of the options.
5. Options inside a block share the same capitalisation and the same leading and trailing punctuation. Write `{Mind if I send it over?|Should I send it your way?}`, not `{Mind if I send it over?|should I send it your way}`.
6. Where an "a" or "an" precedes the swapped word, pull the article into the block so each option carries the right one: `{a quick|a brief|an intro}`.
7. Greeting blocks go before the variable: `{Hi|Hey|Hello} {{first_name}},`.
8. Sign-off blocks include the comma: `{Best,|Thanks,|Cheers,}` followed by the signature tag on the next line.

## Converting between platforms

Conversion changes syntax only. It never adds, removes or reorders variation.

Steps:

1. Spin blocks: rewrite every block into the target shape. `{a|b}` to `{{RANDOM | a | b}}` for Instantly; `{{RANDOM | a | b}}` to `{a|b}` for EmailBison or Smartlead. Trim spaces around options when going to single braces.
2. Variables: map the name, not just the braces. Split the name into words (`first_name`, `FIRST_NAME`, `firstName` all become "first name"), then rebuild: upper snake for EmailBison, lower snake for Smartlead, camel for Instantly. `{CITY}` becomes `{{city}}` on both Smartlead and Instantly. `{{job_title}}` becomes `{JOB_TITLE}` or `{{jobTitle}}`.
3. Fallbacks: going to Instantly, keep `{{first_name|there}}` as `{{firstName|there}}`. Going to EmailBison or Smartlead, drop the fallback and keep the variable, and list the drop in the summary.
4. Signature tag: swap to the target platform's tag. Keep it on its own line in the same position.
5. Links, email addresses, numbers and plain text are untouched.
6. Report the changes in one line, for example: `{{first_name}} to {FIRST_NAME}, spin blocks to {...|...}, signature tag to {SENDER_EMAIL_SIGNATURE}`.

Mixed input (Smartlead variables with Instantly blocks, or similar) converts the same way: every token goes to the target syntax.

## Checking the output

Render three versions by picking a different option in each block and read them. Then search the text for:

- `{{RANDOM` on EmailBison or Smartlead output, or a bare `{a|b}` on Instantly output: wrong syntax.
- A `{` inside a block, a `|` inside a variable on EmailBison or Smartlead, or a `%` inside a block: a protected token leaked into a block.
- `{` count different from `}` count: unclosed brace.
- Em or en dashes: not allowed anywhere.
- `a ` before a vowel sound or `an ` before a consonant sound in any rendered version.
