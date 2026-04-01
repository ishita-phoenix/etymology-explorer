import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import pieRoots from '../data/pieRoots.json';
import { LANG_FAMILIES, LANG_DISPLAY_NAMES } from '../services/wiktionaryApi';
import { getPathFromPIEToLang } from '../utils/treePath';
import { getLawIdsForEdge, getLawById, getChainEdgeWordsMap, getTooltipLine } from '../data/soundLaws';
import { getCanonicalEtymologyChain } from '../utils/etymologyChain';
import SoundDiffPair from './SoundDiffPair';

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

// Static IE language tree hierarchy with typical language codes
const IE_TREE_STRUCTURE = {
    id: 'ine-pro',
    name: 'Proto-Indo-European',
    family: 'pie',
    children: [
        {
            id: 'gem-pro', name: 'Proto-Germanic', family: 'germanic',
            children: [
                {
                    id: 'ang', name: 'Old English', family: 'germanic',
                    children: [
                        {
                            id: 'enm', name: 'Middle English', family: 'germanic',
                            children: [{ id: 'en', name: 'English', family: 'germanic', isLeaf: true }]
                        }
                    ]
                },
                { id: 'de', name: 'German', family: 'germanic', isLeaf: true },
                { id: 'nl', name: 'Dutch', family: 'germanic', isLeaf: true },
                {
                    id: 'non', name: 'Old Norse', family: 'germanic',
                    children: [
                        { id: 'da', name: 'Danish', family: 'germanic', isLeaf: true },
                        { id: 'sv', name: 'Swedish', family: 'germanic', isLeaf: true },
                    ]
                },
                { id: 'got', name: 'Gothic', family: 'germanic', isLeaf: true },
            ]
        },
        {
            id: 'ita-pro', name: 'Proto-Italic (→ Romance)', family: 'italic',
            children: [
                {
                    id: 'la', name: 'Latin (→ Romance languages)', family: 'italic',
                    children: [
                        { id: 'fr', name: 'French', family: 'italic', isLeaf: true },
                        { id: 'es', name: 'Spanish', family: 'italic', isLeaf: true },
                        { id: 'it', name: 'Italian', family: 'italic', isLeaf: true },
                        { id: 'pt', name: 'Portuguese', family: 'italic', isLeaf: true },
                        { id: 'ro', name: 'Romanian', family: 'italic', isLeaf: true },
                    ]
                }
            ]
        },
        {
            id: 'grk-pro', name: 'Proto-Greek', family: 'hellenic',
            children: [
                {
                    id: 'grc', name: 'Ancient Greek', family: 'hellenic', isLeaf: false,
                    children: [{ id: 'el', name: 'Modern Greek', family: 'hellenic', isLeaf: true }]
                }
            ]
        },
        {
            id: 'iir-pro', name: 'Proto-Indo-Iranian', family: 'indoiranian',
            children: [
                {
                    id: 'sa', name: 'Sanskrit', family: 'indoiranian',
                    children: [
                        { id: 'hi', name: 'Hindi', family: 'indoiranian', isLeaf: true },
                        { id: 'ur', name: 'Urdu', family: 'indoiranian', isLeaf: true },
                    ]
                },
                {
                    id: 'peo', name: 'Old Persian', family: 'indoiranian',
                    children: [{ id: 'fa', name: 'Persian', family: 'indoiranian', isLeaf: true }]
                },
            ]
        },
        {
            id: 'cel-pro', name: 'Proto-Celtic', family: 'celtic',
            children: [
                {
                    id: 'sga', name: 'Old Irish', family: 'celtic',
                    children: [
                        { id: 'ga', name: 'Irish', family: 'celtic', isLeaf: true },
                        { id: 'gd', name: 'Scottish Gaelic', family: 'celtic', isLeaf: true },
                    ]
                },
                {
                    id: 'wels-old', name: 'Old Welsh', family: 'celtic',
                    children: [
                        { id: 'cy', name: 'Welsh', family: 'celtic', isLeaf: true },
                        { id: 'br', name: 'Breton', family: 'celtic', isLeaf: true },
                    ]
                },
            ]
        },
        {
            id: 'bsl-pro', name: 'Proto-Balto-Slavic', family: 'slavic',
            children: [
                {
                    id: 'sla-pro', name: 'Proto-Slavic', family: 'slavic',
                    children: [
                        { id: 'ru', name: 'Russian', family: 'slavic', isLeaf: true },
                        { id: 'pl', name: 'Polish', family: 'slavic', isLeaf: true },
                        { id: 'cs', name: 'Czech', family: 'slavic', isLeaf: true },
                        { id: 'bg', name: 'Bulgarian', family: 'slavic', isLeaf: true },
                    ]
                },
                {
                    id: 'balt-pro', name: 'Proto-Baltic', family: 'baltic',
                    children: [
                        { id: 'lt', name: 'Lithuanian', family: 'baltic', isLeaf: true },
                        { id: 'lv', name: 'Latvian', family: 'baltic', isLeaf: true },
                    ]
                },
            ]
        },
        { id: 'hy', name: 'Armenian', family: 'armenian', isLeaf: true },
        { id: 'sq', name: 'Albanian', family: 'albanian', isLeaf: true },
    ]
};

