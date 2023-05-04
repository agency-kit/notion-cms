# @agency-kit/notion-cms

## 0.5.0

### Minor Changes

- 3d0d5d2: New: Add support for recursive extraction of child blocks from Notion API. Unlocks existing functionality in the Notion markdown parser.

  Upd: Add official Notion debug logs in `debug` mode as well as error handling for API failure cases.

## 0.4.1

### Patch Changes

- 65ab3c1: Add debug, local cache path, and notion client to each plugin exec function

## 0.4.0

### Minor Changes

- 534abe5: New: Add ability to leverage custom Notion block renderers using a core plugin.
  Fix: Import now capable of parsing non-flatted (which is used for caching) format files.
  Fix: Proper error handling and fallback to using fresh Notion API call when cache fails.
  Upd: Improve test coverage to 95+, remove unused code.
  Upd: Expose tree walking filter as static utility class for use in plugins.

### Patch Changes

- 78be33a: If a coverImage property exists, don't overwrite it when we look for the backup cover image.
- 5866586: Add working sourcemaps to the build.

## 0.3.0

### Minor Changes

- 9157243: Fix: ensure that tree walkers only operate on page content nodes.
  Upd: Remove ancestor nodes from public API.
  Upd: Add support for starting a walk/async walk from a partial path.
  New: Add helper method to capture only page data and remove that pages children. Useful for sending individual page data to client without sending its sub tree.
- 8ae6713: New: Add import plugin hook and remove previous state importing in constructor. Now you have to manually import anytime you want to revive a CMS.

### Patch Changes

- 84433cb: Upd: remove otherProps to keep from polluting final tree structure. Guide users down the path of building plugins to extract props at an earlier stage.
- 8ae6713: New: add support for a plugin function returning an array with multiple plugin hook executors.
- 41015e2: Fix: increase page size to maximum number of blocks when pulling page content.

## 0.2.0

### Minor Changes

- 93cc1e0: Improved the internal CMS tree building algorithm and added public API for walking the tree.

  This fixed a bug where deeply nested pages didn't get inserted into the tree as intended, another bug
  where searching for pages by their key didn't allow for duplicated keys at different places in the structure.

  Rewrote tests to be more maintainable and test all public API surfaces.

  Added references to ancestor nodes in the CMS tree for usage in plugins. This required proper serialization/deserialization
  of objects with circular references (the ancestors) but also functions, which are required in the templating plugin and are generally useful to store in the cache.
