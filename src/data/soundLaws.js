/**
 * Curated sound laws for Indo-European pedagogy. Summaries are simplified;
 * full pages expand with context, examples, and limitations.
 */

import { getCanonicalEtymologyChain } from '../utils/etymologyChain';

export const SOUND_LAWS = {
  grimm: {
    id: 'grimm',
    shortName: "Grimm's Law",
    fullName: "Grimm's Law (First Germanic Consonant Shift)",
    era: 'Proto-Germanic (roughly 500 BCE onward)',
    summary:
      'Systematic shift of PIE stop consonants as Germanic split off: voiceless stops became voiceless fricatives, voiced stops became voiceless stops, and voiced aspirates became voiced stops or fricatives.',
    tooltipHint:
      'Hover along the PIE → Proto-Germanic edge to see how inherited consonants were “regraded” in Germanic.',
    sections: [
      {
        title: 'What it describes',
        body: `Jacob Grimm (of fairy-tale fame) helped formalize a pattern noticed across Germanic versus other Indo-European languages. Compared to Latin, Greek, or Sanskrit cognates, Proto-Germanic words often show:

• PIE *p, *t, *k, *kʷ → PGmc *f, *θ, *h, *hw (voiceless stops → voiceless fricatives)
• PIE *b, *d, *g, *gʷ → PGmc *p, *t, *k, *kw (plain voiced stops → voiceless stops)
• PIE *bʰ, *dʰ, *gʰ, *gʷʰ → PGmc *b, *d, *g, *gw (voiced aspirates → voiced stops or fricatives, depending on environment)

This is why Latin pater lines up with English father (PIE *p → PGmc *f), and Latin tres with English three (PIE *t → PGmc *θ, later English /θ/).`,
      },
      {
        title: 'Why it matters',
        body: `Grimm's Law is one of the clearest “signatures” of the Germanic branch. It does not apply to borrowings into Germanic after the shift (e.g. later church Latin loans may keep Latin consonants). It also interacts with Verner's Law: Verner explains exceptions to the voicing pattern Grimm predicts, using stress from Indo-European.`,
      },
      {
        title: 'Limitations',
        body: `The law describes a tendency across the lexicon, not a mechanical rule for every single morpheme. Analogy, borrowing, and later sound changes can obscure the pattern. Always compare several cognates and use reconstructed forms cautiously.`,
      },
    ],
    relatedLawIds: ['verner'],
  },
  verner: {
    id: 'verner',
    shortName: "Verner's Law",
    fullName: "Verner's Law",
    era: 'Proto-Germanic (same broad period as Grimm)',
    summary:
      'Explains why some voiceless fricatives expected after Grimm’s Law appear voiced in Germanic: voicing correlates with position of the PIE accent—voiceless fricatives became voiced when the preceding syllable was not stressed in PIE.',
    tooltipHint:
      'Pairs with Grimm: where Grimm predicts *f, *θ, *s, *h, Verner may yield *b, *d, *z, *g when stress fell differently in PIE.',
    sections: [
      {
        title: 'What it describes',
        body: `Karl Verner noticed that Grimm's Law left alternations that still looked “irregular.” He argued that voiceless fricatives from Grimm became **voiced** when the **immediately preceding syllable did not bear the main PIE stress**. That is why some cognate sets show *f* vs *b*, *θ* vs *d*, *s* vs *z*, etc., in Germanic depending on inherited accent.

Classic illustration: comparison of Old English singular and plural of “father” and “brother” reflects different outcomes tied to prehistoric accent (details vary by word class and analogy).`,
      },
      {
        title: 'Relationship to Grimm',
        body: `Think of Verner's Law as **completing** the picture Grimm started: Grimm maps PIE stops to Germanic fricatives; Verner explains **which fricatives end up voiced** based on stress. Together they account for a large share of Germanic consonant correspondences.`,
      },
      {
        title: 'Caveats',
        body: `Stress in Proto-Indo-European is reconstructed; later Germanic stress shifts and leveling in paradigms mean not every surface form is a clean textbook case. Scholars still debate edge cases.`,
      },
    ],
    relatedLawIds: ['grimm'],
  },
  secondGermanic: {
    id: 'secondGermanic',
    shortName: 'High German Consonant Shift',
    fullName: 'The Second Germanic Consonant Shift (High German)',
    era: 'Old High German period (early medieval; geographically uneven)',
    summary:
      'Affects southern West Germanic: inherited voiceless stops were strengthened to affricates or fricatives in different environments, which is why German “machen” /ˈmaxən/ patterns differently from Dutch “maken” or English “make.”',
    tooltipHint:
      'Along the path into German, look for /p,t,k/ outcomes that differ from northern Germanic and English.',
    sections: [
      {
        title: 'What it describes',
        body: `The “second” shift is largely a **High German** phenomenon (not shared by all of English or the North). Depending on dialect and environment:

• PGmc *p* may become affricate or fricative (e.g. compare English ship, Dutch schip, German Schiff)
• *t* and *k* show similar “strengthening” patterns in many High German varieties

This is why **standard German** consonants often feel “sharper” or more affricated than their cognates in **Dutch** or **English**.`,
      },
      {
        title: 'Geography',
        body: `The shift is **not uniform** across the German-speaking area; the famous “Benrath line” and related isoglosses divide dialects with different degrees of shift. Low German dialects often pattern more like Dutch or English.`,
      },
      {
        title: 'Pedagogical note',
        body: `This is **not** the same as Grimm's Law. Grimm separates Germanic from other IE branches; the Second Shift differentiates **High German** from other Germanic varieties centuries later.`,
      },
    ],
    relatedLawIds: ['grimm'],
  },
  grassmann: {
    id: 'grassmann',
    shortName: "Grassmann's Law",
    fullName: "Grassmann's Law (Greek)",
    era: 'Proto-Greek / early Greek',
    summary:
      'In Greek, if two syllables in a word would both inherit an aspirate from PIE, the first dissimilates: one loses its aspiration (e.g. *thi- → ti- in related stems).',
    tooltipHint:
      'Explains matching Greek alternations in aspiration across related word families.',
    sections: [
      {
        title: 'What it describes',
        body: `Hermann Grassmann explained a pattern in **Ancient Greek**: when **two aspirates** would appear in adjacent syllables in the same word (from inherited PIE aspirates), **the first aspiration is lost**. This creates alternations between related forms (e.g. tense stems and principal parts) that look confusing until you see the dissimilation.

It is a **language-internal** Greek rule, not something that compares Germanic to Greek in the same way Grimm does.`,
      },
      {
        title: 'Why it shows up here',
        body: `On the Greek branch of the tree, highlighting Grassmann reminds learners that **some “messy” alternations** in Greek morphology are the result of regular prehistoric rules, not random spelling.`,
      },
      {
        title: 'Limitations',
        body: `The rule interacts with other Greek phonological processes and later analogical leveling. Reconstruction always benefits from multiple cognates outside Greek.`,
      },
    ],
    relatedLawIds: [],
  },
  brugmann: {
    id: 'brugmann',
    shortName: "Brugmann's Law",
    fullName: "Brugmann's Law (Indo-Iranian)",
    era: 'Proto-Indo-Iranian',
    summary:
      'In Indo-Iranian, *o in an open syllable next to a voiced aspirate often yields long *ā, a conditioned vowel lengthening that helps explain Sanskrit and Avestan correspondences.',
    tooltipHint:
      'Relevant along the Indo-Iranian branch when comparing vowel length to other IE languages.',
    sections: [
      {
        title: 'What it describes',
        body: `Karl Brugmann described a **conditioned lengthening** in **Indo-Iranian**: short *o in an **open syllable** adjacent to a **voiced aspirate** often becomes **long ā** in the daughter languages. This helps explain certain **Sanskrit** and **Avestan** vowel patterns that do not match Greek or Latin vowel length the same way.

Like all “laws,” it is a **cover term** for a tendency supported by comparative evidence; not every token is a perfect textbook case.`,
      },
      {
        title: 'Use in the app',
        body: `When your word’s path touches **Sanskrit** or **Old Persian**, Brugmann’s Law is a reminder that **Indo-Iranian vowel history** has its own named processes, separate from Germanic consonant shifts.`,
      },
      {
        title: 'Further reading',
        body: `For rigorous treatment, consult historical Indo-Iranian phonology handbooks; the rule interacts with **Osthoff’s shortening** and other prosodic processes.`,
      },
    ],
    relatedLawIds: ['satem'],
  },
  satem: {
    id: 'satem',
    shortName: 'Satem palatalization',
    fullName: 'Centum vs Satem and palatalization',
    era: 'Late PIE / early branch-specific',
    summary:
      'The “Satem” group (Indo-Iranian, Balto-Slavic, Armenian, etc.) palatalized the PIE velar *k-like series before front vowels, yielding sibilants or affricates; “Centum” languages keep velar reflexes (Latin centum “hundred” vs Sanskrit śatám).',
    tooltipHint:
      'Along Indo-Iranian and Balto-Slavic edges: different outcomes for PIE velars than in Latin or Greek.',
    sections: [
      {
        title: 'Centum vs Satem',
        body: `One of the oldest splits visible in the vocabulary is the **Centum–Satem isogloss**:

• **Centum** languages (Latin **centum** “hundred”, Greek *hek-atón) largely merge PIE velars in ways that leave **k-like** outcomes in “hundred.”
• **Satem** languages (Sanskrit **śatám**, Lithuanian **šimtas**) show **sibilant or palatal** reflexes from the same PIE velar series before front vowels.

The labels are **geographic labels** (Centum ~ western, Satem ~ eastern), not family trees by themselves: Balto-Slavic and Indo-Iranian are Satem; Germanic, Italic, Celtic, Greek are Centum (with internal variety).`,
      },
      {
        title: 'Palatalization',
        body: `The **Satem** development involves **palatalization** of velars before **front vowels** (and related environments), producing ś / š / s-like sounds in the daughters. This is why cognates can look very different in spelling even when they are regular.`,
      },
      {
        title: 'Caution',
        body: `Modern **areal contact** and **borrowing** can blur patterns. The Centum/Satem split is a **major clue** in older vocabulary, not a substitute for full sound correspondence work.`,
      },
    ],
    relatedLawIds: ['brugmann'],
  },
  centum: {
    id: 'centum',
    shortName: 'Centum languages',
    fullName: 'Centum branch reflexes',
    era: 'Late PIE onward',
    summary:
      'Italic, Celtic, Germanic, Greek, and others often show “centum-type” outcomes for PIE velars—keeping labiovelars distinct and not undergoing the same sibilant reflexes as Satem.',
    tooltipHint:
      'Compare “hundred”-type cognates: Latin/Greek/Celtic pattern vs Sanskrit š / Lithuanian š.',
    sections: [
      {
        title: 'What “Centum” labels',
        body: `The word **centum** “hundred” in Latin illustrates a **velar reflex** that contrasts with **Satem ś** in Sanskrit. **Centum languages** include **Italic, Celtic, Germanic, Greek**, and others: they did **not** undergo the same **palatalizing** treatment of the PIE velar series that characterizes **Satem** languages.`,
      },
      {
        title: 'In this tree',
        body: `When you follow edges into **Latin**, **Greek**, or **Celtic**, the **Centum** label reminds you to expect **different velar correspondences** than on the **Indo-Iranian** or **Balto-Slavic** side of the family.`,
      },
      {
        title: 'Related',
        body: `See **Satem palatalization** for the contrasting eastern pattern. Actual outcomes still differ **within** Centum (Greek labiovelars vs Latin, etc.).`,
      },
    ],
    relatedLawIds: ['satem'],
  },
  rhotacism: {
    id: 'rhotacism',
    shortName: 'Latin rhotacism',
    fullName: 'Rhotacism in Latin (*s > r)',
    era: 'Pre-classical Latin',
    summary:
      'Between vowels, inherited *s in Latin often became r (e.g. *ges-tis → generis), feeding the morphology of classical paradigms and some Romance outcomes.',
    tooltipHint:
      'Explains many genitive/plural alternations and stem allomorphy in Latin vocabulary.',
    sections: [
      {
        title: 'What it describes',
        body: `**Rhotacism** in Latin is the change of **intervocalic *s* to *r***. It is visible in **paradigmatic alternations**: a stem may show **s** in some forms and **r** in others because the environment for rhotacism only appears in some cases (e.g. **honos** ~ **honoris**).

This is a **language-internal Latin** process, not a split between Latin and Romance per se, but it shapes the **stems** inherited into the Romance languages.`,
      },
      {
        title: 'Why it appears near Romance',
        body: `On the tree, marking **Latin → Romance** edges with rhotacism links **historical Latin phonology** to the **words you see in French, Spanish, Italian**, etc.—many of which descend from already-rhotacized stems.`,
      },
      {
        title: 'Caveat',
        body: `Not every Latin *r* comes from *s*; etymology is always word-specific.`,
      },
    ],
    relatedLawIds: [],
  },
  romance: {
    id: 'romance',
    shortName: 'Latin to Romance',
    fullName: 'From Latin to the Romance languages',
    era: 'Late antiquity through medieval period',
    summary:
      'Vulgar Latin dialects diverged: vowel quantity collapsed then reshaped, consonants lenited in many positions, and lexical stress determined different outcomes—yielding French, Spanish, Italian, Portuguese, Romanian, and others.',
    tooltipHint:
      'Major vowel and consonant lenition differ by branch; compare cognates across Romance.',
    sections: [
      {
        title: 'Big picture',
        body: `**Romance** languages descend from **spoken Latin** (often called **Vulgar Latin** in older scholarship). They share **inherited vocabulary** but diverged through:

• **Vowel changes** (mergers of classical vowel length, diphthong simplification, chain shifts)
• **Consonant lenition** (weakening intervocalic stops in many Western varieties)
• **Morphological simplification** (case loss on nouns in most varieties)

**Romanian** and **Sardinian** often preserve archaisms that French or Spanish do not, so “Romance” is not one uniform sound change.`,
      },
      {
        title: 'Using the tree',
        body: `When the tree shows **Latin** branching to **French, Spanish**, etc., this article is a **reminder** that each daughter underwent **its own** subsequent history—use cognate sets to compare.`,
      },
      {
        title: 'Related',
        body: `**Latin rhotacism** explains many **stem alternations** before Romance even split.`,
      },
    ],
    relatedLawIds: ['rhotacism'],
  },
  slavicPalatalization: {
    id: 'slavicPalatalization',
    shortName: 'Slavic palatalization',
    fullName: 'Palatalization in Slavic',
    era: 'Proto-Slavic and Common Slavic',
    summary:
      'Regressive palatalization (and related processes) reshaped velars before front vowels, producing distinct consonant series that explain Polish, Russian, Czech, and Bulgarian correspondences.',
    tooltipHint:
      'Explains why cognates across Slavic languages show ś/c/č-type alternations.',
    sections: [
      {
        title: 'What it describes',
        body: `**Slavic** languages share a bundle of **palatalization** processes affecting **velar consonants** before **front vowels** (and related environments). Different **waves** (often called **First** and **Second** palatalization in handbooks) produced the **sibilant and affricate** correspondences you see across **East, West, and South Slavic**.

This is **not** the same process as **Satem** palatalization in Indo-Iranian—it happened later, within **Balto-Slavic / Slavic** prehistory.`,
      },
      {
        title: 'In the app',
        body: `On **Proto-Slavic → Russian / Polish / Czech** style edges, this marker ties **surface consonant differences** to **named historical processes** learners can look up in Slavic linguistics references.`,
      },
      {
        title: 'Caveat',
        body: `Individual words may have been reshaped by **analogy** or **borrowing**; always compare multiple Slavic languages.`,
      },
    ],
    relatedLawIds: ['satem'],
  },
  germanicWest: {
    id: 'germanicWest',
    shortName: 'West Germanic',
    fullName: 'West Germanic developments',
    era: 'Early medieval',
    summary:
      'English, Frisian, Dutch, and German share innovations that separate them from North and East Germanic (with High German undergoing the Second Shift in the south).',
    tooltipHint:
      'Broad label for shared West Germanic history before modern national languages.',
    sections: [
      {
        title: 'Context',
        body: `**West Germanic** is a **subgrouping** within Germanic. Innovations shared by **English, Frisian, Dutch**, and **German** distinguish them collectively from **North Germanic** (Scandinavian) and **East Germanic** (Gothic, extinct).

This entry is a **high-level orientation**, not a single “law” like Grimm's.`,
      },
      {
        title: 'What to compare',
        body: `Compare **Old English** and **Old Saxon** / **Old High German** texts to see **shared** vocabulary and **divergent** sound changes—especially once you move into **High German** territory (**Second Germanic Consonant Shift**).`,
      },
      {
        title: 'Related',
        body: `See **Grimm's Law** and **Verner's Law** for the **Proto-Germanic** layer, and **High German Consonant Shift** for **southern West Germanic** specifics.`,
      },
    ],
    relatedLawIds: ['grimm', 'verner', 'secondGermanic'],
  },
  baltic: {
    id: 'baltic',
    shortName: 'Baltic developments',
    fullName: 'Baltic branch phonology',
    era: 'Proto-Baltic onward',
    summary:
      'Lithuanian and Latvian preserve archaic morphology; their consonant and vowel history connects to Balto-Slavic with distinct innovations.',
    tooltipHint:
      'Use with Satem context: Baltic shares some isoglosses with Slavic but has its own history.',
    sections: [
      {
        title: 'Context',
        body: `**Baltic** (chiefly **Lithuanian** and **Latvian**) is often studied alongside **Slavic** under **Balto-Slavic** because of shared prehistoric innovations, but **Baltic** has **independent** developments in **accent**, **morphology**, and **phonology**.

Lithuanian is famous among linguists for **conservative** features in **nominal inflection**.`,
      },
      {
        title: 'On the tree',
        body: `When the path reaches **Lithuanian** or **Latvian**, compare **Satem** velar outcomes and **vowel** correspondences to **Slavic** cognates for the same PIE root.`,
      },
      {
        title: 'Related',
        body: `See **Satem palatalization** for the **PIE** background; **Slavic palatalization** for **Slavic-specific** later rules.`,
      },
    ],
    relatedLawIds: ['satem', 'slavicPalatalization'],
  },
  armenian: {
    id: 'armenian',
    shortName: 'Armenian branch',
    fullName: 'Armenian: from Proto-Indo-European',
    era: 'Proto-Armenian onward',
    summary:
      'Armenian forms its own branch within Indo-European, with a long documented history and many sound changes that set it apart from Greek, Iranian, and other neighbors.',
    tooltipHint:
      'Compare Armenian reflexes with Greek and Iranian cognates; the branch has many independent innovations.',
    sections: [
      {
        title: 'Position in the family',
        body: `**Armenian** is usually placed as its own **first-order branch** off late PIE (alongside Greek, Indo-Iranian, etc.), though some proposals group it with Greek or Iranian in larger clades. The **classical** language (Grabar) and **modern Eastern and Western Armenian** continue one line with major sound shifts (e.g. developments affecting stops and clusters).`,
      },
      {
        title: 'What to compare',
        body: `Use cognates in **Greek**, **Persian**, and **Sanskrit** to see which changes are **shared** (often areal or inherited) versus **Armenian-specific**. Loanwords from **Parthian**, **Arabic**, **Persian**, and **Turkish** later reshaped the lexicon.`,
      },
    ],
    relatedLawIds: ['centum', 'satem'],
  },
  albanian: {
    id: 'albanian',
    shortName: 'Albanian branch',
    fullName: 'Albanian: from Proto-Indo-European',
    era: 'Proto-Albanian onward',
    summary:
      'Albanian is an independent IE branch; its history is partly obscure until medieval texts, but comparative work shows systematic consonant and vowel developments from PIE.',
    tooltipHint:
      'Albanian often shows unique reflexes; compare Romance and Slavic loans vs inherited core vocabulary.',
    sections: [
      {
        title: 'Overview',
        body: `**Albanian** is the **only surviving branch** of its group in the Balkans. **Proto-Albanian** underwent mergers (e.g. of some PIE stops) and later contact with **Latin**, **Greek**, **Slavic**, and **Turkic** added many strata to the vocabulary.`,
      },
      {
        title: 'Learning tip',
        body: `Distinguish **inherited** words from **borrowings** when comparing sounds: Albanian phonology is easiest to read on basic kinship, body parts, and core numerals where etymologies are secure.`,
      },
    ],
    relatedLawIds: ['centum'],
  },
  protoItalicLatin: {
    id: 'protoItalicLatin',
    shortName: 'Proto-Italic → Latin',
    fullName: 'From Proto-Italic to Latin',
    era: 'Early 1st millennium BCE',
    summary:
      'Latin emerged from Proto-Italic dialects: vowel shifts, simplification of the accent system, and merger of some laryngeal reflexes fed the classical language behind the Romance family.',
    tooltipHint:
      'This step groups Italic before the split into Romance; rhotacism and other changes apply later in Latin itself.',
    sections: [
      {
        title: 'What happened here',
        body: `**Proto-Italic** covered the ancestor of **Latin**, **Oscan**, **Umbrian**, and others. **Latin** innovated stress patterns (toward fixed initial stress in many words in prehistory) and consonant clusters that differ from **Oscan** inscriptions. The **Italic** branch is **Centum**.`,
      },
      {
        title: 'On the tree',
        body: `The edge **Proto-Italic → Latin** is the bridge from **branch level** to the **literary language** that later diversified into **French, Spanish**, etc.`,
      },
    ],
    relatedLawIds: ['centum', 'rhotacism', 'romance'],
  },
  protoGreekAncient: {
    id: 'protoGreekAncient',
    shortName: 'Proto-Greek → Ancient Greek',
    fullName: 'Early Greek developments',
    era: '2nd–1st millennium BCE',
    summary:
      'Between Proto-Greek and classical Ancient Greek, labiovelars, aspirates, and vowels were reshaped; Grassmann’s Law and other rules operated within this history.',
    tooltipHint:
      'Pairs with Grassmann on later Greek edges where aspiration alternates.',
    sections: [
      {
        title: 'Big picture',
        body: `**Proto-Greek** inherited PIE contrasts that **classical Greek** then reorganized: **labiovelars** (*kʷ, etc.) have distinct outcomes; **aspirates** feed **Grassmann’s Law** alternations; **vowel** quality and **quantity** were stable enough to support later **Koine** and **Demotic** change.`,
      },
    ],
    relatedLawIds: ['grassmann', 'centum'],
  },
  modernGreek: {
    id: 'modernGreek',
    shortName: 'Modern Greek',
    fullName: 'Ancient to Modern Greek',
    era: 'Hellenistic Greek to today',
    summary:
      'From Koine toward Demotic, Greek lost vowel quantity distinctions, simplified diphthongs, and shifted stress; spelling often preserves older forms.',
    tooltipHint:
      'Sound change continued long after classical period; compare written ancient forms to spoken Modern Greek.',
    sections: [
      {
        title: 'Overview',
        body: `**Modern Greek** continues the same lineage as **Ancient Greek** with **two thousand years** of phonological change: unstressed vowel reduction, fricativization of many stops, and **stress** fixed on one of the last three syllables. **Grassmann’s Law** is already a **pre-classical** rule; this edge is about **later** Greek history.`,
      },
    ],
    relatedLawIds: ['grassmann'],
  },
  northGermanic: {
    id: 'northGermanic',
    shortName: 'North Germanic',
    fullName: 'North Germanic (Proto-Germanic → Old Norse)',
    era: 'Early medieval',
    summary:
      'Scandinavian varieties share innovations (umlaut, certain consonant changes) that separate them from West and East Germanic; Old Norse is the major medieval witness.',
    tooltipHint:
      'Compare Icelandic, Norwegian, Swedish, Danish reflexes from Old Norse.',
    sections: [
      {
        title: 'What it labels',
        body: `**North Germanic** includes **Old Norse** and its daughters. Shared changes include **umlaut** environments, **assibilation** patterns, and later **dialect** splits (East Nordic vs West Nordic, etc.).`,
      },
    ],
    relatedLawIds: ['germanicWest', 'grimm'],
  },
  eastGermanic: {
    id: 'eastGermanic',
    shortName: 'East Germanic (Gothic)',
    fullName: 'East Germanic: Gothic',
    era: 'Late antiquity',
    summary:
      'Gothic is the main attested East Germanic language; it preserves some archaic Germanic features but also shows its own sound changes.',
    tooltipHint:
      'Compare Gothic with Old Norse and Old English for Grimm-era outcomes.',
    sections: [
      {
        title: 'Overview',
        body: `**Gothic** (Wulfila’s Bible) is precious for **comparative Germanic** because it is **early** and **attested**. East Germanic **died out** except for traces; **sound laws** still align broadly with **West** and **North** after **Proto-Germanic**, with branch-specific tweaks.`,
      },
    ],
    relatedLawIds: ['grimm', 'verner'],
  },
  scandinavian: {
    id: 'scandinavian',
    shortName: 'Nordic daughters',
    fullName: 'From Old Norse to Scandinavian languages',
    era: 'Medieval to modern',
    summary:
      'Danish, Swedish, Norwegian, Icelandic, and Faroese continue Old Norse with different leveling, vowel shifts, and contact histories.',
    tooltipHint:
      'Danish vs Swedish show different consonant and prosody outcomes from shared Norse input.',
    sections: [
      {
        title: 'Overview',
        body: `**Old Norse** split into **Insular** (Icelandic, Faroese) and **Mainland** branches. **Swedish** and **Danish** underwent **different** vowel developments and **consonant** weakenings (e.g. Danish glottal stops and lenition patterns). **Mutual intelligibility** today reflects both **shared** heritage and **divergent** sound change.`,
      },
    ],
    relatedLawIds: ['northGermanic'],
  },
  ingvaeonic: {
    id: 'ingvaeonic',
    shortName: 'Ingvaeonic / Old English',
    fullName: 'West Germanic → Old English',
    era: 'Migration period',
    summary:
      'Anglo-Frisian (Ingvaeonic) varieties share nasal loss in certain environments and other changes that distinguish them from Old Saxon and Old High German.',
    tooltipHint:
      'Sets up English: compare OE with Old Frisian and Old Saxon cognates.',
    sections: [
      {
        title: 'Overview',
        body: `**Old English** descends from **Ingvaeonic** dialects brought to Britain. Innovations often grouped under **Ingvaeonic** include changes to **nasals** and **fricatives** compared with **continental** West Germanic. This is **after** **Grimm** and **Verner**—a **branch-internal** layer.`,
      },
    ],
    relatedLawIds: ['germanicWest', 'grimm'],
  },
  oldToMiddleEnglish: {
    id: 'oldToMiddleEnglish',
    shortName: 'Old → Middle English',
    fullName: 'Old English to Middle English',
    era: 'c. 1100–1500',
    summary:
      'After the Norman Conquest, English lost most noun case endings, absorbed massive French vocabulary, and saw vowel shifts that set the stage for Early Modern English.',
    tooltipHint:
      'Morphological simplification and borrowing, not only sound change.',
    sections: [
      {
        title: 'Overview',
        body: `**Middle English** reflects **language contact** (Norman French, Latin) and **natural** drift: **reduction** of unstressed vowels, **loss** of grammatical gender in practice, and **orthographic** habits influenced by French scribes.`,
      },
    ],
    relatedLawIds: ['greatVowelShift'],
  },
  greatVowelShift: {
    id: 'greatVowelShift',
    shortName: 'Great Vowel Shift',
    fullName: 'The Great Vowel Shift (toward Modern English)',
    era: 'c. 1400–1700',
    summary:
      'English long vowels systematically raised and diphthongized; this is why “name” /neɪm/ and “see” /siː/ no longer match Middle English spelling the same way.',
    tooltipHint:
      'Major chain shift in English; explains many spelling–sound mismatches.',
    sections: [
      {
        title: 'What it describes',
        body: `The **Great Vowel Shift** (GVS) is a **series of changes** affecting **long stressed vowels** in **English**. For example, Middle English **/aː/** often became **/eɪ/** (as in **name**), and **/eː/** became **/iː/** (as in **see**). It is **not** one simultaneous flip but a **chain** over centuries.`,
      },
      {
        title: 'Why it matters',
        body: `The GVS is a **major reason** English **spelling** looks “irrational”: spellings were often fixed **before** or **during** the shift. It is **English-internal**—not the same as **Grimm’s Law** (which is PIE → Germanic).`,
      },
    ],
    relatedLawIds: ['oldToMiddleEnglish'],
  },
  iirToOldPersian: {
    id: 'iirToOldPersian',
    shortName: 'Indo-Iranian → Old Persian',
    fullName: 'Proto-Indo-Iranian toward Old Persian',
    era: '1st millennium BCE',
    summary:
      'Old Persian (attested in Achaemenid inscriptions) shows satem-type developments and distinct outcomes from Vedic Sanskrit on the Iranian side.',
    tooltipHint:
      'Iranian branch innovations vs Indic (Sanskrit); Brugmann-style rules appear in Indic more prominently.',
    sections: [
      {
        title: 'Overview',
        body: `**Old Persian** is an **Iranian** language, sister to **Avestan** and ancestor of **Middle Persian** → **New Persian (Farsi)**. It shares **Indo-Iranian** innovations with **Sanskrit** but diverges in **spirantization**, **vowel** patterns, and **syntax** of compounds.`,
      },
    ],
    relatedLawIds: ['satem', 'brugmann'],
  },
  sanskritToIndoAryan: {
    id: 'sanskritToIndoAryan',
    shortName: 'Sanskrit → Hindi / Urdu',
    fullName: 'From Sanskrit to modern Indo-Aryan',
    era: 'Middle Indo-Aryan onward',
    summary:
      'Hindi, Urdu, Bengali, etc. descend not from classical Sanskrit directly but from Prakrit and Apabhramsha stages with layered Sanskritization and contact.',
    tooltipHint:
      'Modern words may reflect Middle Indo-Aryan phonology and later Persian/Arabic layers in Urdu.',
    sections: [
      {
        title: 'Overview',
        body: `**Hindi** and **Urdu** are **modern Indo-Aryan** varieties. Their **ancestor** chain runs through **Middle Indo-Aryan** (Prakrits, Apabhramsha), not **direct** from **Vedic** in one step. **Urdu** additionally shows heavy **Perso-Arabic** vocabulary and phonology in learned registers.`,
      },
    ],
    relatedLawIds: ['brugmann', 'satem'],
  },
  protoCeltic: {
    id: 'protoCeltic',
    shortName: 'Proto-Celtic daughters',
    fullName: 'Proto-Celtic to Insular Celtic',
    era: '1st millennium BCE onward',
    summary:
      'Goidelic (Irish, Scottish Gaelic) and Brittonic (Welsh, Breton, Cornish) branches diverged with different consonant mutations and vowel developments.',
    tooltipHint:
      'Insular Celtic shows initial mutations (lenition, nasalization) as a hallmark.',
    sections: [
      {
        title: 'Overview',
        body: `**Proto-Celtic** is **Centum**. **Insular Celtic** languages share **initial mutations** (lenition, eclipsis, etc.) triggered by **syntax** and **morphology**—a **signature** of the branch. **Goidelic** and **Brittonic** diverged in **vowel** systems and **phonotactics**.`,
      },
    ],
    relatedLawIds: ['centum'],
  },
  goidelic: {
    id: 'goidelic',
    shortName: 'Goidelic',
    fullName: 'Old Irish to Irish / Gaelic',
    era: 'Medieval to modern',
    summary:
      'Irish and Scottish Gaelic continue Old Irish with spelling reforms and dialectal splits; sound change includes reduction of unstressed syllables and consonant quality shifts.',
    tooltipHint:
      'Compare Irish and Scottish Gaelic pronunciation from shared medieval roots.',
    sections: [
      {
        title: 'Overview',
        body: `**Goidelic** includes **Irish**, **Scottish Gaelic**, and **Manx**. From **Old Irish** to the modern languages, **stress**, **vowel** reduction, and **consonant** processes (e.g. palatalization contrasts) shaped what you see today.`,
      },
    ],
    relatedLawIds: ['protoCeltic'],
  },
  brythonic: {
    id: 'brythonic',
    shortName: 'Brittonic',
    fullName: 'Old Welsh to Welsh / Breton',
    era: 'Medieval to modern',
    summary:
      'Welsh and Breton continue Brittonic with different vowel shifts, consonant developments, and contact (English vs French).',
    tooltipHint:
      'Cornish also belongs here; Breton shows French contact layers.',
    sections: [
      {
        title: 'Overview',
        body: `**Brittonic** languages (**Welsh**, **Breton**, **Cornish**) share **consonant mutations** and **vowel** alternations from **Common Brittonic**. **Welsh** and **Breton** diverged under different **neighbor** languages (**English** vs **French**), affecting lexicon and some phonology.`,
      },
    ],
    relatedLawIds: ['protoCeltic'],
  },
  bslToSlavic: {
    id: 'bslToSlavic',
    shortName: 'Balto-Slavic → Slavic',
    fullName: 'Proto-Balto-Slavic to Proto-Slavic',
    era: '1st millennium CE',
    summary:
      'Common Slavic inherited Balto-Slavic innovations then diverged into East, West, and South branches with palatalization waves and vowel shifts.',
    tooltipHint:
      'Slavic shares some isoglosses with Baltic before splitting off.',
    sections: [
      {
        title: 'Overview',
        body: `**Proto-Slavic** is the **last common ancestor** of all Slavic languages. It continues **Balto-Slavic** morphophonology but innovates **palatalization** processes (**First** and **Second** palatalization of velars) that define **Slavic** as opposed to **Baltic**.`,
      },
    ],
    relatedLawIds: ['satem', 'slavicPalatalization'],
  },
  bslToBaltic: {
    id: 'bslToBaltic',
    shortName: 'Balto-Slavic → Baltic',
    fullName: 'Proto-Balto-Slavic to Proto-Baltic',
    era: '1st millennium CE',
    summary:
      'Lithuanian and Latvian continue the Baltic line with archaic pitch-accent systems and conservative nominal morphology.',
    tooltipHint:
      'Baltic stayed distinct from Slavic; compare Lithuanian to Slavic cognates.',
    sections: [
      {
        title: 'Overview',
        body: `**Proto-Baltic** split toward **Lithuanian** and **Latvian** (and extinct **Old Prussian**). **Lithuanian** is famous for **archaic** features; **Latvian** underwent different **vowel** developments. Both share **Satem** heritage with **Slavic** but **not** the full **Slavic** palatalization package.`,
      },
    ],
    relatedLawIds: ['satem', 'baltic'],
  },
};

