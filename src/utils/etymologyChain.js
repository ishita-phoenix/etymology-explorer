/**
 * Single source of truth for which etymology steps drive the tree, sound laws, and WordCard.
 *
 * Curated `pieRoots.json` chains use the same language ids as `LanguageTree` (ine-pro, gem-pro, …).
 * Live Wiktionary parses often omit proto-language steps or use different shapes, which breaks
 * law markers. When we have a static chain for the word, prefer it.
 */
export function getCanonicalEtymologyChain(wordData) {
  const curated = wordData?.staticEntry?.chain;
  const api = wordData?.etymologyChain;
  if (curated?.length) return curated;
  if (api?.length) return api;
  return [];
}
