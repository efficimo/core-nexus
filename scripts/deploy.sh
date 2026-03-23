#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <patch|minor|major>"
  exit 1
}

[[ $# -ne 1 ]] && usage

INCREMENT="$1"
[[ "$INCREMENT" != "patch" && "$INCREMENT" != "minor" && "$INCREMENT" != "major" ]] && usage

LAST_TAG=$(git tag -l 'v*' --sort=-v:refname | head -n1)

if [[ -z "$LAST_TAG" ]]; then
  MAJOR=0 MINOR=0 PATCH=0
else
  VERSION="${LAST_TAG#v}"
  IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"
fi

case "$INCREMENT" in
  patch) PATCH=$((PATCH + 1)) ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
esac

NEW_TAG="v${MAJOR}.${MINOR}.${PATCH}"

echo "Last tag: ${LAST_TAG:-none}"
echo "New tag:  $NEW_TAG"
echo ""
read -rp "Deploy $NEW_TAG? [y/N] " CONFIRM
[[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]] && echo "Aborted." && exit 0

git tag -a "$NEW_TAG" -m "Release $NEW_TAG"
git push origin "$NEW_TAG"

echo ""
echo "Tag $NEW_TAG pushed — deployment started."