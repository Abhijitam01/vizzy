import { memo, useState } from 'react'
import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { BlockData, BlockType } from './types'
import { BLOCK_REGISTRY } from './registry'
import { usePreviewStore } from '../store/previewStore'
import { useGraphStore } from '../store/graphStore'
import { Tooltip } from '../ui/Tooltip'
import { BlockEditPanel } from './BlockEditPanel'

type BlockNodeProps = NodeProps<BlockData>

export const BlockNode = memo(function BlockNode({ id, data }: BlockNodeProps) {
  const { type } = data
  const config = BLOCK_REGISTRY[type as BlockType]
  const activeBlockId = usePreviewStore((s) => s.activeBlockId)
  const passedBlockIds = usePreviewStore((s) => s.passedBlockIds)
  const updateNodeData = useGraphStore((s) => s.updateNodeData)
  const [isEditing, setIsEditing] = useState(false)

  const isActive = activeBlockId === id
  const isPassed = passedBlockIds.includes(id)

  const borderColor = isActive
    ? '#F59E0B'
    : isPassed
    ? config.color
    : '#E5E7EB'

  const boxShadow = isActive
    ? `0 0 0 3px #FDE68A, 0 4px 16px rgba(0,0,0,0.12)`
    : isPassed
    ? `0 0 0 2px ${config.color}40, 0 2px 8px rgba(0,0,0,0.08)`
    : '0 2px 8px rgba(0,0,0,0.08)'

  return (
    <Tooltip text={config.tooltip}>
      <div
        style={{
          background: config.bgColor,
          border: `2px solid ${borderColor}`,
          borderRadius: 10,
          padding: '10px 14px',
          minWidth: 180,
          position: 'relative',
          boxShadow,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
        }}
        data-testid={`block-${type}`}
        onClick={() => setIsEditing(true)}
      >
        {/* Input handle */}
        {config.ports.inputs.length > 0 && (
          <Handle
            type="target"
            position={Position.Top}
            id="in"
            style={{
              background: config.color,
              width: 10,
              height: 10,
              border: '2px solid white',
            }}
          />
        )}

        {/* Block header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: config.color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: config.color,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {config.label}
          </span>
        </div>

        {/* Block data summary */}
        <BlockDataSummary data={data} />

        {/* Edit button */}
        <div
          style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); setIsEditing(true) }}
        >
          click to edit
        </div>

        {/* Inline edit panel */}
        {isEditing && (
          <BlockEditPanel
            data={data}
            onSave={(saved) => updateNodeData(id, saved)}
            onClose={() => setIsEditing(false)}
          />
        )}

        {/* Output handle */}
        {config.ports.outputs.length > 0 && (
          <Handle
            type="source"
            position={Position.Bottom}
            id="next"
            style={{
              background: config.color,
              width: 10,
              height: 10,
              border: '2px solid white',
            }}
          />
        )}
      </div>
    </Tooltip>
  )
})

function BlockDataSummary({ data }: { data: BlockData }) {
  const style: React.CSSProperties = {
    fontSize: 12,
    color: '#374151',
    marginTop: 6,
    fontFamily: 'monospace',
  }

  if (data.type === 'route') {
    return (
      <div style={style}>
        <strong>{data.data.method}</strong> {data.data.path}
      </div>
    )
  }
  if (data.type === 'middleware' || data.type === 'handler') {
    return <div style={style}>{data.data.name}()</div>
  }
  if (data.type === 'response') {
    return (
      <div style={style}>
        {data.data.status} · {data.data.body.slice(0, 24)}{data.data.body.length > 24 ? '…' : ''}
      </div>
    )
  }
  return null
}
