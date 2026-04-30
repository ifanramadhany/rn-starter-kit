import { MMKV } from 'react-native-mmkv';

interface StorageInterface {
  set(key: string, value: string | boolean | number): void;
  getString(key: string): string | undefined;
  delete(key: string): void;
}

class FallbackStorage implements StorageInterface {
  private data = new Map<string, string>();

  set(key: string, value: string | boolean | number) {
    this.data.set(key, String(value));
  }

  getString(key: string) {
    return this.data.get(key);
  }

  delete(key: string) {
    this.data.delete(key);
  }
}

function createStorage(): StorageInterface {
  try {
    return new MMKV({
      id: 'app-storage',
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('MMKV unavailable in DEV mode. Using fallback storage.', error);
      return new FallbackStorage();
    }

    throw new Error('MMKV storage is unavailable in production.');
  }
}

export const storage = createStorage();
