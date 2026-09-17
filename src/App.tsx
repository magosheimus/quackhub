import { useEffect, useState } from 'react'

const CARTRIDGES = [
  { label: 'Sage', className: '' },
  { label: 'Amber', className: 'cartucho-amber' },
  { label: 'Slate', className: 'cartucho-slate' },
  { label: 'Sage Dark', className: 'cartucho-sage-dark theme-dark' },
  { label: 'Amber Dark', className: 'cartucho-amber-dark theme-dark' },
  { label: 'Earth', className: 'cartucho-earth' },
]

const TOKENS = [
  '--bg-page',
  '--bg-surface',
  '--bg-card',
  '--bg-card-hover',
  '--bg-selected',
  '--bg-input',
  '--border',
  '--border-strong',
  '--text-primary',
  '--text-muted',
  '--accent',
  '--signal-danger',
  '--signal-warning',
  '--signal-success',
]

function Swatch({ token }: { token: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          background: `var(${token})`,
          width: 72,
          height: 48,
          border: '1px solid var(--border-strong)',
          borderRadius: 4,
        }}
      />
      <span style={{ fontSize: 10 }}>{token}</span>
    </div>
  )
}

function App() {
  const [active, setActive] = useState('')

  useEffect(() => {
    document.documentElement.className = active
  }, [active])

  return (
    <div style={{ minHeight: '100vh', padding: 24 }}>
      <div
        style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}
      >
        {CARTRIDGES.map((c) => (
          <button
            key={c.label}
            onClick={() => setActive(c.className)}
            style={{
              padding: '6px 14px',
              border: '1px solid var(--border)',
              background:
                active === c.className ? 'var(--accent)' : 'var(--bg-card)',
              color:
                active === c.className
                  ? 'var(--bg-page)'
                  : 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {TOKENS.map((t) => (
          <Swatch key={t} token={t} />
        ))}
      </div>

      <p style={{ marginTop: 24, color: 'var(--text-muted)' }}>
        text-muted de exemplo — compare a legibilidade em cada cartucho
      </p>
      <p style={{ color: 'var(--text-primary)' }}>text-primary de exemplo</p>
    </div>
  )
}

export default App
