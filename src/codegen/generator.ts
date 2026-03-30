import type { Edge } from 'reactflow'
import type { VizzyNode } from '../blocks/types'
import { emitters } from './emitters'

const FILE_HEADER = `const express = require('express')
const app = express()

app.use(express.json()) // parse JSON request bodies
// req = incoming request (url, body, headers)
// res = your response object (status, json, send)

`

const FILE_FOOTER = `

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})

// -- RUN IT --------------------------------
// npm install && node server.js
// Test: curl http://localhost:3000[path]`

/**
 * Walk the block chain starting from the Route node.
 * Returns nodes in execution order: Route → [Middleware*] → Handler → Response.
 * Returns an empty array if no Route node exists or the chain is broken.
 */
export function walkChain(nodes: VizzyNode[], edges: Edge[]): VizzyNode[] {
  const routeNode = nodes.find((n) => n.data.type === 'route')
  if (!routeNode) return []

  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const visited = new Set<string>()
  const chain: VizzyNode[] = []
  let current: VizzyNode | undefined = routeNode

  while (current && !visited.has(current.id)) {
    visited.add(current.id)
    chain.push(current)

    if (current.data.type === 'response') break

    const nextEdge = edges.find((e) => e.source === current!.id)
    if (!nextEdge) break

    current = nodeMap.get(nextEdge.target)
  }

  return chain
}

/**
 * Generate a complete server.js string from the block graph.
 * Returns an empty string if the graph has no Route node.
 */
export function generateCode(nodes: VizzyNode[], edges: Edge[]): string {
  const chain = walkChain(nodes, edges)

  if (chain.length === 0) {
    return '// Connect blocks on the canvas to generate your Express server.'
  }

  // Assemble middleware and handlers as an Express route callback chain
  const routeNode = chain[0]
  const middleNodes = chain.slice(1, -1) // everything between route and response
  const responseNode = chain[chain.length - 1]

  if (
    chain.length < 2 ||
    routeNode.data.type !== 'route' ||
    responseNode.data.type !== 'response'
  ) {
    return '// Connect blocks on the canvas to generate your Express server.'
  }

  const route = routeNode.data.data
  const method = route.method.toLowerCase()
  const path = route.path

  const middlewareNames = middleNodes
    .filter((n) => n.data.type === 'middleware')
    .map((n) => (n.data.data as { name: string }).name)

  const handlerNode = middleNodes.find((n) => n.data.type === 'handler')
  const handlerName = handlerNode
    ? (handlerNode.data.data as { name: string }).name
    : null

  const responseData = responseNode.data.data as { status: number; body: string }

  const middlewareDefs = middleNodes
    .filter((n) => n.data.type === 'middleware')
    .map((n) => `// [block:${n.id}]\n` + emitters.middleware(n.data.data as Parameters<typeof emitters.middleware>[0]))
    .join('\n\n')

  const handlerDef = handlerNode
    ? `// [block:${handlerNode.id}]\n` + emitters.handler(handlerNode.data.data as Parameters<typeof emitters.handler>[0])
    : ''

  const callbackChain = [...middlewareNames, handlerName].filter(Boolean).join(', ')

  const routeRegistration = `// [block:${routeNode.id}]
// Route: listens for ${route.method} ${path}
app.${method}('${path}', ${callbackChain}, (req, res) => {
  // [block:${responseNode.id}]
  // Response: sends ${responseData.status} back to the client
  res.status(${responseData.status}).json(${responseData.body})
})`

  const body = [middlewareDefs, handlerDef, routeRegistration]
    .filter(Boolean)
    .join('\n\n')

  return FILE_HEADER + body + FILE_FOOTER
}
