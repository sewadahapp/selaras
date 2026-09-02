<script setup lang="ts">
const colors = ['primary', 'neutral', 'secondary', 'success', 'danger', 'info', 'warning'] as const
const files = reactive<Record<(typeof colors)[number], File[]>>({
  primary: [],
  neutral: [],
  secondary: [],
  success: [],
  danger: [],
  info: [],
  warning: [],
})
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <SFileUpload v-for="color in colors" :key="color" v-model="files[color]" :color="color" size="sm" />
  </div>
</template>
