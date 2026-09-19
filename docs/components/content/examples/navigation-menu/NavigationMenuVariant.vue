<script setup lang="ts">
const variants = ['pill', 'link'] as const
const variant = ref<typeof variants[number]>('pill')

const items = [
  { label: 'Home', to: '/', active: true },
  { label: 'Docs', to: '/docs' },
  { label: 'Pricing', to: '/pricing' },
]
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <SButtonGroup>
      <SButton
        v-for="v in variants"
        :key="v"
        variant="soft"
        :color="variant === v ? 'primary' : 'neutral'"
        @click="variant = v"
      >
        {{ v }}
      </SButton>
    </SButtonGroup>
    <SNavigationMenu :items="items" :variant="variant" />
  </div>
</template>
