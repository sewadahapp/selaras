<script setup lang="ts">
import type { ChangelogPackage } from '../../utils/changelog'
import ProseH3 from '@sewadah/selaras/components/ProseH3.vue'
import ProseH4 from '@sewadah/selaras/components/ProseH4.vue'
import ProseH5 from '@sewadah/selaras/components/ProseH5.vue'
import ProseH6 from '@sewadah/selaras/components/ProseH6.vue'
import ProsePre from '@sewadah/selaras/components/ProsePre.vue'
import history from '#build/selaras-changelog.json'
import { useDocsRoutePath } from '../../../packages/docs/app/composables/useDocsRoutePath'
import { changelogHashTarget, scopeReleaseHeadings } from '../../utils/changelog'

definePageMeta({
  layout: 'home',
  validate: route => !route.params.package || ['docs', 'mcp'].includes(String(route.params.package)),
})

const packages = history as ChangelogPackage[]
const route = useRoute()
const docsRoutePath = useDocsRoutePath()
const { locale } = useDocsLocale()
const isId = computed(() => locale.value === 'id')
const copy = computed(() => isId.value
  ? {
      title: 'Catatan perubahan',
      description: 'Pembaruan Selaras, layer dokumentasi, dan alat agen. Setiap paket memiliki riwayat rilis sendiri.',
      migrating: 'Migrasi ke 1.0',
      packageLabel: 'Paket changelog',
      releaseSource: 'Catatan rilis ditampilkan sesuai teks publikasi aslinya.',
      viewGithub: 'Lihat di GitHub',
      older: 'Tampilkan rilis lama',
      full: 'Changelog lengkap',
      titleFor: (label: string) => `Changelog ${label}`,
      packages: {
        core: { label: 'Selaras', description: 'Komponen, theming, dan modul Nuxt.' },
        docs: { label: 'Layer Docs', description: 'Layer dokumentasi yang dapat digunakan kembali.' },
        mcp: { label: 'Server MCP', description: 'Penemuan komponen dan dokumentasi untuk agen.' },
      },
    }
  : {
      title: 'Changelog',
      description: 'Updates to Selaras, the docs layer, and agent tools. Each package has its own release history.',
      migrating: 'Migrating to 1.0',
      packageLabel: 'Changelog package',
      releaseSource: '',
      viewGithub: 'View on GitHub',
      older: 'Show older releases',
      full: 'Full changelog',
      titleFor: (label: string) => `${label} changelog`,
      packages: {
        core: { label: 'Selaras', description: 'Components, theming, and the Nuxt module.' },
        docs: { label: 'Docs layer', description: 'The reusable documentation layer.' },
        mcp: { label: 'MCP server', description: 'Component discovery and documentation for agents.' },
      },
    })
