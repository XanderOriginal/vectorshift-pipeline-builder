import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const StatusBar = () => {
  const { nodes, edges } = useStore(selector, shallow);

  return (
    <div style={{
      position: 'fixed',
      bottom: 80,
      left: 20,
      background: '#0d1117',
      border: '1px solid #00ff8833',
      borderRadius: 8,
      padding: '6px 14px',
      display: 'flex',
      gap: 16,
      zIndex: 100,
      fontSize: 12,
      color: '#aaa',
    }}>
      <span>Nodes: <strong style={{ color: '#00ff88' }}>{nodes.length}</strong></span>
      <span style={{ color: '#333' }}>|</span>
      <span>Edges: <strong style={{ color: '#00e5ff' }}>{edges.length}</strong></span>
      <span style={{ color: '#333' }}>|</span>
      <span>
        Status: <strong style={{ color: nodes.length === 0 ? '#555' : '#00ff88' }}>
          {nodes.length === 0 ? 'Empty' : 'Active'}
        </strong>
      </span>
    </div>
  );
};