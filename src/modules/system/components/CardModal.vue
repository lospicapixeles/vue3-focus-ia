<template>
  <Dialog
    :visible="showing"
    modal
    :header="title"
    :style="{ width: 'min(42rem, 94vw)' }"
    :pt="{
      root: { style: { borderRadius: '12px' } },
      header: { style: { borderRadius: '12px 12px 0 0' } }
    }"
    :dismissableMask="true"
    @update:visible="onVisible"
  >
    <slot />
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'

defineProps({
  showing: { type: Boolean, required: true },
  title: { type: String, default: 'Modal' }
})

const emit = defineEmits(['close'])

const onVisible = (visible) => {
  if (!visible) emit('close')
}
</script>
