<script setup lang="ts">
const active = ref('Overview')

const links = computed(() => [
  { label: 'Overview', icon: 'hugeicons:dashboard-square-01', active: active.value === 'Overview', onSelect: () => { active.value = 'Overview' } },
  { label: 'Analytics', icon: 'hugeicons:chart-line-data-01', active: active.value === 'Analytics', onSelect: () => { active.value = 'Analytics' } },
  { label: 'Customers', icon: 'hugeicons:user-group', active: active.value === 'Customers', onSelect: () => { active.value = 'Customers' } },
  { label: 'Settings', icon: 'hugeicons:settings-01', active: active.value === 'Settings', onSelect: () => { active.value = 'Settings' } },
])
</script>

<template>
  <div class="h-96 w-full overflow-hidden rounded-[var(--ui-radius-md)] border border-[var(--ui-border)]">
    <SDashboardGroup auto-save-id="docs-example-dashboard">
      <SDashboardSidebar>
        <template #header="{ isCollapsed }">
          <span class="font-semibold text-[var(--ui-text)]">{{ isCollapsed ? 'A' : 'Acme Inc' }}</span>
        </template>
        <template #default="{ isCollapsed }">
          <SNavigationMenu :items="links" orientation="vertical" :collapsed="isCollapsed" />
        </template>
        <template #footer="{ isCollapsed }">
          <div class="flex items-center gap-2">
            <SAvatar text="JD" size="sm" />
            <span v-if="!isCollapsed" class="text-sm text-[var(--ui-text-muted)]">Jane Doe</span>
          </div>
        </template>
      </SDashboardSidebar>
      <SDashboardResizeHandle />
      <SDashboardPanel>
        <SDashboardNavbar :title="active">
          <template #leading>
            <SDashboardSidebarToggle />
          </template>
          <SButton size="sm" icon="hugeicons:plus-sign">
            New
          </SButton>
        </SDashboardNavbar>
        <main class="flex-1 overflow-y-auto p-4 text-sm text-[var(--ui-text-muted)]">
          <p>
            Drag the divider to resize the sidebar, or use the navbar's
            toggle button to collapse it down to an icon rail. Shrink the
            browser window to see it switch to a drawer instead.
          </p>
        </main>
      </SDashboardPanel>
    </SDashboardGroup>
  </div>
</template>
