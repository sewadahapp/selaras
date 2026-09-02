<script setup lang="ts">
const sides = ['top', 'right', 'bottom', 'left'] as const
const side = ref<typeof sides[number]>('bottom')
const open = ref(false)

function openWith(value: typeof sides[number]) {
  side.value = value
  open.value = true
}
</script>

<template>
  <SButtonGroup>
    <SButton v-for="s in sides" :key="s" variant="soft" @click="openWith(s)">
      {{ s }}
    </SButton>
  </SButtonGroup>

  <SDrawer v-model:open="open" :side="side" title="Filters">
    <template #body>
      Slides in from the {{ side }} edge.
    </template>
  </SDrawer>
</template>
