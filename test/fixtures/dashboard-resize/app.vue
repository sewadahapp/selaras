<script setup>
const route = useRoute()
const collapsed = ref(route.query.controlled === 'true')
const sidebar = ref()
function updateCollapsed(value) {
  if (!route.query.veto)
    collapsed.value = value
}
useHead({ htmlAttrs: { class: route.query.dark ? 'dark' : '' } })
</script>

<template>
  <SApp :dir="route.query.rtl ? 'rtl' : 'ltr'">
    <div v-if="route.query.controlled" style="display: flex; gap: 8px">
      <button id="set-collapse" @click="collapsed = true">
        Collapse
      </button>
      <button id="set-expand" @click="collapsed = false">
        Expand
      </button>
      <button id="method-collapse" @click="sidebar?.collapse()">
        Collapse by ref
      </button>
      <button id="method-expand" @click="sidebar?.expand()">
        Expand by ref
      </button>
      <output id="collapse-model">{{ collapsed }}</output>
    </div>
    <div style="background: #6b7280; width: 1000px; height: 400px">
      <SDashboardGroup auto-save-id="resize-regression">
        <SDashboardSidebar id="sidebar" ref="sidebar" :collapsed="route.query.controlled ? collapsed : undefined" :ui="route.query.same ? { root: 'bg-transparent' } : undefined" @update:collapsed="updateCollapsed">
          <SNavigationMenu :items="[{ label: 'Account', to: '/account' }, { label: 'Disabled', disabled: true }, { label: 'Team', children: [{ label: 'Members', to: '/members' }] }]" orientation="vertical" :collapsed="true" tooltip :popover="{ side: 'left' }" />
        </SDashboardSidebar>
        <SDashboardResizeHandle id="resize-handle" :ui="route.query.override ? { line: 'opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[state=drag]:opacity-100', root: { 'data-custom': 'yes' } } : undefined" />
        <SDashboardPanel id="panel">
          <SDashboardSidebarToggle id="sidebar-toggle" />
          Content
        </SDashboardPanel>
      </SDashboardGroup>
    </div>
  </SApp>
</template>
