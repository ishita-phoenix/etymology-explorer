import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { getLangForCountry } from '../data/countryToLang';
import { getPathFromPIEToLang } from '../utils/treePath';
import { LANG_FAMILIES, LANG_DISPLAY_NAMES } from '../services/wiktionaryApi';

// Geographic centers for each IE language family
const IE_LOCATIONS = {
    pie: {
        name: 'Proto-Indo-European',
        family: 'pie',
        lat: 47, lon: 36,
        label: 'Pontic-Caspian Steppe',
        period: 'c. 4500 BCE',
    },
    germanic: {
        name: 'Germanic',
        family: 'germanic',
        lat: 54, lon: 10,
        label: 'Northern Europe',
        period: 'c. 500 BCE',
        languages: ['English', 'German', 'Dutch', 'Swedish', 'Norwegian', 'Danish'],
    },
    italic: {
        name: 'Italic / Romance',
        family: 'italic',
        lat: 42, lon: 12,
        label: 'Italian Peninsula',
        period: 'c. 600 BCE',
        languages: ['Latin', 'French', 'Spanish', 'Italian', 'Portuguese', 'Romanian'],
    },
    hellenic: {
        name: 'Hellenic',
        family: 'hellenic',
        lat: 38, lon: 23,
        label: 'Greek Peninsula',
        period: 'c. 1500 BCE',
        languages: ['Ancient Greek', 'Modern Greek'],
    },
    indoiranian: {
        name: 'Indo-Iranian',
        family: 'indoiranian',
        lat: 30, lon: 62,
        label: 'Iran & India region (South Asia)',
        period: 'c. 2000 BCE',
        languages: ['Sanskrit', 'Hindi', 'Persian', 'Urdu', 'Bengali'],
    },
    celtic: {
        name: 'Celtic',
        family: 'celtic',
        lat: 52, lon: -4,
        label: 'British Isles & Gaul',
        period: 'c. 700 BCE',
        languages: ['Irish', 'Welsh', 'Scottish Gaelic', 'Breton'],
    },
    slavic: {
        name: 'Slavic',
        family: 'slavic',
        lat: 52, lon: 30,
        label: 'Eastern Europe',
        period: 'c. 500 CE',
        languages: ['Russian', 'Polish', 'Czech', 'Bulgarian'],
    },
    baltic: {
        name: 'Baltic',
        family: 'baltic',
        lat: 56, lon: 24,
        label: 'Baltic Sea region',
        period: 'c. 500 BCE',
        languages: ['Lithuanian', 'Latvian'],
    },
    armenian: {
        name: 'Armenian',
        family: 'armenian',
        lat: 40, lon: 45,
        label: 'Armenian Highlands',
        period: 'c. 600 BCE',
        languages: ['Armenian'],
    },
    albanian: {
        name: 'Albanian',
        family: 'albanian',
        lat: 41, lon: 19.5,
        label: 'Western Balkans',
        period: 'c. 400 CE',
        languages: ['Albanian'],
    },
};

// Radial offsets for text labels to prevent overlap in Europe
const LABEL_OFFSETS = {
    pie: { dx: 0, dy: -24, anchor: 'middle', nameDy: 14 },
    germanic: { dx: -12, dy: -20, anchor: 'end', nameDy: -10 },
    italic: { dx: -14, dy: 14, anchor: 'end', nameDy: 24 },
    hellenic: { dx: 6, dy: 18, anchor: 'start', nameDy: 28 },
    indoiranian: { dx: 18, dy: -10, anchor: 'start', nameDy: 0 },
    celtic: { dx: -18, dy: -12, anchor: 'end', nameDy: -2 },
    slavic: { dx: 16, dy: -16, anchor: 'start', nameDy: -6 },
    baltic: { dx: 4, dy: -22, anchor: 'start', nameDy: -12 },
    armenian: { dx: 18, dy: 6, anchor: 'start', nameDy: 16 },
    albanian: { dx: -14, dy: -2, anchor: 'end', nameDy: 8 },
};


