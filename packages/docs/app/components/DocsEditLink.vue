<script setup lang="ts">
import { getDocsRepositoryLinks } from '../utils/repository-links'

const props = defineProps<{
  path: string
}>()

const appConfig = useAppConfig()
const docsConfig = computed(() => appConfig.selarasDocs ?? {})

const editUrl = computed(() => getDocsRepositoryLinks(docsConfig.value.repository, props.path).edit)
</script>

<template>
  <a v-if="editUrl" :href="editUrl" class="selaras-docs-edit-link" target="_blank" rel="noreferrer">
    <SIcon name="hugeicons:pencil-edit-01" aria-hidden="true" />
    Edit this page
  </a>
</template>
