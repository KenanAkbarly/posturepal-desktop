# PosturePal Desktop

Privacy-first, real-time posture monitoring desktop app. Uses your webcam + on-device computer vision (MediaPipe Pose) to detect Forward Head Posture, shoulder asymmetry, and ear–shoulder–hip misalignment. **No image data ever leaves your machine.**

Built with Electron, React 19, TypeScript, Tailwind CSS, and Vitest.

## Requirements

- Node.js ≥ 20
- npm ≥ 10
- macOS or Windows
- A webcam

## Development

```bash
# Install dependencies
npm install

# Start the app in development (hot reload)
npm run dev

# Run unit tests (Vitest)
npm test

# Run tests in watch mode
npm run test:watch

# Type-check the whole project (renderer + main)
npm run typecheck

# Lint
npm run lint

# Format with Prettier
npm run format
```

## Production builds

```bash
# Bundle + package for the current platform
npm run build

# Platform-specific installers
npm run build:mac     # .dmg
npm run build:win     # .exe (NSIS)
npm run build:linux   # AppImage / deb
```

Build artifacts are written to `dist/` (Vite output) and `release/` (electron-builder output).

## Project structure

```
src/
├── main/        # Electron main process (Node.js)
├── preload/     # Context bridge between main and renderer
└── renderer/    # React app (browser context)
    └── src/
        ├── components/
        ├── pages/
        ├── posture/    # Pure pose-math, no UI/Electron imports
        ├── hooks/
        ├── lib/
        └── i18n/
```

See [`docs/TECHNICAL_SPEC.md`](docs/TECHNICAL_SPEC.md) for the full system design and [`plan.md`](plan.md) for current progress.

## Path alias

Inside the renderer, import from `@/...` — it resolves to `src/renderer/src/`.

```ts
import { Button } from '@/components/Button'
```

## License

Academic project — see repository for details.
