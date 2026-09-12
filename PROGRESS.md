# Selaras 1.0 progress

This file tracks the implementation state against the Phase 0 audit and the proposed migration plan. It is a working record, not a replacement for the RFCs in `.notes/`. Update it when a milestone changes state or its exit criteria are revised.

Last updated: 2026-09-12

## Current position

We are in **Phase 4, the theme vertical slice**, with Phases 0 and 1 complete and the shared boundary work from Phase 3 substantially complete. The slice currently covers build-time semantic role registration, generated role CSS/types, namespaced runtime configuration, and Button/Badge/RadioGroup. It is still experimental: the public role API and generated CSS names are not frozen.

## Phase status

| Phase | Status | Evidence and remaining work |
| --- | --- | --- |
| 0. Audit and decisions | **Complete** | Architecture audit, RFC, component API convention, decision register, and ordered migration plan live in `.notes/`. |
| 1. Token/Theme RFC | **Complete** | RFC 001 defines role semantics, DTCG boundary, CSS/Tailwind strategy, Nuxt ownership, scoped themes, portals, and compatibility policy. |
| 2. Contract fixtures | **In progress** | Nuxt component tests and prefix/SSR fixtures exist. Still needed: packed-consumer type/export checks, two disjoint app registries, native form browser checks, scoped/portal computed-style checks, and explicit failure fixtures. |
| 3. Shared boundary defects | **Substantially complete** | Button/Input native contracts, FormField descriptions, and controlled overlay ownership are fixed and committed. Remaining audit items need a final contract-fixture pass, especially per-app providers and broader form/selection behavior. |
| 4. Theme vertical slice | **In progress** | Color registry normalization, Nuxt CSS/type generation, `selaras` app config, runtime light/dark color overrides, and three prototype components are implemented. Missing: scoped `STheme` token transport, portalled-root transport, prefix-packed premium verification, unknown runtime-role fallback policy, and public API review. |
| 5. DTCG source and adapter | **Not started** | Add the supported DTCG subset and deterministic adapter only after the resolved semantic contract is proven. |
| 6. Remaining recipe migration | **Not started** | Migrate other color-capable recipes, complete public registry exports, and remove superseded configuration in one documented breaking release. |
| 7. Control contracts | **Partial** | Controlled/uncontrolled open state is standardized for the current overlays. Select/Autocomplete identity, creatable behavior, submission/reset, and adaptive presentation remain. |
| 8. Browser and production hardening | **Not started** | SSR/hydration, keyboard, RTL, forced colors, reduced motion, nested overlays, dependency ranges, CSS size, and Table typing need dedicated gates. |
| 9. Documentation and 1.0 freeze | **Not started** | Build docs from demonstrated contracts, pressure-test dashboard/CRUD composition, publish migration guidance, and freeze the 1.0 API. |

## Completed implementation slices

- `ce60894` — native Button type and Input fallthrough contracts.
- `140b85a` — FormField IDs, descriptions, hints, errors, and `aria-describedby`.
- `8b0efb6`, `bf4bdb9` — controlled versus uncontrolled overlay open state.
- `c641f8d` — framework-independent color registry and recipe normalization.
- `fefcd1a` — custom role prototype for Button, Badge, and RadioGroup.
- `41559ed`, `75d26bb` — deterministic role CSS and Nuxt-generated role CSS output.
- `c06feae` — private selected-role variable consumption.
- `cafc188` — Nuxt-generated role type augmentation.
- `ab2aabc` — typed `selaras.defaults` and `selaras.ui` runtime namespace.
- `7536ee4` — SSR-safe runtime light/dark color override style layer.

## Known temporary decisions

- Custom roles currently reuse the static `primary` Tailwind Variants recipe. This is deliberate: Tailwind classes are not generated from runtime strings.
- The component bridge still maps `--ui-*` variables to private selected-role variables. It is a compatibility seam while more recipes migrate.
- `ColorRole` is generated from a global augmentation during Nuxt preparation. The repository test fixture supplies `premium` locally because root type checking runs outside the prepared fixture.
- Runtime token overrides validate declaration delimiters, but complete token value validation and override provenance are still outstanding.
- `.notes/` remains ignored and stores durable design/audit material. The pre-existing `.gitignore` edit and untracked `shell.nix` are intentionally not part of the implementation commits.

## Next ordered work

1. Add prepared-consumer tests for `app.config.selaras.tokens`, generated CSS inclusion, generated role types, and typo rejection; repeat with the prefix fixture.
2. Define and implement scoped token transport for `STheme`, including nested role isolation and explicit portal transport. Do not rely on inherited private variables across portalled roots.
3. Decide the unknown runtime-role behavior and test it: development diagnostic plus production fallback must never leave unresolved CSS variables.
4. Add a second role and a CSS-variable-backed role to the packed fixture, then measure generated CSS and SSR/hydration output.
5. Freeze the vertical-slice contract and begin the supported DTCG source/adapter milestone.

## Validation baseline

The last recorded broad baseline was 912 tests across the existing suite plus SSR/prefix checks. Current incremental validation includes focused component/registry tests, ESLint, TypeScript checks, and a real `nuxt prepare` that emits both light and dark premium role CSS and role declarations. Re-run the broad suite after the next scoped/portal change; do not treat the historical baseline as proof for new theme behavior.
