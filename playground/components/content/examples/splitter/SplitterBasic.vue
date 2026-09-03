<template>
  <SSplitter class="h-64 w-full overflow-hidden rounded-[var(--ui-radius-md)] border border-[var(--ui-border)]">
    <SSplitterPanel :default-size="30" :min-size="20" class="bg-[var(--ui-bg-elevated)] p-4 text-sm text-[var(--ui-text-muted)]">
      Panel one
    </SSplitterPanel>
    <SSplitterResizeHandle direction="horizontal" />
    <SSplitterPanel :min-size="20" class="p-4 text-sm text-[var(--ui-text-muted)]">
      Panel two
    </SSplitterPanel>
  </SSplitter>
</template>
