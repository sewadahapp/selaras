<template>
  <SCard :ui="{ body: 'p-0' }" class="w-64">
    <img
      src="https://picsum.photos/seed/selaras-headphones/400/300"
      alt="Wireless headphones"
      class="aspect-[4/3] w-full object-cover"
    >
    <div class="flex flex-col gap-1 p-4">
      <p class="font-medium text-[var(--selaras-resolved-text-default)]">
        Wireless headphones
      </p>
      <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
        Noise-cancelling, 30-hour battery life
      </p>
      <div class="mt-2 flex items-center justify-between">
        <span class="font-semibold text-[var(--selaras-resolved-text-default)]">$129</span>
        <SButton size="sm">
          Add to cart
        </SButton>
      </div>
    </div>
  </SCard>
</template>
