import { useUpdateNodeInternals } from 'reactflow';
import { useState, useEffect } from 'react';
import { BaseNode } from './baseNode';

const extractVariables = (text) => {
  const matches = [...text.matchAll(/\{\{(\w+)\}\}/g)];
  return [...new Set(matches.map(m => m[1]))];
};

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const updateNodeInternals = useUpdateNodeInternals();

  const variables = extractVariables(currText);
  const lineCount = currText.split('\n').length;
  const maxLineLen = Math.max(...currText.split('\n').map(l => l.length), 10);
  const nodeWidth = Math.max(220, maxLineLen * 8 + 40);
  const nodeHeight = Math.max(80, lineCount * 22 + 60);

  useEffect(() => {
    updateNodeInternals(id);
  }, [currText, id, updateNodeInternals]);

  return (
    <BaseNode
      id={id}
      title="Text"
      nodeType="text"
      inputs={variables.map(v => ({ id: v, label: v }))}
      outputs={[{ id: 'output' }]}
      style={{ width: nodeWidth, minHeight: nodeHeight }}
    >
      <textarea
        value={currText}
        onChange={e => setCurrText(e.target.value)}
        rows={Math.max(2, lineCount)}
        style={{
          width: '100%', background: '#0d1117',
          border: '1px solid #00ff8844', borderRadius: 6,
          color: '#e0e0e0', fontSize: 12, padding: '5px 8px',
          resize: 'none', outline: 'none',
          fontFamily: 'monospace', boxSizing: 'border-box',
        }}
      />
      {variables.length > 0 && (
        <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {variables.map(v => (
            <span key={v} style={{
              fontSize: 10, background: '#00ff8820',
              border: '1px solid #00ff8866', borderRadius: 4,
              padding: '1px 6px', color: '#00ff88',
            }}>
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};