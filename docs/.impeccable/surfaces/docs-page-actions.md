# Documentation page actions

Mode: Read. Extend the documentation shell without changing its identity.

The user requested a better position and treatment for Edit this page, then agreed to include Report an issue. Keep both as secondary icon-and-text links below a light divider after the desktop table of contents. On mobile, and on pages without a visible desktop aside, place the actions after the article and before Previous/Next. Avoid duplicated visible actions or empty separators.

Implement the group in the reusable documentation layer and use it from the own-site page override. Preserve repository settings, the existing DocsEditLink override point, and page-level hiding. Allow issue reporting to be disabled or directed to a separate tracker. Generated new-issue drafts include the page context; neither action submits anything. Preserve all themes, visible keyboard focus, responsive widths and base-URL behavior.

Verify real desktop and mobile layouts, themed states, configuration, frontmatter suppression, pages without a TOC and installed-tarball consumers. No new artwork, identity, typography or design tokens are needed.

Implemented: `DocsPageActions` renders Edit this page and Report an issue below the desktop table of contents, or after the article and before Previous/Next on mobile and pages without a TOC. A subtle top divider, 16px icons, 13px text and minimum 32px link heights use the existing resolved tokens. The reusable layer and own-site override share this placement; `DocsPageActions` and the existing `DocsEditLink` remain component override points.

GitHub and GitLab issue destinations are inferred from the repository URL. Generated drafts include the page title and route; custom `repository.issueUrl` values are used unchanged. `repository.issueLinks: false` disables issue reporting site-wide and page frontmatter `issueLink: false` hides it locally; existing edit-link flags remain supported. The own-site repository branch is corrected from `main` to `master`. No artwork, identity or design tokens were added.

Visual review complete: the independent reviewer returned SHIP with no material visual issues after reviewing 12 captures in `docs/.impeccable/review/docs-page-actions/`, covering Pelog, Slendro and Degung in light/dark modes at 1440 and 390px. Browser verification confirmed one visible action group, contextual issue URLs, visible keyboard focus, hover feedback, no overflow and no page errors. Six repository-URL unit tests, lint, library type checks and documentation type checks passed.

Installed-tarball validation passed for the prefixed default consumer, prefixed component-override consumer and minimal unprefixed consumer, including their production builds, generated types and browser checks. The configured consumer exercises article/aside placement, issue draft context, no-TOC fallback and per-page suppression. The unconfigured consumer has no empty action group. The custom-collection fixture gives shell visibility flags the same enabled defaults as the layer schema. The local development stubs were restored afterward; local test CPU limits remain uncommitted.
