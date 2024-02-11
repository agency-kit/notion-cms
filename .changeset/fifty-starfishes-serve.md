---
"@agency-kit/notion-cms": patch
---

Fix: Keep terminal logging mechanism from swallowing important error messages.

Fix: Throw an error when `rootAlias` is non-existant in Notion database.

Fix: Show warning when there are multiple pages at the root level AND a `rootAlias` is set (you probably don't want that).

Fix: Keep from failing when in quiet mode.

Upd: Improve bundle size a tiny amount by switching terminal colors to picocolors.
