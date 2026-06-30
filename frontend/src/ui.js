import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { ApiNode, FilterNode, MergeNode, TransformNode, NoteNode } from './nodes/customNodes';
import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: ApiNode,
  filter: FilterNode,
  merge: MergeNode,
  transform: TransformNode,
  note: NoteNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  isRunning: state.isRunning,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [validationMsg, setValidationMsg] = useState(null);
  const {
    nodes, edges, getNodeID, addNode,
    onNodesChange, onEdgesChange, onConnect,
    isRunning,
  } = useStore(selector, shallow);

  const showToast = (msg, color = '#ff4466') => {
    setValidationMsg({ msg, color });
    setTimeout(() => setValidationMsg(null), 2500);
  };

  const isValidConnection = useCallback((connection) => {
    const { source, target, sourceHandle, targetHandle } = connection;

    if (source === target) {
      showToast('⚠ Cannot connect a node to itself');
      return false;
    }

    const duplicate = edges.find(
      e => e.source === source && e.target === target &&
           e.sourceHandle === sourceHandle && e.targetHandle === targetHandle
    );
    if (duplicate) {
      showToast('⚠ Connection already exists');
      return false;
    }

    if (source.startsWith('customOutput')) {
      showToast('⚠ Output node cannot be a source');
      return false;
    }

    if (target.startsWith('customInput')) {
      showToast('⚠ Input node cannot be a target');
      return false;
    }

    return true;
  }, [edges]);

  const handleConnect = useCallback((connection) => {
    showToast('✓ Connected!', '#00ff88');
    onConnect(connection);
  }, [onConnect]);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
    const type = appData?.nodeType;
    if (!type) return;

    const position = reactFlowInstance.project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    const nodeID = getNodeID(type);
    addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
  }, [reactFlowInstance, addNode, getNodeID]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const animatedEdges = isRunning
    ? edges.map(e => ({
        ...e,
        style: { stroke: '#00ff88', strokeWidth: 2.5 },
        animated: true,
      }))
    : edges;

  return (
    <div ref={reactFlowWrapper} style={{ width: '100vw', height: '70vh', position: 'relative' }}>
      {validationMsg && (
        <div style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0d1117',
          border: `1px solid ${validationMsg.color}`,
          color: validationMsg.color,
          borderRadius: 8,
          padding: '8px 20px',
          fontSize: 13,
          fontWeight: 600,
          zIndex: 500,
          boxShadow: `0 0 16px ${validationMsg.color}44`,
          pointerEvents: 'none',
        }}>
          {validationMsg.msg}
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={animatedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep'
        isValidConnection={isValidConnection}
      >
        <Background color="#00ff8822" gap={gridSize} />
        <Controls style={{ button: { background: '#1a1a2e', color: '#00ff88' } }} />
        <MiniMap
          nodeColor={() => '#00ff88'}
          maskColor="rgba(0,0,0,0.6)"
          style={{ background: '#0d1117', border: '1px solid #00ff8844' }}
        />
      </ReactFlow>
    </div>
  );
};