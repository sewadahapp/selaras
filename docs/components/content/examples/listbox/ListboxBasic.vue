<script setup lang="ts">
const selected = ref('Design')
const items = ['Design', 'Engineering', 'Operations', 'Support']
</script>

<template>
  <div class="w-full max-w-sm space-y-3">
    <SListbox v-model="selected" :items="items" label="Department" />
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
      Selected: {{ selected ?? 'None' }}
    </p>
  </div>
</template>
