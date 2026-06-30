import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  history: [],   // past states
  future: [],    // undone states

  isRunning: false,
  setRunning: (val) => set({ isRunning: val }),

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) newIDs[type] = 0;
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },


  snapshot: () => {
    const { nodes, edges, history } = get();
    set({ history: [...history, { nodes, edges }], future: [] });
  },

  undo: () => {
    const { history, nodes, edges, future } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      history: history.slice(0, -1),
      future: [{ nodes, edges }, ...future],
    });
  },

  redo: () => {
    const { future, nodes, edges, history } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      nodes: next.nodes,
      edges: next.edges,
      future: future.slice(1),
      history: [...history, { nodes, edges }],
    });
  },

  addNode: (node) => {
    get().snapshot();
    set({ nodes: [...get().nodes, node] });
  },

  onNodesChange: (changes) => {
    if (changes.some(c => c.type === 'remove')) get().snapshot();
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    if (changes.some(c => c.type === 'remove')) get().snapshot();
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    get().snapshot();
    set({
      edges: addEdge({
        ...connection,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' },
      }, get().edges),
    });
  },

  clearCanvas: () => {
    get().snapshot();
    set({ nodes: [], edges: [] });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },
}));