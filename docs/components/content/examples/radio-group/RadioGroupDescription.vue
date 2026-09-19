<script setup lang="ts">
const plan = ref('pro')
</script>

<template>
  <SRadioGroup
    v-model="plan"
    :items="[
      { label: 'Free', value: 'free', description: 'Basic features, community support.' },
      { label: 'Pro', value: 'pro', description: 'Everything in Free, plus priority support.' },
    ]"
  />
</template>
