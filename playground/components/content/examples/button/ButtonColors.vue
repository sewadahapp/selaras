<script setup lang="ts">
const colors = ['primary', 'secondary', 'success', 'danger', 'info', 'warning', 'neutral'] as const
</script>

<template>
  <div class="flex flex-col gap-3">
    <div v-for="color in colors" :key="color" class="flex flex-wrap items-center gap-3">
      <span class="w-20 shrink-0 text-sm text-[var(--ui-text-muted)] capitalize">{{ color }}</span>
      <SButton :color="color" variant="solid">
        Solid
      </SButton>
      <SButton :color="color" variant="soft">
        Soft
      </SButton>
      <SButton :color="color" variant="outline">
        Outline
      </SButton>
      <SButton :color="color" variant="ghost">
        Ghost
      </SButton>
      <SButton :color="color" variant="text">
        Text
      </SButton>
    </div>
  </div>
</template>
