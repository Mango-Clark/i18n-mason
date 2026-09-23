# i18n-mason

한국어 문서: [README.ko.md](README.ko.md)

`i18n-mason` is a framework-neutral agent skill for discovering, designing, implementing, migrating, and validating a codebase's internationalization architecture. It structures internationalization; it is not a machine translation tool.

The skill fits the project that exists. It does not assume React, JavaScript, web-only localization, JSON catalogs, a particular library, or a universal folder structure. It first traces real runtime behavior and source ownership, including separate monorepo apps and services, and extends coherent existing systems instead of replacing them for uniformity.

## Why it asks questions

Defaults, public locale identifiers, routes, fallback, localization coverage, and translation ownership affect real users, compatibility, and release behavior. A repository often contains the answer; when it does not, silently choosing is an architectural decision disguised as implementation. i18n-mason reports what it observed, labels inferences and conflicts, then batches the few consequential questions evidence cannot settle. It infers formatting and established local conventions without burdening the user.

## Install into a project

From this repository, install the skill into the current project's `.agents` directory:

```sh
npm run build
```

This copies the skill to `.agents/skills/i18n-mason`. To install into another project, pass its path:

```sh
npm run build -- --project ../my-app
```

In PowerShell, invoke the command shim explicitly so npm forwards the arguments:

```powershell
npm.cmd run build -- --project ..\my-app
npm.cmd run build -- --project ..\my-app --force
```

The command copies the complete skill directory, including future references or assets. Re-running it leaves an identical installation alone. If packaged files differ from an existing installation, it stops instead of overwriting local edits; use `npm run build -- --force` (or `npm.cmd run build -- --force` in PowerShell) to replace those packaged files. Extra files in the destination are preserved. The generated `.agents/` directory is git-ignored.

Invoke the installed skill for a locale architecture audit, a new locale, an i18n implementation, or a migration. Audit mode is read-only; implementation follows repository conventions and resolves consequential unknowns before dependent changes.

## Locale intent configuration

At the project root, create `i18n-mason.toml`:

```toml
version = 1
default_locale = "ko-KR"
locales = ["ko-KR", "en-US", "ja-JP"]
```

This is a small desired-state contract, not a copy of framework configuration. It deliberately says nothing about libraries, routes, resource formats, directories, or fallback. The repository remains the primary source for observed implementation. Differences between the two must be surfaced, not silently overwritten. See [the v1 schema](docs/configuration.md).

## Typical workflow

1. Add or review the locale intent in `i18n-mason.toml`.
2. Ask i18n-mason to inspect the repository.
3. It reports the observed architecture, source/generation flow, and any conflicts with desired state.
4. It asks together about unresolved product decisions that materially change the design.
5. After decisions are resolved, it implements the smallest suitable change or returns a read-only audit.
6. It validates the project-specific behavior and reports evidence and remaining unknowns.

Questions are intentional, selective, and based on inspection—not a requirement that the user design the framework.

## Design principles

- Existing code, runtime consumers, tests, docs, CI, and deployment establish behavior; dependency presence alone does not.
- Each monorepo scope can have its own runtime and catalog system. Consolidation is not presumed.
- Locale identifiers retain exact product meaning; `en`, `en-US`, and `en-GB` are not silently substituted.
- Source of truth and generated outputs are traced before editing.
- Human-facing content is distinguished from stable API fields, identifiers, flags, paths, and protocols.
- Placeholders, ICU plural/select, and rich-text tokens are treated as contracts; locale-aware formatting and RTL are platform-specific concerns.
- Fallback, missing-message behavior, routing, selection precedence, and non-UI localization are discovered or explicitly decided.

## Repository validation

Requires Node.js 23.6 or newer. There are no runtime dependencies; tests and the validator use Node built-ins and run offline.

```sh
npm test
npm run validate
node scripts/validate-config.mjs path/to/i18n-mason.toml
```

The validator enforces the minimal v1 config shape. It does not claim to prove target-application locale coverage, placeholder safety, routing, or runtime behavior; those require checks grounded in that repository.

In this repository, the root contract applies to the package's prose documentation: English (`en-US`) is canonical and Korean (`ko-KR`) is maintained in paired files. `skills/i18n-mason/SKILL.md` intentionally remains English; code, tests, and machine-facing files do not inherit the documentation locale list.

## Contents and limitations

- `skills/i18n-mason/SKILL.md`: runtime skill behavior.
- `docs/configuration.md`: configuration contract and validator scope.
- `docs/discovery.md`: evidence and architecture decision process.
- `docs/*.ko.md`: Korean translations of the package documentation.
- `CONTRIBUTING.ko.md`: Korean contribution guide.
- `tests/fixtures/`: compact, inspectable source/catalog fixtures across heterogeneous architectures.
- `tests/scenarios.md`: manual acceptance prompts for evaluating agent decisions.
- `tests/scenarios.ko.md`: Korean version of the manual acceptance prompts.
- `scripts/validate-config.mjs`: offline root-config validator.
- `scripts/install-skill.mjs`: project-local skill installer used by `npm run build`.

Automated coverage exercises the config parser and observes real fixture files and code paths for web routing, feature namespaces, homegrown TypeScript catalogs, vanilla JSON, gettext, Fluent CLI, ICU and placeholder contracts, fallback, generated bundles, backend/client error localization boundaries, RTL metadata, and mixed monorepos. Manual agent behavior acceptance prompts live in `tests/scenarios.md`. These fixtures do not establish universal framework support or emulate every platform runtime. Project-specific formats and runtime behavior still require inspection and appropriate native validation.

## License

MIT. See [LICENSE](LICENSE).
