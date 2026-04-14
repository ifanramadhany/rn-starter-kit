import { storage } from '../../../utils/storage';

const TOKEN_KEY = 'auth_token';

export const authStorage = {
  setToken: (token: string) => {
    storage.set(TOKEN_KEY, token);
  },

  getToken: () => {
    return storage.getString(TOKEN_KEY) ?? null;
  },

  removeToken: () => {
    storage.delete(TOKEN_KEY);
  },
};
