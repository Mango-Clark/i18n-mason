# i18n-mason

한국어 문서: [README.ko.md](README.ko.md)

`i18n-mason` is an agent skill for understanding and changing internationalization (i18n) in a real codebase. It helps with architecture audits, adding locale support, implementation, and migrations. It is not a translation service or a framework installer.

Its central rule is simple: **discover how this project works before choosing how it should work**. Applications in one repository may use different runtimes, catalogs, locale identifiers, and release processes. The skill traces each system and extends coherent existing behavior instead of imposing one structure on all of them.

## Use the skill

Install it into your user-level agent skills directory from this repository:

```sh
npm run build
```

By default, the installer copies the complete skill to `~/.agents/skills/i18n-mason` (on Windows, under your user profile). To install into a project's local `.agents` directory instead, pass its path:

```sh
npm run build -- --project ../my-app
```

On PowerShell, use the npm command shim to forward script arguments:

```powershell
npm.cmd run build -- --project ..\my-app
```

Then ask your coding agent to use `i18n-mason` and describe the task, for example:

- “Audit locale selection and fallback in this repository. Do not change files.”
- “Add French support. Inspect the current implementation first and ask me about unresolved product decisions.”
- “Plan a migration from the generated catalog. Identify its source and consumers before editing.”

An audit is read-only. Implementation and migration follow repository conventions; the skill pauses for consequential decisions that repository evidence cannot settle.

### Updating an installation

Running the installer again leaves identical files alone. It refuses to replace changed package files unless asked, while preserving extra files in the destination. Review a conflict before replacing package files with:

```sh
npm run build -- --force
```

Use `npm.cmd` in PowerShell. The installer creates the user-level `.agents` directory if needed. A project-local installation created with `--project` is git-ignored when it is inside this repository.

## Optional locale intent file

If a project needs an explicit statement of intended locales, create `i18n-mason.toml` at its root:

```toml
version = 1
default_locale = "en-US"
locales = ["en-US", "fr-FR"]
```

Replace these example values with that product's actual identifiers. The file records desired locale intent; it does not configure a framework, routes, resource formats, fallback, or runtime behavior. Those must be discovered in the project. The skill reports differences between intent and observed behavior instead of silently rewriting either. See [the v1 configuration guide](docs/configuration.md).

## How a task proceeds

1. **Inspect:** read repository instructions and locale intent, then trace runtime code, consumers, source catalogs, generated outputs, tests, and delivery configuration.
2. **Describe:** separate observed facts from inferences, unknowns, and conflicts; inventory monorepo applications or services independently.
3. **Decide:** ask only about unresolved choices that would materially change user-visible behavior, compatibility, or resource ownership.
4. **Change or report:** make the agreed project-specific change, or return a read-only audit.
5. **Validate:** run checks that demonstrate the relevant behavior and state what remains unverified.

See [architecture discovery](docs/discovery.md) for the investigation method and [manual scenarios](tests/scenarios.md) for acceptance examples.

## What it does not assume

- A particular framework, programming language, translation library, catalog format, or folder layout.
- That a dependency or catalog file is actively used, editable source, or complete.
- That locale identifiers such as `en`, `en-US`, and `en-GB` are interchangeable.
- That a shared monorepo catalog means applications share routing or runtime behavior.
- That fallback, missing-message behavior, or non-UI localization scope can be chosen without product evidence.

These boundaries keep the skill useful across heterogeneous projects. A fixture or test can demonstrate an inspection technique; only the target repository can establish its own runtime behavior.

## Develop and verify this repository

Requires Node.js 23.6 or newer. There are no runtime dependencies; the checks use Node built-ins and can run offline.

```sh
npm test
npm run validate
node scripts/validate-config.mjs path/to/i18n-mason.toml
```

The validator checks only the small v1 TOML contract. It does not prove a target application's locale coverage, message correctness, routes, or runtime behavior. The automated suite inspects representative heterogeneous fixtures; it does not execute an agent or prove universal framework support. Manual agent-behavior prompts are in `tests/scenarios.md`.

In this repository, `i18n-mason.toml` describes prose documentation: English (`en-US`) is canonical, with Korean (`ko-KR`) in paired documents. The runtime `SKILL.md` intentionally remains English. Code, tests, and machine-facing files are outside that documentation locale scope.

## Project map

- `skills/i18n-mason/SKILL.md` — instructions loaded by the coding agent.
- `docs/discovery.md` — evidence-led investigation and decision process.
- `docs/configuration.md` — v1 locale intent schema and validator boundaries.
- `tests/fixtures/` — small codebases used to inspect distinct i18n patterns.
- `tests/scenarios.md` — manual acceptance prompts for agent behavior.
- `scripts/install-skill.mjs` — user-level skill installer with an optional project-local override (`npm run build`).
- `scripts/validate-config.mjs` — offline v1 config validator.

## License

MIT. See [LICENSE](LICENSE).
