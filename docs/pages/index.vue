<script setup lang="ts">
import { NuxtLink } from '#components'
import pkg from '../../package.json'
import { useDocsRoutePath } from '../../packages/docs/app/composables/useDocsRoutePath'
import HomeEditSpecimen from '../components/home/HomeEditSpecimen.vue'

definePageMeta({ layout: 'home' })
const { locale } = useDocsLocale()
const isId = computed(() => locale.value === 'id')
const pageCopy = computed(() => isId.value
  ? {
      description: 'Komponen Vue yang aksesibel untuk Nuxt, ditata sepenuhnya dengan variabel CSS.',
      lead: 'Komponen Vue untuk Nuxt dan Tailwind CSS v4. Empat penyesuaian kecil untuk satu antarmuka: terapkan satu per satu dan lihat semuanya terasa milik Anda.',
      getStarted: 'Mulai',
      copied: 'Perintah instalasi disalin',
      copiedStatus: 'Perintah instalasi disalin ke papan klip.',
      copyCommand: 'Salin perintah instalasi npm',
      edits: [
        { title: 'Warna merek Anda', short: 'Warna', text: 'Tentukan satu warna untuk peran utama. Nilai hover, ditekan, teks, dan fokus diturunkan darinya untuk mode terang maupun gelap.' },
        { title: 'Sudut komponen', short: 'Sudut', text: 'Satu token radius. Radius kecil, sedang, dan besar diturunkan dari nilai ini.' },
        { title: 'Semua tombol', short: 'Tombol', text: 'Tambahkan kelas ke setiap kemunculan komponen tanpa perlu membungkusnya.' },
        { title: 'Satu komponen ini', short: 'Instans', text: 'Prop :ui mengubah satu instans dan menjadi prioritas di atas semua pengaturan sebelumnya.' },
      ],
      none: 'Tidak ada',
      liveSpecimen: 'Contoh langsung',
      appliedEdits: 'Penyesuaian yang diterapkan pada contoh',
      liveNote: 'Komponen Selaras langsung. Setiap penyesuaian diterapkan di sini dengan STheme, bentuk terbatas dari pengaturan yang sama, sehingga hanya pratinjau ini yang berubah.',
      notApplied: 'Belum diterapkan. Pilih {short} di atas untuk menerapkannya.',
      explore: 'Jelajahi pustaka',
      agentLead: 'Membangun dengan coding agent?',
      agentLink: 'Berikan API komponen, contoh, dan skill Selaras.',
      areas: [
        { title: 'Komponen', description: 'Input, navigasi, overlay, dan detail di antaranya, dengan dukungan keyboard dan API bertipe.' },
        { title: 'Komposit', description: 'Dasbor yang dapat diubah ukurannya dan tata letak dokumentasi, disusun dari bagian yang sama.' },
        { title: 'Blok', description: 'Antarmuka lengkap untuk dicoba, diperiksa, dan disalin ke proyek Anda.' },
        { title: 'Utilitas', description: 'Buka overlay dari kode, gunakan ikon dan pesan bersama, serta tambahkan mask input.' },
      ],
    }
  : {
      description: 'Accessible Vue components for Nuxt, themed entirely with CSS variables.',
      lead: 'Vue components for Nuxt and Tailwind CSS v4. Four small edits, one interface: apply them in turn and watch it become yours.',
      getStarted: 'Get started',
      copied: 'Install command copied',
      copiedStatus: 'Install command copied to clipboard.',
      copyCommand: 'Copy npm install command',
      edits: [
        { title: 'Your brand colour', short: 'Colour', text: 'Give the primary role one colour. Hover, pressed, text and focus values are derived from it, in light and dark.' },
        { title: 'Your corners', short: 'Corners', text: 'One radius token. The small, medium and large radii are derived from it.' },
        { title: 'Every button', short: 'Buttons', text: 'Add classes to a component everywhere it appears, without wrapping it.' },
        { title: 'Just this one', short: 'Instance', text: 'The :ui prop changes a single instance, and wins over everything above.' },
      ],
      none: 'None',
      liveSpecimen: 'Live specimen',
      appliedEdits: 'Edits applied to the specimen',
      liveNote: 'Live Selaras components. Each edit is applied here with STheme, the scoped form of the same setting, so only this preview changes.',
      notApplied: 'Not applied yet. Choose {short} above to apply it.',
      explore: 'Explore the library',
      agentLead: 'Building with a coding agent?',
      agentLink: 'Give it the component APIs, examples, and the Selaras skill.',
      areas: [
        { title: 'Components', description: 'Inputs, navigation, overlays, and the details in between, with keyboard support and typed APIs.' },
        { title: 'Composites', description: 'Resizable dashboards and documentation layouts, composed from the same parts.' },
        { title: 'Blocks', description: 'Complete interfaces to try, inspect, and copy into your project.' },
        { title: 'Utilities', description: 'Open overlays from code, share icons and messages, and add input masks.' },
      ],
    })
