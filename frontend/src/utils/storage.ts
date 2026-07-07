export const storage = {
  get: (key: string): string | null => window.localStorage.getItem(key),
  set: (key: string, value: string): void => window.localStorage.setItem(key, value),
  remove: (key: string): void => window.localStorage.removeItem(key),
  getToken: (): string | null => storage.get('admin_token'),
  setToken: (token: string): void => storage.set('admin_token', token),
  clearToken: (): void => storage.remove('admin_token'),
};
