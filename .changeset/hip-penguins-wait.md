---
"@agency-kit/notion-cms": minor
---

New: Add ability to leverage custom Notion block renderers using a core plugin.
Fix: Import now capable of parsing non-flatted (which is used for caching) format files.
Fix: Proper error handling and fallback to using fresh Notion API call when cache fails.
Upd: Improve test coverage to 95+, remove unused code.
Upd: Expose tree walking filter as static utility class for use in plugins.