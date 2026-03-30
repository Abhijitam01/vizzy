import { describe, it, expect } from 'vitest'
import { isValidBlockConnection, makeConnectionValidator } from './validation'
import type { BlockType } from './types'

describe('isValidBlockConnection', () => {
  // Valid connections
  it('route → middleware is valid', () => {
    expect(isValidBlockConnection('route', 'middleware')).toBe(true)
  })

  it('route → handler is valid (skip middleware)', () => {
    expect(isValidBlockConnection('route', 'handler')).toBe(true)
  })

  it('middleware → middleware is valid (chain)', () => {
    expect(isValidBlockConnection('middleware', 'middleware')).toBe(true)
  })

  it('middleware → handler is valid', () => {
    expect(isValidBlockConnection('middleware', 'handler')).toBe(true)
  })

  it('handler → response is valid', () => {
    expect(isValidBlockConnection('handler', 'response')).toBe(true)
  })

  // Invalid connections
  it('route → response is invalid (must go through handler)', () => {
    expect(isValidBlockConnection('route', 'response')).toBe(false)
  })

  it('response → anything is invalid (terminal node)', () => {
    const targets: BlockType[] = ['route', 'middleware', 'handler', 'response']
    for (const target of targets) {
      expect(isValidBlockConnection('response', target)).toBe(false)
    }
  })

  it('handler → route is invalid', () => {
    expect(isValidBlockConnection('handler', 'route')).toBe(false)
  })

  it('handler → middleware is invalid', () => {
    expect(isValidBlockConnection('handler', 'middleware')).toBe(false)
  })

  it('returns false for undefined source', () => {
    expect(isValidBlockConnection(undefined, 'handler')).toBe(false)
  })

  it('returns false for undefined target', () => {
    expect(isValidBlockConnection('route', undefined)).toBe(false)
  })
})

describe('makeConnectionValidator', () => {
  it('validates using the node type lookup function', () => {
    const nodeTypes: Record<string, BlockType> = {
      'node-a': 'route',
      'node-b': 'handler',
    }
    const validator = makeConnectionValidator((id) => nodeTypes[id])
    expect(
      validator({ source: 'node-a', target: 'node-b', sourceHandle: null, targetHandle: null }),
    ).toBe(true)
  })

  it('rejects when source node not found', () => {
    const validator = makeConnectionValidator(() => undefined)
    expect(
      validator({ source: 'missing', target: 'node-b', sourceHandle: null, targetHandle: null }),
    ).toBe(false)
  })

  it('rejects when source or target is null', () => {
    const validator = makeConnectionValidator(() => 'route')
    expect(
      validator({ source: null, target: 'node-b', sourceHandle: null, targetHandle: null }),
    ).toBe(false)
  })
})
