<script setup lang="ts">
const active = ref('Overview')

function link(label: string, icon?: string) {
  return { label, icon, active: active.value === label, onSelect: () => (active.value = label) }
}

// A deliberate mix of icon presence at every level (a leaf with/without
// its own icon, a parent with/without one, a 3rd-level group under a
// 2nd-level one) - every row's label still lands at the same x position
// regardless, the whole point of linkIconWrapper's fixed-width reservation.
const links = computed(() => [
  link('Overview', 'hugeicons:dashboard-square-01'),
  {
    label: 'Analytics',
    icon: 'hugeicons:chart-line-data-01',
    children: [
      link('Traffic', 'hugeicons:chart-line-data-01'),
      link('Conversion'),
      {
        label: 'Reports',
        icon: 'hugeicons:file-01',
        children: [link('Daily'), link('Weekly', 'hugeicons:calendar-01')],
      },
    ],
  },
  link('Customers', 'hugeicons:user-group'),
  {
    label: 'Settings',
    children: [link('General', 'hugeicons:settings-01'), link('Billing')],
  },
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
