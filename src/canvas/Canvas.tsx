import { useCallback, useRef } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow'
import type { Connection, NodeMouseHandler } from 'reactflow'
import 'reactflow/dist/style.css'

import { BlockNode } from '../blocks/BlockNode'
import { useGraphStore } from '../store/graphStore'
import { usePreviewStore } from '../store/previewStore'
import { makeConnectionValidator } from '../blocks/validation'
import { BLOCK_REGISTRY } from '../blocks/registry'
import type { BlockType, VizzyNode } from '../blocks/types'

const nodeTypes = {
  vizzyBlock: BlockNode,
}

let nodeIdCounter = 1000

function makeNodeId() {
  return `node-${nodeIdCounter++}`
}

function CanvasInner() {
  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)
  const onNodesChange = useGraphStore((s) => s.onNodesChange)
  const onEdgesChange = useGraphStore((s) => s.onEdgesChange)
  const addEdgeToStore = useGraphStore((s) => s.addEdge)
  const addNode = useGraphStore((s) => s.addNode)
  const setSelectedBlock = usePreviewStore((s) => s.setSelectedBlock)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()

  const getNodeType = useCallback(
    (id: string): BlockType | undefined => {
      const node = nodes.find((n: VizzyNode) => n.id === id)
      return node?.data.type as BlockType | undefined
    },
    [nodes],
  )

  const isValidConnection = useCallback(
    makeConnectionValidator(getNodeType),
    [getNodeType],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = addEdge(connection, [])
      if (edge.length > 0) addEdgeToStore(edge[0])
    },
    [addEdgeToStore],
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const blockType = e.dataTransfer.getData('blockType') as BlockType
      if (!blockType || !BLOCK_REGISTRY[blockType]) return

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      const config = BLOCK_REGISTRY[blockType]
      const id = makeNodeId()

      const newNode: VizzyNode = {
        id,
        type: 'vizzyBlock',
        position,
        data: { type: blockType, data: config.defaultData } as VizzyNode['data'],
      }

      addNode(newNode)
    },
    [screenToFlowPosition, addNode],
  )

  const onNodeClick: NodeMouseHandler = useCallback(
    (_e, node) => {
      setSelectedBlock(node.id)
    },
    [setSelectedBlock],
  )

  const onPaneClick = useCallback(() => {
    setSelectedBlock(null)
  }, [setSelectedBlock])

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        style={{ background: '#F8FAFC' }}
      >
        <Background color="#E2E8F0" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const vizzyNode = node as VizzyNode
            switch (vizzyNode.data?.type) {
              case 'route': return '#4F46E5'
              case 'middleware': return '#059669'
              case 'handler': return '#D97706'
              case 'response': return '#DC2626'
              default: return '#9CA3AF'
            }
          }}
          style={{ background: '#F1F5F9' }}
        />
      </ReactFlow>
    </div>
  )
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  )
}
