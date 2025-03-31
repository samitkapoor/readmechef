import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import rateLimit from 'express-rate-limit';

// Security headers to add to all responses
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.github.com;"
};

// Create a rate limiter for API routes
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  // Get consistent key identifier
  keyGenerator: (req: any) => {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  }
});

// Map to keep track of response handlers for in-flight requests
const responseHandlers = new Map<string, (value: NextResponse) => void>();

// Type for mock response object
interface MockResponse {
  statusCode: number;
  headers: Record<string, string>;
  status: (statusCode: number) => MockResponse;
  setHeader: (name: string, value: string) => MockResponse;
  json: (body: any) => void;
}

interface MockRequest {
  headers: Record<string, string>;
  ip: string;
  path: string;
}

// Validate request method
function isValidMethod(method: string): boolean {
  const allowedMethods = ['GET', 'POST'];
  return allowedMethods.includes(method);
}

// Validate content type for POST/PUT/PATCH requests
function isValidContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  return (
    contentType.includes('application/json') ||
    contentType.includes('application/x-www-form-urlencoded')
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block requests from unknown origins (CORS protection)
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
    'https://www.readmechef.com',
    'https://readmechef.com'
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, { status: 403 });
  }

  // Validate request method
  if (!isValidMethod(request.method)) {
    return new NextResponse(null, { status: 405 });
  }

  // Validate content type for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type');
    if (!isValidContentType(contentType)) {
      return new NextResponse(null, { status: 415 });
    }
  }

  // Only apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    return new Promise<NextResponse>((resolve) => {
      const id = crypto.randomUUID();

      // Store the resolve function so we can call it once rate limiting is complete
      responseHandlers.set(id, resolve);

      // Create mock req/res objects that express-rate-limit can work with
      const mockReq: MockRequest = {
        headers: Object.fromEntries(request.headers.entries()),
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        path: pathname
      };

      const mockRes: MockResponse = {
        statusCode: 200,
        headers: {},
        status(statusCode: number) {
          this.statusCode = statusCode;
          return this;
        },
        setHeader(name: string, value: string) {
          this.headers[name] = value;
          return this;
        },
        json(body: any) {
          // If rate limit exceeded
          if (this.statusCode === 429) {
            const response = NextResponse.json(body, {
              status: 429,
              headers: {
                ...this.headers,
                ...securityHeaders
              }
            });

            const handler = responseHandlers.get(id);
            if (handler) {
              handler(response);
              responseHandlers.delete(id);
            }
          }
        }
      };

      // Apply express-rate-limit
      apiLimiter(mockReq, mockRes, () => {
        // Rate limit not exceeded, continue with the request
        const response = NextResponse.next();

        // Copy any rate limit headers to the response
        Object.entries(mockRes.headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });

        // Add security headers to all responses
        Object.entries(securityHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });

        const handler = responseHandlers.get(id);
        if (handler) {
          handler(response);
          responseHandlers.delete(id);
        }
      });
    });
  }

  // Continue with the request if not an API route
  const response = NextResponse.next();

  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Configure the matcher to only run the middleware on API routes
export const config = {
  matcher: '/api/:path*'
};
