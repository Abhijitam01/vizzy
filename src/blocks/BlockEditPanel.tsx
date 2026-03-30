import { useState } from 'react'
import type { BlockData, RouteData, MiddlewareData, HandlerData, ResponseData } from './types'

interface BlockEditPanelProps {
  data: BlockData
  onSave: (data: BlockData) => void
  onClose: () => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '5px 8px',
  fontSize: 12,
  border: '1px solid #D1D5DB',
  borderRadius: 4,
  fontFamily: 'monospace',
  background: '#F9FAFB',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#6B7280',
  marginBottom: 3,
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const fieldStyle: React.CSSProperties = {
  marginBottom: 10,
}

export function BlockEditPanel({ data, onSave, onClose }: BlockEditPanelProps) {
  const [draft, setDraft] = useState<BlockData>(data)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(draft)
    onClose()
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '110%',
        left: 0,
        zIndex: 100,
        background: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        padding: '12px 14px',
        width: 220,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <form onSubmit={handleSave}>
        {draft.type === 'route' && (
          <RouteFields data={draft.data} onChange={(d) => setDraft({ type: 'route', data: d })} />
        )}
        {draft.type === 'middleware' && (
          <MiddlewareFields data={draft.data} onChange={(d) => setDraft({ type: 'middleware', data: d })} />
        )}
        {draft.type === 'handler' && (
          <HandlerFields data={draft.data} onChange={(d) => setDraft({ type: 'handler', data: d })} />
        )}
        {draft.type === 'response' && (
          <ResponseFields data={draft.data} onChange={(d) => setDraft({ type: 'response', data: d })} />
        )}

        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <button
            type="submit"
            style={{
              flex: 1,
              background: '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '5px 0',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              background: '#F3F4F6',
              color: '#374151',
              border: '1px solid #E5E7EB',
              borderRadius: 4,
              padding: '5px 0',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function RouteFields({ data, onChange }: { data: RouteData; onChange: (d: RouteData) => void }) {
  return (
    <>
      <div style={fieldStyle}>
        <label style={labelStyle}>Method</label>
        <select
          value={data.method}
          onChange={(e) => onChange({ ...data, method: e.target.value as RouteData['method'] })}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {(['GET', 'POST', 'PUT', 'DELETE'] as const).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Path</label>
        <input
          type="text"
          value={data.path}
          onChange={(e) => onChange({ ...data, path: e.target.value })}
          style={inputStyle}
          placeholder="/api/example"
          autoFocus
        />
      </div>
    </>
  )
}

function MiddlewareFields({ data, onChange }: { data: MiddlewareData; onChange: (d: MiddlewareData) => void }) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>Function name</label>
      <input
        type="text"
        value={data.name}
        onChange={(e) => onChange({ ...data, name: e.target.value })}
        style={inputStyle}
        placeholder="myMiddleware"
        autoFocus
      />
    </div>
  )
}

function HandlerFields({ data, onChange }: { data: HandlerData; onChange: (d: HandlerData) => void }) {
  return (
    <>
      <div style={fieldStyle}>
        <label style={labelStyle}>Function name</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          style={inputStyle}
          placeholder="myHandler"
          autoFocus
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Body</label>
        <textarea
          value={data.body}
          onChange={(e) => onChange({ ...data, body: e.target.value })}
          style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
          placeholder="// your logic here"
        />
      </div>
    </>
  )
}

function ResponseFields({ data, onChange }: { data: ResponseData; onChange: (d: ResponseData) => void }) {
  return (
    <>
      <div style={fieldStyle}>
        <label style={labelStyle}>Status code</label>
        <input
          type="number"
          value={data.status}
          onChange={(e) => onChange({ ...data, status: parseInt(e.target.value, 10) || 200 })}
          style={inputStyle}
          placeholder="200"
          autoFocus
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Response body (JSON)</label>
        <textarea
          value={data.body}
          onChange={(e) => onChange({ ...data, body: e.target.value })}
          style={{ ...inputStyle, minHeight: 48, resize: 'vertical' }}
          placeholder='{ "message": "ok" }'
        />
      </div>
    </>
  )
}
