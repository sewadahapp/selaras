<script setup lang="ts">
import AdaptiveInterfacesBasic from '../../components/content/examples/adaptive/AdaptiveInterfacesBasic.vue'

definePageMeta({ layout: false })
useHead({ title: 'Adaptive interfaces preview', meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <main class="min-h-screen bg-[var(--selaras-resolved-surface-default)] p-6 text-[var(--selaras-resolved-text-default)]">
    <h1 class="mb-2 text-lg font-semibold">
      Try adaptive controls
    </h1>
    <p class="mb-6 text-sm text-[var(--selaras-resolved-text-muted)]">
      Choose a team, search cities, pick a date or color, or open the actions menu.
    </p>
    <AdaptiveInterfacesBasic />
  </main>
</template>
