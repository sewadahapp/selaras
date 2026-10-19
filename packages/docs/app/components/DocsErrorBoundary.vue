<script setup lang="ts">
import type { SelarasDocsErrorKind } from '../../types'
import { useTemplateRef, watch } from 'vue'
import { useRouter } from '#app'
import { isDocsNotFound } from '../utils/error-status'

const props = withDefaults(defineProps<{
  kind?: Extract<SelarasDocsErrorKind, 'page' | 'example'>
  resetKey?: string
}>(), { kind: 'page' })

const boundary = useTemplateRef('boundary')
const router = useRouter()
watch([() => router.currentRoute.value.fullPath, () => props.resetKey], () => boundary.value?.clearError())
</script>

<template>
  <NuxtErrorBoundary ref="boundary">
    <slot />
    <template #error="{ error, clearError }">
      <DocsErrorState :kind="kind === 'page' && isDocsNotFound(error) ? 'notFound' : kind" @retry="clearError" />
    </template>
  </NuxtErrorBoundary>
</template>
