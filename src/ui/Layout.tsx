import { useGraphStore } from '../store/graphStore'
import { Canvas } from '../canvas/Canvas'
import { BlockPalette } from '../canvas/BlockPalette'
import { TemplateLoader } from '../canvas/TemplateLoader'
import { CodePanel } from '../codepanel/CodePanel'
import { PreviewRunner } from '../preview/PreviewRunner'

export function Layout() {
  const nodes = useGraphStore((s) => s.nodes)
  const reset = useGraphStore((s) => s.reset)
  const showTemplateLoader = nodes.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          height: 48,
          background: 'white',
          borderBottom: '1px solid #E5E7EB',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#4F46E5', letterSpacing: '-0.02em' }}>
            vizzy
          </span>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>
            visual Express builder
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PreviewRunner />
          {nodes.length > 0 && (
            <button
              onClick={reset}
              data-testid="reset-button"
              style={{
                background: 'transparent',
                color: '#6B7280',
                border: '1px solid #E5E7EB',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          )}
        </div>
      </header>

      {/* Main pane: palette | canvas | code */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Block palette */}
        <BlockPalette />

        {/* Canvas */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Canvas />
          {showTemplateLoader && <TemplateLoader />}
        </div>

        {/* Code panel */}
        <div
          style={{
            width: 420,
            flexShrink: 0,
            borderLeft: '1px solid #1E293B',
            overflow: 'hidden',
          }}
        >
          <CodePanel />
        </div>
      </div>
    </div>
  )
}
