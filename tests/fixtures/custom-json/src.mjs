import en from './locales/en/common.json' with { type: 'json' };
import fr from './locales/fr/common.json' with { type: 'json' };

const resources = { en, fr };
const fallbacks = { 'fr-CA': ['fr', 'en'], fr: ['en'] };

export function translate(locale, key) {
  for (const candidate of [locale, ...(fallbacks[locale] ?? []), 'en']) {
    const value = resources[candidate]?.[key];
    if (value !== undefined) return value;
  }
  return undefined;
}
