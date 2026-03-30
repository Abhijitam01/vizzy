import { useMemo, useState, useRef } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { useGraphStore } from '../store/graphStore'
import { usePreviewStore } from '../store/previewStore'
import { generateCode } from '../codegen/generator'
import { exportServerFiles } from '../export/exportUtils'

function parseBlockLineRanges(codeLines: string[]): Map<string, [number, number]> {
  const ranges = new Map<string, [number, number]>()
  const MARKER = /\/\/ \[block:([^\]]+)\]/

  let currentId: string | null = null
  let startLine = 0

  for (let i = 0; i < codeLines.length; i++) {
    const match = codeLines[i].match(MARKER)
    if (match) {
      if (currentId !== null) {
        ranges.set(currentId, [startLine, i - 1])
      }
      currentId = match[1]
      startLine = i
    }
  }
  if (currentId !== null) {
    ranges.set(currentId, [startLine, codeLines.length - 1])
  }
  return ranges
}

export function CodePanel() {
  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)
  const selectedBlockId = usePreviewStore((s) => s.selectedBlockId)
  const [exported, setExported] = useState(false)
  const [copied, setCopied] = useState(false)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const code = useMemo(() => generateCode(nodes, edges), [nodes, edges])

  const handleExport = () => {
    exportServerFiles(code, () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      setExported(true)
      toastTimerRef.current = setTimeout(() => setExported(false), 3000)
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      setCopied(true)
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#0F172A',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid #1E293B',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.05em' }}>
          server.js
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {exported && (
            <span style={{ fontSize: 12, color: '#4ADE80', fontWeight: 600 }}>
              ✓ Downloaded! Run: npm install && node server.js
            </span>
          )}
          <button
            onClick={handleCopy}
            data-testid="copy-button"
            style={{
              background: 'transparent',
              color: copied ? '#4ADE80' : '#94A3B8',
              border: '1px solid #1E293B',
              borderRadius: 6,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleExport}
            data-testid="export-button"
            style={{
              background: '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#4338CA' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#4F46E5' }}
          >
            Export
          </button>
        </div>
      </div>

      {/* Code */}
      <div style={{ overflow: 'auto', flex: 1, padding: '12px 0' }}>
        <Highlight theme={themes.oneDark} code={code} language="javascript">
          {({ className, style, tokens, getLineProps, getTokenProps }) => {
            const blockRanges = parseBlockLineRanges(code.split('\n'))
            const highlightRange = selectedBlockId ? blockRanges.get(selectedBlockId) : undefined

            return (
              <pre
                className={className}
                style={{
                  ...style,
                  margin: 0,
                  padding: '0 16px',
                  background: 'transparent',
                  fontSize: 12,
                  lineHeight: 1.7,
                  fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                }}
              >
                {tokens.map((line, i) => {
                  const isHighlighted = highlightRange !== undefined && i >= highlightRange[0] && i <= highlightRange[1]
                  return (
                    <div
                      key={i}
                      {...getLineProps({ line })}
                      style={{
                        background: isHighlighted ? 'rgba(79, 70, 229, 0.18)' : undefined,
                        borderLeft: isHighlighted ? '3px solid #4F46E5' : '3px solid transparent',
                        paddingLeft: isHighlighted ? 4 : 4,
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          width: 32,
                          color: '#4B5563',
                          userSelect: 'none',
                          textAlign: 'right',
                          marginRight: 16,
                          fontSize: 11,
                        }}
                      >
                        {i + 1}
                      </span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  )
                })}
              </pre>
            )
          }}
        </Highlight>
      </div>
    </div>
  )
}
