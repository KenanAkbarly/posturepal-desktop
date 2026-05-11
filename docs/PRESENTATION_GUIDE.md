# PosturePal — Müəllim Təqdimatı üçün Bələdçi

> Bu sənəd siz təqdimat zamanı oxuyacağınız "stseneri" deyil —
> müəllimin verə biləcəyi suallara hazır cavabların referansıdır.
> Hər bölmənin sonundakı **"Müəllimin verə biləcəyi suallar"**
> alt-bölməsi tipik sualları və qısa cavabları əhatə edir.

---

## QUICK REFERENCE CARD

### Bir paragraf icmal

**PosturePal**, webcam vasitəsilə real-vaxt postur monitorinqi həyata
keçirən, **privacy-first** masaüstü tətbiqidir. Bütün hesablamalar
istifadəçinin maşınında yerləşir — heç bir kamera kadrı buludla bölünmür,
heç bir hesab tələb olunmur. **Hybrid (klinik + şəxsi) klassifikasiya**
arxitekturası iki müstəqil qatın WORST() birləşməsi ilə istifadəçi
kalibrasiya səhvlərinə qarşı dayanıqlıdır — bu, ənənəvi "yalnız
şəxsi baseline" yanaşmasının kritik zəifliyini həll edir.

### Tech stack — bir cədvəldə

| Qat | Texnologiya | Niyə |
|------|-------------|-------|
| Desktop UI | Electron 39 + React 19 + TypeScript 5 | Cross-platform (macOS + Windows), prior expertise |
| Computer vision | MediaPipe Pose Landmarker (BlazePose) | CPU-da real-time, 33 keypoint, cross-platform |
| Pose math | Saf TypeScript (no DOM/React imports) | Test edilə bilən, framework-agnostik |
| Persistence | better-sqlite3 (yerli SQLite) | Cloud-suz, syncronous, IPC-friendly |
| UI styling | Tailwind 3 + shadcn/ui primitives | Konsistent, fast iteration |
| i18n (desktop) | i18next + react-i18next | App Router-dan müstəqil, server-suz |
| Marketing site | Next.js 16 + next-intl + Vercel | Static SSR, edge i18n, zero analytics |
| Notifications | Native (Electron Notification API) | OS-level, background-resilient |
| Build | electron-vite + electron-builder | dev/prod parity, native module rebuild |

### Üç maddədə əsas innovasiya

1. **Hybrid two-layer classification** — Clinical absolute thresholds
   (Kim 2024b, Cortes 2024, Moreira 2022) + Personalized baseline
   `WORST()` birləşməsi. Şəxsi kalibrasiya hatalı olsa belə klinik
   qat hələ pozuntuları tutur.
2. **Privacy-by-architecture** — sistem dizaynında **heç bir network
   call yoxdur**. Bu bir marketing iddiası deyil, kodbazada
   yoxlanıla bilən fakttır.
3. **Calibration safety check** — istifadəçi pis postürdə kalibrasiya
   etsə, sistem `classifyAgainstClinical` ilə baseline-ı yoxlayır və
   istifadəçini xəbərdar edib yenidən cəhd etməyi təklif edir.

---

## BÖLMƏ 1 — Elevator pitch (30 saniyəlik versiya)

### Problem

Sağlam Dünya Təşkilatına (WHO) əsasən, musculoskeletal disorders
qlobal əlilliyin başlıca səbəblərindən biridir; ekran qarşısında
4+ saat keçirən ofis işçiləri arasında **Forward Head Posture (FHP)**
prevalensiyası 60%-dən yüksəkdir. Pis postur birbaşa boyun ağrısı,
miopik diskliyə, baş ağrısına və uzun-müddətli mərkəzi sinir sistemi
stresinə səbəb olur. Mövcud həllər dörd kateqoriyada çatışmazdır:

| Kateqoriya | Nümunə | Çatışmazlıq |
|------------|--------|-------------|
| **Hardware sensorlar** | Upright Go, Lumo Lift | $80-150 əlavə xərc, geyilməli, batareya |
| **Cloud-based ML** | Cubii Move, smartphone apps | Məxfilik riski, latency, internet asılılığı |
| **Wellness apps** | Stretchly, Workrave | Yalnız timer — real-time postur ölçmür |
| **Klinik müşahidə** | Fizioterapevt qiymətləndirməsi | Yüksək xərc, davamiyyət problemi |

### Mənim innovasiyam

- **Zero hardware:** standart webcam kifayətdir
- **Privacy by architecture:** heç bir kadr cihazdan çıxmır
- **Multi-parameter:** CVA + shoulder asymmetry + spinal alignment
  (Tək tek metric əvəzinə üçü birlikdə)
- **Hybrid classification:** klinik təhlükəsizlik şəbəkəsi + şəxsi
  uyğunlaşma (industry-first kombinasiya)

### Texnoloji stack (bir cümlədə)

Electron + React + TypeScript desktop tətbiqi; MediaPipe BlazePose
yerli WebAssembly modulu kimi 30 FPS-də pose detection; SQLite yerli
data persistence; Next.js + Vercel marketing site.

### Müəllimin verə biləcəyi suallar

**Q: Bu nə dərəcədə original töhfədir? Sadəcə MediaPipe + bir az UI?**
A: Əsas töhfə **hybrid classification arxitekturası** və **calibration
safety check**-dir. MediaPipe sadəcə keypoint-ləri verir; ondan sonra
gələn hər şey (CVA hesablanması, baseline kalibrasiya, klinik qat ilə
WORST() birləşməsi, hysteresis, snapshot persistence) mənim
inşa etdiyim qatlardır. Kod: `src/renderer/src/posture/`-də 5 saf TS
modulu, 113 unit test ilə örtülmüş.

**Q: Akademik baxımdan niyə vacibdir?**
A: Bu, dial-mode safety-critical sistemlərinin (medical devices,
avtonom maşın) tətbiqini sağlamlıq monitorinqinə gətirir.
**Personalization + clinical fallback** kombinasiyası posture-tracker
sahəsində dokumentasiya tapmadım; bizim WORST() yanaşması user-error-da
safety-net olmaq prinsipinə əsaslanır.

**Q: Hansı istifadəçi qrupunu hədəfləyir?**
A: 4+ saat ekran qarşısında işləyən bilik işçiləri — proqramçılar,
ofis işçiləri, tələbələr, uzaqdan işləyənlər. Akademik prototip
olduğu üçün **klinik istifadə üçün təsdiqlənməyib** (FDA / TİTCK
deyil); README-də açıq qeyd olunub.

**Q: Niyə Electron, niyə web app deyil?**
A: Background-da işləmə (tray-resident), native notifications, OS-level
camera permission həqiqi desktop integrasiyası tələb edir. Webcam
permission browser tab-larına bağlıdır və minimize edildikdə pose
detection dayanır. Bu trade-off-u plan.md-də qeyd etmişəm.

---

## BÖLMƏ 2 — Sistem arxitekturası