// Migration arrows from PIE to each branch
const MIGRATION_PATHS = [
    { from: 'pie', to: 'germanic' },
    { from: 'pie', to: 'italic' },
    { from: 'pie', to: 'hellenic' },
    { from: 'pie', to: 'celtic' },
    { from: 'pie', to: 'slavic' },
    { from: 'pie', to: 'baltic' },
    { from: 'pie', to: 'armenian' },
    { from: 'pie', to: 'albanian' },
    { from: 'pie', to: 'indoiranian' },
    // Secondary
    { from: 'baltic', to: 'slavic', secondary: true },
];

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

const LANGUAGE_COORDINATES = {
    'en': { lat: 51.5, lon: -0.1, name: 'English' },
    'de': { lat: 52.5, lon: 13.4, name: 'German' },
    'nl': { lat: 52.3, lon: 4.9, name: 'Dutch' },
    'fr': { lat: 48.8, lon: 2.3, name: 'French' },
    'es': { lat: 40.4, lon: -3.7, name: 'Spanish' },
    'it': { lat: 41.9, lon: 12.5, name: 'Italian' },
    'pt': { lat: 38.7, lon: -9.1, name: 'Portuguese' },
    'ro': { lat: 44.4, lon: 26.1, name: 'Romanian' },
    'hi': { lat: 28.6, lon: 77.2, name: 'Hindi' },
    'sa': { lat: 25.3, lon: 83.0, name: 'Sanskrit' },
    'fa': { lat: 35.7, lon: 51.4, name: 'Persian' },
    // Center Urdu in the core Urdu-speaking region of Pakistan
    'ur': { lat: 33.7, lon: 73.1, name: 'Urdu' },
    'ru': { lat: 55.7, lon: 37.6, name: 'Russian' },
    'pl': { lat: 52.2, lon: 21.0, name: 'Polish' },
    'cs': { lat: 50.1, lon: 14.4, name: 'Czech' },
    'el': { lat: 37.9, lon: 23.7, name: 'Greek' },
    'hy': { lat: 40.1, lon: 44.5, name: 'Armenian' },
    'sq': { lat: 41.3, lon: 19.8, name: 'Albanian' },
    'ga': { lat: 53.3, lon: -6.3, name: 'Irish' },
    'cy': { lat: 51.5, lon: -3.2, name: 'Welsh' },
    'lt': { lat: 54.7, lon: 25.3, name: 'Lithuanian' },
    'lv': { lat: 56.9, lon: 24.1, name: 'Latvian' },
    'ang': { lat: 52.5, lon: -1.0, name: 'Old English' },
    'non': { lat: 60.0, lon: 10.0, name: 'Old Norse' },
    'no': { lat: 62.0, lon: 10.0, name: 'Norwegian' },
    'la': { lat: 41.9, lon: 12.5, name: 'Latin' },
    'grc': { lat: 37.9, lon: 23.7, name: 'Ancient Greek' },
};

// Coords for a lang id: specific language or family center
function getCoordsForLang(langId) {
    const specific = LANGUAGE_COORDINATES[langId];
    if (specific) return { lat: specific.lat, lon: specific.lon, name: specific.name };
    const family = LANG_FAMILIES[langId];
    if (family && IE_LOCATIONS[family])
        return { lat: IE_LOCATIONS[family].lat, lon: IE_LOCATIONS[family].lon, name: IE_LOCATIONS[family].name };
    return null;
}

