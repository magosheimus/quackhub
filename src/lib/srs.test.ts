import { describe, it, expect } from 'vitest'
import { calculateQuality, calculateNewEF, calculateNextInterval } from './srs'

describe('calculateQuality', () => {
  it('nota 0 e confiança 1 (pior caso) retorna 0', () => {
    expect(calculateQuality(0, 1)).toBe(0)
  })

  it('nota 10 e confiança 5 (melhor caso) retorna próximo de 5', () => {
    expect(calculateQuality(10, 5)).toBeCloseTo(5, 5)
  })

  it('exemplo da documentação: nota 6.4 e confiança 3 retorna ~2.92', () => {
    expect(calculateQuality(6.4, 3)).toBeCloseTo(2.92, 2)
  })
})

describe('calculateNewEF', () => {
  it('qualidade alta aumenta o EF', () => {
    expect(calculateNewEF(2.5, 5)).toBeGreaterThan(2.5)
  })

  it('qualidade baixa (mas >= 2) reduz o EF pela fórmula normal', () => {
    expect(calculateNewEF(2.5, 3)).toBeLessThan(2.5)
  })

  it('qualidade < 2 aplica penalidade adicional de 0.2 (RN-S04)', () => {
    const semPenalidade = 2.5 + (0.1 - (5 - 1) * (0.08 + (5 - 1) * 0.02))
    expect(calculateNewEF(2.5, 1)).toBeCloseTo(semPenalidade - 0.2, 5)
  })

  it('exemplo da documentação: EF cai de 2.5 pra ~2.35 com qualidade 2.92', () => {
    const q = calculateQuality(6.4, 3)
    expect(calculateNewEF(2.5, q)).toBeCloseTo(2.35, 2)
  })

  it('nunca fica abaixo de 1.3 mesmo com quedas repetidas', () => {
    let ef = 1.3
    for (let i = 0; i < 10; i++) {
      ef = calculateNewEF(ef, 0)
    }
    expect(ef).toBe(1.3)
  })
})

describe('calculateNextInterval', () => {
  it('qualidade < 2 sempre reseta pra 1 dia, mesmo com intervalo alto', () => {
    expect(calculateNextInterval(20, 2.5, 1)).toBe(1)
  })

  it('primeira revisão (sem intervalo anterior) retorna 1 dia', () => {
    expect(calculateNextInterval(null, 2.5, 4)).toBe(1)
  })

  it('progressão: 1 → 3 → intervalo anterior × EF', () => {
    const first = calculateNextInterval(null, 2.5, 4)
    expect(first).toBe(1)

    const second = calculateNextInterval(first, 2.5, 4)
    expect(second).toBe(3)

    const third = calculateNextInterval(second, 2.5, 4)
    expect(third).toBe(Math.round(3 * 2.5))
  })
})
