import { describe, expect, it } from 'vitest'
import indexCss from '../index.css?raw'
const styleFiles = import.meta.glob<string>('/src/styles/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const sourceFiles = import.meta.glob<string>('/src/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Variáveis definidas em tempo de execução (Base UI ou style inline dos componentes)
const RUNTIME_VARIABLES = new Set([
  '--anchor-width',
  '--available-height',
  '--transform-origin',
  '--habit',
])

function definedVariables(): Set<string> {
  const css = [indexCss, ...Object.values(styleFiles)].join('\n')
  return new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]))
}

describe('tokens de tema', () => {
  it('toda variável CSS usada no código existe no index.css ou em styles/', () => {
    const defined = definedVariables()
    const missing: string[] = []

    for (const [file, source] of Object.entries(sourceFiles)) {
      // classes como bg-(--x) e valores como var(--x)
      for (const [, variable] of source.matchAll(
        /(?:-\(|var\()(--[a-z0-9-]+)/g,
      )) {
        if (!defined.has(variable) && !RUNTIME_VARIABLES.has(variable)) {
          missing.push(`${variable} em ${file}`)
        }
      }
    }

    expect(missing).toEqual([])
  })
})
