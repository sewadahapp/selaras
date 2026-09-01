<script setup lang="ts">
defineEmits<{ close: [applied?: boolean] }>()
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex-1 overflow-y-auto p-4">
      <h2 class="mb-4 text-base font-semibold text-[var(--ui-text)]">
        Filters
      </h2>
      <div class="flex flex-col gap-3">
        <SCheckbox label="In stock only" />
        <SCheckbox label="On sale" />
        <SCheckbox label="Free shipping" />
      </div>
    </div>
    <div class="flex items-center justify-end gap-2 border-t border-[var(--ui-border)] p-4">
      <SButton variant="ghost" @click="$emit('close', false)">
        Cancel
      </SButton>
      <SButton @click="$emit('close', true)">
        Apply
      </SButton>
    </div>
  </div>
</template>
