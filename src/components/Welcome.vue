<template>
  <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div></div>
  <div class="p-4 container mx-auto md:px-20">
    <div class="w-full flex justify-center">
      <img src="/images/focus.svg" 
        class="h-32"
      />
    </div>
    <div class="w-full text-center">
      <h1 class="font-bold text-2xl">Bienvenido a Ali</h1>
      <p class="text-zinc-600">Tomate una foto y descubre tus emociones ocultas.</p>
    </div>
    <div
      v-if="!isTicketComplete"
    >
      <div class="flex justify-center w-full my-4 text-center">
        <video
          v-if="!photo"
          ref="video"
          class="rounded-xl"
          width="720" height="720" autoplay></video> 
        <!-- Mostrar la imagen capturada -->
        <div v-else>
          <img 
            :src="photo"
            ref='foto'
            class="rounded-xl mb-2"
            alt="Foto capturada" />
          <input
                v-model="name"
                placeholder="Ingrese su nombre"
                class="w-full rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-white border-2 focus:border-blue-500 px-2 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                type="text"
            /> 
        </div>
      </div>
      <div v-if="isLoading" class="w-full text-center mb-4">
        <h1 class="text-zinc-500">Cargando camara...</h1>
      </div>
      <!-- Botón para tomar la foto -->
      <button
        v-if="!photo"
        ref="foto"
        class="bg-zinc-900 text-white hover:bg-zinc-800 w-full py-3 rounded-xl "
        @click="takePhoto"><fa icon="camera"/> Tomar Foto</button>
      <div 
        v-else
        class="space-y-2">
        <button 
          @click="getTicket()"
          :disabled="isLoadingProccess"
          :class="isLoadingProccess ? 'opacity-50' : ''"
          class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white w-full py-3 rounded-xl">
          <fa icon="ticket" /> Obtener ticket
        </button>
        <button 
          v-if="!isLoadingProccess"
          @click="startCamera()"
          class="bg-rose-500 text-white hover:bg-rose-600 w-full py-2 rounded-xl"><fa icon="rotate-right"/> Tomar otro</button>

      </div>
    </div>
    <div 
      v-else
      class="w-full py-2 flex justify-center mt-4">
      <Card3D 
        :imgsrc="photo"
        :emocion="emocion"
        :name="name"
      />
    </div>
  </div>
 </template>

<script setup>
import useSystem from '../modules/system/hooks/useSystem'
import { ref, onMounted } from 'vue';
import Card3D from './Card3D.vue'
import { toast } from 'vue3-toastify'

const photo = ref(null);
const emocion = ref({});
const name = ref('')
const isLoading = ref(false)
const isTicketComplete = ref(false)
const isLoadingProccess = ref(false)
const isLoadingMessage = ref('Cargando...')
const foto = ref(null)


const video = ref(null);

const startCamera = async () => {
  photo.value = null
  isLoading.value = true
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (video.value) {
      video.value.srcObject = stream;
    }
  } catch (err) {
    alert("Error al acceder a la camera")
    console.error('Error al acceder a la cámara: ', err);
  }finally{
    isLoading.value = false
  }
};

const takePhoto = () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
    if (video.value) {
    canvas.width = video.value.videoWidth;
    canvas.height = video.value.videoHeight;
    
    context.drawImage(video.value, 0, 0, canvas.width, canvas.height);
    
    photo.value = canvas.toDataURL('image/png');
  }
};


const getTicket = async () => {
    
  if(!name.value){
    toast.error("Ingrese un nombre por favor. 😀")
    return
  }

    isLoadingProccess.value = true;
    isLoadingMessage.value = 'Cargando modelos...'

    const faceapi = await import('face-api.js');

    // Cargar los modelos necesarios
    const modelsPath = '/models';

    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(modelsPath),
      faceapi.nets.faceExpressionNet.loadFromUri(modelsPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
      faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
    ]);


    isLoadingMessage.value = 'Detectando rostros...'

    // Detectar las caras con puntos y expresiones
    const detections = await faceapi
        .detectAllFaces(foto.value)
        .withFaceLandmarks()
        .withFaceExpressions();

    if(!detections.length){
      toast.error("No se detectaron rostros, inténtelo nuevamente. 🤓");
      isLoadingProccess.value = false
      return
    }

    // Extraer emoción principal por detección
    let highestEmotion = null;
    let highestScore = 0;

    detections.forEach((detection) => {
      const expressions = detection.expressions;
      const [emotion, score] = Object.entries(expressions).reduce(
        (max, current) => (current[1] > max[1] ? current : max),
        ['', 0]
      );

      if (score > highestScore) {
        highestEmotion = { emotion, score };
        highestScore = score;
      }
    });

    emocion.value = highestEmotion
  
    isTicketComplete.value = true
    isLoadingProccess.value = false
}

onMounted(() => {
  startCamera();
});
</script>
