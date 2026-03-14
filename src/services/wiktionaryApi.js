const WIKTIONARY_API = 'https://en.wiktionary.org/w/api.php';
const FREE_DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

// Language family codes from Wiktionary templates
const LANG_FAMILIES = {
  'ine-pro': 'pie',
  'gem-pro': 'germanic',
  'ita-pro': 'italic',
  'cel-pro': 'celtic',
  'sla-pro': 'slavic',
  'bsl-pro': 'baltic',
  'grk-pro': 'hellenic',
  'iir-pro': 'indoiranian',
  'en': 'germanic',
  'ang': 'germanic',
  'enm': 'germanic',
  'de': 'germanic',
  'nl': 'germanic',
  'sv': 'germanic',
  'da': 'germanic',
  'no': 'germanic',
  'got': 'germanic',
  'non': 'germanic',
  'la': 'italic',
  'fr': 'italic',
  'es': 'italic',
  'it': 'italic',
  'pt': 'italic',
  'ro': 'italic',
  'osp': 'italic',
  'fro': 'italic',
  'grc': 'hellenic',
  'el': 'hellenic',
  'sa': 'indoiranian',
  'fa': 'indoiranian',
  'hi': 'indoiranian',
  'ur': 'indoiranian',
  'peo': 'indoiranian',
  'sga': 'celtic',
  'ga': 'celtic',
  'cy': 'celtic',
  'gd': 'celtic',
  'br': 'celtic',
  'ru': 'slavic',
  'pl': 'slavic',
  'cs': 'slavic',
  'bg': 'slavic',
  'lt': 'baltic',
  'lv': 'baltic',
  'sq': 'albanian',
  'hy': 'armenian',
};

const LANG_DISPLAY_NAMES = {
  'ine-pro': 'Proto-Indo-European',
  'gem-pro': 'Proto-Germanic',
  'ita-pro': 'Proto-Italic',
  'cel-pro': 'Proto-Celtic',
  'sla-pro': 'Proto-Slavic',
  'bsl-pro': 'Proto-Balto-Slavic',
  'grk-pro': 'Proto-Greek',
  'iir-pro': 'Proto-Indo-Iranian',
  'en': 'English',
  'ang': 'Old English',
  'enm': 'Middle English',
  'de': 'German',
  'nl': 'Dutch',
  'sv': 'Swedish',
  'da': 'Danish',
  'no': 'Norwegian',
  'got': 'Gothic',
  'non': 'Old Norse',
  'la': 'Latin',
  'fr': 'French',
  'es': 'Spanish',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ro': 'Romanian',
  'osp': 'Old Spanish',
  'fro': 'Old French',
  'grc': 'Ancient Greek',
  'el': 'Modern Greek',
  'sa': 'Sanskrit',
  'fa': 'Persian',
  'hi': 'Hindi',
  'ur': 'Urdu',
  'peo': 'Old Persian',
  'sga': 'Old Irish',
  'ga': 'Irish',
  'cy': 'Welsh',
  'gd': 'Scottish Gaelic',
  'br': 'Breton',
  'ru': 'Russian',
  'pl': 'Polish',
  'cs': 'Czech',
  'bg': 'Bulgarian',
  'lt': 'Lithuanian',
  'lv': 'Latvian',
  'sq': 'Albanian',
  'hy': 'Armenian',
};

const APPROX_DATES = {
  'ine-pro': -4500,
  'gem-pro': -500,
  'ita-pro': -600,
  'cel-pro': -700,
  'sla-pro': 500,
  'bsl-pro': -500,
  'grk-pro': -1500,
  'iir-pro': -2000,
  'got': 350,
  'non': 900,
  'ang': 900,
  'sga': 700,
  'fro': 900,
  'osp': 1000,
  'enm': 1250,
  'grc': -400,
  'la': -100,
  'sa': -1500,
  'peo': -550,
  'en': 1600,
  'de': 1600,
  'nl': 1600,
  'fr': 1600,
  'es': 1600,
  'it': 1600,
  'pt': 1600,
  'ru': 1600,
  'pl': 1600,
  'cs': 1600,
  'el': 1600,
  'hi': 1600,
  'fa': 1000,
  'ga': 1600,
  'cy': 1600,
  'lt': 1600,
  'lv': 1600,
};

/**
 * Parse Wiktionary wikitext etymology templates into structured chain
 */
