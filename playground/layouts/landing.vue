<template>
  <div class="min-h-screen bg-[var(--ui-bg)] text-[var(--ui-text)]">
    <SHeader>
      <NuxtLink to="/" class="font-mono font-semibold">
        selaras
      </NuxtLink>
      <template #right>
        <NuxtLink
          to="/components/button"
          class="text-sm text-[var(--ui-text-muted)] transition-colors hover:text-[var(--ui-text)]"
        >
          Docs
        </NuxtLink>
        <SColorModeToggle />
      </template>
    </SHeader>
    <main>
      <slot />
    </main>
  </div>
</template>
