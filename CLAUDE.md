# CLAUDE.md — PosturePal Desktop

This file is read automatically by Claude Code at the start of every session. It contains project-wide rules, conventions, and context that you must follow.

## Project Identity

**Name:** PosturePal
**Type:** Cross-platform desktop application (macOS + Windows)
**Purpose:** Real-time posture monitoring using webcam + computer vision
**Author:** Kanan Akbarli (academic project, deadline May 11, 2026)

## Critical Rules (NEVER violate)

1. **Never send image data over the network.** This app's core promise is privacy. All pose detection, calculations, and storage happen locally. No analytics, no telemetry, no remote logging of camera frames.

2. **Keep posture logic UI-free.** All files in `src/renderer/posture/` must be pure TypeScript functions with NO React, NO DOM, NO Electron imports. Input: keypoints. Output: numbers/status. This makes them testable and reusable.

3. **Always write a test when you add a posture calculation.** Every function in `src/renderer/posture/` must have a corresponding test in `src/renderer/posture/__tests__/`.

4. **Never use raw pixel thresholds for posture.** Always normalize against a reference distance (e.g., shoulder width). Camera distance varies and pixel values are misleading.

5. **Update plan.md after completing each task.** Move items from "Todo" to "Done" with a date. This keeps progress visible across sessions.

## Tech Stack (locked, do not propose alternatives)

- Electron 30+
- React 19 + TypeScript 5
- Vite (via electron-vite)
- Tailwind CSS 3 + shadcn/ui
- @mediapipe/tasks-vision for pose detection
- better-sqlite3 for local storage
- i18next + react-i18next for i18n (locales: en, tr)
- Vitest for testing
- electron-builder for packaging

## Code Conventions

**TypeScript:**
- Strict mode ON. No `any` unless absolutely unavoidable (and then comment why).
- Use `type` for unions/aliases, `interface` for object shapes.
- Prefer named exports over default exports (except for React pages/main components).

**React:**
- Functional components only. No class components.
- Custom hooks for stateful logic that's reused.
- Keep components under 200 lines. Split when larger.
- Use shadcn/ui components first; only create custom UI when shadcn doesn't have it.

**File naming:**
- Components: PascalCase (`WebcamView.tsx`)
- Hooks: camelCase with `use` prefix (`useWebcam.ts`)
- Utilities: camelCase (`calculations.ts`)
- Tests: `*.test.ts` next to or in `__tests__/`

**Imports order:**
1. External packages
2. Electron / Node imports
3. Internal absolute imports (using `@/` alias)
4. Relative imports
5. CSS / asset imports

## Folder Structure (do not deviate)

```
src/
├── main/              # Electron main process (Node.js context)
├── preload/           # Preload scripts (bridge between main and renderer)
└── renderer/          # React app (browser context)
    ├── components/    # Reusable UI components
    ├── pages/         # Top-level route components
    ├── posture/       # Pure logic, NO UI/Electron imports
    ├── hooks/         # Custom React hooks
    ├── lib/           # Utilities, IPC wrappers
    └── i18n/          # Translation files and setup
```

## IPC Communication

Renderer cannot access Node APIs directly. Use the preload bridge:

1. Define IPC channel names as constants in `src/preload/channels.ts`
2. Expose typed functions via `contextBridge` in `src/preload/index.ts`
3. Implement handlers in `src/main/ipc.ts`
4. Renderer calls them via `window.api.*`

Always declare types for IPC functions in `src/renderer/lib/ipc.ts`.

## Testing

Run tests: `npm test`
Run specific: `npm test -- calculations`

When asked to add a feature, also add tests for it. When fixing a bug in posture logic, add a regression test.

## Commit Style

Use conventional commits:
- `feat: add CVA calculation`
- `fix: handle missing left shoulder keypoint`
- `chore: update dependencies`
- `docs: update plan.md`
- `test: add tests for shoulder asymmetry`

## Reference Documents

Always read these files at the start of a complex task:
- `plan.md` — current progress and next tasks
- `TECHNICAL_SPEC.md` — full system specification (in /docs)

## What NOT to do

- Don't install packages not listed in the tech stack without asking.
- Don't refactor working code unless explicitly asked.
- Don't add features that aren't in plan.md without asking first.
- Don't write long explanations after a task; keep messages concise.
- Don't create new top-level folders without checking the structure above.
- Don't use `localStorage` in renderer for persistent data — use SQLite via IPC.

## When Uncertain

If you're unsure about a design decision, STOP and ask. Don't guess. Examples:
- "Should this calculation handle the case where both ears have low visibility?"
- "The plan says X but the code currently does Y. Which is correct?"
