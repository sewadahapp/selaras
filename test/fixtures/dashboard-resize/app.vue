<script setup>
const route = useRoute()
useHead({ htmlAttrs: { class: route.query.dark ? 'dark' : '' } })
</script>

<template>
  <SApp :dir="route.query.rtl ? 'rtl' : 'ltr'">
    <div style="background: #6b7280; width: 1000px; height: 400px">
      <SDashboardGroup auto-save-id="resize-regression">
        <SDashboardSidebar id="sidebar" :ui="route.query.same ? { root: 'bg-transparent' } : undefined">
          Sidebar
        </SDashboardSidebar>
        <SDashboardResizeHandle id="resize-handle" :ui="route.query.override ? { line: 'opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[state=drag]:opacity-100', root: { 'data-custom': 'yes' } } : undefined" />
        <SDashboardPanel id="panel">
          Content
        </SDashboardPanel>
      </SDashboardGroup>
    </div>
  </SApp>
</template>
