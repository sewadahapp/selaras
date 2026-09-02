<script setup lang="ts">
const items = [
  { value: 'a', label: 'What is Selaras?' },
  { value: 'b', label: 'Is it free?' },
]
</script>

<template>
  <SAccordion :items="items">
    <template #chevron-icon>
      <span class="relative size-4 shrink-0 text-[var(--ui-text-muted)]">
        <SIcon name="hugeicons:plus-sign" class="absolute inset-0 transition-opacity group-data-[state=open]:opacity-0" />
        <SIcon name="hugeicons:minus-sign" class="absolute inset-0 opacity-0 transition-opacity group-data-[state=open]:opacity-100" />
      </span>
    </template>
    <template #a>
      A UI component library for Nuxt, themed with tv() and CSS variables.
    </template>
    <template #b>
      Yes, MIT licensed.
    </template>
  </SAccordion>
</template>
