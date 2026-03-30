import { describe, it, expect } from 'vitest'
import { TEMPLATES } from './templates'
import { generateCode } from './generator'

describe('starter templates', () => {
  it('all 3 templates are defined', () => {
    expect(TEMPLATES).toHaveLength(3)
  })

  it('each template has id, name, description, nodes, and edges', () => {
    for (const template of TEMPLATES) {
      expect(template.id).toBeTruthy()
      expect(template.name).toBeTruthy()
      expect(template.description).toBeTruthy()
      expect(Array.isArray(template.nodes)).toBe(true)
      expect(Array.isArray(template.edges)).toBe(true)
    }
  })

  it('each template has at least one route node', () => {
    for (const template of TEMPLATES) {
      const hasRoute = template.nodes.some((n) => n.data.type === 'route')
      expect(hasRoute).toBe(true)
    }
  })

  it('each template has at least one response node', () => {
    for (const template of TEMPLATES) {
      const hasResponse = template.nodes.some((n) => n.data.type === 'response')
      expect(hasResponse).toBe(true)
    }
  })

  it('GET template generates valid Express code with require("express")', () => {
    const getTemplate = TEMPLATES.find((t) => t.id === 'get-endpoint')!
    const code = generateCode(getTemplate.nodes, getTemplate.edges)
    expect(code).toContain("require('express')")
    expect(code).toContain('app.listen')
  })

  it('POST template generates code with post route', () => {
    const postTemplate = TEMPLATES.find((t) => t.id === 'post-with-body')!
    const code = generateCode(postTemplate.nodes, postTemplate.edges)
    expect(code.toLowerCase()).toContain('post')
  })

  it('AUTH template generates code containing middleware', () => {
    const authTemplate = TEMPLATES.find((t) => t.id === 'protected-route')!
    const code = generateCode(authTemplate.nodes, authTemplate.edges)
    expect(code).toContain('requireAuth')
  })

  it('snapshot: GET template output is stable', () => {
    const getTemplate = TEMPLATES.find((t) => t.id === 'get-endpoint')!
    const code = generateCode(getTemplate.nodes, getTemplate.edges)
    expect(code).toMatchSnapshot()
  })
})
