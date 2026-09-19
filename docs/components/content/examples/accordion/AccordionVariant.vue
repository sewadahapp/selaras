<script setup lang="ts">
const items = [
  { value: 'a', label: 'What is Selaras?' },
  { value: 'b', label: 'Is it free?' },
]
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <SAccordion variant="list" :items="items">
      <template #a>
        A UI component library for Nuxt, themed with tv() and CSS variables.
      </template>
      <template #b>
        Yes, MIT licensed.
      </template>
    </SAccordion>
    <SAccordion variant="pill" :items="items">
      <template #a>
        A UI component library for Nuxt, themed with tv() and CSS variables.
      </template>
      <template #b>
        Yes, MIT licensed.
      </template>
    </SAccordion>
  </div>
</template>
