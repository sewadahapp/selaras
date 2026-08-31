<script setup lang="ts">
import type { AvatarImageProps } from 'reka-ui'
import type { VariantProps } from 'tailwind-variants'
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
import { computed, inject } from 'vue'
import { useIcons } from '../composables/use-icons'
import { avatarTheme } from '../theme/avatar'
import { AVATAR_SIZE_INJECTION_KEY } from '../utils/injection-keys'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

type AvatarVariants = VariantProps<typeof avatarTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  /** A tag name ('a', 'span', ...) or a component reference - forwarded to the avatar's root element, so an avatar can be a link or whatever the consumer needs. */
  as?: string | Component
  /** The avatar image's URL. When absent (or while it loads), the fallback content shows instead. */
  src?: string
  /** The image's alt text. Also used as the avatar's accessible name when there's no image at all. */
  alt?: string
  /** Short text (usually the person's initials) shown while (or instead of) an image. */
  text?: string
  /** An icon shown in the fallback, in place of `text`. If neither is given, the default semantic `user` icon shows. */
  icon?: string
  color?: AvatarVariants['color']
  /** The presence/status dot's own color - independent of `color`, since presence semantics rarely match the avatar's identity color. */
  statusColor?: AvatarVariants['statusColor']
  size?: AvatarVariants['size']
  shape?: AvatarVariants['shape']
  /** Shows a small solid-colored presence dot at the avatar's bottom-right corner. */
  status?: boolean
  referrerPolicy?: AvatarImageProps['referrerPolicy']
  crossOrigin?: AvatarImageProps['crossOrigin']
  ui?: UiProp<AvatarSlots>
}>()

const icons = useIcons()
const theme = useComponentTheme('avatar', avatarTheme)
const groupSize = inject(AVATAR_SIZE_INJECTION_KEY, undefined)

const ui = computed(() => theme.value({
  color: props.color,
  statusColor: props.statusColor,
  size: props.size ?? groupSize?.value,
  shape: props.shape,
}))

const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)

// With no image the root needs an accessible name from somewhere - `alt`
// when given, falling back to `text`. Consumers can always override with a
// fallthrough aria-label (e.g. for a bare default icon that has no text).
const rootAriaLabel = computed(() => props.src ? undefined : (props.alt ?? props.text) || undefined)
</script>

<template>
  <AvatarRoot :as="as" :aria-label="rootAriaLabel" v-bind="rootProps">
    <span v-bind="resolveSlot(ui.content, props.ui?.content)">
      <AvatarImage
        v-if="src"
        :src="src"
        :alt="alt"
        :referrer-policy="referrerPolicy"
        :crossorigin="crossOrigin"
        v-bind="resolveSlot(ui.image, props.ui?.image)"
      />
      <AvatarFallback>
        <slot name="fallback">
          <span v-if="text" v-bind="resolveSlot(ui.fallback, props.ui?.fallback)">{{ text }}</span>
          <slot v-else name="icon" :class="resolveSlot(ui.icon, props.ui?.icon).class">
            <Icon :name="icon || icons.user" v-bind="resolveSlot(ui.icon, props.ui?.icon)" />
          </slot>
        </slot>
      </AvatarFallback>
    </span>
    <span v-if="status" v-bind="resolveSlot(ui.status, props.ui?.status)" />
  </AvatarRoot>
</template>