export function parseEtymologyChain(wikitextEtymology, targetWord) {
  if (!wikitextEtymology) return null;

  const chain = [];
  // Match inheritance templates: {{inh|en|ang|word}} or {{der|en|la|word}} or {{bor|en|fr|word}}
  const inheritanceRegex = /\{\{(inh|der|bor|borrowed|inherited)\|([^|]+)\|([^|{}]+)\|([^|{}]*?)(?:\|[^{}]*)?\}\}/gi;


  let match;
  const seen = new Set();

  while ((match = inheritanceRegex.exec(wikitextEtymology)) !== null) {
    const templateType = match[1].toLowerCase();
    const sourceLang = match[3];
    const sourceWord = match[4] || '';
    const cleanWord = sourceWord.replace(/\[\[|\]\]/g, '').replace(/<!--.*?-->/g, '').trim();

    const langFamily = LANG_FAMILIES[sourceLang] || 'other';
    const langName = LANG_DISPLAY_NAMES[sourceLang] || sourceLang;
    const date = APPROX_DATES[sourceLang] || 0;

    const nodeId = `${sourceLang}-${cleanWord}`;
    if (!seen.has(nodeId) && cleanWord) {
      seen.add(nodeId);
      chain.push({
        lang: sourceLang,
        langName,
        word: cleanWord,
        date,
        family: langFamily,
        isBorrowed: templateType === 'bor' || templateType === 'borrowed',
      });
    }
  }

  // The chain from Wiktionary is in reverse (most ancient last)
  // So we reverse to get oldest → newest
  chain.reverse();

  // Add the current English word at the end if not already there
  const hasEnglish = chain.some(n => n.lang === 'en');
  if (!hasEnglish && targetWord) {
    chain.push({
      lang: 'en',
      langName: 'English',
      word: targetWord,
      date: 1600,
      family: 'germanic',
      isBorrowed: false,
    });
  }

  return chain.length > 0 ? chain : null;
}

/**
 * Fetch etymology wikitext from Wiktionary API
 */
export async function fetchWiktionaryEtymology(word) {
  const params = new URLSearchParams({
    action: 'parse',
    page: word,
    prop: 'wikitext',
    format: 'json',
    origin: '*',
  });

  const res = await fetch(`${WIKTIONARY_API}?${params}`);
  if (!res.ok) throw new Error('Wiktionary fetch failed');

  const data = await res.json();
  const wikitext = data?.parse?.wikitext?.['*'];
  if (!wikitext) return null;

  // Extract etymology section
  const etymRegex = /==+\s*Etymology\s*(?:\d+)?\s*==+([\s\S]*?)(?:==+[^=]|$)/i;
  const match = wikitext.match(etymRegex);

  if (!match) return null;
  return match[1].trim();
}

/**
 * Fetch definition from FreeDictionaryAPI
 */
export async function fetchDefinition(word) {
  try {
    const res = await fetch(`${FREE_DICT_API}/${encodeURIComponent(word)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || !data[0]) return null;

    const entry = data[0];
    const meanings = entry.meanings?.slice(0, 3).map(m => ({
      partOfSpeech: m.partOfSpeech,
      definitions: m.definitions?.slice(0, 2).map(d => d.definition),
    })) || [];

    return {
      word: entry.word,
      phonetic: entry.phonetic || entry.phonetics?.[0]?.text || '',
      meanings,
      origin: entry.origin || '',
    };
  } catch {
    return null;
  }
}

/**
 * Main function: fetch everything for a word and return structured data
 */
export async function analyzeWord(word) {
  const normalized = word.toLowerCase().trim();

  // Run both fetches in parallel
  const [etymWikitext, definition] = await Promise.allSettled([
    fetchWiktionaryEtymology(normalized),
    fetchDefinition(normalized),
  ]);

  const wikitextValue = etymWikitext.status === 'fulfilled' ? etymWikitext.value : null;
  const definitionValue = definition.status === 'fulfilled' ? definition.value : null;

  const chain = wikitextValue ? parseEtymologyChain(wikitextValue, normalized) : null;
  const rawEtymText = wikitextValue ? cleanWikitext(wikitextValue) : null;

  return {
    word: normalized,
    etymologyChain: chain,
    rawEtymologyText: rawEtymText,
    definition: definitionValue,
    hasPIERoot: chain ? chain.some(n => n.lang === 'ine-pro') : false,
  };
}

/**
 * Clean raw wikitext for human-readable display
 */
export function cleanWikitext(text) {
  return text
    .replace(/\{\{[^{}]*\}\}/g, (match) => {
      // Keep template content visible when useful
      const inner = match.slice(2, -2);
      const parts = inner.split('|');
      if (parts[0].trim() === 'inh' || parts[0].trim() === 'der' || parts[0].trim() === 'bor') {
        return parts[3] || parts[2] || '';
      }
      if (parts[0].trim() === 'cog' || parts[0].trim() === 'cognate') {
        return parts[2] || '';
      }
      return parts[parts.length - 1] || '';
    })
    .replace(/\[\[([^\]|]+(?:\|([^\]]+))?)\]\]/g, (_, link, display) => display || link)
    .replace(/'{2,3}/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export { LANG_FAMILIES, LANG_DISPLAY_NAMES, APPROX_DATES };
