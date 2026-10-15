<script setup lang="ts">
defineProps<{ title: string, description: string }>()
</script>

<template>
  <div style="display: flex; position: relative; width: 1200px; height: 630px; border-top: 8px solid #4e40c9; background-color: #faf9ff; color: #191919; font-family: Inter;">
    <div style="display: flex; position: absolute; top: 56px; left: 64px; align-items: center; gap: 16px;">
      <svg width="56" height="56" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4e40c9" d="M28 78 H68 C94 78 118 34 144 34 H228 V64 H144 C118 64 94 108 68 108 H28 Z" />
        <path fill="#4e40c9" d="M28 132 H68 C94 132 118 88 144 88 H228 V118 H144 C118 118 94 162 68 162 H28 Z" />
        <path fill="#4e40c9" d="M28 186 H68 C94 186 118 142 144 142 H228 V172 H144 C118 172 94 216 68 216 H28 Z" />
      </svg>
      <span style="font-size: 36px; font-weight: 700; letter-spacing: -1px;">Selaras</span>
    </div>
    <div style="display: flex; position: absolute; top: 170px; height: 330px; left: 64px; width: 1072px; flex-direction: column; justify-content: center;">
      <h1 style="display: block; margin: 0; font-size: 72px; font-weight: 700; line-height: 1.1; letter-spacing: -2px; line-clamp: 2; text-overflow: ellipsis;">
        {{ title }}
      </h1>
      <p style="display: block; margin: 24px 0 0; max-width: 1000px; color: #555361; font-size: 28px; line-height: 1.45; line-clamp: 3; text-overflow: ellipsis;">
        {{ description }}
      </p>
    </div>
    <div style="display: flex; position: absolute; top: 540px; left: 64px; width: 1072px; justify-content: space-between; border-top: 1px solid #dedbe9; padding-top: 24px; color: #555361; font-size: 22px;">
      <span>Vue components for Nuxt</span>
      <span>Documentation</span>
    </div>
  </div>
</template>
