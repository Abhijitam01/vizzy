import { describe, it, expect } from 'vitest'
import { emitters } from './emitters'

describe('emitters', () => {
  describe('route emitter', () => {
    it('includes the HTTP method', () => {
      const code = emitters.route({ method: 'GET', path: '/api' })
      expect(code).toContain('get')
    })

    it('includes the path', () => {
      const code = emitters.route({ method: 'POST', path: '/api/items' })
      expect(code).toContain('/api/items')
    })

    it('lowercases the method for app.METHOD()', () => {
      const code = emitters.route({ method: 'DELETE', path: '/api' })
      expect(code).toContain('app.delete')
    })

    it('includes an annotation comment', () => {
      const code = emitters.route({ method: 'GET', path: '/health' })
      expect(code).toContain('//')
    })
  })

  describe('middleware emitter', () => {
    it('includes the middleware name as a function', () => {
      const code = emitters.middleware({ name: 'requireAuth', order: 0 })
      expect(code).toContain('function requireAuth')
    })

    it('calls next()', () => {
      const code = emitters.middleware({ name: 'logger', order: 1 })
      expect(code).toContain('next()')
    })

    it('includes the name in the annotation comment', () => {
      const code = emitters.middleware({ name: 'validateInput', order: 0 })
      expect(code).toContain('validateInput')
    })
  })

  describe('handler emitter', () => {
    it('includes the handler name as an async function', () => {
      const code = emitters.handler({ name: 'getUser', body: 'return req.user' })
      expect(code).toContain('async function getUser')
    })

    it('includes the body content', () => {
      const code = emitters.handler({ name: 'createItem', body: 'const item = req.body' })
      expect(code).toContain('const item = req.body')
    })
  })

  describe('response emitter', () => {
    it('includes the status code', () => {
      const code = emitters.response({ status: 201, body: '{}' })
      expect(code).toContain('201')
    })

    it('includes the response body', () => {
      const code = emitters.response({ status: 200, body: '{ "ok": true }' })
      expect(code).toContain('{ "ok": true }')
    })

    it('uses res.status().json()', () => {
      const code = emitters.response({ status: 200, body: '{}' })
      expect(code).toContain('res.status')
      expect(code).toContain('.json(')
    })
  })
})
