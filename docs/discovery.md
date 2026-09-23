# Investigating an i18n architecture

한국어 문서: [discovery.ko.md](discovery.ko.md)

This guide explains how to discover a target repository's localization behavior before recommending or changing it. It is an evidence workflow, not a framework or library selection guide. Use the [skill instructions](../skills/i18n-mason/SKILL.md) for the concise operating procedure.

## Start with the requested scope

Clarify what the task is expected to change: an audit, a new locale, a route, a catalog migration, or another behavior. Read repository instructions and `i18n-mason.toml` first. Identify which apps, services, platforms, and user-facing surfaces the request touches. Do not expand a narrow change to every package in a monorepo without evidence that they share the affected contract.

If the request leaves its scope unclear, inspect enough to identify the systems involved, then ask a focused question before making changes that depend on the answer.

## Trace a message from source to user

Follow evidence across the whole path instead of treating filenames or dependencies as proof:

1. **Find candidates:** search for locale configuration, message lookups, catalog files, route handling, build scripts, and localization dependencies.
2. **Confirm active use:** follow imports and call sites to the runtime consumer. Check whether the code is production, test-only, legacy, or optional.
3. **Find the owner:** inspect scripts, generated headers, ignore rules, CI, and deployment steps to determine which files are edited by people and which are produced by tooling.
4. **Establish behavior:** trace selection, routing, fallback, missing-message handling, formatting, and errors through the code path that serves the user.
5. **Corroborate:** use tests, docs, runtime checks, and release configuration to confirm or qualify the code evidence.

A dependency shows what could be used, not what the application uses. A catalog shows that messages exist, not that every message is reachable or translated. A passing test proves only the case and behavior it exercises.

For each relevant finding, retain a specific pointer (file and symbol, configuration key, test, or command output) and its meaning. Record contradictory evidence too. Generated files should be traced back through their generator to the canonical input before any edit.

## Map independent systems before sharing them

Inventory monorepo applications, packages, services, and native clients separately. A shared catalog might provide message definitions while each application owns its own route, locale selector, fallback, or release cycle. Mark relationships as shared source, shared runtime, generated copy, or unknown only when evidence supports that classification.

This compact inventory helps expose boundaries without prescribing a layout:

| Scope | Runtime and entry point | Locale IDs and selection | Message source and consumers | Generation / delivery | Unknowns |
| --- | --- | --- | --- | --- | --- |
| Web app | observed entry point | exact observed IDs and precedence | canonical resource → lookup | observed build/deploy path | unresolved facts |
| API service | observed entry point | whether requests or stored data carry locale | response or server message owner | observed build/deploy path | compatibility boundary |

Add rows only for systems relevant to the task. Do not force every project into these example labels or a common folder structure.

## Establish locale behavior precisely

Preserve identifiers as written across configuration, routes, APIs, storage, catalogs, and platform interfaces. `en`, `en-US`, and `en-GB` may identify different public contracts. Note mismatches; do not normalize them to make the inventory look consistent.

Trace the actual locale selection source and precedence. Possible inputs include an explicit user setting, URL, profile, session or cookie, browser or OS, request header, and API parameter. Record redirects, canonical URLs, deep links, language switching, and generated links when relevant. If precedence is not implemented or tests are inconclusive, call it unknown.

Follow the fallback chain for both known and unsupported locales, and establish what a missing key does in development, CI/build, and production. A fallback may preserve continuity while hiding incomplete translations. Do not infer policy from a library default or from the configured default locale; confirm the project's effective configuration and consumers.

## Check ownership and message contracts

Trace the full resource path: human-edited source, extraction or conversion, generated output, packaging, and runtime lookup. Check whether source catalogs are split by feature, platform, team, tenant, or channel. Treat TMS or CMS ownership as a workflow to verify, not a presumed improvement.

Classify content by how it is consumed. Human-facing scope can include interface text, accessibility labels, emails, notifications, CLI output, reports, and validation messages. Stable error codes, API fields, flags, paths, headers, and protocol values may be machine-facing even when shown near translated text. Use call sites and consumers to decide; do not translate or rename values based on appearance alone.

For translatable messages, inspect the complete grammatical unit and its contract:

- placeholders: names, types, escaping, and whether every required value is supplied;
- ICU or equivalent plural/select syntax: validity in each locale and required branches such as `other` (plural categories can differ by language);
- rich-text or component tokens: which markup translators may move or control;
- formatting: project/platform locale-aware handling of dates, numbers, currency, lists, collation, and units.

When RTL or additional scripts are in scope, check locale metadata and runtime direction, logical layout, mixed-direction content, fonts, text expansion, keyboard/focus behavior, and accessibility. A locale entry or translated string alone is not proof of usable RTL support.

## Separate facts, inferences, and decisions

Use these labels consistently in notes and reports:

- **Observed:** directly shown by current code, configuration, tests, or runtime output.
- **Inference:** a likely explanation supported by evidence, with the reason stated.
- **Unknown:** evidence is absent or does not establish behavior.
- **Conflict:** two authoritative sources disagree, such as TOML intent and active route IDs.
- **Recommendation:** a proposed change, not a statement about current behavior.

Keep desired state (`i18n-mason.toml`) separate from observed state. A conflict may reflect a migration, legacy identifier, environment-specific generation, or separate monorepo scope. Investigate before editing either side.

## Ask only for decisions that change the design

Inspect first, then batch related questions. For each question, show the evidence, the unresolved conflict or unknown, and the implementation choice that depends on the answer. Ask only when the answer changes user-visible behavior, compatibility, ownership, or another material product boundary.

| Impact | Default action |
| --- | --- |
| Low: formatting or established local convention | Follow the repository. |
| Medium: organization or ownership boundary | Follow coherent precedent; ask if none exists or a new public/consumed boundary is created. |
| High: locale identity/default, URL behavior, selection precedence, fallback, missing-message policy, public API, translation ownership, migration, or localization scope | Ask when repository evidence or explicit requirements do not decide it. |

Continue work independent of an unanswered decision. Wait only before dependent changes. Do not turn a consequential product choice into an implementation detail by silently selecting a common library default.

## Plan changes and prove the result

Before a migration, identify affected consumers, canonical sources, key and locale contracts, generated outputs, fallback behavior, CI/deploy effects, and a reversible sequence. Preserve stable keys and working behavior unless change is in scope. Remove a resource only after showing it is obsolete and no longer consumed.

Choose checks that match the claim: parser or catalog validation for resource syntax, focused tests for selection/fallback, route tests for URL behavior, build checks for generated output, and appropriate visual/accessibility checks for direction or layout. State what each check proves and what it does not.

### Suggested audit report

Adapt this outline to the task; omit irrelevant sections rather than filling them with guesses.

1. **Scope inspected** — apps, services, platforms, and user-facing surfaces.
2. **Observed architecture** — runtime, exact locale IDs, selection/routing, fallback, and missing-message behavior.
3. **Resource ownership** — canonical sources, generators, outputs, and runtime consumers.
4. **Coverage and contracts** — evidence for message coverage, placeholders, formatting, and RTL where relevant.
5. **Findings** — observed facts, inferences, unknowns, and conflicts, each with evidence.
6. **Decisions needed** — only material unanswered questions, with the dependent choice explained.
7. **Validation and limits** — checks run, the claims they support, and remaining unverified behavior.

For examples of expected decisions across heterogeneous repositories, see [manual behavior scenarios](../tests/scenarios.md).
