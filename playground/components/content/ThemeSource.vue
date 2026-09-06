<script setup lang="ts">
/**
 * Shows a component's actual theme file (src/runtime/theme/<name>.ts) as
 * raw source, read at build time via import.meta.glob's `?raw` query -
 * so this can never drift the way a hand-written "default classes" table
 * would (confirmed the hard way earlier: Modal.vue's own docs went stale
 * after a real code change). No syntax highlighting here (that's
 * @nuxtjs/mdc's own build-time pipeline, driven by markdown fenced code
 * blocks - it can't run against a runtime-loaded string), just the plain
 * source, monospaced.
 */
const props = defineProps<{
  name: string
}>()

const themeModules = import.meta.glob('../../../src/runtime/theme/*.ts', { query: '?raw', import: 'default' })

const source = ref<string | null>(null)

watchEffect(async () => {
  const suffix = `/${props.name}.ts`
  const entry = Object.entries(themeModules).find(([path]) => path.endsWith(suffix))
  source.value = entry ? await entry[1]() as string : null
})

const copied = ref(false)

async function copy() {
  if (!source.value)
    return
  await navigator.clipboard.writeText(source.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <div v-if="source" class="not-prose overflow-hidden rounded-[var(--ui-radius-md)] border border-[var(--ui-border)]">
    <div class="flex items-center justify-between gap-2 border-b border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-2">
      <span class="font-mono text-xs text-[var(--ui-text-muted)]">src/runtime/theme/{{ name }}.ts</span>
      <SButton size="sm" variant="ghost" color="neutral" :icon="copied ? 'hugeicons:tick-02' : 'hugeicons:copy-01'" @click="copy" />
    </div>
    <pre class="overflow-x-auto p-4 text-xs leading-relaxed"><code>{{ source }}</code></pre>
  </div>
  <div v-else class="text-sm text-[var(--ui-danger)]">
    Theme source "{{ name }}" not found
  </div>
</template>
