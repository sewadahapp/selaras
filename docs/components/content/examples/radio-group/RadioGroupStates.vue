<script setup lang="ts">
const shipping = ref('standard')
const plan = ref('legacy')
const frozen = ref('one')
const invalidChoice = ref<string>()
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
    <SRadioGroup v-model="frozen" disabled :items="['one', 'two', 'three']" />
    <SRadioGroup v-model="invalidChoice" invalid :items="['one', 'two', 'three']" />
  </div>
</template>
