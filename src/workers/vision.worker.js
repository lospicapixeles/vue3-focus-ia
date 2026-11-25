/**
 * Web Worker — análisis multimodal fuera del hilo principal.
 * Recibe JPEG base64 → Vision API (face + posture) → postMessage resultado.
 */

const DEFAULT_VISION = 'http://127.0.0.1:8100'

self.onmessage = async (event) => {
  const { id, type, payload } = event.data || {}
  try {
    if (type === 'analyze_session') {
      const baseUrl = (payload.visionUrl || DEFAULT_VISION).replace(/\/$/, '')
      const res = await fetch(`${baseUrl}/api/v1/analyze/session/base64`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: payload.imageBase64,
          multi_person: payload.multiPerson !== false,
          include_landmarks: false,
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Vision API ${res.status}: ${text.slice(0, 200)}`)
      }
      const data = await res.json()
      self.postMessage({ id, ok: true, data })
      return
    }

    if (type === 'encode_frame') {
      // payload: { bitmap } — crear JPEG en worker si soporta OffscreenCanvas
      const { bitmap, quality = 0.72, maxSide = 720 } = payload
      if (!bitmap || typeof OffscreenCanvas === 'undefined') {
        throw new Error('OffscreenCanvas/bitmap no disponible')
      }
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
      const w = Math.round(bitmap.width * scale)
      const h = Math.round(bitmap.height * scale)
      const canvas = new OffscreenCanvas(w, h)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, 0, 0, w, h)
      bitmap.close?.()
      const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality })
      const buffer = await blob.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      let binary = ''
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
      const imageBase64 = `data:image/jpeg;base64,${btoa(binary)}`
      self.postMessage({ id, ok: true, data: { imageBase64 } })
      return
    }

    throw new Error(`Tipo desconocido: ${type}`)
  } catch (error) {
    self.postMessage({ id, ok: false, error: error?.message || String(error) })
  }
}
