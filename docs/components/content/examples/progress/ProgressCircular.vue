<template>
  <div class="flex items-center gap-6">
    <SProgress type="circular" :model-value="70">
      <template #default="{ percent }">
        {{ Math.round(percent ?? 0) }}%
      </template>
    </SProgress>
    <SProgress type="circular" />
  </div>
</template>
