import React from 'react';
import { getLawById } from '../data/soundLaws';
import SoundDiffPair from './SoundDiffPair';

export default function SoundLawPage({ lawId, relatedIds = [], context = null, onClose, onOpenLaw }) {
  const law = lawId ? getLawById(lawId) : null;
  if (!law) return null;

  const related = [...new Set([...(relatedIds || []), ...(law.relatedLawIds || [])])].filter(
    (id) => id && id !== lawId
  ).slice(0, 4);

  return (
    <div className="sound-law-overlay" role="dialog" aria-modal="true" aria-labelledby="sound-law-title">
      <div className="sound-law-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="sound-law-sheet">
        <header className="sound-law-header">
          <button type="button" className="sound-law-back" onClick={onClose}>
            ← Back to tree
          </button>
          {context?.parentWord && context?.childWord && (
            <div className="sound-law-context-banner">
              <span className="sound-law-context-label">This step in your word</span>
              <div className="sound-law-context-diff">
                <SoundDiffPair left={context.parentWord} right={context.childWord} />
              </div>
              <p className="sound-law-context-meta">
                {context.sourceId} → {context.targetId}
                {context.pathLabel ? ` · path to ${context.pathLabel}` : ''}
              </p>
            </div>
          )}
          <p className="sound-law-era">{law.era}</p>
          <h1 id="sound-law-title" className="sound-law-title">
            {law.fullName}
          </h1>
          <p className="sound-law-lead">{law.summary}</p>
        </header>
        <article className="sound-law-body">
          {law.sections.map((sec) => (
            <section key={sec.title} className="sound-law-section">
              <h2>{sec.title}</h2>
              <div className="sound-law-prose">{sec.body}</div>
            </section>
          ))}
        </article>
        {related.length > 0 && (
          <footer className="sound-law-related">
            <span className="sound-law-related-label">Related laws</span>
            <div className="sound-law-related-links">
              {related.map((id) => {
                const r = getLawById(id);
                if (!r) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    className="sound-law-chip"
                    onClick={() => onOpenLaw(id)}
                  >
                    {r.shortName}
                  </button>
                );
              })}
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
