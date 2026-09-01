<script setup lang="ts">
import SlideoverFilterPanel from './SlideoverFilterPanel.vue'

const slideover = useSlideover()
const result = ref<string>()

async function openFilters() {
  const applied = await slideover.open(SlideoverFilterPanel)
  result.value = applied === undefined ? 'Dismissed' : applied ? 'Applied' : 'Cancelled'
}
</script>

<template>
  <div class="flex flex-col items-start gap-2">
    <SButton @click="openFilters">
      Open filters
    </SButton>
    <p v-if="result" class="text-sm text-[var(--ui-text-muted)]">
      Result: {{ result }}
    </p>
  </div>
</template>
