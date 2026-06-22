import { APP_LANGUAGES, AppLanguage } from './constant';

/**
 * Returns the localized value of a field from a data object.
 *
 * Field naming convention used across the codebase:
 *   - Base (English): `title`          — most screens
 *   - English variant: `title_english` — InformationScreen
 *   - Localized:       `title_punjabi` — all Punjabi content
 *
 * To add a new language (e.g. Hindi):
 *   1. Add `HINDI: 'hindi'` to APP_LANGUAGES in constant.ts
 *   2. Have the backend return `title_hindi`, `description_hindi`, etc.
 *   3. No other frontend changes required — this function handles the rest.
 *
 * Fallback chain (non-English example for 'punjabi'):
 *   obj.title_punjabi  →  obj.title  →  obj.title_english  →  ''
 *
 * Fallback chain (English):
 *   obj.title  →  obj.title_english  →  ''
 */
export function getLocalizedField(
  obj: Record<string, any> | null | undefined,
  field: string,
  language: AppLanguage,
): string {
  if (!obj) return '';

  // Non-English: try `{field}_{language}` first (e.g. title_punjabi)
  if (language !== APP_LANGUAGES.ENGLISH) {
    const localizedKey = `${field}_${language}`;
    if (obj[localizedKey]) return obj[localizedKey];
  }

  // Base field (most screens use `title`)
  if (obj[field]) return obj[field];

  // `{field}_english` fallback (InformationScreen uses title_english, not title)
  const englishKey = `${field}_${APP_LANGUAGES.ENGLISH}`;
  return obj[englishKey] || '';
}
