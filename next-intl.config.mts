import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales
export const locales = ['en', 'zh'];
export const defaultLocale = 'zh';

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is defined, fallback to defaultLocale
  const resolvedLocale = locale ?? defaultLocale;

  // Check if the requested locale is supported
  if (!locales.includes(resolvedLocale)) {
    notFound();
  }

  // Load messages for the requested locale
  const messages = (await import(`./app/messages/${resolvedLocale}.json`)).default;

  return {
    locale: resolvedLocale,
    messages
  };
});