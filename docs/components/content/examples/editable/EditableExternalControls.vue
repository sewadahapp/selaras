<script setup lang="ts">
const title = ref('Design system')
const editing = ref(false)
const editable = useTemplateRef('editable')
</script>

<template>
  <div class="w-full max-w-md space-y-3">
    <div class="flex items-center justify-between gap-3">
      <span id="external-project-label" class="text-sm font-medium">Project name</span>
      <div v-if="editing" class="flex items-center gap-2">
        <SButton size="sm" variant="ghost" color="neutral" @click="editable?.cancel()">
          Cancel
        </SButton>
        <SButton size="sm" @click="editable?.submit()">
          Save
        </SButton>
      </div>
      <SButton v-else size="sm" variant="outline" @click="editing = true">
        Rename
      </SButton>
    </div>
    <SEditable
      ref="editable" v-model="title" v-model:editing="editing"
      activation-mode="none" submit-mode="none" :controls="false"
      aria-labelledby="external-project-label" aria-describedby="external-project-help"
      :ui="{ preview: 'px-0' }"
    />
    <p id="external-project-help" class="text-sm text-[var(--selaras-resolved-text-muted)]">
      {{ editing ? 'Changes stay in a draft until you choose Save. Escape cancels.' : 'Use Rename to edit this name.' }}
    </p>
    <p class="text-sm">
      Saved name: {{ title }}
    </p>
  </div>
</template>
