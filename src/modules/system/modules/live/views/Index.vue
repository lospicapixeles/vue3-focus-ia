<template>
  <div>
    <PageHeader
      kicker="Captura"
      title="Sesión en vivo"
      description="Visión multimodal (rostro ViT + postura Lopez). Cálculos en Web Worker. Participantes anónimos: Alumno 1…N."
    >
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <span
            v-if="isCapturing"
            class="inline-flex items-center gap-1.5 rounded-md border border-danger/20 bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger"
            role="status"
          >
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" aria-hidden="true" />
            Registrando
          </span>
        </div>
      </template>
    </PageHeader>

    <Card class="mb-4 p-4 md:p-5">
      <h2 class="text-sm font-semibold text-ink">Fuente de video</h2>
      <p class="mt-0.5 text-sm text-muted">Cámara local o compartir pantalla / ventana.</p>

      <div class="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div class="space-y-1.5">
          <Label for="video-source">Dispositivo</Label>
          <NativeSelect id="video-source" v-model="selectedSource" :disabled="modelsLoading">
            <option disabled value="">Seleccionar fuente…</option>
            <optgroup v-if="camaras.length" label="Cámaras">
              <option
                v-for="cam in camaras"
                :key="cam.deviceId"
                :value="`camera:${cam.deviceId}`"
              >
                {{ cam.label }}
              </option>
            </optgroup>
            <optgroup label="Pantalla">
              <option value="screen">Compartir pantalla / ventana</option>
            </optgroup>
          </NativeSelect>
        </div>
        <div class="flex flex-wrap gap-2">
          <UiButton variant="secondary" size="sm" type="button" :disabled="modelsLoading" @click="refreshDevices">
            Actualizar
          </UiButton>
          <UiButton
            v-if="!isCapturing"
            type="button"
            :disabled="!selectedSource || modelsLoading || starting"
            @click="startCapture"
          >
            {{ starting ? 'Iniciando…' : 'Iniciar captura' }}
          </UiButton>
          <template v-else>
            <UiButton variant="secondary" type="button" :disabled="starting" @click="startCapture">
              Cambiar fuente
            </UiButton>
            <UiButton variant="destructive" type="button" @click="stopCapture">
              Detener
            </UiButton>
          </template>
        </div>
      </div>

      <p v-if="sourceError" class="mt-3 text-sm text-danger" role="alert">{{ sourceError }}</p>
      <p v-if="statusLine" class="mt-3 text-xs text-muted">{{ statusLine }}</p>
    </Card>

    <div class="overflow-hidden rounded-lg border border-muted-line bg-ink p-2 shadow-soft">
      <div class="relative min-h-[240px] w-full">
        <video
          ref="video"
          class="block w-full rounded-md"
          autoplay
          muted
          playsinline
          @loadedmetadata="onVideoLoaded"
        />
        <div
          v-if="!isCapturing"
          class="absolute inset-0 flex flex-col items-center justify-center rounded-md bg-ink/85 px-4 text-center"
        >
          <p class="text-sm font-medium text-white/80">Sin captura activa</p>
          <p class="mt-1 text-xs text-white/45">Seleccione fuente e inicie el registro.</p>
        </div>
        <canvas ref="canvas" class="pointer-events-none absolute left-0 top-0 rounded-md" aria-hidden="true" />
      </div>
    </div>

    <div v-if="facePersons.length || posturePersons.length" class="mt-4 grid gap-4 lg:grid-cols-2">
      <Card class="p-4">
        <h2 class="text-sm font-semibold text-ink">Rostro (ViT)</h2>
        <ul class="mt-3 divide-y divide-muted-line">
          <li
            v-for="p in facePersons"
            :key="'f-' + p.participant_label"
            class="flex items-center justify-between py-2.5 text-sm"
          >
            <span class="font-medium text-ink">{{ p.participant_label }}</span>
            <span class="text-muted">
              {{ faceLabel(p.emotion) }}
              <span class="tabular-nums">({{ Math.round((p.confidence || 0) * 100) }}%)</span>
            </span>
          </li>
        </ul>
        <p v-if="!facePersons.length" class="mt-3 text-sm text-muted">Sin rostros en este frame.</p>
      </Card>
      <Card class="p-4">
        <h2 class="text-sm font-semibold text-ink">Postura (Lopez / MASR)</h2>
        <ul class="mt-3 divide-y divide-muted-line">
          <li
            v-for="p in posturePersons"
            :key="'p-' + p.participant_label"
            class="py-2.5 text-sm"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium text-ink">{{ p.participant_label }}</span>
              <span class="text-muted">
                {{ postureLabel(p.emotion) }}
                <span class="tabular-nums">({{ Math.round((p.confidence || 0) * 100) }}%)</span>
              </span>
            </div>
            <p class="mt-0.5 font-mono text-[11px] text-muted">{{ p.pose_variant }} · V{{ p.valence }} A{{ p.arousal }}</p>
          </li>
        </ul>
        <p v-if="!posturePersons.length" class="mt-3 text-sm text-muted">Sin posturas en este frame.</p>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import useLive from '../hooks/useLive'