useDocsSeo(() => ({ title: 'Selaras', description: pageCopy.value.description }), { translationAvailable: true })

const preset = useDocsThemePreset()
const colorMode = useColorMode()
const gridColorKey = computed(() => `${preset.value}:${colorMode.value}`)
const installCommand = 'npm install @sewadah/selaras'
const icons = useIcons()
const { copy, copied } = useDocsClipboard()

// The four edits the specimen applies, from the whole app down to one
// component. Each snippet is the real global form of the setting.
const specimen = {
  brand: '#0F766E',
  radius: '0px',
  buttonClass: 'uppercase tracking-wider',
  oneButtonClass: 'rounded-full',
}
const edits = [
  {
    title: 'Your brand colour',
    short: 'Colour',
    file: 'nuxt.config.ts',
    lang: 'ts',
    mark: 6,
    text: 'Give the primary role one colour. Hover, pressed, text and focus values are derived from it, in light and dark.',
    code: `import { defineColorFromSeed } from '@sewadah/selaras/theme'\n\nexport default defineNuxtConfig({\n  selaras: {\n    theme: {\n      colors: { primary: defineColorFromSeed('${specimen.brand}') },\n    },\n  },\n})`,
  },
  {
    title: 'Your corners',
    short: 'Corners',
    file: 'main.css',
    lang: 'css',
    mark: 2,
    text: 'One radius token. The small, medium and large radii are derived from it.',
    code: `:root {\n  --selaras-radius-base: ${specimen.radius};\n}`,
  },
  {
    title: 'Every button',
    short: 'Buttons',
    file: 'app.config.ts',
    lang: 'ts',
    mark: 4,
    text: 'Add classes to a component everywhere it appears, without wrapping it.',
    code: `export default defineAppConfig({\n  selaras: {\n    ui: {\n      button: { slots: { base: '${specimen.buttonClass}' } },\n    },\n  },\n})`,
  },
  {
    title: 'Just this one',
    short: 'Instance',
    file: 'BookingForm.vue',
    lang: 'vue',
    mark: 1,
    text: 'The :ui prop changes a single instance, and wins over everything above.',
    code: `<SButton :ui="{ base: '${specimen.oneButtonClass}' }">\n  Request booking\n</SButton>`,
  },
]
const { data: highlighted } = await useAsyncData('home-edit-snippets', async () => {
  const { codeToHtml } = await import('shiki')
  return Promise.all(edits.map(async (edit) => {
    const html = await codeToHtml(edit.code, {
      lang: edit.lang,
      theme: 'github-dark-default',
      // Mark the one line the edit is about, so it reads without parsing the rest.
      transformers: [{
        line(node, line) {
          if (line === edit.mark)
            this.addClassToHast(node, 'is-edit')
        },
      }],
    })
    return html.match(/<code(?:\s[^>]*)?>([\s\S]*?)<\/code>/)?.[1] ?? ''
  }))
})

