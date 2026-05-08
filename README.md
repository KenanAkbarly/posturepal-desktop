# PosturePal Desktop

Privacy-first, real-time posture monitoring desktop app. Uses your webcam + on-device computer vision (MediaPipe Pose) to detect Forward Head Posture, shoulder asymmetry, and ear–shoulder–hip misalignment. **No image data ever leaves your machine.**

Built with Electron, React 19, TypeScript, Tailwind CSS, shadcn/ui, MediaPipe, SQLite, i18next, Vitest.

## Highlights

- **Two-layer hybrid classification** — every status verdict is the WORST of:
  - **Personalized** — deviation from your captured baseline (sensitivity Low / Medium / High)
  - **Clinical** — research-backed absolute thresholds from Kim et al. 2024b (CVA), Cortes et al. 2024 (asymmetry), Moreira et al. 2022 (alignment)
  - Calibration safety check rejects baselines outside the clinical healthy range, with a documented "skip anyway" override for advanced users.
- **Local SQLite persistence** — settings, baseline, sessions, and 30-second posture snapshots stored in `userData/posturepal.db`. Daily timeline + 7-day stacked-bar dashboard driven by the DB.
- **i18n** — English and Türkçe locales, hot-switchable from Settings.
- **System tray + native notifications** — minimize-to-tray, status indicator in menubar, OS-native posture alerts with 5-minute cooldown.

## Requirements

- Node.js ≥ 20
- npm ≥ 10
- macOS or Windows
- A webcam

## Development

```bash
# Install dependencies (also runs electron-builder install-app-deps to
# rebuild native modules for Electron's ABI, and downloads the
# MediaPipe model into resources/models/)
npm install

# Start the app in development (hot reload)
npm run dev

# Run unit tests (renderer + pure-TS posture modules)
npm test

# Run database integration tests (rebuilds better-sqlite3 for Node ABI,
# runs the DB suite, then rebuilds back for Electron)
npm run test:db

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
npm run build:mac     # .dmg (arm64 by default)
npm run build:win     # .exe (NSIS)
npm run build:linux   # AppImage / deb / snap
```

Build artifacts land in `dist/`.

### Academic prototype distribution notes

This build is **unsigned and unnotarized** — that's intentional for an academic prototype. The user-facing implication on each platform:

- **macOS:** When opening the `.dmg` for the first time, macOS Gatekeeper will refuse to launch. Right-click the app → "Open" → confirm. After that first run, it launches normally. Users may also need to grant camera permission and (separately) notification permission on first prompt.
- **Windows:** SmartScreen will warn that the publisher is unverified — click "More info" → "Run anyway".

Code signing + notarization are listed in the V2 backlog and are gated by Apple Developer / Windows Authenticode certificates that aren't provisioned for this academic build.

### Universal macOS binary

The current `electron-builder.yml` ships only the host arch (`arm64`) of the macOS build to keep CI/build time reasonable. To produce a universal binary covering both Apple Silicon and Intel, change the `mac.target` block to:

```yaml
mac:
  target:
    - target: dmg
      arch:
        - arm64
        - x64
```

This roughly doubles build time and disk footprint, but yields a single `.dmg` that works on any Mac.

## Project structure

```
src/
├── main/              # Electron main process (Node.js)
│   ├── index.ts
│   ├── ipc.ts
│   ├── notifications.ts
│   ├── tray.ts
│   ├── database.ts    # better-sqlite3 + migrations
│   └── __tests__/
├── preload/           # Context bridge
│   ├── channels.ts
│   ├── index.ts       # window.api.{notifyPosture, db.*, tray.*, ...}
│   └── index.d.ts
└── renderer/          # React app (browser context)
    └── src/
        ├── components/  # incl. shadcn ui/, WebcamView, SkeletonOverlay,
        │                #       CalibrationFlow, StatusIndicator, BaselineCard,
        │                #       StatusBarChart
        ├── pages/       # Home, Onboarding, Dashboard, Settings
        ├── posture/     # Pure TS — calculations, smoothing, calibration,
        │                #            clinical-thresholds, hybrid-classifier
        ├── hooks/       # useWebcam, usePoseDetection, usePostureMonitor,
        │                # useSnapshotPersistence, useStatusAlerts,
        │                # useDashboardData, useLanguageSync
        ├── lib/         # cn(), ipc, settingsStore, settingsHydration,
        │                # mediapipe
        └── i18n/        # index.ts, en.json, tr.json
```

See [`docs/TECHNICAL_SPEC.md`](docs/TECHNICAL_SPEC.md) for the full system design and [`plan.md`](plan.md) for current progress.

## Path alias

Inside the renderer, import from `@/...` — it resolves to `src/renderer/src/`.

```ts
import { Button } from '@/components/Button'
```

## License

Academic project — see repository for details.
