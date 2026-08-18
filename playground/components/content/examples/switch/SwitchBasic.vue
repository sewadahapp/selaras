<script setup lang="ts">
const notifications = ref(true)
</script>

<template>
  <SSwitch v-model="notifications" label="Notifications" />
</template>
