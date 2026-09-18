import { useEffect, useState } from 'react'
import { Marquee } from '@/components/ui/marquee'

const CARTRIDGES = [
  { label: 'Sage', className: '' },
  { label: 'Amber', className: 'cartucho-amber' },
  { label: 'Slate', className: 'cartucho-slate' },
  { label: 'Earth', className: 'cartucho-earth' },
  { label: 'Sage Dark', className: 'cartucho-sage-dark' },
  { label: 'Amber Dark', className: 'cartucho-amber-dark' },
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

export function TokenPreview() {
  const [cartridge, setCartridge] = useState('')
  const [effectsOn, setEffectsOn] = useState(true)

  useEffect(() => {
    const classes = [cartridge, effectsOn ? 'theme-dark' : '']
      .filter(Boolean)
      .join(' ')
    document.documentElement.className = classes
  }, [cartridge, effectsOn])

  return (
    <div style={{ minHeight: '100vh', padding: 24 }}>
      <div
        style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}
      >
        {CARTRIDGES.map((c) => (
          <button
            key={c.label}
            onClick={() => setCartridge(c.className)}
            style={{
              padding: '6px 14px',
              border: '1px solid var(--border)',
              background:
                cartridge === c.className ? 'var(--accent)' : 'var(--bg-card)',
              color:
                cartridge === c.className
                  ? 'var(--bg-page)'
                  : 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 24,
        }}
      >
        <input
          type="checkbox"
          checked={effectsOn}
          onChange={(e) => setEffectsOn(e.target.checked)}
        />
        Efeitos escuros ligados (glow / aberração cromática / scanlines)
      </label>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {TOKENS.map((t) => (
          <Swatch key={t} token={t} />
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <Marquee speed={50}>
          ★ Sprint Goal: Finalizar motor SRS antes do fim da semana ★
        </Marquee>
      </div>

      <div
        style={{
          marginTop: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <p className="glow-heading" style={{ fontSize: 20 }}>
          Teste de glow/aberração cromática — compare com o checkbox
          ligado/desligado
        </p>

        <div
          className="card-hover"
          style={{ padding: 16, background: 'var(--bg-card)', width: 200 }}
        >
          Card com .card-hover
        </div>

        <input
          placeholder="Teste do bevel duplo do input"
          style={{ padding: 8, width: 240, fontFamily: 'var(--font-body)' }}
        />
      </div>
    </div>
  )
}
