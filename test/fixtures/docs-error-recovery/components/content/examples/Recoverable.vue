<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'

const Fragile = defineComponent({
  setup() {
    const broken = ref(false)
    return () => {
      if (broken.value)
        throw new Error('Private example failure detail')
      return h('button', { onClick: () => broken.value = true }, 'Break example')
    }
  },
})
</script>

<template>
  <Fragile />
</template>
