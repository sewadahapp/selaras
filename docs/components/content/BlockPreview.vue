<script setup lang="ts">
import { documentationBlocks } from '../../utils/blocks'

const props = defineProps<{ name: string }>()
const block = computed(() => documentationBlocks.find(block => block.name === props.name))
const view = ref<'preview' | 'code'>('preview')
const preset = useDocsThemePreset()
const colorMode = useColorMode()
const assetUrl = useDocsAssetUrl()
const { copy, copied } = useDocsClipboard()
const sources = import.meta.glob<string>('~/components/content/examples/blocks/*.vue', { query: '?raw', import: 'default', eager: true })
const source = computed(() => Object.entries(sources).find(([path]) => path.endsWith(`/${block.value?.file}`))?.[1] ?? '')
const files = computed(() => [
  { name: 'app', children: [
    { name: 'pages', children: [{ name: 'index.vue', code: source.value }] },
    { name: 'app.vue', code: '<template>\n  <SApp>\n    <NuxtPage />\n  </SApp>\n</template>\n' },
    { name: 'assets', children: [{ name: 'main.css', code: '@import "tailwindcss";\n@import "@sewadah/selaras";\n@import "#selaras/tailwind.css";\n' }] },
  ] },
  { name: 'nuxt.config.ts', code: 'export default defineNuxtConfig({\n  modules: [\'@sewadah/selaras\'],\n  css: [\'~/assets/main.css\'],\n})\n' },
])
const devices = [
  { value: 'desktop', label: 'Desktop', icon: 'hugeicons:computer', width: 1024 },
  { value: 'tablet', label: 'Tablet', icon: 'hugeicons:tablet-01', width: 768 },
  { value: 'mobile', label: 'Mobile', icon: 'hugeicons:smart-phone-01', width: 390 },
]
</script>

<template>
  <DocsErrorBoundary kind="example" :reset-key="name">
    <section v-if="block" class="not-prose min-w-0" :aria-label="`${block.title} block`">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="inline-flex gap-1 rounded-[var(--selaras-resolved-radius-md)] border border-[var(--selaras-resolved-border-default)] p-1" role="group" aria-label="Block view">
          <SButton :variant="view === 'preview' ? 'soft' : 'ghost'" :color="view === 'preview' ? 'primary' : 'neutral'" :aria-pressed="view === 'preview'" size="sm" @click="view = 'preview'">
            Preview
          </SButton>
          <SButton :variant="view === 'code' ? 'soft' : 'ghost'" :color="view === 'code' ? 'primary' : 'neutral'" :aria-pressed="view === 'code'" size="sm" @click="view = 'code'">
            Code
          </SButton>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <SButton variant="outline" color="neutral" size="sm" :icon="copied === name ? 'hugeicons:tick-02' : 'hugeicons:copy-01'" @click="copy(source, name)">
            {{ copied === name ? 'Copied' : 'Copy Vue' }}
          </SButton>
          <SButton as="a" :href="assetUrl(`/examples/blocks/${block.slug}`)" target="_blank" rel="noopener noreferrer" variant="ghost" color="neutral" size="sm" icon="hugeicons:arrow-up-right-01" :aria-label="`Open ${block.title} preview in a new tab`">
            Open preview
          </SButton>
        </div>
      </div>
      <p class="sr-only" role="status">
        {{ copied === name ? 'Vue source copied to clipboard.' : '' }}
      </p>
      <DocsViewportPreview
        v-show="view === 'preview'" :src="`/examples/blocks/${block.slug}`" :title="`${block.title} interactive preview`"
        :devices="devices" default-device="desktop" :height="block.height" :reload-key="`${preset}:${colorMode.value}`"
      />
      <div v-if="view === 'code'">
        <p class="mb-3 text-sm leading-6 text-[var(--selaras-resolved-text-muted)]">
          Copy the page into an existing Nuxt app. The other files show the required Selaras setup.
        </p>
        <SCodeTree :items="files" class="h-[36rem] flex-col sm:flex-row" :ui="{ tree: 'w-full max-h-40 border-e-0 border-b sm:w-48 sm:max-h-none sm:border-e sm:border-b-0', content: 'min-h-0' }" />
      </div>
    </section>
    <SAlert v-else color="danger" title="Block not found" :description="`No block is registered with the name ${name}.`" />
  </DocsErrorBoundary>
</template>
