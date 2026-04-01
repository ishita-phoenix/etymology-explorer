/**
 * Split two related word forms into prefix / differing middle / suffix for UI highlighting.
 * Works on reconstructed strings (IPA-ish symbols, asterisks, etc.).
 */
export function getSoundDiffSegments(left, right) {
  if (left == null || right == null) return null;
  const a = String(left);
  const b = String(right);
  if (a === b) {
    return { prefix: a, midLeft: '', midRight: '', suffix: '', same: true };
  }
  const ach = [...a];
  const bch = [...b];
  let i = 0;
  const minLen = Math.min(ach.length, bch.length);
  while (i < minLen && ach[i] === bch[i]) i += 1;
  let j = 0;
  while (
    j < ach.length - i &&
    j < bch.length - i &&
    ach[ach.length - 1 - j] === bch[bch.length - 1 - j]
  ) {
    j += 1;
  }
  const midLeft = ach.slice(i, ach.length - j).join('');
  const midRight = bch.slice(i, bch.length - j).join('');
  return {
    prefix: ach.slice(0, i).join(''),
    midLeft,
    midRight,
    suffix: ach.slice(ach.length - j).join(''),
    same: false,
  };
}