export default function WorldMap({ wordData, activeFamily, onFamilyClick, pathTargetLang = 'en', onPathTargetChange, showDispersion = true }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [worldData, setWorldData] = useState(null);
    const [tooltip, setTooltip] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 450 });
    const rotationRef = useRef([-30, -35]); // current globe rotation (lon, lat)
    const BASE_SCALE = 280;
    const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%, zoom multiplies projection scale

    // Fetch world topojson
    useEffect(() => {
        fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
            .then(r => r.json())
            .then(data => setWorldData(data))
            .catch(() => setWorldData(null));
    }, []);

    useEffect(() => {
        const obs = new ResizeObserver(() => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        });
        if (containerRef.current) obs.observe(containerRef.current);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!svgRef.current) return;
        const { width, height } = dimensions;
        const svg = d3.select(svgRef.current);

        const createProjection = (rotation) =>
            d3.geoOrthographic()
                .scale(BASE_SCALE * zoomLevel)
                .translate([width / 2, height / 2])
                .rotate(rotation)
                .clipAngle(90);

        const drawScene = (projection) => {
            svg.selectAll('*').remove();

            // Defs
            const defs = svg.append('defs');
            defs.append('marker')
                .attr('id', 'map-arrow')
                .attr('viewBox', '0 -4 10 8')
                .attr('refX', 10).attr('refY', 0)
                .attr('markerWidth', 5).attr('markerHeight', 5)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-4L10,0L0,4')
                .attr('fill', 'rgba(255,215,0,0.5)');

            Object.entries(FAMILY_COLORS).forEach(([key, color]) => {
                if (key === 'pie' || key === 'other') return;
                defs.append('marker')
                    .attr('id', `arrow-${key}`)
                    .attr('viewBox', '0 -4 10 8')
                    .attr('refX', 10).attr('refY', 0)
                    .attr('markerWidth', 5).attr('markerHeight', 5)
                    .attr('orient', 'auto')
                    .append('path')
                    .attr('d', 'M0,-4L10,0L0,4')
                    .attr('fill', color);
            });

            // Glow filter
            const glow = defs.append('filter').attr('id', 'map-glow');
            glow.append('feGaussianBlur').attr('stdDeviation', 4).attr('result', 'coloredBlur');
            const fm = glow.append('feMerge');
            fm.append('feMergeNode').attr('in', 'coloredBlur');
            fm.append('feMergeNode').attr('in', 'SourceGraphic');

            const path = d3.geoPath().projection(projection);
            const g = svg.append('g');

            // Globe sphere
            g.append('path')
                .datum({ type: 'Sphere' })
                .attr('d', path)
                .attr('fill', '#070b14')
                .attr('stroke', 'rgba(255,255,255,0.1)')
                .attr('stroke-width', 1);

            // Countries: visual layer only (no pointer events so drag/zoom on svg works)
            if (worldData) {
                const countries = topojson.feature(worldData, worldData.objects.countries);
                const borders = topojson.mesh(worldData, worldData.objects.countries, (a, b) => a !== b);

                g.append('g').attr('class', 'countries-fill')
                    .selectAll('path')
                    .data(countries.features)
                    .enter().append('path')
                    .attr('d', path)
                    .attr('fill', '#1a2540')
                    .attr('stroke', 'rgba(255,255,255,0.06)')
                    .attr('stroke-width', 0.4)
                    .style('pointer-events', 'none');

                g.append('path')
                    .datum(borders)
                    .attr('fill', 'none')
                    .attr('stroke', 'rgba(255,255,255,0.08)')
                    .attr('stroke-width', 0.5)
                    .attr('d', path);
            }

            // Draw migration paths only when showing full dispersion
            if (showDispersion) {
                MIGRATION_PATHS.forEach(({ from, to, secondary }) => {
                    const fromLoc = IE_LOCATIONS[from];
                    const toLoc = IE_LOCATIONS[to];
                    if (!fromLoc || !toLoc) return;

                    const route = { type: 'LineString', coordinates: [[fromLoc.lon, fromLoc.lat], [toLoc.lon, toLoc.lat]] };
                    const d = path(route);
                    if (d) {
                        g.append('path')
                            .attr('d', d)
                            .attr('fill', 'none')
                            .attr('stroke', secondary ? 'rgba(255,255,255,0.12)' : FAMILY_COLORS[to] || '#FFD700')
                            .attr('stroke-opacity', secondary ? 0.3 : 0.6)
                            .attr('stroke-width', secondary ? 1 : 1.8)
                            .attr('stroke-dasharray', secondary ? '4,3' : null)
                            .attr('marker-end', `url(#arrow-${to})`);
                    }
                });
            }

            // Path from PIE to pathTargetLang with words laid out along the path
            const pathLangIds = getPathFromPIEToLang(pathTargetLang);
            if (pathLangIds.length > 0 && wordData) {
                const pathSteps = pathLangIds
                    .map(langId => {
                        const coords = getCoordsForLang(langId);
                        if (!coords) return null;
                        const word = getWordForLanguage(langId, wordData);
                        const name = LANG_DISPLAY_NAMES[langId] || coords.name || langId;
                        return { langId, word, name, lat: coords.lat, lon: coords.lon };
                    })
                    .filter(Boolean);
                if (pathSteps.length > 1) {
                    const pathLine = pathSteps.map(s => [s.lon, s.lat]);
                    const geoLine = { type: 'LineString', coordinates: pathLine };
                    const pathD = path(geoLine);
                    if (pathD) {
                        const pathG = g.append('g').attr('class', 'etym-path');
                        pathG.append('path')
                            .attr('d', pathD)
                            .attr('fill', 'none')
                            .attr('stroke', '#FFD700')
                            .attr('stroke-width', 2.5)
                            .attr('stroke-opacity', 0.9)
                            .attr('stroke-linecap', 'round')
                            .attr('stroke-linejoin', 'round');
                        pathSteps.forEach((step, i) => {
                            const pt = projection([step.lon, step.lat]);
                            if (!pt) return;
                            const seg = pathG.append('g').attr('transform', `translate(${pt[0]},${pt[1]})`);
                            seg.append('circle')
                                .attr('r', step.langId === 'ine-pro' ? 6 : 4)
                                .attr('fill', FAMILY_COLORS[LANG_FAMILIES[step.langId]] || '#94A3B8')
                                .attr('stroke', '#fff')
                                .attr('stroke-width', 1);
                            const nameLabel = (step.name || step.langId);
                            const wordLabel = step.word ? String(step.word) : null;
                            const offsetY = pathSteps.length > 3 && i > 0 && i < pathSteps.length - 1 ? (i % 2 === 0 ? -22 : 14) : -14;
                            seg.append('text')
                                .attr('y', offsetY)
                                .attr('text-anchor', 'middle')
                                .attr('font-size', '8px')
                                .attr('font-family', 'Inter, sans-serif')
                                .attr('fill', 'rgba(255,255,255,0.9)')
                                .attr('paint-order', 'stroke')
                                .attr('stroke', '#0d1627')
                                .attr('stroke-width', '2px')
                                .text(nameLabel);
                            if (wordLabel) {
                                seg.append('text')
                                    .attr('y', offsetY + (offsetY < 0 ? 12 : -12))
                                    .attr('text-anchor', 'middle')
                                    .attr('font-size', '9px')
                                    .attr('font-family', 'Inter, sans-serif')
                                    .attr('font-style', 'italic')
                                    .attr('fill', FAMILY_COLORS[LANG_FAMILIES[step.langId]] || '#FFD700')
                                    .attr('paint-order', 'stroke')
                                    .attr('stroke', '#0d1627')
                                    .attr('stroke-width', '2px')
                                    .text(wordLabel);
                            }
                        });
                    }
                }
            }

            // Country hover layer (transparent paths on top of migration, below nodes) so hover works
            if (worldData) {
                const countries = topojson.feature(worldData, worldData.objects.countries);
                const countryHover = g.append('g').attr('class', 'countries-hover');
                countryHover.selectAll('path')
                    .data(countries.features)
                    .enter().append('path')
                    .attr('d', path)
                    .attr('fill', 'rgba(0,0,0,0.01)')
                    .attr('stroke', 'none')
                    .style('cursor', 'pointer')
                    .on('click', function(event, d) {
                        const lang = getLangForCountry(d);
                        if (lang && onPathTargetChange) onPathTargetChange(lang);
                    })
                    .on('mouseenter', function(event, d) {
                        const countryName = d.properties?.name ?? d.properties?.NAME ?? d.properties?.admin ?? 'Country';
                        const lang = getLangForCountry(d);
                        const word = lang ? getWordForLanguage(lang, wordData) : null;
                        const allNodes = [...(wordData?.etymologyChain ?? []), ...(wordData?.staticEntry?.cognates ?? []), ...(wordData?.staticEntry?.chain ?? [])];
                        const node = allNodes.find(n => n.lang === lang);
                        const langName = node?.langName ?? (LANGUAGE_COORDINATES[lang]?.name) ?? lang;
                        const family = node?.family ?? (lang ? 'other' : null);
                        const color = family ? (FAMILY_COLORS[family] ?? '#94A3B8') : '#94A3B8';
                        d3.select(this).attr('fill', 'rgba(74, 158, 255, 0.2)');
                        setTooltip({
                            x: event.clientX, y: event.clientY,
                            name: countryName,
                            word: word ?? null,
                            color,
                            period: '',
                            label: langName ? `Language: ${langName}` : (word ? 'Cognate' : ''),
                            languages: null,
                            noWordSearched: !wordData,
                        });
                    })
                    .on('mouseleave', function() {
                        d3.select(this).attr('fill', 'rgba(0,0,0,0.01)');
                        setTooltip(null);
                    });
            }

            // Collect all potential nodes to show (only when showing full dispersion)
            const nodesToShow = [];
            if (showDispersion) {
                // Always show family centers
                Object.entries(IE_LOCATIONS).forEach(([key, loc]) => {
                    const word = getWordForLanguage(key, wordData);
                    const pt = projection([loc.lon, loc.lat]);
                    if (pt) {
                        nodesToShow.push({ key, x: pt[0], y: pt[1], ...loc, word, isFamilyCenter: true });
                    }
                });

            // Add specific language dots if they have words in wordData (from live APIs and chain)
                if (wordData) {
                    const allWords = [];
                    if (wordData.etymologyChain) allWords.push(...wordData.etymologyChain);
                    if (wordData.staticEntry?.chain) allWords.push(...wordData.staticEntry.chain);
                if (wordData.apiCognates) allWords.push(...wordData.apiCognates);

                    allWords.forEach(n => {
                        if (LANGUAGE_COORDINATES[n.lang] && !nodesToShow.some(nd => nd.key === n.lang)) {
                            const loc = LANGUAGE_COORDINATES[n.lang];
                            const pt = projection([loc.lon, loc.lat]);
                            if (pt) {
                                nodesToShow.push({
                                    key: n.lang,
                                    x: pt[0], y: pt[1],
                                    name: loc.name,
                                    family: n.family,
                                    word: n.word,
                                    isFamilyCenter: false
                                });
                            }
                        }
                    });
                }
            }

            // Render nodes (only when showDispersion)
            const nodeG = g.append('g').attr('class', 'nodes');
            nodesToShow.forEach(nd => {
                const isPIE = nd.key === 'pie';
                const isActive = activeFamily === nd.key || (nd.family && activeFamily === nd.family);
                const color = FAMILY_COLORS[nd.family] || FAMILY_COLORS[nd.key] || '#94A3B8';
                const r = nd.isFamilyCenter ? (isPIE ? 12 : 8) : 5;

                const ng = nodeG.append('g')
                    .attr('transform', `translate(${nd.x},${nd.y})`)
                    .style('cursor', 'pointer')
                    .on('click', () => onFamilyClick && onFamilyClick(nd.isFamilyCenter ? nd.key : nd.family))
                    .on('mouseenter', (e) => {
                        setTooltip({
                            x: e.clientX, y: e.clientY,
                            name: nd.name,
                            word: nd.word,
                            color,
                            period: nd.period || '',
                            label: nd.label || ''
                        });
                    })
                    .on('mouseleave', () => setTooltip(null));

                ng.append('circle')
                    .attr('r', r)
                    .attr('fill', color)
                    .attr('fill-opacity', nd.word ? 1 : 0.6)
                    .attr('stroke', isActive ? '#fff' : 'rgba(255,255,255,0.2)')
                    .attr('stroke-width', isActive ? 2 : 1)
                    .style('filter', nd.word ? 'url(#map-glow)' : null);

                if (nd.word || nd.isFamilyCenter) {
                    const offset = LABEL_OFFSETS[nd.key] || { dx: 0, dy: -12, anchor: 'middle', nameDy: 10 };

                    if (nd.word) {
                        ng.append('text')
                            .attr('x', offset.dx).attr('y', offset.dy)
                            .attr('text-anchor', offset.anchor)
                            .attr('font-size', nd.isFamilyCenter ? '10px' : '8px')
                            .attr('font-family', 'Inter, sans-serif')
                            .attr('font-weight', '700')
                            .attr('fill', color)
                            .attr('paint-order', 'stroke')
                            .attr('stroke', '#0d1627').attr('stroke-width', '3px')
                            .text(nd.word);
                    }

                    ng.append('text')
                        .attr('x', offset.dx).attr('y', nd.word ? offset.nameDy : (offset.dy + 8))
                        .attr('text-anchor', offset.anchor)
                        .attr('font-size', '7px')
                        .attr('font-family', 'Inter, sans-serif')
                        .attr('fill', 'rgba(255,255,255,0.6)')
                        .text(nd.name.split('/')[0].trim());
                }
            });
        };

        const initialProjection = createProjection(rotationRef.current);
        drawScene(initialProjection);

        // Zoom: only respond to wheel so drag can handle rotation
        const zoom = d3.zoom()
            .scaleExtent([0.35, 3.5])
            .filter(event => event.type === 'wheel')
            .on('zoom', (event) => {
                setZoomLevel(event.transform.k);
            });

        const drag = d3.drag()
            .on('start', (event) => {
                event.startRot = rotationRef.current.slice();
            })
            .on('drag', (event) => {
                const base = event.startRot || rotationRef.current;
                const k = 90 / (BASE_SCALE * zoomLevel);
                const next = [
                    base[0] + event.dx * k,
                    base[1] - event.dy * k,
                ];
                next[1] = Math.max(-90, Math.min(90, next[1]));
                rotationRef.current = next;
                const proj = createProjection(next);
                drawScene(proj);
            });

        svg.style('cursor', 'grab')
            .call(drag)
            .call(zoom);
    }, [worldData, dimensions, wordData, activeFamily, zoomLevel, pathTargetLang, showDispersion]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="map-tooltip"
                    style={{
                        position: 'fixed',
                        left: tooltip.x + 14,
                        top: tooltip.y - 10,
                        borderColor: tooltip.color,
                    }}
                >
                    <strong style={{ color: tooltip.color }}>{tooltip.name}</strong>
                    <span className="tooltip-period">{tooltip.period}</span>
                    <span className="tooltip-region">{tooltip.label}</span>
                    {tooltip.word && (
                        <span className="tooltip-word">
                            Word: <em style={{ color: tooltip.color }}>{tooltip.word}</em>
                        </span>
                    )}
                    {tooltip.noWordSearched && (
                        <span className="tooltip-hint">Search a word above to see the equivalent here</span>
                    )}
                    {tooltip.languages && (
                        <span className="tooltip-langs">{tooltip.languages.slice(0, 4).join(', ')}</span>
                    )}
                </div>
            )}

            {/* Map legend */}
            <div className="map-legend">
                <div className="map-legend-title">Migration routes from PIE</div>
                <div className="map-legend-item">
                    <svg width="26" height="8"><line x1="0" y1="4" x2="22" y2="4" stroke="#FFD700" strokeWidth="1.5" markerEnd="url(#map-arrow)" /></svg>
                    <span>Spread</span>
                </div>
            </div>
        </div>
    );
}
function getWordForLanguage(query, wordData) {
    if (!wordData) return null;

    // Collect all words from various sources in wordData
    const allWords = [];
    if (wordData.etymologyChain) allWords.push(...wordData.etymologyChain);
    if (wordData.staticEntry?.chain) allWords.push(...wordData.staticEntry.chain);
    if (wordData.apiCognates) allWords.push(...wordData.apiCognates);

    // Check for PIE root directly
    if (query === 'pie' || query === 'ine-pro') {
        return wordData.staticEntry?.pieRoot || allWords.find(n => n.lang === 'ine-pro')?.word || null;
    }

    // Direct language match (e.g., 'fr', 'en')
    const langMatch = allWords.find(n => n.lang === query);
    if (langMatch) return langMatch.word;

    // Family match (fallback for family centers, e.g., 'italic')
    const familyMatch = allWords.find(n => n.family === query);
    if (familyMatch) return familyMatch.word;

    return null;
}

export { FAMILY_COLORS, IE_LOCATIONS };
