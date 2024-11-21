<template>
    <CardModal :showing="openModal" @close="openModal = false" title="Nuevo usuario">
        <div class="flex flex-wrap">
            <div class="w-full">
                <label for=""
                    class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Nombres</label>
                <input type="text" 
                    v-model="new_usuario.name"
                    placeholder="Nombre usuario"
                    class="w-full rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200" />
            </div>
            <div class="w-full md:w-1/2 md:pr-2 pr-0">
                <label for=""
                    class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Correo</label>
                <input type="email" 
                    v-model="new_usuario.email"
                    placeholder=""
                    class="w-full rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200" />
            </div>
            <div class="w-full md:w-1/2 pr-0">
                <label for="" class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Rol</label>
                <select
                    v-model="new_usuario.rol"
                    class="w-full rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200">
                    <option value="admin">Administrador</option>
                    <option value="alumno">Alumno</option>
                    <option value="docente">Docente</option>
                    <option value="padres">Padres</option>
                </select>
            </div>
            <div class="w-full md:w-1/2 md:pr-2 pr-0">
                <label for="foto" class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Foto</label>
                <label for="foto">
                    <input @change="subirFotoAws" type="file" id="foto" hidden class="w-full">
                    <div
                        v-if="!new_usuario.face_image"
                        for="foto"
                        class="w-full hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer text-center border-2 border-dashed p-2 rounded-md dark:border-gray-700 bg-gray-100 dark:bg-gray-800 transition-all duration-300">
                        <h1 class="text-gray-700 dark:text-gray-300 transition-all duration-300">Has click para
                            subir un archivo
                            <fa icon="cloud-arrow-up" />
                        </h1>
                    </div>
                    <div v-else>
                        <h1 class="text-gray-700 dark:text-gray-300 transition-all duration-300">
                            {{ isLoading ? isLoadingMessage : 'Imagen cargada' }}
                        </h1>
                        <div style="position: relative; display: inline-block;">
                            <img ref="image" :src="src_image_temp" style="display: block;" />
                            <canvas ref="canvas" style="position: absolute; top: 0; left: 0;"></canvas>
                        </div>
                    </div>
                </label>
            </div>
            <div class="mt-2 w-full">
                <button
                :disabled="isLoading"
                :class="isLoading ? 'opacity-50 cursor-not-allowed' : ''"
                @click="onSubmit()"
                class="p-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-md">
                Guardar
                </button>
            </div>
        </div>
    </CardModal>
    <div class="bg-white p-4 rounded-xl">
        <div>
            <h1 class="text-zinc-800 font-medium text-xl">Usuarios</h1>
            <label class="text-zinc-600 text-sm">Administrar acceso de usuarios</label>
        </div>
        <div class="mt-2 flex justify-between">
            <input type="text" placeholder="Buscar usuario"
                class="rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200" />
            <button @click="newUsuario"
                class="py-2 px-3 text-center bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 text-white rounded-lg">Nuevo</button>
        </div>
        <div class="w-full mt-4">
            <Table :total="pag.total" :cant_reg="pag.cant_reg" :nro_pag="pag.page" @change-page="changePage">
                <table class="w-full table-fixed xxl:table-auto border border-gray-100 rounded-lg overflow-hidden"
                    style="border-collapse: separate; border-spacing: 0;">
                    <!-- Encabezado de la tabla -->
                    <thead>
                        <tr
                            class="text-sm sticky top-0 z-[4] text-zinc-700 bg-zinc-200 dark:bg-zinc-700 dark:text-white transition-all duration-300">
                            <th class="py-1 px-2 text-left w-[150px]">Nombre</th>
                            <th class="py-1 px-2 text-left w-[150px]">Correo</th>
                            <th class="py-1 px-2 text-left w-[100px]">Rol</th>
                        </tr>
                    </thead>
                    <!-- Cuerpo de la tabla -->
                    <tbody>
                        <tr v-for="usuario in usuarios" :key="usuario"
                            class="hover:bg-zinc-100 cursor-default dark:hover:bg-zinc-800 transition-all duration-300">
                            <td class="px-2 py-1 text-zinc-700 transition-all duration-300">
                                <div class="w-full flex space-x-2 items-center">
                                    <div :style="{ backgroundColor: usuario.color ?? '#000' }"
                                        class="w-[30px] h-[30px] border-2 flex items-center text-sm justify-center border-white text-white rounded-full dark:border-gray-800">
                                        {{ usuario.name.charAt(0) }}
                                    </div>
                                    <span>{{ usuario.name }}</span>
                                </div>
                            </td>
                            <td class="px-2 py-1 text-zinc-700 transition-all duration-300">
                                <fa icon="envelope" /> {{ usuario.email }}
                            </td>
                            <td class="px-2 py-1 text-zinc-700 transition-all duration-300">{{
                                usuario.rol }}</td>
                        </tr>
                        <tr v-if="!usuarios.length">
                            <td class="px-2 py-2 text-center text-sm text-zinc-500 transition-all duration-300"
                                colspan="3">No hay usuarios registrados</td>
                        </tr>
                    </tbody>
                </table>
            </Table>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import useUsuario from '../hooks/useUsuario';
