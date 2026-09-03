<script setup lang="ts">
const links = [
  { label: 'Overview', icon: 'hugeicons:dashboard-square-01' },
  { label: 'Analytics', icon: 'hugeicons:chart-line-data-01' },
  { label: 'Customers', icon: 'hugeicons:user-group' },
  { label: 'Settings', icon: 'hugeicons:settings-01' },
]
const active = ref('Overview')
</script>

<template>
  <div class="h-96 w-full overflow-hidden rounded-[var(--ui-radius-md)] border border-[var(--ui-border)]">
    <SDashboardGroup auto-save-id="docs-example-dashboard">
      <SDashboardSidebar>
        <template #header>
          <span class="font-semibold text-[var(--ui-text)]">Acme Inc</span>
        </template>
        <nav class="flex flex-col gap-1">
          <button
            v-for="link in links"
            :key="link.label"
            type="button"
            class="flex items-center gap-2 rounded-[var(--ui-radius-sm)] px-2 py-1.5 text-start text-sm transition-colors"
            :class="active === link.label ? 'bg-[var(--ui-primary-soft)] text-[var(--ui-primary)]' : 'text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)]'"
            @click="active = link.label"
          >
            <SIcon :name="link.icon" class="size-4 shrink-0" />
            {{ link.label }}
          </button>
        </nav>
        <template #footer>
          <div class="flex items-center gap-2">
            <SAvatar text="JD" size="sm" />
            <span class="text-sm text-[var(--ui-text-muted)]">Jane Doe</span>
          </div>
        </template>
      </SDashboardSidebar>
      <SDashboardResizeHandle />
      <SDashboardPanel>
        <SDashboardNavbar :title="active">
          <SButton size="sm" icon="hugeicons:plus-sign">
            New
          </SButton>
        </SDashboardNavbar>
        <main class="flex-1 overflow-y-auto p-4 text-sm text-[var(--ui-text-muted)]">
          <p>
            Drag the divider to resize the sidebar, or use the navbar's
            toggle button to collapse it. Shrink the browser window to see
            it switch to a drawer instead.
          </p>
        </main>
      </SDashboardPanel>
    </SDashboardGroup>
  </div>
</template>
