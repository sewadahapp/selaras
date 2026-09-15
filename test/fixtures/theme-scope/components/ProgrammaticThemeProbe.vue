<script setup>
const modal = useModal()
const toast = useToast()

function openProgrammaticItems() {
  modal.open(resolveComponent('ProgrammaticThemeDialog'), {
    title: 'Snapshotted theme',
    description: 'Verifies programmatic theme lifetime.',
    dismissible: false,
  })
  toast.add({
    title: 'Snapshotted toast',
    color: 'primary',
    duration: 60_000,
  })
}
</script>

<template>
  <button id="open-programmatic-theme" @click="openProgrammaticItems">
    Open programmatic theme probes
  </button>
</template>
