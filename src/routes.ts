/**
 * Array of routes that are
 * accessible to the public
 * @type {string[]}
 */

export const publicRoutes = [
  '/',
  '/blog',
  '/blog/[slug]',
  '/contact',
  '/about',
];

/**
 * Array of routes that are
 * used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = ['/error', '/auth/register', '/auth/login'];

/**
 * Prefix for API routes
 * @type {string}
 */
export const apiPrefix = '/api';

/**
 * Default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';
