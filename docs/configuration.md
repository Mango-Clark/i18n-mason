# `i18n-mason.toml` v1

한국어 문서: [configuration.ko.md](configuration.ko.md)

This file records **which locale identifiers a product intends to support**. It is deliberately separate from framework configuration: it does not install or configure a runtime, and it does not say how a locale is selected or how messages are stored.

## Create the file

Place `i18n-mason.toml` at the target project's repository root. Replace the example values below with the exact identifiers used or intended by that product:

```toml
version = 1
default_locale = "en-US"
locales = ["en-US", "fr-FR"]
```

`default_locale` must appear exactly in `locales`. Identifiers are opaque strings in v1: the validator preserves spelling and order and does not decide whether a value is a valid BCP 47 tag. Do not change `en` to `en-US`, or normalize a legacy/public identifier, just to satisfy this file. Investigate the product contract first.

Optional repeated scopes replace the root locale list for matching repository paths:

```toml
[[scopes]]
path = "docs"
locales = ["en-US", "ko-KR"]

[[scopes]]
path = "docs/internal.md"
locales = ["en-US"]
```

`path` is a literal repository-relative path using `/`; absolute paths, glob characters, empty components, `.` and `..` are rejected. A folder scope applies recursively; a file scope applies only to that file. During an audit, verify that each path exists and has the expected file/folder type; the validator checks syntax only. Each scope must have distinct, non-empty `locales` and include the global `default_locale`. Scope order has no priority: exact file scopes win, then the deepest matching folder. Existing configurations without scopes remain valid. Projects adopting scopes need an updated validator and skill; existing v1 files need no migration.

## Schema

| Key | Type | Required | Meaning |
| --- | --- | --- | --- |
| `version` | integer | yes | Schema version. v1 accepts exactly `1`. |
| `default_locale` | non-empty string | yes | Intended product default; must exactly match one item in `locales`. |
| `locales` | non-empty array of distinct non-empty strings | yes | Intended locale identifiers. Exact spelling and order are preserved. |
| `[[scopes]]` | repeated table | no | Optional path-specific replacement list; each record requires `path` and `locales`. |

These are the only supported root keys. Optional scope records currently support only `path` and `locales`; unknown keys are rejected to catch typos. Do not add routes, frameworks, catalog paths, or fallback rules. Discover implementation details from the target codebase.

## Validate syntax

From this repository, check the root example:

```sh
npm run validate
```

To validate a file elsewhere, pass its path to the script:

```sh
node scripts/validate-config.mjs path/to/i18n-mason.toml
```

The bundled validator supports ordinary whitespace, full-line and trailing comments, basic double-quoted strings without escapes, single- or multiline arrays, and repeated `[[scopes]]` records. It rejects unsupported TOML syntax, unknown or duplicate fields, missing fields, duplicate scope paths or locale values, invalid paths, a scope without the default locale, and versions other than `1`. It does not check whether scope paths exist. This is a deliberately narrow v1 parser, not a general TOML implementation.

For example, this is rejected because the default is not an exact member of the declared list:

```toml
version = 1
default_locale = "en-US"
locales = ["en", "fr"]
```

Fix the declaration only after confirming the intended public/product identifiers. The validator should reveal a mismatch, not dictate how the product names locales.

## Compare intent with implementation

Passing validation proves only that the file follows this small schema. It does not prove translations exist, routes work, fallback is correct, or the runtime supports every declared locale.

Inspect active code paths, resources, tests, generation scripts, deployment settings, and relevant product docs. Compare those observations with the TOML and report the difference. A mismatch might be a migration in progress, a legacy identifier, an environment-specific config, or a separate monorepo scope. Do not silently rewrite the file or implementation. Ask the user only when evidence cannot establish which product behavior is intended and the answer changes the design.

## This repository's locale scope

Here the root contract applies to prose documentation: English (`en-US`) is canonical and Korean (`ko-KR`) is maintained in paired docs. The `skills/i18n-mason/SKILL.md` file has an explicit English-only scope. Code, tests, and machine-facing files are outside this documentation locale contract.
