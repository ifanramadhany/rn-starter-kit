import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  set: (key: string, value: string | boolean | number) => {
    return AsyncStorage.setItem(key, String(value));
  },

  getString: (key: string) => {
    return AsyncStorage.getItem(key);
  },

  delete: (key: string) => {
    return AsyncStorage.removeItem(key);
  },
};