/** Directed edge source → target → primary law ids (order matters for default “open first”) */
const EDGE_LAW_KEYS = [
  [['ine-pro', 'gem-pro'], ['grimm', 'verner']],
  [['ine-pro', 'ita-pro'], ['centum']],
  [['ine-pro', 'grk-pro'], ['centum', 'grassmann']],
  [['ine-pro', 'cel-pro'], ['centum']],
  [['ine-pro', 'iir-pro'], ['satem', 'brugmann']],
  [['ine-pro', 'bsl-pro'], ['satem']],
  [['ine-pro', 'hy'], ['armenian']],
  [['ine-pro', 'sq'], ['albanian']],
  [['ita-pro', 'la'], ['protoItalicLatin', 'centum']],
  [['grk-pro', 'grc'], ['protoGreekAncient', 'centum']],
  [['gem-pro', 'ang'], ['ingvaeonic', 'germanicWest']],
  [['gem-pro', 'nl'], ['germanicWest']],
  [['gem-pro', 'non'], ['northGermanic', 'germanicWest']],
  [['gem-pro', 'got'], ['eastGermanic', 'germanicWest']],
  [['gem-pro', 'de'], ['germanicWest', 'secondGermanic']],
  [['ang', 'enm'], ['oldToMiddleEnglish', 'ingvaeonic']],
  [['enm', 'en'], ['greatVowelShift', 'oldToMiddleEnglish']],
  [['non', 'da'], ['scandinavian', 'northGermanic']],
  [['non', 'sv'], ['scandinavian', 'northGermanic']],
  [['iir-pro', 'sa'], ['brugmann', 'satem']],
  [['iir-pro', 'peo'], ['iirToOldPersian', 'satem']],
  [['sa', 'hi'], ['sanskritToIndoAryan', 'brugmann']],
  [['sa', 'ur'], ['sanskritToIndoAryan', 'brugmann']],
  [['sla-pro', 'ru'], ['slavicPalatalization', 'satem', 'bslToSlavic']],
  [['sla-pro', 'pl'], ['slavicPalatalization', 'satem', 'bslToSlavic']],
  [['sla-pro', 'cs'], ['slavicPalatalization', 'satem', 'bslToSlavic']],
  [['sla-pro', 'bg'], ['slavicPalatalization', 'satem', 'bslToSlavic']],
  [['bsl-pro', 'sla-pro'], ['bslToSlavic', 'satem']],
  [['bsl-pro', 'balt-pro'], ['bslToBaltic', 'satem']],
  [['balt-pro', 'lt'], ['baltic', 'satem']],
  [['balt-pro', 'lv'], ['baltic', 'satem']],
  [['cel-pro', 'sga'], ['protoCeltic', 'centum']],
  [['cel-pro', 'wels-old'], ['protoCeltic', 'centum']],
  [['sga', 'ga'], ['goidelic', 'protoCeltic']],
  [['sga', 'gd'], ['goidelic', 'protoCeltic']],
  [['wels-old', 'cy'], ['brythonic', 'protoCeltic']],
  [['wels-old', 'br'], ['brythonic', 'protoCeltic']],
  [['grc', 'el'], ['modernGreek', 'grassmann']],
  [['la', 'fr'], ['rhotacism', 'romance']],
  [['la', 'es'], ['rhotacism', 'romance']],
  [['la', 'it'], ['rhotacism', 'romance']],
  [['la', 'pt'], ['rhotacism', 'romance']],
  [['la', 'ro'], ['rhotacism', 'romance']],
  [['peo', 'fa'], ['brugmann', 'satem', 'iirToOldPersian']],
];

