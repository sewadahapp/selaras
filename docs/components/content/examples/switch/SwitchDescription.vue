<script setup lang="ts">
const marketing = ref(false)
</script>

<template>
  <SSwitch
    v-model="marketing"
    label="Marketing emails"
    description="Occasional product updates and offers - unsubscribe any time."
  />
</template>