import Table from '../../../components/data/Table.vue';
import CardModal from '../../../components/CardModal.vue'
import { v4 as uuidv4 } from 'uuid';
import {
    uploadFileToS3,
    deleteFileFromS3
} from '../../../../../lib/aws'
import baseURL from '../../../../../apis/baseURL'

const image = ref(null);
const src_image_temp = ref(null);
const canvas = ref(null);

const {
    openModal,
    pag,
    usuarios,
    getUsuarios,
    new_usuario,
    isLoading,
    isLoadingMessage,
    onSubmit,
    resetForm
} = useUsuario();

const changePage = async (e) => {
    pag.value.page = e;
    await getUsuarios();
}

const newUsuario = () => {
    resetForm()
    openModal.value = true;
} 

const getDescriptorFace = async () => {
    isLoading.value = true;
    isLoadingMessage.value = 'Cargando modelos...'

    const faceapi = await import('face-api.js');

    // Cargar los modelos necesarios
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    isLoadingMessage.value = 'Detectando rostros...'

    // Detectar las caras con puntos y expresiones
    const detections = await faceapi.detectAllFaces(image.value)
        .withFaceLandmarks()
        .withFaceDescriptors();

    isLoadingMessage.value = 'Dibujando rostros...'

    //Dibujar las detecciones en el canvas
    const displaySize = { width: image.value.width, height: image.value.height };
    canvas.value.width = displaySize.width;
    canvas.value.height = displaySize.height;

    faceapi.matchDimensions(canvas.value, displaySize);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // Limpiar el canvas antes de dibujar
    const context = canvas.value.getContext('2d');
    context.clearRect(0, 0, canvas.value.width, canvas.value.height);

    // Dibujar cuadros alrededor de las caras y etiquetas con expresiones
    faceapi.draw.drawDetections(canvas.value, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas.value, resizedDetections);
    
    const facesData = detections.map(detection => ({
        descriptor: detection.descriptor,
        // Otras propiedades opcionales como boundingBox, landmarks, etc.
    }));

    isLoading.value = false;
    
    return facesData;
}

const subirFotoAws = async (e) => {

    src_image_temp.value = URL.createObjectURL(e.target.files[0]);
    new_usuario.value.face_image = e.target.files[0];

    const facesData = await getDescriptorFace();
    new_usuario.value.face_descriptor = JSON.stringify(facesData[0].descriptor);

    try{
         const extension = e.target.files[0].name?.split('.').pop()
         const carpeta = `Ali/${uuidv4()}.${extension}`
    
         const response = await uploadFileToS3(carpeta, e.target.files[0])
    
        if (response && response.$metadata.httpStatusCode === 200) {
             new_usuario.value.face_image_url = carpeta        
        }
    }catch(e){
        console.log(e)
    }
}

getUsuarios();
</script>
