<script setup lang="ts">
const links = [
  { id: 'usage', text: 'Usage', depth: 2 },
  { id: 'props', text: 'Props', depth: 2, children: [
    { id: 'slots', text: 'Slots', depth: 3 },
  ] },
]
</script>

<template>
  <SContentToc :links="links" class="w-48">
    <template #link="{ link, active }">
      <span class="flex items-center gap-2">
        {{ link.text }}
        <SBadge v-if="active" label="Reading" color="primary" size="sm" />
      </span>
    </template>
  </SContentToc>
</template>
