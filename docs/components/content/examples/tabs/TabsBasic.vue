<script setup lang="ts">
const active = ref('one')
</script>

<template>
  <STabs v-model="active" :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]">
    <template #one>
      Tab one content
    </template>
    <template #two>
      Tab two content
    </template>
  </STabs>
</template>
