<script setup lang="ts">
const { add } = useToast()

function show(color: 'success' | 'danger' | 'warning' | 'info') {
  add({
    color,
    title: color === 'success' ? 'Saved' : color === 'danger' ? 'Failed to save' : color === 'warning' ? 'Unsaved changes' : 'Heads up',
    description: color === 'success' ? 'Your changes have been saved.' : color === 'danger' ? 'Something went wrong - try again.' : color === 'warning' ? 'You have changes that haven\'t been saved yet.' : 'This action can\'t be undone.',
  })
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <SButton color="success" variant="soft" @click="show('success')">
      Success
    </SButton>
    <SButton color="danger" variant="soft" @click="show('danger')">
      Danger
    </SButton>
    <SButton color="warning" variant="soft" @click="show('warning')">
      Warning
    </SButton>
    <SButton color="info" variant="soft" @click="show('info')">
      Info
    </SButton>
  </div>
</template>
