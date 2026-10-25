# Using the skills

The repo ships two skills that teach a model to do what the rule engine does, with judgement:

- `skills/cold-email-spintax/`: word, sentence and mixed spintax at 50, 80 or 100 percent for EmailBison, Smartlead and Instantly; humanize-then-spin; convert between platforms.
- `skills/cold-email-humanizer/`: rewrite AI-sounding cold email without changing facts, merge tags or the ask.

Each skill folder has a `SKILL.md` (the instructions) and a `references/` folder (platform syntax, function definitions, phrase bank, pattern catalogue, 120 verified examples). There is also `prompts/chatgpt-instructions.md`, a single block that combines both skills for ChatGPT or any other model.

Menu names in the Claude apps change from time to time. The paths below were checked against Anthropic's help centre and docs on 25 October 2026. If a menu is not where this says, search the settings for "skills".

## A. Claude Code

Skills are folders on disk. Claude Code reads the `SKILL.md` frontmatter at startup and loads the body when a request matches the description, or when you invoke the skill by name.

Personal install (every project on this machine):

```bash
mkdir -p ~/.claude/skills
cp -R skills/cold-email-spintax ~/.claude/skills/
cp -R skills/cold-email-humanizer ~/.claude/skills/
```

Project install (this repo only, commit it so the team gets it):

```bash
mkdir -p .claude/skills
cp -R skills/cold-email-spintax .claude/skills/
cp -R skills/cold-email-humanizer .claude/skills/
```

Start a new Claude Code session (or run `/reload` if your version has it). Then either:

- Invoke by name: `/cold-email-spintax` followed by your email and settings, or `/cold-email-humanizer` followed by the draft.
- Or just ask: "Spin this for Smartlead, 80 percent, word level" with the email pasted. The description triggers the skill.

You can also point Claude at a file: "Read campaign/email-1.txt and spin it for Instantly, mixed, 100 percent. Write the result to campaign/email-1.spintax.txt."

Docs: https://code.claude.com/docs/en/skills

## B. Claude.ai and Claude Desktop

Custom skills are uploaded as a zip of the skill folder. The folder name must match the `name` in the frontmatter (it does), and the zip must contain `SKILL.md` at the top level of that folder.

1. Make the zips from the repo root:

   ```bash
   cd skills
   zip -r cold-email-spintax.zip cold-email-spintax
   zip -r cold-email-humanizer.zip cold-email-humanizer
   ```

2. Turn on code execution, which skills require. On Free, Pro and Max: Settings > Capabilities, switch on "Code execution and file creation" (newer layouts call it "Create and edit files"). On Team and Enterprise an owner turns it on under Organization settings > Plugins & skills > Policy.

3. Upload. At the time of writing the help centre gives this path: open Customize > Skills, click the "+" button, choose "+ Create skill", select "Upload a skill", and pick the zip. Some accounts show the same list under Settings > Features > Skills or Settings > Capabilities > Skills. Menu names may change; the step that matters is finding the Skills list and its upload button.

4. Toggle the skill on in the list. Repeat for the second zip.

5. Use it in any chat: paste the email and say what you want ("Humanize this, then spin for Instantly, mixed, 100 percent"). Claude loads the skill when the request matches.

Skills on claude.ai are per user. Each teammate uploads their own copy. Claude Desktop uses the same account settings as claude.ai; there is no separate install.

Docs: https://support.claude.com/en/articles/12512180-using-skills-in-claude and https://support.claude.com/en/articles/12512198-creating-custom-skills

## C. Claude API

The Skills API lets you upload the same folder once per workspace and attach it to Messages API calls together with the code execution tool.

Outline:

1. Zip each skill folder as above.
2. Upload it with a `POST /v1/skills` request (multipart, the zip as the file). The response gives a `skill_id`.
3. In a Messages API request, include the code execution tool and pass `container: { skills: [{ type: "custom", skill_id: "...", version: "latest" }] }`. The current beta header names are in the docs linked below; they have changed before, so copy them from the docs rather than from here.
4. Send the email in the user message with the settings in plain words ("Smartlead, 80 percent, word level, humanize first").

Custom skills uploaded to the API are visible to the whole workspace. Skills uploaded to claude.ai are not available in the API and the other way round; upload to each surface you use.

Docs: https://platform.claude.com/docs/en/build-with-claude/skills-guide and https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview

## D. ChatGPT

ChatGPT has no skills format, so the two skills are combined into one instruction block: `prompts/chatgpt-instructions.md` (under 7,500 characters, inside the 8,000 character limit for custom instructions).

Custom GPT (recommended, shareable with a team):

