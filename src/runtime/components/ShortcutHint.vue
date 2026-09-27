<script setup lang="ts">
import Kbd from './Kbd.vue'

defineProps<{ shortcut?: string }>()
</script>

<template>
  <span v-if="shortcut" class="ml-auto inline-flex items-center gap-1" aria-hidden="true">
    <Kbd v-for="key in shortcut.split('+')" :key="key" :value="key.trim()" size="sm" />
  </span>
</template>
