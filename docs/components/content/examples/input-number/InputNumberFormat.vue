<script setup lang="ts">
const value = ref(5)
</script>

<template>
  <SInputNumber v-model="value" :min="0" :max="59" :format-options="{ minimumIntegerDigits: 2 }" class="max-w-32" />
</template>
