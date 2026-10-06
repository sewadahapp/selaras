<script setup lang="ts">
const collapsed = ref(false)
</script>

<template>
  <div class="h-80 overflow-hidden rounded-[var(--selaras-resolved-radius-md)] border border-[var(--selaras-resolved-border-default)]">
    <SDashboardGroup auto-save-id="dashboard-controlled-example">
      <SDashboardSidebar v-model:collapsed="collapsed">
        <template #header="{ isCollapsed }">
          {{ isCollapsed ? 'A' : 'Acme Inc' }}
        </template>
        <template #default="{ isCollapsed }">
          <SNavigationMenu :items="[{ label: 'Overview', icon: 'hugeicons:dashboard-square-01' }]" orientation="vertical" :collapsed="isCollapsed" tooltip />
        </template>
      </SDashboardSidebar>
      <SDashboardResizeHandle />
      <SDashboardPanel>
        <SDashboardNavbar title="Controlled sidebar" />
        <div class="p-4">
          <SButton variant="outline" @click="collapsed = !collapsed">
            {{ collapsed ? 'Expand sidebar' : 'Collapse sidebar' }}
          </SButton>
        </div>
      </SDashboardPanel>
    </SDashboardGroup>
  </div>
</template>
