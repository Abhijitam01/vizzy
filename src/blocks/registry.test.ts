import { describe, it, expect } from 'vitest'
import { BLOCK_REGISTRY } from './registry'
import type { BlockType } from './types'

const EXPECTED_TYPES: BlockType[] = ['route', 'middleware', 'handler', 'response']

describe('BLOCK_REGISTRY', () => {
  it('has all 4 block types', () => {
    for (const type of EXPECTED_TYPES) {
      expect(BLOCK_REGISTRY).toHaveProperty(type)
    }
  })

  it('every block has a non-empty label', () => {
    for (const type of EXPECTED_TYPES) {
      expect(BLOCK_REGISTRY[type].label.trim().length).toBeGreaterThan(0)
    }
  })

  it('every block has a non-empty tooltip', () => {
    for (const type of EXPECTED_TYPES) {
      expect(BLOCK_REGISTRY[type].tooltip.trim().length).toBeGreaterThan(0)
    }
  })

  it('every block has a color string', () => {
    for (const type of EXPECTED_TYPES) {
      expect(BLOCK_REGISTRY[type].color).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })

  it('route has no inputs and one output', () => {
    expect(BLOCK_REGISTRY.route.ports.inputs).toHaveLength(0)
    expect(BLOCK_REGISTRY.route.ports.outputs).toHaveLength(1)
  })

  it('response has one input and no outputs (terminal)', () => {
    expect(BLOCK_REGISTRY.response.ports.inputs).toHaveLength(1)
    expect(BLOCK_REGISTRY.response.ports.outputs).toHaveLength(0)
  })

  it('route defaultData has method and path', () => {
    const d = BLOCK_REGISTRY.route.defaultData as { method: string; path: string }
    expect(d.method).toBeTruthy()
    expect(d.path).toMatch(/^\//)
  })

  it('response defaultData has status and body', () => {
    const d = BLOCK_REGISTRY.response.defaultData as { status: number; body: string }
    expect(typeof d.status).toBe('number')
    expect(d.body.trim().length).toBeGreaterThan(0)
  })
})
