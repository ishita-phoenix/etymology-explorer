import React from 'react';

const FAMILY_COLORS = {
    pie: '#FFD700',
    germanic: '#4A9EFF',
    italic: '#FF8C42',
    hellenic: '#A855F7',
    indoiranian: '#EF4444',
    celtic: '#14B8A6',
    slavic: '#22C55E',
    baltic: '#84CC16',
    armenian: '#F97316',
    albanian: '#EC4899',
    other: '#94A3B8',
};

const FAMILY_LABELS = {
    pie: 'Proto-Indo-European (PIE)',
    germanic: 'Germanic',
    italic: 'Italic / Romance',
    hellenic: 'Hellenic',
    indoiranian: 'Indo-Iranian',
    celtic: 'Celtic',
    slavic: 'Slavic',
    baltic: 'Baltic',
    armenian: 'Armenian',
    albanian: 'Albanian',
    other: 'Other',
};

function dateLabel(date) {
    if (!date) return '';
    if (date < 0) return `${Math.abs(date)} BCE`;
    if (date < 1000) return `${date} CE`;
    return `c. ${date} CE`;
}

export default function WordCard({ word, definition, etymologyChain, selectedNode, rawEtymText, staticEntry }) {
    if (!word) {
        return (
            <div className="wordcard wordcard-empty">
                <div className="wordcard-placeholder">
                    <span className="wordcard-icon">◉</span>
                    <p>Search for a word to explore its Indo-European roots</p>
                </div>
            </div>
        );
    }

    const pieNode = etymologyChain?.find(n => n.lang === 'ine-pro');
    const activeNode = selectedNode;

    // Aggregate translations
    const translationsByFamily = {};
    const addTrans = (fam, langName, w) => {
        if (!fam || !langName || !w || fam === 'pie' || langName === 'Proto-Indo-European') return;
        if (!translationsByFamily[fam]) translationsByFamily[fam] = [];
        if (!translationsByFamily[fam].some(t => t.langName === langName)) {
            translationsByFamily[fam].push({ langName, word: w });
        }
    };

    etymologyChain?.forEach(n => addTrans(n.family, n.langName, n.word));
    if (staticEntry) {
        staticEntry.chain?.forEach(n => addTrans(n.family, n.langName, n.word));
        staticEntry.cognates?.forEach(n => addTrans(n.family, n.langName, n.word));
    }
    const transFamilies = Object.keys(translationsByFamily).sort();

    return (
        <div className="wordcard">
            {/* Header */}
            <div className="wordcard-header">
                <h1 className="wordcard-word">{word}</h1>
                {definition?.phonetic && (
                    <span className="wordcard-phonetic">{definition.phonetic}</span>
                )}
                {pieNode && (
                    <div className="wordcard-pie-badge">
                        <span className="pie-root-label">PIE root</span>
                        <span className="pie-root-word">{pieNode.word}</span>
                    </div>
                )}
            </div>

            {/* Definitions */}
            {definition?.meanings?.length > 0 && (
                <div className="wordcard-section">
                    <h3 className="section-title">Definitions</h3>
                    {definition.meanings.map((m, i) => (
                        <div key={i} className="meaning-group">
                            <span className="pos-badge">{m.partOfSpeech}</span>
                            {m.definitions?.map((def, j) => (
                                <p key={j} className="definition-text">{def}</p>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Etymology Chain */}
            {etymologyChain && etymologyChain.length > 0 && (
                <div className="wordcard-section">
                    <h3 className="section-title">Etymological Chain</h3>
                    <div className="etym-chain">
                        {etymologyChain.map((node, i) => (
                            <React.Fragment key={node.id || i}>
                                <div className="chain-node" style={{ borderColor: FAMILY_COLORS[node.family] || '#94A3B8' }}>
                                    <span className="chain-word" style={{ color: FAMILY_COLORS[node.family] || '#94A3B8' }}>
                                        {node.word}
                                    </span>
                                    <span className="chain-lang">{node.langName}</span>
                                    {node.date ? <span className="chain-date">{dateLabel(node.date)}</span> : null}
                                </div>
                                {i < etymologyChain.length - 1 && (
                                    <span className="chain-arrow">↓</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* Raw etymology text */}
            {rawEtymText && (
                <div className="wordcard-section">
                    <h3 className="section-title">Etymology</h3>
                    <p className="etym-raw-text">{rawEtymText}</p>
                </div>
            )}

            {/* Translations / Cognates */}
            {transFamilies.length > 0 && (
                <div className="wordcard-section">
                    <h3 className="section-title">Translations in IE Languages</h3>
                    <div className="translations-grid">
                        {transFamilies.map(fam => (
                            <div key={fam} className="trans-family-group" style={{ borderLeftColor: FAMILY_COLORS[fam] || '#94A3B8' }}>
                                <h4 className="trans-family-name" style={{ color: FAMILY_COLORS[fam] }}>
                                    {FAMILY_LABELS[fam] || fam}
                                </h4>
                                <ul className="trans-list">
                                    {translationsByFamily[fam].map((t, idx) => (
                                        <li key={idx} className="trans-item">
                                            <span className="trans-lang">{t.langName}</span>
                                            <span className="trans-word" style={{ color: FAMILY_COLORS[fam] || '#e2e8f0' }}>
                                                {t.word}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Selected Node Info */}
            {activeNode && (
                <div className="wordcard-section selected-node-section">
                    <h3 className="section-title">Selected: {activeNode.word}</h3>
                    <div className="selected-node-card" style={{ borderColor: FAMILY_COLORS[activeNode.family] || '#94A3B8' }}>
                        <div className="selected-node-row">
                            <span className="sn-label">Language</span>
                            <span className="sn-value">{activeNode.langName}</span>
                        </div>
                        <div className="selected-node-row">
                            <span className="sn-label">Family</span>
                            <span className="sn-value family-badge" style={{ color: FAMILY_COLORS[activeNode.family] }}>
                                {FAMILY_LABELS[activeNode.family] || activeNode.family}
                            </span>
                        </div>
                        {activeNode.date ? (
                            <div className="selected-node-row">
                                <span className="sn-label">Period</span>
                                <span className="sn-value">{dateLabel(activeNode.date)}</span>
                            </div>
                        ) : null}
                        {activeNode.isBorrowed && (
                            <div className="selected-node-row">
                                <span className="sn-label">Type</span>
                                <span className="sn-value borrowed-badge">Borrowed</span>
                            </div>
                        )}
                        {activeNode.isCognate && (
                            <div className="selected-node-row">
                                <span className="sn-label">Type</span>
                                <span className="sn-value cognate-badge">Cognate</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
