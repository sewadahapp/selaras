<script setup lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, ColorRole, ThemeProps } from '@sewadah/selaras/types'
import { createTableColumnHelper } from '@sewadah/selaras/table'

const role: ColorRole = 'published'
const button: ButtonProps = { color: role }
const theme: ThemeProps = { defaults: { button: { size: 'sm' } } }
const helper = createTableColumnHelper<{ id: string }>()
const column = helper.accessor('id', { header: 'ID' })
const config: NonNullable<AppConfig['selaras']> = { tokens: { light: { colors: { published: { fill: '#123456' } } } } }
// @ts-expect-error generated AppConfig augmentation must reject unknown token roles
const invalidConfig: NonNullable<AppConfig['selaras']> = { tokens: { light: { colors: { 'not-published': { fill: '#123456' } } } } }
// @ts-expect-error generated registry must reject roles absent from this consumer
const unknownRole: ColorRole = 'not-published'
// @ts-expect-error the removed pre-1.0 namespace must remain absent in the package
const oldTheme: ThemeProps = { props: {} }
void unknownRole
void oldTheme
void config
void invalidConfig
</script>

<template>
  <SApp>
    <SButton id="packed-default" v-bind="button">
      Published default
    </SButton>
    <SButton id="packed-registered-builtin" color="secondary">
      Registered built-in recipe
    </SButton>
    <SButton id="packed-runtime-builtin" color="primary">
      Runtime built-in override
    </SButton>
    <STheme as="section" v-bind="theme" :tokens="{ light: { published: { fill: '#56789a' } } }">
      <SButton id="packed-scoped" :color="role">
        Published scoped
      </SButton>
    </STheme>
    <STable :data="[{ id: 'published-row' }]" :columns="[column]" :get-row-id="row => row.id" />
  </SApp>
</template>
