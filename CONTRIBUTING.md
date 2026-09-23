# Contributing

한국어 안내: [CONTRIBUTING.ko.md](CONTRIBUTING.ko.md)

Keep changes aligned with the project contract in `goal.md`: inspect real codebases, preserve project-specific architecture, and ask about consequential decisions that evidence cannot settle.

## Development

- Requires Node.js 23.6+; no install step or network access is required.
- Run `npm run build` to install the skill locally into the ignored `.agents/skills/i18n-mason` directory.
- Run `npm test` and `npm run validate` after changes.
- Keep the runtime `SKILL.md` concise; move conditional detail into focused linked docs.
- Add heterogeneous evidence-based fixture cases when a regression involves a new architecture or source boundary. Avoid tests that only assert prose or headings.
- Keep the v1 TOML contract to `version`, `default_locale`, and `locales`; change the schema only with explicit design rationale and migration considerations.
- Do not put real project secrets, proprietary catalogs, or personal data in fixtures.

## Review checklist

- Does the change improve architecture discovery or behavior on an actual project shape?
- Are observed facts, inference, unknowns, and recommendations distinct?
- Does it preserve user-visible and machine-facing contracts?
- Are generated resources traced to their canonical source?
- Does it introduce assumptions about a framework, locale normalization, or runtime policy?
- Do docs describe tested capabilities and current limits accurately?
