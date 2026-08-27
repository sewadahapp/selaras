<script setup lang="ts">
const sm = ref('one')
const md = ref('one')
const lg = ref('one')
</script>

<template>
  <div class="flex flex-col gap-4">
    <SRadioGroup v-model="sm" size="sm" orientation="horizontal" :items="['one', 'two']" />
    <SRadioGroup v-model="md" size="md" orientation="horizontal" :items="['one', 'two']" />
    <SRadioGroup v-model="lg" size="lg" orientation="horizontal" :items="['one', 'two']" />
  </div>
</template>
