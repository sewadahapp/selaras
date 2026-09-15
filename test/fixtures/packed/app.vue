<script setup lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, ColorRole, ThemeConfiguration, ThemeProps } from '@sewadah/selaras/types'
import { createTableColumnHelper } from '@sewadah/selaras/table'

const role: ColorRole = 'published'
const seededRole: ColorRole = 'seeded'
const narrow = useIsMobile()
const { add: addPublishedToast } = useToast()
const hyphenatedRole: ColorRole = 'published-accent'
const button: ButtonProps = { color: role }
const navigationItems = [{ label: 'Published navigation', to: '/', active: true }]
const breadcrumbItems = [{ label: 'Home', to: '/' }, { label: 'Published current' }]
const accordionItems = [{ value: 'published', label: 'Published accordion' }]
const tabItems = [{ value: 'published', label: 'Published tab' }]
const stepperItems = [{ title: 'Published step' }]
const theme: ThemeProps = { defaults: { button: { size: 'sm' } } }
const registeredDefaults = {
  defaults: {
    avatar: { color: role },
    badge: { color: role },
    button: { color: hyphenatedRole },
    chip: { color: role },
    input: { color: role },
  },
} satisfies ThemeConfiguration
const invalidDefaults: ThemeConfiguration = {
  // @ts-expect-error imported configuration must reject unregistered roles
  defaults: { button: { color: 'not-published' } },
}
const invalidConditions: ThemeConfiguration = {
  // @ts-expect-error imported compound conditions must reject unregistered roles
  ui: { button: { compoundVariants: [{ color: 'not-published', class: { base: 'font-bold' } }] } },
}
void registeredDefaults
void invalidDefaults
void invalidConditions
const helper = createTableColumnHelper<{ id: string }>()
const column = helper.accessor('id', { header: 'ID' })
const choices = [{ id: 1, title: 'Published select' }]
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
void hyphenatedRole
</script>

<template>
  <SApp>
    <output id="packed-narrow">{{ narrow }}</output>
    <span id="packed-responsive" class="tw:hidden tw:tablet:block">Wide viewport</span>
    <button id="packed-toast" @click="addPublishedToast({ title: 'Published global toast', color: 'published' })">
      Show published toast
    </button>
    <SToast />
    <SButton id="packed-default" v-bind="button">
      Published default
    </SButton>
    <SButton id="packed-seed" :color="seededRole">
      Seeded role
    </SButton>
    <SButton id="packed-registered-builtin" color="secondary">
      Registered built-in recipe
    </SButton>
    <SButton id="packed-runtime-builtin" color="primary">
      Runtime built-in override
    </SButton>
    <SCard id="packed-card" variant="solid">
      Published card
    </SCard>
    <SCardGroup id="packed-card-group" :cols="3" />
    <SContainer id="packed-container" size="sm">
      Published container
    </SContainer>
    <SHeader id="packed-header">
      Published header
    </SHeader>
    <SPageHeader id="packed-page-header" title="Published page header" />
    <SSkeleton id="packed-skeleton" animation="shimmer" />
    <STheme as="section" v-bind="theme" :tokens="{ light: { colors: { published: { fill: '#56789a' } } } }">
      <SButton id="packed-scoped" :color="role">
        Published scoped
      </SButton>
      <SBadge id="packed-badge" :color="role" variant="soft" label="Published badge" />
      <SInput id="packed-functional-input" model-value="Scoped functional input" readonly />
    </STheme>
    <SBadge id="packed-dot" dot aria-label="Offline" />
    <SAlert title="Published alert" :color="role" variant="outline" />
    <SAvatar text="P" :color="role" />
    <SColorPicker :color="role" />
    <SFileUpload :color="role" />
    <SIcon id="packed-icon" name="hugeicons:star" :color="role" />
    <SNavigationMenu :items="navigationItems" :color="role" />
    <SBreadcrumb id="packed-breadcrumb" :items="breadcrumbItems" :color="role" />
    <SAccordion id="packed-accordion" :items="accordionItems" :color="role" />
    <SCollapsible id="packed-collapsible" :color="role">
      <template #trigger>
        Published collapsible
      </template>
      Published content
    </SCollapsible>
    <SSeparator id="packed-separator" :color="role" />
    <SStepper id="packed-stepper" :items="stepperItems" :color="role" />
    <SPagination id="packed-pagination" :total="20" :items-per-page="10" size="sm" :color="role" :active-color="role" />
    <STable :data="[{ id: 'published-row' }]" :columns="[column]" :get-row-id="row => row.id" />
    <STabs id="packed-tabs" :items="tabItems" default-value="published" :color="role">
      <template #published>
        Published tab content
      </template>
    </STabs>
    <SSelect id="packed-select" :items="choices" value-key="id" label-key="title" :default-value="1" :color="role" aria-label="Published selection" />
    <SSelect id="packed-select-multiple" name="packed-choices" :items="choices" value-key="id" label-key="title" multiple :default-value="[1]" aria-label="Published choices" />
    <SAutocomplete id="packed-autocomplete-forced" name="packed-forced-choice" :items="choices" value-key="id" label-key="title" force-selection :default-value="1" :color="role" aria-label="Published suggestion" />
    <SAutocomplete id="packed-autocomplete-created" name="packed-created-choice" :items="choices" value-key="id" label-key="title" default-value="Created text" aria-label="Published free text" />
  </SApp>
</template>
