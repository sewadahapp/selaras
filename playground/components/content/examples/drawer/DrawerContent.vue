<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open custom drawer
  </SButton>

  <SDrawer v-model:open="open">
    <template #content>
      <div class="flex flex-col items-center gap-4 p-8 text-center">
        <div class="flex size-12 items-center justify-center rounded-full bg-[var(--ui-success-soft)] text-[var(--ui-success)]">
          <SIcon name="hugeicons:checkmark-circle-01" class="size-6" />
        </div>
        <h2 class="text-base font-semibold text-[var(--ui-text)]">
          Order placed
        </h2>
        <p class="text-sm text-[var(--ui-text-muted)]">
          We'll email you once it ships.
        </p>
        <SButton class="mt-2" block @click="open = false">
          Done
        </SButton>
      </div>
    </template>
  </SDrawer>
</template>
