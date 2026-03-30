import type { Node } from 'reactflow'

export type BlockType = 'route' | 'middleware' | 'handler' | 'response'

export type RouteData = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
}

export type MiddlewareData = {
  name: string
  order: number
}

export type HandlerData = {
  name: string
  body: string
}

export type ResponseData = {
  status: number
  body: string
}

export type BlockData =
  | { type: 'route'; data: RouteData }
  | { type: 'middleware'; data: MiddlewareData }
  | { type: 'handler'; data: HandlerData }
  | { type: 'response'; data: ResponseData }

export type VizzyNode = Node<BlockData>
