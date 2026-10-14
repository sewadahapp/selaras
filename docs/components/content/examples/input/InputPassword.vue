<script setup lang="ts">
const password = ref('A little secret')
const visible = ref(false)
</script>

<template>
  <SInput v-model="password" :type="visible ? 'text' : 'password'" clearable aria-label="Password" class="max-w-sm">
    <template #trailing="{ disabled, buttonSize }">
      <SButton
        type="button" :disabled="disabled" :size="buttonSize" variant="text" color="neutral" square
        :icon="visible ? 'hugeicons:view-off-slash' : 'hugeicons:view'"
        :aria-label="visible ? 'Hide password' : 'Show password'" :aria-pressed="visible"
        @click="visible = !visible"
      />
    </template>
  </SInput>
</template>
