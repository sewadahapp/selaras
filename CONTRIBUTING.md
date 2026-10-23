# Contributing to Selaras

Thank you for helping improve Selaras. Use the commands below to run the documentation,
validate changes, and test package consumers.

Install Bun before running the workspace scripts.

## Local development and releases

```bash
# Install dependencies
npm install

# Generate type stubs and prepare the docs site
npm run docs:prepare

# Develop with the Selaras documentation site in /docs
npm run dev

# Develop the standalone documentation template preview
npm run docs:dev

# Generate the static docs site
npm run docs:generate

# Run the complete pre-commit checks (requires Bun)
npm run check

# Type-check
npm run test:types

# Run ESLint
npm run lint

# Run accessibility and keyboard checks (install Chromium once)
npm run test:browser:install
npm run test:a11y

# Run Vitest
npm run test
npm run test:watch

# Build and test source consumers plus an isolated installed tarball
# Requires Bun for the temporary consumer's dependency installation
npm run test:compat

# Test isolated consumers on Nuxt 4 with v5 defaults, or Nuxt 5 nightly
npm run test:nuxt-compat -- future
npm run test:nuxt-compat -- nightly

# Optionally test only the core package or docs layer
npm run test:nuxt-compat -- future core
npm run test:nuxt-compat -- nightly docs

# Preview CI's automatic release plan without changing files or publishing
npm run release:plan

# Local manual release commands (use the GitHub workflow for automatic selection)
npm run release
npm run release:selaras-and-docs
npm run release:all

# Release one package independently
npm run release:selaras
npm run release:docs
npm run release:mcp

# Each package has its own version stream, so one run can bump them at
# different levels - Selaras major alongside a docs patch, for example.
# The release workflow exposes per-package bump/version inputs for this.
# Locally, drive each package through its own env:
RELEASE_BUMP=major npm run release:selaras
RELEASE_BUMP=patch npm run release:docs
RELEASE_BUMP=patch npm run release:mcp
```

### Automatic releases in GitHub Actions

Run the **release** workflow on the default branch and leave package selection
and bump inputs at `auto`. It computes a plan from each package's current
release tag, lists proposed versions and relevant commits in the run summary,
and saves the JSON plan as an artifact. Validation, candidate files, npm
publication, tags, and GitHub release notes all use that same plan. A run with
no affected packages skips npm and rebuilds/deploys the documentation website.
The workflow does not publish automatically when a PR merges.

Ownership rules live in `scripts/plan-release.mjs`:

| Changed input | Release impact |
| --- | --- |
| `src/`, bundled `skills/`, core build configuration/generators | Selaras |
| Guides in `docs/content/` (except `index.md`), Vue examples in `docs/components/content/examples/`, or their Markdown expander | Selaras, because these feed its published offline agent catalog |
| `packages/docs/`, excluding its preview and changelog | Docs layer |
| `packages/mcp/`, excluding its changelog | MCP server |
| Published manifest fields, runtime dependencies, or their resolved lockfile graph | The affected package(s) |
| Core build tool versions (`@nuxt/module-builder`, `@nuxt/schema`, TypeScript, vue-tsc, YAML) | Selaras |
| Website layout/pages, template previews, tests, CI, and unrelated dev tooling | No npm release |

Published README/license changes are patch changes. Catalog-only updates also
produce a patch, even when their commit describes a new documentation feature.
For runtime changes, relevant `feat` commits propose minor releases, breaking
headers (`!`) or `BREAKING CHANGE`/`BREAKING-CHANGE` footers propose major releases,
and other changes propose patches. Before 1.0, features propose patches and
breaking changes propose minors, retaining the existing core versioning policy.
Package versions stay independent; a core release alone does not bump docs or MCP.
Lockfile comparison conservatively includes nested resolutions of dependencies
used by the package, while unrelated development-only updates do not trigger it.

Use the **release rehearsal** workflow first to compute and validate the same
candidate in a disposable checkout. It has read-only repository permission and
cannot publish, tag, push, or deploy. Bump/exact-version fields are optional in
both workflows. In `auto` mode an explicit override also selects that package;
with an explicit package selection, overrides for excluded packages are rejected.
Manual package choices remain available for intentional maintenance releases.
Exact versions must advance the current version. Review breaking-change impact;
commit messages cannot establish API compatibility by themselves.

The planner requires full history and reachable tags for each current version;
it stops rather than guessing when release records are missing. Unknown paths
outside the documented repository areas also stop automatic planning: add an
ownership rule and regression coverage, or explicitly select packages after
review. Update the rules when a build gains another input or shared tool.
Changes to release versions/changelogs do not themselves create another release,
and fully reverted file changes are excluded. Existing local release commands
remain manual; `release:both` aliases `release:selaras-and-docs`.

