<template>
    <aside
        class="h-screen sticky top-0 bg-white dark:bg-zinc-950 border-r dark:border-zinc-800 hidden lg:inline-block lg:w-1/4 xl:w-1/5 xxl:w-1/6"
    >
        <div class="overflow-y-auto p-2">
            <Menu />
        </div>
    </aside>
</template>

<script setup>
import useMenu from "../modules/system/hooks/useMenu";
import Menu from "../modules/system/components/menu/Menu.vue";

const { getMenus } = useMenu();

getMenus();
</script>
