# PosturePal — Technical Specification

## 1. Project Overview

PosturePal is a privacy-first, real-time posture monitoring system that uses computer vision to detect poor sitting posture and provide instant feedback. The system runs entirely on the user's local machine using a standard webcam — no images leave the device.

**Target users:** Software developers, office workers, students, remote workers who spend 4+ hours daily at a computer.

**Core value proposition:**
- Zero hardware cost beyond standard webcam
- Fully local processing (privacy-preserving)
- Real-time feedback to prevent rather than treat musculoskeletal issues
- Multi-parameter assessment (CVA, shoulder asymmetry, ear-shoulder-hip alignment)

## 2. System Architecture

### 2.1 High-Level Components

```
┌─────────────────────────────────────────────┐
│         Marketing Website (Next.js)         │
│  Landing page, features, download links     │
└─────────────────────┬───────────────────────┘
                      │ download
                      ▼
┌─────────────────────────────────────────────┐
│       Desktop Application (Electron)        │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  Renderer Process (React + TS)        │  │
│  │  - Webcam capture                     │  │
│  │  - MediaPipe Pose detection           │  │
│  │  - Posture calculations               │  │
│  │  - UI (status, dashboard, settings)   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  Main Process (Electron + Node)       │  │
│  │  - Window management                  │  │
│  │  - System tray                        │  │
│  │  - Native notifications               │  │
│  │  - SQLite database                    │  │
│  │  - IPC handlers                       │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 2.2 Technology Stack

**Desktop Application:**
- Electron 30+ (latest stable)
- React 18 + TypeScript 5
- Vite (build tool)
- Tailwind CSS 3 (styling)
- shadcn/ui (component library)
- @mediapipe/tasks-vision (pose detection)
- better-sqlite3 (local database)
- Recharts (statistics charts)
- i18next + react-i18next (internationalization)
- Vitest (testing)
- electron-builder (packaging)

**Marketing Website:**
- Next.js 14 (App Router)
- React 18 + TypeScript 5
- Tailwind CSS 3
- shadcn/ui
- next-intl (internationalization)
- Vercel (deployment)

### 2.3 Project Structure

**Desktop repo (`posturepal-desktop`):**
```
posturepal-desktop/
├── CLAUDE.md                    # Claude Code instructions
├── plan.md                      # Progress tracking
├── README.md
├── package.json
├── electron.vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── electron-builder.yml
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts
│   │   ├── tray.ts
│   │   ├── notifications.ts
│   │   ├── database.ts
│   │   └── ipc.ts
│   ├── preload/                 # Preload scripts
│   │   └── index.ts
│   └── renderer/                # React app
│       ├── index.html
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/
│       │   ├── ui/              # shadcn components
│       │   ├── WebcamView.tsx
│       │   ├── SkeletonOverlay.tsx
│       │   ├── StatusIndicator.tsx
│       │   ├── CalibrationFlow.tsx
│       │   └── ...
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Dashboard.tsx
│       │   ├── Settings.tsx
│       │   └── Onboarding.tsx
│       ├── posture/             # Pure logic, NO UI
│       │   ├── calculations.ts
│       │   ├── thresholds.ts
│       │   ├── smoothing.ts
│       │   ├── calibration.ts
│       │   └── __tests__/
│       ├── hooks/
│       │   ├── useWebcam.ts
│       │   ├── usePoseDetection.ts
│       │   └── usePostureMonitor.ts
│       ├── lib/
│       │   ├── ipc.ts
│       │   └── utils.ts
│       └── i18n/
│           ├── index.ts
│           ├── en.json
│           └── tr.json
└── resources/
    ├── icon.png
    └── tray-icon.png
```

**Web repo (`posturepal-web`):**
```
posturepal-web/
├── CLAUDE.md
├── plan.md
├── README.md
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── messages/
│   ├── en.json
│   └── tr.json
└── src/
    ├── app/
    │   ├── [locale]/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── download/page.tsx
    │   │   └── privacy/page.tsx
    │   └── globals.css
    ├── components/
    │   ├── ui/
    │   ├── Hero.tsx
    │   ├── Features.tsx
    │   ├── HowItWorks.tsx
    │   ├── DownloadSection.tsx
    │   ├── Footer.tsx
    │   └── LanguageSwitcher.tsx
    └── lib/
        └── utils.ts
