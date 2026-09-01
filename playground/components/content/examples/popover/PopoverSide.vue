<script setup lang="ts">
const sides = ['top', 'right', 'bottom', 'left'] as const
const side = ref<typeof sides[number]>('bottom')
</script>

<template>
  <SButtonGroup>
    <SButton v-for="s in sides" :key="s" variant="soft" @click="side = s">
      {{ s }}
    </SButton>
  </SButtonGroup>

  <div class="mt-4">
    <SPopover :side="side">
      <SButton variant="outline">
        Open popover
      </SButton>
      <template #content>
        Positioned on the {{ side }}.
      </template>
    </SPopover>
  </div>
</template>
