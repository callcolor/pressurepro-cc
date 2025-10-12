import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _static (inside /public)
  // - _vercel (Vercel internals)
  // - images and other static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
