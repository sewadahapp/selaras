<script setup lang="ts">
import type { RuntimeTokenOverrides } from '@sewadah/selaras/types'
import { defineColorFromSeed } from '@sewadah/selaras/theme'
import { NuxtLink } from '#components'
import pkg from '../../package.json'

definePageMeta({ layout: 'home' })
useSeoMeta({
  title: 'Selaras',
  description: 'Accessible Vue components for Nuxt, themed entirely with CSS variables.',
})

const BRAND_HUE = 280

// The slider picks a hue; the rest of the role (hover, text, borders, dark
// mode) is derived by the same helper an app would use in its own config.
const hue = ref(BRAND_HUE)
const seed = computed(() => hueToHex(hue.value))
const heroTokens = computed<RuntimeTokenOverrides | undefined>(() => {
  if (hue.value === BRAND_HUE)
    return undefined
  try {
    const role = defineColorFromSeed(seed.value)
    return { light: { colors: { primary: role.light } }, dark: { colors: { primary: role.dark } } }
  }
  catch {
    return undefined
  }
})

function hueToHex(h: number) {
  const toLinear = (lightness: number, chroma: number) => {
    const a = chroma * Math.cos((h * Math.PI) / 180)
    const b = chroma * Math.sin((h * Math.PI) / 180)
    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ]
  }
  // Keep the brand's lightness and give up chroma until the color fits sRGB.
  let chroma = 0.2
  let rgb = toLinear(0.5, chroma)
  while (rgb.some(channel => channel < 0 || channel > 1) && chroma > 0) {
    chroma -= 0.005
    rgb = toLinear(0.5, chroma)
  }
  return `#${rgb.map((channel) => {
    const clamped = Math.min(1, Math.max(0, channel))
    const encoded = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055
    return Math.round(encoded * 255).toString(16).padStart(2, '0')
  }).join('')}`
}

const workspace = ref('Northwind')
const plan = ref('team')
const planItems = [
  { label: 'Free', value: 'free' },
  { label: 'Team', value: 'team' },
  { label: 'Enterprise', value: 'enterprise' },
]
const weeklySummary = ref(true)
const saved = ref(false)
let savedTimer: ReturnType<typeof setTimeout> | undefined
function save() {
  saved.value = true
  clearTimeout(savedTimer)
  savedTimer = setTimeout(() => {
    saved.value = false
  }, 1800)
}

const principles = [
  { title: 'Themed with CSS variables', text: 'Every color, radius and shadow is a custom property. Recolor a role by changing one value.', to: '/overview/theming/overview', link: 'How theming works' },
  { title: 'One prop to customize', text: 'Pass classes to any part of a component through its ui prop. They merge with the defaults instead of fighting them.', to: '/overview/theming/overview', link: 'Customize a component' },
  { title: 'Accessible primitives', text: 'Built on Reka UI, so keyboard support, focus management and ARIA come with every component.', to: '/overview/getting-started/introduction#accessible-primitives', link: 'Accessibility approach' },
  { title: 'Ready for small screens', text: 'Select, date and color pickers can switch to a full modal on phones, where a popover is too cramped.', to: '/components/forms/select', link: 'See Select' },
  { title: 'Motion in CSS', text: 'Open, close and hover transitions run on data attributes, and respect reduced-motion settings.', to: '/overview/getting-started/introduction#css-based-motion', link: 'How motion works' },
  { title: 'Typed throughout', text: 'Props, emits and slots are exported for every component, for wrappers that stay in sync.', to: '/overview/getting-started/typescript', link: 'TypeScript guide' },
]

// Guides that live beside the components but aren't components themselves.
const guidePages = new Set(['/components/forms/validation'])
const summaries: Record<string, string> = {
  '/components/elements': 'Buttons, badges, avatars, chips and other building blocks',
  '/components/forms': 'Inputs, selects, date and color pickers, uploads and field wiring',
  '/components/overlays': 'Modals, drawers, menus, popovers, toasts and a command palette',
  '/components/layout': 'The app shell, header, cards, splitters and theme scopes',
  '/components/navigation': 'Tabs, menus, breadcrumbs, steppers and trees',
  '/components/typography': 'Prose styles, callouts, code blocks and file trees',
  '/components/data': 'Tables with sorting, pagination and virtual scroll, and a calendar',
  '/composites/dashboard': 'Resizable panels, sidebar and navbar for app dashboards',
  '/composites/documentation': 'Navigation, table of contents and page headers for docs sites',
  '/utilities/composables': 'Open overlays from code, and set icons, locale and messages',
  '/utilities/directives': 'Input masking and click ripples for any element',
}

const { data: navigation } = useDocsNavigation()
const groups = computed(() => (['/components', '/composites', '/utilities'] as const).map((section) => {
  const sectionItem = navigation.value?.find(item => item.path === section)
  return {
    title: sectionItem?.title ?? section,
    categories: (sectionItem?.children ?? []).map((category) => {
      const pages = (category.children ?? []).filter(page => !guidePages.has(page.path))
      return { title: category.title, to: pages[0]?.path ?? category.path, count: pages.length, summary: summaries[category.path] }
    }),
  }
}))

