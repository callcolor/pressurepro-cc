# Internationalization (i18n) Guide

This guide explains how internationalization is implemented in the Tech Conference Explorer using `next-intl`.

## 📚 Overview

The application supports multiple languages with:
- **English (en)** - Default language
- **Spanish (es)** - Secondary language

All hard-coded strings have been extracted into translation files for easy management and localization.

## 🗂️ File Structure

```
tech-conference-explorer/
├── i18n/
│   └── request.ts           # i18n configuration
├── messages/
│   ├── en.json             # English translations
│   └── es.json             # Spanish translations
├── components/
│   └── LanguageSwitcher.tsx # Language selector component
├── middleware.ts            # i18n middleware
└── next.config.ts           # Next.js + next-intl config
```

## 🛠️ Configuration Files

### 1. i18n/request.ts
Configures next-intl for the application:

```typescript
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### 2. middleware.ts
Handles locale detection and routing:

```typescript
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### 3. next.config.ts
Integrates next-intl plugin:

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl(nextConfig);
```

## 📖 Translation Files

### Structure

Translation files are organized hierarchically using nested keys:

```json
{
  "common": {
    "appName": "Tech Conference Explorer",
    "loading": "Loading...",
    "error": "Error"
  },
  "nav": {
    "conferences": "Conferences",
    "dashboard": "Dashboard"
  },
  "home": {
    "title": "Discover Tech Conferences",
    "subtitle": "Find and register for the best tech events"
  }
}
```

### Available Translation Namespaces

- **common** - Shared UI elements (buttons, labels, etc.)
- **nav** - Navigation items
- **footer** - Footer content
- **home** - Home page strings
- **filters** - Conference filters
- **conference** - Conference details and actions
- **registration** - Registration form
- **dashboard** - User dashboard
- **admin** - Admin panel
- **errors** - Error messages
- **social** - Social sharing
- **validation** - Form validation messages
- **languages** - Language names

## 💻 Usage in Components

### Client Components

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
      <button>{t('common.submit')}</button>
    </div>
  );
}
```

### With Scoped Translations

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function HomeHero() {
  const t = useTranslations('home'); // Scoped to 'home' namespace

  return (
    <div>
      <h1>{t('title')}</h1>        {/* Accesses home.title */}
      <p>{t('subtitle')}</p>        {/* Accesses home.subtitle */}
    </div>
  );
}
```

### With Interpolation

```tsx
const t = useTranslations();

// Simple interpolation
<p>{t('home.showingCount', { count: 5 })}</p>
// Output: "Showing 5 conferences"

// Pluralization (automatic based on count)
<p>{t('dashboard.daysAway', { days: 1 })}</p>  // "En 1 día"
<p>{t('dashboard.daysAway', { days: 3 })}</p>  // "En 3 días"

// Multiple values
<p>{t('home.pageOf', { page: 1, total: 10 })}</p>
// Output: "Page 1 of 10"
```

### Server Components

```tsx
import { getTranslations } from 'next-intl/server';

export default async function ServerComponent() {
  const t = await getTranslations();

  return (
    <div>
      <h1>{t('home.title')}</h1>
    </div>
  );
}
```

## 🌐 Language Switcher

The `LanguageSwitcher` component allows users to change languages:

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// In your layout or navigation
<LanguageSwitcher />
```

### How it works:
1. Displays a dropdown with available languages
2. Stores preference in cookies
3. Updates URL and refreshes page
4. Persists across sessions

## 🔄 Adding a New Language

### Step 1: Add locale to configuration

```typescript
// i18n/request.ts
export const locales = ['en', 'es', 'fr'] as const; // Add 'fr'
```

### Step 2: Create translation file

```bash
# Create new translation file
touch messages/fr.json
```

### Step 3: Add translations

```json
// messages/fr.json
{
  "common": {
    "appName": "Explorateur de Conférences Tech",
    "loading": "Chargement...",
    ...
  },
  ...
}
```

### Step 4: Update language switcher

```tsx
// components/LanguageSwitcher.tsx
<select>
  <option value="en">🇺🇸 English</option>
  <option value="es">🇪🇸 Español</option>
  <option value="fr">🇫🇷 Français</option>
</select>
```

## 📝 Best Practices

### 1. Use Semantic Keys

❌ Bad:
```json
{
  "text1": "Click here",
  "label2": "Submit form"
}
```

✅ Good:
```json
{
  "button": {
    "clickHere": "Click here",
    "submitForm": "Submit form"
  }
}
```

### 2. Group Related Translations

```json
{
  "conference": {
    "register": "Register",
    "unregister": "Unregister",
    "viewDetails": "View Details"
  }
}
```

