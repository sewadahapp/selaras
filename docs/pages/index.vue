<script setup lang="ts">
import { NuxtLink } from '#components'
import pkg from '../../package.json'
import HomeComponentEnsemble from '../components/home/HomeComponentEnsemble.vue'
import HomeLibraryPreview from '../components/home/HomeLibraryPreview.vue'
import HomeThemeLab from '../components/home/HomeThemeLab.vue'

definePageMeta({ layout: 'home' })
useDocsSeo({
  title: 'Selaras',
  description: 'Accessible Vue components for Nuxt, themed entirely with CSS variables.',
})

const home = useTemplateRef('home')
const preset = useDocsThemePreset()
const colorMode = useColorMode()
const gridColorKey = computed(() => `${preset.value}:${colorMode.value}`)
const installCommand = 'npm install @sewadah/selaras'
const icons = useIcons()
const { copy, copied } = useDocsClipboard()
const { data: navigation } = useDocsNavigation()
const guidePages = new Set(['/components/forms/validation'])
const sections = [
  { path: '/components', title: 'Components', icon: 'hugeicons:dashboard-square-01', description: 'Inputs, navigation, overlays, and the details in between. Keyboard support and typed APIs included.', fallback: '/components/elements/button' },
  { path: '/composites', title: 'Composites', icon: 'hugeicons:layers-01', description: 'Resizable dashboards and documentation layouts, composed from the same parts.', fallback: '/composites/dashboard/dashboard-group' },
  { path: '/blocks', title: 'Blocks', icon: 'hugeicons:layout-01', description: 'Complete interfaces you can try, inspect, and copy into your own project.', fallback: '/blocks/overview' },
  { path: '/utilities', title: 'Utilities', icon: 'hugeicons:source-code', description: 'Open an overlay from code. Share icons and messages. Add masking or a ripple.', fallback: '/utilities/composables/use-modal' },
]
const groups = computed(() => sections.map((section) => {
  const item = navigation.value?.find(entry => entry.path === section.path)
  const categories = (item?.children ?? []).map(category => ({
    title: category.title,
    to: category.children?.find(page => !guidePages.has(page.path))?.path ?? category.path,
  }))
  return { ...section, categories }
}))
const setup = [
  { title: 'Add the package', icon: 'hugeicons:package', text: 'Install Selaras and keep Tailwind CSS under your project’s control.' },
  { title: 'Register the module', icon: 'hugeicons:plug-01', text: 'Components are auto-imported with an S prefix. Nuxt handles the integration.' },
  { title: 'Connect the styles', icon: 'hugeicons:paint-brush-01', text: 'Import the theme and the generated Tailwind entry in your stylesheet.' },
  { title: 'Wrap your app', icon: 'hugeicons:browser', text: 'SApp provides the shared context for tooltips, toasts, and programmatic overlays.' },
]
const setupFiles = [
  { name: 'install.sh', language: 'bash', code: 'bun add @sewadah/selaras tailwindcss\n\n# Or use your preferred package manager:\n# npm install @sewadah/selaras tailwindcss\n# pnpm add @sewadah/selaras tailwindcss\n' },
  { name: 'nuxt.config.ts', code: 'export default defineNuxtConfig({\n  modules: [\'@sewadah/selaras\'],\n  css: [\'~/assets/css/main.css\'],\n})\n' },
  { name: 'assets', children: [{ name: 'css', children: [{ name: 'main.css', code: '@import "tailwindcss";\n@import "@sewadah/selaras";\n@import "#selaras/tailwind.css";\n' }] }] },
  { name: 'app.vue', code: '<template>\n  <SApp>\n    <NuxtLayout>\n      <NuxtPage />\n    </NuxtLayout>\n  </SApp>\n</template>\n' },
]

