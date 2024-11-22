
<template>
  <div class="bg-white rounded-xl p-4">
    <div class="pb-2">
      <h1 class="text-zinc-800"><fa class="text-red-500" icon="video" /> Sesión en vivo</h1>
    </div>
    <video class="rounded-xl" ref="video" autoplay muted></video>
    <canvas ref="canvas" class="absolute top-0 left-0"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import useLive from '../hooks/useLive'
import { useRoute } from 'vue-router'
import * as faceapi from 'face-api.js'

const router = useRoute()
const video = ref(null)
const canvas = ref(null) // Referencia al canvas

const { isLoading } = useLive()

// Polyfill para getUserMedia
navigator.getMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

console.log(router.params)

const cargarCamera = () => {
  if (navigator.getMedia) {
    navigator.getMedia(
      {
        video: true,
        audio: false,
      },
      (stream) => {
        if (video.value) {
          video.value.srcObject = stream
        }
      },
      console.error
    )
  } else {
    console.error('getUserMedia no está soportado en este navegador.')
  }
}

onMounted(async () => {
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  ])

  await nextTick()

  if (video.value && canvas.value) {
    cargarCamera()

    video.value.addEventListener('play', async () => {
      const canvasEl = canvas.value

      // Configurar tamaño del canvas igual al del video
      canvasEl.width = video.value.videoWidth
      canvasEl.height = video.value.videoHeight

      const displaySize = { width: video.value.videoWidth, height: video.value.videoHeight }
      faceapi.matchDimensions(canvasEl, displaySize)

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video.value)
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender()
          .withFaceDescriptors()

        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        // Limpiar el canvas
        const ctx = canvasEl.getContext('2d')
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

        // Dibujar detecciones
        faceapi.draw.drawDetections(canvasEl, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvasEl, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvasEl, resizedDetections)

        resizedDetections.forEach((detection) => {
          const box = detection.detection.box
          new faceapi.draw.DrawBox(box, {
            label: `${Math.round(detection.age)} años ${detection.gender}`,
          }).draw(canvasEl)
        })
      }, 100)
    })
  }
})

onUnmounted(() => {
  if (video.value && video.value.srcObject) {
    const tracks = video.value.srcObject.getTracks()
    tracks.forEach((track) => track.stop())
  }
})
</script>

<style scoped>
/* Opcional: Estilos para superponer el canvas sobre el video */
video {
  position: relative;
  z-index: 1;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: none; /* Evita interferencias con eventos */
}
</style>

