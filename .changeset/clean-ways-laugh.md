---
"@agency-kit/notion-cms": minor
---

Fix: ensure that tree walkers only operate on page content nodes. 
Upd: Remove ancestor nodes from public API.
Upd: Add support for starting a walk/async walk from a partial path.
New: Add helper method to capture only page data and remove that pages children. Useful for sending individual page data to client without sending its sub tree.
