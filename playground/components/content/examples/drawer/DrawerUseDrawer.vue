<script setup lang="ts">
import DrawerCartPanel from './DrawerCartPanel.vue'

const drawer = useDrawer()
const result = ref<string>()

async function openCart() {
  const checkedOut = await drawer.open(DrawerCartPanel)
  result.value = checkedOut === undefined ? 'Dismissed' : checkedOut ? 'Checked out' : 'Cancelled'
}
</script>

<template>
  <div class="flex flex-col items-start gap-2">
    <SButton @click="openCart">
      Open cart
    </SButton>
    <p v-if="result" class="text-sm text-[var(--ui-text-muted)]">
      Result: {{ result }}
    </p>
  </div>
</template>
