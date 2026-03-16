/**
 * Minimal tree structure (id + children only) for path-finding from PIE root to any language.
 * Must match the ids in IE_TREE_STRUCTURE in LanguageTree.jsx.
 */
const TREE_IDS = {
  id: 'ine-pro',
  children: [
    {
      id: 'gem-pro',
      children: [
        { id: 'ang', children: [{ id: 'enm', children: [{ id: 'en', children: [] }] }] },
        { id: 'de', children: [] },
        { id: 'nl', children: [] },
        { id: 'no', children: [] },
        { id: 'non', children: [{ id: 'da', children: [] }, { id: 'sv', children: [] }] },
        { id: 'got', children: [] },
      ],
    },
    {
      id: 'ita-pro',
      children: [
        {
          id: 'la',
          children: [
            { id: 'fr', children: [] },
            { id: 'es', children: [] },
            { id: 'it', children: [] },
            { id: 'pt', children: [] },
            { id: 'ro', children: [] },
          ],
        },
      ],
    },
    {
      id: 'grk-pro',
      children: [{ id: 'grc', children: [{ id: 'el', children: [] }] }],
    },
    {
      id: 'iir-pro',
      children: [
        { id: 'sa', children: [{ id: 'hi', children: [] }, { id: 'ur', children: [] }] },
        { id: 'peo', children: [{ id: 'fa', children: [] }] },
      ],
    },
    {
      id: 'cel-pro',
      children: [
        { id: 'sga', children: [{ id: 'ga', children: [] }, { id: 'gd', children: [] }] },
        { id: 'wels-old', children: [{ id: 'cy', children: [] }, { id: 'br', children: [] }] },
      ],
    },
    {
      id: 'bsl-pro',
      children: [
        {
          id: 'sla-pro',
          children: [
            { id: 'ru', children: [] },
            { id: 'pl', children: [] },
            { id: 'cs', children: [] },
            { id: 'bg', children: [] },
          ],
        },
        { id: 'balt-pro', children: [{ id: 'lt', children: [] }, { id: 'lv', children: [] }] },
      ],
    },
    { id: 'hy', children: [] },
    { id: 'sq', children: [] },
  ],
};

/**
 * Find path from root to target lang (array of lang ids). Returns [] if not found.
 */
function findPathTo(targetId, node = TREE_IDS, path = []) {
  const currentPath = [...path, node.id];
  if (node.id === targetId) return currentPath;
  for (const child of node.children || []) {
    const found = findPathTo(targetId, child, currentPath);
    if (found.length) return found;
  }
  return [];
}

export function getPathFromPIEToLang(targetLang) {
  if (!targetLang) return [];
  return findPathTo(targetLang);
}
