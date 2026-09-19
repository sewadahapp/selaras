<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open slideover with long content
  </SButton>

  <SSlideover v-model:open="open" title="Terms of service" description="Please read the whole thing.">
    <template #body>
      <p v-for="i in 20" :key="i" class="mb-3 last:mb-0">
        Paragraph {{ i }} - the body scrolls internally once its content
        outgrows the viewport, while the header and footer stay pinned in
        place.
      </p>
    </template>
    <template #footer>
      <SButton variant="ghost" @click="open = false">
        Decline
      </SButton>
      <SButton color="primary" @click="open = false">
        Accept
      </SButton>
    </template>
  </SSlideover>
</template>
