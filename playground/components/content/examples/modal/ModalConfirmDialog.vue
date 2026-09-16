<script setup lang="ts">
defineEmits<{ close: [confirmed?: boolean] }>()
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-8 text-center">
    <div class="flex size-12 items-center justify-center rounded-full bg-[var(--selaras-resolved-color-danger-subtle)] text-[var(--selaras-resolved-color-danger-text)]">
      <SIcon name="hugeicons:alert-02" class="size-6" />
    </div>
    <h2 class="text-base font-semibold text-[var(--selaras-resolved-text-default)]">
      Delete this item?
    </h2>
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
      This action cannot be undone.
    </p>
    <div class="mt-2 flex gap-2">
      <SButton variant="ghost" @click="$emit('close', false)">
        Cancel
      </SButton>
      <SButton color="danger" @click="$emit('close', true)">
        Delete
      </SButton>
    </div>
  </div>
</template>