let observer: IntersectionObserver | undefined
onMounted(() => {
  if (!home.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window))
    return
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting)
        continue
      const element = entry.target as HTMLElement
      element.classList.add('home-in-view')
      observer?.unobserve(element)
    }
  }, { threshold: 0.08 })
  home.value.querySelectorAll('[data-home-reveal]').forEach(element => observer?.observe(element))
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="home" class="home">
    <section class="home-hero" aria-labelledby="home-title">
      <HomeDotGrid :color-key="gridColorKey" />
      <div class="home-container home-hero-content">
        <h1 id="home-title" class="home-title">
          <span class="home-title-line"><span>Interfaces,</span></span>
          <span class="home-title-line"><span>in harmony.</span></span>
        </h1>
        <div class="home-hero-bottom">
          <p class="home-lead">
            Accessible Vue components for Nuxt. The parts fit together. The design stays yours.
          </p>
          <div class="home-hero-actions home-hero-start">
            <div class="home-hero-buttons">
              <SButton :as="NuxtLink" to="/overview/getting-started/installation" size="lg" class="home-primary-action">
                Get started
              </SButton>
              <SButton :as="NuxtLink" to="/components/elements/button" variant="outline" color="neutral" size="lg" class="home-primary-action">
                Browse components
              </SButton>
            </div>
            <SButton
              color="neutral" variant="soft" class="home-install-command"
              :trailing-icon="copied === 'install-command' ? icons.check : icons.copy"
              :aria-label="copied === 'install-command' ? 'Install command copied' : 'Copy npm install command'"
              @click="copy(installCommand, 'install-command')"
            >
              <code>{{ installCommand }}</code>
            </SButton>
            <span class="sr-only" role="status">{{ copied === 'install-command' ? 'Install command copied to clipboard.' : '' }}</span>
          </div>
        </div>
      </div>
    </section>

    <section id="home-preview" class="home-section home-container home-preview" aria-labelledby="home-preview-title">
      <div class="home-section-intro">
        <h2 id="home-preview-title" data-home-reveal>
          Set your own tone
        </h2>
        <p data-home-reveal>
          Three themes. The same components. Change the colors, adjust the corners, and see how much of the interface can become yours.
        </p>
      </div>
      <HomeThemeLab>
        <div class="home-ensemble">
          <HomeComponentEnsemble />
        </div>
      </HomeThemeLab>
      <p class="home-preview-note">
        These are working Selaras components. Try selecting a team, collapsing the navigation, or opening an invitation.
      </p>
    </section>

    <section class="home-section home-library" aria-labelledby="home-library-title">
      <div class="home-container">
        <h2 id="home-library-title" class="home-section-title" data-home-reveal>
          A whole composition
        </h2>
        <p class="home-library-note">
          Interactive previews with sample content. Explore the parts behind each one.
        </p>
        <div class="home-capabilities">
          <article v-for="group in groups" :key="group.path" class="home-capability" data-home-reveal="across">
            <HomeLibraryPreview :kind="group.path" />
            <div class="home-capability-content">
              <h3>
                <NuxtLink :to="group.fallback">
                  <span class="home-category-title">
                    <SIcon :name="group.icon" class="home-category-icon" aria-hidden="true" />
                    {{ group.title }}
                  </span>
                  <SIcon name="hugeicons:arrow-up-right-01" class="home-capability-arrow" aria-hidden="true" />
                </NuxtLink>
              </h3>
              <p>{{ group.description }}</p>
              <ul v-if="group.categories.length" class="home-category-links">
                <li v-for="category in group.categories" :key="category.to">
                  <NuxtLink :to="category.to">
                    {{ category.title }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </article>
        </div>
        <div class="home-agent-link" data-home-reveal>
          <p>Building with an agent?</p>
          <NuxtLink to="/overview/agent-support/overview">
            Give it the component APIs, examples, and Selaras skill.
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="home-section home-container home-setup" aria-labelledby="home-setup-title">
      <div class="home-section-intro">
        <h2 id="home-setup-title" data-home-reveal>
          Start with the real thing
        </h2>
        <p data-home-reveal>
          One package, a Nuxt module, and your first component. No separate component registration.
        </p>
      </div>
      <div class="home-setup-grid">
        <ol class="home-setup-steps">
          <li v-for="step in setup" :key="step.title" data-home-reveal>
            <h3>
              <SIcon :name="step.icon" class="home-step-icon" aria-hidden="true" />
              {{ step.title }}
            </h3>
            <p>{{ step.text }}</p>
          </li>
        </ol>
        <div class="home-setup-source" data-ui data-home-reveal aria-label="Selaras installation files">
          <STheme :ui="{ fileTree: { slots: { root: 'font-sans', list: 'font-sans' } } }">
            <SCodeTree :items="setupFiles" class="home-code-tree" :ui="{ root: 'flex-col md:flex-row', tree: 'w-full max-h-44 border-e-0 md:w-44 md:max-h-none' }" />
          </STheme>
        </div>
      </div>
      <div class="home-install-footer">
        <NuxtLink to="/overview/getting-started/installation" class="home-text-link">
          Read the installation guide
        </NuxtLink>
        <p>Selaras {{ pkg.version }}. APIs may change before 1.0. Built with Reka UI and Tailwind CSS v4.</p>
      </div>
    </section>

    <section class="home-close" aria-labelledby="home-close-title">
      <div class="home-container home-close-content">
        <h2 id="home-close-title" data-home-reveal>
          Make it Selaras.
        </h2>
        <div class="home-close-bottom">
          <p data-home-reveal>
            Start with a button. Keep going with a system that feels like yours.
          </p>
          <div class="home-hero-actions" data-home-reveal>
            <SButton :as="NuxtLink" to="/overview/getting-started/installation" size="lg" class="home-primary-action">
              Install Selaras
            </SButton>
            <NuxtLink to="/blocks/overview" class="home-text-link">
              Explore the blocks
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  --home-space: clamp(5rem, 11vw, 10rem);
  --home-display: clamp(5rem, 13vw, 12rem);
  color: var(--selaras-resolved-text-default);
}
.home-container { box-sizing: border-box; width: min(100%, 90rem); padding-inline: clamp(1.25rem, 3.4vw, 3rem); margin-inline: auto; }
.home-hero { position: relative; isolation: isolate; overflow: hidden; }
.home-hero-content { position: relative; display: flex; flex-direction: column; justify-content: space-between; gap: 3rem; min-height: min(53rem, calc(100svh - 4rem)); padding-block: clamp(3rem, 7vw, 6rem) 3.5rem; }
.home-title, .home-hero-bottom { position: relative; z-index: 1; }
.home-title { margin: 0; font-size: var(--home-display); line-height: 0.98; font-weight: 600; letter-spacing: -0.04em; }
.home-title-line { display: block; padding-block: 0.06em 0.12em; margin-block: -0.06em -0.12em; overflow: hidden; }
.home-title-line > span { display: block; }
.home-title-line + .home-title-line { margin-top: 0.05em; text-align: end; }
.home-hero-bottom, .home-close-bottom { display: flex; align-items: end; justify-content: space-between; gap: 3rem; }
.home-lead { max-width: 34ch; margin: 0; font-size: clamp(1.125rem, 1.6vw, 1.375rem); line-height: 1.55; text-wrap: pretty; }
.home-hero-actions { display: flex; flex-direction: column; align-items: stretch; gap: 1.25rem; text-align: center; flex-shrink: 0; }
.home-hero-buttons { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.home-install-command { justify-content: space-between; gap: 1rem; min-height: 2.75rem; padding: 0.75rem 1rem; font-size: 0.875rem; }
.home-install-command code { font-family: var(--font-mono); font-size: inherit; white-space: nowrap; }
.home-primary-action { min-height: 3.25rem; padding-inline: 2rem; }
.home-text-link { color: inherit; font-size: 0.9375rem; font-weight: 500; text-underline-offset: 0.3em; text-decoration-thickness: 1px; }
.home a:focus-visible { outline: 2px solid var(--selaras-resolved-color-primary-focus); outline-offset: 5px; }
.home-section { padding-block: var(--home-space); scroll-margin-top: 5rem; }
.home-section-intro { display: grid; grid-template-columns: 1.15fr 1fr; gap: 3rem; align-items: end; margin-bottom: 3.5rem; }
.home-section-intro h2, .home-section-title { margin: 0; max-width: 13ch; font-size: clamp(2.25rem, 4.3vw, 4rem); line-height: 1.08; letter-spacing: -0.035em; font-weight: 550; text-wrap: balance; }
.home-section-intro p { max-width: 43ch; margin: 0; font-size: 1.0625rem; line-height: 1.65; }
.home-ensemble { margin-top: 1rem; }
.home-preview-note { max-width: 65ch; margin: 1.5rem 0 0; font-size: 0.875rem; line-height: 1.65; color: var(--selaras-resolved-text-muted); }
.home-library { background: var(--selaras-resolved-surface-elevated); }
.home-section-title { max-width: none; margin-bottom: 4.5rem; }
.home-library .home-section-title { margin-bottom: 1.25rem; }
.home-library-note { margin: 0 0 3.5rem; max-width: 60ch; font-size: 1rem; line-height: 1.65; color: var(--selaras-resolved-text-muted); }
.home-capabilities { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 4rem 2rem; }
.home-capability { display: grid; grid-column: span 5; align-content: start; min-width: 0; gap: 1.5rem; }
.home-capability:first-child, .home-capability:last-child { grid-column: span 7; }
.home-capability h3 { margin: 0 0 0.75rem; font-size: 2rem; line-height: 1.1; letter-spacing: -0.03em; font-weight: 600; }
.home-capability h3 a { display: flex; justify-content: space-between; align-items: center; gap: 1rem; text-decoration: none; color: inherit; transition: color 160ms ease; }
.home-category-title { display: inline-flex; align-items: center; gap: 0.75rem; }
.home-category-icon { flex-shrink: 0; width: 1.625rem; height: 1.625rem; color: var(--selaras-resolved-color-primary-text); }
.home-capability-arrow { flex-shrink: 0; width: 1.25rem; height: 1.25rem; }
.home-capability h3 a:hover { color: var(--selaras-resolved-color-primary-text); }
.home-capability-content > p { margin: 0; max-width: 43ch; font-size: 1rem; line-height: 1.65; }
.home-category-links { display: flex; flex-wrap: wrap; gap: 0.65rem 1.4rem; list-style: none; margin: 1.1rem 0 0; padding: 0; }
.home-category-links a { color: inherit; font-size: 0.875rem; text-decoration-color: var(--selaras-resolved-border-hover); text-underline-offset: 4px; transition: color 160ms ease; }
.home-category-links a:hover { color: var(--selaras-resolved-color-primary-text); }
.home-agent-link { display: grid; grid-template-columns: 1.15fr 1fr; align-items: baseline; gap: 3rem; margin-top: 4.5rem; }
.home-agent-link p { margin: 0; font-weight: 600; }
.home-agent-link a { color: inherit; line-height: 1.7; text-underline-offset: 4px; }
.home-setup-grid { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr); gap: clamp(3rem, 7vw, 7rem); }
.home-setup-steps { display: grid; align-content: start; gap: 2.2rem; padding: 0; margin: 0; list-style: none; }
.home-setup-steps h3 { display: flex; align-items: center; gap: 0.75rem; margin: 0; font-size: 1.125rem; font-weight: 600; }
.home-step-icon { flex-shrink: 0; width: 1.25rem; height: 1.25rem; color: var(--selaras-resolved-color-primary-text); }
.home-setup-steps p { margin: 0.5rem 0 0; max-width: 35ch; font-size: 1rem; line-height: 1.65; }
.home-setup-source { min-width: 0; }
.home-code-tree { height: 32rem; }
.home-install-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.5rem; margin-top: 3rem; }
.home-install-footer p { max-width: 57ch; margin: 0; font-size: 0.8125rem; line-height: 1.6; color: var(--selaras-resolved-text-muted); }
.home-close { background: var(--selaras-resolved-color-primary-subtle); color: var(--selaras-resolved-color-primary-on-subtle); padding-block: 6rem; }
.home-close h2 { font-size: clamp(3rem, 7.2vw, 6rem); margin: 0 0 3.5rem; line-height: 1.05; letter-spacing: -0.04em; font-weight: 550; }
.home-close-bottom > p { max-width: 28ch; margin: 0; font-size: clamp(1.25rem, 2vw, 1.75rem); line-height: 1.5; }
@media (max-width: 63.999rem) {
  .home-capabilities { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .home-capability, .home-capability:first-child, .home-capability:last-child { grid-column: auto; }
  .home-hero-content { min-height: min(46rem, calc(100svh - 4rem)); }
  .home-section-intro { gap: 2rem; }
  .home-setup-grid { grid-template-columns: minmax(0, 1fr); }
  .home-setup-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .home-code-tree { height: 27rem; }
}
@media (max-width: 47.999rem) {
  .home { --home-space: 5rem; --home-display: clamp(3.2rem, 15.4vw, 7rem); }
  .home-hero-content { min-height: min(44rem, calc(100svh - 4rem)); padding-block: 3.5rem 2.5rem; gap: 3rem; }
  .home-title-line + .home-title-line { text-align: start; }
  .home-hero-bottom, .home-close-bottom { flex-direction: column; align-items: stretch; gap: 2rem; }
  .home-hero-actions { gap: 1.1rem; }
  .home-hero-buttons { flex-direction: column; }
  .home-install-command { gap: 0.5rem; padding-inline: 0.5rem; font-size: 0.8125rem; }
  .home-lead { max-width: 31ch; font-size: 1.125rem; }
  .home-section-intro, .home-agent-link { grid-template-columns: minmax(0, 1fr); gap: 1.25rem; }
  .home-section-intro { margin-bottom: 2.25rem; }
  .home-section-intro h2, .home-section-title { font-size: 2.5rem; max-width: 14ch; }
  .home-section-title { margin-bottom: 3rem; }
  .home-capabilities { grid-template-columns: minmax(0, 1fr); gap: 3rem; }
  .home-capability, .home-capability:first-child, .home-capability:last-child { grid-column: auto; }
  .home-capability h3 { font-size: 1.75rem; }
  .home-agent-link { margin-top: 3.5rem; gap: 0.75rem; }
  .home-setup-steps { grid-template-columns: minmax(0, 1fr); gap: 1.75rem; }
  .home-code-tree { height: 30rem; }
  .home-close { padding-block: 4rem; }
  .home-close h2 { margin-bottom: 2rem; }
}
@media (prefers-reduced-motion: no-preference) {
  .home-title-line > span { animation: home-align 900ms cubic-bezier(0.22, 1, 0.36, 1) both; }
  .home-title-line + .home-title-line > span { animation-delay: 110ms; }
  .home :deep([data-home-reveal].home-in-view) { animation: home-arrive 900ms cubic-bezier(0.22, 1, 0.36, 1) both; }
  .home :deep([data-home-reveal=across].home-in-view) { animation-name: home-across; }
  @keyframes home-align { from { transform: translateY(110%); } to { transform: translateY(0); } }
  @keyframes home-arrive { from { opacity: 0.35; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes home-across { from { opacity: 0.35; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
}
</style>
