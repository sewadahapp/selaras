<template>
  <div class="flex flex-wrap items-center gap-3">
    <SChip label="Primary" color="primary" rounded />
    <SChip label="Removable" removable rounded @remove="() => {}" />
  </div>
</template>
