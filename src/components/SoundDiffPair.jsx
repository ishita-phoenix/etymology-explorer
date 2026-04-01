import React from 'react';
import { getSoundDiffSegments } from '../utils/soundHighlight';

export default function SoundDiffPair({ left, right, className = '' }) {
  const segs = getSoundDiffSegments(left, right);
  if (!segs) return null;
  if (segs.same) {
    return (
      <span className={`sound-diff-pair ${className}`.trim()} title={left}>
        {left}
      </span>
    );
  }
  return (
    <span className={`sound-diff-pair ${className}`.trim()} title={`${left} → ${right}`}>
      <span className="sound-diff-form">
        {segs.prefix}
        <mark className="sound-diff-mark">{segs.midLeft}</mark>
        {segs.suffix}
      </span>
      <span className="sound-diff-arrow" aria-hidden="true">
        {' '}
        →{' '}
      </span>
      <span className="sound-diff-form">
        {segs.prefix}
        <mark className="sound-diff-mark">{segs.midRight}</mark>
        {segs.suffix}
      </span>
    </span>
  );
}
