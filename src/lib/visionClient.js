/**
 * Cliente del Vision Worker (encode + analyze fuera del main thread).
 */

let worker
let seq = 0
const pending = new Map()

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('../workers/vision.worker.js', import.meta.url), {
      type: 'module',
    })
    worker.onmessage = (e) => {
      const { id, ok, data, error } = e.data || {}
      const entry = pending.get(id)
      if (!entry) return
      pending.delete(id)
      ok ? entry.resolve(data) : entry.reject(new Error(error || 'Worker error'))
    }
    worker.onerror = (err) => {
      console.error('Vision worker error', err)
    }
  }
  return worker
}

function call(type, payload) {
  const id = ++seq
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
    getWorker().postMessage({ id, type, payload })
  })
}

export async function encodeFrameBitmap(bitmap, options = {}) {
  return call('encode_frame', { bitmap, ...options })
}

export async function analyzeSessionInWorker({ imageBase64, visionUrl, multiPerson = true }) {
  return call('analyze_session', { imageBase64, visionUrl, multiPerson })
}

export function terminateVisionWorker() {
  if (worker) {
    worker.terminate()
    worker = null
    pending.clear()
  }
}
