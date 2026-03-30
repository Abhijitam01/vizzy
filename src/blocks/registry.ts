import type { BlockType, BlockData } from './types'

export interface PortConfig {
  inputs: string[]
  outputs: string[]
}

export interface BlockConfig {
  label: string
  color: string
  bgColor: string
  tooltip: string
  ports: PortConfig
  defaultData: BlockData['data']
}

export const BLOCK_REGISTRY = {
  route: {
    label: 'Route',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    tooltip: 'Tells Express which URL to listen for. Every request starts here.',
    ports: {
      inputs: [],
      outputs: ['next'],
    },
    defaultData: {
      method: 'GET' as const,
      path: '/api',
    },
  },
  middleware: {
    label: 'Middleware',
    color: '#059669',
    bgColor: '#ECFDF5',
    tooltip: 'Runs before your handler. Use it to validate, log, or authenticate the request.',
    ports: {
      inputs: ['in'],
      outputs: ['next'],
    },
    defaultData: {
      name: 'myMiddleware',
      order: 0,
    },
  },
  handler: {
    label: 'Handler',
    color: '#D97706',
    bgColor: '#FFFBEB',
    tooltip: 'Your logic. Read req.body or req.params, do the work, then pass to the Response block.',
    ports: {
      inputs: ['in'],
      outputs: ['next'],
    },
    defaultData: {
      name: 'myHandler',
      body: '// your logic here',
    },
  },
  response: {
    label: 'Response',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    tooltip: 'Sends data back to the client. This is the end of the chain.',
    ports: {
      inputs: ['in'],
      outputs: [],
    },
    defaultData: {
      status: 200,
      body: '{ "message": "hello" }',
    },
  },
} satisfies Record<BlockType, BlockConfig>
