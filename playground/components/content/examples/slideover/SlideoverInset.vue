<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open inset slideover
  </SButton>

  <SSlideover v-model="open" inset title="Notifications">
    <template #body>
      Floats with a margin and rounded corners instead of sitting flush
      against the edge.
    </template>
  </SSlideover>
</template>
