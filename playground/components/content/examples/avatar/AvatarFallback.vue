<template>
  <div class="flex flex-wrap items-center gap-3">
    <SAvatar text="JD" color="primary" />
    <SAvatar icon="hugeicons:user-group" color="success" />
    <SAvatar color="warning">
      <template #fallback>
        <span class="text-sm font-semibold">ACME</span>
      </template>
    </SAvatar>
  </div>
</template>