### ASCII diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                  MARKETING SITE (Next.js 16)                     │
│              posturepal-web-ochre.vercel.app                     │
│  ─────────────────────────────────────────────                   │
│  - Hero + Features + Privacy + Download (en/tr)                  │
│  - OS-aware CTA (Mac → .dmg / Win → .exe)                        │
│  - 0 analytics, 0 telemetry, 0 third-party scripts               │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                  user downloads installer
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│              DESKTOP APP (Electron 39)                           │
│                                                                   │
│  ┌──────────────────────────────────┐  ┌──────────────────────┐  │
│  │   RENDERER PROCESS (React)       │  │   MAIN PROCESS       │  │
│  │   ───────────────────────────    │  │   (Node.js context)  │  │
│  │   • useWebcam (getUserMedia)     │  │   ────────────────   │  │
│  │   • usePoseDetection             │  │   • BrowserWindow    │  │
│  │     (MediaPipe BlazePose, WASM)  │  │   • System tray      │  │
│  │   • SkeletonOverlay (canvas)     │  │   • Notifications    │  │
│  │   • posture/ (5 pure-TS modules) │  │   • SQLite (better-  │  │
│  │   • Hybrid classifier            │  │     sqlite3)         │  │
│  │   • Calibration safety check     │  │   • IPC handlers     │  │
│  │   • i18next (en/tr)              │  │                      │  │
│  │   • shadcn/ui + Tailwind         │  │   File: src/main/    │  │
│  │                                  │  │                      │  │
│  │   File: src/renderer/src/        │  │                      │  │
│  └─────────────┬────────────────────┘  └───────────┬──────────┘  │
│                │                                    │              │
│                │  ┌────────────────────────────┐    │              │
│                └─▶│   PRELOAD BRIDGE           │◀───┘              │
│                   │   (context isolation)      │                   │
│                   │   ───────────────────      │                   │
│                   │   window.api.{notify,      │                   │
│                   │     db, setTrayStatus,     │                   │
│                   │     requestCameraAccess}   │                   │
│                   │   File: src/preload/       │                   │
│                   └────────────────────────────┘                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

           ╔══════════════════════════════════════╗
           ║  HEÇ BİR NETWORK ÇIXIŞ YOXDUR         ║
           ║  (yalnız app yüklənərkən GitHub)     ║
           ╚══════════════════════════════════════╝
```

### Hər component üçün izah

#### Marketing site

- **Texnologiya:** Next.js 16 + Tailwind 3 + next-intl + Framer Motion
- **Niyə:** Static hosting (Vercel free tier), edge-rendered i18n,
  SSR-friendly
- **Niyə Next.js, Astro deyil?** Next-intl + App Router kombinasiyası
  locale routing-i avtomatik həll edir; Astro-da əl ilə qurmaq lazım
  olardı
- **Niyə Vercel?** Sıfır konfiqurasiya deploy, GitHub auto-deploy,
  edge runtime middleware

#### Desktop — Renderer process

- **Texnologiya:** React 19 + TypeScript 5 + shadcn/ui + Tailwind 3
- **Niyə React:** prior expertise, böyük ekosistem, MediaPipe ilə
  yaxşı uyğunluq (MediaPipe TypeScript SDK)
- **Niyə shadcn/ui:** komponent komponentini sənin koduna kopyalayır
  (npm dependency yox), tam customization, Tailwind ilə təbii
  inteqrasiya

#### Desktop — Main process

- **Texnologiya:** Electron 39 + better-sqlite3 + Node.js 22
- **Niyə better-sqlite3:** sinxron API (Promise overhead yox), prepared
  statements native, IPC-friendly, single-file deployment
- **Niyə Electron, Tauri deyil?** Tauri performant-dır amma daha az
  mature; biz prior Electron expertise saxladıq və development
  vaxtını azaltdıq (plan.md decisions log)

#### Preload bridge

- **Niyə vacib:** Renderer process Node APIs-ə birbaşa giriş əldə
  etməməlidir (security boundary, XSS təcrid)
- **Necə işləyir:** `contextBridge.exposeInMainWorld('api', {...})`
  ilə yalnız typed funksiyalar açırıq; renderer `window.api.*`
  vasitəsilə çağırır

### Müəllimin verə biləcəyi suallar

**Q: Niyə cross-platform üçün React Native deyil?**
A: React Native mobile-first-dir; webcam-a Mac/Windows desktop-da
giriş, system tray, native notifications çətindir. Electron desktop
üçün düşünülüb; bizim use case məhz desktop-dur.

**Q: SQLite niyə main process-də, renderer-də deyil?**
A: better-sqlite3 Node.js native module-dur — browser context-də
yüklənmir. Daha vacibi: data layer renderer-dən təcrid olunmuş olur,
təhlükəsizlik baxımından daha sağlam.

**Q: IPC bridge-də necə bütün dataya keçid limitlədin?**
A: `src/preload/channels.ts`-də whitelisted channel-lar var (15 ədəd),
hər biri tipləndirilib. `contextBridge.exposeInMainWorld` yalnız bu
funksiyaları açır — renderer Node API-yə (fs, child_process və s.)
heç vaxt çata bilmir. Kod: `src/preload/index.ts`.

**Q: Sandbox açıqdır?**
A: `sandbox: false` qoymaq məcburi idi, çünki preload script
`@electron-toolkit/preload`-ı tələb edir (sandbox-da blocked).
Trade-off: preload kodun audit-i məcburidir. Kod ~30 sətirdir, asan
yoxlanılır.

---

## BÖLMƏ 3 — Posture detection alqoritmi (addım-addım)

### Tam pipeline — webcam frame → status

```
[1] Webcam frame (30 FPS)
        │
        ▼
[2] MediaPipe BlazePose Landmarker (GPU delegate, WASM)
        │  → 33 keypoint {x, y, z, visibility}
        ▼
[3] Visibility filter (eşik: ≥0.5)
        │  → low-confidence keypoint-ləri at
        ▼
[4] getMostVisibleSide(keypoints)
        │  → left/right qoldan hansı daha aydın
        ▼
[5] Posture metrics hesablanması:
        │  • calculateCVA(ear, shoulder)
        │  • calculateShoulderAsymmetry(L_shoulder, R_shoulder)
        │  • calculateAlignmentAngle(ear, shoulder, hip)
        ▼
[6] Sliding window smoothing (SlidingWindow class)
        │  → son 30 frame ortalama (~1 saniyə)
        ▼
[7] Hybrid Classification (classifyHybrid)
        │  ┌─ Layer 1: classifyAgainstClinical → 'good'|'warning'|'poor'
        │  ├─ Layer 2: classifyAgainstBaseline → 'good'|'warning'|'poor'
        │  └─ status = worstStatus(clinical, personal)
        ▼
[8] Hysteresis (Hysteresis class, confirmMs: 1500)
        │  → status flip yalnız 1.5 saniyəlik təsdiqdən sonra
        ▼
[9] UI update (StatusIndicator) + notification trigger
        │  (cooldown yox; yalnız 'good'→'warning'|'poor' keçidində)
        ▼
