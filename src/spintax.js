/* Spintax engine for cold email. Runs fully in the browser, no API.
   Knowledge base = phrase groups (every option fits the same grammatical slot)
   + sentence intents (curated whole-sentence alternatives) + humanize rules.
   Output syntax per platform:
     EmailBison  {a|b}            variables {FIRST_NAME}
     Smartlead   {a|b}            variables {{first_name}}, %signature%
     Instantly   {{RANDOM | a | b}} variables {{firstName}}, {{accountSignature}} */
(function (root) {
  "use strict";

  /* ---------------- knowledge base ---------------- */
  const GROUPS = [
    ["hi", "hey", "hello"],
    ["quick", "short", "brief"],
    ["noticed", "saw", "spotted"],
    ["came across", "found", "ran into"],
    ["looks like", "seems like"],
    ["wondering if", "curious if", "curious whether"],
    ["curious", "wondering"],
    ["reaching out", "getting in touch", "writing"],
    ["help with", "assist with", "support with"],
    ["companies", "businesses"],
    ["company", "business"],
    ["clients", "customers"],
    ["client", "customer"],
    ["meetings", "calls"],
    ["call", "chat", "conversation"],
    ["leads", "prospects"],
    ["results", "outcomes"],
    ["problem", "issue", "challenge"],
    ["problems", "issues", "challenges"],
    ["process", "workflow", "system"],
    ["tool", "platform"],
    ["tools", "platforms"],
    ["email", "note", "message"],
    ["emails", "messages", "notes"],
    ["ideas", "thoughts"],
    ["book", "schedule"],
    ["happy to", "glad to"],
    ["i'd love to", "i'd like to", "i want to"],
    ["i think", "i believe", "my guess is"],
    ["could help", "might help", "can help"],
    ["grow", "scale"],
    ["growing", "scaling"],
    ["increase", "boost", "grow"],
    ["improve", "lift", "boost"],
    ["get more", "land more"],
    ["save time", "free up time"],
    ["check out", "take a look at", "look at"],
    ["take a look", "have a look"],
    ["makes sense", "is a fit", "fits"],
    ["let me know", "tell me"],
    ["no worries", "no problem", "all good"],
    ["busy", "slammed", "swamped"],
    ["right now", "at the moment", "currently"],
    ["recently", "just"],
    ["a few", "a couple of", "some"],
    ["great", "solid", "strong"],
    ["good fit", "strong fit", "solid fit"],
    ["simple", "easy", "straightforward"],
    ["helpful", "useful"],
    ["not relevant", "not a fit", "off base"],
    ["the right person", "the best person", "the right contact"],
    ["who handles", "who owns", "who runs"],
    ["in charge of", "responsible for"],
    ["because", "since"],
    ["for example", "for instance"],
    ["usually", "typically", "often"],
    ["companies like yours", "businesses like yours"],
    ["your team", "your people"],
    ["calendar", "schedule"],
    ["no pressure", "no rush"],
    ["either way", "regardless"],
    ["get back to you", "follow up with you"],
    ["follow up", "check back"],
    ["following up", "checking back"],
    ["worked with", "partnered with"],
    ["working with", "partnering with"],
    ["a lot of", "plenty of", "lots of"],
    ["every month", "each month"],
    ["every week", "each week"],
    ["right away", "straight away", "immediately"],
    ["struggle with", "have trouble with", "run into issues with"],
    ["focus on", "zero in on"],
    ["the goal", "the aim", "the idea"],
    ["figured", "thought"],
    ["open to", "up for", "interested in"],
    ["mind if", "okay if", "alright if"],
    ["send it over", "send it your way", "pass it along"],
    ["thank you", "thanks"],
    ["worth a look", "worth a glance"],
    ["put together", "pulled together", "built"],
    ["a handful of", "a few", "several"],
    ["outbound", "cold outreach"],
    ["reply rates", "response rates"],
    ["booked", "scheduled", "set up"],
    ["right fit", "good match"],
    ["makes sense for", "fits"],
    ["out of curiosity", "just curious"],
    ["happy to share", "glad to share", "can share"],
    ["shoot me a reply", "reply here", "drop me a line"],
    ["in your space", "in your market", "in your industry"],
    ["at the moment", "right now"],
    // contractions: always grammatical both ways
    ["i'm", "i am"], ["i'll", "i will"], ["you're", "you are"], ["we're", "we are"], ["they're", "they are"],
    ["don't", "do not"], ["doesn't", "does not"], ["didn't", "did not"], ["can't", "cannot"], ["won't", "will not"],
    ["isn't", "is not"], ["aren't", "are not"], ["wasn't", "was not"], ["haven't", "have not"], ["hasn't", "has not"],
    ["wouldn't", "would not"], ["couldn't", "could not"], ["you'll", "you will"], ["we'll", "we will"],
    ["you've", "you have"], ["we've", "we have"], ["i've", "i have"], ["you'd have", "you would have"], ["you'd be", "you would be"],
    ["it'd be", "it would be"], ["that's", "that is"], ["it's not", "it is not"], ["here's", "here is"], ["what's", "what is"],
    // everyday phrases (each option fits the same slot)
    ["can i", "could i"], ["can you", "could you"], ["share how", "show you how", "walk you through how"],
    ["show you", "walk you through"], ["how it works", "how this works"], ["have made", "have earned", "have pulled in"],
    ["counted", "spotted", "found"], ["surfing", "browsing", "going through"], ["website", "site"], ["websites", "sites"],
    ["this am", "this morning"], ["morning coffee", "first coffee"], ["collaborated", "partnered", "worked together"],
    ["collaborate", "partner", "work together"], ["on top of", "in addition to"], ["keeping", "holding onto", "retaining"],
    ["about", "around", "roughly"], ["over", "more than"], ["nearly", "almost"], ["get", "receive"],
    ["talk", "chat", "speak"], ["start", "begin"], ["quickly", "fast"], ["really", "genuinely"], ["very", "really"],
    ["again", "once more"], ["maybe", "perhaps"], ["probably", "likely"], ["definitely", "certainly"], ["soon", "shortly"],
    ["thanks for", "thank you for", "I appreciate"], ["hope", "trust"], ["looking for", "searching for", "hunting for"],
    ["looking to", "aiming to", "planning to"], ["trying to", "working to"], ["able to", "in a position to"],
    ["noticed that", "saw that"], ["figure out", "work out"], ["glad", "happy"], ["perfect", "ideal"], ["specific", "particular"],
    ["specifically", "in particular"], ["however", "that said"], ["meeting", "call"], ["agency", "firm"], ["agencies", "firms"],
    ["build", "create"], ["built", "created", "put together"], ["noticed your", "saw your", "came across your"],
    ["a quick look", "a short look", "a glance"], ["happen to", "by chance"], ["worth it", "worthwhile"],
    ["make sense", "be a fit"], ["work with", "partner with"], ["reach", "get to"], ["clients'", "customers'"],
    ["quite", "fairly"], ["simply", "just"], ["already", "by now"], ["together", "jointly"],
  ];
  // context guards: [phrase, test on the text right after the phrase, must match (true) or must not match (false)]
  const CONTEXT = {
    "about": [/^\s+[$€£~\d]/, true],
    "over": [/^\s+[$€£~\d]/, true],
    "get": [/^\s+(started|going|back|to|in|on|off|out|up|together|rid|it|done|this|that)\b/i, false],
    "start": [/^\s+(with|by|off|up|over)\b/i, false],
    "reach": [/^\s+(out|of)\b/i, false],
    "talk": [/^\s+(to you soon|soon)\b/i, true],
    "simply": [/^\s+(put|said)\b/i, false],
    "together": [/^\s*[.,!?]/, false],
    "build": [/^\s+(a|an|the|your|our|their|this|that|lists?|systems?|campaigns?)\b/i, true],
    // third element: the text BEFORE the phrase must match. Keeps "calls go to voicemail" and "answer every call" literal.
    "email": [/^/, true, /(?<!\bcold )$/i],
    "thanks for": [/^\s+(your|the|getting|taking|sharing|letting)\b/i, true],
    "leads": [/^/, true, /(?<!\b(finance|sales|marketing|team|tech|engineering|ops|design|product|IT) )$/i],
    "quick": [/^\s+fix(es)?\b/i, false],
    "growing": [/^\s+(rapidly|fast|quickly)\b/i, false],
    "just": [/^\s+((?!wanted|needed)\w+ed|opened|raised|hired|launched|moved|won|got|made|built|signed|closed)\b/i, true],
    "meetings": [/^/, true, /\b(book|booked|booking|set up|setting up|schedule|scheduled|more|held|\d+)\s*$/i],
    "calls": [/^/, true, /\b(book|booked|booking|set up|setting up|schedule|scheduled|more|held|\d+)\s*$/i],
    "meeting": [/^/, true, /\b(a|first|quick|short|brief|intro)\s*$/i],
    "call": [/^/, true, /\b(a|quick|short|brief|intro|\d+-minute)\s*$/i],
    "chat": [/^/, true, /\b(a|quick|short|brief|intro|\d+-minute)\s*$/i],
    "conversation": [/^/, true, /\b(a|quick|short|brief|intro|\d+-minute)\s*$/i],
  };

  const INTENTS = [
    { id: "call", test: /^((would you be |are you )?(open|up) (to|for) (a )?(quick |short |brief )?(chat|call|conversation)|worth a (quick |short |brief )?(chat|call|conversation))[?.!]*$/i,
      opts: ["Worth a quick chat?", "Open to a short call?", "Would a quick call make sense?", "Up for a short conversation?"] },
    { id: "send", test: /^((mind if|okay if|ok if|can|should|shall) i send|want me to send) (it|this|them|that)( over| your way| along)?[?.!]*$/i,
      opts: ["Mind if I send it over?", "Want me to send it over?", "Should I send it your way?", "Okay if I pass it along?"] },
    { id: "interest", test: /^(interested|is this (something you('d| would) be interested in|of interest|relevant|worth (a look|exploring))|does this (sound|look) (interesting|relevant|useful)|worth exploring)[?.!]*$/i,
      opts: ["Is this worth a look?", "Does this sound relevant?", "Worth exploring?", "Is this on your radar?"] },
    { id: "optout", test: /(not (relevant|a fit|interested)\?|wrong person|reply (no|stop)|let me know (and|if) i('ll| will) (stop|leave)|i('ll| will) leave (it|you) (there|alone)|^(reply )?["']?unsubscribe)/i,
      opts: ["Not a fit? Reply no and I'll leave it there.", "If this isn't relevant, say so and I'll stop.", "Wrong person? Let me know and I won't follow up."] },
    { id: "bump", test: /^(just )?(following up|bumping this|circling back|checking (in|back)|floating this)/i,
      opts: ["Bumping this in case it got buried.", "Following up on my last note.", "Floating this back to the top of your inbox."] },
    { id: "share", test: /^(can|could|may) i (share|show you) how (it|this) works\??$|^want me to (share|show you) how (it|this) works\??$/i,
      opts: ["Can I share how it works?", "Want me to show you how it works?", "Open to seeing how it works?", "Mind if I walk you through how it works?"] },
    { id: "signoff", test: /^(best|thanks|cheers|regards|best regards|kind regards|talk soon|all the best)[,!.]?$/i,
      opts: ["Best,", "Thanks,", "Cheers,", "Talk soon,"] },
  ];

  const HUMANIZE = [
    [/\bI hope (this|my) (email|message|note) finds you well[.,!]?[ \t]*/gi, "", "Removed the stock opener"],
    [/\bI hope you('re| are) (doing )?well[.,!]?[ \t]*/gi, "", "Removed the stock opener"],
    [/\bI (just )?wanted to reach out (to|because|about)\b/gi, "I'm writing $2", "Shortened \"wanted to reach out\""],
    [/\bjust wanted to\b/gi, "wanted to", "Cut \"just\" hedge"],
    [/\bplease (do not|don't) hesitate to (reach out|contact me|get in touch)( if [^.!?\n]*)?[.!]?/gi, "Reply anytime.", "Replaced \"don't hesitate\""],
    [/\blooking forward to hearing (back )?from you[.!]?[ \t]*/gi, "", "Removed \"looking forward to hearing\""],
    [/\btouch base\b/gi, "talk", "Plain word for \"touch base\""],
    // stock openers, closers and scene-setting
    [/\bI hope (all is well|you('re| are) having a (great|wonderful|good|lovely) (day|week))[.,!]?[ \t]*/gi, "", "Removed the stock opener"],
    [/\bIn today's [\w ,-]*?(world|landscape|market|environment|age),?[ \t]*/gi, "", "Removed a scene-setting opener"],
    [/\bI('m| am) excited to invite you\b/gi, "I'd like to invite you", "Calmer invite"],
    [/\b(I )?(would|I'd) love to schedule a call to discuss( this)?( further)?[.!]?/gi, "Open to a quick call?", "Plain ask"],
    [/\b(feel free to|please) (reach out|let me know|contact me|get in touch) at your earliest convenience[.!]?/gi, "Reply anytime.", "Replaced \"at your earliest convenience\""],
    [/\bat your (earliest )?convenience\b/gi, "when it suits you", "Plain phrase for \"at your convenience\""],
    [/\b(please )?(do not|don't) hesitate to let me know( if [^.!?\n]*)?[.!]?/gi, "Worth a look?", "Replaced \"don't hesitate\""],
    [/\bif this resonates( with you)?\b/gi, "if this is useful", "AI phrase: resonates"],
    [/\bWishing you (continued |all the )?success[.!]?[ \t]*/gi, "", "Removed a stock sign-off"],
    [/\bmy door is always open\b/gi, "I'm happy to help", "AI phrase: door is always open"],
    [/\bIt would (truly )?be a pleasure to\b/gi, "I'd be glad to", "Calmer phrasing"],
    [/[ \t]+on (its|your|their) (growth )?journey\b/gi, "", "Cut \"on its journey\""],
    [/,?[ \t]*which is (totally |completely |entirely )?understandable[^.!?\n]*/gi, "", "Cut the over-explaining"],
    [/\bI understand you('re| are) (incredibly |very |really |super )?busy, so I'll keep this (brief|short)\./gi, "I'll keep this short.", "Shorter busy line"],
    [/\bcircle back\b/gi, "follow up", "Plain phrase for \"circle back\""],
    [/\bSimply put,[ \t]*/gi, "", "Cut \"simply put\""],
    [/,?[ \t]*[—–]?[ \t]*it's (that|as) simple( as that)?\b/gi, "", "Cut \"it's that simple\""],
    [/\bDon't miss out[ \t]*[,.!—–-]?[ \t]*/gi, "", "Cut \"don't miss out\""],
    [/\breserve your (spot|seat) (today|now)[.!]?/gi, "Want me to save you a seat?", "Softer CTA"],
    // inflated claims and filler phrases
    [/\bIt's not (just )?about ([^—–,.\n]+?)[ \t]*[—–,][ \t]*it's about\b/gi, "It's about", "Cut a \"not just X, it's Y\" line"],
    [/\b(complete|comprehensive),[ \t]*end-to-end\b/gi, "end-to-end", "Cut a stacked adjective"],
    [/[ \t]+and (foster|build)(ing)? meaningful growth\b/gi, "", "Cut \"meaningful growth\""],
    [/\b(reach|unlock|realize|achieve) (their|your|its|our) full potential\b/gi, "grow", "AI phrase: full potential"],
    [/[ \t]+to the next level\b/gi, "", "Cut \"to the next level\""],
    [/\bAs a testament to our commitment to excellence,[ \t]*/gi, "", "Cut a self-praise opener"],
    [/\bcommitment to excellence\b/gi, "standards", "AI phrase: commitment to excellence"],
    [/\bnavigate the (complex |ever-changing |evolving )?landscape of\b/gi, "with", "AI phrase: navigate the landscape"],
    [/,[ \t]*ensuring (a |an |that |your |the )?[^.!?\n]*/gi, "", "Cut an \"ensuring\" tail"],
    [/\b(a )?leading provider of\b/gi, (m) => /^a /i.test(m) ? "a provider of" : "provider of", "Cut \"leading\""],
    [/\bWe pride ourselves on\b/gi, "We focus on", "Cut \"pride ourselves\""],
    [/\b(we're|we are) passionate about\b/gi, (m) => /^we're/i.test(m) ? "we focus on" : "we focus on", "Cut \"passionate about\""],
    [/\bexceptional,?[ \t]+unparalleled\b/gi, "high", "Cut stacked superlatives"],
    [/\bunparalleled\b/gi, "strong", "AI word: unparalleled"],
    [/\bexceptional\b/gi, "great", "AI word: exceptional"],
    [/\btop-notch\b/gi, "reliable", "AI word: top-notch"],
    [/\bdedicated team\b/gi, "team", "Cut \"dedicated\""],
    [/\bgo(es)? above and beyond\b/gi, (m) => /goes/i.test(m) ? "works hard" : "work hard", "AI phrase: above and beyond"],
    [/\bensure your complete satisfaction\b/gi, "get it right", "AI phrase: complete satisfaction"],
    [/\bcouldn't help but notice\b/gi, "noticed", "Plain \"noticed\""],
    [/[ \t]+in the space\b/gi, "", "Cut \"in the space\""],
    [/\bamazing\b/gi, "great", "AI word: amazing"],
    [/\btremendous\b/gi, "real", "AI word: tremendous"],
    [/\bthrilled\b/gi, "glad", "AI word: thrilled"],
    [/\b(exclusive,?[ \t]*)?can't[- ]miss[ \t]*/gi, "", "Cut hype words"],
    [/,?[ \t]*[—–]?[ \t]*a deep dive into\b/gi, " on", "AI phrase: deep dive"],
    [/\bdeep dive\b/gi, "close look", "AI phrase: deep dive"],
    [/\bthe ever-(evolving|changing) (world|landscape) of[ \t]*/gi, "", "Cut \"ever-evolving world\""],
    [/\bvaluable insights, actionable strategies,? and best practices\b/gi, "what is working right now", "Cut a list of three"],
    [/\bactionable insights\b/gi, "useful data", "AI phrase: actionable insights"],
    [/\bvaluable insights\b/gi, "useful ideas", "AI phrase: valuable insights"],
    [/\bstrategic value\b/gi, "value", "Cut \"strategic\""],
    [/\bstay ahead of the curve\b/gi, "stay ahead", "AI phrase: ahead of the curve"],
    [/\bsupercharg(e|es|ed|ing)\b/gi, w => ({ e: "grow", es: "grows", ed: "grew", ing: "growing" })[w.slice(9).toLowerCase()] || "grow", "AI word: supercharge"],
    [/\bnumerous\b/gi, "many", "AI word: numerous"],
    [/\bincredibly[ \t]+/gi, "", "Cut \"incredibly\""],
    [/\btruly[ \t]+/gi, "", "Cut \"truly\""],
    [/\bfrictionless\b/gi, "easy", "AI word: frictionless"],
    [/\bI believe there is\b/gi, "I think there's", "Plainer \"I think\""],
    [/\bin order to\b/gi, "to", "Filler: \"in order to\""],
    [/\bdue to the fact that\b/gi, "because", "Filler: \"due to the fact that\""],
    [/\bat this point in time\b/gi, "now", "Filler: \"at this point in time\""],
    [/\bin the event that\b/gi, "if", "Filler: \"in the event that\""],
    [/\bhas the ability to\b/gi, "can", "Filler: \"has the ability to\""],
    [/\bit is important to note that[ \t]*/gi, "", "Filler: \"it is important to note\""],
    [/\bmight potentially\b/gi, "might", "Double hedge"],
    [/\bcould possibly\b/gi, "could", "Double hedge"],
    [/\bleverag(e|es|ed|ing)\b/gi, w => ({ e: "use", es: "uses", ed: "used", ing: "using" })[w.slice(7).toLowerCase()] || "use", "AI word: leverage"],
    [/\butili[sz](e|es|ed|ing)\b/gi, w => ({ e: "use", es: "uses", ed: "used", ing: "using" })[w.slice(6).toLowerCase()] || "use", "AI word: utilize"],
    [/\benhanc(e|es|ed|ing)\b/gi, w => ({ e: "improve", es: "improves", ed: "improved", ing: "improving" })[w.slice(6).toLowerCase()] || "improve", "AI word: enhance"],
    [/\bstreamlin(e|es|ed|ing)\b/gi, w => ({ e: "simplify", es: "simplifies", ed: "simplified", ing: "simplifying" })[w.slice(9).toLowerCase()] || "simplify", "AI word: streamline"],
    [/\bseamlessly\b/gi, "smoothly", "AI word: seamlessly"],
    [/\bseamless\b/gi, "smooth", "AI word: seamless"],
    [/\brobust\b/gi, "solid", "AI word: robust"],
    [/\bcutting-edge\b/gi, "modern", "AI word: cutting-edge"],
    [/\bstate-of-the-art\b/gi, "modern", "AI word: state-of-the-art"],
    [/\bbest-in-class\b/gi, "top", "AI word: best-in-class"],
    [/\binnovative\b/gi, "new", "AI word: innovative"],
    [/\bdelve into\b/gi, "dig into", "AI word: delve"],
    [/\bfoster(ing)?\b/gi, w => /ing$/i.test(w) ? "building" : "build", "AI word: foster"],
    [/\bshowcas(e|es|ed|ing)\b/gi, w => ({ e: "show", es: "shows", ed: "showed", ing: "showing" })[w.slice(7).toLowerCase()] || "show", "AI word: showcase"],
    [/\b(pivotal|crucial)\b/gi, "important", "AI word: pivotal/crucial"],
    [/\b(a )?(true )?game[- ]chang(er|ing)\b/gi, w => (/^a /i.test(w) ? "a " : "") + (/ing$/i.test(w) ? "big" : "big change"), "AI word: game-changer"],
    [/\bunlock(s|ed|ing)?\b/gi, w => ({ "": "get", s: "gets", ed: "got", ing: "getting" })[w.slice(6).toLowerCase()] ?? "get", "AI word: unlock"],
    [/\bempower(s)?\b/gi, w => /s$/i.test(w) ? "helps" : "help", "AI word: empower"],
    [/\brevolutioni[sz]e\b/gi, "change", "AI word: revolutionize"],
    [/\belevat(e|es|ed|ing)\b/gi, w => ({ e: "improve", es: "improves", ed: "improved", ing: "improving" })[w.slice(6).toLowerCase()] || "improve", "AI word: elevate"],
    [/\b(additionally|furthermore|moreover),?\s*/gi, "Also, ", "AI connector"],
    [/\bcomprehensive\b/gi, "complete", "AI word: comprehensive"],
    [/\bholistic\b/gi, "full", "AI word: holistic"],
    [/\btransformative\b/gi, "big", "AI word: transformative"],
    [/\bsynergy\b/gi, "fit", "AI word: synergy"],
    [/\b(is|are) a testament to\b/gi, w => /^are/i.test(w) ? "show" : "shows", "AI word: testament"],
    [/\btapestry\b/gi, "mix", "AI word: tapestry"],
    [/\bunderscor(e|es|ed|ing)\b/gi, w => ({ e: "show", es: "shows", ed: "showed", ing: "showing" })[w.slice(9).toLowerCase()] || "show", "AI word: underscore"],
    [/\bgarner(s|ed|ing)?\b/gi, w => ({ "": "get", s: "gets", ed: "got", ing: "getting" })[w.slice(6).toLowerCase()] ?? "get", "AI word: garner"],
    [/\bintricate\b/gi, "complex", "AI word: intricate"],
    [/\baligns? with\b/gi, w => /s /i.test(w) ? "fits" : "fit", "AI phrase: align with"],
    [/\bactually,?[ \t]*/gi, "", "Cut \"actually\""],
    [/\b(let's dive in|here's the thing)[.!:,]?[ \t]*/gi, "", "Cut a stock lead-in"],
    [/(\d)[ \t]*[—–][ \t]*(\d)/g, "$1 to $2", "Range written as \"to\""],
    [/^([ \t]*)[—–][ \t]*/gm, "$1- ", "Dash bullet to hyphen"],
    [/,?[ \t]*[—–][ \t]*(?=(it's|it is|this|that's|we|I|you|they|there|our|your)\b)/gi, () => ". ", "Split a dash into two sentences"],
    [/,?[ \t]*[—–][ \t]*/g, ", ", "Replaced a dash with a comma"],
    [/([^\s-])[ \t]*--[ \t]*([^\s-])/g, "$1, $2", "Replaced a double hyphen"],
    [/[“”]/g, '"', "Straight quotes"],
    [/[‘’]/g, "'", "Straight apostrophes"],
    [/!+/g, ".", "Calmer punctuation"],
    [/ {2,}/g, " ", "Collapsed double spaces"],
    [/[ \t]*,[ \t]*([.?!])/g, "$1", "Tidied punctuation"],
  ];

  const SPAM = ["guarantee", "guaranteed", "act now", "limited time", "risk-free", "risk free", "no obligation", "click here", "buy now", "cash", "winner", "urgent", "$$$", "earn money", "double your", "amazing", "congratulations"];

  /* ---------------- helpers ---------------- */
  const LOOKUP = new Map();
  GROUPS.forEach((g, gi) => g.forEach(p => { if (!LOOKUP.has(p)) LOOKUP.set(p, gi); }));
  const MAXN = Math.max(...[...LOOKUP.keys()].map(k => k.split(" ").length));

  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const article = w => /^(hour|honest|honor|heir)/i.test(w) ? "an" : /^(uni|use|usu|eu|one|once|ur)/i.test(w) ? "a" : /^[aeiou]/i.test(w) ? "an" : "a";
  const capFirst = s => s.charAt(0).toUpperCase() + s.slice(1);
  const matchCase = (orig, rep) => /^[A-Z]/.test(orig) ? capFirst(rep) : rep;

  // protected tokens: variables in any syntax, existing spintax, signatures, URLs, emails
  const PROTECT = /\{\{[^{}]*\}\}|\{[^{}]*\}|%[a-z_]+%|https?:\/\/\S+|www\.\S+|[\w.+-]+@[\w-]+\.[\w.]+/gi;

  function protect(text) {
    const saved = [];
    const out = text.replace(PROTECT, m => { saved.push(m); return `\u0000${saved.length - 1}\u0000`; });
    return { out, saved };
  }

  /* ---------------- variables ---------------- */
  const SIG = { bison: "{SENDER_EMAIL_SIGNATURE}", smartlead: "%signature%", instantly: "{{accountSignature}}" };
  const words = s => s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_\s]+/g, " ").trim().toLowerCase().split(" ");
  function fmtVar(name, platform) {
    const w = words(name);
    if (platform === "bison") return `{${w.join("_").toUpperCase()}}`;
    if (platform === "smartlead") return `{{${w.join("_")}}}`;
    return `{{${w[0]}${w.slice(1).map(capFirst).join("")}}}`;
  }
  function convertToken(tok, platform, log) {
    // existing spintax -> target syntax
    let m = tok.match(/^\{\{\s*RANDOM\s*\|(.*)\}\}$/i);
    if (m) { const o = m[1].split("|").map(s => s.trim()); return { block: o }; }
    m = tok.match(/^\{([^{}]*\|[^{}]*)\}$/);
    if (m) return { block: m[1].split("|").map(s => s.trim()) };
    if (/^(%signature%|\{\{accountSignature\}\}|\{SENDER_EMAIL_SIGNATURE\})$/i.test(tok)) { if (tok !== SIG[platform]) log.push(`Signature tag → ${SIG[platform]}`); return { text: SIG[platform] }; }
    m = tok.match(/^\{\{\s*([^{}|]+?)\s*(\|[^{}]*)?\}\}$/) || tok.match(/^\{([A-Z0-9_ ]+)\}$/);
    if (m) {
      const name = m[1].trim(), fb = m[2] && platform === "instantly" ? "|" + m[2].slice(1).trim() : "";
      if (m[2] && platform !== "instantly") log.push(`Dropped fallback on ${tok} (${platform === "bison" ? "EmailBison" : "Smartlead"} has no inline fallback)`);
      const out = platform === "instantly" ? `{{${words(name)[0]}${words(name).slice(1).map(capFirst).join("")}${fb}}}` : fmtVar(name, platform);
      if (out !== tok) log.push(`${tok} → ${out}`);
      return { text: out };
    }
    return { text: tok };
  }


  /* Convert existing spintax, variables and the signature tag to another platform's syntax, without adding any new blocks. */
  function convertSyntax(text, platform) {
    const log = [];
    const out = text.replace(PROTECT, tok => {
      if (/^(https?:|www\.)/i.test(tok) || tok.includes("@")) return tok;
      const c = convertToken(tok, platform, log);
      if (c.block) { log.push(`Spin block → ${platform === "instantly" ? "{{RANDOM | … }}" : "{…|…}"}`); return platform === "instantly" ? `{{RANDOM | ${c.block.join(" | ")}}}` : `{${c.block.join("|")}}`; }
      return c.text;
    });
    return { text: out, log: [...new Set(log)] };
  }
  /* ---------------- humanize ---------------- */
  function humanize(text) {
    const changes = new Map();
    const { out, saved } = protect(text);
    let t = out;
    HUMANIZE.forEach(([re, rep, label]) => {
      t = t.replace(re, (...a) => {
        const m = a[0];
        let r = typeof rep === "function" ? rep(m) : m.replace(new RegExp(re.source, re.flags.replace("g", "")), rep);
        if (typeof rep === "function") r = matchCase(m, r);
        if (r !== m) changes.set(label, (changes.get(label) || 0) + 1);
        return r;
      });
    });
    const before = out.split("\n"); // a line emptied by a removal rule goes away instead of leaving a gap
    t = t.split("\n").filter((l, i) => l.trim() || !(before[i] || "").trim()).join("\n");
    t = t.replace(/(^|[.?!]\s+|\n)([a-z])/g, (m, p, c) => p + c.toUpperCase()).replace(/ +\n/g, "\n").replace(/\n{3,}/g, "\n\n");
    t = t.replace(/\u0000(\d+)\u0000/g, (m, i) => saved[+i]);
    return { text: t, changes: [...changes].map(([k, v]) => ({ label: k, count: v })) };
  }

  /* ---------------- parse into segments ---------------- */
  // segment = {t: "text"} | {b: [options], kind: "word"|"sentence"|"existing"}
  function wordSlots(text, saved) {
    // returns tokens with candidate slots (indices into token array)
    const toks = text.match(/\u0000\d+\u0000|[A-Za-z][A-Za-z'-]*|[^A-Za-z\u0000]+/g) || [];
    const slots = [];
    let i = 0;
    while (i < toks.length) {
      if (!/^[A-Za-z]/.test(toks[i])) { i++; continue; }
      let found = null;
      for (let n = MAXN; n >= 1 && !found; n--) {
        const idx = [], ws = [];
        let j = i;
        while (ws.length < n && j < toks.length) {
          if (/^[A-Za-z]/.test(toks[j])) { ws.push(toks[j]); idx.push(j); j++; if (ws.length < n) { if (toks[j] === " ") j++; else break; } }
          else break;
        }
        if (ws.length !== n) continue;
        const key = ws.join(" ").toLowerCase();
        const ctx = CONTEXT[key];
        if (ctx && ctx[0].test(toks.slice(idx[idx.length - 1] + 1).join("")) !== ctx[1]) continue;
        if (ctx && ctx[2] && !ctx[2].test(toks.slice(0, i).join(""))) continue;
        if (LOOKUP.has(key)) {
          // skip proper nouns mid-sentence (capitalised, not sentence start, not "I")
          const prev = toks.slice(0, i).join("").trimEnd();
          const sentenceStart = prev === "" || /[.?!:\n]$/.test(prev);
          if (/^[A-Z]/.test(ws[0]) && !sentenceStart && !/^I('|$)/.test(ws[0])) continue;
          found = { start: i, end: idx[idx.length - 1], group: LOOKUP.get(key), orig: toks.slice(i, idx[idx.length - 1] + 1).join("") };
        }
      }
      if (found) { slots.push(found); i = found.end + 1; } else i++;
    }
    // absorb a preceding a/an so every option carries the right article
    slots.forEach(s => {
      const k = s.start - 2;
      if (k >= 0 && toks[s.start - 1] === " " && /^(a|an)$/i.test(toks[k]) && !/^a /i.test(s.orig)) { s.art = toks[k]; s.start = k; s.orig = toks.slice(k, s.end + 1).join(""); }
    });
    return { toks, slots };
  }

  function optionsFor(slot, n, r) {
    const g = GROUPS[slot.group];
    const base = slot.art ? slot.orig.slice(slot.art.length + 1) : slot.orig;
    const others = g.filter(p => p !== base.toLowerCase());
    for (let i = others.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [others[i], others[j]] = [others[j], others[i]]; }
    const fixI = x => x.replace(/\bi(?=$|\s|')/g, "I");
    const pick = [base, ...others.slice(0, n - 1).map(p => fixI(matchCase(base, p)))];
    if (!slot.art) return pick;
    return pick.map(p => { const a = article(p); return (/^A/.test(slot.art) ? capFirst(a) : a) + " " + p; });
  }

  const evenPick = (count, f, offset) => { const keep = []; for (let i = 0; i < count; i++) { const k = (i + offset) % count; if (Math.floor((k + 1) * f) > Math.floor(k * f)) keep.push(i); } if (!keep.length && count) keep.push(offset % count); return keep; };

  function splitSentences(line) { return line.match(/[^.?!]+[.?!]*\s*|.+$/g) || [line]; }

  function build(input, o) {
    const opts = Object.assign({ platform: "smartlead", mode: "word", intensity: 0.8, humanize: false, convert: true, seed: 1 }, o);
    const r = rng(opts.seed * 7919 + 13);
    const nOpt = opts.intensity >= 1 ? 4 : opts.intensity >= .8 ? 3 : 2;
    const log = [];
    let text = input.replace(/\r\n/g, "\n");
    let hz = { changes: [] };
    if (opts.humanize) { hz = humanize(text); text = hz.text; }
    const { out, saved } = protect(text);
    const segs = [];
    const pushText = t => { if (!t) return; const last = segs[segs.length - 1]; if (last && last.t != null) last.t += t; else segs.push({ t }); };
    const restore = t => t.replace(/\u0000(\d+)\u0000/g, (m, i) => {
      const c = opts.convert ? convertToken(saved[+i], opts.platform, log) : (() => { const x = convertToken(saved[+i], opts.platform, []); return x.block ? x : { text: saved[+i] }; })();
      return c.block ? `\u0001${JSON.stringify(c.block)}\u0001` : c.text;
    });
    const emit = s => { // turn restored text with embedded existing blocks into segments
      s.split(/\u0001/).forEach((part, k) => { if (k % 2) segs.push({ b: JSON.parse(part), kind: "existing" }); else pushText(part); });
    };

    const lines = out.split("\n");
    // a stray brace (unclosed merge tag) means the line is left exactly as written
    const badLine = new Set();
    lines.forEach((l, li) => { if (/[{}]/.test(l)) { badLine.add(li); log.push(`Unclosed brace near: ${l.slice(Math.max(0, l.search(/[{}]/) - 3)).replace(/\u0000\d+\u0000/g, "…").slice(0, 24)}`); } });
    // sentence candidates across the whole email, to apply intensity evenly
    const sentences = [];
    lines.forEach((line, li) => {
      const whole = line.trim(), n = (whole.match(/[A-Za-z']+/g) || []).length;
      if (whole && n <= 30 && INTENTS.some(x => x.id !== "call" && x.id !== "interest" && x.test.test(whole))) sentences.push({ li, s: line });
      else splitSentences(line).forEach(s => sentences.push({ li, s }));
    });
    const intentOf = s => { const core = s.trim(); if (!core || /\u0000/.test(core) && core.replace(/\u0000\d+\u0000/g, "").trim().length < 3) return null; return INTENTS.find(x => x.test.test(core)) || null; };

    // decide which sentences/slots get spun
    const allSlots = [];
    const meta = sentences.map((x, k) => { const ws = wordSlots(x.s, saved); if (!badLine.has(x.li)) ws.slots.forEach(sl => allSlots.push({ k, sl })); return { ...x, ws, intent: intentOf(x.s) }; });
    const offset = Math.floor(r() * 997);
    let keepSlots = new Set(), keepSent = new Set();
    if (opts.mode === "word" || opts.mode === "mixed") evenPick(allSlots.length, opts.intensity, offset).forEach(i => keepSlots.add(allSlots[i]));
    if (opts.mode === "sentence") { const elig = meta.map((m, k) => !badLine.has(m.li) && (m.intent || m.ws.slots.length) ? k : -1).filter(k => k >= 0); evenPick(elig.length, opts.intensity, offset).forEach(i => keepSent.add(elig[i])); }

    // a bare name line ("Joel," or "{{first_name}},") gets a greeting block; a variable never goes inside a block
    const greet = (m, nOpt) => {
      const line = m.s.trim(), mm = line.match(/^(\u0000\d+\u0000|[A-Z][a-z]+(?: [A-Z][a-z]+)?),$/);
      if (!mm || m.li !== meta[0].li) return null;
      const opts = ["Hi", "Hey", "Hello"];
      if (/^(hi|hey|hello)$/i.test(mm[1])) return [{ b: [mm[1] + ",", ...opts.filter(o => o.toLowerCase() !== mm[1].toLowerCase()).slice(0, Math.max(1, nOpt - 1)).map(o => o + ",")], kind: "word" }];
      if (/\u0000/.test(mm[1])) return [{ b: opts.slice(0, Math.max(2, nOpt)), kind: "word" }, { t: " " + restore(mm[1]) + "," }];
      return [{ b: [mm[1] + ",", ...opts.slice(0, Math.max(1, nOpt - 1)).map(o => `${o} ${mm[1]},`)], kind: "word" }];
    };
    let prevLine = 0;
    meta.forEach((m, k) => {
      if (m.li !== prevLine) { pushText("\n".repeat(m.li - prevLine)); prevLine = m.li; }
      if (badLine.has(m.li)) { emit(restore(m.s)); return; }
      const trail = m.s.match(/\s*$/)[0], core = m.s.slice(0, m.s.length - trail.length);
      if (k === 0) { const g = greet(m, nOpt); if (g) { g.forEach(x => x.t != null ? pushText(x.t) : segs.push(x)); pushText(trail); return; } }
      // whole-sentence block: sentence mode, or mixed mode on a known intent.
      // No platform parses a merge tag, signature, link or existing block inside a spin block, so those sentences stay word-level
      const hasTok = /\u0000/.test(core), wantSent = opts.mode === "mixed" ? !!m.intent : opts.mode === "sentence" && keepSent.has(k);
      if (hasTok && wantSent) log.push(`Kept ${restore(core.match(/\u0000\d+\u0000/)[0]).replace(/\u0001.*\u0001/, "the existing block")} outside the sentence block`);
      const useIntent = !hasTok && m.intent && wantSent;
      if (useIntent) {
        const own = restore(core);
        const alts = m.intent.opts.filter(x => x.toLowerCase() !== own.toLowerCase());
        for (let i = alts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [alts[i], alts[j]] = [alts[j], alts[i]]; }
        segs.push({ b: [own, ...alts.slice(0, nOpt - 1)], kind: "sentence" }); pushText(trail); return;
      }
      if (!hasTok && opts.mode === "sentence" && keepSent.has(k) && m.ws.slots.length) {
        const variants = new Set([restore(core)]);
        const sl = m.ws.slots.map(s => optionsFor(s, 3, r));
        for (let v = 1; v < nOpt * 3 && variants.size < nOpt; v++) {
          const t = m.ws.toks.slice();
          m.ws.slots.forEach((s, si) => { const o = sl[si][(v + si) % sl[si].length]; for (let q = s.start; q <= s.end; q++) t[q] = q === s.start ? o : ""; });
          variants.add(restore(t.join("").slice(0, core.length + 200).trimEnd()));
        }
        if (variants.size > 1) { segs.push({ b: [...variants], kind: "sentence" }); pushText(trail); return; }
      }
      // word level (or untouched)
      const t = m.ws.toks;
      let pos = 0;
      m.ws.slots.forEach(s => {
        const chosen = (hasTok && wantSent && opts.mode === "sentence") || [...keepSlots].some(x => x.sl === s);
        if (!chosen) return;
        emit(restore(t.slice(pos, s.start).join("")));
        segs.push({ b: optionsFor(s, nOpt, r), kind: "word" });
        pos = s.end + 1;
      });
      emit(restore(t.slice(pos).join("")));
    });
    if (prevLine < lines.length - 1) pushText("\n".repeat(lines.length - 1 - prevLine));
    return { segs, log: [...new Set(log)], humanized: hz.changes, platform: opts.platform };
  }

  /* ---------------- output, render, checks ---------------- */
  function serialize(res) {
    return res.segs.map(s => s.t != null ? s.t : res.platform === "instantly" ? `{{RANDOM | ${s.b.join(" | ")}}}` : `{${s.b.join("|")}}`).join("");
  }
  function toHTML(res) {
    const txt = serialize(res).split(/\n{2,}/).map(p => p.replace(/\n/g, "<br>"));
    if (res.platform === "bison") return txt.map(p => `<p>${p}</p>`).join("<p><br></p>");
    if (res.platform === "instantly") return txt.map(p => `<div>${p}</div>`).join("<div><br></div>");
    return txt.join("<br><br>");
  }
  function render(res, r) { return res.segs.map(s => s.t != null ? s.t : s.b[Math.floor(r() * s.b.length)]).join(""); }
  function combos(res) { return res.segs.reduce((a, s) => s.b ? a * BigInt(s.b.length) : a, 1n); }
  function grade(text) {
    const body = text.replace(/\{\{?[^}]*\}?\}|%[a-z_]+%/gi, "name");
    const ws = body.match(/[A-Za-z']+/g) || []; if (!ws.length) return 0;
    const sents = Math.max(1, (body.match(/[.?!]+(\s|$)/g) || []).length);
    const syl = ws.reduce((a, w) => a + Math.max(1, (w.toLowerCase().replace(/e$/, "").match(/[aeiouy]+/g) || []).length), 0);
    return Math.max(0, .39 * (ws.length / sents) + 11.8 * (syl / ws.length) - 15.59);
  }
  const LINT = [
    [/\b([A-Za-z]{2,}) \1\b(?![@.]\w)/i, "Doubled word"],
    [/\ba\s+[aeiou]\w+/i, "\"a\" before a vowel sound", w => !/\ba\s+(uni|use|usu|eu|one|once|ur)/i.test(w)],
    [/\ban\s+[^aeiouh\W]\w*/i, "\"an\" before a consonant"],
    [/\s[,.?!]/, "Space before punctuation"],
    [/[—–]/, "Dash"],
    [/\b(of|to|for|with) (I|we)\b/, "Broken pronoun join"],
  ];
  function check(res, samples = 1000) {
    const r = rng(42), hits = new Map(); let worst = { g: -1, text: "" };
    for (let i = 0; i < samples; i++) {
      const t = render(res, r);
      LINT.forEach(([re, label, ok]) => { const m = t.match(re); if (m && (!ok || ok(m[0]))) { const h = hits.get(label) || { count: 0, example: m[0] }; h.count++; hits.set(label, h); } });
      const g = grade(t); if (g > worst.g) worst = { g, text: t };
    }
    const src = serialize(res), plain = render(res, rng(7)).toLowerCase();
    const spam = SPAM.filter(w => new RegExp(`(^|\\W)${w.replace(/[$%]/g, "\\$&")}(\\W|$)`, "i").test(plain));
    const blocks = res.segs.filter(s => s.b).length;
    const wordsN = (render(res, rng(3)).match(/[A-Za-z']+/g) || []).length;
    return { blocks, combos: combos(res), lint: [...hits].map(([label, v]) => ({ label, ...v })), worst, spam, words: wordsN, dashes: /[—–]/.test(src) };
  }

  /* Parse finished spintax (for example, written by an AI model) back into blocks so it can be checked and rendered.
     Instantly: {{RANDOM | a | b}}. EmailBison / Smartlead: {a|b}. Variables stay literal text.
     Rejects a variable, signature or link inside a block, nested blocks and unclosed braces. */
  function parse(text, platform) {
    const segs = [], errors = [], lit = t => { if (!t) return; const last = segs[segs.length - 1]; if (last && last.t != null) last.t += t; else segs.push({ t }); };
    const bad = o => /[{}]|%signature%|https?:|www\./i.test(o);
    let i = 0;
    while (i < text.length) {
      const open = text.indexOf("{", i);
      if (open < 0) { lit(text.slice(i)); break; }
      lit(text.slice(i, open));
      if (text[open + 1] === "{") {
        const close = text.indexOf("}}", open);
        if (close < 0) { errors.push("Unclosed {{ near: " + text.slice(open, open + 30)); lit(text.slice(open)); break; }
        const inner = text.slice(open + 2, close);
        if (/^\s*RANDOM\s*\|/.test(inner)) {
          const b = inner.split("|").slice(1).map(o => o.trim());
          if (inner.includes("{")) errors.push("Nested block: " + inner.slice(0, 40));
          b.filter(bad).forEach(o => errors.push("Variable or link inside a block: " + o));
          if (b.length < 2) errors.push("A block needs at least two options: " + inner); else segs.push({ b });
        } else lit(text.slice(open, close + 2));
        i = close + 2;
      } else {
        const close = text.indexOf("}", open);
        if (close < 0) { errors.push("Unclosed { near: " + text.slice(open, open + 30)); lit(text.slice(open)); break; }
        const inner = text.slice(open + 1, close);
        if (inner.includes("{")) { errors.push("Nested block near: " + text.slice(open, open + 40)); lit(text.slice(open, close + 1)); }
        else if (inner.includes("|")) {
          const b = inner.split("|");
          b.filter(bad).forEach(o => errors.push("Variable or link inside a block: " + o));
          if (platform === "instantly") errors.push("Instantly needs {{RANDOM | a | b}}, found {" + inner + "}");
          segs.push({ b });
        } else lit(text.slice(open, close + 1));
        i = close + 1;
      }
    }
    return { res: { segs, log: [], humanized: [], platform }, errors };
  }
  const fmtBig = n => { const s = n.toString(); if (s.length <= 6) return Number(n).toLocaleString("en-US"); const units = [[18, "Qi"], [15, "Q"], [12, "T"], [9, "B"], [6, "M"]]; for (const [d, u] of units) if (s.length > d) return (Number(n / 10n ** BigInt(d - 1)) / 10).toFixed(1).replace(/\.0$/, "") + u; return s; };

  const API = { build, parse, convertSyntax, serialize, toHTML, render, check, humanize, rng, fmtBig, KB: { groups: GROUPS.length, intents: INTENTS.length, rules: HUMANIZE.length } };
  if (typeof module !== "undefined") module.exports = API; else root.Spintax = API;
})(typeof window !== "undefined" ? window : globalThis);
