<template>
    <div class="w-full space-y-2">
        <MenuDrop 
            v-for="menu in menus" 
            :key="menu.id" 
            :name="menu.name"
            :icon="menu.icon"
            :menus="menu.children" />
    </div>
</template>

<script setup>
import useMenu from '../../hooks/useMenu';
import MenuDrop from './MenuDrop.vue'

const {
    menus
} = useMenu()
</script>