// How many edits are applied: scrolling past a step applies it on wide
// screens, and the step buttons (or the phone selector) apply it directly.
const step = ref(0)
const stepValue = computed({
  get: () => String(step.value),
  set: (value) => {
    if (value !== '')
      step.value = Number(value)
  },
})
const stepItems = computed(() => [{ label: pageCopy.value.none, value: '0' }, ...pageCopy.value.edits.map((edit, index) => ({ label: edit.short, value: String(index + 1) }))])
// Phones show the applied edit's code, or the first edit before any is applied.
const shownIndex = computed(() => Math.max(step.value, 1) - 1)
const shownEdit = computed(() => ({ ...edits[shownIndex.value]!, ...pageCopy.value.edits[shownIndex.value]! }))
const stepElements = useTemplateRef<HTMLElement[]>('stepElements')

function updateFromScroll() {
  const line = window.innerHeight * 0.5
  step.value = (stepElements.value ?? []).filter(element => element.getBoundingClientRect().top < line).length
}
function selectStep(index: number) {
  step.value = index
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  stepElements.value?.[index - 1]?.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' })
}

// The specimen answers each change with one brief echo.
const echo = ref(false)
watch(step, () => {
  echo.value = false
  requestAnimationFrame(() => {
    echo.value = true
  })
})

let wide: MediaQueryList | undefined
let frame = 0
function onScroll() {
  if (!wide?.matches || frame)
    return
  frame = requestAnimationFrame(() => {
    frame = 0
    updateFromScroll()
  })
}
onMounted(() => {
  wide = window.matchMedia('(min-width: 64rem)')
  window.addEventListener('scroll', onScroll, { passive: true })
  if (wide.matches)
    updateFromScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(frame)
})

const { data: navigation } = useDocsNavigation()
const docsRoutePath = useDocsRoutePath()
const guidePages = new Set(['/components/forms/validation'])
const areas = [
  { path: '/components', fallback: '/components/elements/button' },
  { path: '/composites', fallback: '/composites/dashboard/dashboard-group' },
  { path: '/blocks', fallback: '/blocks/overview' },
  { path: '/utilities', fallback: '/utilities/composables/use-modal' },
]
const groups = computed(() => areas.map((area) => {
  const item = navigation.value?.find(entry => entry.path === docsRoutePath(area.path))
  const text = pageCopy.value.areas[areas.indexOf(area)]!
  const categories = (item?.children ?? []).map(category => ({
    title: category.title,
    to: category.children?.find(page => !guidePages.has(page.path))?.path ?? category.path,
  }))
  return { ...area, ...text, categories }
}))
</script>

