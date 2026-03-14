import React from 'react';

const extensions = [
    {
        icon: '🔗',
        title: 'Cognate Finder',
        desc: 'See how the same PIE root sounds across all IE branches simultaneously — e.g. *pṓds → foot / ped / pod / pāda.',
        color: '#4A9EFF',
    },
    {
        icon: '📢',
        title: 'Sound Change Simulator',
        desc: "Visualize Grimm's Law and Verner's Law — watch how Proto-Germanic systematically shifted consonants from PIE.",
        color: '#A855F7',
    },
    {
        icon: '📖',
        title: 'Semantic Shift Timeline',
        desc: 'Track how a word\'s meaning evolved over centuries — "awful" once meant "inspiring awe", "nice" meant "foolish".',
        color: '#FF8C42',
    },
    {
        icon: '🌍',
        title: 'Loanword Detector',
        desc: 'Highlight borrowings from Arabic, Dravidian, Turkic, and other non-IE languages flowing into IE tongues.',
        color: '#14B8A6',
    },
    {
        icon: '🎮',
        title: 'IE Vocabulary Quiz',
        desc: 'Given a PIE root, guess its reflex in French, Sanskrit, or Lithuanian. Gamify your linguistics learning.',
        color: '#22C55E',
    },
    {
        icon: '🗺️',
        title: 'Geographic Dialect Mapper',
        desc: 'Overlay word forms on a map of Europe and Asia — see dialect continua and isoglosses in real time.',
        color: '#EF4444',
    },
    {
        icon: '📝',
        title: 'Text Etymological Analyzer',
        desc: 'Paste any English text and see every word colour-coded by its IE branch origin — Latin-heavy vs Germanic-heavy.',
        color: '#FFD700',
    },
];

export default function ExtensionsPanel({ onClose }) {
    return (
        <div className="extensions-overlay" onClick={onClose}>
            <div className="extensions-panel" onClick={e => e.stopPropagation()}>
                <div className="extensions-header">
                    <h2>Where to go from here</h2>
                    <p>Ideas if you want to expand this app into something bigger</p>
                    <button className="extensions-close" onClick={onClose}>✕</button>
                </div>
                <div className="extensions-grid">
                    {extensions.map((ext) => (
                        <div key={ext.title} className="extension-card" style={{ '--accent': ext.color }}>
                            <span className="ext-icon">{ext.icon}</span>
                            <h3 className="ext-title">{ext.title}</h3>
                            <p className="ext-desc">{ext.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
