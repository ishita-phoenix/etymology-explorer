import React, { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import WorldMap from './components/WorldMap';
import LanguageTree from './components/LanguageTree';
import WordCard from './components/WordCard';
import ExtensionsPanel from './components/ExtensionsPanel';
import { analyzeWord } from './services/wiktionaryApi';
import pieRoots from './data/pieRoots.json';
import './App.css';

export default function App() {
  const [searchedWord, setSearchedWord] = useState(null);
  const [etymologyData, setEtymologyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeFamily, setActiveFamily] = useState(null);
  const [showExtensions, setShowExtensions] = useState(false);
  const [showWordCard, setShowWordCard] = useState(false);
  const [pathTargetLang, setPathTargetLang] = useState('en'); // PIE → this language on the map
  const [showDispersion, setShowDispersion] = useState(true); // false = only path to selected language

  const handleSearch = useCallback(async (word) => {
    setIsLoading(true);
    setError(null);
    setSelectedNode(null);
    setActiveFamily(null);
    setPathTargetLang('en');
    setShowDispersion(true);
    setSearchedWord(word);
    setShowWordCard(false);

    try {
      const result = await analyzeWord(word);
      const staticEntry = pieRoots[word.toLowerCase()];

      if (!result.etymologyChain || result.etymologyChain.length === 0) {
        if (staticEntry) result.etymologyChain = staticEntry.chain;
      }

      result.staticEntry = staticEntry || null;

      if (!result.etymologyChain && !result.definition && !staticEntry) {
        setError(`No etymology data found for "${word}". Try: night · father · water · star · heart`);
        setEtymologyData(null);
      } else {
        setEtymologyData(result);
        setError(null);
        setShowWordCard(true);
      }
    } catch {
      setError('Failed to fetch data. Check connection and try again.');
      setEtymologyData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFamilyClick = (family) => {
    setActiveFamily(prev => prev === family ? null : family);
  };

  const hasData = !!etymologyData;

  return (
    <div className="app">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">◎</span>
          <div>
            <h1 className="header-title">Etymology Explorer</h1>
            <p className="header-subtitle">Trace words to their Proto-Indo-European roots</p>
          </div>
        </div>
        <div className="header-right">
          {hasData && (
            <button className="wordcard-toggle-btn" onClick={() => setShowWordCard(p => !p)}>
              {showWordCard ? '✕ Hide' : '📖 Word Details'}
            </button>
          )}
          <button className="extensions-btn" onClick={() => setShowExtensions(true)}>
            💡 Ideas
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="search-section">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/* Error */}
      {error && (
        <div className="error-state">
          <span className="error-icon">⚠</span>
          <p>{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="loading-state">
          <div className="loading-animation">
            <div className="loading-ring" />
            <span className="loading-text">Tracing etymological roots…</span>
          </div>
        </div>
      )}

      {/* HERO — no word searched yet */}
      {!hasData && !isLoading && !error && (
        <div className="hero-content">
          <div className="hero-graphic">
            <div className="pie-circle">
              <span className="pie-text">PIE</span>
              <span className="pie-subtitle">Proto-Indo-European</span>
            </div>
            <div className="hero-branches">
              {[
                { name: 'Germanic', color: '#4A9EFF', words: 'night · water · fire' },
                { name: 'Italic', color: '#FF8C42', words: 'solar · marine · final' },
                { name: 'Hellenic', color: '#A855F7', words: 'democracy · cosmos' },
                { name: 'Indo-Iranian', color: '#EF4444', words: 'karma · yoga · avatar' },
                { name: 'Celtic', color: '#14B8A6', words: 'clan · bard · druid' },
                { name: 'Slavic', color: '#22C55E', words: 'robot · mammoth · sable' },
              ].map(b => (
                <div key={b.name} className="hero-branch" style={{ '--col': b.color }}>
                  <span className="branch-name">{b.name}</span>
                  <span className="branch-words">{b.words}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="hero-caption">
            Over 3 billion people speak an Indo-European language.<br />
            Search any word to trace it back 6,500+ years.
          </p>
        </div>
      )}

      {/* DUAL PANEL LAYOUT */}
      {hasData && !isLoading && (
        <div className="dual-panel">

          {/* Word Card Drawer */}
          {showWordCard && (
            <aside className="wordcard-drawer">
              <WordCard
                word={searchedWord}
                definition={etymologyData?.definition}
                etymologyChain={etymologyData?.etymologyChain}
                rawEtymText={etymologyData?.rawEtymologyText}
                selectedNode={selectedNode}
                staticEntry={etymologyData?.staticEntry}
              />
            </aside>
          )}

          {/* World Map Panel */}
          <section className="map-panel">
            <div className="panel-header">
              <span className="panel-title">🌍 Geographic Spread</span>
              <div className="panel-header-right">
                <button
                  type="button"
                  className="dispersion-toggle"
                  onClick={() => setShowDispersion((v) => !v)}
                  title={showDispersion ? 'Show only path to selected language' : 'Show full dispersion'}
                >
                  {showDispersion ? '📍 Path only' : '🌐 Full dispersion'}
                </button>
                <span className="panel-hint">Click country = path • Drag = rotate</span>
              </div>
            </div>
            <div className="panel-body">
              <WorldMap
                wordData={etymologyData}
                activeFamily={activeFamily}
                onFamilyClick={handleFamilyClick}
                pathTargetLang={pathTargetLang}
                onPathTargetChange={(lang) => {
                  setPathTargetLang(lang);
                  setShowDispersion(false);
                }}
                showDispersion={showDispersion}
                onToggleDispersion={() => setShowDispersion((v) => !v)}
              />
            </div>
          </section>

          {/* Divider */}
          <div className="panel-divider" />

          {/* Language Tree Panel */}
          <section className="tree-panel-new">
            <div className="panel-header">
              <span className="panel-title">🌳 Language Descent Tree</span>
              <span className="panel-hint">Highlighted words = cognates • Scroll to explore</span>
            </div>
            <div className="panel-body">
              <LanguageTree
                wordData={etymologyData}
                word={searchedWord}
                onNodeClick={(node) => {
                  setSelectedNode(node);
                  setActiveFamily(node.family);
                  setShowWordCard(true);
                }}
                activeFamily={activeFamily}
                pathTargetLang={pathTargetLang}
              />
            </div>
          </section>
        </div>
      )}

      {showExtensions && <ExtensionsPanel onClose={() => setShowExtensions(false)} />}
    </div>
  );
}
