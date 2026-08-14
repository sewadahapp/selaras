<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex items-center justify-center gap-3 p-10">
    <SButton>Solid</SButton>
    <SButton variant="soft">
      Soft
    </SButton>
    <SButton variant="outline">
      Outline
    </SButton>
    <SButton variant="ghost">
      Ghost
    </SButton>
    <SButton color="danger">
      Danger
    </SButton>
    <SButton disabled>
      Disabled
    </SButton>
    <SButton :ui="{ base: 'rounded-full' }">
      Custom ui
    </SButton>
  </div>
</template>
