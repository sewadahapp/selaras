<template>
  <div class="relative inline-flex">
    <SButton variant="outline" icon="lucide:bell" aria-label="Notifications" :ui="{ base: 'w-10 px-0' }" />
    <SBadge label="3" color="danger" size="sm" class="absolute -top-1.5 -right-1.5" />
  </div>
</template>
