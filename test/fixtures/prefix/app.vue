<script setup>
</script>

<template>
  <div>
    <SButton>Click me</SButton>
    <SButton id="override-button" :ui="{ base: 'tw:bg-purple-700' }">
      Overridden
    </SButton>
  </div>
</template>
