import { useState } from 'react';
import { BaseNode } from './baseNode';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  return (
    <BaseNode id={id} title="Output" nodeType="customOutput" inputs={[{ id: 'value' }]}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Name</label>
        <input style={inputStyle} value={currName} onChange={e => setCurrName(e.target.value)} />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Type</label>
        <select style={inputStyle} value={outputType} onChange={e => setOutputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
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