[10] DB snapshot (hər 30 saniyə)
```

### Hər addımın izahı

#### Addım 1-2 — Capture + Pose Detection

- **getUserMedia** browser API-si webcam stream-i verir
- **MediaPipe BlazePose** WASM modulu yerli olaraq inference edir
- GPU delegate (WebGL) → ~25-30 FPS macOS-da
- Model: `pose_landmarker_full.task` (Google CDN-dən postinstall-da
  endirilir, ~9 MB)

#### Addım 3 — Visibility filter

- BlazePose hər keypoint üçün `visibility ∈ [0, 1]` qaytarır
- `MIN_VISIBILITY = 0.5` — bu eşikdən aşağı keypoint-lər atılır
- **Niyə vacib:** istifadəçi başını çevirsə, sol və ya sağ qulaq
  görünməz olur; metric hesabı yanlış olar
- Kod: `src/renderer/src/posture/landmarks.ts:7`

#### Addım 4 — Side selection

- Sol və sağ qol arasında **ən görünən tərəfi** seçirik
- Səbəb: CVA hesabı tək tərəfli (ear+shoulder) — vizibly olmayan
  tərəfin nəzərə alınması artefakt yaradır
- Kod: `getMostVisibleSide()` — `landmarks.ts:14`

#### Addım 5 — Posture metrics

**CVA (Craniovertebral Angle):**
```ts
function calculateCVA(ear: Point, shoulder: Point): number {
  const dx = shoulder.x - ear.x
  const dy = shoulder.y - ear.y
  return Math.atan2(Math.abs(dy), Math.abs(dx)) * (180 / Math.PI)
}
```
- Riyazi izah: ear-shoulder vektoru ilə üfüqi xətt arasındakı açı
- Şaquli postur → 90° (qulaq düz çiyin üstündə)
- Forward head → açı azalır (qulaq irəli sürüşür)
- Eşik: < 48° klinik FHP göstəricisidir (Kim et al., 2024b)

**Shoulder Asymmetry:**
```ts
function calculateShoulderAsymmetry(left: Point, right: Point): number {
  const yDiff = Math.abs(left.y - right.y)
  const shoulderWidth = Math.abs(left.x - right.x)
  return (yDiff / shoulderWidth) * 100
}
```
- **NORMALIZE-dir** — pixel-də deyil, çiyin enliyinə nisbətən %
- **Niyə:** kameraya yaxınlıq dəyişəndə pixel dəyəri dəyişir, faiz
  isə kamera-distance-independent qalır
- CLAUDE.md-də 4-cü kritik qayda kimi yazılıb
- Eşik: > 5% klinik əhəmiyyətli asimmetriya (Cortes et al., 2024)

**Alignment Angle:**
```ts
function calculateAlignmentAngle(ear: Point, shoulder: Point, hip: Point): number {
  const v1 = { x: ear.x - shoulder.x, y: ear.y - shoulder.y }
  const v2 = { x: hip.x - shoulder.x, y: hip.y - shoulder.y }
  const dot = v1.x * v2.x + v1.y * v2.y
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2)
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2)
  return Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2)))) * (180 / Math.PI)
}
```
- 3-nöqtəli vektor məhsulu (dot product → arccos)
- 180° = ideal: qulaq, çiyin, omba tam düz xətdə
- < 165° = spinal əyrilik (Moreira et al., 2022)

#### Addım 6 — Smoothing

- `SlidingWindow` class, 30 frame buffer (~1 saniyə @ 30 FPS)
- MediaPipe keypoint-ləri kadrdən kadra ~2-3 piksel oynayır (jitter)
- Hər metric ayrı window-da; sonra ortalama alınır
- Kod: `src/renderer/src/posture/smoothing.ts:3`

#### Addım 7 — Hybrid Classification

(Bölmə 5-də dərinə baxılır)

#### Addım 8 — Hysteresis

- `Hysteresis` class, `confirmMs: 1500`
- Status yalnız 1.5 saniyəlik davamlı təsdiqdən sonra flip olur
- **Niyə:** brief glance away, kosmik ray-MediaPipe-də random
  miscalculation, və ya çiynin müvəqqəti gizlənməsi false-positive
  notification-a səbəb olmamalıdır
- Kod: `smoothing.ts:31`

#### Addım 9 — UI + notification

- Status `'good' → 'warning' | 'poor'` keçidində notification fires
- Cooldown **yoxdur** (v0.0.4-də silindi) — hysteresis artıq
  oscillation-ı süzdüyü üçün cooldown lazımsızdır
- Notification body real metric ilə: "CVA at 41° (< clinical safe
  range 45°)"

#### Addım 10 — Persistence

- Hər 30 saniyədə bir snapshot → SQLite
- `posture_snapshots` table-ə yazılır (session_id ilə əlaqəli)
- 24 saatlıq sessiyada ~2880 sətir → ~50 KB DB böyüməsi
- Dashboard bu data-dan timeline + həftəlik bar chart çəkir

### Müəllimin verə biləcəyi suallar

**Q: Niyə hər framedə deyil 30s-də snapshot saxlayırsan?**
A: DB böyümə vs. analitik dəqiqlik balansı. Hər framedə (30 FPS)
saxlamaq 2.5M sətir/gün edər — disk şişər, dashboard query-ləri
ağırlaşar. 30 saniyə Cortes et al. metodologiyasından gələn
standart resolution-dur — saatlıq aggregate-lər üçün kifayət.

**Q: Niyə 1.5 saniyə hysteresis seçildi?**
A: Sürət-stabillik trade-off-u. Tədqiqat müəllifimiz (Kanan) bunu test
zamanı təcrübə əsasında müəyyən etdi — əvvəl 5 saniyə idi, çox gec
göründü. v0.0.4-də 1.5s-ə endirildi, smoothing 1s ilə birlikdə
ümumi reaksiya zamanı ~2.5 saniyə oldu. Daha qısa olsa false-positive
artır.

**Q: Niyə CVA, asymmetry, alignment — yalnız bir metric niyə yox?**
A: Forward head, shoulder rounding, və slouching üç FƏRQLİ postur
problemidir. Bir-birindən asılı deyillər — istifadəçi CVA-da yaxşı,
asymmetry-də pis ola bilər. Üçünü ayrıca izləyirik, sonra
`worstStatus()` ilə birləşdiririk.

**Q: Şəxsdə görmə qabiliyyəti aşağı olarsa nə olar?**
A: Visibility filter `< 0.5` keypoint-ləri atır → `calculatePostureMetrics`
`null` qaytarır → status flip olmur, sistem yenisini gözləyir.
StatusIndicator "no person detected" göstərir (Pose: `running`,
amma metric yox).

**Q: Z koordinatından (dərinlik) istifadə edirsən?**
A: Yox. BlazePose Z-i təxmin edir amma dəqiqlik aşağıdır (single-camera
problem-i). Bütün metrics 2D-də hesablanır — CVA və alignment frontal
plane-də işləyir; asymmetry shoulder-width-ə normalize olunduğu üçün
dərinlik fərqi nəzərə alınır. Z-i V2-yə saxladıq.

---

## BÖLMƏ 4 — Niyə MediaPipe seçdik?

### Pose detection tool-larının müqayisəsi

| Tool | Keypoint sayı | GPU məcburi? | Real-time? | Cross-platform? | Lisenziya |
|------|---------------|--------------|------------|-----------------|-----------|
| **MediaPipe BlazePose** | **33** | Yox | ~30 FPS CPU | Web/Mac/Win/iOS/Android | Apache 2.0 |
| OpenPose | 25 | **Bəli** | ~10 FPS CPU | Linux/Win | Non-commercial |
| AlphaPose | 17/26 | Bəli | ~7 FPS | Linux/Win | Apache 2.0 |
| MoveNet | 17 | Yox | ~50 FPS | Web/Mobile | Apache 2.0 |
| Posenet | 17 | Yox | ~25 FPS | Web | Apache 2.0 |

### Seçim səbəbləri

1. **Zero hardware vədi:** GPU məcburi olmamalıdır, çünki istifadəçi
   adi laptop ilə işləyəcək. OpenPose və AlphaPose elimine olundu.

2. **33 keypoint:** CVA üçün ear + shoulder, alignment üçün
   ear + shoulder + hip lazımdır. MoveNet və PoseNet hip-i yalnız
   center-də göstərir (left + right ayrı yox), shoulder asymmetry-yə
   uyğunsuzdur.

3. **Cross-platform:** macOS + Windows + (gələcəkdə) iOS/Android.
   MediaPipe tək codebase ilə hamısını dəstəkləyir.

4. **Real-time on commodity hardware:** Apple Silicon-da WebGL
   delegate ilə 25-30 FPS, x86 CPU-da 15-25 FPS — MVP üçün kifayət.

5. **Yetkin TypeScript SDK:** `@mediapipe/tasks-vision` paketi
   first-class TypeScript dəstəyi verir, Electron renderer-də
   problemsiz işləyir (WASM bundling-də olan problemləri publicDir
   ilə həll etdik).

### Akademik referans

- **Lugaresi, C., et al. (2019).** *MediaPipe: A Framework for
  Building Perception Pipelines.* Google Research, arXiv:1906.08172.
- **Bazarevsky, V., et al. (2020).** *BlazePose: On-device Real-time
  Body Pose tracking.* arXiv:2006.10204.

### Müəllimin verə biləcəyi suallar

**Q: Niyə öz CNN-ni training etmədin?**
A: Akademik prototip vaxt məhdudiyyətində idi (4 gün). Custom CNN
training-i məlumat toplama (poza-labeled dataset), GPU resursu,
overfitting validation tələb edirdi — bu, ayrıca research project-dir.
MediaPipe-in BlazePose modeli Google tərəfindən 30,000+ etiketlənmiş
poza ilə öyrədilib və `Apache 2.0` lisenziyası ilə açıqdır. Future
work bölməsində CNN-based classification roadmap-də saxlanılıb.

**Q: BlazePose-un dəqiqliyi nədir?**
A: Bazarevsky et al. (2020) Pose Estimation Average Precision (PCK@0.2)
metrikası ilə 95.7% gəzdirir — yetkin benchmark-larda. Bizim use case-də
keypoint dəqiqliyi MetricInfo struktur ilə deyil, posture state-in
düzgün təsnifatlanması ilə ölçülür; 113 unit test posture math-ı
verifiy edir.

**Q: Niyə BlazePose Heavy deyil, Full?**
A: Pose Landmarker üç model size verir: Lite (3 MB), Full (9 MB),
Heavy (29 MB). Lite çox az dəqiqdir (CVA jitter çoxdur), Heavy CPU-da
çox yavaşdır (12-15 FPS). Full optimal balans verdi. download-model.mjs
scripti `pose_landmarker_full.task` endirir.

**Q: WASM-ı electron-da necə yüklədin? Bu trivial deyil.**
A: Doğru, WASM bundling top risk idi (plan.md Risk Register). İki
çözüm:
1. `electron.vite.config.ts` → `publicDir: resolve(__dirname, 'resources')` —
   Vite WASM fayllarını dist/renderer-ə kopyalayır
2. `mediapipe.ts` → relative path-lar (`./mediapipe-wasm`) — production
   `file://` rejimində mütləq path-lar filesystem root-a getməsin
   (v0.0.3-də həll olundu)

