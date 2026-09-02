<script setup lang="ts">
defineEmits<{ close: [checkedOut?: boolean] }>()
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex-1 overflow-y-auto p-4">
      <h2 class="mb-4 text-base font-semibold text-[var(--ui-text)]">
        Your cart
      </h2>
      <p class="text-sm text-[var(--ui-text-muted)]">
        2 items - $258.00
      </p>
    </div>
    <div class="flex items-center justify-end gap-2 border-t border-[var(--ui-border)] p-4">
      <SButton variant="ghost" @click="$emit('close', false)">
        Cancel
      </SButton>
      <SButton @click="$emit('close', true)">
        Checkout
      </SButton>
    </div>
  </div>
</template>
