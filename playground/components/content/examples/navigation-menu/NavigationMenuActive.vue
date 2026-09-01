<script setup lang="ts">
const active = ref(false)

const items = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Docs', active: active.value },
  { label: 'Pricing', to: '/pricing' },
])
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <SNavigationMenu :items="items" />
    <SButton size="sm" variant="soft" @click="active = !active">
      Toggle "Docs" active
    </SButton>
  </div>
</template>
