import {getRequestConfig} from 'next-intl/server';
import { cookies } from "next/headers";

export async function getLocale(): Promise<string> {
  // Fetch the user's preferred language from cookies or default to 'en'
  const locale = (await cookies()).get('locale')?.value || 'en';
  return locale.includes('zh') ? 'zh' : 'en';
}

export function setLocale(locale: string): void {
  // Set the user's preferred language in cookies
  document.cookie = `locale=${locale};`;
}

export default getRequestConfig(async () => {
  // Ensure only 'zh' or 'en' is used
  const locale = await getLocale();
  return {
    locale,
    messages: (await import(`@/app/messages/${locale}.json`)).default
  };
});