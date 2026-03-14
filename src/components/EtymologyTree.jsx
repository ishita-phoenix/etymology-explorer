import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import pieRoots from '../data/pieRoots.json';

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
    pie: 'Proto-Indo-European',
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

function buildGraphData(etymologyChain, staticData, wordKey) {
    const nodes = [];
    const links = [];
    const nodeMap = {};

    // Build primary chain from API data
    if (etymologyChain && etymologyChain.length > 0) {
        etymologyChain.forEach((node, i) => {
            const id = `${node.lang}-${node.word}`;
            if (!nodeMap[id]) {
                const n = {
                    id,
                    ...node,
                    isChain: true,
                    isPIE: node.lang === 'ine-pro',
                    isTarget: i === etymologyChain.length - 1,
                };
                nodes.push(n);
                nodeMap[id] = n;
            }
            if (i > 0) {
                const prevId = `${etymologyChain[i - 1].lang}-${etymologyChain[i - 1].word}`;
                links.push({
                    source: prevId,
                    target: id,
                    isBorrowed: node.isBorrowed,
                });
            }
        });
    }

    // Add cognates from static DB
    const staticEntry = staticData[wordKey];

    if (staticEntry) {
        // If we don't have a chain from API, use static
        if (!etymologyChain || etymologyChain.length === 0) {
            staticEntry.chain.forEach((node, i) => {
                const id = `${node.lang}-${node.word}`;
                if (!nodeMap[id]) {
                    const n = {
                        id,
                        ...node,
                        isChain: true,
                        isPIE: node.lang === 'ine-pro',
                        isTarget: i === staticEntry.chain.length - 1,
                    };
                    nodes.push(n);
                    nodeMap[id] = n;
                }
                if (i > 0) {
                    const prev = staticEntry.chain[i - 1];
                    const prevId = `${prev.lang}-${prev.word}`;
                    links.push({ source: prevId, target: id, isBorrowed: false });
                }
            });
        }

        // Add cognates as side branches
        const rootNode = nodes.find(n => n.isPIE) || nodes[0];
        if (rootNode && staticEntry.cognates) {
            staticEntry.cognates.forEach((cog) => {
                const id = `cog-${cog.lang}-${cog.word}`;
                if (!nodeMap[id]) {
                    const n = {
                        id,
                        lang: cog.lang,
                        langName: cog.langName,
                        word: cog.word,
                        family: cog.family,
                        date: 1600,
                        isChain: false,
                        isCognate: true,
                        isPIE: false,
                        isTarget: false,
                    };
                    nodes.push(n);
                    nodeMap[id] = n;
                    links.push({ source: rootNode.id, target: id, isCognate: true });
                }
            });
        }
    }

    return { nodes, links };
}

