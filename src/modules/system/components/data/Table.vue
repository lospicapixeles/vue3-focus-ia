<template>
    <div class="">
        <div class="overflow-hidden rounded-2xl border border-muted-line bg-surface">
            <div style="max-height: calc( 100vh - 185px );"
                class="relative overflow-x-auto">
                <slot />
            </div>
            <div class="border-t border-muted-line px-3 py-2">
                <vue-awesome-paginate :total-items="total" :items-per-page="cant_reg" :max-pages-shown="4"
                    v-model="nro_pag_ref" :on-click="onChangePage"
                    paginate-buttons-class="px-2 mx-1 inline-flex h-8 items-center rounded-full text-ink hover:bg-accent-soft"
                    active-page-class="bg-accent text-white hover:bg-accent-dark"
                    back-button-class="bg-paper hover:bg-accent-soft"
                    next-button-class="bg-paper hover:bg-accent-soft">
                    <template #prev-button>
                        <span>
                            <i class="pi pi-caret-left text-zinc-700 dark:text-zinc-200 transition-all duration-300" />
                        </span>
                    </template>
                    <template #next-button>
                        <span>
                            <i class="pi pi-caret-right text-zinc-700 dark:text-zinc-200 transition-all duration-300" />
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