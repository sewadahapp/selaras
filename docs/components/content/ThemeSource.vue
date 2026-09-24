<script setup lang="ts">
/**
 * Shows a component's actual theme file (src/runtime/theme/<name>.ts) as
 * raw source, read at build time via import.meta.glob's `?raw` query -
 * so this can never drift the way a hand-written "default classes" table
 * would (confirmed the hard way earlier: Modal.vue's own docs went stale
 * after a real code change).
 */
const props = defineProps<{
  name: string
}>()

const themeModules = import.meta.glob('../../../src/runtime/theme/*.ts', { query: '?raw', import: 'default' })

const source = ref<string | null>(null)
const highlightedCode = ref('')

watchEffect(async () => {
  const suffix = `/${props.name}.ts`
  const entry = Object.entries(themeModules).find(([path]) => path.endsWith(suffix))
  const code = entry ? await entry[1]() as string : null
  source.value = code

  if (!code) {
    highlightedCode.value = ''
    return
  }

  const { codeToHtml } = await import('shiki')
  const html = await codeToHtml(code, {
    lang: 'ts',
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  })
  highlightedCode.value = html.match(/<code(?:\s[^>]*)?>([\s\S]*?)<\/code>/)?.[1] ?? ''
})
</script>

<template>
  <div v-if="source" class="not-prose">
    <SProsePre
      :filename="`src/runtime/theme/${name}.ts`"
      language="ts"
      :code="source"
    >
      <code class="selaras-theme-source-code" v-html="highlightedCode" />
    </SProsePre>
  </div>
  <div v-else class="text-sm text-[var(--selaras-resolved-color-danger-text)]">
    Theme source "{{ name }}" not found
  </div>
</template>
