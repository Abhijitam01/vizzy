import { describe, it, expect } from 'vitest'
import type { Edge } from 'reactflow'
import { walkChain, generateCode } from './generator'
import type { VizzyNode } from '../blocks/types'

const routeNode: VizzyNode = {
  id: 'route-1',
  type: 'vizzyBlock',
  position: { x: 0, y: 0 },
  data: { type: 'route', data: { method: 'GET', path: '/api' } },
}

const middlewareNode: VizzyNode = {
  id: 'middleware-1',
  type: 'vizzyBlock',
  position: { x: 0, y: 100 },
  data: { type: 'middleware', data: { name: 'logger', order: 0 } },
}

const handlerNode: VizzyNode = {
  id: 'handler-1',
  type: 'vizzyBlock',
  position: { x: 0, y: 200 },
  data: { type: 'handler', data: { name: 'getHandler', body: '// logic' } },
}

const responseNode: VizzyNode = {
  id: 'response-1',
  type: 'vizzyBlock',
  position: { x: 0, y: 300 },
  data: { type: 'response', data: { status: 200, body: '{ "ok": true }' } },
}

const edgeR2H: Edge = { id: 'e1', source: 'route-1', target: 'handler-1' }
const edgeH2Res: Edge = { id: 'e2', source: 'handler-1', target: 'response-1' }
const edgeR2M: Edge = { id: 'e1', source: 'route-1', target: 'middleware-1' }
const edgeM2H: Edge = { id: 'e2', source: 'middleware-1', target: 'handler-1' }

describe('walkChain', () => {
  it('returns empty array when no route node', () => {
    expect(walkChain([handlerNode, responseNode], [edgeH2Res])).toHaveLength(0)
  })

  it('returns [route, handler, response] for simple GET chain', () => {
    const chain = walkChain(
      [routeNode, handlerNode, responseNode],
      [edgeR2H, edgeH2Res],
    )
    expect(chain.map((n) => n.id)).toEqual(['route-1', 'handler-1', 'response-1'])
  })

  it('includes middleware in the chain', () => {
    const chain = walkChain(
      [routeNode, middlewareNode, handlerNode, responseNode],
      [edgeR2M, edgeM2H, edgeH2Res],
    )
    expect(chain.map((n) => n.id)).toEqual([
      'route-1',
      'middleware-1',
      'handler-1',
      'response-1',
    ])
  })

  it('stops at response (does not loop)', () => {
    // Malformed graph: response points back to route
    const cyclicEdge: Edge = { id: 'cycle', source: 'response-1', target: 'route-1' }
    const chain = walkChain(
      [routeNode, handlerNode, responseNode],
      [edgeR2H, edgeH2Res, cyclicEdge],
    )
    // Should stop at response without visiting route again
    expect(chain).toHaveLength(3)
    expect(chain[chain.length - 1].data.type).toBe('response')
  })

  it('stops when chain is broken (no outgoing edge)', () => {
    // Route → handler but handler has no outgoing edge
    const chain = walkChain([routeNode, handlerNode], [edgeR2H])
    expect(chain.map((n) => n.id)).toEqual(['route-1', 'handler-1'])
  })
})

describe('generateCode', () => {
  it('returns a placeholder when no nodes', () => {
    const code = generateCode([], [])
    expect(code).toContain('Connect blocks')
  })

  it('returns a placeholder when only route exists (broken chain)', () => {
    const code = generateCode([routeNode], [])
    expect(code).toContain('Connect blocks')
  })

  it('includes express boilerplate header', () => {
    const code = generateCode(
      [routeNode, handlerNode, responseNode],
      [edgeR2H, edgeH2Res],
    )
    expect(code).toContain("require('express')")
    expect(code).toContain('app.listen')
  })

  it('includes the route path in the output', () => {
    const code = generateCode(
      [routeNode, handlerNode, responseNode],
      [edgeR2H, edgeH2Res],
    )
    expect(code).toContain('/api')
  })

  it('includes the response status code', () => {
    const code = generateCode(
      [routeNode, handlerNode, responseNode],
      [edgeR2H, edgeH2Res],
    )
    expect(code).toContain('200')
  })

  it('includes middleware name when middleware is in chain', () => {
    const code = generateCode(
      [routeNode, middlewareNode, handlerNode, responseNode],
      [edgeR2M, edgeM2H, edgeH2Res],
    )
    expect(code).toContain('logger')
  })

  it('generates valid JS (no syntax errors) — basic smoke test', () => {
    const code = generateCode(
      [routeNode, handlerNode, responseNode],
      [edgeR2H, edgeH2Res],
    )
    // Should at least contain function definitions and app.listen
    expect(code).toContain('function')
    expect(code).toContain('app.listen')
  })

  it('embeds block ID markers for route and response nodes', () => {
    const code = generateCode(
      [routeNode, handlerNode, responseNode],
      [edgeR2H, edgeH2Res],
    )
    expect(code).toContain('// [block:route-1]')
    expect(code).toContain('// [block:response-1]')
  })

  it('embeds block ID marker for handler node', () => {
    const code = generateCode(
      [routeNode, handlerNode, responseNode],
      [edgeR2H, edgeH2Res],
    )
    expect(code).toContain('// [block:handler-1]')
  })

  it('embeds block ID marker for middleware node', () => {
    const code = generateCode(
      [routeNode, middlewareNode, handlerNode, responseNode],
      [edgeR2M, edgeM2H, edgeH2Res],
    )
    expect(code).toContain('// [block:middleware-1]')
  })
})
