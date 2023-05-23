---
"@agency-kit/notion-cms": minor
---

New: support markdown and plaintext in content object.
New: add support for unlimited database pages and unlimited blocks per page.
New: add support for human readable strings in cache timeout option.
New: add run duration stats.
Fix: use Marked options instead of `used` for extensions as they bleed to all instances of Marked (uses a singleton under the hood).
Fix: update mis-typed Notion Block Object Responses.
Fix: proper access kitchen sink test object to fix render test.
Fix: ensure route array is populated.
