import { BaseNode } from './baseNode';

export const LLMNode = ({ id }) => (
  <BaseNode id={id} title="LLM" nodeType="llm"
    inputs={[{ id: 'system', label: 'system' }, { id: 'prompt', label: 'prompt' }]}
    outputs={[{ id: 'response' }]}
  >
    <div style={{ fontSize: 12, color: '#aaa', fontStyle: 'italic', paddingLeft: 8 }}>
      Language Model
    </div>
  </BaseNode>
);