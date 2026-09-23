# Manual behavior scenarios

한국어 문서: [scenarios.ko.md](scenarios.ko.md)

These prompts evaluate the `i18n-mason` agent skill on representative repository shapes. They complement automated Node tests, which inspect the validator and concrete fixtures. The prompts do **not** run a model, assert its output automatically, or prove support for every possible project.

## How to run a review

For each scenario, provide the named fixture as the working repository, include any stated `i18n-mason.toml`, and give the task prompt. Review the agent's investigation and response against the expected evidence and decisions below. A good response points to actual files and call sites, separates observation from inference, and asks only questions whose answers would change the design.

Unless a scenario explicitly asks for implementation, evaluate it as an audit or plan. Even when implementation is requested, do not reward dependent changes before consequential unanswered decisions are resolved. Do not reward a framework choice, translation rewrite, or file change outside the scenario's scope.

## Existing systems and conflicting intent

### Public locale IDs differ from desired state

- **Fixture:** `fixtures/next-intl-app`.
- **Setup:** declare `en-US` and `ja-JP` in `i18n-mason.toml`.
- **Prompt:** audit the active locale behavior and compare it with the declared intent.
- **Expected:** trace routing IDs `en` / `ko`, request-time catalogs, and plural messages. Report the TOML mismatch without normalizing either set. Ask about public IDs and whether `ja-JP` is intended product scope.
- **Avoid:** changing routes or replacing the localization library without a decision.

### Add a locale to a homegrown dictionary

- **Fixture:** `fixtures/typescript-dictionary`.
- **Prompt:** add French support.
- **Expected:** trace saved override → browser language → `ko` selection, TypeScript dictionaries, generated distribution bundle, and parity tests. Identify the bundle's generator as the edit path. Before implementing, ask whether French should be selectable and confirm its public/product identifier if unknown; wait for answers before dependent changes.
- **Avoid:** editing the generated bundle directly or replacing the custom runtime with a framework.

## Fallback and resource ownership

### Existing explicit fallback chain

- **Fixture:** `fixtures/custom-json`.
- **Prompt:** audit fallback and missing-key behavior.
- **Expected:** report from code that `fr-CA` falls back to `fr`, then `en`; a missing `fr` key falls back to `en`; and a key missing everywhere returns `undefined`.
- **Avoid:** proposing a different policy when the task does not request a behavior change.

### Source catalog and generated copy

- **Fixture:** `fixtures/i18next-app`.
- **Prompt:** identify which catalogs are editable and which files the runtime consumes.
- **Expected:** trace feature catalogs under `src` to the runtime, and recognize `dist` as generated output. Investigate the checked-in generated marker and build flow before proposing migration.
- **Avoid:** moving ownership to `dist` or merging feature namespaces for uniformity.

## Message contracts and product boundaries

### Placeholder and ICU validity

- **Fixtures:** `fixtures/placeholder-mismatch` and `fixtures/invalid-icu`.
- **Prompt:** review message contract risks across the locale pairs.
- **Expected:** identify the `{userName}` / `{username}` mismatch and the ICU message missing required `other`. Explain that plural categories can differ by language.
- **Avoid:** silently rewriting translation text or demanding identical plural branches across locales.

### Independent systems and machine-facing values

- **Fixtures:** `fixtures/monorepo`, `fixtures/backend-localized-errors`, and `fixtures/native-cli`.
- **Prompt:** map user-visible localization and stable machine-facing contracts.
- **Expected:** preserve independent web routes/catalogs and Android XML resources; recognize stable API error codes and client-side message lookup; inspect backend and CLI user-facing messages, Fluent selectors, flags, and exit codes. Ask if localized API/CLI errors would alter compatibility and intent is not documented.
- **Avoid:** translating stable codes or assuming the API owns text shown by the client.

### RTL behavior

- **Fixture:** `fixtures/rtl-web`.
- **Prompt:** assess whether RTL behavior is implemented for the Arabic locale.
- **Expected:** inspect configured locales, runtime direction, markup metadata, and logical CSS properties. Check whether runtime locale changes update direction. Mark visual or accessibility behavior unknown when there is no evidence.
- **Avoid:** treating translated strings or a catalog entry as proof of full RTL support.

## Greenfield scope

### Static site with mixed-language content

- **Fixture:** `fixtures/empty-static`.
- **Prompt:** recommend the next step for adding localization.
- **Expected:** explain that `lang="en"` and some Korean content do not establish product locale intent. Ask about public locale IDs, which pages/content are in scope, URL policy, and content ownership before choosing a framework.
- **Avoid:** selecting a library or creating a universal catalog layout before those decisions are known.