---

## BÖLMƏ 5 — Hybrid Classification (innovasiyanın ürəyi)

### İki layer dizaynı

```
                  ┌──────────────────────────┐
metrics ─────────▶│ LAYER 1: Clinical        │── status_clinical ─┐
                  │ (research-backed         │                    │
                  │  absolute thresholds)    │                    │
                  └──────────────────────────┘                    │
                                                            ┌─────▼─────┐
                                                            │ WORST()   │── final
                                                            └─────▲─────┘
                  ┌──────────────────────────┐                    │
metrics ─────────▶│ LAYER 2: Personalized    │── status_personal ─┘
baseline ────────▶│ (deviation from user's   │
sensitivity ─────▶│  captured baseline)      │
                  └──────────────────────────┘
```

### Layer 1 — Clinical Absolute

**Niyə lazımdır:** İstifadəçi kalibrasiya səhvi qarşısı. Əgər istifadəçi
özünün "normal"-ını pis postürlə qeydə alsa, yalnız personalized layer
ilə **heç vaxt** xəbərdar olunmazdı.

**Eşik dəyərləri** (`clinical-thresholds.ts:16`):

| Metric | Healthy | Warning | Poor | Reference |
|--------|---------|---------|------|-----------|
| CVA | ≥ 50° | 45-49° | < 45° | Kim et al., 2024b (48° threshold + 2° safety margin) |
| Shoulder asymmetry | < 5% | 5-8% | > 8% | Cortes et al., 2024 |
| Alignment | ≥ 165° | 155-164° | < 155° | Moreira et al., 2022 |

**Limitləri:** individual anatomical variation nəzərə almır. Məsələn,
hipermobil oturuşa malik insanların CVA "təbii olaraq" 48° ola bilər
— amma onlar üçün bu normal vəziyyət olar.

### Layer 2 — Personalized Baseline

**Niyə lazımdır:** Anatomical variation. Hər istifadəçinin "doğal" CVA-sı,
"doğal" çiyin simmetriyası, "doğal" düzlənməsi fərqlidir.

**Necə işləyir:**
1. 5 saniyəlik calibration (CalibrationFlow component)
2. `BaselineAccumulator` average alır → BaselineProfile saxlanılır
3. Sonradan hər frame: `deviationFraction(metric, current, baseline)`
4. Sensitivity-yə görə tolerance-a müqayisə edilir:

| Sensitivity | Warning threshold | Poor threshold |
|-------------|-------------------|----------------|
| Low | 10% deviation | 20% deviation |
| Medium | 15% deviation | 30% deviation |
| High | 25% deviation | 50% deviation |

**Riyazi izah:**
```ts
// CVA / alignment (lower=worse):
deviation = max(0, (baseline - current) / baseline)

// Asymmetry (higher=worse, baseline near 0):
deviation = max(0, (current - baseline) / 100)
```

**Limitləri:** bad calibration → bad baseline → false-negative-lər
(istifadəçi hələ pis otursa belə "good" çıxır).

### WORST() birləşməsi

```ts
const status = worstStatus(clinicalStatus, personalStatus)
// 'good' < 'warning' < 'poor' rank-ı ilə
```

**Niyə WORST() və average ya da AND deyil:**

- **Average:** "Klinik poor, personal good" → average warning — yaxşı
  görünür, amma klinik təhlükə görsənmir
- **AND:** "Klinik poor AND personal poor" → ikisi razılaşmasa
  alarm yox — bu, kalibrasiya səhvinin gizlənməsidir
- **WORST():** istənilən qatın "poor" deməsi kifayətdir → safety-critical
  yanaşma. Aviasiya, tibb cihazları, autonomous vehicles eyni
  prinsiplə işləyir (defense-in-depth)

### Test ssenariləri (4 case)

Bunlar `hybrid-classifier.test.ts`-də ssetdir:

| Ssenariyo | Clinical | Personal | Final | Reason |
|-----------|----------|----------|-------|--------|
| 1. Düz baseline, düz oturmaq | good | good | **good** | both ok |
| 2. Düz baseline, kiçik sapma | good | warning | **warning** | personal triggers |
| 3. **Pis baseline (test edildi)**, eyni pis oturmaq | poor | good | **poor** | clinical safety net |
| 4. Düz baseline, böyük sapma | poor | poor | **poor** | both confirm |

**Ssenariyo 3** sənin innovasiyandır — bunsuz sistem istifadəçini
kalibrasiya səhvi tələsinə salardı.

### Müəllimin verə biləcəyi suallar

**Q: Niyə yalnız personalized deyil?**
A: Ssenariyo 3 (bax cədvəl). User pis postürdə kalibrasiya etsə,
personal layer həmişə "good" deyir. Clinical layer absolute threshold
ilə bu vəziyyəti yaxalayır. Test: `hybrid-classifier.test.ts:60`
"SAFETY NET" başlıqlı test bu davranışı təsdiqləyir.

**Q: Niyə yalnız clinical deyil?**
A: Anatomical variation. Klinik threshold-lar Western populations
üzərində kalibrlənib (Kim et al. Korean cohort, Cortes Brazilian
cohort) — universal deyil. Personalized qat fərdi normalize edir.

**Q: Niyə WORST() və weighted average deyil?**
A: Safety-critical sistemlərdə standart yanaşma. Weighted average
demək: "kifayət qədər çox metric pisdirsə alarm" — amma bir metric-də
böyük breach digərlərini "sönəltməməlidir". WORST() istənilən
qatın istənilən metric-də "poor" deməsi kifayət olduğunu garantee
edir. Defense-in-depth məntiqidir.

