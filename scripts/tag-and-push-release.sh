#!/usr/bin/env bash
set -euo pipefail

# Only ever run *after* `npm publish` has already succeeded (see the
# "release" script in package.json, and the release workflow) - commits the
# version bump `changelogen --bump` already wrote to package.json/
# CHANGELOG.md, tags it, and pushes both. Publishing first means a failed
# publish never leaves a pushed commit/tag behind with nothing to undo them.
version=$(node -p "require('./package.json').version")

git add CHANGELOG.md package.json
git commit -m "chore(release): v$version"
git tag -am "v$version" "v$version"
git push --follow-tags
