<script setup lang="ts">
import { getDocsRepositoryLinks } from '../utils/repository-links'

const props = withDefaults(defineProps<{
  path: string
  title?: string
  editLink?: boolean
  issueLink?: boolean
}>(), { editLink: true, issueLink: true })

const appConfig = useAppConfig()
const messages = useDocsMessages()
const links = computed(() => getDocsRepositoryLinks(appConfig.selarasDocs?.repository, props.path, props.title))
const hasEditLink = computed(() => props.editLink && !!links.value.edit)
const hasIssueLink = computed(() => props.issueLink && !!links.value.issue)
</script>

<template>
  <nav v-if="hasEditLink || hasIssueLink" class="selaras-docs-page-actions" :aria-label="messages.pageActions">
    <DocsEditLink v-if="hasEditLink" :path="path" />
    <a v-if="hasIssueLink" :href="links.issue" target="_blank" rel="noreferrer" class="selaras-docs-issue-link">
      <SIcon name="hugeicons:bug-01" aria-hidden="true" />
      {{ messages.reportIssue }}
    </a>
  </nav>
</template>
