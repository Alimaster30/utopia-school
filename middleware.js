import { next, rewrite } from '@vercel/functions';
import routes from './public/query-routes.json' with { type: 'json' };

export const config = {
  matcher: ['/experience/:path*', '/get-inspired/:path*'],
};

// Resolve captured filters before Vercel's static-file cache serves the base page.
export default function middleware(request) {
  const url = new URL(request.url);
  if (!['GET', 'HEAD'].includes(request.method) || !url.searchParams.has('term')) return next();
  const query = new URLSearchParams([...url.searchParams.entries()].sort()).toString();
  const file = routes[url.pathname + '?' + query];
  return file ? rewrite(new URL('/' + file, url)) : next();
}
