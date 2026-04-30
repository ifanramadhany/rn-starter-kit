import * as Keychain from 'react-native-keychain';

const TOKEN_SERVICE = 'auth_token';
const TOKEN_USERNAME = 'access_token';

export const authStorage = {
  setToken: (token: string) => {
    return Keychain.setGenericPassword(TOKEN_USERNAME, token, {
      service: TOKEN_SERVICE,
    });
  },

  getToken: async () => {
    const credentials = await Keychain.getGenericPassword({
      service: TOKEN_SERVICE,
    });

    return credentials ? credentials.password : null;
  },

  removeToken: () => {
    return Keychain.resetGenericPassword({
      service: TOKEN_SERVICE,
    });
  },
};
