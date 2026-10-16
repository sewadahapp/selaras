<script setup lang="ts">
defineProps<{ kind: string }>()

const clicks = ref(0)
const compact = ref(false)
const project = ref('Seirama studio')
const collapsed = ref(false)
const view = ref('Overview')
const navigation = computed(() => [
  { label: 'Overview', icon: 'hugeicons:dashboard-square-01', active: view.value === 'Overview', onSelect: () => view.value = 'Overview' },
  { label: 'Projects', icon: 'hugeicons:folder-01', active: view.value === 'Projects', onSelect: () => view.value = 'Projects' },
])
const tasks = [
  { label: 'Design tokens', value: 100 },
  { label: 'Components', value: 75 },
  { label: 'Documentation', value: 40 },
]
const name = ref('Dina Sari')
const saved = ref(false)
const initials = computed(() => name.value.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('') || 'DS')
const toast = useToast()
function notify() {
  toast.add({ title: 'All in tune', color: 'success' })
}
</script>

<template>
  <div v-if="kind === '/components'" class="library-scene scene-components" role="group" aria-label="Components preview" data-ui>
    <SCard class="component-tray" :ui="{ body: compact ? 'p-4 space-y-3' : 'p-5 space-y-5' }">
      <div class="preview-row">
        <SAvatarGroup size="sm">
          <SAvatar text="DS" />
          <SAvatar text="AM" />
          <SAvatar text="RP" />
        </SAvatarGroup>
        <SBadge label="Ready to build" color="success" variant="soft" />
      </div>
      <SFormField label="Project name">
        <SInput v-model="project" aria-label="Component preview project name" />
      </SFormField>
      <div class="preview-row">
        <SSwitch v-model="compact" label="Compact spacing" size="sm" />
        <SButton @click="clicks++">
          {{ clicks ? `Clicked ${clicks}` : 'Click me' }}
        </SButton>
      </div>
    </SCard>
  </div>

  <div v-else-if="kind === '/composites'" class="library-scene scene-composites" role="group" aria-label="Composites preview" data-ui>
    <SDashboardGroup class="layout-preview" auto-save-id="selaras-home-library-layout" :mobile-breakpoint="1">
      <SDashboardSidebar v-model:collapsed="collapsed" :default-size="122" :min-size="122" :max-size="122" :collapsed-size="44" :ui="{ header: 'p-3', body: 'p-1' }">
        <template #header="{ isCollapsed }">
          <div class="layout-brand">
            <SIcon name="hugeicons:layers-01" class="size-5 shrink-0" />
            <span v-if="!isCollapsed">Studio</span>
          </div>
        </template>
        <template #default="{ isCollapsed }">
          <SNavigationMenu :items="navigation" :collapsed="isCollapsed" tooltip orientation="vertical" size="sm" :ui="{ link: 'w-full' }" />
        </template>
      </SDashboardSidebar>
      <SDashboardPanel>
        <SDashboardNavbar :title="view" :ui="{ root: 'h-11 px-2 gap-1', title: 'text-sm' }">
          <template #leading>
            <SButton square size="sm" variant="ghost" color="neutral" icon="hugeicons:sidebar-left-01" :aria-label="collapsed ? 'Expand layout preview sidebar' : 'Collapse layout preview sidebar'" :aria-expanded="!collapsed" @click="collapsed = !collapsed" />
          </template>
        </SDashboardNavbar>
        <div class="layout-body">
          <p class="preview-title">
            Coming together
          </p>
          <div v-for="task in tasks" :key="task.label" class="layout-task">
            <span>{{ task.label }}</span>
            <SProgress :model-value="task.value" size="sm" :aria-label="`${task.label} sample progress`" />
          </div>
        </div>
      </SDashboardPanel>
    </SDashboardGroup>
  </div>

  <div v-else-if="kind === '/blocks'" class="library-scene scene-blocks" role="group" aria-label="Blocks preview" data-ui>
    <SCard class="profile-preview" :ui="{ body: 'p-5' }">
      <form class="profile-form" @submit.prevent="saved = true">
        <div class="profile-person">
          <SAvatar :text="initials" size="lg" />
          <div>
            <p class="preview-title">
              Profile settings
            </p>
            <p class="preview-note">
              Make yourself at home.
            </p>
          </div>
        </div>
        <SFormField label="Display name">
          <SInput v-model="name" aria-label="Block preview display name" required @update:model-value="saved = false" />
        </SFormField>
        <div class="preview-row">
          <span class="profile-status" role="status">{{ saved ? 'Saved in this preview.' : 'Sample profile' }}</span>
          <SButton type="submit" size="sm">
            {{ saved ? 'Saved' : 'Save profile' }}
          </SButton>
        </div>
      </form>
    </SCard>
  </div>

  <div v-else class="library-scene scene-utilities" role="group" aria-label="Utilities preview" data-ui>
    <div class="utility-preview">
      <div class="utility-file">
        <SIcon name="vscode-icons:file-type-typescript" class="size-5" />
        <span>notifications.ts</span>
      </div>
      <pre class="utility-code"><code><span class="code-keyword">const</span> toast = <span class="code-call">useToast</span>()

