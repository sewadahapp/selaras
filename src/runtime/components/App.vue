<script setup lang="ts">
import { ToastProvider } from 'reka-ui'
</script>

<template>
  <ToastProvider>
    <slot />
  </ToastProvider>
</template>
