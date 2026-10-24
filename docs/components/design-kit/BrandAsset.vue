<script setup lang="ts">
import { getBrandAssetCopy } from '~/utils/brand-asset-copy'

const props = defineProps<{
  label: string
  svg: string
  png: string
  background?: 'light' | 'dark'
  layout?: 'symbol' | 'horizontal' | 'stacked'
}>()

const assetUrl = useDocsAssetUrl()
const icons = useIcons()
const { locale } = useDocsLocale()
const toast = useToast()
const { copy, copied } = useDocsClipboard()
const copying = ref(false)
const copyText = computed(() => getBrandAssetCopy(locale.value, props.label, props.layout ?? 'symbol'))

async function copySvg() {
  copying.value = true
  try {
    const response = await fetch(assetUrl(props.svg)!)
    if (!response.ok)
      throw new Error('Asset unavailable')
    await copy(await response.text(), props.svg)
  }
  catch {
    toast.add({ title: copyText.value.errorTitle, description: copyText.value.errorDescription, color: 'danger' })
  }
  finally {
    copying.value = false
  }
}
</script>

<template>
  <article class="brand-asset">
    <div class="brand-asset-preview" :class="[`brand-asset-preview--${background ?? 'light'}`, `brand-asset-preview--${layout ?? 'symbol'}`]">
      <img :src="assetUrl(png)" :alt="`${label} ${layout === 'symbol' || !layout ? 'symbol' : `${layout} logo`}`" width="256" height="256">
    </div>
    <div class="brand-asset-caption">
      <h3>{{ label }}</h3>
      <div class="brand-asset-actions">
        <SButton as="a" :href="assetUrl(svg)" download variant="ghost" color="neutral" size="sm" :aria-label="copyText.downloadSvg">
          SVG
        </SButton>
        <SButton as="a" :href="assetUrl(png)" download variant="ghost" color="neutral" size="sm" :aria-label="copyText.downloadPng">
          PNG
        </SButton>
        <SButton
          variant="ghost"
          color="neutral"
          size="sm"
          :icon="copied === svg ? icons.check : icons.copy"
          :aria-label="copied === svg ? copyText.copied : copyText.copy"
          :title="copied === svg ? copyText.copiedTitle : copyText.copyTitle"
          :loading="copying"
          :disabled="copying"
          @click="copySvg"
        />
      </div>
    </div>
    <span class="sr-only" role="status">{{ copied === svg ? copyText.announcement : '' }}</span>
  </article>
</template>

<style scoped>
.brand-asset {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--selaras-resolved-border-default);
  border-radius: var(--selaras-resolved-radius-lg);
}

.brand-asset-preview {
  display: grid;
  place-items: center;
  min-height: 15rem;
  padding: 2.5rem;
}

.brand-asset-preview--light {
  background: #fff;
}

.brand-asset-preview--dark {
  background: #111214;
}

.brand-asset-preview img {
  display: block;
  width: 8rem;
  height: 8rem;
  object-fit: contain;
}

.brand-asset-preview--horizontal img {
  width: min(100%, 22rem);
  height: 7rem;
}

.brand-asset-preview--stacked img {
  width: 12rem;
  height: 10rem;
}

.brand-asset-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 4.25rem;
  padding: 0.75rem 1rem 0.75rem 1.25rem;
  border-top: 1px solid var(--selaras-resolved-border-default);
  background: var(--selaras-resolved-surface-default);
}

h3 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.brand-asset-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0.125rem;
}
</style>
