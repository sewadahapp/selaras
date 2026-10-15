<script setup lang="ts">
import type { Component } from 'vue'
import { documentationBlocks } from '../../../utils/blocks'

const route = useRoute()
const block = documentationBlocks.find(block => block.slug === route.params.slug)
if (!block)
  throw createError({ statusCode: 404, statusMessage: 'Block preview not found', fatal: true })
const modules = import.meta.glob('~/components/content/examples/blocks/*.vue')
const loader = Object.entries(modules).find(([path]) => path.endsWith(`/${block.file}`))?.[1]
if (!loader)
  throw createError({ statusCode: 404, statusMessage: 'Block preview not found', fatal: true })
const component = defineAsyncComponent(loader as () => Promise<Component>)
definePageMeta({ layout: false, key: route => route.path })
useHead({ title: `${block.title} preview`, meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <DocsErrorBoundary kind="example" :reset-key="block!.name">
    <component :is="component" />
  </DocsErrorBoundary>
</template>
