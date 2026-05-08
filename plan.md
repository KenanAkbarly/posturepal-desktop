# PosturePal — Implementation Plan

**Deadline:** May 11, 2026
**Started:** May 7, 2026
**Days available:** 4

---

## Status Legend
- 🔴 Not started
- 🟡 In progress
- 🟢 Done
- ⏸️ Blocked / paused

---

## Day 1 — Foundation (May 8)

### Morning: Setup & Skeleton
- 🟢 Initialize Electron + Vite + React + TS project (electron-vite template) — 2026-05-07
- 🟢 Configure Tailwind CSS and install shadcn/ui — 2026-05-07
- 🟢 Set up TypeScript strict mode and path aliases (`@/`) — 2026-05-07
- 🟢 Configure Vitest for unit testing — 2026-05-07
- 🟢 Verify empty app launches with "Hello PosturePal" screen — 2026-05-07
- 🟢 Commit: initial scaffold — 2026-05-07

### Midday: Webcam + MediaPipe Integration
- 🟢 Install @mediapipe/tasks-vision — 2026-05-07
- 🟢 Configure WASM file bundling (electron-vite config) — 2026-05-07 (publicDir → resources/, postinstall copies WASM)
- 🟢 Add CSP headers allowing wasm-unsafe-eval — 2026-05-07
- 🟢 Implement `useWebcam` hook (request permission, get stream, handle errors) — 2026-05-07
- 🟢 Create `WebcamView` component with live preview — 2026-05-07
- 🟢 Initialize PoseLandmarker with full model — 2026-05-07 (postinstall downloads from Google CDN)
- 🟢 Implement `usePoseDetection` hook (run detection on each frame) — 2026-05-07
- 🟢 Create `SkeletonOverlay` component (canvas drawing keypoints + connections) — 2026-05-07
- 🟢 Verify 33 keypoints detected at 25-30 FPS — 2026-05-07 (Graph successfully started running, GPU delegate)

### Evening: Posture Calculations
- 🟢 Create `src/renderer/src/posture/types.ts` (Point, Keypoints, etc.) — 2026-05-07
- 🟢 Implement `calculateCVA(ear, shoulder)` in `calculations.ts` — 2026-05-07
- 🟢 Implement `calculateShoulderAsymmetry(left, right)` (normalized!) — 2026-05-07
- 🟢 Implement `calculateAlignmentAngle(ear, shoulder, hip)` — 2026-05-07
- 🟢 Add visibility filter helpers (use side with higher visibility) — 2026-05-07 (`getMostVisibleSide`)
- 🟢 Write unit tests for all 3 calculations (`__tests__/calculations.test.ts`) — 2026-05-07 (17 tests)
- 🟢 Commit: posture calculations module with tests — 2026-05-07

---

## Day 2 — Core Logic & UX (May 9)

### Morning: Calibration & Smoothing
- 🟢 Create `calibration.ts` — captures 5-second baseline — 2026-05-07
- 🟢 Implement sliding window smoothing (3-second buffer) — 2026-05-07 (90 frames @ 30fps)
- 🟢 Implement hysteresis logic (5+ second state confirmation) — 2026-05-07
- 🟢 Create `usePostureMonitor` hook combining detection + calculation + smoothing — 2026-05-07
- 🟢 Build `CalibrationFlow` component (countdown UI) — 2026-05-07
- 🟢 Tests for calibration and smoothing — 2026-05-07 (12 tests)

### Midday: Alarms & Feedback
- 🟢 Define `PostureStatus` type and status classifier — 2026-05-07
- 🟢 IPC handler in main process for native notifications — 2026-05-07
- 🟢 IPC handler for system sound playback — 2026-05-07 (`shell.beep`)
- 🟢 Implement notification cooldown (max 1 per 5 min) — 2026-05-07 (main + renderer belt-and-suspenders)
- 🟢 Wire up status changes to trigger alarms — 2026-05-07 (`useStatusAlerts`)
- 🟢 Create `StatusIndicator` component (large green/yellow/red display) — 2026-05-07

### Evening: UI & Settings
- 🟢 Build main monitoring view (skeleton overlay + status + metrics) — 2026-05-07
- 🟢 Build Settings page (camera select, sensitivity, language, sound) — 2026-05-07
- 🟢 System tray with minimize-to-tray behavior — 2026-05-07
- 🟡 IPC for settings persistence — in-memory store wired 2026-05-07; SQLite persistence Day 3
- 🟢 Commit: working MVP without database — 2026-05-07

### Day 2 Addendum: Hybrid Classification (Clinical + Personalized)
- 🟢 Hybrid classification (clinical + personalized) — clinical safety layer added — 2026-05-08
  - `posture/clinical-thresholds.ts` — research-backed absolute thresholds (Kim 2024b, Cortes 2024, Moreira 2022)
  - `posture/hybrid-classifier.ts` — WORST(clinical, personal) with reason tagging + user-facing details
  - Calibration safety check: rejects baselines outside clinical healthy zone with retry / advanced-override flow
  - StatusIndicator surfaces reason badges (clinical / personal) and contextual details
  - Settings toggle: "Use clinical safety layer" (default ON)
  - 42 new tests (26 clinical + 16 hybrid); 93/93 total green

