<template>
  <SSplitter class="h-64 w-full overflow-hidden rounded-[var(--selaras-resolved-radius-md)] border border-[var(--selaras-resolved-border-default)]">
    <SSplitterPanel :default-size="30" :min-size="20" class="bg-[var(--selaras-resolved-surface-elevated)] p-4 text-sm text-[var(--selaras-resolved-text-muted)]">
      Panel one
    </SSplitterPanel>
    <!--
      The resize handle's own hit area is wider than its visible line
      (a comfortable grab target, invisible padding on either side) -
      harmless when both panels share one background, but Panel one here
      uses --selaras-resolved-surface-elevated while Panel two stays plain, so that
      "invisible" padding would otherwise show through as a mismatched
      sliver right at Panel one's edge (same fix DashboardResizeHandle
      applies for its own fixed two-role layout - see its theme file).
    -->
    <SSplitterResizeHandle direction="horizontal" :ui="{ root: 'bg-[linear-gradient(to_right,var(--selaras-resolved-surface-elevated)_50%,transparent_50%)]' }" />
    <SSplitterPanel :min-size="20" class="p-4 text-sm text-[var(--selaras-resolved-text-muted)]">
      Panel two
    </SSplitterPanel>
  </SSplitter>
</template>
