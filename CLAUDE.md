# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vizzy** is a visual Express/Node.js learning tool for junior/bootcamp devs who know React but freeze at backend code. Users drag Route, Middleware, Handler, and Response blocks onto a canvas, connect them, and watch annotated Express code generate live in a code panel. Export downloads a working `server.js` + `package.json` they can run with `node server.js`.

**Target user:** junior/bootcamp dev who understands React but panics at Express.
**Competitor:** Udemy/tutorials (learning resource), not Xano (no-code).

## Architecture

Two layers:

1. **Canvas / Visual Layer** — React Flow canvas. Users start from one of 3 starter templates (no blank state). Blocks have typed ports; `isValidConnection` enforces valid connection rules.

2. **Code Generation Layer** — block graph → per-block emitters → annotated Express code string. The chain is always linear: `Route → [Middleware*] → Handler → Response`. No DAG traversal needed for v0.1.

### Block Type System

4 block types defined in `src/blocks/registry.ts` as a config map (`BLOCK_REGISTRY`). One generic `<BlockNode>` component renders all 4 types from their config. Adding a new block type = adding one entry to the map.

Block types: `route`, `middleware`, `handler`, `response`

### Connection Rules

- `route → middleware` ✓
- `route → handler` ✓
- `middleware → middleware` ✓
- `middleware → handler` ✓
- `handler → response` ✓
- Everything else ✗ (`response` is terminal)

### Stack

- **React 18 + TypeScript** — UI
- **React Flow** — canvas, drag-drop, connection validation
- **Zustand** — graph state (nodes + edges) + preview state
- **Prism.js** — read-only syntax-highlighted code panel (no Monaco for v0.1)
- **Vite** — build tooling
- **Vitest** — unit + integration tests
- **Playwright** — E2E test (export flow)
- **pnpm** — package manager
- **Vercel** — static deployment (`vercel.json` at root)

## Commands

```bash
pnpm install          # install dependencies
pnpm dev              # start Vite dev server (localhost:5173)
pnpm build            # production build
pnpm test             # run Vitest unit + integration tests
pnpm test:e2e         # run Playwright E2E tests
pnpm coverage         # Vitest coverage report
pnpm lint             # ESLint
pnpm preview          # preview production build
```

## Data Model

```ts
// src/blocks/types.ts

type BlockType = 'route' | 'middleware' | 'handler' | 'response'

type RouteData      = { method: 'GET' | 'POST' | 'PUT' | 'DELETE'; path: string }
type MiddlewareData = { name: string; order: number }
type HandlerData    = { name: string; body: string }
type ResponseData   = { status: number; body: string }

// Discriminated union — compiler narrows type per block
type BlockData =
  | { type: 'route';      data: RouteData }
  | { type: 'middleware'; data: MiddlewareData }
  | { type: 'handler';    data: HandlerData }
  | { type: 'response';   data: ResponseData }

type VizzyNode = Node<BlockData>  // extends React Flow's Node<T>
```

## Code Generation

`src/codegen/generator.ts` walks the chain starting from the Route node, collects nodes in order, calls the matching emitter for each, and wraps the output in Express boilerplate.

`src/codegen/emitters.ts` — one emitter function per block type:
```ts
emitters[node.type](node.data)  // → code fragment string
```

Output is annotated: each block's section includes a comment so students can trace canvas → code.

## File Organization

```
src/
  blocks/
    registry.ts        — BLOCK_REGISTRY config map (label, color, tooltip, ports, defaultData)
    BlockNode.tsx      — single generic React Flow node component
    types.ts           — BlockType + discriminated BlockData union
    validation.ts      — isValidConnection(source, target): boolean
  store/
    graphStore.ts      — Zustand: nodes[], edges[], addNode/removeNode/addEdge/removeEdge
    previewStore.ts    — Zustand: requestState, activeBlockId (mock HTTP preview)
  codegen/
    emitters.ts        — Record<BlockType, (data) => string>
    generator.ts       — walkChain(graph) → server.js string
    templates.ts       — 3 starter graph JSON configs (GET, POST, AuthRoute)
  canvas/
    Canvas.tsx         — React Flow wrapper, nodeTypes, isValidConnection
    TemplateLoader.tsx — template picker (3 options, no blank state)
  codepanel/
    CodePanel.tsx      — Prism.js, live update via graphStore subscription
  preview/
    PreviewRunner.tsx  — Run button, requestState state machine, per-block animation
  export/
    exportUtils.ts     — assemble server.js + package.json, trigger download
  ui/
    Tooltip.tsx        — on-hover annotation wrapper
    Layout.tsx         — canvas left, code panel right
  main.tsx
```

## v0.1 NOT in Scope

- Blank canvas / free block palette
- Bidirectional code sync (code → graph)
- Editable code panel (Monaco)
- Database blocks, production auth flows
- Real server execution / sandbox runtime
- User accounts, persistence, sharing

## Success Metric

A junior dev who has never written Express builds a working GET endpoint in under 5 minutes, exports it, and runs it with `node server.js`.