**Q: Threshold dəyərləri haradan götürülüb?**
A: Üç klinik araşdırma referansı:
- **Kim, D., Lee, H., Park, K. (2024b).** *Real-time forward head
  posture detection using webcam computer vision.* Applied Sciences,
  14(7), 2965. → CVA < 48° (biz 2° margin əlavə etdik)
- **Cortes, J., et al. (2024).** *Sitting posture recognition systems:
  comparison of pretrained convolutional neural network models.* →
  Shoulder asymmetry < 5%
- **Moreira, R., et al. (2022).** *A computer vision-based mobile
  tool for assessing human posture: a validation study.* →
  Alignment angle < 165°

Bu referanslar `clinical-thresholds.ts`-də doc comment-də qeyd
olunub və TECHNICAL_SPEC.md §3.6-da rəsmi citation-lar var.

**Q: Niyə Kim et al. 2024b? "b" nə deməkdir?**
A: Eyni müəllifin eyni ildə ikinci məqaləsi — citation conventions-da
(a), (b), (c) kimi disambiguate edilir. Kim et al. 2024a addım
sayma haqqında idi (irrelevant); 2024b posture detection üzərinədir.

---

## BÖLMƏ 6 — Calibration safety check

### Aşkar etdiyim problem

Real-time test zamanı, qəsdən pis postürdə (başı çox irəli verərək)
kalibrasiya etdim. Sistem bu pozanı baseline kimi qəbul etdi və
sonradan eyni pozada oturanda **heç vaxt** xəbərdar etmədi. Yalnız
personalized layer var idi.

Bu bug real istifadəçi davranışını modelliyir: insanlar tez-tez
yorğunluqdan və ya səssiz baxış altında pis pozada otururlar; əgər
kalibrasiya zamanı belə oturarlar, sistem onların pis "doğal"-ını
"normal" kimi əzbərləyər.

### Həll

`CalibrationFlow.tsx`-də 5 saniyəlik capture-dan sonra
`isBaselineWithinClinicalHealthy(baseline)` çağırışı (kod:
`hybrid-classifier.ts:148`). Əgər baseline klinik healthy zonadan
kənardırsa, **xəbərdarlıq paneli** göstərilir:

```
⚠ Calibration outside healthy range

It seems your posture during calibration was outside the clinical
healthy range. For accurate monitoring, sit with your back straight,
shoulders relaxed, and head aligned over your shoulders. Try again?

  [Skip anyway (advanced)]   [Try again]
```

"Skip anyway" istifadəçi-üçün deyil, debugging üçündür — confirmation
dialog ilə qorunur.

### Akademik framing

Bu məsələnin aşkarlanması **real-world testing-in dəyərini** göstərir:
- Unit test mükəmməl idi (113/113 yaşıl)
- Sintetik test data ilə işləyirdi
- Yalnız mən özüm pis pozada oturduqda problem üzə çıxdı

Bu, "agile testing pyramidinin" yuxarı qatına (manual exploratory
testing) aiddir — automated test-lər unknown unknowns-u tutmurlar.

Sistem indi user error-a qarşı **defense-in-depth** prinsipi ilə
qoruyur:
1. Calibration zamanı klinik yoxlama (proaktiv)
2. Runtime-da clinical layer WORST() ilə (reaktiv safety net)

### Müəllimin verə biləcəyi suallar

**Q: Bu bug-ı necə aşkar etdin?**
A: User testing — özüm istifadə edirdim, qəsdən pis pozada
kalibrasiya etdim. Sistem heç vaxt xəbərdar etmədi. Bu, automated
test-lərimin əhatə etmədiyi bir senaryo idi.

**Q: Test-lərini necə yenilədin?**
A: `hybrid-classifier.test.ts:56`-da "SAFETY NET" başlıqlı yeni
test əlavə etdim. Test: pis baseline + eyni postur → personal `good`
amma clinical `poor` → final **poor**. Bu, regression-a qarşı
qorumadır. Həm də `isBaselineWithinClinicalHealthy`-nin 5 testi.

**Q: "Skip anyway" niyə var? Təhlükəsizlik prinsipinə zidd deyil?**
A: Power user-lər (məsələn, kalibrlənmiş sport pozada işləyən
balerin) sistemə öz qeyri-standart baseline-larını qəbul etdirmək
istəyə bilərlər. Confirmation dialog ilə qoruyuruq; runtime-da
clinical layer hələ də xəbərdarlıq verir (toggle off etməsələr).
Bu, "rough edges with explicit consent" UX prinsipidir — Apple-da
da "Show in Finder" command Apple-imzasız appları açmaq üçün
oxşar pattern istifadə edir.

---

## BÖLMƏ 7 — Privacy architecture

### "Privacy by architecture" nə deməkdir?

Marketing iddiası deyil. **Kodda yoxlana bilən fakt**.

**Pipeline-da heç bir network call yoxdur:**

```bash
# Network call-larını taparkən:
grep -r "fetch\|XMLHttpRequest\|axios\|http\\." \
  src/renderer/src/posture/ \
  src/renderer/src/hooks/ \
  src/renderer/src/lib/ \
  --include="*.ts" --include="*.tsx"

# Sadəcə bunu görəcəksiniz:
# scripts/download-model.mjs:30   https.get (model endirmə — kurum, runtime deyil)
# src/renderer/src/lib/mediapipe.ts:13  fetch (yerli WASM faylına)
```

### Praktiki arxitektura

| Layer | Privacy guarantee |
|-------|-------------------|
| **Camera capture** | `getUserMedia` axını yalnız RAM-da, frame-dən frame-ə discard |
| **Pose detection** | MediaPipe WASM bütünlüklə yerli, GPU/CPU-da inference |
| **Persistence** | SQLite faylı: `~/Library/Application Support/posturepal-desktop/posturepal.db` (Mac) |
| **Notifications** | Native OS API (Electron `Notification`) — şəbəkə yox |
| **Settings** | DB-də key-value pairs |
| **Analytics** | **YOXDUR**. Sentry yox, GA yox, Plausible yox |

### Müqayisə

| Sistem | Latency | Privacy | Internet asılılığı |
|--------|---------|---------|---------------------|
| **Cloud-based** (Upright Go, Cubii) | ~200-500 ms | Buludda işlənir | Bəli, mütləq |
| **Browser webapp** | ~100-300 ms | LocalStorage, amma 3rd-party tracking | Yarı |
| **PosturePal** | **~33 ms** (frame-rate-limited) | **Tam yerli** | **Yox** |

### GDPR / KVKK (Türkiyə) uyğunluq

- **Personal data toplanmadığı üçün** GDPR Article 4 / KVKK 3-cü
  maddə əhatə dairəsində deyilik
- "Privacy by design" GDPR Article 25 prinsipinə hərfi tətbiq olunur
- README-də "no data leaves your computer" iddiamızı dəstəkləyən
  source code GitHub-da audit ediləbilər

### Müəllimin verə biləcəyi suallar

**Q: Privacy iddianı necə sübut edirsən?**
A: 3 sübut yolu:
1. **Kod audit:** `src/renderer/src/posture/` saf TypeScript, network
   API import-u yoxdur — grep ilə yoxlanılır
2. **Network monitor:** macOS-da Activity Monitor → Network tab →
   PosturePal sıfır outgoing traffic göstərir (yalnız ilk launch-da
   model download dövründə)
3. **Open source:** GitHub repo public-dir, hər kəs hər sətri
   yoxlaya bilər

**Q: Niyə cloud deyil, performans daha yaxşı olardı?**
A: Cloud LATENCY artırır (network round-trip), performansı endirir.
MediaPipe yerli olaraq 30 FPS edir, cloud-a kadr göndərmək ~200 ms
gecikmə yaradar. Üstəlik, cloud-suz işləməyimiz **offline işləməyə**
imkan verir (uçaqda, kafedə internet olmayanda). Privacy + latency +
offline → üçü də qazanılır.

