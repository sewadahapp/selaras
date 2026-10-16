<script setup lang="ts">
import type { RuntimeTokenOverrides } from '@sewadah/selaras/types'
import { defineColorFromSeed } from '@sewadah/selaras/theme'
import { hueToHex } from '../../utils/home-theme-color'

const preset = useDocsThemePreset()
const display = useTemplateRef('display')
const themes = [
  { value: 'pelog', label: 'Pelog', description: 'Violet, quietly confident.' },
  { value: 'slendro', label: 'Slendro', description: 'Sunset orange, forest green.' },
  { value: 'degung', label: 'Degung', description: 'Silver surfaces, tactile details.' },
] as const
const defaultHue = 280
const hue = ref(defaultHue)
const radius = ref(8)
const customRadius = ref(false)
const seed = computed(() => hueToHex(hue.value))
const tokens = computed<RuntimeTokenOverrides | undefined>(() => {
  const geometry = customRadius.value ? { radius: { base: `${radius.value}px` } } : {}
  if (hue.value === defaultHue && !customRadius.value)
    return undefined
  if (hue.value === defaultHue)
    return { light: geometry, dark: geometry }
  const role = defineColorFromSeed(seed.value)
  return {
    light: { ...geometry, colors: { primary: role.light } },
    dark: { ...geometry, colors: { primary: role.dark } },
  }
})
function syncRadius() {
  const input = display.value?.querySelector('input')
  if (input)
    radius.value = Number.parseFloat(getComputedStyle(input).borderRadius) || 0
}
let radiusObserver: MutationObserver | undefined
onMounted(() => {
  syncRadius()
  radiusObserver = new MutationObserver(() => {
    if (!customRadius.value)
      syncRadius()
  })
  radiusObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-selaras-preset'] })
  radiusObserver.observe(document.head, { childList: true, subtree: true, characterData: true })
})
watch(preset, () => {
  hue.value = defaultHue
  customRadius.value = false
})

const workspace = ref('Seirama studio')
const plan = ref('team')
const weeklySummary = ref(true)
const saved = ref(false)
const planItems = [{ label: 'Personal', value: 'personal' }, { label: 'Team', value: 'team' }, { label: 'Organization', value: 'organization' }]
let savedTimer: ReturnType<typeof setTimeout> | undefined
function save() {
  saved.value = true
  clearTimeout(savedTimer)
  savedTimer = setTimeout(() => saved.value = false, 2500)
}
function reset() {
  workspace.value = 'Seirama studio'
  plan.value = 'team'
  weeklySummary.value = true
  saved.value = false
}
function resetTokens() {
  hue.value = defaultHue
  customRadius.value = false
}
onBeforeUnmount(() => {
  clearTimeout(savedTimer)
  radiusObserver?.disconnect()
})
</script>

<template>
  <STheme as="div" :tokens="tokens">
    <div class="theme-lab" data-home-reveal>
      <div ref="display" class="lab-display" data-ui aria-label="Interactive workspace preview">
        <form class="lab-form" @submit.prevent="save" @reset.prevent="reset">
          <div class="lab-form-intro">
            <SAvatar text="S" size="lg" color="primary" />
            <div>
              <p class="lab-form-title">
                Your workspace
              </p>
              <p class="lab-form-note">
                A few components. Already in tune.
              </p>
            </div>
          </div>
          <SFormField label="Workspace name" description="The name your team will see.">
            <SInput v-model="workspace" name="workspace" required />
          </SFormField>
          <SFormField label="Workspace plan">
            <SSelect v-model="plan" :items="planItems" name="plan" aria-label="Workspace plan" adaptive />
          </SFormField>
          <SSwitch v-model="weeklySummary" label="Weekly summary" description="A little less noise in your inbox." />
          <div class="lab-form-actions">
            <SButton type="reset" color="neutral" variant="ghost">
              Reset form
            </SButton>
            <SButton type="submit" :icon="saved ? 'hugeicons:tick-02' : undefined">
              {{ saved ? 'Saved' : 'Save changes' }}
            </SButton>
          </div>
          <p class="lab-status" role="status">
            {{ saved ? 'Saved in this preview. Nothing was sent to a server.' : 'Try the controls. This is a live preview.' }}
          </p>
        </form>
      </div>

      <div class="lab-controls">
        <fieldset class="lab-themes">
          <legend>Choose a character</legend>
          <button
            v-for="theme in themes" :key="theme.value" type="button"
            class="lab-theme" :aria-pressed="preset === theme.value" @click="preset = theme.value"
          >
            <span>{{ theme.label }}</span>
            <span class="lab-theme-description">{{ theme.description }}</span>
            <SIcon v-if="preset === theme.value" name="hugeicons:tick-02" aria-hidden="true" class="lab-theme-check" />
          </button>
        </fieldset>
        <div class="lab-control">
          <label for="home-hue">Primary hue</label>
          <SSlider id="home-hue" v-model="hue" :min="0" :max="359" aria-label="Primary hue" />
          <p>{{ hue === defaultHue ? 'Using the selected theme' : seed }}</p>
        </div>
        <div class="lab-control">
          <label for="home-radius">Corner radius</label>
          <SSlider id="home-radius" v-model="radius" :min="0" :max="20" aria-label="Corner radius" @update:model-value="customRadius = true" />
          <p>{{ customRadius ? `${radius}px` : 'Using the selected theme' }}</p>
        </div>
        <SColorModeSwitch label="Dark mode" />
        <div class="lab-control-bottom">
          <SButton variant="link" color="neutral" size="sm" @click="resetTokens">
            Reset adjustments
          </SButton>
          <NuxtLink to="/overview/theming/overview">
            Theming guide
          </NuxtLink>
        </div>
      </div>
    </div>
    <slot />
  </STheme>
