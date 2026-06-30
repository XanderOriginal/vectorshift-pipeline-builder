import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { useState } from 'react';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  setRunning: state.setRunning,
});

export const SubmitButton = () => {
  const { nodes, edges, setRunning } = useStore(selector, shallow);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      setResult({ error: 'Canvas is empty. Add some nodes first.' });
      return;
    }
    if (!nodes.some(n => n.type === 'customInput')) {
      setResult({ error: 'Pipeline needs at least one Input node.' });
      return;
    }
    if (!nodes.some(n => n.type === 'customOutput')) {
      setResult({ error: 'Pipeline needs at least one Output node.' });
      return;
    }

    setLoading(true);
    // Start edge animation
    setRunning(true);

    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: nodes.map(n => ({ id: n.id })),
          edges: edges.map(e => ({ source: e.source, target: e.target })),
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      alert('Backend not reachable. Make sure uvicorn is running.');
    }

    // Stop animation after result
    setTimeout(() => setRunning(false), 3000);
    setLoading(false);
  };

  return (
    <>
      {result && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          {result.error ? (
            <div style={{
              background: '#0d1117', border: '1px solid #ef4444',
              borderRadius: 16, padding: '36px 48px',
              boxShadow: '0 0 40px rgba(239,68,68,0.3)',
              textAlign: 'center', minWidth: 320,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#ef4444', marginBottom: 16, letterSpacing: 2 }}>
                ⚠ VALIDATION ERROR
              </div>
              <div style={{ color: '#aaa', fontSize: 14, marginBottom: 24 }}>{result.error}</div>
              <button onClick={() => setResult(null)} style={{
                background: 'transparent', border: '1px solid #ef4444',
                color: '#ef4444', borderRadius: 8, padding: '8px 28px',
                cursor: 'pointer', fontSize: 13, letterSpacing: 1,
              }}>CLOSE</button>
            </div>
          ) : (
            <div style={{
              background: '#0d1117', border: '1px solid #00ff88',
              borderRadius: 16, padding: '36px 48px',
              boxShadow: '0 0 40px rgba(0,255,136,0.3)',
              textAlign: 'center', minWidth: 320,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#00ff88', marginBottom: 24, letterSpacing: 2 }}>
                PIPELINE ANALYSIS
              </div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 24 }}>
                <Stat label="Nodes" value={result.num_nodes} />
                <Stat label="Edges" value={result.num_edges} />
              </div>
              <div style={{
                padding: '10px 20px', borderRadius: 8,
                background: result.is_dag ? '#00ff8820' : '#ff004420',
                border: `1px solid ${result.is_dag ? '#00ff88' : '#ff0044'}`,
                color: result.is_dag ? '#00ff88' : '#ff0044',
                fontWeight: 700, fontSize: 15, marginBottom: 28,
              }}>
                {result.is_dag ? '✓ Valid DAG — No cycles detected' : '✗ Not a DAG — Cycle detected'}
              </div>
              <button onClick={() => setResult(null)} style={{
                background: 'transparent', border: '1px solid #00ff88',
                color: '#00ff88', borderRadius: 8, padding: '8px 28px',
                cursor: 'pointer', fontSize: 13, letterSpacing: 1,
              }}>CLOSE</button>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0', background: '#0d1117' }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading ? '#1a1a2e' : 'linear-gradient(90deg, #00ff88, #00e5ff)',
            color: '#060910', border: 'none', borderRadius: 10,
            padding: '12px 48px', fontWeight: 700, fontSize: 15,
            letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            boxShadow: loading ? 'none' : '0 0 20px rgba(0,255,136,0.4)',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Analyzing...' : 'Submit Pipeline'}
        </button>
      </div>
    </>
  );
};

const Stat = ({ label, value }) => (
  <div style={{
    background: '#1a1a2e', border: '1px solid #00ff8844',
    borderRadius: 10, padding: '12px 24px', minWidth: 80,
  }}>
    <div style={{ fontSize: 28, fontWeight: 700, color: '#00e5ff' }}>{value}</div>
    <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, letterSpacing: 1 }}>{label}</div>
  </div>
);