// Base URL for REST API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://jarvis-web-production-fd24.up.railway.app/api";

// Base URL for WebSocket connections
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://jarvis-web-production-fd24.up.railway.app/api/voice/ws";

/**
 * Common headers for API requests
 */
export const getHeaders = (token?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Generic fetch wrapper for REST API
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Helper to establish WebSocket connection for voice streaming
 */
export function createVoiceWebSocket(apiKey: string): WebSocket {
  const wsUrl = `${WS_BASE_URL}?key=${encodeURIComponent(apiKey)}`;
  const ws = new WebSocket(wsUrl);
  return ws;
}
