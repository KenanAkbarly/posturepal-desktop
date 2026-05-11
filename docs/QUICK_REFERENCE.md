# PosturePal — Quick Reference

> Printable 2-pager. Təqdimat zamanı yanında saxla.

---

## SƏHIFƏ 1 — Layihə nədir, hansı stack, hansı innovasiya

### Bir paragraf

**PosturePal** webcam vasitəsilə real-vaxt postur monitorinqi edən
privacy-first masaüstü tətbiqidir. Bütün hesablamalar yerlidir —
heç bir kamera kadrı buludla bölünmür. Əsas innovasiya: **hybrid
two-layer classification** — clinical absolute thresholds (Kim
2024b, Cortes 2024, Moreira 2022) + personalized baseline WORST()
birləşməsi ilə istifadəçi kalibrasiya səhvinə qarşı dayanıqlı.

### Tech stack

```
Marketing site:  Next.js 16  +  Tailwind 3  +  next-intl  →  Vercel
Desktop app:     Electron 39  +  React 19  +  TypeScript 5
Computer vision: MediaPipe BlazePose (33 keypoint, WASM, GPU delegate)
Persistence:     better-sqlite3 (yerli SQLite, IPC ilə)
UI:              shadcn/ui + Tailwind + Framer Motion
i18n:            i18next (desktop) + next-intl (web)  →  EN + TR
Build:           electron-vite + electron-builder
```

### Üç maddədə innovasiya

1. **Hybrid classification** — clinical absolute + personalized WORST()
   - Kod: `src/renderer/src/posture/hybrid-classifier.ts`
2. **Privacy-by-architecture** — 0 network call (grep-lə yoxlana bilər)
3. **Calibration safety check** — pis baseline-ı blok edir + retry CTA
   - Kod: `isBaselineWithinClinicalHealthy()` `hybrid-classifier.ts:148`

### Posture pipeline (10 addım)

```
webcam frame
  → BlazePose (33 keypoint)
  → visibility filter (≥0.5)
  → most-visible side selection
  → CVA + asymmetry + alignment hesablanması
  → sliding window (30 frame ≈ 1 san smoothing)
  → hybrid classifier (clinical + personal WORST)
  → hysteresis (1.5 san təsdiq)
  → UI + notification
  → SQLite snapshot (hər 30 san)
```

### Clinical thresholds

| Metric | Healthy | Warning | Poor | Source |
|--------|---------|---------|------|--------|
| CVA | ≥ 50° | 45-49° | < 45° | Kim et al. 2024b |
| Shoulder asymmetry | < 5% | 5-8% | > 8% | Cortes et al. 2024 |
| Alignment | ≥ 165° | 155-164° | < 155° | Moreira et al. 2022 |

### Sensitivity tolerances

| Sensitivity | Warning | Poor |
|-------------|---------|------|
| Low | 10% | 20% |
| Medium (default) | 15% | 30% |
| High | 25% | 50% |

---

## SƏHIFƏ 2 — Demo flow + müəllim sualları

### Demo addımları (~10 dəq)

| Addım | Vaxt | Danışacağın |
|-------|------|-------------|
| 1. Marketing site açışı | 1 dəq | OS-aware Download CTA, dizayn motivləri |
| 2. Privacy bölməsi | 30 san | "0 network call" evidence row |
| 3. .dmg yüklə + install | 1 dəq | `xattr -cr` Gatekeeper bypass |
| 4. İlk açılış + camera prompt | 30 san | hardenedRuntime camera entitlement |
| 5. Düzgün kalibrasiya | 1.5 dəq | 5s sample → BaselineProfile saxlanması |
| 6. Pis postür → status dəyişir | 1 dəq | ~2.5s reaksiya, native notification |
| 7. Calibration safety check (bug fix) | 1.5 dəq | Pis baseline → "Try again" |
| 8. Dashboard timeline + week chart | 1 dəq | 30s snapshot interval, yerli SQLite |
| 9. Language switch (TR) | 30 san | 110 key, DB-persisted |
| 10. Tray-də background notification | 1 dəq | backgroundThrottling: false |

### Top 10 müəllim sualı + qısa cavab

