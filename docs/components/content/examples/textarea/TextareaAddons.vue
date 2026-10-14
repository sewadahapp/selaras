<script setup lang="ts">
const message = ref('A short note')
</script>

<template>
  <STextarea v-model="message" :maxlength="200" clearable aria-label="Note" class="max-w-sm" :ui="{ trailing: 'pe-3' }">
    <template #trailing>
      <span>{{ message.length }}/200</span>
    </template>
  </STextarea>
</template>
