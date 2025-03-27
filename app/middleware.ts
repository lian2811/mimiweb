import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);
 
export const config = {
  // 匹配除了api、_next/static、_next/image、favicon.ico外的所有路徑
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)']
};
