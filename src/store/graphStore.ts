import { create } from 'zustand'
import { applyNodeChanges, applyEdgeChanges } from 'reactflow'
import type { Edge, NodeChange, EdgeChange } from 'reactflow'
import type { VizzyNode } from '../blocks/types'

interface GraphState {
  nodes: VizzyNode[]
  edges: Edge[]
  setNodes: (nodes: VizzyNode[]) => void
  setEdges: (edges: Edge[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  addNode: (node: VizzyNode) => void
  removeNode: (id: string) => void
  addEdge: (edge: Edge) => void
  removeEdge: (id: string) => void
  updateNodeData: (id: string, data: VizzyNode['data']) => void
  loadTemplate: (nodes: VizzyNode[], edges: Edge[]) => void
  reset: () => void
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as VizzyNode[],
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
    })),

  addEdge: (edge) =>
    set((state) => ({ edges: [...state.edges, edge] })),

  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
    })),

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, data } : n)),
    })),

  loadTemplate: (nodes, edges) => set({ nodes, edges }),

  reset: () => set({ nodes: [], edges: [] }),
}))
