<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => queryCollection('docs').path(route.path).first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Component not found', fatal: true })
}
</script>

<template>
  <ContentRenderer :value="page" class="docs-content flex flex-col gap-4" />
</template>