import systemApi from '../../../../../apis/systemApi'
import {
  analyzeSessionInWorker,
  encodeFrameBitmap,
  terminateVisionWorker,
} from '../../../../../lib/visionClient'
import PageHeader from '../../../../../components/PageHeader.vue'
import Card from '../../../../../components/ui/Card.vue'
import Label from '../../../../../components/ui/Label.vue'
import NativeSelect from '../../../../../components/ui/NativeSelect.vue'
import UiButton from '../../../../../components/ui/Button.vue'

const route = useRoute()
const video = ref(null)
const canvas = ref(null)
const selectedSource = ref('')
const starting = ref(false)
const isCapturing = ref(false)
const modelsLoading = ref(true)
const sourceError = ref('')
const mediaStream = ref(null)
const analyzeBusy = ref(false)
const facePersons = ref([])
const posturePersons = ref([])
const lastElapsed = ref(null)
const interval = ref(null)

const { new_emocion, getCamaras, camaras } = useLive()
new_emocion.value.sesions_id = route.params.sesions_id

const visionUrl = import.meta.env.VITE_VISION_API_URL || import.meta.env.VITE_POSTURE_API_URL || 'http://127.0.0.1:8100'

const FACE_LABELS = {
  angry: 'Enojo',
  disgusted: 'Disgusto',
  fearful: 'Miedo',
  happy: 'Alegría',
  sad: 'Tristeza',
  surprised: 'Sorpresa',
  neutral: 'Neutral',
}
const POSTURE_LABELS = {
  joy: 'Alegría',
  sadness: 'Tristeza',
  fear: 'Miedo',
  anger: 'Enojo',
  disgust: 'Disgusto',
}
const faceLabel = (k) => FACE_LABELS[k] || k
const postureLabel = (k) => POSTURE_LABELS[k] || k

const statusLine = computed(() => {
  const parts = []
  if (isCapturing.value && selectedSource.value === 'screen') parts.push('Fuente: pantalla')
  else if (isCapturing.value) parts.push('Fuente: cámara')
  if (lastElapsed.value != null) parts.push(`Análisis ${lastElapsed.value} ms (worker)`)
  return parts.join(' · ')
})

const stopTracks = () => {
  mediaStream.value?.getTracks().forEach((t) => t.stop())
  mediaStream.value = null
  if (video.value) video.value.srcObject = null
}

const clearIntervalSafe = () => {
  if (interval.value) {
    clearInterval(interval.value)
    interval.value = null
  }
}

const onVideoLoaded = () => {
  if (!video.value || !canvas.value) return
  const rect = video.value.getBoundingClientRect()
  canvas.value.width = rect.width
  canvas.value.height = rect.height
}

const drawOverlays = () => {
  const v = video.value
  const c = canvas.value
  if (!v || !c) return
  const rect = v.getBoundingClientRect()
  c.width = rect.width
  c.height = rect.height
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, c.width, c.height)

  const drawBox = (box, color, label) => {
    if (!box) return
    const x = box.x * rect.width
    const y = box.y * rect.height
    const w = box.w * rect.width
    const h = box.h * rect.height
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, w, h)
    ctx.fillStyle = 'rgba(15,20,18,0.85)'
    ctx.fillRect(x, Math.max(0, y - 20), Math.max(80, label.length * 7), 18)
    ctx.fillStyle = '#F4F6F5'
    ctx.font = '12px Inter, sans-serif'
    ctx.fillText(label, x + 4, Math.max(12, y - 6))
  }

  facePersons.value.forEach((p) => {
    drawBox(p.box, '#1f6b45', `${p.participant_label}: ${faceLabel(p.emotion)}`)
  })
  posturePersons.value.forEach((p) => {
    drawBox(p.box, '#9a3412', `${p.participant_label}: ${postureLabel(p.emotion)}`)
  })
}