export default function EtymologyTree({ etymologyChain, word, onNodeClick, selectedNode }) {
    const svgRef = useRef(null);
    const simRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    const wordKey = word?.toLowerCase();
    const graphData = buildGraphData(etymologyChain, pieRoots, wordKey);

    useEffect(() => {
        const updateDimensions = () => {
            const container = svgRef.current?.parentElement;
            if (container) {
                setDimensions({
                    width: container.clientWidth,
                    height: container.clientHeight,
                });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!svgRef.current || graphData.nodes.length === 0) return;

        const { width, height } = dimensions;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        // Defs for glow filter and arrowhead
        const defs = svg.append('defs');

        const glow = defs.append('filter').attr('id', 'glow');
        glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
        const feMerge = glow.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        defs.append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 18)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .append('path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#475569')
            .style('stroke', 'none');

        const zoom = d3.zoom()
            .scaleExtent([0.3, 3])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });
        svg.call(zoom);

        const g = svg.append('g');

        // Separate chain nodes and cognate nodes for layout
        const chainNodes = graphData.nodes.filter(n => n.isChain);
        const cognateNodes = graphData.nodes.filter(n => n.isCognate);

        // Position chain nodes along a horizontal backbone
        if (chainNodes.length > 0) {
            chainNodes.sort((a, b) => (a.date || 0) - (b.date || 0));
            const xScale = d3.scaleLinear()
                .domain([
                    d3.min(chainNodes, d => d.date) - 500,
                    d3.max(chainNodes, d => d.date) + 200
                ])
                .range([80, width - 80]);
            chainNodes.forEach(n => {
                n.fx = xScale(n.date || 0);
                n.fy = height / 2;
            });
        }

        // Unfix cognates so they float
        cognateNodes.forEach(n => {
            n.fx = undefined;
            n.fy = undefined;
            n.x = width / 2 + (Math.random() - 0.5) * 300;
            n.y = height / 2 + (Math.random() - 0.5) * 300;
        });

        if (simRef.current) simRef.current.stop();

        const simulation = d3.forceSimulation(graphData.nodes)
            .force('link', d3.forceLink(graphData.links)
                .id(d => d.id)
                .distance(d => d.isCognate ? 180 : 10)
                .strength(d => d.isCognate ? 0.05 : 1)
            )
            .force('charge', d3.forceManyBody().strength(d => d.isChain ? 0 : -260))
            .force('collide', d3.forceCollide().radius(50).strength(0.7))
            .force('y', d3.forceY(d => {
                if (d.isChain) return height / 2;
                const side = graphData.links.findIndex(l => (l.target?.id || l.target) === d.id) % 2 === 0 ? 1 : -1;
                return height / 2 + side * 160;
            }).strength(d => d.isChain ? 0 : 0.3));

        simRef.current = simulation;

        // Links
        const link = g.append('g')
            .selectAll('line')
            .data(graphData.links)
            .enter()
            .append('line')
            .attr('stroke', d => FAMILY_COLORS[d.source?.family || 'other'] || '#475569')
            .attr('stroke-opacity', 0.5)
            .attr('stroke-width', d => d.isCognate ? 1.5 : 2.5)
            .attr('stroke-dasharray', d => (d.isBorrowed || d.isCognate) ? '6,4' : null)
            .attr('marker-end', 'url(#arrowhead)');

        // Node groups
        const node = g.append('g')
            .selectAll('g')
            .data(graphData.nodes)
            .enter()
            .append('g')
            .attr('class', 'node-group')
            .style('cursor', 'pointer')
            .call(d3.drag()
                .on('start', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    if (d.isChain) return; // Don't drag chain nodes
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on('drag', (event, d) => {
                    if (d.isChain) return;
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('end', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    if (d.isChain) return;
                    d.fx = null;
                    d.fy = null;
                })
            )
            .on('click', (event, d) => {
                event.stopPropagation();
                onNodeClick && onNodeClick(d);
            });

        // Node circle
        node.append('circle')
            .attr('r', d => d.isPIE ? 28 : d.isTarget ? 22 : d.isChain ? 18 : 14)
            .attr('fill', d => {
                const col = FAMILY_COLORS[d.family] || '#94A3B8';
                return col;
            })
            .attr('fill-opacity', d => d.isPIE ? 1 : d.isChain ? 0.85 : 0.6)
            .attr('stroke', d => {
                if (selectedNode?.id === d.id) return '#fff';
                return d.isPIE ? '#FFF9C4' : 'rgba(255,255,255,0.2)';
            })
            .attr('stroke-width', d => selectedNode?.id === d.id ? 3 : d.isPIE ? 2.5 : 1.5)
            .style('filter', d => (d.isPIE || d.isTarget) ? 'url(#glow)' : null);

        // Node word label (inside circle for big nodes, below for small)
        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('dy', d => d.isChain ? 0 : 0)
            .attr('font-size', d => d.isPIE ? '9px' : d.isChain ? '8px' : '7px')
            .attr('font-family', 'Inter, sans-serif')
            .attr('font-weight', d => (d.isPIE || d.isTarget) ? '700' : '500')
            .attr('fill', d => d.isPIE ? '#1a1a1a' : '#ffffff')
            .attr('pointer-events', 'none')
            .text(d => {
                const radius = d.isPIE ? 28 : d.isChain ? 18 : 14;
                const maxChars = Math.floor(radius * 1.8);
                return d.word.length > maxChars ? d.word.slice(0, maxChars - 1) + '…' : d.word;
            });

        // Language label below node
        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', d => (d.isPIE ? 28 : d.isChain ? 18 : 14) + 14)
            .attr('font-size', '9px')
            .attr('font-family', 'Inter, sans-serif')
            .attr('fill', 'rgba(200,200,200,0.8)')
            .attr('pointer-events', 'none')
            .text(d => d.langName);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });

        // Initial zoom to fit
        svg.call(zoom.transform, d3.zoomIdentity.translate(width * 0.05, 0).scale(0.9));

        return () => {
            simulation.stop();
        };
    }, [graphData.nodes.length, graphData.links.length, dimensions, selectedNode]);

    if (graphData.nodes.length === 0) {
        return (
            <div className="empty-tree">
                <div className="empty-icon">🌳</div>
                <p>No etymology data to display</p>
            </div>
        );
    }

    return (
        <div className="tree-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <svg
                ref={svgRef}
                width={dimensions.width}
                height={dimensions.height}
                style={{ display: 'block', background: 'transparent' }}
            />
            {/* Legend */}
            <div className="legend">
                {Object.entries(FAMILY_COLORS).filter(([k]) => k !== 'other').map(([family, color]) => {
                    const isPresent = graphData.nodes.some(n => n.family === family);
                    if (!isPresent) return null;
                    return (
                        <div key={family} className="legend-item">
                            <span className="legend-dot" style={{ background: color }} />
                            <span>{FAMILY_LABELS[family]}</span>
                        </div>
                    );
                })}
            </div>
            {/* Link type legend */}
            <div className="link-legend">
                <div className="link-legend-item">
                    <svg width="30" height="10"><line x1="0" y1="5" x2="30" y2="5" stroke="#94A3B8" strokeWidth="2" /></svg>
                    <span>Inherited</span>
                </div>
                <div className="link-legend-item">
                    <svg width="30" height="10"><line x1="0" y1="5" x2="30" y2="5" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4,3" /></svg>
                    <span>Cognate / Borrowed</span>
                </div>
            </div>
        </div>
    );
}

export { FAMILY_COLORS, FAMILY_LABELS };
