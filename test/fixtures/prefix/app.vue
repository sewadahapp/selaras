<script setup>
</script>

<template>
  <div>
    <SButton>Click me</SButton>
    <SButton id="enterprise-button" color="enterprise">
      Enterprise
    </SButton>
    <SButton id="brand-vars-button" color="brand-vars">
      Brand variables
    </SButton>
    <SButton id="override-button" :ui="{ base: 'tw:bg-purple-700' }">
      Overridden
    </SButton>
  </div>
</template>
