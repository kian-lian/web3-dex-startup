#!/usr/bin/env bash
# Stop hook: run Biome check & format after Claude finishes responding.
# If stop_hook_active is true (Claude is already fixing hook feedback), skip to prevent loops.

set -euo pipefail

INPUT=$(cat)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('stop_hook_active', False))" 2>/dev/null || echo "False")

if [ "$STOP_HOOK_ACTIVE" = "True" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Run Biome check with auto-fix (format + lint)
OUTPUT=$(npx @biomejs/biome check --write . 2>&1) || {
  echo "$OUTPUT" >&2
  exit 2
}

exit 0
