<script setup>
const route = useRoute()
const align = ref(route.query.align ?? 'center')
const compact = ref(route.query.wide !== 'true')
const dir = route.query.rtl ? 'rtl' : 'ltr'
const items = [
  { label: 'Products', children: [
    { label: 'Analytics', to: '/analytics' },
    { label: 'Automation', to: '/automation' },
    { label: 'Integrations', to: '/integrations' },
  ] },
  { label: 'Company', children: [{ label: 'About', to: '/about' }] },
]
</script>

<template>
  <SApp :dir="dir">
    <button @click="compact = !compact">
      Toggle layout
    </button>
    <button @click="align = align === 'start' ? 'end' : 'start'">
      Toggle alignment
    </button>
    <div :style="{ margin: '80px 20px', width: 'calc(100% - 40px)' }">
      <SNavigationMenu
        :items="items" :content-orientation="compact ? undefined : 'horizontal'"
        :positioning="{ align }" :style="{ justifyContent: route.query.edge ? 'flex-end' : 'center' }"
        :ui="{ viewport: { 'data-testid': 'viewport' }, content: route.query.custom ? 'w-64' : undefined }"
      />
    </div>
  </SApp>
</template>
