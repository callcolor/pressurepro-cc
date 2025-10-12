'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('errors');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('pageNotFound')}</h2>
        <p className="text-gray-600 mb-6">{t('pageNotFoundMessage')}</p>
        <Link href="/">
          <Button fullWidth>{t('backToHome')}</Button>
        </Link>
      </div>
    </div>
  );
}
