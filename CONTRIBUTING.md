
PRs welcome.

If you make changes, use `npx changeset`. Versioning and publishing is done via GitHub Actions.

Please make tests. We use `nock` to simulate the Notion API so remember that when you are making changes to your Notion test page and the API is returning stale results... you probably forgot to run with Nock turned off.

Or better yet, use `Insomnia` and copy/paste the API results into `notion-api-mock.spec.mjs`.


