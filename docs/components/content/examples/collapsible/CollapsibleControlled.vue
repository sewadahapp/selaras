<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <div class="flex flex-col gap-3">
    <SButton size="sm" @click="open = !open">
      {{ open ? 'Close from outside' : 'Open from outside' }}
    </SButton>
    <SCollapsible v-model:open="open">
      <template #trigger>
        Toggle me
      </template>
      Content controlled by the parent.
    </SCollapsible>
  </div>
</template>