Release runs are serialized without canceling an active publication. They use
the latest default-branch checkout and abort before publishing if the branch
advanced during validation. If this happens, run again to compute a fresh plan.

The release workflow publishes selected packages before committing versions
and creating tags. If a later publish fails, earlier packages may already be
on npm even though their GitHub releases are missing. The publish steps pack
the built candidate and compare it with any existing version. If compressed
integrities differ, the downloaded archive's integrity is verified before
comparing the exact uncompressed tar bytes. This permits compression changes
between Node builds while retaining every file and its metadata in the comparison.
An identical artifact is reused on retry; different contents under the same
version stop the workflow. Registry and authorization errors remain fatal.
This lets a retry finish the remaining packages and then create the release
records without republishing packages that already succeeded. Rerunning an
older workflow still uses that workflow's original definition, so failures
from before this check need their published version records recovered first.

Nuxt compatibility runs build the publishable packages with the stable
workspace toolchain, then install them in isolated consumers using the
selected framework. The `future` lane uses current Nuxt 4 with
`future.compatibilityVersion: 5`; `nightly` uses `nuxt-nightly@5x`.
Each run records the resolved framework version and uses its Vue requirement.
Core and default/prefixed docs consumers exercise builds, generated types,
SSR, themes, CSS budgets, and browser interactions. Install Chromium once
with `npm run test:browser:install` before running these commands locally.
`SELARAS_PACKED_BROWSER_EXECUTABLE_PATH` optionally selects a local Chromium.

The Nuxt compatibility workflow runs on pushes, pull requests, manual
dispatch, and weekly. Both core and docs future-mode jobs fail the workflow
on regressions; the nightly jobs are informational while Nuxt 5 is unreleased.
The docs layer enables server auto-imports for Nuxt Content 3 and supplies
its global client `$fetch` when the framework does not provide one. These
compatibility settings ship with the layer and are tested in installed
consumers, rather than being added only to the test fixtures. The checks do
not expand the published Nuxt peer range or upgrade the documentation website.

Dependency installation enables Git hooks in a local development checkout.
Before each commit, the hooks run ESLint, docs preparation, root and docs
type checks, and the full Vitest suite against the working tree. They also
require Conventional Commit messages, such as `fix(select): preserve selection`
or `feat(toolbar): add controls`. CI validates the committed code and commit
messages too. CI and production installs skip local hook installation.

## Public documentation coverage

Each public component must have a guide. Companion components can share their
parent's guide: declare their canonical names in that Markdown file's frontmatter,
for example `components: [SColumn, SColumnGroup]` in the Table guide. The agent
catalog builder combines these with the component inferred from the guide name.
It checks the package's public export boundary, including TypeScript components,
and rejects missing guides, unknown/private names, or ambiguous ownership.

`bun run agent:build` checks this inventory; `bun run test:agent` also exercises
discovery and shared-guide lookup through the packed MCP server. Keep names in
this metadata even when their API tables share a page. Internal recursive helpers
and renderer lifecycle components remain excluded. Website content, Markdown
exports, and the offline catalog use the same examples and guide text.

See the [public API documentation audit](./docs/reviews/public-api-audit.md) for
the reviewed coverage and corrected examples.

## Accessibility checks

`npm run test:a11y` builds a dedicated consumer and runs axe checks plus keyboard
scenarios for forms, validation, navigation, empty states, nested dialogs, and
adaptive selection. The CI accessibility job runs this suite in Chromium. New
interactive components should also have focused keyboard tests for their behavior.

See the [v1.1 quality review](./docs/reviews/v1.1-quality.md) for the current audit scope and loading measurements.

## Documentation deployment

The public changelog reads `CHANGELOG.md`, `packages/docs/CHANGELOG.md`, and
`packages/mcp/CHANGELOG.md` at build time. Edit or generate release notes in
those files; do not maintain a second copy in the documentation. The core,
docs layer, and MCP server retain their independent version streams at
`/changelog`, `/changelog/docs`, and `/changelog/mcp`.

`npm run docs:generate` refreshes optional publication dates from public GitHub
release metadata into the ignored `docs/.cache/release-dates.json` file before
building. If GitHub is unavailable, cached dates are retained and undated notes
still render. No publication date is inferred from a commit timestamp. The
release workflow already generates and deploys docs after updating changelogs;
a docs-only deployment also rebuilds this page from the current source.

For the documentation deployment, see [Markdown negotiation on Cloudflare](./deployment/cloudflare-markdown.md).
See [deployment cache revalidation](./deployment/cloudflare-revalidation.md) for browser cache headers and recovery when an open tab outlives a build.
