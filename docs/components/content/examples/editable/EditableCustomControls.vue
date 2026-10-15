<script setup lang="ts">
const title = ref('Team workspace')
</script>

<template>
  <SEditable v-model="title" activation-mode="none" submit-mode="none" aria-label="Workspace name" class="max-w-md">
    <template #controls="{ editing, disabled, edit, submit, cancel }">
      <div class="flex gap-1">
        <template v-if="editing">
          <SButton size="sm" :disabled="disabled" @click="submit()">
            Save
          </SButton>
          <SButton size="sm" variant="ghost" color="neutral" :disabled="disabled" @click="cancel()">
            Cancel
          </SButton>
        </template>
        <SButton v-else size="sm" variant="outline" :disabled="disabled" @click="edit()">
          Edit
        </SButton>
      </div>
    </template>
  </SEditable>
</template>
