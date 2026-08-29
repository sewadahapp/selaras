<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open fullscreen modal
  </SButton>

  <SModal v-model="open" fullscreen title="Fullscreen" description="Takes up the entire viewport.">
    <template #body>
      Useful for image viewers, complex forms, or anything that benefits from
      the extra room a centered card can't give it.
    </template>
    <template #footer>
      <SButton variant="ghost" @click="open = false">
        Close
      </SButton>
    </template>
  </SModal>
</template>
