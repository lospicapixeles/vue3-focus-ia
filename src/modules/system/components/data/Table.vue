<template>
    <div class="">
        <div class="bg-white rounded-md dark:bg-zinc-900 transition-all duration-300">
            <div style="max-height: calc( 100vh - 185px );"
                class="overflow-x-auto relative scrollbar scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-white dark:scrollbar-track-zinc-900 transition-all duration-300">
                <slot />
            </div>
            <div class="py-2">
                <vue-awesome-paginate :total-items="total" :items-per-page="cant_reg" :max-pages-shown="4"
                    v-model="nro_pag_ref" :on-click="onChangePage"
                    paginate-buttons-class="px-2 inline-flex rounded mx-1 hover:text-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 h-8 sm:h-auto flex items-center transition-all duration-300"
                    active-page-class="bg-blue-500 text-white dark:bg-blue-500 dark:text-white transition-all duration-300"
                    back-button-class="bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 transition-all duration-300"
                    next-button-class="bg-zinc-100 dark:bg-zinc-700 transition-all duration-300">
                    <template #prev-button>
                        <span>
                            <fa icon="caret-left"
                                class="text-zinc-700 dark:text-zinc-200 transition-all duration-300" />
                        </span>
                    </template>
                    <template #next-button>
                        <span>
                            <fa icon="caret-right"
                                class="text-zinc-700 dark:text-zinc-200 transition-all duration-300" />
                        </span>
                    </template>
                </vue-awesome-paginate>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    total: null,
    cant_reg: null,
    nro_pag: null
})

const emits = defineEmits(['changePage'])

const nro_pag_ref = ref(props.nro_pag)

const onChangePage = (e) => {
    emits('changePage', e)
}

watch(
    () => props.nro_pag,
    (nro_pag) => {
        nro_pag_ref.value = nro_pag
    }
)
</script>

<style scoped>
.scrollbar::-webkit-scrollbar {
    width: 2px;
    height: 13px;
}

.scrollbar::-webkit-scrollbar-track {
    border-radius: 100vh;
}

.scrollbar::-webkit-scrollbar-thumb {
    border-radius: 100vh;
}
</style>