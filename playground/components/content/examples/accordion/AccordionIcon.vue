<script setup lang="ts">
const items = [
  { value: 'a', label: 'Account settings', icon: 'hugeicons:settings-01' },
  { value: 'b', label: 'Security', icon: 'hugeicons:shield-01' },
]
</script>

<template>
  <SAccordion :items="items">
    <template #label="{ item }">
      <span class="flex items-center gap-2">
        <SIcon :name="item.icon" class="size-4 text-[var(--ui-text-muted)]" />
        {{ item.label }}
      </span>
    </template>
    <template #a>
      Update your name, email and profile photo.
    </template>
    <template #b>
      Manage two-factor authentication and active sessions.
    </template>
  </SAccordion>
</template>
