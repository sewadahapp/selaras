<script setup lang="ts">
const selected = ref(['read'])
const items = [
  { label: 'Workspace', items: [{ label: 'Read projects', value: 'read' }, { label: 'Create projects', value: 'create' }, { label: 'Delete projects', value: 'delete', disabled: true }] },
  { label: 'Team', items: [{ label: 'Invite members', value: 'invite' }, { label: 'Manage roles', value: 'roles' }] },
]
</script>

<template>
  <div class="w-full max-w-sm space-y-3">
    <SListbox v-model="selected" :items="items" label="Permissions" multiple checkbox searchable select-all />
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
      {{ selected.length }} permissions selected
    </p>
  </div>
</template>
