
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
      <video 
        class="rounded-xl w-full" 
        ref="video" 
        style="display: block;" 
        autoplay 
        muted
        @loadedmetadata="onVideoLoaded"
      ></video>
      <canvas 
        ref="canvas" 
        class="absolute top-0 left-0 rounded-xl"
        style="pointer-events: none;"
      ></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useDisplayMedia } from '@vueuse/core';
import useLive from '../hooks/useLive';
import { useRoute } from 'vue-router';
import * as faceapi from 'face-api.js';

const route = useRoute();
const video = ref(null);
const canvas = ref(null);
const interval = ref(null);

const { isLoading, onSubmit, new_emocion, getCamaras } = useLive();
new_emocion.value.sesions_id = route.params.sesions_id;

// Configurar useDisplayMedia para capturar la pantalla
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
    // Ajustar el canvas al tamaño exacto del video mostrado
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
  
  // Obtener el tamaño real del video mostrado en el DOM
  const rect = video.value.getBoundingClientRect();
  const displaySize = { width: rect.width, height: rect.height };
  
  // Ajustar canvas al tamaño del video mostrado
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

  // Calcular la escala entre el video original y el mostrado
  const scaleX = rect.width / video.value.videoWidth;
  const scaleY = rect.height / video.value.videoHeight;
  
  // Limpiar canvas
  const ctx = canvasEl.getContext('2d');
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  
  // Dibujar detecciones escaladas
  detections.forEach((detection) => {
    // Validar que la detección tenga la estructura correcta
    if (!detection || !detection.detection || !detection.detection.box) {
      return; // Saltar esta detección si no tiene la estructura esperada
    }
    
    const box = {
      x: detection.detection.box.x * scaleX,
      y: detection.detection.box.y * scaleY,
      width: detection.detection.box.width * scaleX,
      height: detection.detection.box.height * scaleY
    };
    
    // Dibujar caja de detección
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
    
    // Dibujar landmarks escalados
    if (detection.landmarks && detection.landmarks.positions) {
      const landmarks = detection.landmarks.positions.map(point => ({
        x: point.x * scaleX,
        y: point.y * scaleY
      }));
      
      ctx.fillStyle = '#ff0000';
      landmarks.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
    
    // Dibujar etiqueta de edad y género
    if (detection.age !== undefined && detection.gender) {
      ctx.fillStyle = '#00ff00';
      ctx.font = '16px Arial';
      const label = `${Math.round(detection.age)} años ${detection.gender}`;
      ctx.fillText(label, box.x, box.y - 5);
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
    
    // Agregar listener para redimensionar canvas cuando cambie el tamaño del video
    window.addEventListener('resize', onVideoLoaded);
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
  
  // Remover listener de resize
  window.removeEventListener('resize', onVideoLoaded);

  // Detener la captura de pantalla
  if (enabled.value) {
    stopScreenCapture();
  }

  // Liberar el objeto del video
  if (video.value && video.value.srcObject) {
    video.value.srcObject = null;
  }
});
</script>

