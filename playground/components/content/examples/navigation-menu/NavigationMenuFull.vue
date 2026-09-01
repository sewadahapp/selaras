<script setup lang="ts">
const items = [
  { label: 'Home', icon: 'hugeicons:home-01', to: '/' },
  { label: 'Products', children: [
    { label: 'Analytics', icon: 'hugeicons:chart-line-data-01', to: '/products/analytics' },
    { label: 'Automation', icon: 'hugeicons:workflow-square-05', to: '/products/automation' },
    { label: 'Integrations', icon: 'hugeicons:plug-01', to: '/products/integrations' },
    { label: 'Security', icon: 'hugeicons:shield-01', to: '/products/security' },
    { label: 'Database', icon: 'hugeicons:database-01', to: '/products/database' },
    { label: 'Reporting', icon: 'hugeicons:file-01', to: '/products/reporting' },
  ] },
  { label: 'Solutions', children: [
    { label: 'For teams', icon: 'hugeicons:user-group', to: '/solutions/teams' },
    { label: 'For enterprise', icon: 'hugeicons:briefcase-01', to: '/solutions/enterprise' },
    { label: 'For developers', icon: 'hugeicons:code-square', to: '/solutions/developers' },
    { label: 'For marketing', icon: 'hugeicons:megaphone-01', to: '/solutions/marketing' },
  ] },
  { label: 'Resources', children: [
    { label: 'Docs', icon: 'hugeicons:book-02', to: '/resources/docs' },
    { label: 'Blog', icon: 'hugeicons:news', to: '/resources/blog' },
    { label: 'Help center', icon: 'hugeicons:help-circle', to: '/resources/help' },
  ] },
  { label: 'Pricing', to: '/pricing' },
]
</script>

<template>
  <SNavigationMenu :items="items" />
</template>
