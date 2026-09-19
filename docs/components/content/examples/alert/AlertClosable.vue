<script setup lang="ts">
const visible = ref(true)
</script>

<template>
  <SAlert
    v-if="visible"
    color="warning"
    title="Unsaved changes"
    description="Leaving this page will discard your edits."
    closable
    class="w-full"
    @close="visible = false"
  />
  <SButton v-else variant="outline" color="neutral" @click="visible = true">
    Show the alert again
  </SButton>
</template>