<template>
  <div class="home">
    <section class="home-intro" aria-labelledby="home-title">
      <div class="home-grid-layer">
        <HomeDotGrid :color-key="gridColorKey" />
      </div>
      <div class="home-container home-intro-grid">
        <div class="home-intro-main">
          <h1 id="home-title" class="home-title">
            <span class="home-title-line"><span>{{ isId ? 'Antarmuka,' : 'Interfaces,' }}</span></span>{{ " " }}
            <span class="home-title-line"><span>{{ isId ? 'selaras.' : 'in harmony.' }}</span></span>
          </h1>
          <p class="home-lead">
            {{ pageCopy.lead }}
          </p>
          <div class="home-actions">
            <SButton :as="NuxtLink" :to="docsRoutePath('/overview/getting-started/installation')" size="lg">
              {{ pageCopy.getStarted }}
            </SButton>
            <SButton
              color="neutral" variant="soft" size="lg" class="home-install"
              :trailing-icon="copied === 'install-command' ? icons.check : icons.copy"
              :aria-label="copied === 'install-command' ? pageCopy.copied : pageCopy.copyCommand"
              @click="copy(installCommand, 'install-command')"
            >
              <code>{{ installCommand }}</code>
            </SButton>
            <span class="sr-only" role="status">{{ copied === 'install-command' ? pageCopy.copiedStatus : '' }}</span>
          </div>

          <ol class="home-edits">
            <li
              v-for="(baseEdit, index) in edits"
              ref="stepElements"
              :key="baseEdit.title"
              class="home-edit"
              :class="{ 'is-applied': step > index }"
              :aria-current="step === index + 1 ? 'step' : undefined"
            >
              <h2>
                <button type="button" class="home-edit-toggle" @click="selectStep(index + 1)">
                  <span class="home-edit-number" aria-hidden="true">{{ index + 1 }}</span>
                  {{ pageCopy.edits[index]!.title }}
                </button>
              </h2>
              <p>{{ pageCopy.edits[index]!.text }}</p>
              <figure class="home-code">
                <figcaption>{{ baseEdit.file }}</figcaption>
                <pre><code v-if="highlighted?.[index]" v-html="highlighted[index]" /><code v-else>{{ baseEdit.code }}</code></pre>
              </figure>
            </li>
          </ol>
        </div>

        <aside class="home-specimen-column" :aria-label="pageCopy.liveSpecimen">
          <div class="home-specimen-sticky">
            <SToggleGroup v-model="stepValue" :items="stepItems" size="sm" class="home-step-picker" :aria-label="pageCopy.appliedEdits" />
            <div class="home-specimen-frame" :class="{ 'is-echoing': echo }">
              <HomeEditSpecimen :key="locale" :step="step" v-bind="specimen" />
            </div>
            <p class="home-specimen-note">
              {{ pageCopy.liveNote }}
            </p>
            <div class="home-step-detail">
              <h2>{{ shownEdit.title }}</h2>
              <p>{{ shownEdit.text }}</p>
              <p v-if="step === 0" class="home-step-hint">
                {{ pageCopy.notApplied.replace('{short}', shownEdit.short) }}
              </p>
              <figure class="home-code">
                <figcaption>{{ shownEdit.file }}</figcaption>
                <pre><code v-if="highlighted?.[shownIndex]" v-html="highlighted[shownIndex]" /><code v-else>{{ shownEdit.code }}</code></pre>
              </figure>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="home-container home-library" aria-labelledby="home-library-title">
      <h2 id="home-library-title">
        {{ pageCopy.explore }}
      </h2>
      <ul class="home-areas">
        <li v-for="group in groups" :key="group.path">
          <h3>
            <NuxtLink :to="docsRoutePath(group.fallback)">
              {{ group.title }}
              <SIcon name="hugeicons:arrow-right-02" class="home-area-arrow" aria-hidden="true" />
            </NuxtLink>
          </h3>
          <p>{{ group.description }}</p>
          <ul v-if="group.categories.length" class="home-area-links">
            <li v-for="category in group.categories" :key="category.to">
              <NuxtLink :to="docsRoutePath(category.to)">
                {{ category.title }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
      <div class="home-meta">
        <p>
          {{ pageCopy.agentLead }} <NuxtLink :to="docsRoutePath('/overview/agent-support/overview')">
            {{ pageCopy.agentLink }}
          </NuxtLink>
        </p>
        <p class="home-version">
          Selaras {{ pkg.version }}, MIT licensed.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home { color: var(--selaras-resolved-text-default); }
.home-container { box-sizing: border-box; width: min(100%, 90rem); padding-inline: clamp(1.25rem, 3.4vw, 3rem); margin-inline: auto; }
.home a:focus-visible, .home-edit-toggle:focus-visible { outline: 2px solid var(--selaras-resolved-color-primary-focus); outline-offset: 4px; border-radius: 4px; }

/* Intro: the hero and the four edits share one grid, so the specimen can stay
   beside the steps while they scroll. The dot grid sits behind the first
   screen only. */
.home-intro { position: relative; isolation: isolate; }
.home-grid-layer { position: absolute; inset: 0 0 auto; z-index: -1; height: min(100svh, 58rem); overflow: hidden; }
.home-intro-grid { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(2.5rem, 5vw, 5rem); padding-block: clamp(3rem, 7vw, 6rem) clamp(2rem, 4vw, 3.5rem); }
.home-title { margin: 0; font-size: clamp(3.25rem, 7.4vw, 6rem); line-height: 1; font-weight: 650; letter-spacing: -0.04em; }
.home-title-line { display: block; padding-block: 0.06em 0.12em; margin-block: -0.06em -0.12em; overflow: hidden; }
.home-title-line > span { display: block; }
.home-lead { max-width: 44ch; margin: 1.75rem 0 0; font-size: clamp(1.0625rem, 1.4vw, 1.25rem); line-height: 1.6; text-wrap: pretty; }
.home-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; margin-top: 2.25rem; }
.home-install { gap: 1rem; }
.home-install code { font-family: var(--font-mono); font-size: 0.875rem; white-space: nowrap; }

