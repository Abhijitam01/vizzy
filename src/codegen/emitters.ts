import type { BlockType, BlockData, RouteData, MiddlewareData, HandlerData, ResponseData } from '../blocks/types'

/**
 * Each emitter takes the typed block data and returns an annotated
 * Express code fragment. The annotation comment lets students trace
 * canvas → code directly.
 */

function emitRoute(data: RouteData): string {
  const method = data.method.toLowerCase()
  return `// Route: listens for ${data.method} ${data.path}
app.${method}('${data.path}', ...handlers)`
}

function emitMiddleware(data: MiddlewareData): string {
  return `// Middleware: ${data.name} — runs before your handler
function ${data.name}(req, res, next) {
  // validate, log, or authenticate here
  next()
}`
}

function emitHandler(data: HandlerData): string {
  return `// Handler: ${data.name} — your logic
async function ${data.name}(req, res, next) {
  ${data.body}
}`
}

function emitResponse(data: ResponseData): string {
  return `// Response: sends ${data.status} back to the client
res.status(${data.status}).json(${data.body})`
}

export const emitters: {
  [K in BlockType]: (data: Extract<BlockData, { type: K }>['data']) => string
} = {
  route: emitRoute,
  middleware: emitMiddleware,
  handler: emitHandler,
  response: emitResponse,
}
