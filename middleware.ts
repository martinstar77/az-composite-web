// NOTE: Next.js 16 deprecated "middleware" — rename this file to "proxy.ts" when ready
// See: https://nextjs.org/docs/messages/middleware-to-proxy
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - api routes
  // - _next internal paths
  // - static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)']
};
