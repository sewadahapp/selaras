<script setup lang="ts">
const items = [
  { label: 'Dashboard', icon: 'hugeicons:dashboard-square-01', to: '/dashboard', active: true },
  { label: 'Account', icon: 'hugeicons:user-account', children: [
    { label: 'Profile', to: '/account/profile' },
    { label: 'Security', children: [
      { label: 'Password', icon: 'hugeicons:square-lock-01', to: '/account/security/password' },
      { label: 'Two-factor auth', icon: 'hugeicons:notification-01', to: '/account/security/2fa' },
    ] },
    { label: 'Billing', icon: 'hugeicons:credit-card', to: '/account/billing' },
  ] },
  { label: 'Developers', icon: 'hugeicons:code', children: [
    { label: 'API keys', icon: 'hugeicons:api', to: '/developers/api-keys' },
    { label: 'Webhooks', icon: 'hugeicons:puzzle', to: '/developers/webhooks' },
    { label: 'Integrations', children: [
      { label: 'GitHub', icon: 'hugeicons:git-branch', to: '/developers/integrations/github' },
      { label: 'Cloud storage', icon: 'hugeicons:cloud', to: '/developers/integrations/cloud' },
    ] },
  ] },
  { label: 'Archived project', icon: 'hugeicons:folder-01', disabled: true },
]
</script>

<template>
  <div class="max-w-64">
    <SNavigationMenu :items="items" orientation="vertical" highlight />
  </div>
</template>
