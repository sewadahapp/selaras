<script setup lang="ts">
const open = ref(false)
const clicks = ref(0)
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <SButton @click="open = true">
      Open non-modal
    </SButton>
    <SButton variant="soft" @click="clicks++">
      Page button (clicked {{ clicks }})
    </SButton>
  </div>

  <SSlideover v-model="open" :modal="false" :dismissible="false" title="Non-modal" description="The rest of the page stays interactive.">
    <template #body>
      Try clicking the "Page button" above without closing this slideover
      first - it still works, since <code class="font-mono">modal="false"</code>
      doesn't block outside interaction.
    </template>
  </SSlideover>
</template>