const EDGE_TO_LAW_IDS = new Map(
  EDGE_LAW_KEYS.map(([[from, to], ids]) => [`${from}=>${to}`, ids])
);

export function getLawsForEdge(sourceId, targetId) {
  const ids = EDGE_TO_LAW_IDS.get(`${sourceId}=>${targetId}`) || [];
  return ids.map((id) => SOUND_LAWS[id]).filter(Boolean);
}

export function getLawIdsForEdge(sourceId, targetId) {
  const ids = EDGE_TO_LAW_IDS.get(`${sourceId}=>${targetId}`);
  return ids ? [...ids] : [];
}

function mergedChain(wordData) {
  return getCanonicalEtymologyChain(wordData);
}

/**
 * Words on a parent→child step if both appear in the etymology chain (same order).
 */
export function getWordsForEdge(wordData, parentId, childId) {
  const chain = mergedChain(wordData);
  for (let i = 0; i < chain.length - 1; i++) {
    if (chain[i].lang === parentId && chain[i + 1].lang === childId) {
      return {
        parentWord: chain[i].word,
        childWord: chain[i + 1].word,
        parentLabel: chain[i].langName || parentId,
        childLabel: chain[i + 1].langName || childId,
      };
    }
  }
  return null;
}

export function getChainEdgeWordsMap(wordData) {
  const chain = mergedChain(wordData);
  const map = new Map();
  for (let i = 0; i < chain.length - 1; i++) {
    const a = chain[i];
    const b = chain[i + 1];
    if (!a?.lang || !b?.lang) continue;
    map.set(`${a.lang}=>${b.lang}`, {
      parentWord: a.word,
      childWord: b.word,
      parentLabel: a.langName || a.lang,
      childLabel: b.langName || b.lang,
    });
  }
  return map;
}

export function getLawById(id) {
  return SOUND_LAWS[id] || null;
}

/** One short line for hover UI (first sentence or trimmed summary). */
export function getTooltipLine(law) {
  if (!law) return '';
  const s = (law.summary || '').trim();
  if (!s) return '';
  const dot = s.indexOf('. ');
  if (dot !== -1 && dot <= 200) return s.slice(0, dot + 1);
  return s.length > 150 ? `${s.slice(0, 147)}…` : s;
}