```

## 3. Posture Detection Algorithm

### 3.1 Input
MediaPipe Pose Landmarker provides 33 keypoints. We use the following subset:
- 7: left ear
- 8: right ear
- 11: left shoulder
- 12: right shoulder
- 23: left hip
- 24: right hip

Each keypoint contains: `{ x: number, y: number, z: number, visibility: number }`
Coordinates are normalized to [0, 1] range.

### 3.2 Calculations

**Craniovertebral Angle (CVA):**
```typescript
function calculateCVA(ear: Point, shoulder: Point): number {
  const dx = shoulder.x - ear.x;
  const dy = shoulder.y - ear.y;
  const angleRad = Math.atan2(Math.abs(dy), Math.abs(dx));
  return angleRad * (180 / Math.PI);
}
```
- Threshold: < 48° indicates Forward Head Posture (Kim et al., 2024b)
- Use side that has higher visibility (left or right ear/shoulder)

**Shoulder Asymmetry (normalized):**
```typescript
function calculateShoulderAsymmetry(
  leftShoulder: Point,
  rightShoulder: Point
): number {
  const yDiff = Math.abs(leftShoulder.y - rightShoulder.y);
  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
  return (yDiff / shoulderWidth) * 100; // percentage
}
```
- Threshold: > 5% indicates significant asymmetry
- Note: We use percentage of shoulder width, NOT raw pixels (camera-distance-independent)

**Ear-Shoulder-Hip Alignment:**
```typescript
function calculateAlignmentAngle(
  ear: Point,
  shoulder: Point,
  hip: Point
): number {
  const v1 = { x: ear.x - shoulder.x, y: ear.y - shoulder.y };
  const v2 = { x: hip.x - shoulder.x, y: hip.y - shoulder.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
  const cosAngle = dot / (mag1 * mag2);
  return Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
}
```
- Threshold: < 160° indicates spinal curvature

### 3.3 Calibration

On first launch, capture a 5-second baseline:
```typescript
interface BaselineProfile {
  cva: number;              // user's normal CVA
  shoulderAsymmetry: number; // user's natural asymmetry
  alignment: number;         // user's normal alignment
  capturedAt: ISOString;
  sampleCount: number;
}
```

The capture pipeline rejects baselines that fall outside the clinical
healthy range (§3.6) and asks the user to recalibrate. An "advanced
override" path exists but requires confirmation — the clinical safety
layer (§3.6) still catches breaches even if the baseline is permitted.

### 3.4 Two-Layer Hybrid Classification

Status is the WORST verdict from two independent layers run in parallel.

```
                            ┌──────────────────────────┐
        smoothed metrics ──▶│ LAYER 1: Clinical        │── status_clin ─┐
                            │ (research-backed         │                │
                            │  absolute thresholds)    │                │
                            └──────────────────────────┘                ▼
                                                                  ┌──────────┐
                                                                  │ WORST(.) │── final status
                                                                  └──────────┘
                            ┌──────────────────────────┐                ▲
        smoothed metrics ──▶│ LAYER 2: Personalized    │── status_pers ─┘
        baseline       ──▶ │ (deviation from user's   │
        sensitivity    ──▶ │  captured baseline)      │
                            └──────────────────────────┘
```

This design protects users who calibrated with a poor posture they
believed was "normal" — the clinical layer keeps catching breaches
regardless of baseline. Users can disable the clinical layer in
Settings ("advanced") to fall back to personal-only.

### 3.5 Personalized Layer (Layer 2)

Sensitivity slider sets the deviation tolerance:

| Level  | Warning at | Poor at |
|--------|-----------|---------|
| Low    | 10%       | 20%     |
| Medium | 15%       | 30%     |
| High   | 25%       | 50%     |

For CVA and alignment, deviation is `(baseline - current) / baseline`.
For shoulder asymmetry (where baseline can be near zero), deviation is
`(current - baseline) / 100`. Worst-of-three rule across the metrics
yields the personalized status.

### 3.6 Clinical Layer (Layer 1)

Independent of any user's baseline. Defines a research-backed envelope
of healthy posture.

**Craniovertebral Angle (CVA):**
- Healthy: ≥ 50°
- Warning: 45–49°
- Poor: < 45°

Source: Kim D, Lee H, Park K. (2024b). *Real-time forward head posture
detection using webcam computer vision.* Applied Sciences, 14(7), 2965.
Threshold of 48° + 2° safety margin.

**Shoulder asymmetry (shoulder-width-normalized %):**
- Healthy: < 5%
- Warning: 5–8%
- Poor: > 8%

Source: Cortes et al. (2024). *Sitting posture recognition systems:
comparison of pretrained convolutional neural network models.*

**Ear-shoulder-hip alignment:**
- Healthy: ≥ 165°
- Warning: 155–164°
- Poor: < 155°

Source: Moreira et al. (2022). *A computer vision-based mobile tool for
assessing human posture: a validation study.*

The clinical classifier returns a per-metric breakdown (`{ cva,
shoulderAsymmetry, alignment }`) plus the overall worst status and the
worst-ranked metric, so the UI can name *which* metric pulled the user
out of the safe range.

### 3.7 Smoothing & Hysteresis

### 3.7 Smoothing & Hysteresis (continued)

To prevent false positives:
1. **Sliding window:** Average values over last 3 seconds (90 frames at 30fps)
2. **Hysteresis:** Status changes require 5+ consecutive seconds of new state
3. **Visibility filter:** Only use frames where visibility > 0.5

### 3.5 Status Classification

```typescript
type PostureStatus = 'good' | 'warning' | 'poor';

// Status determined by which thresholds are breached:
// good:    All metrics within tolerance
// warning: One metric breached for 5-10 seconds
// poor:    One+ metrics breached for >10 seconds
```

## 4. Data Schema (SQLite)

```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE baseline (
  id INTEGER PRIMARY KEY,
  cva REAL NOT NULL,
  shoulder_asymmetry REAL NOT NULL,
  alignment REAL NOT NULL,
  captured_at TEXT NOT NULL
);

CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  total_duration_seconds INTEGER DEFAULT 0,
  good_seconds INTEGER DEFAULT 0,
  warning_seconds INTEGER DEFAULT 0,
  poor_seconds INTEGER DEFAULT 0
);

