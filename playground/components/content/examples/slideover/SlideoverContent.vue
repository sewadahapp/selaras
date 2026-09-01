<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open custom slideover
  </SButton>

  <SSlideover v-model:open="open">
    <template #content>
      <div class="flex flex-col items-center gap-4 p-8 text-center">
        <div class="flex size-12 items-center justify-center rounded-full bg-[var(--ui-success-soft)] text-[var(--ui-success)]">
          <SIcon name="hugeicons:checkmark-circle-01" class="size-6" />
        </div>
        <h2 class="text-base font-semibold text-[var(--ui-text)]">
          All caught up
        </h2>
        <p class="text-sm text-[var(--ui-text-muted)]">
          You have no new notifications.
        </p>
        <SButton class="mt-2" block @click="open = false">
          Close
        </SButton>
      </div>
    </template>
  </SSlideover>
</template>
