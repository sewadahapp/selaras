<script setup lang="ts">
import { createError } from '#app'

throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Private server failure detail', fatal: true })
</script>

<template>
  <div />
</template>