1. Open ChatGPT, go to Explore GPTs, click Create, then the Configure tab.
2. Name it, for example "Cold Email Spintax".
3. Paste the whole of `prompts/chatgpt-instructions.md` into Instructions.
4. Under Knowledge, upload:
   - `examples/examples.json` (120 verified examples)
   - `skills/cold-email-spintax/references/functions.md`
   - `skills/cold-email-spintax/references/phrase-bank.md`
   - `skills/cold-email-spintax/references/platforms.md`
   - `skills/cold-email-humanizer/references/patterns.md`
   - `skills/cold-email-humanizer/references/examples.md`
5. Turn off Web Browsing and Image Generation (not needed). Leave Code Interpreter on if you want it to count renders.
6. Add conversation starters such as "Spin this for Smartlead, 80 percent, word level" and "Humanize this draft".
7. Save. Share with your workspace or keep private.

Project (lighter, personal):

1. Create a new Project.
2. Paste `prompts/chatgpt-instructions.md` into the project instructions.
3. Add the same files under project files.
4. Start chats inside the project.

Plain chat (no setup): paste the instruction block as your first message, then the email. Expect slightly weaker results without the knowledge files.

## E. Any other model

Paste `prompts/chatgpt-instructions.md` as the system prompt, or as the first user message if the interface has no system prompt. If the tool accepts file attachments, attach `examples/examples.json` and the references listed above. For an API integration, the repo's own `src/ai.js` shows the shorter system prompt the web app uses in AI mode and how it few-shots from `examples.json`; it works with any chat-completions style API.

## Example prompts

Paste the email after the prompt, or attach it.

Word level:
- "Spin this for Smartlead, 50 percent, word level."
- "Add spintax for EmailBison at 80 percent, word level. Keep the subject line as is."
- "Spin this for Instantly, 100 percent, word level. Show me two renders."

Sentence level:
- "Sentence-level spintax, Smartlead, 50 percent."
- "Spin this sentence by sentence for EmailBison at 80 percent."
- "Instantly, sentence mode, 100 percent. Four versions of the CTA please."

Mixed:
- "Mixed spintax for Smartlead at 50 percent."
- "Spin for EmailBison, mixed, 80 percent."
- "Humanize this, then spin for Instantly, mixed, 100 percent."

Humanize:
- "Humanize this. Keep every fact and the merge tags."
- "This reads like AI. Make it sound like me, no new claims."
- "Does this sound AI-written? If so rewrite it."

Humanize then spin:
- "Humanize then spin, Smartlead, word level, 80 percent."
- "Clean this up and add spintax for EmailBison."

Convert:
- "Convert this EmailBison spintax to Instantly."
- "This is Instantly spintax. Convert it to Smartlead and tell me what changed."
- "Convert from Smartlead to EmailBison. Note any dropped fallbacks."

Checks:
- "Check this spintax for Instantly: any variables inside blocks, nested braces or meaning drift?"
- "Render five random versions of this spintax so I can read them."

## Training it on your own copy

The skills get better when the examples look like your emails. Add your winning emails in the same format and the model will copy your patterns instead of the generic ones.

1. Write the clean email (no spintax) into `examples/inputs/clean/NN-your-name.txt` using your platform's merge tags.
2. Either run the engine to generate the spintax (`node scripts/generate-examples.js`, see `scripts/`) or write the spintax by hand in the style of `examples/01-word-50.md`: input, spintax, two renders.
3. For Claude Code and the Skills API, drop the new `.md` into `skills/cold-email-spintax/references/examples/` and add one line about it under "References" in `SKILL.md`. Re-zip and re-upload for claude.ai and the API.
4. For ChatGPT, upload the new file under Knowledge (or regenerate `examples/examples.json` and re-upload it).
5. For the humanizer, add pairs to `skills/cold-email-humanizer/references/examples.md`: your AI draft as BEFORE and your final sent version as GOLD. Three to five real pairs in your voice move the output more than any instruction.

Rules for examples you add: no dashes, no client names you cannot share, merge tags in the right syntax, and read every option of every block once before saving. A bad example teaches a bad habit.

## Troubleshooting

- The model put a variable inside a block: say "variables stay outside blocks, fix and re-check". Both skills already say this; a reminder usually fixes it in one turn.
- Instantly output has single braces: "Instantly needs {{RANDOM | a | b}}, convert."
- The humanizer added a claim: "Remove anything not in the original. List every fact you kept." Then compare.
- Too stiff after 100 percent spin: ask for 80 percent, or "keep contractions contracted".
- The skill did not trigger in Claude: name it, `/cold-email-spintax`, or include the word "spintax" and the platform in the request.
