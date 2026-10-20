<template>
  <SEmptyState :ui="{ icon: 'size-16', root: 'py-8' }">
    <template #icon>
      <svg viewBox="0 0 64 64" class="size-full" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 20h14l6 6h20v26H12z" />
        <path d="M24 38h16m-8-8v16M20 12h24" stroke-linecap="round" />
      </svg>
    </template>
    <template #title>
      <h4>No saved collections</h4>
    </template>
    <template #description>
      Save useful examples here, then come back when you're ready to build.
    </template>
    <template #actions>
      <SButton as="a" href="https://selarasui.my.id/blocks/overview" variant="outline" color="neutral">
        Browse blocks
      </SButton>
    </template>
  </SEmptyState>
</template>
