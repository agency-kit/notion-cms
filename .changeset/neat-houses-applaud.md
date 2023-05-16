---
"@agency-kit/notion-cms": patch
---

Fix: Address deeply nested rendering bugs by pulling in the Notion-Blocks-HTML-parser (Thanks @notion-stuff) and reworking some of the internals.
Fix: Remove deprecated `headerIds` option in `marked` and instead use the header-id extension.
