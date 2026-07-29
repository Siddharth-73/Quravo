"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_BASE_URL = void 0;
exports.apiFetch = apiFetch;
exports.API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
async function apiFetch(endpoint, options = {}) {
    const { tenantId, token, headers, ...customConfig } = options;
    const reqHeaders = {
        'Content-Type': 'application/json',
        ...headers,
    };
    if (tenantId) {
        reqHeaders['X-Tenant-ID'] = tenantId;
    }
    if (token) {
        reqHeaders['Authorization'] = `Bearer ${token}`;
    }
    const config = {
        method: options.body ? 'POST' : 'GET',
        credentials: 'include',
        ...customConfig,
        headers: reqHeaders,
    };
    const url = endpoint.startsWith('http') ? endpoint : `${exports.API_BASE_URL}${endpoint}`;
    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error ${response.status}`);
        }
        // Return JSON if body exists
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return (await response.json());
        }
        return {};
    }
    catch (error) {
        console.error(`API Fetch Error [${endpoint}]:`, error.message);
        throw error;
    }
}
