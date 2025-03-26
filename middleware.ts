import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './app/i18n';
 
export default createMiddleware({
  // 設置支持的語言
  locales,
  // 默認語言
  defaultLocale,
  // 啟用語言檢測功能
  localeDetection: true
});
 
export const config = {
  // 匹配除了api、_next/static、_next/image、favicon.ico外的所有路徑
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)']
};