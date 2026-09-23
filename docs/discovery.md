# Architecture discovery and decisions

한국어 문서: [discovery.ko.md](discovery.ko.md)

This document describes how i18n-mason reasons about a target repository; it is not a generic library selection guide.

## Evidence

Trace mechanisms end to end. Inspect source imports and call sites, framework configuration, installed dependencies actually imported, resource catalogs, route handlers and middleware, locale selectors, account/session/cookie/browser settings, message providers, build and generation scripts, CI/deployment, tests, and docs. Corroborate package and file evidence with consumers. Check generated headers, ignored files, scripts, and CI before treating a catalog as editable source.

For monorepos, inventory applications and packages as separate systems first. A shared directory may supply message definitions without owning routing or runtime behavior. Record each scope's platform, mechanism, resource formats, identifiers, source of truth, consumers, behavior, and known relationship to other scopes. Shared architecture is a proposal that needs evidence and product benefit, not a default.

Possible resources include JSON/YAML/TS, gettext PO/POT, XLIFF, ARB, Fluent, ICU, Android/iOS catalogs, databases, CMS/TMS integrations, and generated outputs. A dependency alone proves neither use nor canonical ownership. Follow input, transformations, generated outputs, and runtime consumers.

## Ask only for consequential unknowns

Question policy is part of correctness. Inspect first and batch related unresolved decisions. Briefly tell the user what evidence shows, what conflicts, and which decisions change implementation. State facts and inferences separately. Don't ask about conventions visible in the repo.

- Low-impact formatting is inherited from local precedent.
- Medium-impact organization follows coherent precedent; ask if a choice creates a new public/consumed boundary or no convention exists.
- High-impact behavior requires explicit evidence or a user decision: locale identity, defaults, routing and URLs, selection precedence, fallback, missing-message behavior, source ownership, public API localization contract, TMS adoption, consolidation/migration, and localization coverage of non-UI channels.

When user answers affect only part of the work, continue independent discovery/audit but wait before dependent product behavior changes. Summarize agreed decisions in existing project docs when there is an appropriate convention. Avoid heavyweight ADR machinery without demonstrated value.

## Runtime architecture to discover

Establish exact locale identifiers across configuration, URLs, APIs, databases, user preferences, catalogs, and platform APIs. Determine whether locale selection comes from an explicit setting, URL, profile/account, session/cookie, browser/OS, request header, or API input and establish precedence only from evidence or user choice. Inspect redirects, canonical URLs, deep links, switching and generated links where relevant.

Trace fallback chain and its environment-specific behavior. Determine missing-key behavior in development, CI/build, and production. Fallback may improve continuity while concealing gaps: never infer its policy from a generic default. Check any locale compatibility with public APIs, stored records, caching, and stable error codes.

For every message flow, distinguish human-facing content (including accessibility, CLI, emails, reports, and validation messages) from machine-facing syntax, stable IDs, API field names, paths, and protocol data. Classify with surrounding code and runtime context rather than string-literal appearance.

Preserve complete translatable grammatical units. Inspect placeholders, types, escaping, ICU plural/select rules, rich text, and translator-controlled markup. Compare compatible tokens and parse messages with a tool appropriate to the format. Plural categories are language-specific: do not require source and target locales to have the same branch set; check that each message is valid for its locale and retains required branches such as ICU `other`. Use platform locale formatters for date, number, currency, list, collation, and units. Where RTL or new scripts apply, examine direction metadata, logical layout, mixed-direction text, focus/navigation, fonts, expansion, and relevant visual/accessibility evidence.

## Audit and change boundaries

An audit can report observed resources, systems/scopes, default and locale identifiers, source/generation flow, selection, routes, fallback/missing behavior, coverage evidence, hardcoded-string candidates with confidence and context, placeholder hazards, RTL risks, and TOML conflicts. Distinguish confirmed facts, inference, unknowns, conflict, and recommendations.

Before migration, identify every consumer, canonical source, key contract, runtime fallback, locale contract, ownership, CI/deploy effect, and rollback-compatible incremental path. Preserve stable keys and working behavior; remove resources only after proving they are obsolete. Validate the architecture as well as translations. Report exactly which checks prove which claims and what remains unverified.
