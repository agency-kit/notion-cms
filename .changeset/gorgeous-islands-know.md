---
"@agency-kit/notion-cms": minor
---

New: Support Notion Link-to-page blocks including with custom renderers.

New: Support multiple instances of NotionCMS in a project. Before this was limited because they would share a cache which would break things. Fixed by using unique identifiers (last 4 digits of the Notion database id) in the cache name.

New: Add `_createCMSWalker` static utility class for quickly creating tree walker (walkjs) functions with the appropriate settings for when developing plugins that utilize the `post-tree` hook.

Upd: Add more API and page stats in CMS metadata and update `duration` to `durationSeconds` for clarity.

Fix: Make sure that the page content filter accounts for the `post-tree` case where the parent exists.

