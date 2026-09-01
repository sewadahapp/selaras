<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open maximizable modal
  </SButton>

  <SModal v-model="open" maximizable title="Report" description="Toggle the button beside close to expand it.">
    <template #body>
      Click the maximize button to expand this to full-viewport, and again to
      restore it - the icon swaps to match the current state.
    </template>
  </SModal>
</template>
