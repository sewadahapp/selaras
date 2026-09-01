<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open custom modal
  </SButton>

  <SModal v-model:open="open">
    <template #content>
      <div class="flex flex-col items-center gap-4 p-8 text-center">
        <div class="flex size-12 items-center justify-center rounded-full bg-[var(--ui-success-soft)] text-[var(--ui-success)]">
          <SIcon name="hugeicons:checkmark-circle-01" class="size-6" />
        </div>
        <h2 class="text-base font-semibold text-[var(--ui-text)]">
          Payment successful
        </h2>
        <p class="text-sm text-[var(--ui-text-muted)]">
          A receipt has been sent to your email.
        </p>
        <SButton class="mt-2" block @click="open = false">
          Done
        </SButton>
      </div>
    </template>
  </SModal>
</template>
