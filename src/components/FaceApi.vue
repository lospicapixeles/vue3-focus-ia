<template>
    <div style="position: relative;">
        <!-- Imagen de referencia -->
        <img ref="image" id="myImg" src="/images/imagen.jpeg" style="width: 1080px; display: block;" />
        <button @click="onMatchFace">Comparar</button>
        <!-- Canvas para dibujar cuadros y etiquetas -->
        <canvas ref="canvas" id="overlay" style="position: absolute; top: 0; left: 0;"></canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const image = ref(null);
const canvas = ref(null);

const sendFaceData = async (facesData) => {
    try {
        await axios.post('http://localhost:9000/api/faces', {
            image_path: '/images/ejemplo.png',  // Ruta de la imagen, puedes cambiarla
            faces: facesData                    // Enviar los descriptores faciales
        });
        console.log('Datos enviados con éxito');
    } catch (error) {
        console.error('Error al enviar datos:', error);
    }
};

const onMatchFace = async () => {
    try {
        // Detectar las caras con puntos y expresiones
        const detections = await faceapi.detectAllFaces(image.value)
            .withFaceLandmarks()
            .withFaceExpressions()
            .withFaceDescriptors();

        // Selecciona el descriptor de la primera cara detectada (si hay)
        const facesData = detections.map(detection => ({
            descriptor: detection.descriptor,
        }));

        // Enviar el descriptor al backend para la coincidencia
        const { data } = await axios.get('http://localhost:9000/api/faces', {
            params: {
                newDescriptor: JSON.stringify(facesData[0].descriptor),
            }
        });

        console.log(data); // Resultado de la coincidencia
    } catch (error) {
        console.error("Error en la coincidencia de rostros:", error);
    }
};

onMounted(async () => {
    // Cargar los modelos necesarios
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    // Ajustar el tamaño del canvas al tamaño de la imagen
    canvas.value.width = image.value.width;
    canvas.value.height = image.value.height;

    // Detectar las caras con puntos y expresiones
    const detections = await faceapi.detectAllFaces(image.value)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors();

    // Dibujar las detecciones en el canvas
    const displaySize = { width: image.value.width, height: image.value.height };
    faceapi.matchDimensions(canvas.value, displaySize);

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // Limpiar el canvas antes de dibujar
    const context = canvas.value.getContext('2d');
    context.clearRect(0, 0, canvas.value.width, canvas.value.height);

    // Dibujar cuadros alrededor de las caras y etiquetas con expresiones
    faceapi.draw.drawDetections(canvas.value, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas.value, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas.value, resizedDetections);

    //guardar en base de datos el label de la expresion y valor de la expresion
    const facesData = detections.map(detection => ({
        descriptor: detection.descriptor,
        // Otras propiedades opcionales como boundingBox, landmarks, etc.
    }));

    // Enviar los datos al backend
    //sendFaceData(facesData);

});
</script>
