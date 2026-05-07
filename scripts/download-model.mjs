#!/usr/bin/env node
import { mkdirSync, existsSync, statSync, createWriteStream, copyFileSync, readdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task'
const MODEL_DIR = resolve(PROJECT_ROOT, 'resources', 'models')
const MODEL_PATH = resolve(MODEL_DIR, 'pose_landmarker_full.task')
const WASM_SRC = resolve(PROJECT_ROOT, 'node_modules', '@mediapipe', 'tasks-vision', 'wasm')
const WASM_DEST = resolve(PROJECT_ROOT, 'resources', 'mediapipe-wasm')

function download(url, dest) {
  return new Promise((res, rej) => {
    const file = createWriteStream(dest)
    https
      .get(url, (response) => {
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          file.close()
          download(response.headers.location, dest).then(res, rej)
          return
        }
        if (response.statusCode !== 200) {
          file.close()
          rej(new Error(`HTTP ${response.statusCode} for ${url}`))
          return
        }
        response.pipe(file)
        file.on('finish', () => file.close(res))
      })
      .on('error', (err) => {
        file.close()
        rej(err)
      })
  })
}

async function ensureModel() {
  mkdirSync(MODEL_DIR, { recursive: true })
  if (existsSync(MODEL_PATH) && statSync(MODEL_PATH).size > 1024 * 1024) {
    console.log(`[download-model] model already present (${(statSync(MODEL_PATH).size / 1024 / 1024).toFixed(1)} MB)`)
    return
  }
  console.log(`[download-model] downloading pose_landmarker_full.task…`)
  await download(MODEL_URL, MODEL_PATH)
  console.log(`[download-model] saved to ${MODEL_PATH} (${(statSync(MODEL_PATH).size / 1024 / 1024).toFixed(1)} MB)`)
}

function copyWasm() {
  if (!existsSync(WASM_SRC)) {
    console.warn(`[download-model] WASM source not found at ${WASM_SRC} (run after npm install)`)
    return
  }
  mkdirSync(WASM_DEST, { recursive: true })
  for (const f of readdirSync(WASM_SRC)) {
    copyFileSync(resolve(WASM_SRC, f), resolve(WASM_DEST, f))
  }
  console.log(`[download-model] copied WASM files to ${WASM_DEST}`)
}

await ensureModel()
copyWasm()
