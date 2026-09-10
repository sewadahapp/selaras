// Public entry point for this library's directives (exported at
// package.json's ./directives subpath) - a consumer building their own
// component imports from here (`import { vRipple } from '@sewadah/selaras/directives'`),
// not from an individual file path. Adding a new directive (v-mask, planned
// for input/date-picker-style components) just needs a line here, no
// package.json change - the subpath export already points at this whole
// barrel, not any one directive by name.
export * from './ripple'