toast.<span class="code-call">add</span>({
  title: <span class="code-string">'All in tune'</span>,
  color: <span class="code-string">'success'</span>,
})</code></pre>
      <div class="preview-row utility-run">
        <span>One composable. Real feedback.</span>
        <SButton size="sm" @click="notify">
          Run example
        </SButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.library-scene { display: grid; place-items: center; height: 21rem; padding: 1.5rem; overflow: hidden; border-radius: var(--selaras-resolved-radius-lg); }
.scene-components { background: var(--selaras-resolved-color-primary-subtle); }
.component-tray { width: 100%; max-width: 27rem; }
.preview-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.preview-row :deep(button) { flex-shrink: 0; white-space: nowrap; }
.preview-title { margin: 0; font-size: 1rem; font-weight: 600; line-height: 1.4; }
.preview-note { margin: 0.25rem 0 0; font-size: 0.8125rem; line-height: 1.5; color: var(--selaras-resolved-text-muted); }
.scene-composites { background: var(--selaras-resolved-border-muted); }
.layout-preview { max-width: 32rem; border: 1px solid var(--selaras-resolved-border-default); border-radius: var(--selaras-resolved-radius-md); background: var(--selaras-resolved-surface-default); }
.layout-brand { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 600; }
.layout-body { display: grid; align-content: start; gap: 1.2rem; padding: 1.25rem; }
.layout-task { display: grid; gap: 0.4rem; font-size: 0.75rem; }
.scene-blocks { background: var(--selaras-resolved-color-secondary-subtle); }
.profile-preview { width: 100%; max-width: 23rem; }
.profile-form { display: grid; gap: 1.5rem; }
.profile-person { display: flex; gap: 0.8rem; align-items: center; }
.profile-status { font-size: 0.75rem; color: var(--selaras-resolved-text-muted); }
.scene-utilities { background: var(--selaras-resolved-surface-default); }
.utility-preview { width: 100%; max-width: 32rem; }
.utility-file { display: flex; align-items: center; gap: 0.65rem; color: var(--selaras-resolved-text-muted); font-size: 0.875rem; }
.utility-code { margin: 1.5rem 0; overflow-x: auto; color: var(--selaras-resolved-text-default); font: 0.875rem/1.7 var(--font-mono); tab-size: 2; }
.code-keyword { color: var(--selaras-resolved-color-primary-text); }
.code-call { color: var(--selaras-resolved-color-info-text); }
.code-string { color: var(--selaras-resolved-color-success-text); }
.utility-run > span { color: var(--selaras-resolved-text-muted); font-size: 0.8125rem; }
@media (max-width: 63.999rem) {
  .library-scene { padding: 1rem; }
}
@media (max-width: 47.999rem) {
  .library-scene { height: 22rem; padding: 1rem; }
  .layout-body { padding: 1rem; }
  .utility-run { align-items: start; gap: 0.75rem; }
  .utility-run > span { max-width: 14ch; }
}
</style>
