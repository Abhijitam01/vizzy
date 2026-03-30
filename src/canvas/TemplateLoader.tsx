import { TEMPLATES } from '../codegen/templates'
import { useGraphStore } from '../store/graphStore'

export function TemplateLoader() {
  const loadTemplate = useGraphStore((s) => s.loadTemplate)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 12,
          padding: '32px',
          maxWidth: 560,
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: 20, color: '#111827' }}>
          Build your first Express endpoint
        </h2>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6B7280' }}>
          Every Express app is a chain: Route → Handler → Response. Pick a template and watch the code generate live on the right.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => loadTemplate(template.nodes, template.edges)}
              style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                padding: '14px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#EEF2FF'
                e.currentTarget.style.borderColor = '#4F46E5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F9FAFB'
                e.currentTarget.style.borderColor = '#E5E7EB'
              }}
              data-testid={`template-${template.id}`}
            >
              <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>
                {template.name}
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                {template.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
