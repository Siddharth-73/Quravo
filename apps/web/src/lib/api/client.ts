export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface ApiFetchOptions extends RequestInit {
  tenantId?: string;
  token?: string;
}

export async function apiFetch<T>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const { tenantId, token, headers, ...customConfig } = options;

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (tenantId) {
    reqHeaders['X-Tenant-ID'] = tenantId;
  }

  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('quravo_access_token') : null;
  const authToken = token || storedToken;

  if (authToken) {
    reqHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const config: RequestInit = {
    method: options.body ? 'POST' : 'GET',
    credentials: 'include',
    ...customConfig,
    headers: reqHeaders,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    return {} as T;
  } catch (error: any) {
    console.error(`API Fetch Error [${endpoint}]:`, error.message);
    throw error;
  }
}
