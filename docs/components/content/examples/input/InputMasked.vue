<script setup lang="ts">
const phone = ref('')
</script>

<template>
  <div class="grid gap-2">
    <SInput v-model="phone" v-mask="'(###) ###-####'" inputmode="tel" placeholder="(555) 123-4567" />
    <p class="text-sm text-content-muted">
      Value: {{ phone || '—' }}
    </p>
  </div>
</template>
