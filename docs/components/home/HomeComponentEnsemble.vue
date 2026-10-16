<script setup lang="ts">
const selected = ref(['design'])
const roles = [
  { label: 'Design', value: 'design', description: 'Components, tokens, and patterns' },
  { label: 'Development', value: 'development', description: 'Implementation and integrations' },
  { label: 'Documentation', value: 'documentation', description: 'Guides and examples' },
]
const view = ref('Projects')
const collapsed = ref(false)
const navigation = computed(() => [
  { label: 'Projects', icon: 'hugeicons:folder-01', active: view.value === 'Projects', onSelect: () => view.value = 'Projects' },
  { label: 'Team', icon: 'hugeicons:user-group', active: view.value === 'Team', onSelect: () => view.value = 'Team' },
  { label: 'Settings', icon: 'hugeicons:settings-01', active: view.value === 'Settings', onSelect: () => view.value = 'Settings' },
])
const open = ref(false)
const invited = ref(false)
</script>

<template>
  <div class="ensemble">
    <div class="ensemble-navigation" data-ui data-home-reveal="across" aria-label="Navigation component preview">
      <div class="ensemble-bar">
        <span class="ensemble-title">Seirama</span>
        <SButton :icon="collapsed ? 'hugeicons:sidebar-right-01' : 'hugeicons:sidebar-left-01'" square size="sm" variant="ghost" color="neutral" :aria-label="collapsed ? 'Expand preview navigation' : 'Collapse preview navigation'" :aria-expanded="!collapsed" @click="collapsed = !collapsed" />
      </div>
      <SNavigationMenu :items="navigation" orientation="vertical" :collapsed="collapsed" tooltip :ui="{ link: 'w-full text-start' }" />
      <div class="ensemble-navigation-context">
        <SAvatar text="DS" size="sm" />
        <span>Dina Sari</span>
      </div>
      <p class="ensemble-view" role="status">
        {{ view }} selected
      </p>
    </div>
    <div class="ensemble-selection" data-ui data-home-reveal="across" aria-label="Selection component preview">
      <SListbox v-model="selected" :items="roles" label="Choose your focus" multiple checkbox />
      <p class="ensemble-note" role="status">
        {{ selected.length }} {{ selected.length === 1 ? 'area' : 'areas' }} selected
      </p>
    </div>
    <div class="ensemble-feedback" data-ui data-home-reveal="across" aria-label="Feedback and overlay component preview">
      <SAlert :color="invited ? 'success' : 'info'" :title="invited ? 'Invitation ready' : 'Better together'" :description="invited ? 'Confirmed in this preview. No invitation was sent.' : 'Bring someone into your workspace.'" />
      <div class="ensemble-feedback-actions">
        <SAvatarGroup size="sm">
          <SAvatar text="DS" />
          <SAvatar text="AM" />
          <SAvatar text="RP" />
        </SAvatarGroup>
        <SButton size="sm" variant="soft" @click="open = true">
          Invite teammate
        </SButton>
      </div>
      <SModal v-model:open="open" title="Invite a teammate" description="A preview of Selaras modal focus and keyboard behavior.">
        <template #body>
          <p>Confirm to update this preview. Nothing will be sent or stored.</p>
        </template>
        <template #footer>
          <SButton @click="invited = true; open = false">
            Confirm invitation
          </SButton>
        </template>
      </SModal>
    </div>
  </div>
</template>

<style scoped>
.ensemble { display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); gap: 1rem; }
.ensemble-navigation, .ensemble-selection, .ensemble-feedback { min-width: 0; background: var(--selaras-resolved-surface-elevated); padding: 2rem; }
.ensemble-navigation { grid-row: span 2; display: flex; flex-direction: column; gap: 2rem; }
.ensemble-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.ensemble-title { font-size: 1.25rem; font-weight: 650; }
.ensemble-navigation-context { display: flex; align-items: center; gap: 0.75rem; margin-top: auto; font-size: 0.875rem; }
.ensemble-view, .ensemble-note { margin: 0; font-size: 0.8125rem; color: var(--selaras-resolved-text-muted); }
.ensemble-selection { display: grid; gap: 1rem; align-content: center; }
.ensemble-feedback { display: grid; align-content: center; gap: 1.5rem; min-height: 14rem; }
.ensemble-feedback-actions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
@media (max-width: 47.999rem) {
  .ensemble { grid-template-columns: minmax(0, 1fr); }
  .ensemble-navigation, .ensemble-selection, .ensemble-feedback { padding: 1.5rem; }
  .ensemble-navigation { min-height: 21rem; grid-row: auto; }
}
</style>
