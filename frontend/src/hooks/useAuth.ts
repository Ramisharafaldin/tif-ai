import { useState, useCallback } from 'react';
import { storage } from '../utils/storage';

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(() => storage.getToken());

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    if (t) storage.setToken(t);
    else storage.clearToken();
  }, []);

  const login = useCallback((t: string) => setToken(t), [setToken]);
  const logout = useCallback(() => setToken(null), [setToken]);
  const isAdmin = useCallback(() => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin';
    } catch { return false; }
  }, [token]);

  return { token, setToken, login, logout, isAdmin: isAdmin() };
}
