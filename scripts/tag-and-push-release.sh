#!/usr/bin/env bash
set -euo pipefail

# Only ever run *after* `npm publish` has already succeeded (see the
# "release:*" scripts in package.json, and the release workflow) - commits
# the version bump(s), tags them, and pushes. Publishing first means a failed
# publish never leaves a pushed commit/tag behind with nothing to undo them.
#
# Usage: bash scripts/tag-and-push-release.sh <selaras|selaras-docs|selaras-mcp> [...]
#
# The packages are independent release streams, so each gets its own tag:
# `selaras-v0.3.0` for @sewadah/selaras, `selaras-docs-v0.1.1` for
# @sewadah/selaras-docs, and `selaras-mcp-v0.1.0` for @sewadah/selaras-mcp.
# Core releases additionally keep the legacy `v0.3.0`
# tag pointing at the same commit - changelogen resolves its bump base from
# `v*` tags, so dropping it would silently change what `--bump` infers.
#
# Stage only the requested packages' manifests and changed changelogs.

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <selaras|selaras-docs|selaras-mcp> [...]" >&2
  exit 1
fi

stage=()
changelogs=()
tags=()
message="chore(release):"

for package in "$@"; do
  case "$package" in
    selaras)
      version=$(node -p "require('./package.json').version")
      stage+=(package.json)
      changelogs+=(CHANGELOG.md)
      # Legacy tag first so `git push --follow-tags` pushes both together.
      tags+=("v$version" "selaras-v$version")
      message="$message selaras v$version"
      ;;
    selaras-docs)
      version=$(node -p "require('./packages/docs/package.json').version")
      stage+=(packages/docs/package.json)
      changelogs+=(packages/docs/CHANGELOG.md)
      tags+=("selaras-docs-v$version")
      message="$message selaras-docs v$version"
      ;;
    selaras-mcp)
      version=$(node -p "require('./packages/mcp/package.json').version")
      stage+=(packages/mcp/package.json)
      changelogs+=(packages/mcp/CHANGELOG.md)
      tags+=("selaras-mcp-v$version")
      message="$message selaras-mcp v$version"
      ;;
    *)
      echo "Unknown package $package, expected selaras, selaras-docs or selaras-mcp" >&2
      exit 1
      ;;
  esac
done

for changelog in "${changelogs[@]}"; do
  # A package's first bump creates its changelog, which git diff won't see.
  if [ -f "$changelog" ] && { ! git ls-files --error-unmatch "$changelog" >/dev/null 2>&1 || ! git diff --quiet -- "$changelog"; }; then
    stage+=("$changelog")
  fi
done

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
