---
name: i18n-mason
description: Discover, design, implement, migrate, and validate internationalization architecture in an existing or new codebase. Use when work involves locale support, localization resources, locale routing or selection, or i18n audits; not for translation-only requests that leave architecture untouched.
metadata:
  short-description: Shape project-specific i18n architecture
---

# i18n-mason

Internationalization is a property of a particular product and codebase. Discover that system and its boundaries; do not impose a framework, file format, locale convention, or frontend-only model.

## Workflow

1. **Inspect before asking.** Read applicable repository instructions and `i18n-mason.toml`, then trace relevant runtime code, dependencies actually in use, resources, tests, build and deployment steps, and docs. Search broadly first, then trace references to distinguish active, legacy, generated, and unrelated files. In monorepos, inventory applications, packages, and services separately before proposing shared behavior. Use real project examples when establishing how a stack or resource format works; fixtures and dependency lists alone are not evidence of product behavior.
2. **Report what is known.** Separate desired locale state in TOML from observed code behavior. Label facts, inferences, unknowns, and conflicts accurately. Identify resource ownership and data flow before editing any generated or duplicated catalog. Classify discovered scopes and human-facing vs machine-facing content with context.
3. **Resolve material ambiguity.** Infer low-impact details from strong conventions. Follow an established medium-impact convention; ask if none exists. Ask before changing high-impact, user-visible, compatibility, or ownership behavior that evidence cannot settle. Present related questions together as `Observed`, `Conflicts / unknowns`, and `Decisions needed`. Ask only for decisions that change the proposed implementation; do not ask the user to repeat repository facts. Wait for answers before implementing dependent choices. If one option is clearly supported, explain the evidence and propose it for confirmation where the change is consequential.
4. **Design to fit.** Extend a coherent existing system. For a greenfield project, derive viable choices from its real runtime and delivery constraints and explain trade-offs. Prefer the smallest architecture meeting requirements. Keep independent monorepo systems independent absent a concrete benefit and agreed migration. Define compatibility and rollback for migrations; do not move or delete resources until their consumers and source/generation pipeline are understood.
5. **Implement and validate.** Minimize unrelated changes. Preserve keys, stable APIs, identifiers, interpolation and rich-text tokens exactly. Validate relevant runtime behavior and all project-appropriate checks, including locale coverage, resource structure, message syntax/placeholders, selection/routing/fallback, generated outputs, accessibility metadata, and RTL behavior if supported. Avoid broad string-literal extraction without evidence of human-facing use. Report checks run, unverified assumptions, unresolved risks, and conflicts.

## Questions by impact

- **Low:** formatting, indentation, naming style; infer unless conventions conflict.
- **Medium:** key/namespace organization, file placement, ownership boundaries; follow precedent or ask if absent.
- **High:** public/default locale identifiers, URL/routing and redirects, selection precedence, fallback and missing-message behavior, canonical source/TMS adoption, unsupported locales, user-facing localization scope, server/client API contract, consolidating systems, and migration. Ask whenever code, tests, docs, or explicit user requirements do not establish intended behavior.

## Architecture invariants

- `i18n-mason.toml` is a desired-state locale contract, not framework configuration. Every v1 file has `version = 1`, `default_locale`, and a non-empty root `locales` array; `default_locale` must exactly match one item. Optional repeated `[[scopes]]` records can set `path` and `locales` for repository-relative literal files or folders. A scope replaces the root locale list for matching paths, and each scope must include the global default. Exact file scopes outrank folders; among folders, the deeper path wins. Verify each path's existence and whether it is a file or folder during the audit; the syntax validator does not inspect the filesystem. Compare intent with observed state and surface conflicts. Never silently rewrite either side. Locale identifiers remain exact strings; do not normalize them. The associated validator accepts only a deliberately small TOML subset, not general TOML.
- Locale identifiers encode product and routing choices. Do not normalize language, region, or script tags (`en`/`en-US`, `zh-Hant`/`zh-TW`, etc.) or assume they are interchangeable.
- Discover locale source, runtime consumption, selection precedence, routing/canonical URLs, locale switching, fallback and missing-key policy. Do not equate a configured locale or catalog file with complete runtime or product support.
- Distinguish UI, accessibility labels, emails, notifications, CLI, reports, documents, metadata, and user-facing errors from stable identifiers, routes, API/schema fields, error codes, flags, paths, headers, and protocol values. Determine each scope from project evidence and ask when intended coverage is unknown.
- For configured path scopes, inspect real paths and classify each as file or folder. Resolve overlaps by exact file, then deepest matching folder; array ordering has no priority. Report path existence/type mismatches and observed locale differences per path.
- Preserve placeholder names/types, ICU plural/select branches, markup/component tokens, escaping, and machine-significant syntax. Validate source/target compatibility; locale-aware formatting uses platform/project primitives where available. RTL, fonts, text expansion, language/direction metadata, and performance require platform-appropriate evidence.
- Identify gettext/PO, XLIFF, ARB, Fluent, platform catalogs, custom formats, databases, CMS/TMS, and generated artifacts on their own terms. Do not mistake output for source or upload project content to external services without explicit authorization.

## Modes

**Audit** is read-only: inventory confirmed architecture and scope, locale intent vs observation, source/generation flow, selection/routing/fallback, coverage and validation evidence, risks, conflicts, and unanswered decisions. Recommendations must be labeled as such.

**Implementation or migration** follows the workflow above; ask only about unsettled consequential choices before dependent changes. Preserve working behavior outside requested scope and avoid translation rewrites without semantic, syntax, migration, or explicit product need.
