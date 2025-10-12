'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { type Locale } from '@/i18n/locales';

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('languages');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: Locale) => {
    startTransition(() => {
      // Store locale preference
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

      // Use next-intl's router which handles locale switching automatically
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value as Locale)}
        disabled={isPending}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={t('switchLanguage')}
      >
        <option value="en">🇺🇸 {t('en')}</option>
        <option value="es">🇪🇸 {t('es')}</option>
      </select>
    </div>
  );
}
