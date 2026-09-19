<script setup lang="ts">
const countryCode = ref('+1')

const countryCodes = [
  { label: '+1', value: '+1' },
  { label: '+44', value: '+44' },
  { label: '+61', value: '+61' },
]
</script>

<template>
  <SInputGroup class="max-w-xs">
    <SSelect v-model="countryCode" :items="countryCodes" class="w-24 shrink-0" />
    <SInput placeholder="Phone number" />
  </SInputGroup>
</template>
