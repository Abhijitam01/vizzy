# Vizzy

A visual Express/Node.js builder for developers who know React but freeze the moment they open a backend file.

Drag blocks onto a canvas, connect them, and watch real annotated Express code generate live on the right. When you're done, hit Export — you get a `server.js` and `package.json` you can run immediately with `node server.js`.

---

## What it does

You build an Express route by connecting four types of blocks:

| Block | What it represents |
|-------|-------------------|
| **Route** | The URL and HTTP method Express listens for |
| **Middleware** | A function that runs before your handler (auth, logging, validation) |
| **Handler** | Your logic — reads the request, does the work |
| **Response** | Sends data back to the client |

Connect them left to right. The code panel on the right updates on every change. Every section of the generated code has a comment explaining what it does and why.

Click any block to edit its values. Drag new blocks from the sidebar. Click a block and the matching lines in the code panel highlight so you can trace exactly what each block produces.

---

## Getting started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`, pick one of the three starter templates, and start building.

---

## Commands

```bash
pnpm dev          # start dev server with hot reload
pnpm build        # production build → dist/
pnpm preview      # preview the production build locally
pnpm test         # run all unit + integration tests (Vitest)
pnpm test:e2e     # run Playwright E2E tests
pnpm coverage     # test coverage report
pnpm lint         # ESLint
```

---

## Starter templates

Three templates ship out of the box — no blank canvas:

- **GET Endpoint** — Route → Handler → Response. The fastest path to a running server.
- **POST with Middleware** — adds a Middleware block for request validation before the handler runs.
- **Auth Route** — shows how to gate a handler behind an auth check using middleware.

---

## How the code generation works

The generator walks the block chain starting from the Route node, follows edges in order, and calls a per-block emitter for each node. Each emitter returns a code fragment. The fragments are assembled into a complete `server.js` with:

- Express boilerplate (`require`, `app.use(express.json())`)
- Inline comments explaining `req` and `res`
- Your middleware definitions and handler function
- The route registration with the full callback chain
- A `app.listen` call and a curl example at the bottom

The output is immediately runnable — `npm install && node server.js` and you have a server.

---

## Export

Click **Export** in the code panel header. You get two files:

- `server.js` — the generated Express server
- `package.json` — with `express` as a dependency and a `dev` script using `node --watch` (Node 18+, no nodemon needed)

```bash
npm install
node server.js
# or for auto-restart on save:
npm run dev
```

---

## Stack

- **React 18 + TypeScript** — UI
- **React Flow** — canvas, drag-drop, connection validation
- **Zustand** — graph state and preview animation state
- **Prism.js** — read-only syntax-highlighted code panel
- **Vite** — build tooling
- **Vitest** — unit and integration tests (69 tests)
- **Playwright** — E2E test covering the full export flow
- **pnpm** — package manager
- **Vercel** — static deployment

---

## Project structure

```
src/
  blocks/
    registry.ts        — config map for all 4 block types (color, tooltip, ports, defaults)
    BlockNode.tsx      — single generic React Flow node component
    BlockEditPanel.tsx — inline edit form, per block type
    types.ts           — BlockType + discriminated BlockData union
    validation.ts      — isValidConnection(source, target)
  store/
    graphStore.ts      — nodes, edges, and all mutations
    previewStore.ts    — animation state + selected block for code sync
  codegen/
    emitters.ts        — one emitter function per block type
    generator.ts       — chain walker → annotated server.js string
    templates.ts       — 3 starter graph configs
  canvas/
    Canvas.tsx         — React Flow setup with drop, click, and connection handling
    BlockPalette.tsx   — draggable block chips sidebar
    TemplateLoader.tsx — template picker shown on empty canvas
  codepanel/
    CodePanel.tsx      — live code view with copy, export, and block highlighting
  preview/
    PreviewRunner.tsx  — run button and request animation state machine
  export/
    exportUtils.ts     — assemble and download server.js + package.json
  ui/
    Tooltip.tsx        — on-hover annotation wrapper
    Layout.tsx         — top bar, palette, canvas, and code panel
```

---

## Connection rules

Not all block combinations are valid. The validator enforces:

```
route      → middleware  ✓
route      → handler     ✓
middleware → middleware  ✓
middleware → handler     ✓
handler    → response    ✓
*          → route       ✗  (route is always the entry point)
response   → *           ✗  (response is terminal)
route      → response    ✗  (must go through a handler)
```

Invalid connections are rejected in real time by React Flow's `isValidConnection` hook.

---

## Who this is for

Junior and bootcamp developers who understand React component trees but haven't connected the mental model to Express middleware chains yet. The canvas makes the execution order visual — blocks flow left to right the same way a request flows through your server.
