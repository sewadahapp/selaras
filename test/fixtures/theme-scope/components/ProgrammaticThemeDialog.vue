<script setup>
const toast = useToast()
</script>

<template>
  <SButton id="programmatic-theme-button">
    Snapshotted action
  </SButton>
  <button id="open-nested-programmatic-toast" @click="toast.add({ title: 'Nested snapshotted toast', color: 'primary', duration: 60_000 })">
    Open nested toast
  </button>
</template>
