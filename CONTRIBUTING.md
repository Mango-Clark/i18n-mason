# Contributing

한국어 안내: [CONTRIBUTING.ko.md](CONTRIBUTING.ko.md)

Changes should serve the project contract in `goal.md`: inspect real codebases, preserve project-specific architecture, and ask about consequential decisions that evidence cannot settle.

## Work on the repository

Requires Node.js 23.6 or newer. No dependency installation or network access is needed for the built-in checks.

```sh
npm test
npm run validate
npm run build
```

`npm run build` installs the skill into `~/.agents/skills/i18n-mason` (under the user profile on Windows). To install into this repository's ignored local `.agents` directory for inspection, run `npm run build -- --project .`. In PowerShell, use `npm.cmd run build` when forwarding options such as `--project` or `--force`.

## Choose the right change location

- Keep `skills/i18n-mason/SKILL.md` focused on instructions the agent needs at runtime. Link to detailed procedures instead of duplicating them.
- Put investigation method and decision policy in `docs/discovery.md`; keep the TOML contract and validator limits in `docs/configuration.md`.
- Keep the English prose docs canonical and update their paired Korean documents in the same change. The runtime skill intentionally remains English.
- Add or change a fixture when the behavior depends on a codebase shape or source boundary. A fixture should show the relevant runtime path, not only a catalog file or prose assertion.
- Update manual scenarios when a new agent decision or acceptance boundary is introduced. These scenarios are prompts for human/model review, not automated tests.

## Review before submitting

- Does the change improve discovery or behavior for a plausible, evidence-backed project shape?
- Are observations, inferences, unknowns, conflicts, and recommendations clearly separated?
- Does it preserve user-visible and machine-facing contracts?
- Does it trace generated resources back to their editable source?
- Does it avoid assumptions about frameworks, locale normalization, or runtime policy?
- Do examples match executable behavior? Do docs state the limits of each validator, test, and fixture?
- Are paired docs and relative links still correct?

The v1 TOML contract requires `version`, `default_locale`, and `locales`; optional repeated `[[scopes]]` records may define path-specific locale intent. Schema changes need explicit design rationale and migration considerations. Never add real secrets, proprietary catalogs, or personal data to fixtures.
