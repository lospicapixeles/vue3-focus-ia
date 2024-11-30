
<template>
  <div class="bg-white rounded-xl p-4">
    <div v-if="isLoading" class="text-center w-full">
      <h1>Cargando...</h1>
    </div>
    <div class="pb-2">
      <h1 class="text-zinc-800">
        <fa class="text-red-500" icon="video" /> Sesión en vivo
      </h1>
    </div>
    <div style="position: relative; display: inline-block;">
      <video class="rounded-xl w-full" ref="video" style="display: block;" autoplay muted></video>
      <canvas ref="canvas" class="absolute top-0 left-0"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import useLive from '../hooks/useLive';
import { useRoute } from 'vue-router';
import * as faceapi from 'face-api.js';

const route = useRoute();
const video = ref(null);
const canvas = ref(null);
const interval = ref(null);

const { isLoading, onSubmit, new_emocion, getCamaras } = useLive();
new_emocion.value.sesions_id = route.params.sesions_id;

const loadModels = async () => {
  const modelsPath = '/models';
  const models = [
    faceapi.nets.ssdMobilenetv1.loadFromUri(modelsPath),
    faceapi.nets.ageGenderNet.loadFromUri(modelsPath),
    faceapi.nets.faceExpressionNet.loadFromUri(modelsPath),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri(modelsPath),
    faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
    faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
  ];
  await Promise.all(models);
};

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    if (video.value) {
      video.value.srcObject = stream;
    }
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
  }
};

const detectFaces = async () => {
  if (!video.value || !canvas.value) return;

  const canvasEl = canvas.value;
  const displaySize = { width: video.value.videoWidth, height: video.value.videoHeight };
  faceapi.matchDimensions(canvasEl, displaySize);

  const detections = await faceapi
    .detectAllFaces(video.value)
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender()
    .withFaceDescriptors();

  await onSubmit(detections);

  const resizedDetections = faceapi.resizeResults(detections, displaySize);

  // Limpiar y redibujar en el canvas
  const ctx = canvasEl.getContext('2d');
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  faceapi.draw.drawDetections(canvasEl, resizedDetections);
  faceapi.draw.drawFaceLandmarks(canvasEl, resizedDetections);
  faceapi.draw.drawFaceExpressions(canvasEl, resizedDetections);

  resizedDetections.forEach((detection) => {
    const box = detection.detection.box;
    new faceapi.draw.DrawBox(box, {
      label: `${Math.round(detection.age)} años ${detection.gender}`,
    }).draw(canvasEl);
  });
};

onMounted(async () => {
  isLoading.value = true;
  await loadModels();
  await getCamaras();
  isLoading.value = false;

  if (video.value && canvas.value) {
    await startCamera();

    video.value.addEventListener('play', () => {
      interval.value = setInterval(detectFaces, 5000);
    });
  }
});

onUnmounted(() => {
  // Limpiar intervalo
  if (interval.value) {
    clearInterval(interval.value);
  }

  // Desasociar el evento 'play' del video
  if (video.value) {
    video.value.removeEventListener('play', detectFaces);
  }

  // Detener todos los tracks de video
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop(); // Detener cada track
    });

    // Liberar el objeto de la cámara
    video.value.srcObject = null;
  }});
</script>

