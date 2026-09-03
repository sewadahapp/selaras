<script setup lang="ts">
// The CommandPalette dialog itself is mounted once in app.vue - this is
// just a trigger, so both layouts (default, landing) can show one in their
// header without each needing their own copy of the groups data.
const { open } = useCommandPalette()
const icons = useIcons()
const messages = useMessages()
</script>

<template>
  <button
    type="button"
    class="flex items-center gap-2 rounded-[var(--ui-radius-md)] border border-[var(--ui-border)] px-3 py-1.5 text-sm text-[var(--ui-text-muted)] transition-colors hover:border-[var(--ui-border-accented)] hover:text-[var(--ui-text)]"
    @click="open"
  >
    <SIcon :name="icons.search" class="size-4" />
    <span class="hidden sm:inline">{{ messages.search }}</span>
    <span class="hidden items-center gap-0.5 sm:flex">
      <SKbd value="meta" size="sm" />
      <SKbd value="K" size="sm" />
    </span>
  </button>
</template>