</template>

<style scoped>
.theme-lab { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(17rem, 1fr); background: var(--selaras-resolved-surface-elevated); }
.lab-display { display: grid; align-content: center; padding: clamp(1.5rem, 5vw, 5rem); background: var(--selaras-resolved-surface-default); margin: 1rem 0 1rem 1rem; }
.lab-form { display: grid; gap: 1.75rem; width: 100%; max-width: 30rem; margin: auto; }
.lab-form-intro { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
.lab-form-title { margin: 0; font-size: 1.25rem; font-weight: 650; }
.lab-form-note { margin: 0.3rem 0 0; font-size: 0.875rem; color: var(--selaras-resolved-text-muted); line-height: 1.5; }
.lab-form-actions { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-top: 0.25rem; }
.lab-status { min-height: 2.5em; margin: -0.75rem 0 0; color: var(--selaras-resolved-text-muted); font-size: 0.8125rem; line-height: 1.5; }
.lab-controls { display: grid; gap: 1.75rem; padding: 2.5rem; }
.lab-themes { min-width: 0; display: grid; gap: 0.5rem; margin: 0; padding: 0; border: 0; }
.lab-themes legend { margin-bottom: 1rem; font-size: 0.875rem; font-weight: 600; }
.lab-theme { position: relative; display: grid; gap: 0.2rem; padding: 0.85rem 2.25rem 0.85rem 1rem; border: 0; color: inherit; background: transparent; text-align: start; font: inherit; cursor: pointer; transition: background-color 160ms ease, transform 160ms ease; }
.lab-theme > span:first-child { font-size: 1.125rem; font-weight: 600; }
.lab-theme[aria-pressed=true] { background: var(--selaras-resolved-surface-default); }
.lab-theme:hover { background: var(--selaras-resolved-surface-default); transform: translateX(3px); }
.lab-theme:focus-visible { outline: 2px solid var(--selaras-resolved-color-primary-focus); outline-offset: 2px; }
.lab-theme-description { color: var(--selaras-resolved-text-muted); font-size: 0.8125rem; }
.lab-theme-check { position: absolute; inset-inline-end: 1rem; top: 1rem; color: var(--selaras-resolved-color-primary-text); width: 1rem; height: 1rem; }
.lab-control { display: grid; gap: 0.8rem; }
.lab-control label { font-size: 0.875rem; font-weight: 600; }
.lab-control p { margin: 0; color: var(--selaras-resolved-text-muted); font-size: 0.8125rem; }
.lab-control-bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0.75rem; align-items: center; }
.lab-control-bottom a { color: inherit; font-size: 0.8125rem; text-underline-offset: 4px; }
@media (max-width: 47.999rem) {
  .theme-lab { grid-template-columns: minmax(0, 1fr); }
  .lab-display { margin: 0.75rem; padding: 1.5rem 1rem; }
  .lab-controls { padding: 1.25rem; gap: 1.5rem; }
  .lab-themes { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.35rem; }
  .lab-theme { padding: 0.75rem 0.35rem; text-align: center; }
  .lab-theme > span:first-child { font-size: 0.9375rem; }
  .lab-theme-description, .lab-theme-check { display: none; }
  .lab-control-bottom { gap: 0.5rem; }
}
@media (prefers-reduced-motion: reduce) { .lab-theme { transition: none; } .lab-theme:hover { transform: none; } }
</style>
