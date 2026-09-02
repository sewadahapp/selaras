<script setup lang="ts">
import { ConfigProvider, ToastProvider, TooltipProvider } from 'reka-ui'
import { useHead } from '#imports'
import DrawerRenderer from './DrawerRenderer.vue'
import ModalRenderer from './ModalRenderer.vue'
import SlideoverRenderer from './SlideoverRenderer.vue'

export interface AppProps {
  /**
   * Reading direction for the whole app. Does two distinct things at once,
   * both needed for real RTL support: passed to Reka UI's ConfigProvider,
   * which every primitive underneath inherits for its own internal
   * direction-aware logic (e.g. RadioGroup/Tabs' roving-tabindex arrow-key
   * handling, floating-ui positioning) - and set as the real `dir`
   * attribute on `<html>` via useHead, since ConfigProvider itself renders
   * no DOM element at all (confirmed: it, ToastProvider, and
   * TooltipProvider are all bare `<slot />` passthrough - there's no
   * element inside SApp to attach a `dir` attribute to even if we wanted
   * one there instead). The `<html>` attribute is what actually drives
   * native browser behavior (text direction, scrollbar side) and any CSS
   * logical-property utility (`ms-*`/`ps-*`/`text-start`/...) - those
   * resolve against the nearest `dir` in the DOM, not Reka's own Vue-level
   * context, so ConfigProvider alone doesn't make anything look RTL.
   */
  dir?: 'ltr' | 'rtl'
}

const props = withDefaults(defineProps<AppProps>(), {
  dir: 'ltr',
})

useHead({ htmlAttrs: { dir: () => props.dir } })
</script>

<template>
  <ConfigProvider :dir="dir">
    <ToastProvider>
      <TooltipProvider>
        <slot />
      </TooltipProvider>
    </ToastProvider>
    <ModalRenderer />
    <SlideoverRenderer />
    <DrawerRenderer />
  </ConfigProvider>
</template>
