<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'

definePageMeta({ layout: 'selaras-docs' })
const Fragile = defineComponent({
  setup() {
    const broken = ref(false)
    return () => {
      if (broken.value)
        throw new Error('Private page failure detail')
      return h('button', { onClick: () => broken.value = true }, 'Break page')
    }
  },
})
</script>

<template>
  <div>
    <h1>Recovery fixture</h1>
    <Fragile />
    <DocsExample name="recoverable" />
  </div>
</template>
