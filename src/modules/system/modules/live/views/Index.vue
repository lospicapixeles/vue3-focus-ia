<template>
  <div>
    <PageHeader
      kicker="En vivo"
      title="Sesión abierta"
      description="La cámara lee expresiones cada cinco segundos. Mantén el encuadre estable."
    >
      <template #actions>
        <Tag v-if="!isLoading" value="Capturando" severity="danger" rounded />
      </template>
    </PageHeader>

    <div v-if="isLoading" class="mb-4 flex items-center gap-3 rounded-2xl border border-muted-line bg-surface px-4 py-3 text-sm text-muted">
      <ProgressSpinner strokeWidth="4" style="width: 28px; height: 28px" />
      Preparando modelos de reconocimiento…
    </div>

    <div class="overflow-hidden rounded-3xl border border-muted-line bg-ink p-3">
      <div class="relative inline-block w-full">
        <video
          class="block w-full rounded-2xl"
          ref="video"
          autoplay
          muted
          @loadedmetadata="onVideoLoaded"
        ></video>
        <canvas
          ref="canvas"
          class="pointer-events-none absolute left-0 top-0 rounded-2xl"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useDisplayMedia } from '@vueuse/core';
import useLive from '../hooks/useLive';
import { useRoute } from 'vue-router';
import * as faceapi from 'face-api.js';
import PageHeader from '../../../../../components/PageHeader.vue'
import ProgressSpinner from 'primevue/progressspinner'
import Tag from 'primevue/tag'

const route = useRoute();
const video = ref(null);
const canvas = ref(null);
const interval = ref(null);

const { isLoading, onSubmit, new_emocion, getCamaras } = useLive();
new_emocion.value.sesions_id = route.params.sesions_id;

const {
  stream,
  start: startScreenCapture,
  stop: stopScreenCapture,
  enabled
} = useDisplayMedia({
  video: true,
  audio: false
});

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

const startScreen = async () => {
  try {
    await startScreenCapture();
    if (video.value && stream.value) {
      video.value.srcObject = stream.value;
    }
  } catch (error) {
    console.error('Error al acceder a la pantalla:', error);
  }
};

const onVideoLoaded = () => {
  if (video.value && canvas.value) {
    const rect = video.value.getBoundingClientRect();
    canvas.value.width = rect.width;
    canvas.value.height = rect.height;
    canvas.value.style.width = `${rect.width}px`;
    canvas.value.style.height = `${rect.height}px`;
  }
};

const detectFaces = async () => {
  if (!video.value || !canvas.value) return;

  const canvasEl = canvas.value;
  const rect = video.value.getBoundingClientRect();
  const displaySize = { width: rect.width, height: rect.height };

  canvasEl.width = rect.width;
  canvasEl.height = rect.height;
  canvasEl.style.width = `${rect.width}px`;
  canvasEl.style.height = `${rect.height}px`;

  faceapi.matchDimensions(canvasEl, displaySize);

  const detections = await faceapi
    .detectAllFaces(video.value)
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender()
    .withFaceDescriptors();

  await onSubmit(detections);

  const scaleX = rect.width / video.value.videoWidth;
  const scaleY = rect.height / video.value.videoHeight;

  const ctx = canvasEl.getContext('2d');
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  detections.forEach((detection) => {
    if (!detection || !detection.detection || !detection.detection.box) {
      return;
    }

    const box = {
      x: detection.detection.box.x * scaleX,
      y: detection.detection.box.y * scaleY,
      width: detection.detection.box.width * scaleX,
      height: detection.detection.box.height * scaleY
    };

    ctx.strokeStyle = '#2F7A4B';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    if (detection.landmarks && detection.landmarks.positions) {
      const landmarks = detection.landmarks.positions.map(point => ({
        x: point.x * scaleX,
        y: point.y * scaleY
      }));

      ctx.fillStyle = '#F3F0E8';
      landmarks.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    if (detection.age !== undefined && detection.gender) {
      ctx.font = '13px Inter, sans-serif';

      let emotionText = '';
      if (detection.expressions) {
        const emotions = Object.entries(detection.expressions);
        const dominantEmotion = emotions.reduce((prev, current) =>
          current[1] > prev[1] ? current : prev
        );

        const emotionTranslations = {
          'happy': 'Feliz',
          'sad': 'Triste',
          'angry': 'Enojado',
          'fearful': 'Temeroso',
          'disgusted': 'Disgustado',
          'surprised': 'Sorprendido',
          'neutral': 'Neutral'
        };

        emotionText = emotionTranslations[dominantEmotion[0]] || dominantEmotion[0];
        const emotionPercentage = Math.round(dominantEmotion[1] * 100);
        emotionText += ` (${emotionPercentage}%)`;
      }

      const ageGenderLabel = `${Math.round(detection.age)} años ${detection.gender}`;
      const textHeight = 32;
      ctx.fillStyle = 'rgba(23, 23, 20, 0.82)';
      ctx.fillRect(box.x, box.y - textHeight - 5, Math.max(ageGenderLabel.length * 8, emotionText.length * 8), textHeight);

      ctx.fillStyle = '#F3F0E8';
      ctx.fillText(ageGenderLabel, box.x + 2, box.y - 20);

      if (emotionText) {
        ctx.fillStyle = '#2F7A4B';
        ctx.fillText(emotionText, box.x + 2, box.y - 5);
      }
    }
  });
};

onMounted(async () => {
  isLoading.value = true;
  await loadModels();
  await getCamaras();
  isLoading.value = false;

  if (video.value && canvas.value) {
    await startScreen();

    video.value.addEventListener('play', () => {
      interval.value = setInterval(detectFaces, 5000);
    });

    window.addEventListener('resize', onVideoLoaded);
  }
});

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }

  if (video.value) {
    video.value.removeEventListener('play', detectFaces);
  }

  window.removeEventListener('resize', onVideoLoaded);

  if (enabled.value) {
    stopScreenCapture();
  }

  if (video.value && video.value.srcObject) {
    video.value.srcObject = null;
  }
});
</script>
