<script setup lang="ts">
const saving = ref(false)

function save() {
  saving.value = true
  setTimeout(() => {
    saving.value = false
  }, 1500)
}
</script>

<template>
  <SButton icon="lucide:save" :loading="saving" :disabled="saving" @click="save">
    {{ saving ? 'Saving...' : 'Save' }}
  </SButton>
</template>
