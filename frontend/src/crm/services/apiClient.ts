/**
 * Retalyy API Client Helper
 * Supports Cloudflare Workers direct URL (via VITE_API_BASE_URL)
 * or relative URL for local Vite dev proxy and custom domain routes.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