const steps = [
  { title: 'Install the package', text: 'Tailwind CSS is a peer dependency, so your project owns its version.', filename: 'Terminal', language: 'bash', code: 'npm install @sewadah/selaras tailwindcss' },
  { title: 'Register the module', text: 'Components are auto-imported with an S prefix, like SButton.', filename: 'nuxt.config.ts', language: 'ts', code: `export default defineNuxtConfig({\n  modules: ['@sewadah/selaras'],\n  css: ['~/assets/css/main.css'],\n})` },
  { title: 'Import the styles and wrap your app', text: 'SApp provides the shared context that tooltips, toasts and overlays need.', filename: 'assets/css/main.css', language: 'css', code: '@import "tailwindcss";\n@import "@sewadah/selaras";' },
]
</script>

<template>
  <div class="home">
    <STheme as="section" :tokens="heroTokens" class="home-hero" aria-labelledby="home-title">
      <HomeDotGrid :color-key="heroTokens" />
      <div class="home-container home-hero-grid">
        <div class="home-hero-copy">
          <h1 id="home-title" class="home-title">
            Nuxt components that follow your design system
          </h1>
          <p class="home-lead">
            Selaras is a set of accessible Vue components for Nuxt, built on Reka UI and
            Tailwind CSS v4. Colors, radii and shadows are CSS variables, so the components
            take on your brand instead of imposing one.
          </p>
          <div class="home-actions">
            <SButton :as="NuxtLink" to="/overview/getting-started/installation" size="lg">
              Get started
            </SButton>
            <SButton :as="NuxtLink" to="/components/elements/button" size="lg" variant="outline" color="neutral">
              Browse components
            </SButton>
          </div>
          <div class="home-install">
            <SCodeButton code="npm install @sewadah/selaras" />
          </div>
          <p class="home-status">
            <SBadge label="Pre-1.0" color="neutral" variant="soft" size="sm" />
            Version {{ pkg.version }}. APIs can still change before 1.0.
          </p>
        </div>

        <SCard class="home-demo">
          <template #header>
            <div class="home-demo-header">
              <label for="home-hue" class="home-demo-label">Primary color</label>
              <span class="home-demo-value">
                <span class="home-demo-swatch" />
                <code v-if="heroTokens">{{ seed }}</code>
                <span v-else>Brand default</span>
              </span>
            </div>
            <SSlider id="home-hue" v-model="hue" :min="0" :max="359" aria-label="Primary hue" />
            <p class="home-demo-hint">
              Drag to recolor this section.
              <button v-if="hue !== BRAND_HUE" type="button" class="home-demo-reset" @click="hue = BRAND_HUE">
                Reset
              </button>
            </p>
          </template>

          <div class="home-demo-body">
            <SFormField label="Workspace name">
              <SInput v-model="workspace" />
            </SFormField>
            <SFormField label="Plan">
              <SSelect v-model="plan" :items="planItems" />
            </SFormField>
            <SSwitch v-model="weeklySummary" label="Send me a weekly summary" />
          </div>

          <template #footer>
            <div class="home-demo-footer">
              <SButton variant="outline" color="neutral">
                Cancel
              </SButton>
              <SButton :icon="saved ? 'hugeicons:tick-02' : undefined" @click="save">
                {{ saved ? 'Saved' : 'Save changes' }}
              </SButton>
            </div>
          </template>
        </SCard>
      </div>
    </STheme>

    <section class="home-section" aria-labelledby="home-principles">
      <div class="home-container">
        <h2 id="home-principles" class="home-heading">
          Built on a few firm decisions
        </h2>
        <div class="home-principles">
          <div v-for="item in principles" :key="item.title" class="home-principle">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
            <NuxtLink :to="item.to" class="home-link">
              {{ item.link }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="home-section" aria-labelledby="home-included">
      <div class="home-container">
        <h2 id="home-included" class="home-heading">
          What's included
        </h2>
        <div class="home-groups">
          <div v-for="(column, index) in [groups.slice(0, 1), groups.slice(1)]" :key="index" class="home-group-column" :class="{ 'home-group-column--wide': index === 0 }">
            <div v-for="group in column" :key="group.title" class="home-group">
              <h3 class="home-group-title">
                {{ group.title }}
              </h3>
              <ul class="home-categories">
                <li v-for="category in group.categories" :key="category.to">
                  <NuxtLink :to="category.to" class="home-category">
                    <span class="home-category-text">
                      <span class="home-category-title">{{ category.title }}</span>
                      <span v-if="category.summary" class="home-category-summary">{{ category.summary }}</span>
                    </span>
                    <span class="home-category-count">{{ category.count }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="home-section" aria-labelledby="home-start">
      <div class="home-container">
        <h2 id="home-start" class="home-heading">
          Start in three steps
        </h2>
        <ol class="home-steps">
          <li v-for="step in steps" :key="step.title" class="home-step">
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
            <SProsePre :filename="step.filename" :language="step.language" :code="step.code">
              {{ step.code }}
            </SProsePre>
          </li>
        </ol>
        <NuxtLink to="/overview/getting-started/installation" class="home-link">
          Read the full installation guide
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  box-sizing: border-box;
  width: min(100%, 90rem);
  margin-inline: auto;
  padding-inline: 1.5rem;
}

.home-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-bottom: 1px solid var(--selaras-resolved-border-muted);
}

