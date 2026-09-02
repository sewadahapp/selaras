<script setup lang="ts">
const files = ref<File[]>([])
const errors = ref<string[]>([])

function onError(rejected: { file: File, reason: string }[]) {
  errors.value = rejected.map(r => r.reason)
}
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-2">
    <SFileUpload
      v-model="files"
      accept="image/*"
      :max-size="1024 * 1024"
      @error="onError"
      @update:model-value="errors = []"
    />
    <p v-for="(error, index) in errors" :key="index" class="text-sm text-[var(--ui-danger)]">
      {{ error }}
    </p>
  </div>
</template>
