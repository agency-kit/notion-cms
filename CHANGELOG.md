# @agency-kit/notion-cms

## 0.2.0

### Minor Changes

- 93cc1e0: Improved the internal CMS tree building algorithm and added public API for walking the tree.

  This fixed a bug where deeply nested pages didn't get inserted into the tree as intended, another bug
  where searching for pages by their key didn't allow for duplicated keys at different places in the structure.

  Rewrote tests to be more maintainable and test all public API surfaces.

  Added references to ancestor nodes in the CMS tree for usage in plugins. This required proper serialization/deserialization
  of objects with circular references (the ancestors) but also functions, which are required in the templating plugin and are generally useful to store in the cache.
