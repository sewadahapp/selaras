import type { ComputedRef, InjectionKey } from 'vue'

export const AVATAR_SIZE_INJECTION_KEY: InjectionKey<ComputedRef<'sm' | 'md' | 'lg' | undefined>> = Symbol('selaras-avatar-size')
