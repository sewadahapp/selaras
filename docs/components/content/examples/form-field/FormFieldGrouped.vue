<script setup lang="ts">
const horizontalFirst = ref('')
const horizontalLast = ref('')
const verticalFirst = ref('')
const verticalLast = ref('')
</script>

<template>
  <div class="grid max-w-lg gap-6">
    <div class="grid gap-2">
      <p class="text-sm font-medium">
        Horizontal
      </p>
      <SInputGroup class="w-full">
        <SFormField label="First name" name="horizontal-first-name" label-mode="floating" class="min-w-0 flex-1">
          <SInput v-model="horizontalFirst" autocomplete="given-name" />
        </SFormField>
        <SFormField label="Last name" name="horizontal-last-name" label-mode="floating" class="min-w-0 flex-1">
          <SInput v-model="horizontalLast" autocomplete="family-name" />
        </SFormField>
      </SInputGroup>
    </div>

    <div class="grid gap-2">
      <p class="text-sm font-medium">
        Vertical
      </p>
      <SInputGroup orientation="vertical" class="w-full">
        <SFormField label="First name" name="vertical-first-name" label-mode="floating">
          <SInput v-model="verticalFirst" autocomplete="given-name" />
        </SFormField>
        <SFormField label="Last name" name="vertical-last-name" label-mode="floating">
          <SInput v-model="verticalLast" autocomplete="family-name" />
        </SFormField>
      </SInputGroup>
    </div>
  </div>
</template>
