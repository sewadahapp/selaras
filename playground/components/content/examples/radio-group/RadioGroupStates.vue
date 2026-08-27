<script setup lang="ts">
const shipping = ref('standard')
const plan = ref('legacy')
</script>

<template>
  <div class="flex flex-col gap-6">
    <SRadioGroup
      v-model="shipping"
      :items="[
        { label: 'Standard', value: 'standard' },
        { label: 'Express', value: 'express', disabled: true },
        { label: 'Overnight', value: 'overnight' },
      ]"
    />
    <SRadioGroup
      v-model="plan"
      :items="[
        { label: 'Legacy (discontinued)', value: 'legacy', disabled: true },
        { label: 'Starter', value: 'starter' },
        { label: 'Pro', value: 'pro' },
      ]"
    />
  </div>
</template>
