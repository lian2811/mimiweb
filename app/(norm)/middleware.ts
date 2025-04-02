import createMiddleware from 'next-intl/middleware';
import {routing} from '../i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 创建国际化中间件
const intlMiddleware = createMiddleware(routing);

// 自定义中间件函数
export default function middleware(request: NextRequest) {
  // 排除 NextAuth API 路由，让它们正常工作
  const nextAuthPath = /^\/api\/auth\/(.*)$/;
  if (nextAuthPath.test(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  
  // 对其他路径应用国际化中间件
  const response = intlMiddleware(request);
  
  // 添加当前路径作为自定义header
  if (response) {
    response.headers.set('x-pathname', request.nextUrl.pathname);
  }
  
  return response;
}
 
export const config = {
  // 匹配除了特定路径外的所有路径
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)']
};
