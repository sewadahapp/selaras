<script setup lang="ts">
import { ToastProvider, TooltipProvider } from 'reka-ui'
</script>

<template>
  <ToastProvider>
    <TooltipProvider>
      <slot />
    </TooltipProvider>
  </ToastProvider>
</template>
