<script setup lang="ts">
const items = [
  { value: 'a', label: 'What is Selaras?' },
  { value: 'b', label: 'Is it free?' },
]
</script>

<template>
  <SAccordion chevron-position="start" :items="items">
    <template #a>
      A UI component library for Nuxt, themed with tv() and CSS variables.
    </template>
    <template #b>
      Yes, MIT licensed.
    </template>
  </SAccordion>
</template>
