<script setup lang="ts">
const indeterminate = ref<boolean | 'indeterminate'>('indeterminate')
const disabledChecked = ref(true)
const invalidChoice = ref(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCheckbox v-model="indeterminate" label="Select all" />
    <SCheckbox :model-value="false" disabled label="Disabled" />
    <SCheckbox v-model="disabledChecked" disabled label="Disabled, checked" />
    <SCheckbox v-model="invalidChoice" invalid label="You must accept to continue" />
  </div>
</template>
