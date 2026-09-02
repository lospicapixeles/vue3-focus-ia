<template>
    <div class="w-full flex space-x-1">
        <div ref="select" class="w-full flex flex-col items-center relative transition-all duration-300">
            <div :class="open ? 'ring-2 ring-accent' : ''"
                class="flex w-full rounded-xl border border-muted-line bg-surface pl-3 transition-all">
                <input ref="input" :disabled="props.disabled"
                    :class="props.disabled ? 'cursor-not-allowed opacity-50' : ''"
                    @focus="open = true, query = '', result = props.options" v-model="query" @keyup="onSearch()"
                    @keypress.enter="onSelect(result[indexItem])" @keydown.arrow-down="onKeydown($event)"
                    @keydown.arrow-up="onKeydown($event)" @keydown.tab="open = false"
                    :placeholder="props.placeholder ? props.placeholder : 'Seleccione un Item'"
                    :aria-expanded="open"
                    role="combobox"
                    class="w-full appearance-none bg-transparent py-2.5 outline-none">
                <input hidden class="p-1 appearance-none bg-transparent outline-none w-full" :value="modelValue">
                <div class="text-gray-300 w-8 flex items-center border-gray-200">
                    <label for="input">
                        <button @click="open = !open,result = props.options, input.focus()" type="button"
                            :disabled="props.disabled"
                            class="hidden h-6 w-8 cursor-pointer text-muted outline-none md:inline-block">
                            <i v-if="!open" class="pi pi-caret-down" />
                            <i v-else class="pi pi-caret-up" />
                        </button>
                        <button v-if="!open" @click="open = !open,result = props.options, input.focus()"
                            :disabled="props.disabled" type="button"
                            class="inline-block md:hidden cursor-pointer w-8 h-6 text-gray-600 dark:text-gray-300 outline-none focus:outline-none transition-all duration-300">
                            <i class="pi pi-caret-down" />
                        </button>
                        <button v-if="open" @click="onSearch()" :disabled="props.disabled" type="button"
                            class="inline-block md:hidden">
                            <i class="pi pi-search" />
                        </button>
                    </label>
                </div>
            </div>
            <div v-if="open" ref="divResultRef"
                class="absolute z-[9] mt-12 max-h-48 w-full overflow-y-auto rounded-xl border border-muted-line bg-surface shadow-lg">
                <div v-if="result.length">
                    <ul v-if="!table">
                        <li v-for="(item,index) in result" :key="item" @click="onSelect(item), emits('selected', item)"
                            class="w-full cursor-pointer border-b border-muted-line text-ink hover:bg-accent-soft"
                            :class="{'bg-accent text-white hover:bg-accent-dark' : item.codigo == modelValue}">
                            <div class="w-full px-3 py-2" :class="{ 'text-white': item.codigo == modelValue}">
                                <h1 :class="{'underline decoration-accent' : indexItem == index && item.codigo != modelValue}">
                                    {{ item.descripcion }}
                                </h1>
                            </div>
                        </li>
                    </ul>
                    <div v-else>
                        <table class="w-full table-fixed">
                            <thead>
                                <tr>
                                    <th v-for="(value, key, index) in result[0]" :key="key"
                                        :class="index == 1 ? 'w-[150px]' : index == 0 ? 'w-[65px]' : 'w-[40px]'"
                                        class="text-left text-xs px-2 py-1 bg-gray-100 dark:bg-gray-950 dark:text-white border-b dark:border-gray-700">
                                        {{ key }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in result" :key="index"
                                    @click="onSelect(item), emits('selected', item)"
                                    class="w-full text-xs cursor-pointer text-gray-800 border-b dark:border-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    :class="{'bg-blue-500 text-white hover:bg-blue-500 dark:hover:bg-blue-500' : item.codigo == modelValue}">
                                    <td v-for="(value, key) in item" :key="key" class="px-2 py-1">{{ value }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <ul v-else class="text-center py-2">
                    <li class="text-gray-500 text-sm">🤔 No hay datos</li>
                    <div v-if="add" class="py-2">
                        <button type="button" @click="addItem()" class="text-skin-success">
                            <i class="pi pi-plus" /> Nuevo
                        </button>
                    </div>
                </ul>
            </div>
        </div>
        <button 
            v-if="isReload" 
            @click="onReload()"
            class="bg-blue-500 px-2 rounded-md text-white" :disabled="disabled"
            :class="{ 'opacity-50': disabled }" type="button">
            <i :spin="disabled" class="pi pi-sync" />
        </button>
    </div>
</template>


<script setup>
import { onMounted, ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core'

const props = defineProps([
    'modelValue', 
    'options', // options is [{codigo: 001, descripcion: 'text'}] 👈🤨 
    'mode', //mode is 'offline' or 'online' 📡
    'placeholder',
    'focus',
    'dark',
    'add', //true, false,
    'table', //true, false,
    'disabled',
    'isReload'
]) 

const emits = defineEmits(['update:modelValue','keywords', 'blur', 'selected', 'addItem', 'unfocus', 'reload'])

const select = ref(null) //para acceder al DOM de todo el componente

const query = ref('') //texto que se muestra en el box y tambien para realizar busquedas
const result = ref([])
const open = ref(false)
const input = ref(null)

const onReload = () => {
    emits('reload')
}

//observador de foco de input - buscador
onClickOutside(select, (event) => {
    open.value = false
    onBlur()
    if(props.modelValue){
        props.options?.map(item => {
            if(item.codigo == `${props.modelValue}`){
                onSelect(item)
            }
        })
    }
})

const onSelect = (item) => {
    if(!item) return
    emits('update:modelValue', item.codigo)
    query.value = item.descripcion
    open.value = false
    input.value.blur()
}

const addItem = () => {
    emits('addItem', query.value)
}

//blur
const onBlur = () => {
    emits('blur')
}

const onSearch = async () => {
    if(props.mode === 'offline'){

        result.value = await props.options.filter(item=>{
            const regex = new RegExp(query.value, 'i')
            // if(item.descripcion.toString().toLowerCase().includes(query.value.toString().toLowerCase())){
            //     return item;
            // }
            return regex.test(item.descripcion)
        });
    }else {
        if(query.value.length >= 3){
            emits('keywords', query.value)
        }
    }
}


//crear un index para manejar la posicion y del array con el teclado y al presionar enter selecionar ese item
const indexItem = ref(0)
const onKeydown = (event) => {
    if(event.key === 'ArrowDown'){
        if(indexItem.value < result.value.length - 1){
            indexItem.value++
        }
    }
    if(event.key === 'ArrowUp'){
        if(indexItem.value > 0){
            indexItem.value--
        }
    }
    if(event.key === 'Enter'){
        onSelect(result.value[indexItem.value])
    }
}

//cuando el indexItem llegue a 5 se haga scroll en el div de resultados hacia abajo y si es menor a 0 hacia arriba
const divResultRef = ref(null)
watch(
    () => indexItem.value,
    (value) => {
        if(value >= 5){
            divResultRef.value.scrollTop += 40
        }
        if(value <= 0){
            divResultRef.value.scrollTop -= 40
        }
        if(value >= result.value.length - 1){
            indexItem.value = result.value.length - 1
            divResultRef.value.scrollTop = divResultRef.value.scrollHeight
        }
    }
)

watch(
    () => props.focus,
    (value) => {
        if(value){
            input.value.focus()
        }
    }
)

watch(
    () => props.options,
    (value) => {
        result.value = value
        //si el vmodel no existe en las opciones se limpia el input
        if(!value.find(item => item.codigo == props.modelValue)){
            query.value = ''
            emits('update:modelValue', null)
            indexItem.value = 0;
        }
    }
)

watch(
    () => props.modelValue,
    (value) => {
        if (value === null) {
            // Limpiar el estado interno directamente si el valor es null
            query.value = '';
            result.value = props.options;
            indexItem.value = 0;
        } else {
            // Si no es null, buscar y seleccionar el elemento correspondiente
            props.options?.map(item => {
                if (item.codigo == `${value}`) {
                    onSelect(item);
                }
            });
        }
    }
);

    
    onMounted(() => {
        result.value = props.options
        props.options?.map(item => {
            if(item.codigo == `${props.modelValue}`){
                onSelect(item)
            }
        })
    })

</script>