const persistResults = async (face, posture) => {
  const sesionsId = Number(route.params.sesions_id)
  const tasks = []
  if (face?.persons?.length) {
    tasks.push(
      systemApi.post('/emociones', {
        sesions_id: sesionsId,
        persons: face.persons.map((p) => ({
          expressions: p.expressions,
          participant_label: p.participant_label,
          participant_index: p.participant_index,
          confidence: p.confidence,
          box: p.box,
          detection_score: p.detection_score,
          source: 'vision_vit',
        })),
      })
    )
  }
  if (posture?.persons?.length) {
    tasks.push(
      systemApi.post('/posturas', {
        sesions_id: sesionsId,
        persons: posture.persons,
      })
    )
  }
  await Promise.allSettled(tasks)
}

const runAnalysis = async () => {
  if (!isCapturing.value || analyzeBusy.value || !video.value?.videoWidth) return
  analyzeBusy.value = true
  try {
    let imageBase64
    if (typeof createImageBitmap === 'function' && typeof OffscreenCanvas !== 'undefined') {
      const bitmap = await createImageBitmap(video.value)
      const encoded = await encodeFrameBitmap(bitmap, { quality: 0.72, maxSide: 720 })
      imageBase64 = encoded.imageBase64
    } else {
      // Fallback main-thread encode
      const c = document.createElement('canvas')
      const scale = Math.min(1, 720 / Math.max(video.value.videoWidth, video.value.videoHeight))
      c.width = Math.round(video.value.videoWidth * scale)
      c.height = Math.round(video.value.videoHeight * scale)
      c.getContext('2d').drawImage(video.value, 0, 0, c.width, c.height)
      imageBase64 = c.toDataURL('image/jpeg', 0.72)
    }

    const result = await analyzeSessionInWorker({
      imageBase64,
      visionUrl,
      multiPerson: true,
    })
    facePersons.value = result.face?.persons || []
    posturePersons.value = result.posture?.persons || []
    lastElapsed.value = result.elapsed_ms
    drawOverlays()
    await persistResults(result.face, result.posture)
  } catch (e) {
    console.error(e)
    sourceError.value = e.message || 'Error en análisis'
  } finally {
    analyzeBusy.value = false
  }
}

const startCamera = (deviceId) =>
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: deviceId
      ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
      : { facingMode: 'user' },
  })

const startScreen = () =>
  navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always' }, audio: false })

const startCapture = async () => {
  if (!selectedSource.value) return
  sourceError.value = ''
  starting.value = true
  try {
    clearIntervalSafe()
    stopTracks()
    const stream =
      selectedSource.value === 'screen'
        ? await startScreen()
        : await startCamera(selectedSource.value.replace(/^camera:/, ''))
    mediaStream.value = stream
    video.value.srcObject = stream
    stream.getVideoTracks().forEach((t) => {
      t.addEventListener('ended', () => {
        stopCapture()
        sourceError.value = 'La fuente de video se detuvo.'
      })
    })
    await video.value.play?.().catch(() => {})
    isCapturing.value = true
    onVideoLoaded()
    interval.value = setInterval(runAnalysis, 8000)
    runAnalysis()
  } catch (e) {
    isCapturing.value = false
    sourceError.value =
      e.name === 'NotAllowedError'
        ? 'Permiso denegado para cámara o pantalla.'
        : e.message || 'No se pudo iniciar la captura.'
  } finally {
    starting.value = false
  }
}

const stopCapture = () => {
  clearIntervalSafe()
  stopTracks()
  isCapturing.value = false
  facePersons.value = []
  posturePersons.value = []
  if (canvas.value) {
    canvas.value.getContext('2d')?.clearRect(0, 0, canvas.value.width, canvas.value.height)
  }
}

const refreshDevices = async () => {
  await getCamaras()
  if (!selectedSource.value && camaras.value?.length) {
    selectedSource.value = `camera:${camaras.value[0].deviceId}`
  }
}

onMounted(async () => {
  modelsLoading.value = true
  try {
    await refreshDevices()
  } finally {
    modelsLoading.value = false
  }
  window.addEventListener('resize', onVideoLoaded)
})

onUnmounted(() => {
  stopCapture()
  terminateVisionWorker()
  window.removeEventListener('resize', onVideoLoaded)
})
</script>