**1. Niyə MediaPipe, niyə custom CNN deyil?**
4-günlük scope-da CNN training (~3-4 ay) imkansızdır. MediaPipe
Google-un 30,000+ pose ilə training etdiyi açıq modeldir. V2-də
custom CNN roadmap-də.

**2. Niyə WORST(), niyə average deyil?**
Safety-critical sistemlər prinsipi. Average "klinik poor + personal
good" hadisəsində warning verir — kalibrasiya səhvini gizlədir.
WORST() istənilən qatın poor deməsini final-da qoruyur.

**3. Privacy iddianı necə sübut edirsən?**
Üç yol: (a) `grep` ilə network API import-larına baxmaq —
yalnız MediaPipe yerli WASM fetch-i tapacaq, (b) macOS Activity
Monitor → Network 0 outgoing, (c) GitHub repo public — hər sətir
audit ediləbilər.

**4. Threshold dəyərləri haradan?**
Üç klinik məqalə: Kim et al. 2024b (CVA), Cortes et al. 2024
(asymmetry), Moreira et al. 2022 (alignment). `clinical-thresholds.ts`
header doc comment-də referanslar.

**5. Bu bug-ı necə aşkar etdin?**
Manual user testing — özüm pis pozada kalibrasiya etdim, sistem
heç vaxt xəbərdar etmədi. Bu **real-world testing**-in dəyərini
göstərir; unit test-lər unknown unknown-ı tutmurlar.

**6. Niyə SQLite, niyə PostgreSQL deyil?**
Single-user, local-only — server tələbi yoxdur. PostgreSQL
multi-user və network için mənalı; bizdə overkill.

**7. Hər framedə deyil, 30s-də niyə snapshot?**
Cortes et al. metodologiyası + storage trade-off. Hər frame
2.5M sətir/gün → disk şişər. 30s 2880 sətir → 50 KB/gün, saatlıq
aggregate-lər üçün kifayət resolution.

**8. Niyə Electron, Tauri deyil?**
Prior expertise + faster development (4 gün scope). Tauri daha
performant amma daha az mature.

**9. Klinik validation niyə yoxdur?**
IRB approval + patient recruitment + 8-12 həftə tələb edir.
Akademik MVP-də literatur-derived threshold-lar evidence-based
fundament verir. V2 roadmap-də.

**10. Bunu kommersiya edə bilərsənmi?**
Texnik baxımdan bəli; amma FDA/TİTCK təsdiqi, code signing,
liability insurance ayrıca yoldur. Hazırda açıq mənbə akademik
mövqedə.

### Kod walkthrough sırası (əgər müəllim "kodu göstər" deyə)

1. `src/renderer/src/posture/calculations.ts` — CVA, asymmetry, alignment math
2. `src/renderer/src/posture/hybrid-classifier.ts` — innovasiya
3. `src/renderer/src/posture/clinical-thresholds.ts` — akademik bağ
4. `src/main/database.ts` — migration + CRUD
5. `posturepal-web/src/components/Hero.tsx` — UI quality

### Acil komandalar (terminal)

```bash
# Gatekeeper bypass (Mac, app launch fail-də)
xattr -cr /Applications/PosturePal.app

# DB-i sıfırla (data wipe)
rm ~/Library/Application\ Support/posturepal-desktop/posturepal.db

# Camera permission reset (Mac dev mode)
tccutil reset Camera com.posturepal.desktop

# Test-ləri qaç (renderer + posture math)
npm test
# 113/113 yaşıl

# DB test-ləri qaç (rebuild dance lazımdır)
npm run test:db
```

### Buraxılış versiyaları

| Versiya | Tarix | Mühüm dəyişiklik |
|---------|-------|-------------------|
| v0.0.1 | 2026-05-08 | İlk release (bug-lar var) |
| v0.0.2 | 2026-05-10 | Camera entitlement fix |
| v0.0.3 | 2026-05-10 | MediaPipe path fix (pose detection işləyir) |
| v0.0.4 | 2026-05-10 | Notification overhaul (~2.5s reaksiya, real data, bg) |

Live URLs:
- Marketing: `posturepal-web-ochre.vercel.app`
- Source: `github.com/KenanAkbarly/posturepal-desktop`
- Source: `github.com/KenanAkbarly/posturepal-web`

---

**End of quick reference.** Uğurlar! 🎯
