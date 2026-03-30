import { BLOCK_REGISTRY } from '../blocks/registry'
import type { BlockType } from '../blocks/types'

const BLOCK_TYPES: BlockType[] = ['route', 'middleware', 'handler', 'response']

export function BlockPalette() {
  const onDragStart = (e: React.DragEvent, blockType: BlockType) => {
    e.dataTransfer.setData('blockType', blockType)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      style={{
        width: 80,
        flexShrink: 0,
        borderRight: '1px solid #E5E7EB',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0',
        gap: 8,
        overflowY: 'auto',
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: '#9CA3AF',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        Blocks
      </span>
      {BLOCK_TYPES.map((type) => {
        const config = BLOCK_REGISTRY[type]
        return (
          <div
            key={type}
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            title={`Drag to add ${config.label} block`}
            style={{
              width: 56,
              padding: '8px 4px',
              background: config.bgColor,
              border: `2px solid ${config.color}`,
              borderRadius: 8,
              cursor: 'grab',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: config.color,
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: config.color,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              {config.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
