<script setup lang="ts">
import type { SelectModelValue } from '../utils/select-contracts'
import { onMounted, onUnmounted, ref } from 'vue'
import { applyClassPrefix } from '../utils/ui'

defineProps<{ values: SelectModelValue[], name?: string, form?: string, required?: boolean, disabled?: boolean }>()
const emit = defineEmits<{ reset: [] }>()
const anchor = ref<HTMLInputElement>()
let owner: HTMLFormElement | null = null
function reset(event: Event) {
  queueMicrotask(() => {
    if (!event.defaultPrevented)
      emit('reset')
  })
}
onMounted(() => {
  owner = anchor.value?.form ?? null
  owner?.addEventListener('reset', reset)
})
onUnmounted(() => owner?.removeEventListener('reset', reset))
function serialize(value: SelectModelValue) {
  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}
</script>

<template>
  <input ref="anchor" :type="required ? 'text' : 'hidden'" :class="required ? applyClassPrefix('sr-only') : undefined" :form="form" :required="required && !disabled && !values.length" :disabled="disabled || !!values.length" aria-hidden="true" tabindex="-1" autocomplete="off">
  <input v-for="(value, index) in values" :key="index" type="hidden" :name="name" :form="form" :value="serialize(value)" :disabled="disabled">
</template>
