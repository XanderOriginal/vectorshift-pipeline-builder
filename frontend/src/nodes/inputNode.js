import { useState } from 'react';
import { BaseNode } from './baseNode';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  return (
    <BaseNode id={id} title="Input" nodeType="customInput" outputs={[{ id: 'value' }]}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Name</label>
        <input style={inputStyle} value={currName} onChange={e => setCurrName(e.target.value)} />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Type</label>
        <select style={inputStyle} value={inputType} onChange={e => setInputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};

const fieldStyle = { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 };
const labelStyle = { fontSize: 11, color: '#00e5ff', minWidth: 36 };
const inputStyle = {
  flex: 1, background: '#0d1117', border: '1px solid #00ff8844',
  borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: '3px 7px',
};