CREATE TABLE posture_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  timestamp TEXT NOT NULL,
  cva REAL,
  shoulder_asymmetry REAL,
  alignment REAL,
  status TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE INDEX idx_snapshots_session ON posture_snapshots(session_id);
CREATE INDEX idx_snapshots_timestamp ON posture_snapshots(timestamp);
```

**Snapshot strategy:** Save snapshot every 30 seconds (not every frame) to prevent DB bloat. ~2,880 rows per 24h session.

## 5. UX Flow

### 5.1 First Launch
1. Welcome screen → explain what the app does
2. Camera permission prompt
3. Calibration: "Sit naturally and look at your screen for 5 seconds"
4. Baseline captured → "You're all set!"
5. Main monitoring view

### 5.2 Main View
- Live webcam feed (small, top-right) with skeleton overlay
- Large status indicator (green / yellow / red)
- Current metrics: CVA value, asymmetry %, alignment angle
- "Today" stats: time in good/warning/poor posture

### 5.3 Notifications
- Yellow status: subtle visual cue in app (no notification)
- Red status: native OS notification + optional sound
- Cooldown: max 1 notification per 5 minutes (no spam)

### 5.4 Settings
- Camera selection (if multiple)
- Sensitivity slider (adjusts threshold tolerances)
- Language: English / Türkçe
- Sound on/off
- Start at system boot
- Reset calibration

### 5.5 Dashboard
- Today: timeline of posture status
- This week: bar chart of good vs poor minutes per day
- All time: cumulative stats

## 6. Internationalization

Two locales: `en` (default), `tr`.

Translation file structure:
```json
{
  "common": {
    "appName": "PosturePal",
    "save": "Save",
    "cancel": "Cancel"
  },
  "onboarding": {
    "welcome": "Welcome to PosturePal",
    "cameraPermission": "We need camera access..."
  },
  "status": {
    "good": "Good posture",
    "warning": "Adjust your posture",
    "poor": "Poor posture detected"
  }
}
```

## 7. Build & Distribution

**electron-builder config:**
- macOS: `.dmg` installer, universal binary (Intel + Apple Silicon)
- Windows: `.exe` NSIS installer, x64
- Code signing: skipped for academic prototype (document this in README)
- Auto-updates: not implemented in MVP

**Distribution:**
- GitHub Releases for installers
- Marketing site links to latest GitHub Release

## 8. Privacy & Security

**Hard guarantees:**
- No image data leaves the device, ever
- No network calls during normal operation
- No telemetry, analytics, or tracking
- All data stored locally in SQLite
- User can export or delete all their data anytime

**Permissions requested:**
- Camera (required)
- Notifications (optional)
- Auto-launch at boot (optional)

## 9. Testing Strategy

**Unit tests (Vitest):**
- All functions in `src/posture/` must have tests
- Mock keypoint inputs, verify angle calculations
- Edge cases: missing keypoints, low visibility

**Integration tests:**
- Calibration flow end-to-end
- Database read/write cycles

**Manual test checklist:**
- Camera permission denial path
- Multiple monitors setup
- User leaves chair (no person detected)
- Wearing glasses, hat, or having long hair
- Low light conditions
- 30-minute continuous session (memory leaks)

## 10. Performance Targets

- CPU usage: < 15% on Intel i5 8th gen (idle: < 3%)
- RAM: < 250 MB
- Pose detection FPS: 25-30
- App startup time: < 3 seconds
- Battery impact: minimal (target: < 5% extra drain per hour)

## 11. Out of Scope (V2 Features)

These are explicitly NOT in the MVP:
- Cloud sync / account system
- Mobile app companion
- Pomodoro / break reminders
- Stretching exercise suggestions
- Multi-user profiles
- Auto-update mechanism
- Code signing & notarization
- Telemetry / analytics
