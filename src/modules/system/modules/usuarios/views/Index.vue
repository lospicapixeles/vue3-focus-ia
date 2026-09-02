<template>
    <CardModal :showing="openModal" @close="openModal = false" :title="new_usuario.id ? 'Editar usuario' : 'Nuevo usuario'">
        <form class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit.prevent="onSubmit()">
            <div class="flex flex-col gap-2 md:col-span-2">
                <label for="usuario-nombre" class="text-sm font-medium text-ink">Nombres</label>
                <InputText id="usuario-nombre" v-model="new_usuario.name" fluid placeholder="Nombre completo" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="usuario-correo" class="text-sm font-medium text-ink">Correo</label>
                <InputText id="usuario-correo" v-model="new_usuario.email" type="email" fluid placeholder="correo@institucion.edu" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="usuario-rol" class="text-sm font-medium text-ink">Rol</label>
                <Select
                    id="usuario-rol"
                    v-model="new_usuario.rol"
                    :options="roles"
                    optionLabel="label"
                    optionValue="value"
                    fluid
                />
            </div>
            <div class="md:col-span-2">
                <p class="mb-2 text-sm font-medium text-ink">Foto para reconocimiento</p>
                <label for="foto" class="block cursor-pointer">
                    <input @change="subirFotoAws" type="file" id="foto" accept="image/*" hidden />
                    <div
                        v-if="!new_usuario.face_image"
                        class="rounded-2xl border border-dashed border-muted-line bg-paper px-4 py-8 text-center text-sm text-muted hover:border-accent"
                    >
                        Haz clic para subir un archivo
                        <i class="pi pi-cloud-upload ml-1" aria-hidden="true" />
                    </div>
                    <div v-else class="space-y-2">
                        <p class="text-sm text-muted">
                            {{ isLoading ? isLoadingMessage : 'Imagen cargada' }}
                        </p>
                        <div class="relative inline-block">
                            <img ref="image" :src="src_image_temp" alt="Vista previa del rostro" class="block max-h-48 rounded-xl" />
                            <canvas ref="canvas" class="absolute left-0 top-0"></canvas>
                        </div>
                    </div>
                </label>
            </div>
            <div class="md:col-span-2 flex justify-end">
                <Button
                    type="submit"
                    label="Guardar"
                    icon="pi pi-check"
                    :loading="isLoading"
                    :disabled="isLoading"
                />
            </div>
        </form>
    </CardModal>

    <PageHeader
        kicker="02  ·  Gestión"
        title="Usuarios"
        description="Personas del observatorio: docentes, alumnos y administración."
    >
        <template #actions>
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                    v-model="pag.buscar"
                    @keypress.enter="changePage(1)"
                    placeholder="Buscar usuario"
                    aria-label="Buscar usuario"
                />
            </IconField>
            <Button label="Nuevo" icon="pi pi-plus" @click="newUsuario()" />
        </template>
    </PageHeader>

    <DataTable
        :value="usuarios"
        dataKey="id"
        stripedRows
        class="overflow-hidden rounded-2xl"
        responsiveLayout="scroll"
    >
        <template #empty>
            <p class="py-6 text-center text-sm text-muted">No hay usuarios registrados.</p>
        </template>
        <Column header="Nombre">
            <template #body="{ data }">
                <div class="flex items-center gap-3">
                    <span
                        class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                        :style="{ backgroundColor: data.color ?? '#171714' }"
                        aria-hidden="true"
                    >
                        {{ data.name?.charAt(0) }}
                    </span>
                    <span>{{ data.name }}</span>
                </div>
            </template>
        </Column>
        <Column field="email" header="Correo" />
        <Column header="Rol">
            <template #body="{ data }">
                <Tag :value="data.rol" rounded severity="secondary" />
            </template>
        </Column>
        <Column header="" style="width: 7rem">
            <template #body="{ data }">
                <div class="flex justify-end gap-1">
                    <Button
                        icon="pi pi-pencil"
                        rounded
                        text
                        aria-label="Editar usuario"
                        v-tooltip.top="'Editar'"
                        @click="editUsuario(data)"
                    />
                    <Button
                        icon="pi pi-trash"
                        rounded
                        text
                        severity="danger"
                        aria-label="Eliminar usuario"
                        v-tooltip.top="'Eliminar'"
                        @click="confirmDelete(data)"
                    />
                </div>
            </template>
        </Column>
    </DataTable>

    <Paginator
        v-if="pag.total > pag.cant_reg"
        class="mt-3"
        :rows="pag.cant_reg"
        :totalRecords="pag.total"
        :first="(pag.page - 1) * pag.cant_reg"
        @page="onPage"
    />
</template>

<script setup>
import { ref } from 'vue';
import useUsuario from '../hooks/useUsuario';
import CardModal from '../../../components/CardModal.vue'
import PageHeader from '../../../../../components/PageHeader.vue'
import { v4 as uuidv4 } from 'uuid';
import {
    uploadFileToS3,
} from '../../../../../lib/aws'
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Paginator from 'primevue/paginator';
const image = ref(null);
const src_image_temp = ref(null);
const canvas = ref(null);

const roles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Alumno', value: 'alumno' },
    { label: 'Docente', value: 'docente' },
    { label: 'Padres', value: 'padres' },
]

const {
    openModal,
    pag,
    usuarios,
    getUsuarios,
    new_usuario,
    isLoading,
    isLoadingMessage,
    onSubmit,
    resetForm,
    onDelete
} = useUsuario();

const changePage = async (e) => {
    pag.value.page = e;
    await getUsuarios();
}

const onPage = async (event) => {
    await changePage(event.page + 1)
}

const newUsuario = () => {
    resetForm()
    openModal.value = true;
}

const editUsuario = (usuario) => {
    new_usuario.value = { ...usuario }
    openModal.value = true
}

const confirmDelete = (usuario) => {
    if (window.confirm(`¿Eliminar a ${usuario.name}?`)) {
        onDelete(usuario.id)
    }
}

const getDescriptorFace = async () => {
    isLoading.value = true;
    isLoadingMessage.value = 'Cargando modelos...'

    const faceapi = await import('face-api.js');

    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    isLoadingMessage.value = 'Detectando rostros...'

    const detections = await faceapi.detectAllFaces(image.value)
        .withFaceLandmarks()
        .withFaceDescriptors();

    isLoadingMessage.value = 'Dibujando rostros...'

    const displaySize = { width: image.value.width, height: image.value.height };
    canvas.value.width = displaySize.width;
    canvas.value.height = displaySize.height;

    faceapi.matchDimensions(canvas.value, displaySize);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    const context = canvas.value.getContext('2d');
    context.clearRect(0, 0, canvas.value.width, canvas.value.height);

    faceapi.draw.drawDetections(canvas.value, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas.value, resizedDetections);
    
    const facesData = detections.map(detection => ({
        descriptor: detection.descriptor,
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
