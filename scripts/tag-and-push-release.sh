#!/usr/bin/env bash
set -euo pipefail

# Only ever run *after* `npm publish` has already succeeded (see the
# "release:*" scripts in package.json, and the release workflow) - commits
# the version bump(s), tags them, and pushes. Publishing first means a failed
# publish never leaves a pushed commit/tag behind with nothing to undo them.
#
# Usage: bash scripts/tag-and-push-release.sh <selaras|selaras-docs> [...]
#
# The two packages are independent release streams, so each gets its own tag:
# `selaras-v0.3.0` for @sewadah/selaras and `selaras-docs-v0.1.1` for
# @sewadah/selaras-docs. Core releases additionally keep the legacy `v0.3.0`
# tag pointing at the same commit - changelogen resolves its bump base from
# `v*` tags, so dropping it would silently change what `--bump` infers.
#
# Only the requested packages' manifests (plus CHANGELOG.md when it changed,
# which only core bumps via changelogen ever touch) are staged - a docs-only
# release never rewrites the core version, and vice versa.

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <selaras|selaras-docs> [...]" >&2
  exit 1
fi

stage=()
tags=()
message="chore(release):"

for package in "$@"; do
  case "$package" in
    selaras)
      version=$(node -p "require('./package.json').version")
      stage+=(package.json)
      # Legacy tag first so `git push --follow-tags` pushes both together.
      tags+=("v$version" "selaras-v$version")
      message="$message selaras v$version"
      ;;
    selaras-docs)
      version=$(node -p "require('./packages/docs/package.json').version")
      stage+=(packages/docs/package.json)
      tags+=("selaras-docs-v$version")
      message="$message selaras-docs v$version"
      ;;
    *)
      echo "Unknown package $package, expected selaras or selaras-docs" >&2
      exit 1
      ;;
  esac
done

if git diff --quiet -- CHANGELOG.md 2>/dev/null; then
  : # unchanged - only staged when a core bump rewrote it
else
  stage+=(CHANGELOG.md)
fi

git add "${stage[@]}"

if git diff --cached --quiet; then
  echo "Nothing to commit - working tree already matches the release"
else
  git commit -m "$message"
fi

for tag in "${tags[@]}"; do
  git tag -am "$message" "$tag"
done

git push --follow-tags