function buildWordMap(wordData, wordKey) {
    const map = {};
    const staticEntry = wordData?.staticEntry || (wordKey ? pieRoots[wordKey] : null);

    if (staticEntry) {
        map['ine-pro'] = staticEntry.pieRoot;
        staticEntry.chain?.forEach(n => { if (n.word) map[n.lang] = n.word; });
        // Do NOT include static cognates from the JSON file here anymore.
        // Modern equivalents should come from live APIs (apiCognates) instead,
        // so we aren't storing lots of translations on disk.
    }

    // Mix in chain from Wiktionary
    wordData?.etymologyChain?.forEach(n => {
        if (n.lang && n.word) map[n.lang] = n.word;
    });

    // Cognates from Wiktionary API ({{cog|lang|word}} in etymology section)
    wordData?.apiCognates?.forEach(n => {
        if (n.lang && n.word) map[n.lang] = n.word;
    });

    return map;
}

// Family -> proto node id in the tree (so we can graft languages not in the static tree)
const FAMILY_TO_PROTO_ID = {
    pie: 'ine-pro',
    germanic: 'gem-pro',
    italic: 'ita-pro',
    hellenic: 'grk-pro',
    indoiranian: 'iir-pro',
    celtic: 'cel-pro',
    slavic: 'sla-pro',
    baltic: 'balt-pro',
    armenian: 'hy',
    albanian: 'sq',
};

function buildDynamicTree(staticTree, wordMap) {
    // 1. Deep clone the static tree template
    const tree = JSON.parse(JSON.stringify(staticTree));
    const nodesById = {};

    // 2. Index existing nodes and inject words from chain + cognates
    function index(node) {
        nodesById[node.id] = node;
        node.word = wordMap[node.id] ?? null;
        if (node.children) node.children.forEach(index);
    }
    index(tree);

    // 3. Graft missing languages from wordMap (parent = proto node for that family)
    Object.keys(wordMap).forEach(langCode => {
        if (!nodesById[langCode]) {
            const familyCode = LANG_FAMILIES[langCode];
            const familyName = LANG_DISPLAY_NAMES[langCode] || langCode;
            const parentId = FAMILY_TO_PROTO_ID[familyCode];
            const parent = parentId ? nodesById[parentId] : null;

            if (parent) {
                if (!parent.children) parent.children = [];
                if (!parent.children.some(c => c.id === langCode)) {
                    parent.children.push({
                        id: langCode,
                        name: familyName,
                        word: wordMap[langCode],
                        family: familyCode,
                        isDynamic: true,
                        isLeaf: true
                    });
                }
            }
        }
    });

    return tree;
}

