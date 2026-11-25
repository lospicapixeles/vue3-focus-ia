<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const props = defineProps({
  variant: { type: String, default: 'default' },
  size: { type: String, default: 'default' },
  type: { type: String, default: 'button' },
  disabled: Boolean,
  class: { type: String, default: '' },
})

const emit = defineEmits(['click'])

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-white hover:bg-accent-dark',
        secondary: 'bg-paper text-ink border border-muted-line hover:bg-accent-soft',
        outline: 'border border-muted-line bg-surface hover:bg-paper text-ink',
        ghost: 'hover:bg-paper text-muted hover:text-ink',
        destructive: 'bg-danger text-white hover:bg-danger/90',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

const classes = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size }), props.class))
</script>

<template>
  <button :type="type" :class="classes" :disabled="disabled" @click="emit('click', $event)">
    <slot />
  </button>
</template>
