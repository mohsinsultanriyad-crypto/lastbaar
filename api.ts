// API client for backend communication
// Uses fetch, attaches token if present, and uses VITE_API_BASE_URL

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, url, data) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) })
  };
  const res = await fetch(`${API_BASE}${url}`, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, data) => request('POST', url, data),
  put: (url, data) => request('PUT', url, data),
  delete: (url) => request('DELETE', url),
};
