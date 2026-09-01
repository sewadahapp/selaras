<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open blocking modal
  </SButton>

  <SModal
    v-model:open="open"
    :dismissible="false"
    :close="false"
    title="Confirm your plan"
    description="You must pick an option below to continue."
  >
    <template #body>
      Escape and clicking outside are both disabled, and there's no close
      button - the footer actions are the only way out.
    </template>
    <template #footer>
      <SButton variant="ghost" @click="open = false">
        Keep free plan
      </SButton>
      <SButton color="primary" @click="open = false">
        Upgrade
      </SButton>
    </template>
  </SModal>
</template>