function isEdgeOnLangPath(sourceId, targetId, pathIds) {
    if (!pathIds?.length) return false;
    for (let i = 0; i < pathIds.length - 1; i++) {
        if (pathIds[i] === sourceId && pathIds[i + 1] === targetId) return true;
    }
    return false;
}

export default function LanguageTree({
    wordData,
    word,
    onNodeClick,
    activeFamily,
    pathTargetLang,
    onLawPageOpen,
}) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [dim, setDim] = useState({ w: 800, h: 600 });
    const [lawTooltip, setLawTooltip] = useState(null);
    /** 'path' = only edges on PIE → selected language (default English); 'all' = every attested chain edge with laws */
    const [soundLawScope, setSoundLawScope] = useState('path');
    const onLawPageOpenRef = useRef(onLawPageOpen);

    useEffect(() => {
        onLawPageOpenRef.current = onLawPageOpen;
    }, [onLawPageOpen]);

    const closeLawTooltip = useCallback(() => setLawTooltip(null), []);

    useEffect(() => {
        const obs = new ResizeObserver(() => {
            if (containerRef.current) {
                setDim({ w: containerRef.current.clientWidth, h: containerRef.current.clientHeight });
            }
        });
        if (containerRef.current) obs.observe(containerRef.current);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!svgRef.current) return;
        const { w, h } = dim;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        // Build word map
        const wordMap = buildWordMap(wordData, word?.toLowerCase());
        const treeData = buildDynamicTree(IE_TREE_STRUCTURE, wordMap);

        // d3 hierarchy
        const root = d3.hierarchy(treeData);

        // We'll layout horizontally (left to right)
        const marginLeft = 60;
        const marginRight = 80;
        const marginTop = 30;
        const marginBottom = 20;
        // Fixed vertical spacing per leaf
        const leafCount = root.leaves().length;
        const rowHeight = Math.max(22, Math.min(32, (h - marginTop - marginBottom) / leafCount));
        const totalH = leafCount * rowHeight + marginTop + marginBottom;
        const actualH = Math.max(h, totalH);

        const treeLayout = d3.tree()
            .size([actualH - marginTop - marginBottom, w - marginLeft - marginRight])
            .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));

        treeLayout(root);

        // Defs
        const defs = svg.append('defs');
        const glow = defs.append('filter').attr('id', 'tree-glow');
        glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'b');
        const fm = glow.append('feMerge');
        fm.append('feMergeNode').attr('in', 'b');
        fm.append('feMergeNode').attr('in', 'SourceGraphic');

        // Container with scroll
        svg.attr('height', actualH);

        const zoom = d3.zoom()
            .scaleExtent([0.3, 2.5])
            .on('zoom', e => g.attr('transform', e.transform));
        svg.call(zoom);

        const g = svg.append('g')
            .attr('transform', `translate(${marginLeft},${marginTop})`);

        // Path to selected language (for highlighting nodes and links)
        const pathToTarget = pathTargetLang ? getPathFromPIEToLang(pathTargetLang) : [];
        const linkOnPath = (d) => pathToTarget.length > 0 && pathToTarget.includes(d.source.data.id) && pathToTarget.includes(d.target.data.id);

        // Links — curved horizontal (highlight if on path to selected country/language)
        g.append('g').attr('class', 'links')
            .selectAll('path')
            .data(root.links())
            .enter().append('path')
            .attr('class', 'tree-link-path')
            .attr('fill', 'none')
            .attr('stroke', d => linkOnPath(d) ? '#FFD700' : (FAMILY_COLORS[d.target.data.family] || '#94A3B8'))
            .attr('stroke-opacity', d => linkOnPath(d) ? 0.95 : 0.45)
            .attr('stroke-width', d => linkOnPath(d) ? 2.8 : (d.target.data.family === 'pie' ? 2.5 : 1.8))
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x)
            );

        // Sound-law markers: attested chain steps that have laws; optionally restricted to path → selected language.
        const chainEdgeWords = getChainEdgeWordsMap(wordData);
        const pathIds = getPathFromPIEToLang(pathTargetLang || 'en');
        const linkWithLaws = root.links().filter((l) => {
            const from = l.source.data.id;
            const to = l.target.data.id;
            const edgeKey = `${from}=>${to}`;
            if (!chainEdgeWords.has(edgeKey)) return false;
            if (getLawIdsForEdge(from, to).length === 0) return false;
            if (soundLawScope === 'path' && (!pathIds.length || !isEdgeOnLangPath(from, to, pathIds))) {
                return false;
            }
            return true;
        });
        const lawG = g.append('g').attr('class', 'sound-law-markers');
        const markerEnter = lawG.selectAll('g.sound-law-hit')
            .data(linkWithLaws)
            .enter().append('g')
            .attr('class', 'sound-law-hit')
            .attr('transform', (d) => {
                const mx = (d.source.y + d.target.y) / 2;
                const my = (d.source.x + d.target.x) / 2;
                return `translate(${mx},${my})`;
            })
            .style('cursor', 'pointer');

        markerEnter.append('circle')
            .attr('r', 9)
            .attr('fill', 'transparent');

        markerEnter.append('circle')
            .attr('r', 5)
            .attr('class', 'sound-law-marker-dot')
            .attr('fill', 'rgba(255, 215, 0, 0.35)')
            .attr('stroke', 'rgba(255, 215, 0, 0.85)')
            .attr('stroke-width', 1.2);

        markerEnter.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-size', '8px')
            .attr('font-weight', '700')
            .attr('fill', '#fff6cc')
            .attr('pointer-events', 'none')
            .text('◆');

        const pathLabel = LANG_DISPLAY_NAMES[pathTargetLang || 'en'] || pathTargetLang || 'English';

        markerEnter
            .on('mouseenter', (event, d) => {
                const ids = getLawIdsForEdge(d.source.data.id, d.target.data.id);
                const words = chainEdgeWords.get(`${d.source.data.id}=>${d.target.data.id}`) || null;
                setLawTooltip({
                    clientX: event.clientX,
                    clientY: event.clientY,
                    sourceId: d.source.data.id,
                    targetId: d.target.data.id,
                    lawIds: ids,
                    words,
                    pathLabel,
                });
            })
            .on('mousemove', (event) => {
                setLawTooltip((prev) => (prev ? { ...prev, clientX: event.clientX, clientY: event.clientY } : null));
            })
            .on('mouseleave', () => setLawTooltip(null))
            .on('click', (event, d) => {
                event.stopPropagation();
                const ids = getLawIdsForEdge(d.source.data.id, d.target.data.id);
                const words = chainEdgeWords.get(`${d.source.data.id}=>${d.target.data.id}`) || null;
                if (ids.length && onLawPageOpenRef.current) {
                    const [first, ...rest] = ids;
                    onLawPageOpenRef.current(first, rest, {
                        parentWord: words?.parentWord,
                        childWord: words?.childWord,
                        sourceId: d.source.data.id,
                        targetId: d.target.data.id,
                        pathLabel,
                        pathTargetLang: pathTargetLang || 'en',
                    });
                }
            });

        // Nodes
        const nodeG = g.append('g').attr('class', 'nodes')
            .selectAll('g')
            .data(root.descendants())
            .enter().append('g')
            .attr('transform', d => `translate(${d.y},${d.x})`)
            .style('cursor', 'pointer')
            .on('click', (_, d) => onNodeClick && onNodeClick(d.data));

        const nodeR = d => d.data.id === 'ine-pro' ? 12 : d.data.isLeaf ? 6 : 9;
        const isOnPathToTarget = d => pathToTarget.length > 0 && pathToTarget.includes(d.data.id);
        const isActive = d => activeFamily && d.data.family === activeFamily;

        // Node circles (highlight path when a country/language is selected)
        nodeG.append('circle')
            .attr('r', d => nodeR(d))
            .attr('fill', d => FAMILY_COLORS[d.data.family] || '#94A3B8')
            .attr('fill-opacity', d => d.data.id === 'ine-pro' ? 1 : d.data.word ? 0.9 : 0.45)
            .attr('stroke', d => isOnPathToTarget(d) ? '#FFD700' : isActive(d) ? '#fff' : d.data.id === 'ine-pro' ? '#fff9a0' : 'rgba(255,255,255,0.2)')
            .attr('stroke-width', d => isOnPathToTarget(d) ? 2.5 : isActive(d) ? 2.5 : d.data.id === 'ine-pro' ? 2 : 1)
            .style('filter', d => (d.data.id === 'ine-pro' || d.data.word || isOnPathToTarget(d)) ? 'url(#tree-glow)' : null);

        // Language name label (single line for leaves with word: "Name — word" to avoid overlap)
        nodeG.append('text')
            .attr('x', d => d.children ? -(nodeR(d) + 6) : (nodeR(d) + 6))
            .attr('dy', d => (d.data.word && d.data.isLeaf) ? '-0.6em' : (d.data.word ? '-0.4em' : '0.35em'))
            .attr('text-anchor', d => d.children ? 'end' : 'start')
            .attr('font-size', d => d.data.id === 'ine-pro' ? '11px' : d.data.isLeaf ? '9px' : '10px')
            .attr('font-family', 'Inter, sans-serif')
            .attr('font-weight', d => (d.data.id === 'ine-pro' || d.data.word || isOnPathToTarget(d)) ? '600' : '400')
            .attr('fill', d => d.data.word
                ? (FAMILY_COLORS[d.data.family] || '#CBD5E1')
                : 'rgba(180,190,210,0.65)')
            .attr('paint-order', 'stroke')
            .attr('stroke', '#0d1120')
            .attr('stroke-width', '3px')
            .attr('stroke-linejoin', 'round')
            .text(d => (d.data.word && d.data.isLeaf) ? `${d.data.name} — "${d.data.word}"` : d.data.name);

        // Word label on second line only for non-leaf nodes with word (leaves already show "Name — word")
        nodeG.filter(d => !!d.data.word && !!d.children)
            .append('text')
            .attr('x', d => -(nodeR(d) + 6))
            .attr('dy', '1.25em')
            .attr('text-anchor', 'end')
            .attr('font-size', '8.5px')
            .attr('font-family', 'Inter, sans-serif')
            .attr('font-style', 'italic')
            .attr('fill', d => FAMILY_COLORS[d.data.family] || '#94A3B8')
            .attr('fill-opacity', 0.95)
            .attr('paint-order', 'stroke')
            .attr('stroke', '#0d1627')
            .attr('stroke-width', '2.5px')
            .attr('stroke-linejoin', 'round')
            .text(d => `"${d.data.word}"`);

    }, [dim, wordData, word, activeFamily, pathTargetLang, onNodeClick, soundLawScope]);

    useEffect(() => {
        if (!lawTooltip) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setLawTooltip(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lawTooltip]);

    const primaryLaw = lawTooltip?.lawIds?.length
        ? getLawById(lawTooltip.lawIds[0])
        : null;
    const secondaryLawIds = lawTooltip?.lawIds?.slice(1, 3) ?? [];
    const moreLawCount = (lawTooltip?.lawIds?.length ?? 0) > 3 ? (lawTooltip.lawIds.length - 3) : 0;

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'auto', position: 'relative' }}>
            <svg
                ref={svgRef}
                width={dim.w}
                style={{ display: 'block', minHeight: '100%' }}
            />

            {lawTooltip && primaryLaw && (
                <div
                    className="sound-law-floating-tip sound-law-floating-tip--compact"
                    style={{
                        left: Math.min(
                            Math.max(12, lawTooltip.clientX + 14),
                            (typeof window !== 'undefined' ? window.innerWidth - 292 : 12)
                        ),
                        top: Math.min(
                            Math.max(12, lawTooltip.clientY + 12),
                            (typeof window !== 'undefined' ? window.innerHeight - 120 : 12)
                        ),
                    }}
                    role="tooltip"
                >
                    <button type="button" className="sound-law-tip-close" onClick={closeLawTooltip} aria-label="Close">
                        ×
                    </button>
                    <div className="sound-law-tip-kicker">
                        Along your path to {lawTooltip.pathLabel || 'English'}
                    </div>
                    <strong className="sound-law-tip-title">{primaryLaw.shortName}</strong>
                    <p className="sound-law-tip-one">{getTooltipLine(primaryLaw)}</p>
                    {lawTooltip.words?.parentWord && lawTooltip.words?.childWord && (
                        <div className="sound-law-tip-diff">
                            <span className="sound-law-tip-diff-label">Change in this word</span>
                            <SoundDiffPair left={lawTooltip.words.parentWord} right={lawTooltip.words.childWord} />
                        </div>
                    )}
                    {secondaryLawIds.length > 0 && (
                        <p className="sound-law-tip-also">
                            Also involved:{' '}
                            {secondaryLawIds.map((id) => {
                                const l = getLawById(id);
                                if (!l) return null;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        className="sound-law-tip-link"
                                        onClick={() =>
                                            onLawPageOpen?.(id, [], {
                                                parentWord: lawTooltip.words?.parentWord,
                                                childWord: lawTooltip.words?.childWord,
                                                sourceId: lawTooltip.sourceId,
                                                targetId: lawTooltip.targetId,
                                                pathLabel: lawTooltip.pathLabel,
                                                pathTargetLang: pathTargetLang || 'en',
                                            })
                                        }
                                    >
                                        {l.shortName}
                                    </button>
                                );
                            })}
                            {moreLawCount > 0 && (
                                <span className="sound-law-tip-more"> +{moreLawCount} more</span>
                            )}
                        </p>
                    )}
                    <button
                        type="button"
                        className="sound-law-tip-cta"
                        onClick={() => {
                            const [first, ...rest] = lawTooltip.lawIds;
                            if (first && onLawPageOpen) {
                                onLawPageOpen(first, rest, {
                                    parentWord: lawTooltip.words?.parentWord,
                                    childWord: lawTooltip.words?.childWord,
                                    sourceId: lawTooltip.sourceId,
                                    targetId: lawTooltip.targetId,
                                    pathLabel: lawTooltip.pathLabel,
                                    pathTargetLang: pathTargetLang || 'en',
                                });
                            }
                        }}
                    >
                        Read full article →
                    </button>
                </div>
            )}

            {/* Legend */}
            <div className="tree-legend-panel">
                <div className="tree-sound-scope" role="group" aria-label="Sound law scope">
                    <span className="tree-sound-scope-label">Laws</span>
                    <button
                        type="button"
                        className={`tree-sound-scope-btn${soundLawScope === 'path' ? ' is-active' : ''}`}
                        onClick={() => setSoundLawScope('path')}
                        title="Show only steps on the path from PIE to the language selected on the map (default English)"
                    >
                        Path
                    </button>
                    <button
                        type="button"
                        className={`tree-sound-scope-btn${soundLawScope === 'all' ? ' is-active' : ''}`}
                        onClick={() => setSoundLawScope('all')}
                        title="Show every attested step in the tree that has a law article"
                    >
                        All branches
                    </button>
                </div>
                {wordData && getCanonicalEtymologyChain(wordData).length > 0 && (
                    <p className="tree-sound-help">
                        Glossary words use a full PIE → English chain so sound laws match the tree. Live-only
                        lookups may skip proto steps—markers appear only where the chain lists both languages.
                    </p>
                )}
                {Object.entries(FAMILY_COLORS)
                    .filter(([k]) => k !== 'other')
                    .map(([fam, col]) => (
                        <div key={fam} className="tree-legend-item">
                            <span className="tree-legend-dot" style={{ background: col }} />
                            <span style={{ color: col }}>{fam === 'pie' ? 'PIE (root)' : fam.charAt(0).toUpperCase() + fam.slice(1)}</span>
                        </div>
                    ))}
            </div>
        </div>
    );
}
