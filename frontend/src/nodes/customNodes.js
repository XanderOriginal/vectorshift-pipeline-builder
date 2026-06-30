import { useState } from 'react';
import { BaseNode } from './baseNode';

const row = { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 };
const lbl = { fontSize: 11, color: '#00e5ff', minWidth: 52 };
const inp = {
  flex: 1, background: '#0d1117', border: '1px solid #00ff8844',
  borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: '3px 7px',
};

export const ApiNode = ({ id }) => {
  const [url, setUrl] = useState('https://');
  const [method, setMethod] = useState('GET');
  return (
    <BaseNode id={id} title="API Call" nodeType="api"
      inputs={[{ id: 'body' }]}
      outputs={[{ id: 'response' }]}
    >
      <div style={row}>
        <label style={lbl}>URL</label>
        <input style={inp} value={url} onChange={e => setUrl(e.target.value)} />
      </div>
      <div style={row}>
        <label style={lbl}>Method</label>
        <select style={inp} value={method} onChange={e => setMethod(e.target.value)}>
          {['GET', 'POST', 'PUT', 'DELETE'].map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
    </BaseNode>
  );
};

export const FilterNode = ({ id }) => {
  const [condition, setCondition] = useState('value > 0');
  return (
    <BaseNode id={id} title="Filter" nodeType="filter"
      inputs={[{ id: 'data' }]}
      outputs={[{ id: 'pass', label: 'pass' }, { id: 'fail', label: 'fail' }]}
    >
      <div style={row}>
        <label style={lbl}>If</label>
        <input style={inp} value={condition} onChange={e => setCondition(e.target.value)} />
      </div>
    </BaseNode>
  );
};

export const MergeNode = ({ id }) => (
  <BaseNode id={id} title="Merge" nodeType="merge"
    inputs={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}
    outputs={[{ id: 'merged' }]}
  >
    <div style={{ fontSize: 12, color: '#aaa', fontStyle: 'italic', paddingLeft: 8 }}>
      Combines two inputs into one
    </div>
  </BaseNode>
);

export const TransformNode = ({ id }) => {
  const [script, setScript] = useState('return input.toUpperCase()');
  return (
    <BaseNode id={id} title="Transform" nodeType="transform"
      inputs={[{ id: 'input' }]}
      outputs={[{ id: 'output' }]}
    >
      <div style={row}>
        <label style={lbl}>Script</label>
        <input style={inp} value={script} onChange={e => setScript(e.target.value)} />
      </div>
    </BaseNode>
  );
};

export const NoteNode = ({ id }) => {
  const [note, setNote] = useState('Write a note...');
  return (
    <BaseNode id={id} title="Note" nodeType="note" inputs={[]} outputs={[]}>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={3}
        style={{
          width: '100%', background: '#0d1117', border: '1px solid #f5c51844',
          borderRadius: 6, color: '#e0e0e0', fontSize: 12,
          padding: '5px 8px', resize: 'none', outline: 'none',
          fontFamily: 'monospace', boxSizing: 'border-box',
        }}
      />
    </BaseNode>
  );
};