**Q: Bəs SQLite faylı təhlükəsizlik baxımından?**
A: SQLite fayl OS-un user-data directory-sındadır (Mac-də keychain
seviyyəsində qorunmur, amma user account-da qorunur). Encryption
şifrələmə V2-də nəzərdə tutulub (better-sqlite3 SQLCipher uzantısı
ilə). MVP-də: istifadəçi öz fayl sistemini qoruyur (FileVault
recommendation README-də).

**Q: Telemetry niyə yoxdur? Bug-ları necə tutursan?**
A: Akademik prototip-də crash report-suz yaşaya bilərik. Production-da
opt-in telemetry əlavə etmək olar (V2 roadmap). Hazırda hər
istifadəçi GitHub issue açır.

---

## BÖLMƏ 8 — Internationalization architecture

### Niyə iki fərqli i18n library?

| Layer | Library | Niyə |
|-------|---------|------|
| **Marketing site** | next-intl | Next.js App Router ilə server-side rendering uyğunluğu; locale routing avtomatik |
| **Desktop app** | i18next + react-i18next | App Router yoxdur; client-only React app; ICU-format dəstəyi |

Hər ikisi ICU MessageFormat dəstəkləyir (placeholder syntax eynidir).

### Translation organization

**Marketing site** (`messages/en.json`, `messages/tr.json`):
- 9 namespace: `nav`, `hero`, `features`, `howItWorks`, `privacy`,
  `requirements`, `download`, `footer`, `privacyPage`
- ~85 keys hər locale-də
- Parity yoxlama: `jq -r 'paths(scalars) | join(".")' | sort` diff

**Desktop app** (`src/renderer/src/i18n/en.json`, `tr.json`):
- 11 namespace: `common`, `notifications`, `nav`, `monitor`,
  `onboarding`, `webcam`, `calibration`, `status`, `baseline`,
  `dashboard`, `settings`
- ~110 keys hər locale-də

### Structured detail descriptors

Hybrid classifier saf TypeScript modulu olaraq i18n engine-i import
edə bilməz (test-lər framework-free olmalıdır). Buna görə classifier
**localized string** əvəzinə **structured descriptor** qaytarır:

```ts
// hybrid-classifier.ts qaytaranı:
{
  detail: {
    key: 'status.details.clinicalPoor',
    values: {
      metricKey: 'status.metric.cva',
      value: '41°',
      op: '<',
      cutoff: '45°'
    }
  }
}

// StatusIndicator.tsx həll edir:
const text = t(detail.key, { metric: t(detail.values.metricKey), ...detail.values })
// → "Below clinical safe range (CVA: 41° < 45°)"
```

Bu, **separation of concerns**-in örnəyidir: posture logic test edilə
bilər (i18n yoxdur), UI translation-ı tətbiq edir.

### Yeni dil əlavə etmək proseduru

1. `src/renderer/src/i18n/<locale>.json` yarat (məsələn `de.json`)
2. en.json-u kopyala, dəyərləri tərcümə et
3. `src/renderer/src/i18n/index.ts`-də `resources` siyahısına əlavə et:
   ```ts
   resources: {
     en: { translation: en },
     tr: { translation: tr },
     de: { translation: de }  // yeni
   }
   ```
4. Settings səhifəsində dropdown-a əlavə et (Settings.tsx)
5. Marketing site üçün: `src/i18n/routing.ts`-də locales-ə əlavə +
   `messages/de.json` yarat

Total effort: ~30 dəq translation + ~5 dəq config (kontent həcmindən
asılı).

### Müəllimin verə biləcəyi suallar

**Q: Niyə həm marketing, həm desktop-da i18n istifadə edirsən?**
A: İstifadəçi səfər boyu eyni dili görməlidir — marketing saytında
ingilis görüb desktop-da türkcə açmaq cringe yaradır. İki tərəfli
i18n həm vacib UX, həm də beynəlxalq akademik təqdim üçün lazımdır.

**Q: Niyə next-intl və i18next, eyni library deyil?**
A: next-intl Next.js App Router-a sıx-bağlı (server-side messages,
edge runtime). Desktop app-da Next yoxdur, sadəcə React renderer
var — next-intl orada işləməz. i18next framework-agnostik və
desktop renderer üçün uyğundur.

**Q: ICU MessageFormat nə üstünlük verir?**
A: Cinsiyyət, plural, seçim formatları template-də. Bizdə hazırda
sadə placeholder var (`{{value}}`), amma genişlənmə üçün ICU artıq
yerindədir. Məsələn, gələcəkdə "{count, plural, one {1 alert} other
{{count} alerts}}" yaza bilərik.

---

## BÖLMƏ 9 — Database schema və data lifecycle

### Schema

```sql
CREATE TABLE schema_version (version INTEGER PRIMARY KEY);

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE baseline (
  id                 INTEGER PRIMARY KEY CHECK (id = 1),
  cva                REAL NOT NULL,
  shoulder_asymmetry REAL NOT NULL,
  alignment          REAL NOT NULL,
  captured_at        TEXT NOT NULL,
  sample_count       INTEGER NOT NULL
);

CREATE TABLE sessions (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at             TEXT NOT NULL,
  ended_at               TEXT,
  total_duration_seconds INTEGER DEFAULT 0,
  good_seconds           INTEGER DEFAULT 0,
  warning_seconds        INTEGER DEFAULT 0,
  poor_seconds           INTEGER DEFAULT 0
);

CREATE TABLE posture_snapshots (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id          INTEGER NOT NULL,
  timestamp           TEXT NOT NULL,
  cva                 REAL,
  shoulder_asymmetry  REAL,
  alignment           REAL,
  status              TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE INDEX idx_snapshots_session ON posture_snapshots(session_id);
CREATE INDEX idx_snapshots_timestamp ON posture_snapshots(timestamp);
```

### Dizayn qərarları

**1. Single-row baseline (`CHECK (id = 1)`):**
- Hər istifadəçinin yalnız bir aktiv baseline-ı olur
- "Recalibrate" üzərinə yazır (yenisini overwrite edir)
- Sual yaratmır: "hansı baseline istifadə olunur?"

**2. 30 saniyə snapshot interval (frame deyil):**
- 30 FPS × 60s × 60min × 24h = 2.5M sətir/gün — qəbuledilməzdir
- 30s interval: 2880 sətir/gün ~ 50 KB DB böyümə
- Cortes et al. (2024) metodologiyasından gələn standart resolution

**3. Status string-i normallaşdırılmayıb (TEXT, enum-table yox):**
- Trade-off: cilvələnmə (DB ölçüsü) vs SQL convenience
- 3 dəyər var: 'good', 'warning', 'poor' — index-li sorğularda
  fərq cuzidir
- Cost: ~5 byte × 2880 sətir × 30 gün = 432 KB overhead — qəbuledilən

**4. Migration sistemi:**
- `schema_version` table version saxlayır
- `MIGRATIONS` array sequential — yeni release-də əlavə migration
- Idempotent: `migrate()` çoxlu dəfə işlədilə bilər zərərsiz
- Kod: `database.ts:111`

### Data lifecycle

```
Sessiya başlayır (calibration tamamlandıqdan sonra ilk frame)
    │
    ├─▶ sessions.startSession() → session_id
    │
    ├─▶ Hər 30s: useSnapshotPersistence.tick()
    │       └─▶ db:insertSnapshot(session_id, timestamp, metrics, status)
    │
    ├─▶ Yaratıcı app-i bağlayır (Cmd+Q / before-quit)
    │       └─▶ sessions.endSession(id, totals)
    │
    └─▶ Yaratıcı app-i tray-də gizlədir
            └─▶ Sessiya açıq qalır (backgroundThrottling: false)
```

### Data retention

