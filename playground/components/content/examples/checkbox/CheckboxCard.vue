<script setup lang="ts">
const accepted = ref(false)
</script>

<template>
  <SCheckbox
    v-model="accepted"
    variant="card"
    label="Accept terms"
    description="You agree to our Terms of Service and Privacy Policy."
  />
</template>
