import type { VizzyNode } from '../blocks/types'
import type { Edge } from 'reactflow'

export interface Template {
  id: string
  name: string
  description: string
  nodes: VizzyNode[]
  edges: Edge[]
}

const GET_TEMPLATE: Template = {
  id: 'get-endpoint',
  name: 'GET Endpoint',
  description: '3 blocks. One route, one handler, one response — the fastest path to node server.js.',
  nodes: [
    {
      id: 'route-1',
      type: 'vizzyBlock',
      position: { x: 80, y: 200 },
      data: { type: 'route', data: { method: 'GET', path: '/api' } },
    },
    {
      id: 'handler-1',
      type: 'vizzyBlock',
      position: { x: 320, y: 200 },
      data: { type: 'handler', data: { name: 'getHandler', body: '// fetch or compute your data here' } },
    },
    {
      id: 'response-1',
      type: 'vizzyBlock',
      position: { x: 560, y: 200 },
      data: { type: 'response', data: { status: 200, body: '{ "message": "hello" }' } },
    },
  ],
  edges: [
    { id: 'e1-2', source: 'route-1', target: 'handler-1' },
    { id: 'e2-3', source: 'handler-1', target: 'response-1' },
  ],
}

const POST_TEMPLATE: Template = {
  id: 'post-with-body',
  name: 'POST with Body',
  description: 'Accept data from a form or React app. The Middleware block validates before your handler runs.',
  nodes: [
    {
      id: 'route-1',
      type: 'vizzyBlock',
      position: { x: 80, y: 200 },
      data: { type: 'route', data: { method: 'POST', path: '/api/items' } },
    },
    {
      id: 'middleware-1',
      type: 'vizzyBlock',
      position: { x: 280, y: 200 },
      data: { type: 'middleware', data: { name: 'validateBody', order: 0 } },
    },
    {
      id: 'handler-1',
      type: 'vizzyBlock',
      position: { x: 480, y: 200 },
      data: { type: 'handler', data: { name: 'createItem', body: 'const item = req.body\n  // save item here' } },
    },
    {
      id: 'response-1',
      type: 'vizzyBlock',
      position: { x: 680, y: 200 },
      data: { type: 'response', data: { status: 201, body: '{ "created": true }' } },
    },
  ],
  edges: [
    { id: 'e1-2', source: 'route-1', target: 'middleware-1' },
    { id: 'e2-3', source: 'middleware-1', target: 'handler-1' },
    { id: 'e3-4', source: 'handler-1', target: 'response-1' },
  ],
}

const AUTH_TEMPLATE: Template = {
  id: 'protected-route',
  name: 'Protected Route',
  description: 'Lock a route behind a gate. Middleware checks the token — handler only runs if auth passes.',
  nodes: [
    {
      id: 'route-1',
      type: 'vizzyBlock',
      position: { x: 80, y: 200 },
      data: { type: 'route', data: { method: 'GET', path: '/api/protected' } },
    },
    {
      id: 'middleware-1',
      type: 'vizzyBlock',
      position: { x: 280, y: 200 },
      data: { type: 'middleware', data: { name: 'requireAuth', order: 0 } },
    },
    {
      id: 'handler-1',
      type: 'vizzyBlock',
      position: { x: 480, y: 200 },
      data: { type: 'handler', data: { name: 'protectedHandler', body: 'const user = req.user\n  // user is authenticated' } },
    },
    {
      id: 'response-1',
      type: 'vizzyBlock',
      position: { x: 680, y: 200 },
      data: { type: 'response', data: { status: 200, body: '{ "secret": "data" }' } },
    },
  ],
  edges: [
    { id: 'e1-2', source: 'route-1', target: 'middleware-1' },
    { id: 'e2-3', source: 'middleware-1', target: 'handler-1' },
    { id: 'e3-4', source: 'handler-1', target: 'response-1' },
  ],
}

export const TEMPLATES: Template[] = [GET_TEMPLATE, POST_TEMPLATE, AUTH_TEMPLATE]
