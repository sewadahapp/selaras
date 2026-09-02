<script setup lang="ts">
const open = ref(false)
const snapPoint = ref<number | string | null>(0.3)
</script>

<template>
  <SButton @click="open = true">
    Open drawer
  </SButton>

  <SDrawer
    v-model:open="open"
    v-model:snap-point="snapPoint"
    :snap-points="[0.3, 0.6, 1]"
    title="Drag me"
    description="Rests at 30%, 60%, or fully open - drag the handle to snap between them."
  >
    <template #body>
      <p class="text-sm text-[var(--ui-text-muted)]">
        Current snap point: {{ snapPoint }}
      </p>
    </template>
  </SDrawer>
</template>
