<script setup lang="ts">
const props = defineProps<{
  name: string
}>()

const exampleModules = import.meta.glob('~/components/content/examples/**/*.vue')

function pascalCase(value: string) {
  return value.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

const resolvedComponent = computed(() => {
  const suffix = `/${pascalCase(props.name)}.vue`
  const match = Object.entries(exampleModules).find(([path]) => path.endsWith(suffix))
  return match ? defineAsyncComponent(match[1] as any) : null
})
</script>

<template>
  <section v-if="resolvedComponent" :data-example="name">
    <component :is="resolvedComponent" />
  </section>
  <p v-else role="alert">
    Example "{{ name }}" not found
  </p>
</template>
