import { useState, useEffect, useCallback } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const ALL_NODES = [
  { type: 'customInput', label: 'Input', desc: 'Pipeline entry point' },
  { type: 'customOutput', label: 'Output', desc: 'Pipeline exit point' },
  { type: 'llm', label: 'LLM', desc: 'Language model processor' },
  { type: 'text', label: 'Text', desc: 'Text with {{variables}}' },
  { type: 'api', label: 'API Call', desc: 'HTTP request to external API' },
  { type: 'filter', label: 'Filter', desc: 'Route data by condition' },
  { type: 'merge', label: 'Merge', desc: 'Combine two streams' },
  { type: 'transform', label: 'Transform', desc: 'Apply JS transformation' },
  { type: 'note', label: 'Note', desc: 'Canvas annotation' },
];

const selector = (state) => ({ getNodeID: state.getNodeID, addNode: state.addNode });

export const Spotlight = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { getNodeID, addNode } = useStore(selector, shallow);


  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === ' ') {
        e.preventDefault();
        setOpen(o => !o);
        setQuery('');
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const spawnNode = useCallback((type) => {
    const nodeID = getNodeID(type);
    addNode({
      id: nodeID,
      type,
      position: { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 50 },
      data: { id: nodeID, nodeType: type },
    });
    setOpen(false);
    setQuery('');
  }, [getNodeID, addNode]);

  const filtered = ALL_NODES.filter(n =>
    n.label.toLowerCase().includes(query.toLowerCase()) ||
    n.desc.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0d1117',
          border: '1px solid #00ff88',
          borderRadius: 14,
          width: 480,
          boxShadow: '0 0 40px rgba(0,255,136,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Search input */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #00ff8822' }}>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search nodes..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e0e0e0',
              fontSize: 16,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Results */}
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {filtered.map((n, i) => (
            <div
              key={n.type}
              onClick={() => spawnNode(n.type)}
              style={{
                padding: '10px 18px',
                cursor: 'pointer',
                borderBottom: '1px solid #00ff8811',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#00ff8810'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{
                background: '#00ff8820',
                border: '1px solid #00ff8844',
                borderRadius: 6,
                padding: '3px 10px',
                fontSize: 11,
                color: '#00ff88',
                minWidth: 72,
                textAlign: 'center',
              }}>
                {n.label}
              </span>
              <span style={{ fontSize: 13, color: '#aaa' }}>{n.desc}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: '#555', fontSize: 13 }}>
              No nodes found
            </div>
          )}
        </div>

        <div style={{ padding: '8px 18px', fontSize: 11, color: '#444', borderTop: '1px solid #00ff8811' }}>
          Press <kbd style={{ color: '#00ff88' }}>Enter</kbd> to add · <kbd style={{ color: '#00ff88' }}>Esc</kbd> to close
        </div>
        
      </div>
    </div>

  );
};