.home-hero-grid {
  position: relative;
  display: grid;
  gap: 3rem;
  padding-block: 5rem 4.5rem;
  align-items: center;
}

.home-title {
  max-width: 16ch;
  margin: 0;
  font-size: clamp(2.5rem, 1.6rem + 3.6vw, 4.25rem);
  font-weight: 650;
  line-height: 1.04;
  letter-spacing: -0.035em;
  text-wrap: balance;
}

.home-lead {
  max-width: 34rem;
  margin: 1.5rem 0 0;
  color: var(--selaras-resolved-text-muted);
  font-size: 1.125rem;
  line-height: 1.6;
}

.home-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.home-install {
  margin-top: 1.25rem;
}

.home-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0 0;
  color: var(--selaras-resolved-text-muted);
  font-size: 0.875rem;
}

.home-demo {
  width: 100%;
  max-width: 26rem;
  justify-self: end;
  box-shadow: var(--selaras-resolved-shadow-lg);
}

.home-demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.875rem;
}

.home-demo-label {
  font-size: 0.875rem;
  font-weight: 600;
}

.home-demo-value {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--selaras-resolved-text-muted);
  font-size: 0.8125rem;
}

.home-demo-swatch {
  background: var(--selaras-resolved-color-primary-fill);
  width: 0.875rem;
  height: 0.875rem;
  border-radius: var(--selaras-resolved-radius-full);
}

.home-demo-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.75rem 0 0;
  color: var(--selaras-resolved-text-muted);
  font-size: 0.8125rem;
}

.home-demo-reset {
  padding: 0;
  border: 0;
  background: none;
  color: var(--selaras-resolved-color-primary-text);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.home-demo-reset:focus-visible {
  border-radius: var(--selaras-resolved-radius-sm);
  outline: 2px solid var(--selaras-resolved-color-primary-focus);
  outline-offset: 2px;
}

.home-demo-body {
  display: grid;
  gap: 1rem;
}

.home-demo-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.home-section {
  padding-block: 5rem;
}

.home-section + .home-section {
  padding-top: 0;
}

.home-heading {
  margin: 0 0 2.5rem;
  font-size: 1.75rem;
  font-weight: 650;
  letter-spacing: -0.02em;
}

.home-principles {
  display: grid;
  gap: 2.5rem 3rem;
}

.home-principle h3,
.home-step h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.home-principle p,
.home-step p {
  max-width: 34rem;
  margin: 0.5rem 0 0.75rem;
  color: var(--selaras-resolved-text-muted);
  line-height: 1.6;
}

.home-link {
  color: var(--selaras-resolved-color-primary-text);
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
}

.home-link:hover {
  text-decoration: underline;
}

.home-groups {
  display: grid;
  gap: 2.5rem;
}

.home-group-column {
  display: grid;
  align-content: start;
  gap: 2.5rem;
}

.home-group-title {
  margin: 0 0 0.5rem;
  color: var(--selaras-resolved-text-muted);
  font-size: 0.875rem;
  font-weight: 600;
}

.home-categories {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.home-category {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.875rem 0;
  border-top: 1px solid var(--selaras-resolved-border-muted);
  color: inherit;
  text-decoration: none;
}

.home-category-text {
  display: grid;
  gap: 0.125rem;
}

.home-category-title {
  font-weight: 600;
}

.home-category:hover .home-category-title {
  color: var(--selaras-resolved-color-primary-text);
}

.home-category-summary {
  color: var(--selaras-resolved-text-muted);
  font-size: 0.875rem;
}

.home-category-count {
  color: var(--selaras-resolved-text-muted);
  font-variant-numeric: tabular-nums;
}

.home-steps {
  display: grid;
  gap: 2.5rem;
  margin: 0 0 2rem;
  padding: 0;
  list-style: none;
  counter-reset: step;
}

.home-step {
  counter-increment: step;
  min-width: 0;
}

.home-step h3::before {
  margin-inline-end: 0.5rem;
  color: var(--selaras-resolved-color-primary-text);
  content: counter(step) '.';
}

@media (min-width: 48rem) {
  .home-principles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .home-hero-grid {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    padding-block: 6.5rem 6rem;
  }

  .home-principles {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .home-groups {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 3rem;
  }

  .home-group-column--wide {
    grid-column: span 2;
  }

  .home-group-column--wide .home-categories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 3rem;
  }

  .home-steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 63.999rem) {
  .home-demo {
    justify-self: start;
  }
}
</style>
