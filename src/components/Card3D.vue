<template>
  <div class="wrapper">
    <div 
      class="ticket relative mx-auto max-w-md rounded-lg p-1 shadow-lg" 
      :style="{ background: `linear-gradient(135deg, ${colorMap[emocion.emotion]}, #ffffff)` }"
    >
      <div class="bg-white p-7 rounded-md transform transition duration-300 hover:scale-105 hover:shadow-xl" ref="ticketRef">
        <div class="text-center font-bold pb-4">
          <h1># {{ generateRandomNumber() }}</h1>
        </div>

        <!-- Imagen -->
        <img :src="imgsrc" class="rounded-xl mb-4 relative z-10" alt="Imagen relacionada" />
        
        <!-- Título -->
        <h1 class="font-bold text-2xl mb-3 text-center text-gray-700">
          {{ name }}
        </h1>

        <!-- Emoción con emoji -->
        <p class="text-lg text-gray-600 text-center flex items-center justify-center gap-2 mb-4">
          <span :style="{ color: colorMap[emocion.emotion] }" class="text-3xl">
            {{ emotionMap[emocion.emotion] }}
          </span>
          {{ letraMap[emocion.emotion] }} - 
          <span class="font-semibold">
            {{ parseFloat(emocion.score * 100).toFixed(2) }}%
          </span>
        </p>
        <!-- Frase motivadora -->
        <p class="text-center text-gray-500 italic mt-4">
          "{{ randomQuote }}"
        </p>
        <!-- Botones de acción -->
        <div class="flex space-x-2 mt-4">
          <!-- Botón para compartir -->
          <button 
            @click="shareTicket"
            class="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:opacity-90 transition"
          >
            <fa icon="share-alt"/> Compartir
          </button>

          <!-- Botón para descargar -->
          <button 
            @click="downloadCard"
            class="w-full px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg shadow hover:opacity-90 transition"
          >
            <fa icon="download"/> Descargar
          </button>
        </div>
        <div class="w-full text-center pt-4 text-xs text-purple-500">
          https://ali-red.vercel.app
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as htmlToImage from 'html-to-image';

const props = defineProps({
  imgsrc: String,
  emocion: Object,
  name: String
});

const ticketRef = ref(null);
function generateRandomNumber() {
  // Genera un número entre 100000 y 999999
  return Math.floor(100000 + Math.random() * 900000);
}

const emotionMap = {
  angry: "😠",
  disgusted: "🤢",
  fearful: "😨",
  happy: "😀",
  neutral: "😐",
  sad: "😢",
  surprised: "😲"
};

const letraMap = {
  angry: "Molesto",
  disgusted: "Disgusto",
  fearful: "Temeroso",
  happy: "Feliz",
  neutral: "Neutro",
  sad: "Triste",
  surprised: "Sorprendido"
};

const colorMap = {
  angry: "#fecaca",
  disgusted: "#d9f99d",
  fearful: "#ddd6fe",
  happy: "#fef08a",
  neutral: "#8c8882",
  sad: "#bfdbfe",
  surprised: "#fed7aa"
};

// Arreglo de frases motivadoras
const quotes = [
  "¡Sigue brillando con esa sonrisa! 🌟",
  "La felicidad es el reflejo de tu alma. ✨",
  "Tu felicidad ilumina el día de todos. 😊",
  "Es increíble cómo una sonrisa puede cambiar el mundo. 🌎",
  "La alegría no está en las cosas, está en nosotros. - Richard Wagner",
  "Sonríe, que la vida es hoy. 🌈",
  "La alegría no depende de las circunstancias, sino de tu actitud. 😊"
];

// Seleccionar una frase aleatoria
const randomQuote = ref(quotes[Math.floor(Math.random() * quotes.length)]);

// Funciones para compartir y descargar
function shareTicket() {
  if (navigator.share) {
    navigator.share({
      title: 'Ticket Emocional',
      text: `¡Mira esto! ${props.name} está sintiéndose ${letraMap[props.emocion.emotion]} (${parseFloat(props.emocion.score * 100).toFixed(2)}%)`,
      url: window.location.href
    });
  } else {
    alert('La función de compartir no está disponible en tu dispositivo.');
  }
}

function downloadCard() {
  if (ticketRef.value) {
    htmlToImage.toPng(ticketRef.value)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${props.name}-ticket.png`;
        link.click();
      })
      .catch((error) => {
        console.error('Error al generar la imagen:', error);
      });
  }
}
</script>

<style scoped>
.wrapper {
  perspective: 1000px;
}
.ticket {
  transform-origin: center;
  transition: transform 0.3s ease-in-out;
}
.ticket:hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
}
button {
  cursor: pointer;
}
.emoji-decor {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  z-index: -1;
}
.emoji {
  font-size: 1.5rem;
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>

