<script setup lang="ts">
const variants = ['outline', 'solid', 'soft', 'subtle'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
    <SCard v-for="variant in variants" :key="variant" :variant="variant">
      <p class="text-xs font-medium tracking-wide text-[var(--ui-text-muted)] uppercase">
        {{ variant }}
      </p>
      <h4 class="font-semibold text-[var(--ui-text)]">
        New feature shipped
      </h4>
      <p class="text-sm text-[var(--ui-text-muted)]">
        Read the release notes for this week's update.
      </p>
    </SCard>
  </div>
</template>