.home-edits { display: grid; grid-template-columns: minmax(0, 1fr); list-style: none; margin: clamp(4rem, 12vh, 7rem) 0 0; padding: 0; }
.home-edit { min-height: 44vh; padding-block: 2.5rem; border-top: 1px solid var(--selaras-resolved-border-default); color: var(--selaras-resolved-text-muted); transition: color 300ms cubic-bezier(0.22, 1, 0.36, 1); }
.home-edit:last-child { min-height: 0; }
.home-edit.is-applied, .home-edit[aria-current] { color: var(--selaras-resolved-text-default); }
.home-edit h2 { margin: 0; font-size: clamp(1.5rem, 2.2vw, 1.875rem); line-height: 1.2; font-weight: 600; letter-spacing: -0.02em; }
.home-edit-toggle { display: inline-flex; align-items: center; gap: 0.875rem; padding: 0; border: 0; background: none; color: inherit; font: inherit; letter-spacing: inherit; text-align: start; cursor: pointer; }
.home-edit-number { display: grid; place-items: center; flex-shrink: 0; width: 2rem; height: 2rem; border: 1px solid var(--selaras-resolved-border-hover); border-radius: 999px; font-size: 0.875rem; font-weight: 600; letter-spacing: 0; transition: background-color 300ms, border-color 300ms, color 300ms; }
.home-edit.is-applied .home-edit-number { border-color: var(--selaras-resolved-color-primary-fill); background: var(--selaras-resolved-color-primary-fill); color: var(--selaras-resolved-color-primary-on-fill); }
.home-edit > p { max-width: 46ch; margin: 1rem 0 1.5rem; font-size: 1.0625rem; line-height: 1.65; }

