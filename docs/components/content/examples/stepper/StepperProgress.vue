<script setup lang="ts">
const step = ref(1)
const items = [{ title: 'Atur kunci' }, { title: 'Simpan kunci' }]
</script>

<template>
  <SStepper v-model="step" :items="items" aria-label="Progres pembuatan kunci">
    <template #progress="{ step: currentStep, total }">
      Langkah {{ currentStep }} dari {{ total }}
    </template>
  </SStepper>
</template>
