<script setup lang="ts">
import type { ChangelogPackage } from '../../utils/changelog'
import ProseH3 from '@sewadah/selaras/components/ProseH3.vue'
import ProseH4 from '@sewadah/selaras/components/ProseH4.vue'
import ProseH5 from '@sewadah/selaras/components/ProseH5.vue'
import ProseH6 from '@sewadah/selaras/components/ProseH6.vue'
import ProsePre from '@sewadah/selaras/components/ProsePre.vue'
import history from '#build/selaras-changelog.json'
import { scopeReleaseHeadings } from '../../utils/changelog'

definePageMeta({
  layout: 'home',
  validate: route => !route.params.package || ['docs', 'mcp'].includes(String(route.params.package)),
})

const packages = history as ChangelogPackage[]
const route = useRoute()
const activePackage = computed(() => packages.find(pkg => pkg.id === (route.params.package || 'core')) ?? packages[0]!)
const visibleCount = ref(3)
const releases = computed(() => activePackage.value.releases.slice(0, visibleCount.value))
watch(() => activePackage.value.id, () => {
  visibleCount.value = 3
})
const proseComponents = { h3: ProseH3, h4: ProseH4, h5: ProseH5, h6: ProseH6, pre: ProsePre }
const releaseUrl = (tag: string) => `https://github.com/sewadahapp/selaras/releases/tag/${encodeURIComponent(tag)}`
const formatDate = (date: string) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date))

useDocsSeo(() => ({
  title: activePackage.value.id === 'core' ? 'Changelog' : `${activePackage.value.label} changelog`,
  description: `Release notes for ${activePackage.value.name}. Features, fixes, breaking changes, and upgrade guidance.`,
}))
</script>

<template>
  <div class="changelog-page">
    <header class="changelog-intro">
      <h1>Changelog</h1>
      <p>Updates to Selaras, the docs layer, and agent tools. Each package has its own release history.</p>
      <SButton to="/overview/getting-started/migrating-to-1" variant="link" color="neutral" :ui="{ base: 'px-0' }">
        Migrating to 1.0
      </SButton>
    </header>

    <nav class="changelog-packages" aria-label="Changelog package">
      <SButton
        v-for="pkg in packages"
        :key="pkg.id"
        :to="pkg.path"
        :variant="activePackage.id === pkg.id ? 'soft' : 'text'"
        :color="activePackage.id === pkg.id ? 'primary' : 'neutral'"
        :aria-current="activePackage.id === pkg.id ? 'page' : undefined"
      >
        {{ pkg.label }}
      </SButton>
    </nav>

    <div class="changelog-package-details">
      <p>{{ activePackage.name }}</p>
      <span>{{ activePackage.description }}</span>
    </div>

    <div class="changelog-releases">
      <article v-for="release in releases" :id="release.tag" :key="release.tag" class="changelog-release" :aria-labelledby="`${release.tag}-title`">
        <header class="release-meta">
          <h2 :id="`${release.tag}-title`">
            <NuxtLink :to="`${activePackage.path}#${release.tag}`">
              v{{ release.version }}
            </NuxtLink>
          </h2>
          <time v-if="release.date" :datetime="release.date">{{ formatDate(release.date) }}</time>
          <a :href="releaseUrl(release.tag)" target="_blank" rel="noreferrer" :aria-label="`View on GitHub: ${activePackage.label} v${release.version}`">View on GitHub <span aria-hidden="true">↗</span></a>
        </header>
        <MDC :key="release.tag" v-slot="{ body, data }" :value="release.body" :cache-key="`changelog-${release.tag}`">
          <MDCRenderer v-if="body" :body="scopeReleaseHeadings(body, release.tag)" :data="data" :components="proseComponents" tag="div" class="selaras-prose release-notes" />
        </MDC>
      </article>
    </div>

    <div class="changelog-more">
      <SButton v-if="visibleCount < activePackage.releases.length" variant="outline" color="neutral" @click="visibleCount += 3">
        Show older releases
      </SButton>
      <a :href="`https://github.com/sewadahapp/selaras/blob/master/${activePackage.source}`" target="_blank" rel="noreferrer">
        Full {{ activePackage.label }} changelog <span aria-hidden="true">↗</span>
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