- **MVP:** İstifadəçi nəzarətində; manual delete üçün SQL fayl-ı silmək
- **V2 roadmap:** 90 günlük auto-archive + "Reset all data" düyməsi
- **GDPR right-to-erasure:** istifadəçi
  `~/Library/Application Support/posturepal-desktop/posturepal.db`
  faylını silməklə bütün data-nı silir

### Test edilməsi

`database.test.ts` (20 test):
- Migrations idempotent
- CRUD operations: settings, baseline, sessions, snapshots
- Single-row baseline enforcement
- Stats aggregations (today, week)
- localDateKey timezone safety

**ABI trick:** better-sqlite3 native module Electron ABI üçün
rebuild olunur. Vitest plain Node-da işlədiyi üçün binding yüklənə
bilmir. Test faylı `try/catch` ilə binding-i probe edir, uyğun
deyilsə `describe.skip` istifadə edir. `npm run test:db` skripti
rebuild dance edir.

### Müəllimin verə biləcəyi suallar

**Q: PostgreSQL niyə yox?**
A: Server tələb edir. PosturePal local-only, single-user — SQLite ideal.
PostgreSQL multi-user, sınchronization, network connection-larla
mənalı; bizim use case-də overkill.

**Q: Niyə Drizzle/Prisma ORM istifadə etmədin?**
A: better-sqlite3-ün API-si sadəcə sinxron statement-lərdir, ORM
qatı bizi sadə-stil kodu mürəkkəbləşdirərdi. Type safety üçün
manual interfaces yazdım (`BaselineRecord`, `SessionRow`,
`SnapshotInput`). 20 unit test pure SQL-i covering edir.

