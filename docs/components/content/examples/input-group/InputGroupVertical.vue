<script setup lang="ts">
const firstName = ref('')
const lastName = ref('')
</script>

<template>
  <SInputGroup orientation="vertical" class="w-64">
    <SFormField label="First name" name="firstName" label-mode="floating">
      <SInput v-model="firstName" autocomplete="given-name" />
    </SFormField>
    <SFormField label="Last name" name="lastName" label-mode="floating">
      <SInput v-model="lastName" autocomplete="family-name" />
    </SFormField>
  </SInputGroup>
</template>
