<script setup lang="ts">
const primary = ref('one')
const success = ref('one')
const danger = ref('one')
</script>

<template>
  <div class="flex flex-col gap-4">
    <SRadioGroup v-model="primary" color="primary" orientation="horizontal" :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]" />
    <SRadioGroup v-model="success" color="success" orientation="horizontal" :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]" />
    <SRadioGroup v-model="danger" color="danger" orientation="horizontal" :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]" />
  </div>
</template>
