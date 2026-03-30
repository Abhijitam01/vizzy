import { useCallback, useRef } from 'react'
import { useGraphStore } from '../store/graphStore'
import { usePreviewStore } from '../store/previewStore'
import { walkChain } from '../codegen/generator'
import { Tooltip } from '../ui/Tooltip'

const BLOCK_DELAY_MS = 600

export function PreviewRunner() {
  const requestState = usePreviewStore((s) => s.requestState)
  const setRequestState = usePreviewStore((s) => s.setRequestState)
  const setActiveBlock = usePreviewStore((s) => s.setActiveBlock)
  const markBlockPassed = usePreviewStore((s) => s.markBlockPassed)
  const reset = usePreviewStore((s) => s.reset)
  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const runPreview = useCallback(() => {
    const chain = walkChain(nodes, edges)
    if (chain.length === 0) return

    clearTimeouts()
    reset()
    setRequestState('running')

    chain.forEach((node, index) => {
      const activateAt = index * BLOCK_DELAY_MS
      const passAt = activateAt + BLOCK_DELAY_MS * 0.7

      const activateTimeout = setTimeout(() => {
        setRequestState('at-block')
        setActiveBlock(node.id)
      }, activateAt)

      const passTimeout = setTimeout(() => {
        markBlockPassed(node.id)
        setActiveBlock(null)
      }, passAt)

      timeoutsRef.current.push(activateTimeout, passTimeout)
    })

    const doneAt = chain.length * BLOCK_DELAY_MS
    const doneTimeout = setTimeout(() => {
      setRequestState('done')
      setActiveBlock(null)
    }, doneAt)

    const resetTimeout = setTimeout(() => {
      reset()
    }, doneAt + 1500)

    timeoutsRef.current.push(doneTimeout, resetTimeout)
  }, [nodes, edges, clearTimeouts, reset, setRequestState, setActiveBlock, markBlockPassed])

  const isRunning = requestState === 'running' || requestState === 'at-block'
  const isDone = requestState === 'done'

  const chain = walkChain(nodes, edges)
  const canRun = chain.length >= 2

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {isDone && (
        <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>
          ✓ Request completed
        </span>
      )}
      <Tooltip text="Simulate a request traveling through your route. Blocks light up as it passes through.">
        <button
          onClick={isRunning ? () => { clearTimeouts(); reset() } : runPreview}
          disabled={!canRun}
          data-testid="run-button"
          style={{
            background: isRunning ? '#DC2626' : canRun ? '#059669' : '#9CA3AF',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '7px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: canRun ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {isRunning ? '■ Stop' : '▶ Run'}
        </button>
      </Tooltip>
    </div>
  )
}
