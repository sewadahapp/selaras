<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open slideover
  </SButton>

  <SSlideover v-model:open="open" title="Edit profile" description="Update your personal details.">
    <template #body>
      Slideover content goes here.
    </template>
    <template #footer>
      <SButton variant="ghost" @click="open = false">
        Cancel
      </SButton>
      <SButton @click="open = false">
        Save
      </SButton>
    </template>
  </SSlideover>
</template>