---

## Day 3 — Data Layer & Marketing Site (May 10)

### Morning: SQLite Integration
- 🟢 Install better-sqlite3, configure for Electron — 2026-05-08 (electron-rebuild for ABI 140)
- 🟢 Create database initialization in main process — 2026-05-08 (`src/main/database.ts`)
- 🟢 Implement schema migrations — 2026-05-08 (versioned MIGRATIONS array, idempotent)
- 🟢 IPC handlers: insertSnapshot, getSessionStats, getDailyStats — 2026-05-08 (11 DB channels, namespaced under `window.api.db.*`)
- 🟢 Save snapshots every 30s (not every frame) — 2026-05-08 (`useSnapshotPersistence` hook, session lifecycle)
- 🟢 Build Dashboard page with Recharts — 2026-05-08
- 🟢 Today timeline view + this-week bar chart — 2026-05-08 (stacked bars, ResponsiveContainer, auto-refresh 30s)

### Midday: i18n & Build
- 🟢 Install and configure i18next — 2026-05-08
- 🟢 Create `en.json` and `tr.json` translation files — 2026-05-08 (88 keys, 7 namespaces)
- 🟢 Wire all strings through translation — 2026-05-08 (all components + pages; hybrid-classifier emits structured `{key, values}` for testability)
- 🟢 Language switcher in Settings — 2026-05-08 (DB-persisted via Part 1 store)
- 🟢 Configure electron-builder for macOS (.dmg) and Windows (.exe) — 2026-05-08 (hardenedRuntime, NSCameraUsageDescription, asarUnpack resources/**)
- 🟢 Test production build on macOS — 2026-05-08 (`dist/posturepal-desktop-0.0.1.dmg` 168 MB, signed with local Apple Development cert, notarization skipped per academic-prototype policy)
- 🔴 Test production build on Windows (or VM/cross-compile) — deferred to Day 4

### Evening: Marketing Site
- 🔴 Initialize Next.js 14 project (separate repo: `posturepal-web`) — *out of scope this session, Day 4 candidate*
- 🔴 Configure Tailwind, shadcn/ui, next-intl
- 🔴 Build Hero, Features, How It Works, Privacy, Download sections
- 🔴 Add language switcher
- 🔴 Both EN and TR translations complete
- 🔴 Responsive on mobile

---

## Day 4 — Deploy, Polish, Demo (May 11)

### Morning: Deployment
- 🔴 Push to GitHub: posturepal-desktop and posturepal-web
- 🔴 Create GitHub Release with .dmg and .exe
- 🔴 Deploy marketing site to Vercel
- 🔴 Update download links to point to release
- 🔴 E2E test: visit site → download → install → run app

### Midday: Academic Materials
- 🔴 Record 1-2 minute demo video (screen recording)
- 🔴 Take 6-8 screenshots for documentation
- 🔴 Write README.md for both repos
- 🔴 Add "Academic Use Notice" to README
- 🔴 Update technical spec if anything diverged

### Evening: Final Polish
- 🔴 Run through manual test checklist (see TECHNICAL_SPEC.md §9)
- 🔴 Fix any critical bugs found
- 🔴 Final commit and tag (v1.0.0)
- 🔴 Submit to instructor

---

## Backlog (V2 — after deadline)

These features are explicitly OUT of MVP:
- Auto-update mechanism
- Code signing & notarization
- Cloud sync / accounts
- Pomodoro / break reminders
- Stretching exercise suggestions
- Mobile app
- Multi-user profiles
- Telemetry / analytics
- Light/dark theme toggle
- Custom alarm sounds

---

## Decisions Log

Track non-trivial decisions here so they're not re-litigated:

| Date | Decision | Reason |
|------|----------|--------|
| 2026-05-07 | Electron over Tauri | Faster development, prior experience |
| 2026-05-07 | MediaPipe JS over Python sidecar | Sufficient for MVP, simpler deployment |
| 2026-05-07 | No backend in MVP | Time constraint, supports privacy story |
| 2026-05-07 | Save snapshots every 30s | Balance granularity vs DB size |
| 2026-05-07 | Use shoulder-width-normalized asymmetry | Camera-distance-independent |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| MediaPipe WASM bundling issues in Electron | Medium | Have fallback config ready, allocate 2h buffer Day 1 |
| Windows build fails from macOS | Medium | Use GitHub Actions to build on Windows runner |
| Pose detection too slow on older hardware | Low | Reduce model size (lite vs full) |
| Camera permission UX unclear | Medium | Explicit onboarding screen explains why |
| Calibration captures bad pose | High | Allow re-calibration in settings, show preview |
