<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const config = useRuntimeConfig()
const appConfig = useAppConfig()
const siteName = computed(() => appConfig.selarasDocs?.site?.name ?? 'Documentation')
const missing = computed(() => props.error.statusCode === 404)
const pending = ref(false)

useSeoMeta({
  title: () => `${missing.value ? 'Page not found' : 'Something went wrong'} — ${siteName.value}`,
  robots: 'noindex',
})

function reload() {
  pending.value = true
  window.location.reload()
}

async function goHome(event: MouseEvent) {
  event.preventDefault()
  const path = appConfig.selarasDocs?.errors?.homeTo ?? '/'
  try {
    await clearError({ redirect: path })
  }
  catch {
    window.location.assign(`${config.app.baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`)
  }
}
</script>

<template>
  <div class="selaras-docs-root selaras-docs-error-page">
    <header class="selaras-docs-error-header">
      <a :href="config.app.baseURL" class="selaras-docs-error-brand" :aria-label="`${siteName} home`">
        <DocsLogo />
        <span>{{ siteName }}</span>
      </a>
    </header>
    <main class="selaras-docs-error-main">
      <DocsErrorState :kind="missing ? 'notFound' : 'fatal'" :pending="pending" @retry="reload" @home="goHome" />
    </main>
  </div>
</template>

<style scoped>
.selaras-docs-error-page {
  min-height: 100svh;
  color: var(--selaras-resolved-text-default);
}

.selaras-docs-error-header {
  width: min(100%, 90rem);
  margin: 0 auto;
  padding: 1.5rem;
}

.selaras-docs-error-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: inherit;
  font-size: 1.125rem;
  font-weight: 650;
  text-decoration: none;
}

.selaras-docs-error-brand:focus-visible {
  border-radius: var(--selaras-resolved-radius-sm);
  outline: 2px solid var(--selaras-resolved-color-primary-focus);
  outline-offset: 4px;
}

.selaras-docs-error-main {
  display: grid;
  align-items: center;
  min-height: calc(100svh - 6rem);
  padding: 1.5rem 1.5rem 5rem;
}
</style>
