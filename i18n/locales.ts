export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

// Helper to check whether a value is a valid locale
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
