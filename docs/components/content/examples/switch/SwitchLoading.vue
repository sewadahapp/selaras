<script setup lang="ts">
const enabled = ref(false)
const loading = ref(false)

async function onUpdate(value: boolean) {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  enabled.value = value
  loading.value = false
}
</script>

<template>
  <SSwitch :model-value="enabled" :loading="loading" label="Sync with server" @update:model-value="onUpdate" />
</template>
