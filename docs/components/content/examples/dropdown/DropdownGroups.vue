<script setup lang="ts">
const lastAction = ref('No action selected')
const profile = { label: 'Profile', onSelect: () => lastAction.value = 'Profile selected' }
const signOut = { label: 'Sign out', onSelect: () => lastAction.value = 'Sign out selected' }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap gap-4">
      <SDropdown :items="[[profile], [signOut]]">
        <SButton variant="outline">
          Two groups
        </SButton>
      </SDropdown>
      <SDropdown :items="[[profile, signOut]]">
        <SButton variant="outline">
          One group
        </SButton>
      </SDropdown>
    </div>
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]" aria-live="polite">
      {{ lastAction }}
    </p>
  </div>
</template>