### 3. Use Interpolation for Dynamic Content

❌ Bad:
```json
{
  "welcome": "Welcome John!"  // Hard-coded name
}
```

✅ Good:
```json
{
  "welcome": "Welcome {name}!"
}
```

```tsx
t('welcome', { name: user.name })
```

### 4. Handle Pluralization

```json
{
  "attendees": "{count} attendee",
  "attendees_plural": "{count} attendees"
}
```

next-intl automatically selects the correct form based on count.

### 5. Keep Translations Consistent

- Use consistent terminology across all languages
- Maintain the same tone and formality level
- Preserve meaning, not just literal translation

## 🎯 Translation Coverage

Current implementation includes translations for:

### Pages
- ✅ Home page (conference listings)
- ✅ Conference detail page
- ✅ User dashboard
- ✅ Admin panel
- ✅ Error pages (404, 500)

### Components
- ✅ Navigation
- ✅ Footer
- ✅ Conference cards
- ✅ Filters
- ✅ Registration forms
- ✅ Admin forms
- ✅ Buttons and common UI elements

### Features
- ✅ Search and filtering
- ✅ Pagination
- ✅ Form validation
- ✅ Error messages
- ✅ Success messages
- ✅ Social sharing

## 🧪 Testing Translations

### Manual Testing

1. **Switch languages** using the language switcher
2. **Verify all strings** are translated correctly
3. **Check pluralization** with different counts
4. **Test interpolation** with various values
5. **Ensure layouts** don't break with longer text

### Automated Testing

```typescript
import { getTranslations } from 'next-intl/server';

describe('Translations', () => {
  it('should load English translations', async () => {
    const t = await getTranslations({ locale: 'en' });
    expect(t('home.title')).toBe('Discover Tech Conferences');
  });

  it('should load Spanish translations', async () => {
    const t = await getTranslations({ locale: 'es' });
    expect(t('home.title')).toBe('Descubre Conferencias Tecnológicas');
  });
});
```

## 🔍 Finding Missing Translations

If a translation key is missing, next-intl will:
1. Display the key path (e.g., "home.missingKey")
2. Log a warning in development mode
3. Allow graceful degradation

To find missing keys:

```bash
# Search for translation usage
grep -r "t(" app/ components/

# Compare with translation files
```

## 📦 Translation File Size

Current file sizes:
- `en.json`: ~2.5 KB (gzipped: ~800 bytes)
- `es.json`: ~2.7 KB (gzipped: ~850 bytes)

Files are automatically code-split and loaded only when needed.

## 🚀 Performance

next-intl optimizations:
- **Lazy loading**: Translations loaded on-demand
- **Tree shaking**: Unused translations excluded from bundle
- **Caching**: Translations cached after first load
- **Static generation**: Pre-rendered with correct locale

## 🔧 Troubleshooting

### Issue: Translations not showing

**Solution**: Check that:
1. Translation key exists in `messages/{locale}.json`
2. Component is wrapped in `NextIntlClientProvider`
3. Correct locale is being used

### Issue: Plural forms not working

**Solution**: Ensure keys end with `_plural`:
```json
{
  "item": "{count} item",
  "item_plural": "{count} items"
}
```

### Issue: Language switcher not working

**Solution**: Verify:
1. Middleware is configured correctly
2. Cookies are enabled
3. Router is properly set up

## 📚 Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [i18n Best Practices](https://www.i18next.com/principles/best-practices)
- [Unicode CLDR](http://cldr.unicode.org/) - Locale data standards

## 🎓 Example: Full Component Migration

### Before (Hard-coded strings)

```tsx
export function ConferenceCard({ conference }) {
  return (
    <div>
      <h3>{conference.name}</h3>
      <p>{conference.location}</p>
      <span>{conference.currentAttendees} / {conference.maxAttendees} attendees</span>
      <button>View Details</button>
      <button>Register Now</button>
    </div>
  );
}
```

### After (Internationalized)

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function ConferenceCard({ conference }) {
  const t = useTranslations('conference');

  return (
    <div>
      <h3>{conference.name}</h3>
      <p>{conference.location}</p>
      <span>
        {t('attendees', {
          current: conference.currentAttendees,
          max: conference.maxAttendees
        })}
      </span>
      <button>{t('viewDetails')}</button>
      <button>{t('register')}</button>
    </div>
  );
}
```

---

## 🤝 Contributing Translations

To contribute translations:

1. Fork the repository
2. Add translations to `messages/{locale}.json`
3. Test thoroughly
4. Submit a pull request

Quality guidelines:
- Native speaker review preferred
- Maintain consistent terminology
- Test with real users when possible
- Consider cultural context

---

Built with ❤️ using next-intl for React Server Components
