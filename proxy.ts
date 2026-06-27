import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Simple in-memory cache for IP rate limiting
// Note: This cache is per-instance (Edge Node) and resets on container recycle.
// It is a lightweight, zero-cost safeguard for serverless execution.
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // max 5 submissions/min for contact form

// Blocklist for malicious scanner paths and extensions
const BLOCKED_PATTERNS = [
  /xmlrpc\.php/i,
  /wp-admin/i,
  /wp-login\.php/i,
  /wp-content/i,
  /\.php$/i,
  /\.env/i,
  /\.git/i,
  /cgi-bin/i,
  /etc\/passwd/i,
  /system\/config/i,
];

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const ip = (req as any).ip || req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || 'unknown';

  // 1. Scanner Blocking (WAF Edge Rule)
  const isMalicious = BLOCKED_PATTERNS.some((pattern) => pattern.test(pathname));
  if (isMalicious) {
    console.warn(`🛡️ Security Warning: Blocked malicious scan from IP: ${ip} on path: ${pathname}`);
    return new NextResponse('Bad Request', { status: 400 });
  }

  // 2. Rate Limiting for /api/contact
  if (pathname === '/api/contact' && req.method === 'POST') {
    const now = Date.now();
    const limitInfo = rateLimitCache.get(ip);

    if (!limitInfo || now > limitInfo.resetTime) {
      rateLimitCache.set(ip, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW_MS,
      });
    } else {
      limitInfo.count += 1;
      if (limitInfo.count > MAX_REQUESTS_PER_WINDOW) {
        console.warn(`🛡️ Security Warning: Rate limit exceeded for IP: ${ip} on /api/contact`);
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests. Please try again later.' }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((limitInfo.resetTime - now) / 1000).toString(),
            },
          }
        );
      }
    }
  }

  // 3. Skip locale routing for API endpoints
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 4. Run next-intl middleware for normal pages
  const response = await intlMiddleware(req);

  // 5. Inject Standard Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  // Match all paths except internal Next.js assets and standard media/static file extensions
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|map)).*)',
  ],
};
