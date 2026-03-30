import { useState } from 'react'

interface TooltipProps {
  text: string
  children: React.ReactNode
}

export function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1F2937',
            color: '#F9FAFB',
            fontSize: 12,
            lineHeight: 1.5,
            padding: '6px 10px',
            borderRadius: 6,
            whiteSpace: 'normal' as React.CSSProperties['whiteSpace'],
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            maxWidth: 260,
          }}
        >
          {text}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #1F2937',
            }}
          />
        </div>
      )}
    </div>
  )
}
