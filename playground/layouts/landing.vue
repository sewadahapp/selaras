<template>
  <div class="min-h-screen bg-[var(--ui-bg)] text-[var(--ui-text)]">
    <SHeader>
      <NuxtLink to="/" class="font-semibold">
        Selaras
      </NuxtLink>
      <template #right>
        <SNavigationMenu :items="docsNavItems" variant="link" :ui="{ root: 'w-auto' }" />
        <SColorModeToggle />
      </template>
    </SHeader>
    <main>
      <slot />
    </main>
  </div>
</template>
