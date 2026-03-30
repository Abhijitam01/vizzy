import type { Connection } from 'reactflow'
import type { BlockType } from './types'

/**
 * Valid directed connections in the block chain.
 * Response is terminal — nothing connects from it.
 * Route has no inputs — nothing connects into it.
 */
const VALID_CONNECTIONS: Record<BlockType, BlockType[]> = {
  route: ['middleware', 'handler'],
  middleware: ['middleware', 'handler'],
  handler: ['response'],
  response: [],
}

/**
 * Returns true if the connection is valid per the chain rules.
 * Used as the `isValidConnection` prop on the React Flow canvas.
 *
 * `sourceType` and `targetType` are the BlockType values stored on
 * the source/target node. They must be passed in from the node lookup
 * at the canvas level.
 */
export function isValidBlockConnection(
  sourceType: BlockType | undefined,
  targetType: BlockType | undefined,
): boolean {
  if (!sourceType || !targetType) return false
  const allowed = VALID_CONNECTIONS[sourceType]
  return allowed.includes(targetType)
}

/**
 * Factory: returns an `isValidConnection` callback suitable for React Flow.
 * Takes a node lookup function so it can resolve types from node IDs.
 */
export function makeConnectionValidator(
  getNodeType: (id: string) => BlockType | undefined,
) {
  return (connection: Connection): boolean => {
    if (!connection.source || !connection.target) return false
    const sourceType = getNodeType(connection.source)
    const targetType = getNodeType(connection.target)
    return isValidBlockConnection(sourceType, targetType)
  }
}