const activePackage = computed(() => packages.find(pkg => pkg.id === (route.params.package || 'core')) ?? packages[0]!)
const activePackageCopy = computed(() => copy.value.packages[activePackage.value.id as keyof typeof copy.value.packages]!)
const visibleCount = ref(3)
const releases = computed(() => activePackage.value.releases.slice(0, visibleCount.value))
watch(() => activePackage.value.id, () => {
  visibleCount.value = 3
})
const proseComponents = { h3: ProseH3, h4: ProseH4, h5: ProseH5, h6: ProseH6, pre: ProsePre }
const releaseUrl = (tag: string) => `https://github.com/sewadahapp/selaras/releases/tag/${encodeURIComponent(tag)}`
const formatDate = (date: string) => new Intl.DateTimeFormat(isId.value ? 'id-ID' : 'en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date))

let stopHashScroll = () => {}
onMounted(() => {
  watch(() => [activePackage.value.id, route.hash], async () => {
    stopHashScroll()
    const hash = route.hash
    const packageId = activePackage.value.id
    const target = changelogHashTarget(activePackage.value.releases, hash)
    if (!target)
      return
    visibleCount.value = Math.max(visibleCount.value, target.index + 1)
    await nextTick()
    if (route.hash !== hash || activePackage.value.id !== packageId)
      return
    const scroll = () => {
      const element = document.getElementById(target.id)
      if (!element)
        return false
      element.scrollIntoView()
      return true
    }
    if (scroll())
      return
    const root = document.querySelector('.changelog-releases')
    if (!root)
      return
    const observer = new MutationObserver(() => {
      if (scroll())
        stopHashScroll()
    })
    observer.observe(root, { childList: true, subtree: true })
    const timeout = window.setTimeout(observer.disconnect.bind(observer), 5000)
    stopHashScroll = () => {
      observer.disconnect()
      window.clearTimeout(timeout)
    }
  }, { immediate: true, flush: 'post' })
})
onUnmounted(() => stopHashScroll())

useDocsSeo(() => ({
  title: activePackage.value.id === 'core' ? copy.value.title : copy.value.titleFor(activePackageCopy.value.label),
  description: isId.value ? `Catatan rilis ${activePackageCopy.value.label}. Fitur, perbaikan, perubahan yang tidak kompatibel, dan panduan peningkatan.` : `Release notes for ${activePackage.value.name}. Features, fixes, breaking changes, and upgrade guidance.`,
}), { translationAvailable: true })
</script>

<template>
  <div class="changelog-page">
    <header class="changelog-intro">
      <h1>{{ copy.title }}</h1>
      <p>{{ copy.description }}</p>
      <SButton :to="docsRoutePath('/overview/getting-started/migrating-to-1')" variant="link" color="neutral" :ui="{ base: 'px-0' }">
        {{ copy.migrating }}
      </SButton>
    </header>

    <nav class="changelog-packages" :aria-label="copy.packageLabel">
      <SButton
        v-for="pkg in packages"
        :key="pkg.id"
        :to="docsRoutePath(pkg.path)"
        :variant="activePackage.id === pkg.id ? 'soft' : 'text'"
        :color="activePackage.id === pkg.id ? 'primary' : 'neutral'"
        :aria-current="activePackage.id === pkg.id ? 'page' : undefined"
      >
        {{ copy.packages[pkg.id as keyof typeof copy.packages]!.label }}
      </SButton>
    </nav>

    <div class="changelog-package-details">
      <p>{{ activePackageCopy.label }} · {{ activePackage.name }}</p>
      <span>{{ activePackageCopy.description }}</span>
    </div>

    <p v-if="isId" class="changelog-source-note" role="note">
      {{ copy.releaseSource }}
    </p>

    <div class="changelog-releases">
      <article v-for="release in releases" :id="release.tag" :key="release.tag" class="changelog-release" :aria-labelledby="`${release.tag}-title`">
        <header class="release-meta">
          <h2 :id="`${release.tag}-title`">
            <NuxtLink :to="`${docsRoutePath(activePackage.path)}#${release.tag}`">
              v{{ release.version }}
            </NuxtLink>
          </h2>
          <time v-if="release.date" :datetime="release.date">{{ formatDate(release.date) }}</time>
          <a :href="releaseUrl(release.tag)" target="_blank" rel="noreferrer" :aria-label="`${copy.viewGithub}: ${activePackageCopy.label} v${release.version}`">{{ copy.viewGithub }} <span aria-hidden="true">↗</span></a>
        </header>
        <MDC :key="release.tag" v-slot="{ body, data }" :value="release.body" :cache-key="`changelog-${release.tag}`">
          <MDCRenderer v-if="body" :body="scopeReleaseHeadings(body, release.tag)" :data="data" :components="proseComponents" tag="div" class="selaras-prose release-notes" />
        </MDC>
      </article>
    </div>

    <div class="changelog-more">
      <SButton v-if="visibleCount < activePackage.releases.length" variant="outline" color="neutral" @click="visibleCount += 3">
        {{ copy.older }}
      </SButton>
      <a :href="`https://github.com/sewadahapp/selaras/blob/master/${activePackage.source}`" target="_blank" rel="noreferrer">
        {{ copy.full }} {{ activePackageCopy.label }} <span aria-hidden="true">↗</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.changelog-page {
  width: min(100%, 76rem);
  min-height: calc(100svh - 14rem);
  margin-inline: auto;
  padding: 5rem 1.5rem 6rem;
}

.changelog-intro {
  max-width: 42rem;
  margin-bottom: 2.5rem;
}

.changelog-intro h1 {
  margin: 0;
  font-size: clamp(2.75rem, 2rem + 2vw, 4rem);
  font-weight: 650;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.changelog-intro p {
  margin: 1.25rem 0 0.5rem;
  font-size: 1.125rem;
  line-height: 1.65;
}

.changelog-packages {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.changelog-package-details {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 1rem;
  margin-top: 1.5rem;
  line-height: 1.6;
}

.changelog-package-details p {
  margin: 0;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.changelog-package-details span,
.release-meta time {
  color: var(--selaras-resolved-text-muted);
}

.changelog-releases {
  display: grid;
  gap: 5rem;
  margin-top: 3.5rem;
}

.changelog-release {
  display: grid;
  grid-template-columns: 12rem minmax(0, 1fr);
  gap: 1.5rem 3rem;
  scroll-margin-top: 6rem;
}

.release-meta {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.75rem;
}

.release-meta h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.release-meta a {
  color: inherit;
  text-underline-offset: 0.25em;
}

.release-meta a:hover,
.changelog-more a:hover {
  text-decoration: underline;
}

.release-notes {
  min-width: 0;
  max-width: 65ch;
  overflow-wrap: anywhere;
}

.release-notes :deep(> :first-child) {
  margin-top: 0;
}

.changelog-more {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 4rem;
}

.changelog-more a {
  color: var(--selaras-resolved-text-default);
  text-underline-offset: 0.25em;
}

@media (max-width: 47.999rem) {
  .changelog-page { padding: 3rem 1.25rem 4rem; }
  .changelog-release { grid-template-columns: minmax(0, 1fr); }
  .changelog-releases { gap: 3.5rem; margin-top: 2.5rem; }
  .release-meta { gap: 0.5rem; }
}
</style>
