<template>
    <CardModal
        :showing="openModal"
        @close="openModal = false"
        title="Nuevo usuario"
    >

    </CardModal>
    <div class="bg-white p-4 rounded-xl">
        <div>
            <h1 class="text-zinc-800 font-medium text-xl">Usuarios</h1>
            <label class="text-zinc-600 text-sm">Administrar acceso de usuarios</label>
        </div>
        <div class="mt-2 flex justify-between">
            <input type="text" placeholder="Buscar usuario"
                class="rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200" />
            <button 
                @click="newUsuario"
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
import useUsuario from '../hooks/useUsuario';
import Table from '../../../components/data/Table.vue'; 
import CardModal from '../../../components/CardModal.vue'

const {
    openModal,
    pag,
    usuarios,
    getUsuarios,
} = useUsuario();

const changePage = async (e) => {
    pag.value.page = e;
    await getUsuarios();
}

const newUsuario = () => {
    openModal.value = true;
}

getUsuarios();
</script>