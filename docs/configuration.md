# `i18n-mason.toml` v1

한국어 문서: [configuration.ko.md](configuration.ko.md)

The root configuration records supported locale intent, independently of implementation. Keep framework and runtime details discoverable from the codebase.

```toml
version = 1
default_locale = "ko-KR"
locales = ["ko-KR", "en-US", "ja-JP"]
```

## Schema

| Key | Type | Required | Meaning |
| --- | --- | --- | --- |
| `version` | integer | yes | Schema version; v1 accepts exactly `1`. |
| `default_locale` | non-empty string | yes | The intended product default, included exactly in `locales`. |
| `locales` | non-empty array of distinct non-empty strings | yes | Product locale identifiers. Preserve exact values and order. |

The validator accepts ordinary TOML whitespace, full-line and trailing comments, unescaped double-quoted strings, and single- or multiline locale arrays. It rejects duplicate keys/locales, unknown fields, missing fields, empty values, and unsupported versions. It deliberately does not canonicalize or syntactically restrict locale tags: products can have public or legacy identifiers whose behavior must be discovered, not guessed. Escaped strings and general TOML tables are outside this deliberately small v1 schema. Use only the three required root fields.

Example checks:

```sh
npm run validate
node scripts/validate-config.mjs path/to/i18n-mason.toml
```

Configuration validity does not prove resource coverage, routing, translation quality, or runtime support. Those require repository-specific evidence and checks.

## Desired and observed state

Treat this file as a desired locale contract; inspect running code, resources, tests, routes, generation scripts, and documentation to establish observed state. Report differences without silently overwriting either side. Check whether discrepancies reflect legacy identifiers, a separate monorepo scope, generated/environment-specific config, or an incomplete change. Ask the user if evidence cannot identify intent.

In this repository, the root locale contract covers prose documentation. English (`en-US`) is the canonical source; Korean (`ko-KR`) is maintained in paired documentation files. The runtime skill stays English by explicit scope choice. Code, tests, and machine-facing files are not part of this documentation locale set.
