<script setup lang="ts">
const open = ref(false)
const name = ref('')
</script>

<template>
  <SPopover v-model="open">
    <SButton variant="outline">
      Edit name
    </SButton>
    <template #content>
      <div class="flex w-64 flex-col gap-3">
        <p class="text-sm font-medium text-[var(--ui-text)]">
          Display name
        </p>
        <SInput v-model="name" placeholder="Jane Doe" />
        <SButton size="sm" @click="open = false">
          Save
        </SButton>
      </div>
    </template>
  </SPopover>
</template>
