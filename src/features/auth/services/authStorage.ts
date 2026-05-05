import * as Keychain from 'react-native-keychain';
import { KEYCHAIN_SERVICES, KEYCHAIN_USERNAMES } from '../constants/keychain';

export const authStorage = {
  setToken: (token: string) => {
    return Keychain.setGenericPassword(KEYCHAIN_USERNAMES.accessToken, token, {
      service: KEYCHAIN_SERVICES.accessToken,
    });
  },

  getToken: async () => {
    const credentials = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICES.accessToken,
    });

    return credentials ? credentials.password : null;
  },

  removeToken: () => {
    return Keychain.resetGenericPassword({
      service: KEYCHAIN_SERVICES.accessToken,
    });
  },
};
