import { useEffect } from 'react';
import { DraggableNode } from './draggableNode';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const nodeList = [
    { type: 'customInput', label: 'Input' },
    { type: 'customOutput', label: 'Output' },
    { type: 'llm', label: 'LLM' },
    { type: 'text', label: 'Text' },
    { type: 'api', label: 'API Call' },
    { type: 'filter', label: 'Filter' },
    { type: 'merge', label: 'Merge' },
    { type: 'transform', label: 'Transform' },
    { type: 'note', label: 'Note' },
];

const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
    undo: state.undo,
    redo: state.redo,
    clearCanvas: state.clearCanvas,
});

const btn = (color = '#00ff88') => ({
    background: 'transparent',
    border: `1px solid ${color}44`,
    borderRadius: 8,
    color: color,
    padding: '6px 14px',
    cursor: 'pointer',
    fontSize: 12,
    letterSpacing: 1,
    whiteSpace: 'nowrap',
});

export const PipelineToolbar = () => {
    const { nodes, edges, undo, redo, clearCanvas } = useStore(selector, shallow);

    // Ctrl+Z / Ctrl+Y
    useEffect(() => {
        const handler = (e) => {
            if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
            if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo]);

    const openSpotlight = () =>
        window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: ' ', bubbles: true }));

    const exportJSON = () => {
        const data = JSON.stringify({ nodes, edges }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pipeline.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        if (nodes.length === 0) return;
        if (window.confirm('Clear the entire canvas? This can be undone with Ctrl+Z.')) {
            clearCanvas();
        }
    };

    return (
        <div style={{
            padding: '12px 20px',
            background: '#0d1117',
            borderBottom: '1px solid #00ff8833',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
        }}>
            <span style={{
                color: '#00ff88', fontWeight: 700, fontSize: 16,
                letterSpacing: 2, textTransform: 'uppercase',
                marginRight: 8, whiteSpace: 'nowrap',
            }}>
                VectorShift
            </span>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flex: 1 }}>
                {nodeList.map(n => (
                    <DraggableNode key={n.type} type={n.type} label={n.label} />
                ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
                <button style={btn()} onClick={undo} title="Ctrl+Z">↩ Undo</button>
                <button style={btn()} onClick={redo} title="Ctrl+Y">↪ Redo</button>
                <button style={btn()} onClick={openSpotlight}>⌕ Search</button>
                <button style={btn('#00e5ff')} onClick={exportJSON}>↓ Export JSON</button>
                <button style={btn('#ef4444')} onClick={handleClear}>✕ Clear</button>
            </div>
        </div>
    );
};