.home-code { margin: 0; overflow: hidden; border: 1px solid rgb(255 255 255 / 0.08); border-radius: var(--selaras-resolved-radius-md); background: #141418; color: #e6edf3; }
.home-code figcaption { padding: 0.625rem 1rem; border-bottom: 1px solid rgb(255 255 255 / 0.08); font-family: var(--font-mono); font-size: 0.75rem; color: #a8b1bd; }
.home-code pre { margin: 0; padding-block: 1rem; overflow-x: auto; font-family: var(--font-mono); font-size: 0.8125rem; line-height: 1.7; }
.home-code pre > code { display: grid; width: max-content; min-width: 100%; }
.home-code pre > code:not(:has(.line)) { padding-inline: 1rem; }
.home-code pre > code > :deep(.line) { min-height: 1.7em; padding-inline: 1rem; }
.home-code pre > code > :deep(.line.is-edit) { background: rgb(169 154 255 / 0.14); box-shadow: inset 2px 0 0 #a99aff; }
.home-code pre::selection, .home-code pre :deep(*::selection) { background: rgb(169 154 255 / 0.35); }

.home-specimen-column { min-width: 0; }
.home-specimen-sticky { position: sticky; top: 6rem; display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
.home-step-picker, .home-step-detail { display: none; }
.home-specimen-frame { position: relative; }
.home-specimen-frame::after { content: ''; position: absolute; inset: 0; border: 1px solid var(--selaras-resolved-color-primary-fill); border-radius: calc(var(--selaras-resolved-radius-lg) + 2px); opacity: 0; pointer-events: none; }
.home-specimen-note { max-width: 52ch; margin: 0; font-size: 0.8125rem; line-height: 1.6; color: var(--selaras-resolved-text-muted); }

/* Library index: a typographic list rather than a grid of cards. */
.home-library { padding-block: clamp(4rem, 8vw, 7rem) clamp(3rem, 6vw, 5rem); }
.home-library > h2 { margin: 0 0 2.5rem; font-size: clamp(2rem, 3.6vw, 3rem); line-height: 1.1; font-weight: 600; letter-spacing: -0.03em; }
.home-areas { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2.5rem clamp(1.5rem, 3vw, 3rem); list-style: none; margin: 0; padding: 0; }
.home-areas > li { padding-top: 1.5rem; border-top: 1px solid var(--selaras-resolved-border-default); }
.home-areas h3 { margin: 0; font-size: 1.375rem; line-height: 1.25; font-weight: 600; letter-spacing: -0.015em; }
.home-areas h3 a { display: inline-flex; align-items: center; gap: 0.5rem; color: inherit; text-decoration: none; }
.home-areas h3 a:hover { color: var(--selaras-resolved-color-primary-text); }
.home-area-arrow { width: 1.125rem; height: 1.125rem; transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1); }
.home-areas h3 a:hover .home-area-arrow { transform: translateX(3px); }
.home-areas p { margin: 0.75rem 0 0; font-size: 0.9375rem; line-height: 1.6; color: var(--selaras-resolved-text-muted); }
.home-area-links { display: flex; flex-wrap: wrap; gap: 0.375rem 1rem; list-style: none; margin: 1rem 0 0; padding: 0; }
.home-area-links a { color: inherit; font-size: 0.875rem; text-decoration-color: var(--selaras-resolved-border-hover); text-underline-offset: 4px; }
.home-area-links a:hover { color: var(--selaras-resolved-color-primary-text); }
.home-meta { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 1rem 2rem; margin-top: clamp(3rem, 6vw, 4.5rem); padding-top: 1.5rem; border-top: 1px solid var(--selaras-resolved-border-default); font-size: 0.9375rem; line-height: 1.6; }
.home-meta p { margin: 0; }
.home-meta a { color: inherit; text-underline-offset: 4px; }
.home-version { color: var(--selaras-resolved-text-muted); font-size: 0.875rem; }

/* Below 64rem the steps collapse into a selector above the specimen, with the
   chosen edit's code beneath it. */
@media (max-width: 63.999rem) {
  .home-intro-grid { grid-template-columns: minmax(0, 1fr); gap: 3rem; }
  .home-edits { display: none; }
  .home-specimen-sticky { position: static; }
  .home-step-picker { display: flex; width: 100%; }
  .home-step-picker :deep(button) { flex: 1; min-width: 0; padding-inline: 0.5rem; }
  .home-step-detail { display: block; }
  .home-step-detail h2 { margin: 0.5rem 0 0; font-size: 1.375rem; line-height: 1.25; font-weight: 600; letter-spacing: -0.015em; }
  .home-step-detail > p, .home-step-detail h2 + p { margin: 0.5rem 0 1rem; font-size: 1rem; line-height: 1.6; }
  .home-step-detail > .home-step-hint { margin-top: -0.5rem; color: var(--selaras-resolved-text-muted); font-size: 0.875rem; }
  .home-grid-layer { height: min(100svh, 44rem); }
  .home-intro-grid { padding-bottom: 1rem; }
  .home-areas { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 39.999rem) {
  .home-actions { flex-direction: column; align-items: stretch; }
  .home-install { justify-content: space-between; }
  .home-install code { font-size: 0.8125rem; }
  .home-areas { grid-template-columns: minmax(0, 1fr); }
}

@media (prefers-reduced-motion: no-preference) {
  .home-title-line > span { animation: home-align 900ms cubic-bezier(0.22, 1, 0.36, 1) both; }
  .home-title-line + .home-title-line > span { animation-delay: 110ms; }
  .home-specimen-frame.is-echoing::after { animation: home-echo 700ms cubic-bezier(0.22, 1, 0.36, 1); }
  @keyframes home-align { from { transform: translateY(110%); } to { transform: translateY(0); } }
  @keyframes home-echo { from { opacity: 0.9; transform: scale(1); } to { opacity: 0; transform: scale(1.035); } }
}
</style>
