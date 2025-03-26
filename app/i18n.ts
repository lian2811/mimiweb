import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// 支援的語言列表
export const locales = ['en', 'zh'];
export const defaultLocale = 'zh';

export default getRequestConfig(async ({ locale }) => {
  // 確保 locale 有值，若無則使用預設語言
  const resolvedLocale = locale ?? defaultLocale;

  // 檢查請求的語言是否在支援列表中
  if (!locales.includes(resolvedLocale)) {
    notFound();
  }

  // 載入對應語言的翻譯檔案
  const messages = (await import(`./messages/${resolvedLocale}.json`)).default;

  return {
    locale: resolvedLocale,
    messages
  };
});