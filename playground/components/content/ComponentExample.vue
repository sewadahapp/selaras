<script setup lang="ts">
/**
 * Resolves a demo by name via import.meta.glob + defineAsyncComponent and
 * mounts it with <component :is> inside this SFC's own compiled template.
 * MDC never constructs a VNode for the actual demo component this way - it
 * only ever renders this wrapper, which takes a plain string prop. Reka UI
 * compound components (anything using provide/inject between a Root and its
 * children) crash Nuxt Content's own runtime AST->VNode resolution, so the
 * demo can never be referenced directly as a tag from markdown.
 */
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
  <div v-if="resolvedComponent" class="not-prose flex flex-wrap items-center gap-3 rounded-[var(--ui-radius-md)] border border-[var(--ui-border)] p-6">
    <ClientOnly>
      <component :is="resolvedComponent" />
    </ClientOnly>
  </div>
  <div v-else class="text-sm text-[var(--ui-danger)]">
    Example "{{ name }}" not found
  </div>
</template>
