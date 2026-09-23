# Manual behavior scenarios

한국어 시나리오: [scenarios.ko.md](scenarios.ko.md)

These acceptance prompts are for evaluating the agent skill itself. They complement Node tests, which verify the config validator and inspect concrete fixture artifacts; they do not execute a language model or prove every possible project can be understood.

## Existing systems and conflicts

Use `fixtures/next-intl-app` and a desired TOML containing `en-US` / `ja-JP`. Trace routing (`en`/`ko`), request-time catalogs, and plural messages. The agent must report the identifiers and unsupported desired locale as a conflict, preserve `en`/`ko`, and ask about public IDs and the product state of `ja-JP`; it must not change library or routes on its own.

Use `fixtures/typescript-dictionary` with a request to add `fr`. Inspect the persisted override > browser language > `ko` selection, TypeScript dictionaries, generated distribution bundle, and current parity tests. Ask whether French should be selectable and what its public/product identifier is if still unknown. Never edit the generated bundle directly or replace the homegrown runtime with a framework.

## Fallback and resource ownership

Use `fixtures/custom-json`. The code proves `fr-CA` falls back to `fr`, then `en`; an absent `fr` key falls back to `en`, and an absent key everywhere returns `undefined`. Report these as observed code behavior. Do not propose another fallback policy unless the task requires changing it.

Use `fixtures/i18next-app`. Treat feature catalogs under `src` as source and `dist` as generated output. Preserve namespace ownership and report the checked-in generated marker as a source/build trace to investigate before migration.

## Syntax, scope, and platforms

Use `fixtures/placeholder-mismatch` and `fixtures/invalid-icu`. Report the mismatched `{userName}` placeholder and the ICU message that lacks its required `other` branch as invalid message contracts. Do not require identical plural branches across locales: categories vary by language. Do not silently repair translator text.

Use `fixtures/monorepo`: preserve independent web routes/catalogs, Android XML resources, and API error codes. Do not translate stable codes or assume the API owns the displayed message.

Use `fixtures/backend-localized-errors` and `fixtures/native-cli` to inspect non-UI messages, machine flags/codes, Fluent selectors, and locale-specific grammar. Ask where localized error behavior changes API or CLI compatibility and intent is not documented.

Use `fixtures/rtl-web`: an RTL locale is configured and direction is exposed in markup and CSS. Check whether runtime locale changes update the direction metadata; if implementation or visual behavior is not evidenced, report it as unknown rather than treating the strings alone as full RTL support.

Use `fixtures/empty-static` as greenfield. `lang="en"` and some Korean content do not establish localization intent. Propose no framework until public identifiers, localized page scope, URL policy, and content ownership are decided from user intent.