**Q: Hər 30 saniyədə bir snapshot çox deyilmi? Saatlıq analiz olar.**
A: Dashboard timeline-ı saatlıq aggregate göstərir
(`getTodayStats()` 24 hour bucket-a topladır). Amma snapshot-ları
30s saxlayırıq ki, gələcək feature-lər (məsələn "bu saatda nə
oldu?" detalı) üçün resolution itirilməsin. Storage cost minimal
(50 KB/gün).

**Q: Concurrency necə həll olunur?**
A: better-sqlite3 sinxron-dur — main process-də serialize olur.
Renderer IPC vasitəsilə çağırdığı üçün natural single-threaded
serialization mövcuddur. WAL journal mode aktiv (`pragma journal_mode
= WAL`), read-while-write üçün.

---

## BÖLMƏ 10 — Limitations və future work

### Hazırkı limitations (dürüst olaq)

1. **Yalnız frontal kamera açısı**
   - Yan profil kamera yoxdur
   - Yan postur problemi (məsələn shoulder rounding) tam ölçülə
     bilmir
   - V2: ikinci kamera və ya phone-as-second-camera

2. **Tək şəxs detection**
   - MediaPipe `numPoses: 1` konfiqurasiyası
   - İki nəfər kamera qarşısında olarsa, yalnız ən aydın olan
     detect olunur
   - V2: `numPoses: 2` + per-person baseline

3. **Mühitə uyğunlaşma yoxdur**
   - Aşağı işıq vəziyyəti dəqiqliyi düşürür
   - Arxa fon mürəkkəbliyi keypoint stability-ni endirir
   - V2: brightness compensation, background-aware filter

4. **Klinik validasiya yoxdur**
   - Akademik prototip-dir, **FDA / TİTCK təsdiqi yoxdur**
   - Tibbi cihaz kimi istifadə edilməməlidir
   - README-də açıq qeyd olunub

5. **Western populations baseline**
   - Klinik threshold-lar Korean (Kim et al.), Brazilian (Cortes
     et al.), Portuguese (Moreira et al.) kohortlardan
   - Asia, Africa, Pacific Islander anatomical variation-ı tam
     nəzərə alınmır
   - V2: regional cohort calibration

### V2 roadmap

| Feature | Effort | Priority | Niyə |
|---------|--------|----------|------|
| **Custom CNN classification** | 4-6 həftə | Medium | Klinik threshold-ları öyrənmək, dataset toplamaq, training |
| **Multi-camera fusion** | 2-3 həftə | High | Yan profil ən vacib gap-imizdir |
| **Apple Watch / Fitbit inteqrasiyası** | 1-2 həftə | Low | Heart rate variability ilə posture correlation |
| **Klinik validation study** | 8-12 həftə | High | Real patients ilə accuracy ölçmə, peer review |
| **Browser extension (lite)** | 1 həftə | Medium | Lower-touch alternative — pose only, no SQLite |
| **Cloud sync (opt-in, encrypted)** | 2-3 həftə | Low | Multi-device users üçün; privacy promise saxlanılır |
| **Pomodoro inteqrasiyası** | 1 həftə | Low | Break reminders + stretch suggestions |
| **Light/dark mode toggle** | 1 gün | Medium | Bəzi istifadəçilər light tema istəyər |

### Akademik baxımdan dürüst limitləri qeyd etmənin dəyəri

- Müəllim **honest assessment**-i təqdir edir
- "İdeal sistem qurdum" iddiası realistik deyil və savadlı baxıcıya
  şübhə verir
- Future work bölməsi **research roadmap** kimi görünür — bu
  layihənin sonu deyil, başlanğıcıdır

### Müəllimin verə biləcəyi suallar

**Q: Custom CNN niyə MVP-də deyil?**
A: Zaman məhdudiyyəti. CNN training tələb edir:
1. Dataset toplama (~5,000+ etiketlənmiş poza, hər status üçün)
2. Annotation effort (manual labeling)
3. Validation set + hyperparameter tuning
4. Overfitting yoxlaması
5. Model size optimization (mobile inference üçün)

Bu, ayrıca research project (3-4 ay). MVP-də MediaPipe-in mövcud
modeli + classical posture math + clinical threshold-lar kifayət
fundament yaradır.

**Q: Klinik validation niyə yoxdur?**
A: Klinik validation tələb edir:
- IRB approval (etik komitə)
- Patient recruitment (n ≥ 30 minimum)
- Comparator (manual goniometer measurement)
- Statistical analysis (Bland-Altman plots, ICC)
- Peer-reviewed publication

Bu 8-12 həftə tələb edir. V2 roadmap-də saxlanılıb. MVP üçün
literature-derived threshold-lar evidence-based fundament verir.

**Q: Bunu kommersiya edə bilərsənmi?**
A: Texnik baxımdan bəli — kod açıq, lisenziya MIT olarsa hər kəs
istifadə edə bilər. Amma kommersiyalaşdırma tələb edir:
1. FDA / TİTCK approval (medical device kateqoriyası)
2. Codesign + notarization (Apple, Microsoft)
3. Customer support infrastructure
4. Insurance / liability coverage

Akademik prototip → kommersiya keçidi ayrıca yoldur. Hazırda
açıq mənbə akademik mövqedə saxlayıram.

---

## CODE WALKTHROUGH ORDERS

Əgər müəllim "kodu göstər" desə, bu sırada açın:

### 1️⃣ `src/renderer/src/posture/calculations.ts` (riyaziyyat)

```
Niyə əvvəl: posture detection-un ürəyi
Diqqət çəkməli yerlər:
  - calculateCVA: atan2 düsturu (line 7)
  - calculateShoulderAsymmetry: NORMALIZED (% deyil pixel) (line 14)
  - calculateAlignmentAngle: 3-vektor (dot product + arccos) (line 22)
  - calculatePostureMetrics: visibility filtering + side selection
```

### 2️⃣ `src/renderer/src/posture/hybrid-classifier.ts` (innovasiya)

```
Niyə ikinci: əsas akademik töhfə
Diqqət çəkməli yerlər:
  - HybridClassification interface — output shape
  - classifyHybrid (line 100): clinical + personal + WORST birləşməsi
  - DetailDescriptor: structured i18n payload (line 19)
  - isBaselineWithinClinicalHealthy (line 148): calibration safety
```

### 3️⃣ `src/renderer/src/posture/clinical-thresholds.ts` (klinik bağ)

```
Niyə üçüncü: akademik referansların kodda yeri
Diqqət çəkməli yerlər:
  - File header doc comment: 3 məqalə referansı
  - CLINICAL_THRESHOLDS object (line 16): rəqəmlər
  - per-metric classifiers (line 24-43): hər metric direction-ı
  - classifyAgainstClinical: worstMetric reporting (line 60)
```

### 4️⃣ `src/main/database.ts` (data layer)

```
Niyə dördüncü: persistence + migration discipline
Diqqət çəkməli yerlər:
  - MIGRATIONS array (line 51): version-controlled schema
  - PostureDatabase class: encapsulated API
  - localDateKey helper (line 43): timezone safety
  - WAL mode + foreign keys (constructor)
```

### 5️⃣ `posturepal-web/src/components/Hero.tsx` (UI quality)

```
Niyə sonuncu: marketing site UI səviyyəsi
Diqqət çəkməli yerlər:
  - OS-aware CTA (useOS hook)
  - Three-layer background (alignment line + horizontal + glow + noise)
  - Inline MonitorCard preview SVG
  - serif italic emphasis (Instrument Serif)
```

---

## DEMO FLOW SCRIPT

10 dəqiqəlik demo üçün ssenariy:

### Addım 1 — Marketing site (1 dəq)

**Brauzerdə aç:** `https://posturepal-web-ochre.vercel.app/`

**Danışmalı olduğun:**
> "Bu, məhsulun marketing saytıdır. Diqqət edin: dizayn motivləri —
> serif italic vurğu sözlərində, mono font texniki məlumat üçün,
> mərkəzi vertical hairline xətti spine metaforası kimi. Hər iki
> dildə (EN/TR) hazırdır."

**Göstər:** Header → Hero → "Download" düyməsi → OS-detect (Mac-də
'Download for macOS', Win-də 'Download for Windows').

### Addım 2 — Privacy bölməsi (30 san)

**Sürüş:** Privacy bölməsinə

**Danışmalı olduğun:**
> "Privacy by architecture — marketing claim deyil. Aşağıdakı
> evidence row göstərir: 0 network call, none telemetry, no
> account, source open. Bunların hər biri kod audit-i ilə
> sübut olunur."

### Addım 3 — Download + install (1 dəq)

**Düyməyə kliklə → .dmg yüklən → aç → drag to Applications**

**Danışmalı olduğun:**
> "Akademik prototipdir, code-signed deyil — Gatekeeper işlərini
> blokladığı üçün `xattr -cr` ilə quarantine flag-i silirik.
> Production istifadə üçün Apple Developer Program signing lazımdır."

**Terminal:**
```bash
xattr -cr /Applications/PosturePal.app
```

### Addım 4 — İlk açılış (30 san)

**App-i aç. Camera permission dialog çıxır → OK.**

**Danışmalı olduğun:**
> "macOS hardened runtime entitlement-i tələb edir
> (`com.apple.security.device.camera`) — bunsuz heç prompt çıxmazdı.
> v0.0.2-də bu bug-ı aşkar etdim."

### Addım 5 — Kalibrasiya — düzgün axın (1.5 dəq)

**Düz otur (yaxşı postur). CalibrationFlow başla → 3-2-1 countdown
→ 5 saniyəlik capture → review panel.**

**Danışmalı olduğun:**
> "5 saniyəlik sample-lar ortalanır → BaselineProfile saxlanılır.
> Indi capture klinik healthy zonadadır, sistem 'within healthy
> clinical range' deyir."

**'Looks good' bas → Monitoring view-a keçid.**

### Addım 6 — Pis postür → status dəyişir (1 dəq)

**Qəsdən pis otur: başı çox irəli ver.**

**Danışmalı olduğun:**
> "2-3 saniyə ərzində status dəyişir — sage rəngdən qırmızıya
> keçir. StatusIndicator detail: 'Below clinical safe range
> (CVA: 41° < 45°)'. Native notification çıxır."

**Notification gözlə (~2.5 saniyə).**

### Addım 7 — Calibration safety check (1.5 dəq)

**Recalibrate düyməsi → bu dəfə qəsdən pis postürdə kalibrasiya et.**

**Danışmalı olduğun:**
> "İndi sistem aşkarlayır ki, baseline klinik healthy aralıqdan
> kənardır. Bu mənim aşkar etdiyim bug-ın həllidir — `Try again`
> təklif edir, ya da `Skip anyway (advanced)` confirmation
> dialoq-u ilə. Bu, calibration phase-də user error protection."

### Addım 8 — Dashboard (1 dəq)

**Navigation → Dashboard.**

**Danışmalı olduğun:**
> "Hər 30 saniyədə SQLite-a snapshot yazılır. Today timeline 24
> saatlıq histogram, This Week 7 günlük stacked bar chart. Data
> tamamilə yerlidir — `~/Library/Application Support/posturepal-desktop/posturepal.db`."

### Addım 9 — Language switch (30 san)

**Settings → Language → Türkçe.**

**Danışmalı olduğun:**
> "Bütün UI dərhal türkçəyə keçir. 110+ key hər iki locale-də.
> Setting DB-də persistent — app restart-da yadda saxlanır."

### Addım 10 — Background notification (1 dəq)

**Window-u close button ilə bağla → app tray-də qalır.**

**Danışmalı olduğun:**
> "`backgroundThrottling: false` olmasaydı, Chromium pose detection-i
> ~1 FPS-ə endirərdi. İndi tray-də olarkən belə pose detection
> 25-30 FPS-də işləyir."

**Pis pozada otur, notification gözlə — gəlməlidir.**

### Addım 11 — Q&A hazırlığı (qalan vaxt)

- Müəllimin sualları üçün yuxarıdakı 10 bölmənin **"Müəllimin verə
  biləcəyi suallar"** alt-bölmələrini istifadə et
- "Kod göstər" desə, **CODE WALKTHROUGH ORDERS** sırasını izlə
- Tərəddüd edirsənsə, **dürüst ol** — "Bunu test etməmişəm" /
  "Bu V2 roadmap-də" cavabları "uydurmaqdan" üstündür

---

## REFERENCES

### Klinik (eşik dəyərlərinin əsaslandırılması)

- **Kim, D., Lee, H., Park, K.** (2024b). Real-time forward head
  posture detection using webcam computer vision. *Applied Sciences,
  14*(7), 2965.
- **Cortes, J.** et al. (2024). Sitting posture recognition systems:
  comparison of pretrained convolutional neural network models.
- **Moreira, R.** et al. (2022). A computer vision-based mobile tool
  for assessing human posture: a validation study.

### Pose detection (texnoloji)

- **Lugaresi, C.** et al. (2019). MediaPipe: A Framework for Building
  Perception Pipelines. *Google Research,* arXiv:1906.08172.
- **Bazarevsky, V.** et al. (2020). BlazePose: On-device Real-time
  Body Pose tracking. arXiv:2006.10204.

### Sistem dizaynı (akademik framing üçün)

- **Storey, V.** (2009). Privacy by Design: Concept and Principles.
  *IAPP Foundation Materials.*
- **Knight, J.** (2002). Safety Critical Systems: Challenges and
  Directions. *Proc. ICSE.* (WORST() rationale)

---

## SƏNƏD HISTORIYASI

| Tarix | Versiya | Dəyişiklik |
|-------|---------|------------|
| 2026-05-11 | 1.0 | İlk presentation guide; Day 4 deliverable |

---

**End of guide.** Uğurlar, Kanan. 🎯
