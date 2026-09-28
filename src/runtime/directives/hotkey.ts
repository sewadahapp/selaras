import type { Directive } from 'vue'

export interface HotkeyOptions<T extends HTMLElement = HTMLElement> {
  /** A key chord such as `mod+k`, `ctrl+shift+p`, or `escape`. */
  keys: string
  /** Runs instead of clicking the bound element. */
  handler?: (event: KeyboardEvent) => void
  /** Gate activation on current application state. */
  when?: boolean | ((element: T, event: KeyboardEvent) => boolean)
  /** Allow shortcuts while focus is in an editable control. Defaults to false. */
  allowInEditable?: boolean
}

export type HotkeyValue<T extends HTMLElement = HTMLElement> = string | HotkeyOptions<T> | false | null | undefined

interface ParsedHotkey {
  key: string
  ctrl: boolean
  meta: boolean
  alt: boolean
  shift: boolean
  focusScoped: boolean
}

const aliases: Record<string, string> = {
  esc: 'escape',
  return: 'enter',
  spacebar: ' ',
  space: ' ',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  del: 'delete',
  ctrl: 'control',
  cmd: 'meta',
  command: 'meta',
  option: 'alt',
}

function isMacPlatform() {
  if (typeof navigator === 'undefined')
    return false
  const platform = navigator.platform ?? ''
  return /mac|iphone|ipad|ipod/i.test(platform)
}

function canonicalKey(key: string) {
  const normalized = key.trim().toLowerCase()
  return aliases[normalized] ?? normalized
}

function parseHotkey(keys: string): ParsedHotkey | undefined {
  const parts = keys.split('+').map(canonicalKey).filter(Boolean)
  const key = parts.find(part => !['control', 'meta', 'alt', 'shift', 'mod'].includes(part))
  if (!key)
    return undefined

  const hasMod = parts.includes('mod')
  const mac = isMacPlatform()
  return {
    key,
    ctrl: parts.includes('control') || (hasMod && !mac),
    meta: parts.includes('meta') || (hasMod && mac),
    alt: parts.includes('alt'),
    shift: parts.includes('shift'),
    focusScoped: key.length === 1 && !parts.some(part => ['control', 'meta', 'alt', 'shift', 'mod'].includes(part)),
  }
}

function isEditable(target: EventTarget | null) {
  if (!(target instanceof Element))
    return false
  return Boolean(target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'))
}

// The physical letter or digit behind a key, for when Option/Alt changes the
// character it types (Option+P types "π" on a Mac).
function physicalKey(code: string) {
  return /^Key([A-Z])$/.exec(code)?.[1]?.toLowerCase() ?? /^Digit(\d)$/.exec(code)?.[1]
}

function matches(event: KeyboardEvent, hotkey: ParsedHotkey) {
  const keyMatches = canonicalKey(event.key) === hotkey.key
    || (event.altKey && physicalKey(event.code) === hotkey.key)
  // Symbols such as "?" need Shift to type, so the character already says
  // whether Shift was held; only compare Shift for letters, digits and names.
  const symbol = hotkey.key.length === 1 && hotkey.key !== ' ' && !/[a-z0-9]/.test(hotkey.key)
  return keyMatches
    && event.ctrlKey === hotkey.ctrl
    && event.metaKey === hotkey.meta
    && event.altKey === hotkey.alt
    && (symbol && !hotkey.shift ? true : event.shiftKey === hotkey.shift)
}

function normalizeBinding<T extends HTMLElement>(value: HotkeyValue<T>) {
  if (value === false || value == null)
    return undefined
  return typeof value === 'string' ? { keys: value } : value
}

function install<T extends HTMLElement>(element: T, value: HotkeyValue<T>) {
  const options = normalizeBinding(value)
  const parsed = options && parseHotkey(options.keys)
  if (!options || !parsed)
    return undefined

  const listener = (event: KeyboardEvent) => {
    // Something already handled this key press, e.g. another binding for the same chord.
    if (event.defaultPrevented || !matches(event, parsed))
      return
    if (typeof options.when === 'boolean' && !options.when)
      return
    if (typeof options.when === 'function' && !options.when(element, event))
      return
    const activeElement = element.ownerDocument.activeElement
    const eventTarget = event.target
    if (parsed.focusScoped
      && !element.contains(activeElement)
      && !(eventTarget && (eventTarget === element || element.contains(eventTarget as Node)))) {
      return
    }
    if (!options.allowInEditable && isEditable(event.target))
      return

    event.preventDefault()
    if (options.handler)
      options.handler(event)
    else
      element.click()
  }

  document.addEventListener('keydown', listener)
  return () => document.removeEventListener('keydown', listener)
}

export const vHotkey: Directive<HTMLElement, HotkeyValue> = {
  mounted(element, binding) {
    const cleanup = install(element, binding.value)
    if (cleanup)
      (element as HTMLElement & { __selarasHotkeyCleanup?: () => void }).__selarasHotkeyCleanup = cleanup
  },
  updated(element, binding) {
    const host = element as HTMLElement & { __selarasHotkeyCleanup?: () => void }
    host.__selarasHotkeyCleanup?.()
    delete host.__selarasHotkeyCleanup
    const cleanup = install(element, binding.value)
    if (cleanup)
      host.__selarasHotkeyCleanup = cleanup
  },
  unmounted(element) {
    const host = element as HTMLElement & { __selarasHotkeyCleanup?: () => void }
    host.__selarasHotkeyCleanup?.()
    delete host.__selarasHotkeyCleanup
  },
}
