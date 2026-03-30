import { describe, it, expect, beforeEach } from 'vitest'
import type { Edge } from 'reactflow'
import { useGraphStore } from './graphStore'
import type { VizzyNode } from '../blocks/types'

const makeNode = (id: string): VizzyNode => ({
  id,
  type: 'vizzyBlock',
  position: { x: 0, y: 0 },
  data: { type: 'route', data: { method: 'GET', path: '/test' } },
})

const makeEdge = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
})

beforeEach(() => {
  useGraphStore.setState({ nodes: [], edges: [] })
})

describe('graphStore', () => {
  describe('addNode', () => {
    it('adds a node to the store', () => {
      useGraphStore.getState().addNode(makeNode('n1'))
      expect(useGraphStore.getState().nodes).toHaveLength(1)
      expect(useGraphStore.getState().nodes[0].id).toBe('n1')
    })

    it('does not mutate existing nodes array (immutable)', () => {
      const before = useGraphStore.getState().nodes
      useGraphStore.getState().addNode(makeNode('n1'))
      const after = useGraphStore.getState().nodes
      expect(after).not.toBe(before)
    })
  })

  describe('removeNode', () => {
    it('removes the node by id', () => {
      useGraphStore.getState().addNode(makeNode('n1'))
      useGraphStore.getState().addNode(makeNode('n2'))
      useGraphStore.getState().removeNode('n1')
      expect(useGraphStore.getState().nodes).toHaveLength(1)
      expect(useGraphStore.getState().nodes[0].id).toBe('n2')
    })

    it('also removes edges connected to the deleted node', () => {
      useGraphStore.getState().addNode(makeNode('n1'))
      useGraphStore.getState().addNode(makeNode('n2'))
      useGraphStore.getState().addEdge(makeEdge('e1', 'n1', 'n2'))
      useGraphStore.getState().removeNode('n1')
      expect(useGraphStore.getState().edges).toHaveLength(0)
    })
  })

  describe('addEdge', () => {
    it('adds an edge to the store', () => {
      useGraphStore.getState().addEdge(makeEdge('e1', 'n1', 'n2'))
      expect(useGraphStore.getState().edges).toHaveLength(1)
    })

    it('does not mutate existing edges array (immutable)', () => {
      const before = useGraphStore.getState().edges
      useGraphStore.getState().addEdge(makeEdge('e1', 'n1', 'n2'))
      const after = useGraphStore.getState().edges
      expect(after).not.toBe(before)
    })
  })

  describe('removeEdge', () => {
    it('removes the edge by id', () => {
      useGraphStore.getState().addEdge(makeEdge('e1', 'n1', 'n2'))
      useGraphStore.getState().addEdge(makeEdge('e2', 'n2', 'n3'))
      useGraphStore.getState().removeEdge('e1')
      expect(useGraphStore.getState().edges).toHaveLength(1)
      expect(useGraphStore.getState().edges[0].id).toBe('e2')
    })
  })

  describe('loadTemplate', () => {
    it('replaces nodes and edges with the template contents', () => {
      useGraphStore.getState().addNode(makeNode('old-node'))
      const newNodes = [makeNode('template-node')]
      const newEdges = [makeEdge('template-edge', 'a', 'b')]
      useGraphStore.getState().loadTemplate(newNodes, newEdges)
      expect(useGraphStore.getState().nodes).toHaveLength(1)
      expect(useGraphStore.getState().nodes[0].id).toBe('template-node')
      expect(useGraphStore.getState().edges[0].id).toBe('template-edge')
    })
  })

  describe('updateNodeData', () => {
    it('updates data on the matching node', () => {
      useGraphStore.getState().addNode(makeNode('n1'))
      const newData: VizzyNode['data'] = { type: 'route', data: { method: 'POST', path: '/users' } }
      useGraphStore.getState().updateNodeData('n1', newData)
      const updated = useGraphStore.getState().nodes[0]
      expect(updated.data).toEqual(newData)
    })

    it('does not mutate the original nodes array (immutable)', () => {
      useGraphStore.getState().addNode(makeNode('n1'))
      const before = useGraphStore.getState().nodes
      const newData: VizzyNode['data'] = { type: 'route', data: { method: 'DELETE', path: '/items' } }
      useGraphStore.getState().updateNodeData('n1', newData)
      const after = useGraphStore.getState().nodes
      expect(after).not.toBe(before)
    })

    it('leaves other nodes unchanged', () => {
      useGraphStore.getState().addNode(makeNode('n1'))
      useGraphStore.getState().addNode(makeNode('n2'))
      const newData: VizzyNode['data'] = { type: 'route', data: { method: 'PUT', path: '/foo' } }
      useGraphStore.getState().updateNodeData('n1', newData)
      expect(useGraphStore.getState().nodes[1].data).toEqual(makeNode('n2').data)
    })
  })

  describe('reset', () => {
    it('clears nodes and edges to empty arrays', () => {
      useGraphStore.getState().addNode(makeNode('n1'))
      useGraphStore.getState().addEdge(makeEdge('e1', 'n1', 'n2'))
      useGraphStore.getState().reset()
      expect(useGraphStore.getState().nodes).toHaveLength(0)
      expect(useGraphStore.getState().edges).toHaveLength(0)
    })
  })
})
