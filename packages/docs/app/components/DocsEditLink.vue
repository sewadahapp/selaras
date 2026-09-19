<script setup lang="ts">
const props = defineProps<{
  path: string
}>()

const appConfig = useAppConfig()
const docsConfig = computed(() => appConfig.selarasDocs ?? {})

const editUrl = computed(() => {
  const repository = docsConfig.value.repository
  if (!repository?.url || repository.editLinks === false)
    return undefined

  const base = repository.url.replace(/\/$/, '')
  const relativePath = props.path === '/' ? 'index.md' : `${props.path.replace(/^\//, '')}.md`
  const contentPath = [repository.contentDirectory ?? 'content', relativePath].join('/')
  const branch = repository.branch ?? 'main'

  if (base.startsWith('https://github.com/'))
    return `${base}/edit/${branch}/${contentPath}`
  if (base.startsWith('https://gitlab.com/'))
    return `${base}/-/edit/${branch}/${contentPath}`
  return undefined
})
</script>

<template>
  <a v-if="editUrl" :href="editUrl" class="selaras-docs-edit-link" target="_blank" rel="noreferrer">
    Edit this page
  </a>
</template>
