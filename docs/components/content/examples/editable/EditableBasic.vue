<script setup lang="ts">
const title = ref('Website refresh')
</script>

<template>
  <div class="w-full max-w-md space-y-3">
    <SFormField label="Project name" description="Click the name to edit. Enter saves; Escape cancels.">
      <SEditable v-model="title" />
    </SFormField>
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
      Saved name: {{ title }}
    </p>
  </div>
</template>
