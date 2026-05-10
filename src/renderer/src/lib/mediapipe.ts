import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'

// Relative paths resolve against the current document URL — works in
// both dev (http://localhost:5173/) and prod (file:///.../out/renderer/index.html).
// Absolute "/..." paths point at the filesystem root in prod, breaking the load.
const WASM_BASE_PATH = './mediapipe-wasm'
const MODEL_PATH = './models/pose_landmarker_full.task'

export async function createPoseLandmarker(
  preferGpu = true
): Promise<{ landmarker: PoseLandmarker; delegate: 'GPU' | 'CPU' }> {
  const fileset = await FilesetResolver.forVisionTasks(WASM_BASE_PATH)

  async function build(delegate: 'GPU' | 'CPU'): Promise<PoseLandmarker> {
    return PoseLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath: MODEL_PATH,
        delegate
      },
      runningMode: 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    })
  }

  if (preferGpu) {
    try {
      const landmarker = await build('GPU')
      return { landmarker, delegate: 'GPU' }
    } catch (e) {
      console.warn('[mediapipe] GPU delegate unavailable, falling back to CPU', e)
    }
  }
  const landmarker = await build('CPU')
  return { landmarker, delegate: 'CPU' }
}
