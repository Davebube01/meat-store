import { useAuthStore } from "@/core/store/useAuthStore";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const getAuthHeader = (): Record<string, string> => {
  const token = useAuthStore.getState().token;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const fetchClient = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const isServer = typeof window === 'undefined';
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(!isServer ? getAuthHeader() : {}),
  };

  const res = await fetch(url, { ...options, headers });
  
  if (!res.ok) {
    if (res.status === 401 && !isServer) {
      useAuthStore.getState().signOut();
    }
    const { handleApiResponseError } = await import("@/core/errors/errorHandler");
    await handleApiResponseError(res);
  }
  
  return res.json();
};
