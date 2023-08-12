---
"@agency-kit/notion-cms": minor
---

New: optimized content fetching only when content changes. This lets us achieve fastest possible builds 🚄. This comes with an `autoUpdate` flag for turning it off, but you probably shouldn't.

New: added an every hook *, recommended for testing only.

New: added `purgeCache` function that clears the local cache.

Fix: fixed a bug in linker plugin where non-uuids would get picked up.

Fix: fixed bug in terminal spinner that was causing ctrl-c not to close the terminal in some cases.

Fix: fixed typo bug where `rootUrl` was being set to a bogus string.
