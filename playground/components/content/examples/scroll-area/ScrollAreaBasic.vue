<template>
  <SScrollArea class="h-32 w-full rounded-[var(--selaras-resolved-radius-md)] ring-1 ring-[var(--selaras-resolved-border-default)]">
    <div class="flex flex-col gap-2 p-3">
      <p v-for="i in 15" :key="i" class="text-sm">
        Scrollable line {{ i }}
      </p>
    </div>
  </SScrollArea>
</template>
