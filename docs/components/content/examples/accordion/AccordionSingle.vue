<script setup lang="ts">
const items = [
  { value: 'a', label: 'What is Selaras?' },
  { value: 'b', label: 'Is it free?' },
  { value: 'c', label: 'Does it support dark mode?' },
]
</script>

<template>
  <SAccordion type="single" :items="items" default-value="a">
    <template #a>
      A UI component library for Nuxt, themed with tv() and CSS variables.
    </template>
    <template #b>
      Yes, MIT licensed.
    </template>
    <template #c>
      Yes, every color token has a light and dark value.
    </template>
  </SAccordion>
</template>
